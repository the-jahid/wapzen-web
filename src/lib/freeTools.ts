import { Earth, Link2, QrCode, Send } from "lucide-react";

// Public free tools under /tools. Feeds the /tools index, the site footer and
// the sitemap, so a new tool only needs its page plus an entry here.
export const freeTools = [
  {
    href: "/tools/send-whatsapp-without-saving-number",
    name: "Send WhatsApp Without Saving Number",
    description: "Message any WhatsApp number without adding it to your contacts. Open the chat on your phone, WhatsApp Desktop or WhatsApp Web.",
    icon: Send,
  },
  {
    href: "/tools/whatsapp-link-generator",
    name: "WhatsApp Chat Link Generator",
    description: "Create a wa.me click-to-chat link with a pre-filled message, plus a QR code you can download and print.",
    icon: Link2,
  },
  {
    href: "/tools/whatsapp-qr-code-generator",
    name: "WhatsApp QR Code Generator",
    description: "Design a QR code that opens a WhatsApp chat: pick colours, add your logo and a caption, then download a PNG or SVG.",
    icon: QrCode,
  },
  {
    href: "/tools/whatsapp-country-code-finder",
    name: "WhatsApp Country Code Finder",
    description: "Look up any country's calling code and convert a local phone number into the international format WhatsApp needs.",
    icon: Earth,
  },
] as const;
