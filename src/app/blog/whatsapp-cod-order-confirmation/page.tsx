import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Note, Screenshot } from "@/components/blog/BlogPost";

// Targets "cod order confirmation" (+ shopify / whatsapp), "cod order
// verification", "whatsapp order confirmation", autocomplete 2026-10-25.
// Describes what the product does today, so keep it in step with the server:
// leads carry only phone, name and email (the agent can't read order details),
// adding a lead dials at once, leads are unique per campaign and nothing
// redials on its own.
const href = "/blog/whatsapp-cod-order-confirmation";
const post = blogPost(href);
const img = (file: string) => `/blog/whatsapp-cod-order-confirmation/${file}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const methods = [
  ["How it works", "Someone on your team rings each buyer", "A template message with Confirm and Cancel buttons", "An AI agent calls each buyer and talks it through"],
  ["Needs the Business API", "No", "Yes, plus an approved template", "No"],
  ["Handles questions and address changes", "Yes", "No", "Yes, and they’re in the transcript"],
  ["Easy to ignore", "No", "Yes, it’s one more message", "Less, it’s a call"],
  ["Cost per order", "Staff time", "A template charge per message", "Free right now with Wapzen"],
];

const prompt = `You are Riya, calling customers of [Store], an online store, to confirm their cash on delivery (COD) orders.

1. Greet them, say you're calling from [Store] about the cash on delivery order they placed on our website, and ask if they have a minute.
2. Ask them to confirm they placed the order and still want it delivered.
3. If yes: say delivery takes [2 to 4 days] and to keep the cash ready. Use send_order_confirmation, then thank them and use end_call.
4. If they want to change the address or delivery time: ask for the new details, repeat them back, and say the team will update the order.
5. If they did not place the order or want to cancel: say you'll cancel it, apologise, and use end_call.

Rules: one or two short sentences per reply. Never ask for card or bank details. If they ask something you don't know, say the team will reply on WhatsApp.`;

const request = `POST /v1/outbound-campaigns/{campaign_id}/leads
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{ "phone_number": "+91XXXXXXXXXX", "first_name": "Ananya", "last_name": "Iyer" }`;

const faqs = [
  { q: "How do I automate COD order confirmation?", a: "Add each cash on delivery order to an outbound calling campaign in Wapzen, either by hand or automatically through the API. A voice agent calls the buyer on WhatsApp straight away, asks them to confirm, sends a WhatsApp confirmation message, and saves the transcript, so you only act on cancellations and changes." },
  { q: "Can I confirm COD orders on WhatsApp without the Business API?", a: "Yes. Confirmation messages with buttons need the Business API and an approved template, but a WhatsApp call doesn't. Wapzen calls from your own number, linked by QR code, so there's no API account, template, or per-message fee." },
  { q: "Does it work with Shopify or WooCommerce?", a: "Not as a store app yet. Connect them through Wapzen's API with an automation tool such as Shopify Flow, Zapier, Make, or n8n: when a COD order is placed, the automation adds the buyer as a lead, and the call goes out." },
  { q: "What happens if the buyer doesn't answer?", a: "The lead is marked Call unsuccessful. Wapzen doesn't redial on its own yet, so send that buyer a WhatsApp message, or remove the lead and add it again later to place another call." },
  { q: "Can the AI read out the order items and amount?", a: "Not yet. A lead carries the buyer's phone number, name, and email, not the order, so the agent confirms the order they placed without listing it. Calling within minutes of the order helps, because buyers remember what they just bought." },
  { q: "How much do COD confirmation calls cost?", a: "Wapzen is currently free, and WhatsApp calls from your linked number have no per-minute charge. Compare that with staff time for manual calls, or a template charge on every confirmation message sent through the Business API." },
];

const sections = [
  {
    id: "why",
    title: "Why confirm cash on delivery orders?",
    body: <>
      <p>Every COD order that’s refused at the door comes back to you as a return to origin (RTO): you pay shipping both ways, the stock is stuck in transit, and the courier sees a worse delivery rate. Fake orders, impulse buys, and wrong addresses cause most of them, and a quick check before you ship filters many out.</p>
      <p>Stores usually confirm in one of three ways:</p>
      <Comparison caption="Three ways to confirm cash on delivery orders" columns={["Calls by your team", "WhatsApp message with buttons", "AI call on WhatsApp"]} rows={methods} />
      <p>This guide sets up the third: an AI voice agent that calls each COD buyer on WhatsApp, confirms the order, and sends them a WhatsApp message with the details. The screenshots come from Wapzen’s dashboard, set up for Sunleaf, a demo skincare store.</p>
    </>,
  },
  {
    id: "how-it-works",
    title: "How the setup fits together",
    body: <>
      <ul>
        <li>A <strong>voice agent</strong> holds the confirmation script and speaks to the buyer.</li>
        <li>Two <strong>tools</strong> let it act: one sends a WhatsApp confirmation message, one ends the call politely.</li>
        <li>An <strong>outbound campaign</strong> uses that agent. Every COD order you add as a <strong>lead</strong> gets a call at once.</li>
        <li>The <strong>Leads</strong> and <strong>Calls</strong> tabs show who confirmed, who didn’t answer, and what everyone said.</li>
      </ul>
      <Note>One limit to plan around: a lead carries a phone number, name, and email, not the order itself. The agent confirms “the order you placed with us” rather than reading out items and the amount, so call while the order is fresh.</Note>
    </>,
  },
  {
    id: "agent",
    title: "Step 1: Create the COD voice agent",
    body: <>
      <p>With the dashboard in <strong>Voice</strong> mode, open <strong>Agents</strong>, click <strong>New Agent</strong>, and set the call direction to <strong>Outbound</strong>. Then fill in two boxes:</p>
      <ul>
        <li><strong>Welcome message</strong>, with “Agent speaks first”: the line the buyer hears when they pick up. Name your store in the first sentence so nobody hangs up on an unknown caller.</li>
        <li><strong>General prompt</strong>: the script. Here’s the one in the screenshot, ready to adapt:</li>
      </ul>
      <pre><code>{prompt}</code></pre>
      <p>Set the <strong>language</strong> your buyers speak. Voice agents speak dozens of languages, including Hindi, Bengali, and Tamil. Then click <strong>Publish</strong>.</p>
      <Screenshot src={img("cod-voice-agent.webp")} width={2496} height={1656} alt="Wapzen voice agent editor for a COD confirmation agent with a welcome message and call script" caption="The COD Confirmation agent: outbound, a short welcome message, the script, and two tools attached." />
    </>,
  },
  {
    id: "tools",
    title: "Step 2: Give the agent two tools",
    body: <>
      <p>Open <strong>Tools</strong> and click <strong>Create Tool</strong> twice:</p>
      <ul>
        <li>A <strong>Send Text</strong> tool named <code>send_order_confirmation</code>. Its message goes to the person on the call, as a normal WhatsApp message, so the buyer has the confirmation in writing. Write the text yourself, or leave it blank and the agent writes it.</li>
        <li>An <strong>End Call</strong> tool, so the agent hangs up after its goodbye instead of waiting for the buyer to.</li>
      </ul>
      <p>Then go back to the agent and attach both under <strong>Tools</strong>. The tool names in the script must match.</p>
      <Screenshot src={img("send-text-tool.webp")} width={2272} height={1466} alt="Wapzen Send Text tool that sends a WhatsApp cash on delivery confirmation message during the call" caption="The description tells the agent when to use the tool; the body is the WhatsApp message the buyer receives." />
    </>,
  },
  {
    id: "number",
    title: "Step 3: Connect your store’s WhatsApp number",
    body: <>
      <p>Calls go out from your own WhatsApp number. Open <strong>Phone Numbers</strong>, click <strong>New Number</strong>, and scan the QR code from WhatsApp’s <strong>Linked devices</strong> screen on your phone. Then choose that number in the agent’s <strong>Phone number</strong> setting. The <Link href="/blog/whatsapp-chatbot-without-business-api#connect">chatbot guide</Link> shows this step with screenshots.</p>
      <p>Use the number your buyers already know, the one on your website or order emails. Buyers are more likely to pick up when they recognise the number calling them.</p>
    </>,
  },
  {
    id: "campaign",
    title: "Step 4: Create the campaign and add orders",
    body: <>
      <p>Open <strong>Outbound</strong>, click <strong>New campaign</strong>, name it, and pick the COD agent. When you’re ready, use <strong>Edit</strong> to set its status to Running. Then open <strong>Leads › Add Lead</strong>, enter the buyer’s number in international format with their name, and save. <strong>Adding a lead places the call straight away.</strong> Add your own number first to hear the call yourself.</p>
      <Screenshot src={img("campaign-leads.webp")} width={2272} height={1424} alt="Wapzen outbound campaign leads table with COD buyers marked contacted, calling, pending or call unsuccessful" caption="Each COD order is a lead. Contacted means the buyer picked up; Call unsuccessful means they declined or didn’t answer." />
      <h3>Add orders automatically</h3>
      <p>Typing in every order works for a handful a day. For more, let your store add them. Create a key under <strong>API Keys</strong>, then have your automation tool (Shopify Flow, Zapier, Make, or n8n) send one request for each new COD order:</p>
      <pre><code>{request}</code></pre>
      <p>Filter the trigger to cash on delivery orders only, so prepaid buyers don’t get a call. The response tells you whether the call went out, and if not, why.</p>
    </>,
  },
  {
    id: "results",
    title: "Step 5: Read the answers and update your orders",
    body: <>
      <p>Open a call from the campaign’s <strong>Calls</strong> tab, or from <strong>Calls</strong> in the sidebar, to read the full transcript. Then act on it in your store:</p>
      <ul>
        <li><strong>Confirmed:</strong> ship it. The buyer already has the WhatsApp confirmation.</li>
        <li><strong>Cancelled or “I didn’t order this”:</strong> cancel before it ships.</li>
        <li><strong>New address or delivery time:</strong> it’s in the transcript; update the order.</li>
        <li><strong>Call unsuccessful:</strong> Wapzen doesn’t redial on its own yet. Message the buyer on WhatsApp, or remove the lead and add it again later for a second call. Hold the parcel until you hear back.</li>
      </ul>
      <Screenshot src={img("call-transcript.webp")} width={2000} height={1174} alt="Transcript of an AI COD confirmation call on WhatsApp where the buyer confirms the order" caption="A confirmed order in under a minute. The buyer also received the WhatsApp confirmation message during the call." />
      <p>The download button in the Leads tab exports every lead and status as a CSV, if you’d rather reconcile in a spreadsheet.</p>
      <p>To cut down on calls after delivery, print a free <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code</Link> on the delivery slip, so buyers can reach you about their order in one scan.</p>
    </>,
  },
  {
    id: "tips",
    title: "Tips for COD calls that get answered",
    body: <>
      <ul>
        <li><strong>Call within minutes of the order.</strong> The buyer still has their phone in hand and remembers what they bought.</li>
        <li><strong>Hold night orders until morning.</strong> Calls go out as soon as a lead is added, so queue orders placed late at night in your automation.</li>
        <li><strong>Keep it under a minute.</strong> Confirm, mention payment, send the message, say goodbye. Long scripts get hang-ups.</li>
        <li><strong>Never ask for payment details.</strong> Say so in the script. Buyers are rightly wary of calls asking for card numbers.</li>
        <li><strong>Only call people who just ordered.</strong> They expect to hear from you. Calling people who didn’t ask breaks WhatsApp’s terms and gets numbers restricted.</li>
      </ul>
      <p>Buyers can only be reached if their number is on WhatsApp. Those who aren’t show up as Call unsuccessful, so keep a fallback for them, such as an SMS or a call from your team.</p>
    </>,
  },
];

export default function WhatsAppCodConfirmationPage() {
  return <BlogPost
    href={href}
    heading={<>COD order confirmation on WhatsApp.<br /><span>Automated with an AI call.</span></>}
    lead="Cash on delivery orders refused at the door cost you shipping both ways. Confirming each one before it ships filters out many of them. This guide sets up an AI voice agent that calls every COD buyer on WhatsApp, confirms the order, and sends a WhatsApp confirmation, step by step."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Why:</strong> refused COD parcels (RTO) cost you shipping both ways. A quick confirmation before dispatch weeds out fake and impulse orders.</>,
        <><strong>How:</strong> a Wapzen voice agent calls each buyer on WhatsApp the moment you add the order to a campaign, by hand or through the API, and sends a WhatsApp confirmation message.</>,
        <><strong>What you get:</strong> each order’s status and the full call transcript. Ship the confirmed ones and fix or cancel the rest. It’s free right now.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    related={["/blog/whatsapp-chatbot-without-business-api", "/blog/wapzen-vs-interakt"]}
    product="/ai-calling-agent-india"
    cta={{ heading: <>Confirm every COD order.<br /><span>Without lifting the phone.</span></>, body: "Create a free AI voice agent, connect your store’s WhatsApp number, and let it call each cash on delivery buyer for you." }}
  />;
}
