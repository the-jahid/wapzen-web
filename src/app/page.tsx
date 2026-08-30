import type { Metadata } from "next";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { siteConfig } from "@/lib/site";
import { ThemeToggleButton } from "@/components/theme/ThemeToggle";
import { WisprFlowText } from "@/blocks/wispr-flow-text-animation";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

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
  | "bolt";

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
};

const capabilities: Array<{
  icon: IconName;
  title: string;
  body: string;
  tags: string[];
}> = [
  {
    icon: "phone",
    title: "Inbound voice agent",
    body: "Answers missed calls and WhatsApp voice requests, qualifies intent, and routes urgent leads to your team — on the first ring, every time.",
    tags: ["First-ring pickup", "Intent detection", "Smart routing"],
  },
  {
    icon: "broadcast",
    title: "Outbound follow-ups",
    body: "Calls new inquiries, no-shows, renewals, and cold leads with natural AI conversations at scale.",
    tags: ["No-show recovery", "Renewal calls", "Lead reactivation"],
  },
  {
    icon: "calendar",
    title: "Appointment booking",
    body: "Checks availability, books the right slot, sends reminders, and updates the pipeline instantly.",
    tags: ["Calendar sync", "Reminders", "Instant updates"],
  },
  {
    icon: "lead",
    title: "Lead collector",
    body: "Captures the details sales teams actually need from every call — structured, deduplicated, and pushed straight to your CRM or WhatsApp.",
    tags: ["Structured data", "CRM push", "Deduplication"],
  },
];

const steps = [
  {
    title: "Greets every caller",
    body: "Picks up instantly in your business tone, in the caller's language — no hold music, no voicemail.",
  },
  {
    title: "Qualifies the lead",
    body: "Captures intent, urgency, budget, and the preferred appointment time in a natural conversation.",
  },
  {
    title: "Books or transfers",
    body: "Reserves the right calendar slot or warm-transfers high-value calls straight to a human.",
  },
  {
    title: "Syncs to WhatsApp",
    body: "Sends summaries, reminders, and structured lead data back to your team the moment the call ends.",
  },
];

const pipeline: Array<[string, string, string]> = [
  ["New lead", "Captured from ad, WhatsApp, website, or missed call", "#e4e4e7"],
  ["Qualified", "Need, location, budget, and service match confirmed", "#818cf8"],
  ["Booked", "Appointment slot, agent, and reminder sequence are set", "#34d399"],
  ["Follow-up", "No-shows, quotes, renewals, and reactivation calls", "#52525b"],
];

const leadFeatures: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: "analytics",
    title: "Real-time lead scoring",
    body: "Prioritize buyers who are ready to book today, not next quarter.",
  },
  {
    icon: "calendar",
    title: "Calendar-ready data",
    body: "Send booked slots and reminders straight back into WhatsApp.",
  },
  {
    icon: "shield",
    title: "Private by default",
    body: "Transcripts and lead data stay encrypted and inside your workspace.",
  },
  {
    icon: "clock",
    title: "Zero wait time",
    body: "Every caller is answered on the first ring, day or night.",
  },
];

const testimonials: Array<{
  quote: string;
  name: string;
  role: string;
  initials: string;
}> = [
  {
    quote:
      "It books consultations while we sleep. Our speed-to-lead went from hours to seconds and no-shows dropped by a third.",
    name: "Amira Hassan",
    role: "Owner, BrightClinic",
    initials: "AH",
  },
  {
    quote:
      "The agent qualifies and routes every WhatsApp lead before an agent even opens their laptop. It feels like three extra hires.",
    name: "Diego Marín",
    role: "Sales Lead, Estate Co.",
    initials: "DM",
  },
];

const faqs: Array<{ q: string; a: string }> = [
  {
    q: "How does the AI voice agent connect to WhatsApp?",
    a: "It plugs into the WhatsApp Business API, so it answers voice notes and calls from your existing number with no app changes for your customers.",
  },
  {
    q: "Will callers know they're talking to AI?",
    a: "The voice is natural and on-brand. You decide whether it discloses that it's an assistant, and it can warm-transfer to a human at any point.",
  },
  {
    q: "What does the agent collect on each call?",
    a: "Name, phone, intent, budget, location, preferred time, and objection notes — structured and pushed to your CRM or sent over WhatsApp.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams go live within a day. You share your scripts, calendar, and routing rules, and we tune the agent to match.",
  },
  {
    q: "Which languages does it speak?",
    a: "The agent speaks 40+ languages and switches automatically to match the caller, so international leads get the same experience as local ones.",
  },
];

const footerColumns: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: "Product",
    links: [
      ["Capabilities", "#capabilities"],
      ["Workflow", "#workflow"],
      ["Lead capture", "#lead-capture"],
      ["Book a demo", "#demo"],
    ],
  },
  {
    title: "Use cases",
    links: [
      ["Clinics", "#capabilities"],
      ["Real estate", "#capabilities"],
      ["Agencies", "#capabilities"],
      ["Education", "#capabilities"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["FAQ", "#faq"],
      ["How it works", "#workflow"],
      ["Testimonials", "#testimonials"],
      ["Contact", "#demo"],
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
        "Inbound AI voice agent for WhatsApp calls",
        "Outbound AI follow-up calls",
        "AI appointment booking with calendar sync",
        "Automatic lead capture and qualification",
        "Warm transfer to human agents",
        "40+ languages with automatic detection",
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

// Rides the curve behind the hero: one call, the way the agent handles it.
const heroTranscript =
  "Hi, thanks for calling — I can help with that. Let me check the calendar… " +
  "I have Thursday at 2pm or Friday morning, which works better for you? Great, " +
  "Thursday at 2 it is — I have sent the details to this number on WhatsApp. " +
  "What is the best email for the confirmation? Perfect, got it. And roughly how " +
  "many people is this for, so the team can prepare? Understood. You will get a " +
  "reminder the day before, and if anything changes just reply here and I will " +
  "move it. Thanks for calling — talk soon.";

const heroPeople = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div
      aria-label={count + " out of 5 stars"}
      className="flex items-center gap-0.5 text-amber-400"
      role="img"
    >
      {Array.from({ length: count }, (_, i) => (
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="currentColor"
          key={i}
          viewBox="0 0 24 24"
        >
          <path d={iconPaths.star[0]} />
        </svg>
      ))}
    </div>
  );
}

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
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-brand-bright to-brand text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
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
                WhatsCall
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/50">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Live
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Calls answered
              </p>
              <p className="font-display text-2xl font-bold text-white">1,284</p>
            </div>
            <p className="pb-1 text-[10px] font-bold text-emerald-400">+24.6%</p>
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
              ["Booked", "32"],
              ["Leads", "57"],
              ["Missed", "0"],
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
      <header className="fixed inset-x-0 top-0 z-50 px-4">
        <nav
          aria-label="Primary"
          className="mx-auto mt-4 flex h-14 max-w-5xl items-center justify-between rounded-2xl border border-site-border bg-site-nav px-3 backdrop-blur-xl sm:px-4"
        >
          <a className="flex items-center gap-2.5 pl-1" href="#top">
            <Logo />
            <span className="font-display text-[0.95rem] font-bold tracking-tight">
              WhatsCall Agent
            </span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium text-site-text-muted md:flex">
            <a className="transition hover:text-site-text" href="#capabilities">
              Capabilities
            </a>
            <a className="transition hover:text-site-text" href="#workflow">
              Workflow
            </a>
            <a className="transition hover:text-site-text" href="#lead-capture">
              Lead capture
            </a>
            <a className="transition hover:text-site-text" href="#faq">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggleButton />
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-site-text-muted transition hover:text-site-text"
                  type="button"
                >
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="rounded-xl bg-linear-to-b from-brand-bright to-brand px-4 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition hover:brightness-110"
                  type="button"
                >
                  Start free
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <a
                className="rounded-xl bg-linear-to-b from-brand-bright to-brand px-4 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition hover:brightness-110"
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
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                One agent behind every call.
              </h1>
              <p className="max-w-xl text-balance text-sm leading-7 text-white/55 sm:text-base">
                The WhatsApp AI voice agent that answers, qualifies, and books
                appointments — so no lead ever goes cold.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Show when="signed-out">
                  <SignUpButton mode="modal">
                    <button
                      className="rounded-xl bg-linear-to-b from-brand-bright to-brand px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition hover:brightness-110"
                      type="button"
                    >
                      Start free
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
                  href="#demo"
                >
                  Book a demo
                </a>
              </div>

              <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <div className="flex flex-row items-center justify-center pr-4">
                  <AnimatedTooltip items={heroPeople} />
                </div>
                <div className="flex flex-col items-center gap-1.5 sm:items-start">
                  <StarRating />
                  <p className="text-xs text-white/45">
                    Trusted by sales teams answering every WhatsApp call
                  </p>
                </div>
              </div>
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

        {/* ============ CAPABILITIES (numbered editorial rows) ============ */}
        <section
          aria-labelledby="capabilities-heading"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
          id="capabilities"
        >
          <div className="reveal grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <Eyebrow>One agent, every call flow</Eyebrow>
              <h2
                className="mt-5 font-display text-3xl font-bold tracking-tight text-site-text sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
                id="capabilities-heading"
              >
                Everything between first reply and booked appointment
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-site-text-muted lg:justify-self-end">
              Replace the patchwork of missed calls, slow replies, and manual
              follow-ups with one always-on AI voice agent.
            </p>
          </div>

          <div className="mt-14 border-t border-site-border">
            {capabilities.map((cap, index) => (
              <article
                className="reveal group grid gap-4 border-b border-site-border py-8 transition hover:bg-site-fill sm:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1.2fr_1.6fr_auto] lg:items-center lg:gap-8"
                key={cap.title}
              >
                <span className="font-mono text-sm font-semibold text-site-text-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-site-border bg-site-fill text-brand-light">
                    <Icon name={cap.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-xl font-bold text-site-text">
                    {cap.title}
                  </h3>
                </div>
                <p className="text-sm leading-6 text-site-text-muted sm:col-start-2 lg:col-start-3">
                  {cap.body}
                </p>
                <div className="flex flex-wrap gap-2 sm:col-start-2 lg:col-start-4 lg:max-w-[13rem] lg:justify-end">
                  {cap.tags.map((tag) => (
                    <span
                      className="rounded-full border border-site-border px-3 py-1 text-xs text-site-text-faint"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============ WORKFLOW (horizontal steps) ============ */}
        <section
          aria-labelledby="workflow-heading"
          className="scroll-mt-24 border-y border-site-border bg-site-bg-alt py-20 sm:py-28"
          id="workflow"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Live call workflow"
              id="workflow-heading"
              sub="The agent talks like a trained receptionist, keeps context across WhatsApp and voice, and hands your team a clean next action instead of a raw transcript."
              title="Let the AI move leads while your team stays focused"
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
                Smart transfer rules, fallback numbers, and human handoff
              </div>
            </div>
          </div>
        </section>

        {/* ============ LEAD CAPTURE ============ */}
        <section
          aria-labelledby="lead-capture-heading"
          className="mx-auto grid max-w-7xl scroll-mt-24 gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-10"
          id="lead-capture"
        >
          <div className="reveal order-2 overflow-hidden rounded-2xl border border-site-border bg-site-panel lg:order-1">
            <div className="flex items-center justify-between border-b border-site-border bg-site-fill px-6 py-4">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-site-text-faint">
                Pipeline snapshot
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-site-border px-3 py-1 text-xs font-semibold text-site-text-soft">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-live" />
                Live
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
            <Eyebrow>Lead capture</Eyebrow>
            <h2
              className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
              id="lead-capture-heading"
            >
              Turn every missed call into usable CRM data
            </h2>
            <p className="mt-5 text-base leading-7 text-site-text-muted">
              Collect the details sales teams actually need: service interest,
              urgency, budget, preferred time, location, and objection notes.
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

        {/* ============ TESTIMONIALS ============ */}
        <section
          aria-labelledby="testimonials-heading"
          className="scroll-mt-24 border-y border-site-border bg-site-bg-alt"
          id="testimonials"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
            <SectionHeading
              eyebrow="Why teams switch"
              id="testimonials-heading"
              title="Speed-to-lead that pays for itself"
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {testimonials.map((t) => (
                <figure
                  className="reveal flex h-full flex-col rounded-2xl border border-site-border bg-site-fill p-8"
                  key={t.name}
                >
                  <div aria-hidden="true" className="flex gap-1 text-site-text-soft">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} name="star" className="h-4.5 w-4.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 text-lg leading-8 text-site-text-soft">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-site-border pt-5">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-site-border bg-site-fill-2 font-display text-sm font-bold text-site-text">
                      {t.initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-site-text">{t.name}</p>
                      <p className="text-sm text-site-text-faint">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
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
            title="Everything you need to know"
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

        {/* ============ DEMO / CTA ============ */}
        <section
          aria-labelledby="demo-heading"
          className="relative scroll-mt-24 overflow-hidden border-t border-site-border bg-site-bg-alt py-20 sm:py-28"
          id="demo"
        >
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_40%,#000_20%,transparent_100%)]" />
          <div className="absolute right-[-10%] top-[-20%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_65%)] blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-10">
            <div className="reveal">
              <Eyebrow>
                <Icon name="spark" className="h-4 w-4" />
                Booking engine
              </Eyebrow>
              <h2
                className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
                id="demo-heading"
              >
                Capture the lead, book the slot, send the follow-up
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-site-text-muted">
                Built for clinics, real estate teams, agencies, local services,
                and education consultancies — any business where speed-to-lead
                decides the sale.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Live in under a day, no developer required",
                  "Works with your existing WhatsApp number",
                  "Cancel anytime — keep all your captured leads",
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

            <form className="reveal rounded-2xl border border-site-border bg-site-bg p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-site-text-soft">
                  Full name
                  <input
                    autoComplete="name"
                    className="h-12 rounded-xl border border-site-border bg-site-fill px-4 text-base text-site-text outline-none transition placeholder:text-site-text-faint focus:border-brand-bright focus:bg-site-fill-2 focus:ring-4 focus:ring-brand-bright/15"
                    name="name"
                    placeholder="Your name"
                    type="text"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-site-text-soft">
                  WhatsApp number
                  <input
                    autoComplete="tel"
                    className="h-12 rounded-xl border border-site-border bg-site-fill px-4 text-base text-site-text outline-none transition placeholder:text-site-text-faint focus:border-brand-bright focus:bg-site-fill-2 focus:ring-4 focus:ring-brand-bright/15"
                    name="phone"
                    placeholder="+1 555 000 0000"
                    type="tel"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-site-text-soft sm:col-span-2">
                  Business type
                  <select
                    className="h-12 rounded-xl border border-site-border bg-site-fill px-4 text-base text-site-text outline-none transition focus:border-brand-bright focus:bg-site-fill-2 focus:ring-4 focus:ring-brand-bright/15 [&>option]:text-ink"
                    name="businessType"
                  >
                    <option>Appointment-based service</option>
                    <option>Real estate sales</option>
                    <option>Clinic or healthcare</option>
                    <option>Education consultancy</option>
                    <option>Agency or local service</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-site-text-soft sm:col-span-2">
                  Main call goal
                  <textarea
                    className="min-h-28 resize-none rounded-xl border border-site-border bg-site-fill px-4 py-3 text-base text-site-text outline-none transition placeholder:text-site-text-faint focus:border-brand-bright focus:bg-site-fill-2 focus:ring-4 focus:ring-brand-bright/15"
                    name="goal"
                    placeholder="Example: qualify new WhatsApp leads and book consultation calls"
                  />
                </label>
              </div>
              <button
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-brand-bright to-brand px-6 py-3.5 text-base font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition hover:brightness-110"
                type="button"
              >
                Request voice agent demo
                <Icon
                  name="arrow"
                  className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                />
              </button>
              <p className="mt-3 text-center text-xs text-site-text-faint">
                No credit card required · Replies within one business day
              </p>
            </form>
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
                  WhatsCall Agent
                </span>
              </a>
              <p className="mt-4 text-sm leading-6 text-site-text-faint">
                The WhatsApp AI voice agent that answers, qualifies, and books —
                so no lead ever goes cold.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-site-text-faint">
                <Icon name="globe" className="h-4 w-4" />
                40+ languages · 24/7 coverage
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
            <div className="flex items-center gap-6">
              <a className="transition hover:text-site-text" href="#top">
                Privacy
              </a>
              <a className="transition hover:text-site-text" href="#top">
                Terms
              </a>
              <a className="transition hover:text-site-text" href="#top">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
