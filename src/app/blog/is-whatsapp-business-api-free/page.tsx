import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note, RowTable } from "@/components/blog/BlogPost";

// Targets "is whatsapp business api free" (114), "whatsapp business api free
// download" (81), "whatsapp business api free" (74), "free whatsapp api" (60),
// "whatsapp api free" (60), "whatsapp cloud api free" (60), "free whatsapp api
// to send message" (53), "whatsapp business api free trial" (43), "whatsapp
// cloud api free limit" (41), autocomplete 2026-11-02; Search Console had the
// site at position ~67 for "whatsapp business api free". Meta facts (1,000
// free service messages per number from 1 October 2026, FEP window up to 7
// days, no access fee, in-window utility charged) checked against Meta's
// pricing docs on `updated`; rates match /blog/whatsapp-business-api-pricing.
// Provider offers from their pricing pages the same day; AiSensy's rupee plan
// price was last read on 2026-10-25.
const href = "/blog/is-whatsapp-business-api-free";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const whatsFree = [
  ["Getting API access (Cloud API)", "Free", "Meta charges no access or setup fee; you pay only for messages it delivers"],
  ["Messages customers send you", "Free", "Incoming messages are never charged"],
  ["Service replies inside the 24-hour window", "First 1,000 a month free", "Per number, from 1 October 2026; after that, the utility rate"],
  ["Chats that start from Click to WhatsApp ads", "Free", "Every message in the free entry point window, up to 7 days"],
  ["Marketing templates (offers, broadcasts)", "Paid", "Every delivered message: ₹0.8631 in India, $0.025 in the US"],
  ["Utility templates (order and delivery updates)", "Paid", "Even inside the 24-hour window since 1 October 2026: ₹0.115 in India, $0.0034 in the US"],
  ["Authentication templates (OTPs)", "Paid", "Every delivered message, at or near the utility rate"],
  ["A provider’s platform (BSP)", "Usually paid", "Monthly plan, often a markup per message, and AI as an add-on"],
];

const offers = [
  ["Meta Cloud API, direct", "API access with no platform fee", "You build and host the inbox, chatbot and integrations; message fees apply"],
  ["AiSensy Free Forever", "The API on your number, Blue Tick application, sign-up credits, live chat inbox", "No broadcasts; chatbot flows ($80 a month) and the AI agent ($50 a month for 1,000 AI messages) are add-ons; message fees apply"],
  ["WATI", "7-day free trial", "Then from $49 a month ($39 billed annually), plus message charges"],
  ["Interakt", "Free trial", "Then Growth at $55 a month plus taxes; AI agents are an add-on"],
  ["Wapzen", "AI chat agent with no reply cap, AI voice agent, knowledge base, bulk messages", "Not the official API: it links your number as a device, like WhatsApp Web"],
];

const faqs = [
  { q: "Is the WhatsApp Business API free?", a: "No. Access is free: Meta charges no setup or platform fee, and messages customers send you cost nothing. But Meta charges for every delivered marketing, utility and authentication message, and since 1 October 2026 for service replies beyond 1,000 a month per number. Most providers add a monthly plan on top." },
  { q: "Is the WhatsApp Cloud API free?", a: "The Cloud API is Meta's hosted version of the Business API, and using it has no access fee. Messages are charged the same way as on any other route: per delivered template message by category and country, with the first 1,000 service replies a month per number free." },
  { q: "How many free messages does the WhatsApp Business API give?", a: "Each business phone number gets 1,000 free service messages a month, from 1 October 2026; unused ones don't roll over. All messages in a free entry point window from a Click to WhatsApp ad are also free. There is no free monthly allowance for marketing or utility templates." },
  { q: "Is there a free trial of the WhatsApp Business API?", a: "Meta doesn't need a trial because access is free and you pay per message. Providers offer their own: WATI has a 7-day free trial, Interakt a free trial, and AiSensy a Free Forever plan without broadcasts. Message charges apply on all of them." },
  { q: "Can I download the WhatsApp Business API for free?", a: "There's nothing to download. The API is a service you reach through Meta's developer platform or a provider, not an app. What you can download for free is the WhatsApp Business app for Android and iPhone, which has no per-message fees but also no API." },
  { q: "Is there a free WhatsApp API on GitHub?", a: "There are open-source libraries that automate WhatsApp Web, and the code is free. They aren't Meta's API: you host and maintain them yourself, they break when WhatsApp changes, and using them for bulk or automated messaging goes against WhatsApp's terms and can get a number restricted." },
  { q: "Do I pay for messages customers send me?", a: "No. Meta doesn't charge for messages from users to businesses. Check your provider, though: a few charge their own fee per message in both directions." },
  { q: "What's the cheapest way to answer customers on WhatsApp?", a: "If you mostly answer people who message you, skip the API. Wapzen links your existing number by QR code and answers with a free AI agent, with no Meta message fees and no cap on AI replies. If you need big broadcast campaigns, the API is still the right tool." },
];

const sources = [
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "WhatsApp Terms of Service", href: "https://www.whatsapp.com/legal/terms-of-service" },
  { label: "AiSensy pricing", href: "https://aisensy.com/pricing" },
  { label: "WATI pricing", href: "https://www.wati.io/pricing/" },
  { label: "Interakt pricing", href: "https://www.interakt.shop/pricing/" },
];

const sections = [
  {
    id: "short-answer",
    title: "The short answer: free to access, not free to use",
    body: <>
      <p>Getting the WhatsApp Business API costs nothing. Meta charges no setup or platform fee for its Cloud API, and the messages your customers send you are always free. What Meta charges for is <strong>what you send</strong>: every delivered template message, and since 1 October 2026, replies to customers beyond a free monthly tier.</p>
      <Comparison caption="What is free and what is paid on the WhatsApp Business API" columns={["Cost", "Details"]} rows={whatsFree} />
      <p>So whether the API is “free” for you depends on what you do with it. A business that only answers a few hundred questions a month can pay Meta nothing. A business that sends offers, order updates and thousands of replies will pay every month.</p>
    </>,
  },
  {
    id: "october-2026",
    title: "Why “service messages are free” stopped being true",
    body: <>
      <p>Until 30 September 2026, every free-form reply inside the 24-hour customer service window was free. That’s why so many guides still say a support chatbot on the API costs nothing. Two things changed on <strong>1 October 2026</strong>:</p>
      <ul>
        <li><strong>Service replies are free only up to 1,000 a month per number.</strong> After that, each one costs the utility rate for the customer’s country. Unused free messages don’t roll over.</li>
        <li><strong>Utility templates sent inside an open window are charged.</strong> They had been free there since July 2025.</li>
      </ul>
      <p>Every chatbot and AI agent reply is a service message. A bot that answers 300 chats a day with three replies each sends about 27,000 replies a month, and 26,000 of them are now billable: roughly <strong>₹2,990</strong> in India or <strong>$88</strong> in the US in Meta fees alone, before the provider’s plan.</p>
      <Note>Meta reprices every quarter (1 January, April, July and October). Our <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing guide</Link> has the full rate table by country.</Note>
    </>,
  },
  {
    id: "free-offers",
    title: "“Free WhatsApp API” offers, checked",
    body: <>
      <p>Search for a free WhatsApp API and you’ll find several offers. Here is what each one actually gives you for free, and the catch:</p>
      <RowTable caption="Free WhatsApp API offers compared" columns={["What’s free", "The catch"]} rows={offers} highlight="Wapzen" />
      <p>Notice the pattern. The provider’s free plan gets you <em>access</em>, while broadcasts, chatbots and AI, the things most businesses want the API for, are paid plans or add-ons. Meta’s message fees apply on every API option.</p>
    </>,
  },
  {
    id: "github",
    title: "What about the “free WhatsApp API” on GitHub?",
    body: <>
      <p>Open-source projects that automate WhatsApp Web are free to download, and they’re often what people mean by a free WhatsApp API. They work by linking a number as a device, the way WhatsApp Web does, so Meta’s message fees don’t apply. But:</p>
      <ul>
        <li><strong>They aren’t Meta’s API.</strong> There’s no green tick and no template broadcasts, and WhatsApp’s terms forbid bulk and automated messaging outside its Business Platform.</li>
        <li><strong>You run everything.</strong> A server that stays online, encryption keys you must store safely, and reconnecting when sessions drop.</li>
        <li><strong>They break.</strong> WhatsApp updates its web client often, and a library can stop connecting until someone patches it.</li>
      </ul>
      <p>Wapzen uses the same linked-device approach, but hosted and maintained for you, with the AI agent already built. You scan a QR code instead of running a server.</p>
    </>,
  },
  {
    id: "real-cost",
    title: "What a month costs, with and without the API",
    body: <>
      <p>Take an online store in India with 2,500 customer chats a month, four AI replies per chat, and 1,500 order updates. On a Business API platform such as AiSensy:</p>
      <ul>
        <li>Basic plan: <strong>₹1,500</strong></li>
        <li>AI agent add-on: <strong>₹1,350</strong>, which covers 1,000 of the 10,000 AI replies; the rest are charged separately</li>
        <li>Service replies past the free 1,000: 9,000 × ₹0.145 = <strong>₹1,305</strong></li>
        <li>Order updates: 1,500 × ₹0.145 = <strong>₹218</strong></li>
      </ul>
      <p>That’s about <strong>₹4,373 a month plus GST</strong>, before the extra AI messages. Run the same store on Wapzen and the bill is <strong>₹0</strong>: no plan, no message fees and no AI quota. The trade-off is that order updates go out as normal WhatsApp messages from your number, not as API templates.</p>
      <Note>AiSensy’s rupee plan price was read from its pricing page in late October 2026; its per-message rates are from 1 October 2026. Your provider’s rates may differ.</Note>
    </>,
  },
  {
    id: "when-to-pay",
    title: "When paying for the API is worth it",
    body: <>
      <p>The API earns its fees when you need what only Meta’s platform offers:</p>
      <ul>
        <li><strong>Broadcasts to large opted-in lists,</strong> tens of thousands of messages, with Meta’s delivery and quality reporting.</li>
        <li><strong>A verified business profile</strong> with the green tick.</li>
        <li><strong>A team inbox</strong> where many agents share one number.</li>
        <li><strong>Official integrations and compliance,</strong> often a requirement for banks, insurers and large retailers.</li>
      </ul>
      <p>If your WhatsApp is mostly customers asking questions, ordering and booking, you’re paying for capacity you don’t use. See <Link href="/blog/whatsapp-business-app-vs-api">WhatsApp Business app vs API</Link> to decide.</p>
    </>,
  },
  {
    id: "no-api",
    title: "How to answer customers with no message fees",
    body: <>
      <p>Wapzen puts a free AI agent on the WhatsApp number you already have. You link it by QR code or pairing code, the same way you’d open WhatsApp Web, and the agent answers every customer from your instructions and knowledge base. Because it doesn’t use the API, there are <strong>no Meta fees and no cap on AI replies</strong>.</p>
      <ul>
        <li>Answers chats 24/7 in the customer’s language, from your FAQ, price list and documents.</li>
        <li>Takes orders and saves them to your dashboard once the customer confirms.</li>
        <li>Sends personalised bulk messages to your customer list, with a gap between each.</li>
        <li>Answers WhatsApp calls with an AI voice agent.</li>
      </ul>
      <InlineCta title="Skip the per-message bill" body="Put a free AI agent on your existing WhatsApp number. No Business API, no Meta fees, no reply cap." />
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. Use it to answer people who contact you and to message customers who expect to hear from you, never for cold bulk messaging.</Note>
      <p>The full walkthrough is in <Link href="/blog/free-whatsapp-ai-agent">free WhatsApp AI agent</Link>.</p>
    </>,
  },
];

export default function IsWhatsAppBusinessApiFreePage() {
  return <BlogPost
    href={href}
    heading={<>Is the WhatsApp Business API free?<br /><span>Free to access, not to use.</span></>}
    lead="Meta charges nothing to get the API, but it charges for almost everything you send, and since 1 October 2026 even for replies beyond a free monthly tier. Here’s exactly what’s free, what isn’t, what “free” API offers really include, and how to answer customers with no message fees at all."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>No, not entirely.</strong> API access is free and incoming messages are free, but Meta charges for every delivered marketing, utility and authentication message.</>,
        <><strong>Still free:</strong> the first 1,000 service replies a month per number (since 1 October 2026), and every message in the 7-day window after a Click to WhatsApp ad.</>,
        <><strong>No API, no fees:</strong> Wapzen links your number by QR code and answers with a free AI agent, with no Meta message fees and no cap on AI replies.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-api-pricing", "/blog/free-whatsapp-ai-agent"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>Answer customers on WhatsApp.<br /><span>No API, no message fees.</span></>, body: "Link your number with a QR code and let a free AI agent reply to every chat, with no cap on replies." }}
  />;
}
