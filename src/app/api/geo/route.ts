// The visitor's country, for choosing a language to translate the site into.
// wapzen.io sits behind Cloudflare in front of Vercel, so Cloudflare's header
// comes first: Vercel's own one only sees the Cloudflare edge that forwarded
// the request. Unknown (local dev, Tor) answers null and the browser falls
// back to its own language region.
function countryFrom(headers: Headers): string | null {
  for (const name of ["cf-ipcountry", "x-vercel-ip-country"]) {
    const value = headers.get(name)?.toUpperCase();
    if (value && /^[A-Z]{2}$/.test(value) && value !== "XX") return value;
  }
  return null;
}

export function GET(request: Request) {
  return Response.json(
    { country: countryFrom(request.headers) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
