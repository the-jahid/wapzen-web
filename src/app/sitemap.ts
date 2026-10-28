import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { blogPosts, postsIn } from "@/lib/blogPosts";
import { freeTools } from "@/lib/freeTools";
import { hreflangLinks, marketingPages } from "@/lib/marketingPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (links: Record<string, string>) => Object.fromEntries(Object.entries(links).map(([lang, href]) => [lang, `${siteConfig.url}${href}`]));
  const withAlternates = (href: string, lastModified?: string) => {
    const languages = hreflangLinks(href);
    return { url: `${siteConfig.url}${href}`, ...(lastModified && { lastModified }), ...(languages && { alternates: { languages: absolute(languages) } }) };
  };
  return [
    {
      url: siteConfig.url,
      // Omit lastModified until there is a reliable content revision date.
      // Rebuilding the app does not mean the landing page changed.
    },
    ...marketingPages.map((page) => withAlternates(page.href)),
    { url: `${siteConfig.url}/tools` },
    ...freeTools.map((tool) => ({ url: `${siteConfig.url}${tool.href}` })),
    // Posts carry a real revision date, so they can state lastModified.
    ...([["/blog", "en"], ["/it/blog", "it"]] as const).map(([href, locale]) => withAlternates(href, postsIn(locale)[0]?.updated)),
    ...blogPosts.map((post) => withAlternates(post.href, post.updated)),
  ];
}
