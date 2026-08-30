"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "motion/react";
import ExpandableCardDemoStandard from "@/components/expandable-card-demo-standard";
import {
  conversationPhone,
  conversationTitle,
  deleteChatConversation,
  getChatConversation,
  listChatAgentConversations,
  listChatConversations,
  sendChatConversationMessage,
  setChatConversationStatus,
  type ApiChatConversation,
  type ApiChatMessage,
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

// How tall the reply box may grow before it scrolls instead.
const composerMaxHeight = 132;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

const avatarColors = ["#6d5efc", "#2f9e6b", "#c2762b", "#b4497a", "#2f7fb8", "#7a5cc4"];

// One workspace serves both readers of a thread: the chat-agent editor, which
// passes an agentId and shows only that agent's inbox, and the Conversations
// page, which passes none and lists the whole account with an agent filter.
export default function ChatConversationsWorkspace({
  agentId,
  agents,
}: {
  agentId?: string;
  agents?: ConversationAgentOption[];
}) {
  const { getToken } = useAuth();
  const [conversations, setConversations] = useState<ApiChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [thread, setThread] = useState<ApiChatConversation | null>(null);
  const [threadError, setThreadError] = useState("");
  const [threadLoading, setThreadLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  // The transcript is a scrolling pane, so a message sent from the bottom of a
  // long thread would otherwise land out of sight.
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

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
  }, [agentFilter, agentId, getToken, reloadKey]);

  useEffect(() => {
    const timer = window.setInterval(() => setReloadKey((key) => key + 1), refreshMs);
    return () => window.clearInterval(timer);
  }, [agentId]);

  // The listing carries no messages, so opening a thread is a second request.
  // The summary row stays on screen while it loads, which keeps the pane from
  // emptying out between the click and the transcript. A thread loaded for an
  // earlier selection is ignored by the id check below rather than cleared here.
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    (async () => {
      setThreadLoading(true);
      setThreadError("");
      try {
        const full = await getChatConversation(selectedId, getToken);
        if (cancelled) return;
        setThread(full);
        setThreadLoading(false);
      } catch (loadError) {
        if (cancelled) return;
        setThreadError(loadError instanceof Error ? loadError.message : "Failed to load this conversation");
        setThreadLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, selectedId, reloadKey]);

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

  const selected = thread?.id === selectedId ? thread : null;
  const summary = conversations.find((conversation) => conversation.id === selectedId) ?? null;
  const openCount = conversations.filter((conversation) => conversation.status === "open").length;
  const canSend = Boolean(summary?.phone_number_id);

  const openThread = useCallback((id: string) => {
    setSelectedId(id);
    // An unsent draft belongs to the thread it was written in, never to the
    // next one opened.
    setDraft("");
    setThreadError("");
  }, []);

  const toggleStatus = useCallback(async () => {
    if (!summary) return;
    const next = summary.status === "open" ? "closed" : "open";
    setBusy(true);
    setThreadError("");
    try {
      const updated = await setChatConversationStatus(summary.id, next, getToken);
      setConversations((current) =>
        current.map((conversation) => (conversation.id === updated.id ? { ...conversation, ...updated } : conversation))
      );
      setThread((current) => (current && current.id === updated.id ? { ...current, ...updated } : current));
    } catch (updateError) {
      setThreadError(updateError instanceof Error ? updateError.message : "Failed to update this conversation");
    } finally {
      setBusy(false);
    }
  }, [getToken, summary]);

  // Sending writes on the thread as the agent, which is what the contact sees:
  // the message is appended to the open transcript and to the row's summary, so
  // neither has to wait for the next refresh to catch up.
  const sendMessage = useCallback(async () => {
    const body = draft.trim();
    if (!summary || !body || sending) return;
    setSending(true);
    setThreadError("");
    try {
      const message = await sendChatConversationMessage(summary.id, body, getToken);
      setDraft("");
      if (composerRef.current) composerRef.current.style.height = "auto";
      setThread((current) =>
        current && current.id === summary.id
          ? { ...current, messages: [...(current.messages ?? []), message] }
          : current
      );
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === summary.id
            ? {
                ...conversation,
                message_count: conversation.message_count + 1,
                last_message_role: message.role,
                last_message_at: message.created_at,
              }
            : conversation
        )
      );
      // After the bubble has been painted, not before it exists.
      requestAnimationFrame(() => {
        const pane = messagesRef.current;
        if (pane) pane.scrollTop = pane.scrollHeight;
      });
    } catch (sendError) {
      setThreadError(sendError instanceof Error ? sendError.message : "Failed to send this message");
    } finally {
      setSending(false);
    }
  }, [draft, getToken, sending, summary]);

  const removeThread = useCallback(async () => {
    if (!summary) return;
    if (!window.confirm(`Delete the conversation with ${conversationTitle(summary)}? Its messages go with it.`)) return;
    setBusy(true);
    setThreadError("");
    try {
      await deleteChatConversation(summary.id, getToken);
      setConversations((current) => current.filter((conversation) => conversation.id !== summary.id));
      setSelectedId("");
      setThread(null);
      setDraft("");
    } catch (deleteError) {
      setThreadError(deleteError instanceof Error ? deleteError.message : "Failed to delete this conversation");
    } finally {
      setBusy(false);
    }
  }, [getToken, summary]);

  return (
    <section className="cv-workspace">
      <style dangerouslySetInnerHTML={{ __html: workspaceCSS }} />

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
              onChange={(event) => {
                setAgentFilter(event.target.value);
                setSelectedId("");
              }}
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

      {loading && conversations.length === 0 ? (
        <div className="cv-empty">
          <span className="cv-spinner" />
          Loading conversations…
        </div>
      ) : null}

      {!loading && conversations.length === 0 && !error ? (
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
        // On a narrow screen the two panes take turns: the list until a thread
        // is picked, then the thread with a way back. Which one shows is a CSS
        // decision driven by this flag, so nothing re-mounts on resize.
        <div className={`cv-body${selectedId ? " is-thread-open" : ""}`}>
          <div className="cv-list">
            {visible.length === 0 ? (
              <div className="cv-list-empty">No thread matches that filter.</div>
            ) : (
              visible.map((conversation) => {
                const title = conversationTitle(conversation);
                return (
                  <motion.button
                    aria-pressed={conversation.id === selectedId}
                    className={`cv-row${conversation.id === selectedId ? " is-active" : ""}`}
                    key={conversation.id}
                    layoutId={`conversation-${conversation.id}`}
                    onClick={() => openThread(conversation.id)}
                    type="button"
                  >
                    <span className="cv-avatar" style={{ background: avatarColor(conversation.id) }}>
                      {title.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="cv-row-identity">
                      <span className="cv-row-name">{title}</span>
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
                    <span className={`cv-chip ${conversation.status === "closed" ? "cv-chip-closed" : "cv-chip-open"}`}>
                      {conversation.status}
                    </span>
                    <span className="cv-row-chevron"><ChevronIcon /></span>
                  </motion.button>
                );
              })
            )}
          </div>

          <div className="cv-thread">
            {!selectedId ? (
              <div className="cv-empty cv-empty-inline">
                <span className="cv-empty-icon">
                  <ChatIcon />
                </span>
                <strong>Pick a conversation</strong>
                <span>Its messages appear here, oldest first, and you can answer from the box below.</span>
              </div>
            ) : (
              <ExpandableCardDemoStandard
                className="cv-expandable-thread"
                layoutId={`conversation-${selectedId}`}
                onClose={() => setSelectedId("")}
                open
              >
                <div className="cv-thread-head">
                  <button className="cv-back" onClick={() => setSelectedId("")} type="button">
                    <BackIcon />
                    <span className="cv-sr-only">Back to conversations</span>
                  </button>
                  {summary ? (
                    <span className="cv-avatar cv-avatar-lg" style={{ background: avatarColor(summary.id) }}>
                      {conversationTitle(summary).slice(0, 1).toUpperCase()}
                    </span>
                  ) : null}
                  <div className="cv-thread-identity">
                    <h4>{summary ? conversationTitle(summary) : "Conversation"}</h4>
                    <p>
                      <span className="cv-thread-phone">{summary ? conversationPhone(summary) : ""}</span>
                      {summary?.last_message_at ? (
                        <span className="cv-thread-when"> · last message {formatDate(summary.last_message_at)}</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="cv-thread-actions">
                    <button disabled={busy || !summary} onClick={toggleStatus} type="button">
                      {summary?.status === "closed" ? "Reopen" : "Close"}
                    </button>
                    <button className="danger" disabled={busy || !summary} onClick={removeThread} type="button">
                      Delete
                    </button>
                  </div>
                </div>

                {threadError ? <div className="cv-error cv-error-inline">{threadError}</div> : null}

                <div className="cv-messages" ref={messagesRef}>
                  {threadLoading && !selected ? (
                    <div className="cv-empty cv-empty-inline">
                      <span className="cv-spinner" />
                      Loading messages…
                    </div>
                  ) : null}
                  {selected && (selected.messages?.length ?? 0) === 0 ? (
                    <div className="cv-empty cv-empty-inline">
                      <strong>Nothing saved on this thread</strong>
                      <span>The contact wrote in, but no reply was recorded.</span>
                    </div>
                  ) : null}
                  {withDayBreaks(selected?.messages ?? []).map((entry) =>
                    entry.kind === "day" ? (
                      <div className="cv-day" key={`day-${entry.label}`}>
                        <span>{entry.label}</span>
                      </div>
                    ) : (
                      <div className={`cv-msg cv-msg-${entry.message.role}`} key={entry.message.seq}>
                        {entry.message.role === "assistant" ? (
                          <span aria-hidden="true" className="cv-msg-avatar cv-msg-avatar-agent">
                            <BotIcon />
                          </span>
                        ) : (
                          <span
                            aria-hidden="true"
                            className="cv-msg-avatar"
                            style={{ background: avatarColor(summary?.id ?? selectedId) }}
                          >
                            {(summary ? conversationTitle(summary) : "?").slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <div className={`cv-bubble cv-bubble-${entry.message.role}`}>
                          <p>{entry.message.content}</p>
                          <span className="cv-bubble-time">{formatTime(entry.message.created_at)}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Writing here takes the conversation over from the agent: the
                    message leaves on the same number and joins the transcript
                    beside the agent's own replies. A thread whose number was
                    unpaired keeps its history but can no longer be written to. */}
                <div className="cv-composer">
                  <textarea
                    aria-label="Message to send"
                    disabled={!canSend || sending}
                    onChange={(event) => {
                      setDraft(event.target.value);
                      // Grow with the text up to a cap, then scroll: a long
                      // reply should not push the transcript off the screen.
                      const box = event.currentTarget;
                      box.style.height = "auto";
                      box.style.height = `${Math.min(box.scrollHeight, composerMaxHeight)}px`;
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                    placeholder={
                      canSend
                        ? "Write a reply — Enter to send, Shift+Enter for a new line"
                        : "This conversation's number is no longer connected to the account"
                    }
                    ref={composerRef}
                    rows={1}
                    value={draft}
                  />
                  <button
                    aria-label="Send message"
                    className="cv-send"
                    disabled={!canSend || sending || draft.trim() === ""}
                    onClick={() => void sendMessage()}
                    type="button"
                  >
                    <SendIcon />
                    <span className="cv-send-label">{sending ? "Sending…" : "Send"}</span>
                  </button>
                </div>
              </ExpandableCardDemoStandard>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

// withDayBreaks walks the transcript once and drops a date marker in wherever
// the day changes, so a thread that ran over a week reads as the several
// conversations it was rather than one unbroken wall.
type TranscriptEntry =
  | { kind: "day"; label: string }
  | { kind: "message"; message: ApiChatMessage };

function withDayBreaks(messages: ApiChatMessage[]): TranscriptEntry[] {
  const entries: TranscriptEntry[] = [];
  let lastDay = "";
  for (const message of messages) {
    const day = dayKey(message.created_at);
    if (day && day !== lastDay) {
      entries.push({ kind: "day", label: formatDay(message.created_at) });
      lastDay = day;
    }
    entries.push({ kind: "message", message });
  }
  return entries;
}

function dayKey(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toDateString();
}

function formatDay(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return dayFormatter.format(date);
}

// A thread keeps its history when the agent that answered it is deleted, so a
// chat_agent_id with no agent left to name is expected rather than an error.
function agentName(agents: ConversationAgentOption[], chatAgentId: string | null): string {
  if (!chatAgentId) return "Unassigned";
  return agents.find((agent) => agent.id === chatAgentId)?.name ?? "Deleted agent";
}

// The avatar colour is derived from the id so a contact keeps the same one
// between visits without anything having to be stored.
function avatarColor(id: string): string {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
  return avatarColors[hash % avatarColors.length];
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function formatTime(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : timeFormatter.format(date);
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

function ChatIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" width="24">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 20.5l1.6-4.6A8.3 8.3 0 0 1 3.6 11 8.4 8.4 0 0 1 12 3h.5a8.4 8.4 0 0 1 8.5 8.5z" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24" width="15">
      <rect height="11" rx="3" width="16" x="4" y="8" />
      <path d="M12 8V4.5" />
      <circle cx="12" cy="3.5" r="1" />
      <path d="M9 13.5h.01M15 13.5h.01" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="17" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="17">
      <path d="M15 19l-7-7 7-7" />
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

function SendIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24" width="16">
      <path d="M4 12l16-8-6 16-2.5-6.5L4 12z" />
    </svg>
  );
}

const workspaceCSS = `
.cv-workspace{display:flex;flex-direction:column;gap:12px;height:100%;min-height:0}
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

.cv-error{background:var(--app-rose-soft);border:1px solid var(--app-rose-border);border-radius:10px;color:var(--app-rose-text);flex:0 0 auto;font-size:11.5px;padding:9px 11px}
.cv-error-inline{border-radius:0;border-width:0 0 1px}

.cv-empty{align-items:center;color:var(--app-muted);display:flex;flex:1 1 auto;flex-direction:column;font-size:12.5px;gap:8px;justify-content:center;min-height:200px;padding:24px;text-align:center}
.cv-empty strong{color:var(--app-text-strong);font-size:15px}
.cv-empty>span:last-child{line-height:1.65;max-width:44ch}
.cv-empty-inline{min-height:0}
.cv-empty-icon{align-items:center;background:var(--app-primary-soft);border:1px solid var(--app-primary-ring);border-radius:15px;color:var(--app-primary-text);display:flex;height:50px;justify-content:center;width:50px}
.cv-spinner{animation:cv-spin .8s linear infinite;border:2px solid var(--app-line-strong);border-radius:50%;border-top-color:var(--app-primary);height:19px;width:19px}
@keyframes cv-spin{to{transform:rotate(360deg)}}

.cv-body{display:grid;flex:1 1 auto;grid-template-columns:minmax(0,1fr);min-height:0}

.expandable-card-backdrop{background:var(--app-overlay);inset:0;position:fixed;z-index:80}
.expandable-card-stage{align-items:center;display:flex;inset:0;justify-content:center;padding:24px;pointer-events:none;position:fixed;z-index:90}
.expandable-card-panel{pointer-events:auto}
.cv-expandable-thread{background:var(--app-surface-2);border:1px solid var(--app-line-strong);border-radius:20px;box-shadow:0 30px 90px var(--app-shadow-color),0 0 0 1px var(--app-primary-ring);display:flex;flex-direction:column;height:min(720px,calc(100vh - 48px));max-width:900px;min-height:420px;overflow:hidden;width:100%}
.cv-expandable-thread .cv-back{display:flex}

.cv-list{display:flex;flex-direction:column;gap:10px;min-height:0;overflow-y:auto;padding-right:3px}
.cv-list-empty{color:var(--app-muted);font-size:12px;padding:16px 6px;text-align:center}
.cv-row{align-items:center;background:var(--app-elevated);border:1px solid var(--app-line);border-radius:14px;cursor:pointer;display:grid;flex:0 0 auto;gap:16px;grid-template-areas:"avatar identity meta time status chevron";grid-template-columns:36px minmax(180px,1.2fr) minmax(160px,.9fr) auto auto 18px;padding:13px 16px;text-align:left;transition:background .16s ease,border-color .16s ease,box-shadow .16s ease;width:100%}
.cv-row:hover{background:var(--app-panel-hover);border-color:var(--app-primary-ring);box-shadow:0 6px 18px var(--app-shadow-soft)}
.cv-row:focus-visible{border-color:var(--app-primary);box-shadow:0 0 0 3px var(--app-primary-soft);outline:none}
.cv-row.is-active{background:var(--app-primary-soft);border-color:var(--app-primary-ring)}
.cv-row>.cv-avatar{grid-area:avatar}
.cv-row-identity{display:grid;gap:3px;grid-area:identity;min-width:0}
.cv-avatar{align-items:center;border-radius:50%;color:#fff;display:flex;flex:0 0 auto;font-size:12.5px;font-weight:800;height:34px;justify-content:center;width:34px}
.cv-avatar-lg{font-size:14px;height:38px;width:38px}
.cv-row-name{color:var(--app-text-strong);font-size:13px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-row-time{color:var(--app-faint);font-size:10.5px;grid-area:time;white-space:nowrap}
.cv-row-phone{color:var(--app-muted);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-row-meta{align-items:center;display:flex;flex-wrap:wrap;gap:7px;grid-area:meta;min-width:0}
.cv-row-count{color:var(--app-muted);font-size:11px;white-space:nowrap}
.cv-row-agent{background:var(--app-panel-hover);border-radius:999px;color:var(--app-muted);font-size:9.5px;font-weight:700;max-width:14ch;overflow:hidden;padding:2px 7px;text-overflow:ellipsis;white-space:nowrap}
.cv-row.is-active .cv-row-agent{background:var(--app-elevated)}
.cv-chip{border-radius:999px;font-size:9.5px;font-weight:800;grid-area:status;letter-spacing:.3px;padding:3px 8px;text-transform:uppercase;white-space:nowrap}
.cv-chip-open{background:var(--app-green-soft);color:var(--app-green)}
.cv-chip-closed{background:var(--app-slate-soft);color:var(--app-slate)}
.cv-row-chevron{color:var(--app-faint);display:inline-flex;grid-area:chevron;transition:color .16s ease,transform .16s ease}
.cv-row:hover .cv-row-chevron{color:var(--app-primary-text);transform:translateX(2px)}

.cv-thread{display:contents}
.cv-thread>.cv-empty{display:none}
.cv-thread-head{align-items:center;background:var(--app-surface);border-bottom:1px solid var(--app-line);display:flex;flex:0 0 auto;gap:10px;padding:11px 14px}
.cv-thread-identity{min-width:0}
.cv-thread-head h4{color:var(--app-text-strong);font-size:13.5px;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-thread-head p{color:var(--app-muted);font-size:11px;margin:2px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-thread-phone{color:var(--app-text-soft);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:700}
.cv-thread-actions{display:flex;gap:4px;margin-left:auto}
.cv-thread-actions button{background:transparent;border:1px solid transparent;border-radius:8px;color:var(--app-primary-text);cursor:pointer;font-size:11px;font-weight:750;padding:5px 9px;white-space:nowrap}
.cv-thread-actions button:hover{background:var(--app-panel-hover)}
.cv-thread-actions button.danger{color:var(--app-rose)}
.cv-thread-actions button:disabled{cursor:not-allowed;opacity:.4}
.cv-back{align-items:center;background:var(--app-panel-hover);border:1px solid var(--app-line);border-radius:9px;color:var(--app-text-soft);cursor:pointer;display:none;flex:0 0 auto;height:32px;justify-content:center;width:32px}
.cv-sr-only{clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}

.cv-messages{display:flex;flex:1 1 auto;flex-direction:column;gap:12px;min-height:0;overflow-y:auto;padding:14px}
.cv-day{align-items:center;color:var(--app-faint);display:flex;font-size:10px;font-weight:700;gap:9px;letter-spacing:.4px;margin:4px 0;text-transform:uppercase}
.cv-day::before,.cv-day::after{background:var(--app-line);content:"";flex:1;height:1px}
/* One message = avatar + pill bubble. The contact sits on the left, the agent
   on the right (row-reverse), matching a familiar messenger layout. */
.cv-msg{align-items:flex-start;display:flex;gap:9px;max-width:min(78%,560px)}
.cv-msg-user{align-self:flex-start}
.cv-msg-assistant{align-self:flex-end;flex-direction:row-reverse}
.cv-msg-avatar{align-items:center;border-radius:50%;color:#fff;display:flex;flex:0 0 auto;font-size:11.5px;font-weight:800;height:30px;justify-content:center;margin-top:1px;width:30px}
.cv-msg-avatar-agent{background:linear-gradient(140deg,var(--app-primary-2),var(--app-primary));color:var(--app-on-accent)}
.cv-bubble{background:var(--app-elevated);border:1px solid var(--app-line);border-radius:18px;min-width:0;padding:9px 14px;position:relative}
.cv-bubble p{font-size:12.5px;line-height:1.6;margin:0;overflow-wrap:anywhere;white-space:pre-wrap}
.cv-bubble-user p{color:var(--app-text-soft)}
.cv-bubble-assistant p{color:var(--app-text)}
/* The screenshot look keeps the bubbles clean, so the time only fades in when
   the message is pointed at. */
.cv-bubble-time{bottom:-15px;color:var(--app-faint);font-size:9.5px;opacity:0;pointer-events:none;position:absolute;transition:opacity .15s ease;white-space:nowrap}
.cv-bubble-user .cv-bubble-time{left:6px}
.cv-bubble-assistant .cv-bubble-time{right:6px}
.cv-msg:hover .cv-bubble-time{opacity:1}

.cv-composer{align-items:flex-end;background:var(--app-surface);border-top:1px solid var(--app-line);display:flex;flex:0 0 auto;gap:8px;padding:10px 12px}
.cv-composer textarea{background:var(--app-elevated);border:1px solid var(--app-line);border-radius:11px;color:var(--app-text);flex:1 1 auto;font:inherit;font-size:12.5px;line-height:1.55;max-height:${composerMaxHeight}px;min-height:38px;min-width:0;outline:none;overflow-y:auto;padding:9px 11px;resize:none}
.cv-composer textarea:focus{border-color:var(--app-primary);box-shadow:0 0 0 3px var(--app-primary-soft)}
.cv-composer textarea::placeholder{color:var(--app-subtle)}
.cv-composer textarea:disabled{cursor:not-allowed;opacity:.55}
.cv-send{align-items:center;background:linear-gradient(140deg,var(--app-primary-2),var(--app-primary));border:0;border-radius:11px;color:var(--app-on-accent);cursor:pointer;display:inline-flex;flex:0 0 auto;font-size:12px;font-weight:800;gap:7px;height:38px;justify-content:center;padding:0 14px}
.cv-send:hover{filter:brightness(1.08)}
.cv-send:disabled{cursor:not-allowed;filter:grayscale(.35);opacity:.45}

/* Tablet: the list gives up its comfort before the transcript does. */
@media(max-width:1100px){
  .cv-row{grid-template-areas:"avatar identity meta status chevron";grid-template-columns:36px minmax(180px,1fr) minmax(140px,.8fr) auto 18px}
  .cv-row-time{display:none}
  .cv-msg{max-width:86%}
}

/* Phone: one pane at a time — the list, then the thread with a way back. */
@media(max-width:760px){
  .cv-toolbar{align-items:stretch;flex-direction:column}
  .cv-search{max-width:none}
  .cv-toolbar-right{justify-content:space-between}
  .cv-filter{flex:1 1 120px;max-width:none}
  .cv-count{display:none}
  .cv-body{grid-template-columns:minmax(0,1fr)}
  .cv-row{gap:10px;grid-template-areas:"avatar identity status chevron" "avatar meta meta meta";grid-template-columns:36px minmax(0,1fr) auto 18px;padding:12px}
  .cv-back{display:flex}
  .cv-thread-actions button{padding:5px 7px}
  .cv-msg{max-width:92%}
  .cv-send{padding:0 12px;width:44px}
  .cv-send-label{display:none}
  .expandable-card-stage{align-items:stretch;padding:0}
  .cv-expandable-thread{border-radius:0;height:100vh;max-width:none;min-height:0}
}

@media(max-width:420px){
  .cv-avatar-lg{display:none}
  .cv-thread-head{gap:8px;padding:10px}
  .cv-messages{padding:11px}
}
`;
