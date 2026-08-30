"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  navItemsForMode,
  useWorkspaceMode,
  WorkspaceModeToggle,
} from "@/components/nav/workspaceMode";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearance } from "@/components/theme/clerkAppearance";
import ChatConversationsWorkspace, {
  type ConversationAgentOption,
} from "@/components/chat/ChatConversationsWorkspace";
import { listDashboardChatAgents } from "@/lib/chatAgents";

// The account's whole chat inbox: every thread every chat agent has answered,
// in one place. The chat-agent editor has the same workspace narrowed to one
// agent; this page passes the agent list instead, which is what turns on the
// agent filter and labels each thread with who answered it.

type IconName =
  | "grid"
  | "agents"
  | "phone"
  | "book"
  | "wrench"
  | "key"
  | "target"
  | "demo"
  | "chat"
  | "message"
  | "calendar"
  | "chart"
  | "settings"
  | "spark";

function iconPaths(name: IconName): ReactNode {
  switch (name) {
    case "grid":
      return (
        <>
          <rect height="9" rx="1.5" width="7" x="3" y="3" />
          <rect height="5" rx="1.5" width="7" x="14" y="3" />
          <rect height="9" rx="1.5" width="7" x="14" y="12" />
          <rect height="5" rx="1.5" width="7" x="3" y="16" />
        </>
      );
    case "agents":
      return (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0112 0v1" />
          <path d="M19 8v4M21 10h-4" />
        </>
      );
    case "phone":
      return <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" />;
    case "book":
      return (
        <>
          <path d="M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5A2.5 2.5 0 004 19.5z" />
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20v5H6.5A2.5 2.5 0 014 19.5z" />
        </>
      );
    case "wrench":
      return <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a6 6 0 01-7.9 7.9l-6.9 6.9a2.1 2.1 0 01-3-3l6.9-6.9a6 6 0 017.9-7.9l-3.8 3.8z" />;
    case "key":
      return (
        <>
          <circle cx="7.5" cy="14.5" r="3.5" />
          <path d="M10 12l8-8" />
          <path d="M14 8l2 2" />
          <path d="M16 6l2 2" />
        </>
      );
    case "target":
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1" />
        </>
      );
    case "demo":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M10.2 8.6l5.6 3.4-5.6 3.4z" />
        </>
      );
    case "chat":
      return (
        <>
          <path d="M20.5 12.5a7.5 7.5 0 01-7.5 7.5H8l-4.5 2.5V12.5A7.5 7.5 0 0111 5h2a7.5 7.5 0 017.5 7.5z" />
          <path d="M8.5 12h7M8.5 15.5h4" />
        </>
      );
    case "message":
      return <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />;
    case "calendar":
      return (
        <>
          <rect height="18" rx="2" width="18" x="3" y="4" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </>
      );
    case "chart":
      return (
        <>
          <path d="M4 19V5" />
          <path d="M8 19v-6M12 19V9M16 19v-8M20 19V7" />
        </>
      );
    case "settings":
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z" />
        </>
      );
    case "spark":
      return <path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" />;
  }
}

function Icon({ name, size = 18, stroke = "currentColor", sw = 2 }: { name: IconName; size?: number; stroke?: string; sw?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={sw}
      viewBox="0 0 24 24"
      width={size}
    >
      {iconPaths(name)}
    </svg>
  );
}

export default function ConversationsPage() {
  const { getToken } = useAuth();
  const [agents, setAgents] = useState<ConversationAgentOption[]>([]);
  const [agentsError, setAgentsError] = useState("");

  // The agent list only labels and filters the threads, so failing to load it
  // is a missing label rather than an empty page: the conversations below load
  // on their own either way.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listDashboardChatAgents(getToken);
        if (cancelled) return;
        setAgents(list.map((agent) => ({ id: agent.id, name: agent.agent.name })));
      } catch (loadError) {
        if (cancelled) return;
        setAgentsError(loadError instanceof Error ? loadError.message : "Could not load your chat agents");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  return (
    <div className="conv-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Sidebar activeLabel="Conversations" />

      <main className="conv-main">
        <div className="conv-content">
          <section className="conv-panel" aria-label="Conversations">
            {agentsError ? <div className="conv-warning">{agentsError}</div> : null}
            <ChatConversationsWorkspace agents={agents} />
          </section>
        </div>
      </main>
    </div>
  );
}

function Sidebar({ activeLabel }: { activeLabel: string }) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const { mode } = useWorkspaceMode();

  return (
    <aside className="conv-sidebar">
      <div className="conv-logo">
        <div className="conv-logo-mark">
          <Icon name="spark" size={18} stroke="#fff" sw={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.3px" }}>Voca</div>
          <div style={{ color: "var(--app-subtle)", fontSize: 11, fontWeight: 500, marginTop: -1 }}>AI Voice Agents</div>
        </div>
      </div>
      <div className="conv-nav-kicker">Menu</div>
      <nav className="conv-nav" aria-label="Dashboard navigation">
        {navItemsForMode(mode).map((item) => {
          const content = (
            <>
              <span style={{ display: "flex", justifyContent: "center", width: 18 }}>
                <Icon name={item.icon as IconName} size={18} />
              </span>
              <span>{item.label}</span>
              {item.badge ? <span className="conv-nav-badge">{item.badge}</span> : null}
            </>
          );
          const className = `conv-nav-item${item.label === activeLabel ? " is-active" : ""}`;

          return item.href ? (
            <Link className={className} href={item.href} key={item.label}>
              {content}
            </Link>
          ) : (
            <a className={className} href="#" key={item.label} onClick={(event) => event.preventDefault()}>
              {content}
            </a>
          );
        })}
      </nav>
      <div className="conv-sidebar-footer">
        <WorkspaceModeToggle />
        <ThemeToggle />
        <div className="conv-user-card">
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span style={{ minWidth: 0 }}>
            <div className="conv-user-name">{user?.fullName || user?.username || "Account"}</div>
            <div className="conv-user-email">{user?.primaryEmailAddress?.emailAddress ?? ""}</div>
          </span>
        </div>
      </div>
    </aside>
  );
}

const css = `
.conv-shell {
  --bg: var(--app-bg);
  --sidebar: var(--app-sidebar);
  --surface: var(--app-surface);
  --panel: var(--app-panel);
  --border: var(--app-border);
  --text: var(--app-text);
  --muted: var(--app-muted);
  --subtle: var(--app-subtle);
  --faint: var(--app-faint);
  --primary: var(--app-primary);
  --primary-2: var(--app-primary-2);
  --primary-soft: var(--app-primary-soft);
  background: var(--bg);
  color: var(--text);
  display: flex;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  height: 100vh;
  line-height: 1.5;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  width: 100vw;
}
.conv-shell * { box-sizing: border-box; }
.conv-shell button, .conv-shell input, .conv-shell select { font: inherit; }
.conv-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.conv-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.conv-shell ::-webkit-scrollbar-track { background: transparent; }
.conv-sidebar {
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100vh;
  padding: 22px 16px;
  position: sticky;
  top: 0;
  width: 248px;
}
.conv-logo { align-items: center; display: flex; gap: 11px; padding: 4px 8px 26px; }
.conv-logo-mark {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border-radius: 10px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.conv-nav-kicker { color: var(--faint); font-size: 10.5px; font-weight: 700; letter-spacing: .9px; padding: 4px 10px 8px; text-transform: uppercase; }
.conv-nav { display: flex; flex-direction: column; gap: 3px; }
.conv-nav-item {
  align-items: center;
  border-radius: 10px;
  color: var(--app-nav);
  display: flex;
  font-size: 13.5px;
  font-weight: 600;
  gap: 11px;
  padding: 9px 10px;
  text-decoration: none;
  transition: background .18s ease, color .18s ease;
}
.conv-nav-item:hover { background: var(--app-hover); color: var(--app-text-soft); }
.conv-nav-item.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); font-weight: 700; }
.conv-nav-badge { background: var(--primary); border-radius: 20px; color: var(--app-on-accent); font-size: 10.5px; font-weight: 700; margin-left: auto; padding: 1px 7px; }
.conv-sidebar-footer { display: flex; flex-direction: column; gap: 14px; margin-top: auto; }
.conv-user-card { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; gap: 10px; padding: 10px 13px; }
.conv-user-name { font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.conv-user-email { color: var(--subtle); font-size: 11.5px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.conv-main { display: flex; flex: 1; flex-direction: column; height: 100vh; min-width: 0; overflow: hidden; }
/* The panes inside the panel do the scrolling, so the page itself never does:
   the transcript stays put while its messages move. */
.conv-content { display: flex; flex: 1 1 auto; min-height: 0; padding: 18px 30px 24px; }
.conv-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  padding: 14px;
  width: 100%;
}
.conv-warning { background: var(--app-amber-soft); border: 1px solid var(--app-amber-border); border-radius: 10px; color: var(--app-amber); flex: 0 0 auto; font-size: 11.5px; margin-bottom: 12px; padding: 9px 11px; }
@media (max-width: 1100px) {
  .conv-sidebar { width: 216px; }
}
@media (max-width: 900px) {
  /* Below the sidebar's breakpoint the workspace takes the whole width; the
     menu is reachable from the pages that still show it. */
  .conv-sidebar { display: none; }
  .conv-content { padding: 14px 16px 18px; }
  .conv-panel { border-radius: 14px; padding: 12px; }
}
@media (max-width: 560px) {
  .conv-content { padding: 12px 11px 14px; }
  .conv-panel { background: transparent; border: 0; border-radius: 0; box-shadow: none; padding: 0; }
}
`;
