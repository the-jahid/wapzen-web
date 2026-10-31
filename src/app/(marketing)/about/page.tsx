import type { Metadata } from "next";
import { BookOpen, Megaphone, MessageCircle, PhoneCall, Scale, Smartphone } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/site";
import { Cards, MarketingPage, Section } from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/Marketing.module.css";

// Says what Wapzen is and how it works. Don't add founders, a company name, a
// location or customer numbers until there are real ones to state.
const path = "/about";
const title = "About Us";
const description = "Wapzen puts AI chat and voice agents on the WhatsApp number a business already uses, with no code and no WhatsApp Business API.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const product = [
  { icon: MessageCircle, title: "AI chat agent", body: "Replies to WhatsApp messages day and night, using the instructions and knowledge you give it." },
  { icon: PhoneCall, title: "AI voice agent", body: "Answers incoming WhatsApp calls and holds a spoken conversation with the caller." },
  { icon: Megaphone, title: "Outbound campaigns", body: "Calls your leads on WhatsApp and shows you how each call went." },
];

const principles = [
  { icon: Smartphone, title: "Your number stays yours", body: "You link the number you already use by QR code or pairing code, and you can disconnect it whenever you want." },
  { icon: BookOpen, title: "Your business, your answers", body: "Agents work from your prompts, knowledge bases and API tools, and you can read every conversation and call transcript." },
  { icon: Scale, title: "Plain about the limits", body: "We say what Wapzen can't do, what the free plan covers, and how your data is handled." },
];

const limits = [
  "Wapzen isn't an official WhatsApp or Meta product, and it isn't affiliated with or endorsed by them. WhatsApp's own terms still apply to your number.",
  "AI calls run over WhatsApp only. Wapzen doesn't dial regular phone numbers.",
  "Booking, order lookups and CRM updates need an API tool connected to your own systems.",
  "AI agents can make mistakes, so review their conversations and give them clear instructions.",
];

const faqs = [
  { q: "What is Wapzen?", a: "Wapzen is a no-code platform that connects AI chat and voice agents to a WhatsApp number, so a business can answer messages and calls around the clock." },
  { q: "Is Wapzen an official WhatsApp product?", a: "No. Wapzen isn't affiliated with or endorsed by WhatsApp or Meta. It links your number as a device, the same way WhatsApp Web does, and doesn't use the WhatsApp Business API." },
  { q: "Is Wapzen free?", a: "Wapzen is free to start, with usage limits on the free plan. If you reach a limit, you can message us on WhatsApp about a paid plan." },
  { q: "How does Wapzen handle my data?", a: "We run your agents through AI and infrastructure providers, and we don't sell personal data. The privacy policy explains what is stored, who processes it, and how to delete it." },
  { q: "How can I contact Wapzen?", a: `Message us on WhatsApp at ${siteConfig.whatsapp.label}.` },
];

export default function AboutPage() {
  return <MarketingPage
    path={path}
    name={title}
    title={title}
    description={description}
    eyebrow="About Wapzen"
    heading={<>AI agents for the WhatsApp number <span>you already use.</span></>}
    lead="Your customers already message and call you on WhatsApp. Wapzen helps your business answer them, even when nobody is free to pick up."
    perks={["Free to start", "No code", "No Business API"]}
    secondary={{ href: "/privacy", label: "How we handle data" }}
    related={["/free-whatsapp-chatbot", "/free-ai-calling-agent"]}
    faq={{ heading: <>Common questions.<br /><span>Short answers.</span></>, items: faqs }}
    cta={{ heading: <>Put an AI agent <span>on your number.</span></>, body: "Link your WhatsApp number, tell your agent about your business, and go live." }}
  >
    <Section id="what" heading={<>What we do.<br /><span>Chat, calls and follow-up.</span></>} intro="Wapzen is a dashboard for building AI agents that work on WhatsApp. You don't need to write code, get API approval or change your number.">
      <Cards items={product} />
    </Section>

    <Section id="how" heading={<>How we work.<br /><span>You stay in charge.</span></>}>
      <Cards items={principles} />
    </Section>

    <Section id="limits" heading={<>What to know.<br /><span>Before you start.</span></>}>
      <div className={styles.legalPlain}><ul>{limits.map((limit) => <li key={limit}>{limit}</li>)}</ul></div>
    </Section>
  </MarketingPage>;
}
