// Languages of the public marketing pages. English pages live at the root;
// the others under /pt-br, /es and /it (see app/<prefix>/layout.tsx). Each
// localized page names its English equivalent in lib/marketingPages.ts (blog
// posts in lib/blogPosts.ts), which drives the hreflang alternates. The
// dashboard itself is English-only.

export type Locale = "en" | "pt-BR" | "es" | "it";

/** The blog index and the fixed text of its posts, in one language. */
export type BlogUi = {
  href: string;
  label: string;
  /** BCP 47 locale for dates ("28 October 2026", "28 ottobre 2026"). */
  dateLocale: string;
  author: string;
  updated: string;
  minRead: (minutes: number) => string;
  tags: Record<"Comparison" | "Alternatives" | "Guide" | "Explainer", string>;
  onThisPage: string;
  faqTitle: string;
  sourcesTitle: string;
  guideTitle: string;
  /** The note above the sources, by post kind, with the date the facts were checked. */
  guideNote: (date: string) => string;
  explainerNote: (date: string) => string;
  comparisonNote: (date: string) => string;
  keepReading: [string, string];
  readPost: string;
  learnMore: string;
  choose: (name: string) => string;
};

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
  /** Set only where the blog has posts in that language (English, Italian). */
  blog?: BlogUi;
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
      blog: {
        href: "/blog",
        label: "Blog",
        dateLocale: "en-GB",
        author: "Wapzen team",
        updated: "Updated",
        minRead: (minutes) => `${minutes} min read`,
        tags: { Comparison: "Comparison", Alternatives: "Alternatives", Guide: "Guide", Explainer: "Explainer" },
        onThisPage: "On this page",
        faqTitle: "Frequently asked questions",
        sourcesTitle: "Sources",
        guideTitle: "About this guide",
        guideNote: (date) => `The steps and screenshots come from Wapzen’s dashboard on ${date}, filled with demo data: the businesses, people, and phone numbers in them are made up.`,
        explainerNote: (date) => `The facts and prices in this post come from the sources below, checked on ${date}. Meta and other vendors change their prices and policies often, so confirm them at the source before you rely on them. Dashboard screenshots, where shown, use demo data.`,
        comparisonNote: (date) => `Prices and features come from each vendor’s own pages, checked on ${date}. They change often, so confirm them on the vendor’s site before you buy.`,
        keepReading: ["Keep reading.", "More from the blog."],
        readPost: "Read post",
        learnMore: "Learn more",
        choose: (name) => `Choose ${name} if…`,
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
      blog: {
        href: "/it/blog",
        label: "Blog",
        dateLocale: "it-IT",
        author: "Team Wapzen",
        updated: "Aggiornato il",
        minRead: (minutes) => `${minutes} min di lettura`,
        tags: { Comparison: "Confronto", Alternatives: "Alternative", Guide: "Guida", Explainer: "Approfondimento" },
        onThisPage: "In questa pagina",
        faqTitle: "Domande frequenti",
        sourcesTitle: "Fonti",
        guideTitle: "Informazioni su questa guida",
        guideNote: (date) => `I passaggi e le schermate vengono dalla dashboard di Wapzen del ${date}, con dati dimostrativi: attività, persone e numeri di telefono sono inventati.`,
        explainerNote: (date) => `Fatti e prezzi di questo articolo vengono dalle fonti qui sotto, verificate il ${date}. Meta e gli altri fornitori cambiano spesso prezzi e regole: controllali alla fonte prima di basarti su di essi.`,
        comparisonNote: (date) => `Prezzi e funzioni vengono dalle pagine di ciascun fornitore, verificate il ${date}. Cambiano spesso: controllali sul sito del fornitore prima di acquistare.`,
        keepReading: ["Continua a leggere.", "Altri articoli dal blog."],
        readPost: "Leggi l’articolo",
        learnMore: "Scopri di più",
        choose: (name) => `Scegli ${name} se…`,
      },
    },
  },
};
