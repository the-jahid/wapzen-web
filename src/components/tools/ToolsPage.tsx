"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearance } from "@/components/theme/clerkAppearance";
import {
  createTool as apiCreateTool,
  deleteTool as apiDeleteTool,
  listTools as apiListTools,
  updateTool as apiUpdateTool,
  emptyApiRequestConfig,
  isValidToolName,
  suggestToolName,
  toolBounds,
  ToolError,
  type ApiTool,
  type CreateToolPayload,
  type UpdateToolPayload,
} from "@/lib/tools";

// Tools are stored server-side (GET/POST/PATCH/DELETE /v1/dashboard/tools). The
// list is loaded on mount and the row being edited is held in local state until
// it is saved, so a form is not sending a PATCH per keystroke — the detail pane
// tracks its own dirty state and saves on demand.
//
// A tool defines an action; it is offered on a call only once an agent attaches
// it, which is done from the agent's Tools section rather than here.

type IconName =
  | "grid"
  | "agents"
  | "phone"
  | "phoneOut"
  | "phoneOff"
  | "calendar"
  | "chart"
  | "settings"
  | "spark"
  | "target"
  | "key"
  | "book"
  | "wrench"
  | "globe"
  | "transfer"
  | "message"
  | "hash"
  | "plus"
  | "search"
  | "trash"
  | "check"
  | "x"
  | "back";

type NavItem = {
  label: string;
  icon: IconName;
  href?: string;
  badge?: string;
};

// The tool types the server stores. There is no DTMF variant: WhatsApp calls
// carry no keypad signalling, so there would be nothing to send.
type ToolType = "api_request" | "transfer_call" | "end_call" | "send_text";
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type ParamType = "string" | "number" | "boolean";

// Headers and parameters carry a local row id the server never sees. The rows
// have no identity of their own on the wire — a configuration block is replaced
// wholesale — so the id exists only to keep React keys stable while editing.
type HeaderRow = { id: string; key: string; value: string };
type ParamRow = {
  id: string;
  name: string;
  type: ParamType;
  description: string;
  required: boolean;
};

// Tool is one stored tool flattened for editing: every variant's fields on one
// object, so a form field does not have to reach through an optional block. Only
// the fields belonging to `type` are ever sent (see toPayload).
type Tool = {
  id: string;
  type: ToolType;
  name: string;
  description: string;
  // API Request
  method: HttpMethod;
  url: string;
  timeoutSeconds: number;
  async: boolean;
  headers: HeaderRow[];
  parameters: ParamRow[];
  // Transfer Call
  destination: string;
  transferMessage: string;
  // Send Text
  textBody: string;
  // End Call
  endMessage: string;
};

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

const toolTypes: {
  id: ToolType;
  label: string;
  icon: IconName;
  accent: "primary" | "sky" | "rose" | "green" | "amber";
  blurb: string;
}[] = [
  {
    id: "api_request",
    label: "API Request",
    icon: "globe",
    accent: "primary",
    blurb: "Call an HTTP endpoint mid-call and speak the response back.",
  },
  {
    id: "transfer_call",
    label: "Transfer Call",
    icon: "transfer",
    accent: "sky",
    blurb: "Announce a handover to another number, then release the caller.",
  },
  {
    id: "end_call",
    label: "End Call",
    icon: "phoneOff",
    accent: "rose",
    blurb: "Let the agent hang up once the conversation is finished.",
  },
  {
    id: "send_text",
    label: "Send Text",
    icon: "message",
    accent: "green",
    blurb: "Send the caller a WhatsApp message while the call is running.",
  },
];

const httpMethods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const paramTypes: ParamType[] = ["string", "number", "boolean"];

const nameLimit = toolBounds.nameLength;

function toolMeta(type: ToolType) {
  return toolTypes.find((item) => item.id === type) ?? toolTypes[0];
}

// cardSummary is the line a grid card shows under the description: where the
// tool points, in the terms that matter for its type. A tool that is missing
// that piece says so on the card rather than leaving the row blank.
function cardSummary(tool: Tool): { method: string | null; line: string; tail: string | null } {
  switch (tool.type) {
    case "api_request":
      return {
        method: tool.method,
        line: tool.url ? tool.url.replace(/^https?:\/\//, "") : "No endpoint set",
        tail: `${tool.parameters.length} param${tool.parameters.length === 1 ? "" : "s"}`,
      };
    case "transfer_call":
      return { method: null, line: tool.destination || "No destination set", tail: null };
    case "send_text":
      return { method: null, line: tool.textBody || "Message written by the agent", tail: null };
    case "end_call":
      return { method: null, line: tool.endMessage || "Hangs up when the call is done", tail: null };
  }
}

function emptyTool(id: string, type: ToolType, name: string, description: string): Tool {
  const defaults = emptyApiRequestConfig();
  return {
    id,
    type,
    name,
    description,
    method: defaults.method,
    url: defaults.url,
    timeoutSeconds: defaults.timeout_seconds,
    async: defaults.async,
    headers: [],
    parameters: [],
    destination: "",
    transferMessage: "Connecting you to a teammate now, one moment.",
    textBody: "",
    endMessage: "",
  };
}

// rowId numbers the local-only ids on header and parameter rows. It is a module
// counter rather than a random value so a server and client render agree.
let rowCounter = 0;
function rowId(prefix: string) {
  rowCounter += 1;
  return `${prefix}-${rowCounter}`;
}

// fromApi flattens a stored tool into the editing shape. Only the block matching
// the tool's type is populated on the wire, so the other variants' fields fall
// back to the empty defaults.
function fromApi(tool: ApiTool): Tool {
  const base = emptyTool(tool.id, tool.type, tool.name, tool.description);
  if (tool.api_request) {
    base.method = tool.api_request.method;
    base.url = tool.api_request.url;
    base.timeoutSeconds = tool.api_request.timeout_seconds;
    base.async = tool.api_request.async;
    base.headers = (tool.api_request.headers ?? []).map((header) => ({
      id: rowId("h"),
      key: header.key,
      value: header.value,
    }));
    base.parameters = (tool.api_request.parameters ?? []).map((param) => ({
      id: rowId("p"),
      name: param.name,
      type: param.type,
      description: param.description,
      required: param.required,
    }));
  }
  if (tool.transfer_call) {
    base.destination = tool.transfer_call.destination;
    base.transferMessage = tool.transfer_call.message;
  }
  if (tool.send_text) {
    base.textBody = tool.send_text.body;
  }
  if (tool.end_call) {
    base.endMessage = tool.end_call.message;
  }
  return base;
}

// toConfig renders the one configuration block the tool's type reads. Sending
// any other block is refused by the server, which is the behaviour that stops a
// tool from looking configured while doing nothing.
function toConfig(tool: Tool): Pick<
  UpdateToolPayload,
  "api_request" | "transfer_call" | "send_text" | "end_call"
> {
  switch (tool.type) {
    case "api_request":
      return {
        api_request: {
          method: tool.method,
          url: tool.url.trim(),
          timeout_seconds: tool.timeoutSeconds,
          async: tool.async,
          headers: tool.headers
            .filter((header) => header.key.trim() !== "")
            .map((header) => ({ key: header.key.trim(), value: header.value })),
          parameters: tool.parameters.map((param) => ({
            name: param.name.trim(),
            type: param.type,
            description: param.description.trim(),
            required: param.required,
          })),
        },
      };
    case "transfer_call":
      return {
        transfer_call: {
          destination: tool.destination.trim(),
          message: tool.transferMessage.trim(),
        },
      };
    case "send_text":
      return { send_text: { body: tool.textBody.trim() } };
    case "end_call":
      return { end_call: { message: tool.endMessage.trim() } };
    default:
      return {};
  }
}

function toUpdatePayload(tool: Tool): UpdateToolPayload {
  return {
    name: tool.name.trim(),
    description: tool.description.trim(),
    ...toConfig(tool),
  };
}

function toCreatePayload(tool: Tool): CreateToolPayload {
  return {
    type: tool.type,
    name: tool.name.trim(),
    description: tool.description.trim(),
    ...toConfig(tool),
  };
}

// looksLikeE164 and isAbsoluteHttpUrl mirror the two checks the server runs on
// a create, so the create dialog can name the offending field before spending a
// round trip on it.
function looksLikeE164(value: string): boolean {
  return /^\+\d{7,15}$/.test(value);
}

function isAbsoluteHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > toolBounds.urlLength) return false;
  try {
    const parsed = new URL(trimmed);
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.host !== "";
  } catch {
    return false;
  }
}

// describeError turns a failed request into one line for the toast. A 400
// carrying per-field errors names the first offending field, since that is
// almost always the one to fix.
function describeError(error: unknown, fallback: string): string {
  if (error instanceof ToolError) {
    const field = error.fieldErrors[0];
    if (field) return `${field.field}: ${field.message}`;
    return error.message;
  }
  return fallback;
}

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
    case "phoneOff":
      return (
        <>
          <path d="M10.7 5.1A16 16 0 0112 5a2 2 0 012 1.7c.1.9.3 1.8.7 2.7a2 2 0 01-.5 2.1l-.8.8" />
          <path d="M6.6 6.6a19.8 19.8 0 002.9 8 19.5 19.5 0 006 6c1.3.6 2.6 1 4 1.2A2 2 0 0021.5 20v-2.6a2 2 0 00-1.7-2 12 12 0 01-2.7-.7" />
          <path d="M3 3l18 18" />
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
    case "globe":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 010 18 15 15 0 010-18z" />
        </>
      );
    case "transfer":
      return (
        <>
          <path d="M4 8h13" />
          <path d="M14 5l3 3-3 3" />
          <path d="M20 16H7" />
          <path d="M10 13l-3 3 3 3" />
        </>
      );
    case "message":
      return <path d="M21 11.5a8.4 8.4 0 01-9 8.4 8.9 8.9 0 01-3.8-.9L3 20.5l1.6-4.8A8.3 8.3 0 013.5 11 8.4 8.4 0 0112 3a8.4 8.4 0 019 8.5z" />;
    case "hash":
      return <path d="M9 3L7.5 21M16.5 3L15 21M3.5 8.5h17M3 15.5h17" />;
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
    case "back":
      return (
        <>
          <path d="M20 12H4" />
          <path d="M10 6l-6 6 6 6" />
        </>
      );
    case "check":
      return <path d="M5 12.5l4 4 10-10" />;
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
.tools-shell {
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
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.tools-shell * { box-sizing: border-box; }
.tools-shell button, .tools-shell input, .tools-shell select, .tools-shell textarea { font: inherit; }
.tools-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.tools-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.tools-shell ::-webkit-scrollbar-track { background: transparent; }
.tools-sidebar {
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 22px 16px;
  width: 248px;
}
.tools-logo { align-items: center; display: flex; gap: 11px; padding: 4px 8px 26px; }
.tools-logo-mark {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border-radius: 10px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.tools-nav-kicker { color: var(--faint); font-size: 10.5px; font-weight: 700; letter-spacing: .9px; padding: 4px 10px 8px; text-transform: uppercase; }
.tools-nav { display: flex; flex-direction: column; gap: 3px; }
.tools-nav-item {
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
.tools-nav-item:hover { background: var(--app-hover); color: var(--app-text-soft); }
.tools-nav-item.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); font-weight: 700; }
.tools-nav-badge { background: var(--primary); border-radius: 20px; color: var(--app-on-accent); font-size: 10.5px; font-weight: 700; margin-left: auto; padding: 1px 7px; }
.tools-sidebar-footer { display: flex; flex-direction: column; gap: 14px; margin-top: auto; padding-top: 18px; }
.tools-user-card { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; gap: 10px; padding: 10px 13px; }
.tools-user-name { font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-user-email { color: var(--app-subtle); font-size: 11.5px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-main { display: flex; flex: 1; flex-direction: column; height: 100vh; min-width: 0; overflow: hidden; }
.tools-topbar {
  align-items: center;
  background: var(--app-topbar);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 16px;
  padding: 20px 32px;
}
.tools-title-wrap { flex: 1; min-width: 0; }
.tools-title { font-size: 21px; font-weight: 800; letter-spacing: -.4px; line-height: 1.15; margin: 0; }
.tools-subtitle { color: var(--subtle); font-size: 12.5px; margin-top: 3px; }
.tools-demo-pill {
  background: var(--app-amber-soft);
  border: 1px solid var(--app-amber-border);
  border-radius: 999px;
  color: var(--app-amber-text);
  font-size: 11.5px;
  font-weight: 800;
  padding: 6px 11px;
  white-space: nowrap;
}
.tools-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 20px 32px 32px; }
.tools-browse { display: flex; flex-direction: column; gap: 16px; margin: 0 auto; max-width: 1320px; width: 100%; }
.tools-toolbar { align-items: center; display: flex; flex-wrap: wrap; gap: 12px; }
.tools-toolbar .tools-search-wrap { flex: 1 1 240px; max-width: 420px; }
.tools-toolbar .tools-count { margin-left: auto; }
.tools-panel-title-row { align-items: center; display: flex; gap: 8px; justify-content: space-between; }
.tools-count {
  background: var(--app-hover-2);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  color: var(--subtle);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  padding: 4px 8px;
}
.tools-btn {
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
  transition: background .18s ease, border-color .18s ease, filter .18s ease, transform .18s ease;
  white-space: nowrap;
}
.tools-btn:hover { transform: translateY(-1px); }
.tools-btn:disabled { cursor: not-allowed; filter: grayscale(.35); opacity: .45; transform: none; }
.tools-btn-primary { background: linear-gradient(140deg,var(--primary-2),var(--primary)); border-color: transparent; box-shadow: 0 4px 14px var(--app-primary-glow); color: var(--app-on-accent); }
.tools-btn-secondary { background: var(--panel-hover); color: var(--text); }
.tools-btn-secondary:hover { background: var(--app-hover-3); }
.tools-btn-destructive { background: var(--app-rose-soft-2); border-color: var(--app-rose-border-strong); color: var(--app-rose-text); }
.tools-btn-destructive:hover { background: var(--app-rose-border); }
.tools-btn-sm { border-radius: 9px; font-size: 12px; gap: 6px; min-height: 32px; padding: 0 11px; }
.tools-input, .tools-select, .tools-textarea {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  outline: none;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.tools-input { height: 40px; padding: 0 12px; }
.tools-input::placeholder, .tools-textarea::placeholder { color: var(--faint); }
.tools-input:focus, .tools-select:focus, .tools-textarea:focus {
  background: var(--app-input-focus);
  border-color: var(--app-primary-ring-strong);
  box-shadow: 0 0 0 4px var(--app-primary-ring);
}
.tools-select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--app-muted) 50%), linear-gradient(135deg, var(--app-muted) 50%, transparent 50%);
  background-position: calc(100% - 17px) 50%, calc(100% - 12px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 5px, 5px 5px;
  height: 40px;
  padding: 0 34px 0 12px;
}
.tools-select option { background: var(--surface); color: var(--text); }
.tools-textarea { line-height: 1.55; min-height: 84px; padding: 10px 12px; resize: vertical; }
.tools-mono { font-family: var(--font-geist-mono), monospace; font-size: 12.5px; }
.tools-search-wrap { position: relative; }
.tools-search-icon { color: var(--subtle); left: 12px; position: absolute; top: 50%; transform: translateY(-50%); }
.tools-search-input { padding-left: 36px; }
.tools-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
.tools-card-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 186px;
  padding: 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
}
.tools-card-item:hover {
  background: var(--panel-hover);
  border-color: var(--app-primary-border);
  box-shadow: 0 12px 30px var(--app-shadow-soft);
  transform: translateY(-2px);
}
.tools-card-item:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.tools-card-top { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.tools-card-name { font-size: 15px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-card-desc {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--muted);
  display: -webkit-box;
  font-size: 12.5px;
  line-height: 1.55;
  overflow: hidden;
}
.tools-card-foot {
  align-items: center;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  margin-top: auto;
  min-width: 0;
  padding-top: 12px;
}
.tools-chip-method {
  background: var(--app-hover-2);
  border: 1px solid var(--border-strong);
  border-radius: 7px;
  color: var(--subtle);
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 850;
  letter-spacing: .5px;
  padding: 4px 7px;
}
.tools-chip-line { color: var(--subtle); font-size: 11.5px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-chip-tail { color: var(--faint); flex-shrink: 0; font-size: 11px; font-weight: 750; margin-left: auto; white-space: nowrap; }
.tools-add-card {
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
  min-height: 186px;
  padding: 16px;
  text-align: center;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}
.tools-add-card:hover { background: var(--app-hover); border-color: var(--app-primary-border); color: var(--text); }
.tools-add-icon {
  align-items: center;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  display: flex;
  height: 40px;
  justify-content: center;
  margin-bottom: 4px;
  width: 40px;
}
.tools-add-label { font-size: 13.5px; font-weight: 800; }
.tools-add-copy { color: var(--faint); font-size: 11.5px; max-width: 200px; }
.tools-tile {
  align-items: center;
  border: 1px solid var(--app-border-strong);
  border-radius: 10px;
  display: flex;
  flex-shrink: 0;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.tools-tile-lg { border-radius: 13px; height: 44px; width: 44px; }
.tools-accent-primary { background: var(--app-primary-soft); border-color: var(--app-primary-ring); color: var(--primary-light); }
.tools-accent-sky { background: var(--app-sky-soft); border-color: var(--app-sky-border); color: var(--app-sky); }
.tools-accent-rose { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--rose); }
.tools-accent-green { background: var(--app-green-soft); border-color: var(--app-green-border); color: var(--green); }
.tools-accent-amber { background: var(--app-amber-soft); border-color: var(--app-amber-border); color: var(--app-amber); }
.tools-list-empty {
  align-items: center;
  border: 1px dashed var(--border-strong);
  border-radius: 14px;
  color: var(--subtle);
  display: flex;
  flex-direction: column;
  font-size: 12.5px;
  gap: 4px;
  justify-content: center;
  min-height: 140px;
  padding: 20px;
  text-align: center;
}
.tools-detail { display: flex; flex-direction: column; gap: 14px; margin: 0 auto; max-width: 1120px; min-width: 0; width: 100%; }
.tools-back {
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
.tools-back:hover { color: var(--text); }
.tools-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  flex: 0 0 auto;
}
.tools-detail-head {
  align-items: center;
  display: grid;
  gap: 14px;
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 16px 18px;
}
.tools-identity { align-items: center; display: grid; gap: 13px; grid-template-columns: 44px minmax(0, 1fr); min-width: 0; }
.tools-detail-name { font-size: 19px; font-weight: 850; letter-spacing: -.35px; line-height: 1.15; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-detail-sub { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
.tools-badge {
  border-radius: 999px;
  display: inline-flex;
  font-size: 11.5px;
  font-weight: 800;
  line-height: 1;
  padding: 5px 8px;
  white-space: nowrap;
}
.tools-badge-neutral { background: var(--app-hover-2); border: 1px solid var(--border-strong); color: var(--subtle); }
.tools-card-head { border-bottom: 1px solid var(--border); padding: 14px 18px; }
.tools-card-title { font-size: 13px; font-weight: 850; margin: 0; }
.tools-card-copy { color: var(--subtle); font-size: 12px; margin-top: 2px; }
.tools-card-body { display: grid; gap: 14px; padding: 18px; }
.tools-field { display: grid; gap: 7px; min-width: 0; }
.tools-field-label { color: var(--subtle); font-size: 11.5px; font-weight: 800; }
.tools-field-hint { color: var(--faint); font-size: 11.5px; line-height: 1.5; }
.tools-grid-2 { display: grid; gap: 14px; grid-template-columns: 140px minmax(0, 1fr); }
.tools-kv-row { display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) 36px; }
.tools-param-row { display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) 120px minmax(0, 1.5fr) auto 36px; }
.tools-rows { display: grid; gap: 10px; }
.tools-row-head { color: var(--faint); font-size: 10.5px; font-weight: 850; letter-spacing: .8px; text-transform: uppercase; }
.tools-icon-button {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 40px;
  justify-content: center;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
  width: 36px;
}
.tools-icon-button:hover { background: var(--app-hover-2); border-color: var(--border-strong); color: var(--app-text-strong); }
.tools-toggle { align-items: center; background: none; border: 0; cursor: pointer; display: flex; gap: 10px; padding: 0; text-align: left; }
.tools-toggle-track {
  background: var(--app-hover-3);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  flex-shrink: 0;
  height: 24px;
  padding: 2px;
  transition: background .18s ease, border-color .18s ease;
  width: 44px;
}
.tools-toggle-knob {
  background: var(--app-invert-bg);
  border-radius: 50%;
  height: 18px;
  transition: transform .18s ease, background .18s ease;
  width: 18px;
}
.tools-toggle.is-on .tools-toggle-track { background: var(--primary); border-color: transparent; }
.tools-toggle.is-on .tools-toggle-knob { background: var(--app-on-accent); transform: translateX(20px); }
.tools-toggle-label { font-size: 12.5px; font-weight: 750; }
.tools-required {
  align-items: center;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 750;
  gap: 6px;
  white-space: nowrap;
}
.tools-empty {
  align-items: center;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 340px;
  padding: 40px;
  text-align: center;
}
.tools-empty-icon {
  align-items: center;
  background: var(--app-hover);
  border: 1px solid var(--border);
  border-radius: 22px;
  color: var(--subtle);
  display: flex;
  height: 72px;
  justify-content: center;
  width: 72px;
}
.tools-empty-title { font-size: 17px; font-weight: 850; letter-spacing: -.2px; margin: 18px 0 0; }
.tools-empty-copy { color: var(--muted); font-size: 13px; line-height: 1.6; margin: 8px 0 0; max-width: 380px; }
.tools-modal-overlay {
  align-items: center;
  animation: tools-fade-in .16s ease;
  backdrop-filter: blur(3px);
  background: var(--app-overlay);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 70;
}
.tools-modal {
  animation: tools-modal-in .18s ease;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: 18px;
  box-shadow: 0 30px 80px var(--app-shadow-color-strong);
  max-height: calc(100vh - 48px);
  max-width: 560px;
  overflow-y: auto;
  padding: 22px;
  width: 100%;
}
.tools-modal-sm { max-width: 420px; }
.tools-modal-title { font-size: 17px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.tools-modal-copy { color: var(--muted); font-size: 13px; line-height: 1.55; margin: 8px 0 0; }
.tools-modal-copy strong { color: var(--text); font-weight: 800; }
.tools-modal-section { display: grid; gap: 10px; margin-top: 18px; }
.tools-modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.tools-type-grid { display: grid; gap: 10px; grid-template-columns: 1fr 1fr; }
.tools-type-card {
  align-items: start;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 13px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 11px;
  grid-template-columns: 34px minmax(0, 1fr);
  padding: 12px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease;
}
.tools-type-card:hover { background: var(--app-hover-2); border-color: var(--border-strong); }
.tools-type-card.is-selected { background: var(--primary-soft); border-color: var(--app-primary-border); box-shadow: inset 0 0 0 1px var(--app-primary-ring); }
.tools-type-name { display: block; font-size: 13px; font-weight: 800; }
.tools-type-blurb { color: var(--subtle); display: block; font-size: 11.5px; line-height: 1.45; margin-top: 3px; }
.tools-modal-icon {
  align-items: center;
  background: var(--app-rose-soft);
  border: 1px solid var(--app-rose-border);
  border-radius: 12px;
  color: var(--rose);
  display: inline-flex;
  height: 42px;
  justify-content: center;
  margin-bottom: 14px;
  width: 42px;
}
@keyframes tools-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes tools-modal-in {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to { opacity: 1; transform: none; }
}
.tools-toast {
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
  z-index: 80;
}
.tools-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-toast-success-text); }
.tools-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
@media (max-width: 1100px) {
  .tools-param-row { grid-template-columns: minmax(0, 1fr) 120px minmax(0, 1fr); }
  .tools-param-row .tools-required { grid-column: 1 / -1; }
}
@media (max-width: 980px) {
  .tools-shell { display: block; height: auto; max-height: none; overflow: visible; }
  .tools-sidebar { height: auto; width: 100%; }
  .tools-main { height: auto; overflow: visible; }
  .tools-nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .tools-user-card { display: none; }
  .tools-content { overflow: visible; padding: 18px 20px 26px; }
  .tools-topbar { padding: 18px 20px; }
}
@media (max-width: 640px) {
  .tools-nav { grid-template-columns: 1fr 1fr; }
  .tools-content { padding: 14px 14px 22px; }
  .tools-toolbar .tools-search-wrap { max-width: none; }
  .tools-toolbar .tools-btn-primary { flex: 1 1 auto; }
  .tools-grid-2, .tools-kv-row, .tools-param-row, .tools-type-grid { grid-template-columns: minmax(0, 1fr); }
  .tools-detail-head { grid-template-columns: minmax(0, 1fr); }
  .tools-modal-actions .tools-btn { flex: 1; }
}
`;

export default function ToolsPage() {
  const { getToken } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draftType, setDraftType] = useState<ToolType>("api_request");
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  // The one piece of configuration the chosen type cannot be created without.
  // The rest of a tool is filled in from the detail pane, but the server refuses
  // an api_request with no endpoint and a transfer_call with no destination, so
  // those two are asked for here instead of failing the create.
  const [draftMethod, setDraftMethod] = useState<HttpMethod>("POST");
  const [draftUrl, setDraftUrl] = useState("");
  const [draftDestination, setDraftDestination] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Tool | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  // Bumped whenever a tool is saved or reloaded, so the detail pane remounts on
  // the stored values instead of holding a draft the server has since rewritten.
  const [detailEpoch, setDetailEpoch] = useState(0);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  // Load the user's tools once. A failure leaves the list empty with the reason
  // shown in place, rather than an empty page that reads as "no tools yet".
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stored = await apiListTools(getToken);
        if (cancelled) return;
        const mapped = stored.map(fromApi);
        setTools(mapped);
        setLoadError(null);
      } catch (error) {
        if (cancelled) return;
        setLoadError(describeError(error, "Could not load your tools."));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken]);

  useEffect(() => {
    if (!isCreateOpen && !pendingDelete) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setPendingDelete(null);
      setIsCreateOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCreateOpen, pendingDelete]);

  const selected = useMemo(
    () => tools.find((tool) => tool.id === selectedId) ?? null,
    [tools, selectedId]
  );

  const visibleTools = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return tools;
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        toolMeta(tool.type).label.toLowerCase().includes(term)
    );
  }, [tools, query]);

  function openCreate() {
    setDraftType("api_request");
    setDraftName("");
    setDraftDescription("");
    setDraftMethod(emptyApiRequestConfig().method);
    setDraftUrl("");
    setDraftDestination("");
    setIsCreateOpen(true);
  }

  // createTool posts the new tool and selects it. Beyond the name, description
  // and type, only the configuration the server insists on at create time is
  // sent — the endpoint for an api_request, the destination for a transfer_call.
  // Headers, parameters and the spoken lines are filled in from the detail pane.
  async function createTool() {
    if (isCreating) return;

    const name = draftName.trim();
    if (!name) {
      setNotice({ kind: "error", text: "Give the tool a name first." });
      return;
    }
    // The server enforces this too, but catching it here saves a round trip and
    // can suggest a name that would work.
    if (!isValidToolName(name)) {
      const suggestion = suggestToolName(name);
      setNotice({
        kind: "error",
        text: suggestion
          ? `"${name}" is not a valid function name. Try "${suggestion}".`
          : `"${name}" is not a valid function name — use lowercase letters, digits and underscores.`,
      });
      return;
    }
    if (!draftDescription.trim()) {
      setNotice({ kind: "error", text: "Describe the tool — it is what the model reads." });
      return;
    }
    // Both checks mirror what the server enforces, so a mistyped value is named
    // here rather than coming back as a validation error on the whole request.
    if (draftType === "api_request" && !isAbsoluteHttpUrl(draftUrl)) {
      setNotice({
        kind: "error",
        text: draftUrl.trim()
          ? "The endpoint must be a full http:// or https:// URL."
          : "An API request tool needs an endpoint URL.",
      });
      return;
    }
    if (draftType === "transfer_call" && !looksLikeE164(draftDestination.trim())) {
      setNotice({
        kind: "error",
        text: "Enter the destination in E.164 form, e.g. +8801639726992.",
      });
      return;
    }

    const draft = emptyTool("", draftType, name, draftDescription.trim());
    draft.method = draftMethod;
    draft.url = draftUrl.trim();
    draft.destination = draftDestination.trim();
    const payload = toCreatePayload(draft);

    setIsCreating(true);
    try {
      const created = await apiCreateTool(payload, getToken);
      const tool = fromApi(created);
      setDetailEpoch((current) => current + 1);
      setTools((current) => [tool, ...current]);
      setSelectedId(tool.id);
      setIsCreateOpen(false);
      setQuery("");
      setNotice({ kind: "success", text: `Tool "${tool.name}" created.` });
    } catch (error) {
      setNotice({ kind: "error", text: describeError(error, "Could not create the tool.") });
    } finally {
      setIsCreating(false);
    }
  }

  // saveTool persists the detail pane's draft. The stored row the server returns
  // replaces the local one, so what is on screen afterwards is what was actually
  // saved rather than what was typed.
  const saveTool = useCallback(
    async (draft: Tool) => {
      const saved = await apiUpdateTool(draft.id, toUpdatePayload(draft), getToken);
      const tool = fromApi(saved);
      setTools((current) => current.map((item) => (item.id === tool.id ? tool : item)));
      setDetailEpoch((current) => current + 1);
      setNotice({ kind: "success", text: `Tool "${tool.name}" saved.` });
    },
    [getToken]
  );

  // deleteTool removes the tool and, with it, every agent's attachment to it —
  // the join rows cascade — so an agent using it stops offering that action.
  async function deleteTool(tool: Tool) {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await apiDeleteTool(tool.id, getToken);
      setTools((current) => current.filter((item) => item.id !== tool.id));
      setSelectedId((current) => (current === tool.id ? null : current));
      setPendingDelete(null);
      setNotice({ kind: "success", text: `Tool "${tool.name}" deleted.` });
    } catch (error) {
      setNotice({ kind: "error", text: describeError(error, "Could not delete the tool.") });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="tools-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Sidebar activeLabel="Tools" toolCount={tools.length} />

      <main className="tools-main">
        <header className="tools-topbar">
          <div className="tools-title-wrap">
            <h1 className="tools-title">Tools</h1>
            <div className="tools-subtitle">
              Actions your agents can take during a call — hit an API, send a message, hand over,
              hang up. Attach them to an agent from its Tools section.
            </div>
          </div>
        </header>

        <div className="tools-content">
          {selected ? (
            // Keyed on the tool and the save epoch so opening another tool — or
            // saving this one — restarts the pane on stored values rather than
            // carrying a draft across.
            <ToolDetail
              key={`${selected.id}:${detailEpoch}`}
              onBack={() => setSelectedId(null)}
              onDelete={() => setPendingDelete(selected)}
              onError={(message) => setNotice({ kind: "error", text: message })}
              onSave={saveTool}
              tool={selected}
            />
          ) : (
            <div className="tools-browse">
              <div className="tools-toolbar">
                <div className="tools-search-wrap">
                  <span className="tools-search-icon">
                    <Icon name="search" size={15} />
                  </span>
                  <input
                    aria-label="Search tools"
                    className="tools-input tools-search-input"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search Tools"
                    value={query}
                  />
                </div>
                <span className="tools-count">
                  {query.trim()
                    ? `${visibleTools.length} of ${tools.length}`
                    : `${tools.length} tool${tools.length === 1 ? "" : "s"}`}
                </span>
                <button className="tools-btn tools-btn-primary" onClick={openCreate} type="button">
                  <Icon name="plus" size={16} sw={2.4} />
                  Create Tool
                </button>
              </div>

              {isLoading ? (
                <div className="tools-list-empty">
                  <strong>Loading tools…</strong>
                </div>
              ) : loadError ? (
                <div className="tools-list-empty">
                  <strong>Could not load tools</strong>
                  <span>{loadError}</span>
                </div>
              ) : tools.length === 0 ? (
                <section className="tools-empty">
                  <span className="tools-empty-icon">
                    <Icon name="wrench" size={32} sw={1.6} />
                  </span>
                  <h2 className="tools-empty-title">No tools yet</h2>
                  <p className="tools-empty-copy">
                    Tools let your agents take actions during calls — transfer, hang up, hit APIs,
                    and more.
                  </p>
                  <button
                    className="tools-btn tools-btn-primary"
                    onClick={openCreate}
                    style={{ marginTop: 18 }}
                    type="button"
                  >
                    <Icon name="plus" size={16} sw={2.4} />
                    Create Tool
                  </button>
                </section>
              ) : visibleTools.length === 0 ? (
                <div className="tools-list-empty">
                  <strong>No tools found</strong>
                  <span>Try another search.</span>
                </div>
              ) : (
                <div className="tools-grid">
                  {visibleTools.map((tool) => {
                    const meta = toolMeta(tool.type);
                    const summary = cardSummary(tool);

                    return (
                      <button
                        className="tools-card-item"
                        key={tool.id}
                        onClick={() => setSelectedId(tool.id)}
                        type="button"
                      >
                        <span className="tools-card-top">
                          <span className={`tools-tile tools-tile-lg tools-accent-${meta.accent}`}>
                            <Icon name={meta.icon} size={20} />
                          </span>
                          <span className="tools-badge tools-badge-neutral">{meta.label}</span>
                        </span>
                        <span className="tools-card-name">{tool.name}</span>
                        <span className="tools-card-desc">{tool.description || meta.blurb}</span>
                        <span className="tools-card-foot">
                          {summary.method ? (
                            <span className="tools-chip-method">{summary.method}</span>
                          ) : null}
                          <span
                            className={`tools-chip-line${summary.method ? " tools-mono" : ""}`}
                          >
                            {summary.line}
                          </span>
                          {summary.tail ? (
                            <span className="tools-chip-tail">{summary.tail}</span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}

                  <button className="tools-add-card" onClick={openCreate} type="button">
                    <span className="tools-add-icon">
                      <Icon name="plus" size={20} sw={2.4} />
                    </span>
                    <span className="tools-add-label">Create Tool</span>
                    <span className="tools-add-copy">Another action your agents can take.</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </main>

      {isCreateOpen ? (
        <div
          className="tools-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsCreateOpen(false);
          }}
        >
          <div
            aria-labelledby="create-tool-title"
            aria-modal="true"
            className="tools-modal"
            role="dialog"
          >
            <h2 className="tools-modal-title" id="create-tool-title">
              Create tool
            </h2>
            <p className="tools-modal-copy">
              Choose what the tool does, then name it the way you want the model to call it.
            </p>

            <div className="tools-modal-section">
              <span className="tools-field-label">Tool type</span>
              <div className="tools-type-grid">
                {toolTypes.map((type) => (
                  <button
                    className={`tools-type-card${type.id === draftType ? " is-selected" : ""}`}
                    key={type.id}
                    onClick={() => setDraftType(type.id)}
                    type="button"
                  >
                    <span className={`tools-tile tools-accent-${type.accent}`}>
                      <Icon name={type.icon} size={16} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span className="tools-type-name">{type.label}</span>
                      <span className="tools-type-blurb">{type.blurb}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="tools-modal-section">
              <label className="tools-field">
                <span className="tools-field-label">Name</span>
                <input
                  autoFocus
                  className="tools-input tools-mono"
                  maxLength={nameLimit}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="check_availability"
                  value={draftName}
                />
                <span className="tools-field-hint">
                  Lowercase with underscores reads best — this is the function name the model sees.
                </span>
              </label>
              <label className="tools-field">
                <span className="tools-field-label">Description</span>
                <textarea
                  className="tools-textarea"
                  maxLength={toolBounds.descriptionLength}
                  onChange={(event) => setDraftDescription(event.target.value)}
                  placeholder="Tell the model when to reach for this tool."
                  value={draftDescription}
                />
              </label>

              {draftType === "api_request" ? (
                <>
                  <div className="tools-grid-2">
                    <label className="tools-field">
                      <span className="tools-field-label">Method</span>
                      <select
                        className="tools-select"
                        onChange={(event) => setDraftMethod(event.target.value as HttpMethod)}
                        value={draftMethod}
                      >
                        {httpMethods.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="tools-field">
                      <span className="tools-field-label">Endpoint URL</span>
                      <input
                        className="tools-input tools-mono"
                        maxLength={toolBounds.urlLength}
                        onChange={(event) => setDraftUrl(event.target.value)}
                        placeholder="https://api.example.com/v1/availability"
                        value={draftUrl}
                      />
                    </label>
                  </div>
                  <span className="tools-field-hint">
                    Headers, the timeout and the parameters the model fills in are set next, in the
                    tool&apos;s own panel.
                  </span>
                </>
              ) : null}

              {draftType === "transfer_call" ? (
                <label className="tools-field">
                  <span className="tools-field-label">Transfer to</span>
                  <input
                    className="tools-input tools-mono"
                    onChange={(event) => setDraftDestination(event.target.value)}
                    placeholder="+8801639726992"
                    value={draftDestination}
                  />
                  <span className="tools-field-hint">
                    E.164 format, starting with the country code. The line the agent says before
                    handing over is set next, in the tool&apos;s own panel.
                  </span>
                </label>
              ) : null}
            </div>

            <div className="tools-modal-actions">
              <button
                className="tools-btn tools-btn-secondary"
                onClick={() => setIsCreateOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="tools-btn tools-btn-primary"
                disabled={isCreating}
                onClick={createTool}
                type="button"
              >
                <Icon name="plus" size={16} sw={2.4} />
                {isCreating ? "Creating…" : "Create tool"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingDelete ? (
        <div
          className="tools-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPendingDelete(null);
          }}
        >
          <div
            aria-describedby="delete-tool-copy"
            aria-labelledby="delete-tool-title"
            aria-modal="true"
            className="tools-modal tools-modal-sm"
            role="dialog"
          >
            <div className="tools-modal-icon">
              <Icon name="trash" size={20} />
            </div>
            <h2 className="tools-modal-title" id="delete-tool-title">
              Delete tool
            </h2>
            <p className="tools-modal-copy" id="delete-tool-copy">
              <strong>{pendingDelete.name}</strong> will be deleted and detached from every agent
              using it, which stops those agents being able to take that action. Calls already in
              progress keep it for the rest of the call.
            </p>
            <div className="tools-modal-actions">
              <button
                autoFocus
                className="tools-btn tools-btn-secondary"
                onClick={() => setPendingDelete(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="tools-btn tools-btn-destructive"
                disabled={isDeleting}
                onClick={() => deleteTool(pendingDelete)}
                type="button"
              >
                {isDeleting ? "Deleting…" : "Delete tool"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {notice ? (
        <div
          className={`tools-toast ${notice.kind === "error" ? "tools-toast-error" : "tools-toast-success"}`}
          role="status"
        >
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

// ToolDetail edits one tool. It holds its own draft rather than writing through
// to the list on every keystroke: the tool is persisted with a PATCH, and a
// request per character typed into a URL field would be both wasteful and, on a
// half-typed URL, invalid.
//
// The parent keys this component on the tool id and the save epoch, so the draft
// below always starts from stored values.
function ToolDetail({
  tool,
  onSave,
  onDelete,
  onError,
  onBack,
}: {
  tool: Tool;
  onSave: (draft: Tool) => Promise<void>;
  onDelete: () => void;
  onError: (message: string) => void;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState<Tool>(tool);
  const [isSaving, setIsSaving] = useState(false);
  const meta = toolMeta(draft.type);
  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(tool), [draft, tool]);

  function patchTool(patch: Partial<Tool>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function addHeader() {
    patchTool({ headers: [...draft.headers, { id: rowId("h"), key: "", value: "" }] });
  }

  function patchHeader(id: string, patch: Partial<HeaderRow>) {
    patchTool({
      headers: draft.headers.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    });
  }

  function removeHeader(id: string) {
    patchTool({ headers: draft.headers.filter((row) => row.id !== id) });
  }

  function addParam() {
    patchTool({
      parameters: [
        ...draft.parameters,
        { id: rowId("p"), name: "", type: "string", description: "", required: false },
      ],
    });
  }

  function patchParam(id: string, patch: Partial<ParamRow>) {
    patchTool({
      parameters: draft.parameters.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    });
  }

  function removeParam(id: string) {
    patchTool({ parameters: draft.parameters.filter((row) => row.id !== id) });
  }

  async function save() {
    if (isSaving || !isDirty) return;
    if (!isValidToolName(draft.name.trim())) {
      const suggestion = suggestToolName(draft.name);
      onError(
        suggestion
          ? `"${draft.name}" is not a valid function name. Try "${suggestion}".`
          : "Use lowercase letters, digits and underscores for the function name."
      );
      return;
    }
    setIsSaving(true);
    try {
      await onSave(draft);
    } catch (error) {
      onError(describeError(error, "Could not save the tool."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="tools-detail">
      <button className="tools-back" onClick={onBack} type="button">
        <Icon name="back" size={16} sw={2.2} />
        All tools
      </button>

      <section className="tools-card">
        <div className="tools-detail-head">
          <div className="tools-identity">
            <span className={`tools-tile tools-tile-lg tools-accent-${meta.accent}`}>
              <Icon name={meta.icon} size={20} />
            </span>
            <div style={{ minWidth: 0 }}>
              <h2 className="tools-detail-name">{draft.name}</h2>
              <div className="tools-detail-sub">
                <span className="tools-badge tools-badge-neutral">{meta.label}</span>
                {draft.type === "api_request" ? (
                  <>
                    <span className="tools-badge tools-badge-neutral">
                      {draft.async ? "Async" : "Blocking"}
                    </span>
                    <span className="tools-badge tools-badge-neutral">
                      {draft.parameters.length} parameter
                      {draft.parameters.length === 1 ? "" : "s"}
                    </span>
                  </>
                ) : null}
                {isDirty ? (
                  <span className="tools-badge tools-badge-neutral">Unsaved changes</span>
                ) : null}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="tools-btn tools-btn-primary"
              disabled={!isDirty || isSaving}
              onClick={save}
              type="button"
            >
              <Icon name="check" size={16} sw={2.4} />
              {isSaving ? "Saving…" : "Save"}
            </button>
            <button className="tools-btn tools-btn-secondary" onClick={onDelete} type="button">
              <Icon name="trash" size={16} />
              Delete
            </button>
          </div>
        </div>
      </section>

      <section className="tools-card">
        <div className="tools-card-head">
          <h3 className="tools-card-title">Tool details</h3>
          <div className="tools-card-copy">What the model reads when deciding to call this.</div>
        </div>
        <div className="tools-card-body">
          <label className="tools-field">
            <span className="tools-field-label">Name</span>
            <input
              className="tools-input tools-mono"
              maxLength={nameLimit}
              onChange={(event) => patchTool({ name: event.target.value })}
              value={draft.name}
            />
          </label>
          <label className="tools-field">
            <span className="tools-field-label">Description</span>
            <textarea
              className="tools-textarea"
              onChange={(event) => patchTool({ description: event.target.value })}
              placeholder="Tell the model when to reach for this tool."
              value={draft.description}
            />
          </label>
        </div>
      </section>

      {draft.type === "api_request" ? (
        <>
          <section className="tools-card">
            <div className="tools-card-head">
              <h3 className="tools-card-title">Request</h3>
              <div className="tools-card-copy">Where the call goes while the caller waits.</div>
            </div>
            <div className="tools-card-body">
              <div className="tools-grid-2">
                <label className="tools-field">
                  <span className="tools-field-label">Method</span>
                  <select
                    className="tools-select"
                    onChange={(event) => patchTool({ method: event.target.value as HttpMethod })}
                    value={draft.method}
                  >
                    {httpMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="tools-field">
                  <span className="tools-field-label">Server URL</span>
                  <input
                    className="tools-input tools-mono"
                    onChange={(event) => patchTool({ url: event.target.value })}
                    placeholder="https://api.example.com/v1/availability"
                    value={draft.url}
                  />
                </label>
              </div>

              <div className="tools-grid-2">
                <label className="tools-field">
                  <span className="tools-field-label">Timeout (s)</span>
                  <input
                    className="tools-input"
                    max={120}
                    min={1}
                    onChange={(event) =>
                      patchTool({ timeoutSeconds: Number(event.target.value) || 1 })
                    }
                    type="number"
                    value={draft.timeoutSeconds}
                  />
                </label>
                <div className="tools-field">
                  <span className="tools-field-label">Async</span>
                  <button
                    aria-pressed={draft.async}
                    className={`tools-toggle${draft.async ? " is-on" : ""}`}
                    onClick={() => patchTool({ async: !draft.async })}
                    type="button"
                  >
                    <span className="tools-toggle-track">
                      <span className="tools-toggle-knob" />
                    </span>
                    <span className="tools-toggle-label">
                      {draft.async
                        ? "Fire and keep talking"
                        : "Wait for the response before replying"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="tools-field">
                <div className="tools-panel-title-row">
                  <span className="tools-field-label">Headers</span>
                  <button
                    className="tools-btn tools-btn-secondary tools-btn-sm"
                    onClick={addHeader}
                    type="button"
                  >
                    <Icon name="plus" size={14} sw={2.4} />
                    Add header
                  </button>
                </div>
                {draft.headers.length === 0 ? (
                  <span className="tools-field-hint">
                    No headers set. A value is sent exactly as typed, so a key put here is stored
                    on the tool — prefer one scoped to what this tool needs.
                  </span>
                ) : (
                  <div className="tools-rows">
                    {draft.headers.map((header) => (
                      <div className="tools-kv-row" key={header.id}>
                        <input
                          aria-label="Header name"
                          className="tools-input tools-mono"
                          onChange={(event) => patchHeader(header.id, { key: event.target.value })}
                          placeholder="Authorization"
                          value={header.key}
                        />
                        <input
                          aria-label="Header value"
                          className="tools-input tools-mono"
                          onChange={(event) =>
                            patchHeader(header.id, { value: event.target.value })
                          }
                          placeholder="Bearer sk-live-..."
                          value={header.value}
                        />
                        <button
                          aria-label="Remove header"
                          className="tools-icon-button"
                          onClick={() => removeHeader(header.id)}
                          type="button"
                        >
                          <Icon name="x" size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="tools-card">
            <div className="tools-card-head">
              <h3 className="tools-card-title">Parameters</h3>
              <div className="tools-card-copy">
                What the model has to fill in before the request goes out.
              </div>
            </div>
            <div className="tools-card-body">
              <div className="tools-panel-title-row">
                <span className="tools-row-head">Function arguments</span>
                <button
                  className="tools-btn tools-btn-secondary tools-btn-sm"
                  onClick={addParam}
                  type="button"
                >
                  <Icon name="plus" size={14} sw={2.4} />
                  Add parameter
                </button>
              </div>
              {draft.parameters.length === 0 ? (
                <span className="tools-field-hint">
                  No parameters — the model calls this tool with an empty payload.
                </span>
              ) : (
                <div className="tools-rows">
                  {draft.parameters.map((param) => (
                    <div className="tools-param-row" key={param.id}>
                      <input
                        aria-label="Parameter name"
                        className="tools-input tools-mono"
                        onChange={(event) => patchParam(param.id, { name: event.target.value })}
                        placeholder="date"
                        value={param.name}
                      />
                      <select
                        aria-label="Parameter type"
                        className="tools-select"
                        onChange={(event) =>
                          patchParam(param.id, { type: event.target.value as ParamType })
                        }
                        value={param.type}
                      >
                        {paramTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <input
                        aria-label="Parameter description"
                        className="tools-input"
                        onChange={(event) =>
                          patchParam(param.id, { description: event.target.value })
                        }
                        placeholder="Requested day in YYYY-MM-DD form."
                        value={param.description}
                      />
                      <label className="tools-required">
                        <input
                          checked={param.required}
                          onChange={(event) =>
                            patchParam(param.id, { required: event.target.checked })
                          }
                          type="checkbox"
                        />
                        Required
                      </label>
                      <button
                        aria-label="Remove parameter"
                        className="tools-icon-button"
                        onClick={() => removeParam(param.id)}
                        type="button"
                      >
                        <Icon name="x" size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      ) : null}

      {draft.type === "transfer_call" ? (
        <section className="tools-card">
          <div className="tools-card-head">
            <h3 className="tools-card-title">Destination</h3>
            <div className="tools-card-copy">
              WhatsApp cannot bridge a second leg onto a live call, so the agent says the line
              below and releases the caller. The destination is recorded against the call.
            </div>
          </div>
          <div className="tools-card-body">
            <label className="tools-field">
              <span className="tools-field-label">Transfer to</span>
              <input
                className="tools-input tools-mono"
                onChange={(event) => patchTool({ destination: event.target.value })}
                placeholder="+8801XXXXXXXXX"
                value={draft.destination}
              />
              <span className="tools-field-hint">
                E.164 format, starting with the country code.
              </span>
            </label>
            <label className="tools-field">
              <span className="tools-field-label">Spoken before handing over</span>
              <textarea
                className="tools-textarea"
                maxLength={toolBounds.messageLength}
                onChange={(event) => patchTool({ transferMessage: event.target.value })}
                value={draft.transferMessage}
              />
            </label>
          </div>
        </section>
      ) : null}

      {draft.type === "send_text" ? (
        <section className="tools-card">
          <div className="tools-card-head">
            <h3 className="tools-card-title">Message</h3>
            <div className="tools-card-copy">Sent to the caller&apos;s number during the call.</div>
          </div>
          <div className="tools-card-body">
            <label className="tools-field">
              <span className="tools-field-label">Body</span>
              <textarea
                className="tools-textarea"
                onChange={(event) => patchTool({ textBody: event.target.value })}
                placeholder="Here is the booking link we just talked about: ..."
                value={draft.textBody}
              />
              <span className="tools-field-hint">
                Leave blank to let the model write the message itself.
              </span>
            </label>
          </div>
        </section>
      ) : null}

      {draft.type === "end_call" ? (
        <section className="tools-card">
          <div className="tools-card-head">
            <h3 className="tools-card-title">Goodbye</h3>
            <div className="tools-card-copy">
              Spoken before the line closes. The call stays open until it has been said.
            </div>
          </div>
          <div className="tools-card-body">
            <label className="tools-field">
              <span className="tools-field-label">Closing line</span>
              <textarea
                className="tools-textarea"
                maxLength={toolBounds.messageLength}
                onChange={(event) => patchTool({ endMessage: event.target.value })}
                placeholder="Thanks for calling, goodbye."
                value={draft.endMessage}
              />
              <span className="tools-field-hint">
                Leave blank to let the model word its own goodbye.
              </span>
            </label>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Sidebar({ activeLabel, toolCount }: { activeLabel: string; toolCount: number }) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();

  return (
    <aside className="tools-sidebar">
      <div className="tools-logo">
        <div className="tools-logo-mark">
          <Icon name="spark" size={18} stroke="#fff" sw={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.3px" }}>Voca</div>
          <div style={{ color: "var(--app-subtle)", fontSize: 11, fontWeight: 500, marginTop: -1 }}>
            AI Voice Agents
          </div>
        </div>
      </div>
      <div className="tools-nav-kicker">Menu</div>
      <nav className="tools-nav" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const badge = item.label === "Tools" ? String(toolCount) : item.badge;
          const content = (
            <>
              <span style={{ display: "flex", justifyContent: "center", width: 18 }}>
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
              {badge ? <span className="tools-nav-badge">{badge}</span> : null}
            </>
          );
          const className = `tools-nav-item${item.label === activeLabel ? " is-active" : ""}`;

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
      <div className="tools-sidebar-footer">
        <ThemeToggle />
        <div className="tools-user-card">
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span style={{ minWidth: 0 }}>
            <div className="tools-user-name">{user?.fullName || user?.username || "Account"}</div>
            <div className="tools-user-email">{user?.primaryEmailAddress?.emailAddress ?? ""}</div>
          </span>
        </div>
      </div>
    </aside>
  );
}
