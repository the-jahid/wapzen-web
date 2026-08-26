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

async function resolveAuthToken(authTokenGetter: AuthTokenGetter | null = getAuthToken): Promise<string | null> {
  if (!authTokenGetter) return null;

  for (const delayMs of authTokenRetryDelaysMs) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const token = await authTokenGetter({ skipCache: true });
    if (token) return token;
  }

  return null;
}

export async function serverFetch(
  path: string,
  init?: RequestInit,
  authTokenGetter?: AuthTokenGetter
): Promise<Response> {
  const token = await resolveAuthToken(authTokenGetter ?? getAuthToken);

  if (shouldLogAuthToken) {
    console.log("[Clerk token]", token);
  }

  return serverFetchWithBearerToken(path, token, init);
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
