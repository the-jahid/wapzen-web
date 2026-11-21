// Website visitor counts shown on /status. The server counts each visitor once
// per Bangladesh day (Asia/Dhaka), like every other per-day number.

export const VISIT_TIME_ZONE = "Asia/Dhaka";

export type VisitorStats = {
  time_zone: string;
  today: string; // YYYY-MM-DD
  date: string; // the day `countries` and `total` are for
  total: number;
  countries: Array<{ country: string | null; visitors: number }>;
  days: Array<{ date: string; visitors: number }>; // last 30 days, oldest first
};

/** Today's date in Bangladesh time, as YYYY-MM-DD. */
export function visitDay(now = new Date()): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: VISIT_TIME_ZONE }).format(now);
}

export async function fetchVisitorStats(date?: string, signal?: AbortSignal): Promise<VisitorStats> {
  const base = process.env.NEXT_PUBLIC_BASE_SERVER_URL?.replace(/\/+$/, "");
  if (!base) throw new Error("NEXT_PUBLIC_BASE_SERVER_URL is not configured");
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  const response = await fetch(`${base}/v1/site-visits/stats${query}`, { signal });
  if (!response.ok) throw new Error(`visitor stats: HTTP ${response.status}`);
  const body = (await response.json()) as { data: VisitorStats };
  return body.data;
}
