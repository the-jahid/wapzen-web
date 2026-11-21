// wapzen.io sits behind Cloudflare in front of Vercel, so Cloudflare's headers
// come first: Vercel's own ones only see the Cloudflare edge that forwarded
// the request.

/** The visitor's ISO country code, or null when unknown (local dev, Tor). */
export function countryFrom(headers: Headers): string | null {
  for (const name of ["cf-ipcountry", "x-vercel-ip-country"]) {
    const value = headers.get(name)?.toUpperCase();
    if (value && /^[A-Z]{2}$/.test(value) && value !== "XX" && value !== "T1") return value;
  }
  return null;
}

/** The visitor's IP address, or "" when no proxy header carries it. */
export function clientIpFrom(headers: Headers): string {
  const direct = headers.get("cf-connecting-ip") ?? headers.get("x-real-ip");
  if (direct) return direct.trim();
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
}
