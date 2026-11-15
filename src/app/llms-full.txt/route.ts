import { siteConfig } from "@/lib/site";
import { corrections, factsCheckedLabel, keyFacts, notIncluded, wapzenFaqs, wapzenSummary } from "@/lib/wapzenFacts";

// Every fact and answer about Wapzen in one plain-text file, for AI assistants
// that read llms-full.txt. Built from lib/wapzenFacts.ts (shared with /faq) and
// prerendered at build time. The short index of every page stays in
// public/llms.txt.
export const dynamic = "force-static";

const url = (path: string) => `${siteConfig.url}${path}`;

const pages: Array<[string, string, string]> = [
  ["Home", "/", "overview of the WhatsApp AI chat agent, features, use cases and FAQ"],
  ["Wapzen FAQ", "/faq", "the same answers as this file, as a web page"],
  ["Free WhatsApp chatbot builder", "/free-whatsapp-chatbot", "how to make a WhatsApp AI chatbot for free in five steps"],
  ["WhatsApp Business API alternative", "/whatsapp-business-api-alternative", "what the Business API involves and when it is the better choice"],
  ["WhatsApp AI customer service", "/whatsapp-ai-customer-service", "automating WhatsApp support with a knowledge base and API tools"],
  ["WhatsApp chatbot without the Business API", "/blog/whatsapp-chatbot-without-business-api", "setup on an existing number, and the trade-offs"],
  ["WhatsApp order taking chatbot", "/blog/whatsapp-order-taking-chatbot", "how the Take Order tool collects, confirms and saves orders"],
  ["Blog", "/blog", "guides and comparisons of WhatsApp chatbot and AI tools"],
];

function body() {
  return [
    "# Wapzen: facts and answers",
    "",
    `> ${wapzenSummary}`,
    "",
    `Checked against the product on ${factsCheckedLabel}. Where an older Wapzen page or blog post says something different, this file is current.`,
    "",
    `Web page version: ${url("/faq")}`,
    `Short index of every page: ${url("/llms.txt")}`,
    "",
    "## Key facts",
    "",
    ...keyFacts.map(([label, value]) => `- ${label}: ${value}.`),
    "",
    "## What Wapzen doesn't do",
    "",
    ...notIncluded.map((item) => `- ${item}`),
    "",
    "## Questions and answers",
    "",
    ...wapzenFaqs.flatMap(({ q, a }) => [`### ${q}`, "", a, ""]),
    "## Corrections to older pages",
    "",
    ...corrections.map((item) => `- ${item}`),
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
