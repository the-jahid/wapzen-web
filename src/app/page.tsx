import type { Metadata } from "next";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { siteConfig } from "@/lib/site";
import { ThemeToggleButton } from "@/components/theme/ThemeToggle";
import { WisprFlowText } from "@/blocks/wispr-flow-text-animation";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

type IconName =
  | "phone"
  | "broadcast"
  | "calendar"
  | "lead"
  | "routing"
  | "analytics"
  | "check"
  | "clock"
  | "shield"
  | "spark"
  | "arrow"
  | "star"
  | "globe"
  | "bolt"
  | "message"
  | "book";

const iconPaths: Record<IconName, string[]> = {
  phone: [
    "M7.5 4.75h3l1.5 4-2 1.25a12.2 12.2 0 0 0 5 5l1.25-2 4 1.5v3a2 2 0 0 1-2.2 2 15.7 15.7 0 0 1-13.3-13.3 2 2 0 0 1 2-2.2Z",
  ],
  broadcast: [
    "M8 8.5a5.7 5.7 0 0 0 0 7",
    "M5 5.5a10 10 0 0 0 0 13",
    "M16 8.5a5.7 5.7 0 0 1 0 7",
    "M19 5.5a10 10 0 0 1 0 13",
    "M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
  ],
  calendar: [
    "M7 4v3",
    "M17 4v3",
    "M5.5 7h13A1.5 1.5 0 0 1 20 8.5v10A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-10A1.5 1.5 0 0 1 5.5 7Z",
    "M4 11h16",
    "M8 15h3",
    "M13 15h3",
  ],
  lead: [
    "M12 12m-3.25 0a3.25 3.25 0 1 0 6.5 0a3.25 3.25 0 1 0-6.5 0",
    "M5 20a7 7 0 0 1 14 0",
    "M18 5.5h3",
    "M19.5 4v3",
  ],
  routing: [
    "M5 7h4a3 3 0 0 1 3 3v4a3 3 0 0 0 3 3h4",
    "M16 14l3 3-3 3",
    "M5 17h3",
    "M5 7l3-3",
    "M5 7l3 3",
  ],
  analytics: ["M5 19V9", "M10 19V5", "M15 19v-7", "M20 19V8", "M4 19h17"],
  check: ["M5 12.5l4 4 10-10"],
  clock: ["M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0", "M12 7.5V12l3 2"],
  shield: [
    "M12 3.5l7 2.5v5c0 4.2-2.9 7.7-7 9-4.1-1.3-7-4.8-7-9v-5l7-2.5Z",
    "M9 12l2 2 4-4",
  ],
  spark: ["M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4Z"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  star: ["M12 4.5l2.2 4.6 5 .6-3.6 3.5.9 5L12 15.9 7.4 18.2l.9-5L4.7 9.7l5-.6L12 4.5Z"],
  globe: [
    "M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0",
    "M4 12h16",
    "M12 4a12.5 12.5 0 0 1 0 16",
    "M12 4a12.5 12.5 0 0 0 0 16",
  ],
  bolt: ["M13 3 5 13.5h5.5L11 21l8-10.5h-5.5L13 3Z"],
  message: ["M4 5.5h16v11H9l-5 3v-14Z", "M8 9h8", "M8 12.5h6"],
  book: ["M5 4.5h12a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2V4.5Z", "M5 17a2 2 0 0 1 2-2h12", "M9 8h6"],
};

const steps = [
  {
    title: "Connect your number",
    body: "Pair a WhatsApp number from the dashboard by scanning a QR code.",
  },
  {
    title: "Create your agents",
    body: "Set up a chat agent for messages and a voice agent for inbound or outbound calls.",
  },
  {
    title: "Add your context",
    body: "Write the system prompt, attach knowledge bases, and choose the tools each agent can use.",
  },
  {
    title: "Review activity",
    body: "Read chat conversations, inspect call transcripts, and track outbound campaign performance.",
  },
];

const pipeline: Array<[string, string, string]> = [
  ["Connect", "Pair your WhatsApp number with a QR code", "#e4e4e7"],
  ["Configure", "Set prompts, models, voices, and agent tools", "#818cf8"],
  ["Respond", "Handle text messages and voice calls", "#34d399"],
  ["Review", "See conversations, transcripts, and campaign activity", "#52525b"],
];

const leadFeatures: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: "message",
    title: "Chat conversations",
    body: "Review saved WhatsApp message threads and reply from the dashboard.",
  },
  {
    icon: "phone",
    title: "Call transcripts",
    body: "Inspect call history and the conversation recorded for each call.",
  },
  {
    icon: "analytics",
    title: "Campaign analytics",
    body: "Track call activity and outcomes across outbound campaigns.",
  },
  {
    icon: "spark",
    title: "Agent controls",
    body: "Edit prompts, models, knowledge, tools, and agent status as you go.",
  },
];

const agentModes: Array<{ icon: IconName; title: string; body: string; detail: string }> = [
  {
    icon: "message",
    title: "AI chat agent for WhatsApp messages",
    body: "Answer incoming text messages with a configurable OpenAI or Anthropic model. Set a system prompt and attach knowledge bases and API tools.",
    detail: "Best for questions, support, and ongoing text conversations.",
  },
  {
    icon: "phone",
    title: "AI voice agent for WhatsApp calls",
    body: "Configure a spoken agent for inbound, outbound, or both call directions. Choose a voice provider, transcriber, prompt, and connected tools.",
    detail: "Best for phone conversations and outbound call campaigns.",
  },
];

const faqs: Array<{ q: string; a: string }> = [
  {
    q: "What is Wapzen?",
    a: "Wapzen is a builder for WhatsApp AI chat agents and voice agents. You can configure responses to incoming text messages, handle WhatsApp calls, and manage outbound call campaigns from a dashboard.",
  },
  {
    q: "Can I make a WhatsApp AI chat agent?",
    a: "Yes. Create a chat agent, choose an OpenAI or Anthropic model, write its system prompt, and attach knowledge bases or API tools. An active agent can reply to incoming WhatsApp text messages on its connected number.",
  },
  {
    q: "Can I build a WhatsApp voice agent for inbound and outbound calls?",
    a: "Yes. Set a voice agent to handle inbound calls, outbound calls, or both. Configure its prompt, language, voice provider, transcriber, knowledge bases, and tools.",
  },
  {
    q: "How do I connect a WhatsApp number?",
    a: "Start a WhatsApp login in the dashboard and scan the QR code with the number you want to connect. Assign the connected number to the agent you configure.",
  },
  {
    q: "Can agents use my business information and external APIs?",
    a: "Yes. Add text or files to a knowledge base and attach it to an agent. You can also create API request tools for actions in external systems and attach those tools to an agent.",
  },
  {
    q: "Where can I review messages and calls?",
    a: "The dashboard includes WhatsApp chat conversations, call history with transcripts, and outbound campaign activity and analytics.",
  },
];

const footerColumns: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: "Product",
    links: [
      ["Chat and voice agents", "#agent-types"],
      ["Capabilities", "#capabilities"],
      ["How it works", "#workflow"],
      ["Get started", "#get-started"],
    ],
  },
  {
    title: "Features",
    links: [
      ["AI chat agent", "#agent-types"],
      ["AI voice agent", "#agent-types"],
      ["Outbound campaigns", "#capabilities"],
      ["Knowledge bases", "#capabilities"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["FAQ", "#faq"],
      ["How it works", "#workflow"],
      ["Conversation history", "#conversation-history"],
      ["Create an agent", "#get-started"],
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/opengraph-image`,
        width: 1200,
        height: 630,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      inLanguage: "en",
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/#webpage`,
      url: siteConfig.url,
      name: siteConfig.title,
      description: siteConfig.description,
      inLanguage: "en",
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#software` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.url}/#software`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      featureList: [
        "WhatsApp AI chat agents for incoming text messages",
        "WhatsApp AI voice agents for inbound and outbound calls",
        "Outbound call campaigns",
        "Knowledge bases and API request tools for agents",
        "Chat conversations, call transcripts, and campaign analytics",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.url}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

// Ambient text behind the hero illustrates a configurable agent conversation.
const heroTranscript =
  "WhatsApp message received. The chat agent checks its prompt and business knowledge, " +
  "then replies in the conversation. An incoming call is handled by the voice agent. " +
  "The dashboard keeps the chat thread, call history, and transcript ready to review.";

function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {iconPaths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}

function Logo() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-linear-to-br from-brand-bright to-brand text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
      <Icon name="phone" className="h-4.5 w-4.5" />
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-brand-bright/25 bg-brand-bright/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-light">
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  sub,
  id,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  id: string;
}) {
  return (
    <div className="reveal mx-auto max-w-2xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-5 font-display text-3xl font-bold tracking-tight text-site-text sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
        id={id}
      >
        {title}
      </h2>
      {sub ? <p className="mt-4 text-base leading-7 text-site-text-muted">{sub}</p> : null}
    </div>
  );
}

const deckBars = [34, 52, 28, 64, 40, 74, 50, 66, 44, 80, 58, 88];

function FeyDeck() {
  const layer = (i: number) => ({ "--i": i } as React.CSSProperties);
  return (
    <div className="fey-deck">
      <div className="fey-floor" />
      {[5, 4, 3, 2, 1].map((i) => (
        <div className="fey-panel" key={i} style={layer(i)} />
      ))}
      <div className="fey-panel" style={layer(0)}>
        <div className="flex h-full flex-col p-5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-linear-to-br from-brand-bright to-brand text-white">
                <Icon name="phone" className="h-3 w-3" />
              </span>
              <span className="text-[10px] font-semibold tracking-wide text-white/75">
                Wapzen
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/50">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Preview
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Agent channels
              </p>
              <p className="font-display text-2xl font-bold text-white">Chat + voice</p>
            </div>
            <p className="pb-1 text-[10px] font-bold text-emerald-400">WhatsApp</p>
          </div>

          <div className="relative mt-4 h-24 overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.02]">
            <div className="absolute inset-0 bg-[radial-gradient(90%_100%_at_50%_100%,rgba(99,102,241,0.4),transparent_72%)]" />
            <div className="absolute inset-x-2.5 bottom-2 flex items-end gap-[3px]">
              {deckBars.map((height, i) => (
                <span
                  className="flex-1 rounded-[2px] bg-white/30"
                  key={i}
                  style={{ height: `${height * 0.8}px` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="h-1.5 w-4/5 rounded-full bg-white/12" />
            <div className="h-1.5 w-3/5 rounded-full bg-white/[0.07]" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/[0.07]" />
          </div>

          <div className="mt-auto grid grid-cols-3 gap-2">
            {[
              ["Messages", "AI chat"],
              ["Calls", "AI voice"],
              ["Actions", "Tools"],
            ].map(([label, value]) => (
              <div
                className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-2"
                key={label}
              >
                <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  {label}
                </p>
                <p className="mt-0.5 text-xs font-bold text-white/85">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-site-bg text-site-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <a
        className="sr-only z-[60] rounded-xl bg-site-invert-bg px-4 py-2 font-semibold text-site-invert-text focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main"
      >
        Skip to content
      </a>

      {/* ============ HEADER (floating pill) ============ */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 min-[375px]:px-4">
        <nav
          aria-label="Primary"
          className="mx-auto mt-3 flex h-14 max-w-5xl items-center justify-between gap-2 rounded-2xl border border-site-border bg-site-nav px-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl min-[375px]:mt-4 sm:px-4"
        >
          <a className="flex min-w-0 items-center gap-2 sm:gap-2.5 sm:pl-1" href="#top">
            <Logo />
            <Show when="signed-out">
              <span className="whitespace-nowrap font-display text-[0.85rem] font-bold tracking-tight min-[375px]:text-[0.9rem] sm:text-[0.95rem]">
                Wapzen
              </span>
            </Show>
            <Show when="signed-in">
              <span className="hidden whitespace-nowrap font-display text-[0.95rem] font-bold tracking-tight sm:inline">
                Wapzen
              </span>
            </Show>
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium text-site-text-muted md:flex">
            <a className="transition hover:text-site-text" href="#capabilities">
              Features
            </a>
            <a className="transition hover:text-site-text" href="#workflow">
              How it works
            </a>
            <a className="transition hover:text-site-text" href="#agent-types">
              Chat + voice
            </a>
            <a className="transition hover:text-site-text" href="#faq">
              FAQ
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggleButton />
            <Show when="signed-out">
              <SignInButton
                forceRedirectUrl="/dashboard"
                mode="modal"
                signUpForceRedirectUrl="/dashboard"
              >
                <button
                  className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-xl bg-brand px-3 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(79,70,229,0.18)] transition hover:bg-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright sm:px-4"
                  type="button"
                >
                  Log in
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <a
                className="whitespace-nowrap rounded-lg bg-linear-to-b from-brand-bright to-brand px-2.5 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition hover:brightness-110 min-[375px]:rounded-xl min-[375px]:px-3 min-[375px]:text-sm sm:px-4"
                href="/dashboard"
              >
                Dashboard
              </a>
              <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
            </Show>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* ============ HERO ============ */}
        <section
          aria-label="Hero"
          className="relative overflow-hidden border-b border-site-border bg-[#030303]"
          id="top"
        >
          {/* Ambient backdrop */}
          <div
            aria-hidden="true"
            className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_45%,#000_20%,transparent_100%)]"
          />
          <WisprFlowText
            className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(75%_70%_at_50%_52%,#000_15%,transparent_100%)]"
            fontSize={13}
            speed={18}
            strokeColor="rgba(255,255,255,0.04)"
            text={heroTranscript}
            textColor="#ffffff"
            textOpacity={0.09}
          />

          <div className="relative z-10 mx-auto grid min-h-svh max-w-7xl items-center gap-16 px-5 py-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10">
            <div className="relative z-10 flex flex-col items-center gap-7 text-center lg:items-start lg:text-left">
              <h1 className="font-display text-[2.15rem] font-bold leading-[1.08] tracking-tight text-white min-[375px]:text-4xl sm:text-6xl sm:leading-normal lg:text-7xl">
                Build WhatsApp AI chat and voice agents.
              </h1>
              <p className="max-w-xl text-balance text-sm leading-7 text-white/55 sm:text-base">
                Create a WhatsApp AI chat agent for messages and a voice agent for
                inbound or outbound calls. Connect your number, add your business
                knowledge, and review chats and calls in one dashboard.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Show when="signed-out">
                  <SignUpButton
                    forceRedirectUrl="/dashboard"
                    mode="modal"
                    signInForceRedirectUrl="/dashboard"
                  >
                    <button
                      className="rounded-xl bg-linear-to-b from-brand-bright to-brand px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition hover:brightness-110"
                      type="button"
                    >
                      Create an agent
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <a
                    className="rounded-xl bg-linear-to-b from-brand-bright to-brand px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition hover:brightness-110"
                    href="/dashboard"
                  >
                    Open dashboard
                  </a>
                </Show>
                <a
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 backdrop-blur transition hover:border-white/30 hover:text-white"
                  href="#capabilities"
                >
                  Explore features
                </a>
              </div>

              <p className="mt-4 text-sm font-medium text-white/55">
                AI message replies · Inbound and outbound calls · Knowledge bases and tools
              </p>
            </div>

            {/* Fey-style stacked screens */}
            <div
              aria-hidden="true"
              className="fey-stage flex items-center justify-center lg:justify-start lg:pl-4"
            >
              <FeyDeck />
            </div>
          </div>
        </section>

        {/* ============ CAPABILITIES ============ */}
        <FeaturesSection />

        {/* ============ WORKFLOW (horizontal steps) ============ */}
        <section
          aria-labelledby="workflow-heading"
          className="scroll-mt-24 border-y border-site-border bg-site-bg-alt py-20 sm:py-28"
          id="workflow"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="How it works"
              id="workflow-heading"
              sub="Start with a connected WhatsApp number, then configure the agent for the conversations you want it to handle."
              title="From QR connection to active AI agent"
            />

            <ol className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-[1.4rem] hidden h-px bg-site-fill-2 lg:block"
              />
              {steps.map((step, index) => (
                <li
                  className="reveal relative"
                  key={step.title}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <span className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-brand-bright/30 bg-brand-bright/10 font-mono text-sm font-bold text-brand-light">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-site-text">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-site-text-muted">{step.body}</p>
                </li>
              ))}
            </ol>

            <div className="reveal mt-12 flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-site-border bg-site-fill px-5 py-4 text-sm font-medium text-site-text-soft">
                <Icon name="routing" className="h-5 w-5 shrink-0 text-site-text-muted" />
                Control agents, connected numbers, knowledge bases, and tools from the dashboard
              </div>
            </div>
          </div>
        </section>

        {/* ============ CONVERSATION HISTORY ============ */}
        <section
          aria-labelledby="conversation-history-heading"
          className="mx-auto grid max-w-7xl scroll-mt-24 gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-10"
          id="conversation-history"
        >
          <div className="reveal order-2 overflow-hidden rounded-2xl border border-site-border bg-site-panel lg:order-1">
            <div className="flex items-center justify-between border-b border-site-border bg-site-fill px-6 py-4">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-site-text-faint">
                Agent workflow
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-site-border px-3 py-1 text-xs font-semibold text-site-text-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-live" />
                Overview
              </span>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {pipeline.map(([stage, description, color]) => (
                <div
                  className="grid items-center gap-3 px-6 py-5 transition hover:bg-site-fill sm:grid-cols-[10rem_1fr]"
                  key={stage}
                >
                  <p className="flex items-center gap-2.5 font-semibold text-site-text">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {stage}
                  </p>
                  <p className="text-sm leading-6 text-site-text-muted">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal order-1 lg:order-2">
            <Eyebrow>Conversation history</Eyebrow>
            <h2
              className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
              id="conversation-history-heading"
            >
              Review WhatsApp chats, calls, and campaigns
            </h2>
            <p className="mt-5 text-base leading-7 text-site-text-muted">
              See what your agents handled. The dashboard brings together chat
              conversations, call transcripts, and outbound campaign activity
              so your team can follow up with context.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {leadFeatures.map((feature) => (
                <div
                  className="rounded-2xl border border-site-border bg-site-fill p-5 transition hover:border-site-border-strong hover:bg-site-fill"
                  key={feature.title}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-site-border bg-site-fill text-brand-light">
                    <Icon name={feature.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-site-text">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-site-text-muted">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ AGENT TYPES ============ */}
        <section
          aria-labelledby="agent-types-heading"
          className="scroll-mt-24 border-y border-site-border bg-site-bg-alt"
          id="agent-types"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
            <SectionHeading
              eyebrow="Choose your channel"
              id="agent-types-heading"
              title="Make a WhatsApp chat agent or voice agent"
              sub="Build each agent around your prompts, business knowledge, and the actions it needs to take."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {agentModes.map((mode) => (
                <article
                  className="reveal flex h-full flex-col rounded-2xl border border-site-border bg-site-fill p-8"
                  key={mode.title}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-site-border bg-site-fill-2 text-brand-light">
                    <Icon name={mode.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-site-text">
                    {mode.title}
                  </h3>
                  <p className="mt-4 flex-1 text-base leading-7 text-site-text-soft">
                    {mode.body}
                  </p>
                  <p className="mt-6 border-t border-site-border pt-5 text-sm text-site-text-faint">
                    {mode.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section
          aria-labelledby="faq-heading"
          className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
          id="faq"
        >
          <SectionHeading
            eyebrow="Questions"
            id="faq-heading"
            title="WhatsApp AI agent questions answered"
          />
          <div className="reveal mt-10 space-y-3">
            {faqs.map((faq) => (
              <details
                className="group rounded-2xl border border-site-border bg-site-fill px-6 py-5 transition hover:border-brand-bright/30 open:border-brand-bright/30 open:bg-site-fill"
                key={faq.q}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-site-text [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-site-border-strong text-site-text-muted transition group-open:rotate-45 group-open:border-brand-bright/40 group-open:text-brand-light">
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-site-text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ============ GET STARTED ============ */}
        <section
          aria-labelledby="get-started-heading"
          className="relative scroll-mt-24 overflow-hidden border-t border-site-border bg-site-bg-alt py-20 sm:py-28"
          id="get-started"
        >
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_40%,#000_20%,transparent_100%)]" />
          <div className="absolute right-[-10%] top-[-20%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_65%)] blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-10">
            <div className="reveal">
              <Eyebrow>
                <Icon name="spark" className="h-4 w-4" />
                Agent builder
              </Eyebrow>
              <h2
                className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
                id="get-started-heading"
              >
                Create your WhatsApp AI agent in Wapzen
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-site-text-muted">
                Set up the agent that fits your workflow: text replies, inbound
                voice calls, outbound campaigns, or a combination of them.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Connect a WhatsApp number by scanning a QR code",
                  "Set prompts, models, voices, and languages",
                  "Attach knowledge bases and API request tools",
                ].map((point) => (
                  <li className="flex items-center gap-3 text-sm text-site-text-soft" key={point}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-site-border-strong text-site-text-soft">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal rounded-2xl border border-site-border bg-site-bg p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-site-text">
                Start with the channel you need
              </h3>
              <p className="mt-3 text-sm leading-6 text-site-text-muted">
                Open the dashboard to create an agent and connect your number.
                You can adjust its behavior as your business needs change.
              </p>
              <div className="mt-6 grid gap-3">
                <a className="rounded-xl border border-site-border bg-site-fill px-5 py-4 transition hover:border-brand-bright/40" href="#agent-types">
                  <span className="font-semibold text-site-text">WhatsApp AI chat agent</span>
                  <span className="mt-1 block text-sm text-site-text-muted">For incoming text messages and saved conversations</span>
                </a>
                <a className="rounded-xl border border-site-border bg-site-fill px-5 py-4 transition hover:border-brand-bright/40" href="#agent-types">
                  <span className="font-semibold text-site-text">WhatsApp AI voice agent</span>
                  <span className="mt-1 block text-sm text-site-text-muted">For inbound calls and outbound campaigns</span>
                </a>
              </div>
              <Show when="signed-out">
                <SignUpButton forceRedirectUrl="/dashboard" mode="modal" signInForceRedirectUrl="/dashboard">
                  <button className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-brand-bright to-brand px-6 py-3.5 text-base font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition hover:brightness-110" type="button">
                    Create an agent <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <a className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-brand-bright to-brand px-6 py-3.5 text-base font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition hover:brightness-110" href="/dashboard">
                  Open dashboard <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Show>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-site-border bg-site-bg">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="max-w-xs">
              <a className="flex items-center gap-2.5" href="#top">
                <Logo />
                <span className="font-display text-base font-bold tracking-tight text-site-text">
                  Wapzen
                </span>
              </a>
              <p className="mt-4 text-sm leading-6 text-site-text-faint">
                Build WhatsApp AI chat agents for messages and voice agents for
                inbound and outbound calls.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-site-text-faint">
                <Icon name="globe" className="h-4 w-4" />
                Chat · Voice · Campaigns
              </div>
            </div>
            {footerColumns.map((col) => (
              <nav aria-label={col.title} key={col.title}>
                <p className="text-sm font-semibold text-site-text">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a
                        className="text-sm text-site-text-faint transition hover:text-site-text"
                        href={href}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-site-border pt-6 text-sm text-site-text-faint sm:flex-row">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <a className="transition hover:text-site-text" href="#top">Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
