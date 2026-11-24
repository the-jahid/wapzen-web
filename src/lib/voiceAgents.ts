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
  meta?: { pagination?: { page: number; total_items: number; total_pages: number } };
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
  return (await requestEnvelope<T>(path, init, getToken)).data;
}

async function requestEnvelope<T>(path: string, init: RequestInit | undefined, getToken: AuthTokenGetter): Promise<Envelope<T>> {
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

  return envelope;
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
  payload: { phone_number_id: string; to: string; agent_id?: string; broadcast_contact_id?: string },
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

// Broadcasts: a user can create any number, each with one of their voice
// agents selected. agent_id goes null only if that agent is deleted later.

export type ApiBroadcast = {
  id: string;
  name: string;
  agent_id: string | null;
  agent_name: string | null;
  // Auto-dialer switch. paused_reason is set when the server paused it itself
  // (number disconnected, minutes used up, agent can't call out).
  paused: boolean;
  paused_reason: string | null;
  created_at: string;
  updated_at: string;
};

export function listBroadcasts(getToken: AuthTokenGetter): Promise<ApiBroadcast[]> {
  return request<ApiBroadcast[]>("/v1/dashboard/voice/broadcasts", undefined, getToken);
}

export function createBroadcast(payload: { name: string; agent_id: string }, getToken: AuthTokenGetter): Promise<ApiBroadcast> {
  return request<ApiBroadcast>("/v1/dashboard/voice/broadcasts", json("POST", payload), getToken);
}

export function updateBroadcast(
  broadcastId: string,
  payload: { name?: string; agent_id?: string; paused?: boolean },
  getToken: AuthTokenGetter
): Promise<ApiBroadcast> {
  return request<ApiBroadcast>(`/v1/dashboard/voice/broadcasts/${encodeURIComponent(broadcastId)}`, json("PATCH", payload), getToken);
}

export function deleteBroadcast(broadcastId: string, getToken: AuthTokenGetter): Promise<unknown> {
  return request<unknown>(`/v1/dashboard/voice/broadcasts/${encodeURIComponent(broadcastId)}`, { method: "DELETE" }, getToken);
}

// Broadcast contacts: the people a broadcast calls. phone_number is required
// and comes back in E.164; the same number may be added any number of times,
// each its own contact with its own call. Every contact added is queued and the server's auto-dialer
// calls it from the broadcast agent's number.

export type ApiBroadcastContact = {
  id: string;
  broadcast_id: string;
  phone_number: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  address: string | null;
  // Auto-dialer state; last_error explains "failed".
  call_status: BroadcastContactStatus;
  last_call_id: string | null;
  last_error: string | null;
  created_at: string;
};

export type BroadcastContactStatus = "idle" | "queued" | "calling" | "answered" | "no_answer" | "failed";

export type BroadcastContactInput = {
  phone_number: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
};

function contactsPath(broadcastId: string) {
  return `/v1/dashboard/voice/broadcasts/${encodeURIComponent(broadcastId)}/contacts`;
}

export type BroadcastContactSort = "created" | "name" | "first" | "last";

export type BroadcastContactQuery = {
  page: number;
  search: string;
  sort: BroadcastContactSort;
  desc: boolean;
};

// Counts over the whole broadcast, whatever the page or search.
export type BroadcastContactStats = {
  total: number;
  idle: number;
  queued: number;
  calling: number;
  answered: number;
  no_answer: number;
  failed: number;
  with_email: number;
  with_address: number;
  // Who is being called right now, if anyone.
  calling_name: string | null;
};

export type BroadcastContactPage = {
  contacts: ApiBroadcastContact[];
  stats: BroadcastContactStats;
  // Contacts matching the search, over all pages.
  total: number;
  totalPages: number;
};

export const BROADCAST_CONTACTS_PAGE_SIZE = 10;

// One page of contacts; the server searches, sorts and pages.
export async function listBroadcastContacts(broadcastId: string, query: BroadcastContactQuery, getToken: AuthTokenGetter): Promise<BroadcastContactPage> {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(BROADCAST_CONTACTS_PAGE_SIZE),
    sort: query.sort,
    order: query.desc ? "desc" : "asc",
  });
  if (query.search) params.set("search", query.search);
  const envelope = await requestEnvelope<{ contacts: ApiBroadcastContact[]; stats: BroadcastContactStats }>(`${contactsPath(broadcastId)}?${params}`, undefined, getToken);
  return {
    ...envelope.data,
    total: envelope.meta?.pagination?.total_items ?? envelope.data.contacts.length,
    totalPages: Math.max(1, envelope.meta?.pagination?.total_pages ?? 1),
  };
}

export function createBroadcastContact(broadcastId: string, payload: BroadcastContactInput, getToken: AuthTokenGetter): Promise<ApiBroadcastContact> {
  return request<ApiBroadcastContact>(contactsPath(broadcastId), json("POST", payload), getToken);
}

export function deleteBroadcastContact(broadcastId: string, contactId: string, getToken: AuthTokenGetter): Promise<unknown> {
  return request<unknown>(`${contactsPath(broadcastId)}/${encodeURIComponent(contactId)}`, { method: "DELETE" }, getToken);
}

// generateCallSummary (re)writes a call's summary with Gemini from its saved
// transcript. New calls get one automatically a few seconds after they end;
// this is for older calls and for redoing one.
export function generateCallSummary(callId: string, getToken: AuthTokenGetter): Promise<{ summary: string }> {
  return request<{ summary: string }>(`/v1/dashboard/calls/${encodeURIComponent(callId)}/summary`, { method: "POST" }, getToken);
}

export function getBroadcast(broadcastId: string, getToken: AuthTokenGetter): Promise<ApiBroadcast> {
  return request<ApiBroadcast>(`/v1/dashboard/voice/broadcasts/${encodeURIComponent(broadcastId)}`, undefined, getToken);
}

export type BroadcastImportResult = {
  added: number;
  invalid: { row: number; phone_number: string; reason: string }[];
};

// importBroadcastContacts adds up to 5,000 contacts at once. Every added
// contact is queued and the server calls them one after another, in this
// order. Bad rows come back in `invalid` (row is 1-based in `contacts`).
export function importBroadcastContacts(broadcastId: string, contacts: BroadcastContactInput[], getToken: AuthTokenGetter): Promise<BroadcastImportResult> {
  return request<BroadcastImportResult>(`${contactsPath(broadcastId)}/import`, json("POST", { contacts }), getToken);
}
