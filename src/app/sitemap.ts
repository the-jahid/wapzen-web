import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { freeTools } from "@/lib/freeTools";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      // Omit lastModified until there is a reliable content revision date.
      // Rebuilding the app does not mean the landing page changed.
    },
    { url: `${siteConfig.url}/tools` },
    ...freeTools.map((tool) => ({ url: `${siteConfig.url}${tool.href}` })),
  ];
}
