export const siteConfig = {
  name: "Wapzen",
  // Set NEXT_PUBLIC_SITE_URL in production so canonical/OG/sitemap URLs
  // point at the real domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://whatscallagent.com",
  // Title and description lead with the highest-volume searches: "WhatsApp AI
  // chatbot" and "WhatsApp AI voice call / call agent". Keep the title under
  // ~60 characters and the description under ~155 so Google shows them whole.
  title: "WhatsApp AI Chatbot & Voice Call Agent for Business | Wapzen",
  description:
    "Build a WhatsApp AI chatbot that auto-replies to messages and an AI voice agent that answers and makes WhatsApp calls 24/7. No code, no Business API.",
  // Phrases taken from Google autocomplete for "whatsapp ai chatbot",
  // "whatsapp ai voice", "whatsapp ai call" and "whatsapp ai agent".
  keywords: [
    "WhatsApp AI chatbot",
    "WhatsApp AI chatbot for business",
    "AI chatbot for WhatsApp",
    "WhatsApp chatbot",
    "WhatsApp chatbot builder",
    "WhatsApp AI bot",
    "WhatsApp AI agent",
    "WhatsApp AI agent builder",
    "AI agent for WhatsApp business",
    "WhatsApp business AI chatbot",
    "WhatsApp auto reply AI",
    "WhatsApp AI voice agent",
    "WhatsApp AI voice call",
    "WhatsApp AI voice bot",
    "WhatsApp AI calling",
    "WhatsApp AI call agent",
    "WhatsApp AI caller",
    "AI calling agent",
    "AI voice agent for business",
    "WhatsApp AI customer service",
    "WhatsApp AI receptionist",
    "WhatsApp AI sales agent",
    "WhatsApp chatbot without API",
    "no-code WhatsApp chatbot",
    "outbound WhatsApp AI calls",
  ],
} as const;
