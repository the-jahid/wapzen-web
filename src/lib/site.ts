export const siteConfig = {
  name: "Wapzen",
  // Set NEXT_PUBLIC_SITE_URL in production so canonical/OG/sitemap URLs
  // point at the real domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://whatscallagent.com",
  title: "WhatsApp AI Chat Agent & Voice Agent Builder | Wapzen",
  description:
    "Create WhatsApp AI chat agents for messages and voice agents for inbound or outbound calls. Connect your number, add knowledge and tools, and review conversations with Wapzen.",
  keywords: [
    "WhatsApp AI chat agent",
    "WhatsApp chat agent builder",
    "WhatsApp AI voice agent",
    "WhatsApp voice agent maker",
    "WhatsApp AI agent builder",
    "WhatsApp AI chatbot",
    "inbound WhatsApp calls",
    "outbound WhatsApp calls",
    "WhatsApp knowledge base",
  ],
} as const;
