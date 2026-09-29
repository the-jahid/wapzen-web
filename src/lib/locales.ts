// Languages of the public marketing pages. English pages live at the root;
// the others under /pt-br, /es and /it (see app/<prefix>/layout.tsx). Each
// localized page names its English equivalent in lib/marketingPages.ts, which
// drives the hreflang alternates. The dashboard itself is English-only.

export type Locale = "en" | "pt-BR" | "es" | "it";

type Ui = {
  nav: { features: string; pricing: string; tools: string; faq: string; faqHref: string };
  login: string;
  dashboard: string;
  home: string;
  breadcrumb: string;
  startFree: string;
  explore: [string, string];
  readMore: string;
  openTools: string;
  toolsTitle: string;
  toolsBody: string;
  copy: string;
  copied: string;
  footer: {
    tagline: [string, string];
    product: string;
    features: string;
    chatbot: string;
    voiceAgent: string;
    useCases: string;
    industries: string;
    howItWorks: string;
    faq: string;
    freeTools: string;
    allTools: string;
    solutions: string;
    connect: string;
    sayHello: string;
    rights: string;
    backToTop: string;
    languages: string;
  };
};

export const locales: Record<Locale, { hreflang: string; htmlLang: string; ogLocale: string; label: string; ui: Ui }> = {
  en: {
    hreflang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    label: "English",
    ui: {
      nav: { features: "Features", pricing: "Pricing", tools: "Free tools", faq: "FAQ", faqHref: "/#faq" },
      login: "Log in",
      dashboard: "Dashboard",
      home: "Home",
      breadcrumb: "Breadcrumb",
      startFree: "Start free",
      explore: ["Keep exploring.", "Wapzen, for free."],
      readMore: "Read more",
      openTools: "Open tools",
      toolsTitle: "Free WhatsApp tools",
      toolsBody: "Link and QR code generators, a country code finder, and more. No sign-up.",
      copy: "Copy",
      copied: "Copied",
      footer: {
        tagline: ["WhatsApp AI chatbots and voice call agents.", "Powered by your business."],
        product: "PRODUCT",
        features: "Features",
        chatbot: "WhatsApp AI chatbot",
        voiceAgent: "WhatsApp AI voice agent",
        useCases: "Use cases",
        industries: "Industries",
        howItWorks: "How it works",
        faq: "FAQ",
        freeTools: "FREE TOOLS",
        allTools: "All free tools",
        solutions: "SOLUTIONS",
        connect: "LET'S CONNECT",
        sayHello: "Say hello",
        rights: "All rights reserved.",
        backToTop: "Back to top ↑",
        languages: "Languages",
      },
    },
  },
  "pt-BR": {
    hreflang: "pt-BR",
    htmlLang: "pt-BR",
    ogLocale: "pt_BR",
    label: "Português (Brasil)",
    ui: {
      nav: { features: "Recursos", pricing: "Preços", tools: "Ferramentas grátis", faq: "Perguntas", faqHref: "#faq" },
      login: "Entrar",
      dashboard: "Painel",
      home: "Início",
      breadcrumb: "Navegação estrutural",
      startFree: "Comece grátis",
      explore: ["Continue explorando.", "Wapzen, grátis."],
      readMore: "Saiba mais",
      openTools: "Abrir ferramentas",
      toolsTitle: "Ferramentas grátis para WhatsApp",
      toolsBody: "Geradores de link e QR Code, códigos de país e mais. Em inglês, sem cadastro.",
      copy: "Copiar",
      copied: "Copiado",
      footer: {
        tagline: ["Chatbots e agentes de voz com IA para WhatsApp.", "Com as informações da sua empresa."],
        product: "PRODUTO",
        features: "Recursos",
        chatbot: "Chatbot com IA",
        voiceAgent: "Agente de voz com IA",
        useCases: "Casos de uso",
        industries: "Setores",
        howItWorks: "Como funciona",
        faq: "Perguntas frequentes",
        freeTools: "FERRAMENTAS GRÁTIS",
        allTools: "Todas as ferramentas",
        solutions: "SOLUÇÕES",
        connect: "FALE CONOSCO",
        sayHello: "Diga olá",
        rights: "Todos os direitos reservados.",
        backToTop: "Voltar ao topo ↑",
        languages: "Idiomas",
      },
    },
  },
  es: {
    hreflang: "es",
    htmlLang: "es",
    ogLocale: "es_ES",
    label: "Español",
    ui: {
      nav: { features: "Funciones", pricing: "Precios", tools: "Herramientas gratis", faq: "Preguntas", faqHref: "#faq" },
      login: "Entrar",
      dashboard: "Panel",
      home: "Inicio",
      breadcrumb: "Ruta de navegación",
      startFree: "Empieza gratis",
      explore: ["Sigue explorando.", "Wapzen, gratis."],
      readMore: "Leer más",
      openTools: "Abrir herramientas",
      toolsTitle: "Herramientas gratis para WhatsApp",
      toolsBody: "Generadores de enlaces y códigos QR, prefijos de país y más. En inglés, sin registro.",
      copy: "Copiar",
      copied: "Copiado",
      footer: {
        tagline: ["Chatbots y agentes de voz con IA para WhatsApp.", "Con la información de tu negocio."],
        product: "PRODUCTO",
        features: "Funciones",
        chatbot: "Chatbot con IA",
        voiceAgent: "Agente de voz con IA",
        useCases: "Casos de uso",
        industries: "Sectores",
        howItWorks: "Cómo funciona",
        faq: "Preguntas frecuentes",
        freeTools: "HERRAMIENTAS GRATIS",
        allTools: "Todas las herramientas",
        solutions: "SOLUCIONES",
        connect: "HABLEMOS",
        sayHello: "Saluda",
        rights: "Todos los derechos reservados.",
        backToTop: "Volver arriba ↑",
        languages: "Idiomas",
      },
    },
  },
  it: {
    hreflang: "it",
    htmlLang: "it",
    ogLocale: "it_IT",
    label: "Italiano",
    ui: {
      nav: { features: "Funzioni", pricing: "Prezzi", tools: "Strumenti gratis", faq: "Domande", faqHref: "#faq" },
      login: "Accedi",
      dashboard: "Dashboard",
      home: "Home",
      breadcrumb: "Percorso di navigazione",
      startFree: "Inizia gratis",
      explore: ["Continua a esplorare.", "Wapzen, gratis."],
      readMore: "Scopri di più",
      openTools: "Apri gli strumenti",
      toolsTitle: "Strumenti gratis per WhatsApp",
      toolsBody: "Generatori di link e codici QR, prefissi internazionali e altro. In inglese, senza registrazione.",
      copy: "Copia",
      copied: "Copiato",
      footer: {
        tagline: ["Chatbot e agenti vocali AI per WhatsApp.", "Con le informazioni della tua attività."],
        product: "PRODOTTO",
        features: "Funzioni",
        chatbot: "Chatbot AI",
        voiceAgent: "Agente vocale AI",
        useCases: "Casi d'uso",
        industries: "Settori",
        howItWorks: "Come funziona",
        faq: "Domande frequenti",
        freeTools: "STRUMENTI GRATIS",
        allTools: "Tutti gli strumenti",
        solutions: "SOLUZIONI",
        connect: "CONTATTACI",
        sayHello: "Scrivici",
        rights: "Tutti i diritti riservati.",
        backToTop: "Torna su ↑",
        languages: "Lingue",
      },
    },
  },
};
