import { createHmac } from "node:crypto";
import { clientIpFrom } from "@/lib/visitorCountry";

// The AI free tools (reply generator, business message generator) post here,
// and this forwards to the API with the site's shared secret and a hash of the
// visitor's IP and browser, so the API can limit each visitor without ever
// seeing either. The API checks every field itself.

const BOTS = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|curl|wget|python|axios|node-fetch/i;
const MAX_BODY = 8_000;

const json = (status: number, body: unknown) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const secret = process.env.SITE_VISITS_SECRET;
  const base = process.env.NEXT_PUBLIC_BASE_SERVER_URL?.replace(/\/+$/, "");
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!secret || !base) return json(503, { success: false, message: "The AI tools aren't available right now. Please try again later." });
  if (!userAgent || BOTS.test(userAgent)) return json(403, { success: false, message: "Not allowed" });

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { success: false, message: "That's too much text. Please shorten it." });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { success: false, message: "Invalid request" });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, { success: false, message: "Invalid request" });

  // Stays the same all (UTC) day, so the API's rolling hourly limit holds
  // across the hour; the API forgets its counts at midnight UTC anyway.
  const day = new Date().toISOString().slice(0, 10);
  const visitor = createHmac("sha256", secret).update(`free-tools|${day}|${clientIpFrom(request.headers)}|${userAgent}`).digest("hex");
  try {
    const res = await fetch(`${base}/v1/free-tools/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Site-Visits-Secret": secret },
      body: JSON.stringify({ ...body, visitor }),
      signal: AbortSignal.timeout(45_000),
    });
    const data = await res.json().catch(() => null);
    return json(res.status, data ?? { success: false, message: "The AI couldn't write messages just now. Please try again." });
  } catch {
    return json(504, { success: false, message: "The AI took too long to answer. Please try again." });
  }
}
