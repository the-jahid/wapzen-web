"use client";

import { DetailSkeleton } from "@/components/ui/Skeleton";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import SetupVideoButton from "@/components/chat/SetupVideoButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth, useUser } from "@clerk/nextjs";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { openUsageModal } from "@/components/nav/UsageButton";
import {
  FREE_TRIAL_WHATSAPP_URL,
  MORE_AGENTS_WHATSAPP_URL,
  SUPPORT_WHATSAPP_URL,
  WhatsAppGlyph,
} from "@/components/nav/supportWhatsApp";
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
import { startPolling, startRefreshing } from "@/lib/polling";
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
  isChatAgentLimitError,
  listAgentFiles,
  listChatAgentLiveStates,
  listDashboardChatAgents,
  updateAgentFile,
  updateDashboardChatAgent,
  uploadAgentFile,
  type ApiAgentFile,
  type ApiChatAgent,
  type ChatMediaSection,
  type ChatHumanInterventionSection,
  type ChatWebsiteSection,
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
  | "globe"
  | "person"
  | "pencil"
  | "plus"
  | "trash"
  | "search"
  | "refresh"
  | "chevron"
  | "check"
  | "menu"
  | "back"
  | "qr"
  | "x";

// The collapsible parts of the configuration panel, one per section of the
// chat-agent contract.
type ConfigSectionId =
  | "phone-number"
  | "knowledge-base"
  | "tools"
  | "orders"
  | "files"
  | "website"
  | "human-intervention"
  | "voice-photos"
  | "behavior";

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
    case "globe":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </>
      );
    case "person":
      return (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0116 0" />
        </>
      );
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
    case "qr":
      return (
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2M14 18v2M18 18h2v2" />
      );
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
/* The agent list uses the page's full width, like Retell's. */
.chat-agent-browser { display: flex; flex-direction: column; height: 100%; min-height: 0; width: 100%; }
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
.chat-pill-timer { color: var(--app-amber-text); font-variant-numeric: tabular-nums; }
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
.chat-trial-modal { max-width: 600px; padding: 32px; }
.chat-trial-modal .chat-confirm-icon { font-size: 20px; font-weight: 850; height: 52px; width: 52px; }
.chat-trial-modal .chat-confirm-title { font-size: 26px; }
.chat-trial-modal .chat-confirm-copy { font-size: 15px; margin-top: 10px; }
.chat-trial-modal .chat-confirm-actions { margin-top: 26px; }
.chat-trial-modal .chat-confirm-actions .chat-btn { font-size: 15px; min-height: 46px; padding: 0 20px; }
.chat-trial-plan { background: var(--app-primary-soft, rgba(37, 211, 102, 0.08)); border: 1px solid var(--app-primary-border, rgba(37, 211, 102, 0.35)); border-radius: 14px; margin-top: 20px; padding: 20px 22px; }
.chat-trial-plan-price { align-items: baseline; display: flex; gap: 8px; }
.chat-trial-plan-amount { color: var(--app-text-strong); font-size: 36px; font-weight: 850; letter-spacing: -.5px; line-height: 1; }
.chat-trial-plan-per { color: var(--app-muted); font-size: 14px; font-weight: 650; }
.chat-trial-plan-list { display: grid; gap: 9px; list-style: none; margin: 16px 0 0; padding: 0; }
.chat-trial-plan-list li { color: var(--app-text); font-size: 14.5px; line-height: 1.4; padding-left: 26px; position: relative; }
.chat-trial-plan-list li::before { color: #25d366; content: "✓"; font-weight: 900; left: 4px; position: absolute; }
.chat-trial-plan-list strong { color: var(--app-text-strong); font-weight: 800; }
.chat-trial-chip { align-items: center; background: transparent; border: 1px solid var(--app-line); border-radius: 12px; color: var(--app-text); cursor: pointer; display: inline-flex; font: inherit; gap: 8px; padding: 3px 12px 3px 4px; }
.chat-trial-chip:hover { border-color: var(--app-rose-border); }
.chat-trial-chip-ring { color: var(--app-muted); display: inline-grid; flex: none; height: 38px; place-items: center; position: relative; width: 38px; }
.chat-trial-chip-ring svg { inset: 0; position: absolute; }
.chat-trial-chip-fill { stroke: var(--app-rose); stroke-linecap: round; }
.chat-trial-chip-value { color: var(--app-text-strong); font-size: 11px; font-weight: 850; position: relative; }
.chat-trial-chip-text { display: grid; line-height: 1.15; text-align: left; }
.chat-trial-chip-text strong { color: var(--app-text-strong); font-size: 12.5px; font-weight: 800; }
.chat-trial-chip-text span { color: var(--app-muted); font-size: 11px; }
.chat-trial-chip[data-over] .chat-trial-chip-text strong { color: var(--app-rose); }
.chat-trial-note {background: rgba(255, 255, 255, 0.03); border: 1px solid var(--app-line); border-radius: 12px; display: flex; gap: 10px; margin-top: 14px; padding: 12px 14px; }
.chat-trial-note p { color: var(--app-muted); font-size: 13px; line-height: 1.55; margin: 0; }
.chat-trial-note strong { color: var(--app-text-strong); font-weight: 800; }
.chat-trial-note-icon { align-items: center; border: 1.5px solid var(--app-muted); border-radius: 999px; color: var(--app-muted); display: inline-flex; flex: none; font-size: 11px; font-weight: 800; height: 17px; justify-content: center; margin-top: 2px; width: 17px; }
.chat-trial-modal { max-height: calc(100dvh - 32px); overflow-y: auto; }
.chat-confirm-danger { background: var(--app-rose); border-color: transparent; color: #fff; }
.chat-confirm-danger:hover { filter: brightness(1.08); }
.chat-upgrade-icon { background: rgba(37, 211, 102, .12); border-color: rgba(37, 211, 102, .35); color: #25d366; }
.chat-upgrade-whatsapp { background: #25d366; border-color: transparent; color: #fff; gap: 8px; text-decoration: none; }
.chat-upgrade-whatsapp:hover { filter: brightness(1.06); }
@keyframes chat-confirm-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes chat-confirm-in { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .chat-confirm-overlay, .chat-confirm { animation: none; } }
@media (max-width: 760px) {
  .chat-confirm-overlay { align-items: center; padding: 16px; }
  .chat-confirm { border-radius: 18px; max-width: none; padding: 20px 18px; }
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
.chat-limit-list { display: grid; gap: 10px; margin: 0 0 16px; width: 100%; }
.chat-limit-card { align-items: center; flex-wrap: wrap; justify-content: space-between; }
.chat-limit-card-text { flex: 1 1 240px; min-width: 0; }
.chat-limit-meter { background: var(--app-amber-border); border-radius: 999px; height: 8px; margin-top: 10px; overflow: hidden; }
.chat-limit-meter > span { background: var(--app-amber); border-radius: inherit; display: block; height: 100%; }
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
.chat-alert-row { align-items: center; display: flex; gap: 8px; min-width: 0; }
.chat-alert-row .chat-input { flex: 1; min-width: 0; }
.chat-alert-saved { align-items: center; display: flex; font-variant-numeric: tabular-nums; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
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
.chat-website { display: grid; gap: 14px; max-width: 640px; }
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
.chat-list-head { align-items: center; }
.chat-list-head > div { min-width: 0; }
.chat-list-head .chat-btn { flex: 0 0 auto; }
.chat-list-actions { display: flex; flex: 0 0 auto; gap: 8px; }
.chat-list-head > .chat-list-titlebar { flex: 1 1 auto; }
.chat-list-titlebar { align-items: center; display: flex; gap: 16px; min-width: 0; }
.chat-list-titleblock { flex: 0 0 auto; min-width: 0; }
/* Retell-style agent list: title on the left, search and buttons on the right,
   then a full-width table with a shaded header row and a pager under it. */
.chat-list-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; flex: 0 0 auto; }
.chat-list-title { font-size: 20px; font-weight: 600; letter-spacing: -.2px; line-height: 1.3; margin: 0; white-space: nowrap; }
.chat-list-actions { align-items: center; display: flex; flex: 0 1 auto; gap: 8px; min-width: 0; }
.chat-search-head { flex: 0 1 300px; margin: 0; min-width: 0; width: 300px; }
.chat-search-head .chat-input { border-radius: 8px; height: 36px; }
.chat-list-actions .chat-btn { border-radius: 8px; min-height: 36px; }
.chat-table-wrap { flex: 1 1 auto; min-height: 0; overflow: auto; }
.chat-table { border-collapse: separate; border-spacing: 0; font-size: 14px; width: 100%; }
.chat-table thead th {
  background: var(--app-hover);
  color: var(--muted);
  font-weight: 500;
  padding: 14px 16px;
  position: sticky;
  text-align: left;
  top: 0;
  white-space: nowrap;
  z-index: 2;
}
.chat-table thead th:first-child { border-radius: 10px 0 0 10px; }
.chat-table thead th:last-child { border-radius: 0 10px 10px 0; }
.chat-table td { border-bottom: 1px solid var(--border); padding: 11px 16px; vertical-align: middle; }
.chat-table-row { position: relative; }
.chat-table-row:hover td { background: var(--panel-hover); }
.chat-table-row:has(.chat-list-link:focus-visible) td { background: var(--panel-hover); }
.chat-table-name { align-items: center; display: inline-flex; gap: 12px; max-width: 100%; min-width: 0; }
.chat-table-icon { align-items: center; border: 1px solid var(--border); border-radius: 8px; color: var(--primary-light); display: inline-flex; flex: 0 0 auto; height: 32px; justify-content: center; width: 32px; }
.chat-table .chat-list-link { color: var(--text); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-table .chat-list-link::after { border-radius: 0; }
.chat-table-muted { color: var(--muted); white-space: nowrap; }
.chat-table-text { display: flex; flex-direction: column; min-width: 0; }
.chat-table-sub { color: var(--muted); display: none; font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-table-resources { align-items: center; display: inline-flex; gap: 10px; }
.chat-table-resources .chat-orders-on { font-size: 11px; }
.chat-col-actions { text-align: right; width: 56px; }
.chat-table .chat-list-delete { opacity: .6; }
.chat-table-row:hover .chat-list-delete, .chat-table .chat-list-delete:focus-visible { opacity: 1; }
.chat-pager { align-items: center; display: flex; flex: 0 0 auto; gap: 10px; justify-content: center; padding: 14px 0 4px; }
.chat-pager-btn { align-items: center; background: none; border: 0; border-radius: 6px; color: var(--muted); cursor: pointer; display: inline-flex; height: 28px; justify-content: center; width: 28px; }
.chat-pager-btn:disabled { cursor: default; opacity: .35; }
.chat-pager-btn:not(:disabled):hover { background: var(--app-hover); color: var(--text); }
.chat-pager-btn svg { transform: rotate(-90deg); }
.chat-pager-prev svg { transform: rotate(90deg); }
.chat-pager-num { align-items: center; background: var(--app-hover-3); border-radius: 6px; display: inline-flex; font-size: 13px; font-weight: 600; height: 28px; justify-content: center; min-width: 28px; }
@media (max-width: 1100px) {
  .chat-col-edited { display: none; }
}
@media (max-width: 480px) {
  .chat-table th:nth-child(3), .chat-table td:nth-child(3) { display: none; }
}
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
.chat-qr-reveal { display: grid; gap: 12px; margin-top: 4px; }
.chat-qr-reveal-or { align-items: center; color: var(--faint); display: flex; font-size: 12px; font-weight: 700; gap: 12px; text-transform: uppercase; }
.chat-qr-reveal-or::before, .chat-qr-reveal-or::after { background: var(--border); content: ""; flex: 1 1 auto; height: 1px; }
.chat-qr-reveal .chat-btn { justify-content: center; width: 100%; }
.chat-setup-card-wrap { align-items: flex-start; display: flex; justify-content: center; width: 100%; }
.chat-setup-card-wrap .chat-modal-card { border-radius: 18px; box-shadow: none; max-height: none; overflow: visible; }
.chat-setup-card-wrap .chat-modal-body { overflow: visible; }
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
/* An agent with no number: the whole page is the connect screen. The QR side
   gets the room; numbers already connected sit in a narrower column. */
.chat-connect-page { display: flex; flex: 1 1 auto; justify-content: center; min-height: 0; overflow-y: auto; padding: 28px 24px 32px; }
.chat-connect-inner { align-content: start; display: grid; gap: 20px; max-width: 1040px; width: 100%; }
.chat-connect-head { display: grid; gap: 6px; text-align: center; }
.chat-connect-title { color: var(--text); font-size: 22px; font-weight: 700; letter-spacing: -.3px; margin: 0; }
.chat-connect-copy { color: var(--muted); font-size: 13.5px; line-height: 1.5; margin: 0 auto; max-width: 520px; }
.chat-connect-page .chat-number-grid { gap: 16px; grid-template-columns: minmax(0, 1.7fr) minmax(260px, 1fr); }
.chat-connect-page .chat-number-grid.is-single { grid-template-columns: minmax(0, 1fr); }
.chat-connect-page .chat-number-pane { gap: 14px; padding: 20px; }
@media (max-width: 900px) {
  .chat-connect-page { overflow: visible; padding: 16px 12px 24px; }
  .chat-connect-page .chat-number-grid { grid-template-columns: minmax(0, 1fr); }
  .chat-connect-page .chat-number-pane { padding: 16px; }
  .chat-connect-title { font-size: 19px; }
}
.chat-number-pane {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 13px;
  display: grid;
  gap: 10px;
  padding: 13px;
}
.chat-number-pane-head { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.chat-number-pane-title { font-size: 12.5px; font-weight: 800; letter-spacing: -.1px; }
.chat-number-pane-note { color: var(--faint); font-size: 11px; white-space: nowrap; }
.chat-number-pane-actions { align-items: center; display: flex; gap: 8px; }
/* "Watch video" how-to: desktop only (phones are the device doing the scan). */
.chat-number-video-btn {
  align-items: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--subtle);
  cursor: pointer;
  display: none;
  font-size: 12px;
  font-weight: 700;
  gap: 6px;
  height: 32px;
  padding: 0 12px 0 10px;
  white-space: nowrap;
}
.chat-modal-head-actions { align-items: center; display: flex; flex: none; gap: 8px; }
.chat-number-video-btn:hover { border-color: var(--app-primary-ring); color: var(--text); }
.chat-number-video-btn svg { color: #ff3d3d; flex: none; }
@media (min-width: 901px) { .chat-number-video-btn.is-desktop { display: inline-flex; } }
@media (max-width: 900px) {
  .chat-number-video-btn.is-mobile { display: inline-flex; }
  /* The Watch video pill squeezes the header; the QR steps below say the same thing. */
  .chat-modal-subtitle.is-linking { display: none; }
}
.chat-video-overlay { align-items: center; animation: chat-confirm-fade .16s ease; backdrop-filter: blur(3px); background: rgba(0, 0, 0, .72); display: flex; inset: 0; justify-content: center; padding: 32px; position: fixed; z-index: 200; }
.chat-video-box { display: grid; gap: 10px; width: min(960px, 100%); }
.chat-video-close { background: transparent; border: 1px solid rgba(255,255,255,.3); border-radius: 8px; color: #fff; cursor: pointer; font-size: 12px; font-weight: 700; justify-self: end; padding: 5px 11px; }
.chat-video-box.is-vertical { width: min(420px, 100%, calc((100dvh - 110px) * 9 / 16)); }
.chat-video-box.is-vertical .chat-video-frame { aspect-ratio: 9 / 16; }
@media (max-width: 900px) { .chat-video-overlay { padding: 16px; } }
.chat-video-frame { aspect-ratio: 16 / 9; background: #000; border: 0; border-radius: 12px; width: 100%; }
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
/* QR-first linking: the code and its reload timer on the left, the steps on
   the right; stacked when the pane is too narrow for both side by side. */
.chat-qr-connect { align-items: center; display: grid; gap: 18px 28px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.chat-qr-connect-code { display: grid; gap: 10px; justify-items: center; }
.chat-qr-connect-code .chat-qr-frame { max-width: 240px; width: 100%; }
.chat-qr-connect-timer { color: var(--app-primary-text); font-size: 13px; font-variant-numeric: tabular-nums; font-weight: 600; text-align: center; }
.chat-qr-connect-alt {
  background: none;
  border: 0;
  color: var(--app-primary-text);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  padding: 2px 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.chat-qr-connect-alt:hover { color: var(--text); }
.chat-qr-connect-help { display: grid; gap: 14px; min-width: 0; }
.chat-qr-connect-title { color: var(--text); font-size: 16px; font-weight: 700; text-align: center; }
.chat-qr-connect-steps { color: var(--muted); display: grid; font-size: 13.5px; gap: 10px; line-height: 1.45; margin: 0; padding-left: 22px; }
.chat-qr-connect-steps b { color: var(--text); font-weight: 700; }
.chat-qr-connect-note { color: var(--subtle); font-size: 11.5px; line-height: 1.5; margin: 0; }
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
.chat-number-end { align-items: center; display: inline-flex; gap: 10px; }
.chat-number-use {
  align-items: center;
  background: var(--app-primary);
  border-radius: 8px;
  color: var(--app-on-accent, #fff);
  display: inline-flex;
  font-size: 12.5px;
  font-weight: 700;
  height: 30px;
  padding: 0 14px;
  transition: filter .15s ease;
}
.chat-number-row:hover:not(:disabled) .chat-number-use { filter: brightness(1.1); }
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
  /* Right-hand column even when there are no tabs (an agent with no number). */
  .chat-agent-expanded-topline .chat-detail-head > .chat-editor-actions { grid-column: 3; }
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
/* The cards under the prompt, as a grid on desktop: three across where they
   fit, fewer on a narrower window. Each keeps its own height when opened. */
.chat-editor-cards { align-items: start; display: grid; flex: none; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
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
/* Laptop and desktop: a bento layout. The page has no outer frame; the header,
   the prompt, each side card and the settings rail float on the page background
   as separate rounded cards, all 16px apart and 16px from the edges (the same
   gutter as the floating sidebar). Only the layout changes, not the colours.
   Placed after the width-specific padding rules above so it wins over them. */
@media (min-width: 901px) {
  .chat-shell > main.chat-main.chat-main {
    background: transparent;
    border: 0;
    border-radius: 0;
    height: 100vh;
    height: 100dvh;
    margin: 0;
    overflow: hidden;
  }
  .chat-content,
  .chat-content:has(> .chat-agent-page) { gap: 16px; padding: 16px 16px 16px 16px; }
  .chat-limit-list { margin: 0; }

  .chat-agent-browser {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: 0 1px 2px var(--app-shadow-soft);
    padding: 20px 24px 12px;
  }

  .chat-agent-page {
    background: transparent;
    border: 0;
    border-radius: 0;
    gap: 16px;
    max-width: none;
    overflow: visible;
  }
  .chat-agent-expanded-topline {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: 0 1px 2px var(--app-shadow-soft);
    padding: 12px 16px;
  }
  .chat-agent-expanded-grid { gap: 16px; padding: 0; }
  .chat-editor,
  .chat-editor-columns,
  .chat-editor-main,
  .chat-editor-cards { gap: 16px; }
  .chat-card,
  .chat-panel { border-radius: 20px; }
  .chat-prompt-card { padding: 18px 20px; }
  .chat-connect-page {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: 0 1px 2px var(--app-shadow-soft);
  }
}
/* Tablets and phones: the sidebar becomes a drawer behind a sticky top bar,
   and the page scrolls as a whole instead of each pane on its own. */
@media (max-width: 900px) {
  .chat-shell { display: block; height: auto; max-height: none; min-height: 100dvh; overflow: visible; width: 100%; max-width: 100%; }
  .chat-main { height: auto; overflow: visible; }
  .chat-content { padding: 16px; }
  .chat-workspace { grid-template-columns: minmax(0, 1fr); }
  .chat-panel { max-height: none; }
  .chat-agent-browser { overflow: visible; }
  .chat-agent-browser > .chat-panel-body { overflow: visible; }
  .chat-number-grid { grid-template-columns: 1fr; }
  .chat-qr-frame { justify-self: center; max-width: 260px; width: 100%; }
  .chat-agent-page { overflow: visible; }
  .chat-agent-expanded-grid { overflow: visible; }
  .chat-agent-expanded-grid > .chat-editor { overflow: visible; padding-right: 0; }
  /* Toasts rise above the sidebar's bottom tab bar. */
  .chat-toast { bottom: calc(76px + env(safe-area-inset-bottom)); }
  /* The agent list fills the screen between the top bar (58px) and the bottom
     tab bar (62px), so the pager sits at the foot of the screen, not right
     under the last row. */
  .chat-main:has(> .chat-content > .chat-workspace) { min-height: calc(100dvh - 120px - env(safe-area-inset-bottom)); }
  .chat-content:has(> .chat-workspace) { flex: 1 1 auto; }
  .chat-workspace .chat-agent-browser { flex: 1 1 auto; height: auto; }
  .chat-workspace .chat-table-wrap { flex: 0 0 auto; overflow: visible; }
  .chat-workspace .chat-pager { margin-top: auto; padding-top: 16px; }
  /* Agent page: the Agent / Conversation / Configuration tabs stay pinned
     under the top bar (58px) while the settings scroll beneath them. */
  .chat-agent-page .chat-tabs {
    box-shadow: 0 -12px 0 var(--bg), 0 10px 18px -14px rgba(0, 0, 0, .55);
    position: sticky;
    top: 66px;
    z-index: 6;
  }
}
/* Phones: one column everywhere, the agent editor goes full screen, and
   touch targets grow a little. */
@media (max-width: 640px) {
  .chat-content { padding: 12px; }
  .chat-panel-head { padding: 12px 14px; }
  .chat-panel-body { padding: 12px 14px; }
  /* Phones: the title takes its own line and the two buttons share the row
     below at full width, instead of squeezing the title into two lines. */
  .chat-list-head { align-items: stretch; flex-direction: column; gap: 12px; }
  .chat-list-head .chat-panel-title { white-space: nowrap; }
  .chat-list-head .chat-panel-copy { margin-top: 2px; }
  .chat-list-actions { width: 100%; }
  .chat-search-head { flex: 1 1 100%; margin: 0; max-width: none; width: auto; }
  .chat-list-actions { flex-wrap: wrap; }
  .chat-col-resources { display: none; }
  /* Phones: each agent is its own card - name with its number underneath,
     then the status and delete - instead of a table row under a header. */
  .chat-table thead { display: none; }
  .chat-table, .chat-table tbody { display: block; }
  .chat-table tbody tr {
    align-items: center;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 14px;
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
    padding: 12px;
    transition: background .15s ease, border-color .15s ease;
  }
  .chat-table td { background: none !important; border: 0; display: block; flex: 0 0 auto; padding: 0; width: auto; }
  .chat-table td:first-child { flex: 1 1 auto; min-width: 0; overflow: hidden; }
  .chat-table td:first-child .chat-table-name { display: flex; }
  /* The card shows only name, status and delete; the number is under the name. */
  .chat-table td:nth-child(3), .chat-table td.chat-col-resources, .chat-table td.chat-col-edited { display: none; }
  .chat-table-row:hover { background: var(--panel-hover); border-color: var(--app-border-strong); }
  .chat-table-row:has(.chat-list-link:focus-visible) { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 3px var(--app-primary-ring); }
  .chat-table .chat-list-link::after { border-radius: 14px; }
  .chat-table-icon { border-radius: 10px; height: 38px; width: 38px; }
  .chat-table .chat-list-link { font-size: 15px; font-weight: 600; }
  .chat-table-sub { display: block; }
  .chat-table .chat-list-delete { opacity: 1; }
  .chat-list-actions .chat-btn { flex: 1 1 0; justify-content: center; min-width: 0; white-space: nowrap; }
  .chat-fields-2 { grid-template-columns: 1fr; }
  .chat-composer { grid-template-columns: 1fr; }
  .chat-modal-grid { grid-template-columns: 1fr; }
  .chat-modal-backdrop { align-items: flex-end; padding: 0; }
  .chat-modal-card { border-radius: 18px 18px 0 0; max-height: calc(100dvh - 24px); }
  .chat-modal-head, .chat-modal-body { padding: 16px; }
  .chat-modal-footer { flex-direction: column-reverse; padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); }
  .chat-modal-footer .chat-btn { width: 100%; }
  .chat-input, .chat-select { font-size: 16px; } /* stops iOS zooming on focus */
  /* Agent page on phones: no frame around the page (it only cost width), and
     the header is two rows - back, avatar, name and status on top, then
     Pause and Delete side by side across the full width. */
  .chat-content:has(> .chat-agent-page) { padding: 0; }
  .chat-agent-page { background: transparent; border: 0; border-radius: 0; }
  .chat-agent-expanded-grid { gap: 12px; padding: 12px 12px calc(12px + env(safe-area-inset-bottom)); }
  .chat-agent-expanded-topline {
    align-items: center;
    display: grid;
    gap: 12px 10px;
    grid-template-columns: auto minmax(0, 1fr);
    padding: 14px 12px 12px;
  }
  .chat-agent-expanded-topline > .chat-detail-head { display: contents; }
  .chat-agent-expanded-topline .chat-identity { gap: 10px; grid-template-columns: 40px minmax(0, 1fr); }
  .chat-agent-expanded-topline .chat-avatar-lg { border-radius: 11px; font-size: 15px; height: 40px; width: 40px; }
  .chat-agent-expanded-topline .chat-heading-row { flex-wrap: nowrap; gap: 8px; }
  .chat-agent-expanded-topline .chat-heading { flex: 0 1 auto; min-width: 0; }
  .chat-agent-expanded-topline .chat-heading-row > :not(.chat-heading) { flex: none; }
  .chat-agent-expanded-topline .chat-tag { display: none; }
  /* The full name wraps onto a second line instead of being cut off. */
  .chat-agent-expanded-topline .chat-heading { font-size: 17px; line-height: 1.2; white-space: normal; }
  .chat-agent-expanded-topline .chat-heading-edit:not(.chat-heading-input) {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    overflow-wrap: anywhere;
    white-space: normal;
  }
  .chat-editor-actions { gap: 8px; grid-column: 1 / -1; justify-content: stretch; }
  .chat-editor-actions .chat-btn { flex: 1 1 0; justify-content: center; min-height: 40px; }
  .chat-agent-page .chat-tabs { top: 58px; }
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
/* Narrow phones: the WhatsApp help button switches to its short label so both
   buttons fit side by side with their text. */
@media (max-width: 420px) {
  .chat-list-head .chat-btn-whatsapp .chat-btn-label { display: none; }
  .chat-list-head .chat-btn-whatsapp .chat-btn-label-short { display: inline; }
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

const LIST_PAGE_SIZE = 20;

// "11/21/2026 · 14:52" in the viewer's own time zone, as Retell's Edited column.
function formatEdited(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const day = date.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}`;
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
const CHAT_AGENT_LIMIT_MESSAGE = "Your account already has a chat agent.";

// The auto-login effect's owner for a login the create modal started, which has
// no agent to belong to yet.
const NEW_AGENT_LOGIN = "new-agent";

// Matches whiskey's AUTO_AGENT_NAME, the name an agent gets when linking a
// number creates it.
const DEFAULT_AGENT_NAME = "WhatsApp Agent";

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
    // a section it doesn't know, and orders_on is read-only. The order-alert
    // number is left out: OrderAlertField saves it on its own once WhatsApp has
    // confirmed it, so an autosave never carries a stale or unchecked one.
    order: agent.order
      ? {
          order_enabled: agent.order.order_enabled,
          order_instructions: agent.order.order_instructions,
        }
      : undefined,
    media: agent.media ? { ...agent.media } : undefined,
    website: agent.website ? { ...agent.website } : undefined,
    files: agent.files ? { ...agent.files } : undefined,
    behavior: agent.behavior ? { ...agent.behavior } : undefined,
    human_intervention: agent.human_intervention ? { ...agent.human_intervention } : undefined,
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
  // The "get more agents" modal, shown instead of the create flow at the cap.
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
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
  // Whose QR login was asked for. The QR code is only shown, and only kept
  // fresh, after someone presses "Scan QR code"; the pairing code comes first.
  const [qrOwner, setQrOwner] = useState("");
  const [isRefreshingNumbers, setIsRefreshingNumbers] = useState(false);
  // One login is started per state it can be started from — keyed by the agent
  // and the session it saw — so a failed start is not retried in a loop while
  // an expiry, which changes the key, still triggers a fresh code.
  const autoLoginKey = useRef("");
  // Automatic reissues so far, per agent, against maxAutoLogins.
  const autoLoginRuns = useRef({ agentId: "", count: 0 });
  // True once the server has returned the agent list in this visit. A cached or
  // failed list proves nothing about whether the account has an agent.
  const [isListFromServer, setIsListFromServer] = useState(false);
  // Saves waiting out their debounce, with the save itself so leaving the page
  // can send it at once instead of dropping it.
  const saveTimers = useRef<
    Map<string, { timer: ReturnType<typeof setTimeout>; run: () => void }>
  >(new Map());
  // The save in flight per agent, and a counter naming the newest save asked
  // for, so saves of one agent never overlap (see queueSave).
  const saveChains = useRef<Map<string, Promise<void>>>(new Map());
  const saveTickets = useRef<Map<string, number>>(new Map());
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
        setIsListFromServer(true);
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

  // The list is a table of LIST_PAGE_SIZE rows a page, like Retell's.
  const [listPage, setListPage] = useState(0);
  const listPageCount = Math.max(1, Math.ceil(filtered.length / LIST_PAGE_SIZE));
  const currentListPage = Math.min(listPage, listPageCount - 1);
  const pagedAgents = filtered.slice(currentListPage * LIST_PAGE_SIZE, (currentListPage + 1) * LIST_PAGE_SIZE);

  const selected = useMemo(
    () => (selectedId ? chatAgents.find((agent) => agent.id === selectedId) ?? null : null),
    [chatAgents, selectedId]
  );

  // A live agent can reach its hourly limit at any moment, on the list or with
  // the agent open, so the timer is re-read while one is on screen. Only that
  // field is taken, never the settings, so an edit still waiting to save is not
  // overwritten.
  const watchLiveAgents =
    selected?.agent.status === "active" ||
    (!agentId && chatAgents.some((agent) => agent.agent.status === "active"));
  useEffect(() => {
    if (!watchLiveAgents) return;
    let cancelled = false;
    const stopRefreshing = startRefreshing(async () => {
      try {
        const fresh = await listChatAgentLiveStates(getToken);
        if (cancelled) return;
        const freshById = new Map(fresh.map((agent) => [agent.id, agent]));
        setChatAgents((current) =>
          current.map((item) => {
            const match = freshById.get(item.id);
            if (!match) return item;
            return {
              ...item,
              agent: match.status ? { ...item.agent, status: match.status } : item.agent,
              hourly_limit_resets_at: match.hourly_limit_resets_at,
              free_trial_ended: match.free_trial_ended,
              free_trial: match.free_trial,
            };
          })
        );
      } catch {
        // A missed refresh is retried on the next tick.
      }
    }, 15000);
    return () => {
      cancelled = true;
      stopRefreshing();
    };
  }, [getToken, setChatAgents, watchLiveAgents]);

  const queueSave = useCallback(
    (agent: ApiChatAgent, delay = 500) => {
      const previous = saveTimers.current.get(agent.id);
      if (previous) clearTimeout(previous.timer);
      const revision = editRevisions.current.get(agent.id) ?? 0;
      const run = async () => {
        saveTimers.current.delete(agent.id);
        // One save per agent at a time. Every save carries the whole agent, so
        // while one is in flight only the newest waiting save is worth sending:
        // overlapping saves queued on the agent's row lock on the server until
        // they timed out (2026-11-18) and failed for everyone sharing the pool.
        const ticket = (saveTickets.current.get(agent.id) ?? 0) + 1;
        saveTickets.current.set(agent.id, ticket);
        const prior = saveChains.current.get(agent.id) ?? Promise.resolve();
        const chain = prior.then(() =>
          saveTickets.current.get(agent.id) === ticket ? send() : undefined
        );
        saveChains.current.set(agent.id, chain);
        await chain;
        if (saveChains.current.get(agent.id) === chain) saveChains.current.delete(agent.id);
      };
      const send = async () => {
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

  // A linked number is all a new agent needs: there is no naming step. The
  // server gives a freshly linked number its agent before the number reads
  // connected, so this finds it and opens it. A number that has no agent (one
  // already on the account, picked from the list, or an older server) gets one
  // here with the default name. Only if that fails does the naming step show,
  // with the error, as the way to finish by hand.
  const finishCreateWithNumber = useCallback(
    async (phoneNumberId: string) => {
      setCreateError("");
      setIsCreating(true);
      try {
        let agents = await listDashboardChatAgents(getToken);
        let agent = agents.find((item) => item.agent.phone_number_id === phoneNumberId);
        if (!agent) {
          agent = await createDashboardChatAgent(
            createFormToPayload({
              ...newCreateForm(1),
              name: DEFAULT_AGENT_NAME,
              phone_number_id: phoneNumberId,
            }),
            getToken
          );
          agents = [agent, ...agents];
        }
        setChatAgents(agents);
        setCreateForm(null);
        router.push(`/dashboard/chat/${agent.id}`);
      } catch (error) {
        if (isChatAgentLimitError(error)) {
          setCreateForm(null);
          setIsUpgradeOpen(true);
        } else {
          setCreateForm((current) => (current ? { ...current, name: DEFAULT_AGENT_NAME, phone_number_id: phoneNumberId } : current));
          setCreateError(error instanceof Error ? error.message : "Could not create chat agent");
        }
      } finally {
        setIsCreating(false);
      }
    },
    [getToken, router, setChatAgents]
  );
  const finishCreateRef = useRef(finishCreateWithNumber);
  useEffect(() => {
    finishCreateRef.current = finishCreateWithNumber;
  }, [finishCreateWithNumber]);

  // Linking a number creates its agent on the server, live, before the number
  // reads connected. The login poller above only sees that while this page
  // still holds the login it started; on a phone the owner leaves for WhatsApp
  // to type the code, and a tab the browser reloaded meanwhile (or a link
  // finished in another tab) was left on the setup page with the agent already
  // made. So while the account shows no agent, look for one every few seconds,
  // and at once on coming back to the tab, and open it when it appears.
  const watchForFirstAgent = !agentId && isListFromServer && chatAgents.length === 0 && !isCreating;
  useEffect(() => {
    if (!watchForFirstAgent) return;
    let cancelled = false;
    let opening = false;
    const stopRefreshing = startRefreshing(async () => {
      if (opening) return;
      try {
        const live = await listChatAgentLiveStates(getToken);
        if (cancelled || live.length === 0) return;
        opening = true;
        const agents = await listDashboardChatAgents(getToken);
        if (cancelled || agents.length === 0) {
          opening = false;
          return;
        }
        const agent = agents.find((item) => item.agent.phone_number_id) ?? agents[0];
        console.log("[wa-login] agent appeared on the setup page; opening it", { agentId: agent.id });
        setChatAgents(agents);
        setCreateForm(null);
        router.push(`/dashboard/chat/${agent.id}`);
      } catch {
        opening = false;
        // Tried again on the next turn.
      }
    }, 3000);
    return () => {
      cancelled = true;
      stopRefreshing();
    };
  }, [getToken, router, setChatAgents, watchForFirstAgent]);

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
            void finishCreateRef.current(updated.id);
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
    setQrOwner(loginOwner);
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
      // Chose the code over a scan: a code that runs out is not replaced by a QR.
      setQrOwner("");
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
    setQrOwner(loginOwner);
    try {
      const started = await apiStartPhoneNumberQrLogin({}, getToken);
      setNumberLogin(started);
    } finally {
      setIsStartingLogin(false);
    }
  }, [getToken, loginOwner]);

  // Once "Scan QR code" is pressed, a session that runs out of codes is
  // reissued, so what is on screen is always a scannable code.
  //
  // WhatsApp owns the rotation itself — it hands the session a series of codes
  // (roughly one a minute, then one every 20s) which the server stores as they
  // arrive and the poll above picks up. This only has to keep a live session
  // there to receive them.
  //
  // Nothing starts before that button: the card leads with the pairing code,
  // which links far more often, and an unasked-for QR session only runs out.
  useEffect(() => {
    if (!isAuthenticated || !loginOwner || isStartingLogin) return;
    if (qrOwner !== loginOwner) return;

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
  }, [isAuthenticated, isStartingLogin, loginOwner, numberLogin, qrOwner, startNumberLogin]);

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
    // At the agent cap, "New chat agent" explains the paid plan instead. The
    // default cap is one, but the server may allow an account more, so only
    // the second agent onward is refused here; the first extra is decided by
    // the server's 403 on create.
    if (chatAgents.length > MAX_CHAT_AGENTS) {
      setIsUpgradeOpen(true);
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
    setQrOwner("");
  }, []);

  // The linking step's other way forward: a number already on the account.
  const chooseCreateNumber = useCallback((phoneNumberId: string) => {
    setCreateError("");
    setNumberLogin(null);
    setNumberLoginError("");
    void finishCreateWithNumber(phoneNumberId);
  }, [finishCreateWithNumber]);

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
      if (isChatAgentLimitError(error) && chatAgents.length === 0) {
        // The account has an agent this page never saw (made in another tab),
        // so there is nothing to set up: load it, which opens the dashboard.
        setCreateForm(null);
        listDashboardChatAgents(getToken)
          .then((agents) => setChatAgents(agents))
          .catch(() => setCreateError("Your account already has a chat agent. Reload the page."));
      } else if (isChatAgentLimitError(error)) {
        // The server saw an agent this page hadn't loaded yet.
        setCreateForm(null);
        setIsUpgradeOpen(true);
      } else {
        setCreateError(error instanceof Error ? error.message : "Could not create chat agent");
      }
    } finally {
      setIsCreating(false);
    }
  }, [chatAgents.length, createForm, getToken, isCreating, router, setChatAgents]);

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
          {!agentId && chatAgents.some((agent) => agent.free_trial_ended) ? (
            <div className="chat-limit-list">
              <FreeTrialEndedCard />
            </div>
          ) : null}
          {!agentId && chatAgents.some((agent) => agent.agent.status === "active" && agent.hourly_limit_resets_at) ? (
            <div className="chat-limit-list">
              {chatAgents.map((agent) => (
                <HourlyLimitCard agent={agent} key={agent.id} />
              ))}
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
                    tabs={
                      isDesktop && selected.agent.phone_number_id ? (
                        <EditorTabs isDesktop onSelect={setEditorTab} tab={editorTab} />
                      ) : null
                    }
                  />
                  {!selected.agent.phone_number_id ? (
                    // No number yet: the page is only the way to connect one.
                    // The prompt and settings open once a number is linked
                    // (a scan assigns it to this agent the moment it lands).
                    <div className="chat-connect-page">
                      <div className="chat-connect-inner">
                        <div className="chat-connect-head">
                          <h2 className="chat-connect-title">Connect your WhatsApp number</h2>
                          <p className="chat-connect-copy">
                            Link the number this agent will reply on. Its prompt and settings open as soon as it
                            connects.
                          </p>
                        </div>
                        <PhoneNumberSetupCard
                          bare
                          error={numberLoginError}
                          isRefreshingNumbers={isRefreshingNumbers}
                          isStarting={isStartingLogin}
                          login={numberLogin && numberLogin.status !== "connected" ? numberLogin : null}
                          numbers={assignableNumbers}
                          onRefreshNumbers={refreshPhoneNumbers}
                          onRequestCode={startNumberCodeLogin}
                          onRequestQr={startNumberQrLogin}
                          onSelectNumber={(phoneNumberId) =>
                            patchSelected((current) => ({
                              ...current,
                              agent: { ...current.agent, phone_number_id: phoneNumberId, status: "active" },
                            }))
                          }
                          onStartLogin={startNumberLogin}
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}
                </>
              ) : (
                // A link or a reload lands here before the list has loaded, so
                // "not found" waits until the server has answered.
                isLoading ? (
                  <div style={{ flex: "1 1 auto", width: "100%" }}>
                    <DetailSkeleton />
                  </div>
                ) : (
                  <div className="chat-agent-page-empty">
                    <span>This chat agent does not exist or was deleted.</span>
                    <Link className="chat-btn chat-btn-secondary chat-btn-sm" href="/dashboard/chat">
                      Back to chat agents
                    </Link>
                  </div>
                )
              )}
            </section>
          ) : (
          <section className="chat-workspace" aria-label="Chat agents workspace">
            <div className="chat-agent-browser">
              <div className="chat-list-head">
                <h1 className="chat-list-title">All Agents</h1>
                <div className="chat-list-actions">
                  <div className="chat-search chat-search-head">
                    <span className="chat-search-icon">
                      <Icon name="search" size={14} sw={2.2} />
                    </span>
                    <input
                      aria-label="Search agents"
                      className="chat-input"
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setListPage(0);
                      }}
                      placeholder="Search agents"
                      value={query}
                    />
                  </div>
                  <a
                    aria-label="Trouble connecting? Chat with us on WhatsApp"
                    className="chat-btn chat-btn-secondary chat-btn-sm"
                    href={SUPPORT_WHATSAPP_URL}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <WhatsAppGlyph size={14} />
                    <span className="chat-btn-label">Need help?</span>
                  </a>
                  <button
                    aria-label="New chat agent"
                    className="chat-btn chat-btn-primary chat-btn-sm"
                    onClick={openCreateModal}
                    type="button"
                  >
                    <Icon name="plus" size={14} stroke="#fff" sw={2.4} />
                    <span className="chat-btn-label">Create</span>
                  </button>
                </div>
              </div>

              <div className="chat-table-wrap">
                <table className="chat-table" aria-busy={showSkeleton || undefined}>
                  <thead>
                    <tr>
                      <th scope="col">Agent Name</th>
                      <th scope="col">Status</th>
                      <th scope="col">Phone</th>
                      <th className="chat-col-resources" scope="col">Knowledge &amp; Tools</th>
                      <th className="chat-col-edited" scope="col">Edited</th>
                      <th aria-label="Actions" className="chat-col-actions" scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {showSkeleton
                      ? [0, 1, 2].map((row) => (
                          <tr aria-hidden="true" className="chat-table-skeleton" key={row}>
                            <td><span className="chat-skel" style={{ width: 180 }} /></td>
                            <td><span className="chat-skel" style={{ width: 56 }} /></td>
                            <td><span className="chat-skel" style={{ width: 120 }} /></td>
                            <td className="chat-col-resources"><span className="chat-skel" style={{ width: 96 }} /></td>
                            <td className="chat-col-edited"><span className="chat-skel" style={{ width: 110 }} /></td>
                            <td className="chat-col-actions" />
                          </tr>
                        ))
                      : pagedAgents.map((agent) => {
                          const phone = phoneNumbers.find((item) => item.id === agent.agent.phone_number_id);
                          const knowledgeCount = agent.knowledge_base?.knowledge_base_ids?.length ?? 0;
                          const toolCount = agent.tools?.tool_ids?.length ?? 0;
                          return (
                            <tr className="chat-table-row" key={agent.id}>
                              <td>
                                <span className="chat-table-name">
                                  <span className="chat-table-icon">
                                    <Icon name="chat" size={15} />
                                  </span>
                                  <span className="chat-table-text">
                                    <Link className="chat-list-link" href={`/dashboard/chat/${agent.id}`}>
                                      {agent.agent.name}
                                    </Link>
                                    <span className="chat-table-sub">
                                      {phone ? phoneNumberLabel(phone) : "No number linked"}
                                    </span>
                                  </span>
                                </span>
                              </td>
                              <td><StatusPill agent={agent} /></td>
                              <td className="chat-table-muted">{phone ? phoneNumberLabel(phone) : "-"}</td>
                              <td className="chat-col-resources chat-table-muted">
                                <span className="chat-table-resources">
                                  <span>{knowledgeCount} KB</span>
                                  <span>{toolCount} tools</span>
                                  {agent.order?.orders_on ? <span className="chat-orders-on">Orders on</span> : null}
                                </span>
                              </td>
                              <td className="chat-col-edited chat-table-muted">{formatEdited(agent.updated_at)}</td>
                              <td className="chat-col-actions">
                                <button
                                  aria-label={`Delete ${agent.agent.name}`}
                                  className="chat-icon-btn chat-list-delete"
                                  onClick={() => setDeleteTargetId(agent.id)}
                                  title="Delete agent"
                                  type="button"
                                >
                                  <Icon name="trash" size={15} sw={2.2} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
                {!showSkeleton && chatAgents.length === 0 ? (
                  <div className="chat-empty-list chat-empty-start">
                    <span>No chat agents yet.</span>
                    <button className="chat-btn chat-btn-primary" onClick={openCreateModal} type="button">
                      <Icon name="plus" size={14} stroke="#fff" sw={2.4} />
                      New chat agent
                    </button>
                  </div>
                ) : !showSkeleton && filtered.length === 0 ? (
                  <div className="chat-empty-list">No agent matches that search.</div>
                ) : null}
              </div>

              {!showSkeleton && filtered.length > 0 ? (
                <nav aria-label="Agent pages" className="chat-pager">
                  <button
                    aria-label="Previous page"
                    className="chat-pager-btn chat-pager-prev"
                    disabled={currentListPage === 0}
                    onClick={() => setListPage(currentListPage - 1)}
                    type="button"
                  >
                    <Icon name="chevron" size={15} sw={2.2} />
                  </button>
                  <span aria-current="page" className="chat-pager-num">{currentListPage + 1}</span>
                  <button
                    aria-label="Next page"
                    className="chat-pager-btn"
                    disabled={currentListPage >= listPageCount - 1}
                    onClick={() => setListPage(currentListPage + 1)}
                    type="button"
                  >
                    <Icon name="chevron" size={15} sw={2.2} />
                  </button>
                </nav>
              ) : null}
            </div>
          </section>
          )}
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

      {isUpgradeOpen ? (
        <div
          className="chat-confirm-overlay"
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsUpgradeOpen(false);
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsUpgradeOpen(false);
          }}
        >
          <div
            aria-describedby="chat-upgrade-copy"
            aria-labelledby="chat-upgrade-title"
            aria-modal="true"
            className="chat-confirm"
            role="dialog"
          >
            <div className="chat-confirm-icon chat-upgrade-icon">
              <WhatsAppGlyph size={20} />
            </div>
            <h2 className="chat-confirm-title" id="chat-upgrade-title">
              Get more chat agents
            </h2>
            <p className="chat-confirm-copy" id="chat-upgrade-copy">
              {CHAT_AGENT_LIMIT_MESSAGE} To create more agents you need a <strong>paid plan</strong>.
              Message us on WhatsApp at <strong className="notranslate">+880 1701-750469</strong> and
              we&apos;ll set it up for you.
            </p>
            <div className="chat-confirm-actions">
              <button
                className="chat-btn chat-btn-secondary"
                onClick={() => setIsUpgradeOpen(false)}
                type="button"
              >
                Not now
              </button>
              <a
                autoFocus
                className="chat-btn chat-upgrade-whatsapp"
                href={MORE_AGENTS_WHATSAPP_URL}
                onClick={() => setIsUpgradeOpen(false)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <WhatsAppGlyph size={16} />
                Message us on WhatsApp
              </a>
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
// `asPage` is the setup page an account with no agent is held on: the same two
// steps, in the page instead of over it, and with no way to close them.
function CreateChatAgentModal({
  asPage = false,
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
  asPage?: boolean;
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
    if (asPage) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [asPage, onCancel]);

  // On the setup page the card is the page's content, not a dialog over it.
  const dialogProps = asPage ? {} : ({ "aria-modal": true, role: "dialog" } as const);

  const head = (
    <div className="chat-modal-head">
      <div>
        {isLinking ? null : <div className="chat-modal-step">Almost done</div>}
        <h2 className="chat-modal-title" id="chat-create-title">
          {isLinking ? "Connect your WhatsApp" : "Name your chat agent"}
        </h2>
        <div className={`chat-modal-subtitle${isLinking ? " is-linking" : ""}`}>
          {isLinking
            ? "Use a pairing code or scan the QR code to link the number your agent will answer on. Your agent is ready the moment it connects."
            : "Your number is ready. The prompt, knowledge bases and tools are set in the editor once the agent exists."}
        </div>
      </div>
      <span className="chat-modal-head-actions">
        {isLinking ? (
          <>
            <SetupVideoButton />
            <SetupVideoButton vertical />
          </>
        ) : null}
        {asPage ? null : (
          <button
            aria-label="Close create chat agent"
            className="chat-icon-btn"
            onClick={onCancel}
            type="button"
          >
            <Icon name="x" size={15} sw={2.2} />
          </button>
        )}
      </span>
    </div>
  );

  return (
    <div
      className={asPage ? "chat-setup-card-wrap" : "chat-modal-backdrop"}
      // A stray click must not end a login someone is halfway through on their
      // phone, so only the naming step closes from the backdrop.
      onMouseDown={(event) =>
        !asPage && !isLinking && event.currentTarget === event.target && onCancel()
      }
    >
      {/* Not a form on this step: the pairing code card holds a form of its own. */}
      {isLinking ? (
        <div
          aria-labelledby="chat-create-title"
          className="chat-modal-card is-pairing"
          {...dialogProps}
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
          {asPage ? null : (
            <div className="chat-modal-footer">
              <button className="chat-btn chat-btn-secondary" onClick={onCancel} type="button">
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <form
          aria-labelledby="chat-create-title"
          className="chat-modal-card"
          onSubmit={(event) => {
            event.preventDefault();
            onCreate();
          }}
          {...dialogProps}
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
            {asPage ? null : (
              <button
                className="chat-btn chat-btn-secondary"
                disabled={isSubmitting}
                onClick={onCancel}
                type="button"
              >
                Cancel
              </button>
            )}
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
  const hourlyLimit = useHourlyLimit(agent);
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
              <StatusPill agent={agent} />
            </div>
          </div>
        </div>
        {tabs}
        <div className="chat-editor-actions">
          <TrialUsageChip agent={agent} />
          <button
            className="chat-btn chat-btn-secondary"
            disabled={activationBlocked}
            onClick={() => {
              // Out of free replies: the server would keep it off anyway, so
              // show the limit modal instead of turning it on.
              if (status !== "active" && trialOver(agent)) {
                window.dispatchEvent(new Event(TRIAL_LIMIT_EVENT));
                return;
              }
              onPatch((current) => ({
                ...current,
                agent: {
                  ...current.agent,
                  status: (current.agent.status ?? "inactive") === "active" ? "inactive" : "active",
                },
              }));
            }}
            title={
              activationBlocked
                ? needsNumberHint
                : hourlyLimit
                  ? "Stay paused when the timer ends, until you activate this agent"
                  : undefined
            }
            type="button"
          >
            <Icon name="demo" size={16} sw={2.2} />
            {status !== "active" ? "Activate" : hourlyLimit ? "Keep paused" : "Pause"}
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
  // Starts open on desktop, where the cards sit side by side, and closed on
  // phones; the header still shows how many files. null = not touched yet.
  const [filesChoice, setFilesOpen] = useState<boolean | null>(null);
  const filesOpen = filesChoice ?? isDesktop;
  const filesCard = (
    <FilesCard agent={agent} isOpen={filesOpen} key={agent.id} onOpenChange={setFilesOpen} onPatch={onPatch} />
  );
  const websiteCard = <WebsiteCard agent={agent} key={`website-${agent.id}`} onPatch={onPatch} />;
  const humanCard = (
    <HumanInterventionCard agent={agent} key={`human-${agent.id}`} onPatch={onPatch} />
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
      {agent.free_trial_ended ? <FreeTrialEndedCard /> : null}
      {trialOver(agent) ? (
        <FreeTrialLimitModal key={agent.id} limit={agent.free_trial?.limit} />
      ) : null}
      <HourlyLimitCard agent={agent} />
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
            {/* Side by side on desktop; each opens in place. */}
            <div className="chat-editor-cards">
              {humanCard}
              {filesCard}
              {websiteCard}
            </div>
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

          {humanCard}
          {filesCard}
          {websiteCard}

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
const SYSTEM_PROMPT_MAX_CHARS = 9000;

function subscribeToSeconds(onTick: () => void) {
  const timer = setInterval(onTick, 1000);
  return () => clearInterval(timer);
}

function subscribeToNothing() {
  return () => undefined;
}

// The time left while a live agent is at its hourly reply limit, or null. The
// server doesn't change the agent's status at the limit, so this is what says it
// is paused. An agent the owner paused stays paused when the hour ends, so it has
// no timer. It clears by itself when the time is up.
function useHourlyLimit(agent: ApiChatAgent) {
  const resetsAt = agent.agent.status === "active" ? agent.hourly_limit_resets_at : undefined;
  const resetsAtMs = resetsAt ? Date.parse(resetsAt) : 0;
  const seconds = useSyncExternalStore(
    resetsAt ? subscribeToSeconds : subscribeToNothing,
    () => Math.max(0, Math.ceil((resetsAtMs - Date.now()) / 1000)),
    () => 0
  );
  if (!(seconds > 0)) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    countdown:
      seconds >= 3600
        ? `${Math.floor(seconds / 3600)}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`
        : `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`,
    at: new Date(resetsAtMs).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  };
}

function HourlyLimitCard({ agent }: { agent: ApiChatAgent }) {
  const limit = useHourlyLimit(agent);
  if (!limit) return null;
  // The server leaves free_trial out for paid plans. Their limit is temporary
  // (2026-11-27), so they get an apology instead of the plain limit copy.
  const paid = !agent.free_trial;

  return (
    <div className="chat-card chat-runtime-alert chat-limit-card" role="status">
      <span className="chat-runtime-alert-icon">!</span>
      <div className="chat-limit-card-text">
        <p className="chat-runtime-alert-title">You have reached your hourly AI reply limit</p>
        {paid ? (
          <p className="chat-runtime-alert-copy">
            We&apos;re temporarily limiting each agent to <strong>100 messages per hour</strong> while we work on
            resolving a technical issue on our servers. Once the issue is fixed, everything will return to its
            previous state. We sincerely apologize for the temporary inconvenience and appreciate your patience and
            understanding.
          </p>
        ) : (
          <p className="chat-runtime-alert-copy">
            {agent.agent.name} has sent 100 AI replies this hour, so it is paused. It turns back on by itself when the
            timer ends. Messages that arrive meanwhile are still saved in Conversations.
          </p>
        )}
      </div>
      <div className="chat-limit-timer" aria-label={`Active again in ${limit.countdown}, at ${limit.at}`}>
        <span className="chat-limit-timer-value">{limit.countdown}</span>
        <span className="chat-limit-timer-label">Active again at {limit.at}</span>
      </div>
    </div>
  );
}

// FreeTrialEndedCard is shown once the account has used up its free trial: the
// server has turned its agents off and keeps them off until a paid plan is set
// up, which is done by hand after the owner messages us.
function FreeTrialEndedCard() {
  return (
    <div className="chat-card chat-runtime-alert chat-limit-card" role="alert">
      <span className="chat-runtime-alert-icon">!</span>
      <div className="chat-limit-card-text">
        <p className="chat-runtime-alert-title">Your free trial has ended</p>
        <p className="chat-runtime-alert-copy">
          Your AI agent is turned off. To keep using it, you need a <strong>paid plan</strong>. To buy one, message
          us on WhatsApp at <strong className="notranslate">+880 1701-750469</strong> and we&apos;ll set it up for
          you.
        </p>
      </div>
      <a
        className="chat-btn chat-upgrade-whatsapp"
        href={FREE_TRIAL_WHATSAPP_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WhatsAppGlyph size={16} />
        Message us on WhatsApp
      </a>
    </div>
  );
}

// FreeTrialLimitModal pops up over the agent page once the account has used all
// its free AI replies. "Not now" closes it; it comes back the next time an agent
// page opens. The FreeTrialEndedCard stays on the page underneath.
// From this many used free replies the agent header shows how many are left.
const TRIAL_CHIP_FROM = 350;

// TrialUsageChip is a small donut beside Activate once a free account has used
// TRIAL_CHIP_FROM replies: the coloured arc is what is left. Clicking it opens
// the sidebar's Usage modal.
function TrialUsageChip({ agent }: { agent: ApiChatAgent }) {
  const hatch = `trial-hatch-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const trial = agent.free_trial;
  if (!trial || trial.used < TRIAL_CHIP_FROM) return null;
  const left = Math.max(0, trial.limit - trial.used);
  const r = 15;
  const c = 2 * Math.PI * r;
  const filled = trial.limit > 0 ? Math.min(1, left / trial.limit) * c : 0;
  const over = left === 0;
  return (
    <button
      aria-label={`${left} of ${trial.limit} free AI replies left`}
      className="chat-trial-chip"
      data-over={over || undefined}
      onClick={openUsageModal}
      title={`${left} of ${trial.limit} free AI replies left — open Usage`}
      type="button"
    >
      <span className="chat-trial-chip-ring">
        <svg aria-hidden="true" height="38" viewBox="0 0 38 38" width="38">
          <defs>
            <pattern height="4" id={hatch} patternTransform="rotate(45)" patternUnits="userSpaceOnUse" width="4">
              <line stroke="currentColor" strokeWidth="1.6" x1="0" x2="0" y1="0" y2="4" />
            </pattern>
          </defs>
          <circle cx="19" cy="19" fill="none" r={r} stroke={`url(#${hatch})`} strokeWidth="5" />
          {filled > 0 ? (
            <circle
              className="chat-trial-chip-fill"
              cx="19"
              cy="19"
              fill="none"
              r={r}
              strokeDasharray={`${filled} ${c}`}
              strokeWidth="5"
              transform="rotate(-90 19 19)"
            />
          ) : null}
        </svg>
        <span className="chat-trial-chip-value">{left}</span>
      </span>
      <span className="chat-trial-chip-text">
        <strong>{left} left</strong>
        <span>of {trial.limit} replies</span>
      </span>
    </button>
  );
}

// Pressing Activate on an agent whose account is out of free replies sends
// this event, which reopens the modal.
const TRIAL_LIMIT_EVENT = "wapzen:trial-limit";

function trialOver(agent: ApiChatAgent) {
  return Boolean(agent.free_trial_ended || (agent.free_trial && agent.free_trial.used >= agent.free_trial.limit));
}

function FreeTrialLimitModal({ limit }: { limit?: number }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener(TRIAL_LIMIT_EVENT, reopen);
    return () => window.removeEventListener(TRIAL_LIMIT_EVENT, reopen);
  }, []);
  if (!open) return null;
  return (
    <div
      className="chat-confirm-overlay"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div
        aria-describedby="chat-trial-limit-copy"
        aria-labelledby="chat-trial-limit-title"
        aria-modal="true"
        className="chat-confirm chat-trial-modal"
        role="dialog"
      >
        <div className="chat-confirm-icon">!</div>
        <h2 className="chat-confirm-title" id="chat-trial-limit-title">
          You have reached your limit
        </h2>
        <p className="chat-confirm-copy" id="chat-trial-limit-copy">
          You have used all {limit ? `${limit} ` : ""}free AI replies, so your AI agent is turned off. To keep it
          running, get a <strong>paid plan</strong>.
        </p>
        <div className="chat-trial-plan">
          <div className="chat-trial-plan-price">
            <span className="chat-trial-plan-amount">$10</span>
            <span className="chat-trial-plan-per">per month, per agent</span>
          </div>
          <ul className="chat-trial-plan-list">
            <li><strong>Unlimited AI replies</strong> on WhatsApp</li>
            <li><strong>Custom features</strong> built on request for you</li>
            <li><strong>Advanced AI model</strong> for smarter replies</li>
            <li>Your agent stays on 24/7 and never turns off</li>
            <li>Knowledge Base, Tools and order taking</li>
            <li>Images, files, voice notes and photos</li>
            <li>Replies in WhatsApp groups</li>
            <li>Human intervention when a customer needs a person</li>
            <li>Help from our team on WhatsApp</li>
          </ul>
        </div>
        <div className="chat-trial-note">
          <span aria-hidden="true" className="chat-trial-note-icon">i</span>
          <p>
            <strong>A note from the Wapzen team:</strong> our Stripe business verification is still in progress, so we
            could not add our pricing to the Wapzen website yet. That is why the free limit is shown here in your
            dashboard. We are really sorry for the inconvenience. As soon as Stripe verification is complete, we will
            publish our pricing on the Wapzen website.
          </p>
        </div>
        <p className="chat-confirm-copy">
          Message us on WhatsApp at <strong className="notranslate">+880 1701-750469</strong>&nbsp;and we&apos;ll set
          it up for you.
        </p>
        <div className="chat-confirm-actions">
          <button className="chat-btn chat-btn-secondary" onClick={() => setOpen(false)} type="button">
            Not now
          </button>
          <a
            autoFocus
            className="chat-btn chat-upgrade-whatsapp"
            href={FREE_TRIAL_WHATSAPP_URL}
            onClick={() => setOpen(false)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <WhatsAppGlyph size={16} />
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// PromptCounter counts code points, as the servers do, so an emoji is one
// character here and there. It warns from 90% and turns red past the cap,
// which only a prompt saved before the cap existed can be.
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
function formatQrCountdown(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// The QR-first way to link a number: the code on the left with when it next
// reloads, the steps beside it (under it where the pane is narrow), and a link
// to the pairing-code form instead.
function QrConnectView({
  isStarting,
  login,
  onConnectSentence,
  onRestart,
  onUseCode,
}: {
  isStarting: boolean;
  login: ApiPhoneNumber | null;
  onConnectSentence: string;
  onRestart: () => void;
  onUseCode: () => void;
}) {
  const isPending = login?.status === "pending_qr";
  const qrCode = isPending ? login?.qr_code ?? null : null;
  const qrExpiresIn = qrCode ? login?.qr_expires_in_ms ?? null : null;
  const [qrLeft, setQrLeft] = useState<number | null>(null);

  // Every poll brings a fresh reading of the code's remaining life, so the
  // countdown is re-anchored to it rather than drifting.
  useEffect(() => {
    if (qrExpiresIn === null) return;
    const deadline = Date.now() + qrExpiresIn;
    const tick = () => setQrLeft(Math.max(0, deadline - Date.now()));
    const interval = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(interval);
  }, [qrCode, qrExpiresIn]);

  const stopped = Boolean(login) && !isPending && !isStarting;
  const timer = isStarting
    ? "Getting a QR code…"
    : qrCode && qrExpiresIn !== null && qrLeft !== null
      ? qrLeft > 0
        ? `QR code will reload in ${formatQrCountdown(qrLeft)}`
        : "Loading a new QR code…"
      : isPending
        ? "Generating QR code…"
        : login
          ? `This QR code ${phoneStatusLabels[login.status].toLowerCase()}.`
          : "Getting a QR code…";

  return (
    <div className="chat-qr-connect">
      <div className="chat-qr-connect-code">
        <div className="chat-qr-connect-timer" role="timer">{timer}</div>
        <div className="chat-qr-frame">
          {qrCode ? (
            <Image
              alt="WhatsApp login QR code"
              className="chat-qr-image"
              height={240}
              src={qrCode}
              unoptimized
              width={240}
            />
          ) : (
            <div className="chat-qr-placeholder">
              <Icon name="qr" size={22} />
              <span>{stopped ? "Get a new QR code to scan" : "The QR code appears here in a moment"}</span>
            </div>
          )}
        </div>
        {stopped ? (
          <button className="chat-btn chat-btn-primary chat-btn-sm" onClick={onRestart} type="button">
            <Icon name="refresh" size={15} stroke="var(--app-on-accent)" sw={2.2} />
            New QR code
          </button>
        ) : null}
        <button className="chat-qr-connect-alt" onClick={onUseCode} type="button">
          Link with phone number
        </button>
      </div>
      <div className="chat-qr-connect-help">
        <div className="chat-qr-connect-title">Please scan the QR code</div>
        <ol className="chat-qr-connect-steps">
          <li>
            Open <b>WhatsApp</b> on your phone
          </li>
          <li>
            Tap <b>Menu</b> or <b>Settings</b> and select <b>Linked devices</b>
          </li>
          <li>
            Tap <b>Link a device</b>
          </li>
          <li>
            Point your phone at this screen to read the <b>QR code</b>
          </li>
        </ol>
        <p className="chat-qr-connect-note">{onConnectSentence} — keep this page open.</p>
      </div>
    </div>
  );
}

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
  // A screen that can be scanned (desktop, tablet) leads with the QR code,
  // already on screen, and "Link with phone number" swaps in the pairing-code
  // form. A phone can't scan its own screen, so it keeps the code form first
  // with the QR already showing under it (for scanning from a second phone).
  const isPhone = useIsPhone();
  const [codeChosen, setCodeChosen] = useState(false);
  const showQrView = !isPhone && !codeChosen && !showsCode;
  // Only the phone layout shows the QR inside the code form — always, until a
  // pairing code takes its place.
  const offersQr = isPhone && !showsCode;
  const autoStartsLogin = showQrView || offersQr;

  // The QR view starts its login itself, once per time it is shown. Asking for
  // a code creates no phone number until it is scanned, and the server hands
  // back a login already running rather than opening another. From then on
  // the page reissues the code as it runs out. A failed start is not retried
  // here; the "New QR code" button is.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!autoStartsLogin) {
      autoStarted.current = false;
      return;
    }
    if (autoStarted.current || login || isStarting || error) return;
    autoStarted.current = true;
    onStartLogin();
  }, [autoStartsLogin, error, isStarting, login, onStartLogin]);
  const onConnect = forNewAgent
    ? "your agent is ready the moment it connects"
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
            <SetupVideoButton />
            <SetupVideoButton vertical />
          </div>

          {showQrView ? (
            <QrConnectView
              isStarting={isStarting}
              login={login}
              onConnectSentence={onConnectSentence}
              onRestart={onStartLogin}
              onUseCode={() => setCodeChosen(true)}
            />
          ) : (
          <>
          <WhatsAppLinkHelp
            disabled={isStarting}
            login={login}
            onRequestCode={onRequestCode}
            onRequestQr={async () => {
              await onRequestQr();
              setCodeChosen(false);
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

          {showsCode || offersQr ? null : (
            <div className="chat-qr-reveal">
              <span className="chat-qr-reveal-or">or</span>
              <button
                className="chat-btn chat-btn-secondary"
                disabled={isStarting}
                onClick={() => {
                  // On a desktop this is the way back to the QR view.
                  setCodeChosen(false);
                  if (!isPending) onStartLogin();
                }}
                type="button"
              >
                <Icon name="qr" size={15} sw={2.2} />
                Scan QR code
              </button>
            </div>
          )}

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
          {showsCode || !offersQr ? null : isPending || isStarting ? null : (
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
          </>
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
                    <span className="chat-number-end">
                      <span className={`chat-number-hint${number.disabled ? " is-blocked" : ""}`}>
                        {number.hint}
                      </span>
                      {/* The whole row is the button; this shows where to press. */}
                      {number.disabled ? null : (
                        <span aria-hidden="true" className="chat-number-use">
                          Use
                        </span>
                      )}
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
                <OrderAlertField agent={agent} onPatch={onPatch} />
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
                <OrderAlertField agent={agent} onPatch={onPatch} />
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

          {agent.behavior ? (
            <ConfigSection
              icon="spark"
              id="behavior"
              isOpen={openSection === "behavior"}
              meta={agent.behavior.short_replies ? "Short replies" : "Normal"}
              onToggle={setOpenSection}
              title="Agent Behavior"
            >
              <div className="chat-media-settings">
                <MediaToggle
                  hint="On: the agent answers in a line or two, like a person texting. Off: it writes as much as it thinks the question needs."
                  label="Reply short and concise"
                  on={agent.behavior.short_replies}
                  onToggle={() =>
                    onPatch((current) => ({
                      ...current,
                      behavior: { short_replies: !(current.behavior?.short_replies ?? true) },
                    }))
                  }
                />
              </div>
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

// Images & Files on its own card under the prompt, closed until opened. The
// section renders nothing on a server without the feature, and the css then hides
// the empty card.
// Its on/off switch saves with the agent; the files themselves save at once.
function FilesCard({
  agent,
  isOpen,
  onOpenChange,
  onPatch,
}: {
  agent: ApiChatAgent;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
}) {
  // Undefined on a server without the switch: no switch is shown, files on.
  const enabled = agent.files?.files_enabled;
  return (
    <div className="chat-card chat-files-card is-rail">
      <AgentFilesSection
        agentId={agent.id}
        enabled={enabled}
        isOpen={isOpen}
        onEnabledChange={(next) =>
          onPatch((current) => ({ ...current, files: { ...current.files, files_enabled: next } }))
        }
        onToggle={(next) => onOpenChange(next !== null)}
      />
    </div>
  );
}

// Whether what the owner typed is an address the server will read, by the same
// rule: "shop.com" counts as https://shop.com, and a bare word doesn't count.
function isWebsiteAddress(typed: string) {
  const value = typed.trim();
  if (!value) return false;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".") && !url.username;
  } catch {
    return false;
  }
}

// Web Search on its own card under Images & Files: the owner's website, which
// the agent reads while it replies. Saved with the agent like the other
// settings. Only shown when the server returns the section, since older servers
// refuse it.
function WebsiteCard({
  agent,
  onPatch,
}: {
  agent: ApiChatAgent;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
}) {
  // Starts open on desktop, where the cards sit side by side, and closed on
  // phones; the header still says whether it is on. null = not touched yet.
  const isDesktop = useIsDesktop();
  const [openChoice, setIsOpen] = useState<boolean | null>(null);
  const isOpen = openChoice ?? isDesktop;
  const website = agent.website;
  if (!website) return null;

  const typed = website.website_url;
  const valid = isWebsiteAddress(typed);
  const reading = website.website_enabled && valid;
  const setWebsite = (change: Partial<ChatWebsiteSection>) =>
    onPatch((current) => ({
      ...current,
      website: {
        website_enabled: current.website?.website_enabled ?? false,
        website_url: current.website?.website_url ?? "",
        ...change,
      },
    }));

  let hint: string;
  if (typed.trim() && !valid) hint = "This isn't a website address yet. Use one like https://yourshop.com.";
  else if (!website.website_enabled) hint = "Off: the agent doesn't read your website.";
  else if (!valid) hint = "Add your website's address so the agent has something to read.";
  else
    hint =
      "The agent reads your home page with each reply and opens your other pages when a customer asks about something on them. Only this site is read. Pages drawn only by JavaScript can't be read.";

  return (
    <div className="chat-card chat-files-card is-rail">
      <ConfigSection
        icon="globe"
        id="website"
        isOpen={isOpen}
        meta={reading ? "On" : "Off"}
        onToggle={(next) => setIsOpen(next !== null)}
        title="Web Search"
      >
        <div className="chat-website">
          <MediaToggle
            hint={hint}
            label="Web Search"
            on={website.website_enabled}
            onToggle={() => setWebsite({ website_enabled: !website.website_enabled })}
          />
          <label className="chat-field">
            <span className="chat-control-label">Website address</span>
            <input
              autoComplete="url"
              className="chat-input"
              inputMode="url"
              maxLength={500}
              onChange={(event) => setWebsite({ website_url: event.target.value })}
              placeholder="https://yourshop.com"
              spellCheck={false}
              type="url"
              value={typed}
            />
          </label>
        </div>
      </ConfigSection>
    </div>
  );
}

// Human Intervention on its own card, first under the prompt: when a chat matches the
// description, the agent calls a person in. Its own switch turns it on and off.
// The WhatsApp number is optional and saved only once WhatsApp says it has an
// account (HumanAlertNumberField); without one, the chat is just flagged red and
// the AI turned off for that customer. Only shown when the server returns the
// section.
function HumanInterventionCard({
  agent,
  onPatch,
}: {
  agent: ApiChatAgent;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
}) {
  // Starts open on desktop, where it is the first card under the prompt, and
  // closed on phones like every other card. null = not touched yet, so the
  // default follows the screen (useIsDesktop is false until hydrated).
  const isDesktop = useIsDesktop();
  const [openChoice, setIsOpen] = useState<boolean | null>(null);
  const isOpen = openChoice ?? isDesktop;
  const human = agent.human_intervention;
  if (!human) return null;

  // Older servers had no switch: there it was on whenever it was filled in.
  const enabled = human.human_intervention_enabled ?? true;
  const description = human.human_intervention_description;
  const phone = human.human_intervention_phone;
  const pauseAi = human.human_intervention_pause_ai;
  const doesSomething = phone.trim() !== "" || pauseAi === true;
  const on = enabled && description.trim() !== "" && doesSomething;
  const setHuman = (change: Partial<ChatHumanInterventionSection>) =>
    onPatch((current) => ({
      ...current,
      human_intervention: {
        human_intervention_description: current.human_intervention?.human_intervention_description ?? "",
        human_intervention_phone: current.human_intervention?.human_intervention_phone ?? "",
        // Sent back only when the server reported them; older ones refuse them.
        ...(current.human_intervention?.human_intervention_enabled !== undefined
          ? { human_intervention_enabled: current.human_intervention.human_intervention_enabled }
          : {}),
        ...(current.human_intervention?.human_intervention_pause_ai !== undefined
          ? { human_intervention_pause_ai: current.human_intervention.human_intervention_pause_ai }
          : {}),
        ...change,
      },
    }));

  let hint: string;
  if (!enabled) hint = "Off: the agent never calls a person in.";
  else if (!description.trim()) hint = "Describe below when a person should step in, or nothing will happen.";
  else if (!doesSomething)
    hint = "No one will be told: add a WhatsApp number, or turn on the switch at the bottom so the chat is flagged red.";
  else hint = "On: when a chat matches what you describe, the agent calls a person in.";

  return (
    <div className="chat-card chat-files-card is-rail">
      <ConfigSection
        icon="person"
        id="human-intervention"
        isOpen={isOpen}
        meta={on ? "On" : "Off"}
        onToggle={(next) => setIsOpen(next !== null)}
        title="Human Intervention"
      >
        <div className="chat-website">
          {human.human_intervention_enabled !== undefined ? (
            <MediaToggle
              hint={hint}
              label="Human intervention"
              on={enabled}
              onToggle={() => setHuman({ human_intervention_enabled: !enabled })}
            />
          ) : null}
          <label className="chat-field">
            <span className="chat-control-label">When should a person step in?</span>
            <textarea
              className="chat-textarea"
              disabled={!enabled}
              maxLength={1000}
              onChange={(event) => setHuman({ human_intervention_description: event.target.value })}
              placeholder="e.g. The customer is angry, asks for a refund, or wants to talk to a person."
              style={{ minHeight: 88 }}
              value={description}
            />
          </label>
          <HumanAlertNumberField agent={agent} disabled={!enabled} onPatch={onPatch} />
          {pauseAi !== undefined ? (
            <MediaToggle
              disabled={!enabled}
              hint={
                pauseAi
                  ? "When a person is called, the AI stops replying to that customer and the chat turns red on Conversations (Human needed) until you turn the AI back on for them."
                  : "The AI keeps replying to that customer after a person is called, and the chat isn't flagged."
              }
              label="Turn the AI off for that customer after calling a person"
              on={pauseAi}
              onToggle={() => setHuman({ human_intervention_pause_ai: !pauseAi })}
            />
          ) : null}
        </div>
      </ConfigSection>
    </div>
  );
}

// The optional number told when the agent calls a person in. Like the
// order-alert number, it's saved on its own, not with the agent's autosave:
// the server asks WhatsApp whether it has an account first and refuses it if
// not, so it is added with a button and shows the checked E.164 form once saved.
function HumanAlertNumberField({
  agent,
  disabled,
  onPatch,
}: {
  agent: ApiChatAgent;
  disabled: boolean;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
}) {
  const { getToken } = useAuth();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // The check takes a moment, so its answer goes through the newest onPatch:
  // edits made meanwhile elsewhere in the panel are kept.
  const onPatchRef = useRef(onPatch);
  useEffect(() => {
    onPatchRef.current = onPatch;
  });

  const saved = agent.human_intervention?.human_intervention_phone ?? "";
  const hasNumber = Boolean(agent.agent.phone_number_id);
  const fieldId = `human-alert-${agent.id}`;

  const save = async (value: string) => {
    setBusy(true);
    setError("");
    try {
      const updated = await updateDashboardChatAgent(
        agent.id,
        { human_intervention: { human_intervention_phone: value } },
        getToken
      );
      const phone = updated.human_intervention?.human_intervention_phone ?? "";
      onPatchRef.current((current) => ({
        ...current,
        human_intervention: current.human_intervention
          ? { ...current.human_intervention, human_intervention_phone: phone }
          : current.human_intervention,
      }));
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this number. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const add = () => {
    const value = draft.trim();
    if (!value || busy) return;
    if (phoneLooksWrong(value)) {
      setError("That isn't a valid phone number. Use digits with the country code, like +8801712345678.");
      return;
    }
    void save(value);
  };

  const message = error ? (
    <span className="chat-file-error" role="alert">
      {error}
    </span>
  ) : (
    <span className="chat-field-hint">
      {saved.trim()
        ? "When a person is needed, this number gets a WhatsApp message from this agent's number: who the customer is, what they need and a link to their chat. One per chat every 30 minutes."
        : hasNumber
          ? "Optional. The number is checked with WhatsApp before it's added. Without one, no message is sent."
          : "Optional. Link a WhatsApp number to this agent first: the message is sent from it."}
    </span>
  );

  if (saved.trim()) {
    return (
      <div className="chat-field">
        <span className="chat-control-label">WhatsApp number to tell (optional)</span>
        <div className="chat-alert-row">
          <span className="chat-input chat-alert-saved" title={saved}>
            {saved}
          </span>
          <button
            className="chat-btn chat-btn-secondary chat-btn-sm"
            disabled={busy}
            onClick={() => void save("")}
            type="button"
          >
            {busy ? "Removing…" : "Remove"}
          </button>
        </div>
        {message}
      </div>
    );
  }

  return (
    <div className="chat-field">
      <label className="chat-control-label" htmlFor={fieldId}>
        WhatsApp number to tell (optional)
      </label>
      <form
        className="chat-alert-row"
        onSubmit={(event) => {
          event.preventDefault();
          add();
        }}
      >
        <input
          aria-invalid={error ? true : undefined}
          autoComplete="tel"
          className="chat-input"
          disabled={disabled || busy || !hasNumber}
          id={fieldId}
          inputMode="tel"
          maxLength={40}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) setError("");
          }}
          placeholder="+8801712345678"
          spellCheck={false}
          type="tel"
          value={draft}
        />
        <button
          className="chat-btn chat-btn-primary chat-btn-sm"
          disabled={disabled || busy || !hasNumber || !draft.trim()}
          type="submit"
        >
          {busy ? "Checking…" : "Add"}
        </button>
      </form>
      {message}
    </div>
  );
}

// Whether a typed number can't be one: something other than digits, spaces and
// ()+.-/, or too few or too many digits. Blank isn't wrong, just empty.
function phoneLooksWrong(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return phone.trim() !== "" && (/[^\d\s()+.\-/]/.test(phone) || digits.length < 7 || digits.length > 15);
}

// The images and documents the agent can send, each with a note saying when.
// Unlike the rest of the panel these save straight away, not with the agent.
function AgentFilesSection({
  agentId,
  enabled,
  isOpen,
  onEnabledChange,
  onToggle,
}: {
  agentId: string;
  // The Images & Files switch; undefined when the server has none.
  enabled?: boolean;
  isOpen: boolean;
  onEnabledChange: (enabled: boolean) => void;
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
  }, [agentId, getToken]);

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
      meta={
        enabled === false ? "Off" : files === null ? "" : files.length ? `${files.length} uploaded` : "None"
      }
      onToggle={onToggle}
      title="Images & Files"
    >
      <div className="chat-files">
        {enabled !== undefined ? (
          <MediaToggle
            hint={
              enabled
                ? "On: the agent sends a file when the chat matches its note."
                : "Off: the agent sends none of these files. They stay uploaded for when you turn it back on."
            }
            label="Images & Files"
            on={enabled}
            onToggle={() => onEnabledChange(!enabled)}
          />
        ) : null}
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

// Optional: a WhatsApp number told about every order the agent places or
// changes, sent from the agent's own number. Only offered by a server that
// reports the field. Not autosaved like the rest of the panel: Add sends the
// number on its own, the server asks WhatsApp whether it has an account and
// refuses it if not, so only a number that can get the alerts is ever saved.
function OrderAlertField({
  agent,
  onPatch,
}: {
  agent: ApiChatAgent;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
}) {
  const { getToken } = useAuth();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // onPatch applies to the agent as it was when it was handed down, so the
  // answer of a check that took a moment goes through the newest one: edits
  // made meanwhile elsewhere in the panel are kept.
  const onPatchRef = useRef(onPatch);
  useEffect(() => {
    onPatchRef.current = onPatch;
  });

  const saved = agent.order?.order_notify_phone;
  if (saved === undefined) return null;
  const hasNumber = Boolean(agent.agent.phone_number_id);

  const save = async (value: string) => {
    setBusy(true);
    setError("");
    try {
      const updated = await updateDashboardChatAgent(
        agent.id,
        { order: { order_notify_phone: value } },
        getToken
      );
      const phone = updated.order?.order_notify_phone ?? "";
      onPatchRef.current((current) => ({
        ...current,
        order: { ...current.order, order_notify_phone: phone },
      }));
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this number. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const add = () => {
    const value = draft.trim();
    if (!value || busy) return;
    if (phoneLooksWrong(value)) {
      setError("That isn't a valid phone number. Use digits with the country code, like +8801712345678.");
      return;
    }
    void save(value);
  };

  if (saved.trim()) {
    return (
      <div className="chat-field">
        <span className="chat-control-label">Order alerts on WhatsApp (optional)</span>
        <div className="chat-alert-row">
          <span className="chat-input chat-alert-saved" title={saved}>
            {saved}
          </span>
          <button
            className="chat-btn chat-btn-secondary chat-btn-sm"
            disabled={busy}
            onClick={() => void save("")}
            type="button"
          >
            {busy ? "Removing…" : "Remove"}
          </button>
        </div>
        {error ? (
          <span className="chat-file-error" role="alert">
            {error}
          </span>
        ) : (
          <span className="chat-field-hint">
            Every new or changed order is sent to this number on WhatsApp, from this agent&apos;s number.
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="chat-field">
      <label className="chat-control-label" htmlFor={`order-alert-${agent.id}`}>
        Order alerts on WhatsApp (optional)
      </label>
      <form
        className="chat-alert-row"
        onSubmit={(event) => {
          event.preventDefault();
          add();
        }}
      >
        <input
          aria-invalid={error ? true : undefined}
          autoComplete="tel"
          className="chat-input"
          disabled={busy || !hasNumber}
          id={`order-alert-${agent.id}`}
          inputMode="tel"
          maxLength={40}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) setError("");
          }}
          placeholder="+8801712345678"
          spellCheck={false}
          type="tel"
          value={draft}
        />
        <button
          className="chat-btn chat-btn-primary chat-btn-sm"
          disabled={busy || !hasNumber || !draft.trim()}
          type="submit"
        >
          {busy ? "Checking…" : "Add"}
        </button>
      </form>
      {error ? (
        <span className="chat-file-error" role="alert">
          {error}
        </span>
      ) : (
        <span className="chat-field-hint">
          {!hasNumber
            ? "Link a WhatsApp number to this agent first: order alerts are sent from it."
            : busy
              ? "Checking this number with WhatsApp…"
              : "Add a WhatsApp number to get each new or changed order there too, sent from this agent's number. It's checked with WhatsApp before it's saved."}
        </span>
      )}
    </div>
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

function StatusPill({ agent }: { agent: ApiChatAgent }) {
  const limit = useHourlyLimit(agent);
  // Live means it can reply: switched on, holding a number, and not resting
  // on the hourly limit.
  const live = agent.agent.status === "active" && Boolean(agent.agent.phone_number_id) && !limit;
  return (
    <span className={`chat-pill ${live ? "is-active" : "is-inactive"}`}>
      <span className="chat-dot" />
      {live ? "Live" : "Paused"}
      {limit ? <span className="chat-pill-timer">{limit.countdown}</span> : null}
    </span>
  );
}
