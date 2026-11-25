import { serverFetch, type AuthTokenGetter } from "./api";

export type FollowUpSettings = { prompt: string; interval_hours: number; enabled: boolean };
export type FollowUpStatus = "draft" | "sent" | "skipped" | "failed" | "sending";
export type FollowUpResult = {
  conversation_id: string;
  peer_name: string | null;
  peer_phone: string | null;
  status: FollowUpStatus;
  reason: string;
  message: string | null;
};
export type FollowUpState = {
  config: (FollowUpSettings & {
    next_run_at: string | null;
    last_run_at: string | null;
    last_error: string | null;
    running: boolean;
    queued: boolean;
  }) | null;
  results: FollowUpResult[];
  total: number;
  counts: Partial<Record<FollowUpStatus, number>>;
  page_size: number;
};

async function request(numberId: string, suffix: string, getToken: AuthTokenGetter, init?: RequestInit): Promise<FollowUpState> {
  const response = await serverFetch(`/v1/dashboard/follow-ups/${encodeURIComponent(numberId)}${suffix}`, init, getToken);
  const result = await response.json().catch(() => null) as { success?: boolean; data?: FollowUpState; message?: string } | null;
  if (!response.ok || !result?.success || !result.data) {
    throw new Error(result?.message || `Could not load follow-ups (${response.status})`);
  }
  return result.data;
}

export function getFollowUps(numberId: string, getToken: AuthTokenGetter, page = 1) {
  return request(numberId, `?page=${page}`, getToken);
}

export function saveFollowUps(numberId: string, settings: FollowUpSettings, getToken: AuthTokenGetter) {
  return request(numberId, "", getToken, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
}

export function reviewFollowUps(numberId: string, getToken: AuthTokenGetter) {
  return request(numberId, "/review", getToken, { method: "POST" });
}
