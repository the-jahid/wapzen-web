import type { Metadata } from "next";
import { locales, type Locale } from "./locales";
import { hreflangLinks } from "./marketingPages";
import { siteConfig } from "./site";

// A page that sets `openGraph` or `twitter` replaces the root layout's object
// instead of merging with it, which drops the shared social image and the
// large Twitter card. Public pages below "/" build their metadata here so the
// preview image, card type and canonical URL are always restated.
const socialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name}: free WhatsApp AI chatbot and AI calling agent for business`,
};

// Pages with translations also get hreflang alternates (lib/marketingPages.ts).
export function pageMetadata({ title, description, path, locale = "en" }: { title: string; description: string; path: string; locale?: Locale }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, languages: hreflangLinks(path) },
    openGraph: { type: "website", siteName: siteConfig.name, locale: locales[locale].ogLocale, title, description, url: path, images: [socialImage] },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}
