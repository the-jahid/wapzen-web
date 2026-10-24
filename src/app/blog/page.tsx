import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPosts, formatPostDate } from "@/lib/blogPosts";
import tools from "@/components/free-tools/FreeTools.module.css";
import styles from "@/components/blog/Blog.module.css";

const title = "Blog: WhatsApp AI Tool Comparisons & Alternatives";
const description = "Honest comparisons of WhatsApp chatbot and AI calling tools: Wapzen vs WATI, the best WATI alternatives, and WATI vs AiSensy vs Interakt.";

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

export default function BlogPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <header className={tools.hero}>
      <span className={tools.eyebrow}><span />Blog</span>
      <h1 className={tools.title}>The Wapzen blog.<br /><span>Compare before you choose.</span></h1>
      <p className={tools.lead}>Straight comparisons of WhatsApp chatbot and AI calling platforms: what they cost, what they do well, and where Wapzen fits, or doesn&rsquo;t.</p>
    </header>
    <div className={styles.postGrid}>
      {blogPosts.map((post) => <Link key={post.href} href={post.href} className={tools.toolTile}>
        <span className={tools.cardIcon}><post.icon size={21} /></span>
        <span className={styles.postTag}>{post.tag}</span>
        <h2 className={styles.postTitle}>{post.name}</h2>
        <p>{post.description}</p>
        <span className={styles.postDate}><time dateTime={post.updated}>{formatPostDate(post.updated)}</time> · {post.readingMinutes} min read</span>
        <span>Read post<ArrowRight size={15} /></span>
      </Link>)}
    </div>
  </>;
}
