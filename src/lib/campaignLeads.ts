import { serverFetch, type AuthTokenGetter } from "./api";
import type { ApiCall } from "./calls";
import { OutboundCampaignError, type OutboundCampaignFieldError } from "./outboundCampaigns";

export type CampaignLeadStatus = "pending" | "calling" | "contacted" | "failed" | "opted_out";

export type CampaignLead = {
  lead_id: string;
  campaign_id: string;
  phone_number: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  status: CampaignLeadStatus;
  attempts: number;
  last_attempted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateCampaignLeadPayload = {
  phone_number: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

export type UpdateCampaignLeadPayload = Partial<CreateCampaignLeadPayload> & {
  status?: CampaignLeadStatus;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: OutboundCampaignFieldError[];
  meta?: { pagination?: { total_items?: number } };
  // Only the create response carries these: adding a lead also calls it, so the
  // 201 says what happened to that call.
  call?: ApiCall | null;
  call_error?: string;
};

// CreatedCampaignLead is the outcome of adding a lead: the stored lead, plus the
// call it started. call is the ringing call when one was placed; callError says
// why not when it was not. The lead exists either way — a number that cannot be
// dialled right now is still a lead — so exactly one of the two is set.
export type CreatedCampaignLead = {
  lead: CampaignLead;
  call: ApiCall | null;
  callError: string;
};

const dashboardPath = "/v1/dashboard/outbound-campaigns";

async function request<T>(path: string, init: RequestInit | undefined, getToken: AuthTokenGetter): Promise<Envelope<T>> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new OutboundCampaignError("Could not reach the server. Is the backend running?", 0);
  }
  let envelope: Envelope<T> | null = null;
  try { envelope = (await response.json()) as Envelope<T>; } catch { /* handled below */ }
  if (!response.ok || !envelope?.success) {
    const fieldErrors = envelope?.errors ?? [];
    const message = fieldErrors.length ? fieldErrors.map((error) => error.message).join(" ") : envelope?.message || `Request failed (${response.status})`;
    throw new OutboundCampaignError(message, response.status, fieldErrors);
  }
  return envelope;
}

function leadPath(campaignId: string, leadId?: string) {
  const base = `${dashboardPath}/${encodeURIComponent(campaignId)}/leads`;
  return leadId ? `${base}/${encodeURIComponent(leadId)}` : base;
}

export async function listCampaignLeads(campaignId: string, getToken: AuthTokenGetter): Promise<{ items: CampaignLead[]; total: number }> {
  const envelope = await request<CampaignLead[]>(`${leadPath(campaignId)}?page=1&limit=100`, undefined, getToken);
  return { items: envelope.data, total: envelope.meta?.pagination?.total_items ?? envelope.data.length };
}

// createCampaignLead adds the lead and, in the same request, places the
// campaign's outbound call to it. It returns once the callee's phone is ringing,
// so the returned call is "received" and only later becomes "answered" (picked
// up) or "declined" (cut while ringing).
export async function createCampaignLead(campaignId: string, payload: CreateCampaignLeadPayload, getToken: AuthTokenGetter): Promise<CreatedCampaignLead> {
  const envelope = await request<CampaignLead>(leadPath(campaignId), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }, getToken);
  return { lead: envelope.data, call: envelope.call ?? null, callError: envelope.call_error ?? "" };
}

// listCampaignCalls returns the calls this campaign placed, newest first. It is
// the campaign's own slice of the call history the Calls page shows.
export async function listCampaignCalls(campaignId: string, getToken: AuthTokenGetter): Promise<{ items: ApiCall[]; total: number }> {
  const envelope = await request<ApiCall[]>(`${dashboardPath}/${encodeURIComponent(campaignId)}/calls?page=1&limit=100`, undefined, getToken);
  return { items: envelope.data, total: envelope.meta?.pagination?.total_items ?? envelope.data.length };
}

export async function updateCampaignLead(campaignId: string, leadId: string, payload: UpdateCampaignLeadPayload, getToken: AuthTokenGetter): Promise<CampaignLead> {
  return (await request<CampaignLead>(leadPath(campaignId, leadId), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }, getToken)).data;
}

export async function deleteCampaignLead(campaignId: string, leadId: string, getToken: AuthTokenGetter): Promise<void> {
  await request<{ id: string; deleted: boolean }>(leadPath(campaignId, leadId), { method: "DELETE" }, getToken);
}
