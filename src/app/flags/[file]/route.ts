import * as flags from "country-flag-icons/string/3x2";
import { getCountries } from "libphonenumber-js/max";

// Country flags as /flags/BD.svg, served from the country-flag-icons package
// rather than copying ~245 files into public/. Every flag is generated at build
// time; anything else is a 404.

const svgs = flags as unknown as Record<string, string | undefined>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getCountries().filter((iso) => svgs[iso]).map((iso) => ({ file: `${iso}.svg` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const svg = /^[A-Z]{2}\.svg$/.test(file) ? svgs[file.slice(0, 2)] : undefined;
  if (!svg) return new Response("Not found", { status: 404 });
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
