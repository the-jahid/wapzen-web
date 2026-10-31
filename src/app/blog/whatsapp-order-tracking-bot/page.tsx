import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp order tracking bot". Keep it in step with
// whiskey-bailey-server: the chat agent isn't given the customer's number, and
// create_order is its only order tool, so it can't read saved orders back. If
// either changes, rewrite the note in the Wapzen section.
const href = "/blog/whatsapp-order-tracking-bot";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const statuses = [
  ["Pending", "Your order has been received and is awaiting confirmation."],
  ["Confirmed", "Your order has been confirmed."],
  ["Processing", "Your order is being prepared."],
  ["Shipped", "Your order has been handed to the delivery provider."],
  ["Out for delivery", "Your package is scheduled for delivery according to the latest carrier update."],
  ["Delivered", "The delivery provider has marked your order as delivered."],
  ["Cancelled", "Your order has been cancelled."],
];

const faqs = [
  { q: "Can customers track orders directly through WhatsApp?", a: "Yes, if the chatbot is connected to an order system that provides status information and the business implements appropriate customer verification." },
  { q: "Can AI provide real-time delivery information?", a: "It can provide the latest information available from the connected system. The accuracy and freshness of the answer depend on the order or shipping provider's data." },
  { q: "Does Wapzen require the WhatsApp Business API?", a: "No. Wapzen connects an existing WhatsApp number through a QR code or a pairing code. Order lookups still require the appropriate external integration." },
];

const sources = [
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Meta: messaging limits", href: "https://developers.facebook.com/docs/whatsapp/messaging-limits" },
];

const sections = [
  {
    id: "what-is-it",
    title: "What is a WhatsApp order tracking bot?",
    body: <>
      <p>A customer places an order, waits a few days and wants to know what’s happening. They message your business on WhatsApp, expecting an answer. If your team must manually check every order and reply to every customer, the workload grows alongside your sales.</p>
      <p>A WhatsApp order tracking bot is an automated assistant that helps customers check the status of an existing order through WhatsApp.</p>
      <p>Instead of visiting a website, looking for a tracking page or waiting for a support representative, customers can ask questions in a familiar conversation. For example:</p>
      <blockquote><strong>Customer:</strong> “Can you check my order #48291?”<br /><br /><strong>AI assistant:</strong> “Of course. Please confirm the email address used for this order.”</blockquote>
      <p>After verifying the customer and retrieving information from the connected order system, the assistant might respond:</p>
      <blockquote>“Your order #48291 is marked as shipped. The latest estimated delivery date is November 5. Would you like the available tracking information?”</blockquote>
      <p>The important difference between a useful tracking bot and a generic chatbot is access to real order data.</p>
      <p>An AI model cannot know a package’s current location simply because it understands the customer’s message.</p>
      <p>It needs an integration with the business’s order database, e-commerce platform or shipping provider.</p>
    </>,
  },
  {
    id: "how-it-works",
    title: "How automated WhatsApp order tracking works",
    body: <>
      <h3>Step 1: The customer requests an update</h3>
      <p>The customer sends a message such as “Where is my package?”</p>
      <p>The AI recognizes that the request concerns an existing order and asks for the information necessary to locate it.</p>
      <h3>Step 2: Verify the customer</h3>
      <p>Before sharing private order information, the system should verify that the requester is authorized to access it.</p>
      <p>An order number alone may not be sufficient.</p>
      <p>Depending on the business, verification could use the registered phone number, an order-linked email address or another secure method.</p>
      <h3>Step 3: Retrieve the order status</h3>
      <p>Once verification succeeds, the chatbot sends a request to the connected order system. A typical response may include:</p>
      <ul>
        <li>Order ID</li>
        <li>Current fulfillment status</li>
        <li>Shipping provider</li>
        <li>Tracking reference</li>
        <li>Estimated delivery date</li>
        <li>Latest available tracking event</li>
      </ul>
      <p>The chatbot should treat the connected system as the source of truth.</p>
      <h3>Step 4: Explain the result</h3>
      <p>Customers generally don’t need to see technical status codes. They want to know what is happening and what to expect next.</p>
      <p>For example, instead of displaying <code>FULFILLMENT_PENDING</code>, the assistant could say:</p>
      <blockquote>“Your order is confirmed and is being prepared for shipment. We don’t have a dispatch date yet.”</blockquote>
      <p>If a carrier has reported a delay, the assistant should explain the delay rather than inventing a delivery promise.</p>
    </>,
  },
  {
    id: "statuses",
    title: "Which order statuses can be automated?",
    body: <>
      <p>A typical e-commerce workflow uses several stages.</p>
      <Comparison caption="Order statuses and what to tell the customer" columns={["Customer-facing explanation"]} rows={statuses} />
      <p>Businesses should adapt these messages to the statuses their systems actually support.</p>
    </>,
  },
  {
    id: "wapzen",
    title: "Using Wapzen for WhatsApp order tracking",
    body: <>
      <p><Link href="/">Wapzen</Link> lets businesses create AI-powered WhatsApp assistants with knowledge bases and configurable API request tools.</p>
      <p>To provide live order updates, a business can connect an API tool to an existing order management system.</p>
      <p>The assistant can then use the tool to request the relevant order information during the conversation.</p>
      <p>The workflow should be configured to verify customers, handle missing orders and avoid exposing personal data.</p>
      <p>A knowledge base is useful for explaining general shipping policies. An API connection is necessary when the chatbot needs current information about a specific order.</p>
      <p>These are two different responsibilities, and both matter.</p>
      <Note>Two limits to plan for. The agent doesn’t see the customer’s WhatsApp number, so verification has to rely on details the customer types, such as the order number and the email on the order. And orders saved by Wapzen’s built-in Take Order tool stay in your dashboard: the agent can’t read them back, so live tracking needs an API it can call.</Note>
      <InlineCta title="Answer “where is my order?” automatically" body="Free to start: an AI chat agent on your existing number, connected to your order system through an API tool." />
    </>,
  },
  {
    id: "notifications",
    title: "Order tracking versus automatic shipping notifications",
    body: <>
      <p>There is an important distinction between responding to a customer’s tracking request and sending shipping notifications proactively.</p>
      <p>An order tracking bot retrieves information when the customer asks.</p>
      <p>Automatic notifications require an additional event-driven messaging workflow and must comply with the applicable WhatsApp messaging rules.</p>
      <p>Wapzen’s QR-linked setup is intended for conversational automation, not bulk WhatsApp broadcasts.</p>
      <p>For businesses that need large-scale proactive transactional notifications, an official WhatsApp Business Platform integration may be more suitable.</p>
    </>,
  },
  {
    id: "next",
    title: "Make order questions easier to answer",
    body: <>
      <p>Customers shouldn’t need to contact multiple departments just to understand where an order stands.</p>
      <p>By combining AI conversation with reliable order information, businesses can provide clearer answers while reducing repetitive support work.</p>
      <p>Explore <Link href="/whatsapp-ai-customer-service">WhatsApp customer service automation with Wapzen</Link>, or learn how to <Link href="/blog/whatsapp-chatbot-without-business-api">create a WhatsApp chatbot without the Business API</Link>. When customers want to change an order rather than track it, see our guide to <Link href="/blog/whatsapp-order-changes-cancellations">order changes and cancellations</Link>.</p>
    </>,
  },
];

export default function WhatsAppOrderTrackingBotPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp order tracking bot.<br /><span>Automate order status updates.</span></>}
    lead="“Where is my order?” is one of the most common questions an online business receives. A WhatsApp order tracking bot can retrieve order information from your connected systems and answer customers automatically."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>What it does:</strong> verifies the customer, looks up the order in a connected system, and explains the status in plain language.</>,
        <><strong>What it needs:</strong> real order data. An AI model can’t know where a package is without an integration with your order or shipping system.</>,
        <><strong>Tracking isn’t notifications:</strong> a tracking bot answers when the customer asks. Proactive shipping messages at scale are a job for the official WhatsApp Business Platform.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-order-taking-chatbot", "/blog/whatsapp-order-changes-cancellations"]}
    product="/whatsapp-ai-customer-service"
    cta={{ heading: <>“Where is my order?”<br /><span>Answered by AI.</span></>, body: "Create an AI chat agent, connect it to your order system, and link your WhatsApp number. It’s free to start." }}
  />;
}
