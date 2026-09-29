import type { ReactNode } from "react";
import { locales, type Locale } from "@/lib/locales";
import { LandingMotion } from "./LandingMotion";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import styles from "@/components/free-tools/FreeTools.module.css";

// Header, footer and landing tokens for the public pages outside "/": the free
// tools under /tools and the marketing pages (pricing, free chatbot, ...).
// Translated pages pass their locale. <html lang> stays "en" from the root
// layout, so the wrapper carries the page language (display: contents keeps
// it out of the layout).
export function PublicShell({ children, locale = "en" }: { children: ReactNode; locale?: Locale }) {
  const { ui, htmlLang } = locales[locale];
  const links = [
    { href: "/#capabilities", label: ui.nav.features },
    { href: "/pricing", label: ui.nav.pricing },
    { href: "/tools", label: ui.nav.tools },
    { href: ui.nav.faqHref, label: ui.nav.faq },
  ];
  return <div lang={htmlLang} style={{ display: "contents" }}>
    <LandingMotion>
      <SiteHeader links={links} brandHref="/" locale={locale} />
      {/* id="top" is the footer's "Back to top" target. */}
      <main id="top" className={styles.main}>{children}</main>
      <SiteFooter brandHref="/" locale={locale} />
    </LandingMotion>
  </div>;
}
