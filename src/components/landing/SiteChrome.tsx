import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggleButton } from "@/components/theme/ThemeToggle";
import { freeTools } from "@/lib/freeTools";
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

export function SiteHeader({ links, brandHref }: { links: Array<{ href: string; label: string }>; brandHref?: string }) {
  return <ResizableNavbar brand={<Brand href={brandHref} />} links={links} actions={<><ThemeToggleButton /><Show when="signed-out"><SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard"><button className={styles.login} type="button">Log in<ArrowUpRight size={14} /></button></SignInButton></Show><Show when="signed-in"><a href="/dashboard" className={styles.login}>Dashboard</a><UserButton /></Show></>} />;
}

export function SiteFooter({ brandHref }: { brandHref?: string }) {
  return <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <div><Brand href={brandHref} /><p>WhatsApp AI chatbots and voice call agents.<br />Powered by your business.</p></div>
      <nav aria-label="Product"><span>PRODUCT</span><Link href="/#capabilities">Features</Link><Link href="/#chat-agent">WhatsApp AI chatbot</Link><Link href="/#voice-agent">WhatsApp AI voice agent</Link><Link href="/#use-cases">Use cases</Link><Link href="/#workflow">How it works</Link></nav>
      <nav aria-label="Free tools"><span>FREE TOOLS</span>{freeTools.map((tool) => <Link key={tool.href} href={tool.href}>{tool.name}</Link>)}<Link href="/tools">All free tools</Link></nav>
      <nav aria-label="Resources"><span>EXPLORE</span><Link href="/#faq">Frequently asked questions</Link><Link href="/#conversation-history">Conversation history</Link><Link href="/#get-started">Get started</Link></nav>
      <div className={styles.footerContact}><span>LET&apos;S CONNECT</span><a href="https://wa.me/8801701750469" target="_blank" rel="noopener noreferrer">Say hello<ArrowUpRight size={19} /></a><small>+880 1701 750469</small></div>
    </div>
    <div className={styles.footerBottom}><span>© {new Date().getFullYear()} Wapzen. All rights reserved.</span><span><span className={styles.statusDot} /> Built for better conversations</span><a href="#top">Back to top ↑</a></div>
  </footer>;
}
