import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPosts, formatShortDate, type BlogPostEntry } from "@/lib/blogPosts";
import styles from "@/components/blog/BlogIndex.module.css";

const title = "Blog: WhatsApp AI Guides, Explainers & Comparisons";
const description = "WhatsApp AI guides, explainers and honest comparisons: chatbots without the API, Business API pricing, ChatGPT on WhatsApp, n8n agents, and Wapzen vs WATI.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/blog" });

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${siteConfig.url}/blog#blog`,
  url: `${siteConfig.url}/blog`,
  name: `${siteConfig.name} blog`,
  description,
  inLanguage: "en",
  publisher: { "@id": `${siteConfig.url}/#organization` },
  blogPost: blogPosts.map((post) => ({ "@type": "BlogPosting", headline: post.title, url: `${siteConfig.url}${post.href}`, datePublished: post.published, dateModified: post.updated })),
};

// Category sections under the bento, in display order; the chips link to them.
const categories: Array<{ tag: BlogPostEntry["tag"]; label: string; id: string }> = [
  { tag: "Guide", label: "Guides", id: "guides" },
  { tag: "Explainer", label: "Explainers", id: "explainers" },
  { tag: "Comparison", label: "Comparisons", id: "comparisons" },
  { tag: "Alternatives", label: "Alternatives", id: "alternatives" },
];

/** A post's picture in the bento: its cover illustration, else its screenshot. */
const picture = (post: BlogPostEntry) => post.cover ?? post.image;

// Fills the bento from the registry, newest first: each slot takes the first
// post not already shown that fits it, and picture slots skip a picture
// another slot already uses (several posts share a screenshot). The featured
// slot prefers a post with a cover illustration.
function pickBento() {
  const usedPosts = new Set<string>();
  const usedImages = new Set<string>();
  const take = (fits: (post: BlogPostEntry) => boolean) => {
    const post = blogPosts.find((entry) => !usedPosts.has(entry.href) && fits(entry) && !usedImages.has(picture(entry) ?? ""));
    if (!post) throw new Error("Not enough blog posts to fill the /blog bento");
    usedPosts.add(post.href);
    const image = picture(post);
    if (image) usedImages.add(image);
    return post;
  };
  const withImage = (post: BlogPostEntry) => Boolean(picture(post));
  const featured = blogPosts.some((post) => post.cover) ? take((post) => Boolean(post.cover)) : take(withImage);
  const lead = take((post) => !picture(post));
  const tall = take(withImage);
  const media = take(withImage);
  const more = [take(() => true), take(() => true)];
  return { featured, lead, more, tall, media };
}

const Meta = ({ post, date = post.updated }: { post: BlogPostEntry; date?: string }) =>
  <p className={styles.meta}><b>{post.tag}</b><span aria-hidden="true">·</span><time dateTime={date}>{formatShortDate(date)}</time></p>;

export default function BlogPage() {
  const { featured, lead, more, tall, media } = pickBento();
  return <div className={styles.index}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

    <header className={styles.top}>
      <div>
        <h1 className={styles.title}>Wapzen <span>blog</span></h1>
        <p className={styles.intro}>Step-by-step guides with real dashboard screenshots, explainers on WhatsApp pricing and rules, and honest comparisons of WhatsApp AI platforms.</p>
      </div>
      <a href="#all-posts" className={styles.pill}>All {blogPosts.length} posts<ArrowDown size={15} /></a>
    </header>

    <section className={styles.bento} aria-label="Featured posts">
      <Link href={featured.href} className={`${styles.card} ${styles.featured}`}>
        <Image src={picture(featured)!} alt="" fill priority sizes="(max-width: 1000px) 100vw, 460px" className={featured.cover ? `${styles.cover} ${styles.illustration}` : styles.cover} />
        <span className={styles.badge} aria-hidden="true"><featured.icon size={19} /></span>
        <div className={styles.tab}>
          <Meta post={featured} />
          <h2 className={styles.featuredTitle}>{featured.name}</h2>
        </div>
      </Link>

      <article className={`${styles.card} ${styles.lime}`}>
        <Link href={lead.href} className={styles.corner} aria-label={`Read ${lead.name}`}><span><ArrowUpRight size={20} /></span></Link>
        <Meta post={lead} />
        <h2 className={styles.leadTitle}><Link href={lead.href}>{lead.name}</Link></h2>
        <p className={styles.excerpt}>{lead.description} <Link href={lead.href}>More</Link></p>
        <ul className={styles.rows}>{more.map((post) => <li key={post.href}><Link href={post.href}>{post.name}<ArrowRight size={17} /></Link></li>)}</ul>
      </article>

      <Link href={tall.href} className={`${styles.card} ${styles.tall}`}>
        <Meta post={tall} />
        <h2 className={styles.tallTitle}>{tall.name}</h2>
        <span className={styles.shot}><Image src={picture(tall)!} alt="" fill sizes="(max-width: 1000px) 50vw, 220px" className={styles.cover} /></span>
      </Link>

      <Link href={media.href} className={`${styles.card} ${styles.media}`}>
        <Image src={picture(media)!} alt="" fill sizes="(max-width: 1000px) 50vw, 340px" className={styles.cover} />
        <span className={styles.play} aria-hidden="true"><media.icon size={20} /></span>
        <div className={styles.mediaText}>
          <p className={styles.meta}><b>{media.tag}</b><span aria-hidden="true">·</span>{media.readingMinutes} min read</p>
          <h2 className={styles.mediaTitle}>{media.name}</h2>
        </div>
      </Link>

      <nav className={`${styles.card} ${styles.lilac}`} aria-label="Categories">
        <ul className={styles.chips}>
          {categories.map((category, i) => <li key={category.id}><a href={`#${category.id}`} data-active={i === 0 || undefined}>{category.label}<span>{blogPosts.filter((post) => post.tag === category.tag).length}</span></a></li>)}
          <li><Link href="/tools">Free tools</Link></li>
        </ul>
        <a href="#all-posts" className={styles.viewAll}>View all posts</a>
        <a href="#all-posts" className={styles.cornerBottom} aria-hidden="true" tabIndex={-1}><span><ArrowRight size={20} /></span></a>
      </nav>
    </section>

    <div id="all-posts" className={styles.all}>
      {categories.map((category) => {
        const posts = blogPosts.filter((post) => post.tag === category.tag);
        if (posts.length === 0) return null;
        return <section key={category.id} id={category.id} className={styles.group} aria-labelledby={`${category.id}-title`}>
          <h2 id={`${category.id}-title`} className={styles.groupTitle}>{category.label}<span>{posts.length}</span></h2>
          <div className={styles.grid}>{posts.map((post) => <Link key={post.href} href={post.href} className={styles.post} data-tag={post.tag}>
            <span className={styles.postIcon} aria-hidden="true"><post.icon size={18} /></span>
            <h3 className={styles.postTitle}>{post.name}</h3>
            <p className={styles.postText}>{post.description}</p>
            <span className={styles.postFoot}><time dateTime={post.updated}>{formatShortDate(post.updated)}</time> · {post.readingMinutes} min read<span className={styles.postArrow}><ArrowUpRight size={16} /></span></span>
          </Link>)}</div>
        </section>;
      })}
    </div>
  </div>;
}
