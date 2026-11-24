"use client";

import { PaneListSkeleton } from "@/components/ui/Skeleton";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  type WorkspaceMode,
  dashboardHref,
  useWorkspaceMode,
} from "@/components/nav/workspaceMode";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { useCachedState } from "@/lib/pageCache";
import { startPolling } from "@/lib/polling";
import {
  listDashboardAgents as apiListAgents,
  updateDashboardAgent as apiUpdateAgent,
  type ApiAgentResource,
} from "@/lib/agents";
import {
  listDashboardChatAgents as apiListChatAgents,
  updateDashboardChatAgent as apiUpdateChatAgent,
  type ApiChatAgent,
} from "@/lib/chatAgents";
import {
  getPhoneNumber as apiGetPhoneNumber,
  listPhoneNumbers as apiListPhoneNumbers,
  logoutPhoneNumber as apiLogoutPhoneNumber,
  rePairPhoneNumber as apiRePairPhoneNumber,
  restartPhoneNumberLogin as apiRestartPhoneNumberLogin,
  startPhoneNumberCodeLogin as apiStartPhoneNumberCodeLogin,
  startPhoneNumberLogin as apiStartPhoneNumberLogin,
  startPhoneNumberQrLogin as apiStartPhoneNumberQrLogin,
  type ApiPhoneNumber,
  type PhoneNumberStatus,
} from "@/lib/phoneNumbers";
import {
  normalizePhone,
  useIsPhone,
  usePhoneNumberLib,
  WhatsAppLinkHelp,
} from "@/components/phone-numbers/WhatsAppLinkHelp";

type IconName =
  | "grid"
  | "agents"
  | "phone"
  | "demo"
  | "chat"
  | "calendar"
  | "chart"
  | "settings"
  | "spark"
  | "target"
  | "key"
  | "book"
  | "wrench"
  | "plus"
  | "refresh"
  | "link"
  | "logOut"
  | "search"
  | "tag"
  | "message"
  | "globe"
  | "clock"
  | "copy"
  | "check"
  | "x"
  | "menu"
  | "chevron"
  | "back"
  | "list"
  | "hash";



type AssignedAgent = {
  id: string;
  kind: "voice" | "chat";
  name: string;
  phoneNumberId: string | null;
  status: string;
};

type PhoneAssignments = {
  voice: AssignedAgent | null;
};

type AssignableDirection = "voice" | "chat";


// A login that ended is "disconnected" whichever way it went; failed and expired
// are only in the status union for older servers.
const terminalStatuses = new Set<PhoneNumberStatus>(["connected", "disconnected", "failed", "expired"]);

// Non-connected statuses whose login session can be restarted for a fresh QR code.
const restartableStatuses = new Set<PhoneNumberStatus>(["pending_qr", "expired", "failed", "disconnected"]);

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const statusLabels: Record<PhoneNumberStatus, string> = {
  pending_qr: "Pending QR",
  connected: "Connected",
  disconnected: "Disconnected",
  failed: "Failed",
  expired: "Expired",
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
          <path d="M10 12l8-8" />
          <path d="M14 8l2 2" />
          <path d="M16 6l2 2" />
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
    case "refresh":
      return (
        <>
          <path d="M4 4v6h6" />
          <path d="M20 20v-6h-6" />
          <path d="M20 9a8 8 0 00-13.5-3L4 10M4 15a8 8 0 0013.5 3L20 14" />
        </>
      );
    case "link":
      return (
        <>
          <path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7" />
          <path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7" />
        </>
      );
    case "logOut":
      return (
        <>
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </>
      );
    case "tag":
      return (
        <>
          <path d="M20.5 10.5l-9 9a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8l9-9H19a1.5 1.5 0 011.5 1.5z" />
          <circle cx="16" cy="7" r="1" />
        </>
      );
    case "message":
      return (
        <>
          <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
        </>
      );
    case "globe":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      );
    case "copy":
      return (
        <>
          <rect height="12" rx="2" width="12" x="8" y="8" />
          <path d="M4 16V6a2 2 0 012-2h10" />
        </>
      );
    case "check":
      return <path d="M5 12.5l4 4 10-10" />;
    case "x":
      return <path d="M18 6L6 18M6 6l12 12" />;
    case "menu":
      return <path d="M4 6h16M4 12h16M4 18h16" />;
    case "chevron":
      return <path d="M9 6l6 6-6 6" />;
    case "back":
      return (
        <>
          <path d="M20 12H4" />
          <path d="M10 6l-6 6 6 6" />
        </>
      );
    case "list":
      return (
        <>
          <path d="M8 6h13M8 12h13M8 18h13" />
          <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
        </>
      );
    case "hash":
      return (
        <>
          <path d="M5 9h14M4 15h14" />
          <path d="M10 3L8 21M16 3l-2 18" />
        </>
      );
  }
}

function Icon({
  className,
  name,
  size = 18,
  stroke = "currentColor",
  sw = 2,
}: {
  className?: string;
  name: IconName;
  size?: number;
  stroke?: string;
  sw?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
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
.phone-shell {
  --bg: var(--app-bg);
  --sidebar: var(--app-sidebar);
  --surface: var(--app-surface);
  --surface-2: var(--app-surface-2);
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
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.phone-shell * { box-sizing: border-box; }
.phone-shell button, .phone-shell input, .phone-shell textarea { font: inherit; }
.phone-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.phone-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.phone-shell ::-webkit-scrollbar-track { background: transparent; }
.phone-link-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 13px; }
.phone-main { display: flex; flex: 1; flex-direction: column; min-width: 0; }
.phone-content { flex: 1 1 auto; min-width: 0; padding: 24px 32px 32px; }
.phone-browse { display: flex; flex-direction: column; gap: 16px; width: 100%; }
/* Search in the Retell-style header, right of the title. */
.phone-browse .phone-search-wrap { flex: 0 1 300px; max-width: none; min-width: 0; width: 300px; }
@media (max-width: 640px) { .phone-browse .phone-search-wrap { flex: 1 1 100%; width: auto; } }
.phone-toolbar { align-items: center; display: flex; flex-wrap: wrap; gap: 12px; }
.phone-toolbar .phone-search-wrap { flex: 1 1 240px; margin-bottom: 0; max-width: 420px; }
.phone-count {
  background: var(--app-hover-2);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  color: var(--subtle);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  margin-left: auto;
  padding: 6px 10px;
}
.phone-view-toggle {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  display: inline-flex;
  flex-shrink: 0;
  gap: 2px;
  padding: 3px;
}
.phone-view-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  transition: background .18s ease, box-shadow .18s ease, color .18s ease;
  width: 34px;
}
.phone-view-btn:hover { color: var(--text); }
.phone-view-btn.is-active {
  background: var(--primary-soft);
  box-shadow: inset 0 0 0 1px var(--app-primary-ring);
  color: var(--app-primary-text);
}
.phone-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
.phone-list { display: flex; flex-direction: column; gap: 10px; }
.phone-row {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  color: inherit;
  display: grid;
  gap: 16px;
  grid-template-areas: "avatar identity agents time status";
  grid-template-columns: 36px minmax(0, 1.1fr) minmax(0, 1.4fr) auto auto;
  padding: 13px 16px;
  position: relative;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.phone-row:hover { background: var(--panel-hover); border-color: var(--app-primary-ring); box-shadow: 0 6px 18px var(--app-shadow-soft); }
.phone-row > .phone-card-avatar { grid-area: avatar; }
.phone-row > .phone-status-chip { grid-area: status; justify-self: end; }
.phone-row-identity { display: grid; gap: 3px; grid-area: identity; min-width: 0; }
.phone-row-name { font-size: 14px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-row-sub { color: var(--subtle); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-row-agents { display: flex; flex-wrap: wrap; gap: 6px; grid-area: agents; min-width: 0; }
.phone-row-time { align-items: center; grid-area: time; color: var(--subtle); display: inline-flex; font-size: 11.5px; gap: 5px; white-space: nowrap; }
.phone-card-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 176px;
  padding: 16px;
  position: relative;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
}
.phone-card-item:hover {
  background: var(--panel-hover);
  border-color: var(--app-primary-ring);
  box-shadow: 0 12px 30px var(--app-shadow-soft);
  transform: translateY(-2px);
}
/* The overlay is the card's click target; it sits above the static content but
   below the agent pickers, which raise themselves out of its way. */
.phone-open-overlay {
  background: transparent;
  border: 0;
  border-radius: inherit;
  cursor: pointer;
  inset: 0;
  padding: 0;
  position: absolute;
  z-index: 1;
}
.phone-open-overlay:focus-visible { box-shadow: 0 0 0 3px var(--app-primary-ring-strong); outline: none; }
/* The wrapper spans its whole column, so only the chips themselves take
   clicks; the empty space around them falls through to the open overlay. */
.phone-card-agents, .phone-row-agents { pointer-events: none; position: relative; z-index: 2; }
.phone-card-agents > *, .phone-row-agents > * { pointer-events: auto; }
.expandable-card-backdrop {
  background: var(--app-overlay);
  inset: 0;
  position: fixed;
  z-index: 80;
}
.expandable-card-stage {
  align-items: center;
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  pointer-events: none;
  position: fixed;
  z-index: 90;
}
.expandable-card-panel { pointer-events: auto; }
.phone-expandable-card {
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  box-shadow: 0 30px 90px var(--app-shadow-color), 0 0 0 1px var(--app-primary-ring);
  display: flex;
  flex-direction: column;
  max-height: min(760px, calc(100vh - 48px));
  max-width: 680px;
  overflow: hidden;
  width: 100%;
}
.phone-expandable-head {
  align-items: flex-start;
  background: linear-gradient(145deg, var(--app-primary-soft-2), transparent 58%);
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 13px;
  padding: 20px;
}
.phone-expandable-identity { flex: 1; min-width: 0; }
.phone-expandable-title { font-size: 18px; font-weight: 850; letter-spacing: -.3px; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-expandable-subtitle { color: var(--subtle); font-size: 12px; margin-top: 3px; }
.phone-expandable-head .phone-status-chip { margin-left: auto; margin-top: 4px; }
.phone-expandable-close {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  height: 32px;
  justify-content: center;
  margin-left: 3px;
  width: 32px;
}
.phone-expandable-close:hover { background: var(--panel-hover); color: var(--text); }
.phone-expandable-body { overflow: auto; padding: 16px; }
.phone-expandable-body .phone-config-section { box-shadow: none; }
.phone-page { display: flex; flex-direction: column; gap: 14px; margin: 0 auto; max-width: 960px; width: 100%; }
.phone-expandable-card.phone-page-card { border: 1px solid var(--border-strong); border-radius: 20px; box-shadow: 0 10px 30px var(--app-shadow-soft); height: auto; max-height: none; max-width: none; overflow: visible; }
.phone-page-card .phone-expandable-head { border-radius: 20px 20px 0 0; }
.phone-page-back { margin-left: 0; margin-right: 2px; margin-top: 4px; }
.phone-page-backlink { align-items: center; align-self: flex-start; color: var(--subtle); display: inline-flex; font-size: 13px; font-weight: 600; gap: 6px; text-decoration: none; }
.phone-page-backlink:hover { color: var(--text); }
.phone-expandable-actions {
  align-items: center;
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  padding: 14px 16px;
}
.phone-card-top { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.phone-card-avatar {
  align-items: center;
  background: linear-gradient(140deg,var(--app-primary-border),var(--app-primary-soft-2));
  border: 1px solid var(--app-primary-ring);
  border-radius: 11px;
  color: var(--primary-light);
  display: flex;
  flex-shrink: 0;
  height: 36px;
  justify-content: center;
  width: 36px;
}
.phone-card-name { font-size: 15px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-card-desc { color: var(--muted); font-size: 12.5px; line-height: 1.55; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-card-agents { display: flex; flex-wrap: wrap; gap: 6px; }
.phone-card-agent {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--subtle);
  display: inline-flex;
  font-size: 11px;
  font-weight: 700;
  gap: 5px;
  max-width: 100%;
  min-width: 0;
  padding: 4px 9px;
}
.phone-card-agent span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-card-agent.is-empty { color: var(--faint); }
.phone-agent-chip {
  cursor: pointer;
  padding-right: 6px;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, color .18s ease;
}
.phone-agent-chip:hover:not(:disabled) { background: var(--app-panel-hover); border-color: var(--app-border-strong); color: var(--text); }
.phone-agent-chip:disabled { cursor: not-allowed; opacity: .6; }
.phone-agent-chip .phone-agent-chevron { margin-left: -1px; }
/* The direction is the fixed part of the chip, so it never shrinks; the agent
   name is what gives way when the chip runs out of room. */
.phone-agent-chip-label { color: var(--faint); flex-shrink: 0; font-weight: 800; }
.phone-agent-chip-dot { background: var(--app-border-strong); border-radius: 50%; flex-shrink: 0; height: 3px; width: 3px; }
.phone-agent-chip-name { color: var(--text); font-weight: 700; min-width: 0; }
.phone-card-agent.is-empty .phone-agent-chip-name { color: var(--faint); }
.phone-agent-select.is-chip { display: inline-flex; max-width: 100%; min-width: 0; }
.phone-agent-select.is-chip.is-open .phone-agent-chip {
  background: var(--primary-soft);
  border-color: var(--app-primary-ring);
  color: var(--app-primary-text);
}
.phone-card-foot {
  align-items: center;
  border-top: 1px solid var(--border);
  color: var(--subtle);
  display: flex;
  flex-wrap: wrap;
  font-size: 11.5px;
  gap: 8px;
  margin-top: auto;
  min-width: 0;
  padding-top: 12px;
}
.phone-card-foot-meta { align-items: center; display: inline-flex; gap: 5px; min-width: 0; }
.phone-card-foot-time { margin-left: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-add-card {
  align-items: center;
  background: transparent;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  color: var(--subtle);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  min-height: 176px;
  padding: 16px;
  text-align: center;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}
.phone-add-card:hover:not(:disabled) { background: var(--app-hover); border-color: var(--app-primary-ring); color: var(--text); }
.phone-add-card:disabled { cursor: not-allowed; opacity: .55; }
.phone-add-icon {
  align-items: center;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  display: flex;
  height: 40px;
  justify-content: center;
  margin-bottom: 4px;
  width: 40px;
}
.phone-add-label { font-size: 13.5px; font-weight: 800; }
.phone-add-copy { color: var(--faint); font-size: 11.5px; max-width: 210px; }
.phone-detail-layout { display: flex; flex-direction: column; gap: 14px; width: 100%; }
.phone-back {
  align-items: center;
  background: none;
  border: 0;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  font-size: 12.5px;
  font-weight: 800;
  gap: 8px;
  padding: 2px 0;
  transition: color .18s ease;
  width: fit-content;
}
.phone-back:hover { color: var(--text); }
.phone-create-btn, .phone-top-btn, .phone-ghost-btn, .phone-danger-btn {
  align-items: center;
  border: 1px solid var(--app-border-strong);
  border-radius: 11px;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  transition: filter .18s ease, background .18s ease, border-color .18s ease, transform .18s ease;
  white-space: nowrap;
}
.phone-create-btn {
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border-color: transparent;
  border-radius: 9px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  color: var(--app-on-accent);
  font-size: 12px;
  gap: 6px;
  min-height: 32px;
  padding: 0 11px;
}
.phone-create-btn:hover { filter: brightness(1.08); }
.phone-top-btn, .phone-ghost-btn { background: var(--panel-hover); color: var(--text); }
.phone-top-btn:hover, .phone-ghost-btn:hover { background: var(--app-panel-hover); }
.phone-danger-btn { background: var(--panel-hover); color: var(--rose); }
.phone-danger-btn:hover { background: var(--app-rose-soft); border-color: var(--app-rose-border); }
.phone-create-btn:disabled, .phone-top-btn:disabled, .phone-ghost-btn:disabled, .phone-danger-btn:disabled {
  cursor: not-allowed;
  filter: grayscale(.35);
  opacity: .45;
  transform: none;
}
.phone-search-wrap { margin-bottom: 12px; position: relative; }
.phone-search-icon {
  color: var(--subtle);
  display: flex;
  left: 12px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.phone-search {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  height: 40px;
  outline: none;
  padding: 0 12px 0 38px;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.phone-search::placeholder { color: var(--faint); }
.phone-search:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.phone-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.phone-detail-topbar {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  min-width: 0;
  padding: 18px;
}
.phone-selected-summary { align-items: center; display: flex; gap: 13px; min-width: 0; }
.phone-summary-icon {
  align-items: center;
  background: var(--primary-soft);
  border: 1px solid var(--app-primary-ring);
  border-radius: 12px;
  color: var(--primary-light);
  display: flex;
  flex-shrink: 0;
  height: 46px;
  justify-content: center;
  width: 46px;
}
.phone-summary-title { font-size: 20px; font-weight: 850; letter-spacing: -.35px; line-height: 1.1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-summary-id { align-items: center; color: var(--subtle); display: flex; font-family: var(--font-geist-mono), monospace; font-size: 11px; gap: 7px; margin-top: 4px; min-width: 0; }
.phone-id-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-icon-action {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--faint);
  cursor: pointer;
  display: inline-flex;
  height: 22px;
  justify-content: center;
  padding: 0;
  width: 22px;
}
.phone-icon-action:hover { color: var(--app-text-strong); }
.phone-top-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.phone-detail-scroll { display: contents; }
.phone-detail-content { display: grid; gap: 16px; padding-bottom: 8px; }
.phone-config-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  display: grid;
  gap: 16px;
  padding: 16px;
}
.phone-section-head { display: grid; gap: 3px; }
.phone-section-title { font-size: 13.5px; font-weight: 850; letter-spacing: -.1px; margin: 0; }
.phone-section-copy { color: var(--subtle); font-size: 12px; }
.phone-setting-row {
  align-items: start;
  display: grid;
  gap: 12px;
  grid-template-columns: 36px minmax(0, 1fr);
}
.phone-setting-icon {
  align-items: center;
  background: var(--app-hover-2);
  border: 1px solid var(--app-border);
  border-radius: 9px;
  color: var(--primary-light);
  display: flex;
  height: 36px;
  justify-content: center;
  width: 36px;
}
.phone-setting-body { display: grid; gap: 8px; min-width: 0; }
.phone-setting-label { color: var(--text); font-size: 13px; font-weight: 800; }
.phone-setting-copy { color: var(--subtle); font-size: 12px; margin-top: -4px; }
.phone-assignment-grid { display: grid; gap: 8px; }
.phone-settings-grid { align-items: stretch; display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); min-width: 0; }
.phone-settings-grid > .phone-setting-row {
  align-content: start;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  padding: 12px;
}
.phone-settings-grid > .phone-setting-row .phone-assignment-row { background: var(--surface); }
.phone-setting-span { grid-column: 1 / -1; }
.phone-setting-span .phone-assignment-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
/* Chat mode has a single assignment row; two columns squeezed it to half width. */
.phone-setting-span .phone-assignment-grid-single { grid-template-columns: 1fr; }
@media (max-width: 780px) { .phone-setting-span .phone-assignment-grid { grid-template-columns: 1fr; } }
.phone-assignment-row {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 10px;
  transition: border-color .18s ease, box-shadow .18s ease;
}
.phone-assignment-row:hover { border-color: var(--app-border-strong); }
.phone-assignment-head { align-items: center; display: flex; gap: 8px; justify-content: space-between; min-width: 0; }
.phone-assignment-direction {
  background: var(--app-primary-soft-2);
  border-radius: 6px;
  color: var(--primary-light);
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: .8px;
  padding: 3px 7px;
  text-transform: uppercase;
}
.phone-assignment-meta {
  align-items: center;
  color: var(--subtle);
  display: flex;
  font-size: 11.5px;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
}
.phone-assignment-meta span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-assignment-dot { background: currentColor; border-radius: 50%; flex-shrink: 0; height: 4px; width: 4px; }
.phone-agent-select { min-width: 0; position: relative; }
.phone-agent-trigger {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--text);
  cursor: pointer;
  display: flex;
  gap: 9px;
  min-height: 42px;
  min-width: 0;
  padding: 0 10px;
  text-align: left;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.phone-agent-trigger:hover:not(:disabled) { background: var(--app-panel-hover); border-color: var(--app-border-strong); }
.phone-agent-trigger:disabled { cursor: not-allowed; opacity: .6; }
.phone-agent-select.is-open .phone-agent-trigger,
.phone-agent-trigger:focus-visible {
  border-color: var(--app-primary-ring-strong);
  box-shadow: 0 0 0 4px var(--app-primary-ring);
  outline: none;
}
.phone-agent-avatar {
  align-items: center;
  background: var(--app-primary-soft-2);
  border: 1px solid var(--app-primary-ring);
  border-radius: 8px;
  color: var(--primary-light);
  display: flex;
  flex-shrink: 0;
  font-size: 11.5px;
  font-weight: 850;
  height: 26px;
  justify-content: center;
  text-transform: uppercase;
  width: 26px;
}
.phone-agent-avatar.is-empty { background: var(--app-border); border-color: var(--app-border-strong); color: var(--subtle); }
.phone-agent-name {
  flex: 1 1 auto;
  font-size: 13px;
  font-weight: 800;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.phone-agent-name.is-placeholder { color: var(--subtle); font-weight: 700; }
.phone-agent-chevron { color: var(--faint); flex-shrink: 0; transform: rotate(90deg); transition: transform .18s ease, color .18s ease; }
.phone-agent-select.is-open .phone-agent-chevron { color: var(--primary-light); transform: rotate(-90deg); }
.phone-agent-popover {
  --subtle: var(--app-subtle);
  --primary-light: var(--app-primary-light);
  --text: var(--app-text);
  background: linear-gradient(180deg, var(--app-panel-hover), var(--app-elevated));
  border: 1px solid var(--app-border-strong);
  border-radius: 12px;
  box-shadow: 0 22px 58px var(--app-shadow-color), 0 0 0 1px var(--app-primary-ring);
  display: grid;
  gap: 2px;
  max-height: 260px;
  overflow: auto;
  padding: 6px;
  position: fixed;
  z-index: 100;
}
.phone-agent-option {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 9px;
  color: var(--app-text);
  cursor: pointer;
  display: grid;
  gap: 9px;
  grid-template-columns: 26px minmax(0, 1fr) 18px;
  min-height: 38px;
  padding: 6px 8px;
  text-align: left;
  width: 100%;
}
.phone-agent-option:hover { background: var(--app-border); }
.phone-agent-option.is-selected { background: var(--app-primary-soft-2); color: var(--app-primary-text); }
.phone-agent-option-label { display: grid; gap: 1px; min-width: 0; }
.phone-agent-option-name { font-size: 13px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-agent-option-meta { color: var(--app-muted); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-agent-option-check {
  align-items: center;
  color: var(--app-primary-text);
  display: inline-flex;
  height: 18px;
  justify-content: center;
  width: 18px;
}
.phone-status-chip {
  align-items: center;
  border-radius: 20px;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11.5px;
  font-weight: 800;
  gap: 6px;
  line-height: 1;
  padding: 5px 8px;
  white-space: nowrap;
}
.phone-status-connected { background: var(--app-green-soft); color: var(--green); }
.phone-status-pending { background: var(--app-amber-soft); color: var(--amber); }
.phone-status-failed { background: var(--app-rose-soft); color: var(--rose); }
.phone-status-neutral { background: var(--app-border); color: var(--subtle); }
.phone-dot { background: currentColor; border-radius: 50%; height: 6px; width: 6px; }
.phone-qr-layout { align-items: start; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr) minmax(220px, 300px); }
.phone-qr-column { display: grid; gap: 12px; min-width: 0; }
.phone-qr-frame {
  align-items: center;
  aspect-ratio: 1;
  background: #fff;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  padding: 12px;
  width: 100%;
}
/* Scale the QR by repeating pixels: smoothing greys the module edges. */
.phone-qr-image { height: 100%; image-rendering: pixelated; object-fit: contain; width: 100%; }
.phone-qr-placeholder {
  align-items: center;
  aspect-ratio: 1;
  border: 1px dashed var(--border-strong);
  border-radius: 12px;
  color: var(--muted);
  display: flex;
  justify-content: center;
  padding: 18px;
  text-align: center;
}
.phone-empty-workspace {
  align-items: center;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  font-size: 13.5px;
  font-weight: 600;
  gap: 16px;
  justify-content: center;
  min-height: 340px;
  padding: 40px;
  text-align: center;
}
.phone-empty-workspace p { margin: 0; max-width: 440px; }
.phone-toast {
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
  z-index: 60;
}
.phone-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-green-text); }
.phone-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
.phone-modal-backdrop {
  align-items: center;
  background: var(--app-overlay);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 70;
}
.phone-modal-card {
  background: var(--surface);
  border: 1px solid var(--app-border-strong);
  border-radius: 18px;
  box-shadow: 0 30px 90px var(--app-shadow-color);
  display: grid;
  gap: 0;
  max-width: 480px;
  overflow: hidden;
  width: min(480px, 100%);
}
.phone-modal-head, .phone-modal-footer {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 18px 20px;
}
.phone-modal-head { align-items: start; border-bottom: 1px solid var(--border); }
.phone-modal-footer { border-top: 1px solid var(--border); justify-content: flex-end; padding: 14px 20px; }
.phone-modal-title { font-size: 18px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.phone-modal-copy { color: var(--subtle); font-size: 12.5px; margin-top: 3px; }
.phone-modal-body { display: grid; gap: 12px; padding: 18px 20px; }
.phone-field { display: grid; gap: 7px; min-width: 0; }
.phone-field-label { color: var(--subtle); font-size: 11.5px; font-weight: 700; }
.phone-field-error { color: var(--app-rose-text); font-size: 12px; line-height: 1.4; }
.phone-modal-switch {
  background: none;
  border: 0;
  color: var(--app-primary-text);
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 700;
  justify-self: start;
  padding: 0;
  text-align: left;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.phone-input {
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
.phone-input::placeholder { color: var(--faint); }
.phone-input:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.phone-modal-close {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--subtle);
  cursor: pointer;
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.phone-modal-close:hover { color: var(--app-text-strong); }
/* The mobile top bar and drawer backdrop only exist below the tablet breakpoint. */
/* Retell-style master-detail: a list pane of numbers beside the open one. */
.phone-main { min-height: 100vh; }
.phone-split { display: flex; flex: 1; min-height: 100%; min-width: 0; }
.phone-pane-list { border-right: 1px solid var(--border); display: flex; flex: 0 0 290px; flex-direction: column; min-width: 0; padding: 16px; }
.phone-pane-head { align-items: center; border-bottom: 1px solid var(--border); color: var(--text); display: flex; gap: 10px; padding: 0 2px 14px; }
.phone-pane-title { flex: 1; font-size: 14.5px; font-weight: 600; margin: 0; }
.phone-pane-add {
  align-items: center;
  background: var(--app-text-strong, var(--text));
  border: 0;
  border-radius: 8px;
  color: var(--bg);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  transition: opacity .16s ease;
  width: 32px;
}
.phone-pane-add:hover:not(:disabled) { opacity: .85; }
.phone-pane-add:disabled { cursor: not-allowed; opacity: .4; }
.phone-pane-items { display: flex; flex-direction: column; gap: 2px; overflow-y: auto; padding-top: 12px; }
.phone-pane-item {
  align-items: center;
  border-radius: 8px;
  color: var(--muted);
  display: flex;
  font-size: 14px;
  gap: 10px;
  min-height: 36px;
  padding: 0 10px;
  text-decoration: none;
  transition: background .16s ease, color .16s ease;
}
.phone-pane-item > svg { color: var(--text); flex-shrink: 0; }
.phone-pane-item:hover { background: var(--app-hover); color: var(--text); }
.phone-pane-item.is-active { background: var(--app-hover-2); color: var(--text); }
.phone-pane-item-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-pane-item-dot { border-radius: 50%; flex-shrink: 0; height: 7px; width: 7px; }
.phone-pane-item-dot.phone-status-connected { background: var(--green); }
.phone-pane-item-dot.phone-status-pending { background: var(--amber); }
.phone-pane-item-dot.phone-status-failed { background: var(--rose); }
.phone-pane-item-dot.phone-status-neutral { background: var(--faint); }
.phone-pane-note { color: var(--subtle); display: grid; font-size: 13px; gap: 10px; justify-items: start; margin: 0; padding: 6px 4px; }
.phone-pane-note p { margin: 0; }
.phone-pane-detail { display: flex; flex: 1; flex-direction: column; gap: 28px; min-width: 0; padding: 24px 24px 32px; }
.phone-pane-back { display: none; }
.phone-detail-top { align-items: flex-start; border-bottom: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 14px 16px; justify-content: space-between; padding-bottom: 16px; }
.phone-detail-title { font-size: 18px; font-weight: 600; margin: 0; min-width: 0; overflow-wrap: anywhere; }
.phone-detail-back { display: none; }
/* Re-pair shows its link icon only on phones, where the button loses its text. */
.phone-btn-phone-icon { display: none; }
/* The basis is what makes the buttons wrap below the number in a narrow pane
   instead of squeezing it. */
.phone-detail-identity { flex: 1 1 260px; min-width: 0; }
.phone-detail-line { align-items: center; color: var(--subtle); clip-path: inset(-4px -4px -4px 16px); display: flex; flex-wrap: wrap; font-size: 12px; margin: 6px 0 0 -16px; row-gap: 2px; }
/* Each item carries the dot before it; the clip above hides the dot of
   whichever item starts a line, so a wrapped line never begins with one. */
.phone-detail-line-item { align-items: center; display: inline-flex; gap: 6px; min-height: 20px; min-width: 0; padding-left: 16px; position: relative; }
.phone-detail-line-item::before { background: currentColor; border-radius: 50%; content: ""; height: 3px; left: 6.5px; position: absolute; top: calc(50% - 1.5px); width: 3px; }
.phone-copy { align-items: center; background: none; border: 0; border-radius: 5px; color: var(--subtle); cursor: pointer; display: inline-flex; height: 20px; justify-content: center; padding: 0; width: 20px; }
.phone-copy:hover { background: var(--app-hover); color: var(--text); }
.phone-status-line { align-items: center; background: none; display: inline-flex; gap: 5px; }
.phone-status-line.phone-status-connected { background: none; color: var(--app-green-text); }
.phone-status-line.phone-status-pending { background: none; color: var(--app-amber-text); }
.phone-status-line.phone-status-failed { background: none; color: var(--app-rose-text); }
.phone-status-line.phone-status-neutral { background: none; }
.phone-detail-buttons { display: flex; flex-shrink: 0; flex-wrap: wrap; gap: 8px; }
.phone-outline-btn {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
  height: 36px;
  justify-content: center;
  min-width: 36px;
  white-space: nowrap;
}
.phone-outline-btn.has-text { padding: 0 12px; }
.phone-outline-btn:hover:not(:disabled) { background: var(--app-hover); }
.phone-outline-btn.is-danger:hover:not(:disabled) { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--app-rose-text); }
.phone-outline-btn:disabled { cursor: not-allowed; opacity: .5; }
@media (max-width: 900px) {
  .phone-split { flex-direction: column; }
  .phone-pane-list { border-right: 0; flex: 1 1 auto; }
  .phone-split:not(.has-selection) .phone-pane-detail { display: none; }
  .phone-split.has-selection .phone-pane-list { display: none; }
  .phone-pane-detail { gap: 20px; padding: 16px; }
  .phone-pane-back { align-items: center; color: var(--subtle); display: inline-flex; font-size: 13px; font-weight: 600; gap: 6px; text-decoration: none; }
  /* With a number open, the back link becomes an arrow button in its header,
     like the agent and knowledge base pages. */
  .phone-pane-detail:has(> .phone-detail-top) > .phone-pane-back { display: none; }
  .phone-detail-top { align-items: center; display: grid; gap: 12px; grid-template-columns: auto minmax(0, 1fr) auto; }
  .phone-detail-back {
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    display: inline-flex;
    height: 38px;
    justify-content: center;
    text-decoration: none;
    width: 38px;
  }
  .phone-detail-back:hover { background: var(--app-hover); }
  .phone-detail-back:focus-visible { outline: 2px solid var(--app-primary-light); outline-offset: 2px; }
  /* Once linked, the status needs one line, not a square box the size of a QR. */
  .phone-qr-placeholder.is-status {
    aspect-ratio: auto;
    border-style: solid;
    font-size: 13px;
    justify-content: flex-start;
    padding: 10px 14px;
    text-align: left;
  }
}
/* Phones: back, number and the buttons share one row, like the knowledge
   base page - refresh, re-pair and disconnect as icon buttons (names in
   their tooltips). The status sits on the details line under the number. */
@media (max-width: 640px) {
  .phone-detail-top { gap: 10px; }
  .phone-detail-title { font-size: 17px; line-height: 1.25; }
  .phone-detail-line { margin-top: 3px; row-gap: 0; }
  .phone-detail-buttons { flex-wrap: nowrap; gap: 6px; }
  .phone-detail-buttons .phone-outline-btn,
  .phone-detail-buttons .phone-outline-btn.has-text { border-radius: 10px; height: 38px; min-width: 38px; padding: 0; width: 38px; }
  .phone-detail-buttons .phone-btn-label { display: none; }
  .phone-detail-buttons .phone-btn-phone-icon { display: block; }
}
/* Phones, and small laptops where the sidebar and list leave a narrow pane:
   the agent picker loses two of its three frames so it gets the card's whole
   width. */
@media (max-width: 640px), (min-width: 901px) and (max-width: 1100px) {
  .phone-config-section { gap: 14px; padding: 14px; }
  .phone-settings-grid > .phone-setting-row { background: none; border: 0; border-radius: 0; padding: 0; }
  .phone-setting-row { align-items: center; gap: 12px 10px; }
  .phone-setting-row > .phone-setting-body { display: contents; }
  .phone-setting-row .phone-assignment-grid { grid-column: 1 / -1; }
  .phone-setting-copy { margin-top: 0; }
}
@media (min-width: 901px) and (max-width: 1100px) {
  .phone-pane-list { flex-basis: 230px; }
}
/* Wide screens: a little more room around the capped content. */
@media (min-width: 1680px) {
  .phone-content { padding: 28px 40px 36px; }
}
@media (max-width: 1180px) {
  .phone-qr-layout { grid-template-columns: 1fr; }
}
/* Beside the QR the settings column is too narrow for two pickers side by side. */
@media (min-width: 1181px) {
  .phone-qr-layout .phone-setting-span .phone-assignment-grid { grid-template-columns: 1fr; }
}
/* Laptops: the last-connected time goes, and the agent pickers drop under
   the number so neither side is squeezed. */
@media (max-width: 1080px) {
  .phone-row { gap: 10px 14px; grid-template-areas: "avatar identity status" "avatar agents agents"; grid-template-columns: 36px minmax(0, 1fr) auto; }
  .phone-row-time { display: none; }
}
@media (max-width: 1100px) {
  .phone-content { padding: 20px 20px 28px; }
  .phone-expandable-card { max-height: min(760px, calc(100dvh - 32px)); }
  .expandable-card-stage { padding: 16px; }
}
/* Tablets and phones: the sidebar becomes a drawer behind a sticky top bar. */
@media (max-width: 900px) {
  .phone-shell { display: block; min-height: 100dvh; max-width: 100%; width: 100%; }
  .phone-content { padding: 16px; }
  .phone-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
  .phone-detail-topbar { align-items: flex-start; flex-direction: column; }
  .phone-top-actions { justify-content: flex-start; }
}
@media (max-width: 780px) {
  .phone-settings-grid { grid-template-columns: 1fr; }
}
/* Phones: one column, the search gets its own line, and the number's detail
   card goes full screen. */
@media (max-width: 640px) {
  .phone-content { padding: 12px 12px calc(16px + env(safe-area-inset-bottom)); }
  .phone-toolbar { gap: 8px; }
  .phone-toolbar .phone-search-wrap { flex: 1 1 100%; max-width: none; }
  .phone-count { margin-left: 0; margin-right: auto; order: 2; }
  .phone-view-toggle { order: 3; }
  .phone-create-btn { min-height: 36px; order: 4; }
  .phone-search, .phone-input { font-size: 16px; } /* stops iOS zooming on focus */
  .phone-grid { grid-template-columns: 1fr; }
  .phone-card-item, .phone-add-card { min-height: 0; }
  .phone-card-item:hover { transform: none; }
  .phone-row { padding: 12px; }
  .phone-top-btn, .phone-ghost-btn, .phone-danger-btn { width: 100%; }
  .phone-top-actions { width: 100%; }
  .phone-empty-workspace { min-height: 240px; padding: 28px 18px; }
  .expandable-card-stage { align-items: stretch; padding: 0; }
  .phone-expandable-card { border: 0; border-radius: 0; height: 100dvh; max-height: 100dvh; max-width: none; }
  .phone-expandable-head { gap: 10px; padding: 14px; }
  .phone-expandable-head .phone-summary-icon { height: 38px; width: 38px; }
  .phone-expandable-title { font-size: 16px; }
  .phone-expandable-body { flex: 1 1 auto; padding: 12px; }
  .phone-expandable-actions { padding: 12px 12px calc(12px + env(safe-area-inset-bottom)); }
  .phone-expandable-actions .phone-top-btn, .phone-expandable-actions .phone-danger-btn { flex: 1 1 auto; width: auto; }
  .phone-setting-span .phone-assignment-grid { grid-template-columns: 1fr; }
  .phone-modal-backdrop { align-items: center; padding: 16px; }
  .phone-modal-card { border-radius: 18px; max-height: calc(100dvh - 32px); max-width: none; overflow-y: auto; width: 100%; }
  .phone-modal-head, .phone-modal-body { padding: 16px; }
  .phone-modal-footer { flex-direction: column-reverse; padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); }
  .phone-modal-footer > * { width: 100%; }
  .phone-toast { bottom: calc(16px + env(safe-area-inset-bottom)); max-width: calc(100vw - 24px); width: max-content; }
}
/* Narrow phones: the create button keeps only its icon. */
@media (max-width: 400px) {
  .phone-create-label { display: none; }
  .phone-create-btn { padding: 0 10px; }
  .phone-row { gap: 8px 10px; grid-template-columns: 32px minmax(0, 1fr) auto; }
  .phone-row > .phone-card-avatar { height: 32px; width: 32px; }
  .phone-expandable-head .phone-summary-icon { display: none; }
}
`;

// formatShortDate is the card-footer form of a timestamp: the grid only has
// room for the day, the detail panel still spells the full date out.
function formatShortDate(value: string | null | undefined) {
  if (!value) return "Never connected";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return shortDateFormatter.format(date);
}

// assignmentKey identifies one number's one direction, so a save started from
// any view marks only the picker it came from as busy.
function assignmentKey(phoneNumberId: string, direction: AssignableDirection) {
  return `${phoneNumberId}:${direction}`;
}

function displayName(phoneNumber: ApiPhoneNumber) {
  return phoneNumber.label || phoneNumber.phone_number || "WhatsApp number";
}

function displayNumber(phoneNumber: ApiPhoneNumber) {
  return phoneNumber.phone_number || phoneNumber.wa_jid || "Not provided";
}

function rowActionLabel(phoneNumber: ApiPhoneNumber, busy: boolean) {
  if (phoneNumber.status === "connected") {
    return busy ? "Disconnecting..." : "Disconnect";
  }
  return busy ? "Removing..." : "Remove";
}

function statusClass(status: PhoneNumberStatus) {
  if (status === "connected") return "phone-status-connected";
  if (status === "pending_qr") return "phone-status-pending";
  if (status === "failed" || status === "expired") return "phone-status-failed";
  return "phone-status-neutral";
}

// Retell shows ids shortened in the middle; the copy button copies the full id.
function shortId(id: string) {
  return id.length > 12 ? `${id.slice(0, 4)}...${id.slice(-3)}` : id;
}

function upsertPhoneNumber(current: ApiPhoneNumber[], phoneNumber: ApiPhoneNumber) {
  return [phoneNumber, ...current.filter((item) => item.id !== phoneNumber.id)];
}

function normalizeVoiceAgent(agent: ApiAgentResource): AssignedAgent {
  return {
    id: agent.id,
    kind: "voice",
    name: agent.agent?.name?.trim() || "Unnamed agent",
    phoneNumberId: agent.agent?.phone_number_id ?? null,
    status: agent.agent?.status || "unknown",
  };
}

function normalizeChatAgent(agent: ApiChatAgent): AssignedAgent {
  return {
    id: agent.id,
    kind: "chat",
    name: agent.agent.name.trim() || "Unnamed agent",
    phoneNumberId: agent.agent.phone_number_id ?? null,
    status: agent.agent.status || "unknown",
  };
}

function phoneAssignments(phoneNumberId: string | null, agents: AssignedAgent[]): PhoneAssignments {
  if (!phoneNumberId) return { voice: null };
  return {
    voice: agents.find((agent) => agent.kind === "voice" && agent.phoneNumberId === phoneNumberId) ?? null,
  };
}

function chatAssignment(phoneNumberId: string | null, agents: AssignedAgent[]) {
  if (!phoneNumberId) return null;
  return agents.find((agent) => agent.kind === "chat" && agent.phoneNumberId === phoneNumberId) ?? null;
}

function upsertVoiceAgents(current: ApiAgentResource[], updated: ApiAgentResource[]) {
  return current.map((agent) => updated.find((item) => item.id === agent.id) ?? agent);
}

function upsertChatAgents(current: ApiChatAgent[], updated: ApiChatAgent[]) {
  return current.map((agent) => updated.find((item) => item.id === agent.id) ?? agent);
}

export default function PhoneNumbersPage({ phoneNumberId }: { phoneNumberId?: string } = {}) {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn: isAuthSignedIn } = useAuth();
  const { mode } = useWorkspaceMode();
  const [phoneNumbers, setPhoneNumbers, hasCachedNumbers] = useCachedState<ApiPhoneNumber[]>(`phone-numbers:${mode}`, []);
  const [voiceAgents, setVoiceAgents] = useCachedState<ApiAgentResource[]>("voice-agents", []);
  const [chatAgents, setChatAgents] = useCachedState<ApiChatAgent[]>("chat-agents", []);
  // The selected number comes from the URL: /dashboard/phone-numbers/<id>
  // opens it on its own page, the bare list route shows the grid.
  const selectedId = phoneNumberId ?? null;
  // Read by the list load only, so opening another number doesn't refetch it.
  const selectedIdRef = useRef(selectedId);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);
  const openNumber = useCallback(
    (id: string, replace = false) => {
      const href = `${dashboardHref("/phone-numbers", mode)}/${encodeURIComponent(id)}`;
      if (replace) router.replace(href);
      else router.push(href);
    },
    [mode, router]
  );
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [activeLogin, setActiveLogin] = useState<ApiPhoneNumber | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  // Assignment can now be driven from the browse view too, where several
  // numbers are on screen at once, so the in-flight marker is per number and
  // direction rather than a single direction.
  const [assigningKey, setAssigningKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const isAuthenticated = Boolean(isUserLoaded && isAuthLoaded && isUserSignedIn && isAuthSignedIn && user);
  const authError =
    !isUserLoaded || !isAuthLoaded
      ? null
      : !isUserSignedIn || !isAuthSignedIn || !user
        ? "Sign in to manage phone numbers."
        : null;
  // Numbers cached from an earlier visit stay on screen while they refetch
  // (and while Clerk is still loading after a reload) instead of a skeleton.
  const pendingLoadState = !isUserLoaded || !isAuthLoaded ? "loading" : authError ? "error" : loadState;
  const effectiveLoadState = pendingLoadState === "loading" && hasCachedNumbers ? "ready" : pendingLoadState;
  const effectiveLoadError = authError ?? loadError;
  const agents = useMemo(
    () => mode === "chat" ? chatAgents.map(normalizeChatAgent) : voiceAgents.map(normalizeVoiceAgent),
    [chatAgents, mode, voiceAgents]
  );
  // Retell-style master-detail: the bare route opens the first number, a URL
  // id opens that one (null while it is missing).
  const selectedPhoneNumber = selectedId
    ? phoneNumbers.find((item) => item.id === selectedId) ?? null
    : phoneNumbers[0] ?? null;
  function copyId(id: string) {
    void navigator.clipboard?.writeText(id).then(() => {
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
    });
  }
  const selectedAssignments = useMemo(
    () => phoneAssignments(selectedPhoneNumber?.id ?? null, agents),
    [agents, selectedPhoneNumber?.id]
  );
  const activeLoginID = activeLogin?.id;
  const activeLoginStatus = activeLogin?.status;
  const selectedPendingLoginID = selectedPhoneNumber?.status === "pending_qr" ? selectedPhoneNumber.id : null;

  useEffect(() => {
    if (!isUserLoaded || !isAuthLoaded) return;
    if (!isAuthenticated) return;

    let cancelled = false;
    // The list never includes a login nobody has scanned yet (the server hides
    // drafts), so a number opened on its own page that the list lacks is asked
    // for by id. Without this, Create opened the new login's page, this load
    // replaced the list, and the page said "not found" with no QR on it.
    const withOpenedNumber = async (rows: ApiPhoneNumber[]) => {
      const openedId = selectedIdRef.current;
      if (!openedId || rows.some((row) => row.id === openedId)) return rows;
      const opened = await apiGetPhoneNumber(openedId, getToken, mode).catch(() => null);
      return opened ? upsertPhoneNumber(rows, opened) : rows;
    };
    (async () => {
      setLoadState("loading");
      setLoadError("");
      try {
        if (mode === "chat") {
          const [rows, agentRows] = await Promise.all([
            apiListPhoneNumbers(getToken, mode).then(withOpenedNumber),
            apiListChatAgents(getToken),
          ]);
          if (cancelled) return;
          setPhoneNumbers(rows);
          setChatAgents(agentRows);
        } else {
          const [rows, agentRows] = await Promise.all([
            apiListPhoneNumbers(getToken, mode).then(withOpenedNumber),
            apiListAgents(getToken),
          ]);
          if (cancelled) return;
          setPhoneNumbers(rows);
          setVoiceAgents(agentRows);
        }
        setLoadState("ready");
      } catch (error) {
        if (cancelled) return;
        if (mode === "chat") setChatAgents([]);
        else setVoiceAgents([]);
        setLoadState("error");
        setLoadError(error instanceof Error ? error.message : "Failed to load phone numbers");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isAuthenticated, isAuthLoaded, isUserLoaded, mode, reloadKey, setChatAgents, setPhoneNumbers, setVoiceAgents]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!activeLoginID || !activeLoginStatus || terminalStatuses.has(activeLoginStatus)) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const updated = await apiGetPhoneNumber(activeLoginID, getToken, mode);
        if (cancelled) return;
        setActiveLogin(updated);
        setPhoneNumbers((current) => upsertPhoneNumber(current, updated));
        if (terminalStatuses.has(updated.status)) {
          setReloadKey((key) => key + 1);
          if (updated.status === "connected") {
            setNotice({ kind: "success", text: "Phone number connected" });
          } else {
            setNotice({ kind: "error", text: `Phone number login ${statusLabels[updated.status].toLowerCase()}` });
          }
        }
      } catch (error) {
        if (!cancelled) {
          setNotice({
            kind: "error",
            text: error instanceof Error ? error.message : "Failed to poll phone number status",
          });
        }
      }
    };

    const stopPolling = startPolling(poll, 2500);

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [activeLoginID, activeLoginStatus, getToken, mode, setPhoneNumbers]);

  useEffect(() => {
    if (!selectedPendingLoginID || selectedPendingLoginID === activeLoginID) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const updated = await apiGetPhoneNumber(selectedPendingLoginID, getToken, mode);
        if (cancelled) return;
        setPhoneNumbers((current) => upsertPhoneNumber(current, updated));
        if (terminalStatuses.has(updated.status)) {
          setReloadKey((key) => key + 1);
          if (updated.status === "connected") {
            setNotice({ kind: "success", text: "Phone number connected" });
          } else {
            setNotice({ kind: "error", text: `Phone number login ${statusLabels[updated.status].toLowerCase()}` });
          }
        }
      } catch (error) {
        if (!cancelled) {
          setNotice({
            kind: "error",
            text: error instanceof Error ? error.message : "Failed to poll phone number status",
          });
        }
      }
    };

    const stopPolling = startPolling(poll, 2500);

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [activeLoginID, getToken, mode, selectedPendingLoginID, setPhoneNumbers]);

  // With a phone number it links by pairing code (the create modal on a phone)
  // rather than by QR.
  async function startLogin(phone?: string) {
    if (isStarting || !isAuthenticated) return;

    setIsStarting(true);
    try {
      const payload = label.trim() ? { label: label.trim() } : {};
      const started = phone
        ? await apiStartPhoneNumberCodeLogin({ ...payload, phone_number: phone }, getToken, mode)
        : await apiStartPhoneNumberLogin(payload, getToken, mode);
      setActiveLogin(started);
      setPhoneNumbers((current) => upsertPhoneNumber(current, started));
      openNumber(started.id);
      setLabel("");
      setIsCreateOpen(false);
      setNotice({ kind: "success", text: "Phone number login started" });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to start phone number login",
      });
    } finally {
      setIsStarting(false);
    }
  }

  // Swaps the selected login for a new one: a typed pairing code in place of a
  // QR login or an earlier code, or a QR login in place of a code. The server
  // ends the old login, so it leaves the list and the new one takes its place.
  // Throws for WhatsAppLinkHelp to show the message.
  async function replaceLogin(start: (payload: { label?: string }) => Promise<ApiPhoneNumber>) {
    const replaced = selectedPhoneNumber?.status === "pending_qr" ? selectedPhoneNumber : null;
    setIsRestarting(true);
    try {
      const started = await start(replaced?.label ? { label: replaced.label } : {});
      setActiveLogin(started);
      setPhoneNumbers((current) =>
        upsertPhoneNumber(current.filter((entry) => entry.id !== replaced?.id), started)
      );
      if (started.id !== replaced?.id) openNumber(started.id, true);
    } finally {
      setIsRestarting(false);
    }
  }

  const startCodeLogin = (phone: string) =>
    replaceLogin((payload) => apiStartPhoneNumberCodeLogin({ ...payload, phone_number: phone }, getToken, mode));
  const startQrLogin = () => replaceLogin((payload) => apiStartPhoneNumberQrLogin(payload, getToken, mode));

  async function disconnect(phone: ApiPhoneNumber) {
    if (disconnectingId) return;
    const action = phone.status === "connected" ? "Disconnect and remove" : "Remove";
    const confirmed = window.confirm(`${action} ${displayName(phone)}?`);
    if (!confirmed) return;

    setDisconnectingId(phone.id);
    try {
      await apiLogoutPhoneNumber(phone.id, getToken, mode);
      const remaining = phoneNumbers.filter((item) => item.id !== phone.id);
      setPhoneNumbers(remaining);
      if (selectedId === phone.id) router.push(dashboardHref("/phone-numbers", mode));
      if (activeLogin?.id === phone.id) setActiveLogin(null);
      setNotice({ kind: "success", text: `${displayName(phone)} removed` });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to remove phone number",
      });
    } finally {
      setDisconnectingId(null);
    }
  }

  async function assignAgent(phone: ApiPhoneNumber, direction: AssignableDirection, nextAgentId: string) {
    if (!isAuthenticated || assigningKey) return;

    setAssigningKey(assignmentKey(phone.id, direction));
    try {
      if (direction === "chat") {
        // Clear the current holder before assigning the replacement. The chat
        // agent table enforces one agent per number, so doing both writes in
        // parallel can race the unique constraint.
        const currentHolders = chatAgents.filter(
          (agent) => agent.agent.phone_number_id === phone.id && agent.id !== nextAgentId
        );
        const updatedChatAgents: ApiChatAgent[] = [];
        for (const holder of currentHolders) {
          updatedChatAgents.push(
            await apiUpdateChatAgent(
              holder.id,
              { agent: { phone_number_id: null, status: "inactive" } },
              getToken
            )
          );
        }
        if (nextAgentId) {
          updatedChatAgents.push(
            await apiUpdateChatAgent(nextAgentId, { agent: { phone_number_id: phone.id } }, getToken)
          );
        }
        setChatAgents((existing) => upsertChatAgents(existing, updatedChatAgents));
        setNotice({ kind: "success", text: "Chat agent updated" });
        return;
      }

      // A voice number has one agent, which answers its calls and places calls
      // from it. Clear the current holder before assigning the replacement so
      // the two writes never hold the number at once.
      const currentHolders = voiceAgents.filter(
        (agent) => agent.agent?.phone_number_id === phone.id && agent.id !== nextAgentId
      );
      const updatedAgents: ApiAgentResource[] = [];
      for (const holder of currentHolders) {
        updatedAgents.push(await apiUpdateAgent(holder.id, { agent: { phone_number_id: null } }, getToken));
      }
      if (nextAgentId) {
        updatedAgents.push(await apiUpdateAgent(nextAgentId, { agent: { phone_number_id: phone.id } }, getToken));
      }
      setVoiceAgents((existing) => upsertVoiceAgents(existing, updatedAgents));
      setNotice({ kind: "success", text: "Voice agent updated" });
    } catch (error) {
      if (direction === "chat") setReloadKey((key) => key + 1);
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to update selected agent",
      });
    } finally {
      setAssigningKey(null);
    }
  }

  async function refresh() {
    if (!isAuthenticated) return;

    // The server won't restart a login that is still running, so while a
    // pairing code is on screen Refresh asks for a new one.
    const codeNumber =
      selectedPhoneNumber?.status === "pending_qr" && selectedPhoneNumber.pairing_code
        ? selectedPhoneNumber.phone_number
        : null;
    if (codeNumber) {
      if (isRestarting) return;
      try {
        await startCodeLogin(codeNumber);
        setNotice({ kind: "success", text: "New code sent. The last code no longer works." });
      } catch (error) {
        setNotice({
          kind: "error",
          text: error instanceof Error ? error.message : "Could not get a code. Try again.",
        });
      }
      return;
    }
    if (selectedPhoneNumber?.status === "pending_qr" && selectedPhoneNumber.qr_code) {
      setNotice({ kind: "success", text: "This QR code renews by itself. Scan it when you're ready." });
      return;
    }

    // For a number whose login ended (expired/failed/disconnected), Refresh
    // restarts the login session so a fresh QR code is issued. Otherwise it
    // just reloads the list.
    if (loadState === "ready" && selectedPhoneNumber && restartableStatuses.has(selectedPhoneNumber.status)) {
      if (isRestarting) return;
      setIsRestarting(true);
      try {
        const previousId = selectedPhoneNumber.id;
        const restarted = await apiRestartPhoneNumberLogin(previousId, getToken, undefined, mode);
        setActiveLogin(restarted);
        // Restarting a login that was never scanned starts a new one — the old
        // one was never a phone number and is gone — so the entry it was shown
        // under is replaced rather than joined by a second one.
        setPhoneNumbers((current) =>
          upsertPhoneNumber(
            restarted.id === previousId ? current : current.filter((item) => item.id !== previousId),
            restarted
          )
        );
        if (restarted.id !== previousId) openNumber(restarted.id, true);
        setNotice({ kind: "success", text: "New login session started. Scan the QR code with WhatsApp." });
      } catch (error) {
        setNotice({
          kind: "error",
          text: error instanceof Error ? error.message : "Failed to restart phone number login",
        });
      } finally {
        setIsRestarting(false);
      }
      return;
    }

    setLoadState("loading");
    setReloadKey((key) => key + 1);
  }

  async function rePair() {
    if (!isAuthenticated || !selectedPhoneNumber || selectedPhoneNumber.status !== "connected" || isRestarting) return;
    const confirmed = window.confirm(
      `Re-pair ${displayName(selectedPhoneNumber)}? This unlinks only its current WhatsApp companion and keeps the phone-number row and agent assignments.`
    );
    if (!confirmed) return;

    setIsRestarting(true);
    try {
      const restarted = await apiRePairPhoneNumber(selectedPhoneNumber.id, getToken, mode);
      setActiveLogin(restarted);
      setPhoneNumbers((current) => upsertPhoneNumber(current, restarted));
      if (restarted.id !== selectedPhoneNumber.id) openNumber(restarted.id, true);
      setNotice({ kind: "success", text: "Old companion unlinked. Scan the new QR code once." });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to re-pair phone number",
      });
    } finally {
      setIsRestarting(false);
    }
  }

  return (
    <div className="phone-shell app-accent-green">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <DashboardSidebar activeLabel="Phone Numbers" stackBelow={900} />

      <main className="phone-main">
        <div className={`phone-split${phoneNumberId ? " has-selection" : ""}`}>
          <aside aria-label="Phone numbers" className="phone-pane-list">
            <div className="phone-pane-head">
              <Icon name="phone" size={17} sw={1.8} />
              <h1 className="phone-pane-title">Phone Numbers</h1>
              <button
                aria-label="New Number"
                className="phone-pane-add"
                disabled={!isAuthenticated}
                onClick={() => setIsCreateOpen(true)}
                title="New Number"
                type="button"
              >
                <Icon name="plus" size={16} sw={2.4} />
              </button>
            </div>
            <nav className="phone-pane-items">
              {effectiveLoadState === "loading" && phoneNumbers.length === 0 ? (
                <PaneListSkeleton rows={4} />
              ) : effectiveLoadState === "error" && phoneNumbers.length === 0 ? (
                <div className="phone-pane-note">
                  <p>{effectiveLoadError}</p>
                  {isAuthenticated ? (
                    <button className="phone-ghost-btn" onClick={refresh} type="button">
                      <Icon name="refresh" size={15} />
                      Try again
                    </button>
                  ) : null}
                </div>
              ) : phoneNumbers.length === 0 ? (
                <p className="phone-pane-note">No phone numbers yet.</p>
              ) : (
                phoneNumbers.map((item) => {
                  const isActive = selectedPhoneNumber?.id === item.id;
                  return (
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={`phone-pane-item${isActive ? " is-active" : ""}`}
                      href={`${dashboardHref("/phone-numbers", mode)}/${encodeURIComponent(item.id)}`}
                      key={item.id}
                    >
                      <Icon name="phone" size={16} sw={1.8} />
                      <span className="phone-pane-item-name notranslate">{displayName(item)}</span>
                      <span
                        className={`phone-pane-item-dot ${statusClass(item.status)}`}
                        title={statusLabels[item.status]}
                      />
                    </Link>
                  );
                })
              )}
            </nav>
          </aside>

          <section className="phone-pane-detail">
            <Link className="phone-pane-back" href={dashboardHref("/phone-numbers", mode)}>
              <Icon name="back" size={15} sw={2.2} />
              Phone Numbers
            </Link>
            {selectedPhoneNumber ? (
              <>
                <header className="phone-detail-top">
                  <Link aria-label="Back to phone numbers" className="phone-detail-back" href={dashboardHref("/phone-numbers", mode)}>
                    <Icon name="back" size={16} sw={2.4} />
                  </Link>
                  <div className="phone-detail-identity">
                    <h2 className="phone-detail-title notranslate">{displayName(selectedPhoneNumber)}</h2>
                    <div className="phone-detail-line">
                      <span className="phone-detail-line-item">
                        ID: {shortId(selectedPhoneNumber.id)}
                        <button
                          aria-label="Copy ID"
                          className="phone-copy"
                          onClick={() => copyId(selectedPhoneNumber.id)}
                          title={copiedId === selectedPhoneNumber.id ? "Copied" : "Copy ID"}
                          type="button"
                        >
                          <Icon name={copiedId === selectedPhoneNumber.id ? "check" : "copy"} size={13} />
                        </button>
                      </span>
                      <span className="phone-detail-line-item">
                        <span className={`phone-status-line ${statusClass(selectedPhoneNumber.status)}`}>
                          {selectedPhoneNumber.status === "connected" ? (
                            <Icon name="check" size={13} sw={2.4} />
                          ) : (
                            <span className="phone-dot" />
                          )}
                          {statusLabels[selectedPhoneNumber.status]}
                        </span>
                      </span>
                      <span className="phone-detail-line-item notranslate">
                        WhatsApp · {displayNumber(selectedPhoneNumber)}
                      </span>
                      {selectedPhoneNumber.last_connected_at ? (
                        <span className="phone-detail-line-item">
                          <span>Last connected {formatShortDate(selectedPhoneNumber.last_connected_at)}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="phone-detail-buttons">
                    <button
                      aria-label="Refresh"
                      className="phone-outline-btn"
                      disabled={!isAuthenticated || effectiveLoadState === "loading" || isRestarting}
                      onClick={refresh}
                      title="Refresh"
                      type="button"
                    >
                      <Icon name="refresh" size={15} />
                    </button>
                    {selectedPhoneNumber.status === "connected" ? (
                      <button
                        aria-label={isRestarting ? "Re-pairing" : "Re-pair"}
                        className="phone-outline-btn has-text"
                        disabled={!isAuthenticated || effectiveLoadState === "loading" || isRestarting}
                        onClick={rePair}
                        title="Re-pair"
                        type="button"
                      >
                        <Icon className="phone-btn-phone-icon" name="link" size={15} />
                        <span className="phone-btn-label">{isRestarting ? "Re-pairing..." : "Re-pair"}</span>
                      </button>
                    ) : null}
                    <button
                      className="phone-outline-btn has-text is-danger"
                      disabled={disconnectingId === selectedPhoneNumber.id}
                      onClick={() => disconnect(selectedPhoneNumber)}
                      title={rowActionLabel(selectedPhoneNumber, disconnectingId === selectedPhoneNumber.id)}
                      type="button"
                    >
                      <Icon name="logOut" size={15} />
                      <span className="phone-btn-label">
                        {rowActionLabel(selectedPhoneNumber, disconnectingId === selectedPhoneNumber.id)}
                      </span>
                    </button>
                  </div>
                </header>

                <PhoneNumberDetail
                  agents={agents}
                  assignments={selectedAssignments}
                  assigningKey={assigningKey}
                  effectiveLoadError={effectiveLoadError}
                  effectiveLoadState={effectiveLoadState}
                  isAuthenticated={isAuthenticated}
                  isRestarting={isRestarting}
                  mode={mode}
                  onAssignAgent={assignAgent}
                  onCreate={() => setIsCreateOpen(true)}
                  onRequestCode={startCodeLogin}
                  onRequestQr={startQrLogin}
                  onRetry={refresh}
                  phoneNumber={selectedPhoneNumber}
                />
              </>
            ) : phoneNumberId ? (
              <div className="phone-empty-workspace">
                {pendingLoadState === "loading" ? (
                  <p>Loading phone number...</p>
                ) : effectiveLoadState === "error" ? (
                  <p>{effectiveLoadError}</p>
                ) : (
                  <p>This phone number was not found. It may have been removed.</p>
                )}
              </div>
            ) : effectiveLoadState === "ready" && phoneNumbers.length === 0 ? (
              <div className="phone-empty-workspace">
                <p>
                  {mode === "chat"
                    ? "No phone numbers yet. Pair a WhatsApp number by QR so a chat agent can reply to messages."
                    : "No phone numbers yet. Pair a WhatsApp number by QR to give your voice agents a line to call and answer on."}
                </p>
                <button className="phone-create-btn" disabled={!isAuthenticated} onClick={() => setIsCreateOpen(true)} type="button">
                  <Icon name="plus" size={14} stroke="#fff" sw={2.4} />
                  New Number
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </main>

      {isCreateOpen ? (
        <CreatePhoneNumberModal
          isAuthenticated={isAuthenticated}
          isStarting={isStarting}
          label={label}
          onCancel={() => setIsCreateOpen(false)}
          onLabelChange={setLabel}
          onStart={startLogin}
        />
      ) : null}

      {notice ? (
        <div className={`phone-toast ${notice.kind === "error" ? "phone-toast-error" : "phone-toast-success"}`} role="status">
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

function PhoneNumberDetail({
  agents,
  assignments,
  assigningKey,
  effectiveLoadError,
  effectiveLoadState,
  isAuthenticated,
  isRestarting,
  mode,
  onAssignAgent,
  onCreate,
  onRequestCode,
  onRequestQr,
  onRetry,
  phoneNumber,
}: {
  agents: AssignedAgent[];
  assignments: PhoneAssignments;
  assigningKey: string | null;
  effectiveLoadError: string;
  effectiveLoadState: "loading" | "ready" | "error";
  isAuthenticated: boolean;
  isRestarting: boolean;
  mode: WorkspaceMode;
  onAssignAgent: (phone: ApiPhoneNumber, direction: AssignableDirection, agentId: string) => void;
  onCreate: () => void;
  onRequestCode: (phone: string) => Promise<void>;
  onRequestQr: () => Promise<void>;
  onRetry: () => void;
  phoneNumber: ApiPhoneNumber | null;
}) {
  if (effectiveLoadState === "loading" && !phoneNumber) {
    return <div className="phone-empty-workspace">Loading phone numbers...</div>;
  }

  if (effectiveLoadState === "error") {
    return (
      <div className="phone-empty-workspace">
        <p>{effectiveLoadError}</p>
        {isAuthenticated ? (
          <button className="phone-ghost-btn" onClick={onRetry} type="button">
            Try again
          </button>
        ) : (
          <Link className="phone-ghost-btn" href="/">
            Go to sign in
          </Link>
        )}
      </div>
    );
  }

  if (!phoneNumber) {
    return (
      <div className="phone-empty-workspace">
        <p>No phone numbers have been created for this account.</p>
        <button className="phone-ghost-btn" disabled={!isAuthenticated} onClick={onCreate} type="button">
          <Icon name="plus" size={15} />
          Create Phone Number
        </button>
      </div>
    );
  }

  return (
    <div className="phone-detail-content">
      <section className="phone-config-section" aria-labelledby="phone-number-details-title">
        <div className="phone-section-head">
          <h2 className="phone-section-title" id="phone-number-details-title">Phone Number Details</h2>
          <div className="phone-section-copy">
            {mode === "chat"
              ? "Assign the chat agent that handles messages for this number."
              : "Assign the voice agent that answers and places calls on this number."}
          </div>
        </div>

        <div className="phone-qr-layout">
          <div className="phone-settings-grid">
            <div className="phone-setting-row phone-setting-span">
              <div className="phone-setting-icon">
                <Icon name="agents" size={16} />
              </div>
              <div className="phone-setting-body">
                <div>
                  <div className="phone-setting-label">Selected Agents</div>
                  <div className="phone-setting-copy">
                    {mode === "chat"
                      ? "Chat agent currently assigned to this number."
                      : "Voice agent that answers and places calls on this number."}
                  </div>
                </div>
                <div className="phone-assignment-grid phone-assignment-grid-single">
                  {mode === "chat" ? (
                    <AssignmentRow
                      agent={chatAssignment(phoneNumber.id, agents)}
                      agents={agents}
                      direction="chat"
                      disabled={!isAuthenticated || phoneNumber.status !== "connected" || assigningKey !== null}
                      isSaving={assigningKey === assignmentKey(phoneNumber.id, "chat")}
                      onChange={(agentId) => onAssignAgent(phoneNumber, "chat", agentId)}
                    />
                  ) : (
                    <AssignmentRow
                      agent={assignments.voice}
                      agents={agents}
                      direction="voice"
                      disabled={!isAuthenticated || phoneNumber.status !== "connected" || assigningKey !== null}
                      isSaving={assigningKey === assignmentKey(phoneNumber.id, "voice")}
                      onChange={(agentId) => onAssignAgent(phoneNumber, "voice", agentId)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="phone-qr-column">
            {phoneNumber.status === "pending_qr" ? (
              <WhatsAppLinkHelp
                disabled={!isAuthenticated || isRestarting}
                login={phoneNumber}
                onRequestCode={onRequestCode}
                onRequestQr={onRequestQr}
                qr={
                  phoneNumber.qr_code ? (
                    <div className="phone-qr-frame">
                      <Image
                        alt="WhatsApp login QR code"
                        className="phone-qr-image"
                        height={280}
                        src={phoneNumber.qr_code}
                        unoptimized
                        width={280}
                      />
                    </div>
                  ) : (
                    <div className="phone-qr-placeholder">Waiting for QR code...</div>
                  )
                }
              />
            ) : (
              <div className="phone-qr-placeholder is-status">
                {statusLabels[phoneNumber.status]}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function agentOptionMeta(agent: AssignedAgent) {
  return `${agent.kind === "chat" ? "Chat" : "Voice"} agent - ${agent.status}`;
}

function AssignmentRow({
  agent,
  agents,
  disabled,
  direction,
  isSaving,
  onChange,
}: {
  agent: AssignedAgent | null;
  agents: AssignedAgent[];
  disabled: boolean;
  direction: AssignableDirection;
  isSaving: boolean;
  onChange: (agentId: string) => void;
}) {
  const directionLabel = direction === "chat" ? "Chat" : "Voice";

  return (
    <div className={`phone-assignment-row${agent ? "" : " is-empty"}`}>
      <div className="phone-assignment-head">
        <span className="phone-assignment-direction">{directionLabel}</span>
        {agent ? (
          <div className="phone-assignment-meta">
            <span>{isSaving ? "Saving..." : agent.status}</span>
          </div>
        ) : (
          <div className="phone-assignment-meta">{isSaving ? "Saving..." : "Not assigned"}</div>
        )}
      </div>
      <AgentSelect
        agents={agents}
        disabled={disabled}
        label={`${directionLabel} agent`}
        onChange={onChange}
        value={agent?.id ?? ""}
      />
    </div>
  );
}

function AgentSelect({
  agents,
  disabled,
  icon,
  label,
  onChange,
  placeholder = "No agent selected",
  prefix,
  saving = false,
  title,
  value,
  variant = "full",
}: {
  agents: AssignedAgent[];
  disabled: boolean;
  icon?: IconName;
  label: string;
  onChange: (agentId: string) => void;
  placeholder?: string;
  prefix?: string;
  saving?: boolean;
  title?: string;
  value: string;
  variant?: "full" | "chip";
}) {
  const [open, setOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const selected = agents.find((item) => item.id === value) ?? null;
  const isOpen = open && !disabled;
  const isChip = variant === "chip";
  const minPopoverWidth = isChip ? 260 : 0;

  const updatePopoverStyle = useCallback(() => {
    const node = triggerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom - gap - 12;
    const spaceAbove = rect.top - gap - 12;
    const openUp = spaceBelow < 190 && spaceAbove > spaceBelow;
    // A chip trigger is far narrower than an agent name needs, so the popover
    // widens past it and is nudged back inside the viewport if that overflows.
    const width = Math.min(Math.max(rect.width, minPopoverWidth), window.innerWidth - 24);
    setPopoverStyle({
      bottom: openUp ? window.innerHeight - rect.top + gap : undefined,
      left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      maxHeight: Math.max(140, Math.min(260, openUp ? spaceAbove : spaceBelow)),
      top: openUp ? undefined : rect.bottom + gap,
      width,
    });
  }, [minPopoverWidth]);

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener("resize", updatePopoverStyle);
    window.addEventListener("scroll", updatePopoverStyle, true);
    return () => {
      window.removeEventListener("resize", updatePopoverStyle);
      window.removeEventListener("scroll", updatePopoverStyle, true);
    };
  }, [isOpen, updatePopoverStyle]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !popoverRef.current?.contains(target)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const options = [{ description: "Leave this direction unassigned", id: "", name: "No agent selected" }].concat(
    agents.map((item) => ({
      description: agentOptionMeta(item),
      id: item.id,
      name: item.name,
    })),
  );

  const toggle = () => {
    if (!open) updatePopoverStyle();
    setOpen((current) => !current);
  };

  return (
    <div className={`phone-agent-select${isChip ? " is-chip" : ""}${isOpen ? " is-open" : ""}`}>
      {isChip ? (
        <button
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
          className={`phone-card-agent phone-agent-chip${selected ? "" : " is-empty"}`}
          disabled={disabled}
          onClick={toggle}
          ref={triggerRef}
          title={title}
          type="button"
        >
          {icon ? <Icon name={icon} size={11} /> : null}
          {prefix ? (
            <>
              <span className="phone-agent-chip-label">{prefix}</span>
              <span className="phone-agent-chip-dot" />
            </>
          ) : null}
          <span className="phone-agent-chip-name">
            {saving ? "Saving..." : selected ? selected.name : placeholder}
          </span>
          <Icon className="phone-agent-chevron" name="chevron" size={11} sw={2.6} />
        </button>
      ) : (
        <button
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
          className="phone-agent-trigger"
          disabled={disabled}
          onClick={toggle}
          ref={triggerRef}
          title={title}
          type="button"
        >
          <span className={`phone-agent-avatar${selected ? "" : " is-empty"}`}>
            {selected ? selected.name.slice(0, 2) : "--"}
          </span>
          <span className={`phone-agent-name${selected ? "" : " is-placeholder"}`}>
            {selected ? selected.name : placeholder}
          </span>
          <Icon className="phone-agent-chevron" name="chevron" size={15} sw={2.4} />
        </button>
      )}
      {isOpen && popoverStyle
        ? createPortal(
            <div
              // Portalled outside .phone-shell, so it carries the accent itself.
              className="phone-agent-popover app-accent-green"
              data-expandable-card-ignore
              ref={popoverRef}
              role="listbox"
              style={popoverStyle}
            >
              {options.map((option) => {
                const isSelected = option.id === value;
                return (
                  <button
                    aria-selected={isSelected}
                    className={`phone-agent-option${isSelected ? " is-selected" : ""}`}
                    key={option.id || "none"}
                    onClick={() => {
                      setOpen(false);
                      if (option.id !== value) onChange(option.id);
                    }}
                    role="option"
                    title={option.name}
                    type="button"
                  >
                    <span className={`phone-agent-avatar${option.id ? "" : " is-empty"}`}>
                      {option.id ? option.name.slice(0, 2) : "--"}
                    </span>
                    <span className="phone-agent-option-label">
                      <span className="phone-agent-option-name">{option.name}</span>
                      <span className="phone-agent-option-meta">{option.description}</span>
                    </span>
                    <span className="phone-agent-option-check">
                      {isSelected ? <Icon name="check" size={14} sw={2.6} /> : null}
                    </span>
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function CreatePhoneNumberModal({
  isAuthenticated,
  isStarting,
  label,
  onCancel,
  onLabelChange,
  onStart,
}: {
  isAuthenticated: boolean;
  isStarting: boolean;
  label: string;
  onCancel: () => void;
  onLabelChange: (value: string) => void;
  onStart: (phone?: string) => void;
}) {
  // A phone can't scan its own screen, so it starts a pairing-code login from
  // the number instead, unless a second device is there to scan with.
  const isPhone = useIsPhone();
  const [wantsQr, setWantsQr] = useState(false);
  const byCode = isPhone && !wantsQr;
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState("");
  // Fetched as soon as the number field shows, so it is checked at once on submit.
  usePhoneNumberLib(byCode);
  // True while a submitted number is being checked, so a second press in that
  // moment doesn't start a second login.
  const checkingNumber = useRef(false);

  return (
    <div className="phone-modal-backdrop" onMouseDown={(event) => event.currentTarget === event.target && onCancel()}>
      <form
        className="phone-modal-card"
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();
          if (!byCode) {
            onStart();
            return;
          }
          if (checkingNumber.current) return;
          checkingNumber.current = true;
          const normalized = await normalizePhone(number);
          checkingNumber.current = false;
          if ("error" in normalized) {
            setNumberError(normalized.error);
            return;
          }
          setNumberError("");
          onStart(normalized.phone);
        }}
      >
        <div className="phone-modal-head">
          <div>
            <h2 className="phone-modal-title">Create Phone Number</h2>
            <div className="phone-modal-copy">
              {byCode
                ? "Enter the WhatsApp number to link. WhatsApp gives you a code to type in on this phone — no QR scan needed."
                : "Start a WhatsApp QR login session. The phone number is detected automatically after you scan the QR code."}
            </div>
          </div>
          <button aria-label="Close create phone number modal" className="phone-modal-close" onClick={onCancel} type="button">
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="phone-modal-body">
          <label className="phone-field">
            <span className="phone-field-label">Label</span>
            <input
              className="phone-input"
              maxLength={80}
              onChange={(event) => onLabelChange(event.target.value)}
              placeholder="Main support line"
              value={label}
            />
          </label>
          {byCode ? (
            <label className="phone-field">
              <span className="phone-field-label">WhatsApp number, with country code</span>
              <input
                autoComplete="tel"
                className="phone-input"
                inputMode="tel"
                onChange={(event) => setNumber(event.target.value)}
                placeholder="+880 1XXX XXXXXX"
                type="tel"
                value={number}
              />
              {numberError ? <span className="phone-field-error">{numberError}</span> : null}
            </label>
          ) : null}
          {isPhone ? (
            <button className="phone-modal-switch" onClick={() => setWantsQr(!wantsQr)} type="button">
              {wantsQr ? "Link with phone number instead" : "Scanning from another device? Use a QR code"}
            </button>
          ) : null}
        </div>
        <div className="phone-modal-footer">
          <button className="phone-top-btn" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="phone-ghost-btn" disabled={isStarting || !isAuthenticated} type="submit">
            <Icon name="plus" size={15} />
            {isStarting ? "Starting..." : byCode ? "Get code" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
