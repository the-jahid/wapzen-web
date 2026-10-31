import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp business calling api" (98, 5/5), "…pricing" (75),
// "whatsapp business calling" (45), "…api meta" (45), "whatsapp calling api
// pricing" (40), autocomplete 2026-10-28. Facts from Meta's Calling API docs.
// Meta changes rate cards and limits on 1 January, April, July and October:
// recheck the pricing and permission sections then and bump `updated`.
const href = "/blog/whatsapp-business-calling-api";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const pricing = [
  ["A customer calls your business", "Free"],
  ["Your business calls a customer", "Per minute, billed in 6-second pulses, at the rate for the country code of the number you call"],
  ["Asking a customer for call permission", "Charged like a normal message, at Meta’s per-message rates"],
  ["Call recording and transcription", "Free for now; Meta says separate pricing is planned"],
];

const routes = [
  ["How your number connects", "Registered on Meta’s Cloud API, through Meta or a provider", "Your existing WhatsApp or WhatsApp Business number, linked by QR code"],
  ["Calls customers make to you", "Free from Meta; you pay for the voice AI and any provider plan", "Free right now"],
  ["Calls you make to customers", "Meta’s per-minute rate, plus any provider fee", "No per-minute charge"],
  ["Before you can call someone", "They must grant call permission (1 request a day, 2 a week)", "No permission step, but call only people who expect it"],
  ["Setup", "Business verification, a 2,000-a-day messaging limit, and developer work for calls", "No code, about 15 minutes"],
  ["Official Meta product", "Yes", "No, it links as a device"],
];

const faqs = [
  { q: "Is the WhatsApp Business Calling API free?", a: "Partly. Calls your customers make to you are free. Calls your business makes to customers are charged per minute, in 6-second pulses, at a rate set by the country code of the number you call. Asking a customer for permission to call is charged like a normal message, and most providers add their own fees." },
  { q: "How much does a WhatsApp business call cost per minute?", a: "Meta publishes per-minute rates in rate cards by currency, effective 1 April 2026, and the rate depends on the country you call and your monthly calling volume. Calls are billed in 6-second pulses, rounded up, so a 56-second call is billed as 60 seconds. Check Meta's current rate card for your customers' country." },
  { q: "Can I use the Calling API with the WhatsApp Business app?", a: "No. Meta's documentation says the number must be on the Cloud API. To put an AI on calls to a number you use in the WhatsApp Business app, you need a different route, such as linking the number as a device." },
  { q: "Can a business call customers on WhatsApp without permission?", a: "Not through the API. A customer has to grant call permission first, and a production account can send each customer at most 1 permission request a day and 2 a week. If a customer misses 4 calls in a row, the permission is revoked automatically." },
  { q: "Is WhatsApp business calling available in the US?", a: "Customers can call US businesses on the API, but business-initiated calls aren't available for business numbers from the United States, Canada, Egypt, Vietnam, or Nigeria, according to Meta's documentation. The customer's number can be from any country the Cloud API supports." },
  { q: "Can an AI agent answer WhatsApp business calls?", a: "Yes. With the Calling API you connect a voice AI platform to the call, usually over SIP or WebRTC. Without the API, Wapzen links your existing number by QR code and its AI voice agent answers and makes WhatsApp calls, with no code and no per-minute fees." },
];

const sources = [
  { label: "Meta: WhatsApp Business Calling API overview", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/" },
  { label: "Meta: Calling API pricing", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing/" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const sections = [
  {
    id: "what-it-is",
    title: "What is the WhatsApp Business Calling API?",
    body: <>
      <p>The <strong>WhatsApp Business Calling API</strong> is the part of Meta’s WhatsApp Business Platform that lets a business take and make <strong>WhatsApp voice calls through its own software</strong>, rather than on a phone. A customer taps the call button in your chat, and the call rings in your contact-centre app, a browser softphone, or an AI voice agent. Your business can also call customers who have agreed to it.</p>
      <p>It’s plumbing, not a product you talk through. The API connects the call and tells your app what’s happening through webhooks; the audio runs over WebRTC or, once Meta enables it for you, SIP. Who or what speaks to the customer, a person or an AI, is up to the software you connect.</p>
      <p>Two things rule many businesses out from the start: the number must be on Meta’s <strong>Cloud API</strong>, not the WhatsApp Business app, and the business needs a messaging limit of at least <strong>2,000 unique customers a day</strong>. The <Link href="/blog/whatsapp-business-app-vs-api">WhatsApp Business app vs API</Link> post explains that split.</p>
    </>,
  },
  {
    id: "pricing",
    title: "Calling API pricing in 2026",
    body: <>
      <p>Meta prices calls by who starts them:</p>
      <Comparison caption="What the WhatsApp Business Calling API charges for" columns={["What Meta charges"]} rows={pricing} />
      <p>Four rules decide the bill for the calls you make:</p>
      <ul>
        <li><strong>6-second pulses, rounded up.</strong> A 56-second call is 9.33 pulses, billed as 10, so you pay for 60 seconds.</li>
        <li><strong>The callee’s country sets the rate,</strong> by the country code of the number you call. Meta publishes rate cards in several currencies, including USD, INR, GBP, and MXN; the current ones took effect on <strong>1 April 2026</strong>.</li>
        <li><strong>Volume tiers lower the rate</strong> as your calling minutes to a country add up within a calendar month. A call that crosses into a cheaper tier is billed entirely at the cheaper rate.</li>
        <li><strong>A payment method is required</strong> before your number can place calls.</li>
      </ul>
      <p>Then add the software. Providers that resell the API usually charge a monthly plan or their own per-minute fee, and if an AI answers, you also pay for speech-to-text, the language model, and text-to-speech. Messages around the calls, such as permission requests and follow-ups, follow Meta’s per-message pricing, explained in <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>.</p>
      <Note>Meta changes rates and pricing rules each quarter. Check the rate card for your customers’ country before you budget.</Note>
    </>,
  },
  {
    id: "limits",
    title: "Call permissions, limits, and countries",
    body: <>
      <p>Customers can call you whenever your number has calling switched on. Calling them is tightly controlled:</p>
      <ul>
        <li><strong>Permission first.</strong> You can only call a customer who has granted call permission, usually by accepting a permission request you send in the chat.</li>
        <li><strong>Few requests.</strong> A production account can send each customer <strong>1 permission request a day and 2 a week</strong>. Sandbox and test numbers get 25 a day and 100 a week.</li>
        <li><strong>Missed calls cost you the permission.</strong> After 2 unanswered calls in a row, Meta sends you a system message asking you to reconsider. After 4, the customer’s permission is revoked automatically.</li>
        <li><strong>Some business numbers can’t call out.</strong> Business-initiated calls work wherever the Cloud API works, except for business numbers from the <strong>United States, Canada, Egypt, Vietnam, and Nigeria</strong>. The customer’s number can be from any supported country.</li>
      </ul>
      <p>The rules exist to stop WhatsApp turning into a robocall channel, and they shape what the API is good for: answering customers who call you, and calling back people who asked for it.</p>
      <p>That makes customer-started contact valuable. A <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code</Link> on your site, ads, or packaging lets people open a chat with you in one scan, and a call permission request can follow from there.</p>
    </>,
  },
  {
    id: "setup",
    title: "How to set up the Calling API",
    body: <>
      <p>A typical setup, whether you work with Meta directly or through a provider:</p>
      <ol>
        <li><strong>Get a Cloud API number</strong> with a verified business and a messaging limit of at least 2,000 unique customers a day.</li>
        <li><strong>Switch calling on</strong> in the phone number’s call settings, and choose when the call button shows.</li>
        <li><strong>Subscribe your app to the <code>calls</code> webhook,</strong> so it hears about incoming calls, and give it the <code>whatsapp_business_messaging</code> permission.</li>
        <li><strong>Connect the audio.</strong> Your app accepts calls and exchanges media over WebRTC, or Meta enables SIP so a phone system or voice AI platform can take the call.</li>
        <li><strong>Add a payment method</strong> if you’ll call customers, and build the permission request into your chat flow.</li>
      </ol>
      <p>Steps 3 and 4 are developer work. Most small businesses use a provider that has already built them, and pay that provider’s plan on top of Meta’s rates.</p>
    </>,
  },
  {
    id: "ai-agent",
    title: "Putting an AI voice agent on WhatsApp calls",
    body: <>
      <p>An AI that answers WhatsApp calls needs three pieces: a way into the call, a voice agent (speech-to-text, a language model, and text-to-speech), and your business information. There are two ways in:</p>
      <Comparison caption="The Calling API compared with linking a number as a device" columns={["Calling API + voice AI", "Linked device (Wapzen)"]} rows={routes} />
      <p>The Calling API is the official route and the right one for contact centres, large teams, and anyone who needs Meta’s platform. Linking your number as a device is the quick route: <strong>Wapzen</strong> connects the number you already use, by QR code, and its AI voice agent answers incoming WhatsApp calls and makes outbound ones, with your instructions and knowledge base. It’s currently free, with the AI models and voices included.</p>
      <InlineCta title="Let AI answer your WhatsApp calls" body="Create a voice agent, add your business info, and scan a QR code. No Calling API, no per-minute fees." />
      <Choose items={[
        { name: "the Calling API", points: ["You need Meta’s official platform", "You already use a Business API provider", "A team or contact centre takes the calls", "You have developers, or a provider that has built it"] },
        { name: "Wapzen", points: ["You want AI to answer calls on your current number", "Your number is in the WhatsApp Business app", "You don’t want per-minute fees", "You want it working today, without code"] },
      ]} />
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device, not through the Calling API. Call only people who expect your call: WhatsApp restricts numbers that make unwanted calls. For phone-line AI agents, see <Link href="/blog/bland-ai-vs-vapi">Bland AI vs Vapi</Link>.</Note>
    </>,
  },
];

export default function WhatsAppBusinessCallingApiPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp Business Calling API.<br /><span>Pricing, limits and setup.</span></>}
    lead="Meta’s Calling API lets a business take and make WhatsApp voice calls through its own software. Here’s which calls are free, how per-minute billing works, the permission rules, which numbers can’t call out, and a simpler route for small businesses."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Calls customers make to you are free;</strong> calls you make are charged per minute, in 6-second pulses, at the rate for the country you call.</>,
        <><strong>It needs a Cloud API number,</strong> not the WhatsApp Business app, and a messaging limit of at least 2,000 customers a day.</>,
        <><strong>You must ask before you call:</strong> 1 permission request per customer a day, 2 a week. US, Canadian, Egyptian, Vietnamese, and Nigerian business numbers can’t call out.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/what-is-a-whatsapp-chatbot", "/blog/whatsapp-business-api-pricing"]}
    product="/free-ai-calling-agent"
    cta={{ heading: <>AI on your WhatsApp calls.<br /><span>Without the Calling API.</span></>, body: "Connect your number by QR code and let an AI voice agent answer and make WhatsApp calls. Free right now, no code." }}
  />;
}
