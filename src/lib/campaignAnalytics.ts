import { serverFetch, type AuthTokenGetter } from "./api";
import { OutboundCampaignError, type OutboundCampaignFieldError } from "./outboundCampaigns";

// Wire types mirroring models.CampaignAnalytics (server/internal/models/
// campaign_analytics.go). Every number here is aggregated from the campaign's
// leads and calls rather than read off its stored counters.

export type CampaignLeadTotals = {
  total: number;
  pending: number;
  calling: number;
  contacted: number;
  failed: number;
  opted_out: number;
};

// received/answered/ended/declined/failed are where the calls stand right now
// and sum to total. connected counts every call somebody picked up (whether or
// not it has ended since); successful counts those that then ended normally.
export type CampaignCallTotals = {
  total: number;
  received: number;
  answered: number;
  ended: number;
  declined: number;
  failed: number;
  connected: number;
  successful: number;
};

export type CampaignTalkTime = {
  total_seconds: number;
  average_seconds: number;
  longest_seconds: number;
};

export type CampaignDailyActivity = {
  date: string;
  calls: number;
  answered: number;
};

export type CampaignEndReason = {
  reason: string;
  count: number;
};

export type CampaignAnalytics = {
  campaign_id: string;
  leads: CampaignLeadTotals;
  calls: CampaignCallTotals;
  pickup_rate: number;
  success_rate: number;
  reach_rate: number;
  talk_time: CampaignTalkTime;
  daily: CampaignDailyActivity[];
  end_reasons: CampaignEndReason[];
  first_call_at: string | null;
  last_call_at: string | null;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: OutboundCampaignFieldError[];
  meta?: { days?: number };
};

// The daily window the server accepts (1-90). The dashboard offers three.
export const analyticsRanges = [7, 14, 30] as const;
export type AnalyticsRange = (typeof analyticsRanges)[number];

export async function getCampaignAnalytics(
  campaignId: string,
  days: AnalyticsRange,
  getToken: AuthTokenGetter
): Promise<CampaignAnalytics> {
  const path = `/v1/dashboard/outbound-campaigns/${encodeURIComponent(campaignId)}/analytics?days=${days}`;

  let response: Response;
  try {
    response = await serverFetch(path, undefined, getToken);
  } catch {
    throw new OutboundCampaignError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<CampaignAnalytics> | null = null;
  try { envelope = (await response.json()) as Envelope<CampaignAnalytics>; } catch { /* handled below */ }

  if (!response.ok || !envelope?.success) {
    const fieldErrors = envelope?.errors ?? [];
    const message = fieldErrors.length
      ? fieldErrors.map((error) => error.message).join(" ")
      : envelope?.message || `Request failed (${response.status})`;
    throw new OutboundCampaignError(message, response.status, fieldErrors);
  }

  return envelope.data;
}
