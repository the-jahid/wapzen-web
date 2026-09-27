import type { ReactNode } from "react";
import { LandingMotion } from "@/components/landing/LandingMotion";
import { SiteFooter, SiteHeader } from "@/components/landing/SiteChrome";
import styles from "@/components/free-tools/FreeTools.module.css";

const links = [
  { href: "/#capabilities", label: "Features" },
  { href: "/#workflow", label: "How it works" },
  { href: "/tools", label: "Free tools" },
  { href: "/#faq", label: "FAQ" },
];

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <LandingMotion>
    <SiteHeader links={links} brandHref="/" />
    {/* id="top" is the footer's "Back to top" target. */}
    <main id="top" className={styles.main}>{children}</main>
    <SiteFooter brandHref="/" />
  </LandingMotion>;
}
