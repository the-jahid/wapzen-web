import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { blogPost, blogUi, type BlogPostEntry } from "@/lib/blogPosts";
import { locales } from "@/lib/locales";
import { pageMetadata } from "@/lib/pageMetadata";
import { postJsonLd } from "@/components/blog/BlogPost";
import tools from "@/components/free-tools/FreeTools.module.css";
import landing from "@/components/landing/CoreLanding.module.css";
import styles from "./Blog.module.css";

// Skeleton for posts published word for word (the Irish posts in app/blog, the
// German posts in app/de/blog): everything inside <article> comes from the post
// itself, so the summary box, byline, table of contents, sources note and "keep
// reading" of BlogPost are left out. The post's own closing section becomes the
// CTA band and its FAQ feeds the FAQPage data.

type Faq = { q: string; a: string };
type PostSection = { id: string; title: string; body: ReactNode };

type VerbatimPostProps = {
  href: string;
  heading: ReactNode;
  lead: string;
  /** The paragraphs between the lead and the first section. */
  intro: ReactNode;
  sections: PostSection[];
  faqTitle: string;
  faq: Faq[];
  closing: { heading: string; body: ReactNode; label: string };
};

/** pageMetadata plus the post's search terms and its language for social previews. */
export function verbatimPostMetadata(post: BlogPostEntry, ogLocale: string, keywords: string[]): Metadata {
  const metadata = pageMetadata({ title: post.title, description: post.description, path: post.href, locale: post.locale, article: { publishedTime: post.published, modifiedTime: post.updated } });
  return { ...metadata, keywords, openGraph: { ...metadata.openGraph, locale: ogLocale } };
}

export function VerbatimPost({ href, heading, lead, intro, sections, faqTitle, faq, closing }: VerbatimPostProps) {
  const post = blogPost(href);
  const locale = post.locale ?? "en";
  const { ui } = locales[locale];
  const t = blogUi(locale);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd(post, faq)).replace(/</g, "\\u003c") }} />
    <header className={tools.hero}>
      <nav className={tools.crumbs} aria-label={ui.breadcrumb}><Link href="/">{ui.home}</Link><span aria-hidden="true">/</span><Link href={t.href}>{t.label}</Link><span aria-hidden="true">/</span><span aria-current="page" lang={post.language}>{post.name}</span></nav>
      <h1 className={tools.title} lang={post.language}>{heading}</h1>
      <p className={tools.lead} lang={post.language}>{lead}</p>
    </header>

    <div className={`${styles.layout} ${styles.layoutSolo}`}>
      <article className={styles.article} lang={post.language}>
        <div className={styles.prose}>{intro}</div>

        {sections.map((section) => <section key={section.id} id={section.id} className={styles.block} aria-labelledby={`${section.id}-title`}>
          <h2 id={`${section.id}-title`} className={styles.heading}>{section.title}</h2>
          <div className={styles.prose}>{section.body}</div>
        </section>)}

        <section id="faq" className={styles.block} aria-labelledby="faq-title">
          <h2 id="faq-title" className={styles.heading}>{faqTitle}</h2>
          <div className={tools.faqList}>{faq.map((item) => <details key={item.q} className={tools.faqItem}><summary>{item.q}<Plus size={18} /></summary><p>{item.a}</p></details>)}</div>
        </section>
      </article>
    </div>

    <section className={tools.cta} aria-labelledby="cta-title" lang={post.language}>
      <div className={tools.ctaInner}>
        <div><h2 id="cta-title">{closing.heading}</h2>{closing.body}</div>
        <div><Link href="/" className={`${landing.button} ${landing.greenButton}`}>{closing.label}<ArrowUpRight size={17} /></Link></div>
      </div>
    </section>
  </>;
}
