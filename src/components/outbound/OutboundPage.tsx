"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Dialog } from "@base-ui/react/dialog";
import { Select } from "@base-ui/react/select";
import { Tabs } from "@base-ui/react/tabs";
import { ArrowLeft, BarChart3, Bot, Check, ChevronDown, LayoutGrid, SlidersHorizontal, Users, X } from "lucide-react";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { useDebouncedValue } from "@/components/conversations/ConversationPager";
import BroadcastContacts from "@/components/outbound/BroadcastContacts";
import {
  createBroadcast,
  deleteBroadcast,
  getBroadcast,
  listBroadcastContacts,
  listBroadcasts,
  listVoiceAgents,
  updateBroadcast,
  type ApiBroadcast,
  type BroadcastContactPage,
  type BroadcastContactSort,
  type BroadcastContactStats,
} from "@/lib/voiceAgents";

// Broadcast: a user creates as many broadcasts as they like, each with one of
// their voice agents selected. Served by the Go server's
// /v1/dashboard/voice/broadcasts routes.

type AgentOption = { id: string; name: string; phoneNumberId: string | null };
type LoadState = "loading" | "ready" | "error";

const NAME_MAX = 80;
const NO_AGENTS: AgentOption[] = [];
const BROADCAST_SPLIT_MIN_WIDTH = 721;

function subscribeSplitQuery(onChange: () => void): () => void {
  const query = window.matchMedia(`(min-width: ${BROADCAST_SPLIT_MIN_WIDTH}px)`);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePhoneLayout(): boolean {
  return useSyncExternalStore(subscribeSplitQuery, () => !window.matchMedia(`(min-width: ${BROADCAST_SPLIT_MIN_WIDTH}px)`).matches, () => false);
}

// The open broadcast, its tab and its contacts page live in the URL
// (?id=…&tab=…&page=…), so a refresh keeps them and the browser's Back button returns to the list.
function writeBroadcastUrl(id: string | null, options: { tab?: string; page?: number; replace?: boolean } = {}) {
  const params = new URLSearchParams();
  if (id) params.set("id", id);
  if (id && options.tab && options.tab !== "leads") params.set("tab", options.tab);
  if (id && options.page && options.page > 1) params.set("page", String(options.page));
  const url = `${window.location.pathname}${params.size ? `?${params}` : ""}`;
  if (url === window.location.pathname + window.location.search) return;
  if (options.replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
}

function errorText(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function OutboundPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [broadcasts, setBroadcasts] = useState<ApiBroadcast[]>([]);
  const [loadedAgents, setLoadedAgents] = useState<AgentOption[]>([]);
  const [agentState, setAgentState] = useState<LoadState>("loading");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const selectedId = useSearchParams().get("id");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    listBroadcasts(getToken)
      .then((list) => {
        if (cancelled) return;
        setBroadcasts(list);
        setLoadState("ready");
        // In the split layout, open the newest broadcast automatically.
        if (list.length && window.matchMedia(`(min-width: ${BROADCAST_SPLIT_MIN_WIDTH}px)`).matches) {
          const current = new URLSearchParams(window.location.search).get("id");
          if (!list.some((item) => item.id === current)) writeBroadcastUrl(list[0].id, { replace: true });
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadError(errorText(error, "Could not load broadcasts."));
        setLoadState("error");
      });
    listVoiceAgents(getToken)
      .then((list) => {
        if (cancelled) return;
        setLoadedAgents(list.map((agent) => ({ id: agent.id, name: agent.agent?.name || "Untitled agent", phoneNumberId: agent.agent?.phone_number_id || null })));
        setAgentState("ready");
      })
      .catch(() => {
        if (!cancelled) setAgentState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn, reloadKey]);

  // Signed out: nothing to load, so the list just shows empty.
  const listState: LoadState = isLoaded && !isSignedIn ? "ready" : loadState;
  const agents = isSignedIn && agentState === "ready" ? loadedAgents : NO_AGENTS;
  const agentPlaceholder = isLoaded && !isSignedIn ? "Sign in to select an agent"
    : agentState === "loading" ? "Loading agents…"
    : agentState === "error" ? "Could not load agents"
    : agents.length ? "Select an agent" : "No voice agents";
  const refresh = () => {
    setLoadState("loading");
    setAgentState("loading");
    setReloadKey((key) => key + 1);
  };

  const selected = useMemo(() => broadcasts.find((item) => item.id === selectedId) ?? null, [broadcasts, selectedId]);

  // Reopening a broadcast from the URL: hold the detail view while it loads.
  const opening = Boolean(selectedId && !selected && listState === "loading");

  const handleCreated = useCallback((created: ApiBroadcast) => {
    setBroadcasts((current) => [created, ...current]);
    writeBroadcastUrl(created.id);
    setCreateOpen(false);
  }, []);

  const handleUpdated = useCallback((updated: ApiBroadcast) => {
    setBroadcasts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }, []);

  const handleDeleted = useCallback((id: string) => {
    setBroadcasts((current) => current.filter((item) => item.id !== id));
    writeBroadcastUrl(null, { replace: true });
  }, []);

  return <div className="bc-shell app-accent-green">
    <style dangerouslySetInnerHTML={{ __html: css }} />
    <DashboardSidebar activeLabel="Broadcast" badges={broadcasts.length ? { Broadcast: broadcasts.length } : undefined} stackBelow={980} />
    <main className="bc-main">
      <div className={`bc-split${selected || opening ? " has-selection" : ""}`}>
        <aside aria-label="Broadcasts" className="bc-list">
          <div className="bc-head">
            <TargetIcon />
            <h1 className="bc-title">Broadcast</h1>
            <button aria-label="Refresh" className="bc-icon-btn" disabled={!isSignedIn || listState === "loading"} onClick={refresh} title="Refresh" type="button">
              <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="15"><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></svg>
            </button>
            <button aria-label="New broadcast" className="bc-add-btn" disabled={!isSignedIn} onClick={() => setCreateOpen(true)} title="New broadcast" type="button">
              <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>
          <nav className="bc-items">
            {listState === "loading" ? <p className="bc-note">Loading…</p>
              : listState === "error" ? <p className="bc-note bc-error">{loadError}</p>
              : broadcasts.length === 0 ? <p className="bc-note">No broadcasts yet. Click + to create one.</p>
              : broadcasts.map((item) => (
                <button className={`bc-item${item.id === selectedId ? " is-active" : ""}`} key={item.id} onClick={() => writeBroadcastUrl(item.id)} type="button">
                  <TargetIcon size={15} />
                  <span className="bc-item-text">
                    <span className="bc-item-name">{item.name}</span>
                    <span className="bc-item-agent">{item.agent_name ?? "No agent"}</span>
                  </span>
                </button>
              ))}
          </nav>
        </aside>
        <section className="bc-detail">
          {selected ? (
            <BroadcastDetail agentPlaceholder={agentPlaceholder} agents={agents} broadcast={selected} getToken={getToken} key={selected.id} onBack={() => writeBroadcastUrl(null)} onDeleted={handleDeleted} onUpdated={handleUpdated} />
          ) : opening ? (
            <div className="bc-empty" role="status"><p className="bc-empty-text">Loading broadcast…</p></div>
          ) : (
            <div className="bc-empty">
              <p className="bc-empty-title">{broadcasts.length ? "Select a broadcast" : "Create your first broadcast"}</p>
              <p className="bc-empty-text">Each broadcast uses one of your voice agents.</p>
              {isSignedIn ? <button className="bc-primary" onClick={() => setCreateOpen(true)} type="button">New broadcast</button> : null}
            </div>
          )}
        </section>
      </div>
    </main>
    {createOpen ? <CreateDialog agentPlaceholder={agentPlaceholder} agents={agents} getToken={getToken} onClose={() => setCreateOpen(false)} onCreated={handleCreated} /> : null}
  </div>;
}

type GetToken = ReturnType<typeof useAuth>["getToken"];

function AgentSelect({ agents, value, onChange, id }: {
  agents: AgentOption[];
  value: string;
  onChange: (value: string) => void;
  id: string;
}) {
  return <select className="bc-input" id={id} onChange={(event) => onChange(event.target.value)} value={value}>
    <option disabled value="">Select an agent</option>
    {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
  </select>;
}

function BroadcastAgentPicker({ agents, value, onChange, placeholder, compact, disabled, status, error }: {
  agents: AgentOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  // The phone bottom bar: a pill without the visible label, opening upwards.
  compact?: boolean;
  disabled?: boolean;
  status?: string;
  error?: string;
}) {
  return <div className={`bc-agent-picker${compact ? " is-compact" : ""}`}>
    <Select.Root
      disabled={disabled || !agents.length}
      items={agents.map((agent) => ({ value: agent.id, label: agent.name }))}
      modal={false}
      onValueChange={(id) => { if (id) onChange(id); }}
      value={value || null}
    >
      <Select.Label className="bc-agent-label">Voice agent</Select.Label>
      <Select.Trigger className="bc-agent-trigger">
        <span aria-hidden="true" className="bc-agent-symbol"><Bot size={16} /></span>
        <Select.Value className="bc-agent-value" placeholder={placeholder} />
        <Select.Icon className="bc-agent-chevron"><ChevronDown aria-hidden="true" size={15} /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner align="start" alignItemWithTrigger={false} className="bc-agent-positioner" side={compact ? "top" : "bottom"} sideOffset={6}>
          <Select.Popup className={`bc-agent-menu app-accent-green${compact ? " is-compact" : ""}`}>
            <Select.List>
              {agents.map((agent) => (
                <Select.Item className="bc-agent-option" key={agent.id} value={agent.id}>
                  <Select.ItemText className="bc-agent-option-text">{agent.name}</Select.ItemText>
                  <Select.ItemIndicator className="bc-agent-check"><Check aria-hidden="true" size={15} /></Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
    {status ? <p className="bc-hint" role="status">{status}</p> : null}
    {error ? <p className="bc-error bc-form-error" role="alert">{error}</p> : null}
  </div>;
}

function CreateDialog({ agents, agentPlaceholder, getToken, onClose, onCreated }: { agents: AgentOption[]; agentPlaceholder: string; getToken: GetToken; onClose: () => void; onCreated: (created: ApiBroadcast) => void }) {
  const [name, setName] = useState("");
  const [agentId, setAgentId] = useState(agents.length === 1 ? agents[0].id : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    nameRef.current?.focus();
    return () => dialog?.close();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError("Enter a name.");
    if (!agentId) return setError("Select an agent.");
    setSaving(true);
    setError("");
    try {
      onCreated(await createBroadcast({ name: trimmed, agent_id: agentId }, getToken));
    } catch (err) {
      setError(errorText(err, "Could not create the broadcast."));
      setSaving(false);
    }
  };

  return <dialog
    aria-labelledby="bc-create-title"
    aria-describedby="bc-create-description"
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
        <div className="bc-dialog-icon"><TargetIcon size={22} /></div>
        <button aria-label="Close dialog" className="bc-icon-btn bc-dialog-close" disabled={saving} onClick={onClose} type="button">
          <X aria-hidden="true" size={18} />
        </button>
        <h2 className="bc-dialog-title" id="bc-create-title">New broadcast</h2>
        <p id="bc-create-description">Choose the voice agent that will place calls for this broadcast.</p>
      </header>
      <div className="bc-dialog-fields">
        <div className="bc-dialog-field">
          <label htmlFor="bc-name">Broadcast name</label>
          <input className="bc-input" id="bc-name" maxLength={NAME_MAX} onChange={(event) => setName(event.target.value)} placeholder="e.g. December renewals" ref={nameRef} value={name} />
        </div>
        <div className="bc-dialog-field">
          <label htmlFor={agents.length ? "bc-agent" : undefined}>Voice agent</label>
          {agents.length ? <div className="bc-dialog-select">
            <AgentSelect agents={agents} id="bc-agent" onChange={setAgentId} value={agentId} />
            <ChevronDown aria-hidden="true" size={16} />
          </div> : <p className="bc-hint">{agentPlaceholder === "No voice agents" ? "Create an agent in WhatsApp Voice Agents first." : agentPlaceholder}</p>}
        </div>
        {error ? <p className="bc-error bc-form-error" role="alert">{error}</p> : null}
      </div>
      <footer className="bc-actions">
        <button className="bc-secondary" disabled={saving} onClick={onClose} type="button">Cancel</button>
        <button className="bc-primary" disabled={saving || !agents.length} type="submit">
          {saving ? "Creating\u2026" : "Create broadcast"}
        </button>
      </footer>
    </form>
  </dialog>;
}

function BroadcastDetail({ broadcast, agents, agentPlaceholder, getToken, onBack, onUpdated, onDeleted }: {
  broadcast: ApiBroadcast;
  agents: AgentOption[];
  agentPlaceholder: string;
  getToken: GetToken;
  onBack: () => void;
  onUpdated: (updated: ApiBroadcast) => void;
  onDeleted: (id: string) => void;
}) {
  const phone = usePhoneLayout();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") ?? "";
  const tab = ["overview", "analytics"].includes(tabParam) ? tabParam : "leads";
  const [configOpen, setConfigOpen] = useState(false);
  // Where the contacts search and sort go while the phone Config sidebar is open.
  const [barSlot, setBarSlot] = useState<HTMLElement | null>(null);
  // Where the contacts Import and Add buttons go in the phone header.
  const [actionsSlot, setActionsSlot] = useState<HTMLElement | null>(null);
  const closeConfig = useCallback(() => setConfigOpen(false), []);
  const [name, setName] = useState(broadcast.name);
  const [pendingAgentId, setPendingAgentId] = useState("");
  const [agentError, setAgentError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const pageParam = Number(searchParams.get("page"));
  const contactsPage = Number.isInteger(pageParam) && pageParam > 0 && pageParam <= 1_000_000 ? pageParam : 1;
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: BroadcastContactSort; desc: boolean }>({ key: "created", desc: true });
  const settledSearch = useDebouncedValue(search.trim());
  const [contacts, setContacts] = useState<BroadcastContactPage | null>(null);
  const [loadedKey, setLoadedKey] = useState("");
  const [contactError, setContactError] = useState("");

  const setContactsPage = useCallback((page: number) => {
    writeBroadcastUrl(broadcast.id, { tab, page, replace: true });
  }, [broadcast.id, tab]);
  // A different search or order starts again from its first page.
  const changeSearch = (value: string) => {
    setSearch(value);
    setContactsPage(1);
  };
  const changeSort = (value: { key: BroadcastContactSort; desc: boolean }) => {
    setSort(value);
    setContactsPage(1);
  };

  const queryKey = JSON.stringify([contactsPage, settledSearch, sort.key, sort.desc]);
  const latestKey = useRef(queryKey);
  const requestSeq = useRef(0);
  const appliedSeq = useRef(0);
  // Answers to an earlier page or search, or older than what is on screen, are
  // dropped.
  const loadContacts = useCallback((showError: boolean) => {
    const seq = ++requestSeq.current;
    const isCurrent = () => latestKey.current === queryKey && seq > appliedSeq.current;
    listBroadcastContacts(broadcast.id, { page: contactsPage, search: settledSearch, sort: sort.key, desc: sort.desc }, getToken)
      .then((result) => {
        if (!isCurrent()) return;
        appliedSeq.current = seq;
        setContacts(result);
        setLoadedKey(queryKey);
        setContactError("");
        // The last contact of the last page was deleted: show the new last page.
        if (contactsPage > result.totalPages) setContactsPage(result.totalPages);
      })
      .catch((error) => {
        if (!isCurrent() || !showError) return;
        setLoadedKey(queryKey);
        setContactError(errorText(error, "Could not load contacts."));
      });
  }, [broadcast.id, contactsPage, getToken, queryKey, setContactsPage, settledSearch, sort.desc, sort.key]);

  useEffect(() => {
    latestKey.current = queryKey;
    loadContacts(true);
    return () => {
      latestKey.current = "";
    };
  }, [loadContacts, queryKey]);

  const refreshContacts = useCallback(() => loadContacts(false), [loadContacts]);

  // While the auto-dialer has work, follow it: contacts move queued →
  // calling → answered / no answer, and the server may pause the broadcast
  // itself (number disconnected, minutes used up).
  const dialing = contacts ? contacts.stats.queued + contacts.stats.calling > 0 : false;
  useEffect(() => {
    if (!dialing) return;
    const timer = setInterval(() => {
      refreshContacts();
      getBroadcast(broadcast.id, getToken).then(onUpdated).catch(() => undefined);
    }, 3000);
    return () => clearInterval(timer);
  }, [broadcast.id, dialing, getToken, onUpdated, refreshContacts]);

  const dirty = name.trim() !== broadcast.name;
  const busy = saving || Boolean(pendingAgentId);
  const agentId = pendingAgentId || broadcast.agent_id || "";
  const agentOptions = broadcast.agent_id && !agents.some((agent) => agent.id === broadcast.agent_id)
    ? [{ id: broadcast.agent_id, name: broadcast.agent_name ?? "Current agent", phoneNumberId: null }, ...agents]
    : agents;
  const callAgent = agentOptions.find((agent) => agent.id === broadcast.agent_id) ?? null;

  const selectAgent = async (id: string) => {
    if (busy || id === broadcast.agent_id) return;
    setPendingAgentId(id);
    setAgentError("");
    try {
      onUpdated(await updateBroadcast(broadcast.id, { agent_id: id }, getToken));
    } catch (err) {
      setAgentError(errorText(err, "Could not change the voice agent."));
    } finally {
      setPendingAgentId("");
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || !dirty) return;
    const trimmed = name.trim();
    if (!trimmed) return setMessage({ kind: "error", text: "Enter a name." });
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateBroadcast(broadcast.id, { name: trimmed }, getToken);
      onUpdated(updated);
      setName(updated.name);
      setMessage({ kind: "success", text: "Saved." });
    } catch (err) {
      setMessage({ kind: "error", text: errorText(err, "Could not save.") });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (busy) return;
    setSaving(true);
    setMessage(null);
    try {
      await deleteBroadcast(broadcast.id, getToken);
      onDeleted(broadcast.id);
    } catch (err) {
      setMessage({ kind: "error", text: errorText(err, "Could not delete.") });
      setSaving(false);
      setConfirmDelete(false);
    }
  };

  const tabs = <Tabs.List activateOnFocus aria-label="Broadcast views" className="bc-tabs">
    <Tabs.Tab className="bc-tab" value="leads"><Users aria-hidden="true" size={16} />Leads</Tabs.Tab>
    <Tabs.Tab className="bc-tab" value="overview"><LayoutGrid aria-hidden="true" size={16} />Overview</Tabs.Tab>
    <Tabs.Tab className="bc-tab" value="analytics"><BarChart3 aria-hidden="true" size={16} />Analytics</Tabs.Tab>
  </Tabs.List>;

  const meta = <p className="bc-detail-meta">{broadcast.agent_name ?? "No agent"} · Created {formatDate(broadcast.created_at)}</p>;
  const renderAgentPicker = (compact: boolean) => <BroadcastAgentPicker agents={agentOptions} compact={compact} disabled={busy || !agents.length} error={agentError} onChange={selectAgent} placeholder={agentPlaceholder} status={pendingAgentId ? "Saving…" : undefined} value={agentId} />;
  const agentPicker = renderAgentPicker(false);
  const settingsForm = <form className="bc-card" onSubmit={save}>
    <label className="bc-label" htmlFor="bc-edit-name">Name</label>
    <input className="bc-input" id="bc-edit-name" maxLength={NAME_MAX} onChange={(event) => setName(event.target.value)} value={name} />
    {message ? <p className={message.kind === "error" ? "bc-error bc-form-error" : "bc-success bc-form-error"}>{message.text}</p> : null}
    <div className="bc-actions bc-actions-split">
      {confirmDelete ? (
        <span className="bc-confirm">
          Delete this broadcast?
          <button className="bc-danger" disabled={busy} onClick={remove} type="button">Delete</button>
          <button className="bc-secondary" disabled={busy} onClick={() => setConfirmDelete(false)} type="button">Keep</button>
        </span>
      ) : (
        <button className="bc-secondary bc-danger-text" disabled={busy} onClick={() => setConfirmDelete(true)} type="button">Delete</button>
      )}
      <button className="bc-primary" disabled={busy || !dirty} type="submit">{saving ? "Saving…" : "Save"}</button>
    </div>
  </form>;

  return <Tabs.Root className="bc-detail-full" onValueChange={(value) => writeBroadcastUrl(broadcast.id, { tab: String(value), page: contactsPage, replace: true })} value={tab}>
    <div className="bc-detail-head">
      <div className="bc-detail-head-text">
        <button className="bc-back" onClick={onBack} type="button"><ArrowLeft aria-hidden="true" size={14} /> Broadcasts</button>
        <h2 className="bc-detail-title" title={broadcast.name}>{broadcast.name}</h2>
        {phone ? null : meta}
      </div>
      {phone ? <>
        <button aria-haspopup="dialog" className="bc-secondary bc-config-btn" onClick={() => setConfigOpen(true)} type="button"><SlidersHorizontal aria-hidden="true" size={15} />Config</button>
        {tab === "leads" ? <div className="bc-head-actions" ref={setActionsSlot} /> : null}
      </> : (
        <div className="bc-detail-actions">
          {agentPicker}
          <button aria-expanded={settingsOpen} className="bc-secondary" onClick={() => setSettingsOpen((open) => !open)} type="button">{settingsOpen ? "Close settings" : "Settings"}</button>
        </div>
      )}
      {phone ? null : tabs}
    </div>
    {settingsOpen && !phone ? <div className="bc-settings">
      {settingsForm}
    </div> : null}
      <Tabs.Panel className="bc-tab-panel bc-tab-panel-leads" keepMounted value="leads">
        <BroadcastContacts actionsSlot={actionsSlot} agent={callAgent} barSlot={phone ? barSlot : undefined} broadcast={broadcast} contacts={contacts} getToken={getToken} loadError={contactError} onSearch={closeConfig} onBroadcastUpdated={onUpdated} onPage={setContactsPage} onSearchChange={changeSearch} onSortChange={changeSort} page={contactsPage} pageBusy={contacts !== null && (loadedKey !== queryKey || search.trim() !== settledSearch)} refreshContacts={refreshContacts} search={search} sort={sort} />
      </Tabs.Panel>
      <Tabs.Panel className="bc-tab-panel bc-summary" value="overview">
        <h3 className="bc-summary-title">Broadcast details</h3>
        <dl className="bc-summary-grid">
          <div><dt>Voice agent</dt><dd>{broadcast.agent_name ?? "Unassigned"}</dd></div>
          <div><dt>Leads</dt><dd>{contactError ? "Unavailable" : contacts?.stats.total.toLocaleString() ?? "Loading…"}</dd></div>
          <div><dt>Created</dt><dd>{formatDate(broadcast.created_at)}</dd></div>
          <div><dt>Last updated</dt><dd>{formatDate(broadcast.updated_at)}</dd></div>
        </dl>
      </Tabs.Panel>
      <Tabs.Panel className="bc-tab-panel bc-summary" value="analytics">
        <LeadAnalytics error={contactError} stats={contacts?.stats ?? null} />
      </Tabs.Panel>
      {/* On phones the agent and the tabs are a bar fixed to the bottom of the screen. It is
          rendered on the page shell, outside the size container, which some
          browsers would position it against. */}
      {phone ? createPortal(<div className="bc-bottom-bar">{renderAgentPicker(true)}{tabs}</div>, document.querySelector(".bc-shell") ?? document.body) : null}
      {phone ? <Dialog.Root onOpenChange={setConfigOpen} open={configOpen}>
        <Dialog.Portal container={document.querySelector<HTMLElement>(".bc-shell")}>
          <Dialog.Backdrop className="bc-config-scrim" />
          <Dialog.Popup className="bc-config">
            <header className="bc-config-head">
              <Dialog.Title className="bc-config-title">Config</Dialog.Title>
              <Dialog.Close aria-label="Close config" className="bc-icon-btn"><X aria-hidden="true" size={18} /></Dialog.Close>
            </header>
            <div className="bc-config-body">
              {tab === "leads" ? <div ref={setBarSlot} /> : null}
              <div className="bc-config-section">{agentPicker}{meta}</div>
              <div className="bc-config-section">
                <h3 className="bc-config-label">Settings</h3>
                {settingsForm}
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root> : null}
  </Tabs.Root>;
}

function LeadAnalytics({ stats, error }: { stats: BroadcastContactStats | null; error: string }) {
  return <>
    <h3 className="bc-summary-title">Lead coverage</h3>
    {error ? <p className="bc-summary-note bc-error" role="alert">{error}</p>
      : stats === null ? <p className="bc-summary-note" role="status">Loading leads…</p>
      : stats.total === 0 ? <p className="bc-summary-note">Add leads to see contact information coverage.</p>
      : <dl className="bc-summary-grid">
        <div><dt>Total leads</dt><dd className="bc-metric">{stats.total.toLocaleString()}</dd></div>
        <div><dt>With an email</dt><dd className="bc-metric">{stats.with_email.toLocaleString()}</dd></div>
        <div><dt>With an address</dt><dd className="bc-metric">{stats.with_address.toLocaleString()}</dd></div>
      </dl>}
  </>;
}

function TargetIcon({ size = 17 }: { size?: number }) {
  return <svg aria-hidden="true" fill="none" height={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width={size}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>;
}

const css = `
.bc-shell {
  background: var(--app-bg);
  color: var(--app-text);
  display: flex;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.bc-shell * { box-sizing: border-box; }
.bc-shell button, .bc-shell input, .bc-shell select { font: inherit; }
.bc-main { display: flex; flex: 1; flex-direction: column; min-width: 0; overflow: hidden; }
.bc-split { display: flex; flex: 1; min-height: 0; }
.bc-list { border-right: 1px solid var(--app-border); display: flex; flex: 0 0 clamp(190px, 17vw, 290px); flex-direction: column; min-height: 0; min-width: 0; padding: 16px; }
.bc-head { align-items: center; border-bottom: 1px solid var(--app-border); display: flex; gap: 8px; padding: 0 2px 14px; }
.bc-title { flex: 1; font-size: 14.5px; font-weight: 600; margin: 0; }
.bc-icon-btn, .bc-add-btn { align-items: center; border-radius: 8px; cursor: pointer; display: inline-flex; height: 32px; justify-content: center; width: 32px; }
.bc-icon-btn { background: transparent; border: 1px solid var(--app-border); color: var(--app-muted); }
.bc-icon-btn:hover:not(:disabled) { color: var(--app-text); background: var(--app-panel-hover); }
.bc-add-btn { background: var(--app-text); border: 0; color: var(--app-bg); }
.bc-icon-btn:disabled, .bc-add-btn:disabled { cursor: default; opacity: .5; }
.bc-items { display: flex; flex-direction: column; gap: 4px; overflow-y: auto; padding-top: 12px; }
.bc-item { align-items: center; background: transparent; border: 0; border-radius: 8px; color: var(--app-text); cursor: pointer; display: flex; gap: 10px; padding: 8px 10px; text-align: left; width: 100%; }
.bc-item:hover { background: var(--app-panel-hover); }
.bc-item.is-active { background: var(--app-panel); }
.bc-item-text { display: flex; flex-direction: column; min-width: 0; }
.bc-item-name, .bc-item-agent { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bc-item-name { font-weight: 500; }
.bc-item-agent { color: var(--app-muted); font-size: 12px; }
.bc-note { color: var(--app-muted); font-size: 13px; margin: 8px 2px; }
.bc-detail { display: flex; flex: 1; flex-direction: column; min-width: 0; overflow-y: auto; }
.bc-detail-full { container: broadcast-detail / inline-size; display: flex; flex: 1 0 auto; flex-direction: column; min-width: 0; width: 100%; }
.bc-detail-head { align-items: center; border-bottom: 1px solid var(--app-border); display: grid; gap: 12px; grid-template-areas: "title tabs actions"; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); padding: 16px 20px; }
.bc-detail-head-text { grid-area: title; min-width: 0; }
.bc-detail-actions { align-items: start; display: grid; gap: 8px; grid-area: actions; grid-template-columns: minmax(0, 236px) auto; justify-content: end; min-width: 0; }
.bc-agent-picker { display: grid; gap: 5px; min-width: 0; }
.bc-agent-label { color: var(--app-muted); font-size: 12px; font-weight: 600; }
.bc-shell .bc-agent-trigger {
  align-items: center;
  background: var(--app-surface);
  border: 1px solid var(--app-border-strong);
  border-radius: 10px;
  color: var(--app-text);
  cursor: pointer;
  display: grid;
  font-size: 13px;
  font-weight: 600;
  gap: 8px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  min-height: 40px;
  padding: 5px 10px 5px 6px;
  text-align: left;
}
.bc-agent-trigger:hover:not(:disabled) { background: var(--app-panel-hover); }
.bc-agent-trigger[data-popup-open] { border-color: var(--app-primary-border); }
.bc-agent-trigger:focus-visible { outline: 2px solid var(--app-primary-ring-strong); outline-offset: 2px; }
.bc-agent-trigger:disabled { cursor: default; }
.bc-agent-value, .bc-agent-option-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bc-agent-value[data-placeholder], .bc-agent-chevron { color: var(--app-muted); }
.bc-agent-chevron { display: flex; }
.bc-agent-trigger[data-popup-open] .bc-agent-chevron { transform: rotate(180deg); }
.bc-agent-symbol { align-items: center; background: var(--app-primary-soft); border-radius: 6px; color: var(--app-primary-text); display: flex; height: 26px; justify-content: center; width: 26px; }
.bc-agent-positioner { z-index: 30; }
.bc-agent-menu {
  background: var(--app-surface);
  border: 1px solid var(--app-border-strong);
  border-radius: 12px;
  box-shadow: 0 10px 28px rgb(0 0 0 / .26);
  color: var(--app-text);
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 13px;
  max-height: min(264px, var(--available-height));
  max-width: var(--available-width);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 5px;
  width: var(--anchor-width);
}
.bc-agent-option {
  align-items: center;
  border-radius: 7px;
  cursor: pointer;
  display: grid;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) 15px;
  min-height: 36px;
  padding: 6px 9px;
}
.bc-agent-option[data-selected] { background: var(--app-primary-soft); color: var(--app-primary-text); font-weight: 600; }
.bc-agent-option[data-highlighted] { background: var(--app-panel-hover); outline: none; }
.bc-agent-option[data-selected][data-highlighted] { background: var(--app-primary-soft-2); }
.bc-agent-check { display: flex; }
.bc-detail-actions > .bc-secondary { margin-top: 23px; min-height: 40px; white-space: nowrap; }
.bc-settings { border-bottom: 1px solid var(--app-border); padding: 16px 20px; }
.bc-settings .bc-card { max-width: 560px; }
.bc-shell .bc-back { align-items: center; background: none; border: 0; color: var(--app-muted); cursor: pointer; display: inline-flex; font-size: 12px; gap: 5px; margin-bottom: 5px; padding: 0; }
.bc-back:hover { color: var(--app-text); }
.bc-tabs { display: flex; flex-wrap: wrap; gap: 8px; grid-area: tabs; min-width: 0; }
.bc-shell .bc-tab { align-items: center; background: var(--app-surface); border: 1px solid var(--app-border-strong); border-radius: 999px; color: var(--app-muted); cursor: pointer; display: inline-flex; font-size: 13px; font-weight: 600; gap: 6px; min-height: 44px; padding: 0 10px; white-space: nowrap; }
.bc-shell .bc-tab:hover { background: var(--app-panel-hover); color: var(--app-text); }
.bc-shell .bc-tab[data-active] { background: var(--app-primary-soft); border-color: var(--app-primary-2); color: var(--app-primary-text); }
.bc-tab:focus-visible { outline: 2px solid var(--app-primary-ring-strong); outline-offset: 2px; }
.bc-tab-panel:focus-visible { outline: 2px solid var(--app-primary); outline-offset: -2px; }
.bc-tab-panel { min-width: 0; }
.bc-tab-panel-leads { display: flex; flex: 1 0 auto; flex-direction: column; }
.bc-tab-panel[hidden] { display: none; }
.bc-summary { padding: 20px; }
.bc-summary-title { font-size: 15px; font-weight: 600; margin: 0 0 12px; }
.bc-summary-grid { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); margin: 0; }
.bc-summary-grid > div, .bc-summary-note { background: var(--app-surface); border: 1px solid var(--app-border); border-radius: 10px; padding: 14px; }
.bc-summary-grid dt, .bc-summary-note:not(.bc-error) { color: var(--app-muted); }
.bc-summary-grid dt { font-size: 12px; }
.bc-summary-grid dd { font-weight: 600; margin: 4px 0 0; overflow-wrap: anywhere; }
.bc-summary-note { margin: 0; }
.bc-metric { font-size: 22px; font-variant-numeric: tabular-nums; }
.bc-detail-title { font-size: 18px; font-weight: 600; margin: 0; overflow-wrap: anywhere; }
.bc-detail-meta { color: var(--app-muted); font-size: 12.5px; margin: 2px 0 0; }
.bc-card { background: var(--app-surface); border: 1px solid var(--app-border); border-radius: 12px; display: flex; flex-direction: column; padding: 18px; }
.bc-label { color: var(--app-muted); font-size: 12px; font-weight: 600; letter-spacing: .02em; margin: 12px 0 6px; text-transform: uppercase; }
.bc-label:first-of-type { margin-top: 0; }
.bc-input { background: var(--app-bg); border: 1px solid var(--app-border-strong); border-radius: 8px; color: var(--app-text); height: 38px; padding: 0 10px; width: 100%; }
.bc-input:focus { border-color: var(--app-primary); outline: none; }
.bc-hint { color: var(--app-muted); font-size: 12.5px; margin: 6px 0 0; }
.bc-error { color: #f87171; }
.bc-success { color: var(--app-primary); }
.bc-form-error { font-size: 13px; margin: 10px 0 0; }
.bc-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 18px; }
.bc-actions-split { align-items: center; justify-content: space-between; }
.bc-confirm { align-items: center; display: inline-flex; flex-wrap: wrap; gap: 8px; font-size: 13px; }
.bc-primary, .bc-secondary, .bc-danger { border-radius: 8px; cursor: pointer; font-weight: 600; height: 36px; padding: 0 14px; }
.bc-primary { background: var(--app-primary); border: 0; color: #fff; }
.bc-secondary { background: transparent; border: 1px solid var(--app-border-strong); color: var(--app-text); }
.bc-danger { background: #dc2626; border: 0; color: #fff; }
.bc-danger-text { color: #f87171; }
.bc-primary:disabled, .bc-secondary:disabled, .bc-danger:disabled { cursor: default; opacity: .5; }
.bc-empty { align-items: center; display: flex; flex: 1; flex-direction: column; gap: 4px; justify-content: center; padding: 24px 16px; text-align: center; }
.bc-empty-title { font-size: 15px; font-weight: 600; margin: 0; }
.bc-empty-text { color: var(--app-muted); margin: 0 0 12px; }
.bc-dialog {
  --app-primary-light: var(--app-muted);
  --app-primary-ring: color-mix(in srgb, var(--app-text) 16%, transparent);
  background: var(--app-surface);
  background:
    linear-gradient(155deg, color-mix(in srgb, var(--app-text) 7%, transparent), transparent 65%),
    color-mix(in srgb, var(--app-surface) 75%, transparent);
  -webkit-backdrop-filter: blur(22px) saturate(0%);
  backdrop-filter: blur(22px) saturate(0%);
  border: 1px solid color-mix(in srgb, var(--app-text) 22%, transparent);
  border-radius: 20px;
  box-shadow:
    0 24px 72px rgb(0 0 0 / .38),
    inset 0 1px 0 color-mix(in srgb, var(--app-text) 12%, transparent);
  color: var(--app-text);
  margin: auto;
  max-height: calc(100dvh - 32px);
  max-width: none;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 0;
  width: min(460px, calc(100% - 32px));
}
.bc-dialog::backdrop { background: rgb(0 0 0 / .42); }
.bc-dialog-header { padding: 24px 24px 0; position: relative; }
.bc-dialog-icon {
  align-items: center;
  background: color-mix(in srgb, var(--app-text) 9%, transparent);
  border: 1px solid color-mix(in srgb, var(--app-text) 16%, transparent);
  border-radius: 12px;
  color: var(--app-text);
  display: grid;
  height: 44px;
  justify-items: center;
  width: 44px;
}
.bc-dialog-close {
  background: color-mix(in srgb, var(--app-text) 5%, transparent);
  border-color: color-mix(in srgb, var(--app-text) 10%, transparent);
  border-radius: 10px;
  height: 36px;
  position: absolute;
  right: 20px;
  top: 20px;
  width: 36px;
}
.bc-dialog-title { font-size: 22px; font-weight: 700; letter-spacing: -.025em; line-height: 1.25; margin: 14px 0 4px; }
.bc-dialog-header p { color: var(--app-muted); margin: 0; }
.bc-dialog-fields { display: grid; gap: 16px; padding: 20px 24px 24px; }
.bc-dialog-field { display: grid; gap: 6px; }
.bc-dialog-field label { font-size: 13px; font-weight: 600; }
.bc-dialog .bc-input {
  background: color-mix(in srgb, var(--app-bg) 48%, transparent);
  border-color: color-mix(in srgb, var(--app-text) 15%, transparent);
  border-radius: 10px;
  height: 44px;
  padding-inline: 12px;
}
.bc-dialog select option { background: var(--app-surface); color: var(--app-text); }
.bc-dialog .bc-input::placeholder { color: var(--app-muted); }
.bc-dialog .bc-input:focus { border-color: var(--app-primary-light); box-shadow: 0 0 0 3px var(--app-primary-ring); }
.bc-dialog-select { position: relative; }
.bc-dialog .bc-dialog-select select { appearance: none; cursor: pointer; padding-inline-end: 36px; text-overflow: ellipsis; }
.bc-dialog-select svg { color: var(--app-muted); pointer-events: none; position: absolute; right: 12px; top: 14px; }
.bc-dialog .bc-hint, .bc-dialog .bc-form-error { margin: 0; }
.bc-dialog .bc-actions {
  background: color-mix(in srgb, var(--app-bg) 30%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--app-text) 10%, transparent);
  flex-wrap: wrap;
  margin: 0;
  padding: 14px 24px;
}
.bc-shell .bc-dialog .bc-actions button { border-radius: 9px; font-weight: 600; height: 42px; }
.bc-dialog .bc-primary {
  background: var(--app-text);
  color: var(--app-surface);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .18), 0 4px 16px rgb(0 0 0 / .18);
}
.bc-dialog .bc-secondary {
  background: color-mix(in srgb, var(--app-text) 5%, transparent);
  border-color: color-mix(in srgb, var(--app-text) 15%, transparent);
}
.bc-dialog .bc-primary:hover:not(:disabled) { background: color-mix(in srgb, var(--app-text) 88%, var(--app-surface)); }
.bc-dialog .bc-secondary:hover:not(:disabled) { background: var(--app-panel-hover); }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .bc-dialog { background: var(--app-surface); }
}
@media (max-width: 420px) {
  .bc-dialog-header, .bc-dialog-fields, .bc-dialog .bc-actions { padding-inline: 18px; }
  .bc-dialog-close { right: 14px; }
}
@container broadcast-detail (max-width: 1060px) {
  .bc-detail-head { grid-template-areas: "title actions" "tabs tabs"; grid-template-columns: minmax(0, 1fr) minmax(0, auto); }
}
@container broadcast-detail (max-width: 600px) {
  .bc-detail-head { grid-template-areas: "title" "actions" "tabs"; grid-template-columns: minmax(0, 1fr); }
  .bc-detail-actions { grid-template-columns: minmax(0, 1fr) auto; }
  .bc-agent-trigger, .bc-detail-actions > .bc-secondary { min-height: 44px; }
  .bc-tabs { gap: 6px; }
  .bc-shell .bc-tab { flex: 1 1 auto; justify-content: center; }
}
@media (max-width: 980px) {
  .bc-shell { display: block; height: auto; min-height: 100dvh; overflow: visible; }
  .bc-main { box-sizing: border-box; min-height: calc(100dvh - 120px - env(safe-area-inset-bottom)); overflow: visible; }
  .bc-detail { overflow: visible; }
  .bc-detail-head, .bc-settings, .bc-summary { padding: 12px 16px; }
}
@media (width < ${BROADCAST_SPLIT_MIN_WIDTH}px) {
  .bc-list { border-right: 0; flex: 1 1 auto; }
  .bc-detail { display: none; }
  .bc-split.has-selection .bc-list { display: none; }
  .bc-split.has-selection .bc-detail { display: flex; }
  .bc-head > button { height: 44px; width: 44px; }
  .bc-item { min-height: 52px; }
  .bc-shell .bc-back { min-height: 44px; }
  .bc-detail-full { padding-bottom: 61px; }
  .bc-detail-full .bc-detail-head { gap: 0 12px; grid-template-areas: "back name config" "actions actions actions"; grid-template-columns: minmax(max-content, 1fr) minmax(0, auto) minmax(max-content, 1fr); }
  .bc-detail-head-text { display: contents; }
  .bc-shell .bc-back { grid-area: back; justify-self: start; margin: 0; }
  .bc-detail-head .bc-detail-title { grid-area: name; min-width: 0; overflow: hidden; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
  .bc-config .bc-detail-meta { margin-top: 10px; }
  .bc-head-actions { grid-area: actions; margin-top: 12px; }
  .bc-head-actions .bcd-bar-right { display: grid; grid-template-columns: minmax(0, 1fr) minmax(max-content, 1fr) 44px; position: relative; }
  .bc-head-actions .bcd-btn { justify-content: center; }
  .bc-shell .bc-config-btn { align-items: center; justify-self: end; display: inline-flex; gap: 7px; grid-area: config; min-height: 44px; }
  .bc-agent-positioner { z-index: 60; }
  .bc-config-scrim { background: rgb(0 0 0 / .55); inset: 0; position: fixed; z-index: 51; }
  .bc-config { background: var(--app-surface); border-left: 1px solid var(--app-border-strong); bottom: 0; color: var(--app-text); display: flex; flex-direction: column; outline: none; position: fixed; right: 0; top: 0; transition: transform .18s ease-out; width: min(420px, calc(100vw - 32px)); z-index: 52; }
  .bc-config[data-starting-style], .bc-config[data-ending-style] { transform: translateX(100%); }
  .bc-config-head { align-items: center; border-bottom: 1px solid var(--app-border); display: flex; gap: 8px; justify-content: space-between; padding: calc(10px + env(safe-area-inset-top)) 12px 10px 16px; }
  .bc-config-head .bc-icon-btn { height: 44px; width: 44px; }
  .bc-config-title { font-size: 15px; font-weight: 600; margin: 0; }
  .bc-config-body { container: broadcast-detail / inline-size; flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding-bottom: env(safe-area-inset-bottom); }
  .bc-config-section { padding: 16px; }
  .bc-config .bcd-bar { grid-template-areas: "heading heading" "search sort"; grid-template-columns: minmax(0, 1fr) minmax(0, 124px); }
  .bc-config-section + .bc-config-section { border-top: 1px solid var(--app-border); }
  .bc-config-label { font-size: 15px; font-weight: 600; margin: 0 0 12px; }
  /* Sits on top of the sidebar's bottom tab bar (61px plus the safe area). */
  .bc-bottom-bar { background: var(--app-sidebar); border-top: 1px solid var(--app-border); bottom: calc(61px + env(safe-area-inset-bottom)); display: flex; gap: 6px; left: 0; padding: 8px 12px; position: fixed; right: 0; z-index: 29; }
  .bc-bottom-bar .bc-tabs { flex: 1 0 auto; flex-wrap: nowrap; gap: 6px; }
  .bc-bottom-bar .bc-tab { flex: 1 0 auto; gap: 5px; justify-content: center; padding: 0 8px; }
  /* The agent's name takes what the tabs leave, up to 260px. */
  .bc-agent-picker.is-compact { flex: 100 1 0; max-width: 260px; min-width: 58px; }
  .bc-agent-picker.is-compact .bc-agent-label, .bc-agent-picker.is-compact .bc-hint { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; }
  .bc-agent-picker.is-compact .bc-agent-trigger { border-radius: 999px; gap: 6px; min-height: 44px; padding: 5px 9px 5px 8px; width: 100%; }
  .bc-agent-picker.is-compact .bc-agent-symbol { background: none; height: 18px; width: 18px; }
  .bc-agent-picker.is-compact .bc-agent-trigger:disabled { opacity: .6; }
  .bc-agent-picker.is-compact .bc-form-error { background: var(--app-sidebar); border-top: 1px solid var(--app-border); bottom: 100%; left: 0; margin: 0; padding: 8px 16px; position: absolute; right: 0; }
  .bc-agent-menu.is-compact { max-width: calc(100vw - 24px); width: 260px; }
  .bc-agent-menu.is-compact .bc-agent-option { min-height: 44px; }
  .bc-shell .bc-input { font-size: 16px; }
}
/* Too narrow for a readable agent name, then for the tabs' icons too. */
@media (max-width: 430px) {
  .bc-agent-picker.is-compact { flex: 0 0 58px; }
  .bc-agent-picker.is-compact .bc-agent-trigger { grid-template-columns: auto auto; justify-content: center; }
  .bc-agent-picker.is-compact .bc-agent-value { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; }
}
@media (max-width: 374px) { .bc-bottom-bar .bc-tab svg { display: none; } }
@media (prefers-reduced-motion: reduce) { .bc-config { transition: none; } }
`;
