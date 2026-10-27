import { ArrowLeftRight, AudioLines, BookOpen, Bot, Coins, Columns3, GitCompareArrows, Layers, ListChecks, MessageCircle, MessageSquareReply, PackageCheck, QrCode, Scale, Sparkles, Workflow, type LucideIcon } from "lucide-react";

export type BlogPostEntry = {
  href: string;
  /** Metadata title and the post's headline in structured data and cards. */
  title: string;
  /** Short name for the breadcrumb. */
  name: string;
  description: string;
  /** Guides show demo dashboard screenshots; explainers cite Meta's and vendors' docs. */
  tag: "Comparison" | "Alternatives" | "Guide" | "Explainer";
  icon: LucideIcon;
  /** ISO dates. Bump `updated` whenever prices or facts in the post change. */
  published: string;
  updated: string;
  readingMinutes: number;
  /** A screenshot in public/blog used as the article image in structured data. */
  image?: string;
  /** An illustration for the post's card in the /blog bento, shown instead of `image`. */
  cover?: string;
};

// Blog posts in app/blog, newest first. Feeds the /blog index, the sitemap,
// each post's "keep reading" links and its metadata, so a new post only needs
// a page plus an entry here. Comparison posts quote competitors' prices: keep
// them in step with the vendors' pricing pages and update `updated` with them.
// Guides show dashboard screenshots (public/blog/<slug>/, demo data): retake
// them when the screens they show change.
export const blogPosts: BlogPostEntry[] = [
  {
    href: "/blog/what-is-a-whatsapp-chatbot",
    title: "What Is a WhatsApp Chatbot? How It Works, Examples & Cost (2026)",
    name: "What is a WhatsApp chatbot?",
    description: "What a WhatsApp chatbot is, how it works behind the scenes, examples by industry, what it costs in 2026, and how to set one up free in about 15 minutes.",
    tag: "Explainer",
    icon: Bot,
    published: "2026-10-27",
    updated: "2026-10-27",
    readingMinutes: 9,
    image: "/blog/whatsapp-chatbot-without-business-api/conversation.webp",
    cover: "/whatsapp-ai-voice-agent-hero.png",
  },
  {
    href: "/blog/whatsapp-business-api-pricing",
    title: "WhatsApp Business API Pricing 2026: Rates by Country & Real Cost",
    name: "WhatsApp Business API pricing",
    description: "What the WhatsApp Business API costs in 2026: Meta's per-message rates for India, the US, UK and more, the 1 October changes, and provider fees on top.",
    tag: "Explainer",
    icon: Coins,
    published: "2026-10-27",
    updated: "2026-10-27",
    readingMinutes: 8,
  },
  {
    href: "/blog/chatgpt-on-whatsapp",
    title: "ChatGPT on WhatsApp in 2026: Is 1-800-ChatGPT Still Working?",
    name: "ChatGPT on WhatsApp",
    description: "Is ChatGPT still on WhatsApp? Where 1-800-ChatGPT works in 2026, why it left most countries, and how a business can put GPT on its own number.",
    tag: "Explainer",
    icon: Sparkles,
    published: "2026-10-27",
    updated: "2026-10-27",
    readingMinutes: 6,
    image: "/blog/whatsapp-chatbot-without-business-api/chat-agent.webp",
  },
  {
    href: "/blog/whatsapp-business-app-vs-api",
    title: "WhatsApp Business App vs API (2026): Differences, Costs & Limits",
    name: "WhatsApp Business app vs API",
    description: "WhatsApp Business app vs the Business API: features, costs, limits, coexistence and who each suits, plus a third route that adds AI without the API.",
    tag: "Comparison",
    icon: Layers,
    published: "2026-10-27",
    updated: "2026-10-27",
    readingMinutes: 7,
  },
  {
    href: "/blog/n8n-whatsapp-ai-agent",
    title: "n8n WhatsApp AI Agent: How to Build One (and a No-Code Option)",
    name: "n8n WhatsApp AI agent",
    description: "Build a WhatsApp AI agent in n8n step by step: the Meta setup, the workflow, real costs and pitfalls, plus a no-code option if you'd rather skip the build.",
    tag: "Explainer",
    icon: Workflow,
    published: "2026-10-27",
    updated: "2026-10-27",
    readingMinutes: 8,
  },
  {
    href: "/blog/whatsapp-zen",
    title: "WhatsApp Zen: Are You Looking for Wapzen?",
    name: "WhatsApp Zen: meet Wapzen",
    description: "Searched for WhatsApp Zen? You may be looking for Wapzen, the free AI chatbot and voice agent for WhatsApp. Here is what it does and how it works.",
    tag: "Guide",
    icon: MessageCircle,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 5,
    image: "/blog/whatsapp-chatbot-without-business-api/conversation.webp",
  },
  {
    href: "/blog/zen-whatsapp-workflow",
    title: "A Zen WhatsApp Workflow: Calm Your Inbox with AI",
    name: "A Zen WhatsApp workflow",
    description: "Build a calmer WhatsApp workflow with AI replies, a useful knowledge base, clear handoff rules and one simple weekly review routine.",
    tag: "Guide",
    icon: BookOpen,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 7,
    image: "/blog/whatsapp-auto-reply-personal-account/ai-reply-conversation.webp",
  },
  {
    href: "/blog/whatsapp-auto-reply-personal-account",
    title: "How to Set Auto Reply on Personal WhatsApp (2026 Guide)",
    name: "Auto reply on personal WhatsApp",
    description: "Personal WhatsApp has no auto reply setting. Here are the three ways around it on Android and iPhone, including AI replies that answer for you, step by step.",
    tag: "Guide",
    icon: MessageSquareReply,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 7,
    image: "/blog/whatsapp-auto-reply-personal-account/ai-reply-conversation.webp",
  },
  {
    href: "/blog/whatsapp-chatbot-without-business-api",
    title: "How to Create a WhatsApp Chatbot Without the Business API",
    name: "WhatsApp chatbot without the Business API",
    description: "Build an AI WhatsApp chatbot on your existing number without the Business API, Meta approval or template fees, in five steps with dashboard screenshots.",
    tag: "Guide",
    icon: QrCode,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 6,
    image: "/blog/whatsapp-chatbot-without-business-api/conversation.webp",
  },
  {
    href: "/blog/whatsapp-cod-order-confirmation",
    title: "How to Automate COD Order Confirmation on WhatsApp (2026)",
    name: "COD order confirmation on WhatsApp",
    description: "Confirm cash on delivery orders automatically with an AI voice agent that calls each buyer on WhatsApp, sends a confirmation message and logs the answer.",
    tag: "Guide",
    icon: PackageCheck,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 8,
    image: "/blog/whatsapp-cod-order-confirmation/call-transcript.webp",
  },
  {
    href: "/blog/wapzen-vs-aisensy",
    title: "Wapzen vs AiSensy (2026): Pricing, AI Agents & Free Plans",
    name: "Wapzen vs AiSensy",
    description: "Wapzen vs AiSensy compared on the free plans, real monthly cost, AI agents, WhatsApp calls and setup, with an honest look at when each one fits better.",
    tag: "Comparison",
    icon: Scale,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 6,
  },
  {
    href: "/blog/wapzen-vs-interakt",
    title: "Wapzen vs Interakt (2026): Pricing, AI Agents & Calling",
    name: "Wapzen vs Interakt",
    description: "Wapzen vs Interakt compared on pricing, AI agents, WhatsApp calling, Shopify and COD features, and setup, plus who each one is really for.",
    tag: "Comparison",
    icon: ArrowLeftRight,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 6,
  },
  {
    href: "/blog/wapzen-vs-respond-io",
    title: "Wapzen vs respond.io (2026): Pricing, AI Agents & Calls",
    name: "Wapzen vs respond.io",
    description: "Wapzen vs respond.io compared on pricing, contact limits, AI agents, WhatsApp calling rules and channels, for teams looking for a simpler or free alternative.",
    tag: "Comparison",
    icon: GitCompareArrows,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 6,
  },
  {
    href: "/blog/bland-ai-vs-vapi",
    title: "Bland AI vs Vapi (2026): Pricing, Features & a Free Alternative",
    name: "Bland AI vs Vapi",
    description: "Bland AI vs Vapi compared on per-minute pricing, limits, setup and who each suits, plus a free no-code option if your customers call on WhatsApp.",
    tag: "Comparison",
    icon: AudioLines,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 6,
  },
  {
    href: "/blog/wapzen-vs-wati",
    title: "Wapzen vs WATI (2026): Pricing, AI Agents & Calling",
    name: "Wapzen vs WATI",
    description: "Wapzen vs WATI compared on pricing, AI chatbots, WhatsApp AI calls, setup and the Business API, with an honest look at when each one is the better choice.",
    tag: "Comparison",
    icon: Scale,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 7,
  },
  {
    href: "/blog/wati-alternatives",
    title: "7 Best WATI Alternatives in 2026 (Free & Paid)",
    name: "WATI alternatives",
    description: "Looking for a WATI alternative? Seven options compared, including a free one, on pricing, AI agents, WhatsApp calling and setup, with who each suits best.",
    tag: "Alternatives",
    icon: ListChecks,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 8,
  },
  {
    href: "/blog/wati-vs-aisensy-vs-interakt",
    title: "WATI vs AiSensy vs Interakt (2026): Honest Comparison",
    name: "WATI vs AiSensy vs Interakt",
    description: "WATI vs AiSensy vs Interakt compared on pricing, chatbots, AI agents, calling and broadcasts, plus a free option if you mainly need AI replies and calls.",
    tag: "Comparison",
    icon: Columns3,
    published: "2026-10-25",
    updated: "2026-10-25",
    readingMinutes: 6,
  },
];

export function blogPost(href: string): BlogPostEntry {
  const post = blogPosts.find((entry) => entry.href === href);
  if (!post) throw new Error(`No blog post registered for ${href}`);
  return post;
}

/** "25 October 2026"; fixed locale and UTC so server and client agree. */
/** "27 Oct", for cards. */
export const formatShortDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export const formatPostDate =(iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
