import { serverFetch, type AuthTokenGetter } from "./api";

// Wire types for the persisted chat-agent API. Dashboard calls use the current
// Clerk session; /v1/chat-agents exposes the same contract to generated API
// keys for external clients.

export type ChatAgentStatus = "active" | "inactive";
// The server answers every chat agent with GPT-5 nano and rejects any other
// model, so the dashboard never sends a model section; the type only describes
// what the API returns.
export type ChatModelProvider = "openai";

export type ChatAgentSection = {
  name: string;
  phone_number_id?: string | null;
  status?: ChatAgentStatus;
};

export type ChatModelSection = {
  provider?: ChatModelProvider;
  name?: string;
  temperature?: number;
};

export type ChatPromptSection = {
  system_prompt?: string;
};

export type ChatKnowledgeBaseSection = {
  knowledge_base_ids?: string[];
};

export type ChatToolsSection = {
  tool_ids?: string[];
};

// Whether the agent takes orders and how. orders_on is read-only: the toggle is
// on and the Take Order tool is attached, which is when orders are really taken.
export type ChatOrderSection = {
  order_enabled?: boolean;
  order_instructions?: string;
  orders_on?: boolean;
};

// What the agent does with voice messages (transcribed, answered in text) and
// photos (read by the model). Absent from servers that predate it, which refuse
// the section on save, so it is only sent back when the server returned it.
export type ChatMediaSection = {
  voice_messages_enabled: boolean;
  images_enabled: boolean;
};

// The owner's website, which the agent reads while it replies when on. Absent
// from servers that predate it, so, like media, it is only sent back when the
// server returned it. The address is stored as typed.
export type ChatWebsiteSection = {
  website_enabled: boolean;
  website_url: string;
};

// What the running server reports about serving the agent. Never saved: it is
// read-only and absent from older servers.
export type ChatRuntimeSection = {
  provider_configured: boolean;
  last_error?: string;
  last_error_at?: string;
};

// One persisted chat agent, as ChatAgentResource in the OpenAPI document.
export type ApiChatAgent = {
  id: string;
  created_at: string;
  updated_at: string;
  agent: ChatAgentSection;
  model?: ChatModelSection;
  prompt?: ChatPromptSection;
  knowledge_base?: ChatKnowledgeBaseSection;
  tools?: ChatToolsSection;
  order?: ChatOrderSection;
  media?: ChatMediaSection;
  website?: ChatWebsiteSection;
  // True once the account has sent every reply it is allowed; the agent stays
  // silent until the limit is lifted. Read-only.
  reply_limit_reached?: boolean;
  // Only present while the agent has sent its replies for the hour: when it
  // starts answering again. Read-only.
  hourly_limit_resets_at?: string;
  runtime?: ChatRuntimeSection;
};

export type CreateChatAgentPayload = {
  agent: ChatAgentSection;
  model?: ChatModelSection;
  prompt?: ChatPromptSection;
  knowledge_base?: ChatKnowledgeBaseSection;
  tools?: ChatToolsSection;
  order?: Pick<ChatOrderSection, "order_enabled" | "order_instructions">;
  media?: ChatMediaSection;
  website?: ChatWebsiteSection;
};

// Every section and every field inside a supplied section is optional on
// update. A supplied id array replaces the current attachment set rather than
// adding to it.
export type UpdateChatAgentPayload = {
  agent?: Partial<ChatAgentSection>;
  model?: Partial<ChatModelSection>;
  prompt?: Partial<ChatPromptSection>;
  knowledge_base?: Partial<ChatKnowledgeBaseSection>;
  tools?: Partial<ChatToolsSection>;
  order?: Pick<ChatOrderSection, "order_enabled" | "order_instructions">;
  media?: Partial<ChatMediaSection>;
  website?: Partial<ChatWebsiteSection>;
};

// The defaults the OpenAPI document declares for a new chat agent, so the
// dashboard form starts on the same values the API would apply.
export const chatAgentDefaults = {
  status: "inactive" as ChatAgentStatus,
  model: { provider: "openai" as ChatModelProvider, name: "gpt-5-nano", temperature: 0.3 },
};

type Envelope<T> = { success: boolean; message: string; data: T };

export class ChatAgentError extends Error {
  readonly status: number;
  // A machine-readable reason the server gave, such as "chat_agent_limit".
  readonly code: string;

  constructor(message: string, status: number, code = "") {
    super(message);
    this.name = "ChatAgentError";
    this.status = status;
    this.code = code;
  }
}

export function isChatAgentLimitError(error: unknown): boolean {
  return error instanceof ChatAgentError && error.code === "chat_agent_limit";
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
    throw new ChatAgentError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // The status fallback below covers an unexpected non-JSON response.
  }
  if (!response.ok || !envelope?.success) {
    const code = (envelope?.data as { code?: unknown } | undefined)?.code;
    throw new ChatAgentError(
      envelope?.message || `Request failed (${response.status})`,
      response.status,
      typeof code === "string" ? code : ""
    );
  }
  return envelope.data;
}

export function listDashboardChatAgents(getToken: AuthTokenGetter): Promise<ApiChatAgent[]> {
  return request<ApiChatAgent[]>("/v1/dashboard/chat-agents?limit=100", undefined, getToken);
}

// What changes on its own while an agent runs, for every agent on the account.
// A page keeping this up to date reads only this, not each agent's whole prompt.
export type ChatAgentLiveState = Pick<ApiChatAgent, "id" | "hourly_limit_resets_at">;

export function listChatAgentLiveStates(getToken: AuthTokenGetter): Promise<ChatAgentLiveState[]> {
  return request<ChatAgentLiveState[]>("/v1/dashboard/chat-agents/live", undefined, getToken);
}

export function createDashboardChatAgent(
  payload: CreateChatAgentPayload,
  getToken: AuthTokenGetter
): Promise<ApiChatAgent> {
  return request<ApiChatAgent>(
    "/v1/dashboard/chat-agents",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
    getToken
  );
}

export function updateDashboardChatAgent(
  id: string,
  payload: UpdateChatAgentPayload,
  getToken: AuthTokenGetter
): Promise<ApiChatAgent> {
  return request<ApiChatAgent>(
    `/v1/dashboard/chat-agents/${encodeURIComponent(id)}`,
    { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
    getToken
  );
}

export function deleteDashboardChatAgent(
  id: string,
  getToken: AuthTokenGetter
): Promise<{ id: string; deleted: boolean }> {
  return request<{ id: string; deleted: boolean }>(
    `/v1/dashboard/chat-agents/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    getToken
  );
}

// One image or document the agent can send a customer. The bytes stay on the
// server; description says when the agent should send it.
export type ApiAgentFile = {
  id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  description: string;
  created_at: string;
};

// Mirrors what the server takes, so a form can refuse a file before uploading it.
export const AGENT_FILE_ACCEPT = ".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv";
export const AGENT_FILE_MAX_BYTES = 10 * 1024 * 1024;
export const AGENT_FILE_DESCRIPTION_MAX = 300;
export const AGENT_FILES_MAX = 20;

const agentFilesPath = (agentId: string) => `/v1/dashboard/chat-agents/${encodeURIComponent(agentId)}/files`;

export function listAgentFiles(agentId: string, getToken: AuthTokenGetter): Promise<ApiAgentFile[]> {
  return request<ApiAgentFile[]>(agentFilesPath(agentId), undefined, getToken);
}

// Content-Type is left unset: fetch derives it, boundary included, from the form.
export function uploadAgentFile(
  agentId: string,
  file: File,
  description: string,
  getToken: AuthTokenGetter
): Promise<ApiAgentFile> {
  const form = new FormData();
  form.append("description", description);
  form.append("file", file, file.name);
  return request<ApiAgentFile>(agentFilesPath(agentId), { method: "POST", body: form }, getToken);
}

export function updateAgentFile(
  agentId: string,
  fileId: string,
  description: string,
  getToken: AuthTokenGetter
): Promise<ApiAgentFile> {
  return request<ApiAgentFile>(
    `${agentFilesPath(agentId)}/${encodeURIComponent(fileId)}`,
    { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description }) },
    getToken
  );
}

export function deleteAgentFile(agentId: string, fileId: string, getToken: AuthTokenGetter) {
  return request<{ id: string; deleted: boolean }>(
    `${agentFilesPath(agentId)}/${encodeURIComponent(fileId)}`,
    { method: "DELETE" },
    getToken
  );
}
