"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion } from "motion/react";
import ExpandableCardDemoStandard from "@/components/expandable-card-demo-standard";
import OrdersTab from "@/components/tools/OrdersTab";
import {
  useWorkspaceMode,
  type WorkspaceMode,
} from "@/components/nav/workspaceMode";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { newOrdersCacheKey } from "@/components/nav/useNewOrders";
import { useCachedState } from "@/lib/pageCache";
import {
  createTool as apiCreateTool,
  deleteTool as apiDeleteTool,
  listTools as apiListTools,
  saveOrderFields as apiSaveOrderFields,
  testTool as apiTestTool,
  updateTool as apiUpdateTool,
  emptyApiRequestConfig,
  isValidToolName,
  suggestToolName,
  toolBounds,
  ToolError,
  type ApiTool,
  type CreateToolPayload,
  type OrderField,
  type ToolTestResult,
  type UpdateToolPayload,
} from "@/lib/tools";

// Tools are stored server-side (GET/POST/PATCH/DELETE /v1/dashboard/tools). The
// list is loaded on mount and the row being edited is held in local state until
// it is saved, so a form is not sending a PATCH per keystroke — the detail pane
// tracks its own dirty state and saves on demand.
//
// A tool defines an action; it is offered on a call or in a chat only once an
// agent attaches it, which is done from the agent's Tools section rather than here.

type IconName =
  | "grid"
  | "list"
  | "agents"
  | "phone"
  | "phoneOut"
  | "demo"
  | "chat"
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
  | "menu"
  | "chevron"
  | "back"
  | "bag";


// The tool types the server stores. There is no DTMF variant: WhatsApp calls
// carry no keypad signalling, so there would be nothing to send.
type ToolType = "api_request" | "transfer_call" | "end_call" | "send_text" | "order";
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
  // Built in: shown with a Default badge, and can't be edited or deleted.
  isSystem: boolean;
  agentCount: number;
  // Take Order
  orderFields: OrderField[];
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
type BrowseView = "list" | "grid";


const toolTypes: {
  id: ToolType;
  label: string;
  icon: IconName;
  accent: "primary" | "sky" | "rose" | "green" | "amber";
  blurb: string;
  // The blurb in the chat workspace, for the types a chat agent can run.
  chatBlurb?: string;
}[] = [
  {
    id: "api_request",
    label: "API Request",
    icon: "globe",
    accent: "primary",
    blurb: "Call an HTTP endpoint mid-call and speak the response back.",
    chatBlurb: "Call an HTTP endpoint mid-chat and answer from the response.",
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
    chatBlurb: "Send a link, address or reference as a WhatsApp message of its own.",
  },
  {
    id: "order",
    label: "Take Order",
    icon: "bag",
    accent: "amber",
    blurb: "Take orders from customers during a chat and save them under Orders.",
  },
];

// Only API requests can be created for calls; a chat can also send a text. The
// other types stay in toolTypes so tools made before still show their own label
// and icon.
function creatableToolTypes(mode: WorkspaceMode) {
  const ids: ToolType[] = mode === "chat" ? ["api_request", "send_text"] : ["api_request"];
  return toolTypes.filter((type) => ids.includes(type.id));
}

function typeBlurb(type: ToolType, mode: WorkspaceMode) {
  const meta = toolMeta(type);
  return mode === "chat" ? meta.chatBlurb ?? meta.blurb : meta.blurb;
}

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
    case "order":
      return {
        method: null,
        line: "Turned on per agent",
        tail: `${tool.agentCount} agent${tool.agentCount === 1 ? "" : "s"}`,
      };
  }
}

function emptyTool(id: string, type: ToolType, name: string, description: string): Tool {
  const defaults = emptyApiRequestConfig();
  return {
    id,
    type,
    name,
    description,
    isSystem: false,
    agentCount: 0,
    orderFields: [],
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
  base.isSystem = tool.is_system ?? false;
  base.agentCount = tool.chat_agent_ids?.length ?? 0;
  base.orderFields = tool.order?.fields ?? [];
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
    type: tool.type as CreateToolPayload["type"],
    name: tool.name.trim(),
    description: tool.description.trim(),
    ...toConfig(tool),
  };
}

// isAbsoluteHttpUrl mirrors the endpoint check the server runs on a create, so
// the create dialog can name the field before spending a round trip on it.
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
    case "phoneOff":
      return (
        <>
          <path d="M10.7 5.1A16 16 0 0112 5a2 2 0 012 1.7c.1.9.3 1.8.7 2.7a2 2 0 01-.5 2.1l-.8.8" />
          <path d="M6.6 6.6a19.8 19.8 0 002.9 8 19.5 19.5 0 006 6c1.3.6 2.6 1 4 1.2A2 2 0 0021.5 20v-2.6a2 2 0 00-1.7-2 12 12 0 01-2.7-.7" />
          <path d="M3 3l18 18" />
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
    case "bag":
      return (
        <>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 01-8 0" />
        </>
      );
    case "chevron":
      return <path d="M9 6l6 6-6 6" />;
    case "check":
      return <path d="M5 12.5l4 4 10-10" />;
    case "x":
      return <path d="M18 6L6 18M6 6l12 12" />;
    case "menu":
      return <path d="M4 6h16M4 12h16M4 18h16" />;
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
.tools-main { display: flex; flex: 1; flex-direction: column; height: 100vh; min-width: 0; overflow: hidden; }
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
.tools-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 24px 32px 32px; }
.tools-browse { display: flex; flex-direction: column; gap: 16px; margin: 0 auto; max-width: 1320px; width: 100%; }
.tools-tabs { border-bottom: 1px solid var(--border); display: flex; gap: 4px; }
.tools-tab {
  align-items: center;
  background: none;
  border: 0;
  border-bottom: 2px solid transparent;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  font-weight: 800;
  gap: 7px;
  margin-bottom: -1px;
  padding: 8px 12px 10px;
  transition: border-color .18s ease, color .18s ease;
}
.tools-tab:hover { color: var(--text); }
.tools-tab.is-active { border-bottom-color: var(--primary); color: var(--text); }
.tools-tab:focus-visible { border-radius: 8px; box-shadow: 0 0 0 3px var(--app-primary-ring); outline: none; }
.tools-tab-badge { background: var(--primary); border-radius: 999px; color: var(--app-on-accent); font-size: 10.5px; font-weight: 850; line-height: 1; padding: 3px 6px; }
.tools-default-note { align-items: center; display: flex; flex-wrap: wrap; gap: 6px 10px; }
.tools-order-fields { display: grid; gap: 10px; }
.tools-order-field { align-items: center; display: grid; gap: 12px; grid-template-columns: minmax(0, 1fr) auto auto; }
.tools-order-field-name { display: grid; gap: 2px; min-width: 0; }
.tools-order-field-label { color: var(--text); font-size: 13px; font-weight: 750; }
.tools-order-field-required { align-items: center; color: var(--subtle); cursor: pointer; display: inline-flex; font-size: 12.5px; gap: 6px; }
.tools-order-field-required input { accent-color: var(--primary); margin: 0; }
.tools-order-field-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; margin-top: 14px; }
.tools-function-params { display: grid; gap: 8px; }
.tools-function-param { align-items: baseline; display: grid; gap: 10px; grid-template-columns: 150px minmax(0, 1fr); }
.tools-function-param span:last-child { color: var(--subtle); font-size: 12.5px; }
.expandable-card-backdrop { background: var(--app-overlay); inset: 0; position: fixed; z-index: 80; }
.expandable-card-stage { align-items: center; display: flex; inset: 0; justify-content: center; padding: 24px; pointer-events: none; position: fixed; z-index: 90; }
.expandable-card-panel { pointer-events: auto; }
.tools-expandable-card {
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  box-shadow: 0 30px 90px var(--app-shadow-color), 0 0 0 1px var(--app-primary-ring);
  max-height: min(820px, calc(100vh - 48px));
  max-width: 1120px;
  overflow: auto;
  padding: 16px;
  width: 100%;
}
.tools-expandable-card .tools-detail { max-width: none; }
.tools-toolbar { align-items: center; display: flex; flex-wrap: wrap; gap: 12px; }
.tools-toolbar .tools-search-wrap { flex: 1 1 240px; max-width: 420px; }
.tools-toolbar .tools-count { margin-left: auto; }
.tools-view-toggle {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  display: inline-flex;
  flex-shrink: 0;
  gap: 2px;
  padding: 3px;
}
.tools-view-btn {
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
.tools-view-btn:hover { color: var(--text); }
.tools-view-btn.is-active {
  background: var(--primary-soft);
  box-shadow: inset 0 0 0 1px var(--app-primary-ring);
  color: var(--app-primary-text);
}
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
.tools-list { display: flex; flex-direction: column; gap: 10px; }
.tools-row {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 16px;
  grid-template-areas: "avatar identity type summary tail chevron";
  grid-template-columns: 36px minmax(180px, 1.2fr) auto minmax(180px, 1fr) auto 18px;
  padding: 13px 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.tools-row:hover { background: var(--panel-hover); border-color: var(--app-primary-ring); box-shadow: 0 6px 18px var(--app-shadow-soft); }
.tools-row:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.tools-row > .tools-tile { grid-area: avatar; }
.tools-row-type { grid-area: type; justify-self: start; }
.tools-row-identity { display: grid; gap: 3px; grid-area: identity; min-width: 0; }
.tools-row-name { font-size: 14px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-row-desc { color: var(--subtle); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-row-summary { align-items: center; display: flex; gap: 8px; grid-area: summary; min-width: 0; }
.tools-row-line { color: var(--subtle); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-row-tail { color: var(--faint); font-size: 11px; font-weight: 750; grid-area: tail; white-space: nowrap; }
.tools-row-chevron { color: var(--faint); display: inline-flex; grid-area: chevron; transition: color .18s ease, transform .18s ease; }
.tools-row:hover .tools-row-chevron { color: var(--primary-light); transform: translateX(2px); }
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
.tools-badge-default { background: var(--primary-soft); border: 1px solid var(--app-primary-ring); color: var(--app-primary-text); }
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
.tools-test-args { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
.tools-test-req { color: var(--rose); font-weight: 800; }
.tools-test-type { color: var(--faint); font-weight: 700; }
.tools-test-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 10px 14px; }
.tools-test-result { border-top: 1px solid var(--border); display: grid; gap: 14px; padding-top: 14px; }
.tools-test-error { background: var(--app-rose-soft); border: 1px solid var(--app-rose-border); border-radius: 10px; color: var(--app-rose-text); font-size: 12.5px; font-weight: 700; padding: 10px 12px; }
.tools-test-pre {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: var(--font-geist-mono), monospace;
  font-size: 12px;
  line-height: 1.55;
  margin: 0;
  max-height: 320px;
  overflow: auto;
  padding: 10px 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
.tools-badge-ok { background: var(--app-green-soft); border: 1px solid var(--app-green-border); color: var(--green); }
.tools-badge-fail { background: var(--app-rose-soft); border: 1px solid var(--app-rose-border); color: var(--app-rose-text); }
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
  z-index: 120;
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
  z-index: 130;
}
.tools-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-toast-success-text); }
.tools-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
/* The mobile top bar and drawer backdrop only exist below the tablet breakpoint. */
/* Wide screens: a little more room around the capped content. */
@media (min-width: 1680px) {
  .tools-content { padding: 28px 40px 36px; }
}
/* Laptops: the param count goes and the endpoint folds under the name. */
@media (max-width: 1240px) {
  .tools-row { gap: 8px 14px; grid-template-areas: "avatar identity type chevron" "avatar summary summary chevron"; grid-template-columns: 36px minmax(0, 1fr) auto 18px; }
  .tools-row-tail { display: none; }
}
@media (max-width: 1100px) {
  .tools-param-row { grid-template-columns: minmax(0, 1fr) 120px minmax(0, 1fr); }
  .tools-param-row .tools-required { grid-column: 1 / -1; }
  .tools-content { padding: 20px 20px 28px; }
  .expandable-card-stage { padding: 16px; }
  .tools-expandable-card { max-height: min(820px, calc(100dvh - 32px)); }
}
/* Tablets and phones: the sidebar becomes a drawer behind a sticky top bar,
   and the page scrolls as a whole. */
@media (max-width: 900px) {
  .tools-shell { display: block; height: auto; max-height: none; min-height: 100dvh; max-width: 100%; overflow: visible; width: 100%; }
  .tools-main { height: auto; overflow: visible; }
  .tools-content { overflow: visible; padding: 16px; }
  .tools-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
}
/* Phones: search on its own line, single-column forms, full-screen detail
   card and bottom-sheet dialogs. */
@media (max-width: 640px) {
  .tools-content { padding: 12px 12px calc(16px + env(safe-area-inset-bottom)); }
  .tools-toolbar { gap: 8px; }
  .tools-toolbar .tools-search-wrap { flex: 1 1 100%; max-width: none; }
  .tools-toolbar .tools-count { margin-left: 0; margin-right: auto; order: 2; }
  .tools-view-toggle { order: 3; }
  .tools-toolbar-new { order: 4; }
  .tools-shell input, .tools-shell select, .tools-shell textarea { font-size: 16px; } /* stops iOS zooming on focus */
  .tools-grid { grid-template-columns: 1fr; }
  .tools-card-item { min-height: 0; }
  .tools-card-item:hover { transform: none; }
  .tools-grid-2, .tools-kv-row, .tools-param-row, .tools-type-grid, .tools-function-param { grid-template-columns: minmax(0, 1fr); }
  .tools-detail-head { grid-template-columns: minmax(0, 1fr); }
  .tools-row { gap: 8px 10px; grid-template-areas: "avatar identity type" "avatar summary summary"; grid-template-columns: 36px minmax(0, 1fr) auto; padding: 12px; }
  .tools-row-chevron { display: none; }
  .expandable-card-stage { align-items: stretch; padding: 0; }
  .tools-expandable-card { border: 0; border-radius: 0; height: 100dvh; max-height: 100dvh; max-width: none; padding: 12px 12px calc(12px + env(safe-area-inset-bottom)); }
  .tools-modal-overlay { align-items: flex-end; padding: 0; }
  .tools-modal { border-radius: 18px 18px 0 0; max-height: calc(100dvh - 24px); max-width: none; padding: 20px 16px calc(16px + env(safe-area-inset-bottom)); }
  .tools-modal-sm { max-width: none; }
  .tools-modal-actions { flex-direction: column-reverse; }
  .tools-modal-actions .tools-btn { width: 100%; }
  .tools-toast { bottom: calc(16px + env(safe-area-inset-bottom)); max-width: calc(100vw - 24px); width: max-content; }
}
/* Narrow phones: the create button keeps only its icon, and the type badge
   drops under the name. */
@media (max-width: 400px) {
  .tools-toolbar-new-label { display: none; }
  .tools-toolbar-new { padding: 0 11px; }
  .tools-row { grid-template-areas: "avatar identity" "avatar type" "avatar summary"; grid-template-columns: 32px minmax(0, 1fr); }
  .tools-row > .tools-tile { height: 32px; width: 32px; }
}
`;

export default function ToolsPage() {
  const { getToken } = useAuth();
  const { mode } = useWorkspaceMode();
  const searchParams = useSearchParams();
  // The tab lives in the URL so it survives a refresh and can be linked to.
  const showOrders = searchParams.get("tab") === "orders";
  // The sidebar keeps this count current on every page.
  const [newOrders, setNewOrders] = useCachedState<number>(newOrdersCacheKey, 0);
  const [tools, setTools, hasCachedTools] = useCachedState<Tool[]>("tools-page:tools", []);
  const [isLoading, setIsLoading] = useState(true);
  // Tools cached from an earlier visit stay on screen while they refetch.
  const showSkeleton = isLoading && !hasCachedTools;
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [viewModeOverride, setViewModeOverride] = useState<BrowseView | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftType, setDraftType] = useState<ToolType>("api_request");
  // The rest of a tool is filled in from the detail pane, but the server refuses
  // an api_request with no endpoint, so that is asked for here instead of
  // failing the create.
  const [draftMethod, setDraftMethod] = useState<HttpMethod>("POST");
  const [draftUrl, setDraftUrl] = useState("");
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
  }, [getToken, setTools]);

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
  const viewMode = viewModeOverride ?? (mode === "chat" ? "list" : "grid");

  function openTab(orders: boolean) {
    window.history.replaceState(null, "", orders ? "?tab=orders" : window.location.pathname);
  }

  const noticeFromOrders = useCallback((kind: Notice["kind"], text: string) => {
    setNotice({ kind, text });
  }, []);

  function openCreate() {
    setDraftName("");
    setDraftDescription("");
    setDraftType("api_request");
    setDraftMethod(emptyApiRequestConfig().method);
    setDraftUrl("");
    setIsCreateOpen(true);
  }

  // createTool posts the new tool and selects it. Beyond the name, description
  // and type, only the configuration the server insists on at create time is
  // sent — an API request's endpoint. Headers, parameters and a text's message
  // are filled in from the detail pane.
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
    // This mirrors what the server enforces, so a mistyped value is named here
    // rather than coming back as a validation error on the whole request.
    const isApiRequest = draftType === "api_request";
    if (isApiRequest && !isAbsoluteHttpUrl(draftUrl)) {
      setNotice({
        kind: "error",
        text: draftUrl.trim()
          ? "The endpoint must be a full http:// or https:// URL."
          : "An API request tool needs an endpoint URL.",
      });
      return;
    }
    const draft = emptyTool("", draftType, name, draftDescription.trim());
    if (isApiRequest) {
      draft.method = draftMethod;
      draft.url = draftUrl.trim();
    }
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
    [getToken, setTools]
  );

  const saveFields = useCallback(
    async (toolId: string, fields: OrderField[]) => {
      const tool = fromApi(await apiSaveOrderFields(toolId, fields, getToken));
      setTools((current) => current.map((item) => (item.id === tool.id ? tool : item)));
      setDetailEpoch((current) => current + 1);
      setNotice({ kind: "success", text: "Order fields saved." });
    },
    [getToken, setTools]
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
    <div className={`tools-shell${mode === "chat" ? " app-accent-green" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <DashboardSidebar activeLabel="Tools" stackBelow={900} />

      <main className="tools-main">
        <div className="tools-content">
            <div className="tools-browse">
              <div aria-label="Tools sections" className="tools-tabs" role="tablist">
                <button
                  aria-selected={!showOrders}
                  className={`tools-tab${showOrders ? "" : " is-active"}`}
                  onClick={() => openTab(false)}
                  role="tab"
                  type="button"
                >
                  Tools
                </button>
                <button
                  aria-selected={showOrders}
                  className={`tools-tab${showOrders ? " is-active" : ""}`}
                  onClick={() => openTab(true)}
                  role="tab"
                  type="button"
                >
                  Orders
                  {newOrders > 0 ? (
                    <span aria-label={`${newOrders} new`} className="tools-tab-badge">
                      {newOrders}
                    </span>
                  ) : null}
                </button>
              </div>

              {showOrders ? (
                <OrdersTab onNewCount={setNewOrders} onNotice={noticeFromOrders} />
              ) : (
              <>
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
                <div aria-label="View" className="tools-view-toggle" role="group">
                  <button
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                    className={`tools-view-btn${viewMode === "list" ? " is-active" : ""}`}
                    onClick={() => setViewModeOverride("list")}
                    title="List view"
                    type="button"
                  >
                    <Icon name="list" size={16} sw={2.2} />
                  </button>
                  <button
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                    className={`tools-view-btn${viewMode === "grid" ? " is-active" : ""}`}
                    onClick={() => setViewModeOverride("grid")}
                    title="Grid view"
                    type="button"
                  >
                    <Icon name="grid" size={16} sw={2.2} />
                  </button>
                </div>
                <span className="tools-count">
                  {query.trim()
                    ? `${visibleTools.length} of ${tools.length}`
                    : `${tools.length} tool${tools.length === 1 ? "" : "s"}`}
                </span>
                <button
                  aria-label="Create Tool"
                  className="tools-btn tools-btn-primary tools-toolbar-new"
                  onClick={openCreate}
                  type="button"
                >
                  <Icon name="plus" size={16} sw={2.4} />
                  <span className="tools-toolbar-new-label">Create Tool</span>
                </button>
              </div>

              {showSkeleton ? (
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
              ) : viewMode === "list" ? (
                <div className="tools-list">
                  {visibleTools.map((tool) => {
                    const meta = toolMeta(tool.type);
                    const summary = cardSummary(tool);
                    return (
                      <motion.button
                        className="tools-row"
                        key={tool.id}
                        layoutId={`tool-${tool.id}`}
                        onClick={() => setSelectedId(tool.id)}
                        type="button"
                      >
                        <span className={`tools-tile tools-accent-${meta.accent}`}>
                          <Icon name={meta.icon} size={17} />
                        </span>
                        <span className="tools-row-identity">
                          <span className="tools-row-name">{tool.name}</span>
                          <span className="tools-row-desc">{tool.description || typeBlurb(tool.type, mode)}</span>
                        </span>
                        {tool.isSystem ? (
                          <span className="tools-badge tools-badge-default tools-row-type">Default</span>
                        ) : (
                          <span className="tools-badge tools-badge-neutral tools-row-type">{meta.label}</span>
                        )}
                        <span className="tools-row-summary">
                          {summary.method ? (
                            <span className="tools-chip-method">{summary.method}</span>
                          ) : null}
                          <span className={`tools-row-line${summary.method ? " tools-mono" : ""}`}>
                            {summary.line}
                          </span>
                        </span>
                        <span className="tools-row-tail">{summary.tail ?? "Ready"}</span>
                        <span className="tools-row-chevron">
                          <Icon name="chevron" size={16} sw={2.3} />
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="tools-grid">
                  {visibleTools.map((tool) => {
                    const meta = toolMeta(tool.type);
                    const summary = cardSummary(tool);

                    return (
                      <motion.button
                        className="tools-card-item"
                        key={tool.id}
                        layoutId={`tool-${tool.id}`}
                        onClick={() => setSelectedId(tool.id)}
                        type="button"
                      >
                        <span className="tools-card-top">
                          <span className={`tools-tile tools-tile-lg tools-accent-${meta.accent}`}>
                            <Icon name={meta.icon} size={20} />
                          </span>
                          {tool.isSystem ? (
                            <span className="tools-badge tools-badge-default">Default</span>
                          ) : (
                            <span className="tools-badge tools-badge-neutral">{meta.label}</span>
                          )}
                        </span>
                        <span className="tools-card-name">{tool.name}</span>
                        <span className="tools-card-desc">{tool.description || typeBlurb(tool.type, mode)}</span>
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
                      </motion.button>
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
              </>
              )}
            </div>
          <ExpandableCardDemoStandard
            className="tools-expandable-card"
            dismissDisabled={Boolean(pendingDelete)}
            layoutId={`tool-${selected?.id ?? "closed"}`}
            onClose={() => setSelectedId(null)}
            open={Boolean(selected)}
          >
            {selected?.isSystem ? (
              <SystemToolDetail
                key={`${selected.id}:${detailEpoch}`}
                onBack={() => setSelectedId(null)}
                onError={(message) => setNotice({ kind: "error", text: message })}
                onSaveFields={(fields) => saveFields(selected.id, fields)}
                tool={selected}
              />
            ) : selected ? (
              <ToolDetail
                key={`${selected.id}:${detailEpoch}`}
                onBack={() => setSelectedId(null)}
                onDelete={() => setPendingDelete(selected)}
                onError={(message) => setNotice({ kind: "error", text: message })}
                onSave={saveTool}
                tool={selected}
                mode={mode}
              />
            ) : null}
          </ExpandableCardDemoStandard>
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
                {creatableToolTypes(mode).map((type) => (
                  <button
                    aria-pressed={draftType === type.id}
                    className={`tools-type-card${draftType === type.id ? " is-selected" : ""}`}
                    key={type.id}
                    onClick={() => setDraftType(type.id)}
                    type="button"
                  >
                    <span className={`tools-tile tools-accent-${type.accent}`}>
                      <Icon name={type.icon} size={16} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span className="tools-type-name">{type.label}</span>
                      <span className="tools-type-blurb">{typeBlurb(type.id, mode)}</span>
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
              ) : (
                <span className="tools-field-hint">
                  Set a fixed message next, in the tool&apos;s own panel, or leave it blank to let
                  the model write the message itself.
                </span>
              )}
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
              using it, which stops those agents being able to take that action.{" "}
              {mode === "chat"
                ? "A reply already being written keeps it until that reply is sent."
                : "Calls already in progress keep it for the rest of the call."}
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

// The fields with a meaning of their own on an order (order-tool.ts on the
// server). Their names stay put; a field the owner added can be renamed.
const builtInFieldNotes: Record<string, string> = {
  customer_name: "If left out, the customer's WhatsApp name is saved.",
  phone: "The sender's WhatsApp number is saved whether or not this is here.",
  description: "What the customer wants, in full.",
  email: "",
  items: "Each with a name, quantity and note.",
  delivery_address: "",
};

const maxOrderFields = 20;

type OrderFieldRow = OrderField & { id: string };

// SystemToolDetail shows a built-in tool. Its one account-wide setting is what
// it collects; the rest is set per agent, in the agent's Tools section. The
// parent keys this on the tool id and the save epoch, so the rows below always
// start from stored values.
function SystemToolDetail({
  tool,
  onBack,
  onError,
  onSaveFields,
}: {
  tool: Tool;
  onBack: () => void;
  onError: (message: string) => void;
  onSaveFields: (fields: OrderField[]) => Promise<void>;
}) {
  const meta = toolMeta(tool.type);
  const [rows, setRows] = useState<OrderFieldRow[]>(() =>
    tool.orderFields.map((field) => ({ ...field, id: rowId("f") }))
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hasBlankName = rows.some((row) => !row.label.trim());

  function change(next: (current: OrderFieldRow[]) => OrderFieldRow[]) {
    setRows(next);
    setIsDirty(true);
  }

  function patch(id: string, update: Partial<OrderField>) {
    change((current) => current.map((row) => (row.id === id ? { ...row, ...update } : row)));
  }

  async function save() {
    setIsSaving(true);
    try {
      await onSaveFields(rows.map(({ key, label, required }) => ({ key, label, required })));
    } catch (error) {
      onError(describeError(error, "Could not save the order fields."));
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
              <h2 className="tools-detail-name">{tool.name}</h2>
              <div className="tools-detail-sub">
                <span className="tools-badge tools-badge-default">Default</span>
                <span className="tools-badge tools-badge-neutral">
                  {tool.agentCount} agent{tool.agentCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tools-card">
        <div className="tools-card-head">
          <h3 className="tools-card-title">How it works</h3>
          <div className="tools-card-copy">{tool.description}</div>
        </div>
        <div className="tools-card-body">
          <p className="tools-field-hint tools-default-note">
            This tool is built in, so it can&apos;t be deleted. To use it, open a chat agent, select
            Take Order under Tools, then turn on order taking and write your order instructions.
          </p>
          <div className="tools-default-note">
            <Link className="tools-btn tools-btn-primary tools-btn-sm" href="/dashboard/chat">
              Open chat agents
            </Link>
          </div>
        </div>
      </section>

      <section className="tools-card">
        <div className="tools-card-head">
          <h3 className="tools-card-title">What it collects</h3>
          <div className="tools-card-copy">
            The details saved with each order, on every agent that takes orders. Agents won&apos;t
            place an order until they have the required ones.
          </div>
        </div>
        <div className="tools-card-body">
          <div className="tools-order-fields">
            {rows.map((row) => {
              const isBuiltIn = row.key !== undefined && row.key in builtInFieldNotes;
              return (
                <div className="tools-order-field" key={row.id}>
                  <div className="tools-order-field-name">
                    {isBuiltIn ? (
                      <>
                        <span className="tools-order-field-label">{row.label}</span>
                        {builtInFieldNotes[row.key ?? ""] ? (
                          <span className="tools-field-hint">{builtInFieldNotes[row.key ?? ""]}</span>
                        ) : null}
                      </>
                    ) : (
                      <input
                        aria-label="Field name"
                        className="tools-input"
                        maxLength={60}
                        onChange={(event) => patch(row.id, { label: event.target.value })}
                        placeholder="Field name, like Table number"
                        value={row.label}
                      />
                    )}
                  </div>
                  <label className="tools-order-field-required">
                    <input
                      checked={row.required}
                      onChange={(event) => patch(row.id, { required: event.target.checked })}
                      type="checkbox"
                    />
                    Required
                  </label>
                  <button
                    aria-label={`Delete ${row.label || "field"}`}
                    className="tools-icon-button"
                    disabled={rows.length === 1}
                    onClick={() => change((current) => current.filter((item) => item.id !== row.id))}
                    title={rows.length === 1 ? "Keep at least one field" : "Delete field"}
                    type="button"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="tools-order-field-actions">
            <button
              className="tools-btn tools-btn-secondary tools-btn-sm"
              disabled={rows.length >= maxOrderFields}
              onClick={() =>
                change((current) => [...current, { id: rowId("f"), label: "", required: false }])
              }
              type="button"
            >
              <Icon name="plus" size={14} sw={2.4} />
              Add field
            </button>
            <button
              className="tools-btn tools-btn-primary tools-btn-sm"
              disabled={!isDirty || isSaving || hasBlankName}
              onClick={save}
              type="button"
            >
              {isSaving ? "Saving…" : "Save fields"}
            </button>
          </div>
        </div>
      </section>
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
  mode,
}: {
  tool: Tool;
  onSave: (draft: Tool) => Promise<void>;
  onDelete: () => void;
  onError: (message: string) => void;
  onBack: () => void;
  mode: WorkspaceMode;
}) {
  const isChat = mode === "chat";
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
              <div className="tools-card-copy">
                {isChat
                  ? "Where the request goes while the reply waits on it."
                  : "Where the call goes while the caller waits."}
              </div>
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
                    max={toolBounds.timeoutMax}
                    min={toolBounds.timeoutMin}
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

          <ToolTestPanel draft={draft} isDirty={isDirty} />
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
            <div className="tools-card-copy">
              {isChat
                ? "Sent into the chat as a WhatsApp message of its own."
                : "Sent to the caller’s number during the call."}
            </div>
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

// argumentValue turns what was typed for one parameter into the JSON value the
// model would have sent: a number for a number, a boolean for a boolean, and
// nothing at all for an optional field left blank.
function argumentValue(param: ParamRow, raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed === "") return undefined;
  if (param.type === "number") {
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : trimmed;
  }
  if (param.type === "boolean") return trimmed === "true";
  return raw;
}

// prettyBody indents a JSON response so it can be read; anything else is shown
// as it arrived.
function prettyBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

// ToolTestPanel runs the tool's request once, from the dashboard, through the
// same code path an agent uses mid-conversation — so what it shows is exactly
// what the agent would get. Unsaved edits are tested as they stand, which lets
// a URL or parameter change be tried before it is saved.
function ToolTestPanel({ draft, isDirty }: { draft: Tool; isDirty: boolean }) {
  const { getToken } = useAuth();
  const [values, setValues] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ToolTestResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const namedParams = draft.parameters.filter((param) => param.name.trim() !== "");

  async function run() {
    if (isRunning) return;
    setRunError(null);
    if (!isAbsoluteHttpUrl(draft.url)) {
      setRunError("Set a full http(s) Server URL above before testing.");
      return;
    }
    const args: Record<string, unknown> = {};
    for (const param of namedParams) {
      const value = argumentValue(param, values[param.id] ?? "");
      if (value !== undefined) args[param.name.trim()] = value;
    }
    setIsRunning(true);
    setResult(null);
    try {
      const apiRequest = isDirty ? toConfig(draft).api_request : undefined;
      setResult(await apiTestTool(draft.id, args, apiRequest, getToken));
    } catch (error) {
      setRunError(describeError(error, "The test could not be run."));
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <section className="tools-card">
      <div className="tools-card-head">
        <h3 className="tools-card-title">Test tool</h3>
        <div className="tools-card-copy">
          Fill in the arguments the agent would send and run the request for real.
        </div>
      </div>
      <div className="tools-card-body">
        {namedParams.length === 0 ? (
          <span className="tools-field-hint">
            This tool has no parameters, so it is called with an empty payload.
          </span>
        ) : (
          <div className="tools-test-args">
            {namedParams.map((param) => (
              <label className="tools-field" key={param.id}>
                <span className="tools-field-label">
                  <span className="tools-mono">{param.name.trim()}</span>
                  {param.required ? <span className="tools-test-req"> required</span> : null}
                  <span className="tools-test-type"> · {param.type}</span>
                </span>
                {param.type === "boolean" ? (
                  <select
                    className="tools-select"
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [param.id]: event.target.value }))
                    }
                    value={values[param.id] ?? ""}
                  >
                    <option value="">(not sent)</option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                ) : (
                  <input
                    className="tools-input tools-mono"
                    inputMode={param.type === "number" ? "decimal" : undefined}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [param.id]: event.target.value }))
                    }
                    placeholder={param.description || param.name}
                    value={values[param.id] ?? ""}
                  />
                )}
                {param.description ? (
                  <span className="tools-field-hint">{param.description}</span>
                ) : null}
              </label>
            ))}
          </div>
        )}

        <div className="tools-test-actions">
          <button
            className="tools-btn tools-btn-primary"
            disabled={isRunning}
            onClick={run}
            type="button"
          >
            <Icon name="spark" size={16} />
            {isRunning ? "Running…" : "Run test"}
          </button>
          <span className="tools-field-hint">
            {isDirty ? "Tests your unsaved changes. " : ""}
            The request is really sent, so a tool that books or writes data will do it.
          </span>
        </div>

        {runError ? <div className="tools-test-error">{runError}</div> : null}

        {result ? (
          <div className="tools-test-result" aria-live="polite">
            <div className="tools-detail-sub">
              <span className={`tools-badge ${result.ok ? "tools-badge-ok" : "tools-badge-fail"}`}>
                {result.status_code ? `HTTP ${result.status_code}` : "No response"}
              </span>
              <span className="tools-badge tools-badge-neutral">{result.duration_ms} ms</span>
              {result.content_type ? (
                <span className="tools-badge tools-badge-neutral">{result.content_type}</span>
              ) : null}
            </div>

            {result.error ? <div className="tools-test-error">{result.error}</div> : null}

            <div className="tools-field">
              <span className="tools-field-label">What the agent reads</span>
              <pre className="tools-test-pre">{result.model_result || "—"}</pre>
            </div>

            {result.status_code ? (
              <div className="tools-field">
                <span className="tools-field-label">
                  Response body{result.truncated ? " (first 20,000 characters)" : ""}
                </span>
                <pre className="tools-test-pre">{result.body ? prettyBody(result.body) : "(empty)"}</pre>
                {result.ok && result.body.trim().toLowerCase() === "accepted" ? (
                  <span className="tools-field-hint">
                    &quot;Accepted&quot; is what a Make.com webhook answers when the scenario has no
                    Webhook response module, so the agent gets no real data. Add one that returns
                    the result.
                  </span>
                ) : null}
              </div>
            ) : null}

            {result.request ? (
              <div className="tools-field">
                <span className="tools-field-label">Request sent</span>
                <pre className="tools-test-pre">
                  {`${result.request.method} ${result.request.url}`}
                  {result.request.body ? `\n\n${prettyBody(result.request.body)}` : ""}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
