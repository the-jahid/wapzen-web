import { countryFrom } from "@/lib/visitorCountry";

// The visitor's country, for choosing a language to translate the site into.
// Unknown (local dev, Tor) answers null and the browser falls back to its own
// language region.
export function GET(request: Request) {
  return Response.json(
    { country: countryFrom(request.headers) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
