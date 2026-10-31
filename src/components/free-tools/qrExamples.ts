import { buildQrSvg, defaultQrDesign, sizedSvg, type QrDesign, type QrLogo } from "./qrSvg";
import { waLink } from "./whatsapp";

// The sample codes on the QR generator page. The generator draws them, so they
// always match what it outputs; app/tools/whatsapp-qr-code-generator/examples
// serves them as images. Numbers are from the US range reserved for fiction
// (555-0100 to 555-0199), so a scan can't reach a real person.

/** A bold one-colour mark, the way an uploaded SVG would arrive. Thin line art scans worse (see the page). */
function solidLogo(color: string, path: string): QrLogo {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="${path}"/></svg>`;
  return { kind: "image", href: `data:image/svg+xml,${encodeURIComponent(svg)}` };
}

const marks = {
  bowl: "M1.5 9.5h21a10.5 10.5 0 0 1-7 9.9V22h-7v-2.6a10.5 10.5 0 0 1-7-9.9z",
  sparkle: "M12 1.5l2.9 7.6 7.6 2.9-7.6 2.9L12 22.5l-2.9-7.6L1.5 12l7.6-2.9z",
  house: "M12 2 1.5 11.5H5V22h14V11.5h3.5z",
  box: "M12 1.5 21.5 7v10L12 22.5 2.5 17V7z",
  star: "M12 1.5l3.2 7 7.6.8-5.7 5.1 1.6 7.6L12 18.2 5.3 22l1.6-7.6L1.2 9.3l7.6-.8z",
};

type SampleCode = { digits: string; message: string; design: QrDesign };

export const qrExamples = [
  {
    slug: "restaurant-table-card",
    title: "Restaurant table card",
    alt: "WhatsApp QR code with a solid bowl logo and the caption Scan to order, in teal on mint, for a restaurant table",
    printWidth: "5 cm (2 in)",
    tip: "Print one code per table, so every order arrives with its table number already in the message.",
    digits: "12025550101",
    message: "Hi, I'm at table 12 and I'd like to order.",
    design: { fg: "#075e54", bg: "#ecfdf3", style: "rounded", logo: solidLogo("#075e54", marks.bowl), caption: "Scan to order" },
  },
  {
    slug: "salon-window-poster",
    title: "Salon window poster",
    alt: "WhatsApp QR code with a solid sparkle logo and the caption Book on WhatsApp, in purple on white, for a salon window",
    printWidth: "20 cm (8 in)",
    tip: "A window is read from the pavement, about 2 metres away, so this one prints big. It keeps taking bookings after closing time.",
    digits: "12025550102",
    message: "Hi, I'd like to book a haircut this week.",
    design: { fg: "#6d28d9", bg: "#ffffff", style: "rounded", logo: solidLogo("#6d28d9", marks.sparkle), caption: "Book on WhatsApp" },
  },
  {
    slug: "property-for-sale-sign",
    title: "Property for-sale sign",
    alt: "WhatsApp QR code with a solid house logo and the caption Ask about this home, in blue on white, for a property sign",
    printWidth: "30 cm (12 in)",
    tip: "Name the listing in the message, so the agent knows which property the buyer means. Make one code per sign.",
    digits: "12025550103",
    message: "Hi, is the house on Oak Street still available?",
    design: { fg: "#1d4ed8", bg: "#ffffff", style: "square", logo: solidLogo("#1d4ed8", marks.house), caption: "Ask about this home" },
  },
  {
    slug: "product-packaging-label",
    title: "Product packaging label",
    alt: "WhatsApp QR code with a solid box logo and the caption Questions? Scan me, in black on cream, for product packaging",
    printWidth: "3 cm (1.2 in)",
    tip: "Labels are small, so keep the message short: every character you cut makes the printed squares bigger.",
    digits: "12025550104",
    message: "Hi, I need help with my order.",
    design: { fg: "#10131a", bg: "#fdf8e8", style: "rounded", logo: solidLogo("#10131a", marks.box), caption: "Questions? Scan me" },
  },
  {
    slug: "business-card",
    title: "Business card",
    alt: "Black square WhatsApp QR code with a green chat icon in the centre and no caption, for a business card",
    printWidth: "2 cm (0.8 in)",
    tip: "No message and no caption give the smallest possible code, which is what a business card needs.",
    digits: "12025550105",
    message: "",
    design: { fg: "#10131a", bg: "#ffffff", style: "square", logo: { kind: "chat" }, caption: "" },
  },
  {
    slug: "event-stand-banner",
    title: "Event stand banner",
    alt: "WhatsApp QR code with a solid star logo and the caption Get the brochure, in red on white, for an event banner",
    printWidth: "40 cm (16 in)",
    tip: "Visitors scan from about 4 metres away. Mention the event in the message, so you know where each lead came from.",
    digits: "12025550106",
    message: "Hi, I met you at the expo. Please send me the brochure.",
    design: { fg: "#b91c1c", bg: "#ffffff", style: "rounded", logo: solidLogo("#b91c1c", marks.star), caption: "Get the brochure" },
  },
] as const satisfies ReadonlyArray<SampleCode & { slug: string; title: string; alt: string; printWidth: string; tip: string }>;

// The same code and message at three logo sizes, for the logo section.
const logoSizeMessage = "Hi! I scanned the code on your shop window and I'd like to know your prices and opening hours this week.";
const logoSizeDesign = (logoShare: number): QrDesign => ({ ...defaultQrDesign, style: "rounded", logo: { kind: "chat" }, logoShare });

export const qrLogoSizes = [
  { slug: "logo-size-24-percent", label: "24% wide", verdict: "Reads every time", alt: "WhatsApp QR code with a centre logo 24% as wide as the code, which scans", digits: "12025550107", message: logoSizeMessage, design: logoSizeDesign(0.24) },
  { slug: "logo-size-35-percent", label: "35% wide", verdict: "Failed with this message", alt: "WhatsApp QR code with a centre logo 35% as wide as the code, which failed to scan", digits: "12025550107", message: logoSizeMessage, design: logoSizeDesign(0.35) },
  { slug: "logo-size-45-percent", label: "45% wide", verdict: "Almost never reads", alt: "WhatsApp QR code with a centre logo 45% as wide as the code, which failed to scan", digits: "12025550107", message: logoSizeMessage, design: logoSizeDesign(0.45) },
] as const satisfies ReadonlyArray<SampleCode & { slug: string; label: string; verdict: string; alt: string }>;

export const QR_EXAMPLES_PATH = "/tools/whatsapp-qr-code-generator/examples";

/** Width in pixels of the SVG files, a neutral size that next/image needs up front. */
const FILE_WIDTH = 720;

export function qrSampleSvg({ digits, message, design }: SampleCode) {
  const image = buildQrSvg(waLink(digits, message), design);
  if (!image) throw new Error(`No QR code for +${digits}`);
  return { svg: sizedSvg(image, FILE_WIDTH), width: FILE_WIDTH, height: Math.round((image.height / image.width) * FILE_WIDTH) };
}

/** Modules across a code with the chat logo, border included, for a link of this message. */
export function qrModulesAcross(message: string) {
  const image = buildQrSvg(waLink("12025550100", message), { ...defaultQrDesign, logo: { kind: "chat" } });
  if (!image) throw new Error("Message too long for a QR code");
  return image.width;
}
