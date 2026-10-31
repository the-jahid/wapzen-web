import { serverFetch, type AuthTokenGetter } from "./api";

// Wire types for the orders agents take during a conversation. An agent's
// create_order call writes them, so this client only reads an order, moves it
// through its statuses, notes on it, or deletes it.

export type OrderStatus = "new" | "confirmed" | "processing" | "completed" | "cancelled";

export const orderStatuses: { id: OrderStatus; label: string; accent: string }[] = [
  { id: "new", label: "New", accent: "primary" },
  { id: "confirmed", label: "Confirmed", accent: "sky" },
  { id: "processing", label: "Processing", accent: "amber" },
  { id: "completed", label: "Completed", accent: "green" },
  { id: "cancelled", label: "Cancelled", accent: "rose" },
];

export type ApiOrderItem = { name: string; quantity?: number; note?: string };

export type ApiOrder = {
  id: string;
  order_number: number;
  customer_name: string;
  phone: string;
  email: string | null;
  description: string;
  items: ApiOrderItem[];
  delivery_address: string | null;
  status: OrderStatus;
  channel: "chat" | "voice";
  internal_note: string | null;
  agent_id: string | null;
  // Null once the agent has been deleted; the order stays.
  agent_name: string | null;
  conversation_id: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderFilters = {
  search?: string;
  status?: OrderStatus | "";
  agentId?: string;
  // Calendar days as a date input gives them, read in the browser's time zone.
  dateFrom?: string;
  dateTo?: string;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: { new_orders?: number; pagination?: { total_items?: number } };
};

export class OrderError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "OrderError";
    this.status = status;
  }
}

const dashboardPath = "/v1/dashboard/orders";

async function send(
  path: string,
  init: RequestInit | undefined,
  getToken: AuthTokenGetter
): Promise<Response> {
  try {
    return await serverFetch(path, init, getToken);
  } catch {
    throw new OrderError("Could not reach the server. Is the backend running?", 0);
  }
}

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  getToken: AuthTokenGetter
): Promise<Envelope<T>> {
  const response = await send(path, init, getToken);
  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // The status fallback below covers an unexpected non-JSON response.
  }
  if (!response.ok || !envelope?.success) {
    throw new OrderError(envelope?.message || `Request failed (${response.status})`, response.status);
  }
  return envelope;
}

function filterParams(filters: OrderFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.status) params.set("status", filters.status);
  if (filters.agentId) params.set("agent_id", filters.agentId);
  if (filters.dateFrom) params.set("date_from", new Date(`${filters.dateFrom}T00:00:00`).toISOString());
  if (filters.dateTo) params.set("date_to", new Date(`${filters.dateTo}T23:59:59.999`).toISOString());
  return params;
}

// listOrders reads one page, newest first. total counts what the filters match;
// newOrders counts every order still marked new, whatever the filters.
export async function listOrders(
  getToken: AuthTokenGetter,
  options: OrderFilters & { page?: number; limit?: number } = {}
): Promise<{ items: ApiOrder[]; total: number; newOrders: number }> {
  const params = filterParams(options);
  params.set("page", String(options.page ?? 1));
  params.set("limit", String(options.limit ?? 50));
  const envelope = await request<ApiOrder[]>(`${dashboardPath}?${params.toString()}`, undefined, getToken);
  const items = envelope.data ?? [];
  return {
    items,
    total: envelope.meta?.pagination?.total_items ?? items.length,
    newOrders: envelope.meta?.new_orders ?? 0,
  };
}

export async function updateOrder(
  id: string,
  update: { status?: OrderStatus; internal_note?: string | null },
  getToken: AuthTokenGetter
): Promise<ApiOrder> {
  const envelope = await request<ApiOrder>(
    `${dashboardPath}/${encodeURIComponent(id)}`,
    { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(update) },
    getToken
  );
  return envelope.data;
}

export async function deleteOrder(id: string, getToken: AuthTokenGetter): Promise<void> {
  await request(`${dashboardPath}/${encodeURIComponent(id)}`, { method: "DELETE" }, getToken);
}

// exportOrders fetches the CSV of everything the filters match. It goes through
// fetch rather than a link because the route needs the Clerk token.
export async function exportOrders(filters: OrderFilters, getToken: AuthTokenGetter): Promise<Blob> {
  const response = await send(`${dashboardPath}/export?${filterParams(filters).toString()}`, undefined, getToken);
  if (!response.ok) throw new OrderError(`Request failed (${response.status})`, response.status);
  return response.blob();
}
