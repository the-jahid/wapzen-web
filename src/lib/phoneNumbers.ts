import { serverFetch, type AuthTokenGetter } from "./api";

export type PhoneNumberStatus =
  | "pending_qr"
  | "connected"
  | "disconnected"
  | "failed"
  | "expired";

export type ApiPhoneNumber = {
  id: string;
  phone_number?: string | null;
  label?: string | null;
  wa_jid?: string | null;
  status: PhoneNumberStatus;
  qr_code?: string | null;
  // How long qr_code stays scannable, counted from when the server answered:
  // WhatsApp gives the first code 60s and each later one 20s. Only on an
  // unscanned QR login.
  qr_expires_in_ms?: number | null;
  // Set only on an unscanned login started with startPhoneNumberCodeLogin: the
  // "ABCD-EFGH" code the user types into WhatsApp instead of scanning.
  pairing_code?: string | null;
  last_connected_at?: string | null;
  created_at: string;
  updated_at: string;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export class PhoneNumberError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PhoneNumberError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit | undefined, getToken: AuthTokenGetter): Promise<T> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new PhoneNumberError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // Non-JSON body; fall through to status error below.
  }

  if (!response.ok || !envelope?.success) {
    const message = envelope?.message || `Request failed (${response.status})`;
    throw new PhoneNumberError(message, response.status);
  }

  return envelope.data;
}

export function listPhoneNumbers(getToken: AuthTokenGetter): Promise<ApiPhoneNumber[]> {
  return request<ApiPhoneNumber[]>("/v1/phone-number", undefined, getToken);
}

export function getPhoneNumber(phoneNumberId: string, getToken: AuthTokenGetter): Promise<ApiPhoneNumber> {
  return request<ApiPhoneNumber>(`/v1/phone-number/${encodeURIComponent(phoneNumberId)}`, undefined, getToken);
}

// startPhoneNumberLogin opens a QR login session. agent_id hands the number the
// scan links to that agent the moment WhatsApp connects it, so a login started
// from an agent's editor needs no follow-up assignment; the server skips it when
// the agent already has a number, and rejects an id that is not the caller's.
export function startPhoneNumberLogin(
  payload: { phone_number?: string; label?: string; agent_id?: string },
  getToken: AuthTokenGetter
): Promise<ApiPhoneNumber> {
  return request<ApiPhoneNumber>("/v1/phone-number/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, getToken);
}

// startPhoneNumberCodeLogin is startPhoneNumberLogin for someone who can't scan
// (usually because the dashboard is open on the phone itself): the login comes
// back with a pairing_code to type into WhatsApp › Linked devices › Link with
// phone number instead. It ends any QR login the user has running, so the
// caller must swap the returned login in for that one. phone_number is E.164.
export function startPhoneNumberCodeLogin(
  payload: { phone_number: string; label?: string; agent_id?: string },
  getToken: AuthTokenGetter
): Promise<ApiPhoneNumber> {
  return request<ApiPhoneNumber>("/v1/phone-number/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, pairing_method: "phone_code" }),
  }, getToken);
}

// restartPhoneNumberLogin reissues a QR code for a session that expired or
// failed. agentId carries the same meaning as in startPhoneNumberLogin: the
// agent whose editor asked for the new code still gets the number.
export function restartPhoneNumberLogin(
  phoneNumberId: string,
  getToken: AuthTokenGetter,
  agentId?: string
): Promise<ApiPhoneNumber> {
  return request<ApiPhoneNumber>("/v1/phone-number/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number_id: phoneNumberId, ...(agentId ? { agent_id: agentId } : {}) }),
  }, getToken);
}

export function rePairPhoneNumber(
  phoneNumberId: string,
  getToken: AuthTokenGetter
): Promise<ApiPhoneNumber> {
  return request<ApiPhoneNumber>("/v1/phone-number/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number_id: phoneNumberId, force_repair: true }),
  }, getToken);
}

export function logoutPhoneNumber(
  phoneNumberId: string,
  getToken: AuthTokenGetter
): Promise<{ id: string; disconnected: boolean; deleted: boolean }> {
  return request<{ id: string; disconnected: boolean; deleted: boolean }>("/v1/phone-number/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number_id: phoneNumberId }),
  }, getToken);
}
