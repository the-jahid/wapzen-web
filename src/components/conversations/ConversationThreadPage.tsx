"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { AiReplySwitch, avatarColor, conversationPartsCSS, formatDate } from "@/components/chat/ConversationParts";
import ConversationsShell from "@/components/conversations/ConversationsShell";
import {
  conversationPhone,
  conversationTitle,
  deleteChatConversation,
  getChatConversation,
  sendChatConversationMessage,
  setChatConversationAiReply,
  setChatConversationStatus,
  type ApiChatConversation,
  type ApiChatMessage,
} from "@/lib/chatConversations";
import { updateCachedEntries, useCachedState } from "@/lib/pageCache";
import { startRefreshing } from "@/lib/polling";

// A chat thread arrives whenever somebody writes in, so the transcript asks for
// new messages on a timer rather than waiting to be told.
const refreshMs = 15000;

// How tall the reply box may grow before it scrolls instead.
const composerMaxHeight = 132;

const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

// Every cached conversation list starts with this, whichever inbox it belongs to.
const cachedListsPrefix = "chat-conversations:";

// Keeps the lists the user goes back to in step with what happened here, so a
// row doesn't show its old state, or linger after a delete, until the refetch.
function patchCachedLists(id: string, patch: (conversation: ApiChatConversation) => ApiChatConversation) {
  updateCachedEntries<ApiChatConversation[]>(cachedListsPrefix, (list) =>
    list.map((conversation) => (conversation.id === id ? patch(conversation) : conversation))
  );
}

// One conversation on a page of its own. The list seeds the cache with the row
// that was clicked, so the header is right from the first frame and only the
// transcript has to wait for this page's request.
export default function ConversationThreadPage({
  conversationId,
  fromAgentId,
}: {
  conversationId: string;
  fromAgentId?: string;
}) {
  const { getToken } = useAuth();
  const router = useRouter();
  const backHref = fromAgentId ? `/dashboard/chat/${encodeURIComponent(fromAgentId)}` : "/dashboard/conversations";

  const [thread, setThread] = useCachedState<ApiChatConversation | null>(`chat-conversation:${conversationId}`, null);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiSaving, setAiSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  // The transcript is a scrolling pane, so a message sent from the bottom of a
  // long thread would otherwise land out of sight.
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  // The thread as last drawn, for a refresh to read without restarting on it.
  const threadRef = useRef(thread);
  useEffect(() => {
    threadRef.current = thread;
  }, [thread]);
  // Set once this visit holds the whole transcript. Until then, and whenever the
  // count says something is missing, a refresh reads all of it.
  const haveWholeThread = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const known = haveWholeThread.current ? threadRef.current?.messages : undefined;
        const afterSeq = known?.[known.length - 1]?.seq;
        if (known && afterSeq !== undefined) {
          const newer = await getChatConversation(conversationId, getToken, { afterSeq });
          if (cancelled) return;
          const messages = [...known, ...(newer.messages ?? []).filter((message) => message.seq > afterSeq)];
          if (messages.length === newer.message_count) {
            setThread({ ...newer, messages });
            setError("");
            return;
          }
        }
        const full = await getChatConversation(conversationId, getToken);
        if (cancelled) return;
        haveWholeThread.current = full.messages?.length === full.message_count;
        setThread(full);
        setError("");
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load this conversation");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId, getToken, reloadKey, setThread]);

  useEffect(() => startRefreshing(() => setReloadKey((key) => key + 1), refreshMs), []);

  // A seeded row has no messages yet; only the thread's own response carries them.
  const messages = thread?.messages;
  const canSend = Boolean(thread?.phone_number_id);
  const title = thread ? conversationTitle(thread) : "Conversation";
  const aiOn = thread?.ai_reply_enabled !== false;

  const toggleStatus = useCallback(async () => {
    if (!thread) return;
    setBusy(true);
    setError("");
    try {
      const updated = await setChatConversationStatus(
        thread.id,
        thread.status === "open" ? "closed" : "open",
        getToken
      );
      setThread((current) => (current ? { ...current, ...updated } : current));
      patchCachedLists(updated.id, (conversation) => ({ ...conversation, ...updated }));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update this conversation");
    } finally {
      setBusy(false);
    }
  }, [getToken, setThread, thread]);

  // Flips the switch at once and puts it back if the server refuses, so it
  // answers the click without waiting on the round trip.
  const toggleAiReply = useCallback(async () => {
    if (!thread || aiSaving) return;
    const next = thread.ai_reply_enabled === false;
    const apply = (ai_reply_enabled: boolean) => {
      setThread((current) => (current ? { ...current, ai_reply_enabled } : current));
      patchCachedLists(thread.id, (conversation) => ({ ...conversation, ai_reply_enabled }));
    };
    setAiSaving(true);
    setError("");
    apply(next);
    try {
      await setChatConversationAiReply(thread.id, next, getToken);
    } catch (updateError) {
      apply(!next);
      setError(updateError instanceof Error ? updateError.message : "Failed to switch the AI for this contact");
    } finally {
      setAiSaving(false);
    }
  }, [aiSaving, getToken, setThread, thread]);

  // Sending writes on the thread as the agent, which is what the contact sees.
  // The message is appended straight away rather than waiting for the refresh.
  // Replying leaves the AI as it is: only the switch turns it off.
  const sendMessage = useCallback(async () => {
    const body = draft.trim();
    if (!thread || !body || sending) return;
    setSending(true);
    setError("");
    try {
      const message = await sendChatConversationMessage(thread.id, body, getToken);
      setDraft("");
      if (composerRef.current) composerRef.current.style.height = "auto";
      const summary = { last_message_role: message.role, last_message_at: message.created_at };
      setThread((current) =>
        current
          ? {
              ...current,
              ...summary,
              message_count: current.message_count + 1,
              messages: [...(current.messages ?? []), message],
            }
          : current
      );
      patchCachedLists(thread.id, (conversation) => ({
        ...conversation,
        ...summary,
        message_count: conversation.message_count + 1,
      }));
      // After the bubble has been painted, not before it exists.
      requestAnimationFrame(() => {
        const pane = messagesRef.current;
        if (pane) pane.scrollTop = pane.scrollHeight;
      });
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Failed to send this message");
    } finally {
      setSending(false);
    }
  }, [draft, getToken, sending, setThread, thread]);

  // On success the dialog stays up, saying "Deleting…", until the list replaces
  // this page. `replace` keeps Back from returning to a thread that is gone.
  const removeThread = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      await deleteChatConversation(conversationId, getToken);
      updateCachedEntries<ApiChatConversation[]>(cachedListsPrefix, (list) =>
        list.filter((conversation) => conversation.id !== conversationId)
      );
      router.replace(backHref);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete this conversation");
      setBusy(false);
      setConfirmingDelete(false);
    }
  }, [backHref, conversationId, getToken, router]);

  useEffect(() => {
    if (!confirmingDelete) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setConfirmingDelete(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, confirmingDelete]);

  return (
    <ConversationsShell activeLabel={fromAgentId ? "Chat Agents" : "Conversations"} flush label={`Conversation with ${title}`}>
      <div className="cv-thread">
        <style dangerouslySetInnerHTML={{ __html: conversationPartsCSS + threadCSS }} />

        <div className="cv-thread-head">
          <Link
            aria-label={fromAgentId ? "Back to this agent" : "Back to conversations"}
            className="cv-back"
            href={backHref}
            title={fromAgentId ? "Back to this agent" : "Back to conversations"}
          >
            <BackIcon />
          </Link>
          {thread ? (
            <span className="cv-avatar cv-avatar-lg" style={{ background: avatarColor(thread.id) }}>
              {title.slice(0, 1).toUpperCase()}
            </span>
          ) : null}
          <div className="cv-thread-identity">
            <h1>{title}</h1>
            <p>
              <span className="cv-thread-phone">{thread ? conversationPhone(thread) : ""}</span>
              {thread?.last_message_at ? (
                <span className="cv-thread-when"> · last message {formatDate(thread.last_message_at)}</span>
              ) : null}
            </p>
          </div>
          <div className="cv-thread-actions">
            {thread ? <AiReplySwitch busy={aiSaving} onToggle={() => void toggleAiReply()} on={aiOn} /> : null}
            <button disabled={busy || !thread} onClick={() => void toggleStatus()} type="button">
              {thread?.status === "closed" ? <ReopenIcon /> : <CloseThreadIcon />}
              {thread?.status === "closed" ? "Reopen" : "Close"}
            </button>
            <button
              className="danger"
              disabled={busy || !thread}
              onClick={() => setConfirmingDelete(true)}
              type="button"
            >
              <TrashIcon size={14} />
              Delete
            </button>
          </div>
        </div>

        {error ? <div className="cv-error cv-error-inline">{error}</div> : null}
        {thread && !aiOn ? (
          <div className="cv-ai-off-note">
            AI replies are off for this contact. Their messages still arrive here; answer them from the box below.
          </div>
        ) : null}

        <div className="cv-messages" ref={messagesRef}>
          {messages === undefined && !error ? (
            <div className="cv-empty">
              <span className="cv-spinner" />
              Loading messages…
            </div>
          ) : null}
          {messages?.length === 0 ? (
            <div className="cv-empty">
              <strong>Nothing saved on this thread</strong>
              <span>The contact wrote in, but no reply was recorded.</span>
            </div>
          ) : null}
          {withDayBreaks(messages ?? []).map((entry) =>
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
                    style={{ background: avatarColor(conversationId) }}
                  >
                    {title.slice(0, 1).toUpperCase()}
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

        {/* Writing here replies as the business: the message leaves on the same
            number and joins the transcript beside the agent's own replies. The
            AI stays as it is. A thread whose number was unpaired keeps its
            history but can no longer be written to. */}
        <div className="cv-composer">
          <textarea
            aria-label="Message to send"
            disabled={!canSend || sending}
            onChange={(event) => {
              setDraft(event.target.value);
              // Grow with the text up to a cap, then scroll: a long reply should
              // not push the transcript off the screen.
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

        {confirmingDelete && thread ? (
          <div
            className="cv-modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !busy) setConfirmingDelete(false);
            }}
          >
            <div
              aria-describedby="cv-delete-copy"
              aria-labelledby="cv-delete-title"
              aria-modal="true"
              className="cv-modal"
              role="alertdialog"
            >
              <div className="cv-modal-icon">
                <TrashIcon />
              </div>
              <h2 className="cv-modal-title" id="cv-delete-title">
                Delete conversation
              </h2>
              <p className="cv-modal-copy" id="cv-delete-copy">
                The conversation with <strong>{title}</strong> and all of its messages will be deleted. This cannot be
                undone.
              </p>
              <div className="cv-modal-actions">
                <button
                  autoFocus
                  className="cv-modal-btn"
                  disabled={busy}
                  onClick={() => setConfirmingDelete(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="cv-modal-btn cv-modal-btn-danger"
                  disabled={busy}
                  onClick={() => void removeThread()}
                  type="button"
                >
                  {busy ? "Deleting…" : "Delete conversation"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </ConversationsShell>
  );
}

// withDayBreaks walks the transcript once and drops a date marker in wherever
// the day changes, so a thread that ran over a week reads as the several
// conversations it was rather than one unbroken wall.
type TranscriptEntry = { kind: "day"; label: string } | { kind: "message"; message: ApiChatMessage };

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

function formatTime(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : timeFormatter.format(date);
}

function TrashIcon({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24" width={size}>
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
    </svg>
  );
}

function CloseThreadIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

function ReopenIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
      <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5" />
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

function SendIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24" width="16">
      <path d="M4 12l16-8-6 16-2.5-6.5L4 12z" />
    </svg>
  );
}

const threadCSS = `
.cv-thread{display:flex;flex:1 1 auto;flex-direction:column;height:100%;min-height:0}
.cv-thread *{box-sizing:border-box}

.cv-error-inline{border-radius:0;border-width:0 0 1px}
.cv-avatar-lg{font-size:14px;height:38px;width:38px}
.cv-ai-off-note{background:var(--app-slate-soft);border-bottom:1px solid var(--app-line);color:var(--app-text-soft);flex:0 0 auto;font-size:11.5px;line-height:1.5;padding:8px 14px}

.cv-thread-head{align-items:center;background:var(--app-surface);border-bottom:1px solid var(--app-line);display:flex;flex:0 0 auto;gap:10px;padding:11px 14px}
.cv-thread-identity{min-width:0}
.cv-thread-head h1{color:var(--app-text-strong);font-size:13.5px;font-weight:800;line-height:1.5;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-thread-head p{color:var(--app-muted);font-size:11px;margin:2px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-thread-phone{color:var(--app-text-soft);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:700}
.cv-thread-actions{display:flex;flex:0 0 auto;gap:4px;margin-left:auto}
.cv-thread-actions button{align-items:center;display:inline-flex;gap:5px;background:transparent;border:1px solid transparent;border-radius:8px;color:var(--app-primary-text);cursor:pointer;font-size:11px;font-weight:750;padding:5px 9px;white-space:nowrap}
.cv-thread-actions button:hover{background:var(--app-panel-hover)}
.cv-thread-actions button.danger{color:var(--app-rose)}
.cv-thread-actions button:disabled{cursor:not-allowed;opacity:.4}
.cv-thread-actions .cv-ai-switch{color:var(--app-muted);margin-right:6px}
.cv-thread-actions .cv-ai-switch.is-on{color:var(--app-text-strong)}
.cv-thread-actions .cv-ai-switch:hover{background:none}
.cv-back{align-items:center;background:var(--app-panel-hover);border:1px solid var(--app-line);border-radius:9px;color:var(--app-text-soft);display:flex;flex:0 0 auto;height:32px;justify-content:center;width:32px}
.cv-back:hover{color:var(--app-text-strong)}
.cv-back:focus-visible{outline:2px solid var(--app-primary);outline-offset:2px}

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
.cv-bubble-assistant{background:var(--app-primary-soft);border-color:var(--app-primary-border)}
.cv-bubble-assistant p{color:var(--app-text)}
/* The bubbles stay clean, so the time only fades in when the message is
   pointed at. */
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

/* Delete confirmation. */
.cv-modal-overlay{align-items:center;animation:cv-fade-in .16s ease;backdrop-filter:blur(3px);background:var(--app-overlay);display:flex;inset:0;justify-content:center;padding:24px;position:fixed;z-index:120}
.cv-modal{animation:cv-modal-in .18s ease;background:var(--app-surface);border:1px solid var(--app-line);border-radius:18px;box-shadow:0 30px 80px var(--app-shadow-color-strong);max-width:420px;padding:22px;width:100%}
.cv-modal-icon{align-items:center;background:var(--app-rose-soft);border:1px solid var(--app-rose-border);border-radius:12px;color:var(--app-rose);display:inline-flex;height:42px;justify-content:center;margin-bottom:14px;width:42px}
.cv-modal-title{color:var(--app-text-strong);font-size:17px;font-weight:850;letter-spacing:-.2px;margin:0}
.cv-modal-copy{color:var(--app-muted);font-size:13px;line-height:1.55;margin:8px 0 0}
.cv-modal-copy strong{color:var(--app-text-strong);font-weight:800}
.cv-modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}
.cv-modal-btn{background:var(--app-elevated);border:1px solid var(--app-line);border-radius:10px;color:var(--app-text);cursor:pointer;font:inherit;font-size:12.5px;font-weight:800;height:38px;padding:0 16px}
.cv-modal-btn:hover{background:var(--app-panel-hover)}
.cv-modal-btn:focus-visible{outline:2px solid var(--app-primary);outline-offset:2px}
.cv-modal-btn-danger{background:var(--app-rose);border-color:transparent;color:#fff}
.cv-modal-btn-danger:hover{background:var(--app-rose);filter:brightness(1.08)}
.cv-modal-btn:disabled{cursor:not-allowed;opacity:.55}
@keyframes cv-fade-in{from{opacity:0}to{opacity:1}}
@keyframes cv-modal-in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.cv-modal-overlay,.cv-modal{animation:none}}

@media(max-width:1100px){
  .cv-msg{max-width:86%}
}

@media(max-width:760px){
  /* The header is tight on a phone; the track says on or off by itself. */
  .cv-thread-actions .cv-ai-label{display:none}
  .cv-thread-when{display:none}
  .cv-modal-actions{flex-direction:column-reverse}
  .cv-modal-btn{width:100%}
  .cv-thread-actions button{padding:5px 7px}
  .cv-msg{max-width:92%}
  .cv-send{padding:0 12px;width:44px}
  .cv-send-label{display:none}
  .cv-composer{padding-bottom:calc(10px + env(safe-area-inset-bottom))}
  /* 16px stops iOS Safari zooming the page when a field is focused. */
  .cv-composer textarea{font-size:16px}
  .cv-modal-overlay{align-items:flex-end;padding:0}
  .cv-modal{border-radius:18px 18px 0 0;max-width:none;padding:20px 18px calc(18px + env(safe-area-inset-bottom))}
}

@media(max-width:420px){
  .cv-avatar-lg{display:none}
  .cv-thread-head{gap:8px;padding:10px}
  .cv-messages{padding:11px}
  .cv-thread-actions button{font-size:10.5px;padding:5px 6px}
}

/* Touch screens cannot hover, so the message times are always shown there. */
@media(hover:none){
  .cv-bubble-time{opacity:1}
  .cv-msg{margin-bottom:12px}
}
`;
