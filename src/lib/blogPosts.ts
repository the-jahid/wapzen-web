import { ArrowLeftRight, AudioLines, BookOpen, Columns3, GitCompareArrows, ListChecks, MessageCircle, MessageSquareReply, PackageCheck, QrCode, Scale, type LucideIcon } from "lucide-react";

export type BlogPostEntry = {
  href: string;
  /** Metadata title and the post's headline in structured data and cards. */
  title: string;
  /** Short name for the breadcrumb. */
  name: string;
  description: string;
  tag: "Comparison" | "Alternatives" | "Guide";
  icon: LucideIcon;
  /** ISO dates. Bump `updated` whenever prices or facts in the post change. */
  published: string;
  updated: string;
  readingMinutes: number;
  /** A screenshot in public/blog used as the article image in structured data. */
  image?: string;
};

// Blog posts in app/blog, newest first. Feeds the /blog index, the sitemap,
// each post's "keep reading" links and its metadata, so a new post only needs
// a page plus an entry here. Comparison posts quote competitors' prices: keep
// them in step with the vendors' pricing pages and update `updated` with them.
// Guides show dashboard screenshots (public/blog/<slug>/, demo data): retake
// them when the screens they show change.
export const blogPosts: BlogPostEntry[] = [
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
export const formatPostDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
