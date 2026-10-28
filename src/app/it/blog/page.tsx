import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogUi, formatShortDate, postsIn } from "@/lib/blogPosts";
import { pagesIn } from "@/lib/marketingPages";
import styles from "@/components/blog/BlogIndex.module.css";

// Italian blog index: every Italian post, then the Italian solution pages.
// Too few posts for the /blog bento, so it is the plain grid only.
const path = "/it/blog";
const title = "Blog WhatsApp: guide, prezzi ed esempi per la tua attività";
const description = "Guide su WhatsApp Business in italiano: quanto costa l’API in Italia, differenze con WhatsApp, chatbot, messaggi automatici da copiare e ChatGPT su WhatsApp.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "it" });

const posts = postsIn("it");
const t = blogUi("it");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${siteConfig.url}${path}#blog`,
  url: `${siteConfig.url}${path}`,
  name: `Blog di ${siteConfig.name}`,
  description,
  inLanguage: "it",
  publisher: { "@id": `${siteConfig.url}/#organization` },
  blogPost: posts.map((post) => ({ "@type": "BlogPosting", headline: post.title, url: `${siteConfig.url}${post.href}`, datePublished: post.published, dateModified: post.updated, inLanguage: "it" })),
};

export default function BlogItPage() {
  return <div className={styles.index}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

    <header className={styles.top}>
      <div>
        <h1 className={styles.title}>Blog <span>Wapzen</span></h1>
        <p className={styles.intro}>Guide pratiche su WhatsApp Business per le attività italiane: costi e tariffe Meta in euro, chatbot e AI, messaggi automatici da copiare e le novità che cambiano le regole.</p>
      </div>
    </header>

    <section className={styles.group} aria-labelledby="articoli-title">
      <h2 id="articoli-title" className={styles.groupTitle}>Articoli<span>{posts.length}</span></h2>
      <div className={styles.grid}>{posts.map((post) => <Link key={post.href} href={post.href} className={styles.post} data-tag={post.tag}>
        <span className={styles.postIcon} aria-hidden="true"><post.icon size={18} /></span>
        <h3 className={styles.postTitle}>{post.name}</h3>
        <p className={styles.postText}>{post.description}</p>
        <span className={styles.postFoot}><time dateTime={post.updated}>{formatShortDate(post.updated, t.dateLocale)}</time> · {t.minRead(post.readingMinutes)}<span className={styles.postArrow}><ArrowUpRight size={16} /></span></span>
      </Link>)}</div>
    </section>

    <section className={styles.group} aria-labelledby="soluzioni-title">
      <h2 id="soluzioni-title" className={styles.groupTitle}>Soluzioni<span>{pagesIn("it").length}</span></h2>
      <div className={styles.grid}>{pagesIn("it").map((page) => <Link key={page.href} href={page.href} className={styles.post} data-tag="Guide">
        <span className={styles.postIcon} aria-hidden="true"><page.icon size={18} /></span>
        <h3 className={styles.postTitle}>{page.name}</h3>
        <p className={styles.postText}>{page.description}</p>
        <span className={styles.postFoot}>{t.learnMore}<span className={styles.postArrow}><ArrowUpRight size={16} /></span></span>
      </Link>)}</div>
    </section>
  </div>;
}
