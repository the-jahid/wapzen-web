import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Camera, Check, Clock3, FileText, MessageCircle, Mic, PhoneCall, PhoneIncoming, PhoneOutgoing, Users, Wrench, X } from "lucide-react";
import { blogPost, blogUi, formatPostDate, postsIn } from "@/lib/blogPosts";
import { locales } from "@/lib/locales";
import { marketingPages } from "@/lib/marketingPages";
import { GetStarted, WhatsAppButton } from "@/components/landing/SiteChrome";
import { Section } from "@/components/marketing/MarketingPage";
import { CopyButton } from "@/components/free-tools/CopyButton";
import tools from "@/components/free-tools/FreeTools.module.css";
import marketing from "@/components/marketing/Marketing.module.css";
import { AboutWapzen, postJsonLd, PostMeta } from "./BlogPost";
import styles from "./Blog.module.css";
import pb from "./PlaybookPost.module.css";

// A third skeleton, for industry playbooks (first used 2026-11-17 for hotels, schools and
// car dealerships): hero, a short answer with a spec list, a chapter index, numbered
// chapters, an always-open FAQ (the FAQPage structured data), sources, "keep reading" and
// a CTA. The blocks below it (a day on the timeline, the jobs board, setup steps, message
// templates, the instructions file and the voice card) are made for these chapters.
// English only for now: the few fixed strings ("In this playbook", "Chapter") are props
// with English defaults.

type Chapter = { id: string; title: string; body: ReactNode };
type Faq = { q: string; a: string };

type PlaybookPostProps = {
  href: string;
  heading: ReactNode;
  lead: string;
  /** The direct answer at the top, and the facts beside it. */
  answer: { title: string; body: ReactNode; specs: Array<[string, string]> };
  chapters: Chapter[];
  /** Always open on the page, and the FAQPage structured data. */
  faq: Faq[];
  sources?: Array<{ label: string; href: string }>;
  related?: [string, string];
  /** A marketing page for the "keep reading" row. */
  product?: string;
  cta: { heading: ReactNode; body: string };
  /** Opens this WhatsApp chat from the closing CTA instead of sign-up. */
  action?: { href: string; label: string };
  labels?: { chapters: string; chapter: string };
};

export function PlaybookPost({ href, heading, lead, answer, chapters, faq, sources = [], related, product, cta, action, labels = { chapters: "In this playbook", chapter: "Chapter" } }: PlaybookPostProps) {
  const post = blogPost(href);
  const locale = post.locale ?? "en";
  const { ui } = locales[locale];
  const t = blogUi(locale);
  const checked = formatPostDate(post.checked ?? post.updated, t.dateLocale);
  const others = related ? related.map(blogPost) : postsIn(locale).filter((entry) => entry.href !== href).slice(0, 2);
  const page = marketingPages.find((entry) => entry.href === product);
  const number = (i: number) => String(i + 1).padStart(2, "0");
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
        <section className={pb.answer} aria-labelledby="answer-title">
          <div className={pb.answerText}>
            <h2 id="answer-title" className={pb.answerTitle}>{answer.title}</h2>
            <div className={pb.answerBody}>{answer.body}</div>
          </div>
          <dl className={pb.specs}>{answer.specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd><Check size={15} />{value}</dd></div>)}</dl>
        </section>

        <AboutWapzen locale={locale} />

        <nav className={pb.chapters} aria-labelledby="chapters-title">
          <h2 id="chapters-title" className={pb.chaptersTitle}>{labels.chapters}</h2>
          <ol>{chapters.map((chapter, i) => <li key={chapter.id}><a href={`#${chapter.id}`}><span aria-hidden="true">{number(i)}</span>{chapter.title}</a></li>)}<li><a href="#faq"><span aria-hidden="true">{number(chapters.length)}</span>{t.faqTitle}</a></li></ol>
        </nav>

        {chapters.map((chapter, i) => <section key={chapter.id} id={chapter.id} className={styles.block} aria-labelledby={`${chapter.id}-title`}>
          <p className={pb.kicker}>{labels.chapter} {number(i)}</p>
          <h2 id={`${chapter.id}-title`} className={styles.heading}>{chapter.title}</h2>
          <div className={styles.prose}>{chapter.body}</div>
        </section>)}

        <section id="faq" className={styles.block} aria-labelledby="faq-title">
          <p className={pb.kicker}>{labels.chapter} {number(chapters.length)}</p>
          <h2 id="faq-title" className={styles.heading}>{t.faqTitle}</h2>
          <dl className={pb.faq}>{faq.map((item) => <div key={item.q}><dt>{item.q}</dt><dd>{item.a}</dd></div>)}</dl>
        </section>

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
        <div>{action ? <WhatsAppButton href={action.href} label={action.label} /> : <GetStarted label={ui.startFree} />}</div>
      </div>
    </section>
  </>;
}

const channels = { chat: MessageCircle, voice: Mic, photo: Camera, call: PhoneCall, group: Users };
const outcomes = {
  answered: "Answered by the AI",
  sent: "AI sent a file",
  request: "Request saved for your team",
  handover: "Passed to your team",
  call: "Voice agent took the call",
};
export type TimelineItem = { time: string; channel: keyof typeof channels; from: string; message: string; outcome: keyof typeof outcomes; reply: string };

/** One day of messages, hour by hour: who wrote, what they asked and what the AI did. */
export function DayTimeline({ items, caption }: { items: TimelineItem[]; caption: string }) {
  return <figure className={pb.timeline}>
    <ol>{items.map((item) => {
      const Icon = channels[item.channel];
      return <li key={`${item.time}-${item.from}`} data-outcome={item.outcome}>
        <span className={pb.time}>{item.time}</span>
        <div className={pb.event}>
          <p className={pb.from}><Icon size={14} aria-hidden="true" />{item.from}</p>
          <p className={pb.message}>{item.message}</p>
          <p className={pb.reply}><span className={pb.tag}>{outcomes[item.outcome]}</span>{item.reply}</p>
        </div>
      </li>;
    })}</ol>
    <figcaption>{caption}</figcaption>
  </figure>;
}

/** Who does which job: the AI alone, the AI with your team confirming, or your team. */
export function JobBoard({ columns }: { columns: Array<{ tone: "ai" | "request" | "team"; title: string; note: string; items: string[] }> }) {
  return <div className={pb.board}>{columns.map((column) => <section key={column.title} className={pb.column} data-tone={column.tone} aria-label={column.title}>
    <h3 className={pb.columnTitle}>{column.title}</h3>
    <p className={pb.columnNote}>{column.note}</p>
    <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
  </section>)}</div>;
}

/** Numbered setup steps, each with a rough time. */
export function SetupSteps({ items }: { items: Array<{ title: string; time?: string; body: ReactNode }> }) {
  return <ol className={pb.steps}>{items.map((step, i) => <li key={step.title}>
    <span className={pb.stepNumber} aria-hidden="true">{i + 1}</span>
    <div>
      <h3 className={pb.stepTitle}>{step.title}{step.time && <span className={pb.stepTime}><Clock3 size={12} aria-hidden="true" />{step.time}</span>}</h3>
      <div className={pb.stepBody}>{step.body}</div>
    </div>
  </li>)}</ol>;
}

/** Messages the owner sends, as outgoing WhatsApp bubbles with a copy button. */
export function Templates({ items }: { items: Array<{ title: string; when: string; text: string }> }) {
  return <div className={pb.templates}>{items.map((item) => <article key={item.title} className={pb.template}>
    <div className={pb.templateHead}>
      <div><h3 className={pb.templateTitle}>{item.title}</h3><p>{item.when}</p></div>
      <CopyButton value={item.text} label={`Copy: ${item.title}`}>Copy</CopyButton>
    </div>
    <p className={pb.bubble}>{item.text}</p>
  </article>)}</div>;
}

/** The agent's instructions as a file to copy. */
export function PromptFile({ name, text }: { name: string; text: string }) {
  return <figure className={pb.file}>
    <figcaption className={pb.fileHead}><span><FileText size={15} aria-hidden="true" />{name}</span><CopyButton value={text} label={`Copy ${name}`}>Copy</CopyButton></figcaption>
    <pre>{text}</pre>
  </figure>;
}

// Blocks for the WhatsApp voice agent industry posts (2026-11-21): a day of calls, one
// sample call turn by turn, and a do / don't list for the rules of a regulated industry.

const callOutcomes = {
  answered: "Answered by the AI",
  checked: "Checked in your system",
  booked: "Booked in your system",
  texted: "Sent a WhatsApp message",
  saved: "Saved for your team",
  team: "Left for your team",
  urgent: "Told to get urgent help",
  called: "AI called the customer",
};
export type CallLogItem = { time: string; direction: "in" | "out"; who: string; said: string; outcome: keyof typeof callOutcomes; result: string };

/** A day of WhatsApp calls, hour by hour: who called (or was called), what they said and what the voice agent did. */
export function CallLog({ items, caption }: { items: CallLogItem[]; caption: string }) {
  return <figure className={pb.timeline}>
    <ol>{items.map((item) => {
      const Icon = item.direction === "in" ? PhoneIncoming : PhoneOutgoing;
      return <li key={`${item.time}-${item.who}`} data-outcome={`call-${item.outcome}`}>
        <span className={pb.time}>{item.time}</span>
        <div className={pb.event}>
          <p className={pb.from}><Icon size={14} aria-hidden="true" />{item.direction === "in" ? "Incoming WhatsApp call" : "Outgoing WhatsApp call"} · {item.who}</p>
          <p className={pb.message}>{item.said}</p>
          <p className={pb.reply}><span className={pb.tag}>{callOutcomes[item.outcome]}</span>{item.result}</p>
        </div>
      </li>;
    })}</ol>
    <figcaption>{caption}</figcaption>
  </figure>;
}

export type CallTurn = { who: "agent" | "caller"; text: string } | { tool: string; text: string };

/** One sample call, turn by turn, with the actions the agent took (API lookups, WhatsApp messages) in between. */
export function CallTranscript({ title, meta, turns, caption }: { title: string; meta: string; turns: CallTurn[]; caption: string }) {
  return <figure className={pb.call}>
    <div className={pb.callHead}>
      <span className={pb.callIcon} aria-hidden="true"><PhoneCall size={18} /></span>
      <div><p className={pb.callTitle}>{title}</p><p className={pb.callMeta}>{meta}</p></div>
    </div>
    <ol className={pb.turns}>{turns.map((turn, i) => "tool" in turn
      ? <li key={`${i}-${turn.tool}`} className={pb.action}><Wrench size={14} aria-hidden="true" /><span><code>{turn.tool}</code>{turn.text}</span></li>
      : <li key={`${i}-${turn.who}`} className={pb.turn} data-who={turn.who}><span className={pb.who}>{turn.who === "agent" ? "AI agent" : "Caller"}</span><p className={pb.said}>{turn.text}</p></li>)}</ol>
    <figcaption>{caption}</figcaption>
  </figure>;
}

/** What to do and what never to do, side by side. */
export function DoDont({ dos, donts, titles = ["Do", "Don’t"] }: { dos: string[]; donts: string[]; titles?: [string, string] }) {
  return <div className={pb.rules}>
    <section className={pb.rulesCol} data-tone="do" aria-label={titles[0]}><h3 className={pb.rulesTitle}>{titles[0]}</h3><ul>{dos.map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul></section>
    <section className={pb.rulesCol} data-tone="dont" aria-label={titles[1]}><h3 className={pb.rulesTitle}>{titles[1]}</h3><ul>{donts.map((item) => <li key={item}><X size={15} aria-hidden="true" />{item}</li>)}</ul></section>
  </div>;
}

/** The voice agent: WhatsApp calls, with a button to the team's WhatsApp. */
export function VoiceCard({ title, body, points, href, label }: { title: string; body: string; points: string[]; href: string; label: string }) {
  return <aside className={pb.voice} aria-label={title}>
    <span className={pb.voiceIcon} aria-hidden="true"><PhoneCall size={22} /></span>
    <div className={pb.voiceText}>
      <p className={pb.voiceTitle}>{title}</p>
      <p>{body}</p>
      <ul>{points.map((point) => <li key={point}><Check size={15} aria-hidden="true" />{point}</li>)}</ul>
      <WhatsAppButton href={href} label={label} />
    </div>
  </aside>;
}
