"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearance } from "@/components/theme/clerkAppearance";
import {
  listDashboardAgents as apiListAgents,
  updateDashboardAgent as apiUpdateAgent,
  type ApiAgentResource,
} from "@/lib/agents";
import {
  getPhoneNumber as apiGetPhoneNumber,
  listPhoneNumbers as apiListPhoneNumbers,
  logoutPhoneNumber as apiLogoutPhoneNumber,
  rePairPhoneNumber as apiRePairPhoneNumber,
  restartPhoneNumberLogin as apiRestartPhoneNumberLogin,
  startPhoneNumberLogin as apiStartPhoneNumberLogin,
  type ApiPhoneNumber,
  type PhoneNumberStatus,
} from "@/lib/phoneNumbers";

type IconName =
  | "grid"
  | "agents"
  | "phone"
  | "phoneOut"
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
  | "logOut"
  | "search"
  | "tag"
  | "message"
  | "globe"
  | "clock"
  | "copy"
  | "check"
  | "x"
  | "chevron"
  | "hash";

type NavItem = {
  label: string;
  icon: IconName;
  href?: string;
  badge?: string;
};

type CallDirection = "inbound" | "outbound" | "both";

type AssignedAgent = {
  id: string;
  name: string;
  direction: CallDirection;
  status: string;
};

type PhoneAssignments = {
  inbound: AssignedAgent | null;
  outbound: AssignedAgent | null;
};

type AssignableDirection = "inbound" | "outbound";

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

const terminalStatuses = new Set<PhoneNumberStatus>(["connected", "failed", "expired"]);

// Non-connected statuses whose login session can be restarted for a fresh QR code.
const restartableStatuses = new Set<PhoneNumberStatus>(["pending_qr", "expired", "failed", "disconnected"]);

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
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
    case "chevron":
      return <path d="M9 6l6 6-6 6" />;
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
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.phone-shell * { box-sizing: border-box; }
.phone-shell button, .phone-shell input, .phone-shell textarea { font: inherit; }
.phone-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.phone-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.phone-shell ::-webkit-scrollbar-track { background: transparent; }
.phone-sidebar {
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
.phone-logo { align-items: center; display: flex; gap: 11px; padding: 4px 8px 26px; }
.phone-logo-mark {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border-radius: 10px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.phone-nav-kicker { color: var(--faint); font-size: 10.5px; font-weight: 700; letter-spacing: .9px; padding: 4px 10px 8px; text-transform: uppercase; }
.phone-nav { display: flex; flex-direction: column; gap: 3px; }
.phone-nav-item {
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
.phone-nav-item:hover { background: var(--app-hover); color: var(--app-text-soft); }
.phone-nav-item.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); font-weight: 700; }
.phone-nav-badge { background: var(--primary); border-radius: 20px; color: var(--app-on-accent); font-size: 10.5px; font-weight: 700; margin-left: auto; padding: 1px 7px; }
.phone-sidebar-footer { display: flex; flex-direction: column; gap: 14px; margin-top: auto; }
.phone-link-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 13px; }
.phone-user-card { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; gap: 10px; padding: 10px 13px; }
.phone-user-name { font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-user-email { color: var(--subtle); font-size: 11.5px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-main { display: flex; flex: 1; flex-direction: column; min-width: 0; height: 100vh; overflow: hidden; }
.phone-content { padding: 20px 32px; flex: 1 1 auto; min-height: 0; overflow: hidden; }
.phone-workspace {
  align-items: stretch;
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(250px, 300px) minmax(0, 1fr);
  width: 100%;
  height: 100%;
  min-height: 0;
}
.phone-workspace > * { min-height: 0; max-height: 100%; }
.phone-resource-column {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.phone-resource-head {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 12px;
  justify-content: space-between;
  padding: 16px 16px 14px;
}
.phone-resource-title { font-size: 13px; font-weight: 800; letter-spacing: -.1px; margin: 0; }
.phone-resource-count { color: var(--subtle); font-size: 12px; margin-top: 2px; }
.phone-resource-pad { padding: 16px; flex: 1 1 auto; min-height: 0; overflow-y: auto; }
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
.phone-resource-list { display: flex; flex-direction: column; gap: 8px; }
.phone-list-message {
  align-items: center;
  color: var(--subtle);
  display: flex;
  font-size: 12.5px;
  justify-content: center;
  min-height: 140px;
  padding: 12px 2px;
  text-align: center;
}
.phone-number-item {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 13px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 7px;
  min-height: 52px;
  padding: 10px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease;
  width: 100%;
}
.phone-number-item:hover { background: var(--app-hover); }
.phone-number-item.is-active {
  background: var(--primary-soft);
  border-color: var(--app-primary-border);
  box-shadow: inset 0 0 0 1px var(--app-primary-ring);
}
.phone-number-row { align-items: center; display: flex; gap: 8px; min-width: 0; }
.phone-number-title { flex: 1; font-size: 13.5px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-number-subtitle { color: var(--subtle); font-size: 11.5px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  overflow-y: auto;
  padding-right: 4px;
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
.phone-setting-line { align-items: center; display: flex; gap: 12px; justify-content: space-between; min-width: 0; }
.phone-setting-label { color: var(--text); font-size: 13px; font-weight: 800; }
.phone-setting-copy { color: var(--subtle); font-size: 12px; margin-top: -4px; }
.phone-field-value, .phone-textarea-value {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.phone-field-value {
  height: 40px;
  overflow: hidden;
  padding: 0 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.phone-textarea-value {
  min-height: 58px;
  padding: 10px 12px;
  resize: vertical;
}
.phone-field-value:focus, .phone-textarea-value:focus {
  background: var(--app-input-focus);
  border-color: var(--app-primary-ring-strong);
  box-shadow: 0 0 0 4px var(--app-primary-ring);
}
.phone-field-value[readonly], .phone-textarea-value[readonly] { color: var(--app-text-soft); }
.phone-field-value.is-muted { color: var(--subtle); }
.phone-assignment-grid { display: grid; gap: 8px; }
.phone-assignment-row {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  display: grid;
  gap: 12px;
  grid-template-columns: 86px minmax(0, 1fr);
  min-height: 48px;
  padding: 8px 10px;
}
.phone-assignment-row.is-empty { color: var(--subtle); }
.phone-assignment-direction {
  color: var(--primary-light);
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .7px;
  text-transform: uppercase;
}
.phone-assignment-main { display: grid; gap: 2px; min-width: 0; }
.phone-assignment-select {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--text);
  font-size: 13px;
  font-weight: 800;
  min-width: 0;
  outline: none;
  overflow: hidden;
  padding: 0 22px 0 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.phone-assignment-select:disabled { cursor: not-allowed; opacity: .72; }
.phone-assignment-select option { background: var(--surface); color: var(--text); }
.phone-assignment-name {
  color: var(--text);
  font-size: 13px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.phone-assignment-row.is-empty .phone-assignment-name { color: var(--subtle); }
.phone-assignment-meta {
  align-items: center;
  color: var(--subtle);
  display: flex;
  font-size: 11.5px;
  gap: 6px;
  min-width: 0;
}
.phone-assignment-dot { background: currentColor; border-radius: 50%; height: 4px; width: 4px; }
.phone-detail-grid { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.phone-meta-tile {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  display: grid;
  gap: 4px;
  min-width: 0;
  padding: 12px;
}
.phone-meta-label { color: var(--faint); font-size: 10.5px; font-weight: 800; letter-spacing: .8px; text-transform: uppercase; }
.phone-meta-value { color: var(--text); font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
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
.phone-qr-note {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  color: var(--app-text-soft);
  font-size: 13px;
  padding: 14px;
}
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
.phone-qr-image { height: 100%; object-fit: contain; width: 100%; }
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
@media (max-width: 1180px) {
  .phone-workspace { grid-template-columns: minmax(240px, 280px) minmax(0, 1fr); }
  .phone-qr-layout { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .phone-shell { display: block; height: auto; max-height: none; overflow: visible; }
  .phone-main { height: auto; overflow: visible; }
  .phone-content { overflow: visible; padding: 20px; }
  .phone-workspace { grid-template-columns: 1fr; height: auto; }
  .phone-workspace > * { max-height: none; }
  .phone-detail, .phone-resource-pad { overflow: visible; }
  .phone-sidebar { height: auto; position: static; width: 100%; }
  .phone-sidebar-footer { margin-top: 18px; }
  .phone-user-card { display: none; }
  .phone-nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .phone-detail-topbar { align-items: flex-start; flex-direction: column; }
  .phone-top-actions { justify-content: flex-start; }
}
@media (max-width: 640px) {
  .phone-nav { grid-template-columns: 1fr 1fr; }
  .phone-content, .phone-modal-backdrop { padding: 14px; }
  .phone-detail-grid { grid-template-columns: 1fr; }
  .phone-setting-line { align-items: flex-start; flex-direction: column; }
  .phone-top-btn, .phone-ghost-btn, .phone-danger-btn { width: 100%; }
  .phone-top-actions { width: 100%; }
}
`;

function formatDate(value: string | null | undefined) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return dateFormatter.format(date);
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

function upsertPhoneNumber(current: ApiPhoneNumber[], phoneNumber: ApiPhoneNumber) {
  return [phoneNumber, ...current.filter((item) => item.id !== phoneNumber.id)];
}

function agentCallDirection(agent: ApiAgentResource): CallDirection {
  const direction = agent.agent?.call_direction;
  if (direction === "inbound" || direction === "outbound" || direction === "both") return direction;
  return "both";
}

function agentDisplayName(agent: ApiAgentResource) {
  return agent.agent?.name?.trim() || "Unnamed agent";
}

function agentUsesDirection(agent: ApiAgentResource, direction: "inbound" | "outbound") {
  const assignedDirection = agentCallDirection(agent);
  return assignedDirection === "both" || assignedDirection === direction;
}

function phoneAssignments(phoneNumberId: string | null, agents: ApiAgentResource[]): PhoneAssignments {
  if (!phoneNumberId) return { inbound: null, outbound: null };

  const assignedAgents = agents.filter((agent) => agent.agent?.phone_number_id === phoneNumberId);
  const toAssignedAgent = (agent: ApiAgentResource): AssignedAgent => ({
    id: agent.id,
    name: agentDisplayName(agent),
    direction: agentCallDirection(agent),
    status: agent.agent?.status || "unknown",
  });
  const inbound = assignedAgents.find((agent) => agentUsesDirection(agent, "inbound"));
  const outbound = assignedAgents.find((agent) => agentUsesDirection(agent, "outbound"));

  return {
    inbound: inbound ? toAssignedAgent(inbound) : null,
    outbound: outbound ? toAssignedAgent(outbound) : null,
  };
}

function upsertAgents(current: ApiAgentResource[], updated: ApiAgentResource[]) {
  return current.map((agent) => updated.find((item) => item.id === agent.id) ?? agent);
}

export default function PhoneNumbersPage() {
  const { user, isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn: isAuthSignedIn } = useAuth();
  const [phoneNumbers, setPhoneNumbers] = useState<ApiPhoneNumber[]>([]);
  const [agents, setAgents] = useState<ApiAgentResource[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [label, setLabel] = useState("");
  const [activeLogin, setActiveLogin] = useState<ApiPhoneNumber | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [assigningDirection, setAssigningDirection] = useState<AssignableDirection | null>(null);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const isAuthenticated = Boolean(isUserLoaded && isAuthLoaded && isUserSignedIn && isAuthSignedIn && user);
  const authError =
    !isUserLoaded || !isAuthLoaded
      ? null
      : !isUserSignedIn || !isAuthSignedIn || !user
        ? "Sign in to manage phone numbers."
        : null;
  const effectiveLoadState = !isUserLoaded || !isAuthLoaded ? "loading" : authError ? "error" : loadState;
  const effectiveLoadError = authError ?? loadError;
  const totalCount = phoneNumbers.length;
  const pendingCount = useMemo(
    () => phoneNumbers.filter((item) => item.status === "pending_qr").length,
    [phoneNumbers]
  );
  const filteredPhoneNumbers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return phoneNumbers;
    return phoneNumbers.filter((item) =>
      [displayName(item), displayNumber(item), item.id, statusLabels[item.status]]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [phoneNumbers, query]);
  const selectedPhoneNumber =
    (selectedId ? phoneNumbers.find((item) => item.id === selectedId) : null) ?? phoneNumbers[0] ?? null;
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
    (async () => {
      setLoadState("loading");
      setLoadError("");
      try {
        const [rows, agentRows] = await Promise.all([
          apiListPhoneNumbers(getToken),
          apiListAgents(getToken),
        ]);
        if (cancelled) return;
        setPhoneNumbers(rows);
        setAgents(agentRows);
        setSelectedId((current) =>
          current && rows.some((item) => item.id === current) ? current : rows[0]?.id ?? null
        );
        setLoadState("ready");
      } catch (error) {
        if (cancelled) return;
        setAgents([]);
        setLoadState("error");
        setLoadError(error instanceof Error ? error.message : "Failed to load phone numbers");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isAuthenticated, isUserLoaded, isAuthLoaded, reloadKey]);

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
        const updated = await apiGetPhoneNumber(activeLoginID, getToken);
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

    const interval = window.setInterval(poll, 2500);
    poll();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [activeLoginID, activeLoginStatus, getToken]);

  useEffect(() => {
    if (!selectedPendingLoginID || selectedPendingLoginID === activeLoginID) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const updated = await apiGetPhoneNumber(selectedPendingLoginID, getToken);
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

    const interval = window.setInterval(poll, 2500);
    poll();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [activeLoginID, getToken, selectedPendingLoginID]);

  async function startLogin() {
    if (isStarting || !isAuthenticated) return;

    setIsStarting(true);
    try {
      const payload = label.trim() ? { label: label.trim() } : {};
      const started = await apiStartPhoneNumberLogin(payload, getToken);
      setActiveLogin(started);
      setPhoneNumbers((current) => upsertPhoneNumber(current, started));
      setSelectedId(started.id);
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

  async function disconnect(phone: ApiPhoneNumber) {
    if (disconnectingId) return;
    const action = phone.status === "connected" ? "Disconnect and remove" : "Remove";
    const confirmed = window.confirm(`${action} ${displayName(phone)}?`);
    if (!confirmed) return;

    setDisconnectingId(phone.id);
    try {
      await apiLogoutPhoneNumber(phone.id, getToken);
      const remaining = phoneNumbers.filter((item) => item.id !== phone.id);
      setPhoneNumbers(remaining);
      setSelectedId((current) => (current === phone.id ? remaining[0]?.id ?? null : current));
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

  async function assignAgent(direction: AssignableDirection, nextAgentId: string) {
    if (!isAuthenticated || !selectedPhoneNumber || assigningDirection) return;

    const nextInboundId =
      direction === "inbound" ? nextAgentId || null : selectedAssignments.inbound?.id ?? null;
    const nextOutboundId =
      direction === "outbound" ? nextAgentId || null : selectedAssignments.outbound?.id ?? null;
    const affectedIds = new Set(
      agents
        .filter(
          (agent) =>
            agent.agent?.phone_number_id === selectedPhoneNumber.id ||
            agent.id === nextAgentId
        )
        .map((agent) => agent.id)
    );

    setAssigningDirection(direction);
    try {
      const updatedAgents = await Promise.all(
        [...affectedIds].map((agentId) => {
          const desiredDirections: AssignableDirection[] = [];
          if (nextInboundId === agentId) desiredDirections.push("inbound");
          if (nextOutboundId === agentId) desiredDirections.push("outbound");

          const callDirection: CallDirection | null =
            desiredDirections.length === 2
              ? "both"
              : desiredDirections.length === 1
                ? desiredDirections[0]
                : null;

          return apiUpdateAgent(
            agentId,
            {
              agent: callDirection
                ? {
                    phone_number_id: selectedPhoneNumber.id,
                    call_direction: callDirection,
                  }
                : {
                    phone_number_id: null,
                  },
            },
            getToken
          );
        })
      );
      setAgents((current) => upsertAgents(current, updatedAgents));
      setNotice({ kind: "success", text: `${direction === "inbound" ? "Inbound" : "Outbound"} agent updated` });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to update selected agent",
      });
    } finally {
      setAssigningDirection(null);
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

  async function refresh() {
    if (!isAuthenticated) return;

    // For a number whose login ended (expired/failed/disconnected), Refresh
    // restarts the login session so a fresh QR code is issued. Otherwise it
    // just reloads the list.
    if (loadState === "ready" && selectedPhoneNumber && restartableStatuses.has(selectedPhoneNumber.status)) {
      if (isRestarting) return;
      setIsRestarting(true);
      try {
        const restarted = await apiRestartPhoneNumberLogin(selectedPhoneNumber.id, getToken);
        setActiveLogin(restarted);
        setPhoneNumbers((current) => upsertPhoneNumber(current, restarted));
        setSelectedId(restarted.id);
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
      const restarted = await apiRePairPhoneNumber(selectedPhoneNumber.id, getToken);
      setActiveLogin(restarted);
      setPhoneNumbers((current) => upsertPhoneNumber(current, restarted));
      setSelectedId(restarted.id);
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
    <div className="phone-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Sidebar activeLabel="Phone Numbers" phoneCount={totalCount} />

      <main className="phone-main">
        <div className="phone-content">
          <section className="phone-workspace" aria-label="Phone numbers workspace">
            <PhoneNumberList
              effectiveLoadError={effectiveLoadError}
              effectiveLoadState={effectiveLoadState}
              filteredPhoneNumbers={filteredPhoneNumbers}
              isAuthenticated={isAuthenticated}
              onCreate={() => setIsCreateOpen(true)}
              onQueryChange={setQuery}
              onRetry={refresh}
              onSelect={setSelectedId}
              phoneNumbers={phoneNumbers}
              query={query}
              selectedId={selectedPhoneNumber?.id ?? null}
            />

            <section className="phone-detail">
              <DetailTopbar
                disconnectingId={disconnectingId}
                isAuthenticated={isAuthenticated}
                isLoading={effectiveLoadState === "loading"}
                isRestarting={isRestarting}
                onCopyId={(id) => copyToClipboard(id, "Phone number ID")}
                onCreate={() => setIsCreateOpen(true)}
                onDisconnect={disconnect}
                onRePair={rePair}
                onRefresh={refresh}
                phoneNumber={selectedPhoneNumber}
              />

              <div className="phone-detail-scroll">
                <PhoneNumberDetail
                  agents={agents}
                  assignments={selectedAssignments}
                  assigningDirection={assigningDirection}
                  effectiveLoadError={effectiveLoadError}
                  effectiveLoadState={effectiveLoadState}
                  isAuthenticated={isAuthenticated}
                  onAssignAgent={assignAgent}
                  onCopy={(value, labelText) => copyToClipboard(value, labelText)}
                  onCreate={() => setIsCreateOpen(true)}
                  onRetry={refresh}
                  pendingCount={pendingCount}
                  phoneNumber={selectedPhoneNumber}
                />
              </div>
            </section>
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

function Sidebar({
  activeLabel,
  phoneCount,
}: {
  activeLabel: string;
  phoneCount: number;
}) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();

  return (
    <aside className="phone-sidebar">
      <div className="phone-logo">
        <div className="phone-logo-mark">
          <Icon name="spark" size={18} stroke="#fff" sw={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.3px" }}>Voca</div>
          <div style={{ color: "var(--app-subtle)", fontSize: 11, fontWeight: 500, marginTop: -1 }}>
            AI Voice Agents
          </div>
        </div>
      </div>
      <div className="phone-nav-kicker">Menu</div>
      <nav className="phone-nav" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const content = (
            <>
              <span style={{ display: "flex", justifyContent: "center", width: 18 }}>
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
              {item.badge || item.label === "Phone Numbers" ? (
                <span className="phone-nav-badge">
                  {item.label === "Phone Numbers" ? phoneCount : item.badge}
                </span>
              ) : null}
            </>
          );
          const className = `phone-nav-item${item.label === activeLabel ? " is-active" : ""}`;

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
      <div className="phone-sidebar-footer">
        <ThemeToggle />
        <div className="phone-user-card">
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span style={{ minWidth: 0 }}>
            <div className="phone-user-name">{user?.fullName || user?.username || "Account"}</div>
            <div className="phone-user-email">{user?.primaryEmailAddress?.emailAddress ?? ""}</div>
          </span>
        </div>
      </div>
    </aside>
  );
}

function PhoneNumberList({
  effectiveLoadError,
  effectiveLoadState,
  filteredPhoneNumbers,
  isAuthenticated,
  onCreate,
  onQueryChange,
  onRetry,
  onSelect,
  phoneNumbers,
  query,
  selectedId,
}: {
  effectiveLoadError: string;
  effectiveLoadState: "loading" | "ready" | "error";
  filteredPhoneNumbers: ApiPhoneNumber[];
  isAuthenticated: boolean;
  onCreate: () => void;
  onQueryChange: (value: string) => void;
  onRetry: () => void;
  onSelect: (id: string) => void;
  phoneNumbers: ApiPhoneNumber[];
  query: string;
  selectedId: string | null;
}) {
  return (
    <section className="phone-resource-column" aria-label="Phone numbers">
      <div className="phone-resource-head">
        <div>
          <h1 className="phone-resource-title">Phone Numbers</h1>
          <div className="phone-resource-count">{phoneNumbers.length} WhatsApp numbers</div>
        </div>
        <button className="phone-create-btn" disabled={!isAuthenticated} onClick={onCreate} type="button">
          <Icon name="plus" size={14} stroke="#fff" sw={2.4} />
          New Number
        </button>
      </div>
      <div className="phone-resource-pad">
        <div className="phone-search-wrap">
          <span className="phone-search-icon">
            <Icon name="search" size={16} sw={2.2} />
          </span>
          <input
            aria-label="Search phone numbers"
            className="phone-search"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search phone numbers..."
            type="search"
            value={query}
          />
        </div>
        <div className="phone-resource-list">
        {effectiveLoadState === "loading" && phoneNumbers.length === 0 ? (
          <div className="phone-list-message">Loading phone numbers...</div>
        ) : effectiveLoadState === "error" ? (
          <div className="phone-list-message">
            <div>
              <div>{effectiveLoadError}</div>
              {isAuthenticated ? (
                <button className="phone-ghost-btn" onClick={onRetry} style={{ marginTop: 12 }} type="button">
                  Try again
                </button>
              ) : null}
            </div>
          </div>
        ) : filteredPhoneNumbers.length === 0 ? (
          <div className="phone-list-message">
            {query.trim() ? "No phone numbers match your search." : "No phone numbers yet."}
          </div>
        ) : (
          filteredPhoneNumbers.map((item) => (
            <button
              aria-pressed={item.id === selectedId}
              className={`phone-number-item${item.id === selectedId ? " is-active" : ""}`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              type="button"
            >
              <div className="phone-number-row">
                <span className="phone-number-title">{displayName(item)}</span>
                <StatusChip compact status={item.status} />
              </div>
              <div className="phone-number-subtitle">WhatsApp - {displayNumber(item)}</div>
            </button>
          ))
        )}
        </div>
      </div>
    </section>
  );
}

function DetailTopbar({
  disconnectingId,
  isAuthenticated,
  isLoading,
  isRestarting,
  onCopyId,
  onCreate,
  onDisconnect,
  onRePair,
  onRefresh,
  phoneNumber,
}: {
  disconnectingId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRestarting: boolean;
  onCopyId: (id: string) => void;
  onCreate: () => void;
  onDisconnect: (phoneNumber: ApiPhoneNumber) => void;
  onRePair: () => void;
  onRefresh: () => void;
  phoneNumber: ApiPhoneNumber | null;
}) {
  return (
    <header className="phone-detail-topbar">
      <div className="phone-selected-summary">
        <span className="phone-summary-icon">
          <Icon name="phone" size={20} />
        </span>
        <span style={{ minWidth: 0 }}>
          <div className="phone-summary-title">{phoneNumber ? displayName(phoneNumber) : "Phone Numbers"}</div>
          <div className="phone-summary-id">
            {phoneNumber ? (
              <>
                <span className="phone-id-text">{phoneNumber.id}</span>
                <button
                  aria-label="Copy phone number ID"
                  className="phone-icon-action"
                  onClick={() => onCopyId(phoneNumber.id)}
                  type="button"
                >
                  <Icon name="copy" size={13} />
                </button>
              </>
            ) : (
              <span>Select or create a WhatsApp number</span>
            )}
          </div>
        </span>
      </div>
      <div className="phone-top-actions">
        {phoneNumber ? <StatusChip status={phoneNumber.status} /> : null}
        <button
          className="phone-top-btn"
          disabled={!isAuthenticated || isLoading || isRestarting}
          onClick={onRefresh}
          type="button"
        >
          <Icon name="refresh" size={15} />
          {isRestarting ? "Refreshing..." : "Refresh"}
        </button>
        <button className="phone-top-btn" disabled={!isAuthenticated} onClick={onCreate} type="button">
          <Icon name="plus" size={15} />
          Create
        </button>
        {phoneNumber?.status === "connected" ? (
          <button
            className="phone-top-btn"
            disabled={!isAuthenticated || isLoading || isRestarting}
            onClick={onRePair}
            type="button"
          >
            <Icon name="refresh" size={15} />
            {isRestarting ? "Re-pairing..." : "Re-pair"}
          </button>
        ) : null}
        {phoneNumber ? (
          <button
            className="phone-danger-btn"
            disabled={disconnectingId === phoneNumber.id}
            onClick={() => onDisconnect(phoneNumber)}
            type="button"
          >
            <Icon name="logOut" size={15} />
            {rowActionLabel(phoneNumber, disconnectingId === phoneNumber.id)}
          </button>
        ) : null}
      </div>
    </header>
  );
}

function PhoneNumberDetail({
  agents,
  assignments,
  assigningDirection,
  effectiveLoadError,
  effectiveLoadState,
  isAuthenticated,
  onAssignAgent,
  onCopy,
  onCreate,
  onRetry,
  pendingCount,
  phoneNumber,
}: {
  agents: ApiAgentResource[];
  assignments: PhoneAssignments;
  assigningDirection: AssignableDirection | null;
  effectiveLoadError: string;
  effectiveLoadState: "loading" | "ready" | "error";
  isAuthenticated: boolean;
  onAssignAgent: (direction: AssignableDirection, agentId: string) => void;
  onCopy: (value: string, label: string) => void;
  onCreate: () => void;
  onRetry: () => void;
  pendingCount: number;
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
          <div className="phone-section-copy">Give your WhatsApp number a descriptive name and inspect its login state.</div>
        </div>

        <div className="phone-qr-layout">
          <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
            <div className="phone-setting-row">
              <div className="phone-setting-icon">
                <Icon name="tag" size={16} />
              </div>
              <div className="phone-setting-body">
                <div>
                  <div className="phone-setting-label">Phone Number Label</div>
                  <div className="phone-setting-copy">This label is set when you create the WhatsApp login session.</div>
                </div>
                <input className="phone-field-value" readOnly value={displayName(phoneNumber)} />
              </div>
            </div>

            <div className="phone-setting-row">
              <div className="phone-setting-icon">
                <Icon name="message" size={16} />
              </div>
              <div className="phone-setting-body">
                <div className="phone-setting-line">
                  <div>
                    <div className="phone-setting-label">WhatsApp Login Status</div>
                    <div className="phone-setting-copy">The current QR or connection state for this phone number.</div>
                  </div>
                  <StatusChip status={phoneNumber.status} />
                </div>
              </div>
            </div>

            <div className="phone-setting-row">
              <div className="phone-setting-icon">
                <Icon name="phone" size={16} />
              </div>
              <div className="phone-setting-body">
                <div>
                  <div className="phone-setting-label">Phone Number</div>
                  <div className="phone-setting-copy">The number or WhatsApp identity associated with this login.</div>
                </div>
                <input className="phone-field-value" readOnly value={displayNumber(phoneNumber)} />
              </div>
            </div>

            <div className="phone-setting-row">
              <div className="phone-setting-icon">
                <Icon name="globe" size={16} />
              </div>
              <div className="phone-setting-body">
                <div>
                  <div className="phone-setting-label">Provider</div>
                  <div className="phone-setting-copy">The channel this number is provisioned through.</div>
                </div>
                <input className="phone-field-value is-muted" readOnly value="WhatsApp" />
              </div>
            </div>

            <div className="phone-setting-row">
              <div className="phone-setting-icon">
                <Icon name="agents" size={16} />
              </div>
              <div className="phone-setting-body">
                <div>
                  <div className="phone-setting-label">Selected Agents</div>
                  <div className="phone-setting-copy">Agents currently assigned to this number by call direction.</div>
                </div>
                <div className="phone-assignment-grid">
                  <AssignmentRow
                    agent={assignments.inbound}
                    agents={agents}
                    direction="inbound"
                    disabled={!isAuthenticated || phoneNumber.status !== "connected" || assigningDirection !== null}
                    isSaving={assigningDirection === "inbound"}
                    onChange={(agentId) => onAssignAgent("inbound", agentId)}
                  />
                  <AssignmentRow
                    agent={assignments.outbound}
                    agents={agents}
                    direction="outbound"
                    disabled={!isAuthenticated || phoneNumber.status !== "connected" || assigningDirection !== null}
                    isSaving={assigningDirection === "outbound"}
                    onChange={(agentId) => onAssignAgent("outbound", agentId)}
                  />
                </div>
              </div>
            </div>
          </div>
          {phoneNumber.qr_code && phoneNumber.status === "pending_qr" ? (
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
            <div className="phone-qr-placeholder">
              {phoneNumber.status === "pending_qr" ? "Waiting for QR code..." : statusLabels[phoneNumber.status]}
            </div>
          )}
        </div>
      </section>

      <section className="phone-config-section" aria-labelledby="phone-number-login-title">
        <div className="phone-section-head">
          <h2 className="phone-section-title" id="phone-number-login-title">Login Session</h2>
          <div className="phone-section-copy">Scan a pending QR code from WhatsApp to connect this number.</div>
        </div>
        <div className="phone-qr-note">
          {phoneNumber.status === "pending_qr"
            ? "This session is waiting for WhatsApp QR verification. Keep this page open while scanning."
            : phoneNumber.status === "connected"
              ? "This phone number is connected and ready for WhatsApp calling workflows."
              : `This phone number is ${statusLabels[phoneNumber.status].toLowerCase()}. Press Refresh to start a new login session and get a fresh QR code.`}
          {pendingCount > 1 ? ` There are ${pendingCount} pending QR sessions in this account.` : ""}
        </div>
      </section>

      <section className="phone-config-section" aria-labelledby="phone-number-metadata-title">
        <div className="phone-section-head">
          <h2 className="phone-section-title" id="phone-number-metadata-title">Connection Metadata</h2>
          <div className="phone-section-copy">Reference identifiers and timestamps for this WhatsApp number.</div>
        </div>
        <div className="phone-detail-grid">
          <MetaTile label="Created" value={formatDate(phoneNumber.created_at)} />
          <MetaTile label="Last connected" value={formatDate(phoneNumber.last_connected_at)} />
          <MetaTile label="Updated" value={formatDate(phoneNumber.updated_at)} />
          <MetaTile label="WhatsApp JID" value={phoneNumber.wa_jid || "Not assigned"} />
        </div>
        <div className="phone-setting-row">
          <div className="phone-setting-icon">
            <Icon name="hash" size={16} />
          </div>
          <div className="phone-setting-body">
            <div className="phone-setting-line">
              <div>
                <div className="phone-setting-label">Phone Number ID</div>
                <div className="phone-setting-copy">Use this identifier when referencing the number through internal APIs.</div>
              </div>
              <button className="phone-ghost-btn" onClick={() => onCopy(phoneNumber.id, "Phone number ID")} type="button">
                <Icon name="copy" size={14} />
                Copy
              </button>
            </div>
            <input className="phone-field-value" readOnly value={phoneNumber.id} />
          </div>
        </div>
      </section>
    </div>
  );
}

function MetaTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="phone-meta-tile">
      <div className="phone-meta-label">{label}</div>
      <div className="phone-meta-value" title={value}>{value}</div>
    </div>
  );
}

function StatusChip({ compact = false, status }: { compact?: boolean; status: PhoneNumberStatus }) {
  return (
    <span className={`phone-status-chip ${statusClass(status)}`} title={statusLabels[status]}>
      <span className="phone-dot" />
      {compact ? statusLabels[status].replace("Pending ", "") : statusLabels[status]}
    </span>
  );
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
  agents: ApiAgentResource[];
  disabled: boolean;
  direction: AssignableDirection;
  isSaving: boolean;
  onChange: (agentId: string) => void;
}) {
  const directionLabel = direction === "inbound" ? "Inbound" : "Outbound";

  return (
    <div className={`phone-assignment-row${agent ? "" : " is-empty"}`}>
      <div className="phone-assignment-direction">{directionLabel}</div>
      <div className="phone-assignment-main">
        <select
          aria-label={`${directionLabel} agent`}
          className="phone-assignment-select"
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          value={agent?.id ?? ""}
        >
          <option value="">No agent selected</option>
          {agents.map((item) => (
            <option key={item.id} value={item.id}>
              {agentDisplayName(item)}
            </option>
          ))}
        </select>
        {agent ? (
          <div className="phone-assignment-meta">
            <span>{agent.direction === "both" ? "Both directions" : `${directionLabel} only`}</span>
            <span className="phone-assignment-dot" />
            <span>{isSaving ? "Saving..." : agent.status}</span>
          </div>
        ) : (
          <div className="phone-assignment-meta">{isSaving ? "Saving..." : "Available"}</div>
        )}
      </div>
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
  onStart: () => void;
}) {
  return (
    <div className="phone-modal-backdrop" onMouseDown={(event) => event.currentTarget === event.target && onCancel()}>
      <form
        className="phone-modal-card"
        onSubmit={(event) => {
          event.preventDefault();
          onStart();
        }}
      >
        <div className="phone-modal-head">
          <div>
            <h2 className="phone-modal-title">Create Phone Number</h2>
            <div className="phone-modal-copy">
              Start a WhatsApp QR login session. The phone number is detected automatically after you scan the QR code.
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
        </div>
        <div className="phone-modal-footer">
          <button className="phone-top-btn" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="phone-ghost-btn" disabled={isStarting || !isAuthenticated} type="submit">
            <Icon name="plus" size={15} />
            {isStarting ? "Starting..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
