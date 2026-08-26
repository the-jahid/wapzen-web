"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearance } from "@/components/theme/clerkAppearance";
import {
  callStatuses,
  deleteCall as apiDeleteCall,
  getCall as apiGetCall,
  listCalls as apiListCalls,
  updateCall as apiUpdateCall,
  type ApiCall,
  type ApiCallMessage,
  type CallStatus,
} from "@/lib/calls";

type IconName =
  | "grid"
  | "agents"
  | "phone"
  | "phoneIn"
  | "phoneOut"
  | "calendar"
  | "chart"
  | "settings"
  | "spark"
  | "target"
  | "key"
  | "book"
  | "wrench"
  | "refresh"
  | "search"
  | "trash"
  | "message"
  | "clock"
  | "user"
  | "hash"
  | "check"
  | "save"
  | "x";

type NavItem = {
  label: string;
  icon: IconName;
  href?: string;
  badge?: string;
};

type DetailState = "idle" | "loading" | "ready" | "error";
type Notice = { kind: "success" | "error"; text: string };

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "grid", href: "/dashboard" },
  { label: "Agents", icon: "agents", href: "/dashboard/agents" },
  { label: "Phone Numbers", icon: "phone", href: "/dashboard/phone-numbers" },
  { label: "Knowledge Base", icon: "book", href: "/dashboard/knowledge-base" },
  { label: "Tools", icon: "wrench", href: "/dashboard/tools" },
  { label: "API Keys", icon: "key", href: "/dashboard/api-keys" },
  { label: "Calls", icon: "phone", href: "/dashboard/calls" },
  { label: "Outbound", icon: "target", href: "/dashboard/outbound" },
  { label: "Demo Call", icon: "phoneOut", href: "/dashboard/demo-call" },
  { label: "Appointments", badge: "12", icon: "calendar" },
  { label: "Analytics", icon: "chart" },
  { label: "Settings", icon: "settings" },
];

const listPageLimit = 200;

const statusLabels: Record<CallStatus, string> = {
  received: "Received",
  answered: "Answered",
  ended: "Ended",
  declined: "Declined",
  failed: "Failed",
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

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
    case "phoneIn":
      return (
        <>
          <path d="M15 3h6v6" />
          <path d="M21 3l-7 7" />
          <path d="M21 16.5v3a2 2 0 01-2.2 2 19.5 19.5 0 01-8.5-3 19.2 19.2 0 01-6-6 19.5 19.5 0 01-3-8.5A2 2 0 013.5 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.4 2.1L9.5 11.5a16 16 0 006 6l1.1-1.2a2 2 0 012.1-.4c.8.3 1.7.5 2.6.6a2 2 0 011.6 2z" />
        </>
      );
    case "phoneOut":
      return (
        <>
          <path d="M16 8l5-5" />
          <path d="M21 3h-4M21 3v4" />
          <path d="M21 16.5v3a2 2 0 01-2.2 2 19.5 19.5 0 01-8.5-3 19.2 19.2 0 01-6-6 19.5 19.5 0 01-3-8.5A2 2 0 013.5 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.4 2.1L9.5 11.5a16 16 0 006 6l1.1-1.2a2 2 0 012.1-.4c.8.3 1.7.5 2.6.6a2 2 0 011.6 2z" />
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
    case "refresh":
      return (
        <>
          <path d="M4 4v6h6" />
          <path d="M20 20v-6h-6" />
          <path d="M20 9a8 8 0 00-13.5-3L4 10M4 15a8 8 0 0013.5 3L20 14" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </>
      );
    case "trash":
      return (
        <>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M6 6l1 15h10l1-15" />
          <path d="M10 11v6M14 11v6" />
        </>
      );
    case "message":
      return <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />;
    case "clock":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      );
    case "user":
      return (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0112 0v1" />
        </>
      );
    case "hash":
      return (
        <>
          <path d="M5 9h14M4 15h14" />
          <path d="M10 3L8 21M16 3l-2 18" />
        </>
      );
    case "check":
      return <path d="M5 12.5l4 4 10-10" />;
    case "save":
      return (
        <>
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
          <path d="M17 21v-8H7v8M7 3v5h8" />
        </>
      );
    case "x":
      return <path d="M18 6L6 18M6 6l12 12" />;
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
.calls-shell {
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
  --sky: var(--app-sky);
  --orange: var(--app-orange);
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
.calls-shell * { box-sizing: border-box; }
.calls-shell button, .calls-shell input, .calls-shell select, .calls-shell textarea { font: inherit; }
.calls-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.calls-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.calls-shell ::-webkit-scrollbar-track { background: transparent; }
.calls-sidebar {
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
.calls-logo { align-items: center; display: flex; gap: 11px; padding: 4px 8px 26px; }
.calls-logo-mark {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border-radius: 10px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.calls-nav-kicker { color: var(--faint); font-size: 10.5px; font-weight: 700; letter-spacing: .9px; padding: 4px 10px 8px; text-transform: uppercase; }
.calls-nav { display: flex; flex-direction: column; gap: 3px; }
.calls-nav-item {
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
.calls-nav-item:hover { background: var(--app-hover); color: var(--app-text-soft); }
.calls-nav-item.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); font-weight: 700; }
.calls-nav-badge { background: var(--primary); border-radius: 20px; color: var(--app-on-accent); font-size: 10.5px; font-weight: 700; margin-left: auto; padding: 1px 7px; }
.calls-sidebar-footer { display: flex; flex-direction: column; gap: 14px; margin-top: auto; }
.calls-link-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 13px; }
.calls-user-card { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; gap: 10px; padding: 10px 13px; }
.calls-user-name { font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-user-email { color: var(--subtle); font-size: 11.5px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-main { display: flex; flex: 1; flex-direction: column; min-width: 0; height: 100vh; overflow: hidden; }
.calls-content { padding: 20px 32px; flex: 1 1 auto; min-height: 0; overflow: hidden; }
.calls-workspace {
  align-items: stretch;
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
  width: 100%;
  height: 100%;
  min-height: 0;
}
.calls-workspace > * { min-height: 0; max-height: 100%; }
.calls-resource-column {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.calls-resource-head {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 12px;
  justify-content: space-between;
  padding: 16px 16px 14px;
}
.calls-resource-title { font-size: 13px; font-weight: 800; letter-spacing: -.1px; margin: 0; }
.calls-resource-count { color: var(--subtle); font-size: 12px; margin-top: 2px; }
.calls-resource-pad { padding: 16px; flex: 1 1 auto; min-height: 0; overflow-y: auto; }
.calls-top-btn, .calls-ghost-btn, .calls-danger-btn {
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
  transition: filter .18s ease, background .18s ease, border-color .18s ease;
  white-space: nowrap;
}
.calls-top-btn, .calls-ghost-btn { background: var(--panel-hover); color: var(--text); }
.calls-top-btn:hover, .calls-ghost-btn:hover { background: var(--app-panel-hover); }
.calls-danger-btn { background: var(--panel-hover); color: var(--rose); }
.calls-danger-btn:hover { background: var(--app-rose-soft); border-color: var(--app-rose-border); }
.calls-primary-btn {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border: 1px solid transparent;
  border-radius: 11px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  color: var(--app-on-accent);
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  transition: filter .18s ease;
  white-space: nowrap;
}
.calls-primary-btn:hover { filter: brightness(1.08); }
.calls-top-btn:disabled, .calls-ghost-btn:disabled, .calls-danger-btn:disabled, .calls-primary-btn:disabled {
  cursor: not-allowed;
  filter: grayscale(.35);
  opacity: .45;
}
.calls-icon-btn {
  align-items: center;
  background: var(--panel-hover);
  border: 1px solid var(--app-border-strong);
  border-radius: 10px;
  color: var(--text);
  cursor: pointer;
  display: inline-flex;
  height: 40px;
  justify-content: center;
  transition: background .18s ease;
  width: 40px;
}
.calls-icon-btn:hover { background: var(--app-panel-hover); }
.calls-icon-btn:disabled { cursor: not-allowed; opacity: .45; }
.calls-search-wrap { margin-bottom: 12px; position: relative; }
.calls-search-icon { color: var(--subtle); display: flex; left: 12px; pointer-events: none; position: absolute; top: 50%; transform: translateY(-50%); }
.calls-search {
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
.calls-search::placeholder { color: var(--faint); }
.calls-search:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.calls-resource-list { display: flex; flex-direction: column; gap: 8px; }
.calls-list-message {
  align-items: center;
  color: var(--subtle);
  display: flex;
  font-size: 12.5px;
  justify-content: center;
  min-height: 140px;
  padding: 12px 2px;
  text-align: center;
}
.calls-row {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 13px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 7px;
  padding: 11px 10px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease;
  width: 100%;
}
.calls-row:hover { background: var(--app-hover); }
.calls-row.is-active { background: var(--primary-soft); border-color: var(--app-primary-border); box-shadow: inset 0 0 0 1px var(--app-primary-ring); }
.calls-row-top { align-items: center; display: flex; gap: 8px; min-width: 0; }
.calls-row-dir {
  align-items: center;
  background: var(--app-hover-2);
  border-radius: 8px;
  color: var(--primary-light);
  display: inline-flex;
  flex-shrink: 0;
  height: 26px;
  justify-content: center;
  width: 26px;
}
.calls-row-peer { flex: 1; font-size: 13.5px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-row-meta { color: var(--subtle); display: flex; font-size: 11.5px; gap: 8px; justify-content: space-between; padding-left: 34px; }
.calls-row-meta span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-detail { display: flex; flex-direction: column; gap: 16px; min-width: 0; overflow-y: auto; padding-right: 4px; }
.calls-detail-topbar {
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
.calls-summary { align-items: center; display: flex; gap: 13px; min-width: 0; }
.calls-summary-icon {
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
.calls-summary-title { font-size: 20px; font-weight: 850; letter-spacing: -.35px; line-height: 1.1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-summary-id { align-items: center; color: var(--subtle); display: flex; font-family: var(--font-geist-mono), monospace; font-size: 11px; gap: 7px; margin-top: 4px; min-width: 0; }
.calls-top-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.calls-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  display: grid;
  gap: 16px;
  padding: 16px;
}
.calls-section-head { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.calls-section-title { align-items: center; display: flex; font-size: 13.5px; font-weight: 850; gap: 8px; letter-spacing: -.1px; margin: 0; }
.calls-section-title .calls-section-ic { color: var(--primary-light); display: inline-flex; }
.calls-section-copy { color: var(--subtle); font-size: 12px; }
.calls-meta-grid { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.calls-meta-tile {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  display: grid;
  gap: 4px;
  min-width: 0;
  padding: 12px;
}
.calls-meta-label { color: var(--faint); font-size: 10.5px; font-weight: 800; letter-spacing: .8px; text-transform: uppercase; }
.calls-meta-value { color: var(--text); font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-meta-value.is-muted { color: var(--subtle); }
.calls-status-chip {
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
.calls-status-ended { background: var(--app-green-soft); color: var(--green); }
.calls-status-answered { background: var(--app-sky-soft); color: var(--sky); }
.calls-status-received { background: var(--app-amber-soft); color: var(--amber); }
.calls-status-declined { background: var(--app-orange-soft); color: var(--orange); }
.calls-status-failed { background: var(--app-rose-soft); color: var(--rose); }
.calls-status-neutral { background: var(--app-border); color: var(--subtle); }
.calls-dot { background: currentColor; border-radius: 50%; height: 6px; width: 6px; }
.calls-dir-badge {
  align-items: center;
  background: var(--app-border);
  border: 1px solid var(--app-border-strong);
  border-radius: 999px;
  color: var(--app-text-soft);
  display: inline-flex;
  font-size: 11px;
  font-weight: 800;
  gap: 5px;
  letter-spacing: .4px;
  padding: 4px 9px;
  text-transform: uppercase;
}
.calls-edit-grid { display: grid; gap: 12px; grid-template-columns: minmax(0, 200px) minmax(0, 1fr) auto; align-items: end; }
.calls-field { display: grid; gap: 7px; min-width: 0; }
.calls-field-label { color: var(--subtle); font-size: 11.5px; font-weight: 700; }
.calls-input, .calls-select {
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
.calls-input::placeholder { color: var(--faint); }
.calls-input:focus, .calls-select:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.calls-select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--app-muted) 50%), linear-gradient(135deg, var(--app-muted) 50%, transparent 50%);
  background-position: calc(100% - 17px) 50%, calc(100% - 12px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 5px, 5px 5px;
  padding: 0 34px 0 12px;
}
.calls-select option { background: var(--surface); color: var(--text); }
.calls-transcript { display: flex; flex-direction: column; gap: 10px; }
.calls-turn { display: flex; gap: 10px; max-width: 92%; }
.calls-turn.is-user { align-self: flex-end; flex-direction: row-reverse; }
.calls-turn-avatar {
  align-items: center;
  border-radius: 50%;
  display: flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 800;
  height: 30px;
  justify-content: center;
  width: 30px;
}
.calls-turn.is-assistant .calls-turn-avatar { background: var(--primary-soft); border: 1px solid var(--app-primary-ring); color: var(--primary-light); }
.calls-turn.is-user .calls-turn-avatar { background: var(--app-green-soft); border: 1px solid var(--app-green-border); color: var(--green); }
.calls-turn-bubble {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  color: var(--text);
  font-size: 13px;
  line-height: 1.5;
  padding: 10px 12px;
}
.calls-turn.is-user .calls-turn-bubble { background: var(--app-green-soft); border-color: var(--app-green-soft-2); }
.calls-turn-role { color: var(--faint); font-size: 10px; font-weight: 800; letter-spacing: .6px; margin-bottom: 3px; text-transform: uppercase; }
.calls-empty-workspace {
  align-items: center;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  font-size: 13.5px;
  font-weight: 600;
  gap: 12px;
  justify-content: center;
  min-height: 340px;
  padding: 40px;
  text-align: center;
}
.calls-empty-workspace p { margin: 0; max-width: 440px; }
.calls-toast {
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
.calls-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-green-text); }
.calls-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
@media (max-width: 1180px) {
  .calls-workspace { grid-template-columns: minmax(260px, 320px) minmax(0, 1fr); }
  .calls-meta-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 900px) {
  .calls-shell { display: block; height: auto; max-height: none; overflow: visible; }
  .calls-main { height: auto; overflow: visible; }
  .calls-content { overflow: visible; padding: 20px; }
  .calls-workspace { grid-template-columns: 1fr; height: auto; }
  .calls-workspace > * { max-height: none; }
  .calls-detail, .calls-resource-pad { overflow: visible; }
  .calls-sidebar { height: auto; position: static; width: 100%; }
  .calls-sidebar-footer { margin-top: 18px; }
  .calls-user-card { display: none; }
  .calls-nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .calls-detail-topbar { align-items: flex-start; flex-direction: column; }
  .calls-top-actions { justify-content: flex-start; }
  .calls-edit-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .calls-nav { grid-template-columns: 1fr 1fr; }
  .calls-content, .calls-modal-backdrop { padding: 14px; }
  .calls-meta-grid { grid-template-columns: 1fr; }
}
`;

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return dateFormatter.format(date);
}

function formatDuration(seconds: number | null | undefined) {
  if (seconds == null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return `${mins}m ${String(rem).padStart(2, "0")}s`;
}

function callTypeLabel(callType: string) {
  if (callType === "inbound") return "Inbound";
  if (callType === "outbound") return "Outbound";
  return callType || "Unknown";
}

function isCallStatus(value: string): value is CallStatus {
  return (callStatuses as string[]).includes(value);
}

function statusClass(status: string) {
  switch (status) {
    case "ended":
      return "calls-status-ended";
    case "answered":
      return "calls-status-answered";
    case "received":
      return "calls-status-received";
    case "declined":
      return "calls-status-declined";
    case "failed":
      return "calls-status-failed";
    default:
      return "calls-status-neutral";
  }
}

function statusText(status: string) {
  return isCallStatus(status) ? statusLabels[status] : status || "Unknown";
}

function peerLabel(call: ApiCall) {
  // Peers arrive as WhatsApp JIDs: "15557654321@s.whatsapp.net" for a known phone
  // number, or "…@lid" when the caller's number was never disclosed. Show the phone
  // number in dialable form and the LID verbatim, so the two are never confused.
  const raw = call.peer?.trim();
  if (!raw) return "Unknown caller";
  const [user, server] = raw.split("@");
  if (!user) return raw;
  return server === "s.whatsapp.net" ? `+${user}` : user;
}

function StatusChip({ status }: { status: string }) {
  return (
    <span className={`calls-status-chip ${statusClass(status)}`}>
      <span className="calls-dot" />
      {statusText(status)}
    </span>
  );
}

export default function CallsPage() {
  const { user, isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn: isAuthSignedIn } = useAuth();

  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");

  const [detail, setDetail] = useState<ApiCall | null>(null);
  const [detailState, setDetailState] = useState<DetailState>("idle");
  const [detailError, setDetailError] = useState("");

  const [editStatus, setEditStatus] = useState<CallStatus>("ended");
  const [editEndReason, setEditEndReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const isAuthenticated = Boolean(isUserLoaded && isAuthLoaded && isUserSignedIn && isAuthSignedIn && user);
  const authError =
    !isUserLoaded || !isAuthLoaded
      ? null
      : !isUserSignedIn || !isAuthSignedIn || !user
        ? "Sign in to view calls."
        : null;
  const effectiveLoadState = !isUserLoaded || !isAuthLoaded ? "loading" : authError ? "error" : loadState;
  const effectiveLoadError = authError ?? loadError;

  const filteredCalls = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return calls;
    return calls.filter((call) =>
      [call.peer, call.call_id, call.status, call.call_type, call.end_reason ?? ""]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [calls, query]);

  const selectedCall =
    (selectedId ? calls.find((call) => call.id === selectedId) : null) ?? calls[0] ?? null;
  const selectedCallId = selectedCall?.id ?? null;
  // Prefer the freshly fetched detail (has transcript) when it matches the
  // selected row; otherwise fall back to the list row while it loads.
  const shownCall = detail && detail.id === selectedCallId ? detail : selectedCall;

  useEffect(() => {
    if (!isUserLoaded || !isAuthLoaded) return;
    if (!isAuthenticated) return;

    let cancelled = false;
    (async () => {
      setLoadState("loading");
      setLoadError("");
      try {
        const rows = await apiListCalls(getToken, { limit: listPageLimit });
        if (cancelled) return;
        setCalls(rows);
        setSelectedId((current) =>
          current && rows.some((call) => call.id === current) ? current : rows[0]?.id ?? null
        );
        setLoadState("ready");
      } catch (error) {
        if (cancelled) return;
        setLoadState("error");
        setLoadError(error instanceof Error ? error.message : "Failed to load calls");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isAuthenticated, isUserLoaded, isAuthLoaded, reloadKey]);

  // Load the full call (including transcript) whenever the selection changes.
  // State updates live inside the async body so nothing runs synchronously in
  // the effect; the shownCall id-gate keeps a stale detail from ever showing.
  useEffect(() => {
    if (!isAuthenticated || !selectedCallId) return;

    let cancelled = false;
    (async () => {
      setDetailState("loading");
      setDetailError("");
      try {
        const full = await apiGetCall(selectedCallId, getToken);
        if (cancelled) return;
        setDetail(full);
        setDetailState("ready");
        setEditStatus(isCallStatus(full.status) ? full.status : "ended");
        setEditEndReason(full.end_reason ?? "");
      } catch (error) {
        if (cancelled) return;
        setDetailState("error");
        setDetailError(error instanceof Error ? error.message : "Failed to load call");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isAuthenticated, selectedCallId]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  function refresh() {
    if (!isAuthenticated) return;
    setLoadState("loading");
    setReloadKey((key) => key + 1);
  }

  async function saveUpdate() {
    if (!isAuthenticated || !shownCall || isSaving) return;

    const trimmedReason = editEndReason.trim();
    const currentReason = shownCall.end_reason ?? "";
    const statusChanged = editStatus !== shownCall.status;
    const reasonChanged = trimmedReason !== currentReason;
    if (!statusChanged && !reasonChanged) {
      setNotice({ kind: "error", text: "Nothing to update." });
      return;
    }

    setIsSaving(true);
    try {
      const updated = await apiUpdateCall(
        shownCall.id,
        {
          ...(statusChanged ? { status: editStatus } : {}),
          ...(reasonChanged ? { end_reason: trimmedReason || null } : {}),
        },
        getToken
      );
      // The update response carries no transcript, so keep the one we already
      // loaded and merge the returned fields over it.
      setDetail((current) =>
        current && current.id === updated.id ? { ...updated, messages: current.messages } : updated
      );
      setCalls((current) => current.map((call) => (call.id === updated.id ? { ...call, ...updated, messages: call.messages } : call)));
      setEditStatus(isCallStatus(updated.status) ? updated.status : editStatus);
      setEditEndReason(updated.end_reason ?? "");
      setNotice({ kind: "success", text: "Call updated" });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Failed to update call" });
    } finally {
      setIsSaving(false);
    }
  }

  async function removeCall(call: ApiCall) {
    if (!isAuthenticated || deletingId) return;
    const confirmed = window.confirm(
      `Delete the call with ${peerLabel(call)}? Its saved transcript is removed with it. This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(call.id);
    try {
      await apiDeleteCall(call.id, getToken);
      const remaining = calls.filter((item) => item.id !== call.id);
      setCalls(remaining);
      setSelectedId((current) => (current === call.id ? remaining[0]?.id ?? null : current));
      if (detail?.id === call.id) setDetail(null);
      setNotice({ kind: "success", text: "Call deleted" });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Failed to delete call" });
    } finally {
      setDeletingId(null);
    }
  }

  async function copyToClipboard(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice({ kind: "success", text: `${label} copied` });
    } catch {
      setNotice({ kind: "error", text: `Could not copy ${label.toLowerCase()}` });
    }
  }

  return (
    <div className="calls-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Sidebar activeLabel="Calls" callCount={calls.length} />

      <main className="calls-main">
        <div className="calls-content">
          <section className="calls-workspace" aria-label="Calls workspace">
            <CallList
              calls={calls}
              deletingId={deletingId}
              effectiveLoadError={effectiveLoadError}
              effectiveLoadState={effectiveLoadState}
              filteredCalls={filteredCalls}
              isAuthenticated={isAuthenticated}
              onQueryChange={setQuery}
              onRefresh={refresh}
              onSelect={setSelectedId}
              query={query}
              selectedId={selectedCallId}
            />

            <section className="calls-detail">
              {shownCall ? (
                <CallDetail
                  call={shownCall}
                  deletingId={deletingId}
                  detailError={detailError}
                  detailState={detailState}
                  editEndReason={editEndReason}
                  editStatus={editStatus}
                  isSaving={isSaving}
                  onCopy={copyToClipboard}
                  onDelete={removeCall}
                  onEndReasonChange={setEditEndReason}
                  onRefresh={refresh}
                  onSave={saveUpdate}
                  onStatusChange={setEditStatus}
                />
              ) : (
                <div className="calls-empty-workspace">
                  <Icon name="phone" size={30} stroke="#5d5d68" sw={1.6} />
                  <p>
                    {effectiveLoadState === "loading"
                      ? "Loading calls..."
                      : effectiveLoadState === "error"
                        ? effectiveLoadError
                        : "No calls yet. Calls appear here as your agents handle them."}
                  </p>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>

      {notice ? (
        <div className={`calls-toast ${notice.kind === "error" ? "calls-toast-error" : "calls-toast-success"}`} role="status">
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

function Sidebar({ activeLabel, callCount }: { activeLabel: string; callCount: number }) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();

  return (
    <aside className="calls-sidebar">
      <div className="calls-logo">
        <div className="calls-logo-mark">
          <Icon name="spark" size={18} stroke="#fff" sw={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.3px" }}>Voca</div>
          <div style={{ color: "var(--app-subtle)", fontSize: 11, fontWeight: 500, marginTop: -1 }}>AI Voice Agents</div>
        </div>
      </div>
      <div className="calls-nav-kicker">Menu</div>
      <nav className="calls-nav" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const badge = item.label === "Calls" ? (callCount > 0 ? String(callCount) : undefined) : item.badge;
          const content = (
            <>
              <span style={{ display: "flex", justifyContent: "center", width: 18 }}>
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
              {badge ? <span className="calls-nav-badge">{badge}</span> : null}
            </>
          );
          const className = `calls-nav-item${item.label === activeLabel ? " is-active" : ""}`;

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
      <div className="calls-sidebar-footer">
        <ThemeToggle />
        <div className="calls-user-card">
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span style={{ minWidth: 0 }}>
            <div className="calls-user-name">{user?.fullName || user?.username || "Account"}</div>
            <div className="calls-user-email">{user?.primaryEmailAddress?.emailAddress ?? ""}</div>
          </span>
        </div>
      </div>
    </aside>
  );
}

function CallList({
  calls,
  deletingId,
  effectiveLoadError,
  effectiveLoadState,
  filteredCalls,
  isAuthenticated,
  onQueryChange,
  onRefresh,
  onSelect,
  query,
  selectedId,
}: {
  calls: ApiCall[];
  deletingId: string | null;
  effectiveLoadError: string;
  effectiveLoadState: "loading" | "ready" | "error";
  filteredCalls: ApiCall[];
  isAuthenticated: boolean;
  onQueryChange: (value: string) => void;
  onRefresh: () => void;
  onSelect: (id: string) => void;
  query: string;
  selectedId: string | null;
}) {
  return (
    <section className="calls-resource-column" aria-label="Calls">
      <div className="calls-resource-head">
        <div>
          <h1 className="calls-resource-title">Calls</h1>
          <div className="calls-resource-count">{calls.length} total</div>
        </div>
        <button
          className="calls-icon-btn"
          disabled={!isAuthenticated || effectiveLoadState === "loading"}
          onClick={onRefresh}
          title="Refresh"
          type="button"
        >
          <Icon name="refresh" size={16} sw={2.2} />
        </button>
      </div>
      <div className="calls-resource-pad">
        <div className="calls-search-wrap">
          <span className="calls-search-icon">
            <Icon name="search" size={16} sw={2.2} />
          </span>
          <input
            aria-label="Search calls"
            className="calls-search"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by number, status, id..."
            type="search"
            value={query}
          />
        </div>
        <div className="calls-resource-list">
          {effectiveLoadState === "loading" && calls.length === 0 ? (
            <div className="calls-list-message">Loading calls...</div>
          ) : effectiveLoadState === "error" ? (
            <div className="calls-list-message">
              <div>
                <div>{effectiveLoadError}</div>
                {isAuthenticated ? (
                  <button className="calls-ghost-btn" onClick={onRefresh} style={{ marginTop: 12 }} type="button">
                    Try again
                  </button>
                ) : null}
              </div>
            </div>
          ) : filteredCalls.length === 0 ? (
            <div className="calls-list-message">
              {query.trim() ? "No calls match your search." : "No calls yet."}
            </div>
          ) : (
            filteredCalls.map((call) => (
              <button
                aria-pressed={call.id === selectedId}
                className={`calls-row${call.id === selectedId ? " is-active" : ""}`}
                key={call.id}
                onClick={() => onSelect(call.id)}
                style={deletingId === call.id ? { opacity: 0.5 } : undefined}
                type="button"
              >
                <div className="calls-row-top">
                  <span className="calls-row-dir" title={callTypeLabel(call.call_type)}>
                    <Icon name={call.call_type === "outbound" ? "phoneOut" : "phoneIn"} size={14} sw={2.2} />
                  </span>
                  <span className="calls-row-peer">{peerLabel(call)}</span>
                  <StatusChip status={call.status} />
                </div>
                <div className="calls-row-meta">
                  <span>{formatDate(call.created_at)}</span>
                  <span>{formatDuration(call.duration_seconds)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function CallDetail({
  call,
  deletingId,
  detailError,
  detailState,
  editEndReason,
  editStatus,
  isSaving,
  onCopy,
  onDelete,
  onEndReasonChange,
  onRefresh,
  onSave,
  onStatusChange,
}: {
  call: ApiCall;
  deletingId: string | null;
  detailError: string;
  detailState: DetailState;
  editEndReason: string;
  editStatus: CallStatus;
  isSaving: boolean;
  onCopy: (value: string, label: string) => void;
  onDelete: (call: ApiCall) => void;
  onEndReasonChange: (value: string) => void;
  onRefresh: () => void;
  onSave: () => void;
  onStatusChange: (value: CallStatus) => void;
}) {
  const messages = call.messages ?? [];
  const isDeleting = deletingId === call.id;

  return (
    <>
      <div className="calls-detail-topbar">
        <div className="calls-summary">
          <span className="calls-summary-icon">
            <Icon name={call.call_type === "outbound" ? "phoneOut" : "phoneIn"} size={22} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div className="calls-summary-title">{peerLabel(call)}</div>
            <div className="calls-summary-id">
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{call.call_id}</span>
              <button
                aria-label="Copy call id"
                onClick={() => onCopy(call.call_id, "Call ID")}
                style={{ background: "transparent", border: 0, color: "inherit", cursor: "pointer", display: "inline-flex", padding: 0 }}
                type="button"
              >
                <Icon name="check" size={13} />
              </button>
            </div>
          </div>
        </div>
        <div className="calls-top-actions">
          <span className={`calls-dir-badge`}>
            <Icon name={call.call_type === "outbound" ? "phoneOut" : "phoneIn"} size={12} sw={2.4} />
            {callTypeLabel(call.call_type)}
          </span>
          <StatusChip status={call.status} />
          <button className="calls-top-btn" disabled={detailState === "loading"} onClick={onRefresh} type="button">
            <Icon name="refresh" size={15} sw={2.2} />
            Refresh
          </button>
          <button className="calls-danger-btn" disabled={isDeleting} onClick={() => onDelete(call)} type="button">
            <Icon name="trash" size={15} sw={2.1} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="calls-section">
        <div className="calls-section-head">
          <h2 className="calls-section-title">
            <span className="calls-section-ic">
              <Icon name="hash" size={16} />
            </span>
            Call Details
          </h2>
          <span className="calls-section-copy">Lifecycle and routing for this call.</span>
        </div>
        <div className="calls-meta-grid">
          <MetaTile label="Status" value={statusText(call.status)} />
          <MetaTile label="Direction" value={callTypeLabel(call.call_type)} />
          <MetaTile label="Duration" value={formatDuration(call.duration_seconds)} />
          <MetaTile label="Created" value={formatDate(call.created_at)} />
          <MetaTile label="Answered" value={formatDate(call.answered_at)} muted={!call.answered_at} />
          <MetaTile label="Ended" value={formatDate(call.ended_at)} muted={!call.ended_at} />
          <MetaTile label="Agent" value={call.agent_id ?? "—"} muted={!call.agent_id} />
          <MetaTile label="Phone number" value={call.phone_number_id ?? "—"} muted={!call.phone_number_id} />
          <MetaTile label="End reason" value={call.end_reason ?? "—"} muted={!call.end_reason} />
        </div>
      </div>

      <div className="calls-section">
        <div className="calls-section-head">
          <h2 className="calls-section-title">
            <span className="calls-section-ic">
              <Icon name="settings" size={16} />
            </span>
            Update Call
          </h2>
          <span className="calls-section-copy">Change the recorded status or hangup reason.</span>
        </div>
        <div className="calls-edit-grid">
          <div className="calls-field">
            <label className="calls-field-label" htmlFor="calls-status">
              Status
            </label>
            <select
              className="calls-select"
              id="calls-status"
              onChange={(event) => onStatusChange(event.target.value as CallStatus)}
              value={editStatus}
            >
              {callStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="calls-field">
            <label className="calls-field-label" htmlFor="calls-end-reason">
              End reason
            </label>
            <input
              className="calls-input"
              id="calls-end-reason"
              onChange={(event) => onEndReasonChange(event.target.value)}
              placeholder="e.g. caller hung up"
              type="text"
              value={editEndReason}
            />
          </div>
          <button className="calls-primary-btn" disabled={isSaving} onClick={onSave} type="button">
            <Icon name="save" size={15} sw={2.1} stroke="#fff" />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="calls-section">
        <div className="calls-section-head">
          <h2 className="calls-section-title">
            <span className="calls-section-ic">
              <Icon name="message" size={16} />
            </span>
            Transcript
          </h2>
          <span className="calls-section-copy">
            {messages.length > 0 ? `${messages.length} turn${messages.length === 1 ? "" : "s"}` : "Conversation replay"}
          </span>
        </div>
        {detailState === "loading" && messages.length === 0 ? (
          <div className="calls-list-message">Loading transcript...</div>
        ) : detailState === "error" ? (
          <div className="calls-list-message">{detailError || "Failed to load transcript."}</div>
        ) : messages.length === 0 ? (
          <div className="calls-list-message">No transcript was saved for this call.</div>
        ) : (
          <div className="calls-transcript">
            {messages.map((message, index) => (
              <TranscriptTurn key={index} message={message} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function MetaTile({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="calls-meta-tile">
      <div className="calls-meta-label">{label}</div>
      <div className={`calls-meta-value${muted ? " is-muted" : ""}`} title={value}>
        {value}
      </div>
    </div>
  );
}

function TranscriptTurn({ message }: { message: ApiCallMessage }) {
  const isUser = message.role === "user";
  const roleLabel = isUser ? "Caller" : message.role === "assistant" ? "Agent" : message.role;
  return (
    <div className={`calls-turn ${isUser ? "is-user" : "is-assistant"}`}>
      <span className="calls-turn-avatar">
        <Icon name={isUser ? "user" : "spark"} size={15} />
      </span>
      <div className="calls-turn-bubble">
        <div className="calls-turn-role">{roleLabel}</div>
        {message.content}
      </div>
    </div>
  );
}
