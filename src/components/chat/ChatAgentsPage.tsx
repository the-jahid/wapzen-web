"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth, useUser } from "@clerk/nextjs";
import { DashboardSidebar, navIcons } from "@/components/nav/DashboardSidebar";
import { navItemsForMode } from "@/components/nav/workspaceMode";
import { SUPPORT_WHATSAPP_URL, WhatsAppGlyph } from "@/components/nav/supportWhatsApp";
import ChatConversationsWorkspace from "@/components/chat/ChatConversationsWorkspace";
import { listKnowledgeBases as apiListKnowledgeBases, type ApiKnowledgeBase } from "@/lib/knowledgeBases";
import {
  getPhoneNumber as apiGetPhoneNumber,
  listPhoneNumbers as apiListPhoneNumbers,
  restartPhoneNumberLogin as apiRestartPhoneNumberLogin,
  startPhoneNumberCodeLogin as apiStartPhoneNumberCodeLogin,
  startPhoneNumberLogin as apiStartPhoneNumberLogin,
  startPhoneNumberQrLogin as apiStartPhoneNumberQrLogin,
  PhoneNumberError,
  type ApiPhoneNumber,
  type PhoneNumberStatus,
} from "@/lib/phoneNumbers";
import { useIsPhone, WhatsAppLinkHelp } from "@/components/phone-numbers/WhatsAppLinkHelp";
import { listTools as apiListTools, type ApiTool } from "@/lib/tools";
import { useCachedState } from "@/lib/pageCache";
import { startPolling } from "@/lib/polling";
import {
  AGENT_FILE_ACCEPT,
  AGENT_FILE_DESCRIPTION_MAX,
  AGENT_FILE_MAX_BYTES,
  AGENT_FILES_MAX,
  ChatAgentError,
  chatAgentDefaults,
  createDashboardChatAgent,
  deleteAgentFile,
  deleteDashboardChatAgent,
  getDashboardChatAgent,
  isChatAgentLimitError,
  listAgentFiles,
  listDashboardChatAgents,
  updateAgentFile,
  updateDashboardChatAgent,
  uploadAgentFile,
  type ApiAgentFile,
  type ApiChatAgent,
  type ChatMediaSection,
  type CreateChatAgentPayload,
} from "@/lib/chatAgents";

type IconName =
  | "grid"
  | "agents"
  | "phone"
  | "demo"
  | "chat"
  | "message"
  | "calendar"
  | "chart"
  | "settings"
  | "spark"
  | "target"
  | "key"
  | "book"
  | "wrench"
  | "bag"
  | "paperclip"
  | "pencil"
  | "plus"
  | "trash"
  | "search"
  | "refresh"
  | "chevron"
  | "check"
  | "menu"
  | "back"
  | "x";

// The collapsible parts of the configuration panel, one per section of the
// chat-agent contract.
type ConfigSectionId = "phone-number" | "knowledge-base" | "tools" | "orders" | "files" | "voice-photos";

// The editor's tabs. "agent" is what the agent says and answers on, "conversation"
// the record of what it has already said, and "configuration" what it can reach.
type EditorTab = "agent" | "conversation" | "configuration";

const editorTabs: { id: EditorTab; label: string }[] = [
  { id: "agent", label: "Agent" },
  { id: "conversation", label: "Conversation" },
  { id: "configuration", label: "Configuration" },
];


// From this width the editor is two columns, the prompt beside its settings, so
// the Configuration tab has nothing left to hold. Keep in step with the
// "@media (min-width: 1180px)" block in the css below.
const DESKTOP_QUERY = "(min-width: 1180px)";

function subscribeDesktopQuery(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktopQuery, () => window.matchMedia(DESKTOP_QUERY).matches, () => false);
}

const phoneStatusLabels: Record<PhoneNumberStatus, string> = {
  pending_qr: "Pending QR",
  connected: "Connected",
  disconnected: "Disconnected",
  failed: "Failed",
  expired: "Expired",
};

// A login session stops producing new QR codes once it reaches one of these, so
// polling stops there too.
// A login that ended is "disconnected" whichever way it went; failed and expired
// are only in the status union for older servers.
const terminalLoginStatuses = new Set<PhoneNumberStatus>(["connected", "disconnected", "failed", "expired"]);

// How many QR sessions an open editor reissues on its own before it stops and
// leaves the button. A session lasts a few minutes, so this is roughly half an
// hour of unattended refreshing — long enough for anyone actually about to
// scan, short of holding a WhatsApp session open in a forgotten tab all day.
const maxAutoLogins = 10;

// AssignableNumber is a connected number as the setup card lists it: what it is
// called, and whether another chat agent's claim rules it out.
type AssignableNumber = {
  id: string;
  name: string;
  detail: string;
  disabled: boolean;
  hint: string;
};


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
      return <path d="M4 19V5M8 19v-6M12 19V9M16 19v-8M20 19V7" />;
    case "settings":
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z" />
        </>
      );
    case "spark":
      return <path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" />;
    case "target":
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1" />
        </>
      );
    case "key":
      return (
        <>
          <circle cx="7.5" cy="14.5" r="3.5" />
          <path d="M10 12l8-8M14 8l2 2M16 6l2 2" />
        </>
      );
    case "book":
      return (
        <>
          <path d="M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5A2.5 2.5 0 004 19.5z" />
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20v5H6.5A2.5 2.5 0 014 19.5z" />
        </>
      );
    case "wrench":
      return <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a6 6 0 01-7.9 7.9l-6.9 6.9a2.1 2.1 0 01-3-3l6.9-6.9a6 6 0 017.9-7.9l-3.8 3.8z" />;
    case "bag":
      return (
        <>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </>
      );
    case "pencil":
      return <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />;
    case "paperclip":
      return <path d="M21 11.5l-8.6 8.6a5.5 5.5 0 01-7.8-7.8l8.6-8.6a3.7 3.7 0 015.2 5.2l-8.6 8.6a1.8 1.8 0 01-2.6-2.6l7.9-7.9" />;
    case "plus":
      return <path d="M12 5v14M5 12h14" />;
    case "trash":
      return (
        <>
          <path d="M4 7h16" />
          <path d="M9 7V4h6v3" />
          <path d="M10 11v6M14 11v6" />
          <path d="M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </>
      );
    case "refresh":
      return (
        <>
          <path d="M4 4v6h6" />
          <path d="M20 20v-6h-6" />
          <path d="M20 9a8 8 0 00-13.5-3L4 10M4 15a8 8 0 0013.5 3L20 14" />
        </>
      );
    case "chevron":
      return <path d="M6 9l6 6 6-6" />;
    case "check":
      return <path d="M5 12.5l4 4 10-10" />;
    case "menu":
      return <path d="M4 6h16M4 12h16M4 18h16" />;
    case "back":
      return <path d="M15 18l-6-6 6-6" />;
    case "x":
      return <path d="M6 6l12 12M18 6L6 18" />;
  }
}

function Icon({
  name,
  size = 18,
  stroke = "currentColor",
  sw = 2,
}: {
  name: IconName;
  size?: number;
  stroke?: string;
  sw?: number;
}) {
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

const css = `
.chat-shell {
  --bg: var(--app-bg);
  --sidebar: var(--app-sidebar);
  --surface: var(--app-surface);
  --panel: var(--app-panel);
  --panel-hover: var(--app-panel-hover);
  --border: var(--app-border);
  --border-strong: var(--app-border-strong);
  --text: var(--app-text);
  --muted: var(--app-muted);
  --subtle: var(--app-subtle);
  --faint: var(--app-faint);
  --primary: var(--app-primary);
  --primary-2: var(--app-primary-2);
  --primary-soft: var(--app-primary-soft);
  --primary-light: var(--app-primary-light);
  --green: var(--app-green);
  --amber: var(--app-amber);
  --rose: var(--app-rose);
  background: var(--bg);
  color: var(--text);
  display: flex;
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.chat-shell * { box-sizing: border-box; }
.chat-shell button, .chat-shell input, .chat-shell select, .chat-shell textarea { font: inherit; }
.chat-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.chat-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.chat-shell ::-webkit-scrollbar-track { background: transparent; }
.chat-main { display: flex; flex: 1; flex-direction: column; min-width: 0; height: 100vh; overflow: hidden; }
.chat-content { padding: 20px 32px; flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
.chat-workspace {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr);
  flex: 1 1 auto;
  min-height: 0;
}
.chat-workspace > * { min-height: 0; max-height: 100%; }
.chat-agent-browser { margin: 0 auto; max-width: 1320px; width: 100%; }
.chat-agent-page {
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1320px;
  min-height: 0;
  overflow: hidden;
  width: 100%;
}
.chat-agent-page-empty {
  align-items: center;
  color: var(--muted);
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
  padding: 48px 16px;
  text-align: center;
}
.chat-agent-expanded-topline {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 14px;
  padding: 14px 16px;
}
.chat-agent-expanded-topline > .chat-detail-head { flex: 1 1 auto; min-width: 0; }
.chat-agent-back {
  flex: 0 0 auto;
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  width: 32px;
}
.chat-agent-back:hover { background: var(--panel-hover); color: var(--text); }
.chat-agent-expanded-grid {
  display: grid;
  flex: 1 1 auto;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
  padding: 16px;
}
.chat-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chat-panel-head { align-items: center; border-bottom: 1px solid var(--border); display: flex; gap: 10px; justify-content: space-between; padding: 14px 16px; flex: 0 0 auto; }
.chat-panel-title { align-items: center; display: flex; font-size: 13px; font-weight: 850; gap: 8px; letter-spacing: -.1px; margin: 0; }
.chat-panel-title .chat-panel-ic { color: var(--primary-light); display: inline-flex; }
.chat-panel-copy { color: var(--subtle); font-size: 11.5px; }
.chat-panel-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 14px 16px; }
.chat-search { margin-bottom: 10px; position: relative; }
.chat-search-icon { color: var(--subtle); left: 11px; position: absolute; top: 50%; transform: translateY(-50%); }
.chat-input, .chat-select {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  height: 40px;
  outline: none;
  padding: 0 12px;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.chat-input::placeholder, .chat-textarea::placeholder { color: var(--faint); }
.chat-input:focus, .chat-select:focus, .chat-textarea:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.chat-input:disabled, .chat-select:disabled, .chat-textarea:disabled { color: var(--subtle); cursor: not-allowed; opacity: .55; }
.chat-search .chat-input { padding-left: 36px; }
.chat-select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--app-muted) 50%), linear-gradient(135deg, var(--app-muted) 50%, transparent 50%);
  background-position: calc(100% - 17px) 50%, calc(100% - 12px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 5px, 5px 5px;
  padding: 0 34px 0 12px;
}
.chat-select option { background: var(--surface); color: var(--text); }
.chat-textarea {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  line-height: 1.55;
  min-height: 96px;
  outline: none;
  padding: 11px 12px;
  resize: vertical;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.chat-list { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); }
.chat-list-row {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  align-content: start;
  gap: 12px;
  grid-template-areas: "avatar identity status" "resources resources chevron";
  grid-template-columns: 36px minmax(0, 1fr) auto;
  padding: 16px;
  position: relative;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.chat-list-row:hover { background: var(--panel-hover); border-color: var(--app-primary-ring); box-shadow: 0 6px 18px var(--app-shadow-soft); }
.chat-list-row:has(.chat-list-link:focus-visible) { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.chat-list-row.is-active { background: var(--primary-soft); border-color: var(--app-primary-border); }
/* The name's link stretches over the whole card, because the card also holds a
   delete button and a button can't sit inside a link. */
.chat-list-link { color: inherit; text-decoration: none; }
.chat-list-link:focus-visible { outline: none; }
.chat-list-link::after { border-radius: 14px; content: ""; inset: 0; position: absolute; }
.chat-list-row-end { align-items: center; display: inline-flex; gap: 6px; grid-area: chevron; justify-self: end; }
.chat-list-delete { position: relative; z-index: 1; }
.chat-icon-btn.chat-list-delete:hover { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--app-rose-text); }
.chat-list-row > .chat-avatar { grid-area: avatar; }
.chat-list-row > .chat-pill { grid-area: status; }
/* Loading placeholders: the real row grid with pulsing blocks in place of each
   field, so the list does not jump when the agents arrive. */
.chat-list-skeleton { cursor: default; }
.chat-list-skeleton:hover { background: var(--surface); border-color: var(--border); box-shadow: none; }
.chat-list-skeleton > .chat-skel-avatar { grid-area: avatar; }
.chat-list-skeleton > .chat-skel-pill { grid-area: status; }
.chat-skel {
  animation: chat-skel-pulse 1.4s ease-in-out infinite;
  background: var(--panel-hover);
  border-radius: 6px;
  display: block;
  height: 12px;
  max-width: 100%;
}
.chat-skel-sm { height: 9px; }
.chat-skel-avatar { border-radius: 10px; height: 32px; width: 32px; }
.chat-skel-pill { border-radius: 999px; height: 20px; width: 64px; }
@keyframes chat-skel-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@media (prefers-reduced-motion: reduce) { .chat-skel { animation: none; } }
.chat-avatar {
  align-items: center;
  border-radius: 10px;
  color: #fff;
  display: flex;
  font-size: 12.5px;
  font-weight: 800;
  height: 32px;
  justify-content: center;
  width: 32px;
}
.chat-list-identity { display: grid; gap: 3px; grid-area: identity; min-width: 0; }
.chat-list-name { font-size: 13.5px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-list-phone { color: var(--subtle); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-list-resources { align-items: center; border-top: 1px solid var(--border); color: var(--subtle); display: flex; flex-wrap: wrap; font-size: 11px; gap: 9px; grid-area: resources; padding-top: 12px; }
.chat-list-resources > span { align-items: center; display: inline-flex; gap: 4px; white-space: nowrap; }
.chat-list-chevron { color: var(--faint); display: inline-flex; grid-area: chevron; justify-self: end; transition: color .18s ease, transform .18s ease; }
.chat-list-row:hover .chat-list-chevron { color: var(--primary-light); transform: translateX(2px); }
.chat-empty-list { color: var(--subtle); font-size: 12.5px; padding: 18px 4px; text-align: center; }
.chat-panel-body-empty { display: flex; flex-direction: column; }
.chat-empty-start { align-items: center; display: flex; flex: 1 0 auto; flex-direction: column; gap: 14px; justify-content: center; min-height: 280px; }
.chat-pill {
  align-items: center;
  border-radius: 20px;
  display: inline-flex;
  font-size: 10.5px;
  font-weight: 800;
  gap: 5px;
  letter-spacing: .2px;
  line-height: 1;
  padding: 4px 8px;
  text-transform: uppercase;
}
.chat-pill.is-active { background: var(--app-green-soft); color: var(--green); }
.chat-pill.is-inactive { background: var(--app-border); color: var(--subtle); }
.chat-dot { background: currentColor; border-radius: 50%; height: 5px; width: 5px; }
.chat-btn {
  align-items: center;
  border: 1px solid var(--app-border-strong);
  border-radius: 11px;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 38px;
  padding: 0 13px;
  transition: background .18s ease, filter .18s ease;
  white-space: nowrap;
}
.chat-btn-primary { background: linear-gradient(140deg,var(--primary-2),var(--primary)); border-color: transparent; box-shadow: 0 4px 14px var(--app-primary-glow); color: var(--app-on-accent); }
.chat-btn-primary:hover { filter: brightness(1.08); }
.chat-btn-secondary { background: var(--panel-hover); color: var(--text); }
.chat-btn-secondary:hover { background: var(--app-panel-hover); }
.chat-btn-danger { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--app-rose-text); }
.chat-btn:disabled { cursor: not-allowed; filter: grayscale(.35); opacity: .45; }

/* Delete confirmation, above the expanded agent card. */
.chat-confirm-overlay { align-items: center; animation: chat-confirm-fade .16s ease; backdrop-filter: blur(3px); background: var(--app-overlay); display: flex; inset: 0; justify-content: center; padding: 24px; position: fixed; z-index: 120; }
.chat-confirm { animation: chat-confirm-in .18s ease; background: var(--app-surface); border: 1px solid var(--app-line); border-radius: 18px; box-shadow: 0 30px 80px var(--app-shadow-color-strong); max-width: 420px; padding: 22px; width: 100%; }
.chat-confirm-icon { align-items: center; background: var(--app-rose-soft); border: 1px solid var(--app-rose-border); border-radius: 12px; color: var(--app-rose); display: inline-flex; height: 42px; justify-content: center; margin-bottom: 14px; width: 42px; }
.chat-confirm-title { color: var(--app-text-strong); font-size: 17px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.chat-confirm-copy { color: var(--app-muted); font-size: 13px; line-height: 1.55; margin: 8px 0 0; }
.chat-confirm-copy strong { color: var(--app-text-strong); font-weight: 800; }
.chat-confirm-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.chat-confirm-danger { background: var(--app-rose); border-color: transparent; color: #fff; }
.chat-confirm-danger:hover { filter: brightness(1.08); }
@keyframes chat-confirm-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes chat-confirm-in { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .chat-confirm-overlay, .chat-confirm { animation: none; } }
@media (max-width: 760px) {
  .chat-confirm-overlay { align-items: flex-end; padding: 0; }
  .chat-confirm { border-radius: 18px 18px 0 0; max-width: none; padding: 20px 18px calc(18px + env(safe-area-inset-bottom)); }
  .chat-confirm-actions { flex-direction: column-reverse; }
  .chat-confirm-actions .chat-btn { width: 100%; }
}
/* Why a live agent is not answering, as the running server reports it. */
.chat-runtime-alert { align-items: flex-start; background: var(--app-amber-soft); border-color: var(--app-amber-border); display: flex; gap: 12px; padding: 12px 14px; }
.chat-runtime-alert-icon { align-items: center; background: var(--app-amber); border-radius: 999px; color: #fff; display: inline-flex; flex: none; font-size: 12px; font-weight: 900; height: 20px; justify-content: center; margin-top: 1px; width: 20px; }
.chat-runtime-alert-title { color: var(--app-amber-text); font-size: 13px; font-weight: 800; margin: 0; }
.chat-runtime-alert-time { color: var(--subtle); font-weight: 600; }
.chat-runtime-alert-copy { color: var(--text); font-size: 12.5px; line-height: 1.5; margin: 4px 0 0; overflow-wrap: anywhere; }
/* An agent that has sent its replies for the hour, counting down to when it answers again. */
.chat-limit-list { display: grid; gap: 10px; margin: 0 auto 16px; max-width: 1320px; width: 100%; }
.chat-limit-card { align-items: center; flex-wrap: wrap; justify-content: space-between; }
.chat-limit-card-text { flex: 1 1 240px; min-width: 0; }
.chat-limit-timer { color: var(--app-amber-text); flex: none; text-align: right; }
.chat-limit-timer-value { display: block; font-size: 24px; font-variant-numeric: tabular-nums; font-weight: 800; letter-spacing: -.01em; line-height: 1.1; }
.chat-limit-timer-label { color: var(--subtle); display: block; font-size: 11.5px; font-weight: 600; margin-top: 2px; }
@media (max-width: 420px) { .chat-limit-timer { text-align: left; } }
.chat-btn-sm { font-size: 12px; min-height: 32px; padding: 0 10px; }
.chat-section { border-top: 1px solid var(--border); padding-top: 14px; margin-top: 14px; }
.chat-section:first-child { border-top: 0; margin-top: 0; padding-top: 0; }
.chat-section-title { color: var(--faint); font-size: 10.5px; font-weight: 800; letter-spacing: .8px; margin: 0 0 10px; text-transform: uppercase; }
.chat-fields { display: grid; gap: 12px; }
.chat-fields-2 { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.chat-field { display: grid; gap: 6px; min-width: 0; }
.chat-field-label { color: var(--subtle); font-size: 11.5px; font-weight: 700; }
.chat-field-hint { color: var(--faint); font-size: 11.5px; line-height: 1.45; }
.chat-range-head { align-items: center; display: flex; justify-content: space-between; }
.chat-range-value { color: var(--text); font-size: 12px; font-weight: 700; }
.chat-range { accent-color: var(--primary); width: 100%; }
.chat-chips { display: flex; flex-wrap: wrap; gap: 7px; }
.chat-chip {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 20px;
  color: var(--text);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 650;
  gap: 6px;
  max-width: 100%;
  padding: 6px 11px;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}
.chat-chip:hover { border-color: var(--app-border-strong); }
.chat-chip.is-on { background: var(--primary-soft); border-color: var(--app-primary-border); color: var(--app-primary-text); }
.chat-chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-chips-empty { color: var(--faint); font-size: 11.5px; }
.chat-default-badge { background: var(--app-hover-2); border: 1px solid var(--app-border-strong); border-radius: 999px; color: var(--subtle); font-size: 10px; font-weight: 800; line-height: 1; padding: 3px 6px; }
.chat-orders-on { background: var(--app-green-soft); border: 1px solid var(--app-green-border); border-radius: 999px; color: var(--green); font-weight: 800; line-height: 1; padding: 3px 7px; }
.chat-order-settings { display: grid; gap: 12px; margin-top: 12px; }
.chat-order-toggle { align-items: center; background: none; border: 0; color: var(--text); cursor: pointer; display: flex; font-size: 12.5px; font-weight: 750; gap: 10px; padding: 0; text-align: left; }
.chat-order-track { background: var(--app-hover-3); border: 1px solid var(--app-border-strong); border-radius: 999px; flex-shrink: 0; height: 24px; padding: 2px; transition: background .18s ease, border-color .18s ease; width: 44px; }
.chat-order-knob { background: var(--app-invert-bg); border-radius: 50%; display: block; height: 18px; transition: transform .18s ease, background .18s ease; width: 18px; }
.chat-order-toggle.is-on .chat-order-track { background: var(--primary); border-color: transparent; }
.chat-order-toggle.is-on .chat-order-knob { background: var(--app-on-accent); transform: translateX(20px); }
.chat-media-settings { display: grid; gap: 16px 24px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); }
.chat-media-option { align-content: start; display: grid; gap: 6px; }
.chat-media-option .chat-field-hint { padding-left: 54px; }
.chat-files { display: grid; gap: 12px; }
.chat-file-list { display: grid; gap: 8px; list-style: none; margin: 0; padding: 0; }
.chat-file { align-items: start; background: var(--panel-hover); border: 1px solid var(--border); border-radius: 10px; display: grid; gap: 4px 8px; grid-template-columns: minmax(0, 1fr) auto; padding: 8px 8px 8px 10px; }
.chat-file-name { color: var(--text); font-size: 12.5px; font-weight: 750; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-file-size { color: var(--faint); font-weight: 500; }
.chat-file-description { color: var(--subtle); font-size: 11.5px; grid-column: 1 / -1; line-height: 1.45; overflow-wrap: anywhere; }
.chat-file-edit { display: grid; gap: 8px; grid-column: 1 / -1; }
.chat-file-form { display: grid; gap: 10px; }
.chat-file-preview { border: 1px solid var(--border); border-radius: 10px; display: block; height: auto; max-height: 200px; max-width: 100%; width: auto; }
.chat-file-picked { color: var(--text); font-size: 12.5px; font-weight: 750; overflow-wrap: anywhere; }
.chat-file-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.chat-file-error { color: var(--app-rose-text); font-size: 11.5px; line-height: 1.45; }
.chat-editor { display: flex; flex-direction: column; gap: 16px; min-width: 0; overflow-y: auto; padding-right: 4px; }
.chat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  flex: 0 0 auto;
  padding: 16px;
}
.chat-card-grow { min-height: 245px; }
.chat-page-links { display: none; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.chat-page-link { min-height: 34px; text-decoration: none; }
.chat-page-link > svg { color: var(--muted); flex: none; }
.chat-card.chat-order-shortcut {
  align-items: center;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: 16px minmax(0, 1fr) auto 16px;
  min-height: 44px;
  padding: 8px 14px;
  text-align: left;
  width: 100%;
}
.chat-order-shortcut > svg { color: var(--muted); }
.chat-card.chat-order-shortcut:hover { background: var(--panel-hover); }
.chat-card.chat-order-shortcut:focus-visible { box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.chat-order-shortcut-arrow { color: var(--subtle); display: inline-flex; transform: rotate(-90deg); }
.chat-card-head { align-items: center; display: flex; gap: 12px; justify-content: space-between; margin-bottom: 12px; }
.chat-card-title { font-size: 13.5px; font-weight: 850; letter-spacing: -.1px; margin: 0; }
.chat-mini-select { height: 34px; max-width: 210px; width: auto; }
.chat-helper-line { color: var(--subtle); font-size: 12px; margin-top: 9px; }
.chat-char-count { color: var(--subtle); font-size: 12px; font-variant-numeric: tabular-nums; font-weight: 650; white-space: nowrap; }
.chat-char-count.near { color: var(--amber); }
.chat-char-count.over { color: var(--rose); }
.chat-detail-head { align-items: center; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr) auto; }
.chat-identity { align-items: center; display: grid; gap: 13px; grid-template-columns: 46px minmax(0, 1fr); min-width: 0; }
.chat-avatar-lg { border-radius: 13px; font-size: 17px; height: 46px; width: 46px; }
.chat-heading-row { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; }
.chat-heading { font-size: 20px; font-weight: 850; letter-spacing: -.35px; line-height: 1.1; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* The heading is also the rename control, so it only wears a field on hover. */
.chat-heading-edit {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 9px;
  color: inherit;
  cursor: text;
  display: block;
  font: inherit;
  letter-spacing: inherit;
  margin: -4px -7px;
  overflow: hidden;
  padding: 3px 6px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.chat-heading-edit:hover { background: var(--app-hover); border-color: var(--app-border); }
.chat-heading-edit:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.chat-heading-input { max-width: 100%; width: 320px; }
.chat-tag {
  background: var(--app-border);
  border: 1px solid var(--app-border-strong);
  border-radius: 999px;
  color: var(--app-text-soft);
  display: inline-flex;
  font-size: 11.5px;
  font-weight: 800;
  line-height: 1;
  padding: 5px 8px;
  white-space: nowrap;
}
.chat-editor-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.chat-tabs { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; display: flex; flex: 0 0 auto; gap: 4px; padding: 4px; }
.chat-tab { background: transparent; border: 0; border-radius: 9px; color: var(--muted); cursor: pointer; font: inherit; font-size: 12px; font-weight: 750; min-height: 32px; padding: 0 14px; }
.chat-tab:hover { color: var(--text); }
.chat-tab.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-border); color: var(--app-primary-text); }
/* The conversations workspace scrolls its own two panes, so the card gives it a
   height to work inside instead of growing with the transcript. */
.chat-card-conversations { display: flex; flex: 1 1 auto; flex-direction: column; height: min(640px, 72vh); min-height: 420px; }
.chat-card-conversations > .chat-card-head { flex: 0 0 auto; }
/* Its own height inside the scrolling editor, not squeezed to fit the tab. */
.chat-config-panel { flex: 0 0 auto; }
.chat-config-head { align-items: flex-start; }
/* The agent list carries its own create button, as the voice workspace does,
   so the page needs no separate header row above the columns. */
.chat-list-head { align-items: flex-start; }
.chat-list-head > div { min-width: 0; }
.chat-list-head .chat-btn { flex: 0 0 auto; }
.chat-list-actions { display: flex; flex: 0 0 auto; gap: 8px; }
/* WhatsApp's own green, matching the sidebar's support card. */
.chat-btn-whatsapp { background: #25d366; border-color: transparent; color: #fff; text-decoration: none; }
.chat-btn-whatsapp:hover { background: #1fb956; }
.chat-btn-whatsapp:focus-visible { outline: 2px solid var(--app-primary-light); outline-offset: 2px; }
/* Shown instead of the full label once the header is too narrow for it. */
.chat-btn-label-short { display: none; }
.chat-config-fields {
  border-bottom: 1px solid var(--border);
  display: grid;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 14px;
}
.chat-control-label { color: var(--faint); display: block; font-size: 10.5px; font-weight: 800; letter-spacing: .8px; margin-bottom: 7px; text-transform: uppercase; }
.chat-accordion-list { display: flex; flex-direction: column; gap: 8px; }
.chat-accordion-item { background: var(--panel); border: 1px solid var(--app-border); border-radius: 13px; overflow: hidden; }
.chat-accordion-item.is-open { border-color: var(--app-primary-border); }
.chat-accordion-button {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: 30px minmax(0, 1fr) auto 18px;
  padding: 12px;
  text-align: left;
  width: 100%;
}
.chat-accordion-icon { align-items: center; background: var(--app-hover-2); border: 1px solid var(--app-border); border-radius: 9px; color: var(--muted); display: inline-flex; height: 30px; justify-content: center; transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease; width: 30px; }
.chat-accordion-item.is-open .chat-accordion-icon { background: var(--primary-soft); border-color: var(--app-primary-border); color: var(--primary-light); }
.chat-accordion-title { font-size: 13px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-accordion-meta { color: var(--subtle); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-accordion-chevron { color: var(--subtle); display: inline-flex; transition: transform .18s ease; }
.chat-accordion-item.is-open .chat-accordion-chevron { color: var(--primary-light); transform: rotate(180deg); }
.chat-accordion-body { border-top: 1px solid var(--app-border); padding: 14px 12px; }
.chat-message { align-items: center; color: var(--subtle); display: flex; font-size: 13px; justify-content: center; height: 100%; padding: 30px; text-align: center; }
.chat-modal-backdrop {
  align-items: center;
  background: var(--app-overlay);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 120;
}
.chat-modal-card {
  background: var(--surface);
  border: 1px solid var(--app-border-strong);
  border-radius: 18px;
  box-shadow: 0 30px 90px var(--app-shadow-color);
  display: flex;
  flex-direction: column;
  max-height: min(820px, calc(100vh - 48px));
  max-width: 620px;
  overflow: hidden;
  width: 100%;
}
.chat-modal-head { align-items: start; border-bottom: 1px solid var(--border); display: flex; gap: 16px; justify-content: space-between; padding: 18px 20px; flex: 0 0 auto; }
.chat-modal-title { font-size: 18px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.chat-modal-subtitle { color: var(--subtle); font-size: 12.5px; margin-top: 3px; }
.chat-modal-body { display: grid; gap: 14px; overflow-y: auto; padding: 18px 20px; }
.chat-modal-section {
  background: var(--app-border-soft);
  border: 1px solid var(--app-border);
  border-radius: 14px;
  display: grid;
  gap: 12px;
  padding: 14px;
}
.chat-modal-section-title { font-size: 13px; font-weight: 850; margin: 0; }
.chat-modal-grid { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.chat-modal-footer { border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; padding: 14px 20px; flex: 0 0 auto; }
.chat-modal-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); border-radius: 11px; color: var(--app-rose-text); font-size: 12.5px; font-weight: 650; padding: 10px 12px; }
.chat-modal-step { color: var(--app-primary-text); font-size: 11px; font-weight: 800; letter-spacing: .4px; margin-bottom: 4px; }
/* The first step holds a QR code and the pairing form side by side. */
.chat-modal-card.is-pairing { max-width: 760px; }
.chat-modal-card.is-pairing .chat-modal-body { grid-template-columns: minmax(0, 1fr); }
.chat-modal-card .chat-number-grid { grid-template-columns: minmax(0, 1fr); }
.chat-number-row.chat-number-linked { cursor: default; }
.chat-number-row.chat-number-linked:hover { background: var(--panel-hover); border-color: var(--border); }
.chat-icon-btn {
  align-items: center;
  background: transparent;
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  height: 32px;
  justify-content: center;
  transition: background .18s ease, color .18s ease;
  width: 32px;
}
.chat-icon-btn:hover { background: var(--app-hover); color: var(--text); }
.chat-toast {
  border-radius: 12px;
  bottom: 24px;
  box-shadow: 0 18px 50px var(--app-shadow-color);
  font-size: 13px;
  font-weight: 700;
  left: 50%;
  max-width: min(480px, calc(100vw - 48px));
  padding: 12px 18px;
  position: fixed;
  transform: translateX(-50%);
  z-index: 130;
}
.chat-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-green-text); }
.chat-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
/* The no-number card: a QR login on the left, the numbers already connected on
   the right, so either route out of "this agent answers on nothing" is one click. */
.chat-number-setup { border-color: var(--app-primary-ring); }
.chat-number-flag {
  background: var(--app-amber-soft);
  border: 1px solid var(--app-amber-border);
  border-radius: 20px;
  color: var(--amber);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .4px;
  padding: 3px 9px;
  text-transform: uppercase;
}
.chat-number-copy { color: var(--subtle); font-size: 12.5px; line-height: 1.55; margin: 0 0 14px; }
/* 260px floor keeps the QR's modules big enough for a phone camera at 1x DPR. */
.chat-number-grid { align-items: start; display: grid; gap: 14px; grid-template-columns: minmax(260px, 300px) minmax(0, 1fr); }
.chat-number-grid.is-single { grid-template-columns: minmax(0, 1fr); }
.chat-number-pane {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 13px;
  display: grid;
  gap: 10px;
  padding: 13px;
}
.chat-number-pane-head { align-items: baseline; display: flex; gap: 10px; justify-content: space-between; }
.chat-number-pane-title { font-size: 12.5px; font-weight: 800; letter-spacing: -.1px; }
.chat-number-pane-note { color: var(--faint); font-size: 11px; white-space: nowrap; }
.chat-number-pane-actions { align-items: center; display: flex; gap: 8px; }
.chat-number-refresh {
  align-items: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  gap: 5px;
  height: 28px;
  padding: 0 8px;
}
.chat-number-refresh:hover:not(:disabled) { background: var(--app-hover); border-color: var(--app-primary-border); color: var(--text); }
.chat-number-refresh:disabled { cursor: wait; opacity: .55; }
.chat-number-refresh.is-refreshing svg { animation: chat-number-spin .8s linear infinite; }
@keyframes chat-number-spin { to { transform: rotate(360deg); } }
.chat-qr-frame {
  align-items: center;
  aspect-ratio: 1;
  background: #fff;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  padding: 8px;
}
/* Scale the QR by repeating pixels: smoothing greys the module edges. */
.chat-qr-image { height: 100%; image-rendering: pixelated; object-fit: contain; width: 100%; }
/* Nothing to scan yet: drop the white square down to a hint-sized panel. */
.chat-qr-frame:has(.chat-qr-placeholder) { aspect-ratio: auto; background: var(--panel-hover); min-height: 148px; }
.chat-qr-placeholder {
  align-items: center;
  color: var(--faint);
  display: grid;
  font-size: 12px;
  gap: 8px;
  justify-items: center;
  padding: 12px;
  text-align: center;
}
.chat-number-status { color: var(--subtle); font-size: 11.5px; line-height: 1.5; }
.chat-number-error { color: var(--rose); font-size: 11.5px; line-height: 1.5; }
.chat-number-list { display: grid; gap: 8px; list-style: none; margin: 0; max-height: 268px; overflow-y: auto; padding: 0; }
.chat-number-row {
  align-items: center;
  background: var(--panel-hover);
  border: 1px solid var(--border);
  border-radius: 11px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: 30px minmax(0, 1fr) auto;
  padding: 9px 11px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease;
  width: 100%;
}
.chat-number-row:hover:not(:disabled) { background: var(--app-hover); border-color: var(--app-primary-border); }
.chat-number-row:disabled { cursor: not-allowed; opacity: .5; }
.chat-number-icon {
  align-items: center;
  background: var(--primary-soft);
  border-radius: 9px;
  color: var(--primary-light);
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}
.chat-number-body { display: grid; gap: 2px; min-width: 0; }
.chat-number-name, .chat-number-detail { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-number-name { font-size: 12.5px; font-weight: 700; }
.chat-number-detail { color: var(--subtle); font-size: 11.5px; }
.chat-number-hint { color: var(--green); font-size: 11px; font-weight: 700; white-space: nowrap; }
.chat-number-hint.is-blocked { color: var(--faint); }
/* Desktop editor: the agent page takes the whole width, with the prompt filling
   the left column and a flat list of settings on the right. Each column scrolls
   on its own. Colours are the same tokens the stacked layout uses. */
@media (min-width: 1180px) {
  .chat-content:has(> .chat-agent-page) { padding: 12px 16px; }
  .chat-agent-page { max-width: none; }
  .chat-agent-expanded-topline { padding: 9px 14px; }
  .chat-agent-expanded-topline .chat-avatar-lg { border-radius: 10px; font-size: 14px; height: 34px; width: 34px; }
  .chat-agent-expanded-topline .chat-identity { grid-template-columns: 34px minmax(0, 1fr); }
  .chat-agent-expanded-topline .chat-heading { font-size: 17px; }
  /* The button's -7px margins let it overhang its own width; without the extra
     14px a short name gets cut off with free space beside it. */
  .chat-heading-edit:not(.chat-heading-input) { width: calc(100% + 14px); }
  .chat-agent-expanded-topline .chat-btn { min-height: 34px; }
  .chat-agent-expanded-grid { gap: 12px; grid-template-rows: minmax(0, 1fr); padding: 12px; }
  .chat-editor { gap: 12px; padding-right: 0; }
  /* Equal outer columns keep the tabs centred whatever the name's length. The back
     button sits outside this grid, so the grid reaches back under it: the middle
     is then the middle of the whole bar, not of what is left after the button. */
  .chat-agent-back { position: relative; z-index: 1; }
  .chat-agent-expanded-topline > .chat-detail-head { grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); margin-left: -46px; }
  .chat-agent-expanded-topline .chat-identity { padding-left: 46px; }
  .chat-agent-expanded-topline .chat-heading-row { flex-wrap: nowrap; }
  .chat-agent-expanded-topline .chat-heading { min-width: 0; }
  .chat-agent-expanded-topline .chat-heading-row > :not(.chat-heading) { flex: none; }
  .chat-agent-expanded-topline .chat-editor-actions { flex-wrap: nowrap; }
  .chat-agent-expanded-topline .chat-tab { min-height: 28px; }
  .chat-card-conversations { flex: 1 1 0; height: auto; }
}
.chat-editor-columns {
  display: grid;
  flex: 1 1 0;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr) 380px;
  grid-template-rows: minmax(0, 1fr);
  min-height: 440px;
}
/* The prompt takes the top half of the left column, Images & Files the space under
   it. The column scrolls when a long file list needs more room than that. */
.chat-editor-main { display: flex; flex-direction: column; gap: 12px; min-height: 0; min-width: 0; overflow-y: auto; }
.chat-prompt-card { display: flex; flex: 0 0 50%; flex-direction: column; min-width: 0; padding: 14px; }
.chat-card.chat-files-card { padding: 0 14px; }
.chat-card.chat-files-card:empty { display: none; }
.chat-card.chat-new-note { align-items: center; background: var(--primary-soft); border-color: var(--app-primary-border); display: flex; flex-wrap: wrap; gap: 6px 10px; padding: 8px 8px 8px 12px; }
.chat-new-note-tag { background: var(--primary-light); border-radius: 999px; color: var(--surface); flex: none; font-size: 10.5px; font-weight: 800; padding: 2px 8px; }
.chat-new-note-text { color: var(--text); flex: 0 1 auto; font-size: 13px; font-weight: 600; min-width: 0; }
.chat-new-note-try { background: none; border: 0; color: var(--primary-light); cursor: pointer; flex: none; font: inherit; font-size: 13px; font-weight: 750; min-height: 28px; padding: 0 2px; text-decoration: underline; text-underline-offset: 3px; }
.chat-new-note-close { flex: none; margin-left: auto; }
.chat-prompt-card > .chat-card-head { flex: 0 0 auto; margin-bottom: 8px; }
.chat-prompt-card > .chat-textarea { flex: 1 1 0; min-height: 0 !important; resize: none; }
.chat-config-panel.is-rail { flex: none; min-height: 0; }
.is-rail > .chat-panel-body { padding: 4px 14px; }
.is-rail .chat-accordion-list { gap: 0; }
.is-rail .chat-accordion-item,
.is-rail .chat-accordion-item.is-open { background: transparent; border: 0; border-bottom: 1px solid var(--border); border-radius: 0; overflow: visible; }
.is-rail .chat-accordion-item:last-child { border-bottom: 0; }
.is-rail .chat-accordion-button { grid-template-columns: 20px minmax(0, 1fr) auto 18px; padding: 14px 2px; }
.is-rail .chat-accordion-icon,
.is-rail .chat-accordion-item.is-open .chat-accordion-icon { background: transparent; border: 0; height: 20px; width: 20px; }
.is-rail .chat-accordion-body { border-top: 0; padding: 0 2px 16px; }
.is-rail .chat-number-grid { grid-template-columns: minmax(0, 1fr); }
.is-rail .chat-number-pane { background: transparent; border: 0; padding: 0; }
.is-rail .chat-accordion-body > .chat-order-settings { margin-top: 0; }
.chat-order-toggle:disabled { cursor: not-allowed; opacity: .55; }
/* The top bar and drawer backdrop only exist below the tablet breakpoint. */
/* Large desktops: the list is capped at 1320px, so give the wide screen a
   little more breathing room rather than stretching the rows. */
@media (min-width: 1680px) {
  .chat-content { padding: 28px 40px; }
}
/* Small laptops / landscape tablets: a slimmer sidebar keeps the list usable. */
@media (max-width: 1100px) {
  .chat-content { padding: 18px 20px; }
}
/* Tablets and phones: the sidebar becomes a drawer behind a sticky top bar,
   and the page scrolls as a whole instead of each pane on its own. */
@media (max-width: 900px) {
  .chat-shell { display: block; height: auto; max-height: none; min-height: 100dvh; overflow: visible; width: 100%; max-width: 100%; }
  .chat-main { height: auto; overflow: visible; }
  .chat-content { padding: 16px; }
  .chat-workspace { grid-template-columns: 1fr; }
  .chat-panel { max-height: none; }
  .chat-agent-browser { overflow: visible; }
  .chat-agent-browser > .chat-panel-body { overflow: visible; }
  .chat-number-grid { grid-template-columns: 1fr; }
  .chat-qr-frame { justify-self: center; max-width: 260px; width: 100%; }
  .chat-agent-page { overflow: visible; }
  .chat-agent-expanded-grid { overflow: visible; }
  .chat-agent-expanded-grid > .chat-editor { overflow: visible; padding-right: 0; }
  .chat-page-links { display: flex; }
}
/* Phones: one column everywhere, the agent editor goes full screen, and
   touch targets grow a little. */
@media (max-width: 640px) {
  .chat-content { padding: 12px; }
  .chat-panel-head { padding: 12px 14px; }
  .chat-panel-body { padding: 12px 14px; }
  .chat-fields-2 { grid-template-columns: 1fr; }
  .chat-composer { grid-template-columns: 1fr; }
  .chat-modal-grid { grid-template-columns: 1fr; }
  .chat-modal-backdrop { align-items: flex-end; padding: 0; }
  .chat-modal-card { border-radius: 18px 18px 0 0; max-height: calc(100dvh - 24px); }
  .chat-modal-head, .chat-modal-body { padding: 16px; }
  .chat-modal-footer { flex-direction: column-reverse; padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); }
  .chat-modal-footer .chat-btn { width: 100%; }
  .chat-input, .chat-select { font-size: 16px; } /* stops iOS zooming on focus */
  .chat-agent-page { border-radius: 16px; }
  .chat-agent-expanded-grid { gap: 12px; padding: 12px 12px calc(12px + env(safe-area-inset-bottom)); }
  .chat-agent-expanded-topline { align-items: flex-start; padding: 12px; }
  .chat-detail-head { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .chat-editor-actions { justify-content: stretch; }
  .chat-editor-actions .chat-btn { flex: 1 1 0; }
  .chat-heading { font-size: 18px; }
  .chat-heading-input { width: 100%; }
  .chat-card { padding: 14px; }
  .chat-card-head { flex-wrap: wrap; }
  .chat-mini-select { max-width: 100%; width: 100%; }
  .chat-tabs { width: 100%; }
  .chat-tab { flex: 1 1 0; }
  .chat-number-pane-head { flex-wrap: wrap; }
  .chat-number-pane-note { white-space: normal; }
  .chat-card-conversations { height: min(640px, calc(100dvh - 220px)); min-height: 380px; }
  .chat-toast { bottom: calc(16px + env(safe-area-inset-bottom)); max-width: calc(100vw - 24px); width: max-content; }
}
/* Narrow phones: the create button drops its label so the header fits; the
   WhatsApp help button keeps a short one so it still says what it is for. */
@media (max-width: 420px) {
  .chat-list-head .chat-btn-label { display: none; }
  .chat-list-head .chat-btn-label-short { display: inline; }
  .chat-list-head .chat-btn { min-height: 36px; padding: 0 11px; }
  .chat-tab { padding: 0 6px; }
  .chat-avatar { height: 30px; width: 30px; }
  .chat-accordion-button { gap: 8px; grid-template-columns: 28px minmax(0, 1fr) minmax(0, auto) 18px; padding: 11px 10px; }
}
`;

const avatarColors = ["#52525b", "#3f3f46", "#63636b", "#4a4a52", "#5a5a63", "#44444c"];

function avatarColor(id: string): string {
  let total = 0;
  for (const char of id) total += char.charCodeAt(0);
  return avatarColors[total % avatarColors.length];
}

function phoneNumberLabel(pn: ApiPhoneNumber): string {
  const number = pn.phone_number?.trim();
  const label = pn.label?.trim();
  if (label && number) return `${label} · ${number}`;
  return label || number || "Unnamed number";
}

function phoneNumberName(pn: ApiPhoneNumber): string {
  return pn.label?.trim() || pn.phone_number?.trim() || "Unnamed number";
}

function phoneNumberDetail(pn: ApiPhoneNumber): string {
  return pn.phone_number?.trim() || pn.wa_jid?.trim()?.split("@")[0] || "Number pending";
}


// upsertPhoneNumber keeps the catalogue in sync with a polled login session
// without reloading the whole page state.
function upsertPhoneNumber(current: ApiPhoneNumber[], updated: ApiPhoneNumber): ApiPhoneNumber[] {
  const index = current.findIndex((pn) => pn.id === updated.id);
  if (index === -1) return [updated, ...current];
  return current.map((pn) => (pn.id === updated.id ? updated : pn));
}

// The server allows one chat agent per account. Checked before the create modal
// opens, because the modal starts by linking a number: finding out after the
// scan would leave someone with a linked number and no agent.
const MAX_CHAT_AGENTS = 1;
const CHAT_AGENT_LIMIT_MESSAGE = "Your account already has a chat agent. Edit that agent instead of creating a new one.";

// The auto-login effect's owner for a login the create modal started, which has
// no agent to belong to yet.
const NEW_AGENT_LOGIN = "new-agent";

// The create modal links a number first and then asks for a name; the rest of
// the form keeps the defaults a new agent is created with, and is edited in the
// editor afterwards. An empty phone_number_id is what keeps it on the linking step.
// There is no model setting: every chat agent answers with the one model the
// server allows, so neither payload below sends a model section.
type CreateForm = {
  name: string;
  phone_number_id: string;
  system_prompt: string;
};

function newCreateForm(index: number): CreateForm {
  return {
    name: `New chat agent ${index}`,
    phone_number_id: "",
    system_prompt: "You are a helpful WhatsApp assistant.",
  };
}

function createFormToPayload(form: CreateForm): CreateChatAgentPayload {
  return {
    agent: {
      name: form.name.trim(),
      phone_number_id: form.phone_number_id || null,
      status: form.phone_number_id ? "active" : chatAgentDefaults.status,
    },
    prompt: { system_prompt: form.system_prompt },
    knowledge_base: { knowledge_base_ids: [] },
    tools: { tool_ids: [] },
  };
}

function toChatAgentPayload(agent: ApiChatAgent): CreateChatAgentPayload {
  return {
    agent: { ...agent.agent },
    prompt: agent.prompt ? { ...agent.prompt } : undefined,
    knowledge_base: agent.knowledge_base
      ? { knowledge_base_ids: [...(agent.knowledge_base.knowledge_base_ids ?? [])] }
      : undefined,
    tools: agent.tools ? { tool_ids: [...(agent.tools.tool_ids ?? [])] } : undefined,
    // Only a server that returned the section accepts it back: the API refuses
    // a section it doesn't know, and orders_on is read-only.
    order: agent.order
      ? {
          order_enabled: agent.order.order_enabled,
          order_instructions: agent.order.order_instructions,
        }
      : undefined,
    media: agent.media ? { ...agent.media } : undefined,
  };
}

// The list lives at /dashboard/chat and each agent on its own page at
// /dashboard/chat/<agentId>; both are this component, told which agent to show.
export default function ChatAgentsPage({ agentId = "" }: { agentId?: string }) {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn: isAuthSignedIn } = useAuth();

  const [chatAgents, setChatAgents, hasCachedAgents] = useCachedState<ApiChatAgent[]>("chat-agents", []);
  // Which part of the editor is on screen. Cached per agent because a thread
  // opens on its own page, and coming back should land on the Conversation tab
  // it left.
  const [editorTab, setEditorTab] = useCachedState<EditorTab>(`chat-editor-tab:${agentId}`, "agent");
  const isDesktop = useIsDesktop();
  // True until the first agent fetch settles, so an empty list is only called
  // empty once the server has actually said so.
  const [isLoading, setIsLoading] = useState(true);
  // A list cached from an earlier visit is shown at once while it refetches;
  // only a first-ever load waits behind the skeleton.
  const showSkeleton = isLoading && !hasCachedAgents;
  const selectedId = agentId;
  const [query, setQuery] = useState("");
  const [knowledgeBases, setKnowledgeBases] = useCachedState<ApiKnowledgeBase[]>("knowledge-bases", []);
  const [tools, setTools] = useCachedState<ApiTool[]>("tools", []);
  const [phoneNumbers, setPhoneNumbers] = useCachedState<ApiPhoneNumber[]>("phone-numbers", []);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [createForm, setCreateForm] = useState<CreateForm | null>(null);
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  // A delete button, on a list card or the agent's page, only asks; the agent
  // goes once the modal is confirmed.
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const deleteTarget = chatAgents.find((agent) => agent.id === deleteTargetId) ?? null;
  const [isDeleting, setIsDeleting] = useState(false);
  // The QR login the editor is showing. One session serves whichever agent with
  // no number is selected — the scan lands on the agent being looked at — so it
  // is the phone-number row alone, with no agent bound to it.
  const [numberLogin, setNumberLogin] = useState<ApiPhoneNumber | null>(null);
  const [numberLoginError, setNumberLoginError] = useState("");
  const [isStartingLogin, setIsStartingLogin] = useState(false);
  const [isRefreshingNumbers, setIsRefreshingNumbers] = useState(false);
  // One login is started per state it can be started from — keyed by the agent
  // and the session it saw — so a failed start is not retried in a loop while
  // an expiry, which changes the key, still triggers a fresh code.
  const autoLoginKey = useRef("");
  // Automatic reissues so far, per agent, against maxAutoLogins.
  const autoLoginRuns = useRef({ agentId: "", count: 0 });
  // An account with no agents is taken straight to linking a number, once per
  // visit, so cancelling leaves them on the empty list rather than reopening.
  const openedFirstAgentSetup = useRef(false);
  // Saves waiting out their debounce, with the save itself so leaving the page
  // can send it at once instead of dropping it.
  const saveTimers = useRef<
    Map<string, { timer: ReturnType<typeof setTimeout>; run: () => void }>
  >(new Map());
  // Every edit bumps its agent.s revision. A save only adopts the server echo
  // when the revision it was issued with is still current, so a PATCH that is
  // answered mid-sentence can never overwrite the keystrokes typed since.
  const editRevisions = useRef<Map<string, number>>(new Map());
  // Read by the login poller, which must not restart on every edit: the agents
  // as they stand, and the agent a completed scan hands its number to.
  const chatAgentsRef = useRef<ApiChatAgent[]>([]);
  const scanTargetRef = useRef("");
  useEffect(() => {
    chatAgentsRef.current = chatAgents;
  }, [chatAgents]);
  // The create modal is on its linking step, so a completed scan moves it on to
  // naming the agent instead of being assigned to one.
  const isPairingForCreate = Boolean(createForm && !createForm.phone_number_id);
  const isPairingForCreateRef = useRef(false);
  useEffect(() => {
    isPairingForCreateRef.current = isPairingForCreate;
  }, [isPairingForCreate]);

  const isAuthenticated = Boolean(
    isUserLoaded && isAuthLoaded && isUserSignedIn && isAuthSignedIn && user
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    // Each list lands on its own, so the agent list is not held back by the
    // slowest of the lookups the editor needs.
    listDashboardChatAgents(getToken)
      .then((agents) => {
        if (cancelled) return;
        setChatAgents(agents);
        // Only on the server's word: a failed load or a cached list proves nothing.
        if (!agentId && agents.length === 0 && !openedFirstAgentSetup.current) {
          openedFirstAgentSetup.current = true;
          setCreateForm((current) => current ?? newCreateForm(1));
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setNotice({ kind: "error", text: error?.message || "Could not load chat agents" });
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    apiListKnowledgeBases(getToken)
      .then((kbs) => !cancelled && setKnowledgeBases(kbs))
      .catch(() => undefined);
    apiListTools(getToken)
      .then((list) => !cancelled && setTools(list))
      .catch(() => undefined);
    apiListPhoneNumbers(getToken)
      .then((numbers) => !cancelled && setPhoneNumbers(numbers))
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [agentId, getToken, isAuthenticated, setChatAgents, setKnowledgeBases, setPhoneNumbers, setTools]);

  // Going back to the list, or on to another agent, unmounts this page. An
  // edit still inside its debounce is sent then rather than lost; its answer
  // lands in the shared page cache the next page reads.
  useEffect(() => {
    const pending = saveTimers.current;
    return () => {
      for (const { timer, run } of [...pending.values()]) {
        clearTimeout(timer);
        run();
      }
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return chatAgents;
    return chatAgents.filter((agent) => agent.agent.name.toLowerCase().includes(normalized));
  }, [chatAgents, query]);

  const selected = useMemo(
    () => (selectedId ? chatAgents.find((agent) => agent.id === selectedId) ?? null : null),
    [chatAgents, selectedId]
  );

  // A live agent's runtime section changes on the server as messages arrive, so
  // it is re-read while the agent is open. Only that section is taken, never the
  // settings, so an edit still waiting to save is not overwritten.
  const selectedLiveId = selected?.agent.status === "active" ? selected.id : "";
  useEffect(() => {
    if (!selectedLiveId) return;
    let cancelled = false;
    const timer = setInterval(async () => {
      try {
        const fresh = await getDashboardChatAgent(selectedLiveId, getToken);
        if (cancelled) return;
        setChatAgents((current) =>
          current.map((item) =>
            item.id === fresh.id
              ? {
                  ...item,
                  reply_limit_reached: fresh.reply_limit_reached,
                  hourly_limit_resets_at: fresh.hourly_limit_resets_at,
                  runtime: fresh.runtime,
                }
              : item
          )
        );
      } catch {
        // A missed refresh is retried on the next tick.
      }
    }, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [getToken, selectedLiveId, setChatAgents]);

  const queueSave = useCallback(
    (agent: ApiChatAgent, delay = 500) => {
      const previous = saveTimers.current.get(agent.id);
      if (previous) clearTimeout(previous.timer);
      const revision = editRevisions.current.get(agent.id) ?? 0;
      const run = async () => {
        saveTimers.current.delete(agent.id);
        try {
          const payload = toChatAgentPayload(agent);
          console.log("[wa-login] saving chat agent", {
            agentId: agent.id,
            phoneNumberId: agent.agent.phone_number_id ?? null,
            payload,
          });
          const saved = await updateDashboardChatAgent(agent.id, payload, getToken);
          console.log("[wa-login] chat agent saved", {
            agentId: saved.id,
            phoneNumberId: saved.agent.phone_number_id ?? null,
          });
          if ((editRevisions.current.get(agent.id) ?? 0) !== revision) return;
          setChatAgents((current) =>
            current.map((item) => (item.id === saved.id ? saved : item))
          );
        } catch (error) {
          console.error("[wa-login] chat agent save failed", { agentId: agent.id, error });
          setNotice({
            kind: "error",
            text: error instanceof Error ? error.message : "Could not save chat agent",
          });
        }
      };
      saveTimers.current.set(agent.id, { timer: setTimeout(run, delay), run });
    },
    [getToken, setChatAgents]
  );

  // Edits update the workspace immediately and are persisted after a short
  // debounce so typing a prompt does not issue one PATCH per keystroke.
  const patchSelected = useCallback(
    (patch: (agent: ApiChatAgent) => ApiChatAgent) => {
      if (!selected) return;
      const updated = { ...patch(selected), updated_at: new Date().toISOString() };
      editRevisions.current.set(selected.id, (editRevisions.current.get(selected.id) ?? 0) + 1);
      setChatAgents((current) =>
        current.map((agent) => (agent.id === selected.id ? updated : agent))
      );
      queueSave(updated, updated.agent.status !== selected.agent.status ? 0 : 500);
    },
    [queueSave, selected, setChatAgents]
  );

  // assignNumber hands a number to one agent by id, which is not always the
  // selected one: the QR poller resolves the login the editor started even after
  // the workspace has moved on. An agent that gained a number in the meantime
  // keeps it, so a late scan never claws one back.
  const assignNumber = useCallback(
    (agentId: string, phoneNumberId: string) => {
      const target = chatAgentsRef.current.find((agent) => agent.id === agentId);
      console.log("[wa-login] assignNumber", {
        agentId,
        phoneNumberId,
        found: Boolean(target),
        existingPhoneNumberId: target?.agent.phone_number_id ?? null,
      });
      if (!target || target.agent.phone_number_id) {
        console.warn("[wa-login] assignNumber skipped: agent missing or already has a number");
        return;
      }
      const updated = {
        ...target,
        agent: { ...target.agent, phone_number_id: phoneNumberId, status: "active" as const },
        updated_at: new Date().toISOString(),
      };
      editRevisions.current.set(agentId, (editRevisions.current.get(agentId) ?? 0) + 1);
      setChatAgents((current) => current.map((agent) => (agent.id === agentId ? updated : agent)));
      queueSave(updated, 0);
    },
    [queueSave, setChatAgents]
  );

  const numberLoginId = numberLogin?.id;
  const numberLoginStatus = numberLogin?.status;

  // Poll the QR session started from the editor until WhatsApp resolves it. The
  // chat-agent assignment is written here rather than by the server — the login
  // endpoint only knows voice agents — so the number lands on the agent as soon
  // as the scan connects it, with the editor still open.
  useEffect(() => {
    if (!numberLoginId || !numberLoginStatus || terminalLoginStatuses.has(numberLoginStatus)) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const updated = await apiGetPhoneNumber(numberLoginId, getToken);
        console.log("[wa-login] poll", {
          id: updated.id,
          status: updated.status,
          phoneNumber: updated.phone_number ?? null,
          cancelled,
        });
        if (cancelled) return;
        setNumberLoginError("");
        // A scan of a number the account already has relinks that number, so
        // the login comes back as it, under the number's own id.
        setNumberLogin((current) =>
          current && (current.id === updated.id || current.id === numberLoginId) ? updated : current
        );
        setPhoneNumbers((current) => upsertPhoneNumber(current, updated));
        if (updated.status === "connected") {
          if (isPairingForCreateRef.current) {
            console.log("[wa-login] connected for a new agent", { phoneNumberId: updated.id });
            setCreateError("");
            setCreateForm((current) => (current ? { ...current, phone_number_id: updated.id } : current));
            return;
          }
          const target = scanTargetRef.current;
          console.log("[wa-login] connected", { phoneNumberId: updated.id, scanTarget: target || null });
          if (target) assignNumber(target, updated.id);
          else console.warn("[wa-login] connected but no scan target agent; number not assigned");
          setNotice({
            kind: "success",
            text: target
              ? `${phoneNumberName(updated)} connected and assigned to this agent`
              : `${phoneNumberName(updated)} connected`,
          });
        } else if (terminalLoginStatuses.has(updated.status)) {
          setNumberLoginError(`WhatsApp login ${phoneStatusLabels[updated.status].toLowerCase()}.`);
        }
      } catch (error) {
        console.error("[wa-login] poll failed", { id: numberLoginId, error });
        if (cancelled) return;
        if (error instanceof PhoneNumberError && error.status === 404) {
          // The server no longer knows this login — it restarted, which drops
          // unscanned QR sessions. Re-read the numbers in case the scan landed
          // first, and drop the dead login so a fresh code is issued.
          console.warn("[wa-login] login no longer exists on the server; issuing a new QR code");
          setNumberLogin((current) => (current && current.id === numberLoginId ? null : current));
          // With no login the key matches the editor's first run, which would
          // otherwise stop the reissue and leave the QR frame empty for good.
          autoLoginKey.current = "";
          try {
            setPhoneNumbers(await apiListPhoneNumbers(getToken));
          } catch {
            // The list is refreshed again on the next load.
          }
          return;
        }
        setNumberLoginError(
          error instanceof Error ? error.message : "Failed to check the WhatsApp login status"
        );
      }
    };

    // Fast enough that a code WhatsApp rotated mid-session is on screen almost
    // as soon as the server stores it.
    const stopPolling = startPolling(poll, 2000);

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [assignNumber, getToken, numberLoginId, numberLoginStatus, setPhoneNumbers]);

  useEffect(() => {
    scanTargetRef.current = selected && !selected.agent.phone_number_id ? selected.id : "";
  }, [selected]);

  // Who needs a number linked right now: the open agent if it has none, or the
  // agent the create modal is about to make.
  const loginOwner =
    selected && !selected.agent.phone_number_id
      ? selected.id
      : isPairingForCreate
        ? NEW_AGENT_LOGIN
        : "";

  // Puts a scannable QR code on screen. Asking for a code creates nothing: the
  // login only becomes a phone number if someone scans it, and the server hands
  // back the session already running rather than opening a second one, so an
  // editor that opens on every visit leaves no numbers behind.
  const startNumberLogin = useCallback(async () => {
    if (!loginOwner || isStartingLogin) return;
    const spentId = numberLogin && numberLogin.status !== "connected" ? numberLogin.id : null;

    setIsStartingLogin(true);
    setNumberLoginError("");
    try {
      console.log("[wa-login] starting login", { agentId: loginOwner, restartId: spentId });
      const started = spentId
        ? await apiRestartPhoneNumberLogin(spentId, getToken)
        : await apiStartPhoneNumberLogin({}, getToken);
      console.log("[wa-login] login started", { id: started.id, status: started.status });
      setNumberLogin(started);
    } catch (error) {
      console.error("[wa-login] start login failed", error);
      setNumberLoginError(
        error instanceof Error ? error.message : "Failed to start the WhatsApp login"
      );
    } finally {
      setIsStartingLogin(false);
    }
  }, [getToken, isStartingLogin, loginOwner, numberLogin]);

  // Swaps the login on screen, QR or an earlier code, for one linked by a typed
  // pairing code. The server ends the old login, and the poll picks up the new
  // one by its id. Throws for WhatsAppLinkHelp to show the message.
  //
  // The old login can leave the server a moment before the new one reaches this
  // page, and the poll can see that in between. Marked as starting, the 404
  // doesn't make the editor reissue a QR login that would land on top of this
  // one.
  const startNumberCodeLogin = useCallback(
    async (phone: string) => {
      setNumberLoginError("");
      setIsStartingLogin(true);
      try {
        const started = await apiStartPhoneNumberCodeLogin({ phone_number: phone }, getToken);
        setNumberLogin(started);
      } finally {
        setIsStartingLogin(false);
      }
    },
    [getToken]
  );

  // The way back from a pairing code to a scan. Throws for WhatsAppLinkHelp to
  // show the message.
  const startNumberQrLogin = useCallback(async () => {
    setNumberLoginError("");
    setIsStartingLogin(true);
    try {
      const started = await apiStartPhoneNumberQrLogin({}, getToken);
      setNumberLogin(started);
    } finally {
      setIsStartingLogin(false);
    }
  }, [getToken]);

  // A chat agent with no number gets its QR code without being asked: opening
  // the editor or the create modal starts the login, and a session that runs out
  // of codes is reissued, so what is on screen is always a scannable code.
  //
  // WhatsApp owns the rotation itself — it hands the session a series of codes
  // (roughly one a minute, then one every 20s) which the server stores as they
  // arrive and the poll above picks up. This only has to keep a live session
  // there to receive them.
  //
  // A phone gets none: it can't scan its own screen, so its codes only ever ran
  // out unscanned. The card offers it the number form instead.
  const isPhone = useIsPhone();
  useEffect(() => {
    if (!isAuthenticated || !loginOwner || isStartingLogin) return;
    if (isPhone) return;

    // A live session already has a code on screen, and it serves this agent as
    // readily as the one it was started from: the scan is assigned to whichever
    // number-less agent is selected when it lands.
    const status = numberLogin?.status;
    if (status === "pending_qr") return;

    const key = `${loginOwner}:${numberLogin?.id ?? "none"}:${status ?? "none"}`;
    if (autoLoginKey.current === key) return;

    if (autoLoginRuns.current.agentId !== loginOwner) {
      autoLoginRuns.current = { agentId: loginOwner, count: 0 };
    }
    // An editor left open all day stops reissuing eventually; the button is
    // still there for whoever comes back to it.
    if (autoLoginRuns.current.count >= maxAutoLogins) return;
    autoLoginRuns.current.count += 1;

    autoLoginKey.current = key;
    void startNumberLogin();
  }, [isAuthenticated, isPhone, isStartingLogin, loginOwner, numberLogin, startNumberLogin]);

  // The pick-a-number half of the setup card. A number another chat agent
  // already holds stays listed, but says who holds it and cannot be picked —
  // two agents replying on one number is ambiguous.
  const assignableNumbers = useMemo<AssignableNumber[]>(() => {
    return phoneNumbers
      .filter((pn) => pn.status === "connected")
      .map((pn) => {
        const holder = chatAgents.find(
          (agent) => agent.id !== selected?.id && agent.agent.phone_number_id === pn.id
        );
        const blocked = Boolean(holder);
        return {
          id: pn.id,
          name: phoneNumberName(pn),
          detail: phoneNumberDetail(pn),
          disabled: blocked,
          hint: holder ? `In use by ${holder.agent.name}` : "Available",
        };
      });
  }, [chatAgents, phoneNumbers, selected]);

  const refreshPhoneNumbers = useCallback(async () => {
    if (!isAuthenticated || isRefreshingNumbers) return;
    setIsRefreshingNumbers(true);
    try {
      setPhoneNumbers(await apiListPhoneNumbers(getToken));
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Could not refresh phone numbers",
      });
    } finally {
      setIsRefreshingNumbers(false);
    }
  }, [getToken, isAuthenticated, isRefreshingNumbers, setPhoneNumbers]);

  const openCreateModal = useCallback(() => {
    if (chatAgents.length >= MAX_CHAT_AGENTS) {
      setNotice({ kind: "error", text: CHAT_AGENT_LIMIT_MESSAGE });
      return;
    }
    setCreateError("");
    setNumberLoginError("");
    autoLoginKey.current = "";
    autoLoginRuns.current = { agentId: "", count: 0 };
    setCreateForm(newCreateForm(chatAgents.length + 1));
  }, [chatAgents.length]);

  // Dropping the login stops its poll. Opening the modal again gets the same
  // session back while the server still has it running.
  const closeCreateModal = useCallback(() => {
    setCreateForm(null);
    setCreateError("");
    setNumberLogin(null);
    setNumberLoginError("");
  }, []);

  // The linking step's other way forward: a number already on the account.
  const chooseCreateNumber = useCallback((phoneNumberId: string) => {
    setCreateError("");
    setNumberLogin(null);
    setNumberLoginError("");
    setCreateForm((current) => (current ? { ...current, phone_number_id: phoneNumberId } : current));
  }, []);

  // Back from naming to linking, for the wrong number or one another agent holds.
  const changeCreateNumber = useCallback(() => {
    setCreateError("");
    setNumberLogin(null);
    setNumberLoginError("");
    autoLoginKey.current = "";
    setCreateForm((current) => (current ? { ...current, phone_number_id: "" } : current));
  }, []);

  const createAgent = useCallback(async () => {
    if (!createForm || isCreating) return;
    if (!createForm.name.trim()) {
      setCreateError("Give the agent a name.");
      return;
    }
    setCreateError("");
    setIsCreating(true);
    try {
      const created = await createDashboardChatAgent(createFormToPayload(createForm), getToken);
      setChatAgents((current) => [created, ...current]);
      setCreateForm(null);
      // Opening the new agent's page is the confirmation; a toast here would
      // unmount with the list before anyone read it.
      router.push(`/dashboard/chat/${created.id}`);
    } catch (error) {
      if (isChatAgentLimitError(error)) {
        setCreateError(CHAT_AGENT_LIMIT_MESSAGE);
      } else {
        setCreateError(error instanceof Error ? error.message : "Could not create chat agent");
      }
    } finally {
      setIsCreating(false);
    }
  }, [createForm, getToken, isCreating, router, setChatAgents]);

  const deleteAgent = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const pending = saveTimers.current.get(deleteTarget.id);
      if (pending) clearTimeout(pending.timer);
      saveTimers.current.delete(deleteTarget.id);
      await deleteDashboardChatAgent(deleteTarget.id, getToken);
      setChatAgents((current) => current.filter((agent) => agent.id !== deleteTarget.id));
      if (agentId) {
        // Back to the list, where the agent is gone; replace, so Back does not
        // return to the deleted agent's page.
        router.replace("/dashboard/chat");
      } else {
        setNotice({ kind: "success", text: `${deleteTarget.agent.name} deleted` });
      }
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Could not delete chat agent",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTargetId("");
    }
  }, [agentId, deleteTarget, getToken, router, setChatAgents]);

  // Escape dismisses the delete confirmation. It listens in the capture phase
  // and stops the key there, so nothing behind it also acts on the key.
  const isConfirmingDelete = Boolean(deleteTarget);
  useEffect(() => {
    if (!isConfirmingDelete) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      if (!isDeleting) setDeleteTargetId("");
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [isConfirmingDelete, isDeleting]);

  return (
    <div className="chat-shell app-accent-green">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <DashboardSidebar activeLabel="Chat Agents" stackBelow={900} />

      <main className="chat-main">
        <div className="chat-content">
          {!agentId && chatAgents.some((agent) => agent.hourly_limit_resets_at) ? (
            <div className="chat-limit-list">
              {chatAgents.map((agent) =>
                agent.hourly_limit_resets_at ? (
                  <HourlyLimitCard
                    agentName={agent.agent.name}
                    key={agent.id}
                    resetsAt={agent.hourly_limit_resets_at}
                  />
                ) : null
              )}
            </div>
          ) : null}
          {agentId ? (
            <section aria-label="Chat agent" className="chat-agent-page">
              {selected ? (
                <>
                  <AgentHeader
                    agent={selected}
                    onDelete={() => setDeleteTargetId(selected.id)}
                    onPatch={patchSelected}
                    tabs={isDesktop ? <EditorTabs isDesktop onSelect={setEditorTab} tab={editorTab} /> : null}
                  />
                  <div className="chat-agent-expanded-grid">
                    <Editor
                      agent={selected}
                      assignableNumbers={assignableNumbers}
                      isRefreshingNumbers={isRefreshingNumbers}
                      isStartingLogin={isStartingLogin}
                      knowledgeBases={knowledgeBases}
                      login={
                        numberLogin && numberLogin.status !== "connected" ? numberLogin : null
                      }
                      loginError={numberLoginError}
                      onPatch={patchSelected}
                      onRefreshNumbers={refreshPhoneNumbers}
                      onRequestCode={startNumberCodeLogin}
                      onRequestQr={startNumberQrLogin}
                      onStartLogin={startNumberLogin}
                      onSelectTab={setEditorTab}
                      phoneNumbers={phoneNumbers}
                      tab={editorTab}
                      tools={tools}
                    />
                  </div>
                </>
              ) : (
                // A link or a reload lands here before the list has loaded, so
                // "not found" waits until the server has answered.
                <div className="chat-agent-page-empty">
                  {isLoading ? (
                    <span aria-busy="true">Loading chat agent...</span>
                  ) : (
                    <>
                      <span>This chat agent does not exist or was deleted.</span>
                      <Link className="chat-btn chat-btn-secondary chat-btn-sm" href="/dashboard/chat">
                        Back to chat agents
                      </Link>
                    </>
                  )}
                </div>
              )}
            </section>
          ) : (
          <section className="chat-workspace" aria-label="Chat agents workspace">
            <div className="chat-panel chat-agent-browser">
              <div className="chat-panel-head chat-list-head">
                <div>
                  <h2 className="chat-panel-title">
                    <span className="chat-panel-ic">
                      <Icon name="chat" size={16} />
                    </span>
                    Chat agents
                  </h2>
                  <div className="chat-panel-copy">
                    {showSkeleton ? "Loading chat agents..." : `${chatAgents.length} chat agents`}
                  </div>
                </div>
                <div className="chat-list-actions">
                  <a
                    aria-label="Trouble connecting? Chat with us on WhatsApp"
                    className="chat-btn chat-btn-whatsapp chat-btn-sm"
                    href={SUPPORT_WHATSAPP_URL}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <WhatsAppGlyph size={15} />
                    <span className="chat-btn-label">Trouble connecting?</span>
                    <span className="chat-btn-label-short">Need help?</span>
                  </a>
                  <button
                    aria-label="New chat agent"
                    className="chat-btn chat-btn-primary chat-btn-sm"
                    onClick={openCreateModal}
                    type="button"
                  >
                    <Icon name="plus" size={14} stroke="#fff" sw={2.4} />
                    <span className="chat-btn-label">New chat agent</span>
                  </button>
                </div>
              </div>
              <div className={`chat-panel-body${!showSkeleton && chatAgents.length === 0 ? " chat-panel-body-empty" : ""}`}>
                <div className="chat-search">
                  <span className="chat-search-icon">
                    <Icon name="search" size={15} sw={2.2} />
                  </span>
                  <input
                    className="chat-input"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search agents..."
                    value={query}
                  />
                </div>
                {showSkeleton ? (
                  <div aria-busy="true" aria-label="Loading chat agents" className="chat-list">
                    {[0, 1, 2].map((row) => (
                      <div aria-hidden="true" className="chat-list-row chat-list-skeleton" key={row}>
                        <span className="chat-skel chat-skel-avatar" />
                        <span className="chat-list-identity">
                          <span className="chat-skel" style={{ width: "58%" }} />
                          <span className="chat-skel chat-skel-sm" style={{ width: "38%" }} />
                        </span>
                        <span className="chat-list-resources">
                          <span className="chat-skel chat-skel-sm" style={{ width: 96 }} />
                        </span>
                        <span className="chat-skel chat-skel-pill" />
                        <span className="chat-list-chevron" />
                      </div>
                    ))}
                  </div>
                ) : chatAgents.length === 0 ? (
                  <div className="chat-empty-list chat-empty-start">
                    <span>No chat agents yet.</span>
                    <button className="chat-btn chat-btn-primary" onClick={openCreateModal} type="button">
                      <Icon name="plus" size={14} stroke="#fff" sw={2.4} />
                      New chat agent
                    </button>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="chat-empty-list">No agent matches that search.</div>
                ) : (
                  <div className="chat-list">
                    {filtered.map((agent) => {
                      const phone = phoneNumbers.find((item) => item.id === agent.agent.phone_number_id);
                      const knowledgeCount = agent.knowledge_base?.knowledge_base_ids?.length ?? 0;
                      const toolCount = agent.tools?.tool_ids?.length ?? 0;
                      return (
                        <div className="chat-list-row" key={agent.id}>
                          <span
                            className="chat-avatar"
                            style={{ background: avatarColor(agent.id) }}
                          >
                            {agent.agent.name.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="chat-list-identity">
                            <Link
                              className="chat-list-name chat-list-link"
                              href={`/dashboard/chat/${agent.id}`}
                            >
                              {agent.agent.name}
                            </Link>
                            <span className="chat-list-phone">
                              {phone ? phoneNumberLabel(phone) : "No phone number"}
                            </span>
                          </span>
                          <span className="chat-list-resources">
                            <span><Icon name="book" size={12} />{knowledgeCount} KB</span>
                            <span><Icon name="wrench" size={12} />{toolCount} tools</span>
                            {agent.order?.orders_on ? (
                              <span className="chat-orders-on">Orders on</span>
                            ) : null}
                          </span>
                          <StatusPill status={agent.agent.status ?? "inactive"} />
                          <span className="chat-list-row-end">
                            <button
                              aria-label={`Delete ${agent.agent.name}`}
                              className="chat-icon-btn chat-list-delete"
                              onClick={() => setDeleteTargetId(agent.id)}
                              title="Delete agent"
                              type="button"
                            >
                              <Icon name="trash" size={15} sw={2.2} />
                            </button>
                            <span className="chat-list-chevron">
                              <Icon name="chevron" size={16} sw={2.3} />
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
          )}
          <PageLinks />
        </div>
      </main>

      {deleteTarget ? (
        <div
          className="chat-confirm-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) setDeleteTargetId("");
          }}
        >
          <div
            aria-describedby="chat-delete-copy"
            aria-labelledby="chat-delete-title"
            aria-modal="true"
            className="chat-confirm"
            role="alertdialog"
          >
            <div className="chat-confirm-icon">
              <Icon name="trash" size={18} sw={2.2} />
            </div>
            <h2 className="chat-confirm-title" id="chat-delete-title">
              Delete chat agent
            </h2>
            <p className="chat-confirm-copy" id="chat-delete-copy">
              <strong>{deleteTarget.agent.name}</strong> will be deleted and will stop replying on
              WhatsApp. This cannot be undone.
            </p>
            <div className="chat-confirm-actions">
              <button
                autoFocus
                className="chat-btn chat-btn-secondary"
                disabled={isDeleting}
                onClick={() => setDeleteTargetId("")}
                type="button"
              >
                Cancel
              </button>
              <button
                className="chat-btn chat-confirm-danger"
                disabled={isDeleting}
                onClick={() => void deleteAgent()}
                type="button"
              >
                {isDeleting ? "Deleting…" : "Delete agent"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {createForm ? (
        <CreateChatAgentModal
          assignableNumbers={assignableNumbers}
          error={createError}
          form={createForm}
          isRefreshingNumbers={isRefreshingNumbers}
          isStartingLogin={isStartingLogin}
          isSubmitting={isCreating}
          login={numberLogin && numberLogin.status !== "connected" ? numberLogin : null}
          loginError={numberLoginError}
          onCancel={closeCreateModal}
          onChangeNumber={changeCreateNumber}
          onCreate={createAgent}
          onRefreshNumbers={refreshPhoneNumbers}
          onRequestCode={startNumberCodeLogin}
          onRequestQr={startNumberQrLogin}
          onSelectNumber={chooseCreateNumber}
          onStartLogin={startNumberLogin}
          phoneNumbers={phoneNumbers}
          setForm={setCreateForm}
        />
      ) : null}

      {notice ? (
        <div
          className={`chat-toast ${notice.kind === "error" ? "chat-toast-error" : "chat-toast-success"}`}
          role="status"
        >
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}


// "New chat agent" opens this. It links a WhatsApp number first, by QR code or
// pairing code, and only then asks for a name, so an agent is born answering on
// a number instead of sitting idle until someone connects one.
function CreateChatAgentModal({
  assignableNumbers,
  error,
  form,
  isRefreshingNumbers,
  isStartingLogin,
  isSubmitting,
  login,
  loginError,
  onCancel,
  onChangeNumber,
  onCreate,
  onRefreshNumbers,
  onRequestCode,
  onRequestQr,
  onSelectNumber,
  onStartLogin,
  phoneNumbers,
  setForm,
}: {
  assignableNumbers: AssignableNumber[];
  error: string;
  form: CreateForm;
  isRefreshingNumbers: boolean;
  isStartingLogin: boolean;
  isSubmitting: boolean;
  login: ApiPhoneNumber | null;
  loginError: string;
  onCancel: () => void;
  onChangeNumber: () => void;
  onCreate: () => void;
  onRefreshNumbers: () => void;
  onRequestCode: (phone: string) => Promise<void>;
  onRequestQr: () => Promise<void>;
  onSelectNumber: (phoneNumberId: string) => void;
  onStartLogin: () => void;
  phoneNumbers: ApiPhoneNumber[];
  setForm: (update: (current: CreateForm | null) => CreateForm | null) => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const isLinking = !form.phone_number_id;
  const linkedNumber = phoneNumbers.find((pn) => pn.id === form.phone_number_id);

  useEffect(() => {
    if (isLinking) return;
    nameRef.current?.focus();
    nameRef.current?.select();
  }, [isLinking]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  const head = (
    <div className="chat-modal-head">
      <div>
        <div className="chat-modal-step">Step {isLinking ? 1 : 2} of 2</div>
        <h2 className="chat-modal-title" id="chat-create-title">
          {isLinking ? "Connect your WhatsApp" : "Name your chat agent"}
        </h2>
        <div className="chat-modal-subtitle">
          {isLinking
            ? "Use a pairing code or scan the QR code to link the number this agent will answer on. You name the agent next."
            : "Your number is ready. The prompt, knowledge bases and tools are set in the editor once the agent exists."}
        </div>
      </div>
      <button
        aria-label="Close create chat agent"
        className="chat-icon-btn"
        onClick={onCancel}
        type="button"
      >
        <Icon name="x" size={15} sw={2.2} />
      </button>
    </div>
  );

  return (
    <div
      className="chat-modal-backdrop"
      // A stray click must not end a login someone is halfway through on their
      // phone, so only the naming step closes from the backdrop.
      onMouseDown={(event) => !isLinking && event.currentTarget === event.target && onCancel()}
    >
      {/* Not a form on this step: the pairing code card holds a form of its own. */}
      {isLinking ? (
        <div
          aria-labelledby="chat-create-title"
          aria-modal="true"
          className="chat-modal-card is-pairing"
          role="dialog"
        >
          {head}
          <div className="chat-modal-body">
            <PhoneNumberSetupCard
              error={loginError}
              forNewAgent
              isRefreshingNumbers={isRefreshingNumbers}
              isStarting={isStartingLogin}
              login={login}
              numbers={assignableNumbers}
              onRefreshNumbers={onRefreshNumbers}
              onRequestCode={onRequestCode}
              onRequestQr={onRequestQr}
              onSelectNumber={onSelectNumber}
              onStartLogin={onStartLogin}
            />
          </div>
          <div className="chat-modal-footer">
            <button className="chat-btn chat-btn-secondary" onClick={onCancel} type="button">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <form
          aria-labelledby="chat-create-title"
          aria-modal="true"
          className="chat-modal-card"
          onSubmit={(event) => {
            event.preventDefault();
            onCreate();
          }}
          role="dialog"
        >
          {head}
          <div className="chat-modal-body">
            {error ? <div className="chat-modal-error">{error}</div> : null}

            <div className="chat-modal-section">
              <div className="chat-number-row chat-number-linked">
                <span className="chat-number-icon">
                  <Icon name="check" size={15} sw={2.4} />
                </span>
                <span className="chat-number-body">
                  <span className="chat-number-name">
                    {linkedNumber ? phoneNumberLabel(linkedNumber) : "Your WhatsApp number"}
                  </span>
                  <span className="chat-number-detail">Connected</span>
                </span>
                <button
                  className="chat-number-refresh"
                  disabled={isSubmitting}
                  onClick={onChangeNumber}
                  type="button"
                >
                  Change
                </button>
              </div>
              <label className="chat-field">
                <span className="chat-control-label">Agent name</span>
                <input
                  className="chat-input"
                  onChange={(event) => {
                    const name = event.target.value;
                    setForm((current) => (current ? { ...current, name } : current));
                  }}
                  placeholder="Support assistant"
                  ref={nameRef}
                  value={form.name}
                />
              </label>
            </div>
          </div>

          <div className="chat-modal-footer">
            <button
              className="chat-btn chat-btn-secondary"
              disabled={isSubmitting}
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button className="chat-btn chat-btn-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating..." : "Create chat agent"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// The middle column, laid out like the voice agents workspace: an identity
// header, then the system prompt that decides what the agent says. A chat agent
// never opens a thread itself, so there is no opening message. Everything else
// is configuration and lives in its own tab.
// The agent page's single top bar: the way back to the list, who the agent is,
// its live switch and delete — one strip instead of a label bar stacked over a
// separate header card.
function AgentHeader({
  agent,
  onDelete,
  onPatch,
  tabs,
}: {
  agent: ApiChatAgent;
  onDelete: () => void;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
  tabs: ReactNode;
}) {
  const status = agent.agent.status ?? "inactive";
  // Going live needs a WhatsApp number; pausing an already-live agent never
  // does. The server enforces the same invariant for direct API requests.
  const activationBlocked = status !== "active" && !agent.agent.phone_number_id;
  const needsNumberHint = "Assign a phone number before activating this chat agent";
  // The heading doubles as the rename control: click it, type, then Enter or a
  // click away to keep the new name. Escape — or an empty name — restores the
  // old one. The patch only lands on commit so the list entry and the avatar do
  // not churn on every keystroke.
  // The draft carries the agent it belongs to, so switching agents mid-rename
  // drops the draft without an effect that resets it.
  const [rename, setRename] = useState<{ agentId: string; name: string } | null>(null);
  const draftName = rename?.agentId === agent.id ? rename.name : null;
  const cancelledRename = useRef(false);
  const setDraftName = (name: string | null) =>
    setRename(name === null ? null : { agentId: agent.id, name });

  const commitName = () => {
    const next = (draftName ?? "").trim();
    setDraftName(null);
    if (!next || next === agent.agent.name) return;
    onPatch((current) => ({ ...current, agent: { ...current.agent, name: next } }));
  };

  return (
    <div className="chat-agent-expanded-topline">
      <Link aria-label="Back to chat agents" className="chat-agent-back" href="/dashboard/chat">
        <Icon name="back" size={16} sw={2.4} />
      </Link>
      <div className="chat-detail-head">
        <div className="chat-identity">
          <span className="chat-avatar chat-avatar-lg" style={{ background: avatarColor(agent.id) }}>
            {agent.agent.name.slice(0, 1).toUpperCase()}
          </span>
          <div style={{ minWidth: 0 }}>
            <div className="chat-heading-row">
              <h2 className="chat-heading">
                {draftName === null ? (
                  <button
                    className="chat-heading-edit"
                    onClick={() => setDraftName(agent.agent.name)}
                    title="Rename agent"
                    type="button"
                  >
                    {agent.agent.name}
                  </button>
                ) : (
                  <input
                    aria-label="Agent name"
                    autoFocus
                    className="chat-heading-edit chat-heading-input"
                    onBlur={() => {
                      if (cancelledRename.current) {
                        cancelledRename.current = false;
                        setDraftName(null);
                        return;
                      }
                      commitName();
                    }}
                    onChange={(event) => setDraftName(event.target.value)}
                    onFocus={(event) => event.target.select()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        event.currentTarget.blur();
                      } else if (event.key === "Escape") {
                        cancelledRename.current = true;
                        event.currentTarget.blur();
                      }
                    }}
                    value={draftName}
                  />
                )}
              </h2>
              <span className="chat-tag">Chat</span>
              <StatusPill status={status} />
            </div>
          </div>
        </div>
        {tabs}
        <div className="chat-editor-actions">
          <button
            className="chat-btn chat-btn-secondary"
            disabled={activationBlocked}
            onClick={() =>
              onPatch((current) => ({
                ...current,
                agent: {
                  ...current.agent,
                  status: (current.agent.status ?? "inactive") === "active" ? "inactive" : "active",
                },
              }))
            }
            title={activationBlocked ? needsNumberHint : undefined}
            type="button"
          >
            <Icon name="demo" size={16} sw={2.2} />
            {status === "active" ? "Pause" : "Activate"}
          </button>
          <button className="chat-btn chat-btn-danger" onClick={onDelete} type="button">
            <Icon name="trash" size={15} sw={2.2} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// A tab remembered from a narrower window has no button on desktop, where its
// settings already sit beside the prompt.
function shownEditorTab(tab: EditorTab, isDesktop: boolean): EditorTab {
  return isDesktop && tab === "configuration" ? "agent" : tab;
}

function EditorTabs({
  isDesktop,
  onSelect,
  tab,
}: {
  isDesktop: boolean;
  onSelect: (tab: EditorTab) => void;
  tab: EditorTab;
}) {
  const shownTab = shownEditorTab(tab, isDesktop);
  return (
    <div className="chat-tabs" role="tablist">
      {editorTabs.filter((entry) => !(isDesktop && entry.id === "configuration")).map((entry) => (
        <button
          aria-selected={shownTab === entry.id}
          className={`chat-tab${shownTab === entry.id ? " is-active" : ""}`}
          key={entry.id}
          onClick={() => onSelect(entry.id)}
          role="tab"
          type="button"
        >
          {entry.label}
        </button>
      ))}
    </div>
  );
}

function Editor({
  agent,
  assignableNumbers,
  isRefreshingNumbers,
  isStartingLogin,
  knowledgeBases,
  login,
  loginError,
  onPatch,
  onRefreshNumbers,
  onRequestCode,
  onRequestQr,
  onSelectTab,
  onStartLogin,
  phoneNumbers,
  tab,
  tools,
}: {
  agent: ApiChatAgent;
  assignableNumbers: AssignableNumber[];
  isRefreshingNumbers: boolean;
  isStartingLogin: boolean;
  knowledgeBases: ApiKnowledgeBase[];
  login: ApiPhoneNumber | null;
  loginError: string;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
  onRefreshNumbers: () => void;
  onRequestCode: (phone: string) => Promise<void>;
  onRequestQr: () => Promise<void>;
  onSelectTab: (tab: EditorTab) => void;
  onStartLogin: () => void;
  phoneNumbers: ApiPhoneNumber[];
  tab: EditorTab;
  tools: ApiTool[];
}) {
  const isDesktop = useIsDesktop();
  const shownTab = shownEditorTab(tab, isDesktop);
  const filesCardRef = useRef<HTMLDivElement>(null);
  const [filesOpen, setFilesOpen] = useState(true);
  const [filesAvailable, setFilesAvailable] = useState(false);
  const filesCard = (
    <FilesCard
      agentId={agent.id}
      cardRef={filesCardRef}
      isOpen={filesOpen}
      key={agent.id}
      onAvailable={setFilesAvailable}
      onOpenChange={setFilesOpen}
    />
  );

  // Below desktop the Agent tab stays short: Voice & Photos sits in the
  // Configuration tab, and Take Order is a small card leading there.
  const orderTool = tools.find((tool) => tool.type === "order");
  const takesOrders = Boolean(
    agent.order?.order_enabled && orderTool && agent.tools?.tool_ids?.includes(orderTool.id)
  );

  const numberSetup = (bare: boolean) => (
    <PhoneNumberSetupCard
      bare={bare}
      error={loginError}
      isStarting={isStartingLogin}
      isRefreshingNumbers={isRefreshingNumbers}
      login={login}
      numbers={assignableNumbers}
      onSelectNumber={(phoneNumberId) =>
        onPatch((current) => ({
          ...current,
          agent: { ...current.agent, phone_number_id: phoneNumberId, status: "active" },
        }))
      }
      onRefreshNumbers={onRefreshNumbers}
      onRequestCode={onRequestCode}
      onRequestQr={onRequestQr}
      onStartLogin={onStartLogin}
    />
  );

  const promptHead = (
    <div className="chat-card-head">
      <h3 className="chat-card-title">System Prompt</h3>
      <PromptCounter value={agent.prompt?.system_prompt ?? ""} />
    </div>
  );
  const promptField = (
    <textarea
      aria-label="System prompt"
      className="chat-textarea"
      maxLength={SYSTEM_PROMPT_MAX_CHARS}
      onChange={(event) =>
        onPatch((current) => ({
          ...current,
          prompt: { ...current.prompt, system_prompt: event.target.value },
        }))
      }
      style={{ minHeight: 185 }}
      value={agent.prompt?.system_prompt ?? ""}
    />
  );

  return (
    <div className="chat-editor">
      {agent.hourly_limit_resets_at ? (
        <HourlyLimitCard agentName={agent.agent.name} resetsAt={agent.hourly_limit_resets_at} />
      ) : null}
      {agent.runtime?.last_error ? (
        <div className="chat-card chat-runtime-alert" role="alert">
          <span className="chat-runtime-alert-icon">!</span>
          <div style={{ minWidth: 0 }}>
            <p className="chat-runtime-alert-title">
              {agent.runtime.provider_configured
                ? "This agent's last WhatsApp reply failed"
                : "This agent cannot reply on WhatsApp"}
              {agent.runtime.last_error_at ? (
                <span className="chat-runtime-alert-time">
                  {" "}
                  · {new Date(agent.runtime.last_error_at).toLocaleString()}
                </span>
              ) : null}
            </p>
            <p className="chat-runtime-alert-copy">{agent.runtime.last_error}</p>
          </div>
        </div>
      ) : null}

      {/* On desktop the header draws these, in the middle of the top bar. */}
      {isDesktop ? null : <EditorTabs isDesktop={false} onSelect={onSelectTab} tab={tab} />}

      {/* Only once the server has answered for files, so it never announces a
          feature this server can't do yet. */}
      {filesAvailable && shownTab === "agent" ? (
        <NewFilesNote
          onTry={() => {
            setFilesOpen(true);
            filesCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />
      ) : null}

      {shownTab === "conversation" ? (
        <div className="chat-card chat-card-conversations">
          <div className="chat-card-head">
            <h3 className="chat-card-title">Conversations</h3>
          </div>
          {/* Keyed by agent: a different agent is a different inbox, so the
              workspace starts over rather than carrying the previous agent's
              selection and filters into it. */}
          <ChatConversationsWorkspace agentId={agent.id} key={agent.id} />
        </div>
      ) : isDesktop ? (
        <div className="chat-editor-columns">
          <div className="chat-editor-main">
            <div className="chat-card chat-prompt-card">
              {promptHead}
              {promptField}
            </div>
            {filesCard}
          </div>
          <ConfigPanel
            agent={agent}
            knowledgeBases={knowledgeBases}
            onPatch={onPatch}
            phoneNumbers={phoneNumbers}
            rail={{ numberSetup: agent.agent.phone_number_id ? null : numberSetup(true) }}
            tools={tools}
          />
        </div>
      ) : shownTab === "configuration" ? (
        <ConfigPanel
          agent={agent}
          knowledgeBases={knowledgeBases}
          onPatch={onPatch}
          phoneNumbers={phoneNumbers}
          tools={tools}
        />
      ) : (
        <>
          {agent.agent.phone_number_id ? null : numberSetup(false)}

          <div className="chat-card chat-card-grow">
            {promptHead}
            {promptField}
          </div>

          {filesCard}

          {/* Configuration opens with its Tools section unfolded, Take Order in it. */}
          {orderTool ? (
            <button
              className="chat-card chat-order-shortcut"
              onClick={() => onSelectTab("configuration")}
              type="button"
            >
              <Icon name="bag" size={16} />
              <span className="chat-accordion-title">Take Order</span>
              <span className="chat-accordion-meta">{takesOrders ? "On" : "Off"}</span>
              <span className="chat-order-shortcut-arrow">
                <Icon name="chevron" size={16} sw={2.4} />
              </span>
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

// SYSTEM_PROMPT_MAX_CHARS matches the servers' cap. The prompt is resent with
// every reply, so its length is the main per-reply cost a free account adds.
const SYSTEM_PROMPT_MAX_CHARS = 8000;

// PromptCounter counts code points, as the servers do, so an emoji is one
// character here and there. It warns from 90% and turns red past the cap,
// which only a prompt saved before the cap existed can be.
// Shown only while the agent is at its hourly reply limit, counting down to
// when it starts answering again. It goes away by itself when the time is up.
function HourlyLimitCard({ agentName, resetsAt }: { agentName: string; resetsAt: string }) {
  const resetsAtMs = Date.parse(resetsAt);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      const tick = Date.now();
      setNow(tick);
      if (tick >= resetsAtMs) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [resetsAtMs]);
  const remaining = resetsAtMs - now;
  if (!(remaining > 0)) return null;

  const seconds = Math.ceil(remaining / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const countdown =
    seconds >= 3600
      ? `${Math.floor(seconds / 3600)}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`
      : `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
  const at = new Date(resetsAtMs).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="chat-card chat-runtime-alert chat-limit-card" role="status">
      <span className="chat-runtime-alert-icon">!</span>
      <div className="chat-limit-card-text">
        <p className="chat-runtime-alert-title">Your 1-hour message limit is reached</p>
        <p className="chat-runtime-alert-copy">
          {agentName} has sent 100 AI replies this hour, so it is paused. It turns back on by itself when the
          timer ends. Messages that arrive meanwhile are still saved in Conversations.
        </p>
      </div>
      <div className="chat-limit-timer" aria-label={`Active again in ${countdown}, at ${at}`}>
        <span className="chat-limit-timer-value">{countdown}</span>
        <span className="chat-limit-timer-label">Active again at {at}</span>
      </div>
    </div>
  );
}

function PromptCounter({ value }: { value: string }) {
  const count = Array.from(value).length;
  const state =
    count > SYSTEM_PROMPT_MAX_CHARS ? "over" : count >= SYSTEM_PROMPT_MAX_CHARS * 0.9 ? "near" : "";
  return (
    <span className={`chat-char-count ${state}`} aria-live="polite">
      {count.toLocaleString()} / {SYSTEM_PROMPT_MAX_CHARS.toLocaleString()}
    </span>
  );
}

// PhoneNumberSetupCard fills the gap left by a chat agent with no number: it
// can neither answer nor open a thread until one is picked. Both ways out are
// offered side by side — link a brand-new WhatsApp number by scanning a QR code,
// or claim one of the numbers already connected to the account. forNewAgent is
// the create modal's first step: the same panes, with no card around them, for an
// agent that doesn't exist yet.
function PhoneNumberSetupCard({
  bare = false,
  error,
  forNewAgent = false,
  isRefreshingNumbers,
  isStarting,
  login,
  numbers,
  onSelectNumber,
  onRefreshNumbers,
  onRequestCode,
  onRequestQr,
  onStartLogin,
}: {
  // No card or heading of its own, for a settings section that already has them.
  bare?: boolean;
  error: string;
  forNewAgent?: boolean;
  isRefreshingNumbers: boolean;
  isStarting: boolean;
  login: ApiPhoneNumber | null;
  numbers: AssignableNumber[];
  onSelectNumber: (phoneNumberId: string) => void;
  onRefreshNumbers: () => void;
  onRequestCode: (phone: string) => Promise<void>;
  onRequestQr: () => Promise<void>;
  onStartLogin: () => void;
}) {
  // `login` is the unfinished session for this agent; a connected one is never
  // passed down, because connecting assigns the number and closes this card.
  const isPending = login?.status === "pending_qr";
  const canRestart = Boolean(login);
  // A code login still rotates QR codes underneath; the code is what to show.
  const showsCode = isPending && Boolean(login?.pairing_code);
  // A phone can't scan its own screen, and almost nobody links from one by QR,
  // so it gets the number form alone unless a second device is at hand.
  const isPhone = useIsPhone();
  const [wantsQr, setWantsQr] = useState(false);
  const offersQr = !isPhone || wantsQr;
  const onConnect = forNewAgent
    ? "you name the agent the moment it connects"
    : "the number is assigned to this agent the moment it connects";
  const onConnectSentence = onConnect.charAt(0).toUpperCase() + onConnect.slice(1);

  return (
    <div className={forNewAgent || bare ? undefined : "chat-card chat-number-setup"}>
      {forNewAgent || bare ? null : (
        <div className="chat-card-head">
          <h3 className="chat-card-title">Connect a phone number</h3>
          <span className="chat-number-flag">Required to reply</span>
        </div>
      )}

      <div className={`chat-number-grid${numbers.length > 0 ? "" : " is-single"}`}>
        <section className="chat-number-pane" aria-label="Link a new WhatsApp number">
          <div className="chat-number-pane-head">
            <span className="chat-number-pane-title">Link a new number</span>
            <span className="chat-number-pane-note">WhatsApp › Linked devices</span>
          </div>

          <WhatsAppLinkHelp
            disabled={isStarting}
            login={login}
            onRequestCode={onRequestCode}
            onRequestQr={async () => {
              await onRequestQr();
              setWantsQr(true);
            }}
            qr={
              offersQr ? (
                <div className="chat-qr-frame">
                  {isPending && login?.qr_code ? (
                    <Image
                      alt="WhatsApp login QR code"
                      className="chat-qr-image"
                      height={220}
                      src={login.qr_code}
                      unoptimized
                      width={220}
                    />
                  ) : (
                    <div className="chat-qr-placeholder">
                      <Icon name="phone" size={22} />
                      <span>
                        {isStarting
                          ? "Getting a QR code…"
                          : isPending
                            ? "Generating QR code…"
                            : login
                              ? phoneStatusLabels[login.status]
                              : "A QR code appears here in a moment"}
                      </span>
                    </div>
                  )}
                </div>
              ) : null
            }
          />

          <div className="chat-number-status">
            {isStarting
              ? "Getting a fresh code…"
              : showsCode || (isPending && !offersQr)
                ? `${onConnectSentence} — keep this page open.`
                : isPending
                  ? `Open WhatsApp › Linked devices and scan. The code refreshes itself until it is scanned, and ${onConnect} — keep this page open.`
                  : !offersQr
                    ? `${onConnectSentence}.`
                    : login
                      ? `This login ${phoneStatusLabels[login.status].toLowerCase()}. A new code follows in a moment.`
                      : "The number is detected automatically after you scan."}
          </div>

          {/* The code is issued and reissued on its own; the button is only the
              way back from a login that stopped without one on screen. */}
          {showsCode ? null : !offersQr ? (
            <button
              className="wa-link-text-btn"
              disabled={isStarting}
              onClick={() => {
                setWantsQr(true);
                if (!isPending) onStartLogin();
              }}
              type="button"
            >
              Scanning from another device? Show a QR code
            </button>
          ) : isPending || isStarting ? null : (
            <button
              className="chat-btn chat-btn-primary chat-btn-sm"
              onClick={onStartLogin}
              type="button"
            >
              <Icon
                name={canRestart ? "refresh" : "plus"}
                size={15}
                stroke="var(--app-on-accent)"
                sw={2.2}
              />
              {canRestart ? "New QR code" : "Start WhatsApp login"}
            </button>
          )}

          {error ? <div className="chat-number-error">{error}</div> : null}
        </section>

        {numbers.length > 0 ? (
          <section className="chat-number-pane" aria-label="Use a connected number">
            <div className="chat-number-pane-head">
              <span className="chat-number-pane-title">Use a connected number</span>
              <span className="chat-number-pane-actions">
                <span className="chat-number-pane-note">
                  {numbers.length === 1 ? "1 number" : `${numbers.length} numbers`}
                </span>
                <button
                  aria-label="Refresh connected phone numbers"
                  className={`chat-number-refresh${isRefreshingNumbers ? " is-refreshing" : ""}`}
                  disabled={isRefreshingNumbers}
                  onClick={onRefreshNumbers}
                  title="Refresh connected phone numbers"
                  type="button"
                >
                  <Icon name="refresh" size={13} sw={2.2} />
                  {isRefreshingNumbers ? "Refreshing…" : "Refresh"}
                </button>
              </span>
            </div>

            <ul className="chat-number-list">
              {numbers.map((number) => (
                <li key={number.id}>
                  <button
                    className="chat-number-row"
                    disabled={number.disabled}
                    onClick={() => onSelectNumber(number.id)}
                    title={number.disabled ? number.hint : undefined}
                    type="button"
                  >
                    <span className="chat-number-icon">
                      <Icon name="phone" size={15} />
                    </span>
                    <span className="chat-number-body">
                      <span className="chat-number-name">{number.name}</span>
                      <span className="chat-number-detail">{number.detail}</span>
                    </span>
                    <span className={`chat-number-hint${number.disabled ? " is-blocked" : ""}`}>
                      {number.hint}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}

// The phone number an agent answers on, as a plain select.
function PhoneNumberSelect({
  agent,
  "aria-label": ariaLabel,
  className,
  onPatch,
  phoneNumbers,
}: {
  agent: ApiChatAgent;
  "aria-label"?: string;
  className: string;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
  phoneNumbers: ApiPhoneNumber[];
}) {
  return (
    <select
      aria-label={ariaLabel}
      className={className}
      onChange={(event) =>
        onPatch((current) => ({
          ...current,
          agent: {
            ...current.agent,
            phone_number_id: event.target.value || null,
            // Connecting a number takes the agent live; removing it pauses it.
            status: !event.target.value
              ? "inactive"
              : event.target.value === current.agent.phone_number_id
                ? current.agent.status
                : "active",
          },
        }))
      }
      value={agent.agent.phone_number_id ?? ""}
    >
      <option value="">No number</option>
      {phoneNumbers.map((pn) => (
        <option key={pn.id} value={pn.id}>
          {phoneNumberLabel(pn)}
        </option>
      ))}
    </select>
  );
}

// The Configuration tab: the basics at the top, then one collapsible section per
// part of the chat-agent contract. With `rail` it is the desktop settings column
// instead: only the collapsible sections, including the number and Orders, which
// live elsewhere when the editor is stacked. The name is in the header on desktop.
function ConfigPanel({
  agent,
  knowledgeBases,
  onPatch,
  phoneNumbers,
  rail,
  tools,
}: {
  agent: ApiChatAgent;
  knowledgeBases: ApiKnowledgeBase[];
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
  phoneNumbers: ApiPhoneNumber[];
  rail?: { numberSetup: ReactNode };
  tools: ApiTool[];
}) {
  // On desktop Orders starts open so the switch is seen, unless the agent has no
  // number: it can't answer anyone until that is done, so linking one comes first.
  const [openSection, setOpenSection] = useState<ConfigSectionId | null>(
    rail ? (rail.numberSetup ? "phone-number" : "orders") : "tools"
  );
  const attachedKbs = agent.knowledge_base?.knowledge_base_ids ?? [];
  const attachedTools = agent.tools?.tool_ids ?? [];
  const attachedNumber = phoneNumbers.find((pn) => pn.id === agent.agent.phone_number_id);
  // end_call and transfer_call exist to release a phone call, so the server
  // ignores them in a chat. Offering them here would be offering nothing.
  const chatCapableTools = tools.filter(
    (tool) => tool.type === "api_request" || tool.type === "send_text" || tool.type === "order"
  );
  const orderTool = chatCapableTools.find((tool) => tool.type === "order");
  const orderEnabled = agent.order?.order_enabled ?? false;
  // Orders are only taken with the switch on and Take Order attached. The desktop
  // Orders section is one switch for both, so Take Order isn't also a tool there.
  const takesOrders = orderEnabled && Boolean(orderTool && attachedTools.includes(orderTool.id));
  const listedTools = rail ? chatCapableTools.filter((tool) => tool.type !== "order") : chatCapableTools;
  const listedToolIds = rail ? attachedTools.filter((id) => id !== orderTool?.id) : attachedTools;
  const ownTools = rail ? tools.filter((tool) => tool.type !== "order") : tools;

  const toggleId = (list: string[], id: string) =>
    list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

  return (
    <div className={`chat-panel chat-config-panel${rail ? " is-rail" : ""}`}>
      {rail ? null : (
        <div className="chat-panel-head chat-config-head">
          <div>
            <h2 className="chat-panel-title">Chat agent configuration</h2>
            <div className="chat-panel-copy">
              How the agent is addressed and what it can reach.
            </div>
          </div>
        </div>
      )}
      <div className="chat-panel-body">
        {rail ? null : (
        <div className="chat-config-fields">
          <label className="chat-field">
            <span className="chat-control-label">Name</span>
            <input
              className="chat-input"
              onChange={(event) =>
                onPatch((current) => ({
                  ...current,
                  agent: { ...current.agent, name: event.target.value },
                }))
              }
              value={agent.agent.name}
            />
          </label>
          <label className="chat-field">
            <span className="chat-control-label">Phone number</span>
            <PhoneNumberSelect
              agent={agent}
              className="chat-select"
              onPatch={onPatch}
              phoneNumbers={phoneNumbers}
            />
            {phoneNumbers.length === 0 ? (
              <span className="chat-field-hint">
                Connect one in <Link href="/dashboard/phone-numbers">Phone Numbers</Link>.
              </span>
            ) : null}
          </label>
        </div>
        )}

        <div className="chat-accordion-list">
          {rail ? (
            <ConfigSection
              icon="phone"
              id="phone-number"
              isOpen={openSection === "phone-number"}
              meta={
                rail.numberSetup ? (
                  <span className="chat-number-flag">Required to reply</span>
                ) : (
                  attachedNumber ? phoneNumberDetail(attachedNumber) : ""
                )
              }
              onToggle={setOpenSection}
              title="Phone Number"
            >
              {rail.numberSetup ?? (
                <PhoneNumberSelect
                  agent={agent}
                  aria-label="Phone number"
                  className="chat-select"
                  onPatch={onPatch}
                  phoneNumbers={phoneNumbers}
                />
              )}
            </ConfigSection>
          ) : null}

          <ConfigSection
            icon="book"
            id="knowledge-base"
            isOpen={openSection === "knowledge-base"}
            meta={attachedKbs.length ? `${attachedKbs.length} attached` : "None"}
            onToggle={setOpenSection}
            title="Knowledge Base"
          >
            {knowledgeBases.length === 0 ? (
              <div className="chat-chips-empty">
                No knowledge bases yet — create one in{" "}
                <Link href="/dashboard/knowledge-base">Knowledge Base</Link>.
              </div>
            ) : (
              <div className="chat-chips">
                {knowledgeBases.map((kb) => {
                  const on = attachedKbs.includes(kb.knowledge_base_id);
                  return (
                    <button
                      aria-pressed={on}
                      className={`chat-chip${on ? " is-on" : ""}`}
                      key={kb.knowledge_base_id}
                      onClick={() =>
                        onPatch((current) => ({
                          ...current,
                          knowledge_base: {
                            knowledge_base_ids: toggleId(
                              current.knowledge_base?.knowledge_base_ids ?? [],
                              kb.knowledge_base_id
                            ),
                          },
                        }))
                      }
                      type="button"
                    >
                      {on ? <Icon name="check" size={13} sw={2.6} /> : <Icon name="book" size={13} />}
                      <span>{kb.knowledge_base_name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </ConfigSection>

          <ConfigSection
            icon="wrench"
            id="tools"
            isOpen={openSection === "tools"}
            meta={listedToolIds.length ? `${listedToolIds.length} attached` : "None"}
            onToggle={setOpenSection}
            title="Tools"
          >
            {listedTools.length === 0 ? (
              <div className="chat-chips-empty">
                {ownTools.length === 0 ? (
                  <>
                    No tools yet — create one in <Link href="/dashboard/tools">Tools</Link>.
                  </>
                ) : (
                  <>
                    Your tools all end or transfer a call, which a chat cannot do. Create an API request or
                    send message tool in <Link href="/dashboard/tools">Tools</Link>.
                  </>
                )}
              </div>
            ) : (
              <div className="chat-chips">
                {listedTools.map((tool) => {
                  const on = attachedTools.includes(tool.id);
                  return (
                    <button
                      aria-pressed={on}
                      className={`chat-chip${on ? " is-on" : ""}`}
                      key={tool.id}
                      onClick={() =>
                        onPatch((current) => ({
                          ...current,
                          tools: { tool_ids: toggleId(current.tools?.tool_ids ?? [], tool.id) },
                          // Attaching Take Order switches ordering on (the
                          // server does the same); the toggle below can turn it off.
                          ...(tool.type === "order" && !on
                            ? { order: { ...current.order, order_enabled: true } }
                            : {}),
                        }))
                      }
                      type="button"
                    >
                      {on ? <Icon name="check" size={13} sw={2.6} /> : <Icon name="wrench" size={13} />}
                      <span>{tool.name}</span>
                      {tool.is_system ? <span className="chat-default-badge">Default</span> : null}
                    </button>
                  );
                })}
              </div>
            )}
            {!rail && orderTool && attachedTools.includes(orderTool.id) ? (
              <div className="chat-order-settings">
                <button
                  aria-pressed={orderEnabled}
                  className={`chat-order-toggle${orderEnabled ? " is-on" : ""}`}
                  onClick={() =>
                    onPatch((current) => ({
                      ...current,
                      order: { ...current.order, order_enabled: !orderEnabled },
                    }))
                  }
                  type="button"
                >
                  <span className="chat-order-track">
                    <span className="chat-order-knob" />
                  </span>
                  <span>Enable order taking</span>
                </button>
                <OrderInstructionsField agent={agent} on={orderEnabled} onPatch={onPatch} />
              </div>
            ) : null}
          </ConfigSection>

          {rail && agent.order ? (
            <ConfigSection
              icon="bag"
              id="orders"
              isOpen={openSection === "orders"}
              meta={takesOrders ? "On" : "Off"}
              onToggle={setOpenSection}
              title="Orders"
            >
              <div className="chat-order-settings">
                <MediaToggle
                  disabled={!orderTool}
                  label="Enable order taking"
                  on={takesOrders}
                  onToggle={() => {
                    if (!orderTool) return;
                    onPatch((current) => {
                      const others = (current.tools?.tool_ids ?? []).filter((id) => id !== orderTool.id);
                      return {
                        ...current,
                        tools: { tool_ids: takesOrders ? others : [...others, orderTool.id] },
                        order: { ...current.order, order_enabled: !takesOrders },
                      };
                    });
                  }}
                />
                <OrderInstructionsField agent={agent} on={takesOrders} onPatch={onPatch} />
              </div>
            </ConfigSection>
          ) : null}

          {/* Only offered by a server that reports the section, since an older
              one refuses it on save. */}
          {agent.media ? (
            <ConfigSection
              icon="message"
              id="voice-photos"
              isOpen={openSection === "voice-photos"}
              meta={mediaMeta(agent.media)}
              onToggle={setOpenSection}
              title="Voice & Photos"
            >
              <MediaSettings media={agent.media} onPatch={onPatch} />
            </ConfigSection>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Images & Files on its own card under the prompt, open from the start. The
// section renders nothing on a server without the feature, and the css then hides
// the empty card.
function FilesCard({
  agentId,
  cardRef,
  isOpen,
  onAvailable,
  onOpenChange,
}: {
  agentId: string;
  cardRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onAvailable: (available: boolean) => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <div className="chat-card chat-files-card is-rail" ref={cardRef}>
      <AgentFilesSection
        agentId={agentId}
        isOpen={isOpen}
        onAvailable={onAvailable}
        onToggle={(next) => onOpenChange(next !== null)}
      />
    </div>
  );
}

const FILES_NOTE_CLOSED_KEY = "wapzen.agent-files-note-closed";

function readFilesNoteClosed() {
  try {
    return window.localStorage.getItem(FILES_NOTE_CLOSED_KEY) === "1";
  } catch {
    return false;
  }
}

// Tells owners about Images & Files until they close it. The choice is kept per
// browser. If storage is blocked the note still closes, for this visit.
function NewFilesNote({ onTry }: { onTry: () => void }) {
  const [closed, setClosed] = useState(readFilesNoteClosed);
  if (closed) return null;

  const close = () => {
    setClosed(true);
    try {
      window.localStorage.setItem(FILES_NOTE_CLOSED_KEY, "1");
    } catch {
      // Storage unavailable: it stays closed until the page is opened again.
    }
  };

  return (
    <div className="chat-card chat-new-note">
      <span className="chat-new-note-tag">New</span>
      <span className="chat-new-note-text">Your agent can now send images to your customers.</span>
      <button className="chat-new-note-try" onClick={onTry} type="button">
        Try this feature
      </button>
      <button aria-label="Close this note" className="chat-icon-btn chat-new-note-close" onClick={close} type="button">
        <Icon name="x" size={15} sw={2.2} />
      </button>
    </div>
  );
}

// The images and documents the agent can send, each with a note saying when.
// Unlike the rest of the panel these save straight away, not with the agent.
function AgentFilesSection({
  agentId,
  isOpen,
  onAvailable,
  onToggle,
}: {
  agentId: string;
  isOpen: boolean;
  onAvailable: (available: boolean) => void;
  onToggle: (next: ConfigSectionId | null) => void;
}) {
  const { getToken } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<ApiAgentFile[] | null>(null);
  const [unsupported, setUnsupported] = useState(false);
  const [picked, setPicked] = useState<File | null>(null);
  // A browser-only link to the picked image. Each one holds the file in memory
  // until it is revoked, so the ref lets the last one go when the page closes.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let stale = false;
    listAgentFiles(agentId, getToken)
      .then((list) => {
        if (stale) return;
        setFiles(list);
        onAvailable(true);
      })
      .catch((err: unknown) => {
        if (stale) return;
        // A server without this feature yet answers 404: nothing to offer.
        if (err instanceof ChatAgentError && err.status === 404) setUnsupported(true);
        else setError(err instanceof Error ? err.message : "Could not load the files.");
      });
    return () => {
      stale = true;
    };
  }, [agentId, getToken, onAvailable]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    []
  );

  if (unsupported) return null;

  const showPreview = (url: string | null) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = url;
    setPreviewUrl(url);
  };

  const onPick = (file: File | undefined) => {
    setError("");
    if (!file) return;
    if (file.size > AGENT_FILE_MAX_BYTES) {
      setError(`${file.name} is larger than ${AGENT_FILE_MAX_BYTES / (1024 * 1024)} MB.`);
      return;
    }
    setPicked(file);
    showPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const cancel = () => {
    setPicked(null);
    showPreview(null);
    setDescription("");
    setError("");
  };

  const upload = async () => {
    if (!picked || !description.trim()) return;
    setIsUploading(true);
    setError("");
    try {
      const added = await uploadAgentFile(agentId, picked, description.trim(), getToken);
      setFiles((current) => [...(current ?? []), added]);
      setPicked(null);
      showPreview(null);
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The file could not be uploaded.");
    } finally {
      setIsUploading(false);
    }
  };

  const startEdit = (file: ApiAgentFile) => {
    setError("");
    setConfirmingId(null);
    setEditingId(file.id);
    setEditText(file.description);
  };

  const saveEdit = async (fileId: string) => {
    if (!editText.trim()) return;
    setIsSavingEdit(true);
    setError("");
    try {
      const saved = await updateAgentFile(agentId, fileId, editText.trim(), getToken);
      setFiles((current) => (current ?? []).map((file) => (file.id === fileId ? saved : file)));
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The note could not be saved.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const remove = async (fileId: string) => {
    setError("");
    try {
      await deleteAgentFile(agentId, fileId, getToken);
      setFiles((current) => (current ?? []).filter((file) => file.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The file could not be deleted.");
    } finally {
      setConfirmingId(null);
    }
  };

  const atLimit = (files?.length ?? 0) >= AGENT_FILES_MAX;

  return (
    <ConfigSection
      icon="paperclip"
      id="files"
      isOpen={isOpen}
      meta={files === null ? "" : files.length ? `${files.length} uploaded` : "None"}
      onToggle={onToggle}
      title="Images & Files"
    >
      <div className="chat-files">
        {files?.length ? (
          <ul className="chat-file-list">
            {files.map((file) => (
              <li className="chat-file" key={file.id}>
                <span className="chat-file-name" title={file.file_name}>
                  {file.file_name} <span className="chat-file-size">· {formatFileSize(file.size_bytes)}</span>
                </span>
                {confirmingId === file.id ? (
                  <span className="chat-file-actions">
                    <button className="chat-btn chat-btn-danger chat-btn-sm" onClick={() => void remove(file.id)} type="button">
                      Delete
                    </button>
                    <button className="chat-btn chat-btn-secondary chat-btn-sm" onClick={() => setConfirmingId(null)} type="button">
                      Keep
                    </button>
                  </span>
                ) : (
                  <span className="chat-file-actions">
                    {editingId === file.id ? null : (
                      <button
                        aria-label={`Edit the note for ${file.file_name}`}
                        className="chat-btn chat-btn-secondary chat-btn-sm"
                        onClick={() => startEdit(file)}
                        title="Edit note"
                        type="button"
                      >
                        <Icon name="pencil" size={13} sw={2.2} />
                      </button>
                    )}
                    <button
                      aria-label={`Delete ${file.file_name}`}
                      className="chat-btn chat-btn-secondary chat-btn-sm"
                      onClick={() => {
                        setEditingId(null);
                        setConfirmingId(file.id);
                      }}
                      type="button"
                    >
                      <Icon name="trash" size={13} sw={2.2} />
                    </button>
                  </span>
                )}
                {editingId === file.id ? (
                  <div className="chat-file-edit">
                    <textarea
                      aria-label={`When should the agent send ${file.file_name}?`}
                      autoFocus
                      className="chat-textarea"
                      maxLength={AGENT_FILE_DESCRIPTION_MAX}
                      onChange={(event) => setEditText(event.target.value)}
                      style={{ minHeight: 76 }}
                      value={editText}
                    />
                    <span className="chat-file-actions">
                      <button
                        className="chat-btn chat-btn-primary chat-btn-sm"
                        disabled={isSavingEdit || !editText.trim()}
                        onClick={() => void saveEdit(file.id)}
                        type="button"
                      >
                        {isSavingEdit ? "Saving..." : "Save"}
                      </button>
                      <button
                        className="chat-btn chat-btn-secondary chat-btn-sm"
                        disabled={isSavingEdit}
                        onClick={() => setEditingId(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                    </span>
                  </div>
                ) : (
                  <span className="chat-file-description">{file.description}</span>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        <input
          accept={AGENT_FILE_ACCEPT}
          aria-label="Choose an image or file"
          hidden
          onChange={(event) => {
            onPick(event.target.files?.[0]);
            // So choosing the same file again still fires a change.
            event.target.value = "";
          }}
          ref={inputRef}
          type="file"
        />

        {picked ? (
          <div className="chat-file-form">
            {previewUrl ? (
              <Image
                alt={`Preview of ${picked.name}`}
                className="chat-file-preview"
                height={200}
                src={previewUrl}
                unoptimized
                width={320}
              />
            ) : null}
            <span className="chat-file-picked">
              {picked.name} <span className="chat-file-size">· {formatFileSize(picked.size)}</span>
            </span>
            <label className="chat-field">
              <span className="chat-control-label">When should the agent send this?</span>
              <textarea
                className="chat-textarea"
                maxLength={AGENT_FILE_DESCRIPTION_MAX}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="When someone asks for the menu or the prices."
                style={{ minHeight: 76 }}
                value={description}
              />
            </label>
            <div className="chat-file-actions">
              <button
                className="chat-btn chat-btn-primary chat-btn-sm"
                disabled={isUploading || !description.trim()}
                onClick={() => void upload()}
                type="button"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              <button
                className="chat-btn chat-btn-secondary chat-btn-sm"
                disabled={isUploading}
                onClick={cancel}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="chat-file-actions">
            <button
              className="chat-btn chat-btn-secondary chat-btn-sm"
              disabled={atLimit}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              <Icon name="plus" size={13} sw={2.4} />
              Upload image or file
            </button>
          </div>
        )}

        {error ? (
          <span className="chat-file-error" role="alert">
            {error}
          </span>
        ) : null}
        <span className="chat-field-hint">
          {atLimit
            ? `An agent can hold ${AGENT_FILES_MAX} files. Delete one to add another.`
            : "The agent sends a file on WhatsApp when the chat matches your note. Images, PDF, Word, Excel, PowerPoint or text, up to 10 MB. No videos."}
        </span>
      </div>
    </ConfigSection>
  );
}

function OrderInstructionsField({
  agent,
  on,
  onPatch,
}: {
  agent: ApiChatAgent;
  on: boolean;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
}) {
  return (
    <label className="chat-field">
      <span className="chat-control-label">Order instructions</span>
      <textarea
        className="chat-textarea"
        maxLength={4000}
        onChange={(event) =>
          onPatch((current) => ({
            ...current,
            order: { ...current.order, order_instructions: event.target.value },
          }))
        }
        placeholder="Only take orders for our menu items. Always ask for name, phone and delivery address. Email is optional. Read the order back and get a yes before placing it. Delivery only inside Dhaka."
        value={agent.order?.order_instructions ?? ""}
      />
      <span className="chat-field-hint">
        {on ? (
          <>
            Orders appear under <Link href="/dashboard/orders">Orders</Link>.
          </>
        ) : (
          "Order taking is off, so this agent can't place orders and these instructions aren't used."
        )}
      </span>
    </label>
  );
}

function MediaSettings({
  media,
  onPatch,
}: {
  media: ChatMediaSection;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
}) {
  return (
    <div className="chat-media-settings">
      <MediaToggle
        hint="Voice messages are turned into text and the agent replies in text. Off: voice messages go unanswered."
        label="Reply to voice messages"
        on={media.voice_messages_enabled}
        onToggle={() =>
          onPatch((current) => ({
            ...current,
            media: {
              images_enabled: current.media?.images_enabled ?? false,
              voice_messages_enabled: !current.media?.voice_messages_enabled,
            },
          }))
        }
      />
      <MediaToggle
        hint="The agent looks at photos customers send, such as a product or a payment screenshot. Off: only a photo's caption is read."
        label="Read photos"
        on={media.images_enabled}
        onToggle={() =>
          onPatch((current) => ({
            ...current,
            media: {
              voice_messages_enabled: current.media?.voice_messages_enabled ?? false,
              images_enabled: !current.media?.images_enabled,
            },
          }))
        }
      />
    </div>
  );
}

function mediaMeta(media: ChatMediaSection): string {
  const on = [media.voice_messages_enabled && "Voice", media.images_enabled && "Photos"].filter(Boolean);
  return on.length ? on.join(" + ") : "Off";
}

function MediaToggle({
  disabled = false,
  hint,
  label,
  on,
  onToggle,
}: {
  disabled?: boolean;
  hint?: string;
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="chat-media-option">
      <button
        aria-pressed={on}
        className={`chat-order-toggle${on ? " is-on" : ""}`}
        disabled={disabled}
        onClick={onToggle}
        type="button"
      >
        <span className="chat-order-track">
          <span className="chat-order-knob" />
        </span>
        <span>{label}</span>
      </button>
      {hint ? <span className="chat-field-hint">{hint}</span> : null}
    </div>
  );
}

function ConfigSection({
  children,
  icon,
  id,
  isOpen,
  meta,
  onToggle,
  title,
}: {
  children: ReactNode;
  icon: IconName;
  id: ConfigSectionId;
  isOpen: boolean;
  meta: ReactNode;
  onToggle: (next: ConfigSectionId | null) => void;
  title: string;
}) {
  return (
    <div className={`chat-accordion-item${isOpen ? " is-open" : ""}`}>
      <button
        aria-expanded={isOpen}
        className="chat-accordion-button"
        onClick={() => onToggle(isOpen ? null : id)}
        type="button"
      >
        <span className="chat-accordion-icon">
          <Icon name={icon} size={16} />
        </span>
        <span className="chat-accordion-title">{title}</span>
        <span className="chat-accordion-meta">{meta}</span>
        <span className="chat-accordion-chevron">
          <Icon name="chevron" size={16} sw={2.4} />
        </span>
      </button>
      {isOpen ? <div className="chat-accordion-body">{children}</div> : null}
    </div>
  );
}

// Small buttons to the menu's other pages, for screens where the menu is folded
// away behind the top bar's button. The css hides them once the sidebar is showing.
function PageLinks() {
  return (
    <nav aria-label="Other pages" className="chat-page-links">
      {navItemsForMode("chat")
        .filter((item) => item.href !== "/dashboard/chat")
        .map((item) => {
          const LinkIcon = navIcons[item.icon];
          return (
            <Link className="chat-chip chat-page-link" href={item.href ?? "#"} key={item.label}>
              <LinkIcon aria-hidden="true" size={14} />
              <span>{item.label}</span>
            </Link>
          );
        })}
    </nav>
  );
}

function StatusPill({ status }: { status: "active" | "inactive" }) {
  return (
    <span className={`chat-pill ${status === "active" ? "is-active" : "is-inactive"}`}>
      <span className="chat-dot" />
      {status === "active" ? "Live" : "Paused"}
    </span>
  );
}
