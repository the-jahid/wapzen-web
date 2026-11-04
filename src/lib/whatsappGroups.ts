import { serverFetch, type AuthTokenGetter } from "./api";

// The WhatsApp groups a connected number is in, read live from WhatsApp, and the
// AI switch on each. Every group starts off.

export type ApiWhatsAppGroup = {
  jid: string;
  name: string;
  member_count: number;
  // False in an admins-only group when this number isn't an admin: a reply
  // would be refused, so the AI can't be switched on there.
  can_send: boolean;
  ai_enabled: boolean;
};

export type ApiGroupList = {
  // The agent that answers on this number, if it has one.
  chat_agent: { id: string; name: string; status: string } | null;
  groups: ApiWhatsAppGroup[];
};

type Envelope<T> = { success: boolean; message: string; data: T };

export class WhatsAppGroupError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "WhatsAppGroupError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit | undefined, getToken: AuthTokenGetter): Promise<T> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new WhatsAppGroupError("Could not reach the server. Is the backend running?", 0);
  }
  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // The status fallback below covers an unexpected non-JSON response.
  }
  if (!response.ok || !envelope?.success) {
    throw new WhatsAppGroupError(envelope?.message || `Request failed (${response.status})`, response.status);
  }
  return envelope.data;
}

function groupsPath(phoneNumberId: string) {
  return `/v1/phone-number/${encodeURIComponent(phoneNumberId)}/groups`;
}

export function listWhatsAppGroups(phoneNumberId: string, getToken: AuthTokenGetter) {
  return request<ApiGroupList>(groupsPath(phoneNumberId), undefined, getToken);
}

export function setGroupAi(phoneNumberId: string, jid: string, on: boolean, getToken: AuthTokenGetter) {
  return request<{ jid: string; ai_enabled: boolean }>(
    `${groupsPath(phoneNumberId)}/${encodeURIComponent(jid)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ai_enabled: on }),
    },
    getToken
  );
}
