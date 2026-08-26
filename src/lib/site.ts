export const siteConfig = {
  name: "WhatsCall Agent",
  // Set NEXT_PUBLIC_SITE_URL in production so canonical/OG/sitemap URLs
  // point at the real domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://whatscallagent.com",
  title: "WhatsApp AI Voice Agent That Never Misses a Lead | WhatsCall Agent",
  description:
    "WhatsCall Agent answers your WhatsApp calls with AI — qualifies leads, books appointments, and runs outbound follow-ups 24/7 in 40+ languages. Live in a day.",
  keywords: [
    "WhatsApp AI voice agent",
    "AI voice agent",
    "AI phone agent",
    "WhatsApp Business API calls",
    "AI appointment booking",
    "AI receptionist",
    "outbound AI calls",
    "lead qualification AI",
    "WhatsApp automation",
    "speed to lead",
  ],
} as const;
