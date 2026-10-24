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
    if (token) return token;
  }

  return null;
}

export async function serverFetch(
  path: string,
  init?: RequestInit,
  authTokenGetter?: AuthTokenGetter
): Promise<Response> {
  const getter = authTokenGetter ?? getAuthToken;
  const token = await resolveAuthToken(getter);

  if (shouldLogAuthToken) {
    console.log("[Clerk token]", token);
  }

  const response = await serverFetchWithBearerToken(path, token, init);
  if (response.status !== 401 || !token) return response;

  // A cached token can go stale between Clerk's refreshes (a sleeping laptop,
  // a clock skew); mint a fresh one and send the request once more. Request
  // bodies here are strings or FormData, so they can be sent again.
  const freshToken = await resolveAuthToken(getter, true);
  if (!freshToken || freshToken === token) return response;
  return serverFetchWithBearerToken(path, freshToken, init);
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

  return fetch(serverURL(path), { ...init, headers });
}

export function serverFetchWithAPIKey(path: string, apiKey: string, init?: RequestInit): Promise<Response> {
  return serverFetchWithBearerToken(path, apiKey.trim(), init);
}
