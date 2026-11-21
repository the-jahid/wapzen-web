import { serverFetch, voiceServerURL, type AuthTokenGetter } from "./api";
import type { AgentPayload, ApiAgentResource } from "./agents";
import type { ApiCall } from "./calls";
import type { ApiKnowledgeBase } from "./knowledgeBases";
import type { ApiPhoneNumber } from "./phoneNumbers";
import type { ApiTool } from "./tools";

// The voice workspace talks to the Go server (server/), never to the chat
// server: voice has its own agents, numbers (voice_phone_numbers), tools
// (voice_tools) and knowledge bases (voice_knowledge_bases), and shares only the
// account with chat. voiceServerURL (lib/api) says where the Go server runs.

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: { field: string; message: string }[] | null;
};

export class VoiceApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "VoiceApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit | undefined, getToken: AuthTokenGetter): Promise<T> {
  let response: Response;
  try {
    response = await serverFetch(voiceServerURL(path), init, getToken);
  } catch {
    throw new VoiceApiError("Could not reach the voice server. Check your internet and try again.", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // Not JSON: fall through to the status-based message.
  }

  if (!response.ok || !envelope?.success) {
    const fieldMessages = (envelope?.errors ?? []).map((error) => error.message).filter(Boolean);
    const message = fieldMessages.length
      ? fieldMessages.join(" ")
      : envelope?.message || `Request failed (${response.status})`;
    throw new VoiceApiError(message, response.status);
  }

  return envelope.data;
}

function json(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// Agents: /v1/dashboard/agents (Clerk session; /v1/agents is the API-key twin).

export function listVoiceAgents(getToken: AuthTokenGetter): Promise<ApiAgentResource[]> {
  return request<ApiAgentResource[]>("/v1/dashboard/agents?limit=100", undefined, getToken);
}

export function createVoiceAgent(payload: AgentPayload, getToken: AuthTokenGetter): Promise<ApiAgentResource> {
  return request<ApiAgentResource>("/v1/dashboard/agents", json("POST", payload), getToken);
}

// PATCH is partial: only the sections and fields sent change, and the
// knowledge-base and tool id lists replace the attachments when present.
export function updateVoiceAgent(
  agentId: string,
  payload: AgentPayload,
  getToken: AuthTokenGetter
): Promise<ApiAgentResource> {
  return request<ApiAgentResource>(
    `/v1/dashboard/agents/${encodeURIComponent(agentId)}`,
    json("PATCH", payload),
    getToken
  );
}

export function deleteVoiceAgent(agentId: string, getToken: AuthTokenGetter): Promise<{ id: string; deleted: boolean }> {
  return request<{ id: string; deleted: boolean }>(
    `/v1/dashboard/agents/${encodeURIComponent(agentId)}`,
    { method: "DELETE" },
    getToken
  );
}

// Numbers: WhatsApp numbers linked for calling (voice_phone_numbers).

export function listVoicePhoneNumbers(getToken: AuthTokenGetter): Promise<ApiPhoneNumber[]> {
  return request<ApiPhoneNumber[]>("/v1/voice/phone-number", undefined, getToken);
}

export function getVoicePhoneNumber(phoneNumberId: string, getToken: AuthTokenGetter): Promise<ApiPhoneNumber> {
  return request<ApiPhoneNumber>(`/v1/voice/phone-number/${encodeURIComponent(phoneNumberId)}`, undefined, getToken);
}

// startVoiceNumberLogin opens a QR login. agent_id hands the number the scan
// links to that agent as soon as WhatsApp connects it.
export function startVoiceNumberLogin(payload: { agent_id?: string }, getToken: AuthTokenGetter): Promise<ApiPhoneNumber> {
  return request<ApiPhoneNumber>("/v1/voice/phone-number/login", json("POST", payload), getToken);
}

// startVoiceNumberCodeLogin is the same login for someone who can't scan: it
// comes back with a pairing code to type into WhatsApp. phone_number is E.164.
export function startVoiceNumberCodeLogin(
  payload: { phone_number: string; agent_id?: string },
  getToken: AuthTokenGetter
): Promise<ApiPhoneNumber> {
  return request<ApiPhoneNumber>(
    "/v1/voice/phone-number/login",
    json("POST", { ...payload, pairing_method: "phone_code" }),
    getToken
  );
}

// Knowledge bases and tools of the voice workspace.

export function listVoiceKnowledgeBases(getToken: AuthTokenGetter): Promise<ApiKnowledgeBase[]> {
  return request<ApiKnowledgeBase[]>("/v1/dashboard/voice/knowledge-base?page=1&limit=100", undefined, getToken);
}

export function listVoiceTools(getToken: AuthTokenGetter): Promise<ApiTool[]> {
  return request<ApiTool[]>("/v1/dashboard/voice/tools?page=1&limit=200", undefined, getToken);
}

// Calls. The list has no agent filter, so the editor takes the newest page and
// keeps the agent's own calls.

export function listVoiceCalls(getToken: AuthTokenGetter): Promise<ApiCall[]> {
  return request<ApiCall[]>("/v1/dashboard/calls?page=1&limit=200", undefined, getToken);
}

export function getVoiceCall(callId: string, getToken: AuthTokenGetter): Promise<ApiCall> {
  return request<ApiCall>(`/v1/dashboard/calls/${encodeURIComponent(callId)}`, undefined, getToken);
}

// placeVoiceCall rings `to` from the agent's number. It returns while the phone
// is still ringing ("received"); the outcome arrives on later reads.
export function placeVoiceCall(
  payload: { phone_number_id: string; to: string; agent_id?: string },
  getToken: AuthTokenGetter,
  signal?: AbortSignal
): Promise<ApiCall> {
  return request<ApiCall>("/v1/dashboard/calls", { ...json("POST", payload), signal }, getToken);
}

// hangupVoiceCall ends a call that is still ringing or connected. The final
// status (declined while ringing, ended once answered) lands a moment later, so
// keep reading the call with getVoiceCall. A call already over comes back as is.
export function hangupVoiceCall(callId: string, getToken: AuthTokenGetter): Promise<ApiCall> {
  return request<ApiCall>(`/v1/dashboard/calls/${encodeURIComponent(callId)}/hangup`, { method: "POST" }, getToken);
}

// Voice minutes: every account gets 10 free minutes (600 seconds) of voice
// agent calls. Once they are used up the agents neither answer nor place calls
// until more minutes are bought (by message; we raise the limit by hand).

export type ApiVoiceUsage = {
  used_seconds: number;
  limit_seconds: number;
  remaining_seconds: number;
  exhausted: boolean;
};

export function getVoiceUsage(getToken: AuthTokenGetter): Promise<ApiVoiceUsage> {
  return request<ApiVoiceUsage>("/v1/voice/usage", undefined, getToken);
}
