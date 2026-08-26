"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getCall, type ApiCall, type ApiCallMessage } from "@/lib/calls";
import { listCampaignCalls } from "@/lib/campaignLeads";

// The campaign's own call history: the calls this campaign placed, which is
// every call started by adding a lead to it. A call that is still ringing or
// still talking has not finished changing, so the list refreshes itself while
// any of them is live rather than making the user press Refresh to watch a call
// progress.
const livePollMs = 8000;
const liveStatuses = new Set(["received", "answered"]);

const statusLabels: Record<string, string> = {
  received: "Ringing",
  answered: "In progress",
  ended: "Completed",
  declined: "Declined",
  failed: "Failed",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export default function CampaignCallsWorkspace({ campaignId, onProgress }: { campaignId: string; onProgress?: () => void }) {
  const { getToken } = useAuth();
  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<ApiCall | null>(null);

  const load = useCallback(async () => listCampaignCalls(campaignId, getToken), [campaignId, getToken]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const result = await load();
        if (cancelled) return;
        setCalls(result.items);
        setLoading(false);
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load campaign calls");
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [load, reloadKey]);

  // Only poll while something is actually moving, and stop as soon as every call
  // has reached a final state — a finished campaign should not keep the tab
  // talking to the server. The ref keeps the poll comparing against the latest
  // calls without making the timer restart every time they change.
  const hasLiveCall = useMemo(() => calls.some((call) => liveStatuses.has(call.status)), [calls]);
  const callsRef = useRef<ApiCall[]>([]);
  useEffect(() => { callsRef.current = calls; }, [calls]);
  useEffect(() => {
    if (!hasLiveCall) return;
    let cancelled = false;
    const timer = setInterval(async () => {
      try {
        const result = await load();
        if (cancelled) return;
        // A status that changed is also campaign progress: the counters the
        // Overview tab shows moved with it.
        const changed = result.items.some((call) => callsRef.current.find((item) => item.id === call.id)?.status !== call.status);
        setCalls(result.items);
        if (changed) onProgress?.();
      } catch { /* a failed poll is not worth an error banner; the next one retries */ }
    }, livePollMs);
    return () => { cancelled = true; clearInterval(timer); };
  }, [hasLiveCall, load, onProgress]);

  const visibleCalls = useMemo(() => {
    const query = search.trim().toLowerCase();
    return calls.filter((call) => {
      if (statusFilter && call.status !== statusFilter) return false;
      if (!query) return true;
      return [peerLabel(call), call.call_id, statusText(call.status), call.end_reason ?? ""].some((value) => value?.toLowerCase().includes(query));
    });
  }, [calls, search, statusFilter]);

  const answered = calls.filter((call) => call.answered_at).length;

  return <section className="cc-workspace">
    <style dangerouslySetInnerHTML={{ __html: workspaceCSS }} />
    <div className="cc-toolbar">
      <div className="cc-toolbar-left">
        <label className="cc-search"><SearchIcon /><input aria-label="Search campaign calls" onChange={(event) => setSearch(event.target.value)} placeholder="Search calls..." value={search} /></label>
        <select aria-label="Filter calls by status" className="cc-filter" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option value="">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      </div>
      <div className="cc-toolbar-right">
        <span className="cc-count">{calls.length === 0 ? "No calls" : `${calls.length} call${calls.length === 1 ? "" : "s"} · ${answered} answered`}</span>
        {hasLiveCall ? <span className="cc-live"><span />Live</span> : null}
        <button aria-label="Refresh calls" className="cc-icon-button" disabled={loading} onClick={() => setReloadKey((key) => key + 1)} title="Refresh" type="button"><RefreshIcon /></button>
      </div>
    </div>
    {error ? <div className="cc-error">{error}</div> : null}
    {loading && calls.length === 0 ? <div className="cc-empty">Loading calls…</div> : null}
    {!loading && calls.length === 0 ? <div className="cc-empty"><span className="cc-empty-icon"><PhoneIcon /></span><strong>No campaign calls yet</strong><span>Add a lead in the Leads tab — this campaign calls it right away, and the call appears here.</span></div> : null}
    {!loading && calls.length > 0 && visibleCalls.length === 0 ? <div className="cc-empty"><strong>No matching calls</strong><span>Try a different search or status filter.</span></div> : null}
    {visibleCalls.length > 0 ? <div className="cc-table-wrap"><table className="cc-table"><thead><tr><th className="cc-row-number">#</th><th>To</th><th>Status</th><th>Started</th><th>Duration</th><th>Outcome</th><th aria-label="Actions" /></tr></thead><tbody>{visibleCalls.map((call, index) => <tr key={call.id}><td className="cc-row-number">{index + 1}</td><td className="cc-phone">{peerLabel(call)}</td><td><CallStatusChip status={call.status} /></td><td>{formatDate(call.created_at)}</td><td>{formatDuration(call.duration_seconds)}</td><td className="cc-reason">{call.end_reason || (call.answered_at ? "Answered" : "—")}</td><td><div className="cc-actions"><button onClick={() => setSelected(call)} type="button">Transcript</button></div></td></tr>)}</tbody></table></div> : null}
    {selected ? <CallDetailDrawer call={selected} onClose={() => setSelected(null)} /> : null}
  </section>;
}

// CallDetailDrawer loads the call again on open: the list response carries no
// transcript, which is only served by the single-call endpoint.
function CallDetailDrawer({ call, onClose }: { call: ApiCall; onClose: () => void }) {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<ApiCallMessage[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const full = await getCall(call.id, getToken);
        if (!cancelled) setMessages(full.messages ?? []);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Failed to load the transcript");
      }
    })();
    return () => { cancelled = true; };
  }, [call.id, getToken]);

  return <div className="cc-drawer-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation"><aside aria-modal="true" className="cc-drawer" role="dialog">
    <div className="cc-drawer-head"><div><h2>{peerLabel(call)}</h2><p>{statusText(call.status)} · {formatDate(call.created_at)}</p></div><button aria-label="Close call details" onClick={onClose} type="button">×</button></div>
    <div className="cc-drawer-body">
      <div className="cc-meta-grid"><MetaTile label="Duration" value={formatDuration(call.duration_seconds)} /><MetaTile label="Answered" value={formatDate(call.answered_at)} /><MetaTile label="Ended" value={formatDate(call.ended_at)} /><MetaTile label="Outcome" value={call.end_reason || (call.answered_at ? "Answered" : "—")} /></div>
      <h3>Transcript</h3>
      {error ? <div className="cc-error">{error}</div> : null}
      {!error && messages === null ? <p className="cc-drawer-note">Loading transcript…</p> : null}
      {messages !== null && messages.length === 0 ? <p className="cc-drawer-note">No transcript was saved for this call. A call that was never answered has nothing to transcribe.</p> : null}
      {messages?.map((message, index) => <div className={`cc-turn cc-turn-${message.role === "assistant" ? "agent" : "user"}`} key={index}><span>{message.role === "assistant" ? "Agent" : "Lead"}</span><p>{message.content}</p></div>)}
    </div>
  </aside></div>;
}

function MetaTile({ label, value }: { label: string; value: string }) { return <div className="cc-meta-tile"><span>{label}</span><strong>{value}</strong></div>; }
function CallStatusChip({ status }: { status: string }) { return <span className={`cc-status cc-${status}`}><span />{statusText(status)}</span>; }
function statusText(status: string) { return statusLabels[status] ?? status ?? "Unknown"; }

// Peers arrive as WhatsApp JIDs: "15557654321@s.whatsapp.net" for a known phone
// number, or "…@lid" when the number was never disclosed. Show the phone number
// in dialable form and the LID verbatim, so the two are never confused.
function peerLabel(call: ApiCall) {
  const raw = call.peer?.trim();
  if (!raw) return "Unknown number";
  const [user, server] = raw.split("@");
  if (!user) return raw;
  return server === "s.whatsapp.net" ? `+${user}` : user;
}

function formatDate(value: string | null | undefined) { if (!value) return "—"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date); }
function formatDuration(seconds: number | null | undefined) { if (seconds == null) return "—"; if (seconds < 60) return `${seconds}s`; return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`; }

function SearchIcon() { return <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="15"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>; }
function RefreshIcon() { return <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="16"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" /></svg>; }
function PhoneIcon() { return <svg aria-hidden="true" fill="none" height="24" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" width="24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>; }

const workspaceCSS = `
.cc-workspace{background:var(--app-surface);border:1px solid var(--border);border-radius:16px;min-height:420px;overflow:hidden}.cc-toolbar{align-items:center;border-bottom:1px solid var(--border);display:flex;gap:14px;justify-content:space-between;padding:13px 14px}.cc-toolbar-left,.cc-toolbar-right{align-items:center;display:flex;gap:8px}.cc-search{align-items:center;background:var(--app-elevated);border:1px solid var(--app-line);border-radius:9px;color:var(--muted);display:flex;gap:7px;height:36px;padding:0 10px;width:min(260px,25vw)}.cc-search:focus-within{border-color:var(--app-primary);box-shadow:0 0 0 3px var(--app-primary-soft)}.cc-search input{background:transparent;border:0;color:var(--app-text);font:inherit;font-size:12px;min-width:0;outline:none;width:100%}.cc-search input::placeholder{color:var(--app-subtle)}.cc-filter{background:var(--app-panel-hover);border:1px solid var(--app-line);border-radius:9px;color:var(--app-text-soft);font:inherit;font-size:11.5px;height:36px;outline:none;padding:0 10px}.cc-filter option{background:var(--app-elevated)}.cc-count{color:var(--faint);font-size:10.5px;white-space:nowrap}.cc-live{align-items:center;background:var(--app-green-soft);border-radius:999px;color:var(--app-green);display:inline-flex;font-size:10px;font-weight:800;gap:5px;padding:4px 9px}.cc-live>span{animation:cc-pulse 1.4s ease-in-out infinite;background:currentColor;border-radius:50%;height:6px;width:6px}@keyframes cc-pulse{0%,100%{opacity:1}50%{opacity:.25}}.cc-icon-button{align-items:center;background:var(--app-elevated);border:1px solid var(--app-line);border-radius:9px;color:var(--app-text-soft);cursor:pointer;display:flex;height:36px;justify-content:center;width:36px}.cc-icon-button:hover{background:var(--app-line-soft);color:var(--app-text-strong)}.cc-icon-button:disabled{cursor:not-allowed;opacity:.4}.cc-error{background:var(--app-rose-soft);border-bottom:1px solid var(--app-rose-border);border-radius:9px;color:var(--app-rose-text);font-size:12px;padding:10px 14px}.cc-empty{align-items:center;color:var(--muted);display:flex;flex-direction:column;font-size:12px;gap:7px;justify-content:center;min-height:320px;padding:30px;text-align:center}.cc-empty strong{color:var(--app-text-strong);font-size:15px;margin-top:3px}.cc-empty>span:last-child{max-width:420px}.cc-empty-icon{align-items:center;background:var(--app-primary-soft);border:1px solid var(--app-primary-ring);border-radius:14px;color:var(--app-primary-text);display:flex;height:50px;justify-content:center;width:50px}.cc-table-wrap{overflow:auto}.cc-table{border-collapse:collapse;min-width:820px;width:100%}.cc-table th{border-bottom:1px solid var(--border);color:var(--app-muted);font-size:10.5px;font-weight:650;padding:11px 10px;text-align:left;white-space:nowrap}.cc-table td{border-bottom:1px solid var(--app-line);color:var(--app-text-soft);font-size:11.5px;height:42px;padding:8px 10px;white-space:nowrap}.cc-table tbody tr:hover{background:var(--app-border-soft)}.cc-row-number{color:var(--app-muted)!important;text-align:center!important;width:36px}.cc-phone{color:var(--app-text)!important;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:800}.cc-reason{color:var(--app-muted)!important;max-width:240px;overflow:hidden;text-overflow:ellipsis}.cc-status{align-items:center;border-radius:999px;display:inline-flex;font-size:10px;font-weight:750;gap:6px;padding:4px 9px}.cc-status>span{background:currentColor;border-radius:50%;height:5px;width:5px}.cc-received{background:var(--app-blue-soft);color:var(--app-blue)}.cc-answered{background:var(--app-green-soft);color:var(--app-green)}.cc-ended{background:var(--app-slate-soft);color:var(--app-slate)}.cc-declined{background:var(--app-amber-soft);color:var(--app-amber)}.cc-failed{background:var(--app-pink-soft);color:var(--app-pink)}.cc-actions{display:flex;gap:8px;justify-content:flex-end}.cc-actions button{background:transparent;border:0;color:var(--app-primary-text);cursor:pointer;font-size:10.5px;font-weight:750;padding:4px}.cc-drawer-overlay{background:var(--app-overlay);inset:0;position:fixed;z-index:80}.cc-drawer{animation:cc-slide-in .2s ease-out;background:var(--app-surface);border-left:1px solid var(--app-line);box-shadow:-24px 0 70px var(--app-shadow-color);display:flex;flex-direction:column;height:100%;position:absolute;right:0;top:0;width:min(480px,100vw)}.cc-drawer-head{align-items:flex-start;border-bottom:1px solid var(--app-line);display:flex;justify-content:space-between;padding:20px 22px}.cc-drawer-head h2{color:var(--app-text-strong);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:17px;margin:0}.cc-drawer-head p{color:var(--app-muted);font-size:11.5px;margin:5px 0 0}.cc-drawer-head button{background:transparent;border:0;color:var(--app-muted);cursor:pointer;font-size:25px;line-height:1}.cc-drawer-body{display:grid;gap:14px;overflow-y:auto;padding:20px 22px 28px}.cc-drawer-body h3{color:var(--app-text-soft);font-size:12.5px;margin:6px 0 0}.cc-drawer-note{color:var(--app-muted);font-size:11.5px;line-height:1.6;margin:0}.cc-meta-grid{display:grid;gap:1px;grid-template-columns:repeat(2,minmax(0,1fr));overflow:hidden}.cc-meta-tile{background:var(--app-surface-2);display:grid;gap:5px;padding:12px}.cc-meta-tile span{color:var(--app-muted);font-size:10.5px}.cc-meta-tile strong{font-size:12.5px;overflow-wrap:anywhere}.cc-turn{background:var(--app-surface-2);border-left:2px solid var(--app-line-strong);border-radius:0 10px 10px 0;display:grid;gap:5px;padding:10px 12px}.cc-turn span{font-size:9.5px;font-weight:800;letter-spacing:.6px;text-transform:uppercase}.cc-turn p{color:var(--app-text-soft);font-size:12px;line-height:1.6;margin:0}.cc-turn-agent{border-left-color:var(--app-primary-2)}.cc-turn-agent span{color:var(--app-primary-text)}.cc-turn-user{border-left-color:var(--app-green)}.cc-turn-user span{color:var(--app-green-text)}@keyframes cc-slide-in{from{transform:translateX(35px);opacity:.4}to{transform:translateX(0);opacity:1}}@media(max-width:900px){.cc-toolbar{align-items:stretch;flex-direction:column}.cc-toolbar-left,.cc-toolbar-right{flex-wrap:wrap}.cc-search{flex:1;width:auto}.cc-toolbar-right{justify-content:flex-end}}@media(max-width:560px){.cc-count{display:none}.cc-drawer{width:100%}.cc-meta-grid{grid-template-columns:1fr}}
`;
