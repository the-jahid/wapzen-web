import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta } from "@/components/blog/BlogPost";

// Targets "whatsapp order automation". Keep it in step with the product: there
// is no per-chat AI pause or team inbox, so handoff means alerting a person
// through an API request tool. If a takeover feature ships, rewrite Step 5.
const href = "/blog/reduce-missed-whatsapp-orders";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const metrics = [
  ["First response time", "How quickly customers receive an initial answer"],
  ["Order completion rate", "How many started order conversations result in confirmed orders"],
  ["Incomplete orders", "How often necessary customer details are missing"],
  ["Failed order submissions", "How often an automation cannot save an order"],
  ["Human escalation rate", "How often customers require staff assistance"],
];

const faqs = [
  { q: "Can AI prevent missed WhatsApp orders?", a: "AI can help reduce missed enquiries by answering routine messages promptly and guiding customers through order collection. Reliable order submission and monitoring are also necessary." },
  { q: "Can I automate WhatsApp without the Business API?", a: "Yes. Wapzen offers a QR-linked approach for AI chat. It differs from the official WhatsApp Business API, particularly in areas such as bulk messaging and team inbox features." },
  { q: "What should I automate first?", a: "Start with frequently asked questions and standard order collection. Add transactional actions after testing them carefully." },
];

const sources = [
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
  { label: "WhatsApp Help Center: How to link a device", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "why",
    title: "Why businesses miss WhatsApp orders",
    body: <>
      <p>It’s 7 PM, and your business is receiving more WhatsApp messages than usual. One customer wants to know whether an item is available. Another is ready to place an order. A third customer needs to change a delivery address. Meanwhile, new messages keep arriving.</p>
      <p>A missed WhatsApp message may be a missed sale, an unresolved customer problem or an order that never reaches the fulfillment team.</p>
      <p>Most missed orders are caused by problems in the process rather than a lack of customer interest.</p>
      <h3>Slow initial responses</h3>
      <p>Customers message because they expect a convenient conversation.</p>
      <p>If your team is occupied with existing orders, new enquiries may remain unanswered for too long.</p>
      <h3>Repeated questions</h3>
      <p>A business might receive the same questions about opening hours, sizes, shipping charges and payment methods dozens of times.</p>
      <p>Answering those manually leaves less time for actual order processing.</p>
      <h3>Incomplete order details</h3>
      <p>A customer sends a product name, but no quantity. Another provides an address without a phone number.</p>
      <p>Your team must go back and forth to collect missing information, creating additional messages and delays.</p>
      <h3>No central order record</h3>
      <p>If orders live only inside WhatsApp conversations, employees must scroll through chats to reconstruct what customers purchased.</p>
      <p>That increases the risk of missing an order or processing the wrong details.</p>
    </>,
  },
  {
    id: "find-stuck-orders",
    title: "Step 1: Identify where your orders get stuck",
    body: <>
      <p>Start by reviewing recent customer conversations.</p>
      <p>Look for messages that received late responses, orders that required repeated clarification, and customers who asked the same question more than once.</p>
      <p>Separate these conversations into three categories: product questions, order collection and problems requiring staff attention.</p>
      <p>This shows which tasks are repetitive enough to automate.</p>
    </>,
  },
  {
    id: "product-questions",
    title: "Step 2: Automate common product questions",
    body: <>
      <p>An AI chatbot can respond to questions using a business knowledge base.</p>
      <p>For example, it can explain product options, general delivery policies, opening hours and payment methods.</p>
      <p>The knowledge base should contain accurate, up-to-date information written in clear language.</p>
      <p>If prices or inventory change frequently, connect the relevant live system rather than expecting the chatbot to know changes automatically.</p>
    </>,
  },
  {
    id: "collect-orders",
    title: "Step 3: Standardize how orders are collected",
    body: <>
      <p>Every order should contain the information necessary for fulfillment.</p>
      <p>A retail business may need a product code, quantity, variant, customer contact information and delivery destination.</p>
      <p>A service provider may need different information.</p>
      <p>Create a consistent process so an assistant or team member collects the same essential fields every time.</p>
      <p>Before saving the order, show the customer a summary and request confirmation. Our <Link href="/blog/whatsapp-order-confirmation-messages">25 order confirmation messages</Link> are a starting point for that wording.</p>
    </>,
  },
  {
    id: "connect-system",
    title: "Step 4: Connect conversations to your order system",
    body: <>
      <p>An AI conversation becomes significantly more useful when it can trigger a reliable business action.</p>
      <p>For example, a confirmed order could be sent to an order management application through an API.</p>
      <p>Your system should return a unique order ID and record whether the submission succeeded.</p>
      <p>It should also prevent duplicate orders when a request is accidentally retried.</p>
      <p>This creates a clear separation between the WhatsApp conversation and the official transaction record.</p>
    </>,
  },
  {
    id: "escalate",
    title: "Step 5: Escalate exceptions to a human",
    body: <>
      <p>Not every conversation should be automated.</p>
      <p>Customers may request unusual discounts, dispute a payment, complain about a damaged product or ask for something outside normal business rules.</p>
      <p>The assistant should recognize those situations and arrange human assistance.</p>
      <p>When using <Link href="/">Wapzen</Link>, an API request tool can be configured to alert your team about conversations needing attention.</p>
      <p>Businesses should understand that Wapzen’s current handoff approach is not the same as a dedicated multi-agent team inbox with a per-chat AI pause.</p>
      <p>For a simple way to decide what goes to a person, see <Link href="/blog/zen-whatsapp-workflow#sort-the-work">sorting messages into answer, action or human</Link>.</p>
    </>,
  },
  {
    id: "measure",
    title: "Step 6: Measure whether automation is working",
    body: <>
      <p>You don’t need a complicated analytics system to start improving results. Track these five numbers:</p>
      <Comparison caption="Five numbers to track for WhatsApp order automation" columns={["What it tells you"]} rows={metrics} />
      <p>These measurements help identify where the process still needs improvement.</p>
      <p>For example, if customers respond quickly but frequently abandon an order while providing delivery information, your order collection process may be asking too many questions.</p>
    </>,
  },
  {
    id: "wapzen",
    title: "How Wapzen fits into this workflow",
    body: <>
      <p>Wapzen combines WhatsApp AI chat agents, business knowledge bases, API request tools, a built-in Take Order tool and conversation history.</p>
      <p>You can connect your existing number using a QR code or a pairing code, configure the assistant to handle routine questions and add tools for order-related actions.</p>
      <p>For businesses receiving repetitive customer enquiries, this can provide a practical starting point without requiring an entirely new messaging system.</p>
      <p>Advanced order-processing actions still depend on the connected business systems and how the workflow has been configured.</p>
      <InlineCta title="Answer every WhatsApp order, even at 7 PM" body="Free to start: an AI chat agent that replies right away, collects order details, and saves confirmed orders to your dashboard." />
    </>,
  },
  {
    id: "next",
    title: "Stop letting busy hours slow down your business",
    body: <>
      <p>A growing number of customer conversations should not automatically mean a growing number of unanswered messages.</p>
      <p>With a well-designed workflow, your team can spend less time repeating basic information and more time delivering a better customer experience.</p>
      <p>Ready to set it up? Start with our <Link href="/blog/whatsapp-order-taking-chatbot">WhatsApp order taking chatbot guide</Link>.</p>
    </>,
  },
];

export default function ReduceMissedWhatsAppOrdersPage() {
  return <BlogPost
    href={href}
    heading={<>Reduce missed WhatsApp orders.<br /><span>Even during busy hours.</span></>}
    lead="When a business depends entirely on manual replies, important conversations get buried. The solution isn’t always hiring more employees. A better starting point is a more reliable WhatsApp order automation workflow."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Why orders get missed:</strong> slow first replies, repeated questions, incomplete details, and no central order record.</>,
        <><strong>What to do:</strong> find where orders get stuck, automate common questions, standardize order collection, and connect chats to your order system.</>,
        <><strong>Keep people in the loop:</strong> escalate exceptions to a human, and track five numbers to see whether the automation is working.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-order-taking-chatbot", "/blog/whatsapp-order-confirmation-messages"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Busy hours, no missed orders.<br /><span>Build your AI assistant.</span></>, body: "Create an AI chat agent, add your business information, and connect your WhatsApp number. It’s free to start." }}
  />;
}
