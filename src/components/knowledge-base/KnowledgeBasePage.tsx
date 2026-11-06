"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "motion/react";
import ExpandableCardDemoStandard from "@/components/expandable-card-demo-standard";
import {
  useWorkspaceMode,
} from "@/components/nav/workspaceMode";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import {
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
  KnowledgeBaseError,
  type ApiKnowledgeBase,
  type KnowledgeBase,
  type KnowledgeBaseSource,
} from "@/lib/knowledgeBases";
import type { AuthTokenGetter } from "@/lib/api";
import { useCachedState } from "@/lib/pageCache";

// Every knowledge base shown here comes from the server: the list is loaded
// from GET /v1/dashboard/knowledge-base, the config panel saves through PATCH,
// the trash buttons remove through DELETE — the knowledge base itself, or one of
// its sources with its vectors — and KnowledgeBaseDialog creates through POST and
// indexes through POST .../sources, either raw texts as JSON or documents as a
// multipart upload the server extracts the text from. Only refreshing has no
// endpoint, so that one control stays disabled rather than pretending to
// re-scrape.

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
  | "menu"
  | "refresh"
  | "file"
  | "text"
  | "type"
  | "upload"
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
    case "menu":
      return <path d="M4 6h16M4 12h16M4 18h16" />;
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
    case "type":
      return <path d="M5 7V5h14v2M12 5v14M9 19h6" />;
    case "upload":
      return <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" />;
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
.kb-main { display: flex; flex: 1; flex-direction: column; min-width: 0; }
.kb-content { flex: 1 1 auto; min-width: 0; padding: 24px 32px 32px; }
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
.kb-detail-grid { align-items: start; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr); }
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
  grid-template-areas: "avatar identity stats time status chevron";
  grid-template-columns: 36px minmax(180px, 1.2fr) minmax(160px, .9fr) auto auto 18px;
  padding: 13px 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.kb-row:hover { background: var(--panel-hover); border-color: var(--app-primary-ring); box-shadow: 0 6px 18px var(--app-shadow-soft); }
.kb-row:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.kb-row > .kb-avatar { grid-area: avatar; }
.kb-row > .kb-pill { grid-area: status; justify-self: end; }
.kb-row-identity { display: grid; gap: 3px; grid-area: identity; min-width: 0; }
.kb-row-name { font-size: 14px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-row-sub { color: var(--subtle); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-row-stats { align-items: center; color: var(--subtle); display: flex; flex-wrap: wrap; font-size: 11.5px; gap: 8px; grid-area: stats; min-width: 0; }
.kb-row-stat { align-items: center; display: inline-flex; gap: 5px; white-space: nowrap; }
.kb-row-time { align-items: center; color: var(--subtle); display: inline-flex; font-size: 11.5px; gap: 5px; grid-area: time; white-space: nowrap; }
.kb-row-chevron { color: var(--faint); display: inline-flex; grid-area: chevron; transition: color .18s ease, transform .18s ease; }
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
.kb-file-input { display: none; }
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
.kb-add-modal {
  background: var(--surface);
  border-radius: 14px;
  max-width: 840px;
  overflow: visible; /* the Add menu may hang past the bottom edge */
  padding: 16px;
}
.kb-add-modal.is-dragging { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring), 0 30px 80px var(--app-shadow-color-strong); }
.kb-add-text-modal { max-width: 640px; overflow-y: auto; }
.kb-add-head { align-items: center; display: flex; gap: 12px; justify-content: space-between; min-height: 28px; }
.kb-add-title { font-size: 16px; font-weight: 600; letter-spacing: -.1px; margin: 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-add-close {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
}
.kb-add-close:hover:not(:disabled) { background: var(--app-hover); color: var(--text); }
.kb-add-close:disabled { cursor: not-allowed; opacity: .5; }
.kb-add-body { display: grid; gap: 20px; margin-top: 14px; }
.kb-add-field { display: grid; gap: 6px; min-width: 0; }
.kb-add-label { color: var(--text); font-size: 14px; font-weight: 500; }
.kb-add-input { background: var(--surface); border-radius: 8px; font-size: 14px; height: 34px; }
.kb-add-textarea { background: var(--surface); border-radius: 8px; font-size: 14px; min-height: 220px; }
.kb-add-picker { position: relative; width: fit-content; }
.kb-add-btn {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--app-border-strong);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 500;
  gap: 6px;
  height: 34px;
  justify-content: center;
  padding: 0 12px;
  transition: background .16s ease;
  white-space: nowrap;
}
.kb-add-btn:hover:not(:disabled) { background: var(--app-hover); }
.kb-add-btn:disabled { cursor: not-allowed; opacity: .6; }
.kb-add-save { background: var(--primary); border-color: transparent; color: var(--app-on-accent); }
.kb-add-save:hover:not(:disabled) { background: var(--primary); filter: brightness(1.06); }
.kb-add-save:disabled { background: var(--app-hover-2); color: var(--faint); opacity: 1; }
.kb-add-menu {
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 14px;
  box-shadow: 0 12px 32px var(--app-shadow-color);
  left: 0;
  padding: 5px;
  position: absolute;
  top: calc(100% + 8px);
  width: 240px;
  z-index: 10;
}
.kb-add-menu-item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  gap: 8px;
  height: 32px;
  padding: 0 8px;
  text-align: left;
  width: 100%;
}
.kb-add-menu-item:hover:not(:disabled) { background: var(--app-hover); }
.kb-add-menu-item:disabled { cursor: not-allowed; opacity: .5; }
.kb-add-menu-hint { color: var(--subtle); font-size: 12px; font-weight: 400; margin-left: auto; }
.kb-add-hint { color: var(--subtle); font-size: 14px; margin: 36px 0 0; }
.kb-add-docs { display: grid; gap: 6px; list-style: none; margin: 8px 0 0; max-height: min(240px, 32vh); overflow-y: auto; padding: 0; }
.kb-add-doc { border: 1px solid var(--border); border-radius: 8px; min-width: 0; }
.kb-add-doc.is-invalid { border-color: var(--app-rose-border); }
.kb-add-doc-row { align-items: center; color: var(--subtle); display: flex; gap: 8px; min-height: 36px; padding: 0 4px 0 10px; }
.kb-add-doc-row > svg { flex-shrink: 0; }
.kb-add-doc-name {
  background: none;
  border: 0;
  color: var(--text);
  font-size: 13.5px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  padding: 0;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.kb-add-doc-name.is-editable { cursor: pointer; }
.kb-add-doc-name.is-editable:hover:not(:disabled) { text-decoration: underline; }
.kb-add-doc-meta { flex-shrink: 0; font-size: 12px; margin-left: auto; padding-left: 8px; white-space: nowrap; }
.kb-add-doc-remove {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
}
.kb-add-doc-remove:hover:not(:disabled) { background: var(--app-rose-soft-2); color: var(--app-rose-text); }
.kb-add-doc-remove:disabled { cursor: not-allowed; opacity: .5; }
.kb-add-doc-error { color: var(--app-rose-text); font-size: 12px; font-weight: 600; line-height: 1.45; padding: 0 10px 8px; }
.kb-add-actions { align-items: center; display: flex; gap: 8px; justify-content: flex-end; margin-top: 18px; }
.kb-add-progress { color: var(--subtle); font-size: 12.5px; margin-right: auto; }
/* The mobile top bar and drawer backdrop only exist below the tablet breakpoint. */
/* Wide screens: a little more room around the capped content. */
@media (min-width: 1680px) {
  .kb-content { padding: 28px 40px 36px; }
}
/* Laptops: the refresh time goes and the stats fold under the name. */
@media (max-width: 1240px) {
  .kb-detail-grid { grid-template-columns: minmax(0, 1fr); }
  .kb-row { gap: 8px 14px; grid-template-areas: "avatar identity status chevron" "avatar stats stats chevron"; grid-template-columns: 36px minmax(0, 1fr) auto 18px; }
  .kb-row-time { display: none; }
}
@media (max-width: 1100px) {
  .kb-content { padding: 20px 20px 28px; }
  .expandable-card-stage { padding: 16px; }
  .kb-expandable-card { max-height: min(820px, calc(100dvh - 32px)); }
}
/* Tablets and phones: the sidebar becomes a drawer behind a sticky top bar. */
@media (max-width: 900px) {
  .kb-shell { display: block; min-height: 100dvh; max-width: 100%; width: 100%; }
  .kb-content { padding: 16px; }
  .kb-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
}
/* Phones: search on its own line, one column, full-screen detail card and
   bottom-sheet dialogs. */
@media (max-width: 640px) {
  .kb-content { padding: 12px 12px calc(16px + env(safe-area-inset-bottom)); }
  .kb-toolbar { gap: 8px; }
  .kb-toolbar .kb-search { flex: 1 1 100%; max-width: none; }
  .kb-count { margin-left: 0; margin-right: auto; order: 2; }
  .kb-view-toggle { order: 3; }
  .kb-toolbar-new { order: 4; }
  .kb-input, .kb-shell textarea, .kb-shell select { font-size: 16px; } /* stops iOS zooming on focus */
  .kb-grid { grid-template-columns: 1fr; }
  .kb-card-item { min-height: 0; }
  .kb-card-item:hover { transform: none; }
  .kb-detail-head { padding: 14px; }
  .kb-detail-actions { width: 100%; }
  .kb-detail-actions .kb-btn { flex: 1; }
  .kb-row { gap: 8px 10px; grid-template-areas: "avatar identity status" "avatar stats stats"; grid-template-columns: 36px minmax(0, 1fr) auto; padding: 12px; }
  .kb-row-chevron { display: none; }
  .expandable-card-stage { align-items: stretch; padding: 0; }
  .kb-expandable-card { border: 0; border-radius: 0; height: 100dvh; max-height: 100dvh; max-width: none; padding: 12px 12px calc(12px + env(safe-area-inset-bottom)); }
  .kb-modal-overlay { align-items: flex-end; padding: 0; }
  .kb-modal { border-radius: 18px 18px 0 0; max-height: calc(100dvh - 24px); max-width: none; padding: 20px 16px calc(16px + env(safe-area-inset-bottom)); }
  .kb-modal-actions { flex-direction: column-reverse; }
  .kb-modal-actions > * { width: 100%; }
  .kb-toast { bottom: calc(16px + env(safe-area-inset-bottom)); max-width: calc(100vw - 24px); width: max-content; }
}
@media (max-width: 400px) {
  .kb-row { grid-template-columns: 32px minmax(0, 1fr) auto; }
  .kb-row > .kb-avatar { height: 32px; width: 32px; }
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
  const [bases, setBases, hasCachedBases] = useCachedState<KnowledgeBase[]>("knowledge-base-page:bases", []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [viewModeOverride, setViewModeOverride] = useState<BrowseView | null>(null);
  const [isCreating, setIsCreating] = useState(false);
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
  // Bases cached from an earlier visit stay on screen while they refetch.
  const pendingLoadState = !isAuthLoaded ? "loading" : authError ? "error" : loadState;
  const effectiveLoadState = pendingLoadState === "loading" && hasCachedBases ? "ready" : pendingLoadState;
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
  }, [getToken, isAuthLoaded, isSignedIn, reloadKey, setBases]);

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
    if (isAuthLoaded && !isSignedIn) {
      flash("error", "Sign in to create a knowledge base.");
      return;
    }
    setIsCreating(true);
  }

  return (
    <div className={`kb-shell${mode === "chat" ? " app-accent-green" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <DashboardSidebar activeLabel="Knowledge Base" badges={{ "Knowledge Base": bases.length }} stackBelow={900} />

      <main className="kb-main">
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
                <button
                  aria-label="New knowledge base"
                  className="kb-btn kb-btn-primary kb-toolbar-new"
                  onClick={openCreate}
                  type="button"
                >
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
        <KnowledgeBaseDialog
          base={null}
          getToken={getToken}
          onClose={() => setIsCreating(false)}
          onSaved={(created) => {
            setBases((current) => [created, ...current]);
            setSelectedId(created.knowledge_base_id);
            setIsCreating(false);
            flash("success", `Knowledge base "${created.knowledge_base_name}" created`);
          }}
        />
      ) : null}

      {isAddingSources && selected ? (
        <KnowledgeBaseDialog
          base={selected}
          getToken={getToken}
          key={selected.knowledge_base_id}
          onClose={() => setIsAddingSources(false)}
          onPartial={applyUpdatedBase}
          onSaved={(updated, addedCount) => {
            applyUpdatedBase(updated);
            setIsAddingSources(false);
            flash(
              "success",
              `${addedCount} source${addedCount === 1 ? "" : "s"} indexed into "${updated.knowledge_base_name}"`
            );
          }}
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

// DocumentDraft is one text or file waiting in the dialog. The key is what React
// lists on and what a server error is mapped back to. A file is never read here:
// it is handed to the server, which extracts the text.
type TextDraft = { key: number; kind: "text"; title: string; text: string };
type FileDraft = { key: number; kind: "file"; title: string; file: File };
type DocumentDraft = TextDraft | FileDraft;

// TextEditor is the open Add text dialog. A null key means a new text rather
// than an edit of one already listed.
type TextEditor = { key: number | null; title: string; text: string; error: string };

// formatFileSize renders a picked file's size for the row that lists it.
function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// uniqueTitle numbers a filename-derived title that is already taken. Rows have
// nowhere to edit a file's title, and titles must be unique per knowledge base.
// It also matters for non-Latin filenames, which all sanitise to the same few
// characters: two Bangla PDFs would otherwise both become ".pdf".
function uniqueTitle(title: string, taken: Set<string>) {
  if (!taken.has(title)) return title;
  const dot = title.lastIndexOf(".");
  const stem = dot > 0 ? title.slice(0, dot) : title;
  const extension = dot > 0 ? title.slice(dot) : "";
  for (let n = 2; ; n++) {
    const suffix = ` (${n})`;
    const room = sourceBounds.titleLength - suffix.length - extension.length;
    const candidate = `${stem.slice(0, room)}${suffix}${extension}`;
    if (!taken.has(candidate)) return candidate;
  }
}

// KnowledgeBaseDialog collects a name and documents for a new knowledge base, or,
// given a base, only documents to add to it. At least one text or file is
// required either way, so the dashboard cannot create an empty knowledge base.
//
// The server chunks, embeds and upserts inside each request, so the dialog stays
// open and disabled until indexing finishes. Texts and files travel separately
// because the endpoints take them separately, and that decides failure handling:
//
//  - Creating: the texts go with the create, which the server keeps atomic, and
//    the files follow. If the files fail, the new base is deleted so nothing half
//    filled is left and the same name can be retried.
//  - Adding: the base is not this dialog's to delete. If the files fail after the
//    texts landed, the landed rows leave the list and only the files are retried.
function KnowledgeBaseDialog({
  base,
  getToken,
  onClose,
  onPartial,
  onSaved,
}: {
  base: KnowledgeBase | null;
  getToken: AuthTokenGetter;
  onClose: () => void;
  onPartial?: (updated: KnowledgeBase) => void;
  onSaved: (saved: KnowledgeBase, addedCount: number) => void;
}) {
  const [name, setName] = useState("");
  const [documents, setDocuments] = useState<DocumentDraft[]>([]);
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
  const [textEditor, setTextEditor] = useState<TextEditor | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const nextKey = useRef(0);
  const filePicker = useRef<HTMLInputElement>(null);
  const picker = useRef<HTMLDivElement>(null);

  const texts = documents.filter((entry): entry is TextDraft => entry.kind === "text");
  const files = documents.filter((entry): entry is FileDraft => entry.kind === "file");
  const canSave = !isSaving && documents.length > 0 && (base !== null || name.trim() !== "");
  // A stray click or Escape must not throw away typed names or pasted text, so
  // only Cancel and the X close the dialog once something has been entered.
  const hasEntries = name.trim() !== "" || documents.length > 0;

  useEffect(() => {
    if (!isMenuOpen) return;
    function onMouseDown(event: MouseEvent) {
      if (!picker.current?.contains(event.target as Node)) setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isMenuOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || isSaving) return;
      if (textEditor) {
        if (!textEditor.title.trim() && !textEditor.text.trim()) setTextEditor(null);
      } else if (isMenuOpen) {
        setIsMenuOpen(false);
      } else if (!hasEntries) {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasEntries, isMenuOpen, isSaving, onClose, textEditor]);

  function takenTitles(exceptKey: number | null = null) {
    return new Set([
      ...(base?.knowledge_base_sources ?? []).map((source) => source.title),
      ...documents.filter((entry) => entry.key !== exceptKey).map((entry) => entry.title.trim()),
    ]);
  }

  function clearRowError(key: number) {
    setRowErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  // addFiles takes what the picker or a drop handed over. The FileList is a live
  // view onto the input, which empties when the input is cleared, so it is copied
  // out before anything else. A file the server could not read is refused here
  // and named; anything past the per-request limit is left out and reported.
  function addFiles(picked: FileList | null) {
    const chosen = picked ? Array.from(picked) : [];
    if (chosen.length === 0) return;

    const taken = takenTitles();
    const added: FileDraft[] = [];
    const problems: string[] = [];
    let room = sourceBounds.filesPerRequest - files.length;
    let leftOut = 0;

    for (const file of chosen) {
      const unreadable = describeUnreadableFile(file);
      const isRepeat = files.some(
        (entry) =>
          entry.file.name === file.name &&
          entry.file.size === file.size &&
          entry.file.lastModified === file.lastModified
      );
      if (unreadable) {
        problems.push(`${file.name}: ${unreadable}`);
      } else if (isRepeat) {
        continue;
      } else if (room <= 0) {
        leftOut++;
      } else {
        const title = uniqueTitle(sourceTitleFromFilename(file.name), taken);
        taken.add(title);
        added.push({ key: nextKey.current++, kind: "file", title, file });
        room--;
      }
    }

    if (leftOut > 0) {
      problems.push(
        `${leftOut} file${leftOut === 1 ? " was" : "s were"} left out: at most ${sourceBounds.filesPerRequest} can be added at once.`
      );
    }
    setError(problems.join(" "));
    setDocuments((current) => [...current, ...added]);
  }

  function removeDocument(key: number) {
    setDocuments((current) => current.filter((entry) => entry.key !== key));
    clearRowError(key);
  }

  // saveText mirrors what the endpoint enforces on a title, so a mistake reads as
  // feedback in the dialog where it can be fixed rather than as a failed save.
  function saveText() {
    if (!textEditor) return;
    const title = textEditor.title.trim();
    const text = textEditor.text.trim();
    const problem =
      describeInvalidSourceTitle(title) ||
      (text ? "" : "Text is required.") ||
      (takenTitles(textEditor.key).has(title) ? "Another document already uses this title." : "");
    if (problem) {
      setTextEditor({ ...textEditor, error: problem });
      return;
    }

    const { key } = textEditor;
    if (key === null) {
      const draft: TextDraft = { key: nextKey.current++, kind: "text", title, text };
      setDocuments((current) => [...current, draft]);
    } else {
      setDocuments((current) =>
        current.map((entry) => (entry.key === key ? { key, kind: "text", title, text } : entry))
      );
      clearRowError(key);
    }
    setError("");
    setTextEditor(null);
  }

  // showSaveError puts the server's per-entry errors back on the rows they came
  // from: the field name carries the index the entry was sent under.
  function showSaveError(err: unknown) {
    if (!(err instanceof KnowledgeBaseError) || err.fieldErrors.length === 0) {
      setError(err instanceof Error ? err.message : "Failed to save");
      return;
    }
    const perRow: Record<number, string> = {};
    const rest: string[] = [];
    for (const { field, message } of err.fieldErrors) {
      const match = /^(knowledge_base_texts|files)\[(\d+)\]/.exec(field);
      const row = match ? (match[1] === "files" ? files : texts)[Number(match[2])] : undefined;
      if (row) perRow[row.key] = message;
      else rest.push(message);
    }
    setRowErrors(perRow);
    setError(rest.join(" · ") || "Fix the highlighted documents, then save again.");
  }

  async function save() {
    if (!canSave) return;

    const textEntries = texts.map(({ title, text }) => ({ title, text }));
    const fileEntries = files.map(({ file, title }) => ({ file, title }));

    setIsSaving(true);
    setRowErrors({});
    setError("");
    try {
      if (base) {
        let saved = base;
        if (textEntries.length > 0) {
          saved = fromApi(
            await apiAddKnowledgeBaseSources(base.knowledge_base_id, textEntries, getToken)
          );
          if (fileEntries.length > 0) {
            onPartial?.(saved);
            setDocuments(files);
          }
        }
        if (fileEntries.length > 0) {
          saved = fromApi(
            await apiAddKnowledgeBaseFileSources(base.knowledge_base_id, fileEntries, getToken)
          );
        }
        onSaved(saved, documents.length);
        return;
      }

      const created = await apiCreateKnowledgeBase(
        {
          knowledge_base_name: name.trim(),
          enable_auto_refresh: false,
          max_chunk_size: 2000,
          min_chunk_size: 400,
          ...(textEntries.length > 0 ? { knowledge_base_texts: textEntries } : {}),
        },
        getToken
      );
      if (fileEntries.length === 0) {
        onSaved(fromApi(created), documents.length);
        return;
      }
      try {
        const filled = await apiAddKnowledgeBaseFileSources(
          created.knowledge_base_id,
          fileEntries,
          getToken
        );
        onSaved(fromApi(filled), documents.length);
      } catch (err) {
        // The upload's error is the one to show, so a failed clean-up stays quiet.
        await apiDeleteKnowledgeBase(created.knowledge_base_id, getToken).catch(() => undefined);
        throw err;
      }
    } catch (err) {
      showSaveError(err);
    } finally {
      setIsSaving(false);
    }
  }

  const heading = base ? `Add to ${base.knowledge_base_name}` : "Add Knowledge Base";

  return (
    <>
      <div
        className="kb-modal-overlay"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !isSaving && !hasEntries) onClose();
        }}
      >
        <div
          aria-labelledby="kb-add-title"
          aria-modal="true"
          className={`kb-modal kb-add-modal${isDragging ? " is-dragging" : ""}`}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsDragging(false);
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!isSaving) setIsDragging(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            if (!isSaving) addFiles(event.dataTransfer.files);
          }}
          role="dialog"
        >
          <div className="kb-add-head">
            <h2 className="kb-add-title" id="kb-add-title">
              {heading}
            </h2>
            <button
              aria-label="Close"
              className="kb-add-close"
              disabled={isSaving}
              onClick={onClose}
              type="button"
            >
              <Icon name="x" size={16} />
            </button>
          </div>

          <div className="kb-add-body">
            {base ? null : (
              <label className="kb-add-field">
                <span className="kb-add-label">Knowledge Base Name</span>
                <input
                  autoFocus
                  className="kb-input kb-add-input"
                  disabled={isSaving}
                  maxLength={nameLimit}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") save();
                  }}
                  placeholder="Enter"
                  value={name}
                />
              </label>
            )}

            <div className="kb-add-field">
              <span className="kb-add-label">Documents</span>
              <div className="kb-add-picker" ref={picker}>
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
                  aria-expanded={isMenuOpen}
                  className="kb-add-btn"
                  disabled={isSaving}
                  onClick={() => setIsMenuOpen((current) => !current)}
                  type="button"
                >
                  <Icon name="plus" size={15} />
                  Add
                </button>
                {isMenuOpen ? (
                  <div className="kb-add-menu">
                    <button
                      className="kb-add-menu-item"
                      disabled={files.length >= sourceBounds.filesPerRequest}
                      onClick={() => {
                        setIsMenuOpen(false);
                        filePicker.current?.click();
                      }}
                      type="button"
                    >
                      <Icon name="upload" size={16} />
                      <span>Upload files</span>
                      <span className="kb-add-menu-hint">
                        {files.length >= sourceBounds.filesPerRequest
                          ? `${sourceBounds.filesPerRequest} max`
                          : `Up to ${Math.round(sourceBounds.fileBytes / (1024 * 1024))}MB`}
                      </span>
                    </button>
                    <button
                      className="kb-add-menu-item"
                      disabled={texts.length >= sourceBounds.textsPerRequest}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setTextEditor({ key: null, title: "", text: "", error: "" });
                      }}
                      type="button"
                    >
                      <Icon name="type" size={16} />
                      <span>Add text</span>
                      {texts.length >= sourceBounds.textsPerRequest ? (
                        <span className="kb-add-menu-hint">{sourceBounds.textsPerRequest} max</span>
                      ) : null}
                    </button>
                  </div>
                ) : null}
              </div>

              {documents.length === 0 ? (
                <p className="kb-add-hint">Add at least one text or file.</p>
              ) : (
                <ul className="kb-add-docs">
                  {documents.map((entry) => {
                    const details =
                      entry.kind === "file"
                        ? formatFileSize(entry.file.size)
                        : `${entry.text.length.toLocaleString()} characters`;
                    const rowError = rowErrors[entry.key];
                    return (
                      <li className={`kb-add-doc${rowError ? " is-invalid" : ""}`} key={entry.key}>
                        <div className="kb-add-doc-row">
                          <Icon name={entry.kind === "file" ? "file" : "type"} size={16} />
                          {entry.kind === "text" ? (
                            <button
                              aria-label={`Edit ${entry.title}`}
                              className="kb-add-doc-name is-editable"
                              disabled={isSaving}
                              onClick={() =>
                                setTextEditor({
                                  key: entry.key,
                                  title: entry.title,
                                  text: entry.text,
                                  error: "",
                                })
                              }
                              type="button"
                            >
                              {entry.title}
                            </button>
                          ) : (
                            <span className="kb-add-doc-name" title={entry.title}>
                              {entry.title}
                            </span>
                          )}
                          <span className="kb-add-doc-meta">{details}</span>
                          <button
                            aria-label={`Remove ${entry.title}`}
                            className="kb-add-doc-remove"
                            disabled={isSaving}
                            onClick={() => removeDocument(entry.key)}
                            type="button"
                          >
                            <Icon name="x" size={14} />
                          </button>
                        </div>
                        {rowError ? (
                          <div className="kb-add-doc-error" role="alert">
                            {rowError}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {error ? (
              <div className="kb-form-error" role="alert">
                {error}
              </div>
            ) : null}
          </div>

          <div className="kb-add-actions">
            {isSaving ? <span className="kb-add-progress">Indexing your documents…</span> : null}
            <button className="kb-add-btn" disabled={isSaving} onClick={onClose} type="button">
              Cancel
            </button>
            <button
              className="kb-add-btn kb-add-save"
              disabled={!canSave}
              onClick={save}
              title={canSave ? undefined : base ? "Add at least one text or file." : "Enter a name and add at least one text or file."}
              type="button"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {textEditor ? (
        <div
          className="kb-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !textEditor.title.trim() &&
              !textEditor.text.trim()
            ) {
              setTextEditor(null);
            }
          }}
        >
          <div
            aria-labelledby="kb-add-text-title"
            aria-modal="true"
            className="kb-modal kb-add-modal kb-add-text-modal"
            role="dialog"
          >
            <div className="kb-add-head">
              <h2 className="kb-add-title" id="kb-add-text-title">
                {textEditor.key === null ? "Add text" : "Edit text"}
              </h2>
              <button
                aria-label="Close"
                className="kb-add-close"
                onClick={() => setTextEditor(null)}
                type="button"
              >
                <Icon name="x" size={16} />
              </button>
            </div>
            <div className="kb-add-body">
              <label className="kb-add-field">
                <span className="kb-add-label">Title</span>
                <input
                  autoFocus
                  className="kb-input kb-add-input"
                  maxLength={sourceBounds.titleLength}
                  onChange={(event) =>
                    setTextEditor({ ...textEditor, title: event.target.value, error: "" })
                  }
                  placeholder="Enter"
                  value={textEditor.title}
                />
              </label>
              <label className="kb-add-field">
                <span className="kb-add-label">Text</span>
                <textarea
                  className="kb-textarea kb-add-textarea"
                  onChange={(event) =>
                    setTextEditor({ ...textEditor, text: event.target.value, error: "" })
                  }
                  placeholder="Enter"
                  value={textEditor.text}
                />
              </label>
              {textEditor.error ? (
                <div className="kb-form-error" role="alert">
                  {textEditor.error}
                </div>
              ) : null}
            </div>
            <div className="kb-add-actions">
              <button className="kb-add-btn" onClick={() => setTextEditor(null)} type="button">
                Cancel
              </button>
              <button
                className="kb-add-btn kb-add-save"
                disabled={!textEditor.title.trim() || !textEditor.text.trim()}
                onClick={saveText}
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
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
