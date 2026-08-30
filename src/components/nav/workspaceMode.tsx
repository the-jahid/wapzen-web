"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

// The dashboard covers two products that share the same account: voice agents
// that call people, and chat agents that message them. The sidebar shows one
// set at a time so a workspace is not half features the user is not using.
export type WorkspaceMode = "voice" | "chat";

export type NavIconName =
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
  | "settings";

export type WorkspaceNavItem = {
  label: string;
  icon: NavIconName;
  href?: string;
  badge?: string;
};

const STORAGE_KEY = "voca.workspace-mode";

// Routes that only exist in one mode. Landing on one of these switches the
// sidebar to that mode, so a link or a bookmark always shows a coherent menu.
const chatOnlyPaths = ["/dashboard/chat", "/dashboard/conversations"];
const voiceOnlyPaths = [
  "/dashboard/agents",
  "/dashboard/calls",
  "/dashboard/outbound",
  "/dashboard/demo-call",
];

const voiceNavItems: WorkspaceNavItem[] = [
  { label: "Agents", icon: "agents", href: "/dashboard/agents" },
  { label: "Phone Numbers", icon: "phone", href: "/dashboard/phone-numbers" },
  { label: "Knowledge Base", icon: "book", href: "/dashboard/knowledge-base" },
  { label: "Tools", icon: "wrench", href: "/dashboard/tools" },
  { label: "API Keys", icon: "key", href: "/dashboard/api-keys" },
  { label: "Calls", icon: "phone", href: "/dashboard/calls" },
  { label: "Outbound", icon: "target", href: "/dashboard/outbound" },
];

// Chat mode drops everything that only makes sense for a phone call — the voice
// agent list, the call log and outbound campaigns.
const chatNavItems: WorkspaceNavItem[] = [
  { label: "Chat Agents", icon: "chat", href: "/dashboard/chat" },
  // The account's whole chat inbox. It sits under the agents that produce it,
  // and the same threads are also readable per agent in the editor's
  // Conversation tab.
  { label: "Conversations", icon: "message", href: "/dashboard/conversations" },
  { label: "Phone Numbers", icon: "phone", href: "/dashboard/phone-numbers" },
  { label: "Knowledge Base", icon: "book", href: "/dashboard/knowledge-base" },
  { label: "Tools", icon: "wrench", href: "/dashboard/tools" },
];

export function navItemsForMode(mode: WorkspaceMode): WorkspaceNavItem[] {
  return mode === "chat" ? chatNavItems : voiceNavItems;
}

// The choice is a per-browser preference, held in a tiny store so every reader
// on the page (and every tab) stays in step without a provider around the app.
let current: WorkspaceMode | null = null;
const listeners = new Set<() => void>();

function readStored(): WorkspaceMode {
  if (typeof window === "undefined") return "voice";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "voice" || stored === "chat") return stored;
  } catch {
    // localStorage unavailable (private mode, blocked cookies) — use the default.
  }
  return "voice";
}

function getSnapshot(): WorkspaceMode {
  if (current === null) current = readStored();
  return current;
}

// Rendered on the server before any browser storage is readable; the client
// snapshot takes over right after hydration, which React handles on its own.
function getServerSnapshot(): WorkspaceMode {
  return "voice";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    current = readStored();
    listeners.forEach((notify) => notify());
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function writeMode(next: WorkspaceMode) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Preference is lost on reload; the menu is still correct for this visit.
  }
  listeners.forEach((notify) => notify());
}

/**
 * useWorkspaceMode returns the sidebar's current mode and a setter. A page that
 * belongs to one mode wins over the stored preference, so opening a chat route
 * shows the chat menu even if the last choice was voice.
 */
export function useWorkspaceMode(): {
  mode: WorkspaceMode;
  setMode: (next: WorkspaceMode) => void;
} {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();
  const router = useRouter();

  const pinned: WorkspaceMode | null = chatOnlyPaths.some((path) => pathname?.startsWith(path))
    ? "chat"
    : voiceOnlyPaths.some((path) => pathname?.startsWith(path))
      ? "voice"
      : null;
  const mode = pinned ?? stored;

  // Visiting a mode's own page adopts that mode, so the next shared page (say
  // Tools) keeps showing the menu the user was last working in.
  useEffect(() => {
    if (pinned && pinned !== stored) writeMode(pinned);
  }, [pinned, stored]);

  const setMode = useCallback(
    (next: WorkspaceMode) => {
      if (next === mode) return;
      writeMode(next);
      // Switching away from a page the other mode does not have would leave the
      // sidebar pointing at nothing the current screen relates to, so land on
      // that mode's own workspace instead.
      const leavingPinnedPage = pinned !== null && pinned !== next;
      if (leavingPinnedPage) router.push(next === "chat" ? "/dashboard/chat" : "/dashboard/agents");
    },
    [mode, pinned, router]
  );

  return { mode, setMode };
}

function VoiceModeIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={15}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={15}
    >
      <path d="M12 3a3 3 0 013 3v6a3 3 0 01-6 0V6a3 3 0 013-3z" />
      <path d="M5 11a7 7 0 0014 0M12 18v3" />
    </svg>
  );
}

function ChatModeIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={15}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={15}
    >
      <path d="M20.5 12.5a7.5 7.5 0 01-7.5 7.5H8l-4.5 2.5V12.5A7.5 7.5 0 0111 5h2a7.5 7.5 0 017.5 7.5z" />
      <path d="M8.5 12h7M8.5 15.5h4" />
    </svg>
  );
}

// The dashboard pages each ship their own stylesheet inline rather than relying
// on a global one, so this control does the same: its styles travel with it and
// cannot end up missing from the page that renders it.
const css = `
.mode-toggle {
  background: var(--app-panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  box-sizing: border-box;
  display: grid;
  gap: 2px;
  grid-template-columns: repeat(2, 1fr);
  padding: 3px;
  width: 100%;
}
.mode-toggle-option {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  box-sizing: border-box;
  color: var(--app-faint);
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  gap: 6px;
  height: 30px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  transition: background .18s ease, color .18s ease;
  white-space: nowrap;
}
.mode-toggle-option svg { display: block; flex: 0 0 auto; }
.mode-toggle-option:hover { background: var(--app-hover); color: var(--app-text); }
.mode-toggle-option:focus-visible { outline: 2px solid var(--app-primary-light); outline-offset: 1px; }
.mode-toggle-option.is-active {
  background: var(--app-primary-soft);
  box-shadow: inset 0 0 0 1px var(--app-primary-ring);
  color: var(--app-primary-light);
}
`;

/**
 * The sidebar's mode switcher, sitting with the theme toggle at the foot of the
 * menu. Selecting Chat narrows the menu above it to the chat features.
 */
export function WorkspaceModeToggle({ className = "" }: { className?: string }) {
  const { mode, setMode } = useWorkspaceMode();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div aria-label="Workspace" className={`mode-toggle ${className}`.trim()} role="group">
        <button
          aria-pressed={mode === "voice"}
          className={`mode-toggle-option${mode === "voice" ? " is-active" : ""}`}
          onClick={() => setMode("voice")}
          title="Voice workspace"
          type="button"
        >
          <VoiceModeIcon />
          Voice
        </button>
        <button
          aria-pressed={mode === "chat"}
          className={`mode-toggle-option${mode === "chat" ? " is-active" : ""}`}
          onClick={() => setMode("chat")}
          title="Chat workspace"
          type="button"
        >
          <ChatModeIcon />
          Chat
        </button>
      </div>
    </>
  );
}
