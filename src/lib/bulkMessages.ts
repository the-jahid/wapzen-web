import { serverFetch, type AuthTokenGetter } from "./api";

// Wire types for bulk messages: one templated message sent from one WhatsApp
// number to a list of people, one message every interval_seconds. The server
// does the sending on its own timer, so a send keeps going with this page
// closed; the page only starts, pauses, resumes and watches it.

export type BulkStatus = "running" | "paused" | "completed" | "cancelled";
export type RecipientStatus = "pending" | "sending" | "sent" | "failed" | "skipped";

export const DEFAULT_INTERVAL_SECONDS = 30;
export const MIN_INTERVAL_SECONDS = 10;
export const MAX_INTERVAL_SECONDS = 3600;
export const MAX_RECIPIENTS = 5000;

export type ApiBulkMessage = {
  id: string;
  name: string;
  phone_number_id: string | null;
  phone_number: string | null;
  phone_number_status: string | null;
  message: string;
  interval_seconds: number;
  status: BulkStatus;
  total_count: number;
  sent_count: number;
  failed_count: number;
  pending_count: number;
  next_send_at: string | null;
  last_error: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiBulkRecipient = {
  id: string;
  position: number;
  phone: string;
  variables: Record<string, string>;
  status: RecipientStatus;
  error: string | null;
  sent_at: string | null;
};

export type ApiMessageTemplate = {
  id: string;
  name: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type NewBulkMessage = {
  name: string;
  phone_number_id: string;
  message: string;
  interval_seconds: number;
  recipients: { phone: string; variables: Record<string, string> }[];
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: { field: string; message: string }[];
  meta?: { pagination?: { total_items?: number } };
};

export class BulkMessageError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BulkMessageError";
    this.status = status;
  }
}

const bulkPath = "/v1/dashboard/bulk-messages";
const templatesPath = "/v1/dashboard/message-templates";

async function request<T>(path: string, init: RequestInit | undefined, getToken: AuthTokenGetter): Promise<Envelope<T>> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new BulkMessageError("Could not reach the server. Is the backend running?", 0);
  }
  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // The status fallback below covers an unexpected non-JSON response.
  }
  if (!response.ok || !envelope?.success) {
    // A validation error names the field; the first one is the most useful.
    const detail = envelope?.errors?.[0]?.message;
    throw new BulkMessageError(detail || envelope?.message || `Request failed (${response.status})`, response.status);
  }
  return envelope;
}

function json(method: string, body?: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}

export async function listBulkMessages(getToken: AuthTokenGetter) {
  return (await request<ApiBulkMessage[]>(bulkPath, undefined, getToken)).data ?? [];
}

export async function createBulkMessage(input: NewBulkMessage, getToken: AuthTokenGetter) {
  return (await request<ApiBulkMessage>(bulkPath, json("POST", input), getToken)).data;
}

export async function listBulkRecipients(
  id: string,
  getToken: AuthTokenGetter,
  options: { page?: number; limit?: number; status?: RecipientStatus | "" } = {}
) {
  const params = new URLSearchParams({ page: String(options.page ?? 1), limit: String(options.limit ?? 50) });
  if (options.status) params.set("status", options.status);
  const envelope = await request<ApiBulkRecipient[]>(
    `${bulkPath}/${encodeURIComponent(id)}/recipients?${params.toString()}`,
    undefined,
    getToken
  );
  return { items: envelope.data ?? [], total: envelope.meta?.pagination?.total_items ?? 0 };
}

export async function changeBulkMessage(
  id: string,
  action: "pause" | "resume" | "cancel",
  getToken: AuthTokenGetter
) {
  return (await request<ApiBulkMessage>(`${bulkPath}/${encodeURIComponent(id)}/${action}`, json("POST"), getToken)).data;
}

export async function deleteBulkMessage(id: string, getToken: AuthTokenGetter) {
  await request(`${bulkPath}/${encodeURIComponent(id)}`, { method: "DELETE" }, getToken);
}

export async function listMessageTemplates(getToken: AuthTokenGetter) {
  return (await request<ApiMessageTemplate[]>(templatesPath, undefined, getToken)).data ?? [];
}

export async function saveMessageTemplate(
  input: { name: string; body: string },
  getToken: AuthTokenGetter,
  id?: string
) {
  const path = id ? `${templatesPath}/${encodeURIComponent(id)}` : templatesPath;
  return (await request<ApiMessageTemplate>(path, json(id ? "PATCH" : "POST", input), getToken)).data;
}

export async function deleteMessageTemplate(id: string, getToken: AuthTokenGetter) {
  await request(`${templatesPath}/${encodeURIComponent(id)}`, { method: "DELETE" }, getToken);
}

// The same filling the server does when it sends, so the preview matches what
// arrives: {{Column}} matches a column whatever its case or spacing, {{phone}}
// is the number, and a column the row doesn't have becomes empty.
export function variableKey(header: string) {
  return header.trim().toLowerCase().replace(/\s+/g, " ");
}

export function renderMessage(template: string, phone: string, variables: Record<string, string>) {
  return template
    .replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (_match, key: string) => {
      const name = variableKey(key);
      if (name === "phone" && !variables.phone) return phone;
      return variables[name] ?? "";
    })
    .trim();
}
