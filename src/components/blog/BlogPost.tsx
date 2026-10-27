import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock, Plus, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { blogPost, blogPosts, formatPostDate, type BlogPostEntry } from "@/lib/blogPosts";
import { marketingPages } from "@/lib/marketingPages";
import { GetStarted } from "@/components/landing/SiteChrome";
import { Section } from "@/components/marketing/MarketingPage";
import { TracingBeam } from "@/components/ui/tracing-beam";
import tools from "@/components/free-tools/FreeTools.module.css";
import marketing from "@/components/marketing/Marketing.module.css";
import styles from "./Blog.module.css";
import { BlogToc } from "./BlogToc";

// Skeleton for the posts in app/blog: hero with byline, a quick-answer box,
// the post's sections with a table of contents built from them, FAQ, sources,
// "keep reading" links and a CTA, plus BlogPosting/FAQPage structured data.
// Building blocks for section bodies are exported below.

type Faq = { q: string; a: string };
type PostSection = { id: string; title: string; body: ReactNode };

type BlogPostProps = {
  href: string;
  heading: ReactNode;
  lead: string;
  summary: { title: string; items: ReactNode[] };
  sections: PostSection[];
  faq: Faq[];
  /** Where the post's facts come from; listed with the date they were checked. */
  sources?: Array<{ label: string; href: string }>;
  /** Two posts for "keep reading"; defaults to the first two others in the registry. */
  related?: [string, string];
  /** A marketing page shown beside the other posts in "keep reading". */
  product: string;
  cta: { heading: ReactNode; body: string };
};

function postJsonLd(post: BlogPostEntry, faq: Faq[]) {
  const url = `${siteConfig.url}${post.href}`;
  const organization = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: { "@type": "ImageObject", url: `${siteConfig.url}/brand/wapzen-logo.png`, width: 1200, height: 323 },
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: post.title,
        description: post.description,
        inLanguage: "en",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.published,
        dateModified: post.updated,
        articleSection: post.tag,
        inLanguage: "en",
        image: `${siteConfig.url}${post.image ?? "/opengraph-image"}`,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        isPartOf: { "@id": `${siteConfig.url}/blog#blog` },
        author: organization,
        publisher: organization,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteConfig.name, item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        isPartOf: { "@id": `${url}#webpage` },
        mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
      },
    ],
  };
}

/** Date, reading time and author line, shared by posts and the /blog index. */
export function PostMeta({ post }: { post: BlogPostEntry }) {
  return <p className={styles.meta}>
    <span>Wapzen team</span>
    <span><CalendarDays size={14} />Updated <time dateTime={post.updated}>{formatPostDate(post.updated)}</time></span>
    <span><Clock size={14} />{post.readingMinutes} min read</span>
  </p>;
}

export function BlogPost({ href, heading, lead, summary, sections, faq, sources = [], related, product, cta }: BlogPostProps) {
  const post = blogPost(href);
  const others = related ? related.map(blogPost) : blogPosts.filter((entry) => entry.href !== href).slice(0, 2);
  const page = marketingPages.find((entry) => entry.href === product);
  const toc = [...sections.map(({ id, title }) => ({ id, title })), { id: "faq", title: "FAQ" }];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd(post, faq)).replace(/</g, "\\u003c") }} />
    <header className={tools.hero}>
      <nav className={tools.crumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">{post.name}</span></nav>
      <span className={tools.eyebrow}><span />{post.tag}</span>
      <h1 className={tools.title}>{heading}</h1>
      <p className={tools.lead}>{lead}</p>
      <PostMeta post={post} />
    </header>

    <div className={styles.layout}>
      <aside className={styles.toc}>
        <BlogToc items={toc} />
      </aside>

      <article className={styles.article}><TracingBeam className={styles.beam} railClassName={styles.beamRail}>
        <section className={styles.summary} aria-labelledby="summary-title">
          <h2 id="summary-title" className={styles.summaryTitle}>{summary.title}</h2>
          <ul>{summary.items.map((item, i) => <li key={i}><Check size={16} /><span>{item}</span></li>)}</ul>
        </section>

        {sections.map((section) => <section key={section.id} id={section.id} className={styles.block} aria-labelledby={`${section.id}-title`}>
          <h2 id={`${section.id}-title`} className={styles.heading}>{section.title}</h2>
          <div className={styles.prose}>{section.body}</div>
        </section>)}

        <section id="faq" className={styles.block} aria-labelledby="faq-title">
          <h2 id="faq-title" className={styles.heading}>Frequently asked questions</h2>
          <div className={tools.faqList}>{faq.map((item) => <details key={item.q} className={tools.faqItem}><summary>{item.q}<Plus size={18} /></summary><p>{item.a}</p></details>)}</div>
        </section>

        <footer className={styles.sources}>
          <h2 className={styles.sourcesTitle}>{post.tag === "Guide" ? "About this guide" : "Sources"}</h2>
          {post.tag === "Guide"
            ? <p>The steps and screenshots come from Wapzen&rsquo;s dashboard on {formatPostDate(post.updated)}, filled with demo data: the businesses, people, and phone numbers in them are made up.</p>
            : post.tag === "Explainer"
              ? <p>The facts and prices in this post come from the sources below, checked on {formatPostDate(post.updated)}. Meta and other vendors change their prices and policies often, so confirm them at the source before you rely on them. Dashboard screenshots, where shown, use demo data.</p>
              : <p>Prices and features come from each vendor&rsquo;s own pages, checked on {formatPostDate(post.updated)}. They change often, so confirm them on the vendor&rsquo;s site before you buy.</p>}
          {sources.length > 0 && <ul>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="nofollow noopener noreferrer">{source.label}</a></li>)}</ul>}
        </footer>
      </TracingBeam></article>
    </div>

    <Section id="keep-reading" heading={<>Keep reading.<br /><span>More from the blog.</span></>}>
      <div className={tools.grid3}>
        {others.map((entry) => <Link key={entry.href} href={entry.href} className={tools.toolTile}><span className={tools.cardIcon}><entry.icon size={20} /></span><h3 className={marketing.tileTitle}>{entry.name}</h3><p>{entry.description}</p><span>Read post<ArrowRight size={15} /></span></Link>)}
        {page && <Link href={page.href} className={tools.toolTile}><span className={tools.cardIcon}><page.icon size={20} /></span><h3 className={marketing.tileTitle}>{page.name}</h3><p>{page.description}</p><span>Learn more<ArrowRight size={15} /></span></Link>}
      </div>
    </Section>

    <section className={tools.cta} aria-labelledby="cta-title">
      <div className={tools.ctaInner}>
        <div><h2 id="cta-title">{cta.heading}</h2><p>{cta.body}</p></div>
        <div><GetStarted label="Start free" /></div>
      </div>
    </section>
  </>;
}

/** A table with one highlighted row (Wapzen), e.g. a list of alternatives. */
export function RowTable({ caption, columns, rows, highlight }: { caption: string; columns: string[]; rows: string[][]; highlight?: string }) {
  return <div className={styles.tableWrap}>
    <table className={styles.table}>
      <caption className={tools.srOnly}>{caption}</caption>
      <thead><tr><th scope="col">Tool</th>{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
      <tbody>{rows.map(([label, ...cells]) => <tr key={label} data-highlight={label === highlight || undefined}><th scope="row">{label}</th>{cells.map((cell, i) => <td key={i} data-label={columns[i]}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

/** One product in a ranked list: facts row, description (children), pros and cons. */
export function ToolReview({ rank, name, href, facts, pros, cons, children }: {
  rank: number;
  name: string;
  /** The product's site; internal hrefs (Wapzen pages) use next/link. */
  href: string;
  facts: Array<[string, string]>;
  pros: string[];
  cons: string[];
  children: ReactNode;
}) {
  const link = href.startsWith("/")
    ? <Link href={href} className={styles.reviewLink}>Learn more<ArrowRight size={14} /></Link>
    : <a href={href} target="_blank" rel="nofollow noopener noreferrer" className={styles.reviewLink}>Visit site<ArrowRight size={14} /></a>;
  return <article className={styles.review} id={name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
    <div className={styles.reviewHead}>
      <span className={styles.rank} aria-hidden="true">{String(rank).padStart(2, "0")}</span>
      <h3 className={styles.reviewTitle}>{name}</h3>
      {link}
    </div>
    <dl className={styles.facts}>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className={styles.reviewBody}>{children}</div>
    <ProsCons pros={pros} cons={cons} />
  </article>;
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return <div className={styles.prosCons}>
    <div><span className={styles.listLabel}>Pros</span><ul>{pros.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div>
    <div><span className={styles.listLabel}>Cons</span><ul>{cons.map((item) => <li key={item}><X size={15} />{item}</li>)}</ul></div>
  </div>;
}

/** "Choose X if…" cards; the card named `highlight` gets the brand accent. */
export function Choose({ items, highlight = "Wapzen" }: { items: Array<{ name: string; points: string[] }>; highlight?: string }) {
  return <div className={styles.choose}>{items.map((item) => <div key={item.name} className={styles.chooseCard} data-highlight={item.name === highlight || undefined}>
    <h3 className={styles.chooseTitle}>Choose {item.name} if…</h3>
    <ul>{item.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul>
  </div>)}</div>;
}

/** A dashboard screenshot from public/blog, linked to the full-size file. width and height are the file's own. */
export function Screenshot({ src, width, height, alt, caption }: { src: string; width: number; height: number; alt: string; caption: ReactNode }) {
  return <figure className={styles.figure}>
    <a href={src} target="_blank" rel="noopener" className={styles.figureLink} aria-label={`${alt} (full size)`}>
      <Image src={src} width={width} height={height} alt={alt} sizes="(max-width: 1000px) calc(100vw - 32px), 760px" />
    </a>
    <figcaption>{caption}</figcaption>
  </figure>;
}

/** A sign-up prompt inside a section, placed where the post has just made the case. */
export function InlineCta({ title, body, label = "Start free" }: { title: string; body: string; label?: string }) {
  return <aside className={styles.inlineCta} aria-label={title}>
    <div><p className={styles.inlineCtaTitle}>{title}</p><p>{body}</p></div>
    <div><GetStarted label={label} /></div>
  </aside>;
}

/** A short aside inside a section, e.g. a pricing caveat. */
export function Note({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>;
}
