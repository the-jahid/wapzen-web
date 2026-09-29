import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { freeTools } from "@/lib/freeTools";
import { hreflangLinks, marketingPages } from "@/lib/marketingPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (links: Record<string, string>) => Object.fromEntries(Object.entries(links).map(([lang, href]) => [lang, `${siteConfig.url}${href}`]));
  return [
    {
      url: siteConfig.url,
      // Omit lastModified until there is a reliable content revision date.
      // Rebuilding the app does not mean the landing page changed.
    },
    ...marketingPages.map((page) => {
      const languages = hreflangLinks(page.href);
      return { url: `${siteConfig.url}${page.href}`, ...(languages && { alternates: { languages: absolute(languages) } }) };
    }),
    { url: `${siteConfig.url}/tools` },
    ...freeTools.map((tool) => ({ url: `${siteConfig.url}${tool.href}` })),
  ];
}
