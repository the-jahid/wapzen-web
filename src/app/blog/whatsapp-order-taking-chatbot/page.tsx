import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Samples } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp order taking chatbot". Describes what the product does
// today, so keep it in step with whiskey-bailey-server: Take Order is a chat
// feature that saves to Tools › Orders, chat agents answer one-to-one text, and
// voice is left out until it has a backend again.
const href = "/blog/whatsapp-order-taking-chatbot";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const orderSummary = [
  { title: "Order summary", text: "Order summary\n- 2 × Black T-shirts, size M\n- Subtotal: $40\n- Delivery: $5\n- Total: $45\n- Payment: Cash on delivery\n\nIs everything correct? Reply CONFIRM to place your order or tell me what you would like to change." },
];

const faqs = [
  { q: "Can a WhatsApp chatbot take orders automatically?", a: "Yes. An AI chatbot can collect product selections, quantities, delivery details and customer confirmation. Saving the order automatically requires a supported order-handling workflow or integration, such as Wapzen's built-in Take Order tool or an API request to your own system." },
  { q: "Do I need coding skills to create one?", a: "Not necessarily. Wapzen provides a no-code interface for creating the chatbot. More advanced integrations may require API configuration or an automation service." },
  { q: "Can an AI chatbot manage multiple customer conversations?", a: "Yes. Chatbot software can process conversations from different customers without requiring a person to answer each one manually. Actual throughput and reliability depend on the platform and connection." },
  { q: "Can the chatbot handle cash-on-delivery orders?", a: "It can collect the preferred payment method and the information needed for a COD order, provided the workflow is configured appropriately." },
];

const sources = [
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
  { label: "WhatsApp Help Center: How to link a device", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "what-is-it",
    title: "What is a WhatsApp order taking chatbot?",
    body: <>
      <p>For businesses that receive orders through WhatsApp, slow responses are more than a customer service problem. They create unnecessary friction between buying intent and a completed sale.</p>
      <p>A WhatsApp order taking chatbot is an automated assistant that communicates with customers through WhatsApp and helps them place orders.</p>
      <p>Unlike a basic autoresponder that sends the same message to everyone, an AI-powered chatbot can understand different customer requests and ask relevant follow-up questions.</p>
      <p>For example, a customer might write:</p>
      <blockquote>“Hi, I want two black T-shirts in medium. Do you deliver to my area?”</blockquote>
      <p>An AI chatbot can use the product and delivery information supplied by the business to answer the question and collect the remaining order details.</p>
      <p>With a connected order system, it can also send a confirmed order to the business through an integration.</p>
    </>,
  },
  {
    id: "how-it-works",
    title: "How AI order taking works on WhatsApp",
    body: <>
      <p>A well-designed order conversation should feel straightforward.</p>
      <h3>1. Answer product questions</h3>
      <p>Customers may ask about sizes, colors, availability, prices, delivery areas or payment methods.</p>
      <p>The chatbot uses the product information and business policies it has been given to answer those questions.</p>
      <p>For accurate live stock checks, the chatbot needs a connection to the inventory system rather than relying on an outdated document.</p>
      <h3>2. Collect the order details</h3>
      <p>Once the customer decides to buy, the assistant gathers the information necessary to process the order.</p>
      <p>This might include the product, quantity, selected options, customer name, delivery address and preferred payment method.</p>
      <p>The chatbot should only ask for information that is actually required.</p>
      <h3>3. Present an order summary</h3>
      <p>Before saving the order, the assistant should present a clear summary. For example:</p>
      <Samples items={orderSummary} />
      <p>This final confirmation helps prevent misunderstandings and accidental submissions.</p>
      <h3>4. Send the confirmed order to your system</h3>
      <p>Once the customer confirms, the chatbot can trigger a configured API request to your order management system, a spreadsheet or another connected business tool.</p>
      <p>The receiving system should return a unique order ID and success status.</p>
      <p>The assistant must not tell the customer that an order has been placed unless the system confirms it.</p>
      <h3>5. Answer follow-up questions</h3>
      <p>Customers often return to WhatsApp to ask whether their order has shipped or when it will arrive.</p>
      <p>If the chatbot has access to current order information through an API, it can retrieve the latest recorded status and explain it. Our <Link href="/blog/whatsapp-order-tracking-bot">WhatsApp order tracking bot guide</Link> covers that step in detail.</p>
    </>,
  },
  {
    id: "why",
    title: "Why use an AI chatbot for order taking?",
    body: <>
      <p>The biggest benefit is reducing repetitive manual conversations.</p>
      <p>A business owner should not need to type the same delivery charges, size options and payment instructions dozens of times every day.</p>
      <p>Order automation can also provide:</p>
      <ul>
        <li>Faster initial responses outside business hours.</li>
        <li>More consistent collection of customer information.</li>
        <li>Fewer missing details before order confirmation.</li>
        <li>A clearer record of customer conversations.</li>
        <li>More time for the team to resolve unusual requests.</li>
      </ul>
      <p>The goal is not to eliminate human support. It is to make routine order collection easier so people can focus on exceptions, complaints and decisions that require judgment.</p>
      <InlineCta title="Let AI take your WhatsApp orders" body="Free to start: an AI chat agent on your existing number that answers product questions and collects confirmed orders." />
    </>,
  },
  {
    id: "wapzen",
    title: "How Wapzen helps businesses automate WhatsApp orders",
    body: <>
      <p><Link href="/">Wapzen</Link> is a no-code platform for creating AI chatbots on WhatsApp.</p>
      <p>Businesses can connect an existing WhatsApp number using a QR code or a pairing code, configure an AI agent, and provide product information through a knowledge base.</p>
      <p>There are two ways to handle the order itself:</p>
      <ul>
        <li><strong>Take Order, built in.</strong> Switch it on for a chat agent and choose the details it collects. The agent reads the order back, asks the customer to confirm, and saves it under <strong>Tools › Orders</strong> with an order number. Your team updates each order’s status there and can export the list as a CSV.</li>
        <li><strong>API request tools.</strong> These connect the assistant with external systems for order-related actions. For example, a business could configure an order-saving workflow that sends customer-confirmed information to its order database. Wapzen then acts as the conversational interface while the connected system stores the official order record.</li>
      </ul>
      <p>The basic chatbot setup does not require the WhatsApp Business API. External order integrations still need to be configured and tested, and any order flow should be tried in real conversations before customers use it, including a customer who changes their mind halfway through.</p>
      <Note>Wapzen’s chat agent answers text messages, not voice notes or images, and it doesn’t take payments itself. Wapzen is an independent product, not made by Meta or WhatsApp. Use it to answer customers who message you, never to send bulk messages.</Note>
    </>,
  },
  {
    id: "mistakes",
    title: "Common mistakes to avoid",
    body: <>
      <ul>
        <li>Never let a chatbot invent prices or stock availability.</li>
        <li>Never submit an order before the customer has confirmed its details.</li>
        <li>Never assume an API request succeeded without checking the response.</li>
        <li>Always provide a way for a customer to request human assistance if an order is complicated or something goes wrong.</li>
      </ul>
    </>,
  },
  {
    id: "start",
    title: "Start automating your WhatsApp orders",
    body: <>
      <p>Every order begins with a conversation. The easier you make that conversation, the easier it becomes for customers to buy from you.</p>
      <p>With Wapzen, businesses can build AI-powered WhatsApp conversations, connect their business information and configure order-handling tools without creating a chatbot from scratch.</p>
      <p>For a restaurant-specific example, read our <Link href="/blog/whatsapp-food-ordering-system">WhatsApp food ordering guide</Link>. If orders are already getting lost in busy chats, start with <Link href="/blog/reduce-missed-whatsapp-orders">how to reduce missed WhatsApp orders</Link>.</p>
    </>,
  },
];

export default function WhatsAppOrderTakingChatbotPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp order taking chatbot.<br /><span>Automate customer orders with AI.</span></>}
    lead="Your customer is ready to buy, but nobody replies for 20 minutes. A WhatsApp order taking chatbot helps customers choose products, collects the order details and guides them through confirmation, without someone typing every response."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>What it does:</strong> answers product questions, collects the order details, shows a summary, and waits for the customer to confirm.</>,
        <><strong>Where the order goes:</strong> to your dashboard, or to your own order system through an API request. Never tell a customer an order is placed until the system confirms it.</>,
        <><strong>With Wapzen:</strong> no code and no WhatsApp Business API. The built-in Take Order tool saves confirmed orders under Tools › Orders.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-order-tracking-bot", "/blog/whatsapp-food-ordering-system"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Every order starts with a conversation.<br /><span>Let AI handle it.</span></>, body: "Create an AI chat agent, add your products, and connect your WhatsApp number. It’s free to start." }}
  />;
}
