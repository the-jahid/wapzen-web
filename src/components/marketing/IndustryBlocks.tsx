import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GetStarted } from "@/components/landing/SiteChrome";
import tools from "@/components/free-tools/FreeTools.module.css";
import styles from "./Industry.module.css";

// Blocks for industry pages (app/(marketing)/industries), on top of
// MarketingPage's: jump tags under the hero, a sourced stats strip, an example
// chat, notes, an inline CTA and a sources list.

/** In-page links to the page's use-case sections, shown under the hero. */
export function JumpTags({ items }: { items: Array<{ href: string; label: string }> }) {
  return <nav className={styles.tags} aria-label="On this page">{items.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>;
}

/** Figures from research, each with its source; `note` says they aren't our own results. */
export function Stats({ items, note }: { items: Array<{ value: string; label: string; source: string }>; note: string }) {
  return <>
    <div className={styles.stats}>{items.map((item) => <article key={item.value} className={styles.stat}>
      <strong className={styles.statValue}>{item.value}</strong>
      <p className={styles.statLabel}>{item.label}</p>
      <p className={styles.statSource}>{item.source}</p>
    </article>)}</div>
    <p className={styles.statsNote}>{note}</p>
  </>;
}

type ChatTurn = { from: "patient" | "agent"; text: string };

/** An example WhatsApp thread beside the notes on how each answer was produced. */
export function ChatExample({ business, turns, points, caption }: { business: string; turns: ChatTurn[]; points: Array<{ title: string; body: string }>; caption: string }) {
  return <div className={styles.example}>
    <figure className={styles.thread}>
      <div className={styles.threadHead}><span aria-hidden="true">{business.charAt(0)}</span><div><strong>{business}</strong><small>WhatsApp · AI agent</small></div></div>
      <ol className={styles.turns}>{turns.map((turn, i) => <li key={i} className={turn.from === "agent" ? styles.agent : styles.patient}>
        <span className={tools.srOnly}>{turn.from === "agent" ? "Agent: " : "Patient: "}</span>{turn.text}
      </li>)}</ol>
      <figcaption className={styles.threadCaption}>{caption}</figcaption>
    </figure>
    <dl className={styles.points}>{points.map((point) => <div key={point.title}><dt>{point.title}</dt><dd>{point.body}</dd></div>)}</dl>
  </div>;
}

export function Note({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>;
}

/** A text link to a related page, under a section. */
export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return <p className={styles.more}><Link href={href}>{children}<ArrowRight size={15} /></Link></p>;
}

/** A sign-up band between sections. */
export function InlineCta({ title, body, label }: { title: string; body: string; label?: string }) {
  return <div className={styles.inlineWrap}>
    <aside className={styles.inlineCta} aria-label={title}>
      <div><p className={styles.inlineTitle}>{title}</p><p>{body}</p></div>
      <GetStarted label={label} />
    </aside>
  </div>;
}

/** The page's sources and the date its facts were last checked. */
export function Sources({ checked, items }: { checked: string; items: Array<{ label: string; href: string }> }) {
  return <section className={tools.section} id="sources" aria-labelledby="sources-title">
    <div className={styles.sources}>
      <h2 id="sources-title" className={styles.sourcesTitle}>Sources</h2>
      <p>Facts on this page were checked on {checked}. The figures above come from published research, not from Wapzen customers.</p>
      <ul>{items.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}<ArrowUpRight size={13} /></a></li>)}</ul>
    </div>
  </section>;
}
