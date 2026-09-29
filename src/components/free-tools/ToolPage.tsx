import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Plus, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { GetStarted } from "@/components/landing/SiteChrome";
import styles from "./FreeTools.module.css";

// The page skeleton shared by every free tool under /tools: hero, the tool,
// explainer sections, FAQ (with matching FAQPage structured data) and a CTA.

type Faq = { q: string; a: string };

type ToolPageProps = {
  path: string;
  /** Tool name for structured data and the breadcrumb, e.g. "WhatsApp link generator". */
  name: string;
  description: string;
  heading: ReactNode;
  lead: string;
  perks: string[];
  tool: ReactNode;
  steps: { heading: ReactNode; items: Array<{ title: string; body: string }> };
  cards: { heading: ReactNode; intro?: string; items: Array<{ icon: LucideIcon; title: string; body: string }> };
  faq: { heading: ReactNode; items: Faq[] };
  cta: { heading: ReactNode; body: string };
};

function toolJsonLd({ path, name, description, faq }: Pick<ToolPageProps, "path" | "name" | "description" | "faq">) {
  const url = `${siteConfig.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name,
        url,
        description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteConfig.name, item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Free tools", item: `${siteConfig.url}/tools` },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faq.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
      },
    ],
  };
}

export function ToolPage(props: ToolPageProps) {
  const { name, heading, lead, perks, tool, steps, cards, faq, cta } = props;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd(props)).replace(/</g, "\\u003c") }} />
    <header className={styles.hero}>
      <nav className={styles.crumbs} aria-label="Breadcrumb"><Link href="/tools">Free tools</Link><span aria-hidden="true">/</span><span aria-current="page">{name}</span></nav>
      <span className={styles.eyebrow}><span />Free tool</span>
      <h1 className={styles.title}>{heading}</h1>
      <p className={styles.lead}>{lead}</p>
      <p className={styles.perks}>{perks.map((perk) => <span key={perk}><Check size={14} /> {perk}</span>)}</p>
    </header>

    <div className={styles.tool}>{tool}</div>

    <section className={styles.section} aria-labelledby="how-title">
      <div className={styles.sectionHead}><h2 id="how-title" className={styles.sectionTitle}>{steps.heading}</h2></div>
      <div className={styles.grid3}>{steps.items.map((step, i) => <article key={step.title} className={styles.card}><span className={styles.stepNum}>STEP {String(i + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div>
    </section>

    <section className={styles.section} aria-labelledby="cards-title">
      <div className={styles.sectionHead}><h2 id="cards-title" className={styles.sectionTitle}>{cards.heading}</h2>{cards.intro && <p>{cards.intro}</p>}</div>
      <div className={styles.grid3}>{cards.items.map((card) => <article key={card.title} className={styles.card}><span className={styles.cardIcon}><card.icon size={20} strokeWidth={1.8} /></span><h3>{card.title}</h3><p>{card.body}</p></article>)}</div>
    </section>

    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.sectionHead}><h2 id="faq-title" className={styles.sectionTitle}>{faq.heading}</h2></div>
      <div className={styles.faqList}>{faq.items.map((item) => <details key={item.q} className={styles.faqItem}><summary>{item.q}<Plus size={18} /></summary><p>{item.a}</p></details>)}</div>
    </section>

    <section className={styles.cta} aria-labelledby="cta-title">
      <div className={styles.ctaInner}>
        <div><h2 id="cta-title">{cta.heading}</h2><p>{cta.body}</p></div>
        <div><GetStarted label="Try Wapzen free" /></div>
      </div>
    </section>
  </>;
}
