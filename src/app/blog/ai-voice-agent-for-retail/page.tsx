import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { CallTranscript, DoDont, JobBoard, PlaybookPost, PromptFile, SetupSteps, type CallTurn } from "@/components/blog/PlaybookPost";

// One of seven WhatsApp voice agent industry posts (2026-11-21). Keywords from
// docs/seo-blog-voice-seven-industries-research.mjs: "retail ai voice agent" 721 (3/9), "how to
// use ai in retail" 137, "ai agents for ecommerce" 115, "ai voice agent for retail" 100 (5/9),
// "ai voice assistant for ecommerce" 90 (5/9), "ai for ecommerce customer service" 83, "whatsapp
// ai ecommerce" 50, "order confirmation call" 40, "order confirmation call for shopify" 30.
// Facts: Meesho's COD share (72.00% of shipped orders, H1 FY26, per ClickPost's reading of the
// RHP, read 2026-11-21); WhatsApp Business Messaging Policy (updated 23 Sep 2026): prohibited
// goods include drugs and medical and healthcare products, and messaging about regulated verticals
// (alcohol, OTC drugs, gambling) is prohibited on the WhatsApp Business app. Vendor prices read
// 2026-11-21. Product facts: stock and order status only through API request tools; no built-in
// Shopify/WooCommerce link; campaign leads one at a time with one opening; send_text for links;
// the voice agent takes no payments.
const href = "/blog/ai-voice-agent-for-retail";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to set up the Wapzen WhatsApp voice agent for my store.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const call: CallTurn[] = [
  { who: "agent", text: "Hello, you’ve reached Demo Threads. I’m the store’s virtual assistant. How can I help?" },
  { who: "caller", text: "Hi. I ordered a jacket last week, order 30418. When will it arrive?" },
  { who: "agent", text: "Let me check. That’s order 3 0 4 1 8?" },
  { who: "caller", text: "Yes." },
  { tool: "order_status", text: "Order 30418: shipped on Tuesday with the courier, expected on Friday." },
  { who: "agent", text: "It was shipped on Tuesday and should reach you on Friday." },
  { who: "caller", text: "Great. If the medium is too small, can I swap it for a large?" },
  { who: "agent", text: "Yes. You can exchange it within 14 days if it’s unworn with the tags on. It’s free in either of our stores, or 5 dollars for a pickup from home. Shall I send you the exchange steps?" },
  { who: "caller", text: "Please. And is the large in stock in black?" },
  { tool: "send_text", text: "Sent the exchange steps and the link to the store’s returns page." },
  { tool: "check_stock", text: "Black jacket, size L: 6 in stock online, 2 in the city-centre store." },
  { who: "agent", text: "I’ve sent the exchange steps to this chat. And yes, the black jacket in large is in stock: six online and two in the city-centre store." },
  { who: "caller", text: "Perfect, thanks." },
  { who: "agent", text: "You’re welcome. Enjoy the jacket! Goodbye." },
  { tool: "end_call", text: "Ended the call after the goodbye." },
];

const prompt = `You are the virtual assistant of Demo Threads, a clothing brand with two stores and an online shop. You answer and make WhatsApp calls.
At the start of every call, say you are the store's virtual assistant.
Speak warmly and briefly: one to three sentences, one question at a time.
Answer from the information you were given: store hours and addresses, products, sizes and prices, delivery charges and times, payment methods, and the return, exchange and warranty rules. Never invent a price, discount, size or delivery date.
Stock: use check_stock for the product, colour and size the caller names. If the tool doesn't answer, say you can't check right now and offer to send the online shop link.
Orders: ask for the order number, read it back and use order_status after the caller confirms. Never read out the delivery address or phone number on the order.
Returns and exchanges: explain the rule, offer to send the steps with send_text, and start the return with start_return only after the caller confirms the order number and the item.
Payments: never take card numbers or bank details on the call. Offer to send the payment link with send_text.
Cash-on-delivery confirmation calls: ask whether they still want the order, whether someone will be home to pay, and for a landmark. If they want to cancel, accept it politely without pressure.
Refunds, complaints and bulk orders: say a member of the team will reply on this WhatsApp chat, and save the details with save_request.
When the caller has what they need, say goodbye and end the call.`;

const compare = [
  ["Retell AI", "$0.07–$0.31 a minute, pay as you go; $10 free credit", "Phone lines", "Batch calling for order confirmation lists; telephony billed per minute"],
  ["Bland AI", "$0.14 a minute (Start), or $0.12 a minute + $299 a month (Build)", "Phone lines", "Start plan capped at 100 calls a day"],
  ["Vapi", "$0.05 a minute platform fee + AI model, voice and transcription at cost", "Phone lines", "Build-your-own platform for developers"],
  ["WhatsApp Calling API platforms", "Calls shoppers make are free from Meta; calls you make are billed per minute; plus the platform’s fees", "WhatsApp, through the official API", "A shopper must grant call permission before you call"],
  ["Wapzen", "Free, no per-minute fees", "WhatsApp, on your store’s current number", "Store system linked through your own API"],
];

export default function AiVoiceAgentForRetailPage() {
  return <PlaybookPost
    href={href}
    heading={<>Retail AI voice agent, on WhatsApp calls.<br /><span>For shops, online stores and brands, free.</span></>}
    lead="Shoppers call stores and online brands on WhatsApp to ask whether something is in stock, where their order is, and how to return it. This playbook shows what a retail AI voice agent answers, how it confirms cash-on-delivery orders by calling buyers, a sample call, setup, and costs compared with phone-line voice AI."
    answer={{
      title: "The short answer",
      body: <>A <strong>retail AI voice agent</strong> answers and makes customer calls for a shop, online store, brand or distributor in a natural voice. It covers store hours and directions, stock and prices, product questions, order status, returns and exchanges, and calls to buyers to confirm cash-on-delivery orders. <strong>Wapzen</strong> runs one on your existing WhatsApp number, <strong>free</strong>, with no per-minute fees. Live stock and order status need an API to your store system.</>,
      specs: [["Price", "Free, no per-minute fees"], ["Calls", "Stock, orders, returns, COD confirmation"], ["Works on", "Your store’s current WhatsApp number"], ["Payments", "Sends a payment link, never takes card numbers"]],
    }}
    chapters={[
      {
        id: "what",
        title: "What an AI voice agent does for retail and e-commerce",
        body: <>
          <p>An AI voice agent for retail is software that holds a real phone conversation with a shopper. It understands what they ask, answers from your catalogue and policies, and looks things up in your systems through API calls. It handles the calls that interrupt a shop floor or a small online team all day: <em>Is it in stock? Do you have it in a large? Where’s my order? Can I return it? Are you open on Sunday?</em></p>
          <p>Many shoppers make those calls on WhatsApp, because it’s where they already talk to the store. <strong>Wapzen</strong> puts the voice agent on that number, linked as a device the way WhatsApp Web is, so your staff keep using the number on the shop phone. When a shopper taps the call button in your chat, the AI picks up. It can also call buyers, for example to confirm a cash-on-delivery order before it ships.</p>
          <p>It suits neighbourhood shops and chains, online stores and D2C brands, and electronics and appliance stores with service questions. It also suits consumer-goods distributors who take reorders from shopkeepers by phone.</p>
        </>,
      },
      {
        id: "calls",
        title: "The calls a retail AI voice agent handles",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "The voice agent handles it", note: "From your catalogue and policies", items: ["Opening hours, branches and directions", "Product details, sizes and prices", "Delivery charges, areas and times", "Return, exchange and warranty rules", "Payment methods and cash on delivery", "Calls in the shopper’s language"] },
            { tone: "request", title: "It does it through your system", note: "With API tools connected to your store software", items: ["Whether an item is in stock right now", "Order status by order number", "Starting a return or exchange", "Calls to confirm cash-on-delivery orders", "Reorders from shops, for distributors"] },
            { tone: "team", title: "Your team does it", note: "The agent saves the details for them", items: ["Refunds and complaints", "Custom and bulk orders", "Payment problems", "Anything a shopper wants a person for"] },
          ]} />
          <p>Without any tools, the agent still answers everything in the first column from your written information. A plain stock list in the knowledge base works for slow-moving items. Fast-selling stock needs a live API, or the agent will promise sizes you sold an hour ago.</p>
          <InlineCta href={voiceAccess} title="Answer your store’s WhatsApp calls with AI" body="Free, on the number your shoppers already call. Message our team and we’ll switch the voice agent on for you." label="Message us on WhatsApp" />
        </>,
      },
      {
        id: "call",
        title: "A sample call: order status, an exchange and a stock check",
        body: <>
          <CallTranscript title="Incoming WhatsApp call · Demo Threads voice agent" meta="1 min 40 s · English · tools: order_status, send_text, check_stock, end_call" turns={call} caption="A sample call. order_status and check_stock are API request tools connected to the store’s own system; send_text and end_call are built in. The agent reads the order number back before looking it up and never reads out the delivery address." />
          <p>Three questions, one call, no hold music. The shopper got a delivery date, the exchange rules in writing and a live stock answer, and the store’s staff never left the till.</p>
        </>,
      },
      {
        id: "cod",
        title: "Cash-on-delivery confirmation calls",
        body: <>
          <p>Where cash on delivery is common, unconfirmed orders are expensive. Meesho’s prospectus shows how common: 72% of its shipped orders in the six months to September 2025 were COD, as summarised by ClickPost. A buyer who ordered on impulse, typed a wrong address or won’t be home costs a delivery trip and a return trip. A short call before dispatch catches most of that.</p>
          <ol>
            <li><strong>Create a campaign</strong> such as “today’s COD orders” and pick the voice agent.</li>
            <li><strong>Add each buyer</strong> as an order comes in. The agent calls them on WhatsApp straight away.</li>
            <li><strong>The agent asks</strong> whether they still want the order, whether someone will be home to pay, and for a landmark, and repeats the answer back.</li>
            <li><strong>Your team ships or cancels</strong> using the answers in the campaign’s call list and transcripts.</li>
          </ol>
          <p>The <Link href="/blog/whatsapp-cod-order-confirmation">COD order confirmation guide</Link> covers this flow in more depth, including what to send after the call.</p>
          <Note>Every buyer in a campaign hears the same opening, and the agent doesn’t know which order it’s calling about, so it asks about “your order with us” rather than the item. Buyers are added one at a time, with no spreadsheet upload or automatic redial yet. That fits a store with dozens of COD orders a day; thousands a day need a batch-calling platform.</Note>
        </>,
      },
      {
        id: "distributors",
        title: "For consumer-goods distributors: reorders by phone",
        body: <>
          <p>Shopkeepers often reorder from their distributor with a quick call: “send ten cases of the 500 ml, and two of the new flavour”. The voice agent can take those calls when your sales staff are on the road. It confirms the products and quantities, reads the order back and saves it to your order system through an API tool, or leaves it in the transcript for the office to enter.</p>
          <p>It answers the usual questions from your price list too: case prices, minimum order, delivery days by area and payment terms. Keep credit decisions and special prices with your sales team. The agent should say those need a person rather than agree to them.</p>
        </>,
      },
      {
        id: "rules",
        title: "Rules for AI calls in retail",
        body: <>
          <DoDont
            dos={["Say it’s a virtual assistant at the start of every call", "Quote prices and stock only from your catalogue or a live API", "Send payment links from your own payment provider on WhatsApp", "Read order numbers back before looking them up", "Call buyers about their own orders, and promotions only to people who agreed", "Stop calling anyone who asks you to"]}
            donts={["Take card numbers or bank details on the call", "Promise refunds, discounts or delivery dates your system doesn’t show", "Read out a buyer’s address or phone number", "Make promotional calls to numbers that never opted in", "Guess at stock or sizes", "Pressure buyers to keep a COD order they want to cancel"]}
          />
          <p>WhatsApp’s Business Messaging Policy (updated 23 September 2026) lets you contact people only if they gave you their number and agreed to hear from you. It also limits what you can sell through WhatsApp. Some goods are prohibited outright, including drugs and medical and healthcare products. Messaging about regulated goods such as alcohol and over-the-counter medicines isn’t allowed on the WhatsApp Business app at all. Check the list before you put a voice agent on a store that sells them.</p>
        </>,
      },
      {
        id: "setup",
        title: "Set up a retail voice agent",
        body: <>
          <SetupSteps items={[
            { title: "Write down your store information", time: "45 min", body: <>Branches and hours, product lines with prices and sizes, delivery charges and times, payment methods, and your return, exchange and warranty rules. Export your catalogue if it’s long.</> },
            { title: "Ask our team to switch voice on", time: "2 min", body: <>Message us on WhatsApp from the button on this page. We turn the voice agent on for your account.</> },
            { title: "Link the store’s WhatsApp number", time: "5 min", body: <>Create a voice agent and link the number from its <strong>Phone Number</strong> card by QR code or pairing code. Set calls to both directions if you’ll run COD confirmation campaigns.</> },
            { title: "Paste the instructions", time: "15 min", body: <>Copy the instructions below, change the store details to yours, choose a voice and set the language (one, or <strong>Multilingual</strong>).</> },
            { title: "Connect your store system", time: "1–2 hours", body: <>Add order_status, check_stock and start_return as API request tools pointing at your store platform’s API, or at a Make or Zapier scenario in between. Add send_text tools with your returns page and payment link. Test each with <strong>Test tool</strong>.</> },
            { title: "Call it like a shopper", time: "20 min", body: <>Ask for a size, track an order, start an exchange, try to pay by card, and ask in another language. Then add yourself to a COD campaign and take the call.</> },
          ]} />
          <PromptFile name="store-voice-agent-instructions.txt" text={prompt} />
          <Note>Wapzen has no built-in Shopify or WooCommerce connection. Those platforms have APIs, so someone technical can point the agent’s API tools at them, either directly or through a no-code service.</Note>
        </>,
      },
      {
        id: "cost",
        title: "What a retail AI voice agent costs",
        body: <>
          <RowTable caption="Retail AI voice agents compared, prices checked 21 November 2026" firstColumn="Option" columns={["Price", "Calls on", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p>A store handling 800 calls a month at two minutes each uses 1,600 minutes: about <strong>$176</strong> at Retell’s calculator default of $0.11 a minute, or <strong>$224</strong> on Bland’s Start plan, before phone costs. On Wapzen it’s free, because the calls run over WhatsApp.</p>
          <p><strong>Choose a phone-line platform</strong> if most shoppers ring your landline, or you confirm thousands of orders a day from an uploaded list. <strong>Choose Wapzen</strong> if your shoppers already use WhatsApp and you want their calls answered and their COD orders confirmed for free. For written chats on the same number, see the <Link href="/blog/whatsapp-ai-sales-agent">WhatsApp AI sales agent guide</Link>.</p>
        </>,
      },
    ]}
    faq={[
      { q: "What is a retail AI voice agent?", a: "A retail AI voice agent is software that answers and makes calls for a shop, online store or brand in a natural voice. It answers questions about hours, products, prices, delivery and returns, checks stock and order status through the store’s systems, and calls buyers to confirm cash-on-delivery orders. Wapzen runs one on an existing WhatsApp number, free." },
      { q: "Can an AI voice agent check stock and order status?", a: "Yes, through API request tools connected to your store system. The agent asks for the product and size, or the order number, reads it back and gives the live answer during the call. Without an API it can only answer from a stock list you upload." },
      { q: "Can it call buyers to confirm cash-on-delivery orders?", a: "Yes. Add buyers to an outbound campaign and the agent calls each one on WhatsApp to confirm they still want the order and will be home to pay. Every buyer in a campaign hears the same opening, and your team ships or cancels from the answers." },
      { q: "Does it work with Shopify or WooCommerce?", a: "There’s no built-in connection, but both have APIs. Someone technical can point the agent’s API tools at them, directly or through a no-code service such as Make or Zapier, so it can look up orders and stock during calls." },
      { q: "Can the voice agent take payments?", a: "No, and it shouldn’t. It never takes card numbers or bank details on the call. It sends a payment link from your own payment provider to the shopper’s WhatsApp instead." },
      { q: "Can it handle returns and exchanges?", a: "It explains your return and exchange rules, sends the steps on WhatsApp, and can start a return through an API tool once the shopper confirms the order and the item. Refunds stay with your team." },
      { q: "Can it make promotional calls?", a: "Only to people who gave you their number and agreed to hear from you, as WhatsApp’s policy requires. Calls about a buyer’s own order are the safer and more useful use." },
      { q: "Does it speak other languages?", a: "Yes. Set one language, or choose Multilingual and it replies in the language each shopper speaks." },
      { q: "How much does a retail AI voice agent cost?", a: "Wapzen is free, with no per-minute fees. Phone-line platforms charge by the minute: Retell AI $0.07–$0.31 and Bland AI $0.14 on its Start plan, plus phone costs (checked 21 November 2026)." },
    ]}
    sources={[
      { label: "ClickPost: cash on delivery statistics in India (Meesho filing figures)", href: "https://www.clickpost.ai/blog/cash-on-delivery-statistics-india" },
      { label: "WhatsApp Business Messaging Policy (updated 23 September 2026): opt-in, prohibited and regulated goods", href: "https://whatsappbusiness.com/policy/" },
      { label: "Retell AI: pricing", href: "https://www.retellai.com/pricing" },
      { label: "Bland AI: pricing", href: "https://www.bland.ai/pricing" },
      { label: "Vapi: pricing", href: "https://vapi.ai/pricing" },
    ]}
    related={["/blog/whatsapp-cod-order-confirmation", "/blog/ai-voice-agent-for-logistics"]}
    product="/free-ai-calling-agent"
    cta={{ heading: <>Answer every shopper’s call.<br /><span>Free, on your store’s own WhatsApp number.</span></>, body: "Message our team on WhatsApp. We’ll switch the voice agent on, and you can link your number, add your catalogue and take the first call today." }}
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
  />;
}
