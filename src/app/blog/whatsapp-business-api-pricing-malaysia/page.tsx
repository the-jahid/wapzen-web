import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Searches (Google + YouTube autocomplete with hl=en and hl=ms, gl=my, and DuckDuckGo my-en and
// my-ms, 2026-11-15, docs/seo-blog-malaysia-research.mjs, docs/seo-research.md "Malaysia
// posts"; scores out of 6 sources): "whatsapp business api pricing malaysia" 134 (4/6),
// "whatsapp business api malaysia" 127 (4/6), "whatsapp business berbayar" 58, "whatsapp
// business api harga" 40, "malaysia broadcast whatsapp business api rate" 40, "whatsapp api
// malaysia" 40, "whatsapp business api price malaysia" 30, "whatsapp business price malaysia"
// 28. The highest-intent cluster of the harvest; Malaysians search it in English.
// Facts read 2026-11-15. Meta's developer pricing page (1 Oct 2026 version): MYR billing since
// 1 Apr 2026, chosen when the account is created; 1,000 free service messages per business
// number a month; utility templates inside the customer service window charged since 1 Oct
// 2026; free entry point window up to 7 days; user-initiated calls free. The MYR and USD
// per-message figures are NOT in Meta's page text (they sit in rate-card downloads); they come
// from respond.io's and ChatMaxima's Malaysia pages, which agree with each other: RM0.3467
// marketing, RM0.0564 utility, authentication and service, RM0.1685 international
// authentication; USD 0.0860 and 0.0140 (ChatMaxima only). ChatMaxima says in-window utility is
// free, which contradicts Meta's own page, so the post follows Meta. Utility tier start points
// (150,001 utility, 100,001 authentication) are from respond.io. Malaysia's business-initiated
// call rate wasn't found, so the post gives none. Platform prices from each pricing page the
// same day: SleekFlow en-my Pro RM 399 a month billed yearly (RM 4,788), Premium RM 1,199 (RM
// 14,388), RM 50 a month number hosting, conversations "per SleekFlow rate card"; respond.io
// USD Starter 79/99, Growth 159/199, Advanced 279/349 (yearly/monthly), WhatsApp fees not
// included; WATI USD Growth 39, Pro 79, Business 199 a month billed yearly (monthly-billed
// figures didn't come through, so none are quoted), template charges extra. No USD-to-MYR
// conversion anywhere: no exchange rate was checked. Copy rules: Wapzen "free to start"
// (FREE_TRIAL_REPLIES), never "unlimited" or "free forever"; no limit or ban wording; says
// Wapzen isn't an official Meta product and doesn't send broadcasts.
const href = "/blog/whatsapp-business-api-pricing-malaysia";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const rates = [
  ["Marketing (promotions, broadcasts, offers)", "RM 0.3467", "US$0.0860", "Every delivered message; no volume tiers"],
  ["Utility (order updates, reminders)", "RM 0.0564", "US$0.0140", "Charged even inside the 24-hour window since 1 Oct 2026; volume tiers"],
  ["Authentication (one-time codes)", "RM 0.0564", "US$0.0140", "International authentication RM 0.1685; volume tiers"],
  ["Service (your free-form replies)", "RM 0.0564", "US$0.0140", "First 1,000 a month per number free, then charged"],
];

const free = [
  ["Your first 1,000 service messages a month", "Per business phone number; resets monthly and doesn’t roll over"],
  ["Calls your customers make to you", "All user-initiated WhatsApp calls are free"],
  ["Messages in a free entry point window", "After a customer writes to you from a Click-to-WhatsApp ad: up to 7 days on Meta’s page, 72 hours on some accounts"],
  ["The WhatsApp Business app itself", "Free to download and chat in; per-message charges belong to the API"],
];

const broadcasts = [
  ["500 customers", "RM 173.35"],
  ["1,000 customers", "RM 346.70"],
  ["5,000 customers", "RM 1,733.50"],
  ["10,000 customers", "RM 3,467.00"],
];

const platforms = [
  ["SleekFlow (Malaysia page, RM)", "Pro RM 399/month billed yearly (RM 4,788 a year), 1,000 active contacts, 3 users; Premium RM 1,199/month billed yearly", "RM 50 a month number hosting; message charges per SleekFlow’s rate card", "7-day Pro trial, no card"],
  ["respond.io (USD)", "Starter US$79/month yearly or US$99 monthly; Growth US$159 or US$199; Advanced US$279 or US$349", "WhatsApp fees not included: you top up WhatsApp credit on the platform", "7-day trial, no card"],
  ["WATI (USD)", "Growth US$39, Pro US$79, Business US$199 a month, billed yearly", "Template messages charged on top; extra numbers US$29 a month each", "7-day trial"],
];

const bill = [
  ["Service replies: 3,200 sent, 1,000 free, 2,200 × RM 0.0564", "RM 124.08"],
  ["Order updates as utility templates: 500 × RM 0.0564", "RM 28.20"],
  ["One promotion to 1,000 customers: 1,000 × RM 0.3467", "RM 346.70"],
  ["Meta charges, subtotal", "RM 498.98"],
  ["SleekFlow Pro (yearly billing) + number hosting: RM 399 + RM 50", "RM 449.00"],
  ["Total a month, before tax", "RM 947.98"],
];

const choose = [
  ["Send promotions to thousands of opted-in customers", "API", "Only the API sends approved marketing templates at scale"],
  ["Message customers first after 24 hours (reminders, delivery updates)", "API", "Outside the 24-hour window you need an approved template"],
  ["A team of agents in one shared inbox", "API platform", "SleekFlow, respond.io and WATI are built for this"],
  ["Answer customers who message you, 24 hours a day, with AI", "Wapzen", "Runs on the number you already use, with no Meta per-message charges"],
  ["Greeting and away messages only", "WhatsApp Business app", "Free, built in; see our Malay guide below"],
];

const sources = [
  { label: "Meta for Developers: WhatsApp Business Platform pricing (updated for 1 Oct 2026)", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Meta for Developers: WhatsApp calling pricing", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing" },
  { label: "respond.io: WhatsApp API pricing in Malaysia (updated 13 Nov 2026)", href: "https://respond.io/blog/whatsapp-api-pricing-malaysia" },
  { label: "ChatMaxima: WhatsApp API pricing Malaysia", href: "https://chatmaxima.com/whatsapp-api-pricing/malaysia/" },
  { label: "SleekFlow Malaysia pricing (RM)", href: "https://sleekflow.io/en-my/pricing" },
  { label: "respond.io pricing", href: "https://respond.io/pricing" },
  { label: "WATI pricing", href: "https://www.wati.io/pricing/" },
];

const questions = [
  {
    id: "cost",
    q: "How much does the WhatsApp Business API cost in Malaysia?",
    answer: "Two layers. Meta charges per delivered message: RM 0.3467 for marketing and RM 0.0564 for utility, authentication and service messages, with the first 1,000 service messages a month free per number. On top, the platform you use charges a monthly fee: SleekFlow Pro is RM 399 a month billed yearly, respond.io starts at US$79 and WATI at US$39.",
    body: <>
      <p>Meta doesn’t sell the API with a screen to chat in. Almost every Malaysian business goes through a platform (a Business Solution Provider or a tool built on one) that adds the inbox, broadcasts, chatbot builder and AI. So your bill is always <strong>Meta’s message charges + the platform’s plan</strong>, and sometimes a number hosting fee.</p>
      <p>Since 1 July 2025 Meta charges per message, not per 24-hour conversation, so the more you send, the more you pay.</p>
    </>,
  },
  {
    id: "rates",
    q: "What are Meta’s WhatsApp API rates in Malaysia in 2026?",
    answer: "On Meta’s Malaysian list prices from 1 October 2026: marketing RM 0.3467 per message, utility RM 0.0564, authentication RM 0.0564 (RM 0.1685 for international authentication) and service RM 0.0564 after the first 1,000 free each month. On a US-dollar account the same messages cost US$0.0860 and US$0.0140.",
    body: <>
      <Comparison caption="Meta’s WhatsApp Business API rates for Malaysia, per delivered message" columns={["MYR account", "USD account", "Notes"]} rows={rates} />
      <Note>These are the figures Malaysian providers publish from Meta’s rate card; Meta’s page links the card as a download. Check it before you budget, because Meta can reprice at the start of any quarter (1 January, 1 April, 1 July and 1 October). Rates are before tax.</Note>
    </>,
  },
  {
    id: "ringgit",
    q: "Can I pay Meta in ringgit (MYR)?",
    answer: "Yes. Meta added MYR as a billing currency on 1 April 2026. You choose the currency when the WhatsApp Business account is created, and you can’t change it later, so an older account set up in US dollars stays on the USD rate card unless it’s migrated. Ask your provider which currency your account bills in.",
    body: <>
      <p>Paying in ringgit removes exchange-rate swings from your WhatsApp bill. If your provider resells Meta’s messages through its own rate card, as SleekFlow does, the price you see is the provider’s, not Meta’s list price, so compare the two.</p>
    </>,
  },
  {
    id: "free",
    q: "Is anything free on the WhatsApp Business API?",
    answer: "Yes, a few things: the first 1,000 service messages a month on each business number, every call a customer makes to you, and all messages during a free entry point window, which opens when someone writes to you from a Click-to-WhatsApp ad. Utility templates sent inside the 24-hour window are no longer free since 1 October 2026.",
    body: <>
      <Comparison caption="What’s free on the WhatsApp Business API in Malaysia" columns={["Details"]} rows={free} />
    </>,
  },
  {
    id: "october",
    q: "What changed in WhatsApp API pricing on 1 October 2026?",
    answer: "Two things. Service messages, your free-form replies inside the 24-hour window, used to be free; now only the first 1,000 a month per number are free and the rest cost RM 0.0564 each. And utility templates sent inside an open customer service window, which had been free since July 2025, are charged at the utility rate.",
    body: <>
      <p>For a business that mostly answers questions, this is the change that matters: busy numbers now pay for replies. A shop sending 3,200 replies a month pays for 2,200 of them, about RM 124. Some older articles and even parts of Meta’s marketing site still say service messages are free; Meta’s developer pricing page, updated for 1 October 2026, says otherwise.</p>
    </>,
  },
  {
    id: "broadcast",
    q: "How much does a WhatsApp broadcast cost in Malaysia?",
    answer: "On the API, each delivered promotional message is a marketing message: RM 0.3467 on a ringgit account. A broadcast to 1,000 customers costs about RM 346.70 in Meta charges and 10,000 customers about RM 3,467, plus your platform’s plan. Marketing messages have no volume discount, and every recipient must have opted in.",
    body: <>
      <Comparison caption="Meta charges for one promotional broadcast, MYR account" columns={["Meta charges"]} rows={broadcasts} />
      <p>Messages that fail to deliver aren’t charged. Broadcast lists in the WhatsApp Business app work differently: they reach up to 256 contacts at a time, and only people who saved your number receive them.</p>
    </>,
  },
  {
    id: "platforms",
    q: "How much do SleekFlow, respond.io and WATI cost in Malaysia?",
    answer: "SleekFlow’s Malaysian page shows Pro at RM 399 a month and Premium at RM 1,199 a month, billed yearly, plus RM 50 a month to host the number. respond.io starts at US$79 a month billed yearly (US$99 monthly). WATI starts at US$39 a month billed yearly. Meta’s message charges come on top of all three.",
    body: <>
      <Comparison caption="WhatsApp API platforms: entry prices seen from Malaysia" columns={["Plans", "Meta’s message charges", "Trial"]} rows={platforms} />
      <p>Only SleekFlow showed ringgit prices; respond.io and WATI bill in US dollars. Plans also differ in what they count: SleekFlow and respond.io count monthly active contacts and AI credits, and broadcasts on respond.io need the Growth plan or above. For WATI in more detail, read our <Link href="/blog/wati-pricing">WATI pricing</Link> breakdown.</p>
    </>,
  },
  {
    id: "example",
    q: "What does a typical Malaysian SME pay a month for the WhatsApp API?",
    answer: "Take an online shop on a ringgit account that sends 3,200 replies, 500 order updates and one promotion to 1,000 customers a month. Meta charges about RM 499, and SleekFlow Pro with number hosting adds RM 449, so roughly RM 948 a month before tax. Without the promotion it’s about RM 601.",
    body: <>
      <Comparison caption="Worked monthly bill: an online shop in Selangor (example)" columns={["Amount"]} rows={bill} />
      <p>The figures are illustrative: SleekFlow charges messages from its own rate card, which may differ from Meta’s list price, and a busier month moves every line. The pattern holds, though. Replies and order updates are cheap; <strong>promotions are where the bill grows</strong>.</p>
    </>,
  },
  {
    id: "volume",
    q: "Are there volume discounts on WhatsApp API messages in Malaysia?",
    answer: "Only for utility and authentication messages. Meta lowers their rate in steps as monthly volume grows, counted across your business portfolio; respond.io puts Malaysia’s first utility discount at message 150,001 a month (RM 0.0536) and the first authentication discount at 100,001. Marketing and service messages have no volume tiers.",
    body: <>
      <p>Most SMEs never reach a tier. If you send hundreds of thousands of order updates or one-time codes a month, ask your provider whether its rate card passes Meta’s tier discounts on to you.</p>
    </>,
  },
  {
    id: "need-api",
    q: "Do I need the WhatsApp Business API at all?",
    answer: "Only if you need what only the API does: promotions to thousands of opted-in customers, template messages after the 24-hour window, or many staff in one shared inbox. If you mainly answer people who message you, the free WhatsApp Business app or an AI agent on your existing number does the job without Meta’s per-message charges.",
    body: <>
      <Comparison caption="Which WhatsApp setup fits what you need" columns={["Use", "Why"]} rows={choose} />
      <p>Setting up automatic greeting and away messages in the app takes five minutes: our Malay guide <Link href="/ms/blog/cara-buat-auto-reply-whatsapp">Cara buat auto reply WhatsApp Business</Link> walks through it with 15 copy-paste messages.</p>
    </>,
  },
  {
    id: "cheapest-ai",
    q: "What’s the cheapest way to put an AI chatbot on WhatsApp in Malaysia?",
    answer: "Wapzen puts an AI agent on the WhatsApp number you already use, personal or Business, linked with a pairing code or QR code like WhatsApp Web. It answers in Malay or English from your price list and instructions, takes orders and reads voice notes and photos. It’s free to start, needs no card or Meta API account, and Meta charges nothing per message.",
    body: <>
      <ol>
        <li><strong>Write your instructions:</strong> what you sell, prices, delivery charges to Peninsular Malaysia and Sabah or Sarawak, opening hours, how customers pay (DuitNow QR, bank transfer) and when to hand over to you.</li>
        <li><strong>Sign up free</strong> and link your number with the 8-character code in WhatsApp › Linked devices › Link a device › Link with phone number instead.</li>
        <li><strong>Add your price list</strong> as text, PDF or Word, and product photos the agent can send.</li>
        <li><strong>Switch on Take Order</strong> and add the WhatsApp number that should get an alert for every order.</li>
        <li><strong>Test it</strong> from another phone, in Malay and in English.</li>
      </ol>
      <InlineCta title="Answer every WhatsApp customer with AI" body="Free to start, with no card, no Meta API account and no per-message charges." label="Start free" />
      <Note>Wapzen is our own product and isn’t made by Meta or WhatsApp. It doesn’t send broadcasts or message customers first, so it won’t replace the API for promotions; use it to answer people who contact you. It has no green tick or approved templates, and messages are processed outside Malaysia (details in our <Link href="/privacy">privacy policy</Link>), which matters for your obligations under the Personal Data Protection Act 2010.</Note>
    </>,
  },
];

export default function WhatsAppBusinessApiPricingMalaysiaPage() {
  return <QaPost
    href={href}
    heading={<>WhatsApp Business API pricing in Malaysia.<br /><span>Meta’s ringgit rates, platform fees and real monthly bills.</span></>}
    lead="What a Malaysian business really pays for the WhatsApp Business API in 2026: Meta’s per-message rates in ringgit, what changed on 1 October 2026, what’s still free, how much a broadcast costs, the plans of SleekFlow, respond.io and WATI, a worked monthly bill, and when you don’t need the API at all."
    verdict={{
      title: "The short answer",
      body: <>Meta charges Malaysian businesses <strong>RM 0.3467 per marketing message</strong> and <strong>RM 0.0564 per utility, authentication or service message</strong>, with the first 1,000 service replies a month free on each number. Platforms add a monthly plan, from about <strong>RM 399 (SleekFlow Pro, yearly)</strong> or <strong>US$39 to US$79</strong> on WATI and respond.io. In our worked example, an online shop pays about RM 600 a month for replies and order updates, or about RM 950 with one promotion to 1,000 customers. If you only need to answer customers, <strong>Wapzen puts an AI agent on your existing number with no per-message charges, free to start</strong>.</>,
    }}
    facts={[["Marketing message", "RM 0.3467"], ["Utility / service", "RM 0.0564"], ["Free service replies", "1,000 a month per number"], ["Billing in MYR", "Since 1 April 2026"]]}
    indexTitle="The 11 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/is-whatsapp-business-api-free", "/ms/blog/cara-buat-auto-reply-whatsapp"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>Answer WhatsApp customers with AI.<br /><span>No Meta per-message charges, free to start.</span></>, body: "Sign up, link the number your customers already use and give the agent your price list. No card and no API account needed." }}
  />;
}
