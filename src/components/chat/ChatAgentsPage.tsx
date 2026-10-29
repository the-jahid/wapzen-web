"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth, useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import ExpandableCardDemoStandard from "@/components/expandable-card-demo-standard";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { SUPPORT_WHATSAPP_URL, WhatsAppGlyph } from "@/components/nav/supportWhatsApp";
import ChatConversationsWorkspace from "@/components/chat/ChatConversationsWorkspace";
import { listKnowledgeBases as apiListKnowledgeBases, type ApiKnowledgeBase } from "@/lib/knowledgeBases";
import {
  getPhoneNumber as apiGetPhoneNumber,
  listPhoneNumbers as apiListPhoneNumbers,
  restartPhoneNumberLogin as apiRestartPhoneNumberLogin,
  startPhoneNumberCodeLogin as apiStartPhoneNumberCodeLogin,
  startPhoneNumberLogin as apiStartPhoneNumberLogin,
  PhoneNumberError,
  type ApiPhoneNumber,
  type PhoneNumberStatus,
} from "@/lib/phoneNumbers";
import { WhatsAppLinkHelp } from "@/components/phone-numbers/WhatsAppLinkHelp";
import { listTools as apiListTools, type ApiTool } from "@/lib/tools";
import { useCachedState } from "@/lib/pageCache";
import {
  chatAgentDefaults,
  createDashboardChatAgent,
  deleteDashboardChatAgent,
  getDashboardChatAgent,
  listDashboardChatAgents,
  updateDashboardChatAgent,
  type ApiChatAgent,
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
  | "plus"
  | "trash"
  | "search"
  | "refresh"
  | "chevron"
  | "check"
  | "menu"
  | "x";

// The collapsible parts of the configuration panel, one per section of the
// chat-agent contract.
type ConfigSectionId = "knowledge-base" | "tools";

// The editor's two tabs. "agent" is everything that configures the agent;
// "conversation" is the record of what it has already said.
type EditorTab = "agent" | "conversation";

const editorTabs: { id: EditorTab; label: string }[] = [
  { id: "agent", label: "Agent" },
  { id: "conversation", label: "Conversation" },
];


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
.expandable-card-backdrop { background: var(--app-overlay); inset: 0; position: fixed; z-index: 80; }
.expandable-card-stage { align-items: center; display: flex; inset: 0; justify-content: center; padding: 24px; pointer-events: none; position: fixed; z-index: 90; }
.expandable-card-panel { pointer-events: auto; }
.chat-agent-expandable {
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  box-shadow: 0 30px 90px var(--app-shadow-color), 0 0 0 1px var(--app-primary-ring);
  height: min(820px, calc(100vh - 48px));
  max-width: 1180px;
  overflow: hidden;
  width: 100%;
}
.chat-agent-expanded-shell { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.chat-agent-expanded-topline {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 14px;
  padding: 14px 16px;
}
.chat-agent-expanded-topline > .chat-detail-head { flex: 1 1 auto; min-width: 0; }
.chat-agent-expanded-close { flex: 0 0 auto; }
.chat-agent-expanded-close {
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
.chat-agent-expanded-close:hover { background: var(--panel-hover); color: var(--text); }
.chat-agent-expanded-grid {
  display: grid;
  flex: 1 1 auto;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 370px);
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
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.chat-list-row:hover { background: var(--panel-hover); border-color: var(--app-primary-ring); box-shadow: 0 6px 18px var(--app-shadow-soft); }
.chat-list-row:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.chat-list-row.is-active { background: var(--primary-soft); border-color: var(--app-primary-border); }
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
.chat-card-head { align-items: center; display: flex; gap: 12px; justify-content: space-between; margin-bottom: 12px; }
.chat-card-title { font-size: 13.5px; font-weight: 850; letter-spacing: -.1px; margin: 0; }
.chat-mini-select { height: 34px; max-width: 210px; width: auto; }
.chat-helper-line { color: var(--subtle); font-size: 12px; margin-top: 9px; }
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
.chat-config-panel { min-height: 0; }
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
.chat-number-empty { color: var(--subtle); font-size: 12px; line-height: 1.55; }
.chat-number-empty a { color: var(--primary-light); font-weight: 700; }
/* The top bar and drawer backdrop only exist below the tablet breakpoint. */
/* Large desktops: the list is capped at 1320px, so give the wide screen a
   little more breathing room rather than stretching the rows. */
@media (min-width: 1680px) {
  .chat-content { padding: 28px 40px; }
}
/* Laptops: fold the resource counts under the model so nothing truncates. */
@media (max-width: 1280px) {
  .chat-agent-expanded-grid { grid-template-columns: minmax(0, 1fr) minmax(300px, 340px); }
}
/* Small laptops / landscape tablets: a slimmer sidebar keeps the list usable. */
@media (max-width: 1100px) {
  .chat-content { padding: 18px 20px; }
  .chat-agent-expandable { height: min(820px, calc(100dvh - 32px)); }
  .expandable-card-stage { padding: 16px; }
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
  .chat-agent-expanded-grid { grid-template-columns: minmax(0, 1fr); overflow: auto; }
  .chat-agent-expanded-grid > .chat-editor { overflow: visible; padding-right: 0; }
  .chat-agent-expanded-grid > .chat-config-panel { overflow: visible; }
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
  .expandable-card-stage { align-items: stretch; padding: 0; }
  .chat-agent-expandable { border: 0; border-radius: 0; height: 100dvh; max-width: none; }
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

// The create modal only asks for a name and a number; the rest of the form keeps
// the defaults a new agent is created with, and is edited in the editor afterwards.
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
      status: chatAgentDefaults.status,
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
  };
}

export default function ChatAgentsPage() {
  const { user, isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn: isAuthSignedIn } = useAuth();

  const [chatAgents, setChatAgents, hasCachedAgents] = useCachedState<ApiChatAgent[]>("chat-agents", []);
  // True until the first agent fetch settles, so an empty list is only called
  // empty once the server has actually said so.
  const [isLoading, setIsLoading] = useState(true);
  // A list cached from an earlier visit is shown at once while it refetches;
  // only a first-ever load waits behind the skeleton.
  const showSkeleton = isLoading && !hasCachedAgents;
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [knowledgeBases, setKnowledgeBases] = useCachedState<ApiKnowledgeBase[]>("knowledge-bases", []);
  const [tools, setTools] = useCachedState<ApiTool[]>("tools", []);
  const [phoneNumbers, setPhoneNumbers] = useCachedState<ApiPhoneNumber[]>("phone-numbers", []);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [createForm, setCreateForm] = useState<CreateForm | null>(null);
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  // The delete button only asks; the agent goes once the modal is confirmed.
  const [confirmingDelete, setConfirmingDelete] = useState(false);
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
  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
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

  const isAuthenticated = Boolean(
    isUserLoaded && isAuthLoaded && isUserSignedIn && isAuthSignedIn && user
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    const pendingSaves = saveTimers.current;
    // Each list lands on its own, so the agent list is not held back by the
    // slowest of the lookups the editor needs.
    listDashboardChatAgents(getToken)
      .then((agents) => {
        if (!cancelled) setChatAgents(agents);
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
      for (const timer of pendingSaves.values()) clearTimeout(timer);
      pendingSaves.clear();
    };
  }, [getToken, isAuthenticated, setChatAgents, setKnowledgeBases, setPhoneNumbers, setTools]);

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
          current.map((item) => (item.id === fresh.id ? { ...item, runtime: fresh.runtime } : item))
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
      if (previous) clearTimeout(previous);
      const revision = editRevisions.current.get(agent.id) ?? 0;
      const timer = setTimeout(async () => {
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
      }, delay);
      saveTimers.current.set(agent.id, timer);
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
        agent: { ...target.agent, phone_number_id: phoneNumberId },
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
        setNumberLogin((current) => (current && current.id === updated.id ? updated : current));
        setPhoneNumbers((current) => upsertPhoneNumber(current, updated));
        if (updated.status === "connected") {
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
    const interval = window.setInterval(poll, 2000);
    poll();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [assignNumber, getToken, numberLoginId, numberLoginStatus, setPhoneNumbers]);

  useEffect(() => {
    scanTargetRef.current = selected && !selected.agent.phone_number_id ? selected.id : "";
  }, [selected]);

  // Puts a scannable QR code on screen. Asking for a code creates nothing: the
  // login only becomes a phone number if someone scans it, and the server hands
  // back the session already running rather than opening a second one, so an
  // editor that opens on every visit leaves no numbers behind.
  const startNumberLogin = useCallback(async () => {
    if (!selected || isStartingLogin) return;
    const spentId = numberLogin && numberLogin.status !== "connected" ? numberLogin.id : null;

    setIsStartingLogin(true);
    setNumberLoginError("");
    try {
      console.log("[wa-login] starting login", { agentId: selected.id, restartId: spentId });
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
  }, [getToken, isStartingLogin, numberLogin, selected]);

  // Swaps the QR login for one linked by a typed pairing code. The server ends
  // the QR login, and the poll picks up the new one by its id. Throws for
  // WhatsAppLinkHelp to show the message.
  const startNumberCodeLogin = useCallback(
    async (phone: string) => {
      setNumberLoginError("");
      const started = await apiStartPhoneNumberCodeLogin({ phone_number: phone }, getToken);
      setNumberLogin(started);
    },
    [getToken]
  );

  // A chat agent with no number gets its QR code without being asked: opening
  // the editor starts the login, and a session that runs out of codes is
  // reissued, so what is on screen is always a scannable code.
  //
  // WhatsApp owns the rotation itself — it hands the session a series of codes
  // (roughly one a minute, then one every 20s) which the server stores as they
  // arrive and the poll above picks up. This only has to keep a live session
  // there to receive them.
  useEffect(() => {
    if (!isAuthenticated || !selected || selected.agent.phone_number_id || isStartingLogin) return;

    // A live session already has a code on screen, and it serves this agent as
    // readily as the one it was started from: the scan is assigned to whichever
    // number-less agent is selected when it lands.
    const status = numberLogin?.status;
    if (status === "pending_qr") return;

    const key = `${selected.id}:${numberLogin?.id ?? "none"}:${status ?? "none"}`;
    if (autoLoginKey.current === key) return;

    if (autoLoginRuns.current.agentId !== selected.id) {
      autoLoginRuns.current = { agentId: selected.id, count: 0 };
    }
    // An editor left open all day stops reissuing eventually; the button is
    // still there for whoever comes back to it.
    if (autoLoginRuns.current.count >= maxAutoLogins) return;
    autoLoginRuns.current.count += 1;

    autoLoginKey.current = key;
    void startNumberLogin();
  }, [isAuthenticated, isStartingLogin, numberLogin, selected, startNumberLogin]);

  // The pick-a-number half of the setup card. A number another chat agent
  // already holds stays listed, but says who holds it and cannot be picked —
  // two agents replying on one number is ambiguous.
  const assignableNumbers = useMemo<AssignableNumber[]>(() => {
    if (!selected) return [];
    return phoneNumbers
      .filter((pn) => pn.status === "connected")
      .map((pn) => {
        const holder = chatAgents.find(
          (agent) => agent.id !== selected.id && agent.agent.phone_number_id === pn.id
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
    setCreateError("");
    setCreateForm(newCreateForm(chatAgents.length + 1));
  }, [chatAgents.length]);

  const closeCreateModal = useCallback(() => {
    setCreateForm(null);
    setCreateError("");
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
      setSelectedId(created.id);
      setCreateForm(null);
      setNotice({ kind: "success", text: `Created "${created.agent.name}"` });
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Could not create chat agent");
    } finally {
      setIsCreating(false);
    }
  }, [createForm, getToken, isCreating, setChatAgents]);

  const deleteSelected = useCallback(async () => {
    if (!selected) return;
    const name = selected.agent.name;
    setIsDeleting(true);
    try {
      const timer = saveTimers.current.get(selected.id);
      if (timer) clearTimeout(timer);
      saveTimers.current.delete(selected.id);
      await deleteDashboardChatAgent(selected.id, getToken);
      setChatAgents((current) => current.filter((agent) => agent.id !== selected.id));
      setSelectedId("");
      setNotice({ kind: "success", text: `Deleted "${name}"` });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Could not delete chat agent",
      });
    } finally {
      setIsDeleting(false);
      setConfirmingDelete(false);
    }
  }, [getToken, selected, setChatAgents]);

  // Escape dismisses the delete confirmation. It listens in the capture phase
  // and stops the key there, so the expanded agent card behind does not also
  // take it as its cue to close.
  useEffect(() => {
    if (!confirmingDelete) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      if (!isDeleting) setConfirmingDelete(false);
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [confirmingDelete, isDeleting]);

  return (
    <div className="chat-shell app-accent-green">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <DashboardSidebar activeLabel="Chat Agents" stackBelow={900} />

      <main className="chat-main">
        <div className="chat-content">
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
              <div className="chat-panel-body">
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
                ) : filtered.length === 0 ? (
                  <div className="chat-empty-list">
                    {chatAgents.length === 0 ? "No chat agents yet." : "No agent matches that search."}
                  </div>
                ) : (
                  <div className="chat-list">
                    {filtered.map((agent) => {
                      const phone = phoneNumbers.find((item) => item.id === agent.agent.phone_number_id);
                      const knowledgeCount = agent.knowledge_base?.knowledge_base_ids?.length ?? 0;
                      const toolCount = agent.tools?.tool_ids?.length ?? 0;
                      return (
                        <motion.button
                          aria-pressed={agent.id === selected?.id}
                          className={`chat-list-row${agent.id === selected?.id ? " is-active" : ""}`}
                          key={agent.id}
                          layoutId={`chat-agent-${agent.id}`}
                          onClick={() => setSelectedId(agent.id)}
                          type="button"
                        >
                          <span
                            className="chat-avatar"
                            style={{ background: avatarColor(agent.id) }}
                          >
                            {agent.agent.name.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="chat-list-identity">
                            <span className="chat-list-name">{agent.agent.name}</span>
                            <span className="chat-list-phone">
                              {phone ? phoneNumberLabel(phone) : "No phone number"}
                            </span>
                          </span>
                          <span className="chat-list-resources">
                            <span><Icon name="book" size={12} />{knowledgeCount} KB</span>
                            <span><Icon name="wrench" size={12} />{toolCount} tools</span>
                          </span>
                          <StatusPill status={agent.agent.status ?? "inactive"} />
                          <span className="chat-list-chevron">
                            <Icon name="chevron" size={16} sw={2.3} />
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <ExpandableCardDemoStandard
              className="chat-agent-expandable"
              layoutId={`chat-agent-${selected?.id ?? "closed"}`}
              onClose={() => setSelectedId("")}
              open={Boolean(selected)}
            >
              {selected ? (
                <div className="chat-agent-expanded-shell">
                  <AgentHeader
                    agent={selected}
                    onClose={() => setSelectedId("")}
                    onDelete={() => setConfirmingDelete(true)}
                    onPatch={patchSelected}
                  />
                  <div className="chat-agent-expanded-grid">
                    <Editor
                      agent={selected}
                      assignableNumbers={assignableNumbers}
                      isRefreshingNumbers={isRefreshingNumbers}
                      isStartingLogin={isStartingLogin}
                      login={
                        numberLogin && numberLogin.status !== "connected" ? numberLogin : null
                      }
                      loginError={numberLoginError}
                      onPatch={patchSelected}
                      onRefreshNumbers={refreshPhoneNumbers}
                      onRequestCode={startNumberCodeLogin}
                      onStartLogin={startNumberLogin}
                    />
                    <ConfigPanel
                      agent={selected}
                      knowledgeBases={knowledgeBases}
                      onPatch={patchSelected}
                      phoneNumbers={phoneNumbers}
                      tools={tools}
                    />
                  </div>
                </div>
              ) : null}
            </ExpandableCardDemoStandard>
          </section>
        </div>
      </main>

      {confirmingDelete && selected ? (
        <div
          className="chat-confirm-overlay"
          // Outside-click handlers on the expanded card skip anything marked
          // with this, so a click here never closes it.
          data-expandable-card-ignore
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) setConfirmingDelete(false);
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
              <strong>{selected.agent.name}</strong> will be deleted and will stop replying on
              WhatsApp. This cannot be undone.
            </p>
            <div className="chat-confirm-actions">
              <button
                autoFocus
                className="chat-btn chat-btn-secondary"
                disabled={isDeleting}
                onClick={() => setConfirmingDelete(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="chat-btn chat-confirm-danger"
                disabled={isDeleting}
                onClick={() => void deleteSelected()}
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
          error={createError}
          form={createForm}
          isSubmitting={isCreating}
          onCancel={closeCreateModal}
          onCreate={createAgent}
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


// "New chat agent" opens this first, so the agent is named and pointed at a
// number before it exists, rather than appearing as an untitled row that has to
// be corrected in the configuration panel afterwards.
function CreateChatAgentModal({
  error,
  form,
  isSubmitting,
  onCancel,
  onCreate,
  phoneNumbers,
  setForm,
}: {
  error: string;
  form: CreateForm;
  isSubmitting: boolean;
  onCancel: () => void;
  onCreate: () => void;
  phoneNumbers: ApiPhoneNumber[];
  setForm: (update: (current: CreateForm | null) => CreateForm | null) => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);

  function patch(next: Partial<CreateForm>) {
    setForm((current) => (current ? { ...current, ...next } : current));
  }

  useEffect(() => {
    nameRef.current?.focus();
    nameRef.current?.select();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      className="chat-modal-backdrop"
      onMouseDown={(event) => event.currentTarget === event.target && onCancel()}
    >
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
        <div className="chat-modal-head">
          <div>
            <h2 className="chat-modal-title" id="chat-create-title">
              Create chat agent
            </h2>
            <div className="chat-modal-subtitle">
              Name it and choose which number it answers on. The prompt, knowledge bases
              and tools are set in the editor once it exists.
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

        <div className="chat-modal-body">
          {error ? <div className="chat-modal-error">{error}</div> : null}

          <div className="chat-modal-section">
            <h3 className="chat-modal-section-title">Identity</h3>
            <label className="chat-field">
              <span className="chat-control-label">Name</span>
              <input
                className="chat-input"
                onChange={(event) => patch({ name: event.target.value })}
                placeholder="Support assistant"
                ref={nameRef}
                value={form.name}
              />
            </label>
            <label className="chat-field">
              <span className="chat-control-label">Phone number</span>
              <select
                className="chat-select"
                onChange={(event) => patch({ phone_number_id: event.target.value })}
                value={form.phone_number_id}
              >
                <option value="">No number</option>
                {phoneNumbers.map((pn) => (
                  <option key={pn.id} value={pn.id}>
                    {phoneNumberLabel(pn)}
                  </option>
                ))}
              </select>
              {phoneNumbers.length === 0 ? (
                <span className="chat-field-hint">
                  Connect one in <Link href="/dashboard/phone-numbers">Phone Numbers</Link>.
                </span>
              ) : null}
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
    </div>
  );
}

// The middle column, laid out like the voice agents workspace: an identity
// header, then the system prompt that decides what the agent says. A chat agent
// never opens a thread itself, so there is no opening message. Everything else
// is configuration and lives in the panel to the right.
// The expanded card's single top bar: who the agent is, its live switch and
// delete, and the close button — one strip instead of a label bar stacked
// over a separate header card.
function AgentHeader({
  agent,
  onClose,
  onDelete,
  onPatch,
}: {
  agent: ApiChatAgent;
  onClose: () => void;
  onDelete: () => void;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
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
      <button
        aria-label="Close chat agent details"
        className="chat-agent-expanded-close"
        onClick={onClose}
        type="button"
      >
        <Icon name="x" size={16} sw={2.4} />
      </button>
    </div>
  );
}

function Editor({
  agent,
  assignableNumbers,
  isRefreshingNumbers,
  isStartingLogin,
  login,
  loginError,
  onPatch,
  onRefreshNumbers,
  onRequestCode,
  onStartLogin,
}: {
  agent: ApiChatAgent;
  assignableNumbers: AssignableNumber[];
  isRefreshingNumbers: boolean;
  isStartingLogin: boolean;
  login: ApiPhoneNumber | null;
  loginError: string;
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
  onRefreshNumbers: () => void;
  onRequestCode: (phone: string) => Promise<void>;
  onStartLogin: () => void;
}) {
  // Which half of the editor is on screen: the agent's own settings, or the
  // WhatsApp threads it has answered. The choice is kept across agents on
  // purpose — somebody reading conversations usually wants the next agent's
  // conversations too, not its prompt.
  const [tab, setTab] = useState<EditorTab>("agent");

  return (
    <div className="chat-editor">
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

      <div className="chat-tabs" role="tablist">
        {editorTabs.map((entry) => (
          <button
            aria-selected={tab === entry.id}
            className={`chat-tab${tab === entry.id ? " is-active" : ""}`}
            key={entry.id}
            onClick={() => setTab(entry.id)}
            role="tab"
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </div>

      {tab === "conversation" ? (
        <div className="chat-card chat-card-conversations">
          <div className="chat-card-head">
            <h3 className="chat-card-title">Conversations</h3>
          </div>
          {/* Keyed by agent: a different agent is a different inbox, so the
              workspace starts over rather than carrying the previous agent's
              selection and filters into it. */}
          <ChatConversationsWorkspace agentId={agent.id} key={agent.id} />
        </div>
      ) : (
        <>
          {agent.agent.phone_number_id ? null : (
            <PhoneNumberSetupCard
              agentName={agent.agent.name}
              error={loginError}
              isStarting={isStartingLogin}
              isRefreshingNumbers={isRefreshingNumbers}
              login={login}
              numbers={assignableNumbers}
              onSelectNumber={(phoneNumberId) =>
                onPatch((current) => ({
                  ...current,
                  agent: { ...current.agent, phone_number_id: phoneNumberId },
                }))
              }
              onRefreshNumbers={onRefreshNumbers}
              onRequestCode={onRequestCode}
              onStartLogin={onStartLogin}
            />
          )}

          <div className="chat-card chat-card-grow">
            <div className="chat-card-head">
              <h3 className="chat-card-title">System Prompt</h3>
            </div>
            <textarea
              className="chat-textarea"
              onChange={(event) =>
                onPatch((current) => ({
                  ...current,
                  prompt: { ...current.prompt, system_prompt: event.target.value },
                }))
              }
              style={{ minHeight: 185 }}
              value={agent.prompt?.system_prompt ?? ""}
            />
          </div>
        </>
      )}
    </div>
  );
}

// PhoneNumberSetupCard fills the gap left by a chat agent with no number: it
// can neither answer nor open a thread until one is picked. Both ways out are
// offered side by side — link a brand-new WhatsApp number by scanning a QR code,
// or claim one of the numbers already connected to the account.
function PhoneNumberSetupCard({
  agentName,
  error,
  isRefreshingNumbers,
  isStarting,
  login,
  numbers,
  onSelectNumber,
  onRefreshNumbers,
  onRequestCode,
  onStartLogin,
}: {
  agentName: string;
  error: string;
  isRefreshingNumbers: boolean;
  isStarting: boolean;
  login: ApiPhoneNumber | null;
  numbers: AssignableNumber[];
  onSelectNumber: (phoneNumberId: string) => void;
  onRefreshNumbers: () => void;
  onRequestCode: (phone: string) => Promise<void>;
  onStartLogin: () => void;
}) {
  // `login` is the unfinished session for this agent; a connected one is never
  // passed down, because connecting assigns the number and closes this card.
  const isPending = login?.status === "pending_qr";
  const canRestart = Boolean(login);
  // A code login still rotates QR codes underneath; the code is what to show.
  const showsCode = isPending && Boolean(login?.pairing_code);

  return (
    <div className="chat-card chat-number-setup">
      <div className="chat-card-head">
        <h3 className="chat-card-title">Connect a phone number</h3>
        <span className="chat-number-flag">Required to reply</span>
      </div>
      <p className="chat-number-copy">
        &ldquo;{agentName}&rdquo; has no WhatsApp number, so no message reaches it. Scan the QR code
        to link a new one, or pick a number you have already connected — either way works.
      </p>

      <div className="chat-number-grid">
        <section className="chat-number-pane" aria-label="Link a new WhatsApp number">
          <div className="chat-number-pane-head">
            <span className="chat-number-pane-title">Scan a new number</span>
            <span className="chat-number-pane-note">WhatsApp › Linked devices</span>
          </div>

          {showsCode ? null : <div className="chat-qr-frame">
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
          </div>}

          <WhatsAppLinkHelp disabled={isStarting} login={login} onRequestCode={onRequestCode} />

          <div className="chat-number-status">
            {isStarting
              ? "Getting a fresh code…"
              : isPending
                ? "Open WhatsApp › Linked devices and scan. The code refreshes itself until it is scanned, and the number is assigned to this agent the moment it connects — keep this page open."
                : login
                  ? `This login ${phoneStatusLabels[login.status].toLowerCase()}. A new code follows in a moment.`
                  : "The number is detected automatically after you scan."}
          </div>

          {/* The code is issued and reissued on its own; the button is only the
              way back from a login that stopped without one on screen. */}
          {isPending || isStarting ? null : (
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

          {numbers.length === 0 ? (
            <div className="chat-number-empty">
              No connected numbers yet. Scan the QR code to link your first one, or manage numbers on
              the <Link href="/dashboard/phone-numbers">Phone Numbers</Link> page.
            </div>
          ) : (
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
          )}
        </section>
      </div>
    </div>
  );
}

// The right-hand configuration panel, mirroring the voice workspace: the basics
// at the top, then one collapsible section per part of the chat-agent contract.
function ConfigPanel({
  agent,
  knowledgeBases,
  onPatch,
  phoneNumbers,
  tools,
}: {
  agent: ApiChatAgent;
  knowledgeBases: ApiKnowledgeBase[];
  onPatch: (patch: (agent: ApiChatAgent) => ApiChatAgent) => void;
  phoneNumbers: ApiPhoneNumber[];
  tools: ApiTool[];
}) {
  const [openSection, setOpenSection] = useState<ConfigSectionId | null>("knowledge-base");
  const attachedKbs = agent.knowledge_base?.knowledge_base_ids ?? [];
  const attachedTools = agent.tools?.tool_ids ?? [];
  // end_call and transfer_call exist to release a phone call, so the server
  // ignores them in a chat. Offering them here would be offering nothing.
  const chatCapableTools = tools.filter(
    (tool) => tool.type === "api_request" || tool.type === "send_text"
  );

  const toggleId = (list: string[], id: string) =>
    list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

  return (
    <aside className="chat-panel chat-config-panel">
      <div className="chat-panel-head chat-config-head">
        <div>
          <h2 className="chat-panel-title">Chat agent configuration</h2>
          <div className="chat-panel-copy">
            How the agent is addressed and what it can reach.
          </div>
        </div>
      </div>
      <div className="chat-panel-body">
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
            <select
              className="chat-select"
              onChange={(event) =>
                onPatch((current) => ({
                  ...current,
                  agent: {
                    ...current.agent,
                    phone_number_id: event.target.value || null,
                    status: event.target.value ? current.agent.status : "inactive",
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
            {phoneNumbers.length === 0 ? (
              <span className="chat-field-hint">
                Connect one in <Link href="/dashboard/phone-numbers">Phone Numbers</Link>.
              </span>
            ) : null}
          </label>
        </div>

        <div className="chat-accordion-list">
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
            meta={attachedTools.length ? `${attachedTools.length} attached` : "None"}
            onToggle={setOpenSection}
            title="Tools"
          >
            {chatCapableTools.length === 0 ? (
              <div className="chat-chips-empty">
                {tools.length === 0 ? (
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
                {chatCapableTools.map((tool) => {
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
                        }))
                      }
                      type="button"
                    >
                      {on ? <Icon name="check" size={13} sw={2.6} /> : <Icon name="wrench" size={13} />}
                      <span>{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </ConfigSection>
        </div>
      </div>
    </aside>
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
  meta: string;
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

function StatusPill({ status }: { status: "active" | "inactive" }) {
  return (
    <span className={`chat-pill ${status === "active" ? "is-active" : "is-inactive"}`}>
      <span className="chat-dot" />
      {status === "active" ? "Live" : "Paused"}
    </span>
  );
}
