import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { StatusBoard } from "@/components/status/StatusBoard";
import tools from "@/components/free-tools/FreeTools.module.css";

// Public visitor counts. The numbers load in the browser, so the page itself
// stays static. Kept out of the sitemap and search results: it is a live
// dashboard, not something to rank.
const path = "/status";
const title = "Website Visitors Today";
const description = "How many people visited wapzen.io today and which countries they came from. Each visitor counts once a day.";

export const metadata: Metadata = {
  ...pageMetadata({ title, description, path }),
  robots: { index: false, follow: true },
};

export default function StatusPage() {
  return <>
    <header className={tools.hero}>
      <nav className={tools.crumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Status</span></nav>
      <span className={tools.eyebrow}><span />Live status</span>
      <h1 className={tools.title}>Who visited <span>Wapzen today.</span></h1>
      <p className={tools.lead}>Visitors to wapzen.io by country. Each visitor counts once a day, and days run on Bangladesh time (UTC+6).</p>
    </header>
    <StatusBoard />
  </>;
}
