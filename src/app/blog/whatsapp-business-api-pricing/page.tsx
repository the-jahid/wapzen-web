import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp business api pricing" (104), "…pricing india" (94),
// "…cost" (56), "…cost per message" (51), "…charges" (47), "whatsapp
// marketing message cost" (40), autocomplete 2026-10-27. Rates are Meta's
// cards effective 1 October 2026 (two independent reprints agreed; Meta's own
// pricing page confirmed the model and the 1 October changes). Meta updates
// rates every quarter (1 Jan/Apr/Jul/Oct): recheck the table and the worked
// examples then, and bump `updated`.
const href = "/blog/whatsapp-business-api-pricing";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const categories = [
  ["What it is", "Offers, announcements, reminders to come back", "Order updates, receipts, appointment reminders", "One-time passcodes", "Free-form replies to a customer"],
  ["Needs an approved template", "Yes", "Yes", "Yes", "No"],
  ["When you can send it", "Any time, to opted-in users", "Any time, to opted-in users", "Any time", "Only within 24 hours of the customer’s last message"],
  ["Charged", "Every delivered message", "Every delivered message", "Every delivered message", "After 1,000 free a month per number"],
];

const rates = [
  ["India", "$0.0118 (₹0.8631)", "$0.0014 (₹0.115)"],
  ["United States & Canada", "$0.0250", "$0.0034"],
  ["United Kingdom", "$0.0635", "$0.0220"],
  ["Germany", "$0.1365", "$0.0550"],
  ["Brazil", "$0.0625", "$0.0068"],
  ["Mexico", "$0.0397", "$0.0085"],
  ["Indonesia", "$0.0411", "$0.0250"],
  ["United Arab Emirates", "$0.0576", "$0.0157"],
  ["Saudi Arabia", "$0.0576", "$0.0107"],
  ["Nigeria", "$0.0516", "$0.0067"],
];

const faqs = [
  { q: "Is the WhatsApp Business API free?", a: "Not entirely. Meta doesn't charge for access or for messages customers send you, but it charges for every delivered template message, and since 1 October 2026 for service replies beyond 1,000 a month per business number. Most providers also charge a monthly plan or a per-message markup." },
  { q: "How much does WhatsApp charge per message in India?", a: "From 1 October 2026, Meta's India rates are ₹0.8631 per marketing message and ₹0.115 per utility, authentication, or service message (service only after the first 1,000 a month per number), before GST and your provider's fees. Indian businesses are being moved to rupee billing, which must be done by 31 December 2026." },
  { q: "Are WhatsApp service messages still free?", a: "Only the first 1,000 a month per business phone number. From 1 October 2026, service messages above that are charged at the market's utility rate, and utility templates sent inside an open customer service window are charged too. Eligible government and non-profit organisations keep free service messages until 31 December 2027." },
  { q: "What is the 24-hour customer service window?", a: "When a customer messages you, a 24-hour window opens in which you can reply with free-form messages instead of approved templates. Each new message from the customer restarts it. Outside the window, you can only send approved templates." },
  { q: "What is a free entry point conversation?", a: "When someone messages you from a Click to WhatsApp ad or a Facebook Page call-to-action, a free entry point window opens for up to 7 days, in which marketing, utility, authentication, and service messages are free." },
  { q: "Do I pay for messages customers send me?", a: "No. Meta doesn't charge for messages from users to businesses. Some providers charge per message in both directions, though, so check your provider's own pricing." },
  { q: "Is there a cheaper alternative to the WhatsApp Business API?", a: "If you mainly answer customers who message you, a tool that links your number by QR code avoids Meta's message fees entirely. Wapzen does this with an AI chatbot and voice agent and is currently free. It doesn't send broadcasts, so if bulk campaigns are your main use, the API is still the right tool." },
];

const sources = [
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Meta: messaging limits", href: "https://developers.facebook.com/docs/whatsapp/messaging-limits" },
  { label: "Rate table reprint: FlowCall", href: "https://www.flowcall.co/blog/whatsapp-business-api-pricing" },
  { label: "Rate table reprint: Drag", href: "https://www.dragapp.com/blog/whatsapp-business-api-pricing/" },
];

const sections = [
  {
    id: "how-it-works",
    title: "How WhatsApp Business API pricing works",
    body: <>
      <p>Since 1 July 2025, Meta has charged <strong>per delivered message</strong>, not per conversation. The price of each message depends on two things: its <strong>category</strong>, and the <strong>country code of the person receiving it</strong>. A marketing message to an Indian number costs something different from the same message to a UK number. Messages customers send to you are free.</p>
      <Comparison caption="The four WhatsApp Business API message categories" columns={["Marketing", "Utility", "Authentication", "Service"]} rows={categories} />
      <p>Utility and authentication messages also get <strong>volume tiers</strong>: the more you send in a month across your business portfolio, the lower the rate for the messages in the higher tiers. Marketing and service messages don’t.</p>
      <Note>Meta also sells its own AI agent for businesses, billed by usage at $2.00 per million tokens. It’s a separate product from the four categories above.</Note>
    </>,
  },
  {
    id: "october-2026",
    title: "What changed on 1 October 2026",
    body: <>
      <p>The biggest pricing change since per-message billing landed this month. Until 30 September, every free-form reply inside the 24-hour window was free. From <strong>1 October 2026</strong>:</p>
      <ul>
        <li><strong>Service messages are charged after a free tier.</strong> Each business phone number gets 1,000 free service messages a month. After that, every service message costs the market’s utility rate. The free tier doesn’t roll over.</li>
        <li><strong>Utility templates sent inside an open window are charged.</strong> They had been free there since July 2025.</li>
        <li><strong>Click to WhatsApp ads keep their free window.</strong> A conversation that starts from an ad or a Page call-to-action is free for up to 7 days.</li>
        <li><strong>No payment method, no delivery.</strong> Meta said it would stop delivering service messages for businesses without a payment method on file once they become chargeable.</li>
        <li><strong>Government and non-profits are exempt</strong> from service charges beyond the free tier until 31 December 2027, if eligible.</li>
      </ul>
      <p>Meta also updated 40 rates the same day, with marketing prices rising in Mexico, Saudi Arabia, and the UAE. India, North America, the UK, the EU, and Brazil kept their rates.</p>
      <p>What this means in practice: a chatbot that answers thousands of questions a month, which used to cost nothing in Meta fees, now has a per-reply cost on the API. Bots that send three short messages where one would do now cost three times as much.</p>
    </>,
  },
  {
    id: "rates",
    title: "Meta’s per-message rates by country",
    body: <>
      <p>Meta’s rates effective 1 October 2026, per delivered message, before volume tiers, tax, and provider fees:</p>
      <Comparison caption="Meta WhatsApp Business API rates by country from 1 October 2026" columns={["Marketing", "Utility, authentication & service"]} rows={rates} />
      <p>Service messages are charged at the utility rate once a number passes its 1,000 free a month. Several markets, India, Indonesia, the UAE, Saudi Arabia, and Nigeria among them, also have a higher <strong>authentication-international</strong> rate for passcodes sent by businesses based abroad, $0.0304 for India.</p>
      <h3>India pricing in rupees</h3>
      <p>Meta began billing Indian businesses in rupees on 1 January 2026. Eligible accounts must switch to INR by <strong>31 December 2026</strong>; from 1 January 2027 Meta says it will stop delivering messages for India accounts that haven’t. In rupees, a marketing message costs ₹0.8631 and a utility, authentication, or service message ₹0.115, plus GST. India’s marketing rate went up on 1 January 2026.</p>
      <Note>Meta changes rates every quarter (1 January, April, July, and October). Check Meta’s rate card before you budget, and remember that your provider may bill you a higher rate than Meta’s.</Note>
    </>,
  },
  {
    id: "real-cost",
    title: "What a month really costs: three examples",
    body: <>
      <p>Rates per message look tiny. Monthly bills don’t. Three realistic businesses at 1 October 2026 rates, counting Meta’s fees only:</p>
      <h3>A skincare store in India</h3>
      <ul>
        <li>3,000 customer chats with about 4 replies each: 12,000 service messages, 11,000 after the free tier × ₹0.115 = <strong>₹1,265</strong></li>
        <li>1,500 order and shipping updates (utility) × ₹0.115 = <strong>₹173</strong></li>
        <li>Two offers to 2,000 opted-in customers: 4,000 marketing messages × ₹0.8631 = <strong>₹3,452</strong></li>
      </ul>
      <p>About <strong>₹4,890 a month</strong> plus GST, before the provider’s plan, which is often the bigger number in India.</p>
      <h3>A dental practice in the US</h3>
      <ul>
        <li>800 patient chats × 5 replies: 4,000 service messages, 3,000 charged × $0.0034 = <strong>$10.20</strong></li>
        <li>1,000 appointment reminders (utility) × $0.0034 = <strong>$3.40</strong></li>
      </ul>
      <p>About <strong>$14 a month</strong> in Meta fees. In the US, the provider’s plan is almost all of the bill.</p>
      <h3>An online shop in the UK</h3>
      <ul>
        <li>2,000 chats × 4 replies: 8,000 service messages, 7,000 charged × $0.022 = <strong>$154</strong></li>
        <li>2,000 marketing messages × $0.0635 = <strong>$127</strong></li>
      </ul>
      <p>About <strong>$281 a month</strong>. In the UK and most of Europe, Meta’s fees can be bigger than the plan, and since October, answering customers is no longer free.</p>
    </>,
  },
  {
    id: "provider-fees",
    title: "Provider fees on top of Meta’s",
    body: <>
      <p>Few businesses pay Meta directly. Most use a provider (a Business Solution Provider, or BSP) such as WATI, AiSensy, or Interakt, which adds one or more of these:</p>
      <ul>
        <li><strong>A monthly plan,</strong> often priced by the number of team members or contacts.</li>
        <li><strong>A markup per message</strong> above Meta’s rate. For example, AiSensy lists ₹1.09 per marketing message in India against Meta’s ₹0.8631.</li>
        <li><strong>Paid add-ons</strong> for the chatbot builder, AI agents, or AI replies, which can cost more than the plan itself.</li>
      </ul>
      <p>Going direct with Meta’s Cloud API avoids the markup, but then you build and host the inbox, the chatbot, and the integrations yourself. The <Link href="/blog/n8n-whatsapp-ai-agent">n8n guide</Link> shows what that involves. For plan prices side by side, see <Link href="/blog/wati-vs-aisensy-vs-interakt">WATI vs AiSensy vs Interakt</Link>.</p>
    </>,
  },
  {
    id: "cut-costs",
    title: "How to keep the bill down",
    body: <>
      <ul>
        <li><strong>Answer in one message, not three.</strong> Service replies are now charged per message, so one complete answer is cheaper than a string of short ones. Tell your chatbot to reply in a single message.</li>
        <li><strong>Start conversations from ads.</strong> Chats opened from Click to WhatsApp ads are free for up to 7 days.</li>
        <li><strong>Don’t blast cold lists.</strong> Marketing is the most expensive category, and low-quality campaigns can also hurt your messaging limits.</li>
        <li><strong>Send utility, not marketing, where it’s honest.</strong> An order update is utility; a discount is marketing. Meta reviews template categories, so don’t disguise offers.</li>
        <li><strong>Compare providers on the per-message rate,</strong> not just the plan price.</li>
        <li><strong>Ask whether you need the API at all.</strong> If your WhatsApp is mostly customers asking questions, you may not.</li>
      </ul>
      <InlineCta title="Answer customers with no per-message fees" body="Wapzen’s AI agent answers your WhatsApp messages and calls on your existing number, linked by QR code. Currently free." />
    </>,
  },
  {
    id: "without-api",
    title: "Can you avoid Meta’s fees entirely?",
    body: <>
      <p>Yes, if you don’t need broadcasts. Meta’s fees apply to the Business API. A number linked as a device with a QR code, the way WhatsApp Web works, isn’t on the API, so there are no per-message charges at all.</p>
      <p>That’s how Wapzen works. An AI chat agent answers the messages your number receives, using your knowledge base, and an AI voice agent can answer and make WhatsApp calls. It’s <Link href="/pricing">currently free</Link>, with the AI models included.</p>
      <p>The trade-offs are real: no bulk broadcasts, no multi-agent team inbox, and it isn’t Meta’s official route. If campaigns to thousands of contacts are the core of your WhatsApp, pay for the API. If answering customers is, read <Link href="/blog/whatsapp-business-app-vs-api">WhatsApp Business app vs API</Link> or the <Link href="/whatsapp-business-api-alternative">Business API alternative</Link> page.</p>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. Use it to answer people who contact you, never to message people who didn’t: WhatsApp restricts numbers that send bulk or unwanted messages.</Note>
    </>,
  },
];

export default function WhatsAppBusinessApiPricingPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp Business API pricing.<br /><span>What you really pay in 2026.</span></>}
    lead="Meta charges per message, by category and country, and since 1 October 2026 even replies to customers cost money beyond a free tier. Here are the current rates for India, the US, the UK and more, three worked monthly bills, and how to keep the cost down."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Meta charges per delivered message,</strong> by category (marketing, utility, authentication, service) and by the recipient’s country.</>,
        <><strong>Since 1 October 2026,</strong> service replies are free only for the first 1,000 a month per number; after that they cost the utility rate.</>,
        <><strong>India:</strong> ₹0.8631 per marketing message and ₹0.115 per utility or service message. <strong>US:</strong> $0.025 and $0.0034. Provider fees and tax come on top.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-app-vs-api", "/blog/what-is-a-whatsapp-chatbot"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>Skip the per-message bill.<br /><span>Answer customers free.</span></>, body: "Put an AI agent on your existing WhatsApp number with a QR code. No Business API, no Meta fees, no credit card." }}
  />;
}
