"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import ExpandableCardDemoStandard from "@/components/expandable-card-demo-standard";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  navItemsForMode,
  useWorkspaceMode,
  WorkspaceModeToggle,
} from "@/components/nav/workspaceMode";
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
  | "refresh"
  | "search"
  | "trash"
  | "message"
  | "clock"
  | "user"
  | "hash"
  | "check"
  | "copy"
  | "save"
  | "list"
  | "chevron"
  | "x";


type DetailState = "idle" | "loading" | "ready" | "error";
type ViewMode = "list" | "grid";
type Notice = { kind: "success" | "error"; text: string };


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
    case "copy":
      return (
        <>
          <rect height="12" rx="2" width="12" x="8" y="8" />
          <path d="M4 16V6a2 2 0 012-2h10" />
        </>
      );
    case "save":
      return (
        <>
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
          <path d="M17 21v-8H7v8M7 3v5h8" />
        </>
      );
    case "list":
      return (
        <>
          <path d="M9 6h11M9 12h11M9 18h11" />
          <path d="M4 6h.01M4 12h.01M4 18h.01" />
        </>
      );
    case "chevron":
      return <path d="M8 10l4 4 4-4" />;
    case "x":
      return <path d="M18 6L6 18M6 6l12 12" />;
  }
}

function Icon({
  name,
  className,
  size = 18,
  stroke = "currentColor",
  sw = 2,
}: {
  name: IconName;
  className?: string;
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
.calls-shell {
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
  overflow-y: auto;
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
.calls-sidebar-footer { display: flex; flex-direction: column; gap: 14px; margin-top: auto; padding-top: 18px; }
.calls-user-card { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; gap: 10px; padding: 10px 13px; }
.calls-user-name { font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-user-email { color: var(--app-subtle); font-size: 11.5px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-main { display: flex; flex: 1; flex-direction: column; height: 100vh; min-width: 0; overflow: hidden; }
.calls-topbar {
  align-items: center;
  background: var(--app-topbar);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 16px;
  padding: 20px 32px;
}
.calls-topbar-heading { flex: 1; min-width: 0; }
.calls-topbar-title { font-size: 21px; font-weight: 800; letter-spacing: -.4px; line-height: 1.15; margin: 0; }
.calls-topbar-copy { color: var(--subtle); font-size: 12.5px; margin-top: 3px; }
.calls-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 20px 32px 32px; }
.calls-browse { display: flex; flex-direction: column; gap: 16px; margin: 0 auto; max-width: 1320px; width: 100%; }
.calls-toolbar { align-items: center; display: flex; flex-wrap: wrap; gap: 12px; }
.calls-toolbar-search { flex: 1 1 240px; max-width: 420px; }
.calls-toolbar .calls-count { margin-left: auto; }
.calls-view-toggle {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  display: inline-flex;
  flex-shrink: 0;
  gap: 2px;
  padding: 3px;
}
.calls-view-btn {
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
.calls-view-btn:hover { color: var(--text); }
.calls-view-btn.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); }
.calls-view-btn:disabled { cursor: not-allowed; opacity: .45; }
.calls-count {
  background: var(--app-hover-2);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  color: var(--subtle);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  padding: 6px 10px;
  white-space: nowrap;
}
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
  transition: filter .18s ease, background .18s ease, border-color .18s ease, transform .18s ease;
  white-space: nowrap;
}
.calls-top-btn:hover, .calls-ghost-btn:hover, .calls-danger-btn:hover { transform: translateY(-1px); }
.calls-top-btn, .calls-ghost-btn { background: var(--panel-hover); color: var(--text); }
.calls-danger-btn { background: var(--app-rose-soft-2); border-color: var(--app-rose-border-strong); color: var(--app-rose-text); }
.calls-danger-btn:hover { background: var(--app-rose-border); }
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
  transition: filter .18s ease, transform .18s ease;
  white-space: nowrap;
}
.calls-primary-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
.calls-top-btn:disabled, .calls-ghost-btn:disabled, .calls-danger-btn:disabled, .calls-primary-btn:disabled {
  cursor: not-allowed;
  filter: grayscale(.35);
  opacity: .45;
  transform: none;
}
.calls-icon-btn {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
  width: 40px;
}
.calls-icon-btn:hover { background: var(--app-hover-2); border-color: var(--app-border-strong); color: var(--app-text-strong); }
.calls-icon-btn:disabled { cursor: not-allowed; opacity: .45; }
.calls-search-wrap { position: relative; }
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
.calls-list { display: flex; flex-direction: column; gap: 10px; }
.calls-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
.calls-list-message {
  align-items: center;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  font-size: 13.5px;
  font-weight: 650;
  gap: 14px;
  justify-content: center;
  min-height: 240px;
  padding: 40px;
  text-align: center;
}
.calls-list-message p { margin: 0; max-width: 440px; }
.calls-section .calls-list-message { border: 0; min-height: 90px; padding: 16px; }
.calls-row {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 16px;
  grid-template-columns: 38px minmax(160px, 1.2fr) minmax(110px, .6fr) minmax(150px, .9fr) minmax(90px, .5fr) auto 18px;
  padding: 13px 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
  width: 100%;
}
.calls-row:hover { background: var(--panel-hover); border-color: var(--app-primary-ring); box-shadow: 0 6px 18px var(--app-shadow-soft); transform: translateY(-1px); }
.calls-row:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.calls-row.is-active { border-color: var(--app-primary-border); box-shadow: inset 0 0 0 1px var(--app-primary-ring); }
.calls-row-dir {
  align-items: center;
  background: var(--primary-soft);
  border: 1px solid var(--app-primary-ring);
  border-radius: 11px;
  color: var(--primary-light);
  display: inline-flex;
  flex: 0 0 auto;
  height: 38px;
  justify-content: center;
  width: 38px;
}
.calls-row-identity, .calls-row-field { display: block; min-width: 0; }
.calls-row-field > span { display: block; font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-row-label { color: var(--faint); display: block; font-size: 9.5px; font-weight: 850; letter-spacing: .7px; margin-bottom: 3px; text-transform: uppercase; }
.calls-row-peer { display: block; font-size: 14px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-row-id { color: var(--faint); display: block; font-family: var(--font-geist-mono), monospace; font-size: 11px; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-row-chevron { color: var(--faint); transform: rotate(-90deg); transition: color .18s ease; }
.calls-row:hover .calls-row-chevron { color: var(--primary-light); }
.calls-card-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 178px;
  padding: 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
  width: 100%;
}
.calls-card-item:hover {
  background: var(--panel-hover);
  border-color: var(--app-primary-border);
  box-shadow: 0 12px 30px var(--app-shadow-soft);
  transform: translateY(-2px);
}
.calls-card-item:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.calls-card-item.is-active { border-color: var(--app-primary-border); box-shadow: inset 0 0 0 1px var(--app-primary-ring); }
.calls-card-top { align-items: center; display: flex; gap: 11px; min-width: 0; }
.calls-card-identity { min-width: 0; }
.calls-card-meta { display: grid; gap: 10px; grid-template-columns: 1fr 1fr; margin-top: auto; }
.calls-card-tile {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  min-width: 0;
  padding: 9px 10px;
}
.calls-card-tile > span { display: block; font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calls-card-foot { align-items: center; display: flex; gap: 8px; justify-content: space-between; }
.expandable-card-backdrop { background: var(--app-overlay); backdrop-filter: blur(6px); inset: 0; position: fixed; z-index: 80; }
.expandable-card-stage { align-items: center; display: flex; inset: 0; justify-content: center; padding: 24px; pointer-events: none; position: fixed; z-index: 90; }
.expandable-card-panel { pointer-events: auto; }
.calls-expandable-card {
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  box-shadow: 0 30px 90px var(--app-shadow-color), 0 0 0 1px var(--app-primary-ring);
  max-height: min(820px, calc(100vh - 48px));
  max-width: 1000px;
  overflow: auto;
  padding: 16px;
  width: 100%;
}
.calls-detail { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
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
  padding: 6px 9px;
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
  background: var(--app-hover-2);
  border: 1px solid var(--app-border-strong);
  border-radius: 999px;
  color: var(--app-text-soft);
  display: inline-flex;
  font-size: 11px;
  font-weight: 800;
  gap: 5px;
  letter-spacing: .4px;
  padding: 5px 9px;
  text-transform: uppercase;
}
.calls-edit-grid { display: grid; gap: 12px; grid-template-columns: minmax(0, 200px) minmax(0, 1fr) auto; align-items: end; }
.calls-field { display: grid; gap: 7px; min-width: 0; }
.calls-field-label { color: var(--subtle); font-size: 11.5px; font-weight: 800; }
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
.calls-toast {
  border-radius: 12px;
  bottom: 24px;
  box-shadow: 0 18px 50px var(--app-shadow-color);
  font-size: 13px;
  font-weight: 750;
  left: 50%;
  max-width: min(480px, calc(100vw - 48px));
  padding: 12px 18px;
  position: fixed;
  transform: translateX(-50%);
  z-index: 140;
}
.calls-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-toast-success-text); }
.calls-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
@media (max-width: 1180px) {
  .calls-meta-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .calls-row { grid-template-columns: 38px minmax(150px, 1.2fr) minmax(150px, .9fr) minmax(90px, .5fr) auto 18px; }
  .calls-row-direction { display: none; }
}
@media (max-width: 980px) {
  .calls-shell { display: block; height: auto; max-height: none; overflow: visible; }
  .calls-main { height: auto; overflow: visible; }
  .calls-content { overflow: visible; padding: 20px; }
  .calls-sidebar { height: auto; overflow: visible; position: static; width: 100%; }
  .calls-sidebar-footer { margin-top: 18px; }
  .calls-user-card { display: none; }
  .calls-nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .calls-topbar { padding: 18px 20px; }
  .calls-detail-topbar { align-items: flex-start; flex-direction: column; }
  .calls-top-actions { justify-content: flex-start; }
  .calls-edit-grid { grid-template-columns: 1fr; }
  .calls-row { grid-template-columns: 38px minmax(150px, 1fr) minmax(90px, .55fr) auto 18px; }
  .calls-row-created { display: none; }
}
@media (max-width: 640px) {
  .calls-nav { grid-template-columns: 1fr 1fr; }
  .calls-topbar, .calls-content { padding: 16px 14px; }
  .calls-meta-grid { grid-template-columns: 1fr; }
  .calls-toolbar-search { max-width: none; min-width: 100%; }
  .calls-toolbar .calls-count { margin-left: 0; }
  .calls-row { gap: 10px; grid-template-columns: 38px minmax(0, 1fr) auto; padding: 11px; }
  .calls-row-field, .calls-row-chevron { display: none; }
  .expandable-card-stage { align-items: stretch; padding: 0; }
  .calls-expandable-card { border-radius: 0; max-height: 100vh; max-width: none; padding: 12px; }
  .calls-top-actions .calls-top-btn, .calls-top-actions .calls-danger-btn { flex: 1 1 auto; }
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
  const [viewMode, setViewMode] = useState<ViewMode>("list");

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

  const selectedCall = selectedId
    ? calls.find((call) => call.id === selectedId) ?? null
    : null;
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
          current && rows.some((call) => call.id === current) ? current : null
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
      setSelectedId((current) => (current === call.id ? null : current));
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
        <header className="calls-topbar">
          <div className="calls-topbar-heading">
            <h1 className="calls-topbar-title">Calls</h1>
            <div className="calls-topbar-copy">Review call activity, lifecycle details, and saved transcripts.</div>
          </div>
        </header>
        <div className="calls-content">
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
            onViewModeChange={setViewMode}
            query={query}
            selectedId={selectedCallId}
            viewMode={viewMode}
          />

          <ExpandableCardDemoStandard
            className="calls-expandable-card"
            layoutId={`call-${selectedCallId ?? "closed"}`}
            onClose={() => setSelectedId(null)}
            open={Boolean(shownCall)}
          >
            {shownCall ? (
              <section className="calls-detail">
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
                  onClose={() => setSelectedId(null)}
                  onRefresh={refresh}
                  onSave={saveUpdate}
                  onStatusChange={setEditStatus}
                />
              </section>
            ) : null}
          </ExpandableCardDemoStandard>
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
  const { mode } = useWorkspaceMode();

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
        {navItemsForMode(mode).map((item) => {
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
        <WorkspaceModeToggle />
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
  onViewModeChange,
  query,
  selectedId,
  viewMode,
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
  onViewModeChange: (mode: ViewMode) => void;
  query: string;
  selectedId: string | null;
  viewMode: ViewMode;
}) {
  return (
    <section className="calls-browse" aria-label="Calls">
      <div className="calls-toolbar">
        <div className="calls-search-wrap calls-toolbar-search">
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
        <div aria-label="View" className="calls-view-toggle" role="group">
          <button
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            className={`calls-view-btn${viewMode === "list" ? " is-active" : ""}`}
            onClick={() => onViewModeChange("list")}
            title="List view"
            type="button"
          >
            <Icon name="list" size={16} sw={2.2} />
          </button>
          <button
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            className={`calls-view-btn${viewMode === "grid" ? " is-active" : ""}`}
            onClick={() => onViewModeChange("grid")}
            title="Grid view"
            type="button"
          >
            <Icon name="grid" size={16} sw={2.2} />
          </button>
        </div>
        <span className="calls-count">
          {query.trim() ? `${filteredCalls.length} of ${calls.length}` : `${calls.length} ${calls.length === 1 ? "call" : "calls"}`}
        </span>
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
      {effectiveLoadState === "loading" && calls.length === 0 ? (
        <div className="calls-list-message">Loading calls...</div>
      ) : effectiveLoadState === "error" ? (
        <div className="calls-list-message">
          <p>{effectiveLoadError}</p>
          {isAuthenticated ? (
            <button className="calls-ghost-btn" onClick={onRefresh} type="button">
              <Icon name="refresh" size={15} sw={2.2} />
              Try again
            </button>
          ) : null}
        </div>
      ) : filteredCalls.length === 0 ? (
        <div className="calls-list-message">
          <p>{query.trim() ? "No calls match your search." : "No calls yet. Inbound and outbound calls appear here once they run."}</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="calls-grid">
          {filteredCalls.map((call) => (
            <motion.button
              aria-pressed={call.id === selectedId}
              className={`calls-card-item${call.id === selectedId ? " is-active" : ""}`}
              key={call.id}
              layoutId={`call-${call.id}`}
              onClick={() => onSelect(call.id)}
              style={deletingId === call.id ? { opacity: 0.5 } : undefined}
              type="button"
            >
              <span className="calls-card-top">
                <span className="calls-row-dir" title={callTypeLabel(call.call_type)}>
                  <Icon name={call.call_type === "outbound" ? "phoneOut" : "phoneIn"} size={16} sw={2.2} />
                </span>
                <span className="calls-card-identity">
                  <span className="calls-row-peer">{peerLabel(call)}</span>
                  <span className="calls-row-id">{call.call_id}</span>
                </span>
              </span>
              <span className="calls-card-meta">
                <span className="calls-card-tile">
                  <span className="calls-row-label">Created</span>
                  <span>{formatDate(call.created_at)}</span>
                </span>
                <span className="calls-card-tile">
                  <span className="calls-row-label">Duration</span>
                  <span>{formatDuration(call.duration_seconds)}</span>
                </span>
              </span>
              <span className="calls-card-foot">
                <StatusChip status={call.status} />
                <span className="calls-dir-badge">
                  <Icon name={call.call_type === "outbound" ? "phoneOut" : "phoneIn"} size={12} sw={2.4} />
                  {callTypeLabel(call.call_type)}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="calls-list">
          {filteredCalls.map((call) => (
            <motion.button
              aria-pressed={call.id === selectedId}
              className={`calls-row${call.id === selectedId ? " is-active" : ""}`}
              key={call.id}
              layoutId={`call-${call.id}`}
              onClick={() => onSelect(call.id)}
              style={deletingId === call.id ? { opacity: 0.5 } : undefined}
              type="button"
            >
              <span className="calls-row-dir" title={callTypeLabel(call.call_type)}>
                <Icon name={call.call_type === "outbound" ? "phoneOut" : "phoneIn"} size={15} sw={2.2} />
              </span>
              <span className="calls-row-identity">
                <span className="calls-row-peer">{peerLabel(call)}</span>
                <span className="calls-row-id">{call.call_id}</span>
              </span>
              <span className="calls-row-field calls-row-direction">
                <span className="calls-row-label">Direction</span>
                <span>{callTypeLabel(call.call_type)}</span>
              </span>
              <span className="calls-row-field calls-row-created">
                <span className="calls-row-label">Created</span>
                <span>{formatDate(call.created_at)}</span>
              </span>
              <span className="calls-row-field calls-row-duration">
                <span className="calls-row-label">Duration</span>
                <span>{formatDuration(call.duration_seconds)}</span>
              </span>
              <StatusChip status={call.status} />
              <Icon className="calls-row-chevron" name="chevron" size={17} sw={2.2} />
            </motion.button>
          ))}
        </div>
      )}
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
  onClose,
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
  onClose: () => void;
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
                <Icon name="copy" size={13} />
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
          <button aria-label="Close call details" className="calls-icon-btn" onClick={onClose} type="button">
            <Icon name="x" size={16} sw={2.2} />
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
