"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { createPortal, flushSync } from "react-dom";
import { useAuth } from "@clerk/nextjs";
import { Pause, PhoneOff, Play, RefreshCw, Search, Trash2, Upload, UserPlus, X } from "lucide-react";
import ConversationPager from "@/components/conversations/ConversationPager";
import { listCalls, type ApiCall } from "@/lib/calls";
import {
  BROADCAST_CONTACTS_PAGE_SIZE,
  createBroadcastContact,
  deleteBroadcastContact,
  generateCallSummary,
  getVoiceCall,
  hangupVoiceCall,
  importBroadcastContacts,
  updateBroadcast,
  type ApiBroadcast,
  type ApiBroadcastContact,
  type BroadcastContactInput,
  type BroadcastContactPage,
  type BroadcastContactSort,
  type BroadcastImportResult,
} from "@/lib/voiceAgents";

// A broadcast's contacts, stored, searched, sorted and paged (10 at a time) on
// the Go server. A contact needs a phone
// number; everything else is optional. Every contact added (one by one or by
// CSV import) is queued, and the server's auto-dialer calls them one after
// another from the broadcast agent's WhatsApp number; while calls
// are waiting (or paused) a bar above the table shows progress and pauses /
// resumes it. There is no manual call button; a
// call in progress can be hung up. Clicking a contact (or its number) opens a
// side panel with the calls placed to that contact from here, with their
// summaries and transcripts.

type GetToken = ReturnType<typeof useAuth>["getToken"];

export type BroadcastCallAgent = {
  id: string;
  name: string;
  phoneNumberId: string | null;
};

type SortKey = BroadcastContactSort;

const SORT_OPTIONS: { key: SortKey; desc: boolean; label: string }[] = [
  { key: "created", desc: true, label: "Newest first" },
  { key: "created", desc: false, label: "Oldest first" },
  { key: "name", desc: false, label: "Name A–Z" },
  { key: "name", desc: true, label: "Name Z–A" },
  { key: "first", desc: false, label: "First name A–Z" },
  { key: "first", desc: true, label: "First name Z–A" },
  { key: "last", desc: false, label: "Last name A–Z" },
  { key: "last", desc: true, label: "Last name Z–A" },
];
const AVATAR_HUES = [330, 35, 260, 60, 290, 210, 180, 55, 140, 300, 220, 95];
const LIVE_STATUSES = new Set(["placing", "received", "answered"]);
const STATUS_LABEL: Record<string, string> = {
  placing: "Calling…",
  received: "Ringing…",
  answered: "On call",
  ended: "Call ended",
  declined: "Declined",
  failed: "Call failed",
};

// The auto-dialer's view of a contact (broadcast_contacts.call_status).
const CONTACT_STATUS: Record<string, string> = {
  idle: "Not queued",
  queued: "Queued",
  calling: "Calling…",
  answered: "Answered",
  no_answer: "No answer",
  failed: "Failed",
};

function errorText(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function fullName(contact: ApiBroadcastContact): string {
  return [contact.first_name, contact.last_name].filter(Boolean).join(" ");
}

function initials(contact: ApiBroadcastContact): string {
  const letters = `${contact.first_name?.[0] ?? ""}${contact.last_name?.[0] ?? ""}`;
  return (letters || "#").toUpperCase();
}

function hueFor(id: string): number {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_HUES[hash % AVATAR_HUES.length];
}

// "23 Nov, 2026", the format the table was designed with.
function formatCreated(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.getDate()} ${date.toLocaleString("en", { month: "short" })}, ${date.getFullYear()}`;
}

// Mirrors the server's NormalizePhoneNumber closely enough to catch typos
// before the request; the server has the final say.
function phoneDigits(raw: string): string {
  let s = raw.trim().replace(/[\s\-.() ]/g, "");
  if (s.startsWith("+")) s = s.slice(1);
  else if (s.startsWith("00")) s = s.slice(2);
  return s;
}

function isValidPhone(raw: string): boolean {
  return /^[1-9]\d{7,14}$/.test(phoneDigits(raw));
}

export default function BroadcastContacts({ broadcast, actionsSlot, agent, barSlot, contacts, getToken, loadError, onSearch, onBroadcastUpdated, onPage, onSearchChange, onSortChange, page, pageBusy, refreshContacts, search, sort }: {
  broadcast: ApiBroadcast;
  // Phones: the header element the Import, Add and search buttons go in.
  actionsSlot?: HTMLElement | null;
  agent: BroadcastCallAgent | null;
  // Where to render search and sort: undefined = above the list, an element =
  // in there (the phone Config sidebar), null = that sidebar is closed.
  barSlot?: HTMLElement | null;
  contacts: BroadcastContactPage | null;
  getToken: GetToken;
  loadError: string;
  // Enter in the search box: show the results, so the sidebar can close.
  onSearch?: () => void;
  onBroadcastUpdated: (updated: ApiBroadcast) => void;
  onPage: (page: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: { key: SortKey; desc: boolean }) => void;
  page: number;
  // A different page or search is on its way; the rows shown are the old ones.
  pageBusy: boolean;
  refreshContacts: () => void;
  search: string;
  sort: { key: SortKey; desc: boolean };
}) {
  const broadcastId = broadcast.id;
  const query = search.trim();
  const rows = contacts?.contacts ?? [];
  const stats = contacts?.stats;
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  // Phones: the header's search button, expanded over Import and Add.
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchToggleRef = useRef<HTMLButtonElement>(null);
  const openSearch = () => {
    // Focused within the tap, so phones bring up the keyboard.
    flushSync(() => setSearchOpen(true));
    searchInputRef.current?.focus();
  };
  const closeSearch = () => {
    if (search) onSearchChange("");
    flushSync(() => setSearchOpen(false));
    searchToggleRef.current?.focus();
  };
  // Per-row actions that failed.
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  // Kept as a copy too, so paging or searching does not close the panel.
  const [openContact, setOpenContact] = useState<ApiBroadcastContact | null>(null);
  const [pauseBusy, setPauseBusy] = useState(false);
  const [pauseError, setPauseError] = useState("");
  const panelContact = openContact ? rows.find((item) => item.id === openContact.id) ?? openContact : null;
  const rootRef = useRef<HTMLDivElement>(null);
  const goToPage = (next: number) => {
    onPage(next);
    // Start the new page from its first row.
    rootRef.current?.scrollIntoView({ block: "start" });
  };

  const setRowError = (contactId: string, message: string) => setRowErrors((current) => {
    const next = { ...current };
    if (message) next[contactId] = message;
    else delete next[contactId];
    return next;
  });

  const callBlockedReason = !agent ? "Select a voice agent for this broadcast first."
    : !agent.phoneNumberId ? `${agent.name} has no WhatsApp number linked. Link one in WhatsApp Voice Agents to call.`
    : "";

  const hangup = async (contact: ApiBroadcastContact) => {
    if (!contact.last_call_id) return;
    try {
      await hangupVoiceCall(contact.last_call_id, getToken);
      setRowError(contact.id, "");
      refreshContacts();
    } catch (error) {
      setRowError(contact.id, errorText(error, "Could not hang up."));
    }
  };

  const remove = async (contactId: string) => {
    setDeletingId(contactId);
    try {
      await deleteBroadcastContact(broadcastId, contactId, getToken);
      setOpenContact((current) => current?.id === contactId ? null : current);
      refreshContacts();
    } catch (error) {
      setRowError(contactId, errorText(error, "Could not delete the contact."));
    } finally {
      setDeletingId("");
      setConfirmDeleteId("");
    }
  };

  const setPaused = async (paused: boolean) => {
    setPauseBusy(true);
    setPauseError("");
    try {
      onBroadcastUpdated(await updateBroadcast(broadcastId, { paused }, getToken));
    } catch (error) {
      setPauseError(errorText(error, paused ? "Could not pause." : "Could not resume."));
    } finally {
      setPauseBusy(false);
    }
  };

  // Newest first is where an added contact shows, so go there.
  const handleAdded = useCallback(() => {
    setAddOpen(false);
    if (page === 1) refreshContacts();
    else onPage(1);
  }, [onPage, page, refreshContacts]);

  // Dialer progress over the contacts that were queued at some point.
  const dialTotal = stats ? stats.total - stats.idle : 0;
  const dialDone = stats ? stats.answered + stats.no_answer + stats.failed : 0;
  const dialActive = stats ? stats.queued + stats.calling > 0 : false;

  const sortHeader = (key: SortKey, label: string) => (
    <th aria-sort={sort.key === key ? (sort.desc ? "descending" : "ascending") : undefined} role="columnheader" scope="col">
      <button className="bcd-sort-btn" onClick={() => onSortChange({ key, desc: sort.key === key ? !sort.desc : key === "created" })} type="button">
        {label} <span className={`bcd-sort${sort.key === key ? " is-active" : ""}`}>{sort.key === key && !sort.desc ? "▴" : "▾"}</span>
      </button>
    </th>
  );

  const barActions = <div className={`bcd-bar-right${searchOpen && barSlot !== undefined ? " is-searching" : ""}`}>
    <button className="bcd-btn" onClick={() => setImportOpen(true)} title="Import contacts from a CSV file" type="button">
      <Upload aria-hidden="true" size={14} />
      Import
    </button>
    <button className="bcd-btn bcd-btn-primary" onClick={() => setAddOpen(true)} type="button">Add new contact</button>
    {barSlot === undefined ? null : <>
      <button aria-expanded={searchOpen} aria-label="Search contacts" className={`bcd-btn bcd-search-toggle${query ? " is-active" : ""}`} onClick={openSearch} ref={searchToggleRef} title="Search contacts" type="button"><Search aria-hidden="true" size={16} /></button>
      {searchOpen ? <div className="bcd-search bcd-search-expand" role="search">
        <Search aria-hidden="true" size={16} />
        <input
          aria-label="Search contacts"
          enterKeyHint="search"
          maxLength={200}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            // Enter puts the keyboard away to show the results.
            if (event.key === "Enter") event.currentTarget.blur();
            else if (event.key === "Escape") closeSearch();
          }}
          placeholder="Search contact"
          ref={searchInputRef}
          value={search}
        />
        <button aria-label="Close search" className="bcd-icon" onClick={closeSearch} type="button"><X aria-hidden="true" size={16} /></button>
      </div> : null}
    </>}
  </div>;
  const bar = <div className="bcd-bar">
    <div className="bcd-bar-left">
      <h3 className="bcd-heading">Contacts ({(stats?.total ?? 0).toLocaleString()})</h3>
    </div>
    <label className="bcd-search">
      <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="14"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <input aria-label="Search contact" enterKeyHint="search" maxLength={200} onChange={(event) => onSearchChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onSearch?.(); }} placeholder="Search contact" value={search} />
    </label>
    <select
      aria-label="Sort contacts"
      className="bcd-sort-menu"
      onChange={(event) => onSortChange(SORT_OPTIONS[event.currentTarget.selectedIndex])}
      value={SORT_OPTIONS.findIndex((option) => option.key === sort.key && option.desc === sort.desc)}
    >
      {SORT_OPTIONS.map((option, index) => <option key={option.label} value={index}>{option.label}</option>)}
    </select>
    {barSlot === undefined ? barActions : null}
  </div>;

  return <div className="bcd" ref={rootRef}>
    <style dangerouslySetInnerHTML={{ __html: css }} />
    {barSlot === undefined ? bar : <>
      {actionsSlot ? createPortal(barActions, actionsSlot) : null}
      {barSlot ? createPortal(bar, barSlot) : null}
    </>}

    {barSlot !== undefined && query ? <p className="bcd-filter">
      <span>{pageBusy ? "Searching…" : `${contacts?.total ?? 0} of ${stats?.total ?? 0} match “${query}”`}</span>
      <button className="bcd-btn" onClick={() => onSearchChange("")} type="button"><X aria-hidden="true" size={14} />Clear</button>
    </p> : null}

    {stats && dialTotal > 0 && (dialActive || broadcast.paused) ? <div className={`bcd-dialer${broadcast.paused ? " is-paused" : ""}`} role="status">
      <div className="bcd-dialer-text">
        <span className="bcd-dialer-title">
          {broadcast.paused ? "Auto-calling paused"
            : stats.calling_name ? `Calling ${stats.calling_name}…` : callBlockedReason ? "Auto-calling is waiting" : "Auto-calling: next call starting…"}
        </span>
        <span className="bcd-muted">
          {dialDone} of {dialTotal} called
          {stats.answered ? ` · ${stats.answered} answered` : ""}
          {stats.no_answer ? ` · ${stats.no_answer} no answer` : ""}
          {stats.failed ? ` · ${stats.failed} failed` : ""}
          {stats.queued ? ` · ${stats.queued} waiting` : ""}
        </span>
        {broadcast.paused && broadcast.paused_reason ? <span className="bcd-dialer-reason">{broadcast.paused_reason}</span> : null}
        {pauseError ? <span className="bcd-error">{pauseError}</span> : null}
      </div>
      <div aria-hidden="true" className="bcd-progress"><span style={{ width: `${dialTotal ? Math.round((dialDone / dialTotal) * 100) : 0}%` }} /></div>
      <button className="bcd-btn" disabled={pauseBusy} onClick={() => void setPaused(!broadcast.paused)} type="button">
        {broadcast.paused ? <><Play aria-hidden="true" size={14} />{pauseBusy ? "Resuming…" : "Resume"}</> : <><Pause aria-hidden="true" size={14} />{pauseBusy ? "Pausing…" : "Pause"}</>}
      </button>
    </div> : null}

    {callBlockedReason && stats?.total ? <p className="bcd-notice" role="status">{callBlockedReason}</p> : null}

    <div aria-busy={pageBusy} className={`bcd-table-wrap${pageBusy ? " is-busy" : ""}`}>
      <table aria-label="Broadcast contacts" className="bcd-table" role="table">
        <thead role="rowgroup">
          <tr role="row">
            {sortHeader("name", "Profile name")}
            {sortHeader("first", "First name")}
            {sortHeader("last", "Last name")}
            <th role="columnheader" scope="col">Contact info</th>
            {sortHeader("created", "Creation date")}
            <th className="bcd-status-col" role="columnheader" scope="col">Status</th>
            <th className="bcd-actions-col" role="columnheader" scope="col"><span className="bcd-sr">Actions</span></th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {loadError ? <tr role="row"><td className="bcd-none bcd-error" colSpan={7} role="cell">{loadError}</td></tr>
            : contacts === null ? <tr role="row"><td className="bcd-none" colSpan={7} role="cell">Loading contacts…</td></tr>
            : contacts.stats.total === 0 ? <tr role="row"><td className="bcd-none" colSpan={7} role="cell">
              <span className="bcd-empty">
                <span>No contacts yet. Add the first person this broadcast should call.</span>
                <button className="bcd-btn bcd-btn-primary" onClick={() => setAddOpen(true)} type="button"><UserPlus aria-hidden="true" size={14} />Add new contact</button>
              </span>
            </td></tr>
            : rows.length === 0 ? <tr role="row"><td className="bcd-none" colSpan={7} role="cell">{pageBusy || !query ? "Loading contacts…" : `No contacts match “${query}”.`}</td></tr>
            : rows.map((contact) => {
              const hue = hueFor(contact.id);
              const name = fullName(contact);
              const live = contact.call_status === "calling";
              const rowError = rowErrors[contact.id];
              return <tr
                className={`bcd-row${name ? "" : " is-unnamed"}${openContact?.id === contact.id ? " is-open" : ""}`}
                key={contact.id}
                role="row"
                onClick={(event) => {
                  // Buttons in the row (hang up, delete) act on their own.
                  if ((event.target as HTMLElement).closest("button")) return;
                  setOpenContact(contact);
                }}
              >
                <td className="bcd-profile-col" role="cell">
                  <div className="bcd-profile">
                    <span className="bcd-avatar" style={{ background: `hsl(${hue} 70% 80%)`, color: `hsl(${hue} 45% 25%)` }}>{initials(contact)}</span>
                    <span className="bcd-two">
                      <span className="bcd-strong">{name || contact.phone_number}</span>
                      {contact.email ? <span className="bcd-muted">{contact.email}</span> : null}
                    </span>
                  </div>
                </td>
                <td className="bcd-name-col" role="cell">{contact.first_name || <span className="bcd-muted">—</span>}</td>
                <td className="bcd-name-col" role="cell">{contact.last_name || <span className="bcd-muted">—</span>}</td>
                <td className="bcd-info-col" role="cell">
                  <span className="bcd-two">
                    <span>
                      <button className="bcd-number" onClick={() => setOpenContact(contact)} title="Show calls and transcripts" type="button">{contact.phone_number}</button>
                    </span>
                    {contact.address ? <span className="bcd-muted">{contact.address}</span> : null}
                  </span>
                </td>
                <td className="bcd-date-col" role="cell"><time dateTime={contact.created_at}>{formatCreated(contact.created_at)}</time></td>
                <td className="bcd-status-col" role="cell">
                  <span className={`bcd-contact-status is-${contact.call_status}`} title={contact.last_error ?? undefined}>
                    {CONTACT_STATUS[contact.call_status] ?? contact.call_status}
                  </span>
                  {rowError ? <span className="bcd-row-error" title={rowError}>{rowError}</span>
                    : contact.call_status === "failed" && contact.last_error ? <span className="bcd-row-error" title={contact.last_error}>{contact.last_error}</span>
                    : null}
                </td>
                <td className="bcd-actions-col" role="cell">
                  <div className="bcd-row-actions">
                    {live && contact.last_call_id ? (
                      <button className="bcd-btn bcd-btn-danger" onClick={() => void hangup(contact)} type="button"><PhoneOff aria-hidden="true" size={14} />Hang up</button>
                    ) : null}
                    {confirmDeleteId === contact.id ? (
                      <span className="bcd-confirm">
                        <button className="bcd-btn bcd-btn-danger" disabled={deletingId === contact.id} onClick={() => void remove(contact.id)} type="button">{deletingId === contact.id ? "Deleting…" : "Delete"}</button>
                        <button aria-label="Keep contact" className="bcd-icon" disabled={deletingId === contact.id} onClick={() => setConfirmDeleteId("")} type="button"><X aria-hidden="true" size={14} /></button>
                      </span>
                    ) : (
                      <button aria-label={`Delete ${name || contact.phone_number}`} className="bcd-icon" disabled={live} onClick={() => setConfirmDeleteId(contact.id)} title="Delete contact" type="button"><Trash2 aria-hidden="true" size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>;
            })}
        </tbody>
      </table>
    </div>
    {contacts && contacts.total > 0 && !loadError ? <div className="bcd-pager">
      <ConversationPager busy={pageBusy} label="Contact pages" onPage={goToPage} page={page} pageSize={BROADCAST_CONTACTS_PAGE_SIZE} total={contacts.total} totalPages={contacts.totalPages} />
    </div> : null}
    {panelContact ? <ContactCallsPanel
      callKey={`${panelContact.call_status}:${panelContact.last_call_id ?? ""}`}
      callLive={panelContact.call_status === "calling"}
      contact={panelContact}
      getToken={getToken}
      key={panelContact.id}
      onClose={() => setOpenContact(null)}
    /> : null}
    {addOpen ? <AddContactDialog broadcastId={broadcastId} getToken={getToken} onAdded={handleAdded} onClose={() => setAddOpen(false)} /> : null}
    {importOpen ? <ImportContactsDialog broadcastId={broadcastId} getToken={getToken} onClose={() => setImportOpen(false)} onImported={page === 1 ? refreshContacts : () => onPage(1)} paused={broadcast.paused} /> : null}
  </div>;
}

function formatDuration(seconds?: number | null): string {
  if (!seconds || seconds < 1) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m ? `${m}m ${s}s` : `${s}s`;
}

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// The calls placed to one broadcast contact from this page (calls linked by
// broadcast_contact_id), newest first, with the chosen call's summary and
// transcript. Calls to the same number from anywhere else are left out.
function ContactCallsPanel({ contact, callKey, callLive, getToken, onClose }: {
  contact: ApiBroadcastContact;
  // Changes whenever the contact's dialer state or latest call changes.
  callKey: string;
  callLive: boolean;
  getToken: GetToken;
  onClose: () => void;
}) {
  const topCallId = useRef("");
  const [callsList, setCallsList] = useState<ApiCall[] | null>(null);
  const [error, setError] = useState("");
  const [openCallId, setOpenCallId] = useState("");
  const [full, setFull] = useState<Record<string, ApiCall>>({});
  const [reloadKey, setReloadKey] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Focus once on open; Escape closes (unless a dialog is open on top).
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector("dialog[open]")) onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reload when opened, on Refresh, and whenever the row's live call changes
  // state; once it is over, look again shortly after, because the transcript
  // is saved as the call winds down.
  useEffect(() => {
    let cancelled = false;
    const load = () => listCalls(getToken, { broadcastContactId: contact.id, limit: 100 })
      .then((mine) => {
        if (cancelled) return;
        setCallsList(mine);
        setError("");
        setFull({});
        // A new call takes the selection;
        // otherwise keep the call the user is reading.
        const newest = mine[0]?.id ?? "";
        const newCall = newest !== topCallId.current;
        topCallId.current = newest;
        setOpenCallId((current) => !newCall && current && mine.some((call) => call.id === current) ? current : newest);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorText(err, "Could not load calls."));
        setCallsList((current) => current ?? []);
      });
    void load();
    const timer = callLive ? undefined : setTimeout(() => void load(), 2500);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [callKey, callLive, contact.id, getToken, reloadKey]);

  useEffect(() => {
    if (!openCallId || full[openCallId]) return;
    let cancelled = false;
    getVoiceCall(openCallId, getToken)
      .then((call) => {
        if (!cancelled) setFull((current) => ({ ...current, [openCallId]: call }));
      })
      .catch(() => {
        if (!cancelled) setFull((current) => ({ ...current, [openCallId]: { ...(callsList?.find((c) => c.id === openCallId) as ApiCall), messages: [] } }));
      });
    return () => {
      cancelled = true;
    };
  }, [callsList, full, getToken, openCallId]);

  // Summaries: the server writes one a few seconds after a call ends. A call
  // that ended moments ago is re-read until it appears; an older call with a
  // transcript but no summary gets one written on demand.
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [summaryJobs, setSummaryJobs] = useState<Record<string, { status: "loading" | "error"; error?: string }>>({});
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const writeSummary = useCallback(async (callId: string) => {
    setSummaryJobs((current) => ({ ...current, [callId]: { status: "loading" } }));
    try {
      const { summary } = await generateCallSummary(callId, getToken);
      if (!mounted.current) return;
      setSummaries((current) => ({ ...current, [callId]: summary }));
      setSummaryJobs((current) => {
        const next = { ...current };
        delete next[callId];
        return next;
      });
    } catch (err) {
      if (mounted.current) setSummaryJobs((current) => ({ ...current, [callId]: { status: "error", error: errorText(err, "Could not write the summary.") } }));
    }
  }, [getToken]);

  const name = fullName(contact);
  const hue = hueFor(contact.id);
  const open = openCallId ? full[openCallId] : undefined;
  const openSummary = callsList?.find((call) => call.id === openCallId);
  const messages = open?.messages ?? [];
  const summaryText = (openCallId && summaries[openCallId]) || open?.summary || "";
  const summaryJob = openCallId ? summaryJobs[openCallId] : undefined;
  const needsSummary = Boolean(open && openSummary && !summaryText && !summaryJob && (open.messages ?? []).length > 0 && !LIVE_STATUSES.has(openSummary.status));

  useEffect(() => {
    if (!needsSummary || !open) return;
    const callId = open.id;
    const endedAt = open.ended_at ? Date.parse(open.ended_at) : 0;
    const justEnded = Date.now() - endedAt < 30000;
    setSummaryJobs((current) => ({ ...current, [callId]: { status: "loading" } }));
    void (async () => {
      if (justEnded) {
        // Give the server's automatic summary a chance before writing another.
        for (let attempt = 0; attempt < 6; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          if (!mounted.current) return;
          const fresh = await getVoiceCall(callId, getToken).catch(() => null);
          if (fresh?.summary) {
            setSummaries((current) => ({ ...current, [callId]: fresh.summary as string }));
            setSummaryJobs((current) => {
              const next = { ...current };
              delete next[callId];
              return next;
            });
            return;
          }
        }
      }
      if (mounted.current) await writeSummary(callId);
    })();
  }, [getToken, needsSummary, open, writeSummary]);

  // Rendered on the page shell: inside the size container, browsers with layout
  // containment would pin the fixed panel to the container, not the screen.
  return createPortal(<>
  <div aria-hidden="true" className="bcd-panel-scrim" onClick={onClose} />
  <aside aria-label={`Calls with ${name || contact.phone_number}`} className="bcd-panel app-accent-green">
    <header className="bcd-panel-head">
      <span className="bcd-avatar" style={{ background: `hsl(${hue} 70% 80%)`, color: `hsl(${hue} 45% 25%)` }}>{initials(contact)}</span>
      <span className="bcd-two bcd-panel-who">
        <span className="bcd-strong">{name || contact.phone_number}</span>
        <span className="bcd-muted">{contact.phone_number}</span>
      </span>
      <button aria-label="Refresh calls" className="bcd-icon" onClick={() => setReloadKey((key) => key + 1)} title="Refresh" type="button"><RefreshCw aria-hidden="true" size={14} /></button>
      <button aria-label="Close panel" className="bcd-icon" onClick={onClose} ref={closeRef} type="button"><X aria-hidden="true" size={16} /></button>
    </header>

    <div className="bcd-panel-body">
      <section aria-label="Calls" className="bcd-panel-list">
      <div className="bcd-panel-info">
        {contact.email ? <span>{contact.email}</span> : null}
        {contact.address ? <span>{contact.address}</span> : null}
        <span>Added {formatCreated(contact.created_at)}</span>
      </div>
      <h4 className="bcd-panel-label">Calls{callsList ? ` (${callsList.length})` : ""}</h4>
      {callsList === null ? <p className="bcd-panel-note">Loading calls…</p>
        : error ? <p className="bcd-panel-note bcd-error">{error}</p>
        : callsList.length === 0 ? <p className="bcd-panel-note">No calls to this contact from this broadcast yet.</p>
        : <ul className="bcd-panel-calls">
          {callsList.map((call) => (
            <li key={call.id}>
              <button aria-pressed={call.id === openCallId} className={`bcd-panel-call${call.id === openCallId ? " is-active" : ""}`} onClick={() => setOpenCallId(call.id)} type="button">
                <span className="bcd-panel-call-main">
                  <span>{formatWhen(call.created_at)}</span>
                  <span className="bcd-muted">
                    {call.call_type === "inbound" ? "Inbound" : "Outbound"}
                    {formatDuration(call.duration_seconds) ? ` · ${formatDuration(call.duration_seconds)}` : ""}
                  </span>
                </span>
                <span className={`bcd-call-status is-${call.status}`}>{STATUS_LABEL[call.status] ?? call.status}</span>
              </button>
            </li>
          ))}
        </ul>}
      </section>

      <section aria-label="Call details" className="bcd-panel-detail">
      {openSummary ? <>
        <h4 className="bcd-panel-label">Summary</h4>
        <div className="bcd-summary">
          {LIVE_STATUSES.has(openSummary.status) ? <p className="bcd-panel-note">The summary is written when the call ends.</p>
            : !open ? <p className="bcd-panel-note">Loading…</p>
            : summaryText ? <>
              <p className="bcd-summary-text">{summaryText}</p>
              <button className="bcd-summary-redo" disabled={summaryJob?.status === "loading"} onClick={() => void writeSummary(openCallId)} type="button">
                <RefreshCw aria-hidden="true" size={12} />{summaryJob?.status === "loading" ? "Rewriting…" : "Regenerate"}
              </button>
            </>
            : messages.length === 0 ? <p className="bcd-panel-note">No summary: nothing was said on this call.</p>
            : summaryJob?.status === "error" ? <p className="bcd-panel-note bcd-error">
              {summaryJob.error}{" "}
              <button className="bcd-summary-redo" onClick={() => void writeSummary(openCallId)} type="button">Try again</button>
            </p>
            : <p className="bcd-panel-note bcd-summary-pending"><span aria-hidden="true" className="bcd-spinner" />Writing summary with Gemini…</p>}
        </div>
        <h4 className="bcd-panel-label">Transcript</h4>
        {!open ? <p className="bcd-panel-note">Loading transcript…</p>
          : messages.length === 0 ? <p className="bcd-panel-note">
            {LIVE_STATUSES.has(openSummary.status) ? "The call is still going. The transcript appears when it ends." : "No transcript for this call."}
            {openSummary.end_reason ? <span className="bcd-panel-reason">Ended: {openSummary.end_reason}</span> : null}
          </p>
          : <div className="bcd-transcript">
            {messages.map((message, index) => {
              const fromAgent = message.role === "assistant" || message.role === "agent";
              return <div className={`bcd-line ${fromAgent ? "is-agent" : "is-user"}`} key={index}>
                <span className="bcd-line-role">{fromAgent ? "Agent" : name || "Contact"}</span>
                <span className="bcd-line-text">{message.content}</span>
              </div>;
            })}
          </div>}
      </> : callsList?.length ? <p className="bcd-panel-note">Select a call to see its summary and transcript.</p> : null}
      </section>
    </div>
  </aside>
  </>, document.querySelector(".bc-shell") ?? document.body);
}

function AddContactDialog({ broadcastId, getToken, onAdded, onClose }: {
  broadcastId: string;
  getToken: GetToken;
  onAdded: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ phone: "", first: "", last: "", email: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    phoneRef.current?.focus();
    return () => dialog?.close();
  }, []);

  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;
    if (!form.phone.trim()) return setError("Phone number is required.");
    if (!isValidPhone(form.phone)) return setError("Enter the number with its country code, e.g. +8801712345678.");
    setSaving(true);
    setError("");
    try {
      await createBroadcastContact(broadcastId, {
        phone_number: `+${phoneDigits(form.phone)}`,
        first_name: form.first.trim() || undefined,
        last_name: form.last.trim() || undefined,
        email: form.email.trim() || undefined,
        address: form.address.trim() || undefined,
      }, getToken);
      onAdded();
    } catch (err) {
      setError(errorText(err, "Could not add the contact."));
      setSaving(false);
    }
  };

  const field = (id: string, label: string, key: keyof typeof form, props: InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="bc-dialog-field">
      <label htmlFor={id}>{label}</label>
      <input className="bc-input" id={id} onChange={(event) => set(key)(event.target.value)} value={form[key]} {...props} />
    </div>
  );

  return <dialog
    aria-labelledby="bcd-add-title"
    className="bc-dialog"
    onCancel={(event) => {
      event.preventDefault();
      if (!saving) onClose();
    }}
    onClick={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}
    ref={dialogRef}
  >
    <form noValidate onSubmit={submit}>
      <header className="bc-dialog-header">
        <div className="bc-dialog-icon"><UserPlus aria-hidden="true" size={20} /></div>
        <button aria-label="Close dialog" className="bc-icon-btn bc-dialog-close" disabled={saving} onClick={onClose} type="button">
          <X aria-hidden="true" size={18} />
        </button>
        <h2 className="bc-dialog-title" id="bcd-add-title">Add new contact</h2>
        <p>The broadcast&rsquo;s voice agent calls this number on WhatsApp automatically, after anyone already waiting.</p>
      </header>
      <div className="bc-dialog-fields">
        <div className="bc-dialog-field">
          <label htmlFor="bcd-phone">Phone number <span aria-hidden="true" className="bcd-required">*</span></label>
          <input aria-required="true" autoComplete="tel" className="bc-input" id="bcd-phone" inputMode="tel" maxLength={24} onChange={(event) => set("phone")(event.target.value)} placeholder="+8801712345678" ref={phoneRef} value={form.phone} />
          <p className="bc-hint">Include the country code.</p>
        </div>
        <div className="bcd-field-row">
          {field("bcd-first", "First name", "first", { autoComplete: "given-name", maxLength: 80 })}
          {field("bcd-last", "Last name", "last", { autoComplete: "family-name", maxLength: 80 })}
        </div>
        {field("bcd-email", "Email", "email", { autoComplete: "email", inputMode: "email", maxLength: 200, type: "email" })}
        {field("bcd-address", "Address", "address", { autoComplete: "street-address", maxLength: 300 })}
        {error ? <p className="bc-error bc-form-error" role="alert">{error}</p> : null}
      </div>
      <footer className="bc-actions">
        <button className="bc-secondary" disabled={saving} onClick={onClose} type="button">Cancel</button>
        <button className="bc-primary" disabled={saving} type="submit">{saving ? "Adding…" : "Add contact"}</button>
      </footer>
    </form>
  </dialog>;
}

// parseCsv reads RFC 4180 CSV: quoted fields may hold commas, newlines and
// doubled quotes. A semicolon or tab separator is used instead of a comma
// when the first line has more of those (Excel in many locales).
function parseCsv(text: string): string[][] {
  const clean = text.replace(/^﻿/, "");
  const firstLine = clean.split(/\r?\n/, 1)[0] ?? "";
  const count = (ch: string) => firstLine.split(ch).length - 1;
  const sep = [",", ";", "\t"].reduce((best, ch) => (count(ch) > count(best) ? ch : best), ",");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (quoted) {
      if (ch === '"' && clean[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"' && field === "") quoted = true;
    else if (ch === sep) { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && clean[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

type CsvField = "phone" | "first" | "last" | "name" | "email" | "address";

// Header names recognised for each field (lower-cased, spaces/underscores/
// dashes removed before matching).
const CSV_HEADERS: Record<CsvField, string[]> = {
  phone: ["phone", "phonenumber", "number", "mobile", "mobilenumber", "whatsapp", "whatsappnumber", "tel", "telephone", "contact", "contactnumber", "cell"],
  first: ["firstname", "first", "givenname", "fname"],
  last: ["lastname", "last", "surname", "familyname", "lname"],
  name: ["name", "fullname", "contactname"],
  email: ["email", "emailaddress", "mail"],
  address: ["address", "streetaddress", "location", "city"],
};

function mapCsvColumns(header: string[]): Partial<Record<CsvField, number>> {
  const keys = header.map((cell) => cell.trim().toLowerCase().replace(/[\s_\-.]/g, ""));
  const out: Partial<Record<CsvField, number>> = {};
  (Object.keys(CSV_HEADERS) as CsvField[]).forEach((field) => {
    const index = keys.findIndex((key) => CSV_HEADERS[field].includes(key));
    if (index >= 0) out[field] = index;
  });
  return out;
}

// csvToContacts turns parsed rows into contacts. With a recognised header the
// columns are taken by name; without one, the first column holding a phone
// number is used and the rest is ignored.
function csvToContacts(rows: string[][]): { contacts: BroadcastContactInput[]; mapped: Partial<Record<CsvField, number>>; hasHeader: boolean } {
  if (!rows.length) return { contacts: [], mapped: {}, hasHeader: false };
  const mapped = mapCsvColumns(rows[0]);
  const hasHeader = mapped.phone !== undefined;
  let columns = mapped;
  let body = rows;
  if (hasHeader) body = rows.slice(1);
  else {
    const phoneCol = rows[0].findIndex((cell) => isValidPhone(cell));
    columns = { phone: phoneCol >= 0 ? phoneCol : 0 };
  }
  const cell = (row: string[], field: CsvField) => {
    const index = columns[field];
    return index === undefined ? "" : (row[index] ?? "").trim();
  };
  const contacts = body.map((row) => {
    let first = cell(row, "first");
    let last = cell(row, "last");
    const name = cell(row, "name");
    if (!first && !last && name) {
      const parts = name.split(/\s+/);
      first = parts[0] ?? "";
      last = parts.slice(1).join(" ");
    }
    const contact: BroadcastContactInput = { phone_number: cell(row, "phone") };
    if (first) contact.first_name = first.slice(0, 80);
    if (last) contact.last_name = last.slice(0, 80);
    const email = cell(row, "email");
    if (email) contact.email = email.slice(0, 200);
    const address = cell(row, "address");
    if (address) contact.address = address.slice(0, 300);
    return contact;
  });
  return { contacts, mapped: columns, hasHeader };
}

const IMPORT_MAX = 5000;

function ImportContactsDialog({ broadcastId, getToken, onClose, onImported, paused }: {
  broadcastId: string;
  getToken: GetToken;
  onClose: () => void;
  onImported: () => void;
  paused: boolean;
}) {
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ReturnType<typeof csvToContacts> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<BroadcastImportResult | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  const readFile = async (file: File | undefined) => {
    setError("");
    setParsed(null);
    setResult(null);
    if (!file) return;
    setFileName(file.name);
    if (file.size > 5 * 1024 * 1024) return setError("That file is over 5 MB. Split it into smaller files.");
    try {
      const out = csvToContacts(parseCsv(await file.text()));
      if (!out.contacts.length) return setError("No rows found in that file.");
      if (out.contacts.length > IMPORT_MAX) return setError(`That file has ${out.contacts.length.toLocaleString()} rows; import at most ${IMPORT_MAX.toLocaleString()} at a time.`);
      setParsed(out);
    } catch {
      setError("Could not read that file. Save it as CSV and try again.");
    }
  };

  const validCount = parsed?.contacts.filter((contact) => isValidPhone(contact.phone_number)).length ?? 0;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!parsed || saving) return;
    setSaving(true);
    setError("");
    try {
      const out = await importBroadcastContacts(broadcastId, parsed.contacts, getToken);
      setResult(out);
      onImported();
    } catch (err) {
      setError(errorText(err, "Could not import the contacts."));
    } finally {
      setSaving(false);
    }
  };

  const columnNote = parsed ? (parsed.hasHeader
    ? `Columns found: ${(["phone", "first", "last", "name", "email", "address"] as CsvField[]).filter((field) => parsed.mapped[field] !== undefined).map((field) => ({ phone: "phone", first: "first name", last: "last name", name: "name", email: "email", address: "address" })[field]).join(", ")}.`
    : "No header row recognised, so only the phone numbers are imported.") : "";

  return <dialog
    aria-labelledby="bcd-import-title"
    className="bc-dialog"
    onCancel={(event) => {
      event.preventDefault();
      if (!saving) onClose();
    }}
    onClick={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}
    ref={dialogRef}
  >
    <form onSubmit={submit}>
      <header className="bc-dialog-header">
        <div className="bc-dialog-icon"><Upload aria-hidden="true" size={20} /></div>
        <button aria-label="Close dialog" className="bc-icon-btn bc-dialog-close" disabled={saving} onClick={onClose} type="button">
          <X aria-hidden="true" size={18} />
        </button>
        <h2 className="bc-dialog-title" id="bcd-import-title">Import contacts</h2>
        <p>Upload a CSV file. Every number is queued and called one after another{paused ? " once you resume auto-calling" : ""}.</p>
      </header>
      <div className="bc-dialog-fields">
        {result ? <div className="bcd-import-result" role="status">
          <p className="bcd-strong">{result.added.toLocaleString()} contact{result.added === 1 ? "" : "s"} added and queued for calling.</p>
          {result.invalid.length ? <>
            <p className="bcd-muted">{result.invalid.length.toLocaleString()} skipped: invalid phone number.</p>
            <ul className="bcd-import-problems">
              {result.invalid.slice(0, 8).map((problem) => <li key={problem.row}>Row {problem.row + (parsed?.hasHeader ? 1 : 0)}: {problem.phone_number || "(empty)"}</li>)}
              {result.invalid.length > 8 ? <li>…and {result.invalid.length - 8} more</li> : null}
            </ul>
          </> : null}
        </div> : <>
          <div className="bc-dialog-field">
            <label htmlFor="bcd-import-file">CSV file</label>
            <input accept=".csv,text/csv" className="bc-input bcd-file" id="bcd-import-file" onChange={(event) => void readFile(event.target.files?.[0])} type="file" />
            <p className="bc-hint">One contact per row. Needs a phone column with the country code (e.g. +8801712345678). Optional: first_name, last_name (or name), email, address.</p>
          </div>
          {parsed ? <div className="bcd-import-preview">
            <p><span className="bcd-strong">{fileName}</span>: {parsed.contacts.length.toLocaleString()} row{parsed.contacts.length === 1 ? "" : "s"}, {validCount.toLocaleString()} with a valid phone number.</p>
            <p className="bcd-muted">{columnNote}</p>
            <ul className="bcd-import-sample">
              {parsed.contacts.slice(0, 4).map((contact, index) => <li key={index}>
                <span className={isValidPhone(contact.phone_number) ? "" : "bcd-error"}>{contact.phone_number || "(no phone)"}</span>
                {contact.first_name || contact.last_name ? <span className="bcd-muted"> · {[contact.first_name, contact.last_name].filter(Boolean).join(" ")}</span> : null}
              </li>)}
            </ul>
          </div> : null}
        </>}
        {error ? <p className="bc-error bc-form-error" role="alert">{error}</p> : null}
      </div>
      <footer className="bc-actions">
        {result ? <button className="bc-primary" onClick={onClose} type="button">Done</button> : <>
          <button className="bc-secondary" disabled={saving} onClick={onClose} type="button">Cancel</button>
          <button className="bc-primary" disabled={saving || !validCount} type="submit">
            {saving ? "Importing…" : validCount ? `Import ${validCount.toLocaleString()} and start calling` : "Import"}
          </button>
        </>}
      </footer>
    </form>
  </dialog>;
}

const css = `
.bcd { display: flex; flex: 1 0 auto; flex-direction: column; min-height: 0; min-width: 0; }
.bcd-bar { align-items: center; border-bottom: 1px solid var(--app-border); display: grid; grid-template-areas: "heading search actions"; grid-template-columns: minmax(max-content, 1fr) minmax(160px, 280px) minmax(max-content, 1fr); gap: 12px; padding: 14px 20px; }
.bcd-bar-left { grid-area: heading; }
.bcd-bar-right { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; grid-area: actions; justify-content: flex-end; }
.bcd-heading { font-size: 15px; font-weight: 600; margin: 0; white-space: nowrap; }
.bcd-search { align-items: center; background: var(--app-surface); border: 1px solid var(--app-border); border-radius: 8px; color: var(--app-muted); display: flex; gap: 8px; grid-area: search; height: 34px; min-width: 0; padding: 0 10px; }
.bcd-search input { background: transparent; border: 0; color: var(--app-text); flex: 1; min-width: 0; outline: none; }
.bcd-search:focus-within { border-color: var(--app-primary); }
.bcd-search-toggle { justify-content: center; padding: 0; }
.bcd-search-toggle.is-active { border-color: var(--app-primary); color: var(--app-primary-text, var(--app-primary)); }
.bcd-search-expand { animation: bcd-search-expand .2s ease-out; bottom: 0; box-sizing: border-box; grid-area: auto; overflow: hidden; padding-right: 0; position: absolute; right: 0; top: 0; width: 100%; }
.bcd-search-expand .bcd-icon { flex-shrink: 0; }
.bcd-bar-right.is-searching > .bcd-btn { visibility: hidden; }
@keyframes bcd-search-expand { from { width: 44px; } to { width: 100%; } }
@media (prefers-reduced-motion: reduce) { .bcd-search-expand { animation: none; } }
.bc-shell .bcd-sort-menu { background: var(--app-surface); border: 1px solid var(--app-border-strong); border-radius: 8px; color: var(--app-text); display: none; grid-area: sort; min-height: 44px; min-width: 0; padding: 0 7px; width: 100%; }
.bcd-btn { align-items: center; background: transparent; border: 1px solid var(--app-border-strong); border-radius: 8px; color: var(--app-text); cursor: pointer; display: inline-flex; font-size: 13px; font-weight: 500; gap: 6px; height: 34px; padding: 0 12px; white-space: nowrap; }
.bcd-btn:hover:not(:disabled) { background: var(--app-panel-hover); }
.bcd-btn:disabled { cursor: default; opacity: .5; }
.bcd-btn-primary { background: var(--app-primary); border-color: var(--app-primary); color: #fff; font-weight: 600; }
.bcd-btn-primary:hover:not(:disabled) { background: var(--app-primary); filter: brightness(1.08); }
.bcd-btn-danger { border-color: #dc2626; color: #f87171; font-weight: 600; height: 30px; padding: 0 10px; }
.bcd-icon { align-items: center; background: transparent; border: 1px solid transparent; border-radius: 7px; color: var(--app-muted); cursor: pointer; display: inline-flex; height: 30px; justify-content: center; width: 30px; }
.bcd-icon:hover:not(:disabled) { background: var(--app-panel-hover); color: var(--app-text); }
.bcd-icon:disabled { cursor: default; opacity: .4; }
.bcd-filter { align-items: center; color: var(--app-muted); display: flex; font-size: 13px; gap: 10px; justify-content: space-between; margin: 14px 16px 0; overflow-wrap: anywhere; }
.bcd-notice { background: color-mix(in srgb, #f59e0b 12%, transparent); border: 1px solid color-mix(in srgb, #f59e0b 35%, transparent); border-radius: 8px; color: var(--app-text); font-size: 13px; margin: 14px 20px 0; padding: 9px 12px; }
.bcd-table-wrap { overflow-x: auto; padding: 0 20px 20px; }
.bcd-table-wrap.is-busy { opacity: .6; }
/* The rows scroll under the pager, which stays in view. */
.bcd { scroll-margin-top: 70px; }
.bcd-pager { background: var(--app-bg); bottom: 0; margin-top: auto; padding: 0 20px 10px; position: sticky; z-index: 5; }
.bcd-pager .cpg { padding-top: 10px; }
.bcd-table { border-collapse: collapse; font-size: 13px; min-width: 860px; width: 100%; }
.bcd-table th { color: var(--app-muted); font-size: 12px; font-weight: 500; padding: 16px 12px 10px; text-align: left; white-space: nowrap; }
.bcd-table td { border-top: 1px solid var(--app-border); padding: 12px; vertical-align: middle; }
.bcd-table tbody tr:hover td { background: var(--app-panel-hover); }
.bcd-sort-btn { background: none; border: 0; color: inherit; cursor: pointer; font: inherit; padding: 0; }
.bcd-sort-btn:hover { color: var(--app-text); }
.bcd-sort { font-size: 10px; margin-left: 2px; opacity: .6; }
.bcd-sort.is-active { opacity: 1; }
.bcd-profile { align-items: center; display: flex; gap: 10px; }
.bcd-avatar { align-items: center; border-radius: 50%; display: inline-flex; flex: 0 0 30px; font-size: 11px; font-weight: 700; height: 30px; justify-content: center; width: 30px; }
.bcd-two { display: flex; flex-direction: column; max-width: 230px; min-width: 0; }
.bcd-two > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bcd-strong { font-weight: 600; }
.bcd-muted { color: var(--app-muted); font-size: 12px; }
.bcd-date-col { white-space: nowrap; }
.bcd-none { color: var(--app-muted); padding: 28px 12px; text-align: center; }
.bcd-table tbody tr:hover td.bcd-none { background: transparent; }
.bcd-error { color: #f87171; }
.bcd-empty { align-items: center; display: inline-flex; flex-direction: column; gap: 12px; }
.bcd-actions-col { text-align: right; width: 1%; }
.bcd-row-actions { align-items: center; display: flex; gap: 6px; justify-content: flex-end; white-space: nowrap; }
.bcd-confirm { align-items: center; display: inline-flex; gap: 2px; }
.bcd-call-status { color: var(--app-muted); font-size: 12px; max-width: 220px; overflow: hidden; text-overflow: ellipsis; }
.bcd-call-status.is-received, .bcd-call-status.is-placing { color: #f59e0b; }
.bcd-call-status.is-answered { color: var(--app-primary); font-weight: 600; }
.bcd-call-status.is-failed, .bcd-call-status.is-declined { color: #f87171; }
.bcd-sr { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; }
.bcd-required { color: #f87171; }
.bcd-field-row { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; }
.bcd-dialer { align-items: center; background: var(--app-panel); border: 1px solid var(--app-border); border-radius: 10px; display: grid; gap: 6px 14px; grid-template-columns: minmax(0, 1fr) auto; margin: 14px 20px 0; padding: 10px 12px 10px 14px; }
.bcd-dialer.is-paused { background: color-mix(in srgb, #f59e0b 10%, transparent); border-color: color-mix(in srgb, #f59e0b 35%, transparent); }
.bcd-dialer-text { display: flex; flex-direction: column; font-size: 13px; gap: 1px; min-width: 0; }
.bcd-dialer-title { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bcd-dialer-reason { color: #f59e0b; font-size: 12.5px; }
.bcd-dialer > .bcd-btn { grid-column: 2; grid-row: 1; }
.bcd-progress { background: color-mix(in srgb, var(--app-text) 10%, transparent); border-radius: 99px; grid-column: 1 / -1; height: 4px; overflow: hidden; }
.bcd-progress > span { background: var(--app-primary); border-radius: inherit; display: block; height: 100%; transition: width .4s ease; }
.bcd-dialer.is-paused .bcd-progress > span { background: #f59e0b; }
@media (prefers-reduced-motion: reduce) { .bcd-progress > span { transition: none; } }
.bcd-status-col { white-space: nowrap; }
.bcd-contact-status { border: 1px solid var(--app-border); border-radius: 99px; color: var(--app-muted); display: inline-block; font-size: 11.5px; font-weight: 600; padding: 2px 9px; }
.bcd-contact-status.is-queued { color: var(--app-text); }
.bcd-contact-status.is-calling { border-color: color-mix(in srgb, #f59e0b 45%, transparent); color: #f59e0b; }
.bcd-contact-status.is-answered { border-color: var(--app-primary-border, var(--app-primary)); color: var(--app-primary-text, var(--app-primary)); }
.bcd-contact-status.is-no_answer { color: var(--app-muted); }
.bcd-contact-status.is-failed { border-color: color-mix(in srgb, #f87171 45%, transparent); color: #f87171; }
.bcd-row-error { color: #f87171; display: block; font-size: 11.5px; margin-top: 3px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bcd-file { cursor: pointer; padding-block: 9px; }
.bcd-import-preview, .bcd-import-result { background: color-mix(in srgb, var(--app-text) 5%, transparent); border: 1px solid color-mix(in srgb, var(--app-text) 12%, transparent); border-radius: 10px; display: grid; font-size: 13px; gap: 4px; padding: 10px 12px; }
.bcd-import-preview p, .bcd-import-result p { margin: 0; }
.bcd-import-sample, .bcd-import-problems { font-size: 12.5px; margin: 4px 0 0; padding-left: 18px; }
.bcd-row { cursor: pointer; }
.bcd-table tbody tr.bcd-row.is-open td { background: var(--app-panel); }
.bcd-number { background: none; border: 0; color: var(--app-text); cursor: pointer; font: inherit; padding: 0; text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--app-text) 30%, transparent); text-underline-offset: 3px; }
.bcd-number:hover { color: var(--app-primary-text, var(--app-primary)); text-decoration-color: currentColor; }
.bcd-panel {
  background: var(--app-surface);
  border-left: 1px solid var(--app-border-strong);
  box-shadow: -16px 0 40px rgb(0 0 0 / .28);
  color: var(--app-text);
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-width: 100vw;
  position: fixed;
  right: 0;
  top: 0;
  width: min(920px, calc(100vw - 32px));
  z-index: 40;
  animation: bcd-panel-in .18s ease-out;
}
@keyframes bcd-panel-in { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .bcd-panel { animation: none; } }
.bcd-panel-head { align-items: center; border-bottom: 1px solid var(--app-border); display: flex; gap: 10px; padding: 14px 14px 14px 18px; }
.bcd-panel-who { flex: 1; max-width: none; }
.bcd-panel-body { display: grid; flex: 1; grid-template-columns: 280px minmax(0, 1fr); min-height: 0; }
.bcd-panel-scrim { display: none; }
.bcd-panel-info { color: var(--app-muted); display: flex; flex-direction: column; font-size: 12.5px; gap: 3px; overflow-wrap: anywhere; padding-top: 12px; }
.bcd-panel-list { border-right: 1px solid var(--app-border); display: flex; flex-direction: column; min-height: 0; overflow-y: auto; padding: 4px 14px 20px 18px; }
.bcd-panel-detail { min-height: 0; min-width: 0; overflow-y: auto; padding: 4px 22px 24px; }
.bcd-summary { background: var(--app-panel); border: 1px solid var(--app-border); border-radius: 12px; padding: 12px 14px; }
.bcd-summary-text { font-size: 13.5px; line-height: 1.6; margin: 0 0 8px; overflow-wrap: anywhere; white-space: pre-wrap; }
.bcd-summary-redo { align-items: center; background: none; border: 0; color: var(--app-muted); cursor: pointer; display: inline-flex; font: inherit; font-size: 12px; gap: 5px; padding: 0; }
.bcd-summary-redo:hover:not(:disabled) { color: var(--app-text); }
.bcd-summary-redo:disabled { cursor: default; opacity: .6; }
.bcd-summary-pending { align-items: center; display: flex; gap: 8px; }
.bcd-spinner { animation: bcd-spin .8s linear infinite; border: 2px solid color-mix(in srgb, var(--app-text) 18%, transparent); border-radius: 50%; border-top-color: var(--app-primary); display: inline-block; height: 14px; width: 14px; }
@keyframes bcd-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .bcd-spinner { animation-duration: 2.4s; } }
.bcd-panel-label { color: var(--app-muted); font-size: 12px; font-weight: 600; letter-spacing: .02em; margin: 16px 0 8px; text-transform: uppercase; }
.bcd-panel-note { color: var(--app-muted); font-size: 13px; margin: 0; }
.bcd-panel-reason { display: block; margin-top: 4px; }
.bcd-panel-calls { display: flex; flex-direction: column; flex-shrink: 0; gap: 4px; list-style: none; margin: 0; padding: 0; }
.bcd-panel-call { align-items: center; background: transparent; border: 1px solid var(--app-border); border-radius: 9px; color: var(--app-text); cursor: pointer; display: flex; font-size: 13px; gap: 10px; justify-content: space-between; padding: 8px 10px; text-align: left; width: 100%; }
.bcd-panel-call:hover { background: var(--app-panel-hover); }
.bcd-panel-call.is-active { background: var(--app-primary-soft, var(--app-panel)); border-color: var(--app-primary-border, var(--app-primary)); }
.bcd-panel-call-main { display: flex; flex-direction: column; min-width: 0; }
.bcd-transcript { display: flex; flex-direction: column; gap: 8px; }
.bcd-line { border-radius: 12px; display: flex; flex-direction: column; font-size: 13px; gap: 2px; line-height: 1.45; max-width: 88%; padding: 8px 11px; }
.bcd-line.is-agent { align-self: flex-start; background: var(--app-panel); border-bottom-left-radius: 4px; }
.bcd-line.is-user { align-self: flex-end; background: var(--app-primary-soft, var(--app-panel-hover)); border-bottom-right-radius: 4px; }
.bcd-line-role { color: var(--app-muted); font-size: 11px; font-weight: 600; }
.bcd-line-text { overflow-wrap: anywhere; white-space: pre-wrap; }
@container broadcast-detail (max-width: 930px) {
  .bcd-bar { gap: 10px; grid-template-areas: "heading actions" "search sort"; grid-template-columns: minmax(0, 1fr) minmax(120px, auto); padding: 12px 16px; }
  .bcd-search { height: 44px; }
  .bcd-search svg { flex-shrink: 0; }
  .bc-shell .bcd-sort-menu { display: block; justify-self: end; max-width: 180px; }
  .bcd-btn, .bcd-icon { height: 44px; }
  .bcd-icon { width: 44px; }
  .bcd-table, .bcd-table td { display: block; min-width: 0; }
  .bcd-table thead, .bcd-table td.bcd-name-col { display: none; }
  .bcd-table tr:not(.bcd-row) { display: block; }
  .bcd-table .bcd-row td { background: transparent; border: 0; padding: 0; }
  .bcd-table tbody tr.bcd-row:hover td, .bcd-table tbody tr.bcd-row.is-open td { background: transparent; }
  .bcd-row .bcd-two { max-width: none; }
  .bcd-actions-col { width: auto; }
  .bcd-dialer { margin-inline: 16px; }
  .bcd-table-wrap { overflow: visible; padding: 8px 0 16px; }
  .bcd-table tbody { display: block; }
  .bcd-row { align-items: center; border-bottom: 1px solid var(--app-border); column-gap: 8px; display: grid; grid-template-areas: "profile status actions" "info status actions" "error error error"; grid-template-columns: minmax(0, 1fr) auto auto; padding: 10px 8px 10px 64px; position: relative; row-gap: 0; }
  .bcd-row:hover, .bcd-row.is-open { background: var(--app-panel); }
  .bcd-row .bcd-profile-col { align-self: end; grid-area: profile; min-width: 0; }
  .bcd-row .bcd-info-col { align-self: start; grid-area: info; min-width: 0; }
  .bcd-row .bcd-actions-col { grid-area: actions; }
  .bcd-row .bcd-avatar { font-size: 12px; height: 36px; left: 16px; position: absolute; top: 14px; width: 36px; }
  .bcd-row .bcd-two > .bcd-muted, .bcd-table .bcd-row td.bcd-date-col { display: none; }
  .bcd-row .bcd-profile { font-size: 14px; }
  .bcd-row.is-unnamed .bcd-profile .bcd-two { display: none; }
  .bcd-row.is-unnamed .bcd-info-col { align-self: center; grid-area: 1 / 1 / 3 / 2; }
  .bcd-row .bcd-number { color: var(--app-muted); max-width: 100%; min-height: 24px; overflow: hidden; text-align: left; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
  .bcd-row.is-unnamed .bcd-number { color: var(--app-text); font-size: 14px; font-weight: 600; }
  .bcd-table .bcd-row td.bcd-status-col { display: contents; }
  .bcd-row .bcd-contact-status { grid-area: status; }
  .bcd-row .bcd-row-error { grid-area: error; max-width: none; padding-right: 8px; white-space: normal; }
  .bcd-row .bcd-row-actions { border-top: 0; flex-wrap: nowrap; padding-top: 0; }
  .bcd-row:has(.bcd-btn-danger) { grid-template-areas: "profile status" "info status" "error error" "actions actions"; grid-template-columns: minmax(0, 1fr) auto; padding-right: 16px; }
  .bcd-row:has(.bcd-btn-danger) .bcd-row-actions { padding-top: 8px; }
  .bcd-notice { margin-inline: 16px; }
}
@container broadcast-detail (max-width: 410px) {
  .bcd-bar { grid-template-areas: "heading heading" "search sort" "actions actions"; grid-template-columns: minmax(0, 1fr) minmax(0, 124px); }
  .bcd-bar-right { justify-content: flex-start; }
}
@media (max-width: 980px) {
  .bcd-panel { z-index: 52; }
}
@media (max-width: 980px) {
  /* Above the sidebar's bottom tab bar. */
  .bcd-pager { bottom: calc(61px + env(safe-area-inset-bottom)); padding-inline: 16px; }
}
@media (max-width: 720px) {
  /* And above the Leads / Overview / Analytics bar. */
  .bcd-pager { bottom: calc(122px + env(safe-area-inset-bottom)); }
  .bcd-pager .cpg { flex-wrap: nowrap; }
  .bcd-pager .cpg-button { height: 36px; min-width: 32px; padding: 0 4px; }
  .bc-shell .bcd-search input, .bc-shell .bcd-sort-menu { font-size: 16px; }
  .bcd-panel-scrim { background: rgb(0 0 0 / .55); display: block; inset: 0; position: fixed; z-index: 51; }
  .bcd-panel { width: calc(100vw - 32px); }
  .bcd-panel-head { padding-top: calc(14px + env(safe-area-inset-top)); }
  .bcd-panel-body { display: block; overflow-y: auto; }
  .bcd-panel-list { border-right: 0; overflow: visible; padding: 4px 16px 0; }
  .bcd-panel-calls { max-height: 200px; overflow-y: auto; }
  .bcd-panel-detail { overflow: visible; padding: 4px 16px calc(24px + env(safe-area-inset-bottom)); }
}
@media (max-width: 420px) {
  .bcd-field-row { grid-template-columns: 1fr; }
}
`;
