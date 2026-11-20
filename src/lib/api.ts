import { noteAccountBlocked } from "./accountBlocked";

const baseServerURL = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

// Account-level API calls use Clerk's getToken so every request can resolve a
// fresh session token at the moment it is sent. Live agent API calls use the
// generated API-key helper below instead.
export type AuthTokenGetter = (options?: { skipCache?: boolean }) => Promise<string | null>;

let getAuthToken: AuthTokenGetter | null = null;
const authTokenRetryDelaysMs = [0, 100, 250];
const shouldLogAuthToken = process.env.NODE_ENV !== "production";

export function setAuthTokenGetter(getter: AuthTokenGetter | null) {
  getAuthToken = getter;
}

export function serverURL(path: string): string {
  if (!baseServerURL) {
    throw new Error("NEXT_PUBLIC_BASE_SERVER_URL is not configured");
  }

  const base = baseServerURL.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;

  return `${base}${suffix}`;
}

// Clerk caches the session token and refreshes it before it expires, so the
// cached one is what a request normally sends. Skipping the cache costs a round
// trip to Clerk per request, and Clerk answers those one at a time: a page that
// loads four lists sat behind four sequential token fetches. skipCache is kept
// for the retry after the server has rejected a cached token.
async function resolveAuthToken(
  authTokenGetter: AuthTokenGetter | null = getAuthToken,
  skipCache = false
): Promise<string | null> {
  if (!authTokenGetter) return null;

  for (const delayMs of authTokenRetryDelaysMs) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const token = await authTokenGetter(skipCache ? { skipCache: true } : undefined);
    if (!token) continue;
    if (skipCache) {
      noteClockSkew(token);
      return token;
    }
    if (!expiredByServerClock(token)) return token;
    const freshToken = await authTokenGetter({ skipCache: true });
    if (freshToken) noteClockSkew(freshToken);
    return freshToken ?? token;
  }

  return null;
}

// Clerk judges a cached token fresh by this computer's clock, so a clock that
// runs slow keeps sending tokens the server already sees as expired (one
// dashboard user's ran over a minute behind). A token minted on request was
// issued "now" by Clerk's clock, which tells us how far behind this one is.
let clockBehindSeconds = 0;

function noteClockSkew(freshToken: string) {
  const iat = tokenClaim(freshToken, "iat");
  if (iat === null) return;
  clockBehindSeconds = Math.max(0, iat - Date.now() / 1000);
}

// Only once a slow clock has been seen; otherwise Clerk's own check is right.
function expiredByServerClock(token: string): boolean {
  if (clockBehindSeconds < 5) return false;
  const exp = tokenClaim(token, "exp");
  return exp !== null && exp - (Date.now() / 1000 + clockBehindSeconds) <= 5;
}

function tokenClaim(token: string, claim: "iat" | "exp"): number | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const value = JSON.parse(atob(payload))[claim];
    return typeof value === "number" ? value : null;
  } catch {
    return null;
  }
}

// Phones drop the network for a moment all the time: the page comes back from
// the background and refreshes before the radio is up, the connection hops
// between Wi-Fi and mobile data, or a deploy answers one request with a proxy
// error that carries no CORS headers. Each of those used to surface as "could
// not reach the server" while the server was fine, so a request is tried a few
// more times before it fails. Reads are retried on any network failure; writes
// only when the request never left (offline, or no token yet), so a message or
// order is never sent twice.
const networkRetryDelaysMs = [400, 1200, 2500];
const retryableStatuses = new Set([502, 503, 504]);
const waitForOnlineMs = 8000;

function isReadRequest(init?: RequestInit): boolean {
  const method = (init?.method ?? "GET").toUpperCase();
  return method === "GET" || method === "HEAD";
}

function wasAborted(init?: RequestInit): boolean {
  return Boolean(init?.signal?.aborted);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// While the browser says it is offline a request fails without being sent, so
// wait a little for the connection to come back first.
function waitUntilOnline(): Promise<void> {
  if (typeof navigator === "undefined" || navigator.onLine !== false) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      window.removeEventListener("online", done);
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(done, waitForOnlineMs);
    window.addEventListener("online", done);
  });
}

async function resolveAuthTokenWithRetry(getter: AuthTokenGetter | null, skipCache = false): Promise<string | null> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await resolveAuthToken(getter, skipCache);
    } catch (error) {
      // Clerk throws when it cannot refresh the session over a dead network.
      if (attempt >= networkRetryDelaysMs.length) throw error;
      await waitUntilOnline();
      await sleep(networkRetryDelaysMs[attempt]);
    }
  }
}

async function fetchWithRetry(path: string, token: string | null, init?: RequestInit): Promise<Response> {
  const canRetrySent = isReadRequest(init);
  for (let attempt = 0; ; attempt += 1) {
    await waitUntilOnline();
    const offlineBefore = typeof navigator !== "undefined" && navigator.onLine === false;
    const lastAttempt = attempt >= networkRetryDelaysMs.length;
    let response: Response;
    try {
      response = await serverFetchWithBearerToken(path, token, init);
    } catch (error) {
      if (lastAttempt || wasAborted(init) || !(canRetrySent || offlineBefore)) throw error;
      await sleep(networkRetryDelaysMs[attempt]);
      continue;
    }
    if (!canRetrySent || lastAttempt || !retryableStatuses.has(response.status)) return response;
    await sleep(networkRetryDelaysMs[attempt]);
  }
}

export async function serverFetch(
  path: string,
  init?: RequestInit,
  authTokenGetter?: AuthTokenGetter
): Promise<Response> {
  const getter = authTokenGetter ?? getAuthToken;
  const token = await resolveAuthTokenWithRetry(getter);

  if (shouldLogAuthToken) {
    console.log("[Clerk token]", token);
  }

  const response = await fetchWithRetry(path, token, init);
  if (response.status !== 401 || !token) return response;

  // A cached token can go stale between Clerk's refreshes (a sleeping laptop,
  // a clock skew); mint a fresh one and send the request once more. Request
  // bodies here are strings or FormData, so they can be sent again.
  const freshToken = await resolveAuthTokenWithRetry(getter, true);
  if (!freshToken || freshToken === token) return response;
  return fetchWithRetry(path, freshToken, init);
}

export function serverFetchWithBearerToken(
  path: string,
  token: string | null | undefined,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  // Free ngrok tunnels answer browser requests with an HTML warning page
  // unless this header is present.
  if (baseServerURL?.includes(".ngrok")) {
    headers.set("ngrok-skip-browser-warning", "1");
  }

  return fetch(serverURL(path), { ...init, headers }).then((response) => {
    noteAccountBlocked(response);
    return response;
  });
}

export function serverFetchWithAPIKey(path: string, apiKey: string, init?: RequestInit): Promise<Response> {
  return serverFetchWithBearerToken(path, apiKey.trim(), init);
}
