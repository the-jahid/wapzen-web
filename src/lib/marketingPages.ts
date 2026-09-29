import { Building2, ConciergeBell, Globe, Headset, LifeBuoy, MapPin, MessageCircle, MessageSquareReply, PhoneCall, QrCode, Tag, type LucideIcon } from "lucide-react";
import { locales, type Locale } from "./locales";
import { siteConfig } from "./site";

export type MarketingPageEntry = {
  href: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Defaults to "en". */
  locale?: Locale;
  /** For a translated page: the English page it is the equivalent of (hreflang). */
  alternateOf?: string;
};

// Public marketing pages: English ones in app/(marketing), translated ones in
// app/pt-br, app/es and app/it. Feeds the sitemap, the footer (per language),
// each page's "keep exploring" links and the hreflang alternates, so a new
// page only needs an entry here.
export const marketingPages: MarketingPageEntry[] = [
  {
    href: "/pricing",
    name: "Pricing",
    description: "Wapzen is free right now, with every feature included. See what a WhatsApp chatbot and AI calling agent usually cost.",
    icon: Tag,
  },
  {
    href: "/free-whatsapp-chatbot",
    name: "Free WhatsApp chatbot builder",
    description: "Make a WhatsApp AI chatbot for free in five steps. No code, no Business API, works on your existing number.",
    icon: MessageCircle,
  },
  {
    href: "/free-ai-calling-agent",
    name: "Free AI calling agent",
    description: "Create a free AI voice agent that answers WhatsApp calls 24/7 and calls your leads back in a natural voice.",
    icon: PhoneCall,
  },
  {
    href: "/whatsapp-auto-reply",
    name: "WhatsApp auto reply",
    description: "Set up auto reply on WhatsApp, copy ready-made message samples, and add AI auto-reply to a personal or business number.",
    icon: MessageSquareReply,
  },
  {
    href: "/ai-receptionist",
    name: "AI receptionist",
    description: "A free AI receptionist for small businesses that answers every WhatsApp call and message, day or night.",
    icon: ConciergeBell,
  },
  {
    href: "/whatsapp-ai-customer-service",
    name: "WhatsApp AI customer service",
    description: "Answer customer questions on WhatsApp chat and calls 24/7 with an AI agent trained on your own knowledge.",
    icon: LifeBuoy,
  },
  {
    href: "/ai-calling-agent-for-real-estate",
    name: "AI calling agent for real estate",
    description: "Answer property enquiries, call new leads back, and qualify buyers on WhatsApp with a free AI agent.",
    icon: Building2,
  },
  {
    href: "/ai-calling-agent-india",
    name: "AI calling agent in India",
    description: "A free AI calling agent for Indian businesses on WhatsApp, speaking Hindi, Tamil, Telugu, Bengali, and more.",
    icon: MapPin,
  },
  {
    href: "/whatsapp-business-api-alternative",
    name: "WhatsApp Business API alternative",
    description: "Run a WhatsApp AI chatbot without the Business API: no Meta approval, no template fees, just a QR code.",
    icon: QrCode,
  },
  {
    href: "/ai-answering-service",
    name: "AI answering service (USA)",
    description: "A free AI answering service for US small businesses that answers WhatsApp calls and messages 24/7, in English or Spanish.",
    icon: Headset,
  },
  {
    href: "/whatsapp-for-business-usa",
    name: "WhatsApp for business in the USA",
    description: "Serve US customers who prefer WhatsApp with a free AI chatbot and voice agent that answers in English or Spanish.",
    icon: Globe,
  },
  // Brazil
  {
    href: "/pt-br/chatbot-whatsapp-com-ia",
    name: "Chatbot WhatsApp com IA",
    description: "Crie grátis um chatbot com IA para o WhatsApp da sua empresa. Sem código e sem API oficial.",
    icon: MessageCircle,
    locale: "pt-BR",
    alternateOf: "/free-whatsapp-chatbot",
  },
  {
    href: "/pt-br/ligacao-com-ia",
    name: "Ligação com IA",
    description: "Um agente de voz com IA que atende e faz ligações pelo WhatsApp, como secretária virtual ou SDR.",
    icon: PhoneCall,
    locale: "pt-BR",
    alternateOf: "/free-ai-calling-agent",
  },
  {
    href: "/pt-br/resposta-automatica-whatsapp",
    name: "Resposta automática no WhatsApp",
    description: "Como fazer resposta automática no WhatsApp Business e no normal, com modelos para copiar e IA grátis.",
    icon: MessageSquareReply,
    locale: "pt-BR",
    alternateOf: "/whatsapp-auto-reply",
  },
  // Spain
  {
    href: "/es/chatbot-whatsapp-gratis",
    name: "Chatbot de WhatsApp gratis",
    description: "Crea gratis un chatbot con IA para el WhatsApp de tu negocio. Sin programar y sin la API oficial.",
    icon: MessageCircle,
    locale: "es",
    alternateOf: "/free-whatsapp-chatbot",
  },
  {
    href: "/es/llamadas-con-ia",
    name: "Llamadas con IA",
    description: "Un agente de voz con IA que atiende y hace llamadas de WhatsApp, como recepcionista virtual.",
    icon: PhoneCall,
    locale: "es",
    alternateOf: "/free-ai-calling-agent",
  },
  {
    href: "/es/respuesta-automatica-whatsapp",
    name: "Respuesta automática en WhatsApp",
    description: "Configura la respuesta automática en WhatsApp Business o personal, con ejemplos y una IA gratis.",
    icon: MessageSquareReply,
    locale: "es",
    alternateOf: "/whatsapp-auto-reply",
  },
  // Italy
  {
    href: "/it/chatbot-whatsapp-gratis",
    name: "Chatbot WhatsApp gratis",
    description: "Crea gratis un chatbot AI per il WhatsApp della tua attività. Senza codice e senza API ufficiale.",
    icon: MessageCircle,
    locale: "it",
    alternateOf: "/free-whatsapp-chatbot",
  },
  {
    href: "/it/centralino-ai",
    name: "Centralino AI",
    description: "Un agente vocale AI che risponde ed effettua chiamate WhatsApp, come assistente o segretaria virtuale.",
    icon: PhoneCall,
    locale: "it",
    alternateOf: "/free-ai-calling-agent",
  },
  {
    href: "/it/risposta-automatica-whatsapp",
    name: "Risposta automatica WhatsApp",
    description: "Come impostare la risposta automatica su WhatsApp Business e normale, con esempi e un'AI gratis.",
    icon: MessageSquareReply,
    locale: "it",
    alternateOf: "/whatsapp-auto-reply",
  },
];

export const pagesIn = (locale: Locale) => marketingPages.filter((page) => (page.locale ?? "en") === locale);

/** Each language's entry point, for the footer's language links. */
export const localeHome: Record<Locale, string> = {
  en: "/",
  "pt-BR": "/pt-br/chatbot-whatsapp-com-ia",
  es: "/es/chatbot-whatsapp-gratis",
  it: "/it/chatbot-whatsapp-gratis",
};

/**
 * hreflang alternates for a page that has translations (or is one): the
 * English page plus every page that names it in alternateOf, with the English
 * page as x-default. Undefined for pages without translations.
 */
export function hreflangLinks(path: string): Record<string, string> | undefined {
  const root = marketingPages.find((page) => page.href === path)?.alternateOf ?? path;
  const translations = marketingPages.filter((page) => page.alternateOf === root);
  if (translations.length === 0) return undefined;
  return {
    [locales.en.hreflang]: root,
    ...Object.fromEntries(translations.map((page) => [locales[page.locale ?? "en"].hreflang, page.href])),
    "x-default": root,
  };
}

// Schema.org offer for the current free plan. Update it together with /pricing.
export const freeOffer = {
  "@type": "Offer",
  price: "0",
  priceCurrency: "USD",
  url: `${siteConfig.url}/pricing`,
  description: "Free plan with every feature included. No credit card required.",
} as const;
