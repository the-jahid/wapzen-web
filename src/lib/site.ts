export const siteConfig = {
  name: "Wapzen",
  // Use the public production origin consistently, even if configured with
  // a trailing slash. See docs/seo-research.md for deployment and research.
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://wapzen.io").origin,
  title: "Free WhatsApp AI Chatbot & AI Calling Agent for Business | Wapzen",
  description:
    "Free WhatsApp AI agent for business. An AI chatbot auto-replies to messages and an AI voice agent answers and makes WhatsApp calls. No code, no Business API.",
  // Descriptive schema topics, not a Google ranking mechanism. Priorities
  // reflect autocomplete breadth across Google, Bing and YouTube plus product
  // fit, not measured volume (docs/seo-research.md).
  keywords: [
    "free WhatsApp AI chatbot",
    "free WhatsApp chatbot builder",
    "free AI calling agent",
    "WhatsApp AI chatbot",
    "WhatsApp AI agent",
    "WhatsApp chatbot for business",
    "AI calling agent",
    "WhatsApp AI voice agent",
    "WhatsApp AI calling",
    "WhatsApp auto reply bot",
    "auto answer WhatsApp calls",
    "WhatsApp auto reply for personal account",
    "WhatsApp chatbot without API",
    "AI receptionist",
    "outbound AI calling",
    "AI calling agent for real estate",
    "WhatsApp chatbot builder",
  ],
} as const;
