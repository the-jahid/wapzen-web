"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  createCampaignLead,
  deleteCampaignLead,
  listCampaignLeads,
  updateCampaignLead,
  type CampaignLead,
  type CampaignLeadStatus,
  type CreateCampaignLeadPayload,
  type UpdateCampaignLeadPayload,
} from "@/lib/campaignLeads";

const statuses: CampaignLeadStatus[] = ["pending", "calling", "contacted", "failed", "opted_out"];
const statusLabels: Record<CampaignLeadStatus, string> = {
  pending: "Pending",
  calling: "Calling",
  contacted: "Contacted",
  failed: "Call unsuccessful",
  opted_out: "Opted out",
};

type ColumnKey = "created" | "name" | "email" | "attempts";
// CallNotice reports what happened to the call the new lead triggered: "placed"
// when the callee's phone is ringing, "skipped" when the lead was saved but not
// dialled. Neither is an error — the lead exists either way.
type CallNotice = { kind: "placed" | "skipped"; text: string };
// How often the table re-reads itself while a lead is mid-call.
const callingPollMs = 8000;

export default function CampaignLeadsWorkspace({ campaignId, onCallPlaced, onCountChange }: { campaignId: string; onCallPlaced?: () => void; onCountChange: (count: number) => void }) {
  const { getToken } = useAuth();
  const [leads, setLeads] = useState<CampaignLead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [callNotice, setCallNotice] = useState<CallNotice | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | CampaignLeadStatus>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState<Record<ColumnKey, boolean>>({ created: true, name: true, email: true, attempts: true });
  const [editing, setEditing] = useState<CampaignLead | null>(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const result = await listCampaignLeads(campaignId, getToken);
        if (cancelled) return;
        setLeads(result.items);
        setTotal(result.total);
        setSelectedIds(new Set());
        onCountChange(result.total);
        setLoading(false);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load campaign leads");
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [campaignId, getToken, onCountChange, reloadKey]);

  // A lead in "calling" is on a live call, and the call decides where it lands:
  // contacted when it is answered, failed when it is not. Refresh while any lead
  // is mid-call so the table settles on its own, and stop once none is.
  const hasCallingLead = useMemo(() => leads.some((lead) => lead.status === "calling"), [leads]);
  const onCallPlacedRef = useRef(onCallPlaced);
  useEffect(() => { onCallPlacedRef.current = onCallPlaced; }, [onCallPlaced]);
  useEffect(() => {
    if (!hasCallingLead) return;
    let cancelled = false;
    const timer = setInterval(async () => {
      try {
        const result = await listCampaignLeads(campaignId, getToken);
        if (cancelled) return;
        setLeads(result.items);
        // The campaign's counters moved with whatever the call did.
        onCallPlacedRef.current?.();
      } catch { /* a failed refresh is not worth an error banner; the next one retries */ }
    }, callingPollMs);
    return () => { cancelled = true; clearInterval(timer); };
  }, [campaignId, getToken, hasCallingLead]);

  const visibleLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter && lead.status !== statusFilter) return false;
      if (!query) return true;
      return [lead.phone_number, lead.first_name, lead.last_name, lead.email, statusLabels[lead.status]]
        .some((value) => value?.toLowerCase().includes(query));
    });
  }, [leads, search, statusFilter]);

  const allVisibleSelected = visibleLeads.length > 0 && visibleLeads.every((lead) => selectedIds.has(lead.lead_id));

  // Adding a lead also dials it: the request returns once the callee's phone is
  // ringing, so the lead lands in the table already "calling" and the notice
  // says which number is being rung. A campaign with nothing to dial from still
  // takes the lead — that is the "skipped" notice, not an error.
  async function addLead(payload: CreateCampaignLeadPayload) {
    const { call, callError, lead } = await createCampaignLead(campaignId, payload, getToken);
    const nextTotal = total + 1;
    setLeads((current) => [lead, ...current]);
    setTotal(nextTotal);
    onCountChange(nextTotal);
    setAdding(false);
    if (call) {
      setCallNotice({ kind: "placed", text: `Calling ${lead.phone_number} — the call is ringing.` });
      onCallPlaced?.();
    } else {
      setCallNotice({ kind: "skipped", text: callError || `${lead.phone_number} was added but not called.` });
    }
  }

  async function editLead(payload: UpdateCampaignLeadPayload) {
    if (!editing) return;
    const updated = await updateCampaignLead(campaignId, editing.lead_id, payload, getToken);
    setLeads((current) => current.map((lead) => lead.lead_id === updated.lead_id ? updated : lead));
    setEditing(null);
  }

  async function removeLead(lead: CampaignLead) {
    if (deletingId || !window.confirm(`Delete ${lead.phone_number} from this campaign?`)) return;
    setDeletingId(lead.lead_id);
    try {
      await deleteCampaignLead(campaignId, lead.lead_id, getToken);
      const nextTotal = Math.max(0, total - 1);
      setLeads((current) => current.filter((item) => item.lead_id !== lead.lead_id));
      setSelectedIds((current) => { const next = new Set(current); next.delete(lead.lead_id); return next; });
      setTotal(nextTotal);
      onCountChange(nextTotal);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete campaign lead");
    } finally {
      setDeletingId(null);
    }
  }

  function toggleLead(leadId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(leadId)) next.delete(leadId); else next.add(leadId);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      const next = new Set(current);
      visibleLeads.forEach((lead) => allVisibleSelected ? next.delete(lead.lead_id) : next.add(lead.lead_id));
      return next;
    });
  }

  function exportCSV() {
    const rows = [["Phone number", "Status", "Created", "First name", "Last name", "Email", "Attempts"], ...visibleLeads.map((lead) => [lead.phone_number, statusLabels[lead.status], lead.created_at, lead.first_name ?? "", lead.last_name ?? "", lead.email ?? "", String(lead.attempts)])];
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `campaign-${campaignId}-leads.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <section className="cl-workspace">
    <style dangerouslySetInnerHTML={{ __html: workspaceCSS }} />
    <div className="cl-toolbar">
      <div className="cl-toolbar-left">
        <label className="cl-search"><SearchIcon /><input aria-label="Search leads" onChange={(event) => setSearch(event.target.value)} placeholder="Search leads..." value={search} /></label>
        <select aria-label="Filter leads by status" className="cl-filter" onChange={(event) => setStatusFilter(event.target.value as "" | CampaignLeadStatus)} value={statusFilter}><option value="">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select>
        <details className="cl-columns"><summary>Customize columns <ChevronIcon /></summary><div className="cl-columns-menu">{(["created", "name", "email", "attempts"] as ColumnKey[]).map((column) => <label key={column}><input checked={columns[column]} onChange={() => setColumns((current) => ({ ...current, [column]: !current[column] }))} type="checkbox" /><span>{column[0].toUpperCase() + column.slice(1)}</span></label>)}</div></details>
      </div>
      <div className="cl-toolbar-right">
        <span className="cl-count">{visibleLeads.length === total ? `${total} lead${total === 1 ? "" : "s"}` : `${visibleLeads.length} of ${total}`}</span>
        <button aria-label="Refresh leads" className="cl-icon-button" disabled={loading} onClick={() => setReloadKey((key) => key + 1)} title="Refresh" type="button"><RefreshIcon /></button>
        <button aria-label="Download leads as CSV" className="cl-icon-button" disabled={visibleLeads.length === 0} onClick={exportCSV} title="Download CSV" type="button"><DownloadIcon /></button>
        <button className="cl-add-button" onClick={() => setAdding(true)} type="button"><PlusIcon />Add Lead</button>
      </div>
    </div>
    {callNotice ? <div className={`cl-call-notice cl-call-${callNotice.kind}`}><span>{callNotice.kind === "placed" ? "↗" : "•"}</span><p>{callNotice.text}</p><button aria-label="Dismiss" onClick={() => setCallNotice(null)} type="button">×</button></div> : null}
    {error ? <div className="cl-error">{error}</div> : null}
    {loading ? <div className="cl-empty">Loading leads…</div> : null}
    {!loading && leads.length === 0 ? <div className="cl-empty"><span className="cl-empty-icon"><PeopleIcon /></span><strong>Start adding leads</strong><span>Add your first contact to begin this outbound campaign.</span><button className="cl-add-button" onClick={() => setAdding(true)} type="button"><PlusIcon />Add Lead</button></div> : null}
    {!loading && leads.length > 0 && visibleLeads.length === 0 ? <div className="cl-empty"><strong>No matching leads</strong><span>Try a different search or status filter.</span></div> : null}
    {!loading && visibleLeads.length > 0 ? <div className="cl-table-wrap"><table className="cl-table"><thead><tr><th className="cl-row-number">#</th><th className="cl-check"><input aria-label="Select all visible leads" checked={allVisibleSelected} onChange={toggleAllVisible} type="checkbox" /></th><SortableHeader label="Phone Number" /><SortableHeader label="Status" />{columns.created ? <SortableHeader label="Created" /> : null}{columns.name ? <SortableHeader label="Name" /> : null}{columns.email ? <SortableHeader label="Email address" /> : null}{columns.attempts ? <SortableHeader label="Attempts" /> : null}<th aria-label="Actions" /></tr></thead><tbody>{visibleLeads.map((lead, index) => <tr className={selectedIds.has(lead.lead_id) ? "is-selected" : ""} key={lead.lead_id}><td className="cl-row-number">{index + 1}</td><td className="cl-check"><input aria-label={`Select ${lead.phone_number}`} checked={selectedIds.has(lead.lead_id)} onChange={() => toggleLead(lead.lead_id)} type="checkbox" /></td><td className="cl-phone">{lead.phone_number}</td><td><LeadStatus status={lead.status} /></td>{columns.created ? <td>{formatCreated(lead.created_at)}</td> : null}{columns.name ? <td>{leadName(lead)}</td> : null}{columns.email ? <td className="cl-email">{lead.email || "—"}</td> : null}{columns.attempts ? <td>{lead.attempts}</td> : null}<td><div className="cl-actions"><button onClick={() => setEditing(lead)} type="button">Edit</button><button className="danger" disabled={deletingId === lead.lead_id} onClick={() => removeLead(lead)} type="button">{deletingId === lead.lead_id ? "…" : "Delete"}</button></div></td></tr>)}</tbody></table></div> : null}
    {adding ? <LeadDrawer title="Add lead" onClose={() => setAdding(false)} onSubmit={(payload) => addLead(payload as CreateCampaignLeadPayload)} /> : null}
    {editing ? <LeadDrawer lead={editing} title="Edit lead" onClose={() => setEditing(null)} onSubmit={(payload) => editLead(payload as UpdateCampaignLeadPayload)} /> : null}
  </section>;
}

function LeadStatus({ status }: { status: CampaignLeadStatus }) {
  return <span className={`cl-status cl-${status}`}><span>{status === "contacted" ? "✓" : status === "failed" || status === "opted_out" ? "×" : status === "calling" ? "↗" : "•"}</span>{statusLabels[status]}</span>;
}

function SortableHeader({ label }: { label: string }) { return <th><span className="cl-sortable">{label}<span>↑↓</span></span></th>; }
function leadName(lead: CampaignLead) { return [lead.first_name, lead.last_name].filter(Boolean).join(" ") || "—"; }
function formatCreated(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "numeric", day: "numeric" }).format(date); }
function csvCell(value: string) { return `"${value.replaceAll('"', '""')}"`; }

function LeadDrawer({ lead, onClose, onSubmit, title }: { lead?: CampaignLead; onClose: () => void; onSubmit: (payload: UpdateCampaignLeadPayload | CreateCampaignLeadPayload) => Promise<void>; title: string }) {
  const [phone, setPhone] = useState(lead?.phone_number ?? "");
  const [email, setEmail] = useState(lead?.email ?? "");
  const [first, setFirst] = useState(lead?.first_name ?? "");
  const [last, setLast] = useState(lead?.last_name ?? "");
  const [status, setStatus] = useState<CampaignLeadStatus>(lead?.status ?? "pending");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedPhone = phone.trim();
    const normalizedEmail = email.trim();
    const normalizedFirst = first.trim();
    const normalizedLast = last.trim();
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) return setError("Use an E.164 phone number, for example +14155550123.");
    if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return setError("Enter a valid email address.");
    if (normalizedFirst.length > 80 || normalizedLast.length > 80) return setError("First and last names must be at most 80 characters.");
    const payload: UpdateCampaignLeadPayload = lead ? {} : { phone_number: normalizedPhone };
    if (!lead || normalizedPhone !== lead.phone_number) payload.phone_number = normalizedPhone;
    if (!lead || normalizedEmail !== (lead.email ?? "")) payload.email = normalizedEmail || null;
    if (!lead || normalizedFirst !== (lead.first_name ?? "")) payload.first_name = normalizedFirst || null;
    if (!lead || normalizedLast !== (lead.last_name ?? "")) payload.last_name = normalizedLast || null;
    if (lead && status !== lead.status) payload.status = status;
    if (lead && Object.keys(payload).length === 0) return setError("Nothing to update.");
    setSubmitting(true);
    setError("");
    try { await onSubmit(payload); } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Failed to save campaign lead"); setSubmitting(false); }
  }

  return <div className="cl-drawer-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation"><aside aria-modal="true" className="cl-drawer" role="dialog"><div className="cl-drawer-head"><div><h2>{title}</h2><p>{lead ? "Update this campaign contact." : "Add a contact and call it with this campaign's agent."}</p></div><button aria-label="Close lead drawer" onClick={onClose} type="button">×</button></div><form onSubmit={submit}><div className="cl-drawer-body"><label className="cl-field"><span>Phone number <small>Required · E.164</small></span><input autoFocus onChange={(event) => setPhone(event.target.value)} placeholder="+14155550123" value={phone} /></label><div className="cl-name-grid"><label className="cl-field"><span>First name <small>Optional</small></span><input maxLength={80} onChange={(event) => setFirst(event.target.value)} placeholder="Maya" value={first} /></label><label className="cl-field"><span>Last name <small>Optional</small></span><input maxLength={80} onChange={(event) => setLast(event.target.value)} placeholder="Chen" value={last} /></label></div><label className="cl-field"><span>Email address <small>Optional</small></span><input onChange={(event) => setEmail(event.target.value)} placeholder="maya@example.com" type="email" value={email} /></label>{lead ? <label className="cl-field"><span>Status</span><select onChange={(event) => setStatus(event.target.value as CampaignLeadStatus)} value={status}>{statuses.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></label> : <div className="cl-pending-note"><LeadStatus status="calling" /><p>Adding this lead calls it straight away with the campaign&rsquo;s agent.</p></div>}{error ? <div className="cl-form-error">{error}</div> : null}</div><div className="cl-drawer-actions"><button className="cl-cancel" disabled={submitting} onClick={onClose} type="button">Cancel</button><button className="cl-save" disabled={submitting} type="submit">{submitting ? (lead ? "Saving…" : "Calling…") : lead ? "Save changes" : "Add lead"}</button></div></form></aside></div>;
}

function SearchIcon() { return <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="15"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>; }
function ChevronIcon() { return <svg aria-hidden="true" fill="none" height="13" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="13"><path d="m7 10 5 5 5-5" /></svg>; }
function RefreshIcon() { return <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="16"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" /></svg>; }
function DownloadIcon() { return <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="16"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" /></svg>; }
function PlusIcon() { return <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="15"><path d="M12 5v14M5 12h14" /></svg>; }
function PeopleIcon() { return <svg aria-hidden="true" fill="none" height="24" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" width="24"><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a7 7 0 0 1 14 0v1m1-13a4 4 0 0 1 0 8m2 1a6 6 0 0 1 3 4" /></svg>; }

const workspaceCSS = `
.cl-workspace{background:var(--app-surface);border:1px solid var(--border);border-radius:16px;min-height:420px;overflow:hidden}.cl-toolbar{align-items:center;border-bottom:1px solid var(--border);display:flex;gap:14px;justify-content:space-between;padding:13px 14px}.cl-toolbar-left,.cl-toolbar-right{align-items:center;display:flex;gap:8px}.cl-search{align-items:center;background:var(--app-elevated);border:1px solid var(--app-line);border-radius:9px;color:var(--muted);display:flex;gap:7px;height:36px;padding:0 10px;width:min(260px,25vw)}.cl-search:focus-within{border-color:var(--app-primary);box-shadow:0 0 0 3px var(--app-primary-soft)}.cl-search input{background:transparent;border:0;color:var(--app-text);font:inherit;font-size:12px;min-width:0;outline:none;width:100%}.cl-search input::placeholder{color:var(--app-subtle)}.cl-filter,.cl-columns summary{background:var(--app-panel-hover);border:1px solid var(--app-line);border-radius:9px;color:var(--app-text-soft);font:inherit;font-size:11.5px;height:36px;outline:none;padding:0 10px}.cl-filter option{background:var(--app-elevated)}.cl-columns{position:relative}.cl-columns summary{align-items:center;cursor:pointer;display:flex;gap:6px;list-style:none}.cl-columns summary::-webkit-details-marker{display:none}.cl-columns-menu{background:var(--app-elevated);border:1px solid var(--app-line-strong);border-radius:11px;box-shadow:0 18px 45px var(--app-shadow-color);display:grid;gap:8px;left:0;min-width:175px;padding:11px;position:absolute;top:42px;z-index:8}.cl-columns-menu label{align-items:center;color:var(--app-text-soft);cursor:pointer;display:flex;font-size:11.5px;gap:8px}.cl-count{color:var(--faint);font-size:10.5px;white-space:nowrap}.cl-icon-button{align-items:center;background:var(--app-elevated);border:1px solid var(--app-line);border-radius:9px;color:var(--app-text-soft);cursor:pointer;display:flex;height:36px;justify-content:center;width:36px}.cl-icon-button:hover{background:var(--app-line-soft);color:var(--app-text-strong)}.cl-icon-button:disabled{cursor:not-allowed;opacity:.4}.cl-add-button{align-items:center;background:var(--app-invert-bg);border:0;border-radius:9px;color:var(--app-invert-text);cursor:pointer;display:inline-flex;font-size:11.5px;font-weight:800;gap:6px;height:36px;justify-content:center;padding:0 13px;white-space:nowrap}.cl-add-button:hover{background:var(--app-invert-bg-hover)}.cl-error{background:var(--app-rose-soft);border-bottom:1px solid var(--app-rose-border);color:var(--app-rose-text);font-size:12px;padding:10px 18px}.cl-call-notice{align-items:center;border-bottom:1px solid;display:flex;font-size:12px;gap:10px;padding:10px 14px}.cl-call-notice p{flex:1;margin:0}.cl-call-notice>span{align-items:center;border:1px solid currentColor;border-radius:50%;display:flex;flex-shrink:0;font-size:9px;height:16px;justify-content:center;width:16px}.cl-call-notice button{background:transparent;border:0;color:inherit;cursor:pointer;font-size:17px;line-height:1;opacity:.7;padding:0 2px}.cl-call-placed{background:var(--app-blue-soft);border-bottom-color:var(--app-blue-soft);color:var(--app-blue)}.cl-call-skipped{background:var(--app-amber-soft);border-bottom-color:var(--app-amber-border);color:var(--app-amber)}.cl-empty{align-items:center;color:var(--muted);display:flex;flex-direction:column;font-size:12px;gap:7px;justify-content:center;min-height:320px;padding:30px;text-align:center}.cl-empty strong{color:var(--app-text-strong);font-size:15px;margin-top:3px;text-transform:capitalize}.cl-empty>.cl-add-button{margin-top:8px}.cl-empty-icon{align-items:center;background:var(--app-primary-soft);border:1px solid var(--app-primary-ring);border-radius:14px;color:var(--app-primary-text);display:flex;height:50px;justify-content:center;width:50px}.cl-table-wrap{overflow:auto}.cl-table{border-collapse:collapse;min-width:920px;width:100%}.cl-table th{border-bottom:1px solid var(--border);color:var(--app-muted);font-size:10.5px;font-weight:650;padding:11px 10px;text-align:left;white-space:nowrap}.cl-table td{border-bottom:1px solid var(--app-line);color:var(--app-text-soft);font-size:11.5px;height:42px;padding:8px 10px;white-space:nowrap}.cl-table tbody tr:hover,.cl-table tbody tr.is-selected{background:var(--app-border-soft)}.cl-row-number{color:var(--app-muted)!important;text-align:center!important;width:36px}.cl-check{width:32px}.cl-check input,.cl-columns input{accent-color:var(--app-primary);height:15px;width:15px}.cl-sortable{align-items:center;display:flex;gap:7px}.cl-sortable>span{color:var(--app-subtle);font-size:9px}.cl-phone{color:var(--app-text)!important;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:800}.cl-email{max-width:230px;overflow:hidden;text-overflow:ellipsis}.cl-status{align-items:center;border-radius:999px;display:inline-flex;font-size:10px;font-weight:750;gap:5px;padding:4px 8px}.cl-status>span{align-items:center;border:1px solid currentColor;border-radius:50%;display:flex;font-size:8px;height:13px;justify-content:center;width:13px}.cl-pending{background:var(--app-amber-soft);color:var(--app-amber)}.cl-calling{background:var(--app-blue-soft);color:var(--app-blue)}.cl-contacted{background:var(--app-green-soft);color:var(--app-green)}.cl-failed{background:var(--app-pink-soft);color:var(--app-pink)}.cl-opted_out{background:var(--app-slate-soft);color:var(--app-slate)}.cl-actions{display:flex;gap:8px;justify-content:flex-end}.cl-actions button{background:transparent;border:0;color:var(--app-primary-text);cursor:pointer;font-size:10.5px;font-weight:750;padding:4px}.cl-actions button.danger{color:var(--app-rose)}.cl-actions button:disabled{cursor:not-allowed;opacity:.4}.cl-drawer-overlay{background:var(--app-overlay);inset:0;position:fixed;z-index:80}.cl-drawer{animation:cl-slide-in .2s ease-out;background:var(--app-surface);border-left:1px solid var(--app-line);box-shadow:-24px 0 70px var(--app-shadow-color);height:100%;position:absolute;right:0;top:0;width:min(450px,100vw)}.cl-drawer form{display:flex;flex-direction:column;height:calc(100% - 79px)}.cl-drawer-head{align-items:flex-start;border-bottom:1px solid var(--app-line);display:flex;justify-content:space-between;padding:20px 22px}.cl-drawer-head h2{color:var(--app-text-strong);font-size:18px;margin:0}.cl-drawer-head p{color:var(--app-muted);font-size:11.5px;margin:5px 0 0}.cl-drawer-head button{background:transparent;border:0;color:var(--app-muted);cursor:pointer;font-size:25px;line-height:1}.cl-drawer-body{display:grid;gap:18px;overflow-y:auto;padding:22px}.cl-field{display:grid;gap:8px}.cl-field>span{color:var(--app-text-soft);font-size:11.5px;font-weight:750}.cl-field small{color:var(--app-subtle);font-size:10px;font-weight:500;margin-left:5px}.cl-field input,.cl-field select{background:var(--app-sidebar);border:1px solid var(--app-line);border-radius:10px;color:var(--app-text);font:inherit;font-size:12.5px;height:43px;outline:none;padding:0 12px;width:100%}.cl-field input:focus,.cl-field select:focus{border-color:var(--app-primary);box-shadow:0 0 0 3px var(--app-primary-soft)}.cl-field select option{background:var(--app-surface)}.cl-name-grid{display:grid;gap:12px;grid-template-columns:1fr 1fr}.cl-pending-note{align-items:center;background:var(--app-elevated);border:1px solid var(--app-line);border-radius:11px;display:flex;gap:10px;padding:11px}.cl-pending-note p{color:var(--app-muted);font-size:10.5px;margin:0}.cl-form-error{background:var(--app-rose-soft);border:1px solid var(--app-rose-border);border-radius:9px;color:var(--app-rose-text);font-size:11.5px;padding:10px 11px}.cl-drawer-actions{border-top:1px solid var(--app-line);display:flex;gap:9px;justify-content:flex-end;margin-top:auto;padding:15px 22px}.cl-drawer-actions button{border-radius:9px;cursor:pointer;font-size:12px;font-weight:800;height:39px;padding:0 15px}.cl-cancel{background:var(--app-panel-hover);border:1px solid var(--app-line);color:var(--app-text-soft)}.cl-save{background:linear-gradient(140deg,var(--app-primary-2),var(--app-primary));border:0;color:var(--app-on-accent)}.cl-drawer-actions button:disabled{cursor:not-allowed;opacity:.45}@keyframes cl-slide-in{from{transform:translateX(35px);opacity:.4}to{transform:translateX(0);opacity:1}}@media(max-width:900px){.cl-toolbar{align-items:stretch;flex-direction:column}.cl-toolbar-left,.cl-toolbar-right{flex-wrap:wrap}.cl-search{flex:1;width:auto}.cl-toolbar-right{justify-content:flex-end}}@media(max-width:560px){.cl-toolbar-left{align-items:stretch;display:grid;grid-template-columns:1fr 1fr}.cl-search{grid-column:1/-1}.cl-toolbar-right{justify-content:space-between}.cl-count{display:none}.cl-name-grid{grid-template-columns:1fr}.cl-drawer{width:100%}}
`;
