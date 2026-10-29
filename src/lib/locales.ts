// Languages of the public marketing pages. English pages live at the root;
// the others under /pt-br, /es, /es-mx, /it, /de, /fr and /nl (see
// app/<prefix>/layout.tsx). Each localized page names its English equivalent in
// lib/marketingPages.ts (blog posts in lib/blogPosts.ts), which drives the
// hreflang alternates. German, French and Dutch have only a blog so far. The
// dashboard itself is English-only.

export type Locale = "en" | "pt-BR" | "es" | "es-MX" | "it" | "de" | "fr" | "nl";

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
  /** Set only where the blog has posts in that language. */
  blog?: BlogUi;
};

export const locales: Record<Locale, {
  hreflang: string;
  htmlLang: string;
  ogLocale: string;
  label: string;
  /** A language whose marketing pages stand in where this one has none (es-MX uses Spain's; de, fr and nl the English ones). */
  fallback?: Locale;
  ui: Ui;
}> = {
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
      blog: {
        href: "/pt-br/blog",
        label: "Blog",
        dateLocale: "pt-BR",
        author: "Equipe Wapzen",
        updated: "Atualizado em",
        minRead: (minutes) => `${minutes} min de leitura`,
        tags: { Comparison: "Comparação", Alternatives: "Alternativas", Guide: "Guia", Explainer: "Entenda" },
        onThisPage: "Nesta página",
        faqTitle: "Perguntas frequentes",
        sourcesTitle: "Fontes",
        guideTitle: "Sobre este guia",
        guideNote: (date) => `Os passos e as telas vêm do painel da Wapzen em ${date}, com dados de demonstração: empresas, pessoas e números de telefone são fictícios.`,
        explainerNote: (date) => `Os fatos e preços deste artigo vêm das fontes abaixo, conferidas em ${date}. A Meta e outros fornecedores mudam preços e regras com frequência: confirme na fonte antes de tomar decisões.`,
        comparisonNote: (date) => `Preços e recursos vêm das páginas de cada fornecedor, conferidas em ${date}. Eles mudam com frequência: confirme no site do fornecedor antes de contratar.`,
        keepReading: ["Continue lendo.", "Mais do blog."],
        readPost: "Ler artigo",
        learnMore: "Saiba mais",
        choose: (name) => `Escolha ${name} se…`,
      },
    },
  },
  es: {
    hreflang: "es",
    htmlLang: "es",
    ogLocale: "es_ES",
    label: "Español (España)",
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
      blog: {
        href: "/es/blog",
        label: "Blog",
        dateLocale: "es-ES",
        author: "Equipo Wapzen",
        updated: "Actualizado el",
        minRead: (minutes) => `${minutes} min de lectura`,
        tags: { Comparison: "Comparativa", Alternatives: "Alternativas", Guide: "Guía", Explainer: "A fondo" },
        onThisPage: "En esta página",
        faqTitle: "Preguntas frecuentes",
        sourcesTitle: "Fuentes",
        guideTitle: "Sobre esta guía",
        guideNote: (date) => `Los pasos y las pantallas vienen del panel de Wapzen del ${date}, con datos de demostración: negocios, personas y números de teléfono son ficticios.`,
        explainerNote: (date) => `Los datos y precios de este artículo vienen de las fuentes de abajo, revisadas el ${date}. Meta y los demás proveedores cambian a menudo sus precios y condiciones: compruébalos en la fuente antes de decidir.`,
        comparisonNote: (date) => `Precios y funciones vienen de la página de cada proveedor, revisadas el ${date}. Cambian a menudo: compruébalos en su web antes de contratar.`,
        keepReading: ["Sigue leyendo.", "Más del blog."],
        readPost: "Leer artículo",
        learnMore: "Saber más",
        choose: (name) => `Elige ${name} si…`,
      },
    },
  },
  "es-MX": {
    hreflang: "es-MX",
    htmlLang: "es-MX",
    ogLocale: "es_MX",
    label: "Español (México)",
    fallback: "es",
    ui: {
      nav: { features: "Funciones", pricing: "Precios", tools: "Herramientas gratis", faq: "Preguntas", faqHref: "#faq" },
      login: "Iniciar sesión",
      dashboard: "Panel",
      home: "Inicio",
      breadcrumb: "Ruta de navegación",
      startFree: "Empieza gratis",
      explore: ["Sigue explorando.", "Wapzen, gratis."],
      readMore: "Leer más",
      openTools: "Abrir herramientas",
      toolsTitle: "Herramientas gratis para WhatsApp",
      toolsBody: "Generadores de enlaces y códigos QR, ladas internacionales y más. En inglés, sin registro.",
      copy: "Copiar",
      copied: "Copiado",
      footer: {
        tagline: ["Chatbots y agentes de voz con IA para WhatsApp.", "Con la información de tu negocio."],
        product: "PRODUCTO",
        features: "Funciones",
        chatbot: "Chatbot con IA",
        voiceAgent: "Agente de voz con IA",
        useCases: "Casos de uso",
        industries: "Industrias",
        howItWorks: "Cómo funciona",
        faq: "Preguntas frecuentes",
        freeTools: "HERRAMIENTAS GRATIS",
        allTools: "Todas las herramientas",
        solutions: "SOLUCIONES",
        connect: "HABLEMOS",
        sayHello: "Escríbenos",
        rights: "Todos los derechos reservados.",
        backToTop: "Volver arriba ↑",
        languages: "Idiomas",
      },
      blog: {
        href: "/es-mx/blog",
        label: "Blog",
        dateLocale: "es-MX",
        author: "Equipo Wapzen",
        updated: "Actualizado el",
        minRead: (minutes) => `${minutes} min de lectura`,
        tags: { Comparison: "Comparativa", Alternatives: "Alternativas", Guide: "Guía", Explainer: "A fondo" },
        onThisPage: "En esta página",
        faqTitle: "Preguntas frecuentes",
        sourcesTitle: "Fuentes",
        guideTitle: "Sobre esta guía",
        guideNote: (date) => `Los pasos y las pantallas vienen del panel de Wapzen del ${date}, con datos de demostración: negocios, personas y números de teléfono son ficticios.`,
        explainerNote: (date) => `Los datos y precios de este artículo vienen de las fuentes de abajo, revisadas el ${date}. Meta y otros proveedores cambian sus precios y reglas seguido: confírmalos en la fuente antes de tomar decisiones.`,
        comparisonNote: (date) => `Precios y funciones vienen de la página de cada proveedor, revisadas el ${date}. Cambian seguido: confírmalos en el sitio del proveedor antes de contratar.`,
        keepReading: ["Sigue leyendo.", "Más del blog."],
        readPost: "Leer artículo",
        learnMore: "Conoce más",
        choose: (name) => `Elige ${name} si…`,
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
  de: {
    hreflang: "de",
    htmlLang: "de",
    ogLocale: "de_DE",
    label: "Deutsch",
    fallback: "en",
    ui: {
      nav: { features: "Funktionen", pricing: "Preise", tools: "Gratis-Tools", faq: "FAQ", faqHref: "#faq" },
      login: "Anmelden",
      dashboard: "Dashboard",
      home: "Startseite",
      breadcrumb: "Brotkrümelnavigation",
      startFree: "Kostenlos starten",
      explore: ["Weiter entdecken.", "Wapzen kostenlos starten."],
      readMore: "Mehr erfahren",
      openTools: "Tools öffnen",
      toolsTitle: "Kostenlose WhatsApp-Tools",
      toolsBody: "Link- und QR-Code-Generatoren, Ländervorwahlen und mehr. Auf Englisch, ohne Anmeldung.",
      copy: "Kopieren",
      copied: "Kopiert",
      footer: {
        tagline: ["KI-Chatbots und KI-Sprachagenten für WhatsApp.", "Mit dem Wissen deines Unternehmens."],
        product: "PRODUKT",
        features: "Funktionen",
        chatbot: "KI-Chatbot",
        voiceAgent: "KI-Sprachagent",
        useCases: "Anwendungsfälle",
        industries: "Branchen",
        howItWorks: "So funktioniert’s",
        faq: "Häufige Fragen",
        freeTools: "GRATIS-TOOLS",
        allTools: "Alle Tools",
        solutions: "LÖSUNGEN",
        connect: "KONTAKT",
        sayHello: "Schreib uns",
        rights: "Alle Rechte vorbehalten.",
        backToTop: "Nach oben ↑",
        languages: "Sprachen",
      },
      blog: {
        href: "/de/blog",
        label: "Blog",
        dateLocale: "de-DE",
        author: "Wapzen-Team",
        updated: "Aktualisiert am",
        minRead: (minutes) => `${minutes} Min. Lesezeit`,
        tags: { Comparison: "Vergleich", Alternatives: "Alternativen", Guide: "Anleitung", Explainer: "Ratgeber" },
        onThisPage: "Auf dieser Seite",
        faqTitle: "Häufige Fragen",
        sourcesTitle: "Quellen",
        guideTitle: "Über diese Anleitung",
        guideNote: (date) => `Die Schritte und Screenshots stammen aus dem Wapzen-Dashboard vom ${date}, mit Demodaten: Unternehmen, Personen und Telefonnummern sind erfunden.`,
        explainerNote: (date) => `Fakten und Preise in diesem Artikel stammen aus den Quellen unten, geprüft am ${date}. Meta und andere Anbieter ändern Preise und Bedingungen oft: Prüfe sie an der Quelle, bevor du dich darauf verlässt.`,
        comparisonNote: (date) => `Preise und Funktionen stammen von den Seiten der jeweiligen Anbieter, geprüft am ${date}. Sie ändern sich oft: Prüfe sie beim Anbieter, bevor du buchst.`,
        keepReading: ["Weiterlesen.", "Mehr aus dem Blog."],
        readPost: "Artikel lesen",
        learnMore: "Mehr erfahren",
        choose: (name) => `Wähle ${name}, wenn…`,
      },
    },
  },
  fr: {
    hreflang: "fr",
    htmlLang: "fr",
    ogLocale: "fr_FR",
    label: "Français",
    fallback: "en",
    ui: {
      nav: { features: "Fonctionnalités", pricing: "Tarifs", tools: "Outils gratuits", faq: "FAQ", faqHref: "#faq" },
      login: "Se connecter",
      dashboard: "Tableau de bord",
      home: "Accueil",
      breadcrumb: "Fil d’Ariane",
      startFree: "Commencer gratuitement",
      explore: ["Continuez à explorer.", "Wapzen, gratuit pour démarrer."],
      readMore: "En savoir plus",
      openTools: "Ouvrir les outils",
      toolsTitle: "Outils WhatsApp gratuits",
      toolsBody: "Générateurs de liens et de QR codes, indicatifs pays et plus. En anglais, sans inscription.",
      copy: "Copier",
      copied: "Copié",
      footer: {
        tagline: ["Chatbots IA et agents vocaux IA pour WhatsApp.", "Avec les informations de votre entreprise."],
        product: "PRODUIT",
        features: "Fonctionnalités",
        chatbot: "Chatbot IA",
        voiceAgent: "Agent vocal IA",
        useCases: "Cas d’usage",
        industries: "Secteurs",
        howItWorks: "Comment ça marche",
        faq: "Questions fréquentes",
        freeTools: "OUTILS GRATUITS",
        allTools: "Tous les outils",
        solutions: "SOLUTIONS",
        connect: "CONTACT",
        sayHello: "Écrivez-nous",
        rights: "Tous droits réservés.",
        backToTop: "Haut de page ↑",
        languages: "Langues",
      },
      blog: {
        href: "/fr/blog",
        label: "Blog",
        dateLocale: "fr-FR",
        author: "L’équipe Wapzen",
        updated: "Mis à jour le",
        minRead: (minutes) => `${minutes} min de lecture`,
        tags: { Comparison: "Comparatif", Alternatives: "Alternatives", Guide: "Guide", Explainer: "Décryptage" },
        onThisPage: "Sur cette page",
        faqTitle: "Questions fréquentes",
        sourcesTitle: "Sources",
        guideTitle: "À propos de ce guide",
        guideNote: (date) => `Les étapes et les captures d’écran viennent du tableau de bord Wapzen du ${date}, avec des données de démonstration : entreprises, personnes et numéros sont fictifs.`,
        explainerNote: (date) => `Les faits et les prix de cet article viennent des sources ci-dessous, vérifiées le ${date}. Meta et les autres fournisseurs changent souvent leurs prix et leurs conditions : vérifiez-les à la source avant de vous y fier.`,
        comparisonNote: (date) => `Les prix et les fonctionnalités viennent des pages de chaque fournisseur, vérifiées le ${date}. Ils changent souvent : vérifiez-les sur le site du fournisseur avant de souscrire.`,
        keepReading: ["Continuez la lecture.", "D’autres articles du blog."],
        readPost: "Lire l’article",
        learnMore: "En savoir plus",
        choose: (name) => `Choisissez ${name} si…`,
      },
    },
  },
  nl: {
    hreflang: "nl",
    htmlLang: "nl",
    ogLocale: "nl_NL",
    label: "Nederlands",
    fallback: "en",
    ui: {
      nav: { features: "Functies", pricing: "Prijzen", tools: "Gratis tools", faq: "FAQ", faqHref: "#faq" },
      login: "Inloggen",
      dashboard: "Dashboard",
      home: "Home",
      breadcrumb: "Kruimelpad",
      startFree: "Gratis starten",
      explore: ["Ontdek meer.", "Gratis starten met Wapzen."],
      readMore: "Lees meer",
      openTools: "Tools openen",
      toolsTitle: "Gratis WhatsApp-tools",
      toolsBody: "Link- en QR-codegenerators, landcodes en meer. In het Engels, zonder account.",
      copy: "Kopiëren",
      copied: "Gekopieerd",
      footer: {
        tagline: ["AI-chatbots en AI-spraakagenten voor WhatsApp.", "Met de kennis van je eigen bedrijf."],
        product: "PRODUCT",
        features: "Functies",
        chatbot: "AI-chatbot",
        voiceAgent: "AI-spraakagent",
        useCases: "Toepassingen",
        industries: "Branches",
        howItWorks: "Zo werkt het",
        faq: "Veelgestelde vragen",
        freeTools: "GRATIS TOOLS",
        allTools: "Alle tools",
        solutions: "OPLOSSINGEN",
        connect: "CONTACT",
        sayHello: "Stuur ons een bericht",
        rights: "Alle rechten voorbehouden.",
        backToTop: "Naar boven ↑",
        languages: "Talen",
      },
      blog: {
        href: "/nl/blog",
        label: "Blog",
        dateLocale: "nl-NL",
        author: "Team Wapzen",
        updated: "Bijgewerkt op",
        minRead: (minutes) => `${minutes} min lezen`,
        tags: { Comparison: "Vergelijking", Alternatives: "Alternatieven", Guide: "Handleiding", Explainer: "Uitleg" },
        onThisPage: "Op deze pagina",
        faqTitle: "Veelgestelde vragen",
        sourcesTitle: "Bronnen",
        guideTitle: "Over deze handleiding",
        guideNote: (date) => `De stappen en screenshots komen uit het Wapzen-dashboard van ${date}, met demogegevens: bedrijven, personen en telefoonnummers zijn verzonnen.`,
        explainerNote: (date) => `De feiten en prijzen in dit artikel komen uit de bronnen hieronder, gecontroleerd op ${date}. Meta en andere aanbieders passen hun prijzen en voorwaarden vaak aan: controleer ze bij de bron voordat je erop vertrouwt.`,
        comparisonNote: (date) => `Prijzen en functies komen van de pagina’s van elke aanbieder, gecontroleerd op ${date}. Ze veranderen vaak: controleer ze bij de aanbieder voordat je een abonnement neemt.`,
        keepReading: ["Lees verder.", "Meer uit de blog."],
        readPost: "Artikel lezen",
        learnMore: "Meer informatie",
        choose: (name) => `Kies ${name} als…`,
      },
    },
  },
};
