import { serverFetch, type AuthTokenGetter } from "./api";

// Wire types mirroring the Go server's Call model (see server/internal/models/
// call.go). Every field the server may null out is optional/nullable here so
// mapping code has to handle it.

// "declined" is an outbound call the callee cut while it was still ringing: it
// never connected, so it is never "ended" and has no duration.
export type CallStatus = "received" | "answered" | "ended" | "declined" | "failed";
export type CallType = "inbound" | "outbound";

export type ApiCallMessage = {
  role: string;
  content: string;
};

export type ApiCall = {
  id: string;
  call_id: string;
  phone_number_id?: string | null;
  agent_id?: string | null;
  // Set only on a call an outbound campaign placed, which is what lets a
  // campaign list its own calls.
  campaign_id?: string | null;
  lead_id?: string | null;
  peer: string;
  call_type: string;
  status: string;
  end_reason?: string | null;
  duration_seconds?: number | null;
  answered_at?: string | null;
  ended_at?: string | null;
  created_at: string;
  updated_at: string;
  // Populated by the Get endpoint; omitted from list responses.
  messages?: ApiCallMessage[] | null;
};

// The set of statuses the server accepts on an update (mirrors
// models.CallStatuses / the calls.status CHECK constraint).
export const callStatuses: CallStatus[] = ["received", "answered", "ended", "declined", "failed"];

// UpdateCallPayload is the partial-update body accepted by PATCH
// /v1/dashboard/calls/{id}. At least one field must be present; an absent field
// leaves the stored value untouched. Only status and end_reason may change.
export type UpdateCallPayload = {
  status?: CallStatus;
  end_reason?: string | null;
};

// CreateCallPayload is the Create Call body accepted by POST
// /v1/dashboard/calls. agent_id is optional: the phone number already carries
// the agent that speaks on its calls, so sending one only asserts which agent
// that is, and naming a different one is rejected rather than quietly honoured.
export type CreateCallPayload = {
  phone_number_id: string;
  to: string;
  agent_id?: string;
};

type FieldError = {
  field: string;
  message: string;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  // Only 400s carry this; it names the offending body fields.
  errors?: FieldError[] | null;
};

export class CallError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CallError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit | undefined, getToken: AuthTokenGetter): Promise<T> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new CallError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // Non-JSON body; fall through to the status-based error below.
  }

  if (!response.ok || !envelope?.success) {
    // A validation failure says "Invalid request body" at the top level and puts
    // the useful part in errors[], so prefer those when they are there.
    const fieldMessages = (envelope?.errors ?? []).map((error) => error.message).filter(Boolean);
    const message = fieldMessages.length
      ? fieldMessages.join(" ")
      : envelope?.message || `Request failed (${response.status})`;
    throw new CallError(message, response.status);
  }

  return envelope.data;
}

// Dashboard call routes use the signed-in user's Clerk session. The server
// keeps these separate from the API-key-only /v1/calls routes so the public API
// remains API-key-only.

// Paging matches the agents collection: a 1-based page plus a page size
// (1-200, default 50). The server also returns meta.pagination and links, which
// this helper drops — callers that need them should read the envelope directly.
export function listCalls(
  getToken: AuthTokenGetter,
  params?: { page?: number; limit?: number }
): Promise<ApiCall[]> {
  const search = new URLSearchParams();
  if (params?.page != null) search.set("page", String(params.page));
  if (params?.limit != null) search.set("limit", String(params.limit));
  const query = search.toString();
  return request<ApiCall[]>(`/v1/dashboard/calls${query ? `?${query}` : ""}`, undefined, getToken);
}

// createCall places an outbound call and returns as soon as the callee's phone
// is ringing: the row comes back as "received" and only later becomes
// "answered" (picked up) or "declined" (cut while ringing), so callers that
// want the outcome have to poll getCall.
export function createCall(payload: CreateCallPayload, getToken: AuthTokenGetter): Promise<ApiCall> {
  return request<ApiCall>("/v1/dashboard/calls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, getToken);
}

export function getCall(callId: string, getToken: AuthTokenGetter): Promise<ApiCall> {
  return request<ApiCall>(`/v1/dashboard/calls/${encodeURIComponent(callId)}`, undefined, getToken);
}

export function updateCall(
  callId: string,
  payload: UpdateCallPayload,
  getToken: AuthTokenGetter
): Promise<ApiCall> {
  return request<ApiCall>(`/v1/dashboard/calls/${encodeURIComponent(callId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, getToken);
}

export function deleteCall(
  callId: string,
  getToken: AuthTokenGetter
): Promise<{ id: string; deleted: boolean }> {
  return request<{ id: string; deleted: boolean }>(`/v1/dashboard/calls/${encodeURIComponent(callId)}`, {
    method: "DELETE",
  }, getToken);
}
