import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "wati or aisensy" (54), "wati vs aisensy" (50, 5/5), "aisensy vs wati"
// (50, 5/5), "wati vs aisensy which is better" (27), autocomplete 2026-11-05. Search
// Console: "wati vs aisensy" had 45 impressions at 28.4, the largest comparison query,
// all on the three-way post, which this doesn't replace. WATI annual prices, credits,
// users and add-ons read from wati.io/pricing 2026-11-05; WATI's monthly prices and
// AiSensy's plan prices and seats last read 2026-11-02 (those tables load by script);
// AiSensy add-ons and India rates read 2026-11-05. Be fair: AiSensy wins on entry price
// and free plan, WATI on included AI credits and calling.
const href = "/blog/wati-vs-aisensy";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const glance = [
  ["What it is", "Business API platform with an inbox, broadcasts, chatbots and AI agents", "Business API platform for broadcasts, ads and an inbox, with AI and chatbots as add-ons", "AI agents that answer chats and calls on your own number"],
  ["Free option", "7-day free trial", "Free Forever plan (no broadcasts)", "Everything is free right now"],
  ["First paid plan", "Growth: $49 a month, or $39 billed annually", "Basic: $45 a month (₹1,500 in India)", "None"],
  ["Team seats", "Growth 3; Pro and Business 5, then $24 or $59 per user", "Owner + 5 on Basic and Pro, then $20 per seat", "One account; reply from the dashboard"],
  ["AI", "2,000 to 20,000 Wati AI credits a month; 1 Astra agent on Growth, 2 on Pro", "Add-on: $50 a month (₹1,350) for 1,000 AI messages", "AI chat agent included, free"],
  ["Chatbot builder", "Included, with advanced chatbots on Pro", "Add-on: $80 a month (₹2,500) for 5 flows", "AI agent instead of flows"],
  ["WhatsApp calling", "Listed, with no WATI markup on Meta’s rate", "Not listed on the pricing page", "AI voice agent answers and makes calls, free"],
  ["Broadcasts", "15,000 a month on Growth; unlimited on Pro and Business, at message rates", "On paid plans", "Bulk Messages, one at a time with a gap"],
  ["Message charges", "Per message from WATI’s rate card", "Prepaid; in India ₹1.09 marketing, ₹0.145 utility and service", "None"],
  ["Official Meta platform", "Yes", "Yes", "No: links like WhatsApp Web"],
];

const watiPlans = [
  ["Growth", "$49", "$39", "3", "2,000"],
  ["Pro", "$99", "$79", "5", "5,000"],
  ["Business", "$249", "$199", "5", "20,000"],
];

const aisensyPlans = [
  ["Basic", "$45", "Owner + 5"],
  ["Pro", "$99", "Owner + 5"],
  ["Premium", "$299", "Owner + 9"],
  ["Unlimited", "$899", "Fair use"],
];

const faqs = [
  { q: "Which is better, WATI or AiSensy?", a: "AiSensy is better for the lowest entry price, a free plan, and broadcasts or Click to WhatsApp ads as your main use. WATI is better if you want AI credits, chatbots and an AI agent inside the plan, plus WhatsApp calling. The right choice depends on what you'd otherwise pay for as add-ons." },
  { q: "Is AiSensy cheaper than WATI?", a: "On the first plan, slightly: AiSensy Basic is $45 a month and WATI Growth is $49, or $39 billed annually. Once you add AiSensy's chatbot ($80) and AI ($50) add-ons, it can cost more than WATI's Growth plan." },
  { q: "Does WATI or AiSensy have a free plan?", a: "AiSensy has a Free Forever plan with API access and an inbox, but no broadcasts. WATI offers a 7-day free trial rather than a free plan." },
  { q: "Which has better AI, WATI or AiSensy?", a: "WATI includes Wati AI credits and at least one Astra agent on its plans. AiSensy sells an AI agent add-on at $50 a month for 1,000 AI messages, with a knowledge base and tool calling. WATI's page doesn't say how many credits one AI reply uses, so test both with your own volume." },
  { q: "Do WATI and AiSensy charge for WhatsApp messages?", a: "Yes. Both charge per delivered marketing, utility and authentication message, on top of the plan. Service replies are free for the first 1,000 a month per number, then charged as well." },
  { q: "Which one has WhatsApp calling?", a: "WATI lists WhatsApp calling and says it adds no markup to Meta's per-minute rate. AiSensy's pricing page doesn't list it. Wapzen's AI voice agent answers and makes WhatsApp calls itself, free right now." },
  { q: "Is there a free alternative to WATI and AiSensy?", a: "If you mainly need AI to answer customers, yes. Everything in Wapzen is free right now, including the AI chat agent and voice agent, with no message fees, because it links your number by QR code or pairing code instead of using the Business API. For large broadcast campaigns, an API platform is still the better fit." },
];

const sources = [
  { label: "WATI pricing", href: "https://www.wati.io/pricing/" },
  { label: "WATI: WhatsApp Business calling pricing", href: "https://www.wati.io/en/blog/whatsapp-business-calling-pricing/" },
  { label: "AiSensy pricing (USD)", href: "https://aisensy.com/pricing/usd" },
  { label: "AiSensy pricing (India)", href: "https://aisensy.com/pricing" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const sections = [
  {
    id: "at-a-glance",
    title: "WATI vs AiSensy at a glance",
    body: <>
      <p>WATI and AiSensy both put you on the official WhatsApp Business API, with broadcasts and a shared inbox. The main difference is packaging: WATI puts more AI and chatbot features inside its plans, while AiSensy starts cheaper and sells them as add-ons. We added Wapzen as a third column for businesses that mainly want AI to answer customers.</p>
      <Comparison caption="WATI, AiSensy and Wapzen compared" columns={["WATI", "AiSensy", "Wapzen"]} rows={glance} />
    </>,
  },
  {
    id: "pricing",
    title: "Pricing compared",
    body: <>
      <h3>WATI</h3>
      <Comparison caption="WATI plans" columns={["Billed monthly", "Billed annually, per month", "Users", "AI credits a month"]} rows={watiPlans} />
      <p>Growth can’t add users. Add-ons include more AI credits from $20 a month, automation triggers from $25, Shopify at $4.99, and extra numbers at $29 each.</p>
      <h3>AiSensy</h3>
      <Comparison caption="AiSensy plans billed monthly" columns={["A month", "Seats"]} rows={aisensyPlans} />
      <p>In India, Basic is ₹1,500 a month and Pro ₹3,200, plus GST. Quarterly billing saves 5% and yearly 10%. The <strong>chatbot builder</strong> is $80 a month (₹2,500) for 5 flows, and the <strong>AI agent</strong> is $50 a month (₹1,350) for 1,000 AI messages.</p>
      <Note>WATI’s monthly prices and AiSensy’s plan prices were last read on 2 November 2026; the rest on the date at the top of this post. You may see local prices in your country. More detail is in <Link href="/blog/wati-pricing">WATI pricing</Link>.</Note>
    </>,
  },
  {
    id: "monthly-bill",
    title: "What a month actually costs",
    body: <>
      <p>Take an Indian online store with 3 people on the inbox, an AI agent answering about <strong>3,000 messages a month</strong>, and <strong>4,000 marketing messages</strong> in campaigns.</p>
      <h3>On WATI</h3>
      <ul>
        <li>Growth plan: <strong>$49</strong>, with 3 users, an Astra agent and 2,000 AI credits</li>
        <li>Campaigns at Meta’s rate, before any WATI rate-card difference: 4,000 × ₹0.8631 = at least <strong>₹3,452</strong></li>
        <li>Replies past the free 1,000: 2,000 × ₹0.115 = at least <strong>₹230</strong></li>
      </ul>
      <p>About <strong>$49 plus ₹3,682</strong>, plus taxes, and extra credit packs if 3,000 AI replies use more than 2,000 credits.</p>
      <h3>On AiSensy</h3>
      <ul>
        <li>Basic plan: <strong>₹1,500</strong></li>
        <li>AI agent: <strong>₹1,350</strong> for the first 1,000 AI messages; the other 2,000 are charged separately</li>
        <li>Campaigns: 4,000 × ₹1.09 = <strong>₹4,360</strong></li>
        <li>Replies past the free 1,000: 2,000 × ₹0.145 = <strong>₹290</strong></li>
      </ul>
      <p>About <strong>₹7,500</strong> plus GST and the extra AI messages. The two end up close, so your AI volume and team size should decide it, not the headline price.</p>
      <h3>On Wapzen</h3>
      <p>The AI replies cost <strong>₹0</strong>, with no plan and no message fees. Campaigns are where an API platform earns its fee: Wapzen’s Bulk Messages can send them, but one at a time, with a 30-second gap by default and without Meta’s template reporting.</p>
    </>,
  },
  {
    id: "ai",
    title: "Chatbots, AI and calling",
    body: <>
      <p><strong>WATI</strong> includes Astra agents and monthly AI credits on its plans, and advanced chatbots from Pro. It also lists WhatsApp calling: its guide says calling has no setup fee or per-call markup, and usage comes from a prepaid wallet.</p>
      <p><strong>AiSensy</strong> sells two add-ons: a flow builder with cart management and catalog sharing, and an AI agent that answers from a knowledge base and can call tools and APIs. Its pricing page doesn’t list WhatsApp calling. Its Click to WhatsApp ads manager is a strong point for businesses running ads.</p>
      <p><strong>Wapzen</strong> has no flow builder. You instruct an AI agent in plain language, attach your documents, and it answers your chats. Its voice agent answers and makes WhatsApp calls.</p>
    </>,
  },
  {
    id: "verdict",
    title: "Which one should you pick?",
    body: <>
      <Choose items={[
        { name: "WATI", points: ["You want AI and chatbots inside one plan", "You want WhatsApp calling in the inbox", "You’re happy to pay in US dollars"] },
        { name: "AiSensy", points: ["You want a free plan or the lowest entry price", "Broadcasts and Click to WhatsApp ads are your main use", "You’ll buy only the add-ons you need"] },
        { name: "Wapzen", points: ["You mainly need AI to answer customers", "You don’t want plan, AI or message fees", "You want an AI voice agent for WhatsApp calls"] },
      ]} />
      <p>Comparing a third platform? See <Link href="/blog/aisensy-vs-interakt">AiSensy vs Interakt</Link> and <Link href="/blog/wati-vs-aisensy-vs-interakt">WATI vs AiSensy vs Interakt</Link>.</p>
    </>,
  },
  {
    id: "free-option",
    title: "A free option if you mainly need AI replies",
    body: <>
      <p>On both platforms, the bill grows with your plan, add-ons and messages. <strong>Everything in Wapzen is free right now.</strong> It links your existing WhatsApp number, answers chats with an AI agent trained on your documents, takes orders, and handles WhatsApp calls with an AI voice agent.</p>
      <InlineCta title="Answer every customer for free" body="Link your WhatsApp number and let an AI agent reply, with no plan and no per-message fees." />
      <Note>Wapzen isn’t an official Business API platform and has no multi-agent team inbox. If broadcasts to large opted-in lists are central to your business, keep WATI or AiSensy for those and let Wapzen answer the chats.</Note>
    </>,
  },
];

export default function WatiVsAiSensyPage() {
  return <BlogPost
    href={href}
    heading={<>WATI vs AiSensy.<br /><span>Which one fits your business?</span></>}
    lead="Both put you on the official WhatsApp Business API, but they package it differently. We compared their pricing pages on plans, AI, chatbots, seats and calling, then worked out what a real month costs on each."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Pick AiSensy</strong> for the lowest entry price: a Free Forever plan and Basic at $45 a month (₹1,500 in India), with AI ($50) and chatbots ($80) as add-ons.</>,
        <><strong>Pick WATI</strong> for more in one plan: Growth at $49 ($39 billed annually) includes 2,000 AI credits and an Astra agent, and WATI lists WhatsApp calling.</>,
        <><strong>If you mainly need AI replies,</strong> everything in Wapzen is free right now, with no message fees, though it isn’t an official API platform.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/wati-pricing", "/blog/aisensy-vs-interakt"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>Skip the plans and add-ons.<br /><span>Answer customers free.</span></>, body: "Put a free AI agent on your existing WhatsApp number. No Business API, no per-reply charges, no credit card." }}
  />;
}
