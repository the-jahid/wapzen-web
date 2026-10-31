import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp order management automation". Keep it in step with
// whiskey-bailey-server: Take Order only creates orders (create_order is the
// agent's one order tool), so changes to those orders are the owner's, under
// Tools › Orders. If the agent gains an update tool, rewrite the note below.
const href = "/blog/whatsapp-order-changes-cancellations";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const faqs = [
  { q: "Can a WhatsApp chatbot cancel an order automatically?", a: "It can when an authorized integration supports cancellation and the business has configured appropriate verification and eligibility checks." },
  { q: "Can a WhatsApp AI agent handle refund requests?", a: "Yes. It can explain policies, collect information, retrieve order details and route requests. Issuing a refund requires an authorized payment workflow." },
  { q: "What happens if an order change fails?", a: "The chatbot should say the change could not be confirmed and arrange the appropriate follow-up. It should never present an unsuccessful action as completed." },
  { q: "Can Wapzen work with an existing order management system?", a: "Wapzen provides API request tools that can communicate with compatible external systems. The available actions depend on the system's API and configuration." },
];

const sources = [
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
  { label: "WhatsApp Help Center: How to link a device", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "can-ai-modify-orders",
    title: "Can a WhatsApp AI chatbot modify customer orders?",
    body: <>
      <p>Someone selects the wrong size. Another customer enters an incorrect delivery address. A buyer changes their mind just before the order ships. These situations involve order records, fulfillment status, payment details and business policies.</p>
      <p>A chatbot can change an order in principle, if it is connected to an order management system that supports the required action.</p>
      <p>It can understand a customer’s request, collect the relevant details and, when authorized, call an external system through an API.</p>
      <p>But understanding a request is not the same as completing it. For example, a customer might write:</p>
      <blockquote>“Can you change my blue shirt to black?”</blockquote>
      <p>Before making any changes, the system must confirm that the requester is authorized, identify the correct order, check whether the order can still be edited and verify the requested variant.</p>
      <p>Only then should it perform an approved action.</p>
      <p>The same principle applies to cancellations and refunds.</p>
    </>,
  },
  {
    id: "order-changes",
    title: "How to automate an order change request",
    body: <>
      <p>Consider a business that accepts clothing orders through WhatsApp. A customer sends this message:</p>
      <blockquote>“I ordered size M yesterday. Can I change it to size L?”</blockquote>
      <p>A reliable workflow should follow these steps.</p>
      <h3>Step 1: Identify the order</h3>
      <p>The assistant requests the order number and the information required for customer verification.</p>
      <p>It should avoid displaying private order details before authorization is established.</p>
      <h3>Step 2: Check the current status</h3>
      <p>The chatbot retrieves the order information from the connected system.</p>
      <p>If the order has already shipped, editing may no longer be possible.</p>
      <p>If the order is awaiting fulfillment, the system may permit a change.</p>
      <h3>Step 3: Check availability</h3>
      <p>Before changing the product, the assistant checks whether the requested size is available.</p>
      <p>It should not promise a replacement based on an old product document.</p>
      <h3>Step 4: Confirm the proposed change</h3>
      <p>The chatbot explains what will change, including any difference in price or delivery date.</p>
      <p>The customer then confirms whether they want to proceed.</p>
      <h3>Step 5: Update the order</h3>
      <p>If the system permits the action, an authorized integration updates the order record.</p>
      <p>The assistant should wait for a successful response before confirming completion.</p>
      <p>If the action fails, the customer should be told that the request is still pending.</p>
    </>,
  },
  {
    id: "cancellations",
    title: "Handling cancellation requests on WhatsApp",
    body: <>
      <p>Order cancellation requires a similar process, but with stricter safeguards.</p>
      <p>A customer may request cancellation before fulfillment, during shipping or after delivery.</p>
      <p>The available options depend on the business’s policies and the current order status.</p>
      <p>A simple AI response might be:</p>
      <blockquote>“I can help you request a cancellation. Please share your order number so we can check whether the order is still eligible.”</blockquote>
      <p>After verifying the order, the system can determine whether cancellation is permitted.</p>
      <p>Some businesses may automate eligible cancellations through an approved API action.</p>
      <p>Others may prefer to route every cancellation to a staff member.</p>
      <p>Either approach can work, provided the customer receives an accurate explanation.</p>
    </>,
  },
  {
    id: "refunds",
    title: "Should AI automatically issue refunds?",
    body: <>
      <p>Refunds involve financial decisions, so a cautious approach is important.</p>
      <p>An AI assistant can collect the reason for a refund request, explain the published policy, retrieve order details and notify the responsible team.</p>
      <p>It should not issue refunds without explicit authorization and adequate controls.</p>
      <p>A well-designed refund workflow can require:</p>
      <ul>
        <li>Customer identity verification.</li>
        <li>Confirmation of the original transaction.</li>
        <li>Eligibility checks against the refund policy.</li>
        <li>Human approval where required.</li>
        <li>An authorized action through the payment system.</li>
        <li>Recording the transaction result.</li>
      </ul>
      <p>For many smaller businesses, the safest starting point is to automate the collection and routing of refund requests while leaving final approval to a person.</p>
    </>,
  },
  {
    id: "wapzen",
    title: "How Wapzen can support these workflows",
    body: <>
      <p><Link href="/">Wapzen</Link> allows businesses to configure WhatsApp AI agents with business knowledge and API request tools.</p>
      <p>A business could create an agent that understands order-related questions, retrieves information through connected systems and collects details for change or cancellation requests.</p>
      <p>External integrations may also support authorized actions where the business system exposes the necessary functionality.</p>
      <p>The assistant’s instructions should clearly distinguish between answering a question, submitting a request and confirming a completed change. For example:</p>
      <blockquote>“Never state that an order has been changed, cancelled or refunded unless the connected system has returned a successful confirmation. Refer exceptions and financial disputes to the human support team.”</blockquote>
      <p>This simple rule helps prevent misleading customer responses.</p>
      <Note>Wapzen’s built-in Take Order tool only creates new orders. To change or cancel one of those orders, your team updates it under Tools › Orders. An agent can change an order on its own only through an API tool connected to your own system.</Note>
      <InlineCta title="Handle order requests without the back and forth" body="Free to start: an AI chat agent that explains your policies and collects the details your team needs." />
    </>,
  },
  {
    id: "mistakes",
    title: "Five automation mistakes to avoid",
    body: <>
      <ol>
        <li><strong>Trusting the order number alone.</strong> A customer may know someone else’s order number. Verify authorization before revealing or changing information.</li>
        <li><strong>Promising a refund too early.</strong> Explain the process without guaranteeing an outcome that has not been approved.</li>
        <li><strong>Ignoring order status.</strong> An order that has shipped may require a return instead of a cancellation.</li>
        <li><strong>Allowing duplicate actions.</strong> External systems should protect against repeated cancellations, updates or refunds caused by retries.</li>
        <li><strong>Providing no human escalation.</strong> Customers should have a clear next step when an issue requires judgment or investigation.</li>
      </ol>
    </>,
  },
  {
    id: "next",
    title: "Make WhatsApp order management easier for everyone",
    body: <>
      <p>Good automation is not about allowing AI to make every decision.</p>
      <p>It’s about simplifying routine requests, checking information accurately and involving your team when an issue becomes complex.</p>
      <p>When customers receive clear answers and every important action is recorded properly, order management becomes easier to trust.</p>
      <p>Explore <Link href="/whatsapp-ai-customer-service">Wapzen’s AI-powered WhatsApp customer service</Link>, or read <Link href="/blog/zen-whatsapp-workflow#do-not-automate">what not to automate</Link> for more on escalation. For status questions, see our <Link href="/blog/whatsapp-order-tracking-bot">WhatsApp order tracking bot guide</Link>.</p>
    </>,
  },
];

export default function WhatsAppOrderChangesCancellationsPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp order changes, cancellations and refunds.<br /><span>An AI automation guide.</span></>}
    lead="Customer orders don’t always go according to plan. A WhatsApp AI chatbot can help organize these requests, but effective WhatsApp order management automation needs clear rules about what the AI can do and when a human should take over."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Changes and cancellations:</strong> AI can complete them only through a connected order system, after it verifies the customer and checks the order’s status.</>,
        <><strong>Refunds:</strong> a safe start is letting AI collect and route requests, while a person gives the final approval.</>,
        <><strong>One rule:</strong> never say an order was changed, cancelled, or refunded until the connected system confirms it.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-order-tracking-bot", "/blog/reduce-missed-whatsapp-orders"]}
    product="/whatsapp-ai-customer-service"
    cta={{ heading: <>Clear answers on every order.<br /><span>Your team for the exceptions.</span></>, body: "Create an AI chat agent that handles routine order requests and leaves judgment calls to your team. It’s free to start." }}
  />;
}
