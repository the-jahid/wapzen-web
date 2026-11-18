import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { blogPosts, postsIn } from "@/lib/blogPosts";
import { locales, type Locale } from "@/lib/locales";
import { freeTools } from "@/lib/freeTools";
import { hreflangLinks, marketingPages } from "@/lib/marketingPages";
import { factsChecked } from "@/lib/wapzenFacts";

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
    // Listed by hand: not in marketingPages, so it stays out of the footer.
    { url: `${siteConfig.url}/faq`, lastModified: factsChecked },
    { url: `${siteConfig.url}/tools` },
    ...freeTools.map((tool) => ({ url: `${siteConfig.url}${tool.href}` })),
    // Posts carry a real revision date, so they can state lastModified.
    // A blog index changes when any of its posts does: use the newest date.
    ...(Object.keys(locales) as Locale[]).flatMap((locale) => {
      const href = locales[locale].ui.blog?.href;
      const newest = postsIn(locale).map((post) => post.updated).sort().at(-1);
      return href ? [withAlternates(href, newest)] : [];
    }),
    ...blogPosts.map((post) => withAlternates(post.href, post.updated)),
  ];
}
