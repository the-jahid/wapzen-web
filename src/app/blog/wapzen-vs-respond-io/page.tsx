import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, Note } from "@/components/blog/BlogPost";

// Targets "respond io alternatives" (+ "free", "cheaper"), "respond.io vs"
// (autocomplete, 2026-10-25). respond.io facts come from respond.io/pricing and
// its WhatsApp Business Calling API page on the date in lib/blogPosts.ts. Be
// fair: respond.io is an omnichannel platform for teams; Wapzen is WhatsApp
// only and has no team inbox.
const href = "/blog/wapzen-vs-respond-io";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const comparison = [
  ["What it is", "Omnichannel inbox, workflows, and AI agents for customer teams", "AI agents that answer WhatsApp chats and calls on your own number"],
  ["Channels", "WhatsApp, Instagram, Facebook, TikTok, and more", "WhatsApp only"],
  ["Starting price", "Starter $79/month billed yearly ($99 monthly)", "Free right now"],
  ["AI agents", "From Growth, $159/month billed yearly", "Included"],
  ["Contacts", "Plans start at 1,000 monthly active contacts", "No contact limit"],
  ["Users", "5 on Starter, 10 on Growth and Advanced, then $12–$24 each", "One account"],
  ["WhatsApp calls", "Business Calling API; ask permission before calling", "AI voice agent answers and makes calls"],
  ["WhatsApp fees", "Meta’s charges, paid on top", "None"],
  ["Free trial", "7 days, no card", "No trial needed"],
  ["Setup", "Connect a WhatsApp Business API number", "Scan a QR code"],
  ["Official Meta platform", "Yes", "No: links like WhatsApp Web"],
];

const faqs = [
  { q: "Is there a free alternative to respond.io?", a: "For AI answers on WhatsApp, yes: Wapzen is currently free and runs an AI chatbot and voice agent on your existing number without the Business API. It doesn't replace respond.io's omnichannel inbox, workflows, or team features, so teams that need those should compare other paid platforms." },
  { q: "How much does respond.io cost?", a: "respond.io's Starter plan is $79 a month billed yearly or $99 monthly, Growth is $159 or $199, and Advanced is $279 or $349, with Enterprise priced on request. Plans start at 1,000 monthly active contacts, extra users cost $12 to $24 each a month, and WhatsApp's own message and call charges come on top." },
  { q: "What is a monthly active contact on respond.io?", a: "respond.io bills partly by monthly active contacts (MACs), roughly the contacts you exchange messages with in a month. Plans start at 1,000, and more cost $12 per 100 on Growth and $15 per 100 on Advanced." },
  { q: "Can respond.io make WhatsApp calls?", a: "Yes, through Meta's WhatsApp Business Calling API. Incoming calls are free, outgoing calls are billed per minute at Meta's rates, and a business must ask a customer's permission in the chat before calling them. Business-initiated calls aren't allowed in some countries, including the US and Canada." },
  { q: "Is Wapzen cheaper than respond.io?", a: "Right now Wapzen is free, with no contact, user, or AI credit limits to buy more of. respond.io charges by plan, users, and monthly active contacts, plus WhatsApp's fees, in exchange for a full omnichannel team platform." },
  { q: "Does Wapzen support Instagram or Facebook Messenger?", a: "No. Wapzen works on WhatsApp only, for both chats and calls. If you need one inbox for several channels, respond.io is built for that." },
];

const sources = [
  { label: "respond.io pricing", href: "https://respond.io/pricing" },
  { label: "respond.io: WhatsApp Business Calling API", href: "https://respond.io/whatsapp-business-calling-api" },
];

const sections = [
  {
    id: "at-a-glance",
    title: "Wapzen vs respond.io at a glance",
    body: <>
      <p>respond.io is a customer conversation platform for teams: one inbox for WhatsApp, Instagram, Facebook, TikTok, and other channels, with workflows, lifecycle stages, reporting, and AI agents. Wapzen does one thing: it puts AI agents on your WhatsApp number to answer chats and calls. If you’re looking at respond.io and wondering whether you need all of it, this comparison is for you.</p>
      <Comparison caption="respond.io compared with Wapzen" columns={["respond.io", "Wapzen"]} rows={comparison} />
    </>,
  },
  {
    id: "pricing",
    title: "Pricing: plans, users, contacts, and credits",
    body: <>
      <p>respond.io prices on four dials at once, so the plan price is only the start.</p>
      <ul>
        <li><strong>Plan:</strong> Starter $79 a month billed yearly ($99 monthly), Growth $159 ($199), Advanced $279 ($349), and Enterprise on request.</li>
        <li><strong>Users:</strong> 5 on Starter and 10 on Growth and Advanced. Extra users cost $12, $20, or $24 each a month, by plan.</li>
        <li><strong>Monthly active contacts:</strong> plans start at 1,000. More cost $12 per 100 on Growth and $15 per 100 on Advanced.</li>
        <li><strong>AI credits:</strong> 5,000 on Starter up to 40,000 on Enterprise. Extra credits cost $15 per 1,000.</li>
      </ul>
      <p>WhatsApp’s own message and call charges are not included in any plan. Meta bills them, and you top up WhatsApp credit in respond.io.</p>
      <p>AI agents start on Growth, so a team that wants them pays at least <strong>$1,908 a year</strong>, before extra users, extra contacts, and WhatsApp fees.</p>
      <p><strong>Wapzen</strong> is currently free, with every feature included and nothing metered: no contact limits, AI credits, or WhatsApp fees, because it doesn’t use the Business API.</p>
      <Note>respond.io’s prices are from its pricing page on the date at the top of this post. Check them before you buy.</Note>
    </>,
  },
  {
    id: "calls",
    title: "WhatsApp calls: two very different routes",
    body: <>
      <p><strong>respond.io</strong> supports Meta’s WhatsApp Business Calling API. Customers can call your business number for free, and your team (or respond.io’s AI agents for voice) can answer. Calling a customer has rules set by Meta: you first send a call permission request in the chat, at most once a day and twice a week, and the customer has to accept. Outgoing calls are billed per minute at Meta’s rates, and business-initiated calls aren’t allowed in several countries, including the US and Canada.</p>
      <p><strong>Wapzen</strong> places and answers calls on a number linked by QR code, so its calls work like any WhatsApp call: no permission request and no per-minute fee. Its AI voice agent answers incoming calls around the clock and calls people from outbound campaigns, such as leads who asked for a call-back or buyers confirming a <Link href="/blog/whatsapp-cod-order-confirmation">cash on delivery order</Link>.</p>
      <p>That freedom comes with responsibility: call only people who expect to hear from you. WhatsApp restricts numbers that make unwanted calls, whatever tool places them.</p>
    </>,
  },
  {
    id: "ai",
    title: "AI agents",
    body: <>
      <p>respond.io’s AI agents are part of a larger system: they work inside workflows, hand conversations to the right team, and use AI credits as they go. That’s powerful for a support or sales team routing hundreds of conversations a day across channels.</p>
      <p>Wapzen’s AI agent is simpler to set up and has no credits to track. Write instructions, choose GPT or Claude, attach your documents as a knowledge base, and connect your number. Add API tools if the agent needs to look something up. Our <Link href="/blog/whatsapp-chatbot-without-business-api">chatbot guide</Link> shows the whole setup in five steps.</p>
    </>,
  },
  {
    id: "which",
    title: "Which one should you choose?",
    body: <>
      <Choose items={[
        { name: "respond.io", points: [
          "Several people handle conversations and need assignment, roles, and reports",
          "Customers reach you on Instagram, Facebook, or TikTok as well as WhatsApp",
          "You want workflows that route and tag conversations automatically",
          "You need the official Business API, including for calls",
        ] },
        { name: "Wapzen", points: [
          "WhatsApp is your main channel and you want AI to answer it",
          "You want AI to answer and make WhatsApp calls with no per-minute fees",
          "You don’t want to pay per user, per contact, or per AI credit",
          "You want to start today on your existing number",
        ] },
      ]} />
      <p>The short version: <strong>respond.io is an omnichannel platform for customer teams; Wapzen is an AI agent for WhatsApp chats and calls.</strong> If you’re a growing team living in a shared inbox, respond.io is worth evaluating with its 7-day trial. If you mostly want WhatsApp questions and calls answered instantly, Wapzen does that for free.</p>
      <p>Comparing more WhatsApp platforms? See <Link href="/blog/wati-alternatives">the 7 best WATI alternatives</Link>.</p>
      <p>With either tool, customers in your shop or holding your flyer can reach you through a <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code</Link>: one scan opens a chat with your number, so nobody has to save it first.</p>
      <Note>Wapzen links your number like WhatsApp Web and isn’t an official Meta product. Use it to answer people who contact you and call people who expect your call, never for bulk messaging.</Note>
    </>,
  },
];

export default function WapzenVsRespondIoPage() {
  return <BlogPost
    href={href}
    heading={<>Wapzen vs respond.io.<br /><span>Platform or agent?</span></>}
    lead="respond.io is an omnichannel platform for customer teams, priced by plan, users, contacts, and AI credits. Wapzen is a free AI agent for WhatsApp chats and calls on your own number. Here’s how they compare, and when the simpler option is enough."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Choose respond.io</strong> if a team handles conversations across WhatsApp, Instagram, Facebook, and more, with workflows and reporting.</>,
        <><strong>Choose Wapzen</strong> if WhatsApp is your main channel and you want AI to answer messages and calls, without per-user or per-contact pricing.</>,
        <><strong>Cost:</strong> respond.io starts at $79 a month billed yearly, with AI agents from $159, plus contacts and WhatsApp fees. Wapzen is currently free.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/wati-alternatives", "/blog/wapzen-vs-aisensy"]}
    product="/whatsapp-ai-customer-service"
    cta={{ heading: <>WhatsApp, answered.<br /><span>Free, in minutes.</span></>, body: "Sign up, scan a QR code, and let an AI agent answer your WhatsApp messages and calls." }}
  />;
}
