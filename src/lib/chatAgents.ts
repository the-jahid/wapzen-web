import { serverFetch, type AuthTokenGetter } from "./api";

// Wire types for the persisted chat-agent API. Dashboard calls use the current
// Clerk session; /v1/chat-agents exposes the same contract to generated API
// keys for external clients.

export type ChatAgentStatus = "active" | "inactive";
export type ChatModelProvider = "openai" | "anthropic";

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
};

export type CreateChatAgentPayload = {
  agent: ChatAgentSection;
  model?: ChatModelSection;
  prompt?: ChatPromptSection;
  knowledge_base?: ChatKnowledgeBaseSection;
  tools?: ChatToolsSection;
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
};

// The defaults the OpenAPI document declares for a new chat agent, so the
// dashboard form starts on the same values the API would apply.
export const chatAgentDefaults = {
  status: "inactive" as ChatAgentStatus,
  model: { provider: "openai" as ChatModelProvider, name: "gpt-4.1-mini", temperature: 0.3 },
};

type Envelope<T> = { success: boolean; message: string; data: T };

export class ChatAgentError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ChatAgentError";
    this.status = status;
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
    throw new ChatAgentError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // The status fallback below covers an unexpected non-JSON response.
  }
  if (!response.ok || !envelope?.success) {
    throw new ChatAgentError(envelope?.message || `Request failed (${response.status})`, response.status);
  }
  return envelope.data;
}

export function listDashboardChatAgents(getToken: AuthTokenGetter): Promise<ApiChatAgent[]> {
  return request<ApiChatAgent[]>("/v1/dashboard/chat-agents?limit=100", undefined, getToken);
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
