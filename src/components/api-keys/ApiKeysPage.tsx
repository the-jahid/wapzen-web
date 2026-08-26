"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearance } from "@/components/theme/clerkAppearance";
import {
  createApiKey as apiCreateApiKey,
  deleteApiKey as apiDeleteApiKey,
  listApiKeys as apiListApiKeys,
  setDefaultApiKey as apiSetDefaultApiKey,
  type ApiKey,
  type CreatedApiKey,
} from "@/lib/apiKeys";

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
  | "copy"
  | "check"
  | "trash"
  | "star"
  | "refresh";

type NavItem = {
  label: string;
  icon: IconName;
  href?: string;
  badge?: string;
};

const apiKeyNameLimit = 80;

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
    case "copy":
      return (
        <>
          <rect height="12" rx="2" width="12" x="8" y="8" />
          <path d="M4 16V6a2 2 0 012-2h10" />
        </>
      );
    case "check":
      return <path d="M5 12.5l4 4 10-10" />;
    case "trash":
      return (
        <>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M6 6l1 15h10l1-15" />
          <path d="M10 11v6M14 11v6" />
        </>
      );
    case "star":
      return <path d="M12 4.5l2.2 4.6 5 .6-3.6 3.5.9 5L12 15.9 7.4 18.2l.9-5L4.7 9.7l5-.6L12 4.5z" />;
    case "refresh":
      return (
        <>
          <path d="M4 4v6h6" />
          <path d="M20 20v-6h-6" />
          <path d="M20 9a8 8 0 00-13.5-3L4 10M4 15a8 8 0 0013.5 3L20 14" />
        </>
      );
  }
}

function Icon({
  name,
  className,
  size = 18,
  stroke = "currentColor",
  sw = 2,
  fill = "none",
}: {
  name: IconName;
  className?: string;
  size?: number;
  stroke?: string;
  sw?: number;
  fill?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill={fill}
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
.api-keys-shell {
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
  --rose: var(--app-rose);
  background: var(--bg);
  color: var(--text);
  display: flex;
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.api-keys-shell * { box-sizing: border-box; }
.api-keys-shell button, .api-keys-shell input { font: inherit; }
.api-sidebar {
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-height: 100vh;
  padding: 22px 16px;
  position: sticky;
  top: 0;
  width: 248px;
}
.api-logo { align-items: center; display: flex; gap: 11px; padding: 4px 8px 26px; }
.api-logo-mark {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border-radius: 10px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.api-nav-kicker { color: var(--faint); font-size: 10.5px; font-weight: 700; letter-spacing: .9px; padding: 4px 10px 8px; text-transform: uppercase; }
.api-nav { display: flex; flex-direction: column; gap: 3px; }
.api-nav-item {
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
.api-nav-item:hover { background: var(--app-hover); color: var(--app-text-soft); }
.api-nav-item.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); font-weight: 700; }
.api-nav-badge { background: var(--primary); border-radius: 20px; color: var(--app-on-accent); font-size: 10.5px; font-weight: 700; margin-left: auto; padding: 1px 7px; }
.api-sidebar-footer { display: flex; flex-direction: column; gap: 14px; margin-top: auto; }
.api-link-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 13px; }
.api-user-card { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; gap: 10px; padding: 10px 13px; }
.api-user-name { font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.api-user-email { color: var(--app-subtle); font-size: 11.5px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.api-main { flex: 1; min-width: 0; }
.api-content {
  display: grid;
  gap: 18px;
  margin: 0 auto;
  max-width: 1180px;
  padding: 34px 32px;
}
.api-header {
  align-items: end;
  display: flex;
  gap: 18px;
  justify-content: space-between;
}
.api-title-wrap { min-width: 0; }
.api-eyebrow { color: var(--primary-light); font-size: 11px; font-weight: 850; letter-spacing: .9px; text-transform: uppercase; }
.api-title { font-size: 28px; font-weight: 850; letter-spacing: -.6px; line-height: 1.1; margin: 4px 0 0; }
.api-subtitle { color: var(--subtle); font-size: 13px; margin-top: 6px; }
.api-stat {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  display: flex;
  gap: 12px;
  min-width: 190px;
  padding: 14px 16px;
}
.api-stat-icon {
  align-items: center;
  background: var(--primary-soft);
  border: 1px solid var(--app-primary-ring);
  border-radius: 12px;
  color: var(--primary-light);
  display: inline-flex;
  height: 40px;
  justify-content: center;
  width: 40px;
}
.api-stat-value { font-size: 22px; font-weight: 850; line-height: 1; }
.api-stat-label { color: var(--subtle); font-size: 12px; margin-top: 2px; }
.api-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
}
.api-card-head {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 14px;
  justify-content: space-between;
  padding: 16px 18px;
}
.api-card-title { font-size: 14px; font-weight: 850; margin: 0; }
.api-card-copy { color: var(--subtle); font-size: 12.5px; margin-top: 2px; }
.api-create-form {
  align-items: end;
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(220px, 1fr) auto;
  padding: 18px;
}
.api-field { display: grid; gap: 7px; min-width: 0; }
.api-field-label { color: var(--subtle); font-size: 11.5px; font-weight: 800; }
.api-input {
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
.api-input::placeholder { color: var(--faint); }
.api-input:focus {
  background: var(--app-input-focus);
  border-color: var(--app-primary-ring-strong);
  box-shadow: 0 0 0 4px var(--app-primary-ring);
}
.api-btn {
  align-items: center;
  border: 1px solid var(--app-border-strong);
  border-radius: 11px;
  cursor: pointer;
  display: inline-flex;
  font-weight: 850;
  gap: 8px;
  justify-content: center;
  min-height: 42px;
  padding: 0 14px;
  transition: filter .18s ease, background .18s ease, border-color .18s ease, transform .18s ease;
  white-space: nowrap;
}
.api-btn:hover { transform: translateY(-1px); }
.api-btn:disabled { cursor: not-allowed; filter: grayscale(.35); opacity: .45; transform: none; }
.api-btn-primary { background: linear-gradient(140deg,var(--primary-2),var(--primary)); border-color: transparent; box-shadow: 0 4px 14px var(--app-primary-glow); color: var(--app-on-accent); }
.api-btn-secondary { background: var(--panel-hover); color: var(--text); }
.api-btn-secondary:hover { background: var(--app-panel-hover); }
.api-btn-danger { color: var(--rose); }
.api-btn-danger:hover { background: var(--app-rose-soft); border-color: var(--app-rose-border); }
.api-secret {
  background: var(--app-green-soft);
  border-color: var(--app-green-soft-2);
  overflow: hidden;
}
.api-secret .api-card-head { border-bottom-color: var(--app-green-soft); }
.api-secret-body { display: grid; gap: 12px; padding: 18px; }
.api-secret-row {
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) auto;
}
.api-secret-input {
  background: var(--app-inset);
  border: 1px solid var(--app-border-strong);
  border-radius: 11px;
  color: var(--app-green-text);
  font-family: var(--font-geist-mono), monospace;
  font-size: 12.5px;
  height: 42px;
  min-width: 0;
  overflow: hidden;
  padding: 0 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.api-table-wrap { overflow-x: auto; }
.api-table {
  border-collapse: collapse;
  min-width: 820px;
  width: 100%;
}
.api-table th {
  color: var(--faint);
  font-size: 10.5px;
  font-weight: 850;
  letter-spacing: .8px;
  padding: 12px 18px;
  text-align: left;
  text-transform: uppercase;
}
.api-table td {
  border-top: 1px solid var(--border);
  padding: 14px 18px;
  vertical-align: middle;
}
.api-key-name { font-size: 13.5px; font-weight: 850; }
.api-key-id { color: var(--faint); font-family: var(--font-geist-mono), monospace; font-size: 11px; margin-top: 2px; }
.api-key-value { align-items: center; display: inline-flex; gap: 6px; }
.api-key-mask { color: var(--app-text-soft); font-family: var(--font-geist-mono), monospace; font-size: 12.5px; }
.api-copy-button {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 7px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  transition: background .18s ease, color .18s ease;
  width: 28px;
}
.api-copy-button:hover { background: var(--app-border); color: var(--app-text-strong); }
.api-copy-button.api-copy-success { color: var(--green); }
.api-muted { color: var(--subtle); font-size: 12.5px; }
.api-pill {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 11.5px;
  font-weight: 850;
  gap: 6px;
  line-height: 1;
  padding: 6px 9px;
  white-space: nowrap;
}
.api-pill-default { background: var(--app-primary-soft); border: 1px solid var(--app-primary-ring); color: var(--primary-light); }
.api-pill-secondary { background: var(--app-hover-2); border: 1px solid var(--app-border-strong); color: var(--subtle); }
.api-dot { background: currentColor; border-radius: 50%; height: 6px; width: 6px; }
.api-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.api-icon-button {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 36px;
  justify-content: center;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
  width: 36px;
}
.api-icon-button:hover { background: var(--app-hover-2); border-color: var(--app-border-strong); color: var(--app-text-strong); }
.api-icon-button:disabled { cursor: not-allowed; opacity: .4; }
.api-message {
  align-items: center;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  font-size: 13.5px;
  font-weight: 650;
  gap: 16px;
  justify-content: center;
  min-height: 260px;
  padding: 40px;
  text-align: center;
}
.api-message p { margin: 0; max-width: 440px; }
.api-modal-overlay {
  align-items: center;
  animation: api-fade-in .16s ease;
  backdrop-filter: blur(3px);
  background: var(--app-overlay);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 70;
}
.api-modal {
  animation: api-modal-in .18s ease;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: 18px;
  box-shadow: 0 30px 80px var(--app-shadow-color-strong);
  max-width: 420px;
  padding: 22px;
  width: 100%;
}
.api-modal-icon {
  align-items: center;
  background: var(--app-rose-soft);
  border: 1px solid var(--app-rose-border);
  border-radius: 12px;
  color: var(--rose);
  display: inline-flex;
  height: 42px;
  justify-content: center;
  width: 42px;
}
.api-modal-title { font-size: 17px; font-weight: 850; letter-spacing: -.2px; margin: 14px 0 0; }
.api-modal-copy { color: var(--muted); font-size: 13px; line-height: 1.55; margin: 8px 0 0; }
.api-modal-copy strong { color: var(--text); font-weight: 800; }
.api-modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.api-btn-destructive {
  background: var(--app-rose-soft-2);
  border-color: var(--app-rose-border-strong);
  color: var(--app-rose-text);
}
.api-btn-destructive:hover { background: var(--app-rose-border); border-color: var(--app-rose-border-strong); }
@keyframes api-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes api-modal-in {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to { opacity: 1; transform: none; }
}
.api-toast {
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
  z-index: 60;
}
.api-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-toast-success-text); }
.api-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
@media (max-width: 980px) {
  .api-keys-shell { display: block; }
  .api-sidebar { min-height: auto; position: static; width: 100%; }
  .api-sidebar-footer { margin-top: 18px; }
  .api-user-card { display: none; }
  .api-nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .api-content { padding: 22px 20px; }
  .api-header { align-items: stretch; flex-direction: column; }
  .api-stat { min-width: 0; }
}
@media (max-width: 640px) {
  .api-nav { grid-template-columns: 1fr 1fr; }
  .api-content { padding: 16px 14px; }
  .api-create-form, .api-secret-row { grid-template-columns: 1fr; }
  .api-actions { justify-content: flex-start; }
  .api-btn { width: 100%; }
  .api-modal-actions .api-btn { flex: 1; }
}
`;

function formatDate(value: string | null | undefined) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return dateFormatter.format(date);
}

function maskKey(key: ApiKey) {
  return `${key.keyPrefix}...${key.last4}`;
}

function shortId(id: string) {
  return id.length > 8 ? id.slice(0, 8) : id;
}

function upsertKey(current: ApiKey[], key: ApiKey): ApiKey[] {
  const next = key.isDefault ? current.map((item) => ({ ...item, isDefault: false })) : current;
  return [key, ...next.filter((item) => item.id !== key.id)];
}

export default function ApiKeysPage() {
  const { user, isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn: isAuthSignedIn } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [name, setName] = useState("");
  const [createdKey, setCreatedKey] = useState<CreatedApiKey | null>(null);
  const [availableKeySecrets, setAvailableKeySecrets] = useState<Record<string, string>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [defaultingId, setDefaultingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ApiKey | null>(null);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!isUserLoaded || !isAuthLoaded || !isUserSignedIn || !isAuthSignedIn || !user) return;

    let cancelled = false;
    (async () => {
      try {
        const keys = await apiListApiKeys(getToken);
        if (cancelled) return;
        setApiKeys(keys);
        setLoadState("ready");
        setLoadError("");
      } catch (error) {
        if (cancelled) return;
        setLoadState("error");
        setLoadError(error instanceof Error ? error.message : "Failed to load API keys");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isUserLoaded, isAuthLoaded, isUserSignedIn, isAuthSignedIn, user, reloadKey]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!pendingDelete) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPendingDelete(null);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pendingDelete]);

  const isAuthenticated = Boolean(
    isUserLoaded && isAuthLoaded && isUserSignedIn && isAuthSignedIn && user
  );
  const authError =
    !isUserLoaded || !isAuthLoaded
      ? null
      : !isUserSignedIn || !isAuthSignedIn || !user
        ? "Sign in to manage API keys."
        : null;
  const effectiveLoadState = authError ? "error" : loadState;
  const effectiveLoadError = authError ?? loadError;

  const defaultKey = useMemo(() => apiKeys.find((key) => key.isDefault), [apiKeys]);
  const isNameTooLong = name.trim().length > apiKeyNameLimit;

  async function createKey() {
    if (isCreating || isNameTooLong) return;

    setIsCreating(true);
    try {
      const created = await apiCreateApiKey(name.trim(), getToken);
      setApiKeys((current) => upsertKey(current, created));
      setCreatedKey(created);
      setAvailableKeySecrets((current) => ({ ...current, [created.id]: created.key }));
      setName("");
      setNotice({ kind: "success", text: `API key "${created.name}" created` });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to create API key",
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function copyCreatedKey() {
    if (!createdKey) return;

    await copyKey(createdKey);
  }

  function secretFor(key: ApiKey): string | null {
    return availableKeySecrets[key.id] ?? (createdKey?.id === key.id ? createdKey.key : null);
  }

  async function copyKey(key: ApiKey) {
    // The plaintext key is only ever returned once, at creation. Never fall back
    // to the mask here: it would silently copy "wcai_abc...wxyz" and fail auth.
    const value = secretFor(key);
    if (!value) {
      setNotice({
        kind: "error",
        text: "This key was only shown once, at creation. Create a new key to get a copyable value.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedKeyId(key.id);
      setNotice({ kind: "success", text: "API key copied" });
      window.setTimeout(() => {
        setCopiedKeyId((current) => (current === key.id ? null : current));
      }, 2000);
    } catch {
      setNotice({ kind: "error", text: "Could not copy API key" });
    }
  }

  async function setDefault(key: ApiKey) {
    if (key.isDefault || defaultingId) return;

    setDefaultingId(key.id);
    try {
      const updated = await apiSetDefaultApiKey(key.id, getToken);
      setApiKeys((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : { ...item, isDefault: false }
        )
      );
      setNotice({ kind: "success", text: `"${updated.name}" set as default` });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to set default API key",
      });
    } finally {
      setDefaultingId(null);
    }
  }

  async function deleteKey(key: ApiKey) {
    if (deletingId) return;

    setPendingDelete(null);
    setDeletingId(key.id);
    try {
      await apiDeleteApiKey(key.id, getToken);
      const keys = await apiListApiKeys(getToken);
      setApiKeys(keys);
      if (createdKey?.id === key.id) setCreatedKey(null);
      setAvailableKeySecrets((current) => {
        const next = { ...current };
        delete next[key.id];
        return next;
      });
      setNotice({ kind: "success", text: `API key "${key.name}" deleted` });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to delete API key",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="api-keys-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Sidebar activeLabel="API Keys" apiKeyCount={apiKeys.length} />

      <main className="api-main">
        <div className="api-content">
          <header className="api-header">
            <div className="api-title-wrap">
              <div className="api-eyebrow">Developer access</div>
              <h1 className="api-title">API Keys</h1>
              <div className="api-subtitle">User-owned bearer keys for live API access.</div>
            </div>
            <div className="api-stat" aria-label={`${apiKeys.length} active API keys`}>
              <span className="api-stat-icon">
                <Icon name="key" size={18} />
              </span>
              <span>
                <span className="api-stat-value">{apiKeys.length}</span>
                <span className="api-stat-label">active keys</span>
              </span>
            </div>
          </header>

          <section className="api-card" aria-labelledby="create-api-key-title">
            <div className="api-card-head">
              <div>
                <h2 className="api-card-title" id="create-api-key-title">Create API key</h2>
                <div className="api-card-copy">New keys are shown once after creation.</div>
              </div>
            </div>
            <form
              className="api-create-form"
              onSubmit={(event) => {
                event.preventDefault();
                createKey();
              }}
            >
              <label className="api-field">
                <span className="api-field-label">Name</span>
                <input
                  className="api-input"
                  maxLength={apiKeyNameLimit}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Production"
                  value={name}
                />
              </label>
              <button
                className="api-btn api-btn-primary"
                disabled={isCreating || isNameTooLong || !isAuthenticated}
                type="submit"
              >
                <Icon name="plus" size={16} stroke="#fff" sw={2.4} />
                {isCreating ? "Creating..." : "Create key"}
              </button>
            </form>
          </section>

          {createdKey ? (
            <section className="api-card api-secret" aria-labelledby="created-api-key-title">
              <div className="api-card-head">
                <div>
                  <h2 className="api-card-title" id="created-api-key-title">New API key</h2>
                  <div className="api-card-copy">Copy this value before leaving the page.</div>
                </div>
                <button className="api-icon-button" onClick={() => setCreatedKey(null)} type="button">
                  <Icon name="check" size={16} />
                </button>
              </div>
              <div className="api-secret-body">
                <div className="api-secret-row">
                  <input className="api-secret-input" readOnly value={createdKey.key} />
                  <button className="api-btn api-btn-secondary" onClick={copyCreatedKey} type="button">
                    <Icon name="copy" size={16} />
                    Copy key
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          <section className="api-card" aria-labelledby="api-keys-list-title">
            <div className="api-card-head">
              <div>
                <h2 className="api-card-title" id="api-keys-list-title">Active keys</h2>
                <div className="api-card-copy">
                  {defaultKey ? `Default: ${defaultKey.name}` : "No default key selected"}
                </div>
              </div>
              {isAuthenticated ? (
                <button
                  className="api-btn api-btn-secondary"
                  onClick={() => {
                    setLoadState("loading");
                    setReloadKey((key) => key + 1);
                  }}
                  type="button"
                >
                  <Icon name="refresh" size={16} />
                  Refresh
                </button>
              ) : null}
            </div>

            {effectiveLoadState === "loading" ? (
              <div className="api-message">Loading API keys...</div>
            ) : effectiveLoadState === "error" ? (
              <div className="api-message">
                <p>{effectiveLoadError}</p>
                {isAuthenticated ? (
                  <button
                    className="api-btn api-btn-secondary"
                    onClick={() => {
                      setLoadState("loading");
                      setReloadKey((key) => key + 1);
                    }}
                    type="button"
                  >
                    Try again
                  </button>
                ) : (
                  <Link className="api-btn api-btn-secondary" href="/">
                    Go to sign in
                  </Link>
                )}
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="api-message">
                <p>No active API keys.</p>
              </div>
            ) : (
              <div className="api-table-wrap">
                <table className="api-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Key</th>
                      <th>Status</th>
                      <th>Last used</th>
                      <th>Created</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((key) => {
                      const isCopyable = secretFor(key) !== null;

                      return (
                      <tr key={key.id}>
                        <td>
                          <div className="api-key-name">{key.name}</div>
                          <div className="api-key-id">id {shortId(key.id)}</div>
                        </td>
                        <td>
                          <span className="api-key-value">
                            <span className="api-key-mask">{maskKey(key)}</span>
                            {isCopyable ? (
                              <button
                                aria-label={`Copy ${key.name} API key`}
                                className={`api-copy-button${copiedKeyId === key.id ? " api-copy-success" : ""}`}
                                onClick={() => copyKey(key)}
                                title="Copy API key"
                                type="button"
                              >
                                <Icon name={copiedKeyId === key.id ? "check" : "copy"} size={15} />
                              </button>
                            ) : null}
                          </span>
                        </td>
                        <td>
                          {key.isDefault ? (
                            <span className="api-pill api-pill-default">
                              <span className="api-dot" />
                              Default
                            </span>
                          ) : (
                            <span className="api-pill api-pill-secondary">Active</span>
                          )}
                        </td>
                        <td>
                          <span className="api-muted">{formatDate(key.lastUsedAt)}</span>
                        </td>
                        <td>
                          <span className="api-muted">{formatDate(key.createdAt)}</span>
                        </td>
                        <td>
                          <div className="api-actions">
                            <button
                              className="api-btn api-btn-secondary"
                              disabled={key.isDefault || defaultingId === key.id}
                              onClick={() => setDefault(key)}
                              type="button"
                            >
                              <Icon name="star" size={15} />
                              {defaultingId === key.id ? "Saving..." : "Set default"}
                            </button>
                            <button
                              aria-label={`Delete ${key.name}`}
                              className="api-icon-button api-btn-danger"
                              disabled={deletingId === key.id}
                              onClick={() => setPendingDelete(key)}
                              type="button"
                            >
                              <Icon name="trash" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {pendingDelete ? (
        <div
          className="api-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPendingDelete(null);
          }}
        >
          <div
            aria-describedby="delete-key-copy"
            aria-labelledby="delete-key-title"
            aria-modal="true"
            className="api-modal"
            role="dialog"
          >
            <div className="api-modal-icon">
              <Icon name="trash" size={20} />
            </div>
            <h2 className="api-modal-title" id="delete-key-title">
              Delete API key
            </h2>
            <p className="api-modal-copy" id="delete-key-copy">
              <strong>{pendingDelete.name}</strong> ({maskKey(pendingDelete)}) will be revoked
              immediately. Any integration still sending it will start failing with 401. This
              cannot be undone.
            </p>
            <div className="api-modal-actions">
              <button
                autoFocus
                className="api-btn api-btn-secondary"
                onClick={() => setPendingDelete(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="api-btn api-btn-destructive"
                disabled={deletingId === pendingDelete.id}
                onClick={() => deleteKey(pendingDelete)}
                type="button"
              >
                {deletingId === pendingDelete.id ? "Deleting..." : "Delete key"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {notice ? (
        <div
          className={`api-toast ${notice.kind === "error" ? "api-toast-error" : "api-toast-success"}`}
          role="status"
        >
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

function Sidebar({ activeLabel, apiKeyCount }: { activeLabel: string; apiKeyCount: number }) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();

  return (
    <aside className="api-sidebar">
      <div className="api-logo">
        <div className="api-logo-mark">
          <Icon name="spark" size={18} stroke="#fff" sw={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.3px" }}>Voca</div>
          <div style={{ color: "var(--app-subtle)", fontSize: 11, fontWeight: 500, marginTop: -1 }}>
            AI Voice Agents
          </div>
        </div>
      </div>
      <div className="api-nav-kicker">Menu</div>
      <nav className="api-nav" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const content = (
            <>
              <span style={{ display: "flex", justifyContent: "center", width: 18 }}>
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
              {item.badge || item.label === "API Keys" ? (
                <span className="api-nav-badge">
                  {item.label === "API Keys" ? apiKeyCount : item.badge}
                </span>
              ) : null}
            </>
          );
          const className = `api-nav-item${item.label === activeLabel ? " is-active" : ""}`;

          return item.href ? (
            <Link className={className} href={item.href} key={item.label}>
              {content}
            </Link>
          ) : (
            <a
              className={className}
              href="#"
              key={item.label}
              onClick={(event) => event.preventDefault()}
            >
              {content}
            </a>
          );
        })}
      </nav>
      <div className="api-sidebar-footer">
        <ThemeToggle />
        <div className="api-user-card">
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span style={{ minWidth: 0 }}>
            <div className="api-user-name">{user?.fullName || user?.username || "Account"}</div>
            <div className="api-user-email">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </div>
          </span>
        </div>
      </div>
    </aside>
  );
}
