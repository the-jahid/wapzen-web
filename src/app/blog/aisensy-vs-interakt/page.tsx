import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "aisensy vs interakt" (60, 6/6 sources), "interakt vs aisensy",
// "aisensy pricing" (60), "interakt pricing" (60), "aisensy alternative" (50),
// "interakt alternative" (50), autocomplete 2026-11-02. Search Console had
// 17 impressions for "aisensy vs interakt" at position ~24, all landing on the
// three-way post, which this one doesn't replace. AiSensy facts: its USD page
// (aisensy.com/pricing/usd) and INR add-on and per-message rates on
// `updated`; INR plan prices last read 2026-10-25. Interakt facts:
// interakt.shop/pricing and /pricing-us the same day. Be fair: AiSensy wins
// on entry price, Interakt on seats, Shopify and calling.
const href = "/blog/aisensy-vs-interakt";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const glance = [
  ["What it is", "Business API platform for broadcasts, ads and a team inbox, with AI and chatbots as add-ons", "Business API platform for selling: campaigns, inbox, catalog, payments, Shopify", "AI agent that answers chats and calls on your own number"],
  ["Free option", "Free Forever plan (no broadcasts)", "Free trial", "Free right now"],
  ["First paid plan", "Basic: $45 a month (₹1,500 in India)", "Growth: $55 a month + taxes", "None"],
  ["Team seats", "Owner + 5 agents on Basic and Pro; $20 per extra seat", "Unlimited agents on every plan", "One account; reply from the dashboard"],
  ["Chatbot builder", "Add-on: $80 a month (₹2,500) for 5 flows", "Linear bot on Growth; branching with API calls on Advanced", "AI agent instead of flows"],
  ["AI agent", "Add-on: $50 a month (₹1,350) with 1,000 AI messages", "Add-on: $74.99 a month (₹2,499 in India) with 100 AI messages, then $0.011 each", "Included, no cap on AI replies"],
  ["WhatsApp calling", "Not listed on the pricing page", "Inbox calling on Advanced; your team answers", "AI voice agent answers and makes calls"],
  ["Broadcasts", "On paid plans, 40 messages a second on Basic", "Campaigns on every plan", "Bulk Messages, one at a time with a gap"],
  ["Shopify", "Shopify and WooCommerce notifications on Basic", "Order updates, abandoned checkout, COD-to-prepaid and winback flows", "No app; connect through API tools"],
  ["Message charges", "Prepaid per message; in India ₹1.09 marketing, ₹0.145 utility and service", "Templates above the free limit; no markup on Enterprise", "None"],
  ["Official Meta platform", "Yes", "Yes", "No: links like WhatsApp Web"],
];

const faqs = [
  { q: "Which is better, AiSensy or Interakt?", a: "AiSensy is better if you want the cheapest way onto the Business API, a free plan to start with, and broadcasts as your main use. Interakt is better for Shopify stores and larger teams, with unlimited agents on every plan, COD-to-prepaid flows and WhatsApp calling from the inbox on Advanced." },
  { q: "Is AiSensy cheaper than Interakt?", a: "On the plan price, yes: AiSensy Basic is $45 a month (₹1,500 in India) against Interakt Growth at $55 plus taxes. AiSensy's AI agent add-on is also cheaper per message. Interakt can work out cheaper for teams, because its plans include unlimited agents while AiSensy charges $20 per seat after five." },
  { q: "Does AiSensy have a free plan?", a: "Yes. AiSensy's Free Forever plan gets you the WhatsApp Business API on your number, a Blue Tick application, sign-up credits and the live chat inbox. It doesn't include broadcasts, and message charges still apply past the free tier." },
  { q: "Does Interakt have a free plan?", a: "Interakt offers a free trial rather than a free plan. Its WhatsApp plans start with Growth at $55 a month plus taxes, with 8% off quarterly and 20% off yearly billing." },
  { q: "How much do AI agents cost on AiSensy and Interakt?", a: "AiSensy's AI chat agent is $50 a month (₹1,350 in India) for 1,000 AI messages. Interakt's WhatsApp AI agents cost $74.99 a month (₹2,499 in India) with 100 AI messages, then $0.011 per message, and need the Growth or Advanced plan. WhatsApp's message charges apply on top of both." },
  { q: "Which one has WhatsApp calling?", a: "Interakt's Advanced plan lists outbound calling from the inbox and receiving inbound calls, answered by your team. AiSensy's pricing page doesn't list WhatsApp calling. Wapzen's AI voice agent answers and makes WhatsApp calls by itself." },
  { q: "Is there a free alternative to AiSensy and Interakt?", a: "If you mainly need AI to answer customers, yes: Wapzen is free, with no cap on AI replies and no message fees, because it links your number by QR code instead of using the Business API. For large broadcast campaigns and a team inbox, an API platform is still the better fit." },
];

const sources = [
  { label: "AiSensy pricing (USD)", href: "https://aisensy.com/pricing/usd" },
  { label: "AiSensy pricing (India)", href: "https://aisensy.com/pricing" },
  { label: "Interakt pricing", href: "https://www.interakt.shop/pricing/" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const sections = [
  {
    id: "at-a-glance",
    title: "AiSensy vs Interakt at a glance",
    body: <>
      <p>AiSensy and Interakt are two of the most used WhatsApp Business API platforms in India. Both give you the official API, broadcasts, a shared inbox and Shopify features. They differ in how they charge for seats, chatbots and AI, and in who they’re built for. We added Wapzen as a third column, for businesses whose main need is AI that answers customers.</p>
      <Comparison caption="AiSensy, Interakt and Wapzen compared" columns={["AiSensy", "Interakt", "Wapzen"]} rows={glance} />
    </>,
  },
  {
    id: "pricing",
    title: "Pricing compared",
    body: <>
      <h3>AiSensy</h3>
      <p>AiSensy starts with a <strong>Free Forever</strong> plan that gets you the API, a Blue Tick application and the live chat inbox, but no broadcasts. Paid plans, billed monthly on its USD page, are <strong>Basic at $45</strong>, <strong>Pro at $99</strong>, <strong>Premium at $299</strong> and <strong>Unlimited at $899</strong>, with 5% off quarterly and 10% off yearly billing. In India, Basic is ₹1,500 a month and Pro ₹3,200, plus GST.</p>
      <p>Basic and Pro include the owner plus 5 agent logins; Premium includes 9; each extra seat is $20 a month. Chatbots and AI are sold separately on every plan: the <strong>drag-and-drop chatbot builder</strong> is $80 a month (₹2,500) for 5 flows, and the <strong>AI chat agent</strong> is $50 a month (₹1,350) for 1,000 AI messages.</p>
      <p>Messages are prepaid. For Indian numbers from 1 October 2026, AiSensy lists <strong>₹1.09 per marketing message</strong> and <strong>₹0.145 per utility, authentication or service message</strong>, against Meta’s own ₹0.8631 and ₹0.115.</p>
      <h3>Interakt</h3>
      <p>Interakt’s WhatsApp plans are <strong>Growth at $55 a month</strong> and <strong>Advanced at $69 a month</strong>, plus taxes, with 8% off quarterly and 20% off yearly billing. A Starter plan is sold quarterly, and <strong>Enterprise</strong> is priced on request and is the plan that lists no markup on messages. Every plan includes <strong>unlimited agents</strong>.</p>
      <p><strong>WhatsApp AI agents</strong> are an add-on for Growth and Advanced: $74.99 a month ($224.99 a quarter), or ₹2,499 a month in India, with <strong>100 AI messages</strong> included and <strong>$0.011 per AI message</strong> after that. Template charges above the free limit come on top.</p>
      <Note>Prices are from AiSensy’s and Interakt’s pricing pages on the date at the top of this post; AiSensy’s rupee plan prices were last read in late October 2026. You may see local prices in your country.</Note>
    </>,
  },
  {
    id: "monthly-bill",
    title: "What a month actually costs",
    body: <>
      <p>Plan prices don’t tell you much on their own. Take an Indian online store with 3 people on the inbox, an AI agent answering about <strong>3,000 messages a month</strong>, and two campaigns to 2,000 customers (<strong>4,000 marketing messages</strong>).</p>
      <h3>On AiSensy</h3>
      <ul>
        <li>Basic plan, which covers 3 seats: <strong>₹1,500</strong></li>
        <li>AI agent: <strong>₹1,350</strong> for the first 1,000 AI messages; the other 2,000 are charged separately</li>
        <li>Campaigns: 4,000 × ₹1.09 = <strong>₹4,360</strong></li>
        <li>AI replies past the free 1,000 service messages: 2,000 × ₹0.145 = <strong>₹290</strong></li>
      </ul>
      <p>About <strong>₹7,500 a month</strong> plus GST and the extra AI messages.</p>
      <h3>On Interakt</h3>
      <ul>
        <li>Growth plan: <strong>$55</strong> plus taxes</li>
        <li>AI agents: <strong>₹2,499</strong> including 100 AI messages, then 2,900 × $0.011 = <strong>$31.90</strong></li>
        <li>Campaigns at Meta’s rate before Interakt’s markup: 4,000 × ₹0.8631 = at least <strong>₹3,452</strong></li>
        <li>AI replies past the free 1,000: 2,000 × ₹0.115 = at least <strong>₹230</strong></li>
      </ul>
      <p>About <strong>$87 plus ₹6,181 a month</strong>, plus taxes and Interakt’s message markup. Interakt costs more here because its AI add-on includes far fewer messages. With a bigger team, its unlimited seats close the gap.</p>
      <h3>On Wapzen</h3>
      <p>The 3,000 AI replies cost <strong>₹0</strong>: no plan, no AI quota and no message fees. The campaigns are where an API platform earns its fee. Wapzen’s Bulk Messages can send them, but at one message every 30 seconds by default and without Meta’s template reporting.</p>
    </>,
  },
  {
    id: "ai",
    title: "Chatbots and AI agents",
    body: <>
      <p><strong>AiSensy</strong> sells two separate add-ons. The chatbot builder makes keyword and button flows with cart management and catalog sharing. The AI agent builder answers in natural language from a knowledge base, keeps long-term memory of each user, can call tools and APIs, and includes 500 free AI messages for testing. It’s capable, as long as you budget for both add-ons.</p>
      <p><strong>Interakt</strong> includes a basic linear chatbot on Growth and branching chatbots that can call APIs on Advanced. Its AI add-on gives you three ready-made agents, for Sales, Lead Qualification and Customer Support, all running at once. With 100 AI messages included, a busy store will mostly pay the per-message rate.</p>
      <p><strong>Wapzen</strong> has no flow builder. You instruct one AI agent in plain language, attach your documents, and it answers every chat with no message quota. See the <Link href="/blog/free-whatsapp-ai-agent">free WhatsApp AI agent guide</Link>.</p>
    </>,
  },
  {
    id: "team-calls-shopify",
    title: "Team seats, calling and Shopify",
    body: <>
      <ul>
        <li><strong>Team:</strong> Interakt includes unlimited agents on every plan. AiSensy includes 5 on Basic and Pro and charges $20 for each extra seat, so ten agent logins add $100 a month on AiSensy.</li>
        <li><strong>Calling:</strong> Interakt’s Advanced plan lists outbound calling from the inbox and inbound call reception, handled by your team. AiSensy’s pricing page lists no WhatsApp calling.</li>
        <li><strong>Shopify:</strong> both send order and abandoned-cart messages. Interakt goes further for D2C stores, with COD-to-prepaid and winback flows, catalog auto-sync and WhatsApp Pay from Growth.</li>
        <li><strong>Ads:</strong> AiSensy’s Click to WhatsApp ads manager is on every plan, even Free Forever, with 1,000 free ad credits.</li>
      </ul>
    </>,
  },
  {
    id: "verdict",
    title: "Which one should you pick?",
    body: <>
      <Choose items={[
        { name: "AiSensy", points: ["You want the lowest price onto the official API", "Broadcasts and Click to WhatsApp ads are your main use", "Your inbox team is five people or fewer"] },
        { name: "Interakt", points: ["You run a Shopify store and want COD-to-prepaid flows", "Many people work the inbox", "Your team takes WhatsApp calls from the inbox"] },
        { name: "Wapzen", points: ["You mainly need AI to answer customers", "You don’t want to pay per AI reply or per message", "You want an AI voice agent for WhatsApp calls"] },
      ]} />
      <p>Comparing a third platform? See <Link href="/blog/wati-vs-aisensy-vs-interakt">WATI vs AiSensy vs Interakt</Link> and <Link href="/blog/wati-pricing">WATI pricing</Link>.</p>
    </>,
  },
  {
    id: "free-option",
    title: "A free option if you mainly need AI replies",
    body: <>
      <p>Look again at the bills above: the AI add-ons and per-reply charges grow with every customer you serve. Wapzen takes that line to zero. It links your existing WhatsApp number by QR code, answers every chat with an AI agent trained on your documents, takes orders, and answers WhatsApp calls with an AI voice agent, all free, with no cap on AI replies.</p>
      <InlineCta title="Answer every customer for free" body="Link your WhatsApp number and let an AI agent reply, with no AI quota and no per-message fees." />
      <Note>Wapzen isn’t an official Business API platform and has no multi-agent team inbox. If broadcasts to large opted-in lists are central to your business, keep AiSensy or Interakt for those and let Wapzen answer the chats.</Note>
    </>,
  },
];

export default function AiSensyVsInteraktPage() {
  return <BlogPost
    href={href}
    heading={<>AiSensy vs Interakt.<br /><span>Which one fits your business?</span></>}
    lead="Both are popular WhatsApp Business API platforms in India, and both look cheap until you add AI, chatbots and message charges. We compared their current pricing pages line by line, covering plans, AI agent add-ons, team seats, calling and Shopify, and worked out what a real month costs."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Pick AiSensy</strong> for the lowest entry price: a Free Forever plan, Basic at $45 a month (₹1,500 in India), and AI ($50 for 1,000 AI messages) and chatbots ($80) as add-ons.</>,
        <><strong>Pick Interakt</strong> for Shopify and bigger teams: unlimited agents from Growth ($55 plus taxes), COD-to-prepaid flows, and WhatsApp calling on Advanced ($69).</>,
        <><strong>If you mainly need AI replies,</strong> Wapzen is free, with no cap on AI replies and no message fees, but it isn’t an official API platform.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/wati-vs-aisensy-vs-interakt", "/blog/wati-pricing"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>Skip the AI add-on.<br /><span>Answer customers free.</span></>, body: "Put a free AI agent on your existing WhatsApp number with a QR code. No Business API, no per-reply charges, no credit card." }}
  />;
}
