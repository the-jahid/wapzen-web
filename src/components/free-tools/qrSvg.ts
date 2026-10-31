import QRCode from "qrcode";

// Builds a QR code as an SVG string. The on-page preview, the SVG download and
// the PNG download (the SVG rasterised on a canvas) all come from here, so
// what people see is exactly what they download.

export type QrStyle = "square" | "rounded";
export type QrLogo = { kind: "none" } | { kind: "chat" } | { kind: "image"; href: string };
export type QrDesign = { fg: string; bg: string; style: QrStyle; logo: QrLogo; caption: string };
export type QrImage = { svg: string; width: number; height: number };

export const defaultQrDesign: QrDesign = { fg: "#10131a", bg: "#ffffff", style: "square", logo: { kind: "none" }, caption: "" };

// Quiet zone around the code, in modules; the QR spec asks for 4.
const MARGIN = 4;
// Share of the code's width given to a centre logo. Error correction level H
// recovers up to 30% damage, and a 24%-wide square covers about 6% of the area.
const LOGO_SHARE = 0.24;
const HEX = /^#[0-9a-f]{6}$/i;
const WHATSAPP_GREEN = "#25d366";
// lucide "message-circle" outline (ISC licence), filled to make a speech bubble.
const CHAT_BUBBLE = "M7.9 20A9 9 0 1 0 4 16.1L2 22Z";

const r2 = (value: number) => Math.round(value * 100) / 100;
const escapeXml = (value: string) => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** The module matrix, at the strongest error correction the text still fits. */
function modulesFor(text: string, withLogo: boolean) {
  for (const level of withLogo ? (["H", "Q"] as const) : (["M", "L"] as const)) {
    try {
      return QRCode.create(text, { errorCorrectionLevel: level }).modules;
    } catch {
      // Too much data for this level.
    }
  }
  return null;
}

/** Returns null when the text is too long to fit in any QR code. */
export function buildQrSvg(text: string, design: QrDesign): QrImage | null {
  const hasLogo = design.logo.kind !== "none";
  const modules = modulesFor(text, hasLogo);
  if (!modules) return null;

  const fg = HEX.test(design.fg) ? design.fg : defaultQrDesign.fg;
  const bg = HEX.test(design.bg) ? design.bg : defaultQrDesign.bg;
  const n = modules.size;
  const width = n + MARGIN * 2;

  // A square hole in the middle for the logo, centred on whole modules (n is odd, so the hole is too).
  let hole: { start: number; size: number } | null = null;
  if (hasLogo) {
    let size = Math.round(n * LOGO_SHARE);
    if ((n - size) % 2) size += 1;
    hole = { start: (n - size) / 2, size };
  }
  const inHole = (x: number, y: number) => hole !== null && x >= hole.start && x < hole.start + hole.size && y >= hole.start && y < hole.start + hole.size;
  const isFinder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  // Alignment patterns are the reserved (function-pattern) modules that aren't
  // finders + separators + format info, timing lines or version info.
  const isAlignment = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < n && y < n && Boolean(modules.isReserved(y, x)) &&
    !(x < 9 && y < 9) && !(x >= n - 8 && y < 9) && !(x < 9 && y >= n - 8) &&
    x !== 6 && y !== 6 && !(y < 6 && x >= n - 11) && !(x < 6 && y >= n - 11);

  let path = "";
  const dot = 0.45;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!modules.get(y, x) || inHole(x, y)) continue;
      if (design.style === "square") {
        path += `M${x + MARGIN} ${y + MARGIN}h1v1h-1z`;
      } else if (!isFinder(x, y) && !isAlignment(x, y)) {
        const cx = x + MARGIN + 0.5;
        const cy = y + MARGIN + 0.5;
        path += `M${r2(cx - dot)} ${cy}a${dot} ${dot} 0 1 0 ${dot * 2} 0a${dot} ${dot} 0 1 0 ${-dot * 2} 0`;
      }
    }
  }

  const parts: string[] = [];
  if (design.style === "square") {
    parts.push(`<path d="${path}" fill="${fg}" shape-rendering="crispEdges"/>`);
  } else {
    parts.push(`<path d="${path}" fill="${fg}"/>`);
    // Finder patterns ("eyes") drawn as rounded squares; scanners locate the code by these.
    for (const [ex, ey] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      const X = ex + MARGIN;
      const Y = ey + MARGIN;
      parts.push(`<rect x="${X + 0.5}" y="${Y + 0.5}" width="6" height="6" rx="1.6" fill="none" stroke="${fg}" stroke-width="1"/>`);
      parts.push(`<rect x="${X + 2}" y="${Y + 2}" width="3" height="3" rx="0.9" fill="${fg}"/>`);
    }
    // Alignment patterns drawn solid too: decoders look for them as a continuous
    // ring, and a ring of separate dots made jsQR miss them. The centre is the one
    // dark module whose left and right neighbours are both light alignment modules.
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (!modules.get(y, x) || !isAlignment(x, y) || inHole(x, y)) continue;
        if (!isAlignment(x - 1, y) || !isAlignment(x + 1, y) || modules.get(y, x - 1) || modules.get(y, x + 1)) continue;
        const X = x + MARGIN;
        const Y = y + MARGIN;
        parts.push(`<rect x="${X - 1.5}" y="${Y - 1.5}" width="4" height="4" rx="1.1" fill="none" stroke="${fg}" stroke-width="1"/>`);
        parts.push(`<rect x="${X}" y="${Y}" width="1" height="1" rx="0.3" fill="${fg}"/>`);
      }
    }
  }

  if (hole) {
    const X = hole.start + MARGIN;
    const s = hole.size;
    const c = X + s / 2;
    parts.push(`<rect x="${X}" y="${X}" width="${s}" height="${s}" rx="${r2(s * 0.22)}" fill="${bg}"/>`);
    if (design.logo.kind === "chat") {
      const b = s * 0.48;
      parts.push(`<circle cx="${c}" cy="${c}" r="${r2(s * 0.4)}" fill="${WHATSAPP_GREEN}"/>`);
      parts.push(`<path d="${CHAT_BUBBLE}" fill="#ffffff" transform="translate(${r2(c - b / 2)} ${r2(c - b / 2)}) scale(${r2(b / 24)})"/>`);
    } else if (design.logo.kind === "image") {
      const inset = s * 0.1;
      parts.push(`<image href="${escapeXml(design.logo.href)}" x="${r2(X + inset)}" y="${r2(X + inset)}" width="${r2(s - inset * 2)}" height="${r2(s - inset * 2)}" preserveAspectRatio="xMidYMid meet"/>`);
    }
  }

  let height = width;
  const caption = design.caption.trim();
  if (caption) {
    // Sits in the lower quiet zone, keeping about 2.5 modules clear below the code.
    const fontSize = r2(Math.max(2.6, width * 0.068));
    const top = width - 1.5;
    height = r2(top + fontSize + 1.8);
    parts.push(`<text x="${r2(width / 2)}" y="${r2(top + fontSize * 0.8)}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" fill="${fg}">${escapeXml(caption)}</text>`);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${bg}"/>${parts.join("")}</svg>`;
  return { svg, width, height };
}

/** The SVG with pixel dimensions, as a standalone file wants. */
export function sizedSvg(image: QrImage, widthPx: number) {
  const heightPx = Math.round((image.height / image.width) * widthPx);
  return image.svg.replace("<svg ", `<svg width="${widthPx}" height="${heightPx}" `);
}

/** Rasterises the SVG to a PNG data URL `widthPx` wide. */
export async function qrPngDataUrl(image: QrImage, widthPx: number) {
  const svg = sizedSvg(image, widthPx);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

function luminance(hex: string) {
  const channel = (i: number) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** A reason the colours may not scan, or null when they look fine. */
export function contrastWarning(fg: string, bg: string) {
  if (!HEX.test(fg) || !HEX.test(bg)) return null;
  const lf = luminance(fg);
  const lb = luminance(bg);
  if (lf > lb) return "Light code on a dark background doesn't scan with every camera app. Use a darker code colour than the background.";
  if ((lb + 0.05) / (lf + 0.05) < 4) return "These colours are low contrast and may not scan reliably. Pick a darker code colour or a lighter background.";
  return null;
}
