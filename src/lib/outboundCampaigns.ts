import { serverFetch, type AuthTokenGetter } from "./api";

export type OutboundCampaignStatus = "draft" | "running" | "paused" | "completed" | "failed";

export type OutboundCampaign = {
  campaign_id: string;
  campaign_name: string;
  status: OutboundCampaignStatus;
  budget_usd: number | null;
  // The agent the campaign dials with. agent_id is the only settable half:
  // the three fields below it are read off that agent by the server, since an
  // agent already carries the number it speaks on.
  agent_id: string | null;
  agent_name: string | null;
  phone_number_id: string | null;
  phone_number: string | null;
  leads_count: number;
  calls_placed: number;
  answered_calls: number;
  successful_calls: number;
  today_calls: number;
  today_calls_date: string | null;
  total_usage_seconds: number;
  pickup_rate: number;
  success_rate: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateOutboundCampaignPayload = {
  campaign_name: string;
  budget_usd?: number | null;
  agent_id?: string;
};

// agent_id null detaches the agent; omitting it keeps the stored one. The
// server refuses a detach that would leave a running campaign without an agent.
export type UpdateOutboundCampaignPayload = {
  campaign_name?: string;
  status?: OutboundCampaignStatus;
  budget_usd?: number | null;
  agent_id?: string | null;
};

export type OutboundCampaignFieldError = {
  field: string;
  message: string;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: OutboundCampaignFieldError[];
};

export class OutboundCampaignError extends Error {
  readonly status: number;
  readonly fieldErrors: OutboundCampaignFieldError[];

  constructor(message: string, status: number, fieldErrors: OutboundCampaignFieldError[] = []) {
    super(message);
    this.name = "OutboundCampaignError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(path: string, init: RequestInit | undefined, getToken: AuthTokenGetter): Promise<T> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new OutboundCampaignError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // A non-JSON response falls through to the status-based error below.
  }

  if (!response.ok || !envelope?.success) {
    const fieldErrors = envelope?.errors ?? [];
    const message = fieldErrors.length
      ? fieldErrors.map((error) => error.message).join(" ")
      : envelope?.message || `Request failed (${response.status})`;
    throw new OutboundCampaignError(message, response.status, fieldErrors);
  }

  return envelope.data;
}

const dashboardPath = "/v1/dashboard/outbound-campaigns";

export function listOutboundCampaigns(getToken: AuthTokenGetter): Promise<OutboundCampaign[]> {
  return request<OutboundCampaign[]>(`${dashboardPath}?page=1&limit=100`, undefined, getToken);
}

export function createOutboundCampaign(
  payload: CreateOutboundCampaignPayload,
  getToken: AuthTokenGetter
): Promise<OutboundCampaign> {
  return request<OutboundCampaign>(dashboardPath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, getToken);
}

export function getOutboundCampaign(
  campaignId: string,
  getToken: AuthTokenGetter
): Promise<OutboundCampaign> {
  return request<OutboundCampaign>(`${dashboardPath}/${encodeURIComponent(campaignId)}`, undefined, getToken);
}

export function updateOutboundCampaign(
  campaignId: string,
  payload: UpdateOutboundCampaignPayload,
  getToken: AuthTokenGetter
): Promise<OutboundCampaign> {
  return request<OutboundCampaign>(`${dashboardPath}/${encodeURIComponent(campaignId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, getToken);
}

export function deleteOutboundCampaign(
  campaignId: string,
  getToken: AuthTokenGetter
): Promise<{ id: string; deleted: boolean }> {
  return request<{ id: string; deleted: boolean }>(`${dashboardPath}/${encodeURIComponent(campaignId)}`, {
    method: "DELETE",
  }, getToken);
}
