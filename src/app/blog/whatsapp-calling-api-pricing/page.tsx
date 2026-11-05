import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp calling api pricing" (67, 4/5), "whatsapp calling api cost"
// (57), "whatsapp business calling api pricing" (54), "whatsapp voice calling api
// pricing" (42), autocomplete 2026-11-05. Search Console: "whatsapp business calling
// api pricing" 5 impressions at 12.8. Rules come from Meta's Calling API pricing page.
// Meta's rate card files couldn't be opened directly: USD rates are Zernio's reprint
// of the 1 Oct 2026 card, India tiers are ChatMitra's reprint of the INR card, and both
// agree on India's first tier in substance ($0.0053 / ₹0.3885). Check them against Meta's
// card when possible, and each quarter. Voice CTA opens WhatsApp because the dashboard
// still shows VoiceUpdateNote; change it to sign-up when that goes.
const href = "/blog/whatsapp-calling-api-pricing";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my WhatsApp number.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const charges = [
  ["A customer calls your business", "Free"],
  ["Your business calls a customer", "Per minute, in 6-second pulses, by the country you call"],
  ["Asking a customer for call permission", "A normal per-message charge"],
  ["Call recording and transcription", "Free for now; Meta plans separate pricing"],
];

const rates = [
  ["India", "$0.0053"],
  ["Netherlands", "$0.0063"],
  ["Mexico", "$0.0094"],
  ["France", "$0.0099"],
  ["United Kingdom", "$0.0099"],
  ["Germany", "$0.0103"],
  ["Nigeria", "$0.0103"],
  ["Brazil", "$0.0108"],
  ["South Africa", "$0.0108"],
  ["Malaysia", "$0.0108"],
  ["Bangladesh", "$0.0114"],
  ["Pakistan", "$0.0119"],
  ["Italy", "$0.0121"],
  ["North America", "$0.0121"],
  ["United Arab Emirates", "$0.0127"],
  ["Saudi Arabia", "$0.0127"],
  ["Spain", "$0.0129"],
  ["Indonesia", "$0.0242"],
];

const india = [
  ["Up to 50,000", "₹0.3885"],
  ["50,001 to 250,000", "₹0.2785"],
  ["250,001 to 1,000,000", "₹0.1759"],
  ["1,000,001 to 2,500,000", "₹0.1319"],
  ["2,500,001 to 5,000,000", "₹0.0880"],
  ["Over 5,000,000", "₹0.0586"],
];

const compare = [
  ["Calls customers make to you", "Free from Meta; you pay for any voice AI", "Free"],
  ["Calls you make", "Meta’s per-minute rate, plus any provider or AI cost", "Free, no per-minute charge"],
  ["AI voice", "Connect and pay for a voice platform", "Voice agent included"],
  ["Number", "Must be on the Cloud API", "Your existing WhatsApp or Business number"],
  ["Setup", "Business verification and developer work", "No code"],
  ["Official Meta product", "Yes", "No, it links as a device"],
];

const faqs = [
  { q: "How much does the WhatsApp Calling API cost per minute?", a: "On Meta's 1 October 2026 USD card, as reprinted by Zernio, first-tier rates range from about $0.0053 a minute for India to $0.0242 for Indonesia. The UK is $0.0099, Brazil $0.0108 and the UAE $0.0127. Calls customers make to you are free." },
  { q: "How much does a WhatsApp business call cost in India?", a: "₹0.3885 a minute for your first 50,000 minutes in a month, falling to ₹0.0586 above 5 million minutes, before tax, on Meta's INR card effective 1 October 2026. Billing is in 6-second pulses, so a 56-second call counts as 60 seconds." },
  { q: "Are incoming WhatsApp business calls free?", a: "Yes. Meta says all user-initiated calls are free. If an AI answers them, you still pay whoever provides that AI, unless the tool includes it." },
  { q: "Which country's rate applies to a call?", a: "The country code of the number you call, not where your business is. A UK business calling an Indian customer pays India's rate." },
  { q: "Does Meta charge for unanswered calls?", a: "WATI's guide to Meta's pricing says calls are billed only when the customer answers. Check your provider's terms too, since some add their own fees." },
  { q: "Can US businesses call customers through the API?", a: "Not from a US number. Meta doesn't support business-initiated calls from numbers in the United States, Canada, Egypt, Vietnam or Nigeria. Customers can still call those businesses." },
  { q: "Is there a free way to use AI on WhatsApp calls?", a: "Yes. Everything in Wapzen is free right now, including its AI voice agent, which answers and makes WhatsApp calls on your existing number with no per-minute charge. Message our team on WhatsApp and we'll switch it on for your number." },
];

const sources = [
  { label: "Meta: Calling API pricing", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing/" },
  { label: "Zernio: WhatsApp API pricing, October 2026 rates", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "ChatMitra: WhatsApp Business Calling API rules and pricing", href: "https://chatmitra.com/blog/whatsapp-business-calling-api/" },
  { label: "WATI: WhatsApp Business calling pricing", href: "https://www.wati.io/en/blog/whatsapp-business-calling-pricing/" },
];

const sections = [
  {
    id: "what-is-charged",
    title: "What the WhatsApp Calling API charges for",
    body: <>
      <p>Meta’s rule is simple: <strong>calls customers make to you are free, and calls you make are charged by the minute.</strong></p>
      <Comparison caption="What Meta charges for on the WhatsApp Calling API" columns={["What Meta charges"]} rows={charges} />
      <p>Four rules decide the bill for outbound calls:</p>
      <ul>
        <li><strong>6-second pulses, rounded up.</strong> A 56-second call is 9.33 pulses, billed as 10.</li>
        <li><strong>The called number’s country sets the rate.</strong></li>
        <li><strong>Volume tiers lower the rate</strong> as your minutes to that country add up in a calendar month. A call that crosses a tier is priced entirely at the lower rate.</li>
        <li><strong>A payment method is required</strong> before you can place calls.</li>
      </ul>
    </>,
  },
  {
    id: "rates",
    title: "Per-minute rates by country",
    body: <>
      <p>These are first-tier list rates in US dollars from the card effective 1 October 2026, before tax and provider fees:</p>
      <Comparison caption="WhatsApp Calling API first-tier rates per minute" columns={["Per minute"]} rows={rates} />
      <Note>Meta publishes these rates in downloadable cards. We took them from Zernio’s reprint, so confirm against <a href="https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing/" target="_blank" rel="nofollow noopener noreferrer">Meta’s current card</a> before you budget. Meta can change them on 1 January, April, July and October.</Note>
    </>,
  },
  {
    id: "india",
    title: "WhatsApp calling rates in India",
    body: <>
      <p>India has the lowest rate listed above. On Meta’s INR card, the rate falls as monthly minutes grow:</p>
      <Comparison caption="WhatsApp Calling API tiers for calls to India, in rupees" columns={["Per minute"]} rows={india} />
    </>,
  },
  {
    id: "examples",
    title: "What a month of calls costs",
    body: <>
      <p>Take <strong>1,000 answered calls of 2 minutes each</strong>, so 2,000 minutes, at first-tier rates:</p>
      <ul>
        <li><strong>India:</strong> 2,000 × ₹0.3885 = <strong>₹777</strong></li>
        <li><strong>United Kingdom:</strong> 2,000 × $0.0099 = <strong>$19.80</strong></li>
        <li><strong>Brazil:</strong> 2,000 × $0.0108 = <strong>$21.60</strong></li>
        <li><strong>Indonesia:</strong> 2,000 × $0.0242 = <strong>$48.40</strong></li>
      </ul>
      <p>Meta’s fee is usually the small part. An AI voice platform costs far more per minute: <Link href="/blog/bland-ai-vs-vapi">Bland’s Start plan charges $0.14 a minute</Link>, so the same 2,000 minutes would add <strong>$280</strong>. Permission requests are charged as messages too, and providers may add a plan fee. WATI says it adds no per-call markup to Meta’s rate and draws usage from a prepaid wallet.</p>
    </>,
  },
  {
    id: "rules",
    title: "Rules that affect what you can call",
    body: <>
      <ul>
        <li><strong>Permission first.</strong> A customer must grant call permission, and you can send each one 1 request a day and 2 a week.</li>
        <li><strong>Missed calls count.</strong> After 4 unanswered calls in a row, the permission is revoked automatically.</li>
        <li><strong>Some numbers can’t call out.</strong> Business numbers from the US, Canada, Egypt, Vietnam and Nigeria can’t place calls through the API.</li>
        <li><strong>Cloud API only.</strong> The number can’t be on the WhatsApp Business app, and it needs a messaging limit of at least 2,000 customers a day.</li>
      </ul>
      <p>Setup steps are in our <Link href="/blog/whatsapp-business-calling-api">WhatsApp Business Calling API guide</Link>.</p>
    </>,
  },
  {
    id: "free-voice",
    title: "A free way to put AI on WhatsApp calls",
    body: <>
      <p>If what you want is AI on your calls, you may not need the API. <strong>Wapzen’s AI voice agent is working and free right now.</strong> It answers and makes WhatsApp calls on your existing number, following your instructions and knowledge base, with no per-minute charge.</p>
      <Comparison caption="The Calling API compared with Wapzen" columns={["Calling API + voice AI", "Wapzen"]} rows={compare} />
      <InlineCta href={voiceAccess} title="Turn on the voice agent" body="Message our team on WhatsApp and we’ll switch it on for your number, free." label="Message us on WhatsApp" />
      <Note>Choose the Calling API if you need Meta’s official platform or run a contact centre. Wapzen is an independent product, not made by Meta or WhatsApp.</Note>
    </>,
  },
];

export default function WhatsAppCallingApiPricingPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp Calling API pricing.<br /><span>Per-minute rates by country.</span></>}
    lead="Incoming calls are free, and outgoing calls are billed by the minute at a rate set by the country you call. Here are the 2026 rates for 18 markets, India’s volume tiers, worked monthly bills, and a free route if you want AI on your calls."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Customer-started calls are free.</strong> Business-started calls are charged per minute, in 6-second pulses.</>,
        <><strong>First-tier rates run from $0.0053 a minute (India) to $0.0242 (Indonesia).</strong> They fall as monthly minutes to a country grow.</>,
        <><strong>AI usually costs more than Meta’s fee.</strong> Wapzen’s voice agent is free right now, with no per-minute charge.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-calling-api", "/blog/bland-ai-vs-vapi"]}
    product="/free-ai-calling-agent"
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
    cta={{ heading: <>AI on your WhatsApp calls.<br /><span>No per-minute charge.</span></>, body: "Wapzen’s voice agent answers and makes WhatsApp calls on your own number, free right now. Message us and we’ll switch it on." }}
  />;
}
