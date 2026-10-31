import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Samples } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta } from "@/components/blog/BlogPost";

// Targets "whatsapp order confirmation message". The title promises 25
// templates: the five lists below must add up to that.
const href = "/blog/whatsapp-order-confirmation-messages";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

type Sample = { title: string; text: string };

const newOrder: Sample[] = [
  { title: "Template 1: Simple order confirmation", text: "Hi [Name], thank you for your order! Your order #[Order ID] has been confirmed. Total: [Amount]. We’ll let you know when it’s ready." },
  { title: "Template 2: Friendly online shop", text: "Great news, [Name]! We’ve received your order #[Order ID]. Our team is preparing it now. Thank you for shopping with [Business Name]." },
  { title: "Template 3: Detailed confirmation", text: "Thank you for ordering from [Business Name].\n\nOrder: #[Order ID]\nItems: [Items]\nTotal: [Amount]\nPayment: [Payment Method]\nStatus: Confirmed\n\nWe’ll share the next update when it’s available." },
  { title: "Template 4: Pickup order", text: "Hi [Name], your pickup order #[Order ID] is confirmed. We’ll notify you when it’s ready for collection at [Location]." },
  { title: "Template 5: Order received, awaiting review", text: "Hi [Name], we’ve received your order request #[Order ID]. Our team is reviewing availability and will confirm it shortly. No further action is needed right now." },
];

const payment: Sample[] = [
  { title: "Template 6: Cash on delivery confirmed", text: "Hi [Name], your cash-on-delivery order #[Order ID] is confirmed. Please have [Amount] ready when your package arrives." },
  { title: "Template 7: Payment successful", text: "Your payment of [Amount] for order #[Order ID] was successful. Thank you! We’ll update you when your order is dispatched." },
  { title: "Template 8: Payment pending", text: "Hi [Name], your order #[Order ID] is awaiting payment confirmation. You can review the payment status using [Official Link]." },
  { title: "Template 9: Payment could not be verified", text: "Hi [Name], we haven’t been able to verify payment for order #[Order ID]. Please contact our support team before attempting another payment, so we can check your order safely." },
  { title: "Template 10: COD details verification", text: "Hi [Name], we’re preparing your cash-on-delivery order #[Order ID]. Please confirm that your delivery address is [Address] and the amount payable is [Amount]." },
];

const shipping: Sample[] = [
  { title: "Template 11: Preparing your order", text: "Hi [Name], your order #[Order ID] is being prepared. We’ll let you know when it has been shipped." },
  { title: "Template 12: Order dispatched", text: "Good news! Order #[Order ID] has been dispatched with [Carrier]. You can track its progress here: [Tracking Link]." },
  { title: "Template 13: Delivery estimate", text: "Hi [Name], the current estimated delivery date for order #[Order ID] is [Date]. This estimate may change if the carrier reports a delay." },
  { title: "Template 14: Out for delivery", text: "Your order #[Order ID] is marked as out for delivery today. Please keep your phone available in case the delivery team needs directions." },
  { title: "Template 15: Delivery delay", text: "Hi [Name], we’re sorry that order #[Order ID] has been delayed. The latest estimated delivery date is [Date]. We’ll share any further updates as soon as they become available." },
];

const afterDelivery: Sample[] = [
  { title: "Template 16: Delivered successfully", text: "Hi [Name], order #[Order ID] has been marked as delivered. We hope everything arrived as expected. Let us know if you need help." },
  { title: "Template 17: Order ready for collection", text: "Hi [Name], your order #[Order ID] is ready for pickup at [Location] during [Pickup Hours]." },
  { title: "Template 18: Follow-up after delivery", text: "Thanks again for ordering from [Business Name], [Name]. If you have any questions about order #[Order ID], simply reply to this chat." },
  { title: "Template 19: Missing item support", text: "Hi [Name], we’re sorry to hear something was missing from order #[Order ID]. Please tell us which item is missing so our team can investigate." },
  { title: "Template 20: Damaged package support", text: "We’re sorry your order arrived damaged, [Name]. Our support team will review order #[Order ID] and explain the next steps under our returns policy." },
];

const changes: Sample[] = [
  { title: "Template 21: Change request received", text: "Hi [Name], we’ve received your request to change order #[Order ID]. The change hasn’t been confirmed yet. Our team will check whether it’s still possible." },
  { title: "Template 22: Order change confirmed", text: "Hi [Name], the requested changes to order #[Order ID] have been completed. Your updated order summary is [Updated Summary]." },
  { title: "Template 23: Cancellation request received", text: "Hi [Name], we’ve received your cancellation request for order #[Order ID]. We’ll check its current status and confirm whether cancellation is possible." },
  { title: "Template 24: Order cancelled", text: "Your order #[Order ID] has been cancelled successfully. If a refund is due, we’ll share the applicable processing details separately." },
  { title: "Template 25: Refund initiated", text: "Hi [Name], your refund of [Amount] for order #[Order ID] has been initiated. The time it takes to appear in your account depends on the payment provider." },
];

const faqs = [
  { q: "What is the best WhatsApp order confirmation message?", a: "A good message confirms that the order was accepted, provides the order number and amount, and explains what will happen next." },
  { q: "Can order confirmation messages be automated?", a: "Yes. Confirmations can be generated from verified order events through an appropriate messaging integration. AI chatbots can also handle conversational confirmation and order questions." },
  { q: "Can I use different templates for COD and prepaid orders?", a: "Yes. Cash-on-delivery messages should clearly state the amount due at delivery, while prepaid confirmations should reflect the verified payment status." },
  { q: "Does WhatsApp require approved templates?", a: "For business-initiated messages through the official WhatsApp Business Platform, approved message templates are generally required outside the applicable customer service window. Requirements depend on the message type and current platform rules." },
];

const sources = [
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
];

const sections = [
  {
    id: "what-to-include",
    title: "What should a WhatsApp order confirmation message include?",
    body: <>
      <p>A useful confirmation message should answer the customer’s immediate questions without overwhelming them.</p>
      <p>Include the customer’s name when appropriate, the order number, a brief summary, the amount payable or paid, and the next step.</p>
      <p>Never say that an order is confirmed unless your business system has actually accepted it.</p>
      <p>For automated messages, verify that every value comes from the correct order.</p>
      <p>Below are 25 ready-to-use templates for different stages of the customer journey. Replace the information inside square brackets with your actual order details.</p>
    </>,
  },
  { id: "new-order", title: "1. New order confirmation messages", body: <Samples items={newOrder} /> },
  { id: "payment", title: "2. Payment and cash-on-delivery messages", body: <Samples items={payment} /> },
  { id: "shipping", title: "3. Shipping and delivery messages", body: <Samples items={shipping} /> },
  { id: "after-delivery", title: "4. Delivery completion and customer care", body: <Samples items={afterDelivery} /> },
  { id: "changes", title: "5. Changes, cancellations and refunds", body: <Samples items={changes} /> },
  {
    id: "automate",
    title: "How to automate order confirmation messages on WhatsApp",
    body: <>
      <p>Manually sending these messages is manageable when you receive a few orders per day.</p>
      <p>As order volume increases, however, repeated updates can take a significant amount of staff time.</p>
      <p>The answer is to connect customer communication with the status of the order.</p>
      <p>For example, after an order is accepted, your system can prepare a confirmation containing the correct order ID, items and amount.</p>
      <p>A customer-facing AI assistant can also collect details, ask for confirmation and answer follow-up questions.</p>
      <p>With <Link href="/">Wapzen</Link>, businesses can configure AI chat agents for WhatsApp and connect API tools that support order-related workflows.</p>
      <p>Wapzen can help with conversational confirmations and replies. If your business needs proactive outbound notification templates at scale, evaluate an official WhatsApp Business Platform integration and its messaging rules.</p>
      <InlineCta title="Confirm orders in the chat, automatically" body="Free to start: an AI chat agent on your existing number that collects each order and confirms it with the customer." />
    </>,
  },
  {
    id: "tips",
    title: "Tips for writing better confirmation messages",
    body: <>
      <ul>
        <li>Keep messages short enough to read comfortably on a phone.</li>
        <li>Use an order number so customers can easily reference their purchase.</li>
        <li>Avoid exposing sensitive personal information unnecessarily.</li>
        <li>Include only verified order details, and never promise delivery dates, refunds or availability that your system has not confirmed.</li>
      </ul>
      <p>Most importantly, make the next step clear. Customers should know whether they need to reply, wait for an update or contact support.</p>
    </>,
  },
  {
    id: "next",
    title: "Make every order conversation clearer",
    body: <>
      <p>Order confirmation should be simple for your customers and manageable for your team.</p>
      <p>Start with clear messages, connect them to accurate order information and automate the repetitive conversations where appropriate.</p>
      <p>For cash-on-delivery workflows, read our <Link href="/blog/whatsapp-cod-order-confirmation">guide to automating COD order confirmation</Link>. To have an AI agent collect the order first, see our <Link href="/blog/whatsapp-order-taking-chatbot">WhatsApp order taking chatbot guide</Link>.</p>
    </>,
  },
];

export default function WhatsAppOrderConfirmationMessagesPage() {
  return <BlogPost
    href={href}
    heading={<>25 WhatsApp order confirmation messages.<br /><span>Copy and use them.</span></>}
    lead="If a customer receives no confirmation, they may wonder whether the order was recorded or whether payment succeeded. A clear WhatsApp order confirmation message answers those questions before they become support requests."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>A good confirmation includes:</strong> the order number, a brief summary, the amount paid or payable, and the next step.</>,
        <><strong>25 templates to copy:</strong> new orders, payment and COD, shipping, delivery and customer care, and changes, cancellations and refunds.</>,
        <><strong>One rule:</strong> never say an order is confirmed unless your business system has actually accepted it.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-order-taking-chatbot", "/blog/whatsapp-cod-order-confirmation"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Clear order messages.<br /><span>Without typing each one.</span></>, body: "Create an AI chat agent that collects orders, confirms them with customers, and answers follow-up questions. It’s free to start." }}
  />;
}
