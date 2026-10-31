import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, Note } from "@/components/blog/BlogPost";

// Targets "wati vs aisensy", "aisensy vs interakt", "interakt vs wati",
// "aisensy vs interakt vs wati", "... which is better" (autocomplete,
// 2026-10-25). Prices come from each vendor's pricing page on the date in
// lib/blogPosts.ts. Wapzen is the fourth column, not the subject: say plainly
// that it doesn't do broadcasts.
const href = "/blog/wati-vs-aisensy-vs-interakt";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const comparison = [
  ["Starting price", "$39/mo, billed annually", "Free plan; Basic ₹1,500/mo", "Growth $55/mo + taxes", "Free right now"],
  ["Trial", "7 days", "Free Forever plan", "Free trial", "No trial needed"],
  ["Users", "3 on Growth, 5 on Pro", "Unlimited (fair use)", "Unlimited agents", "One account"],
  ["Chatbot builder", "Included; advanced on Pro", "Add-on, ₹2,500/mo", "Linear on Growth, branching on Advanced", "AI agent instead of flows"],
  ["AI agents", "Astra (add-on)", "Add-on, ₹1,350/mo", "Add-on", "Included"],
  ["WhatsApp calls", "Business Calling, Astra voice AI", "Not listed", "Advanced plan", "AI voice agent, included"],
  ["Broadcasts", "15k/mo on Growth, unlimited on Pro", "Yes, with speed by plan", "Campaigns from Growth", "No"],
  ["Message fees", "WATI rate card", "Prepaid, per delivered message", "Templates above free limit", "None"],
  ["Business API", "Yes", "Yes", "Yes", "Not needed: QR code"],
];

const faqs = [
  { q: "Which is better, WATI or AiSensy?", a: "WATI is the stronger all-rounder for growing teams, with a polished inbox, CRM integrations, and AI agents that can take WhatsApp calls. AiSensy is cheaper to start, with a free plan and unlimited users, and is strong at broadcasts, but its chatbot and AI agent builders are paid add-ons." },
  { q: "Which is cheaper, AiSensy or Interakt?", a: "AiSensy is cheaper to start: it has a Free Forever plan and paid plans from ₹1,500 a month, while Interakt's WhatsApp plans start at $55 a month. Add-ons change the picture, though. Price the chatbot, AI agents, and per-message charges you'll actually use on each." },
  { q: "Is Interakt better than WATI?", a: "For selling on WhatsApp with catalogs, payments, and Shopify, and for unlimited agents, Interakt is often the better value. WATI has more integrations on higher plans, such as HubSpot and Salesforce, and a broader AI offer with Astra, including voice agents." },
  { q: "Do WATI, AiSensy, and Interakt all use the WhatsApp Business API?", a: "Yes. All three are platforms built on Meta's WhatsApp Business Platform, so message templates need Meta's approval and WhatsApp's per-message charges apply to templates on top of each plan." },
  { q: "Is there a free alternative to WATI, AiSensy, and Interakt?", a: "If your goal is AI that answers customer messages and calls rather than broadcasts, Wapzen is currently free. It runs an AI chatbot and AI voice agent on your existing WhatsApp number, linked by QR code, without the Business API or per-message fees." },
];

const sources = [
  { label: "WATI pricing", href: "https://www.wati.io/pricing/" },
  { label: "WATI: Astra voice AI agent for WhatsApp calling", href: "https://support.wati.io/en/articles/13193217-how-to-enable-astra-voice-ai-agent-for-whatsapp-calling-in-wati" },
  { label: "AiSensy pricing", href: "https://aisensy.com/pricing" },
  { label: "Interakt pricing", href: "https://www.interakt.shop/pricing/" },
];

const sections = [
  {
    id: "at-a-glance",
    title: "WATI vs AiSensy vs Interakt at a glance",
    body: <>
      <p>All three are WhatsApp Business API platforms with a shared inbox, broadcasts, and chatbots, and all three are especially popular with businesses in India. Where they differ is in price, how much AI is included, and calling. We’ve added Wapzen as a fourth column for readers whose real goal is AI that answers, not campaigns.</p>
      <Comparison caption="WATI, AiSensy, and Interakt compared, with Wapzen" columns={["WATI", "AiSensy", "Interakt", "Wapzen"]} rows={comparison} />
      <Note>WATI lists prices in US dollars, AiSensy in rupees, and Interakt’s pricing page showed us US dollar prices plus taxes; you may see local pricing in your country.</Note>
    </>,
  },
  {
    id: "pricing",
    title: "Pricing compared",
    body: <>
      <h3>WATI</h3>
      <p>Growth is $39 a month and Pro $79 a month, billed annually, with Business on request. Growth includes 3 users and can’t add more; Pro includes 5 and charges $24 per extra user a month. AI Co-pilot credits are included (250 or 500 a month), and Astra AI agents are priced separately.</p>
      <h3>AiSensy</h3>
      <p>AiSensy has a Free Forever plan, then Basic at ₹1,500 a month, Pro at ₹3,200, Premium at ₹9,100, and Unlimited at ₹45,000, with 5% off quarterly and 10% off yearly billing. Users are unlimited under fair use. The drag-and-drop chatbot builder (₹2,500 a month for 5 chatbots) and the WhatsApp AI agent builder (₹1,350 a month with 1,000 AI messages) are charged on top of any plan.</p>
      <h3>Interakt</h3>
      <p>Interakt’s WhatsApp plans are Growth at $55 a month and Advanced at $69 a month, plus taxes, with unlimited agents and savings of 8% quarterly or 20% yearly. Enterprise is on request and lists no markup on templates. WhatsApp AI agents are an add-on for Growth and Advanced.</p>
      <h3>The part every plan adds: message charges</h3>
      <p>On all three, WhatsApp’s per-message charges for templates come on top of the plan, priced by country and message type. For scale: AiSensy lists ₹1.09 per marketing message for Indian users from 1 October 2026, so a 10,000-message campaign costs about ₹10,900 in message charges alone. Compare these rates, not just plan prices, if you broadcast often.</p>
    </>,
  },
  {
    id: "ai",
    title: "Chatbots and AI agents",
    body: <>
      <p><strong>WATI</strong> includes its chatbot builder in every plan, with advanced chatbots, forms, and integrations on Pro. AI Co-pilot helps your team reply, and Astra lets you create AI agents in plain language and deploy them on WhatsApp.</p>
      <p><strong>AiSensy</strong> sells chatbots and AI separately from the platform plan. Its AI agent builder answers from a knowledge base, keeps long-term user memory, and can call tools and APIs, which makes it capable, as long as you budget for it.</p>
      <p><strong>Interakt</strong> includes a basic linear chatbot on Growth and branching flows with API calls on Advanced. Its AI agents, offered as Sales, Lead Qualification, and Customer Support agents, are an add-on.</p>
      <p>On all three, AI is something you add to a messaging platform. If AI answers are the whole point, Wapzen includes an AI agent with your choice of GPT or Claude, trained on your own documents, at no cost. See <Link href="/whatsapp-ai-customer-service">WhatsApp AI customer service</Link> for how that works.</p>
    </>,
  },
  {
    id: "calling",
    title: "WhatsApp calling",
    body: <>
      <p>Calling is where the three differ most.</p>
      <ul>
        <li><strong>WATI</strong> lists WhatsApp Business Calling in its inbox, and Astra can run voice AI agents that answer and start WhatsApp calls.</li>
        <li><strong>Interakt</strong> adds outbound calling from the inbox and inbound call reception on its Advanced plan, for your team to take calls.</li>
        <li><strong>AiSensy</strong> doesn’t list calling on its pricing page.</li>
      </ul>
      <p>Wapzen includes an AI voice agent on every account. It answers incoming WhatsApp calls on your number 24/7, calls leads back, and runs outbound calling campaigns, with transcripts in the dashboard. It’s a good fit for an <Link href="/ai-receptionist">AI receptionist</Link>; note that Wapzen places WhatsApp calls only, not calls to regular phone numbers.</p>
    </>,
  },
  {
    id: "broadcasts",
    title: "Broadcasts and marketing",
    body: <>
      <p>Broadcasting is what these three platforms do best, and the main reason to pick one of them.</p>
      <ul>
        <li><strong>WATI</strong> allows 15,000 broadcasts a month on Growth and unlimited on Pro, plus Click-to-WhatsApp ads.</li>
        <li><strong>AiSensy</strong> is known for broadcasts and ads, with sending speed rising by plan: 40 messages a second on Basic and Pro, 250 on Premium, and 1,000 on Unlimited.</li>
        <li><strong>Interakt</strong> has one-time and ongoing campaigns with click and conversion tracking from Growth, and campaign fallbacks on Advanced.</li>
      </ul>
      <p>Wapzen doesn’t do broadcasts. It answers the customers who message and call you, and calls the leads you add to a campaign. If marketing campaigns are central to your plans, choose one of the three.</p>
      <p>All of these work better when customers message you first. A <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code with a pre-filled message</Link> on a flyer or counter starts that chat in one scan, though you should still ask for marketing opt-in once you’re talking.</p>
    </>,
  },
  {
    id: "which",
    title: "Which should you choose?",
    body: <>
      <Choose items={[
        { name: "WATI", points: ["You want a polished all-rounder for a growing team", "You need HubSpot or Salesforce integrations", "You want AI agents that can also take WhatsApp calls"] },
        { name: "AiSensy", points: ["You want the lowest entry price, or a free plan", "You need unlimited users", "Broadcasts and Click-to-WhatsApp ads are your focus"] },
        { name: "Interakt", points: ["You sell with catalogs, payments, and Shopify", "You want unlimited agents on every WhatsApp plan", "Your team takes WhatsApp calls in the inbox"] },
        { name: "Wapzen", points: ["You mainly want AI to answer messages and calls", "You want to keep your number and app, with no API", "You want it free, with AI and voices included"] },
      ]} />
      <p>Still deciding? Our <Link href="/blog/wati-alternatives">7 best WATI alternatives</Link> covers respond.io, Gallabox, Periskope, and Twilio too, and <Link href="/blog/wapzen-vs-wati">Wapzen vs WATI</Link> goes deeper on AI and calling.</p>
    </>,
  },
];

export default function WatiVsAisensyVsInteraktPage() {
  return <BlogPost
    href={href}
    heading={<>WATI vs AiSensy vs Interakt.<br /><span>Which should you choose?</span></>}
    lead="Three of the most popular WhatsApp Business API platforms, side by side: pricing, chatbots, AI agents, calling, and broadcasts. Plus a free option if what you really need is AI that answers your customers."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>WATI:</strong> the best all-rounder for growing teams, with integrations and AI agents that can handle WhatsApp calls.</>,
        <><strong>AiSensy:</strong> the cheapest way in, with a free plan, unlimited users, and strong broadcasts. Chatbots and AI are add-ons.</>,
        <><strong>Interakt:</strong> best for selling on WhatsApp, with catalogs, payments, Shopify, and calling on Advanced.</>,
        <><strong>Wapzen:</strong> free if you mainly want AI to answer messages and calls on your current number, without the Business API.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    product="/ai-calling-agent-india"
    cta={{ heading: <>Just need AI that answers?<br /><span>Wapzen is free.</span></>, body: "Link your WhatsApp number with a QR code. An AI chatbot replies to messages and a voice agent answers calls, 24/7." }}
  />;
}
