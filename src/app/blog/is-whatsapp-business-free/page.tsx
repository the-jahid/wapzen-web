import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp business premium features" (62, 5/5), "is whatsapp business
// free" (61), "whatsapp business price" (60, 5/5), "whatsapp business premium
// price" (53), "whatsapp business subscription" (49), autocomplete 2026-11-05.
// Search Console: the es-mx and pt-br versions of this question had 99 and 25
// impressions at positions 11.2 and 13.6, and English had no page for it. Meta One
// from about.fb.com (15 Sep 2026). Premium has no official price sheet. API rates
// match /blog/whatsapp-business-api-pricing; recheck both each quarter.
const href = "/blog/is-whatsapp-business-free";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const costs = [
  ["WhatsApp Business app", "Free", "Business profile, catalog, greeting and away messages, quick replies, labels, chats and calls"],
  ["Regular broadcast lists", "Free", "Up to 256 contacts a list; only people who saved your number receive it"],
  ["Business broadcasts", "Per delivered message, by country", "Also reaches people who haven’t saved your number, with reporting"],
  ["WhatsApp Business Premium", "No official price list; reports say about $5 to $15 a month", "Custom web page and link, up to 10 linked devices, chat assignment"],
  ["Meta One business plans", "From $14.99 a month", "Verified badge, impersonation protection, Meta Business Agent, broadcast credits on higher plans"],
  ["WhatsApp Business API", "Per message, usually plus a provider plan", "Campaigns at scale, large teams, integrations"],
];

const metaOne = [
  ["Essential", "From $14.99", "Meta Business Agent, verified badge, verified channel, impersonation protection"],
  ["Advanced", "From $49.99", "More linked devices, business broadcast credits, more agent responses"],
  ["Expert", "From $149", "Higher feature access and agent capacity for teams"],
  ["Max", "From $499", "The highest feature access and agent capacity"],
];

const rates = [
  ["India", "$0.0118 (₹0.8631)", "$0.0014 (₹0.115)"],
  ["United States & Canada", "$0.0250", "$0.0034"],
  ["United Kingdom", "$0.0635", "$0.0220"],
  ["Brazil", "$0.0625", "$0.0068"],
  ["Mexico", "$0.0397", "$0.0085"],
  ["Indonesia", "$0.0411", "$0.0250"],
];

const faqs = [
  { q: "Is WhatsApp Business free?", a: "Yes. The WhatsApp Business app is free to download and use, including chats, calls, a catalog, greeting and away messages, quick replies and labels. You pay only if you choose extras: business broadcasts, a Premium or Meta One subscription, or the WhatsApp Business API." },
  { q: "Does WhatsApp Business have a monthly fee?", a: "Not for the app itself. Monthly fees apply only to optional subscriptions such as Meta One business plans, which start from $14.99 a month, and to the plans of Business API providers." },
  { q: "How much is WhatsApp Business Premium?", a: "Meta hasn't published one price for every country. Reports put it at roughly $5 to $15 a month, and it's still rolling out. If your app offers it, the price for your account appears under Settings › Premium." },
  { q: "What is Meta One, and do I need it?", a: "Meta One is Meta's subscription across Facebook, Instagram, WhatsApp and Meta AI, launched for businesses worldwide on 15 September 2026. Plans run from $14.99 to $499 a month. You don't need it to use WhatsApp Business; the core app stays free." },
  { q: "Do I pay when customers message me?", a: "No. Meta doesn't charge for messages customers send to your business, in the app or on the API." },
  { q: "Are WhatsApp broadcasts free?", a: "Regular broadcast lists are free, for up to 256 contacts a list, and reach only people who saved your number. Business broadcasts, which also reach people who haven't saved it, are charged per delivered message." },
  { q: "Is there a free way to answer WhatsApp customers with AI?", a: "Yes. Everything in Wapzen is free right now. It links your existing number by QR code or pairing code, then an AI chat agent answers messages and an AI voice agent handles WhatsApp calls, with no Meta per-message fees." },
];

const sources = [
  { label: "Meta: Introducing Meta One (15 Sep 2026)", href: "https://about.fb.com/news/2026/09/introducing-meta-one/" },
  { label: "SleekFlow: Meta One for business", href: "https://sleekflow.io/en-gb/blog/meta-one-for-business" },
  { label: "SleekFlow: WhatsApp Business Premium", href: "https://sleekflow.io/blog/whatsapp-business-premium" },
  { label: "WhatsApp Help Center: business broadcast pricing", href: "https://faq.whatsapp.com/1356785542323967" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const sections = [
  {
    id: "short-answer",
    title: "Is WhatsApp Business free? The short answer",
    body: <>
      <p><strong>The WhatsApp Business app is free.</strong> You download it, register a number and serve customers without paying Meta anything. The confusion comes from the paid extras around it, which have multiplied since 2025. Here’s the whole map:</p>
      <Comparison caption="What is free and what is paid around WhatsApp Business in 2026" columns={["Price", "What you get"]} rows={costs} />
      <p>If you only chat with customers and use the catalog and automatic messages, your bill stays at zero.</p>
    </>,
  },
  {
    id: "premium",
    title: "WhatsApp Business Premium: features and price",
    body: <>
      <p><strong>WhatsApp Business Premium</strong> is an optional upgrade inside the app. It adds a simple web page with a custom short link, up to 10 linked devices, chat assignment and, as it rolls out, basic analytics.</p>
      <p>Meta hasn’t published a price list for it. Reports suggest about <strong>$5 to $15 a month</strong>, varying by country, usually with a 30-day trial. It’s still rolling out, so it may not appear in your app. Where it’s offered, you’ll find it under <strong>Settings › Premium</strong>, along with the price for your account.</p>
      <p>The extra devices and web page are the main reasons to pay. Premium doesn’t make the app answer customers for you.</p>
    </>,
  },
  {
    id: "meta-one",
    title: "Meta One plans for businesses",
    body: <>
      <p><strong>Meta One</strong> is Meta’s subscription across its apps. Its business and creator plans launched worldwide on 15 September 2026:</p>
      <Comparison caption="Meta One business plans in US dollars" columns={["Price a month", "What it adds on WhatsApp"]} rows={metaOne} />
      <p>Meta says plans and prices can vary by region, app and account, so check the offer shown to you. Meta describes Expert and Max in almost the same words, so compare them carefully before paying for the higher one.</p>
    </>,
  },
  {
    id: "broadcasts",
    title: "Regular broadcasts vs business broadcasts",
    body: <>
      <ul>
        <li><strong>Regular broadcast lists are free.</strong> Each list holds up to 256 contacts, and only people who saved your number get the message.</li>
        <li><strong>Business broadcasts are paid.</strong> They also reach people who haven’t saved your number and show how many read them. You pay per delivered message, at a rate set by country. In Brazil, for example, it’s R$0.3217 a message before tax.</li>
      </ul>
    </>,
  },
  {
    id: "api",
    title: "What the WhatsApp Business API costs",
    body: <>
      <p>The API is a separate product for software, not an app you open. Meta charges per delivered message, and most businesses also pay a provider’s monthly plan. Replies to customers are free for the first 1,000 a month per number. Meta’s list rates from 1 October 2026:</p>
      <Comparison caption="Meta list rates per message for selected countries" columns={["Marketing", "Utility and service"]} rows={rates} />
      <p>A worked example: 4,000 marketing messages and 2,000 paid service replies in India cost about ₹3,682 in Meta fees (4,000 × ₹0.8631 + 2,000 × ₹0.115), before tax and the provider’s plan. More countries and examples are in <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>, and the differences are in <Link href="/blog/whatsapp-business-app-vs-api">WhatsApp Business app vs API</Link>.</p>
      <Note>Meta reviews rates each quarter, on 1 January, April, July and October. Check its current card before you budget.</Note>
    </>,
  },
  {
    id: "which",
    title: "What should a small business pay for?",
    body: <>
      <ul>
        <li><strong>Just talking to customers:</strong> stay on the free app.</li>
        <li><strong>Want a verified badge:</strong> look at Meta One Essential.</li>
        <li><strong>Several staff on one number:</strong> check Premium or Meta One Advanced.</li>
        <li><strong>Large campaigns to opted-in lists:</strong> compare business broadcasts with the API.</li>
        <li><strong>Want AI to answer every chat and call:</strong> you don’t need any paid tier. Wapzen does it for free.</li>
      </ul>
    </>,
  },
  {
    id: "free-ai",
    title: "Add AI to WhatsApp for free",
    body: <>
      <p><strong>Everything in Wapzen is free right now.</strong> It links the number you already use, personal or Business, by QR code or pairing code. An AI chat agent answers messages from your instructions and documents, and an AI voice agent handles WhatsApp calls. There are no Meta per-message fees, because Wapzen doesn’t use the Business API.</p>
      <InlineCta title="Put a free AI agent on your number" body="Link your WhatsApp number, tell the agent about your business, and let it answer your customers." />
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device.</Note>
    </>,
  },
];

export default function IsWhatsAppBusinessFreePage() {
  return <BlogPost
    href={href}
    heading={<>Is WhatsApp Business free?<br /><span>What’s free and what’s paid.</span></>}
    lead="The app is free, yet Premium, Meta One, business broadcasts and the API all cost money. Here’s what each one charges in 2026, what you get, and which of them a small business actually needs."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>The WhatsApp Business app is free,</strong> with no monthly fee, and customers’ messages to you are never charged.</>,
        <><strong>Optional extras cost money:</strong> Meta One from $14.99 a month, Premium at a reported $5 to $15, and business broadcasts per message.</>,
        <><strong>The API is separate:</strong> Meta charges per message, usually with a provider plan on top.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-api-pricing", "/blog/whatsapp-business-app-vs-api"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Keep WhatsApp free.<br /><span>Add AI that answers for you.</span></>, body: "Everything in Wapzen is free right now: an AI chat agent and voice agent on your existing WhatsApp number, with no Business API." }}
  />;
}
