import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggleButton } from "@/components/theme/ThemeToggle";
import { freeTools } from "@/lib/freeTools";
import { locales, type Locale } from "@/lib/locales";
import { localeHome, pagesIn } from "@/lib/marketingPages";
import { ResizableNavbar } from "./ResizableNavbar";
import styles from "./CoreLanding.module.css";

// Header, footer and call-to-action shared by the landing page and the public
// pages under /tools. Links into the landing page are written as "/#section",
// which is still an in-page jump when already on "/".

export function Brand({ href = "#top" }: { href?: string }) {
  return <a href={href} className={styles.brand} aria-label="Wapzen home"><span><BrandMark priority /></span>wapzen<span className={styles.brandDot}>.</span></a>;
}

export function GetStarted({ label = "Create your agent", dark = false }: { label?: string; dark?: boolean }) {
  const className = `${styles.button} ${dark ? styles.darkButton : styles.greenButton}`;
  return <>
    <Show when="signed-out"><SignUpButton mode="modal" forceRedirectUrl="/dashboard" signInForceRedirectUrl="/dashboard"><button type="button" className={className}>{label}<ArrowUpRight size={17} /></button></SignUpButton></Show>
    <Show when="signed-in"><a href="/dashboard" className={className}>Open dashboard<ArrowUpRight size={17} /></a></Show>
  </>;
}

export function SiteHeader({ links, brandHref, locale = "en" }: { links: Array<{ href: string; label: string }>; brandHref?: string; locale?: Locale }) {
  const { ui } = locales[locale];
  return <ResizableNavbar brand={<Brand href={brandHref} />} links={links} actions={<><ThemeToggleButton /><Show when="signed-out"><SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard"><button className={styles.login} type="button">{ui.login}<ArrowUpRight size={14} /></button></SignInButton></Show><Show when="signed-in"><a href="/dashboard" className={styles.login}>{ui.dashboard}</a><UserButton /></Show></>} />;
}

// The footer's SOLUTIONS column lists the pages in the current language; the
// bottom row links each language's entry page.
export function SiteFooter({ brandHref, locale = "en" }: { brandHref?: string; locale?: Locale }) {
  const t = locales[locale].ui.footer;
  return <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <div><Brand href={brandHref} /><p>{t.tagline[0]}<br />{t.tagline[1]}</p></div>
      <nav aria-label={t.product}><span>{t.product}</span><Link href="/#capabilities">{t.features}</Link><Link href="/#chat-agent">{t.chatbot}</Link><Link href="/#voice-agent">{t.voiceAgent}</Link><Link href="/#use-cases">{t.useCases}</Link><Link href="/#industries">{t.industries}</Link><Link href="/#workflow">{t.howItWorks}</Link><Link href="/#faq">{t.faq}</Link></nav>
      <nav aria-label={t.freeTools}><span>{t.freeTools}</span>{freeTools.map((tool) => <Link key={tool.href} href={tool.href}>{tool.name}</Link>)}<Link href="/tools">{t.allTools}</Link></nav>
      <nav aria-label={t.solutions}><span>{t.solutions}</span>{pagesIn(locale).map((page) => <Link key={page.href} href={page.href}>{page.name}</Link>)}</nav>
      <div className={styles.footerContact}><span>{t.connect}</span><a href="https://wa.me/8801701750469" target="_blank" rel="noopener noreferrer">{t.sayHello}<ArrowUpRight size={19} /></a><small>+880 1701 750469</small></div>
    </div>
    <div className={styles.footerBottom}><span>© {new Date().getFullYear()} Wapzen. {t.rights}</span><nav aria-label={t.languages} className={styles.footerLangs}>{(Object.keys(locales) as Locale[]).map((code) => <Link key={code} href={localeHome[code]} hrefLang={locales[code].hreflang} lang={locales[code].htmlLang} aria-current={code === locale ? "true" : undefined}>{locales[code].label}</Link>)}</nav><a href="#top">{t.backToTop}</a></div>
  </footer>;
}
