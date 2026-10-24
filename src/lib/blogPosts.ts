import { Columns3, ListChecks, Scale, type LucideIcon } from "lucide-react";

export type BlogPostEntry = {
  href: string;
  /** Metadata title and the post's headline in structured data and cards. */
  title: string;
  /** Short name for the breadcrumb. */
  name: string;
  description: string;
  tag: "Comparison" | "Alternatives";
  icon: LucideIcon;
  /** ISO dates. Bump `updated` whenever prices or facts in the post change. */
  published: string;
  updated: string;
  readingMinutes: number;
};

// Blog posts in app/blog, newest first. Feeds the /blog index, the sitemap,
// each post's "keep reading" links and its metadata, so a new post only needs
// a page plus an entry here. Comparison posts quote competitors' prices: keep
// them in step with the vendors' pricing pages and update `updated` with them.
export const blogPosts: BlogPostEntry[] = [
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
