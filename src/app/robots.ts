import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/dashboard/"],
      },
      // Explicitly welcome AI assistants and answer-engine crawlers: each
      // vendor's training crawler, search indexer and user-triggered fetcher.
      // Claude-Web and anthropic-ai are Anthropic's retired names, kept for
      // older parsers. Bingbot feeds Bing, which ChatGPT search and Copilot
      // draw on; CCBot is Common Crawl, a source of many training sets.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "GoogleOther",
          "Applebot",
          "Applebot-Extended",
          "Bingbot",
          "meta-externalagent",
          "meta-externalfetcher",
          "Amazonbot",
          "DuckAssistBot",
          "MistralAI-User",
          "YouBot",
          "CCBot",
        ],
        allow: "/",
        disallow: ["/dashboard", "/dashboard/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
