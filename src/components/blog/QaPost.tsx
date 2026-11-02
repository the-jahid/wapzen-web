import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { blogPost, blogUi, formatPostDate, postsIn } from "@/lib/blogPosts";
import { locales } from "@/lib/locales";
import { marketingPages } from "@/lib/marketingPages";
import { GetStarted } from "@/components/landing/SiteChrome";
import { Section } from "@/components/marketing/MarketingPage";
import tools from "@/components/free-tools/FreeTools.module.css";
import marketing from "@/components/marketing/Marketing.module.css";
import { postJsonLd, PostMeta } from "./BlogPost";
import styles from "./Blog.module.css";
import qa from "./QaPost.module.css";

// A second skeleton for posts written as questions and answers, for search
// engines and assistants that quote a direct answer: hero, a verdict box, key
// facts, a numbered question index, then one block per question that opens
// with its short answer. Those short answers are the FAQPage structured data,
// so there is no separate FAQ. Shares the hero byline, sources note, "keep
// reading" and CTA with BlogPost, and the same blocks work inside bodies.

type Question = {
  id: string;
  q: string;
  /** Plain text: shown first under the question and used as the FAQPage answer. */
  answer: string;
  body: ReactNode;
};

type QaPostProps = {
  href: string;
  heading: ReactNode;
  lead: string;
  verdict: { title: string; body: ReactNode };
  facts: Array<[string, string]>;
  indexTitle: string;
  answerLabel: string;
  questions: Question[];
  sources?: Array<{ label: string; href: string }>;
  related?: [string, string];
  product: string;
  cta: { heading: ReactNode; body: string };
};

export function QaPost({ href, heading, lead, verdict, facts, indexTitle, answerLabel, questions, sources = [], related, product, cta }: QaPostProps) {
  const post = blogPost(href);
  const locale = post.locale ?? "en";
  const { ui } = locales[locale];
  const t = blogUi(locale);
  const checked = formatPostDate(post.updated, t.dateLocale);
  const others = related ? related.map(blogPost) : postsIn(locale).filter((entry) => entry.href !== href).slice(0, 2);
  const page = marketingPages.find((entry) => entry.href === product);
  const faq = questions.map(({ q, answer }) => ({ q, a: answer }));
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd(post, faq)).replace(/</g, "\\u003c") }} />
    <header className={tools.hero}>
      <nav className={tools.crumbs} aria-label={ui.breadcrumb}><Link href="/">{ui.home}</Link><span aria-hidden="true">/</span><Link href={t.href}>{t.label}</Link><span aria-hidden="true">/</span><span aria-current="page">{post.name}</span></nav>
      <span className={tools.eyebrow}><span />{t.tags[post.tag]}</span>
      <h1 className={tools.title}>{heading}</h1>
      <p className={tools.lead}>{lead}</p>
      <PostMeta post={post} />
    </header>

    <div className={`${styles.layout} ${styles.layoutSolo}`}>
      <article className={styles.article}>
        <section className={qa.verdict} aria-labelledby="verdict-title">
          <h2 id="verdict-title" className={qa.verdictTitle}>{verdict.title}</h2>
          <div className={qa.verdictBody}>{verdict.body}</div>
          <dl className={qa.facts}>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </section>

        <nav className={qa.index} aria-labelledby="index-title">
          <h2 id="index-title" className={qa.indexTitle}>{indexTitle}</h2>
          <ol>{questions.map((item, i) => <li key={item.id}><a href={`#${item.id}`}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{item.q}</a></li>)}</ol>
        </nav>

        {questions.map((item, i) => <section key={item.id} id={item.id} className={`${styles.block} ${qa.question}`} aria-labelledby={`${item.id}-title`}>
          <span className={qa.number} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <h2 id={`${item.id}-title`} className={styles.heading}>{item.q}</h2>
          <p className={qa.answer}><span><MessageCircleQuestion size={15} />{answerLabel}</span>{item.answer}</p>
          <div className={styles.prose}>{item.body}</div>
        </section>)}

        <footer className={styles.sources}>
          <h2 className={styles.sourcesTitle}>{t.sourcesTitle}</h2>
          <p>{t.explainerNote(checked)}</p>
          {sources.length > 0 && <ul>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="nofollow noopener noreferrer">{source.label}</a></li>)}</ul>}
        </footer>
      </article>
    </div>

    <Section id="keep-reading" heading={<>{t.keepReading[0]}<br /><span>{t.keepReading[1]}</span></>}>
      <div className={tools.grid3}>
        {others.map((entry) => <Link key={entry.href} href={entry.href} className={tools.toolTile}><span className={tools.cardIcon}><entry.icon size={20} /></span><h3 className={marketing.tileTitle}>{entry.name}</h3><p>{entry.description}</p><span>{t.readPost}<ArrowRight size={15} /></span></Link>)}
        {page && <Link href={page.href} className={tools.toolTile}><span className={tools.cardIcon}><page.icon size={20} /></span><h3 className={marketing.tileTitle}>{page.name}</h3><p>{page.description}</p><span>{t.learnMore}<ArrowRight size={15} /></span></Link>}
      </div>
    </Section>

    <section className={tools.cta} aria-labelledby="cta-title">
      <div className={tools.ctaInner}>
        <div><h2 id="cta-title">{cta.heading}</h2><p>{cta.body}</p></div>
        <div><GetStarted label={ui.startFree} /></div>
      </div>
    </section>
  </>;
}
