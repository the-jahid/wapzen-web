"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import ConversationPager, {
  CONVERSATION_PAGE_SIZE,
  useDebouncedValue,
} from "@/components/conversations/ConversationPager";
import ConversationsShell from "@/components/conversations/ConversationsShell";
import { PaneListSkeleton } from "@/components/ui/Skeleton";
import { avatarColor, formatDate } from "@/components/chat/ConversationParts";
import { useCachedState, writeCachedEntry } from "@/lib/pageCache";
import { startRefreshing } from "@/lib/polling";
import {
  conversationPhone,
  conversationTitle,
  getChatConversationsVersion,
  listChatConversations,
  type ApiChatConversation,
} from "@/lib/chatConversations";

// A thread arrives whenever somebody writes in, so the list re-reads itself on
// a timer. It first asks whether anything changed and only then downloads.
const refreshMs = 15000;
const listAtLeastEvery = 20;

type ListMeta = { key: string; total: number; totalPages: number };
const emptyMeta: ListMeta = { key: "", total: 0, totalPages: 1 };

// The Conversations page in Retell's master-detail layout: the account's
// contacts in a list pane on the left, the open thread on the right. The URL
// says which thread is open; the bare route opens the most recent one, which
// is why `children` may be a function of the first thread's id.
export default function ConversationsSplit({
  activeId,
  children,
}: {
  activeId?: string;
  children: ReactNode | ((firstId: string | null) => ReactNode);
}) {
  const { getToken } = useAuth();
  // The same cache entry the thread page patches, so a delete, a status change
  // or a sent message shows in the list straight away. It holds the page last
  // read, so the rows stay on screen while the next page loads.
  const [conversations, setConversations, hasCachedList] = useCachedState<ApiChatConversation[]>(
    "chat-conversations:split",
    []
  );
  // What the rows above are: which request they answer and how many threads
  // match it in all. Not under the "chat-conversations:" prefix, which the
  // thread page treats as lists of rows.
  const [listMeta, setListMeta] = useCachedState<ListMeta>("conversations-list-meta:split", emptyMeta);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useCachedState("conversations-search:all", "");
  const [statusFilter, setStatusFilter] = useCachedState("conversations-status:all", "");
  const [page, setPage] = useCachedState("conversations-page:split", 1);
  const listRef = useRef<HTMLElement | null>(null);
  // Search and status filter on the server, so they reach every page.
  const query = useDebouncedValue(search.trim());
  const status = statusFilter === "open" || statusFilter === "closed" ? statusFilter : undefined;
  const requestKey = `${page}|${status ?? ""}|${query}`;
  // Rows from another page or filter are still showing while this one loads.
  const isStale = hasCachedList && listMeta.key !== requestKey;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await listChatConversations(getToken, {
          page,
          limit: CONVERSATION_PAGE_SIZE,
          status,
          search: query || undefined,
        });
        if (cancelled) return;
        // A page emptied by deletes, or one past the end after a filter shrank
        // the list: go to the last page that has threads instead.
        if (result.items.length === 0 && page > 1 && result.total > 0) {
          setPage(result.totalPages);
          return;
        }
        if (result.items.length === 0 && page > 1) setPage(1);
        setConversations(result.items);
        setListMeta({ key: requestKey, total: result.total, totalPages: result.totalPages });
        setError("");
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load conversations");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, page, query, reloadKey, requestKey, setConversations, setListMeta, setPage, status]);

  useEffect(() => {
    let cancelled = false;
    let knownVersion: string | null = null;
    let turnsSinceList = 0;
    const stop = startRefreshing(async () => {
      const version = await getChatConversationsVersion(getToken, {}).catch(() => null);
      if (cancelled) return;
      turnsSinceList += 1;
      if (version !== null && version === knownVersion && turnsSinceList < listAtLeastEvery) return;
      knownVersion = version;
      turnsSinceList = 0;
      setReloadKey((key) => key + 1);
    }, refreshMs);
    return () => {
      cancelled = true;
      stop();
    };
  }, [getToken]);

  // The server already filtered; this only hides a row the thread page closed
  // or reopened since, until the next read moves it.
  const visible = useMemo(
    () => (status ? conversations.filter((conversation) => conversation.status === status) : conversations),
    [conversations, status]
  );

  const goToPage = (next: number) => {
    setPage(next);
    listRef.current?.scrollTo({ top: 0 });
  };

  const firstId = conversations[0]?.id ?? null;
  const shownId = activeId;
  const isLoadingEmpty = loading && !hasCachedList && conversations.length === 0;
  const isFiltered = Boolean(status || query);

  return (
    <ConversationsShell label="Conversations" split>
      <style dangerouslySetInnerHTML={{ __html: splitCSS }} />
      <div className={`conv-split${activeId ? " has-selection" : ""}`}>
        <aside aria-label="Contacts" className="conv-pane-list">
          <div className="conv-pane-head">
            <ChatBubbleIcon />
            <h1 className="conv-pane-title">Conversations</h1>
            <button
              aria-label="Refresh conversations"
              className="conv-pane-refresh"
              disabled={loading}
              onClick={() => setReloadKey((key) => key + 1)}
              title="Refresh"
              type="button"
            >
              <RefreshIcon />
            </button>
          </div>
          <div className="conv-pane-filters">
            <label className="conv-pane-search">
              <SearchIcon />
              <input
                aria-label="Search contacts"
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search contacts..."
                value={search}
              />
            </label>
            <select
              aria-label="Filter by status"
              className="conv-pane-select"
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              value={statusFilter}
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <nav className={`conv-pane-items${isStale ? " is-stale" : ""}`} ref={listRef}>
            {error && conversations.length === 0 ? (
              <p className="conv-pane-note">{error}</p>
            ) : isLoadingEmpty ? (
              <PaneListSkeleton />
            ) : conversations.length === 0 && !isFiltered ? (
              <p className="conv-pane-note">
                No conversations yet. Every WhatsApp message your chat agents answer is saved here.
              </p>
            ) : visible.length === 0 ? (
              <p className="conv-pane-note">No contact matches that filter.</p>
            ) : (
              visible.map((conversation) => {
                const title = conversationTitle(conversation);
                const isActive = conversation.id === shownId;
                const aiOff = conversation.ai_reply_enabled === false;
                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`conv-pane-item${isActive ? " is-active" : ""}${
                      conversation.needs_attention ? " is-human-needed" : ""
                    }`}
                    href={`/dashboard/conversations/${conversation.id}`}
                    key={conversation.id}
                    // Hands the row to the thread's cache entry, so the header
                    // is right from the first frame.
                    onClick={() =>
                      writeCachedEntry<ApiChatConversation>(`chat-conversation:${conversation.id}`, (current) => ({
                        ...current,
                        ...conversation,
                      }))
                    }
                    prefetch={false}
                  >
                    <span className="conv-pane-avatar" style={{ background: avatarColor(conversation.id) }}>
                      {title.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="conv-pane-item-body">
                      <span className="conv-pane-item-top">
                        <span className="conv-pane-item-name notranslate">{title}</span>
                        <span className="conv-pane-item-time">
                          {formatDate(conversation.last_message_at ?? conversation.created_at)}
                        </span>
                      </span>
                      <span className="conv-pane-item-sub">
                        <span className="notranslate">{conversationPhone(conversation)}</span>
                        {conversation.needs_attention ? (
                          <span className="conv-pane-tag is-rose">Human needed</span>
                        ) : aiOff ? (
                          <span className="conv-pane-tag">AI off</span>
                        ) : null}
                        {conversation.status === "closed" ? <span className="conv-pane-tag">Closed</span> : null}
                      </span>
                    </span>
                  </Link>
                );
              })
            )}
          </nav>
          <ConversationPager
            busy={isStale}
            label="Conversation pages"
            onPage={goToPage}
            page={page}
            total={listMeta.total}
            totalPages={listMeta.totalPages}
          />
        </aside>

        {/* Phones and tablets: the open thread slides in as a drawer over the
            list; tapping the dimmed list behind it closes the drawer. */}
        {activeId ? (
          <Link
            aria-label="Close conversation"
            className="conv-drawer-backdrop"
            href="/dashboard/conversations"
            prefetch={false}
          />
        ) : null}
        <section className="conv-pane-detail">
          {typeof children === "function" ? (
            firstId || activeId ? (
              children(firstId)
            ) : (
              <div className="conv-pane-empty">
                {isLoadingEmpty ? "Loading conversations…" : "Pick a contact to read the conversation."}
              </div>
            )
          ) : (
            children
          )}
        </section>
      </div>
    </ConversationsShell>
  );
}

function ChatBubbleIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="17">
      <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="14">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="15">
      <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
    </svg>
  );
}

const splitCSS = `
.conv-split{display:flex;flex:1 1 auto;min-height:0;min-width:0}
.conv-pane-list{border-right:1px solid var(--app-border);display:flex;flex:0 0 320px;flex-direction:column;min-height:0;min-width:0;padding:16px}
.conv-pane-head{align-items:center;border-bottom:1px solid var(--app-border);color:var(--app-text);display:flex;gap:10px;padding:0 2px 14px}
.conv-pane-title{flex:1;font-size:14.5px;font-weight:600;margin:0}
.conv-pane-refresh{align-items:center;background:transparent;border:1px solid var(--app-border-strong);border-radius:8px;color:var(--app-muted);cursor:pointer;display:inline-flex;height:32px;justify-content:center;width:32px}
.conv-pane-refresh:hover:not(:disabled){background:var(--app-hover);color:var(--app-text)}
.conv-pane-refresh:disabled{cursor:not-allowed;opacity:.4}
.conv-pane-filters{display:flex;gap:8px;padding-top:12px}
.conv-pane-search{align-items:center;border:1px solid var(--app-border-strong);border-radius:8px;color:var(--app-subtle);display:flex;flex:1;gap:7px;height:34px;min-width:0;padding:0 10px}
.conv-pane-search:focus-within{border-color:var(--app-primary)}
.conv-pane-search input{background:transparent;border:0;color:var(--app-text);font-size:13px;min-width:0;outline:none;width:100%}
.conv-pane-search input::placeholder{color:var(--app-subtle)}
.conv-pane-select{background:transparent;border:1px solid var(--app-border-strong);border-radius:8px;color:var(--app-text);font-size:13px;height:34px;outline:none;padding:0 6px}
.conv-pane-select option{background:var(--app-surface)}
.conv-pane-items{display:flex;flex:1 1 auto;flex-direction:column;gap:2px;min-height:0;overflow-y:auto;padding:10px 0}
.conv-pane-items.is-stale{opacity:.55;transition:opacity .16s ease}
.conv-pane-item{align-items:center;border-radius:8px;color:var(--app-muted);display:flex;gap:10px;min-height:52px;padding:6px 10px;text-decoration:none;transition:background .16s ease,color .16s ease}
.conv-pane-item:hover{background:var(--app-hover);color:var(--app-text)}
.conv-pane-item.is-active{background:var(--app-hover-2);color:var(--app-text)}
.conv-pane-item.is-human-needed{box-shadow:inset 3px 0 0 var(--app-rose)}
.conv-pane-avatar{align-items:center;border-radius:50%;color:#fff;display:flex;flex:0 0 auto;font-size:12px;font-weight:700;height:32px;justify-content:center;width:32px}
.conv-pane-item-body{display:grid;flex:1;gap:2px;min-width:0}
.conv-pane-item-top{align-items:baseline;display:flex;gap:8px;min-width:0}
.conv-pane-item-name{color:var(--app-text);flex:1;font-size:14px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.conv-pane-item-time{color:var(--app-faint);flex:0 0 auto;font-size:11px;white-space:nowrap}
.conv-pane-item-sub{align-items:center;color:var(--app-subtle);display:flex;font-size:11.5px;gap:6px;min-width:0;overflow:hidden;white-space:nowrap}
.conv-pane-tag{background:var(--app-hover-2);border-radius:999px;color:var(--app-muted);flex:0 0 auto;font-size:10px;font-weight:600;padding:1px 6px}
.conv-pane-tag.is-rose{background:var(--app-rose);color:#fff}
.conv-pane-note{color:var(--app-subtle);font-size:13px;margin:0;padding:6px 4px}
.conv-pane-detail{display:flex;flex:1;flex-direction:column;min-height:0;min-width:0}
.conv-pane-empty{align-items:center;color:var(--app-subtle);display:flex;flex:1;font-size:13px;justify-content:center;padding:24px}
/* The contact list fills the page; a picked thread slides in over it as a
   right-hand drawer, and tapping the dimmed list behind it closes the drawer.
   The thread's back arrow closes it too. */
.conv-pane-list{border-right:0;flex:1 1 auto}
.conv-split:not(.has-selection) .conv-pane-detail{display:none}
.conv-drawer-backdrop{display:none}
.conv-split.has-selection .conv-drawer-backdrop{animation:conv-backdrop-in .2s ease;background:rgba(0,0,0,.55);display:block;inset:0;position:fixed;z-index:70}
.conv-split.has-selection .conv-pane-detail{animation:conv-drawer-in .24s cubic-bezier(.2,.8,.2,1);background:var(--app-bg,#0a0a0b);border-left:1px solid var(--app-border);bottom:0;box-shadow:-12px 0 32px rgba(0,0,0,.45);height:100dvh;max-width:640px;position:fixed;right:0;top:0;width:92vw;z-index:71}
@keyframes conv-drawer-in{from{transform:translateX(100%)}to{transform:none}}
@keyframes conv-backdrop-in{from{opacity:0}to{opacity:1}}
.conv-pane-detail .cv-thread-head{background:transparent;padding:16px 20px}
.conv-pane-detail .cv-thread-head h1{font-size:18px;font-weight:600}
.conv-pane-detail .cv-thread-head p{font-size:12px;margin-top:4px}
.conv-pane-detail .cv-composer{background:transparent}
@media(max-width:900px){
  .conv-split{flex-direction:column}
  .conv-split.has-selection .conv-pane-detail{max-width:none;width:min(calc(100vw - 48px),560px)}
  .conv-pane-detail .cv-thread-head{padding:12px 14px}
  .conv-pane-search input,.conv-pane-select{font-size:16px}
  /* Phones and tablets: a page title like "All Agents" and "Orders", and
     every control the same height and rounded box. */
  .conv-pane-head{border-bottom:0;padding-bottom:4px}
  .conv-pane-head>svg{display:none}
  .conv-pane-title{font-size:20px;font-weight:600;letter-spacing:-.2px}
  .conv-pane-refresh{border-radius:10px;height:38px;width:38px}
  .conv-pane-search,.conv-pane-select{background:var(--app-surface);border-radius:10px;height:40px}
  .conv-pane-search{padding:0 12px}
  .conv-pane-select{flex:0 0 auto;padding:0 10px}
}
`;
