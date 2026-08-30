"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { motion } from "motion/react";
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
  knowledgeBaseChunkBounds as chunkBounds,
  knowledgeBaseNameLimit as nameLimit,
  knowledgeBaseStatusLabels as statusLabels,
  type KnowledgeBaseStatus,
  addKnowledgeBaseFileSources as apiAddKnowledgeBaseFileSources,
  addKnowledgeBaseSources as apiAddKnowledgeBaseSources,
  createKnowledgeBase as apiCreateKnowledgeBase,
  deleteKnowledgeBase as apiDeleteKnowledgeBase,
  deleteKnowledgeBaseSource as apiDeleteKnowledgeBaseSource,
  describeInvalidSourceTitle,
  describeUnreadableFile,
  listKnowledgeBases as apiListKnowledgeBases,
  knowledgeBaseFileExtensions as fileExtensions,
  knowledgeBaseSourceBounds as sourceBounds,
  sourceTitleFromFilename,
  updateKnowledgeBase as apiUpdateKnowledgeBase,
  KnowledgeBaseError,
  type ApiKnowledgeBase,
  type FieldError,
  type KnowledgeBase,
  type KnowledgeBaseSource,
  type UpdateKnowledgeBasePayload,
} from "@/lib/knowledgeBases";
import type { AuthTokenGetter } from "@/lib/api";

// Every knowledge base shown here comes from the server: the list is loaded
// from GET /v1/dashboard/knowledge-base, the New modal creates through POST, the
// config panel saves through PATCH, the trash buttons remove through DELETE —
// the knowledge base itself, or one of its sources with its vectors — and the
// Add sources dialog indexes through POST .../sources, either raw texts as JSON
// or documents as a multipart upload the server extracts the text from. Only
// refreshing has no endpoint, so that one control stays disabled rather than
// pretending to re-scrape.

// fromApi maps a knowledge base off the wire onto the resource shape this page
// renders. The server omits the sources of a knowledge base that has none and
// the refresh timestamp until a refresh has run, so both are defaulted here. The
// namespace is assigned at creation, but is still defaulted rather than assumed,
// since the field is optional on the wire.
function fromApi(base: ApiKnowledgeBase): KnowledgeBase {
  return {
    knowledge_base_id: base.knowledge_base_id,
    knowledge_base_name: base.knowledge_base_name,
    status: base.status,
    namespace_id: base.namespace_id ?? null,
    knowledge_base_sources: base.knowledge_base_sources ?? [],
    enable_auto_refresh: base.enable_auto_refresh,
    last_refreshed_timestamp: base.last_refreshed_timestamp ?? null,
    max_chunk_size: base.max_chunk_size,
    min_chunk_size: base.min_chunk_size,
  };
}

type IconName =
  | "grid"
  | "list"
  | "agents"
  | "phone"
  | "phoneOut"
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
  | "search"
  | "trash"
  | "check"
  | "x"
  | "refresh"
  | "file"
  | "text"
  | "globe"
  | "clock"
  | "layers"
  | "chevron"
  | "back";


type Notice = { kind: "success" | "error"; text: string };
type BrowseView = "list" | "grid";

// Shown on the one control whose endpoint does not exist yet: re-indexing a
// knowledge base from its sources.
const notYetHint = "Available once the refresh endpoint lands.";


// The list column is narrow, so rows get a date without the year or clock time.
const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
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
    case "list":
      return (
        <>
          <path d="M8 6h13M8 12h13M8 18h13" />
          <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
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
    case "check":
      return <path d="M5 12.5l4 4 10-10" />;
    case "x":
      return <path d="M6 6l12 12M18 6L6 18" />;
    case "refresh":
      return (
        <>
          <path d="M4 4v6h6" />
          <path d="M20 20v-6h-6" />
          <path d="M20 9a8 8 0 00-13.5-3L4 10M4 15a8 8 0 0013.5 3L20 14" />
        </>
      );
    case "file":
      return (
        <>
          <path d="M14 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V7z" />
          <path d="M14 2v5h5" />
        </>
      );
    case "text":
      return (
        <>
          <path d="M4 6h16M4 12h12M4 18h8" />
        </>
      );
    case "globe":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 010 18a15 15 0 010-18z" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      );
    case "layers":
      return (
        <>
          <path d="M12 3l9 5-9 5-9-5 9-5z" />
          <path d="M3 13l9 5 9-5" />
        </>
      );
    case "chevron":
      return <path d="M9 6l6 6-6 6" />;
    case "back":
      return (
        <>
          <path d="M20 12H4" />
          <path d="M10 6l-6 6 6 6" />
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
.kb-shell {
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
  --sky: var(--app-sky);
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
.kb-shell * { box-sizing: border-box; }
.kb-shell button, .kb-shell input, .kb-shell textarea, .kb-shell select { font: inherit; }
.kb-sidebar {
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
.kb-logo { align-items: center; display: flex; gap: 11px; padding: 4px 8px 26px; }
.kb-logo-mark {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border-radius: 10px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.kb-nav-kicker { color: var(--faint); font-size: 10.5px; font-weight: 700; letter-spacing: .9px; padding: 4px 10px 8px; text-transform: uppercase; }
.kb-nav { display: flex; flex-direction: column; gap: 3px; }
.kb-nav-item {
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
.kb-nav-item:hover { background: var(--app-hover); color: var(--app-text-soft); }
.kb-nav-item.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); font-weight: 700; }
.kb-nav-badge { background: var(--primary); border-radius: 20px; color: var(--app-on-accent); font-size: 10.5px; font-weight: 700; margin-left: auto; padding: 1px 7px; }
.kb-sidebar-footer { display: flex; flex-direction: column; gap: 14px; margin-top: auto; }
.kb-user-card { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; gap: 10px; padding: 10px 13px; }
.kb-user-name { font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-user-email { color: var(--app-subtle); font-size: 11.5px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-main { display: flex; flex: 1; flex-direction: column; min-width: 0; }
.kb-topbar {
  align-items: center;
  background: var(--app-topbar);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 16px;
  padding: 20px 32px;
}
.kb-topbar-wrap { flex: 1; min-width: 0; }
.kb-topbar-title { font-size: 21px; font-weight: 800; letter-spacing: -.4px; line-height: 1.15; margin: 0; }
.kb-topbar-copy { color: var(--subtle); font-size: 12.5px; margin-top: 3px; }
.kb-content { flex: 1 1 auto; min-width: 0; padding: 20px 32px 32px; }
.kb-browse { display: flex; flex-direction: column; gap: 16px; margin: 0 auto; max-width: 1320px; width: 100%; }
.kb-toolbar { align-items: center; display: flex; flex-wrap: wrap; gap: 12px; }
.kb-toolbar .kb-search { flex: 1 1 240px; max-width: 420px; }
.kb-count {
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
.kb-view-toggle {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  display: inline-flex;
  flex-shrink: 0;
  gap: 2px;
  padding: 3px;
}
.kb-view-btn {
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
.kb-view-btn:hover { color: var(--text); }
.kb-view-btn.is-active {
  background: var(--primary-soft);
  box-shadow: inset 0 0 0 1px var(--app-primary-ring);
  color: var(--app-primary-text);
}
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
.kb-expandable-card {
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  box-shadow: 0 30px 90px var(--app-shadow-color), 0 0 0 1px var(--app-primary-ring);
  max-height: min(820px, calc(100vh - 48px));
  max-width: 1040px;
  overflow: auto;
  padding: 16px;
  width: 100%;
}
.kb-expandable-topline {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.kb-expandable-label { color: var(--subtle); font-size: 11px; font-weight: 850; letter-spacing: .7px; text-transform: uppercase; }
.kb-expandable-close {
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
.kb-expandable-close:hover { background: var(--panel-hover); color: var(--text); }
.kb-expandable-card .kb-detail-layout { max-width: none; }
.kb-detail-layout { display: flex; flex-direction: column; gap: 14px; margin: 0 auto; max-width: 1320px; width: 100%; }
.kb-detail-grid { align-items: start; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr) 320px; }
.kb-back {
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
.kb-back:hover { color: var(--text); }
.kb-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
}
.kb-search { position: relative; }
.kb-search svg { color: var(--faint); left: 11px; position: absolute; top: 12px; }
.kb-input {
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
.kb-input::placeholder { color: var(--faint); }
.kb-input:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.kb-search .kb-input { padding-left: 34px; }
.kb-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
.kb-list { display: flex; flex-direction: column; gap: 10px; }
.kb-row {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 16px;
  grid-template-columns: 36px minmax(180px, 1.2fr) minmax(160px, .9fr) auto auto 18px;
  padding: 13px 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.kb-row:hover { background: var(--panel-hover); border-color: var(--app-primary-ring); box-shadow: 0 6px 18px var(--app-shadow-soft); }
.kb-row:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.kb-row-identity { display: grid; gap: 3px; min-width: 0; }
.kb-row-name { font-size: 14px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-row-sub { color: var(--subtle); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-row-stats { align-items: center; color: var(--subtle); display: flex; flex-wrap: wrap; font-size: 11.5px; gap: 8px; min-width: 0; }
.kb-row-stat { align-items: center; display: inline-flex; gap: 5px; white-space: nowrap; }
.kb-row-time { align-items: center; color: var(--subtle); display: inline-flex; font-size: 11.5px; gap: 5px; white-space: nowrap; }
.kb-row-chevron { color: var(--faint); display: inline-flex; transition: color .18s ease, transform .18s ease; }
.kb-row:hover .kb-row-chevron { color: var(--primary-light); transform: translateX(2px); }
.kb-card-item {
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 176px;
  padding: 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
}
.kb-card-item:hover {
  background: var(--panel-hover);
  border-color: var(--app-primary-ring);
  box-shadow: 0 12px 30px var(--app-shadow-soft);
  transform: translateY(-2px);
}
.kb-card-item:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.kb-card-top { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.kb-card-name { font-size: 15px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-card-desc {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--muted);
  display: -webkit-box;
  font-size: 12.5px;
  line-height: 1.55;
  overflow: hidden;
}
.kb-card-foot {
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
.kb-card-foot-meta { align-items: center; display: inline-flex; gap: 5px; min-width: 0; }
.kb-card-foot-time { margin-left: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-add-card {
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
.kb-add-card:hover { background: var(--app-hover); border-color: var(--app-primary-ring); color: var(--text); }
.kb-add-icon {
  align-items: center;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  display: flex;
  height: 40px;
  justify-content: center;
  margin-bottom: 4px;
  width: 40px;
}
.kb-add-label { font-size: 13.5px; font-weight: 800; }
.kb-add-copy { color: var(--faint); font-size: 11.5px; max-width: 210px; }
.kb-avatar {
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
.kb-detail-column { display: flex; flex: 1; flex-direction: column; gap: 16px; min-width: 0; }
.kb-detail-head { align-items: center; display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; padding: 16px 18px; }
.kb-detail-identity { align-items: center; display: flex; gap: 13px; min-width: 0; }
.kb-detail-name { align-items: center; display: flex; flex-wrap: wrap; font-size: 19px; font-weight: 850; gap: 9px; letter-spacing: -.4px; margin: 0; }
.kb-detail-sub { color: var(--subtle); display: flex; flex-wrap: wrap; font-family: var(--font-geist-mono), monospace; font-size: 11.5px; gap: 3px 14px; margin-top: 4px; }
.kb-detail-meta { align-items: center; display: inline-flex; gap: 6px; min-width: 0; }
.kb-detail-tag { color: var(--faint); font-family: var(--font-geist-sans), system-ui, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: .3px; text-transform: uppercase; }
.kb-detail-pending { color: var(--faint); font-family: var(--font-geist-sans), system-ui, sans-serif; font-size: 11px; font-style: italic; }
.kb-detail-actions { display: flex; flex-wrap: wrap; gap: 9px; }
.kb-btn {
  align-items: center;
  background: var(--panel-hover);
  border: 1px solid var(--app-border-strong);
  border-radius: 11px;
  color: var(--text);
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  transition: background .18s ease, border-color .18s ease, transform .18s ease;
  white-space: nowrap;
}
.kb-btn:hover { background: var(--app-panel-hover); transform: translateY(-1px); }
.kb-btn:disabled { cursor: not-allowed; opacity: .45; transform: none; }
.kb-btn-primary { background: linear-gradient(140deg,var(--primary-2),var(--primary)); border-color: transparent; box-shadow: 0 4px 14px var(--app-primary-glow); color: var(--app-on-accent); }
.kb-btn-primary:hover { filter: brightness(1.06); }
.kb-btn-danger { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--app-rose-text); }
.kb-btn-danger:hover { background: var(--app-rose-soft-2); }
.kb-icon-button {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 36px;
  justify-content: center;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
  width: 36px;
}
.kb-icon-button:hover { background: var(--app-hover-2); border-color: var(--app-border-strong); color: var(--app-text-strong); }
.kb-icon-button.is-danger:hover { background: var(--app-rose-soft-2); border-color: var(--app-rose-border); color: var(--app-rose-text); }
.kb-pill {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 11px;
  font-weight: 850;
  gap: 6px;
  letter-spacing: .2px;
  line-height: 1;
  padding: 5px 9px;
  white-space: nowrap;
}
.kb-pill-complete { background: var(--app-green-soft); border: 1px solid var(--app-green-border); color: var(--app-green-text); }
.kb-pill-in_progress { background: var(--app-amber-soft); border: 1px solid var(--app-amber-border); color: var(--app-amber-text); }
.kb-pill-refreshing_in_progress { background: var(--app-sky-soft); border: 1px solid var(--app-sky-border); color: var(--app-sky-text); }
.kb-pill-error { background: var(--app-rose-soft-2); border: 1px solid var(--app-rose-border); color: var(--app-rose-text); }
.kb-pill-neutral { background: var(--app-hover-2); border: 1px solid var(--app-border-strong); color: var(--subtle); }
.kb-dot { background: currentColor; border-radius: 50%; height: 6px; width: 6px; }
.kb-section-head { align-items: center; border-bottom: 1px solid var(--border); display: flex; gap: 14px; justify-content: space-between; padding: 15px 18px; }
.kb-section-title { font-size: 14px; font-weight: 850; margin: 0; }
.kb-section-copy { color: var(--subtle); font-size: 12px; margin-top: 2px; }
.kb-source-list { display: flex; flex-direction: column; }
.kb-source {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 13px;
  padding: 13px 18px;
}
.kb-source:last-child { border-bottom: 0; }
.kb-source:hover { background: var(--app-border-soft); }
.kb-source-icon {
  align-items: center;
  border-radius: 10px;
  display: flex;
  flex-shrink: 0;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.kb-source-icon.is-document { background: var(--app-primary-soft); border: 1px solid var(--app-primary-border); color: var(--primary-light); }
.kb-source-icon.is-text { background: var(--app-green-soft); border: 1px solid var(--app-green-border); color: var(--app-green-text); }
.kb-source-icon.is-url { background: var(--app-sky-soft); border: 1px solid var(--app-sky-border); color: var(--app-sky-text); }
.kb-source-icon.is-file { background: var(--app-amber-soft); border: 1px solid var(--app-amber-border); color: var(--app-amber-text); }
.kb-source-body { min-width: 0; }
.kb-source-name { font-size: 13.5px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-source-meta { align-items: center; color: var(--subtle); display: flex; flex-wrap: wrap; font-size: 11.5px; gap: 8px; margin-top: 3px; }
.kb-source-id { color: var(--faint); font-family: var(--font-geist-mono), monospace; font-size: 11px; }
.kb-source-spacer { flex: 1; }
.kb-config-column { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.kb-config-head { padding: 16px 18px 0; }
.kb-config-title { font-size: 15px; font-weight: 850; margin: 0; }
.kb-config-copy { color: var(--subtle); font-size: 12px; margin-top: 4px; }
.kb-config-body { display: grid; gap: 14px; padding: 16px 18px 18px; }
.kb-config-actions { border-bottom: 1px solid var(--border); display: flex; gap: 9px; padding-bottom: 14px; }
.kb-config-actions .kb-btn { flex: 1; }
.kb-field { display: grid; gap: 7px; }
.kb-field-label { color: var(--subtle); font-size: 11.5px; font-weight: 800; }
.kb-field-hint { color: var(--faint); font-size: 11px; }
.kb-range { accent-color: var(--primary-2); width: 100%; }
.kb-toggle-row { align-items: center; display: flex; gap: 12px; justify-content: space-between; }
.kb-switch {
  background: var(--app-border-strong);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  flex-shrink: 0;
  height: 24px;
  padding: 3px;
  position: relative;
  transition: background .18s ease;
  width: 44px;
}
.kb-switch.is-on { background: var(--primary); }
.kb-switch span { background: #fff; border-radius: 50%; display: block; height: 18px; transition: transform .18s ease; width: 18px; }
.kb-switch.is-on span { transform: translateX(20px); }
.kb-empty {
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
  min-height: 260px;
  padding: 40px;
  text-align: center;
}
.kb-empty p { margin: 0; max-width: 420px; }
.kb-form-error {
  background: var(--app-rose-soft);
  border: 1px solid var(--app-rose-border);
  border-radius: 11px;
  color: var(--app-rose-text);
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.5;
  padding: 10px 12px;
}
.kb-textarea {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  line-height: 1.55;
  min-height: 118px;
  outline: none;
  padding: 10px 12px;
  resize: vertical;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.kb-textarea::placeholder { color: var(--faint); }
.kb-textarea:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.kb-textarea:disabled { cursor: not-allowed; opacity: .6; }
.kb-draft { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; display: grid; gap: 11px; padding: 13px; }
.kb-draft.is-invalid { border-color: var(--app-rose-border); }
.kb-draft-head { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.kb-draft-index { color: var(--faint); font-size: 10.5px; font-weight: 800; letter-spacing: .7px; text-transform: uppercase; }
.kb-draft-error { color: var(--app-rose-text); font-size: 11.5px; font-weight: 700; line-height: 1.45; }
.kb-draft-footer { align-items: center; display: flex; gap: 12px; justify-content: space-between; }
.kb-tabs { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; display: grid; gap: 4px; grid-auto-flow: column; margin-top: 16px; padding: 4px; }
.kb-tab {
  background: transparent;
  border: 0;
  border-radius: 9px;
  color: var(--subtle);
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 800;
  padding: 8px 12px;
  transition: background .16s ease, color .16s ease;
}
.kb-tab:hover:not(:disabled) { color: var(--text); }
.kb-tab.is-active { background: var(--app-primary-soft-2); color: var(--app-primary-text); }
.kb-tab:disabled { cursor: not-allowed; opacity: .5; }
.kb-dropzone {
  background: var(--panel);
  border: 1px dashed var(--app-border-strong);
  border-radius: 14px;
  color: var(--subtle);
  cursor: pointer;
  display: grid;
  gap: 5px;
  justify-items: center;
  padding: 26px 16px;
  text-align: center;
  transition: background .16s ease, border-color .16s ease;
  width: 100%;
}
.kb-dropzone:hover:not(:disabled), .kb-dropzone.is-dragging { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); color: var(--text); }
.kb-dropzone:disabled { cursor: not-allowed; opacity: .55; }
.kb-dropzone-title { color: var(--text); font-size: 13px; font-weight: 800; }
.kb-dropzone-hint { font-size: 11.5px; line-height: 1.5; }
.kb-file-input { display: none; }
.kb-file { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; display: grid; gap: 10px; padding: 13px; }
.kb-file.is-invalid { border-color: var(--app-rose-border); }
.kb-file-head { align-items: center; display: flex; gap: 10px; }
.kb-file-body { min-width: 0; }
.kb-file-name { font-size: 13px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-file-meta { color: var(--faint); font-size: 11px; margin-top: 2px; }
.kb-file-spacer { flex: 1; }
.kb-icon-button:disabled, .kb-switch:disabled { cursor: not-allowed; opacity: .45; }
.kb-icon-button:disabled:hover { background: var(--panel); border-color: var(--app-border); color: var(--subtle); }
.kb-range:disabled { cursor: not-allowed; opacity: .5; }
.kb-input:disabled { cursor: not-allowed; opacity: .6; }
.kb-modal-overlay {
  align-items: center;
  animation: kb-fade-in .16s ease;
  backdrop-filter: blur(3px);
  background: var(--app-overlay);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 120;
}
.kb-modal {
  animation: kb-modal-in .18s ease;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: 18px;
  box-shadow: 0 30px 80px var(--app-shadow-color-strong);
  max-height: calc(100vh - 48px);
  max-width: 460px;
  overflow-y: auto;
  padding: 22px;
  width: 100%;
}
.kb-modal-wide { max-width: 620px; }
.kb-modal-title { font-size: 17px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.kb-modal-copy { color: var(--muted); font-size: 12.5px; line-height: 1.55; margin: 6px 0 0; }
.kb-modal-copy strong { color: var(--text); font-weight: 800; }
.kb-modal-body { display: grid; gap: 14px; margin-top: 18px; }
.kb-modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
@keyframes kb-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes kb-modal-in {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to { opacity: 1; transform: none; }
}
.kb-toast {
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
  z-index: 130;
}
.kb-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-green-text); }
.kb-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
@media (max-width: 1240px) {
  .kb-detail-grid { grid-template-columns: minmax(0, 1fr); }
  .kb-row { grid-template-columns: 36px minmax(180px, 1fr) minmax(150px, .8fr) auto 18px; }
  .kb-row-time { display: none; }
}
@media (max-width: 980px) {
  .kb-shell { display: block; }
  .kb-sidebar { min-height: auto; position: static; width: 100%; }
  .kb-sidebar-footer { margin-top: 18px; }
  .kb-user-card { display: none; }
  .kb-nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .kb-topbar { padding: 18px 20px; }
  .kb-content { padding: 18px 20px 26px; }
}
@media (max-width: 640px) {
  .kb-nav { grid-template-columns: 1fr 1fr; }
  .kb-content { padding: 14px 14px 22px; }
  .kb-toolbar .kb-search { max-width: none; }
  .kb-toolbar .kb-btn-primary { flex: 1 1 auto; }
  .kb-detail-actions { width: 100%; }
  .kb-detail-actions .kb-btn { flex: 1; }
  .kb-row { gap: 10px; grid-template-columns: 36px minmax(0, 1fr) auto 18px; padding: 12px; }
  .kb-row-stats { grid-column: 2 / -1; grid-row: 2; }
  .expandable-card-stage { align-items: stretch; padding: 0; }
  .kb-expandable-card { border-radius: 0; max-height: 100vh; max-width: none; padding: 14px; }
}
`;

// cardSummary is the one line a grid card shows under the name: how much has
// actually been indexed, which is what distinguishes one base from another at a
// glance.
function cardSummary(base: KnowledgeBase) {
  const sources = base.knowledge_base_sources;
  if (sources.length === 0) return "No sources yet — nothing to retrieve from.";
  const chunks = sources.reduce((total, source) => total + source.chunk_count, 0);
  return `${sources.length} source${sources.length === 1 ? "" : "s"} · ${chunks} chunk${
    chunks === 1 ? "" : "s"
  } indexed`;
}

function formatShortTimestamp(value: number | null) {
  if (!value) return "never refreshed";
  return shortDateFormatter.format(new Date(value));
}

// Only text sources exist so far; document and url rows arrive with their
// fetchers, and the icon is picked here so adding them stays a one-line change.
function sourceIcon(type: KnowledgeBaseSource["type"]): IconName {
  return type === "text" ? "text" : "file";
}

// The stored text itself never comes back over the wire — it is kept to be
// re-chunked, not read — so a row reports how many vectors the source produced
// instead. A count of zero means the row was stored but never indexed.
function sourceDetail(source: KnowledgeBaseSource) {
  if (source.chunk_count === 0) return "not indexed";
  return `${source.chunk_count} chunk${source.chunk_count === 1 ? "" : "s"}`;
}

export default function KnowledgeBasePage() {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { mode } = useWorkspaceMode();
  const [bases, setBases] = useState<KnowledgeBase[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [viewModeOverride, setViewModeOverride] = useState<BrowseView | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMaxChunkSize, setNewMaxChunkSize] = useState(2000);
  const [newMinChunkSize, setNewMinChunkSize] = useState(400);
  const [newAutoRefresh, setNewAutoRefresh] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [createError, setCreateError] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  // Deleting is confirmed against a snapshot of the row rather than the id
  // alone, so the dialog can name it even while the list changes underneath.
  const [pendingDelete, setPendingDelete] = useState<KnowledgeBase | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isAddingSources, setIsAddingSources] = useState(false);
  // The knowledge base is snapshotted alongside the source: the dialog names
  // both, and the delete has to go to the base the source was listed under even
  // if the selection moves on.
  const [pendingSourceDelete, setPendingSourceDelete] = useState<{
    base: KnowledgeBase;
    source: KnowledgeBaseSource;
  } | null>(null);
  const [isDeletingSource, setIsDeletingSource] = useState(false);
  const [sourceDeleteError, setSourceDeleteError] = useState("");

  // Being signed out is reported through the same load state as a failed
  // request, so the page has one place that explains why the list is empty.
  const authError = !isAuthLoaded ? null : !isSignedIn ? "Sign in to manage knowledge bases." : null;
  const effectiveLoadState = !isAuthLoaded ? "loading" : authError ? "error" : loadState;
  const effectiveLoadError = authError ?? loadError;
  const viewMode = viewModeOverride ?? (mode === "chat" ? "list" : "grid");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return bases;
    return bases.filter((base) =>
      base.knowledge_base_name.toLowerCase().includes(needle)
    );
  }, [bases, query]);

  // Nothing selected means the grid, so there is no falling back to the first
  // base here — that would make the browse view unreachable.
  const selected = selectedId
    ? bases.find((base) => base.knowledge_base_id === selectedId) ?? null
    : null;

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isSignedIn) return;

    let cancelled = false;
    (async () => {
      setLoadState("loading");
      setLoadError("");
      try {
        const rows = await apiListKnowledgeBases(getToken);
        if (cancelled) return;
        const list = rows.map(fromApi);
        setBases(list);
        setSelectedId((current) =>
          current && list.some((base) => base.knowledge_base_id === current) ? current : null
        );
        setLoadState("ready");
      } catch (error) {
        if (cancelled) return;
        setLoadState("error");
        setLoadError(
          error instanceof Error ? error.message : "Failed to load knowledge bases"
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isAuthLoaded, isSignedIn, reloadKey]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function flash(kind: Notice["kind"], text: string) {
    setNotice({ kind, text });
  }

  // applyUpdatedBase replaces one row with what the server stored, so the list
  // and the detail view show the saved values rather than the edited draft.
  function applyUpdatedBase(updated: KnowledgeBase) {
    setBases((current) =>
      current.map((base) =>
        base.knowledge_base_id === updated.knowledge_base_id ? updated : base
      )
    );
  }

  function requestDelete(base: KnowledgeBase) {
    setPendingDelete(base);
    setDeleteError("");
  }

  function closeDelete() {
    if (isDeleting) return;
    setPendingDelete(null);
    setDeleteError("");
  }

  // deleteBase drops the row on the server first and only then locally, so a
  // failed delete leaves the list showing what the server still has. Deleting
  // the open base drops back to the grid.
  async function deleteBase() {
    const base = pendingDelete;
    if (!base || isDeleting) return;

    setIsDeleting(true);
    setDeleteError("");
    try {
      await apiDeleteKnowledgeBase(base.knowledge_base_id, getToken);
      setBases((current) =>
        current.filter((row) => row.knowledge_base_id !== base.knowledge_base_id)
      );
      // Clearing the selection returns to the grid, which is where the deleted
      // base's card no longer is.
      setSelectedId((currentId) =>
        currentId === base.knowledge_base_id ? null : currentId
      );
      setPendingDelete(null);
      flash("success", `Knowledge base "${base.knowledge_base_name}" deleted`);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete knowledge base"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function requestSourceDelete(base: KnowledgeBase, source: KnowledgeBaseSource) {
    setPendingSourceDelete({ base, source });
    setSourceDeleteError("");
  }

  function closeSourceDelete() {
    if (isDeletingSource) return;
    setPendingSourceDelete(null);
    setSourceDeleteError("");
  }

  // deleteSource drops the source on the server — vectors included — and only
  // then locally, so a failed delete leaves the source listed exactly as the
  // server still has it, which is also how the server left it.
  async function deleteSource() {
    const pending = pendingSourceDelete;
    if (!pending || isDeletingSource) return;
    const { base, source } = pending;

    setIsDeletingSource(true);
    setSourceDeleteError("");
    try {
      await apiDeleteKnowledgeBaseSource(base.knowledge_base_id, source.source_id, getToken);
      setBases((current) =>
        current.map((row) =>
          row.knowledge_base_id === base.knowledge_base_id
            ? {
                ...row,
                knowledge_base_sources: row.knowledge_base_sources.filter(
                  (candidate) => candidate.source_id !== source.source_id
                ),
              }
            : row
        )
      );
      setPendingSourceDelete(null);
      flash("success", `Source "${source.title}" deleted`);
    } catch (error) {
      setSourceDeleteError(
        error instanceof Error ? error.message : "Failed to delete source"
      );
    } finally {
      setIsDeletingSource(false);
    }
  }

  function openCreate() {
    setNewName("");
    setNewMaxChunkSize(2000);
    setNewMinChunkSize(400);
    setNewAutoRefresh(false);
    setCreateError("");
    setIsCreating(true);
  }

  function closeCreate() {
    if (isSaving) return;
    setIsCreating(false);
    setCreateError("");
  }

  async function createBase() {
    const name = newName.trim();
    if (!name || isSaving) return;
    if (newMinChunkSize > newMaxChunkSize) {
      setCreateError("Min chunk size must not be greater than max chunk size.");
      return;
    }
    if (isAuthLoaded && !isSignedIn) {
      setCreateError("Sign in to create a knowledge base.");
      return;
    }

    setIsSaving(true);
    setCreateError("");
    try {
      const created = await apiCreateKnowledgeBase(
        {
          knowledge_base_name: name,
          enable_auto_refresh: newAutoRefresh,
          max_chunk_size: newMaxChunkSize,
          min_chunk_size: newMinChunkSize,
        },
        getToken
      );
      const base = fromApi(created);
      setBases((current) => [base, ...current]);
      setSelectedId(base.knowledge_base_id);
      setIsCreating(false);
      flash("success", `Knowledge base "${base.knowledge_base_name}" created`);
    } catch (error) {
      // Field errors are more specific than the summary message, so lead with
      // them when the server sent any.
      const fieldMessage =
        error instanceof KnowledgeBaseError && error.fieldErrors.length > 0
          ? error.fieldErrors.map((item) => `${item.field}: ${item.message}`).join(" · ")
          : "";
      setCreateError(
        fieldMessage ||
          (error instanceof Error ? error.message : "Failed to create knowledge base")
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="kb-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Sidebar activeLabel="Knowledge Base" count={bases.length} />

      <main className="kb-main">
        <header className="kb-topbar">
          <div className="kb-topbar-wrap">
            <h1 className="kb-topbar-title">Knowledge Base</h1>
            <div className="kb-topbar-copy">
              Documents your agents can quote from mid-call — files, raw text and pages, chunked
              and indexed into a namespace they can search.
            </div>
          </div>
        </header>

        <div className="kb-content">
          {selected ? (
            <ExpandableCardDemoStandard
              className="kb-expandable-card"
              dismissDisabled={isAddingSources || Boolean(pendingDelete) || Boolean(pendingSourceDelete)}
              layoutId={`knowledge-base-${selected.knowledge_base_id}`}
              onClose={() => setSelectedId(null)}
              open
            >
            <div className="kb-detail-layout">
              <div className="kb-expandable-topline">
                <span className="kb-expandable-label">Knowledge base details</span>
                <button
                  aria-label="Close knowledge base details"
                  className="kb-expandable-close"
                  onClick={() => setSelectedId(null)}
                  type="button"
                >
                  <Icon name="x" size={16} sw={2.4} />
                </button>
              </div>

              <div className="kb-detail-grid">
              <div className="kb-detail-column">
                <section className="kb-card">
                  <div className="kb-detail-head">
                    <div className="kb-detail-identity">
                      <span className="kb-avatar" style={{ height: 44, width: 44 }}>
                        <Icon name="book" size={20} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <h2 className="kb-detail-name">
                          {selected.knowledge_base_name}
                          <StatusPill status={selected.status} />
                        </h2>
                        <div className="kb-detail-sub">
                          <span className="kb-detail-meta">
                            <span className="kb-detail-tag">id</span>
                            {selected.knowledge_base_id}
                          </span>
                          <span
                            className="kb-detail-meta"
                            title="Vector-store namespace holding this knowledge base's chunks."
                          >
                            <span className="kb-detail-tag">namespace</span>
                            {selected.namespace_id ?? (
                              <span className="kb-detail-pending">not assigned</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="kb-detail-actions">
                      <button className="kb-btn" disabled title={notYetHint} type="button">
                        <Icon name="refresh" size={15} />
                        Refresh
                      </button>
                      <button
                        className="kb-btn kb-btn-primary"
                        onClick={() => setIsAddingSources(true)}
                        type="button"
                      >
                        <Icon name="plus" size={15} stroke="#fff" sw={2.4} />
                        Add sources
                      </button>
                      <button
                        aria-label={`Delete ${selected.knowledge_base_name}`}
                        className="kb-icon-button is-danger"
                        onClick={() => requestDelete(selected)}
                        title="Delete this knowledge base"
                        type="button"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                </section>

                <section className="kb-card">
                  <div className="kb-section-head">
                    <div>
                      <h3 className="kb-section-title">Sources</h3>
                      <div className="kb-section-copy">
                        Files, raw texts and scraped pages indexed into this knowledge base.
                      </div>
                    </div>
                    <button
                      className="kb-btn"
                      onClick={() => setIsAddingSources(true)}
                      type="button"
                    >
                      <Icon name="plus" size={15} />
                      Add
                    </button>
                  </div>
                  {selected.knowledge_base_sources.length === 0 ? (
                    <div className="kb-empty" style={{ border: 0, minHeight: 180 }}>
                      <p>
                        This knowledge base has no sources yet. Add a raw text and it is chunked,
                        embedded and indexed into the namespace right away.
                      </p>
                      <button
                        className="kb-btn kb-btn-primary"
                        onClick={() => setIsAddingSources(true)}
                        type="button"
                      >
                        <Icon name="plus" size={15} stroke="#fff" sw={2.4} />
                        Add sources
                      </button>
                    </div>
                  ) : (
                    <div className="kb-source-list">
                      {selected.knowledge_base_sources.map((source) => (
                        <div className="kb-source" key={source.source_id}>
                          <span className={`kb-source-icon is-${source.type}`}>
                            <Icon name={sourceIcon(source.type)} size={16} />
                          </span>
                          <div className="kb-source-body">
                            <div className="kb-source-name">{source.title}</div>
                            <div className="kb-source-meta">
                              <span className="kb-pill kb-pill-neutral">{source.type}</span>
                              <span>{sourceDetail(source)}</span>
                              <span className="kb-source-id">{source.source_id}</span>
                            </div>
                          </div>
                          <span className="kb-source-spacer" />
                          <button
                            aria-label={`Delete source ${source.title}`}
                            className="kb-icon-button is-danger"
                            onClick={() => requestSourceDelete(selected, source)}
                            title="Delete this source and its chunks"
                            type="button"
                          >
                            <Icon name="trash" size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <ConfigPanel
                base={selected}
                getToken={getToken}
                key={selected.knowledge_base_id}
                onNotice={flash}
                onSaved={applyUpdatedBase}
              />
              </div>
            </div>
            </ExpandableCardDemoStandard>
          ) : (
            <div className="kb-browse">
              <div className="kb-toolbar">
                <label className="kb-search">
                  <Icon name="search" size={16} />
                  <input
                    className="kb-input"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search knowledge bases..."
                    value={query}
                  />
                </label>
                <div aria-label="View" className="kb-view-toggle" role="group">
                  <button
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                    className={`kb-view-btn${viewMode === "list" ? " is-active" : ""}`}
                    onClick={() => setViewModeOverride("list")}
                    title="List view"
                    type="button"
                  >
                    <Icon name="list" size={16} sw={2.2} />
                  </button>
                  <button
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                    className={`kb-view-btn${viewMode === "grid" ? " is-active" : ""}`}
                    onClick={() => setViewModeOverride("grid")}
                    title="Grid view"
                    type="button"
                  >
                    <Icon name="grid" size={16} sw={2.2} />
                  </button>
                </div>
                <span className="kb-count">
                  {effectiveLoadState === "loading"
                    ? "Loading…"
                    : query.trim()
                      ? `${filtered.length} of ${bases.length}`
                      : `${bases.length} ${bases.length === 1 ? "base" : "bases"}`}
                </span>
                <button className="kb-btn kb-btn-primary" onClick={openCreate} type="button">
                  <Icon name="plus" size={15} stroke="#fff" sw={2.4} />
                  New
                </button>
              </div>

              {effectiveLoadState === "loading" ? (
                <div className="kb-empty">
                  <p>Loading knowledge bases…</p>
                </div>
              ) : effectiveLoadState === "error" ? (
                <div className="kb-empty">
                  <p>{effectiveLoadError}</p>
                  {authError ? null : (
                    <button
                      className="kb-btn"
                      onClick={() => setReloadKey((current) => current + 1)}
                      type="button"
                    >
                      <Icon name="refresh" size={15} />
                      Try again
                    </button>
                  )}
                </div>
              ) : bases.length === 0 ? (
                <div className="kb-empty">
                  <p>
                    No knowledge bases yet. Create one to give your agents something to retrieve
                    from.
                  </p>
                  <button className="kb-btn kb-btn-primary" onClick={openCreate} type="button">
                    <Icon name="plus" size={15} stroke="#fff" sw={2.4} />
                    New knowledge base
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="kb-empty">
                  <p>No knowledge bases match “{query}”.</p>
                </div>
              ) : viewMode === "list" ? (
                <div className="kb-list">
                  {filtered.map((base) => {
                    const sourceCount = base.knowledge_base_sources.length;
                    const chunkCount = base.knowledge_base_sources.reduce(
                      (total, source) => total + source.chunk_count,
                      0
                    );
                    return (
                      <motion.button
                        className="kb-row"
                        key={base.knowledge_base_id}
                        layoutId={`knowledge-base-${base.knowledge_base_id}`}
                        onClick={() => setSelectedId(base.knowledge_base_id)}
                        type="button"
                      >
                        <span className="kb-avatar">
                          <Icon name="book" size={18} />
                        </span>
                        <span className="kb-row-identity">
                          <span className="kb-row-name">{base.knowledge_base_name}</span>
                          <span className="kb-row-sub">{cardSummary(base)}</span>
                        </span>
                        <span className="kb-row-stats">
                          <span className="kb-row-stat">
                            <Icon name="file" size={12} />
                            {sourceCount} {sourceCount === 1 ? "source" : "sources"}
                          </span>
                          <span className="kb-row-stat">
                            <Icon name="layers" size={12} />
                            {chunkCount} {chunkCount === 1 ? "chunk" : "chunks"}
                          </span>
                          <span className="kb-row-stat">
                            <Icon name="refresh" size={12} />
                            {base.enable_auto_refresh ? "Auto" : "Manual"}
                          </span>
                        </span>
                        <span className="kb-row-time" title="Last refreshed">
                          <Icon name="clock" size={12} />
                          {formatShortTimestamp(base.last_refreshed_timestamp)}
                        </span>
                        <StatusPill status={base.status} />
                        <span className="kb-row-chevron">
                          <Icon name="chevron" size={16} sw={2.3} />
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="kb-grid">
                  {filtered.map((base) => (
                    <motion.button
                      className="kb-card kb-card-item"
                      key={base.knowledge_base_id}
                      layoutId={`knowledge-base-${base.knowledge_base_id}`}
                      onClick={() => setSelectedId(base.knowledge_base_id)}
                      type="button"
                    >
                      <span className="kb-card-top">
                        <span className="kb-avatar">
                          <Icon name="book" size={18} />
                        </span>
                        <StatusPill status={base.status} />
                      </span>
                      <span className="kb-card-name">{base.knowledge_base_name}</span>
                      <span className="kb-card-desc">{cardSummary(base)}</span>
                      <span className="kb-card-foot">
                        <span
                          className="kb-pill kb-pill-neutral"
                          title={`Chunks of ${base.min_chunk_size}–${base.max_chunk_size} characters`}
                        >
                          <Icon name="layers" size={11} />
                          {base.max_chunk_size}/{base.min_chunk_size}
                        </span>
                        <span className="kb-card-foot-meta">
                          <Icon name="refresh" size={11} />
                          {base.enable_auto_refresh ? "Auto" : "Manual"}
                        </span>
                        <span className="kb-card-foot-meta kb-card-foot-time">
                          <Icon name="clock" size={11} />
                          {formatShortTimestamp(base.last_refreshed_timestamp)}
                        </span>
                      </span>
                    </motion.button>
                  ))}

                  <button className="kb-add-card" onClick={openCreate} type="button">
                    <span className="kb-add-icon">
                      <Icon name="plus" size={20} sw={2.4} />
                    </span>
                    <span className="kb-add-label">New knowledge base</span>
                    <span className="kb-add-copy">Index files, text or pages for your agents.</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
            </main>

      {isCreating ? (
        <div
          className="kb-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCreate();
          }}
        >
          <div aria-labelledby="kb-create-title" aria-modal="true" className="kb-modal" role="dialog">
            <h2 className="kb-modal-title" id="kb-create-title">
              New knowledge base
            </h2>
            <p className="kb-modal-copy">
              The name is the only required field. Chunk sizes and auto refresh are fixed at
              creation, so set them now — the base is saved on the server and starts in{" "}
              <strong>Indexing</strong>.
            </p>
            <div className="kb-modal-body">
              <label className="kb-field">
                <span className="kb-field-label">Name</span>
                <input
                  autoFocus
                  className="kb-input"
                  disabled={isSaving}
                  maxLength={nameLimit}
                  onChange={(event) => setNewName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") createBase();
                  }}
                  placeholder="Support handbook"
                  value={newName}
                />
                <span className="kb-field-hint">
                  {newName.length}/{nameLimit} characters
                </span>
              </label>
              <label className="kb-field">
                <span className="kb-field-label">Max chunk size · {newMaxChunkSize}</span>
                <input
                  className="kb-range"
                  disabled={isSaving}
                  max={chunkBounds.maxUpper}
                  min={chunkBounds.maxLower}
                  onChange={(event) => setNewMaxChunkSize(Number(event.target.value))}
                  step={100}
                  type="range"
                  value={newMaxChunkSize}
                />
                <span className="kb-field-hint">
                  {chunkBounds.maxLower}–{chunkBounds.maxUpper} characters. Larger chunks keep more
                  context together.
                </span>
              </label>
              <label className="kb-field">
                <span className="kb-field-label">Min chunk size · {newMinChunkSize}</span>
                <input
                  className="kb-range"
                  disabled={isSaving}
                  max={chunkBounds.minUpper}
                  min={chunkBounds.minLower}
                  onChange={(event) => setNewMinChunkSize(Number(event.target.value))}
                  step={50}
                  type="range"
                  value={newMinChunkSize}
                />
                <span className="kb-field-hint">
                  {chunkBounds.minLower}–{chunkBounds.minUpper} characters, and never above the max.
                </span>
              </label>
              <div className="kb-toggle-row">
                <span>
                  <div className="kb-field-label">Auto refresh</div>
                  <div className="kb-field-hint">Re-scrape URL sources every 12 hours.</div>
                </span>
                <button
                  aria-label="Toggle auto refresh for the new knowledge base"
                  aria-pressed={newAutoRefresh}
                  className={`kb-switch${newAutoRefresh ? " is-on" : ""}`}
                  disabled={isSaving}
                  onClick={() => setNewAutoRefresh((current) => !current)}
                  type="button"
                >
                  <span />
                </button>
              </div>
              {createError ? (
                <div className="kb-form-error" role="alert">
                  {createError}
                </div>
              ) : null}
            </div>
            <div className="kb-modal-actions">
              <button className="kb-btn" disabled={isSaving} onClick={closeCreate} type="button">
                Cancel
              </button>
              <button
                className="kb-btn kb-btn-primary"
                disabled={!newName.trim() || isSaving}
                onClick={createBase}
                type="button"
              >
                {isSaving ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isAddingSources && selected ? (
        <AddSourcesModal
          base={selected}
          getToken={getToken}
          key={selected.knowledge_base_id}
          onAdded={(updated, addedCount) => {
            applyUpdatedBase(updated);
            setIsAddingSources(false);
            flash(
              "success",
              `${addedCount} source${addedCount === 1 ? "" : "s"} indexed into "${updated.knowledge_base_name}"`
            );
          }}
          onClose={() => setIsAddingSources(false)}
        />
      ) : null}

      {pendingSourceDelete ? (
        <div
          className="kb-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSourceDelete();
          }}
        >
          <div
            aria-labelledby="kb-source-delete-title"
            aria-modal="true"
            className="kb-modal"
            role="dialog"
          >
            <h2 className="kb-modal-title" id="kb-source-delete-title">
              Delete source
            </h2>
            <p className="kb-modal-copy">
              <strong>{pendingSourceDelete.source.title}</strong> is removed from{" "}
              <strong>{pendingSourceDelete.base.knowledge_base_name}</strong>, and{" "}
              {pendingSourceDelete.source.chunk_count === 0
                ? "nothing is left in the vector store, since it was never indexed"
                : `its ${pendingSourceDelete.source.chunk_count} indexed chunk${
                    pendingSourceDelete.source.chunk_count === 1 ? "" : "s"
                  } are deleted from the vector store`}
              . Agents stop retrieving it, and the text is not kept — adding it back means pasting
              it again. This cannot be undone.
            </p>
            {sourceDeleteError ? (
              <div className="kb-form-error" role="alert" style={{ marginTop: 14 }}>
                {sourceDeleteError}
              </div>
            ) : null}
            <div className="kb-modal-actions">
              <button
                className="kb-btn"
                disabled={isDeletingSource}
                onClick={closeSourceDelete}
                type="button"
              >
                Cancel
              </button>
              <button
                autoFocus
                className="kb-btn kb-btn-danger"
                disabled={isDeletingSource}
                onClick={deleteSource}
                type="button"
              >
                {isDeletingSource ? "Deleting…" : "Delete source"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingDelete ? (
        <div
          className="kb-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDelete();
          }}
        >
          <div aria-labelledby="kb-delete-title" aria-modal="true" className="kb-modal" role="dialog">
            <h2 className="kb-modal-title" id="kb-delete-title">
              Delete knowledge base
            </h2>
            <p className="kb-modal-copy">
              <strong>{pendingDelete.knowledge_base_name}</strong> and everything indexed into it
              are removed for good. Agents with it attached will stop retrieving from it. This
              cannot be undone.
            </p>
            {deleteError ? (
              <div className="kb-form-error" role="alert" style={{ marginTop: 14 }}>
                {deleteError}
              </div>
            ) : null}
            <div className="kb-modal-actions">
              <button className="kb-btn" disabled={isDeleting} onClick={closeDelete} type="button">
                Cancel
              </button>
              <button
                autoFocus
                className="kb-btn kb-btn-danger"
                disabled={isDeleting}
                onClick={deleteBase}
                type="button"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {notice ? (
        <div
          className={`kb-toast ${notice.kind === "error" ? "kb-toast-error" : "kb-toast-success"}`}
          role="status"
        >
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

// describeDraftSize previews what a draft will cost to index. The chunk count is
// a lower bound rather than a prediction: the splitter breaks on sentence
// boundaries and merges anything shorter than the min chunk size, so a text can
// produce fewer, larger chunks than dividing by the max suggests.
function describeDraftSize(text: string, base: KnowledgeBase) {
  const length = text.trim().length;
  if (length === 0) return "Nothing to index yet.";
  const chunks = Math.max(1, Math.ceil(length / base.max_chunk_size));
  return `${length.toLocaleString()} characters · at least ${chunks} chunk${chunks === 1 ? "" : "s"}`;
}

// SourceDraft is one text being written in the Add sources dialog. The key is
// what React lists on, so removing an entry cannot make the one below it inherit
// the removed textarea's state the way an index would.
type SourceDraft = { key: number; title: string; text: string };

// FileDraft is one picked file waiting to be uploaded, with the title it will be
// stored under. The file itself is never read here — it is handed to the server,
// which extracts the text — so this only ever holds the browser's File handle.
type FileDraft = { key: number; file: File; title: string };

// formatFileSize renders a picked file's size for the row that lists it.
function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// AddSourcesModal collects sources and indexes them through POST
// /v1/dashboard/knowledge-base/{id}/sources, either as raw texts or as uploaded
// documents. The server chunks, embeds and upserts inside the request, so the
// dialog stays open — and disabled — until indexing finishes, and closes on a
// knowledge base that already carries the new sources rather than one the caller
// has to poll.
//
// Uploads send the files and nothing else: the browser does not open them, and
// the text that gets indexed is what the server extracted. That is why a PDF or
// a .docx is no harder to add here than a pasted paragraph.
//
// The request is all-or-nothing on the server, which is why nothing here is
// submitted entry by entry: a rejected batch leaves the knowledge base untouched
// and the drafts intact, so fixing the offending entry and retrying is enough.
function AddSourcesModal({
  base,
  getToken,
  onAdded,
  onClose,
}: {
  base: KnowledgeBase;
  getToken: AuthTokenGetter;
  onAdded: (updated: KnowledgeBase, addedCount: number) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [drafts, setDrafts] = useState<SourceDraft[]>([{ key: 0, title: "", text: "" }]);
  const [draftErrors, setDraftErrors] = useState<Record<number, string>>({});
  const [files, setFiles] = useState<FileDraft[]>([]);
  const [fileErrors, setFileErrors] = useState<Record<number, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const nextKey = useRef(1);
  const filePicker = useRef<HTMLInputElement>(null);

  const isFull = drafts.length >= sourceBounds.textsPerRequest;
  // An entry the user added and never typed into is dropped rather than
  // reported: it says nothing about what they meant to index, and the endpoint
  // would reject the whole batch over it.
  const filled = drafts.filter((draft) => draft.title.trim() || draft.text.trim());

  function updateDraft(key: number, patch: Partial<SourceDraft>) {
    setDrafts((current) =>
      current.map((draft) => (draft.key === key ? { ...draft, ...patch } : draft))
    );
    // The message described the value that was just replaced, so it is dropped
    // rather than left pointing at text the field no longer holds.
    setDraftErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function addDraft() {
    if (isFull) return;
    setDrafts((current) => [...current, { key: nextKey.current++, title: "", text: "" }]);
  }

  function removeDraft(key: number) {
    setDrafts((current) =>
      current.length === 1 ? current : current.filter((draft) => draft.key !== key)
    );
  }

  // addFiles takes what the picker or a drop gave us. Anything past the
  // per-request limit is left out rather than silently making the request fail,
  // and the caller is told how many were kept.
  //
  // The list is copied out first, before any state is touched. A FileList is a
  // live view onto the input element, so it empties the moment the input is
  // cleared — reading it inside a state updater, which React runs later, would
  // find nothing there.
  function addFiles(picked: FileList | null) {
    const chosen = picked ? Array.from(picked) : [];
    if (chosen.length === 0) return;

    const room = sourceBounds.filesPerRequest - files.length;
    if (room <= 0) {
      setError(`At most ${sourceBounds.filesPerRequest} files can be indexed in one request.`);
      return;
    }

    const accepted = chosen.slice(0, room);
    setError(
      accepted.length < chosen.length
        ? `Only ${accepted.length} of ${chosen.length} files were added — at most ${sourceBounds.filesPerRequest} fit in one request.`
        : ""
    );

    // Keys are handed out here rather than inside the updater, which React may
    // run more than once.
    const added = accepted.map((file) => ({
      key: nextKey.current++,
      file,
      // Prefilled with the same title the server would derive, so the common
      // case needs no typing and an unusable filename is visibly fixable before
      // the upload rather than after it.
      title: sourceTitleFromFilename(file.name),
    }));
    setFiles((current) => [...current, ...added]);
  }

  function updateFileTitle(key: number, title: string) {
    setFiles((current) => current.map((draft) => (draft.key === key ? { ...draft, title } : draft)));
    setFileErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function removeFile(key: number) {
    setFiles((current) => current.filter((draft) => draft.key !== key));
  }

  // validate mirrors what the endpoint enforces — the title bounds, the
  // characters a vector-store record id allows, and uniqueness within the
  // knowledge base — so a mistake reads as inline feedback instead of a 400 or a
  // 409 after the round trip.
  function validate(entries: SourceDraft[]): Record<number, string> {
    const errors: Record<number, string> = {};
    const seen = new Set<string>();
    const existing = new Set(base.knowledge_base_sources.map((source) => source.title));

    for (const draft of entries) {
      const title = draft.title.trim();
      const titleError = describeInvalidSourceTitle(draft.title);

      if (titleError) {
        errors[draft.key] = titleError;
      } else if (!draft.text.trim()) {
        errors[draft.key] = "Text is required — this is the content that gets indexed.";
      } else if (existing.has(title)) {
        errors[draft.key] = "This knowledge base already has a source with this title.";
      } else if (seen.has(title)) {
        errors[draft.key] = "Another entry below already uses this title.";
      }

      seen.add(title);
    }

    return errors;
  }

  // validateFiles mirrors what the endpoint enforces for an upload: a format it
  // can read, a size it accepts, and a storable title unique to the knowledge
  // base. Whether a readable file actually holds any text is not decided here —
  // the server is the one that opens it.
  function validateFiles(entries: FileDraft[]): Record<number, string> {
    const errors: Record<number, string> = {};
    const seen = new Set<string>();
    const existing = new Set(base.knowledge_base_sources.map((source) => source.title));

    for (const draft of entries) {
      const title = draft.title.trim();
      const unreadable = describeUnreadableFile(draft.file);
      const titleError = describeInvalidSourceTitle(draft.title);

      if (unreadable) {
        errors[draft.key] = unreadable;
      } else if (titleError) {
        errors[draft.key] = titleError;
      } else if (existing.has(title)) {
        errors[draft.key] = "This knowledge base already has a source with this title.";
      } else if (seen.has(title)) {
        errors[draft.key] = "Another file already uses this title.";
      }

      seen.add(title);
    }

    return errors;
  }

  // applyFieldErrors puts the server's per-entry errors back on the entries they
  // came from, rather than summarising them at the bottom of a dialog that can be
  // scrolled away from the offending row. The field name carries the index the
  // entry was sent under, which is what maps it back to a draft key.
  function applyFieldErrors<T extends { key: number }>(
    fieldErrors: FieldError[],
    sent: T[],
    pattern: RegExp,
    setPerEntry: (errors: Record<number, string>) => void
  ) {
    const perEntry: Record<number, string> = {};
    const rest: string[] = [];
    for (const fieldError of fieldErrors) {
      const index = Number(pattern.exec(fieldError.field)?.[1] ?? NaN);
      const entry = sent[index];
      if (entry) {
        perEntry[entry.key] = fieldError.message;
      } else {
        rest.push(`${fieldError.field}: ${fieldError.message}`);
      }
    }
    setPerEntry(perEntry);
    setError(rest.join(" · ") || "Fix the highlighted entries before indexing.");
  }

  async function submit() {
    if (isSaving) return;
    if (mode === "file") {
      await submitFiles();
      return;
    }
    if (filled.length === 0) return;

    const errors = validate(filled);
    if (Object.keys(errors).length > 0) {
      setDraftErrors(errors);
      setError("Fix the highlighted entries before indexing.");
      return;
    }

    setIsSaving(true);
    setDraftErrors({});
    setError("");
    try {
      const updated = await apiAddKnowledgeBaseSources(
        base.knowledge_base_id,
        filled.map((draft) => ({ title: draft.title, text: draft.text })),
        getToken
      );
      onAdded(fromApi(updated), filled.length);
    } catch (err) {
      if (err instanceof KnowledgeBaseError && err.fieldErrors.length > 0) {
        applyFieldErrors(err.fieldErrors, filled, /^knowledge_base_texts\[(\d+)\]/, setDraftErrors);
      } else {
        setError(err instanceof Error ? err.message : "Failed to add sources");
      }
    } finally {
      setIsSaving(false);
    }
  }

  // submitFiles uploads the picked documents. The files go up as they are and the
  // server does the reading, so this waits out extraction, chunking, embedding
  // and the upsert in one request — which is why the whole dialog is disabled
  // while it runs.
  async function submitFiles() {
    if (files.length === 0) return;

    const errors = validateFiles(files);
    if (Object.keys(errors).length > 0) {
      setFileErrors(errors);
      setError("Fix the highlighted files before indexing.");
      return;
    }

    setIsSaving(true);
    setFileErrors({});
    setError("");
    try {
      const updated = await apiAddKnowledgeBaseFileSources(
        base.knowledge_base_id,
        files.map((draft) => ({ file: draft.file, title: draft.title })),
        getToken
      );
      onAdded(fromApi(updated), files.length);
    } catch (err) {
      if (err instanceof KnowledgeBaseError && err.fieldErrors.length > 0) {
        applyFieldErrors(err.fieldErrors, files, /^files\[(\d+)\]/, setFileErrors);
      } else {
        setError(err instanceof Error ? err.message : "Failed to upload files");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="kb-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        aria-labelledby="kb-sources-title"
        aria-modal="true"
        className="kb-modal kb-modal-wide"
        role="dialog"
      >
        <h2 className="kb-modal-title" id="kb-sources-title">
          Add sources
        </h2>
        <p className="kb-modal-copy">
          {mode === "text" ? "Each text" : "Each file's text"} is split into chunks of{" "}
          <strong>
            {base.min_chunk_size}–{base.max_chunk_size}
          </strong>{" "}
          characters, embedded and written into{" "}
          <strong>{base.namespace_id ?? "this knowledge base's namespace"}</strong> under its title.{" "}
          {mode === "file"
            ? "The text is extracted on the server — nothing is read in your browser. "
            : ""}
          Indexing runs while you wait, and either all of these land or none of them do.
        </p>

        <div className="kb-tabs" role="tablist">
          <button
            aria-selected={mode === "text"}
            className={`kb-tab${mode === "text" ? " is-active" : ""}`}
            disabled={isSaving}
            onClick={() => {
              setMode("text");
              setError("");
            }}
            role="tab"
            type="button"
          >
            Raw text
          </button>
          <button
            aria-selected={mode === "file"}
            className={`kb-tab${mode === "file" ? " is-active" : ""}`}
            disabled={isSaving}
            onClick={() => {
              setMode("file");
              setError("");
            }}
            role="tab"
            type="button"
          >
            Upload files
          </button>
        </div>

        {mode === "file" ? (
          <div className="kb-modal-body">
            <input
              accept={fileExtensions.join(",")}
              className="kb-file-input"
              disabled={isSaving}
              multiple
              onChange={(event) => {
                addFiles(event.target.files);
                // Cleared so picking the same file again still fires a change.
                event.target.value = "";
              }}
              ref={filePicker}
              type="file"
            />
            <button
              className={`kb-dropzone${isDragging ? " is-dragging" : ""}`}
              disabled={isSaving || files.length >= sourceBounds.filesPerRequest}
              onClick={() => filePicker.current?.click()}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(event) => {
                event.preventDefault();
                if (!isSaving) setIsDragging(true);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                if (!isSaving) addFiles(event.dataTransfer.files);
              }}
              type="button"
            >
              <Icon name="file" size={20} />
              <span className="kb-dropzone-title">
                {files.length >= sourceBounds.filesPerRequest
                  ? `${sourceBounds.filesPerRequest} files is the limit for one request`
                  : "Drop files here, or click to choose"}
              </span>
              <span className="kb-dropzone-hint">
                {fileExtensions.join(" · ")} — up to{" "}
                {Math.round(sourceBounds.fileBytes / (1024 * 1024))} MB each,{" "}
                {sourceBounds.filesPerRequest} per request.
              </span>
            </button>

            {files.map((draft) => {
              const fileError = fileErrors[draft.key];

              return (
                <div className={`kb-file${fileError ? " is-invalid" : ""}`} key={draft.key}>
                  <div className="kb-file-head">
                    <span className="kb-source-icon is-file">
                      <Icon name="file" size={16} />
                    </span>
                    <div className="kb-file-body">
                      <div className="kb-file-name">{draft.file.name}</div>
                      <div className="kb-file-meta">{formatFileSize(draft.file.size)}</div>
                    </div>
                    <span className="kb-file-spacer" />
                    <button
                      aria-label={`Remove ${draft.file.name}`}
                      className="kb-icon-button is-danger"
                      disabled={isSaving}
                      onClick={() => removeFile(draft.key)}
                      title="Remove this file from the upload"
                      type="button"
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                  <label className="kb-field">
                    <span className="kb-field-label">Title</span>
                    <input
                      className="kb-input"
                      disabled={isSaving}
                      maxLength={sourceBounds.titleLength}
                      onChange={(event) => updateFileTitle(draft.key, event.target.value)}
                      placeholder={draft.file.name}
                      value={draft.title}
                    />
                    <span className="kb-field-hint">
                      Stored under this name and used verbatim as the record id in the vector store,
                      so it has to be printable ASCII without “#”, and unique in this knowledge base.
                    </span>
                  </label>
                  {fileError ? (
                    <div className="kb-draft-error" role="alert">
                      {fileError}
                    </div>
                  ) : null}
                </div>
              );
            })}

            {files.length > 0 ? (
              <div className="kb-draft-footer">
                <span className="kb-field-hint">
                  {files.length}/{sourceBounds.filesPerRequest} files
                </span>
                <button
                  className="kb-btn"
                  disabled={isSaving}
                  onClick={() => {
                    setFiles([]);
                    setFileErrors({});
                    setError("");
                  }}
                  type="button"
                >
                  Clear all
                </button>
              </div>
            ) : null}

            {error ? (
              <div className="kb-form-error" role="alert">
                {error}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="kb-modal-body">
            {drafts.map((draft, index) => {
              const draftError = draftErrors[draft.key];

              return (
                <div className={`kb-draft${draftError ? " is-invalid" : ""}`} key={draft.key}>
                  <div className="kb-draft-head">
                    <span className="kb-draft-index">Text {index + 1}</span>
                    <button
                      aria-label={`Remove text ${index + 1}`}
                      className="kb-icon-button is-danger"
                      disabled={isSaving || drafts.length === 1}
                      onClick={() => removeDraft(draft.key)}
                      title={
                        drafts.length === 1
                          ? "At least one text is required"
                          : "Remove this text from the request"
                      }
                      type="button"
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                  <label className="kb-field">
                    <span className="kb-field-label">Title</span>
                    <input
                      autoFocus={index === 0}
                      className="kb-input"
                      disabled={isSaving}
                      maxLength={sourceBounds.titleLength}
                      onChange={(event) => updateDraft(draft.key, { title: event.target.value })}
                      placeholder="Refund policy"
                      value={draft.title}
                    />
                    <span className="kb-field-hint">
                      Used verbatim as the record id in the vector store, so it has to be printable
                      ASCII without “#”, and unique in this knowledge base.
                    </span>
                  </label>
                  <label className="kb-field">
                    <span className="kb-field-label">Text</span>
                    <textarea
                      className="kb-textarea"
                      disabled={isSaving}
                      onChange={(event) => updateDraft(draft.key, { text: event.target.value })}
                      placeholder="Paste the content your agents should be able to quote…"
                      value={draft.text}
                    />
                    <span className="kb-field-hint">{describeDraftSize(draft.text, base)}</span>
                  </label>
                  {draftError ? (
                    <div className="kb-draft-error" role="alert">
                      {draftError}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <div className="kb-draft-footer">
              <button
                className="kb-btn"
                disabled={isSaving || isFull}
                onClick={addDraft}
                title={isFull ? `At most ${sourceBounds.textsPerRequest} texts per request` : undefined}
                type="button"
              >
                <Icon name="plus" size={15} />
                Add another text
              </button>
              <span className="kb-field-hint">
                {drafts.length}/{sourceBounds.textsPerRequest} texts
              </span>
            </div>

            {error ? (
              <div className="kb-form-error" role="alert">
                {error}
              </div>
            ) : null}
          </div>
        )}
        <div className="kb-modal-actions">
          <button className="kb-btn" disabled={isSaving} onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="kb-btn kb-btn-primary"
            disabled={isSaving || (mode === "file" ? files.length === 0 : filled.length === 0)}
            onClick={submit}
            type="button"
          >
            {isSaving
              ? mode === "file"
                ? "Extracting and indexing…"
                : "Indexing…"
              : mode === "file"
                ? `Index ${files.length} file${files.length === 1 ? "" : "s"}`
                : `Index ${filled.length || drafts.length} text${(filled.length || drafts.length) === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ConfigPanel edits the indexing settings of one knowledge base through PATCH
// /v1/dashboard/knowledge-base/{id}. It is mounted with the base id as its key,
// so selecting another knowledge base remounts it with that row's values instead
// of carrying an unsaved draft across.
function ConfigPanel({
  base,
  getToken,
  onSaved,
  onNotice,
}: {
  base: KnowledgeBase;
  getToken: AuthTokenGetter;
  onSaved: (updated: KnowledgeBase) => void;
  onNotice: (kind: Notice["kind"], text: string) => void;
}) {
  const [maxChunkSize, setMaxChunkSize] = useState(base.max_chunk_size);
  const [minChunkSize, setMinChunkSize] = useState(base.min_chunk_size);
  const [autoRefresh, setAutoRefresh] = useState(base.enable_auto_refresh);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isDirty =
    maxChunkSize !== base.max_chunk_size ||
    minChunkSize !== base.min_chunk_size ||
    autoRefresh !== base.enable_auto_refresh;

  function reset() {
    setMaxChunkSize(base.max_chunk_size);
    setMinChunkSize(base.min_chunk_size);
    setAutoRefresh(base.enable_auto_refresh);
    setError("");
  }

  async function save() {
    if (!isDirty || isSaving) return;
    if (minChunkSize > maxChunkSize) {
      setError("Min chunk size must not be greater than max chunk size.");
      return;
    }

    // Only the changed settings are sent: the endpoint is a partial update, and
    // leaving a field out keeps whatever the server has.
    const payload: UpdateKnowledgeBasePayload = {};
    if (maxChunkSize !== base.max_chunk_size) payload.max_chunk_size = maxChunkSize;
    if (minChunkSize !== base.min_chunk_size) payload.min_chunk_size = minChunkSize;
    if (autoRefresh !== base.enable_auto_refresh) payload.enable_auto_refresh = autoRefresh;

    setIsSaving(true);
    setError("");
    try {
      const updated = await apiUpdateKnowledgeBase(base.knowledge_base_id, payload, getToken);
      onSaved(fromApi(updated));
      onNotice("success", "Indexing configuration saved");
    } catch (err) {
      const fieldMessage =
        err instanceof KnowledgeBaseError && err.fieldErrors.length > 0
          ? err.fieldErrors.map((item) => `${item.field}: ${item.message}`).join(" · ")
          : "";
      setError(
        fieldMessage || (err instanceof Error ? err.message : "Failed to save configuration")
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <aside className="kb-card kb-config-column" aria-label="Indexing configuration">
      <div className="kb-config-head">
        <h3 className="kb-config-title">Indexing configuration</h3>
        <div className="kb-config-copy">
          Chunking controls how documents are split before retrieval. Changes apply to sources
          indexed from here on; anything already indexed keeps its current chunks.
        </div>
      </div>
      <div className="kb-config-body">
        <label className="kb-field">
          <span className="kb-field-label">Max chunk size · {maxChunkSize}</span>
          <input
            className="kb-range"
            disabled={isSaving}
            max={chunkBounds.maxUpper}
            min={chunkBounds.maxLower}
            onChange={(event) => setMaxChunkSize(Number(event.target.value))}
            step={100}
            type="range"
            value={maxChunkSize}
          />
          <span className="kb-field-hint">
            {chunkBounds.maxLower}–{chunkBounds.maxUpper} characters. Larger chunks keep more
            context together.
          </span>
        </label>
        <label className="kb-field">
          <span className="kb-field-label">Min chunk size · {minChunkSize}</span>
          <input
            className="kb-range"
            disabled={isSaving}
            max={chunkBounds.minUpper}
            min={chunkBounds.minLower}
            onChange={(event) => setMinChunkSize(Number(event.target.value))}
            step={50}
            type="range"
            value={minChunkSize}
          />
          <span className="kb-field-hint">
            {chunkBounds.minLower}–{chunkBounds.minUpper} characters, and never above the max.
          </span>
        </label>
        <div className="kb-toggle-row">
          <span>
            <div className="kb-field-label">Auto refresh</div>
            <div className="kb-field-hint">Re-scrape URL sources every 12 hours.</div>
          </span>
          <button
            aria-label="Toggle auto refresh"
            aria-pressed={autoRefresh}
            className={`kb-switch${autoRefresh ? " is-on" : ""}`}
            disabled={isSaving}
            onClick={() => setAutoRefresh((current) => !current)}
            type="button"
          >
            <span />
          </button>
        </div>
        {error ? (
          <div className="kb-form-error" role="alert">
            {error}
          </div>
        ) : null}
        <div className="kb-config-actions">
          <button
            className="kb-btn"
            disabled={!isDirty || isSaving}
            onClick={reset}
            type="button"
          >
            Reset
          </button>
          <button
            className="kb-btn kb-btn-primary"
            disabled={!isDirty || isSaving}
            onClick={save}
            type="button"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
        <div className="kb-field">
          <span className="kb-field-label">Attached agents</span>
          <div className="kb-source-meta" style={{ marginTop: 0 }}>
            <span className="kb-pill kb-pill-neutral">
              <Icon name="agents" size={13} />
              rio
            </span>
            <span className="kb-pill kb-pill-neutral">+ Attach agent</span>
          </div>
          <span className="kb-field-hint">
            Agents with this knowledge base attached can quote it during calls.
          </span>
        </div>
      </div>
    </aside>
  );
}

function StatusPill({ status }: { status: KnowledgeBaseStatus }) {
  return (
    <span className={`kb-pill kb-pill-${status}`}>
      <span className="kb-dot" />
      {statusLabels[status]}
    </span>
  );
}

function Sidebar({ activeLabel, count }: { activeLabel: string; count: number }) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const { mode } = useWorkspaceMode();

  return (
    <aside className="kb-sidebar">
      <div className="kb-logo">
        <div className="kb-logo-mark">
          <Icon name="spark" size={18} stroke="#fff" sw={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.3px" }}>Voca</div>
          <div style={{ color: "var(--app-subtle)", fontSize: 11, fontWeight: 500, marginTop: -1 }}>
            AI Voice Agents
          </div>
        </div>
      </div>
      <div className="kb-nav-kicker">Menu</div>
      <nav className="kb-nav" aria-label="Dashboard navigation">
        {navItemsForMode(mode).map((item) => {
          const content = (
            <>
              <span style={{ display: "flex", justifyContent: "center", width: 18 }}>
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
              {item.badge || item.label === "Knowledge Base" ? (
                <span className="kb-nav-badge">
                  {item.label === "Knowledge Base" ? count : item.badge}
                </span>
              ) : null}
            </>
          );
          const className = `kb-nav-item${item.label === activeLabel ? " is-active" : ""}`;

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
      <div className="kb-sidebar-footer">
        <WorkspaceModeToggle />
        <ThemeToggle />
        <div className="kb-user-card">
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span style={{ minWidth: 0 }}>
            <div className="kb-user-name">{user?.fullName || user?.username || "Account"}</div>
            <div className="kb-user-email">{user?.primaryEmailAddress?.emailAddress ?? ""}</div>
          </span>
        </div>
      </div>
    </aside>
  );
}
