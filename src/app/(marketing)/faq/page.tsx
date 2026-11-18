import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { alternatives, factsCheckedLabel, industryGuides, keyFacts, notIncluded, wapzenFaqs, whoFor } from "@/lib/wapzenFacts";
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
const description = "Straight answers about Wapzen: what it costs, how it links to WhatsApp without the Business API, which AI it uses, and what it can and can't do.";

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
    perks={["Fully free", "No credit card", "No Business API"]}
    secondary={{ href: "/free-whatsapp-chatbot", label: "See how to set it up" }}
    related={["/whatsapp-business-api-alternative", "/whatsapp-auto-reply"]}
    faq={{ heading: <>Questions people ask.<br /><span>Short answers.</span></>, items: wapzenFaqs }}
    cta={{ heading: <>Try it on <span>your own number.</span></>, body: "Link your WhatsApp number, tell the agent about your business, and switch it on. Fully free, no credit card." }}
  >
    <Section id="at-a-glance" heading={<>Wapzen at a glance.<br /><span>The key facts.</span></>}>
      <div className={faq.wrap}>
        <table className={faq.facts}>
          <caption className={tools.srOnly}>Key facts about Wapzen</caption>
          <tbody>{keyFacts.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody>
        </table>
      </div>
    </Section>

    <Section id="who-for" heading={<>Who it&apos;s for.<br /><span>And who should pick something else.</span></>}>
      <div className={styles.legalPlain}>
        <h3 className={faq.subhead}>Wapzen fits</h3>
        <ul>{whoFor.fits.map((item) => <li key={item}>{item}</li>)}</ul>
        <h3 className={faq.subhead}>Pick something else for</h3>
        <ul>{whoFor.notFor.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </Section>

    <Section id="compared" heading={<>How Wapzen compares.<br /><span>Other ways to do the job.</span></>} intro="Each comparison links to a full post with dated prices and sources.">
      <div className={faq.wrap}>
        <table className={faq.facts}>
          <caption className={tools.srOnly}>Wapzen compared with other WhatsApp AI and messaging options</caption>
          <tbody>{alternatives.map((item) => <tr key={item.name}>
            <th scope="row">{item.href ? <Link href={item.href}>{item.name}</Link> : item.name}</th>
            <td>{item.what} {item.pick}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </Section>

    <Section id="not-included" heading={<>What Wapzen doesn&apos;t do.<br /><span>Before you start.</span></>}>
      <div className={styles.legalPlain}><ul>{notIncluded.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </Section>

    <Section id="guides" heading={<>Worked examples.<br /><span>By industry.</span></>}>
      <div className={faq.wrap}>
        <table className={faq.facts}>
          <caption className={tools.srOnly}>Wapzen guides by industry</caption>
          <tbody>{industryGuides.map(([name, href, about]) => <tr key={href}><th scope="row"><Link href={href}>{name}</Link></th><td>{about.charAt(0).toUpperCase() + about.slice(1)}.</td></tr>)}</tbody>
        </table>
      </div>
    </Section>
  </MarketingPage>;
}
