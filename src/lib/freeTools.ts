import { Bold, ChartColumn, Earth, Link2, MessageSquareReply, MousePointerClick, QrCode, Send, Store } from "lucide-react";

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
  {
    href: "/tools/whatsapp-text-formatter",
    name: "WhatsApp Text Formatter",
    description: "Add bold, italic, strikethrough, monospace, lists and quotes to a message, preview it as WhatsApp shows it, or copy it in fancy fonts.",
    icon: Bold,
  },
  {
    href: "/tools/whatsapp-button-generator",
    name: "WhatsApp Button for Website",
    description: "Design a floating WhatsApp chat button with an optional welcome popup, preview it live, and copy the code for WordPress, Shopify, Wix or any site.",
    icon: MousePointerClick,
  },
  {
    href: "/tools/whatsapp-chat-analyzer",
    name: "WhatsApp Chat Analyzer",
    description: "Open an exported chat to see who texts the most, reply times, the busiest hours and days, and top words and emojis. Nothing is uploaded.",
    icon: ChartColumn,
  },
  {
    href: "/tools/ai-whatsapp-reply-generator",
    name: "AI WhatsApp Reply Generator",
    description: "Paste a WhatsApp message and get three ready-to-send replies written by AI, in the tone and language you choose.",
    icon: MessageSquareReply,
  },
  {
    href: "/tools/whatsapp-business-message-generator",
    name: "WhatsApp Business Message Generator",
    description: "Write greeting and away messages, quick replies, a business description, offers and reminders with free AI.",
    icon: Store,
  },
] as const;
