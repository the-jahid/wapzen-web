import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp chatbot for ecommerce" (71), "whatsapp automation for
// ecommerce" (67), "whatsapp order status" (55), "woocommerce whatsapp order
// notification" (47, 5/5), "whatsapp order tracking" (46), "whatsapp abandoned
// cart shopify" (40), "abandoned cart whatsapp message" (38) and "…template"
// (34), autocomplete 2026-10-30 (docs/seo-blog-industry-research.mjs). Wapzen
// can't start a WhatsApp chat by message (no templates or broadcasts), so
// shipping notifications and cart reminders by message are Business API work,
// and the post says so. Rates are Meta's 1 Oct 2026 cards, as in the pricing post.
const href = "/blog/whatsapp-chatbot-for-ecommerce";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const jobs = [
  ["Order status", "The customer", "No", "Service replies: free for the first 1,000 a month per number", "A chat agent with an order lookup tool"],
  ["Returns", "The customer", "No", "Same as order status", "A chat agent with your policy and a request tool"],
  ["Abandoned carts", "You", "Yes, for a message", "Marketing rate per message: ₹0.8631 in India, $0.025 in the US", "A WhatsApp call to high-value carts"],
];

const lookupParameters = [
  ["order_number", "string", "The order number, digits only, e.g. “1042”."],
  ["email", "string", "The email address or phone number used at checkout."],
];

const lookupResponse = `Order #1042 for Priya: shipped on 28 Oct 2026 with Delhivery.
Tracking: https://example.com/track/AB123456
Expected delivery: 31 Oct 2026.`;

const returnParameters = [
  ["order_number", "string", "The order number."],
  ["email", "string", "The email address used at checkout."],
  ["item", "string", "The item to return, with size or colour."],
  ["reason", "string", "Why, in the customer’s words."],
  ["resolution", "string", "“refund” or “exchange”, and the new size for an exchange."],
];

const prompt = `You are the WhatsApp assistant for [Store], an online [skincare] store. You answer questions about products, delivery, payment, orders, and returns.

Use only your knowledge base for products and policies. Never invent stock, prices, or delivery dates.

Order status: ask for the order number and the email or phone number used at checkout, then use get_order_status and share what it returns. If it finds nothing, ask them to check both once, then say the team will reply here.

Returns: explain the policy from the knowledge base. If the order qualifies and they want to go ahead, ask for the order number, the email used at checkout, the item, the reason, and refund or exchange. Repeat it back, and after they confirm, use log_return_request. Say the team will send return instructions within [1 working day]. If an item arrived damaged, ask them to send a photo in this chat for the team.

Never promise a refund, a discount, or a delivery date yourself. Short replies, one question at a time.`;

const cartTemplates = [
  { title: "Simple reminder", text: "Hi {{1}}, you left {{2}} in your cart at [Store]. We’ve saved it for you: {{3}}\nQuestions about sizes or delivery? Just reply here." },
  { title: "With cash on delivery", text: "Still deciding, {{1}}? Your [Store] cart is waiting, and cash on delivery is available on this order. Finish checking out here: {{2}}" },
  { title: "Last reminder with a code", text: "Hi {{1}}, your cart at [Store] is still saved. Use code COMEBACK5 for 5% off in the next 24 hours: {{2}}" },
];

const replies = [
  { title: "Order shipped", text: "Good news! Your order #[1042] shipped on [28 Oct] with [Delhivery]. Track it here: [link]. Expected delivery: [31 Oct]." },
  { title: "Order delayed", text: "Sorry, your order #[1042] is running late because of [courier delays in your area]. The new expected date is [3 Nov]. We’ll message you if anything changes." },
  { title: "Return approved", text: "Your return for #[1042] is approved. Pack the item with its tags, and our courier will pick it up on [date]. Your refund goes back to your original payment method within [5–7 days] of pickup." },
];

const faqs = [
  { q: "Can a WhatsApp chatbot tell customers their order status?", a: "Yes, if it can look the order up. In Wapzen you create an API request tool that sends the order number and the checkout email to your store, or to a small automation in Make, n8n, or Zapier, and returns a short status. The agent asks for both, checks, and replies with the status and tracking link." },
  { q: "Does it work with Shopify or WooCommerce?", a: "Not as a store app. Connect it through an automation tool or a small script that reads orders from your store and returns them to the agent's tool. Shipping notifications that go out on their own, such as Shopify and WooCommerce WhatsApp apps, use the Business API instead." },
  { q: "Can I send abandoned cart messages on WhatsApp without the Business API?", a: "Not automatically. Messaging someone who hasn't written to you needs an approved template on the Business API. Without it, you can send your store's free abandoned checkout emails, or have an AI voice agent call high-value carts on WhatsApp, if the customer agreed to be contacted." },
  { q: "Is an abandoned cart message marketing or utility?", a: "Marketing. Meta's template guidelines put cart reminders under marketing even when the customer asked for them. Order confirmations and shipping updates are utility, as long as they don't include promotions." },
  { q: "How much do WhatsApp order notifications cost?", a: "On the Business API, order and shipping updates are utility messages: from 1 October 2026, ₹0.115 each in India and $0.0034 in the US. Cart reminders are marketing: ₹0.8631 in India and $0.025 in the US. Your platform's fee comes on top." },
  { q: "Can the chatbot issue refunds?", a: "It shouldn't. Let it explain your policy and log the return request, and keep the refund decision with your team. The instructions in this post forbid it from promising refunds, discounts, or delivery dates." },
];

const sources = [
  { label: "Baymard Institute: cart abandonment rate statistics", href: "https://baymard.com/lists/cart-abandonment-rate" },
  { label: "Meta: WhatsApp template categorization", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Shopify Help Center: Recovering abandoned checkouts", href: "https://help.shopify.com/en/manual/orders/abandoned-checkouts" },
];

const sections = [
  {
    id: "three-jobs",
    title: "Three ecommerce jobs, and what each one needs",
    body: <>
      <p>For an online store, most WhatsApp traffic is three conversations: “where’s my order?”, “how do I return this?”, and the one you start yourself, the reminder to someone who left a cart behind. They look similar, but WhatsApp treats them differently, because of who sends the first message:</p>
      <Comparison caption="Order status, returns and abandoned carts on WhatsApp compared" columns={["Who starts it", "Business API needed?", "Meta’s fee on the API", "With Wapzen"]} rows={jobs} />
      <p>When the customer writes first, any WhatsApp chatbot can answer, including one linked to your existing number. When you write first, WhatsApp requires an approved template on the Business API, and Meta charges for each one. Setting up the first two takes an afternoon. The third needs a decision.</p>
    </>,
  },
  {
    id: "order-status",
    title: "Automate “where is my order?”",
    body: <>
      <p>Order status questions are the biggest share of a store’s WhatsApp, and the easiest to automate, because the answer already sits in your store. The chatbot needs one tool that looks an order up.</p>
      <h3>The lookup</h3>
      <p>Create a small endpoint that takes an order number and the checkout email, finds the order, and returns a few lines of plain text. A Make or n8n scenario with a webhook and a response step does it without code, or your developer can add one to the store. Return the status only when both values match the same order, so nobody can read someone else’s order by guessing numbers:</p>
      <pre><code>{lookupResponse}</code></pre>
      <h3>The tool</h3>
      <p>In Wapzen, open <strong>Tools › Create Tool › API Request</strong>, name it <code>get_order_status</code>, describe it as “Look up an order’s status and tracking”, set the method to GET and the URL to your endpoint, and add:</p>
      <Comparison caption="Parameters for the get_order_status tool" columns={["Type", "Description to give the agent"]} rows={lookupParameters} />
      <p>Press <strong>Test tool</strong> with a real order. It shows exactly the text the agent will read. Keep that short: the agent reads the first 3,000 characters of a response, so return the status, not the whole order.</p>
      <Note>Shipping notifications that go out by themselves, like “Your order has shipped”, are a different thing: your store writes first, so they need the Business API. WooCommerce plugins and Shopify apps send them as utility templates, which Meta charges at ₹0.115 a message in India and $0.0034 in the US. Wapzen doesn’t send those; it answers when the customer asks.</Note>
    </>,
  },
  {
    id: "returns",
    title: "Returns and refunds",
    body: <>
      <p>Return questions are mostly about your policy: how many days, which items, who pays shipping, and how long a refund takes. Put the policy in the agent’s <strong>knowledge base</strong> exactly as it reads on your site, and the chatbot answers those on its own.</p>
      <p>For customers who want to go ahead, add a second API request tool, <code>log_return_request</code>, that saves the request to a Google Sheet or your helpdesk. The Apps Script pattern is in <Link href="/blog/whatsapp-food-ordering-system">the food ordering guide</Link>; these are the parameters:</p>
      <Comparison caption="Parameters for the log_return_request tool" columns={["Type", "Description to give the agent"]} rows={returnParameters} />
      <p>Your team approves each one and sends the pickup details. The agent explains and records; it never decides.</p>
      <Note>The chatbot reads text only. If a customer sends a photo of a damaged item, it won’t see it, which is why the instructions below ask for the photo “for the team”. Your staff see it in WhatsApp as usual.</Note>
    </>,
  },
  {
    id: "abandoned-carts",
    title: "Abandoned-cart follow-up on WhatsApp",
    body: <>
      <p>Baymard Institute puts the average online cart abandonment rate at <a href="https://baymard.com/lists/cart-abandonment-rate" target="_blank" rel="nofollow noopener noreferrer">70.22%</a>, across 50 studies. Some of those buyers come back with a nudge, and you have three ways to send one:</p>
      <ul>
        <li><strong>Your store’s free emails, first.</strong> Shopify has a built-in <a href="https://help.shopify.com/en/manual/orders/abandoned-checkouts" target="_blank" rel="nofollow noopener noreferrer">abandoned checkout email</a>, and WooCommerce has plugins for it. Turn that on before paying for anything.</li>
        <li><strong>WhatsApp template messages.</strong> A Business API app for Shopify or WooCommerce sends a reminder with the cart link. Meta classes cart reminders as <strong>marketing</strong>, even when the customer asked for them: ₹0.8631 per message in India and $0.025 in the US, plus the app’s fee. The customer must have agreed at checkout to get WhatsApp messages.</li>
        <li><strong>A WhatsApp call for high-value carts.</strong> With Wapzen, an automation adds the shopper to an outbound campaign when a checkout is abandoned, and a voice agent calls them on WhatsApp: did something go wrong, can it answer a question about sizes or delivery? A <strong>Send Text</strong> tool can then message your store link during the call. This suits stores where calling customers is normal, like cash-on-delivery stores in India, and only above a cart value worth a call.</li>
      </ul>
      <p>If you call, be selective. Wait an hour, call only customers who gave their number and agreed to be contacted, and never at night. The voice agent isn’t told what was in the cart, so it asks. And WhatsApp restricts numbers that people report for unwanted calls. The same calling setup, step by step, is in <Link href="/blog/whatsapp-cod-order-confirmation">COD order confirmation on WhatsApp</Link>.</p>
      <h3>Abandoned cart WhatsApp message templates</h3>
      <p>For the template route, these follow Meta’s format, where <code>{"{{1}}"}</code>, <code>{"{{2}}"}</code> and <code>{"{{3}}"}</code> are filled in by your app (name, items, link). Submit them as marketing templates:</p>
      <Samples items={cartTemplates} />
    </>,
  },
  {
    id: "setup",
    title: "Set up the store chatbot",
    body: <>
      <ol>
        <li><strong>Knowledge base:</strong> products with sizes and ingredients, delivery areas and times, payment options including cash on delivery, and your return policy.</li>
        <li><strong>Tools:</strong> <code>get_order_status</code> and <code>log_return_request</code>, as above.</li>
        <li><strong>Chat agent:</strong> attach both, and adapt these instructions:</li>
      </ol>
      <pre><code>{prompt}</code></pre>
      <ol start={4}>
        <li><strong>Your number:</strong> open <strong>Phone Numbers</strong>, link the store’s WhatsApp number, and pick the agent. It answers the next message.</li>
      </ol>
      <p>Pre-sales questions come for free: “Is this serum good for oily skin?”, “Do you deliver to Pune?”, and “Can I pay on delivery?” are all answered from the same knowledge base.</p>
      <InlineCta title="Answer every order question on WhatsApp" body="Free right now: an AI agent on your store’s WhatsApp number that answers product, order, and return questions." />
      <h3>Replies to save as quick replies</h3>
      <p>For the times your team answers by hand:</p>
      <Samples items={replies} />
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device, so its replies carry no Meta fees, but it can’t start a chat with a template message. Use the Business API for that.</Note>
    </>,
  },
];

export default function WhatsAppChatbotForEcommercePage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp automation for ecommerce.<br /><span>Orders, returns, and carts.</span></>}
    lead="How to automate an online store’s WhatsApp: a chatbot that answers “where is my order?” from your store, explains returns and logs requests, and the honest options for abandoned-cart follow-up, with what each one costs."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Order status:</strong> a chatbot with an order lookup tool answers with the status and tracking link. No Business API needed.</>,
        <><strong>Returns:</strong> the chatbot explains your policy and logs each request for your team to approve.</>,
        <><strong>Abandoned carts:</strong> messages need Business API templates, charged as marketing. A WhatsApp call to high-value carts is the alternative.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-cod-order-confirmation", "/blog/whatsapp-business-api-pricing"]}
    product="/whatsapp-ai-customer-service"
    cta={{ heading: <>Order questions, answered.<br /><span>On WhatsApp, in seconds.</span></>, body: "Create a free AI agent, add your products and policies, and link your store’s WhatsApp number. It answers customers right away." }}
  />;
}
