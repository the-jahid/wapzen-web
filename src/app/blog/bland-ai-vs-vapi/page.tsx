import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, Note } from "@/components/blog/BlogPost";

// Targets "bland ai vs vapi", "vapi alternatives free", "bland ai free
// alternative", "vapi alternatives in india" (autocomplete, 2026-10-25). Facts
// come from bland.ai/pricing, vapi.ai/pricing and both products' docs on the
// date in lib/blogPosts.ts. Bland and Vapi call phone numbers; Wapzen only makes
// WhatsApp calls, so it's the third option, never a drop-in replacement.
const href = "/blog/bland-ai-vs-vapi";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const comparison = [
  ["What it is", "An all-in-one AI phone calling platform", "A developer platform to build voice agents from providers you choose", "A no-code AI agent for WhatsApp calls and chats"],
  ["Calls", "Phone numbers (its own, Twilio, or SIP)", "Phone numbers, SIP, and web calls", "WhatsApp calls only"],
  ["Pricing model", "One rate per minute, models included", "$0.05/min for Vapi, plus each provider at cost", "Free right now"],
  ["Entry price", "Start: no platform fee, $0.14/min", "Pay as you go, $5 free credit", "Free"],
  ["Next tier", "Build: $299/month, $0.12/min", "Packages from $29/month", "None at the moment"],
  ["Limits on the entry tier", "10 concurrent calls, 100 calls a day", "4 concurrent calls", "None published"],
  ["How you build", "Prompts or Conversational Pathways (node-based flows)", "Assistants and Squads, through the dashboard or API", "Instructions, knowledge base, and tools in a dashboard"],
  ["Coding needed", "Helpful; API-first", "Expected for most setups", "No"],
];

const faqs = [
  { q: "Which is cheaper, Bland AI or Vapi?", a: "For most usage, Vapi. Its pricing calculator estimates about $82 to $129 for 1,000 minutes, depending on the providers you pick, while Bland's Start plan charges $0.14 a minute, or $140 for 1,000 minutes. Bland's single rate is simpler to budget, and its Build plan lowers it to $0.12 a minute for $299 a month." },
  { q: "Is Bland AI free?", a: "Bland's Start plan has no platform fee and needs no card, but every minute of talk time is billed at $0.14, and it's capped at 100 calls a day. So it's free to try, not free to use." },
  { q: "Is there a free alternative to Vapi or Bland AI?", a: "If your customers use WhatsApp, Wapzen is currently free: a no-code AI voice agent that answers and makes WhatsApp calls on your own number, with no per-minute charge. It can't call regular phone numbers, so for phone lines you still need Vapi, Bland, or a similar platform." },
  { q: "Do Bland AI or Vapi support WhatsApp calls?", a: "Neither lists WhatsApp as a calling channel on its pricing page or docs; both are built around phone numbers, SIP, and, for Vapi, web calls. Connecting them to WhatsApp would mean bridging Meta's WhatsApp Business Calling API yourself." },
  { q: "Is Vapi or Bland better for developers?", a: "Vapi gives developers more control: you choose the transcriber, model, and voice, pay each provider at cost, and build through an API and SDKs. Bland gives you one rate with the models included and a visual Pathways builder, which suits teams that want fewer moving parts." },
  { q: "Which is better for India?", a: "Both bill in US dollars per minute for phone calls. In India, where most customers use WhatsApp, a WhatsApp calling agent like Wapzen avoids per-minute and telephony costs entirely, and speaks Hindi, Bengali, Tamil, and other languages." },
];

const sources = [
  { label: "Bland AI pricing", href: "https://www.bland.ai/pricing" },
  { label: "Bland AI: Conversational Pathways", href: "https://docs.bland.ai/tutorials/pathways" },
  { label: "Vapi pricing", href: "https://vapi.ai/pricing" },
  { label: "Vapi: Squads", href: "https://docs.vapi.ai/squads" },
];

const sections = [
  {
    id: "at-a-glance",
    title: "Bland AI vs Vapi at a glance",
    body: <>
      <p>Bland AI and Vapi both let you build AI agents that make and answer phone calls, and both are popular with developers and agencies. The difference is in how much they decide for you. <strong>Bland</strong> bundles the speech recognition, language model, and voice into one per-minute price. <strong>Vapi</strong> is an orchestration layer: you pick each provider and pay it at cost, plus Vapi’s own fee. We’ve added <strong>Wapzen</strong> as a third column for readers whose customers call on WhatsApp rather than phone lines.</p>
      <Comparison caption="Bland AI compared with Vapi, with Wapzen for WhatsApp calls" columns={["Bland AI", "Vapi", "Wapzen"]} rows={comparison} />
    </>,
  },
  {
    id: "pricing",
    title: "Pricing: one rate vs pay per part",
    body: <>
      <h3>Bland AI</h3>
      <p>Bland’s <strong>Start</strong> plan has no platform fee and charges <strong>$0.14 per minute</strong> of talk time, with transferred minutes at $0.05. It allows 10 concurrent calls and 100 calls a day. <strong>Build</strong> costs $299 a month and lowers talk time to $0.12 a minute, with 50 concurrent calls and 2,000 calls a day. <strong>Enterprise</strong> is custom and removes the caps. The per-minute rate includes the models, so there’s no separate bill for transcription or voices.</p>
      <h3>Vapi</h3>
      <p>Vapi charges <strong>$0.05 a minute</strong> for its own hosting, and passes through each provider at cost: transcription at around a cent a minute, the language model from under a cent to several cents, and the voice at roughly one to two and a half cents, plus telephony if you use Twilio or another carrier. Its calculator puts 1,000 minutes at about <strong>$82 to $129</strong>. New accounts get $5 of credit, pay-as-you-go accounts get 4 concurrent calls, and packages from $29 a month add concurrency, phone numbers, and support. Extra concurrency is $10 per line a month, and HIPAA support is a $2,000-a-month add-on.</p>
      <h3>What 1,000 minutes a month costs</h3>
      <ul>
        <li><strong>Bland Start:</strong> about $140.</li>
        <li><strong>Vapi:</strong> about $82 to $129, depending on the providers you choose.</li>
        <li><strong>Wapzen:</strong> $0 right now, for WhatsApp calls only.</li>
      </ul>
      <Note>Prices are from each vendor’s pricing page on the date at the top of this post, in US dollars. Per-minute costs vary with the models, voices, and carriers you choose.</Note>
    </>,
  },
  {
    id: "building",
    title: "Building the agent",
    body: <>
      <p><strong>Bland</strong> offers two ways to shape a call: a single prompt, or <strong>Conversational Pathways</strong>, a node-based flow where each step has its own instructions and the agent moves between nodes based on what the caller says. Pathways suit scripted calls such as reservations or qualification, and webhooks can fire at any step.</p>
      <p><strong>Vapi</strong> is built around <strong>assistants</strong>, each with its own transcriber, model, and voice, and <strong>Squads</strong>, where specialised assistants hand the call to each other. You configure them in the dashboard or through the API and SDKs, can bring your own model, and can run calls over phone, SIP, or the web. It’s the more flexible of the two, and it expects more engineering.</p>
      <p><strong>Wapzen</strong> takes the no-code route: write instructions, attach a knowledge base, pick a voice and language, and add tools such as an API request, a WhatsApp text, or ending the call. There’s no telephony to set up, because calls run on your own WhatsApp number.</p>
    </>,
  },
  {
    id: "whatsapp",
    title: "What if your customers are on WhatsApp?",
    body: <>
      <p>Bland and Vapi are built for phone lines. Neither lists WhatsApp as a calling channel, so reaching customers who live in WhatsApp means bridging Meta’s WhatsApp Business Calling API yourself.</p>
      <p>In countries where WhatsApp is the default app, such as India, Brazil, and Indonesia, many customers would rather take a WhatsApp call from a business they know than answer an unknown phone number. That’s where <Link href="/free-ai-calling-agent">Wapzen’s AI calling agent</Link> fits. It answers incoming WhatsApp calls around the clock and calls people from outbound campaigns, such as lead call-backs, reminders, or <Link href="/blog/whatsapp-cod-order-confirmation">COD order confirmations</Link>, with a transcript of every call. It’s free right now, and voice agents speak dozens of languages, including Hindi and Bengali.</p>
      <p>The trade-off: Wapzen can’t dial regular phone numbers, and it calls from your own WhatsApp number, so it isn’t built for high-volume cold-calling campaigns the way phone platforms are.</p>
    </>,
  },
  {
    id: "which",
    title: "Which one should you choose?",
    body: <>
      <Choose items={[
        { name: "Bland AI", points: [
          "You want one per-minute price with the models included",
          "Your calls follow a script that maps well to a node-based flow",
          "You need high daily call volumes with enterprise support",
        ] },
        { name: "Vapi", points: [
          "You’re a developer who wants to choose every provider",
          "You want the lowest cost per minute at scale",
          "You need web calls or your own model alongside phone calls",
        ] },
        { name: "Wapzen", points: [
          "Your customers call and message you on WhatsApp",
          "You want an AI calling agent without code or telephony",
          "You want to pay nothing per minute while you start",
        ] },
      ]} />
      <p>The short version: <strong>Bland is the simpler bill, Vapi is the more flexible build, and both are for phone calls.</strong> If your customers are on WhatsApp, Wapzen gets you an AI calling agent on your own number for free.</p>
      <Note>Wapzen links your WhatsApp number like WhatsApp Web and isn’t an official Meta product. Call only people who expect your call; WhatsApp restricts numbers that make unwanted calls.</Note>
    </>,
  },
];

export default function BlandAiVsVapiPage() {
  return <BlogPost
    href={href}
    heading={<>Bland AI vs Vapi.<br /><span>And a WhatsApp option.</span></>}
    lead="Bland AI sells AI phone calls at one rate per minute with the models included. Vapi lets developers assemble a voice agent from the providers they choose. Here’s how they compare on price, limits, and building, plus a free option if your customers call on WhatsApp."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Choose Bland AI</strong> for one simple per-minute price ($0.14, or $0.12 on the $299 Build plan) and node-based call flows.</>,
        <><strong>Choose Vapi</strong> if you’re a developer who wants to pick every provider and pay less per minute at scale, about $82 to $129 per 1,000 minutes.</>,
        <><strong>Choose Wapzen</strong> if your customers are on WhatsApp: a no-code AI calling agent on your own number, free right now. It doesn’t call phone numbers.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-cod-order-confirmation", "/blog/wapzen-vs-respond-io"]}
    product="/free-ai-calling-agent"
    cta={{ heading: <>An AI calling agent.<br /><span>On WhatsApp, for free.</span></>, body: "Create a voice agent, scan a QR code, and let it answer and make WhatsApp calls for your business." }}
  />;
}
