"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearance } from "@/components/theme/clerkAppearance";
import { listDashboardAgents as apiListAgents, type ApiAgentResource } from "@/lib/agents";
import { listPhoneNumbers as apiListPhoneNumbers, type ApiPhoneNumber } from "@/lib/phoneNumbers";
import {
  createCall as apiCreateCall,
  getCall as apiGetCall,
  type ApiCall,
  type ApiCallMessage,
} from "@/lib/calls";

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
  | "refresh"
  | "message"
  | "user"
  | "check"
  | "alert"
  | "clock"
  | "x";

type NavItem = {
  label: string;
  icon: IconName;
  href?: string;
  badge?: string;
};

type Notice = { kind: "success" | "error"; text: string };

// A demo call is watched by polling until it reaches one of these; nothing more
// happens to a call afterwards, so the poller can stop.
type CallPhase = "ringing" | "live" | "done" | "declined" | "failed" | "unknown";

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

// While a call is still ringing or connected the server row changes underneath
// us, so poll it; the watch gives up eventually so a call the runtime never
// closes out cannot poll forever.
const pollIntervalMs = 2500;
const maxWatchMs = 15 * 60 * 1000;

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
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
    case "message":
      return <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />;
    case "user":
      return (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0112 0v1" />
        </>
      );
    case "check":
      return <path d="M5 12.5l4 4 10-10" />;
    case "alert":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5M12 16.2v.3" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
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
.demo-shell {
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
.demo-shell * { box-sizing: border-box; }
.demo-shell button, .demo-shell input, .demo-shell select, .demo-shell textarea { font: inherit; }
.demo-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.demo-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.demo-shell ::-webkit-scrollbar-track { background: transparent; }
.demo-sidebar {
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
.demo-logo { align-items: center; display: flex; gap: 11px; padding: 4px 8px 26px; }
.demo-logo-mark {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border-radius: 10px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.demo-nav-kicker { color: var(--faint); font-size: 10.5px; font-weight: 700; letter-spacing: .9px; padding: 4px 10px 8px; text-transform: uppercase; }
.demo-nav { display: flex; flex-direction: column; gap: 3px; }
.demo-nav-item {
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
.demo-nav-item:hover { background: var(--app-hover); color: var(--app-text-soft); }
.demo-nav-item.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); font-weight: 700; }
.demo-nav-badge { background: var(--primary); border-radius: 20px; color: var(--app-on-accent); font-size: 10.5px; font-weight: 700; margin-left: auto; padding: 1px 7px; }
.demo-sidebar-footer { display: flex; flex-direction: column; gap: 14px; margin-top: auto; }
.demo-user-card { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; gap: 10px; padding: 10px 13px; }
.demo-user-name { font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.demo-user-email { color: var(--subtle); font-size: 11.5px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.demo-main { display: flex; flex: 1; flex-direction: column; min-width: 0; height: 100vh; overflow: hidden; }
.demo-content { padding: 20px 32px; flex: 1 1 auto; min-height: 0; overflow-y: auto; }
.demo-header { align-items: flex-start; display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; margin-bottom: 18px; }
.demo-title { font-size: 22px; font-weight: 850; letter-spacing: -.4px; margin: 0; }
.demo-subtitle { color: var(--subtle); font-size: 13px; margin-top: 4px; max-width: 620px; }
.demo-workspace {
  align-items: start;
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
  width: 100%;
}
.demo-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  display: grid;
  gap: 16px;
  padding: 18px;
}
.demo-card-head { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.demo-card-title { align-items: center; display: flex; font-size: 13.5px; font-weight: 850; gap: 8px; letter-spacing: -.1px; margin: 0; }
.demo-card-title .demo-card-ic { color: var(--primary-light); display: inline-flex; }
.demo-card-copy { color: var(--subtle); font-size: 12px; }
.demo-column { display: grid; gap: 16px; min-width: 0; }
.demo-field { display: grid; gap: 7px; min-width: 0; }
.demo-field-label { color: var(--subtle); font-size: 11.5px; font-weight: 700; }
.demo-field-hint { color: var(--faint); font-size: 11.5px; }
.demo-input, .demo-select {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  height: 42px;
  outline: none;
  padding: 0 12px;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.demo-input::placeholder { color: var(--faint); }
.demo-input:focus, .demo-select:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.demo-input:disabled, .demo-select:disabled { cursor: not-allowed; opacity: .5; }
.demo-select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--app-muted) 50%), linear-gradient(135deg, var(--app-muted) 50%, transparent 50%);
  background-position: calc(100% - 17px) 50%, calc(100% - 12px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 5px, 5px 5px;
  padding: 0 34px 0 12px;
}
.demo-select option { background: var(--surface); color: var(--text); }
.demo-primary-btn {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border: 1px solid transparent;
  border-radius: 12px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  color: var(--app-on-accent);
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 9px;
  justify-content: center;
  min-height: 46px;
  padding: 0 16px;
  transition: filter .18s ease;
  white-space: nowrap;
  width: 100%;
}
.demo-primary-btn:hover { filter: brightness(1.08); }
.demo-ghost-btn {
  align-items: center;
  background: var(--panel-hover);
  border: 1px solid var(--app-border-strong);
  border-radius: 11px;
  color: var(--text);
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  transition: background .18s ease;
  white-space: nowrap;
}
.demo-ghost-btn:hover { background: var(--app-panel-hover); }
.demo-primary-btn:disabled, .demo-ghost-btn:disabled { cursor: not-allowed; filter: grayscale(.35); opacity: .45; }
.demo-checklist { display: grid; gap: 8px; }
.demo-check {
  align-items: flex-start;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  display: grid;
  gap: 9px;
  grid-template-columns: 20px minmax(0, 1fr);
  padding: 10px 12px;
}
.demo-check-ic { display: inline-flex; padding-top: 1px; }
.demo-check.is-ok .demo-check-ic { color: var(--green); }
.demo-check.is-bad .demo-check-ic { color: var(--amber); }
.demo-check-text { font-size: 12.5px; }
.demo-check-note { color: var(--subtle); font-size: 11.5px; margin-top: 2px; }
.demo-check-note a { color: var(--primary-light); }
.demo-stage {
  align-items: center;
  display: grid;
  gap: 14px;
  justify-items: center;
  padding: 14px 0 4px;
  text-align: center;
}
.demo-orb {
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 92px;
  justify-content: center;
  position: relative;
  width: 92px;
}
.demo-orb::after {
  border-radius: 50%;
  content: "";
  inset: 0;
  position: absolute;
}
.demo-orb.is-ringing { background: var(--app-amber-soft); color: var(--amber); }
.demo-orb.is-ringing::after { border: 2px solid var(--app-amber-border); animation: demo-pulse 1.6s ease-out infinite; }
.demo-orb.is-live { background: var(--app-green-soft); color: var(--green); }
.demo-orb.is-live::after { border: 2px solid var(--app-green-border); animation: demo-pulse 2.2s ease-out infinite; }
.demo-orb.is-done { background: var(--app-hover-2); color: var(--muted); }
.demo-orb.is-failed { background: var(--app-rose-soft); color: var(--rose); }
@keyframes demo-pulse {
  0% { opacity: .9; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.35); }
}
.demo-stage-phase { font-size: 19px; font-weight: 850; letter-spacing: -.3px; }
.demo-stage-peer { color: var(--subtle); font-size: 13px; }
.demo-timer { font-family: var(--font-geist-mono), monospace; font-size: 26px; font-weight: 700; letter-spacing: -.5px; }
.demo-meta-grid { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.demo-meta-tile {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  display: grid;
  gap: 4px;
  min-width: 0;
  padding: 12px;
}
.demo-meta-label { color: var(--faint); font-size: 10.5px; font-weight: 800; letter-spacing: .8px; text-transform: uppercase; }
.demo-meta-value { color: var(--text); font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.demo-meta-value.is-muted { color: var(--subtle); }
.demo-status-chip {
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
.demo-status-ended { background: var(--app-green-soft); color: var(--green); }
.demo-status-answered { background: var(--app-sky-soft); color: var(--sky); }
.demo-status-received { background: var(--app-amber-soft); color: var(--amber); }
.demo-status-declined { background: var(--app-orange-soft); color: var(--orange); }
.demo-status-failed { background: var(--app-rose-soft); color: var(--rose); }
.demo-status-neutral { background: var(--app-border); color: var(--subtle); }
.demo-dot { background: currentColor; border-radius: 50%; height: 6px; width: 6px; }
.demo-transcript { display: flex; flex-direction: column; gap: 10px; max-height: 420px; overflow-y: auto; }
.demo-turn { display: flex; gap: 10px; max-width: 92%; }
.demo-turn.is-user { align-self: flex-end; flex-direction: row-reverse; }
.demo-turn-avatar {
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
.demo-turn.is-assistant .demo-turn-avatar { background: var(--primary-soft); border: 1px solid var(--app-primary-ring); color: var(--primary-light); }
.demo-turn.is-user .demo-turn-avatar { background: var(--app-green-soft); border: 1px solid var(--app-green-border); color: var(--green); }
.demo-turn-bubble {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  color: var(--text);
  font-size: 13px;
  line-height: 1.5;
  padding: 10px 12px;
}
.demo-turn.is-user .demo-turn-bubble { background: var(--app-green-soft); border-color: var(--app-green-soft-2); }
.demo-turn-role { color: var(--faint); font-size: 10px; font-weight: 800; letter-spacing: .6px; margin-bottom: 3px; text-transform: uppercase; }
.demo-message {
  align-items: center;
  color: var(--subtle);
  display: flex;
  font-size: 12.5px;
  justify-content: center;
  min-height: 90px;
  padding: 12px 2px;
  text-align: center;
}
.demo-empty-stage {
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
  min-height: 360px;
  padding: 40px;
  text-align: center;
}
.demo-empty-stage p { margin: 0; max-width: 420px; }
.demo-history { display: grid; gap: 8px; }
.demo-history-row {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  color: var(--text);
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 9px 10px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease;
  width: 100%;
}
.demo-history-row:hover { background: var(--app-hover); }
.demo-history-row.is-active { background: var(--primary-soft); border-color: var(--app-primary-border); }
.demo-history-peer { flex: 1; font-size: 13px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.demo-history-time { color: var(--subtle); font-size: 11.5px; }
.demo-inline-error {
  background: var(--app-rose-soft);
  border: 1px solid var(--app-rose-border);
  border-radius: 11px;
  color: var(--app-rose-text);
  font-size: 12.5px;
  padding: 10px 12px;
}
.demo-toast {
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
.demo-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-green-text); }
.demo-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
@media (max-width: 1180px) {
  .demo-workspace { grid-template-columns: minmax(300px, 380px) minmax(0, 1fr); }
  .demo-meta-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 900px) {
  .demo-shell { display: block; height: auto; max-height: none; overflow: visible; }
  .demo-main { height: auto; overflow: visible; }
  .demo-content { overflow: visible; padding: 20px; }
  .demo-workspace { grid-template-columns: 1fr; }
  .demo-sidebar { height: auto; position: static; width: 100%; }
  .demo-sidebar-footer { margin-top: 18px; }
  .demo-user-card { display: none; }
  .demo-nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .demo-nav { grid-template-columns: 1fr 1fr; }
  .demo-content { padding: 14px; }
  .demo-meta-grid { grid-template-columns: 1fr; }
}
`;

// A phone number reaches the dialer as a WhatsApp JID, and the server hands the
// stored peer back in that form. Show the number dialably and a LID verbatim, so
// the two are never confused.
function peerLabel(peer: string | null | undefined) {
  const raw = peer?.trim();
  if (!raw) return "Unknown";
  const [user, server] = raw.split("@");
  if (!user) return raw;
  return server === "s.whatsapp.net" ? `+${user}` : user;
}

function phoneNumberLabel(pn: ApiPhoneNumber): string {
  const number = pn.phone_number?.trim();
  const label = pn.label?.trim();
  if (label && number) return `${label} · ${number}`;
  return label || number || "Unnamed number";
}

function agentName(agent: ApiAgentResource): string {
  return agent.agent?.name?.trim() || "Untitled agent";
}

// The server defaults an unset direction to "outbound"; mirror that here so an
// agent saved before the field existed is still offered.
function agentDirection(agent: ApiAgentResource): string {
  return agent.agent?.call_direction?.trim() || "outbound";
}

function canDialOut(agent: ApiAgentResource): boolean {
  const direction = agentDirection(agent);
  return direction === "outbound" || direction === "both";
}

function isAgentLive(agent: ApiAgentResource): boolean {
  // Agents are stored as active/inactive; anything unset counts as active, the
  // same reading the agents workspace uses.
  return (agent.agent?.status ?? "active") !== "inactive";
}

function callPhase(call: ApiCall | null): CallPhase {
  switch (call?.status) {
    case "received":
      return "ringing";
    case "answered":
      return "live";
    case "ended":
      return "done";
    case "declined":
      return "declined";
    case "failed":
      return "failed";
    default:
      return "unknown";
  }
}

function isWatchablePhase(phase: CallPhase): boolean {
  return phase === "ringing" || phase === "live" || phase === "unknown";
}

const phaseHeadlines: Record<CallPhase, string> = {
  ringing: "Ringing…",
  live: "Call in progress",
  done: "Call ended",
  declined: "Call declined",
  failed: "Call failed",
  unknown: "Placing call…",
};

const phaseCopy: Record<CallPhase, string> = {
  ringing: "The agent is dialling. Answer on WhatsApp to start talking.",
  live: "The agent is speaking. The transcript fills in as the call goes on.",
  done: "The call finished. The full transcript is below.",
  declined: "The call was cut before it was answered.",
  failed: "The call could not be completed.",
  unknown: "Waiting for the first status from the call runtime.",
};

function orbClass(phase: CallPhase) {
  switch (phase) {
    case "ringing":
    case "unknown":
      return "is-ringing";
    case "live":
      return "is-live";
    case "declined":
    case "failed":
      return "is-failed";
    default:
      return "is-done";
  }
}

function statusClass(status: string) {
  switch (status) {
    case "ended":
      return "demo-status-ended";
    case "answered":
      return "demo-status-answered";
    case "received":
      return "demo-status-received";
    case "declined":
      return "demo-status-declined";
    case "failed":
      return "demo-status-failed";
    default:
      return "demo-status-neutral";
  }
}

function statusText(status: string) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatClock(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const rem = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return timeFormatter.format(date);
}

// normalizeTarget turns whatever was typed into what the server accepts: a JID
// passes through untouched, anything else becomes a "+" and digits, so spaces,
// dashes and parentheses out of a contacts app do not have to be cleaned by hand.
function normalizeTarget(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.includes("@")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

// Mirrors the server's own dialable check, so an obvious typo is caught before
// it becomes a bogus JID on the wire.
function isDialable(target: string): boolean {
  if (target.includes("@")) return true;
  return /^\+\d{5,15}$/.test(target);
}

export default function DemoCallPage() {
  const { user, isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn: isAuthSignedIn } = useAuth();

  const [agents, setAgents] = useState<ApiAgentResource[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<ApiPhoneNumber[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [target, setTarget] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");

  // Calls placed from this tab, newest first. The Calls workspace keeps the
  // durable history; this list only exists so a demo session can flip back to a
  // call it just placed.
  const [sessionCalls, setSessionCalls] = useState<ApiCall[]>([]);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<ApiCall | null>(null);
  const [watchError, setWatchError] = useState("");
  const [watchKey, setWatchKey] = useState(0);
  // The id of the call whose watch ran out the clock. A watch otherwise ends by
  // the call reaching a status that cannot change again, which the phase below
  // already tells us, so this is the only stop reason worth storing.
  const [timedOutCallId, setTimedOutCallId] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const isAuthenticated = Boolean(isUserLoaded && isAuthLoaded && isUserSignedIn && isAuthSignedIn && user);
  const authError =
    !isUserLoaded || !isAuthLoaded
      ? null
      : !isUserSignedIn || !isAuthSignedIn || !user
        ? "Sign in to place a demo call."
        : null;
  const effectiveLoadState = !isUserLoaded || !isAuthLoaded ? "loading" : authError ? "error" : loadState;
  const effectiveLoadError = authError ?? loadError;

  useEffect(() => {
    if (!isUserLoaded || !isAuthLoaded) return;
    if (!isAuthenticated) return;

    let cancelled = false;
    (async () => {
      setLoadState("loading");
      setLoadError("");
      try {
        const [agentRows, numberRows] = await Promise.all([
          apiListAgents(getToken),
          apiListPhoneNumbers(getToken),
        ]);
        if (cancelled) return;
        setAgents(agentRows);
        setPhoneNumbers(numberRows);
        setLoadState("ready");
      } catch (error) {
        if (cancelled) return;
        setLoadState("error");
        setLoadError(error instanceof Error ? error.message : "Failed to load agents");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isAuthenticated, isUserLoaded, isAuthLoaded, reloadKey]);

  const dialableAgents = useMemo(() => agents.filter(canDialOut), [agents]);

  // The picker falls back to the first agent that is actually ready to dial, so
  // the common case is one field and one click. Resolving it here rather than
  // writing it back into state keeps the choice correct while the agent list is
  // still loading or after it reloads without the previously chosen agent.
  const resolvedAgentId = useMemo(() => {
    if (selectedAgentId && dialableAgents.some((agent) => agent.id === selectedAgentId)) {
      return selectedAgentId;
    }
    const ready = dialableAgents.find((agent) => isAgentLive(agent) && agent.agent?.phone_number_id);
    return (ready ?? dialableAgents[0])?.id ?? "";
  }, [dialableAgents, selectedAgentId]);

  const selectedAgent = useMemo(
    () => dialableAgents.find((agent) => agent.id === resolvedAgentId) ?? null,
    [dialableAgents, resolvedAgentId]
  );
  const selectedNumberId = selectedAgent?.agent?.phone_number_id ?? null;
  const selectedNumber = useMemo(
    () => (selectedNumberId ? phoneNumbers.find((pn) => pn.id === selectedNumberId) ?? null : null),
    [phoneNumbers, selectedNumberId]
  );

  const normalizedTarget = normalizeTarget(target);
  const hasNumber = Boolean(selectedNumber);
  const isNumberConnected = selectedNumber?.status === "connected";
  const isLive = Boolean(selectedAgent && isAgentLive(selectedAgent));
  const canPlace =
    isAuthenticated &&
    !isPlacing &&
    Boolean(selectedAgent) &&
    Boolean(selectedNumberId) &&
    isNumberConnected &&
    isDialable(normalizedTarget);

  const shownCall =
    activeCall && activeCall.id === activeCallId
      ? activeCall
      : sessionCalls.find((call) => call.id === activeCallId) ?? null;
  const phase = callPhase(shownCall);
  const isWatching =
    Boolean(activeCallId) && isWatchablePhase(phase) && timedOutCallId !== activeCallId;

  // Poll the active call while it can still change. Each pass schedules the
  // next one itself, so a slow response never stacks requests, and the watch
  // gives up at maxWatchMs rather than polling a stuck call forever.
  useEffect(() => {
    if (!isAuthenticated || !activeCallId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startedAt = Date.now();

    const tick = async () => {
      try {
        const full = await apiGetCall(activeCallId, getToken);
        if (cancelled) return;
        setWatchError("");
        setActiveCall(full);
        setSessionCalls((current) =>
          current.map((call) => (call.id === full.id ? { ...call, ...full } : call))
        );
        // A call that can no longer change needs no further polling; the
        // derived phase turns the watch indicator off on its own.
        if (!isWatchablePhase(callPhase(full))) return;
      } catch (error) {
        if (cancelled) return;
        // A transient failure should not kill the watch; a persistent one stops
        // it at the deadline below.
        setWatchError(error instanceof Error ? error.message : "Failed to read the call");
      }
      if (cancelled) return;
      if (Date.now() - startedAt > maxWatchMs) {
        setTimedOutCallId(activeCallId);
        return;
      }
      timer = setTimeout(tick, pollIntervalMs);
    };

    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [activeCallId, getToken, isAuthenticated, watchKey]);

  // Drive the on-screen timer while a call is connected; the stored duration
  // only lands once the call ends.
  useEffect(() => {
    if (phase !== "live") return;
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const [notice, setNotice] = useState<Notice | null>(null);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const placeCall = useCallback(async () => {
    if (!canPlace || !selectedAgent || !selectedNumberId) return;

    setIsPlacing(true);
    setPlaceError("");
    try {
      const call = await apiCreateCall(
        { phone_number_id: selectedNumberId, to: normalizedTarget, agent_id: selectedAgent.id },
        getToken
      );
      setSessionCalls((current) => [call, ...current.filter((item) => item.id !== call.id)]);
      setActiveCall(call);
      setActiveCallId(call.id);
      setWatchError("");
      setWatchKey((key) => key + 1);
      setNotice({ kind: "success", text: `Calling ${peerLabel(call.peer) || normalizedTarget}` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to place the call";
      setPlaceError(message);
      setNotice({ kind: "error", text: message });
    } finally {
      setIsPlacing(false);
    }
  }, [canPlace, getToken, normalizedTarget, selectedAgent, selectedNumberId]);

  const elapsedSeconds = useMemo(() => {
    if (!shownCall) return null;
    if (shownCall.duration_seconds != null) return shownCall.duration_seconds;
    if (shownCall.status === "answered" && shownCall.answered_at) {
      const answeredAt = new Date(shownCall.answered_at).getTime();
      if (!Number.isNaN(answeredAt)) return Math.max(0, Math.round((nowMs - answeredAt) / 1000));
    }
    return null;
  }, [nowMs, shownCall]);

  return (
    <div className="demo-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Sidebar activeLabel="Demo Call" />

      <main className="demo-main">
        <div className="demo-content">
          <header className="demo-header">
            <div>
              <h1 className="demo-title">Demo Call</h1>
              <div className="demo-subtitle">
                Place a live outbound call to try an agent end to end. Pick the agent, enter the number
                to ring, and watch the call and its transcript as it happens.
              </div>
            </div>
            <button
              className="demo-ghost-btn"
              disabled={!isAuthenticated || effectiveLoadState === "loading"}
              onClick={() => setReloadKey((key) => key + 1)}
              type="button"
            >
              <Icon name="refresh" size={15} sw={2.2} />
              Reload agents
            </button>
          </header>

          <section className="demo-workspace" aria-label="Demo call workspace">
            <div className="demo-column">
              <div className="demo-card">
                <div className="demo-card-head">
                  <h2 className="demo-card-title">
                    <span className="demo-card-ic">
                      <Icon name="phoneOut" size={16} />
                    </span>
                    Place a call
                  </h2>
                </div>

                {effectiveLoadState === "error" ? (
                  <div className="demo-inline-error">{effectiveLoadError}</div>
                ) : null}

                <div className="demo-field">
                  <label className="demo-field-label" htmlFor="demo-agent">
                    Agent
                  </label>
                  <select
                    className="demo-select"
                    disabled={!isAuthenticated || dialableAgents.length === 0}
                    id="demo-agent"
                    onChange={(event) => setSelectedAgentId(event.target.value)}
                    value={resolvedAgentId}
                  >
                    {dialableAgents.length === 0 ? (
                      <option value="">
                        {effectiveLoadState === "loading" ? "Loading agents..." : "No outbound-capable agents"}
                      </option>
                    ) : (
                      dialableAgents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agentName(agent)}
                          {isAgentLive(agent) ? "" : " (paused)"}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="demo-field-hint">
                    Only agents set to outbound or both calls can dial. The agent that speaks is the one
                    assigned to its phone number.
                  </div>
                </div>

                <div className="demo-field">
                  <span className="demo-field-label">Calling from</span>
                  <div className="demo-meta-tile">
                    <div className="demo-meta-label">Phone number</div>
                    <div className={`demo-meta-value${selectedNumber ? "" : " is-muted"}`}>
                      {selectedNumber
                        ? phoneNumberLabel(selectedNumber)
                        : selectedNumberId
                          ? "Assigned number not found"
                          : "No number assigned"}
                    </div>
                  </div>
                </div>

                <div className="demo-field">
                  <label className="demo-field-label" htmlFor="demo-to">
                    Number to call
                  </label>
                  <input
                    autoComplete="tel"
                    className="demo-input"
                    disabled={!isAuthenticated}
                    id="demo-to"
                    inputMode="tel"
                    onChange={(event) => setTarget(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") placeCall();
                    }}
                    placeholder="+15557654321"
                    type="tel"
                    value={target}
                  />
                  <div className="demo-field-hint">
                    {normalizedTarget && !isDialable(normalizedTarget)
                      ? "Enter an international number, for example +15557654321."
                      : normalizedTarget
                        ? `Dialling ${normalizedTarget} on WhatsApp.`
                        : "The number must be on WhatsApp and in international format."}
                  </div>
                </div>

                {placeError ? <div className="demo-inline-error">{placeError}</div> : null}

                <button className="demo-primary-btn" disabled={!canPlace} onClick={placeCall} type="button">
                  <Icon name="phoneOut" size={17} stroke="#fff" sw={2.1} />
                  {isPlacing ? "Calling..." : "Start demo call"}
                </button>
              </div>

              <div className="demo-card">
                <div className="demo-card-head">
                  <h2 className="demo-card-title">
                    <span className="demo-card-ic">
                      <Icon name="check" size={16} />
                    </span>
                    Before you dial
                  </h2>
                </div>
                <div className="demo-checklist">
                  <Check
                    ok={Boolean(selectedAgent)}
                    text={selectedAgent ? `Agent "${agentName(selectedAgent)}" selected` : "Pick an agent that can dial out"}
                    note={
                      selectedAgent ? undefined : (
                        <>
                          Set an agent&apos;s call direction to outbound or both in{" "}
                          <Link href="/dashboard/agents">Agents</Link>.
                        </>
                      )
                    }
                  />
                  <Check
                    ok={isLive}
                    text={isLive ? "Agent is live" : "Agent is paused"}
                    note={isLive ? undefined : <>A paused agent has no live session to speak on the call.</>}
                  />
                  <Check
                    ok={hasNumber}
                    text={hasNumber ? "Phone number assigned" : "No phone number assigned to this agent"}
                    note={
                      hasNumber ? undefined : (
                        <>
                          Assign one on the agent in <Link href="/dashboard/agents">Agents</Link>.
                        </>
                      )
                    }
                  />
                  <Check
                    ok={Boolean(isNumberConnected)}
                    text={
                      isNumberConnected
                        ? "Phone number is connected"
                        : hasNumber
                          ? `Phone number is ${selectedNumber?.status ?? "not connected"}`
                          : "Phone number is not connected"
                    }
                    note={
                      isNumberConnected ? undefined : (
                        <>
                          Reconnect it in <Link href="/dashboard/phone-numbers">Phone Numbers</Link>. A number
                          linked before its agent was assigned has to be reconnected.
                        </>
                      )
                    }
                  />
                </div>
              </div>

              {sessionCalls.length > 0 ? (
                <div className="demo-card">
                  <div className="demo-card-head">
                    <h2 className="demo-card-title">
                      <span className="demo-card-ic">
                        <Icon name="clock" size={16} />
                      </span>
                      This session
                    </h2>
                    <Link className="demo-card-copy" href="/dashboard/calls">
                      Full history
                    </Link>
                  </div>
                  <div className="demo-history">
                    {sessionCalls.map((call) => (
                      <button
                        aria-pressed={call.id === activeCallId}
                        className={`demo-history-row${call.id === activeCallId ? " is-active" : ""}`}
                        key={call.id}
                        onClick={() => {
                          setActiveCallId(call.id);
                          setWatchKey((key) => key + 1);
                        }}
                        type="button"
                      >
                        <span className="demo-history-peer">{peerLabel(call.peer)}</span>
                        <span className="demo-history-time">{formatTime(call.created_at)}</span>
                        <StatusChip status={call.status} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="demo-column">
              {shownCall ? (
                <LiveCall
                  call={shownCall}
                  elapsedSeconds={elapsedSeconds}
                  isWatching={isWatching}
                  onWatchAgain={() => {
                    setTimedOutCallId(null);
                    setWatchKey((key) => key + 1);
                  }}
                  phase={phase}
                  watchError={watchError}
                />
              ) : (
                <div className="demo-empty-stage">
                  <Icon name="phoneOut" size={30} stroke="#5d5d68" sw={1.6} />
                  <p>
                    No demo call yet. Pick an agent, enter a WhatsApp number, and the call will appear here
                    with its live status and transcript.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {notice ? (
        <div className={`demo-toast ${notice.kind === "error" ? "demo-toast-error" : "demo-toast-success"}`} role="status">
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

function Sidebar({ activeLabel }: { activeLabel: string }) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();

  return (
    <aside className="demo-sidebar">
      <div className="demo-logo">
        <div className="demo-logo-mark">
          <Icon name="spark" size={18} stroke="#fff" sw={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.3px" }}>Voca</div>
          <div style={{ color: "var(--app-subtle)", fontSize: 11, fontWeight: 500, marginTop: -1 }}>AI Voice Agents</div>
        </div>
      </div>
      <div className="demo-nav-kicker">Menu</div>
      <nav className="demo-nav" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const content = (
            <>
              <span style={{ display: "flex", justifyContent: "center", width: 18 }}>
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
              {item.badge ? <span className="demo-nav-badge">{item.badge}</span> : null}
            </>
          );
          const className = `demo-nav-item${item.label === activeLabel ? " is-active" : ""}`;

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
      <div className="demo-sidebar-footer">
        <ThemeToggle />
        <div className="demo-user-card">
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span style={{ minWidth: 0 }}>
            <div className="demo-user-name">{user?.fullName || user?.username || "Account"}</div>
            <div className="demo-user-email">{user?.primaryEmailAddress?.emailAddress ?? ""}</div>
          </span>
        </div>
      </div>
    </aside>
  );
}

function Check({ ok, text, note }: { ok: boolean; text: string; note?: ReactNode }) {
  return (
    <div className={`demo-check ${ok ? "is-ok" : "is-bad"}`}>
      <span className="demo-check-ic">
        <Icon name={ok ? "check" : "alert"} size={15} sw={2.2} />
      </span>
      <div>
        <div className="demo-check-text">{text}</div>
        {note ? <div className="demo-check-note">{note}</div> : null}
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  return (
    <span className={`demo-status-chip ${statusClass(status)}`}>
      <span className="demo-dot" />
      {statusText(status)}
    </span>
  );
}

function LiveCall({
  call,
  elapsedSeconds,
  isWatching,
  onWatchAgain,
  phase,
  watchError,
}: {
  call: ApiCall;
  elapsedSeconds: number | null;
  isWatching: boolean;
  onWatchAgain: () => void;
  phase: CallPhase;
  watchError: string;
}) {
  const messages = call.messages ?? [];
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  // Follow the conversation as new turns land, the way a live transcript should.
  useEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  return (
    <>
      <div className="demo-card">
        <div className="demo-card-head">
          <h2 className="demo-card-title">
            <span className="demo-card-ic">
              <Icon name="phoneOut" size={16} />
            </span>
            Live call
          </h2>
          <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
            <StatusChip status={call.status} />
            {!isWatching && isWatchablePhase(phase) ? (
              <button className="demo-ghost-btn" onClick={onWatchAgain} type="button">
                <Icon name="refresh" size={15} sw={2.2} />
                Keep watching
              </button>
            ) : null}
          </div>
        </div>

        <div className="demo-stage">
          <div className={`demo-orb ${orbClass(phase)}`}>
            <Icon name="phoneOut" size={34} sw={1.7} />
          </div>
          <div>
            <div className="demo-stage-phase">{phaseHeadlines[phase]}</div>
            <div className="demo-stage-peer">{peerLabel(call.peer)}</div>
          </div>
          {elapsedSeconds != null ? <div className="demo-timer">{formatClock(elapsedSeconds)}</div> : null}
          <div className="demo-card-copy">{phaseCopy[phase]}</div>
        </div>

        {watchError ? <div className="demo-inline-error">{watchError}</div> : null}

        <div className="demo-meta-grid">
          <MetaTile label="Started" value={formatTime(call.created_at)} />
          <MetaTile label="Answered" value={formatTime(call.answered_at)} muted={!call.answered_at} />
          <MetaTile label="Ended" value={formatTime(call.ended_at)} muted={!call.ended_at} />
          <MetaTile label="Call ID" value={call.call_id} />
          <MetaTile label="Direction" value={call.call_type === "inbound" ? "Inbound" : "Outbound"} />
          <MetaTile label="End reason" value={call.end_reason ?? "—"} muted={!call.end_reason} />
        </div>
      </div>

      <div className="demo-card">
        <div className="demo-card-head">
          <h2 className="demo-card-title">
            <span className="demo-card-ic">
              <Icon name="message" size={16} />
            </span>
            Transcript
          </h2>
          <span className="demo-card-copy">
            {messages.length > 0
              ? `${messages.length} turn${messages.length === 1 ? "" : "s"}`
              : isWatching
                ? "Listening…"
                : "Conversation replay"}
          </span>
        </div>
        {messages.length === 0 ? (
          <div className="demo-message">
            {phase === "ringing" || phase === "unknown"
              ? "Turns appear once the call is answered."
              : phase === "live"
                ? "Waiting for the first turn..."
                : "No transcript was saved for this call."}
          </div>
        ) : (
          <div className="demo-transcript" ref={transcriptRef}>
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
    <div className="demo-meta-tile">
      <div className="demo-meta-label">{label}</div>
      <div className={`demo-meta-value${muted ? " is-muted" : ""}`} title={value}>
        {value}
      </div>
    </div>
  );
}

function TranscriptTurn({ message }: { message: ApiCallMessage }) {
  const isUser = message.role === "user";
  const roleLabel = isUser ? "Callee" : message.role === "assistant" ? "Agent" : message.role;
  return (
    <div className={`demo-turn ${isUser ? "is-user" : "is-assistant"}`}>
      <span className="demo-turn-avatar">
        <Icon name={isUser ? "user" : "spark"} size={15} />
      </span>
      <div className="demo-turn-bubble">
        <div className="demo-turn-role">{roleLabel}</div>
        {message.content}
      </div>
    </div>
  );
}
