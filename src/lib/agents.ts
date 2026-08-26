import { serverFetch, serverFetchWithAPIKey, type AuthTokenGetter } from "./api";

// Wire types mirroring the Go server's JSON contract (see
// server/internal/swagger/modules/agents/types). Every field the server may
// omit or null out is optional here so mapping code has to handle it.

export type ApiAgentSection = {
  name: string;
  language?: string;
  timezone?: string | null;
  phone_number_id?: string | null;
  call_direction?: string;
  status?: string;
};

export type ApiModelSection = {
  provider?: string;
  name?: string;
  temperature?: number;
};

export type ApiPromptSection = {
  begin_message_mode?: string;
  begin_message?: string;
  begin_message_delay_ms?: number;
  system_prompt?: string;
};

export type ApiVoiceSection = {
  provider?: string;
  elevenlabs?: {
    voice_id?: string;
    voice_name?: string;
    voice_model?: string;
  } | null;
  openai?: {
    voice_id?: string;
    voice_name?: string;
    voice_model?: string;
    realtime_model?: string;
    instructions?: string | null;
    // Spoken rate (0.25–1.5) and playback gain (0–2); 1 is neutral for both.
    speed?: number;
    volume?: number;
  } | null;
};

export type ApiTranscriberSection = {
  provider?: string;
  language?: string;
  openai?: { model?: string } | null;
  elevenlabs?: { model?: string } | null;
};

// ApiKnowledgeBaseSection lists the knowledge bases the agent answers from. The
// server treats the list as the complete attachment set: sending it replaces the
// agent's attachments, [] detaches all of them, and omitting the section leaves
// them untouched. Ids must belong to the caller's own knowledge bases — an
// unknown one fails the whole request with 404.
export type ApiKnowledgeBaseSection = {
  knowledge_base_ids?: string[] | null;
};

// ApiToolsSection lists the tools the agent may call during a call. It follows
// the same replace-wholesale rule as the knowledge base section: sending the
// list replaces the agent's attachments, [] detaches all of them, and omitting
// the section leaves them untouched. Ids must belong to the caller's own tools —
// an unknown one fails the whole request.
export type ApiToolsSection = {
  tool_ids?: string[] | null;
};

// AgentPayload is the grouped configuration object sent to POST /v1/agents and
// PATCH /v1/agents/{id}. Both endpoints treat absent sections/fields as
// "leave at default / unchanged".
export type AgentPayload = {
  agent?: Partial<ApiAgentSection>;
  model?: ApiModelSection;
  prompt?: ApiPromptSection;
  voice?: ApiVoiceSection;
  transcriber?: ApiTranscriberSection;
  knowledge_base?: ApiKnowledgeBaseSection;
  tools?: ApiToolsSection;
};

export type ApiAgentResource = {
  id: string;
  created_at: string;
  updated_at: string;
  agent?: ApiAgentSection | null;
  model?: ApiModelSection | null;
  prompt?: ApiPromptSection | null;
  voice?: ApiVoiceSection | null;
  transcriber?: ApiTranscriberSection | null;
  knowledge_base?: ApiKnowledgeBaseSection | null;
  tools?: ApiToolsSection | null;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type AgentCredential =
  | { kind: "apiKey"; apiKey: string }
  | { kind: "auth"; getToken: AuthTokenGetter };

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  credential: AgentCredential
): Promise<T> {
  let response: Response;
  try {
    response =
      credential.kind === "apiKey"
        ? await serverFetchWithAPIKey(path, credential.apiKey, init)
        : await serverFetch(path, init, credential.getToken);
  } catch {
    throw new ApiError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // Non-JSON body; fall through to the status-based error below.
  }

  if (!response.ok || !envelope?.success) {
    const message = envelope?.message || `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return envelope.data;
}

// listAgents returns the API key owner's agents, newest first. A single page of
// 100 is plenty until real pagination lands in the UI.
export function listAgents(apiKey: string): Promise<ApiAgentResource[]> {
  return request<ApiAgentResource[]>("/v1/agents?limit=100", undefined, { kind: "apiKey", apiKey });
}

export function createAgent(payload: AgentPayload, apiKey: string): Promise<ApiAgentResource> {
  return request<ApiAgentResource>("/v1/agents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, { kind: "apiKey", apiKey });
}

export function getAgent(agentId: string, apiKey: string): Promise<ApiAgentResource> {
  return request<ApiAgentResource>(`/v1/agents/${encodeURIComponent(agentId)}`, undefined, {
    kind: "apiKey",
    apiKey,
  });
}

// updateAgent applies a partial update; only the fields present in payload
// change, and the attachment sets (knowledge_base_ids, tool_ids) are replaced
// wholesale when present.
export function updateAgent(
  agentId: string,
  payload: AgentPayload,
  apiKey: string
): Promise<ApiAgentResource> {
  return request<ApiAgentResource>(`/v1/agents/${encodeURIComponent(agentId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, { kind: "apiKey", apiKey });
}

export function deleteAgent(
  agentId: string,
  apiKey: string
): Promise<{ id: string; deleted: boolean }> {
  return request<{ id: string; deleted: boolean }>(`/v1/agents/${encodeURIComponent(agentId)}`, {
    method: "DELETE",
  }, { kind: "apiKey", apiKey });
}

// Dashboard agent calls use the signed-in user's Clerk session. The server
// keeps these separate from /v1/agents so the public API remains API-key-only.
export function listDashboardAgents(getToken: AuthTokenGetter): Promise<ApiAgentResource[]> {
  return request<ApiAgentResource[]>("/v1/dashboard/agents?limit=100", undefined, {
    kind: "auth",
    getToken,
  });
}

export function createDashboardAgent(
  payload: AgentPayload,
  getToken: AuthTokenGetter
): Promise<ApiAgentResource> {
  return request<ApiAgentResource>("/v1/dashboard/agents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, { kind: "auth", getToken });
}

export function updateDashboardAgent(
  agentId: string,
  payload: AgentPayload,
  getToken: AuthTokenGetter
): Promise<ApiAgentResource> {
  return request<ApiAgentResource>(`/v1/dashboard/agents/${encodeURIComponent(agentId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, { kind: "auth", getToken });
}

export function deleteDashboardAgent(
  agentId: string,
  getToken: AuthTokenGetter
): Promise<{ id: string; deleted: boolean }> {
  return request<{ id: string; deleted: boolean }>(
    `/v1/dashboard/agents/${encodeURIComponent(agentId)}`,
    { method: "DELETE" },
    { kind: "auth", getToken }
  );
}
