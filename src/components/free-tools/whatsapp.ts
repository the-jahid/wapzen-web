// Shared by the free WhatsApp tools (link generator, QR code generator).

export const MAX_MESSAGE = 1000;

export const messageTemplates = [
  "Hi! I'd like to know more about your services.",
  "Hello, I'd like to book an appointment.",
  "Hi, can you share your prices?",
  "Hello, I have a question about my order.",
];

/**
 * Reduces what someone typed to the bare international number wa.me expects:
 * country code + number, digits only, no "+", no leading "00".
 */
export function parsePhone(raw: string): { digits: string; error?: string } {
  const value = raw.trim();
  if (!value) return { digits: "" };
  if (/[^\d\s()+.\-]/.test(value)) return { digits: "", error: "Use digits only. Spaces, dashes, brackets and + are fine." };
  let digits = value.replace(/\D/g, "");
  if (!value.startsWith("+") && digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) return { digits: "", error: "Start with the country code (e.g. 1 for the US, 44 for the UK, 880 for Bangladesh) instead of a leading 0." };
  if (digits.length < 7) return { digits: "", error: "That number looks too short. Include the country code." };
  if (digits.length > 15) return { digits: "", error: "Phone numbers have at most 15 digits, including the country code." };
  return { digits };
}

/** The click-to-chat URL; an all-whitespace message is left off. */
export function waLink(digits: string, message: string) {
  return `https://wa.me/${digits}${message.trim() ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function downloadHref(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
