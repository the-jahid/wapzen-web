import type { CSSProperties } from "react";
import Image from "next/image";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ArrowDown, ArrowUpRight, ArrowRight, AudioLines, BookOpen, Building2, CalendarCheck, Check, CheckCheck, Command, FileText, Headphones, MessageCircle, Phone, PhoneIncoming, PhoneOutgoing, Plus, QrCode, Radio, SlidersHorizontal, Sparkles, TrendingUp, Zap } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggleButton } from "@/components/theme/ThemeToggle";
import { ResizableNavbar } from "./ResizableNavbar";
import { HeroNetwork, LandingMotion, PeopleStage } from "./LandingMotion";
import styles from "./CoreLanding.module.css";

const links = [
  { href: "#capabilities", label: "Features" },
  { href: "#workflow", label: "How it works" },
  { href: "#agent-types", label: "Chat + voice" },
  { href: "#faq", label: "FAQ" },
];

function Brand() {
  return <a href="#top" className={styles.brand} aria-label="Wapzen home"><span><BrandMark priority /></span>wapzen<span className={styles.brandDot}>.</span></a>;
}

function GetStarted({ label = "Create your agent", dark = false }: { label?: string; dark?: boolean }) {
  const className = `${styles.button} ${dark ? styles.darkButton : styles.greenButton}`;
  return <>
    <Show when="signed-out"><SignUpButton mode="modal" forceRedirectUrl="/dashboard" signInForceRedirectUrl="/dashboard"><button type="button" className={className}>{label}<ArrowUpRight size={17} /></button></SignUpButton></Show>
    <Show when="signed-in"><a href="/dashboard" className={className}>Open dashboard<ArrowUpRight size={17} /></a></Show>
  </>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className={styles.label}><span />{children}</p>;
}

const bars = [10, 20, 32, 18, 44, 60, 35, 22, 50, 68, 40, 26, 55, 36, 64, 42, 24, 48, 30, 18, 10];
function Waveform() {
  return <div className={styles.waveform} aria-hidden="true">{bars.map((height, i) => <span key={i} style={{ height, "--bar": i } as CSSProperties} />)}</div>;
}

function ChatPreview() {
  return <div className={styles.chatPreview}>
    <div className={styles.previewTop}><span className={styles.miniIcon}><Sparkles size={15} /></span><div>Wapzen assistant<small>Chat agent · Example</small></div><span className={styles.statusDot} /></div>
    <p className={styles.customerBubble}>Hi! Can I book a consultation?</p>
    <p className={styles.agentBubble}>Of course. What day works best for you?<CheckCheck size={13} /></p>
    <div className={styles.typing}><i /><i /><i /><span>Keeping the conversation going</span></div>
  </div>;
}

function VoicePreview() {
  return <div className={styles.voicePreview}><span className={styles.voiceIcon}><AudioLines size={31} strokeWidth={1.5} /></span><Waveform /><span className={styles.previewCaption}>A voice that feels like your business</span><div className={styles.voicePills}><span><ArrowDown size={11} /> Inbound</span><span><ArrowUpRight size={11} /> Outbound</span></div></div>;
}

function KnowledgePreview() {
  return <div className={styles.knowledgePreview}><div className={styles.orbit} /><div className={styles.orbit} /><div className={styles.fileTile}><FileText size={21} /><span>Business guide</span></div><div className={styles.fileTile}><BookOpen size={21} /><span>Your knowledge</span></div><span className={styles.knowledgeHub}><Sparkles size={30} /></span><div className={styles.knowledgeTag}><Check size={13} /> Connected to your agent</div></div>;
}

/*
 * Portrait stage cards (top of Features). Desktop: dx/dy are the final offset
 * from the centre in card widths/heights, two columns either side of the
 * heading; dv is the drift once they have settled. Narrow screens: a row above
 * (my -1) or below (my 1) the heading at column mx, arc lifts the middle card,
 * and `wide` cards are dropped. r0 is the tilt in the starting pile and `at`
 * is when the card leaves it; chips follow a booking from question to confirmation.
 */
type Person = {
  dx: number; dy: number; dv: number; r0: number; at: number;
  mx?: number; my?: number; arc?: number; mr?: number; wide?: true;
  chip?: { side: "start" | "end"; edge: "top" | "bottom"; icon: typeof Check; text: string; at: number };
};
const people: Person[] = [
  { dx: -3.6, dy: -1.05, dv: -0.1, r0: -16, at: 0.42, mx: -1.12, my: -1, mr: -6 },
  { dx: -2.45, dy: -0.56, dv: 0.06, r0: 10, at: 0.34, mx: 0, my: -1, arc: 1, chip: { side: "start", edge: "bottom", icon: MessageCircle, text: "Is Friday available?", at: 0.74 } },
  { dx: -2.45, dy: 0.58, dv: 0.06, r0: -7, at: 0.37, mx: -1.12, my: 1, mr: 6, chip: { side: "start", edge: "top", icon: CheckCheck, text: "Replied just now", at: 0.77 } },
  { dx: -3.52, dy: 1.06, dv: -0.1, r0: 13, at: 0.45, wide: true },
  { dx: 2.45, dy: -0.56, dv: 0.06, r0: -9, at: 0.35, mx: 1.12, my: -1, mr: 6, chip: { side: "end", edge: "bottom", icon: AudioLines, text: "AI voice call · 01:24", at: 0.8 } },
  { dx: 2.45, dy: 0.58, dv: 0.06, r0: 6, at: 0.38, mx: 0, my: 1, arc: 1, chip: { side: "end", edge: "top", icon: CalendarCheck, text: "Booked for Friday", at: 0.83 } },
  { dx: 3.6, dy: -1.05, dv: -0.1, r0: 15, at: 0.43, mx: 1.12, my: 1, mr: -6 },
  { dx: 3.52, dy: 1.06, dv: -0.1, r0: -12, at: 0.46, wide: true },
];

function PeopleCards() {
  return <div className={styles.peopleCards} aria-hidden="true">{people.map((person, i) => {
    const { chip } = person;
    const style = { "--dx": person.dx, "--dy": person.dy, "--dv": person.dv, "--r0": `${person.r0}deg`, "--at": person.at, "--mx": person.mx ?? 0, "--my": person.my ?? 0, "--arc": person.arc ?? 0, "--mr": `${person.mr ?? 0}deg` } as CSSProperties;
    return <div key={i} className={`${styles.person} ${person.wide ? styles.personWide : ""}`} style={style}>
      <Image src={`/landing/people/person-0${i + 1}.jpg`} alt="" width={240} height={300} sizes="(max-width: 860px) 116px, 138px" />
      {chip && <span className={`${styles.personChip} ${styles[chip.side === "start" ? "chipStart" : "chipEnd"]} ${styles[chip.edge === "top" ? "chipTop" : "chipBottom"]}`} style={{ "--ka": chip.at } as CSSProperties}><chip.icon size={13} />{chip.text}</span>}
    </div>;
  })}</div>;
}

const steps = [
  { icon: QrCode, title: "Your number. Connected.", body: "Scan a QR code to connect your existing WhatsApp or WhatsApp Business number. No Business API, no developer setup.", tag: "01 / CONNECT", detail: "WhatsApp number", status: "Connected", visual: "connect" },
  { icon: SlidersHorizontal, title: "An agent that knows you.", body: "Choose an AI chatbot, a voice agent, or both. Add your instructions, knowledge base, and tools to make it your own.", tag: "02 / CONFIGURE", detail: "Business knowledge", status: "Ready to use", visual: "configure" },
  { icon: AudioLines, title: "Let the conversation flow.", body: "Your AI agent answers WhatsApp messages and calls 24/7, or runs an outbound calling campaign. Review every conversation in your dashboard.", tag: "03 / GO LIVE", detail: "Chat + voice agent", status: "Active", visual: "live" },
];

// Each card answers a long-tail search ("whatsapp ai customer service", "whatsapp ai receptionist", "whatsapp ai sales agent", "ai calling agent for real estate").
const useCases = [
  { icon: Headphones, title: "AI customer service on WhatsApp", body: "Answer questions about orders, prices, delivery, and returns instantly, day or night, straight from your knowledge base." },
  { icon: PhoneIncoming, title: "WhatsApp AI receptionist", body: "Pick up every WhatsApp call, share your hours and services, and collect caller details so no customer goes unanswered." },
  { icon: CalendarCheck, title: "Appointment booking", body: "Let customers book, confirm, or reschedule over chat or a call, connected to your own booking system with API tools." },
  { icon: TrendingUp, title: "AI sales agent for leads", body: "Reply to new leads in seconds, answer product questions, and send qualified contacts to your CRM." },
  { icon: PhoneOutgoing, title: "AI outbound calling", body: "Call new leads, send reminders, and follow up with customers through WhatsApp AI calling campaigns." },
  { icon: Building2, title: "Built for every industry", body: "Real estate, clinics, e-commerce, education, restaurants, travel, and local services all use WhatsApp AI agents to reply faster." },
];

export function CoreLanding({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  return <LandingMotion>
    <a href="#main" className={styles.skip}>Skip to content</a>
    <ResizableNavbar brand={<Brand />} links={links} actions={<><ThemeToggleButton /><Show when="signed-out"><SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard"><button className={styles.login} type="button">Log in<ArrowUpRight size={14} /></button></SignInButton></Show><Show when="signed-in"><a href="/dashboard" className={styles.login}>Dashboard</a><UserButton /></Show></>} />
    <main id="main">
      <section className={styles.hero} id="top" aria-labelledby="hero-title">
        <HeroNetwork>
          <svg className={styles.connections} viewBox="0 0 1100 260" fill="none" aria-hidden="true"><path d="M70 145H1030M260 56H350L430 145M235 224H365L442 145M840 55H755L677 145M895 220H745L670 145" /><circle cx="350" cy="56" r="4" /><circle cx="365" cy="224" r="4" /><circle cx="755" cy="55" r="4" /><circle cx="745" cy="220" r="4" /></svg>
          <div className={`${styles.networkTile} ${styles.messageTile}`}><MessageCircle size={34} strokeWidth={1.5} /><span>Chat</span></div>
          <div className={`${styles.networkTile} ${styles.bookTile}`}><BookOpen size={25} strokeWidth={1.5} /></div>
          <div className={`${styles.networkTile} ${styles.audioTile}`}><AudioLines size={31} strokeWidth={1.5} /></div>
          <div className={styles.networkCore}><span className={styles.coreRing}><BrandMark priority /></span><span className={styles.coreSpark}><Sparkles size={16} /></span></div>
          <div className={`${styles.networkTile} ${styles.phoneTile}`}><Phone size={31} strokeWidth={1.5} /><span>Voice</span></div>
          <div className={`${styles.networkTile} ${styles.toolsTile}`}><Zap size={26} strokeWidth={1.5} /></div>
          <div className={`${styles.networkTile} ${styles.checkTile}`}><CheckCheck size={26} strokeWidth={1.5} /></div>
          <span className={styles.networkNote}><span /> One connected workspace</span>
        </HeroNetwork>
        <div className={styles.heroCopy}>
          {/* The kicker carries the search phrase inside the h1; the display line below stays the brand voice. */}
          <h1 id="hero-title"><span className={`${styles.label} ${styles.heroKicker}`}><span />WhatsApp AI chatbot &amp; voice call agent</span>Every conversation.<br /><span>A little more human.</span></h1>
          <p>An AI chatbot that replies to your WhatsApp messages and an AI voice agent that answers WhatsApp calls, 24/7.<br className={styles.desktopBreak} /> Trained on your business. No code. No WhatsApp Business API.</p>
          <div className={styles.heroActions}><GetStarted /><a className={styles.textLink} href="#workflow">See how it works<ArrowRight size={16} /></a></div>
          <p className={styles.heroNote}><Check size={13} /> Your WhatsApp number<Check size={13} /> Your knowledge<Check size={13} /> Your voice</p>
        </div>
        <a href="#capabilities" className={styles.scrollCue}><span>GOOD CONVERSATIONS START HERE</span><ArrowDown size={16} /></a>
      </section>

      <div className={styles.channelStrip}><span>ONE WORKSPACE. EVERY CONVERSATION.</span><div><MessageCircle size={19} /> WhatsApp AI chatbot</div><div><AudioLines size={21} /> AI voice calls</div><div><Radio size={20} /> AI outbound calling</div><div><BookOpen size={19} /> Your knowledge base</div></div>

      <section className={`${styles.section} ${styles.features}`} aria-labelledby="features-title">
        <PeopleStage anchorId="capabilities">
          <PeopleCards />
          <div className={styles.peopleCopy}><span className={styles.peopleMark}><BrandMark /></span><h2 id="features-title">More connection.<br /><span>Less busywork.</span></h2><p>Automate WhatsApp customer service, sales, and bookings.<br className={styles.desktopBreak} /> AI chat and voice agents, in one simple workspace.</p><GetStarted /></div>
        </PeopleStage>
        <div className={styles.bento}>
          <article className={styles.featureCard} data-enter><div className={styles.cardVisual}><ChatPreview /></div><div className={styles.cardCopy}><span className={styles.cardIndex}>01 / AI CHATBOT</span><h3>A WhatsApp AI chatbot.<br />Without the wait.</h3><p>Auto-reply to incoming WhatsApp messages, day and night, with an AI chatbot that knows your business.</p><a href="#agent-types" className={styles.cardLink} aria-label="Explore chat agents"><ArrowUpRight size={19} /></a></div></article>
          <article className={styles.featureCard} data-enter style={{ "--delay": "90ms" } as CSSProperties}><div className={styles.cardVisual}><VoicePreview /></div><div className={styles.cardCopy}><span className={styles.cardIndex}>02 / AI VOICE CALLS</span><h3>WhatsApp AI voice agent.<br />Now out loud.</h3><p>An AI voice agent that answers inbound WhatsApp calls and makes outbound calls in a natural voice.</p><a href="#agent-types" className={styles.cardLink} aria-label="Explore voice agents"><ArrowUpRight size={19} /></a></div></article>
          <article className={styles.featureCard} data-enter style={{ "--delay": "180ms" } as CSSProperties}><div className={styles.cardVisual}><KnowledgePreview /></div><div className={styles.cardCopy}><span className={styles.cardIndex}>03 / KNOWLEDGE BASE</span><h3>Your expertise.<br />In every answer.</h3><p>Train your AI agent on your documents, FAQs, and prices, then connect API tools for bookings and orders.</p><a href="#workflow" className={styles.cardLink} aria-label="Learn how to configure agent knowledge"><ArrowUpRight size={19} /></a></div></article>
          <article className={`${styles.featureCard} ${styles.campaignCard}`} data-enter><div className={styles.cardCopy}><span className={styles.cardIndex}>04 / AI OUTBOUND CALLING</span><h3>Make the first move.</h3><p>Add your leads, assign an AI voice agent, and it calls each one on WhatsApp. Follow every result in campaign analytics.</p><a href="#workflow" className={styles.textLink}>Explore the workflow<ArrowUpRight size={16} /></a></div><div className={styles.campaignPreview}><div className={styles.previewTop}><Radio size={17} /><strong>Outbound campaign</strong><span>Example</span></div>{[["AL", "Alex Lee", "Completed"], ["JM", "Jamie Morgan", "Calling"], ["SK", "Sam Kim", "Queued"]].map(([initials, name, status]) => <div key={name} className={styles.leadRow}><span>{initials}</span><strong>{name}</strong><small>{status === "Completed" ? <Check size={11} /> : <span className={styles.statusDot} />}{status}</small></div>)}</div></article>
          <article className={`${styles.featureCard} ${styles.historyCard}`} id="conversation-history" data-enter><div className={styles.historyVisual}><div><MessageCircle size={18} /><span>Chat conversations</span><Check size={14} /></div><div><Phone size={18} /><span>Call transcripts</span><Check size={14} /></div><div><Radio size={18} /><span>Campaign activity</span><Check size={14} /></div></div><div className={styles.cardCopy}><span className={styles.cardIndex}>05 / VISIBILITY</span><h3>Never lose the thread.</h3><p>Review WhatsApp chat history and AI call transcripts. Give your team the context to follow up.</p></div></article>
        </div>
        <p className={styles.previewDisclaimer}>Illustrative previews. Configure your agents and review real activity in the dashboard.</p>
      </section>

      <section className={styles.workflow} id="workflow" aria-labelledby="workflow-title"><div className={styles.workflowInner}>
        <div className={styles.workflowIntro}><Label>Simple from the start</Label><h2 id="workflow-title">A few steps.<br />A whole new<br /><span>way to connect.</span></h2><p>Create your WhatsApp AI agent in three steps, with no coding. You&apos;re in control at every step.</p><GetStarted /><div className={styles.workflowFoot}><Command size={17} /><span>One dashboard. Everything together.</span></div></div>
        <div className={styles.stepStack}>{steps.map((step, i) => <article key={step.tag} className={styles.stepCard} style={{ "--step": i } as CSSProperties} data-enter><div className={styles.stepTop}><span>{step.tag}</span><step.icon size={22} /></div><div className={styles.stepVisual}>{step.visual === "connect" ? <div className={styles.connectVisual}><MessageCircle size={34} /><span /><div><BrandMark /></div></div> : step.visual === "configure" ? <div className={styles.configureVisual}><span><FileText size={16} /> Business guide <Check size={14} /></span><span><SlidersHorizontal size={16} /> Your instructions <Check size={14} /></span><span><Zap size={16} /> Connected tools <Check size={14} /></span></div> : <Waveform />}</div><div className={styles.stepStatus}><span>{step.detail}</span><span><i />{step.status}</span></div><h3>{step.title}</h3><p>{step.body}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.agents}`} id="agent-types" aria-labelledby="agents-title"><div className={styles.sectionHeading} data-enter><Label>Better together</Label><h2 id="agents-title">AI chatbot. AI voice calls.<br /><span>More ways to be there.</span></h2><p>Start with a WhatsApp AI chatbot. Start with an AI voice agent.<br className={styles.desktopBreak} /> Build the experience your customers need.</p></div><div className={styles.agentGrid}>
        <article className={styles.agentCard} data-enter><span className={styles.agentIcon}><MessageCircle size={28} /></span><span className={styles.cardIndex}>WHATSAPP AI CHATBOT</span><h3>For every<br />“quick question.”</h3><p>An AI chatbot for WhatsApp that auto-replies to customers with answers shaped by your prompts, knowledge, and tools.</p><ul><li><Check size={15} /> AI auto-reply to incoming WhatsApp messages</li><li><Check size={15} /> OpenAI and Anthropic models</li><li><Check size={15} /> Knowledge base and API tools</li><li><Check size={15} /> Saved conversation history</li></ul><GetStarted label="Build a chat agent" dark /></article>
        <article className={`${styles.agentCard} ${styles.voiceAgentCard}`} data-enter style={{ "--delay": "120ms" } as CSSProperties}><span className={styles.agentIcon}><AudioLines size={28} /></span><span className={styles.cardIndex}>WHATSAPP AI VOICE AGENT</span><h3>For moments<br />better spoken.</h3><p>An AI calling agent for inbound WhatsApp calls and outbound campaigns, configured to sound and respond your way.</p><ul><li><Check size={15} /> Answers and makes WhatsApp voice calls</li><li><Check size={15} /> Natural voices in dozens of languages</li><li><Check size={15} /> Real-time answers from your knowledge base</li><li><Check size={15} /> Call history and transcripts</li></ul><GetStarted label="Build a voice agent" /></article>
      </div></section>

      <section className={`${styles.section} ${styles.useCases}`} id="use-cases" aria-labelledby="use-cases-title"><div className={styles.sectionHeading} data-enter><Label>Use cases</Label><h2 id="use-cases-title">One WhatsApp AI agent.<br /><span>Every part of your business.</span></h2><p>From customer service to sales calls, put AI to work on WhatsApp.</p></div><div className={styles.useCaseGrid}>
        {useCases.map((useCase, i) => <article key={useCase.title} className={styles.useCaseCard} data-enter style={{ "--delay": `${(i % 3) * 90}ms` } as CSSProperties}><span className={styles.useCaseIcon}><useCase.icon size={21} strokeWidth={1.7} /></span><h3>{useCase.title}</h3><p>{useCase.body}</p></article>)}
      </div></section>

      <section className={`${styles.section} ${styles.faq}`} id="faq" aria-labelledby="faq-title"><div data-enter><Label>A little more clarity</Label><h2 id="faq-title">Good questions.<br /><span>Clear answers.</span></h2><p>Everything you need to know about<br />WhatsApp AI chatbots and AI voice calls.</p><a href="https://wa.me/8801701750469" target="_blank" rel="noopener noreferrer" className={styles.textLink}>Let&apos;s talk on WhatsApp<ArrowUpRight size={16} /></a></div><div className={styles.faqList} data-enter>{faqs.map((faq, i) => <details key={faq.q} className={styles.faqItem}><summary><span className={styles.faqNumber}>{String(i + 1).padStart(2, "0")}</span>{faq.q}<Plus size={18} /></summary><p>{faq.a}</p></details>)}</div></section>

      <section className={styles.cta} id="get-started" aria-labelledby="cta-title" data-enter><div className={styles.ctaDecoration} aria-hidden="true"><MessageCircle /><AudioLines /><Sparkles /></div><Label>Your next conversation starts here</Label><h2 id="cta-title">A little AI.<br />A lot more possibility.</h2><p>Give your WhatsApp an AI chatbot and voice agent of its own.</p><GetStarted label="Let’s get started" dark /><span className={styles.ctaNote}>Chat. Voice. And whatever comes next.</span></section>
    </main>
    <footer className={styles.footer}><div className={styles.footerTop}><div><Brand /><p>WhatsApp AI chatbots and voice call agents.<br />Powered by your business.</p></div><nav aria-label="Product"><span>PRODUCT</span><a href="#capabilities">Features</a><a href="#agent-types">WhatsApp AI chatbot + voice agent</a><a href="#use-cases">Use cases</a><a href="#workflow">How it works</a></nav><nav aria-label="Resources"><span>EXPLORE</span><a href="#faq">Frequently asked questions</a><a href="#conversation-history">Conversation history</a><a href="#get-started">Get started</a></nav><div className={styles.footerContact}><span>LET&apos;S CONNECT</span><a href="https://wa.me/8801701750469" target="_blank" rel="noopener noreferrer">Say hello<ArrowUpRight size={19} /></a><small>+880 1701 750469</small></div></div><div className={styles.footerBottom}><span>© {new Date().getFullYear()} Wapzen. All rights reserved.</span><span><span className={styles.statusDot} /> Built for better conversations</span><a href="#top">Back to top ↑</a></div></footer>
    <a className={styles.contactBubble} href="https://wa.me/8801701750469" target="_blank" rel="noopener noreferrer" aria-label="Chat with Wapzen on WhatsApp"><MessageCircle size={23} /></a>
  </LandingMotion>;
}
