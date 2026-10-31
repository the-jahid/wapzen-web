import { qrExamples, qrLogoSizes, qrSampleSvg } from "@/components/free-tools/qrExamples";

// The sample codes on the QR generator page as /examples/<slug>.svg, so they can
// be indexed as images. Every file is generated at build time; anything else is a 404.

const samples = [...qrExamples, ...qrLogoSizes];

export const dynamicParams = false;

export function generateStaticParams() {
  return samples.map((sample) => ({ file: `${sample.slug}.svg` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const sample = samples.find((entry) => `${entry.slug}.svg` === file);
  if (!sample) return new Response("Not found", { status: 404 });
  return new Response(qrSampleSvg(sample).svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
