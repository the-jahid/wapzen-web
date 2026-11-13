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
  // Names the code qr_code is a picture of. Absent from older servers.
  qr_id?: string | null;
  // How long qr_code stays scannable, counted from when the server answered:
  // WhatsApp gives the first code 60s and each later one 20s. Only on an
  // unscanned QR login.
  qr_expires_in_ms?: number | null;
  // Set only on an unscanned login started with startPhoneNumberCodeLogin: the
  // "ABCD-EFGH" code the user types into WhatsApp instead of scanning.
  pairing_code?: string | null;
  // How long pairing_code can still be typed in, counted from when the server
  // answered. Only alongside pairing_code.
  pairing_expires_in_ms?: number | null;
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

// Mobile data drops requests, and a server restart looks the same to the browser,
// so a request that never got an answer is sent again before the user hears of it.
const unansweredRetryDelaysMs = [1000, 3000, 6000];

async function fetchWithRetries(
  path: string,
  init: RequestInit | undefined,
  getToken: AuthTokenGetter,
  retryDelaysMs: number[]
): Promise<Response> {
  for (const delayMs of retryDelaysMs) {
    try {
      return await serverFetch(path, init, getToken);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return serverFetch(path, init, getToken);
}

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  getToken: AuthTokenGetter,
  retryDelaysMs: number[] = []
): Promise<T> {
  let response: Response;
  try {
    response = await fetchWithRetries(path, init, getToken, retryDelaysMs);
  } catch {
    throw new PhoneNumberError("Could not connect. Check your internet and try again in a minute.", 0);
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

// The QR picture each login was last given, by the id it is asked about. A
// waiting login is asked about every 2 seconds and its picture changes every
// 20 to 60, so the server is told which one is already here and sends only a
// new one. Callers still get qr_code on every answer.
const heldQrs = new Map<string, { id: string; code: string }>();
const MAX_HELD_QRS = 8;

function holdQr(askedId: string, login: ApiPhoneNumber) {
  if (!login.qr_id || !login.qr_code) return;
  heldQrs.delete(askedId);
  heldQrs.set(askedId, { id: login.qr_id, code: login.qr_code });
  if (heldQrs.size > MAX_HELD_QRS) heldQrs.delete(heldQrs.keys().next().value as string);
}

// A login as a login route answered it, with its QR picture kept for the
// status checks that follow.
async function startedLogin(pending: Promise<ApiPhoneNumber>): Promise<ApiPhoneNumber> {
  const login = await pending;
  holdQr(login.id, login);
  return login;
}

export async function getPhoneNumber(phoneNumberId: string, getToken: AuthTokenGetter): Promise<ApiPhoneNumber> {
  const path = `/v1/phone-number/${encodeURIComponent(phoneNumberId)}`;
  const held = heldQrs.get(phoneNumberId);
  if (!held) {
    const login = await request<ApiPhoneNumber>(path, undefined, getToken);
    holdQr(phoneNumberId, login);
    return login;
  }

  const login = await request<ApiPhoneNumber>(`${path}?have_qr=${encodeURIComponent(held.id)}`, undefined, getToken);
  if (login.qr_code || !login.qr_id) {
    // A new code, or no code any more: the login linked, ended or uses a
    // pairing code. An older server sends the picture every time and lands here.
    if (login.qr_id) holdQr(phoneNumberId, login);
    else heldQrs.delete(phoneNumberId);
    return login;
  }
  // The picture was left out because the one held is still the one on show.
  if (login.qr_id === held.id) return { ...login, qr_code: held.code };
  // Left out for a picture that isn't here. It shouldn't happen; ask for it.
  heldQrs.delete(phoneNumberId);
  const whole = await request<ApiPhoneNumber>(path, undefined, getToken);
  holdQr(phoneNumberId, whole);
  return whole;
}

// startPhoneNumberLogin opens a QR login session. agent_id hands the number the
// scan links to that agent the moment WhatsApp connects it, so a login started
// from an agent's editor needs no follow-up assignment; the server skips it when
// the agent already has a number, and rejects an id that is not the caller's.
//
// This and the two below are safe to send twice: the server hands back a running
// QR login and retires an earlier code once the new one is ready. The restart and
// re-pair calls further down aren't, so they don't retry.
export function startPhoneNumberLogin(
  payload: { phone_number?: string; label?: string; agent_id?: string },
  getToken: AuthTokenGetter
): Promise<ApiPhoneNumber> {
  return startedLogin(request<ApiPhoneNumber>("/v1/phone-number/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, getToken, unansweredRetryDelaysMs));
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
  return startedLogin(request<ApiPhoneNumber>("/v1/phone-number/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, pairing_method: "phone_code" }),
  }, getToken, unansweredRetryDelaysMs));
}

// startPhoneNumberQrLogin is the way back from a pairing code. Plain
// startPhoneNumberLogin hands back any login already running, a code included;
// this ends the code and returns a QR login, so the caller must swap it in.
export function startPhoneNumberQrLogin(
  payload: { label?: string; agent_id?: string },
  getToken: AuthTokenGetter
): Promise<ApiPhoneNumber> {
  return startedLogin(request<ApiPhoneNumber>("/v1/phone-number/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, pairing_method: "qr" }),
  }, getToken, unansweredRetryDelaysMs));
}

// restartPhoneNumberLogin reissues a QR code for a session that expired or
// failed. agentId carries the same meaning as in startPhoneNumberLogin: the
// agent whose editor asked for the new code still gets the number.
export function restartPhoneNumberLogin(
  phoneNumberId: string,
  getToken: AuthTokenGetter,
  agentId?: string
): Promise<ApiPhoneNumber> {
  return startedLogin(request<ApiPhoneNumber>("/v1/phone-number/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number_id: phoneNumberId, ...(agentId ? { agent_id: agentId } : {}) }),
  }, getToken));
}

export function rePairPhoneNumber(
  phoneNumberId: string,
  getToken: AuthTokenGetter
): Promise<ApiPhoneNumber> {
  return startedLogin(request<ApiPhoneNumber>("/v1/phone-number/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number_id: phoneNumberId, force_repair: true }),
  }, getToken));
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
