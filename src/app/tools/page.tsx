import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { freeTools } from "@/lib/freeTools";
import styles from "@/components/free-tools/FreeTools.module.css";

const title = "Free WhatsApp Tools";
const description = "Free WhatsApp tools: message any number without saving it, create click-to-chat links and custom QR codes, and look up country codes. No sign-up needed.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tools" },
  openGraph: { title, description, url: "/tools" },
};

export default function ToolsPage() {
  return <>
    <header className={styles.hero}>
      <span className={styles.eyebrow}><span />Free tools</span>
      <h1 className={styles.title}>Free WhatsApp tools.<br /><span>For every business.</span></h1>
      <p className={styles.lead}>Simple, free tools that help customers start a WhatsApp conversation with you. No account, no sign-up.</p>
    </header>
    <div className={styles.toolGrid}>
      {freeTools.map((tool) => <Link key={tool.href} href={tool.href} className={styles.toolTile}>
        <span className={styles.cardIcon}><tool.icon size={21} /></span>
        <h2>{tool.name}</h2>
        <p>{tool.description}</p>
        <span>Open tool<ArrowRight size={15} /></span>
      </Link>)}
    </div>
  </>;
}
