import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "wati pricing" (60, 6/6 sources), "wati pricing india" (45), "wati
// price", "wati cost", "wati pricing per message"; Search Console also showed
// "wati preise" and the WATI comparison queries. Prices read from
// wati.io/pricing with the Monthly and Annual toggles on `updated` (USD; WATI
// didn't show local prices from the browser used). Message examples use Meta's
// base rates from /blog/whatsapp-business-api-pricing because WATI bills from
// its own rate card. Recheck the plans and bump `updated` when WATI changes them.
const href = "/blog/wati-pricing";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const plans = [
  ["Billed monthly", "$49 a month", "$99 a month", "$249 a month"],
  ["Billed annually", "$39 a month", "$79 a month", "$199 a month"],
  ["Users included", "3, no extra users", "5, then $24 per user a month", "5, then $59 per user a month"],
  ["Broadcasts", "15,000 a month", "Unlimited", "Unlimited, with volume discounts"],
  ["Automation triggers", "1,000 a month", "2,000 a month", "5,000 a month"],
  ["Wati AI credits", "250 a month", "500 a month", "1,500 a month"],
  ["Integrations", "2 commerce or CRM apps", "5, including HubSpot", "Unlimited, including Salesforce"],
  ["API calls", "10,000 a month, no webhooks", "200,000 a month, limited webhooks", "20 million a month"],
  ["Extras", "Omnichannel inbox with WhatsApp Business Calling", "Advanced chatbots, retargeting; Astra AI agents as an add-on", "Multiple numbers, round-robin assignment, success manager"],
];

const extras = [
  ["Message charges", "Per delivered marketing, utility and authentication message, from WATI’s rate card", "Every plan"],
  ["Extra users", "$24 a month on Pro, $59 on Business; Growth can’t add any", "Pro, Business"],
  ["Wati AI credit packs", "From $20 a month", "Past your monthly credits"],
  ["Astra AI agents", "Priced separately, on request", "Pro and up"],
  ["Automation triggers", "From $25 a month", "Past your monthly triggers"],
  ["Extra WhatsApp numbers", "$29 a month per number", "Each number after the first"],
  ["Shopify integration", "$4.99 a month", "Some plans"],
];

const faqs = [
  { q: "How much does WATI cost per month?", a: "WATI's plans are Growth at $49 a month, Pro at $99 and Business at $249 when billed monthly, or $39, $79 and $199 a month billed annually. WhatsApp message charges, extra users and AI add-ons are charged on top." },
  { q: "Does WATI have a free plan?", a: "No. WATI offers a 7-day free trial with no setup fee, then a paid plan. If you need something free for AI replies, Wapzen is free with no cap on AI replies, though it isn't a Business API platform." },
  { q: "Is WATI cheaper billed annually?", a: "Yes, about 20% cheaper: Growth drops from $49 to $39 a month, Pro from $99 to $79 and Business from $249 to $199. Annual plans also include free dedicated onboarding. WATI doesn't refund payments for existing subscriptions or credits if you cancel." },
  { q: "Does WATI charge per message?", a: "Yes. Marketing, utility and authentication messages are charged per delivered message, by the recipient's country, from WATI's rate card, on top of the plan. Service replies are free for the first 1,000 a month per number under Meta's rules, then charged too." },
  { q: "How much does WATI charge for extra users?", a: "Growth includes 3 users and can't add more. Pro includes 5 and charges $24 per extra user a month; Business includes 5 and charges $59 per extra user a month." },
  { q: "Does WATI include AI?", a: "Each plan includes Wati AI credits: 250 a month on Growth, 500 on Pro and 1,500 on Business, with more from $20 a month. Astra, WATI's AI agents for WhatsApp, web and voice, is a separately priced add-on from Pro up." },
  { q: "What is WATI's pricing in India?", a: "WATI's pricing page showed prices in US dollars when we checked: $49, $99 and $249 a month billed monthly. Message charges for Indian numbers follow WATI's rate card; Meta's own India rates are ₹0.8631 per marketing message and ₹0.115 per utility or service message." },
  { q: "What's a free alternative to WATI?", a: "If your main need is AI that answers customers, Wapzen is free: it links your WhatsApp number by QR code and answers chats and calls with AI, with no message fees and no reply cap. For big broadcast campaigns, AiSensy and Interakt are cheaper Business API alternatives." },
];

const sources = [
  { label: "WATI pricing", href: "https://www.wati.io/pricing/" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const sections = [
  {
    id: "plans",
    title: "WATI’s plans and prices",
    body: <>
      <p>WATI sells three plans, priced in US dollars. Annual billing costs about 20% less than monthly. All three run on the official WhatsApp Business API and come with a 7-day free trial and no setup fee.</p>
      <Comparison caption="WATI plans and prices" columns={["Growth", "Pro", "Business"]} rows={plans} />
      <p>Growth suits a small team sending regular broadcasts. Pro is the plan most businesses need once more than three people work the inbox or they want advanced chatbots. Business is for multiple numbers and large teams.</p>
    </>,
  },
  {
    id: "extras",
    title: "What isn’t in the plan price",
    body: <>
      <p>The plan is the fixed part of a WATI bill. These are charged on top:</p>
      <Comparison caption="Costs WATI charges on top of the plan" columns={["Price", "When"]} rows={extras} />
      <p>Message charges are the line that grows. They follow the recipient’s country and the message type, and since 1 October 2026 Meta also charges for service replies beyond 1,000 a month per number, and for utility templates sent inside the 24-hour window. The <Link href="/blog/whatsapp-business-api-pricing">Business API pricing guide</Link> has Meta’s rates by country.</p>
      <Note>WATI bills messages from its own rate card, which can differ from Meta’s base rates. Compare the two before you choose a plan.</Note>
    </>,
  },
  {
    id: "examples",
    title: "Three real monthly bills",
    body: <>
      <p>Worked at Meta’s base rates. WATI’s rate card may be higher.</p>
      <h3>A dental clinic in the US, Growth billed monthly</h3>
      <ul>
        <li>Plan: <strong>$49</strong></li>
        <li>1,000 appointment reminders (utility) × $0.0034 = <strong>$3.40</strong></li>
        <li>3,000 replies to patients, 2,000 past the free tier × $0.0034 = <strong>$6.80</strong></li>
      </ul>
      <p>About <strong>$59 a month</strong>. If AI answers those 3,000 messages, 250 AI credits won’t go far, so add credit packs.</p>
      <h3>An Indian D2C brand, Pro billed annually, 7 users</h3>
      <ul>
        <li>Plan: <strong>$79</strong>, plus 2 extra users × $24 = <strong>$48</strong></li>
        <li>10,000 marketing messages × $0.0118 (₹0.8631) = <strong>$118</strong></li>
        <li>2,000 order updates × $0.0014 (₹0.115) = <strong>$2.80</strong></li>
      </ul>
      <p>About <strong>$248 a month</strong>, before AI beyond 500 credits and any Astra agents.</p>
      <h3>A 10-person support team, Business billed annually</h3>
      <ul>
        <li>Plan: <strong>$199</strong>, plus 5 extra users × $59 = <strong>$295</strong></li>
      </ul>
      <p><strong>$494 a month</strong> before a single message is sent. On Business, seats are often the biggest line.</p>
    </>,
  },
  {
    id: "worth-it",
    title: "Is WATI worth the price?",
    body: <>
      <p>WATI is good at what the Business API is for. It has broadcasts at scale, Click to WhatsApp ads, a shared team inbox with WhatsApp Business Calling, and integrations from Shopify to Salesforce. If those are your core needs, the plan price buys real capability, and the 7-day trial is enough to test it.</p>
      <p>It’s a harder sell when your main need is answering customers. Then you pay for a plan, seats, AI credits and per-message charges to do something an AI agent can do on your existing number for free.</p>
    </>,
  },
  {
    id: "alternatives",
    title: "Cheaper and free alternatives to WATI",
    body: <>
      <ul>
        <li><strong>AiSensy:</strong> a Free Forever plan for API access and Basic at $45 a month, with AI and chatbots as add-ons. See <Link href="/blog/aisensy-vs-interakt">AiSensy vs Interakt</Link>.</li>
        <li><strong>Interakt:</strong> Growth at $55 a month plus taxes, with unlimited agents, strong for Shopify stores.</li>
        <li><strong>Wapzen:</strong> free, with no cap on AI replies and no message fees. It links your number by QR code and answers chats and WhatsApp calls with AI. It isn’t an official API platform, so it doesn’t replace WATI for large broadcasts.</li>
      </ul>
      <p>For a longer list, see <Link href="/blog/wati-alternatives">7 best WATI alternatives</Link> or the head-to-head <Link href="/blog/wapzen-vs-wati">Wapzen vs WATI</Link>.</p>
      <InlineCta title="Answer customers without a WATI bill" body="Wapzen’s AI agent answers your WhatsApp chats and calls on your existing number. Free, no reply cap, no credit card." />
    </>,
  },
];

export default function WatiPricingPage() {
  return <BlogPost
    href={href}
    heading={<>WATI pricing in 2026.<br /><span>What you’ll really pay.</span></>}
    lead="WATI lists three plans from $49 a month, but the plan is only part of the bill. Here are WATI’s current monthly and annual prices, everything charged on top, three worked monthly bills, and when a free tool can do the job instead."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>WATI’s plans:</strong> Growth $49 a month ($39 billed annually), Pro $99 ($79), Business $249 ($199), in US dollars, with a 7-day free trial and no free plan.</>,
        <><strong>On top:</strong> per-message charges from WATI’s rate card, extra users ($24 or $59 each; none on Growth), AI credit packs from $20 a month, and Astra AI agents priced separately.</>,
        <><strong>Free alternative:</strong> if you mostly answer customers, Wapzen’s AI agent is free, with no reply cap and no message fees.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/wati-alternatives", "/blog/wapzen-vs-wati"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>Need AI replies, not a plan?<br /><span>Wapzen is free.</span></>, body: "Link your WhatsApp number with a QR code and let an AI agent answer every chat and call. No Business API, no per-message fees." }}
  />;
}
