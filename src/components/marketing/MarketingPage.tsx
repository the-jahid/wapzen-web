import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, Plus, Wrench, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { locales, type Locale } from "@/lib/locales";
import { pagesIn } from "@/lib/marketingPages";
import { GetStarted } from "@/components/landing/SiteChrome";
import { CopyButton } from "@/components/free-tools/CopyButton";
import tools from "@/components/free-tools/FreeTools.module.css";
import styles from "./Marketing.module.css";

// Skeleton for the public marketing pages in app/(marketing): hero, the page's
// own sections (children), "keep exploring" links, FAQ with matching FAQPage
// structured data, and a CTA. Section building blocks are exported below.
// Reuses the /tools styles so both families of pages look the same.

type Faq = { q: string; a: string };

type MarketingPageProps = {
  path: string;
  /** Short name for the breadcrumb, e.g. "Pricing". */
  name: string;
  /** The page's metadata title, used as the WebPage name. */
  title: string;
  description: string;
  eyebrow: string;
  heading: ReactNode;
  lead: string;
  perks: string[];
  ctaLabel?: string;
  secondary?: { href: string; label: string };
  /** Rendered right under the hero copy, e.g. the pricing card. */
  hero?: ReactNode;
  children: ReactNode;
  faq: { heading: ReactNode; items: Faq[] };
  cta: { heading: ReactNode; body: string };
  /** Two marketing-page hrefs for "keep exploring"; defaults to the first two others. */
  related?: string[];
  /** Page language; defaults to English. Translates the fixed UI text. */
  locale?: Locale;
  /** Extra JSON-LD nodes for this page's @graph. */
  schema?: object[];
};

function pageJsonLd({ path, name, title, description, faq, schema = [], locale = "en" }: MarketingPageProps) {
  const url = `${siteConfig.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: locales[locale].hreflang,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#software` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteConfig.name, item: siteConfig.url },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        isPartOf: { "@id": `${url}#webpage` },
        mainEntity: faq.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
      },
      ...schema,
    ],
  };
}

export function MarketingPage(props: MarketingPageProps) {
  const { path, name, eyebrow, heading, lead, perks, secondary, hero, children, faq, cta, locale = "en" } = props;
  const { ui } = locales[locale];
  const ctaLabel = props.ctaLabel ?? ui.startFree;
  const others = pagesIn(locale).filter((page) => page.href !== path);
  const related = props.related ? others.filter((page) => props.related?.includes(page.href)) : others.slice(0, 2);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(props)).replace(/</g, "\\u003c") }} />
    <header className={tools.hero}>
      <nav className={tools.crumbs} aria-label={ui.breadcrumb}><Link href="/">{ui.home}</Link><span aria-hidden="true">/</span><span aria-current="page">{name}</span></nav>
      <span className={tools.eyebrow}><span />{eyebrow}</span>
      <h1 className={tools.title}>{heading}</h1>
      <p className={tools.lead}>{lead}</p>
      <div className={styles.heroActions}>
        <GetStarted label={ctaLabel} />
        {secondary && <Link href={secondary.href} className={styles.textLink}>{secondary.label}<ArrowRight size={16} /></Link>}
      </div>
      <p className={tools.perks}>{perks.map((perk) => <span key={perk}><Check size={14} /> {perk}</span>)}</p>
    </header>

    {hero}

    {children}

    <Section id="explore" heading={<>{ui.explore[0]}<br /><span>{ui.explore[1]}</span></>}>
      <div className={tools.grid3}>
        {related.map((page) => <Link key={page.href} href={page.href} className={tools.toolTile}><span className={tools.cardIcon}><page.icon size={20} /></span><h3 className={styles.tileTitle}>{page.name}</h3><p>{page.description}</p><span>{ui.readMore}<ArrowRight size={15} /></span></Link>)}
        <Link href="/tools" className={tools.toolTile}><span className={tools.cardIcon}><Wrench size={20} /></span><h3 className={styles.tileTitle}>{ui.toolsTitle}</h3><p>{ui.toolsBody}</p><span>{ui.openTools}<ArrowRight size={15} /></span></Link>
      </div>
    </Section>

    <Section id="faq" heading={faq.heading}>
      <div className={tools.faqList}>{faq.items.map((item) => <details key={item.q} className={tools.faqItem}><summary>{item.q}<Plus size={18} /></summary><p>{item.a}</p></details>)}</div>
    </Section>

    <section className={tools.cta} aria-labelledby="cta-title">
      <div className={tools.ctaInner}>
        <div><h2 id="cta-title">{cta.heading}</h2><p>{cta.body}</p></div>
        <div><GetStarted label={ctaLabel} /></div>
      </div>
    </section>
  </>;
}

export function Section({ id, heading, intro, children }: { id: string; heading: ReactNode; intro?: string; children: ReactNode }) {
  return <section className={tools.section} id={id} aria-labelledby={`${id}-title`}>
    <div className={tools.sectionHead}><h2 id={`${id}-title`} className={tools.sectionTitle}>{heading}</h2>{intro && <p>{intro}</p>}</div>
    {children}
  </section>;
}

export function Steps({ items }: { items: Array<{ title: string; body: string }> }) {
  return <ol className={styles.steps}>{items.map((step, i) => <li key={step.title}>
    <span className={styles.stepNumber} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
    <div><h3 className={styles.stepTitle}>{step.title}</h3><p>{step.body}</p></div>
  </li>)}</ol>;
}

export function Cards({ items }: { items: Array<{ icon: LucideIcon; title: string; body: string }> }) {
  return <div className={tools.grid3}>{items.map((card) => <article key={card.title} className={tools.card}><span className={tools.cardIcon}><card.icon size={20} strokeWidth={1.8} /></span><h3>{card.title}</h3><p>{card.body}</p></article>)}</div>;
}

/** A comparison table; the last column is Wapzen and is highlighted. */
export function Comparison({ caption, columns, rows }: { caption: string; columns: string[]; rows: string[][] }) {
  return <div className={styles.tableWrap}>
    <table className={styles.compare}>
      <caption className={tools.srOnly}>{caption}</caption>
      <thead><tr><td />{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
      <tbody>{rows.map(([label, ...cells]) => <tr key={label}><th scope="row">{label}</th>{cells.map((cell, i) => <td key={i} data-label={columns[i]}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

/** Copy-and-paste message templates, shown as chat bubbles. */
export function Samples({ items, locale = "en" }: { items: Array<{ title: string; text: string }>; locale?: Locale }) {
  const { ui } = locales[locale];
  return <div className={styles.samples}>{items.map((sample) => <article key={sample.title} className={styles.sample}>
    <div className={styles.sampleHead}><h3 className={styles.sampleTitle}>{sample.title}</h3><CopyButton value={sample.text} label={`${ui.copy}: ${sample.title}`} copiedText={ui.copied}>{ui.copy}</CopyButton></div>
    <p className={styles.bubble}>{sample.text}</p>
  </article>)}</div>;
}

/** A row of labels, e.g. supported languages. */
export function Pills({ items }: { items: string[] }) {
  return <ul className={styles.pills}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}
