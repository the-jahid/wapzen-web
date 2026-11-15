import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { factsCheckedLabel, keyFacts, notIncluded, wapzenFaqs } from "@/lib/wapzenFacts";
import { MarketingPage, Section } from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/Marketing.module.css";
import tools from "@/components/free-tools/FreeTools.module.css";
import faq from "./faq.module.css";

// Straight answers about Wapzen itself, for people and the AI assistants that
// answer them. The text lives in lib/wapzenFacts.ts, shared with /llms-full.txt.
// Deliberately not in marketingPages (that would add it to every page's footer);
// the sitemap lists it by hand.
const path = "/faq";
const title = "FAQ: Pricing, Setup, Safety and Limits";
const description = "Straight answers about Wapzen: what it costs, how it links to WhatsApp without the Business API, which AI it uses, what it can and can't do, and ban risk.";

export const metadata: Metadata = pageMetadata({ title, description, path });

export default function FaqPage() {
  return <MarketingPage
    path={path}
    name="FAQ"
    title={title}
    description={description}
    eyebrow="Wapzen FAQ"
    heading={<>Wapzen, <span>in straight answers.</span></>}
    lead={`What people ask about Wapzen before they sign up: price, setup, safety, the AI behind it and what it doesn't do. Checked against the product on ${factsCheckedLabel}.`}
    perks={["Free to start", "No credit card", "No Business API"]}
    secondary={{ href: "/free-whatsapp-chatbot", label: "See how to set it up" }}
    related={["/whatsapp-business-api-alternative", "/whatsapp-auto-reply"]}
    faq={{ heading: <>Questions people ask.<br /><span>Short answers.</span></>, items: wapzenFaqs }}
    cta={{ heading: <>Try it on <span>your own number.</span></>, body: "Link your WhatsApp number, tell the agent about your business, and switch it on. Free to start, no credit card." }}
  >
    <Section id="at-a-glance" heading={<>Wapzen at a glance.<br /><span>The key facts.</span></>}>
      <div className={faq.wrap}>
        <table className={faq.facts}>
          <caption className={tools.srOnly}>Key facts about Wapzen</caption>
          <tbody>{keyFacts.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody>
        </table>
      </div>
    </Section>

    <Section id="not-included" heading={<>What Wapzen doesn&apos;t do.<br /><span>Before you start.</span></>}>
      <div className={styles.legalPlain}><ul>{notIncluded.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </Section>
  </MarketingPage>;
}
