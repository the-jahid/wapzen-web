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
  | "groups"
  | "calendar"
  | "chart"
  | "orders"
  | "follow-ups"
  | "settings";

// The sidebar heading an item sits under, as Retell groups its menu.
export type NavGroup = "Build" | "Deploy" | "Data";

export type WorkspaceNavItem = {
  label: string;
  icon: NavIconName;
  group: NavGroup;
  href?: string;
  badge?: string;
};

const STORAGE_KEY = "voca.workspace-mode";

// Chat is the workspace a new browser opens in, until the user picks one.
const defaultMode: WorkspaceMode = "chat";

// Every voice page lives under /dashboard/voice; everything else under
// /dashboard is chat. The URL alone decides the mode, so a link or a bookmark
// always shows a coherent menu, and the shared pages (Knowledge Base, Tools,
// Phone Numbers) exist once per mode: /dashboard/tools holds the chat agents'
// tools, /dashboard/voice/tools the voice agents'.
export const voiceRoot = "/dashboard/voice";

function isVoicePath(pathname: string | null | undefined): boolean {
  return pathname === voiceRoot || !!pathname?.startsWith(`${voiceRoot}/`);
}

/** dashboardHref("/tools", "voice") → "/dashboard/voice/tools". */
export function dashboardHref(path: string, mode: WorkspaceMode): string {
  return `${mode === "voice" ? voiceRoot : "/dashboard"}${path}`;
}

// "WhatsApp" because these agents talk over WhatsApp calls; agents on ordinary
// phone lines will sit beside them later under their own name.
const voiceNavItems: WorkspaceNavItem[] = [
  { label: "WhatsApp Voice Agents", icon: "agents", group: "Build", href: "/dashboard/voice/agents" },
  { label: "Knowledge Base", icon: "book", group: "Build", href: "/dashboard/voice/knowledge-base" },
  { label: "Tools", icon: "wrench", group: "Build", href: "/dashboard/voice/tools" },
  { label: "Phone Numbers", icon: "phone", group: "Deploy", href: "/dashboard/voice/phone-numbers" },
  { label: "Broadcast", icon: "target", group: "Deploy", href: "/dashboard/voice/outbound" },
  { label: "Call History", icon: "phone", group: "Data", href: "/dashboard/voice/calls" },
];

// Chat mode drops everything that only makes sense for a phone call — the voice
// agent list, the call log and outbound campaigns. Grouped like Retell's menu:
// what you build, where it runs, what it produced.
const chatNavItems: WorkspaceNavItem[] = [
  { label: "Chat Agents", icon: "chat", group: "Build", href: "/dashboard/chat" },
  { label: "Knowledge Base", icon: "book", group: "Build", href: "/dashboard/knowledge-base" },
  { label: "Tools", icon: "wrench", group: "Build", href: "/dashboard/tools" },
  { label: "Phone Numbers", icon: "phone", group: "Deploy", href: "/dashboard/phone-numbers" },
  // The account's whole chat inbox; the same threads are also readable per
  // agent in the editor's Conversation tab.
  { label: "Conversations", icon: "message", group: "Data", href: "/dashboard/conversations" },
  // The WhatsApp groups a number is in, each with its own AI switch.
  { label: "Groups", icon: "groups", group: "Data", href: "/dashboard/groups" },
  // What the agents' Take Order tool has placed.
  { label: "Orders", icon: "orders", group: "Data", href: "/dashboard/orders" },
  { label: "Follow-ups", icon: "follow-ups", group: "Data", href: "/dashboard/follow-ups" },
];

export const navGroups: NavGroup[] = ["Build", "Deploy", "Data"];

export function navItemsForMode(mode: WorkspaceMode): WorkspaceNavItem[] {
  return mode === "chat" ? chatNavItems : voiceNavItems;
}

// The choice is a per-browser preference, held in a tiny store so every reader
// on the page (and every tab) stays in step without a provider around the app.
let current: WorkspaceMode | null = null;
const listeners = new Set<() => void>();

function readStored(): WorkspaceMode {
  if (typeof window === "undefined") return defaultMode;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "voice" || stored === "chat") return stored;
  } catch {
    // localStorage unavailable (private mode, blocked cookies) — use the default.
  }
  return defaultMode;
}

function getSnapshot(): WorkspaceMode {
  if (current === null) current = readStored();
  return current;
}

// Rendered on the server before any browser storage is readable; the client
// snapshot takes over right after hydration, which React handles on its own.
function getServerSnapshot(): WorkspaceMode {
  return defaultMode;
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

  const pinned: WorkspaceMode | null = isVoicePath(pathname)
    ? "voice"
    : pathname?.startsWith("/dashboard")
      ? "chat"
      : null;
  const mode = pinned ?? stored;

  // Visiting a mode's own page adopts that mode, so the next shared page (say
  // Tools) keeps showing the menu the user was last working in. It runs when
  // the page is opened, not on every change of the stored choice: another tab
  // switching modes must not be switched straight back by a tab that happens to
  // sit on a pinned page, or the two tabs fight and the toggle never sticks.
  useEffect(() => {
    if (pinned && getSnapshot() !== pinned) writeMode(pinned);
  }, [pinned]);

  const setMode = useCallback(
    (next: WorkspaceMode) => {
      if (next === mode) return;
      writeMode(next);
      // Switching away from a page the other mode does not have would leave the
      // sidebar pointing at nothing the current screen relates to, so land on
      // that mode's own workspace instead.
      const leavingPinnedPage = pinned !== null && pinned !== next;
      if (leavingPinnedPage) router.push(next === "chat" ? "/dashboard/chat" : "/dashboard/voice/agents");
    },
    [mode, pinned, router]
  );

  return { mode, setMode };
}

/**
 * One button that jumps to the other workspace: in Chat it shows the voice
 * icon and opens the voice agents page, in Voice it shows the chat icon and
 * opens the chat agents page.
 */
export function WorkspaceSwitchButton({ className = "" }: { className?: string }) {
  const { mode } = useWorkspaceMode();
  const router = useRouter();
  const next: WorkspaceMode = mode === "chat" ? "voice" : "chat";
  const label = next === "voice" ? "Switch to Voice agents" : "Switch to Chat agents";

  return (
    <button
      aria-label={label}
      className={className}
      onClick={() => {
        writeMode(next);
        router.push(next === "chat" ? "/dashboard/chat" : "/dashboard/voice/agents");
      }}
      title={label}
      type="button"
    >
      {next === "voice" ? <VoiceModeIcon /> : <ChatModeIcon />}
      <span>{next === "voice" ? "Voice" : "Chat"}</span>
      <SwitchArrowsIcon />
    </button>
  );
}

// Two opposing arrows after the label say "switch over", so the button reads
// as a way into the other workspace rather than a label for this one.
function SwitchArrowsIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={14}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
      style={{ opacity: 0.75 }}
      viewBox="0 0 24 24"
      width={14}
    >
      <path d="M16 3l4 4-4 4" />
      <path d="M20 7H8" />
      <path d="M8 21l-4-4 4-4" />
      <path d="M4 17h12" />
    </svg>
  );
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
  background: var(--app-hover-3);
  box-shadow: inset 0 0 0 1px var(--app-border-strong);
  color: var(--app-text-strong);
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
