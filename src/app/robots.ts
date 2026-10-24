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
      // older parsers.
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
          "Applebot-Extended",
          "Bingbot",
        ],
        allow: "/",
        disallow: ["/dashboard", "/dashboard/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
