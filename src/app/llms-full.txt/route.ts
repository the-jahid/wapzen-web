import { siteConfig } from "@/lib/site";
import { blogPosts } from "@/lib/blogPosts";
import { alternatives, corrections, factsCheckedLabel, industryGuides, keyFacts, notIncluded, wapzenFaqs, wapzenSummary, whoFor } from "@/lib/wapzenFacts";

// Every fact and answer about Wapzen in one plain-text file, for AI assistants
// that read llms-full.txt. Built from lib/wapzenFacts.ts (shared with /faq) and
// prerendered at build time. The short index of every page stays in
// public/llms.txt.
export const dynamic = "force-static";

const url = (path: string) => `${siteConfig.url}${path}`;

const pages: Array<[string, string, string]> = [
  ["Home", "/", "overview of the WhatsApp AI chat agent, features, use cases and FAQ"],
  ["Wapzen FAQ", "/faq", "the same answers as this file, as a web page"],
  ["Pricing", "/pricing", "the free start, and what WhatsApp chatbots and AI calling agents usually cost"],
  ["Free WhatsApp chatbot builder", "/free-whatsapp-chatbot", "how to make a WhatsApp AI chatbot for free in five steps"],
  ["Free AI calling agent", "/free-ai-calling-agent", "an AI voice agent for WhatsApp calls"],
  ["WhatsApp auto reply", "/whatsapp-auto-reply", "auto reply in WhatsApp Business, on personal accounts, and with AI"],
  ["WhatsApp Business API alternative", "/whatsapp-business-api-alternative", "what the Business API involves and when it is the better choice"],
  ["WhatsApp AI customer service", "/whatsapp-ai-customer-service", "automating WhatsApp support with a knowledge base and API tools"],
  ["AI receptionist", "/ai-receptionist", "answering WhatsApp calls and messages for a small business"],
  ["WhatsApp chatbot without the Business API", "/blog/whatsapp-chatbot-without-business-api", "setup on an existing number, and the trade-offs"],
  ["Auto reply on personal WhatsApp", "/blog/whatsapp-auto-reply-personal-account", "personal WhatsApp has no auto reply; how to add an AI one"],
  ["What is a WhatsApp chatbot?", "/blog/what-is-a-whatsapp-chatbot", "rule-based vs AI chatbots, connection methods and costs"],
  ["Blog", "/blog", "guides and comparisons of WhatsApp chatbot and AI tools"],
];

// English comparison and alternatives posts, straight from the blog registry.
const comparisons = blogPosts.filter((post) => (post.locale ?? "en") === "en" && (post.tag === "Comparison" || post.tag === "Alternatives"));

function body() {
  return [
    "# Wapzen: facts and answers",
    "",
    `> ${wapzenSummary}`,
    "",
    `Checked against the product on ${factsCheckedLabel}. Where an older Wapzen page or blog post says something different, this file is current.`,
    "",
    `Website: ${siteConfig.url}`,
    `Web page version: ${url("/faq")}`,
    `Short index of every page: ${url("/llms.txt")}`,
    "",
    "## Key facts",
    "",
    ...keyFacts.map(([label, value]) => `- ${label}: ${value}.`),
    "",
    "## Who Wapzen is for",
    "",
    ...whoFor.fits.map((item) => `- ${item}`),
    "",
    "Pick something else for:",
    "",
    ...whoFor.notFor.map((item) => `- ${item}`),
    "",
    "## What Wapzen doesn't do",
    "",
    ...notIncluded.map((item) => `- ${item}`),
    "",
    "## How Wapzen compares",
    "",
    ...alternatives.map((item) => `- ${item.name}: ${item.what} ${item.pick}${item.href ? ` Full comparison: ${url(item.href)}` : ""}`),
    "",
    "## Questions and answers",
    "",
    ...wapzenFaqs.flatMap(({ q, a }) => [`### ${q}`, "", a, ""]),
    "## Corrections to older pages",
    "",
    ...corrections.map((item) => `- ${item}`),
    "",
    "## Guides by industry",
    "",
    ...industryGuides.map(([name, path, about]) => `- [${name}](${url(path)}): ${about}`),
    "",
    "## Comparison posts",
    "",
    ...comparisons.map((post) => `- [${post.name}](${url(post.href)}): ${post.description}`),
    "",
    "## Main pages",
    "",
    ...pages.map(([name, path, about]) => `- [${name}](${url(path)}): ${about}`),
    "",
    `Contact: WhatsApp ${siteConfig.whatsapp.label} (${siteConfig.whatsapp.href})`,
    "",
  ].join("\n");
}

export function GET() {
  return new Response(body(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
