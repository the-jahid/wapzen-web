import { createHmac } from "node:crypto";
import { visitDay } from "@/lib/siteVisits";
import { clientIpFrom, countryFrom } from "@/lib/visitorCountry";

// Records one website visitor per day for the public /status page.
// The visitor is an HMAC of the Bangladesh day, IP address and browser, keyed
// with SITE_VISITS_SECRET, so the same person counts once a day without a
// cookie, and the IP and browser string never leave this function. The secret
// also lets the API accept the visit. Unset (local dev) = nothing is recorded.

const BOTS = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|curl|wget|python|axios|node-fetch/i;

const noContent = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const secret = process.env.SITE_VISITS_SECRET;
  const base = process.env.NEXT_PUBLIC_BASE_SERVER_URL?.replace(/\/+$/, "");
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!secret || !base || !userAgent || BOTS.test(userAgent)) return noContent();

  const ip = clientIpFrom(request.headers);
  const visitor = createHmac("sha256", secret).update(`${visitDay()}|${ip}|${userAgent}`).digest("hex");
  try {
    await fetch(`${base}/v1/site-visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Site-Visits-Secret": secret },
      body: JSON.stringify({ visitor, country: countryFrom(request.headers) }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // A missed count is not worth an error in the visitor's console.
  }
  return noContent();
}
