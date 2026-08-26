import { serverFetch, type AuthTokenGetter } from "./api";

// Wire types mirroring the Go server's Tool model (see server/internal/models/
// tool.go). A tool is one action an agent can take while a call is running; it
// does nothing until an agent attaches it through tools.tool_ids.

// The tool types the server stores (migration 00041). There is no DTMF variant:
// WhatsApp calls carry no keypad signalling, so there would be nothing to send.
export type ToolType = "api_request" | "transfer_call" | "end_call" | "send_text";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// The argument types a model can reliably fill in from a spoken conversation,
// which is why there is no object or array.
export type ToolParamType = "string" | "number" | "boolean";

export type ToolParameter = {
  name: string;
  type: ToolParamType;
  description: string;
  required: boolean;
};

// A header value is stored and sent verbatim — there is no placeholder syntax —
// so a credential put here is stored on the tool.
export type ToolHeader = {
  key: string;
  value: string;
};

export type ToolApiRequestConfig = {
  method: HttpMethod;
  url: string;
  timeout_seconds: number;
  // When true the request is fired and the agent keeps talking, and the
  // response is never spoken back. Right for a write, wrong for a lookup.
  async: boolean;
  headers: ToolHeader[];
  parameters: ToolParameter[];
};

// WhatsApp calling cannot bridge a second leg onto a live call, so a transfer
// is an announcement followed by a hangup: the agent says message, destination
// is recorded against the call, and the caller is released.
export type ToolTransferCallConfig = {
  destination: string;
  message: string;
};

export type ToolSendTextConfig = {
  body: string;
};

export type ToolEndCallConfig = {
  message: string;
};

// ApiTool is a stored tool as the server returns it. Exactly one configuration
// block is present, chosen by type; the rest are omitted.
export type ApiTool = {
  id: string;
  type: ToolType;
  name: string;
  description: string;
  api_request?: ToolApiRequestConfig | null;
  transfer_call?: ToolTransferCallConfig | null;
  send_text?: ToolSendTextConfig | null;
  end_call?: ToolEndCallConfig | null;
  created_at: string;
  updated_at: string;
};

// CreateToolPayload is the POST body. type, name and description are required;
// api_request and transfer_call also require their configuration block, while
// send_text and end_call may omit theirs.
export type CreateToolPayload = {
  type: ToolType;
  name: string;
  description: string;
  api_request?: ToolApiRequestConfig;
  transfer_call?: ToolTransferCallConfig;
  send_text?: ToolSendTextConfig;
  end_call?: ToolEndCallConfig;
};

// UpdateToolPayload is the PATCH body: a partial update where at least one
// field must be present. A configuration block replaces the stored one
// wholesale, and type cannot be changed after creation.
export type UpdateToolPayload = {
  name?: string;
  description?: string;
  api_request?: ToolApiRequestConfig;
  transfer_call?: ToolTransferCallConfig;
  send_text?: ToolSendTextConfig;
  end_call?: ToolEndCallConfig;
};

// Bounds the server enforces, mirrored here so a form can reject a value before
// spending a round trip on it.
export const toolBounds = {
  nameLength: 64,
  descriptionLength: 1000,
  messageLength: 1000,
  urlLength: 2000,
  timeoutMin: 1,
  timeoutMax: 60,
  timeoutDefault: 20,
  maxHeaders: 20,
  maxParameters: 20,
} as const;

export const httpMethods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
export const toolParamTypes: ToolParamType[] = ["string", "number", "boolean"];

// toolNamePattern mirrors the tools.tool_name CHECK constraint: the
// intersection of what the OpenAI and Anthropic function-calling APIs accept as
// a function name.
export const toolNamePattern = /^[a-z][a-z0-9_]{0,63}$/;

export function isValidToolName(name: string): boolean {
  return toolNamePattern.test(name);
}

// suggestToolName turns a human label into a usable function name, so the
// create form can offer one rather than making every user work out the rules.
export function suggestToolName(label: string): string {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, toolBounds.nameLength);
  if (!slug) return "";
  return /^[a-z]/.test(slug) ? slug : `tool_${slug}`.slice(0, toolBounds.nameLength);
}

export type FieldError = { field: string; message: string };

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  // Present on 400 responses that failed per-field validation.
  errors?: FieldError[];
};

export class ToolError extends Error {
  readonly status: number;
  // Per-field validation failures, so a form can point at the offending input
  // instead of only showing the summary message.
  readonly fieldErrors: FieldError[];

  constructor(message: string, status: number, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = "ToolError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  getToken: AuthTokenGetter
): Promise<T> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new ToolError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // Non-JSON body; fall through to the status-based error below.
  }

  if (!response.ok || !envelope?.success) {
    const message = envelope?.message || `Request failed (${response.status})`;
    throw new ToolError(message, response.status, envelope?.errors ?? []);
  }

  return envelope.data;
}

// Dashboard tool routes use the signed-in user's Clerk session, the same split
// the agents and knowledge base routes use to keep /v1/tools API-key-only for
// external callers.

export type ListToolsOptions = {
  page?: number;
  limit?: number;
  type?: ToolType;
};

// listTools returns one page of the signed-in user's tools, newest first. The
// response also carries pagination meta and links; only the rows are surfaced,
// since the dashboard asks for a single large page.
export function listTools(
  getToken: AuthTokenGetter,
  options: ListToolsOptions = {}
): Promise<ApiTool[]> {
  const query = new URLSearchParams({
    page: String(options.page ?? 1),
    limit: String(options.limit ?? 200),
  });
  if (options.type) query.set("type", options.type);
  return request<ApiTool[]>(`/v1/dashboard/tools?${query.toString()}`, undefined, getToken);
}

export function getTool(toolId: string, getToken: AuthTokenGetter): Promise<ApiTool> {
  return request<ApiTool>(
    `/v1/dashboard/tools/${encodeURIComponent(toolId)}`,
    undefined,
    getToken
  );
}

export function createTool(
  payload: CreateToolPayload,
  getToken: AuthTokenGetter
): Promise<ApiTool> {
  return request<ApiTool>(
    "/v1/dashboard/tools",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    getToken
  );
}

export function updateTool(
  toolId: string,
  payload: UpdateToolPayload,
  getToken: AuthTokenGetter
): Promise<ApiTool> {
  return request<ApiTool>(
    `/v1/dashboard/tools/${encodeURIComponent(toolId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    getToken
  );
}

export function deleteTool(
  toolId: string,
  getToken: AuthTokenGetter
): Promise<{ id: string; deleted: boolean }> {
  return request<{ id: string; deleted: boolean }>(
    `/v1/dashboard/tools/${encodeURIComponent(toolId)}`,
    { method: "DELETE" },
    getToken
  );
}

// emptyApiRequestConfig is the shape a new api_request tool starts from, with
// the server's own defaults so the form shows what would be stored.
export function emptyApiRequestConfig(): ToolApiRequestConfig {
  return {
    method: "POST",
    url: "",
    timeout_seconds: toolBounds.timeoutDefault,
    async: false,
    headers: [],
    parameters: [],
  };
}

// toolSummary is the one-line description the tool list shows under each name:
// what the tool actually reaches out to, rather than repeating its type.
export function toolSummary(tool: ApiTool): string {
  switch (tool.type) {
    case "api_request":
      return tool.api_request?.url
        ? `${tool.api_request.method} ${tool.api_request.url.replace(/^https?:\/\//, "")}`
        : "No endpoint set";
    case "transfer_call":
      return tool.transfer_call?.destination
        ? `Transfer to ${tool.transfer_call.destination}`
        : "No destination set";
    case "send_text":
      return tool.send_text?.body ? "Sends a fixed message" : "Agent writes the message";
    case "end_call":
      return tool.end_call?.message ? "Says a set goodbye" : "Agent words the goodbye";
    default:
      return "";
  }
}
