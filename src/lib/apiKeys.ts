import { serverFetch, type AuthTokenGetter } from "./api";

export type ApiKey = {
  id: string;
  name: string;
  isDefault: boolean;
  keyPrefix: string;
  last4: string;
  lastUsedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatedApiKey = ApiKey & {
  key: string;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export class ApiKeyError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiKeyError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit | undefined, getToken: AuthTokenGetter): Promise<T> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new ApiKeyError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // Non-JSON body; fall through to the status-based error below.
  }

  if (!response.ok || !envelope?.success) {
    const message = envelope?.message || `Request failed (${response.status})`;
    throw new ApiKeyError(message, response.status);
  }

  return envelope.data;
}

export function listApiKeys(getToken: AuthTokenGetter): Promise<ApiKey[]> {
  return request<ApiKey[]>("/v1/api-keys", undefined, getToken);
}

export function createApiKey(name: string, getToken: AuthTokenGetter): Promise<CreatedApiKey> {
  return request<CreatedApiKey>("/v1/api-keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  }, getToken);
}

export function setDefaultApiKey(apiKeyId: string, getToken: AuthTokenGetter): Promise<ApiKey> {
  return request<ApiKey>(`/v1/api-keys/${encodeURIComponent(apiKeyId)}/default`, {
    method: "PATCH",
  }, getToken);
}

export function deleteApiKey(
  apiKeyId: string,
  getToken: AuthTokenGetter
): Promise<{ id: string; revoked: boolean }> {
  return request<{ id: string; revoked: boolean }>(`/v1/api-keys/${encodeURIComponent(apiKeyId)}`, {
    method: "DELETE",
  }, getToken);
}
