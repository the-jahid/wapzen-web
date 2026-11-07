"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useCachedState, writeCachedEntry } from "@/lib/pageCache";
import { startRefreshing } from "@/lib/polling";
import {
  AiReplySwitch,
  avatarColor,
  ChatIcon,
  conversationPartsCSS,
  formatDate,
} from "@/components/chat/ConversationParts";
import {
  conversationPhone,
  conversationTitle,
  getChatConversationsVersion,
  listChatAgentConversations,
  listChatConversations,
  setChatConversationAiReply,
  type ApiChatConversation,
} from "@/lib/chatConversations";

// The agents whose threads this workspace may show. The chat-agent editor
// passes none (it is already inside one agent); the Conversations page passes
// the account's agents, which is what turns on the agent filter and the
// "answered by" label on each row.
export type ConversationAgentOption = { id: string; name: string };

// A chat thread arrives whenever somebody writes in, so the list re-reads itself
// on a timer rather than waiting to be told. The interval is slow on purpose:
// this is a transcript being kept, not a live inbox, and the Refresh button is
// there for anyone who wants it sooner.
const refreshMs = 15000;
// The list is read after this many turns even if it seems unchanged, for the few
// things that don't touch a thread's row, such as a contact's number becoming known.
const listAtLeastEvery = 20;

// Where each list had scrolled to, so coming back from a thread lands on the row
// it was opened from. Only this tab's visit needs it, so it isn't stored.
const listScrollTops = new Map<string, number>();

// One list serves both readers of a thread: the chat-agent editor, which passes
// an agentId and shows only that agent's inbox, and the Conversations page,
// which passes none and lists the whole account with an agent filter. Clicking a
// row opens the thread on its own page.
export default function ChatConversationsWorkspace({
  agentId,
  agents,
}: {
  agentId?: string;
  agents?: ConversationAgentOption[];
}) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  // The filters are cached too: opening a thread leaves this page, and coming
  // back should find the list as it was left.
  const filterScope = agentId ?? "all";
  const [search, setSearch] = useCachedState(`conversations-search:${filterScope}`, "");
  const [statusFilter, setStatusFilter] = useCachedState(`conversations-status:${filterScope}`, "");
  const [savedAgentFilter, setAgentFilter] = useCachedState("conversations-agent-filter", "");
  // An agent deleted since the filter was set can't be picked or shown, so the
  // filter falls back to all agents rather than hiding every thread behind it.
  const agentFilter = agents?.some((agent) => agent.id === savedAgentFilter) ? savedAgentFilter : "";
  // Cached per inbox (and per agent filter), so reopening one shows its threads
  // at once while the refetch runs.
  const listKey = agentId ? `chat-conversations:agent:${agentId}` : `chat-conversations:all:${agentFilter}`;
  const [conversations, setConversations, hasCachedList] = useCachedState<ApiChatConversation[]>(listKey, []);
  // Threads whose AI switch is being saved, so a double click can't race itself.
  const [aiSaving, setAiSaving] = useState<string[]>([]);
  const [listError, setListError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        // One agent's inbox reads its own nested route; the account-wide one
        // reads the collection, narrowed by the agent filter when it is set.
        const result = agentId
          ? await listChatAgentConversations(agentId, getToken)
          : await listChatConversations(getToken, { chatAgentId: agentFilter || undefined });
        if (cancelled) return;
        setConversations(result.items);
        setLoading(false);
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load conversations");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [agentFilter, agentId, getToken, reloadKey, setConversations]);

  // Each turn asks whether the list changed, and only then downloads it. If that
  // question fails, the list is read anyway, as it would be without it.
  useEffect(() => {
    let cancelled = false;
    let knownVersion: string | null = null;
    let turnsSinceList = 0;
    const stopRefreshing = startRefreshing(async () => {
      const version = await getChatConversationsVersion(getToken, {
        chatAgentId: agentId || agentFilter || undefined,
      }).catch(() => null);
      if (cancelled) return;
      turnsSinceList += 1;
      if (version !== null && version === knownVersion && turnsSinceList < listAtLeastEvery) return;
      knownVersion = version;
      turnsSinceList = 0;
      setReloadKey((key) => key + 1);
    }, refreshMs);
    return () => {
      cancelled = true;
      stopRefreshing();
    };
  }, [agentFilter, agentId, getToken]);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (statusFilter && conversation.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        conversationTitle(conversation).toLowerCase().includes(needle) ||
        conversationPhone(conversation).toLowerCase().includes(needle) ||
        conversation.peer_jid.toLowerCase().includes(needle)
      );
    });
  }, [conversations, search, statusFilter]);

  const openCount = conversations.filter((conversation) => conversation.status === "open").length;

  // Handing the row to the thread's cache entry puts the contact's name and the
  // AI switch on the next page from its first frame. It keeps any messages an
  // earlier visit saved, since the row carries none.
  const rememberOpenedRow = useCallback(
    (conversation: ApiChatConversation, list: HTMLElement | null) => {
      if (list) listScrollTops.set(listKey, list.scrollTop);
      writeCachedEntry<ApiChatConversation>(`chat-conversation:${conversation.id}`, (current) => ({
        ...current,
        ...conversation,
      }));
    },
    [listKey]
  );

  // Runs as the list mounts, before it paints, so the return from a thread
  // doesn't flash the top of the list first.
  const restoreListScroll = useCallback(
    (list: HTMLDivElement | null) => {
      if (list) list.scrollTop = listScrollTops.get(listKey) ?? 0;
    },
    [listKey]
  );

  // Flips the switch at once and puts it back if the server refuses, so the
  // row answers the click without waiting on the round trip.
  const toggleAiReply = useCallback(
    async (conversation: ApiChatConversation) => {
      const id = conversation.id;
      if (aiSaving.includes(id)) return;
      const next = conversation.ai_reply_enabled === false;
      const apply = (ai_reply_enabled: boolean) => {
        setConversations((current) => current.map((item) => (item.id === id ? { ...item, ai_reply_enabled } : item)));
      };
      setAiSaving((current) => [...current, id]);
      setListError("");
      apply(next);
      try {
        await setChatConversationAiReply(id, next, getToken);
      } catch (updateError) {
        apply(!next);
        setListError(updateError instanceof Error ? updateError.message : "Failed to switch the AI for this contact");
      } finally {
        setAiSaving((current) => current.filter((item) => item !== id));
      }
    },
    [aiSaving, getToken, setConversations]
  );

  return (
    <section className="cv-workspace">
      <style dangerouslySetInnerHTML={{ __html: conversationPartsCSS + workspaceCSS }} />

      <div className="cv-toolbar">
        <label className="cv-search">
          <SearchIcon />
          <input
            aria-label="Search conversations"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search contacts..."
            value={search}
          />
        </label>
        <div className="cv-toolbar-right">
          {agents ? (
            <select
              aria-label="Filter conversations by chat agent"
              className="cv-filter"
              onChange={(event) => setAgentFilter(event.target.value)}
              value={agentFilter}
            >
              <option value="">All agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          ) : null}
          <select
            aria-label="Filter conversations by status"
            className="cv-filter"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="">All threads</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <span className="cv-count">
            {conversations.length === 0
              ? "No conversations"
              : `${conversations.length} thread${conversations.length === 1 ? "" : "s"} · ${openCount} open`}
          </span>
          <button
            aria-label="Refresh conversations"
            className="cv-icon-button"
            disabled={loading}
            onClick={() => setReloadKey((key) => key + 1)}
            title="Refresh"
            type="button"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      {error ? <div className="cv-error">{error}</div> : null}
      {listError ? <div className="cv-error">{listError}</div> : null}

      {loading && !hasCachedList && conversations.length === 0 ? (
        <div className="cv-empty">
          <span className="cv-spinner" />
          Loading conversations…
        </div>
      ) : null}

      {(!loading || hasCachedList) && conversations.length === 0 && !error ? (
        <div className="cv-empty">
          <span className="cv-empty-icon">
            <ChatIcon />
          </span>
          <strong>No conversations yet</strong>
          <span>
            {agentId
              ? "Every WhatsApp message this agent answers is saved here, with the whole thread. Activate the agent and write to its number to see the first one."
              : "Every WhatsApp message your chat agents answer is saved here, with the whole thread. Activate an agent and write to its number to see the first one."}
          </span>
        </div>
      ) : null}

      {conversations.length > 0 ? (
        <div className="cv-list" ref={restoreListScroll}>
          {visible.length === 0 ? (
            <div className="cv-list-empty">No thread matches that filter.</div>
          ) : (
            visible.map((conversation) => {
              const title = conversationTitle(conversation);
              return (
                // The contact's name is the link, stretched over the whole row,
                // because the AI switch inside it is a button of its own and a
                // button can't nest in a link. New-tab clicks work this way too.
                <div className="cv-row" key={conversation.id}>
                  <span className="cv-avatar" style={{ background: avatarColor(conversation.id) }}>
                    {title.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="cv-row-identity">
                    <Link
                      className="cv-row-name cv-row-link"
                      href={
                        agentId
                          ? `/dashboard/conversations/${conversation.id}?agent=${encodeURIComponent(agentId)}`
                          : `/dashboard/conversations/${conversation.id}`
                      }
                      onClick={(event) =>
                        rememberOpenedRow(conversation, event.currentTarget.closest<HTMLElement>(".cv-list"))
                      }
                      prefetch={false}
                    >
                      {title}
                    </Link>
                    <span className="cv-row-phone">{conversationPhone(conversation)}</span>
                  </span>
                  <span className="cv-row-meta">
                    <span className="cv-row-count">{conversation.message_count} messages</span>
                    {/* Only the account-wide inbox needs to say who answered:
                        inside one agent's tab, every thread is that agent's. */}
                    {agents ? (
                      <span className="cv-row-agent">{agentName(agents, conversation.chat_agent_id)}</span>
                    ) : null}
                  </span>
                  <span className="cv-row-time">
                    {formatDate(conversation.last_message_at ?? conversation.created_at)}
                  </span>
                  <AiReplySwitch
                    busy={aiSaving.includes(conversation.id)}
                    className="cv-row-ai"
                    onToggle={() => void toggleAiReply(conversation)}
                    on={conversation.ai_reply_enabled !== false}
                  />
                  <span className={`cv-chip ${conversation.status === "closed" ? "cv-chip-closed" : "cv-chip-open"}`}>
                    {conversation.status}
                  </span>
                  <span className="cv-row-chevron"><ChevronIcon /></span>
                </div>
              );
            })
          )}
        </div>
      ) : null}
    </section>
  );
}

// A thread keeps its history when the agent that answered it is deleted, so a
// chat_agent_id with no agent left to name is expected rather than an error.
function agentName(agents: ConversationAgentOption[], chatAgentId: string | null): string {
  if (!chatAgentId) return "Unassigned";
  return agents.find((agent) => agent.id === chatAgentId)?.name ?? "Deleted agent";
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="15">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
      <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const workspaceCSS = `
.cv-workspace{container-type:inline-size;display:flex;flex-direction:column;gap:12px;height:100%;min-height:0}
.cv-workspace *{box-sizing:border-box}

.cv-toolbar{align-items:center;display:flex;flex:0 0 auto;flex-wrap:wrap;gap:10px;justify-content:space-between}
.cv-toolbar-right{align-items:center;display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
.cv-search{align-items:center;background:var(--app-elevated);border:1px solid var(--app-line);border-radius:10px;color:var(--app-muted);display:flex;flex:1 1 200px;gap:8px;height:36px;max-width:320px;padding:0 11px}
.cv-search:focus-within{border-color:var(--app-primary);box-shadow:0 0 0 3px var(--app-primary-soft)}
.cv-search input{background:transparent;border:0;color:var(--app-text);font:inherit;font-size:12.5px;min-width:0;outline:none;width:100%}
.cv-search input::placeholder{color:var(--app-subtle)}
.cv-filter{background:var(--app-panel-hover);border:1px solid var(--app-line);border-radius:10px;color:var(--app-text-soft);font:inherit;font-size:12px;height:36px;max-width:180px;outline:none;padding:0 10px}
.cv-filter:focus{border-color:var(--app-primary);box-shadow:0 0 0 3px var(--app-primary-soft)}
.cv-filter option{background:var(--app-elevated)}
.cv-count{color:var(--app-faint);font-size:11px;white-space:nowrap}
.cv-icon-button{align-items:center;background:var(--app-elevated);border:1px solid var(--app-line);border-radius:10px;color:var(--app-text-soft);cursor:pointer;display:flex;flex:0 0 auto;height:36px;justify-content:center;width:36px}
.cv-icon-button:hover{background:var(--app-line-soft);color:var(--app-text-strong)}
.cv-icon-button:disabled{cursor:not-allowed;opacity:.4}

.cv-list{display:flex;flex:1 1 auto;flex-direction:column;gap:10px;min-height:0;overflow-y:auto;padding-right:3px}
.cv-list-empty{color:var(--app-muted);font-size:12px;padding:16px 6px;text-align:center}
.cv-row{align-items:center;background:var(--app-elevated);border:1px solid var(--app-line);border-radius:14px;cursor:pointer;display:grid;flex:0 0 auto;gap:16px;grid-template-areas:"avatar identity meta time ai status chevron";grid-template-columns:36px minmax(180px,1.2fr) minmax(160px,.9fr) auto auto auto 18px;padding:13px 16px;position:relative;text-align:left;transition:background .16s ease,border-color .16s ease,box-shadow .16s ease;width:100%}
.cv-row:hover{background:var(--app-panel-hover);border-color:var(--app-primary-ring);box-shadow:0 6px 18px var(--app-shadow-soft)}
.cv-row:has(.cv-row-link:focus-visible){border-color:var(--app-primary);box-shadow:0 0 0 3px var(--app-primary-soft)}
.cv-row>.cv-avatar{grid-area:avatar}
.cv-row-identity{display:grid;gap:3px;grid-area:identity;min-width:0}
.cv-row-name{color:var(--app-text-strong);font-size:13px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* Stretches the link over the row: the row is the positioned ancestor. */
.cv-row-link{outline:none;text-decoration:none}
.cv-row-link::after{content:"";inset:0;position:absolute}
.cv-row-time{color:var(--app-faint);font-size:10.5px;grid-area:time;white-space:nowrap}
.cv-row-phone{color:var(--app-muted);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-row-meta{align-items:center;display:flex;flex-wrap:wrap;gap:7px;grid-area:meta;min-width:0}
.cv-row-count{color:var(--app-muted);font-size:11px;white-space:nowrap}
.cv-row-agent{background:var(--app-panel-hover);border-radius:999px;color:var(--app-muted);font-size:9.5px;font-weight:700;max-width:14ch;overflow:hidden;padding:2px 7px;text-overflow:ellipsis;white-space:nowrap}
.cv-chip{border-radius:999px;font-size:9.5px;font-weight:800;grid-area:status;letter-spacing:.3px;padding:3px 8px;text-transform:uppercase;white-space:nowrap}
.cv-chip-open{background:var(--app-green-soft);color:var(--app-green)}
.cv-chip-closed{background:var(--app-slate-soft);color:var(--app-slate)}
.cv-row-chevron{color:var(--app-faint);display:inline-flex;grid-area:chevron;transition:color .16s ease,transform .16s ease}
.cv-row:hover .cv-row-chevron{color:var(--app-primary-text);transform:translateX(2px)}
/* Above the stretched link, so the switch answers its own clicks. */
.cv-row-ai{grid-area:ai;position:relative;z-index:1}

/* Tablet: the list gives up its comfort. */
@media(max-width:1100px){
  .cv-row{grid-template-areas:"avatar identity meta ai status chevron";grid-template-columns:36px minmax(180px,1fr) minmax(140px,.8fr) auto auto 18px}
  .cv-row-time{display:none}
}
/* The same again by the list's own width, which is what counts inside the agent
   editor's narrow card on a wide screen. */
@container (max-width:800px){
  .cv-row{grid-template-areas:"avatar identity meta ai status chevron";grid-template-columns:36px minmax(180px,1fr) minmax(140px,.8fr) auto auto 18px}
  .cv-row-time{display:none}
}

@media(max-width:760px){
  .cv-toolbar{align-items:stretch;flex-direction:column}
  /* In the stacked toolbar the desktop 200px flex-basis would become height. */
  .cv-search{flex:0 0 auto;max-width:none}
  .cv-toolbar-right{flex-wrap:nowrap;justify-content:space-between}
  .cv-icon-button{flex:0 0 auto}
  .cv-filter{flex:1 1 120px;max-width:none;min-width:0}
  .cv-count{display:none}
  .cv-row{gap:10px;grid-template-areas:"avatar identity ai status chevron" "avatar meta meta meta meta";grid-template-columns:36px minmax(0,1fr) auto auto 18px;padding:12px}
  /* 16px stops iOS Safari zooming the page when a field is focused. */
  .cv-search input,.cv-filter{font-size:16px}
  .cv-search,.cv-filter{height:40px}
  .cv-icon-button{height:40px;width:40px}
}

@media(max-width:420px){
  .cv-row{gap:6px 10px;grid-template-areas:"avatar identity ai" "avatar meta status";grid-template-columns:32px minmax(0,1fr) auto;padding:11px}
  .cv-row-ai .cv-ai-label{display:none}
  .cv-row-chevron{display:none}
  .cv-row-agent{max-width:18ch}
}
`;
