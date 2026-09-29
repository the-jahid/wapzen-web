import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { Check, Code2, CreditCard, PhoneCall, Receipt, Sparkles, Wallet } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { freeOffer } from "@/lib/marketingPages";
import { GetStarted } from "@/components/landing/SiteChrome";
import { Cards, Comparison, MarketingPage, Section } from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/Marketing.module.css";

// Targets "is whatsapp chatbot free", "cost of whatsapp chatbot", "whatsapp
// chatbot pricing", "ai calling agent price" (docs/seo-research.md). Wapzen is
// free right now: no billing exists and AI keys are the platform's. Keep every
// claim here in step with the real plan, and update freeOffer with it.
const path = "/pricing";
const title = "Pricing: Free WhatsApp AI Chatbot & AI Calling Agent";
const description = "Wapzen is free: a WhatsApp AI chatbot and AI calling agent with every feature included. No credit card, no AI API keys, and no WhatsApp Business API fees.";

export const metadata: Metadata = pageMetadata({ title, description, path: path });

const included = [
  "WhatsApp AI chatbot with 24/7 auto-reply",
  "AI voice agent that answers WhatsApp calls",
  "Outbound AI calls and calling campaigns",
  "Knowledge bases from text, PDF, and Word files",
  "API request tools for bookings and orders",
  "OpenAI GPT and Anthropic Claude models",
  "Natural voices in dozens of languages",
  "Chat history, call transcripts, and analytics",
  "Personal or Business number, linked by QR code",
];

const costs = [
  { icon: CreditCard, title: "Platform subscription", body: "Most WhatsApp chatbot platforms charge a monthly plan, often tiered by seats, contacts, or conversations. Wapzen is currently $0." },
  { icon: Receipt, title: "Business API message fees", body: "Platforms built on the WhatsApp Business API pass on Meta's per-message charges for template messages. Wapzen links your number by QR code, so there are none." },
  { icon: Sparkles, title: "AI usage", body: "Many tools ask you to bring your own OpenAI key and pay for AI usage separately. Wapzen includes the AI models and the voices." },
  { icon: PhoneCall, title: "Calling minutes", body: "AI phone agents are usually billed per minute, plus a rented phone number. Wapzen's AI calls run over WhatsApp on your own number, with no per-minute charges." },
  { icon: Code2, title: "Setup and development", body: "Custom WhatsApp bots often need a developer to build and host them. Wapzen is no-code: connect your number, configure your agent, and go live." },
  { icon: Wallet, title: "Card and contracts", body: "No credit card to sign up, no contract to sign, and no subscription to cancel." },
];

const comparison = [
  ["Monthly price", "Paid plans, often tiered", "Free right now"],
  ["WhatsApp Business API", "Usually required", "Not needed: link by QR code"],
  ["Per-message fees", "Meta template fees passed on", "None"],
  ["AI models", "Often bring your own API key", "GPT and Claude included"],
  ["AI voice calls on WhatsApp", "Rare, or a paid add-on", "Included, inbound and outbound"],
  ["Credit card to start", "Often required for a trial", "Not required"],
];

const faqs = [
  { q: "Is Wapzen free?", a: "Yes. Wapzen is currently free to use, with every feature included: the WhatsApp AI chatbot, the AI voice agent for inbound and outbound WhatsApp calls, outbound calling campaigns, knowledge bases, and API tools." },
  { q: "Is a WhatsApp chatbot free or paid?", a: "Both exist. The WhatsApp Business app includes free greeting and away messages, but they send fixed text, not AI answers. Most AI chatbot platforms are paid and run on the WhatsApp Business API, which adds Meta's per-message fees. Wapzen gives you an AI chatbot for free, on your existing number." },
  { q: "How much does a WhatsApp chatbot cost?", a: "It depends on the platform: usually a monthly subscription, WhatsApp Business API fees for template messages, and sometimes separate AI usage. With Wapzen the cost is currently $0: no subscription, no Business API fees, and AI usage included." },
  { q: "How much does an AI calling agent cost?", a: "AI calling agents for regular phone lines are usually billed per minute, plus the cost of a phone number. Wapzen's AI calling agent works over WhatsApp calls on your own number and is currently free, with no per-minute charges." },
  { q: "Do I need a credit card or a free trial?", a: "No. There is no card to enter and no trial to start. Sign up and every feature is available right away." },
  { q: "Do I need my own OpenAI or ElevenLabs API key?", a: "No. The AI models for chat and the speech and voices for calls are included, so you don't need to open or pay for your own AI accounts." },
  { q: "Are there WhatsApp Business API fees?", a: "No. Wapzen doesn't use the WhatsApp Business API. You link your personal or WhatsApp Business number by scanning a QR code, like WhatsApp Web, so there are no Business API message fees from Meta." },
  { q: "Will Wapzen always be free?", a: "Wapzen is free right now, with every feature included. If paid plans are introduced in the future, they will be listed on this page." },
];

function PriceCard() {
  return <div className={styles.priceWrap}>
    <div className={styles.priceCard}>
      <div className={styles.priceHead}>
        <span className={styles.planBadge}>Current plan</span>
        <h2 className={styles.planName}>Free</h2>
        <p className={styles.price}><strong>$0</strong><span>per month</span></p>
        <p>Every feature included. No credit card, no API keys, no Business API fees.</p>
        <GetStarted label="Start free" />
      </div>
      <div className={styles.priceList}>
        <span>Everything included</span>
        <ul>{included.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
      </div>
    </div>
  </div>;
}

export default function PricingPage() {
  return <MarketingPage
    path={path}
    name="Pricing"
    title={title}
    description={description}
    eyebrow="Pricing"
    heading={<>Wapzen pricing.<br /><span>Free. Every feature.</span></>}
    lead="Build a WhatsApp AI chatbot and AI calling agent for free. Wapzen is currently free to use: no credit card, no AI API keys to buy, and no WhatsApp Business API fees."
    perks={["$0 per month", "No credit card", "No Business API fees"]}
    secondary={{ href: "/free-whatsapp-chatbot", label: "How to build a free chatbot" }}
    hero={<PriceCard />}
    schema={[{
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.url}/#software`,
      name: siteConfig.name,
      url: siteConfig.url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: freeOffer,
    }]}
    faq={{ heading: <>Pricing questions.<br /><span>Answered.</span></>, items: faqs }}
    cta={{ heading: <>Start free today.<br /><span>No card needed.</span></>, body: "Create your WhatsApp AI chatbot and AI calling agent, connect your number by QR code, and let AI handle your messages and calls." }}
  >
    <Section id="costs" heading={<>What a WhatsApp chatbot costs.<br /><span>And what Wapzen costs.</span></>} intro="A WhatsApp chatbot or AI calling agent usually comes with several bills. Here's where the money typically goes, and what you pay with Wapzen today.">
      <Cards items={costs} />
    </Section>

    <Section id="compare" heading={<>Wapzen vs a typical platform.<br /><span>Side by side.</span></>}>
      <Comparison caption="Wapzen compared with a typical WhatsApp chatbot platform" columns={["Typical WhatsApp chatbot platform", "Wapzen"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
