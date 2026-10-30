import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { blogUi, formatShortDate, postsIn } from "@/lib/blogPosts";
import { locales, type Locale } from "@/lib/locales";
import { solutionsFor } from "@/lib/marketingPages";
import styles from "./BlogIndex.module.css";

// Blog index for a language other than English (/it/blog, /pt-br/blog,
// /es-mx/blog): every post in that language, then the language's solution
// pages. Too few posts for the /blog bento, so it is the plain grid only.
// Each page passes its own copy and builds its metadata with pageMetadata().

type LocaleBlogIndexProps = {
  locale: Locale;
  description: string;
  /** The h1: a plain part and a highlighted part. */
  heading: [string, string];
  intro: string;
  postsHeading: string;
  solutionsHeading: string;
};

export function LocaleBlogIndex({ locale, description, heading, intro, postsHeading, solutionsHeading }: LocaleBlogIndexProps) {
  const t = blogUi(locale);
  const posts = postsIn(locale);
  const solutions = solutionsFor(locale);
  const url = `${siteConfig.url}${t.href}`;
  const inLanguage = locales[locale].hreflang;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: `${siteConfig.name} ${t.label}`,
    description,
    inLanguage,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    blogPost: posts.map((post) => ({ "@type": "BlogPosting", headline: post.title, url: `${siteConfig.url}${post.href}`, datePublished: post.published, dateModified: post.updated, inLanguage })),
  };

  return <div className={styles.index}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

    <header className={styles.top}>
      <div>
        <h1 className={styles.title}>{heading[0]} <span>{heading[1]}</span></h1>
        <p className={styles.intro}>{intro}</p>
      </div>
    </header>

    <section className={styles.group} aria-labelledby="posts-title">
      <h2 id="posts-title" className={styles.groupTitle}>{postsHeading}<span>{posts.length}</span></h2>
      <div className={styles.grid}>{posts.map((post) => <Link key={post.href} href={post.href} className={styles.post} data-tag={post.tag}>
        <span className={styles.postIcon} aria-hidden="true"><post.icon size={18} /></span>
        <h3 className={styles.postTitle}>{post.name}</h3>
        <p className={styles.postText}>{post.description}</p>
        <span className={styles.postFoot}><time dateTime={post.updated}>{formatShortDate(post.updated, t.dateLocale)}</time> · {t.minRead(post.readingMinutes)}<span className={styles.postArrow}><ArrowUpRight size={16} /></span></span>
      </Link>)}</div>
    </section>

    {solutions.length > 0 && <section className={styles.group} aria-labelledby="solutions-title">
      <h2 id="solutions-title" className={styles.groupTitle}>{solutionsHeading}<span>{solutions.length}</span></h2>
      <div className={styles.grid}>{solutions.map((page) => <Link key={page.href} href={page.href} className={styles.post} data-tag="Guide">
        <span className={styles.postIcon} aria-hidden="true"><page.icon size={18} /></span>
        <h3 className={styles.postTitle}>{page.name}</h3>
        <p className={styles.postText}>{page.description}</p>
        <span className={styles.postFoot}>{t.learnMore}<span className={styles.postArrow}><ArrowUpRight size={16} /></span></span>
      </Link>)}</div>
    </section>}
  </div>;
}
