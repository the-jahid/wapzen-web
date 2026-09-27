export const siteConfig = {
  name: "Wapzen",
  // Use the public production origin consistently, even if configured with
  // a trailing slash. See docs/seo-research.md for deployment and research.
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://wapzen.io").origin,
  title: "WhatsApp AI Chatbot & Voice Agents for Business | Wapzen",
  description:
    "Build a no-code WhatsApp AI chatbot and voice agent for your business. Automate customer support, answer calls, and follow up with leads using your knowledge base.",
  // Descriptive schema topics, not a Google ranking mechanism. Priorities
  // reflect observed search suggestions and product fit, not measured volume.
  keywords: [
    "WhatsApp AI chatbot",
    "WhatsApp AI chatbot for business",
    "WhatsApp chatbot for business",
    "WhatsApp chatbot builder",
    "WhatsApp automation for business",
    "WhatsApp auto reply AI",
    "WhatsApp AI voice agent",
    "WhatsApp AI customer service",
    "WhatsApp AI receptionist",
    "WhatsApp chatbot without API",
    "no-code WhatsApp chatbot",
    "outbound WhatsApp AI calls",
  ],
} as const;
