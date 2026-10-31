import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp food ordering system" (105, 5/5), "whatsapp ordering system
// free" (76), "whatsapp food ordering" (71), "…bot" (63), "how to take orders
// on whatsapp business" (50, 5/5), "whatsapp order bot" (40), autocomplete
// 2026-10-28. Describes what the product does today, so keep it in step with
// the server: chat agents answer one-to-one text, don't see the customer's
// number (hence the contact-number question), and run api_request tools, which
// POST their parameters as JSON and follow redirects (Apps Script needs that).
const href = "/blog/whatsapp-food-ordering-system";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const options = [
  ["How orders arrive", "Customers add dishes to a cart and send it to you", "Through a menu link, buttons, or a bot flow", "Customers type their order; the AI checks it, confirms it, and logs it"],
  ["Who answers “is it spicy?”", "You", "Fixed menus, or your staff", "The AI, from your menu"],
  ["Needs the Business API", "No", "Usually", "No"],
  ["Cost", "Free", "A monthly plan, often plus Meta’s message fees", "Free right now"],
  ["Best for", "A few orders a day", "Chains and high volumes", "Busy kitchens that want orders logged"],
];

const parameters = [
  ["customer_name", "string", "The customer’s name."],
  ["contact_number", "string", "A phone number for the delivery rider, with the country code."],
  ["items", "string", "Every item with quantity and options, e.g. “2 x Paneer roll (extra spicy), 1 x Lime soda”."],
  ["address", "string", "The full delivery address, or PICKUP for collection."],
  ["total", "number", "The order total, including the delivery fee."],
  ["payment", "string", "How the customer will pay, e.g. cash on delivery."],
  ["notes", "string (optional)", "Allergies, cutlery, or delivery instructions."],
];

const script = `// In your Orders sheet: Extensions › Apps Script. Paste this, change KEY,
// then Deploy › New deployment › Web app (Execute as: Me, Who has access: Anyone).
const KEY = "replace-with-a-long-random-word";

function doPost(e) {
  if (e.parameter.key !== KEY) return reply({ ok: false, error: "wrong key" });
  const order = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet.appendRow([new Date(), order.customer_name, order.contact_number, order.items,
      order.address, order.total, order.payment, order.notes || "", "New"].map(safe));
    return reply({ ok: true, order_number: sheet.getLastRow() - 1 });
  } finally {
    lock.releaseLock();
  }
}

// Customers type this text: never let it start a formula.
function safe(value) {
  return typeof value === "string" && /^[=+\\-@]/.test(value) ? "'" + value : value;
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

const prompt = `You are the WhatsApp ordering assistant for [Restaurant], a [cuisine] kitchen in [area]. You take delivery and pickup orders and answer questions about the menu.

Use only the menu, prices, and delivery rules in your knowledge base. If something isn't there, say a person will reply shortly.

To take an order:
1. Ask what they'd like. Check every dish and option against the menu, and say so if a dish is sold out.
2. Ask: delivery or pickup? For delivery, get the full address and check it's in our delivery area.
3. Ask for their name and a contact number for the rider.
4. Ask how they'll pay: [cash or UPI on delivery].
5. Read the order back with the total, including any delivery fee, and ask them to confirm.
6. Only after they confirm, use save_order. Then give them the order number from its response and say it will be ready in [35–45 minutes].

Rules: short replies, one question at a time. Never invent dishes, prices, or discounts. Complaints, refunds, and catering go to a person: say [Name] will reply shortly.`;

const faqs = [
  { q: "Can I take food orders on WhatsApp for free?", a: "Yes. The WhatsApp Business app's catalog and cart are free: customers pick dishes and send the cart to you. To have orders taken and logged automatically, Wapzen's AI chat agent is currently free and can save each confirmed order to a Google Sheet or any other webhook." },
  { q: "How do I take orders on WhatsApp Business?", a: "Add your dishes to the catalog in the WhatsApp Business app with photos and prices, and make sure carts are on in the catalog settings. Customers browse with the shopping button, add items to a cart, and send it to you. The order isn't final until you confirm it in the chat." },
  { q: "Can a WhatsApp bot take food orders automatically?", a: "Yes. An AI chat agent can answer menu questions, take the order in a normal conversation, read it back with the total, and send the confirmed order to your system through an API request tool. With Wapzen it works on your existing number, without the Business API." },
  { q: "Where do the WhatsApp orders go?", a: "Wherever your tool sends them. A free option is a Google Sheet with a short Apps Script that adds a row per order. The same tool can post to Zapier, Make, n8n, or your POS system if it accepts orders through an API." },
  { q: "How do customers pay for WhatsApp food orders?", a: "Most small kitchens take cash or a card or UPI payment on delivery, or share a payment link before dispatch. Wapzen's agent doesn't take payments itself; it can tell customers how to pay, using the options in your instructions." },
  { q: "Do I need the WhatsApp Business API for a food ordering system?", a: "No. The catalog and cart work in the free WhatsApp Business app, and an AI agent can take orders on a number linked by QR code. Ordering platforms built on the Business API add features like in-chat menus and payments, but also monthly plans and Meta's per-message fees." },
];

const sources = [
  { label: "WhatsApp Help Center: About cart", href: "https://faq.whatsapp.com/1184376605821468" },
  { label: "WhatsApp Help Center: How to use cart on WhatsApp Business", href: "https://faq.whatsapp.com/3569210309807042" },
  { label: "Google Apps Script: Web apps", href: "https://developers.google.com/apps-script/guides/web" },
];

const sections = [
  {
    id: "options",
    title: "Three ways to take food orders on WhatsApp",
    body: <>
      <p>Customers already message restaurants on WhatsApp to order. The question is what happens next: who replies, who checks the order against the menu, and where it ends up so the kitchen sees it. There are three setups:</p>
      <Comparison caption="Three ways to run a WhatsApp food ordering system" columns={["Business catalog and cart", "Ordering platform", "AI agent (Wapzen)"]} rows={options} />
      <p>Most small kitchens start with the first and outgrow it at dinner rush, when replies pile up and orders get lost in chats. This post covers all three, then builds the third step by step: an AI agent that takes orders in plain conversation and writes each one to a Google Sheet.</p>
    </>,
  },
  {
    id: "catalog",
    title: "The free way: the WhatsApp Business catalog and cart",
    body: <>
      <p>The WhatsApp Business app has a built-in menu, called the <strong>catalog</strong>, and a <strong>cart</strong>:</p>
      <ol>
        <li><strong>Add your dishes to the catalog</strong> in the app’s business tools, each with a photo, price, and a line on what’s in it.</li>
        <li><strong>Check that carts are on</strong> in the catalog settings. WhatsApp turns them on by default, and a change can take up to 24 hours to show.</li>
        <li><strong>Customers order</strong> by tapping the shopping button in your chat, adding dishes to the cart, and sending it to you.</li>
        <li><strong>You confirm the order</strong> in the chat, with the total, delivery time, and how to pay. WhatsApp says an order isn’t final until the seller confirms it.</li>
      </ol>
      <p>Quick replies save typing the same confirmation every time, and labels (New order, Paid, Out for delivery) help you keep track. The catch: you still answer every question and confirm every order by hand, which is the part that breaks at 8 pm on a Friday.</p>
      <p>To get diners into that chat, print a <Link href="/tools/whatsapp-qr-code-generator#examples">WhatsApp QR code for your tables or menus</Link>. One scan opens a chat with you, and the code can carry a pre-filled message such as a table number.</p>
    </>,
  },
  {
    id: "platforms",
    title: "Ordering platforms on the Business API",
    body: <>
      <p>Dedicated ordering platforms run on Meta’s WhatsApp Business API. They send menus with buttons, carts, and payment links, and push orders into a dashboard or POS. They suit chains and high volumes.</p>
      <p>The trade-offs are cost and setup: a monthly plan, Meta’s per-message fees on top (see <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>), and a number moved onto the API. Many still answer free-text questions like “can you make it less spicy?” with a menu or a person.</p>
    </>,
  },
  {
    id: "ai-agent",
    title: "An AI agent that takes the order",
    body: <>
      <p>The third way keeps ordering conversational. Customers type the way they always have, and an AI chat agent handles the order:</p>
      <ol>
        <li>A customer writes: “2 paneer rolls, extra spicy, and a lime soda to Baner.”</li>
        <li>The agent checks the dishes and the delivery area against your menu, and asks for anything missing: name, address, contact number, how they’ll pay.</li>
        <li>It reads the order back with the total and waits for a “yes”.</li>
        <li>It sends the order to your sheet with a <strong>tool</strong> and replies with the order number and the time it’ll be ready.</li>
      </ol>
      <p>With Wapzen, this runs on the number customers already use, linked by QR code, with no Business API. Setting it up takes four steps.</p>
      <InlineCta title="Let AI take your WhatsApp orders" body="Free right now: an AI chat agent on your existing number that answers menu questions and logs every confirmed order." />
    </>,
  },
  {
    id: "menu",
    title: "Step 1: Put your menu in a knowledge base",
    body: <>
      <p>In Wapzen, open <strong>Knowledge Base</strong>, click <strong>New</strong>, and add your menu as text, a PDF, or a Word file. The agent can only be as accurate as this document, so include:</p>
      <ul>
        <li>Every dish with its <strong>price</strong>, sizes, and options (spice level, add-ons).</li>
        <li><strong>Veg, vegan, and allergen</strong> notes, written plainly.</li>
        <li><strong>Delivery areas</strong>, fees, minimum order, and typical delivery times.</li>
        <li><strong>Opening hours</strong> and when the kitchen stops taking orders.</li>
        <li><strong>Payment options</strong> you accept.</li>
      </ul>
      <p>Update it when a dish sells out or a price changes: a two-line “Sold out today” section at the top works.</p>
    </>,
  },
  {
    id: "sheet",
    title: "Step 2: Send orders to a Google Sheet",
    body: <>
      <p>The agent needs somewhere to send each order. A Google Sheet is free, and the kitchen can keep it open on a tablet:</p>
      <ol>
        <li>Create a sheet, rename the tab <strong>Orders</strong>, and add headers: Time, Name, Contact, Items, Address, Total, Payment, Notes, Status.</li>
        <li>Open <strong>Extensions › Apps Script</strong> and paste the script below. Change <code>KEY</code> to a long random word.</li>
        <li>Click <strong>Deploy › New deployment</strong>, choose <strong>Web app</strong>, set <strong>Execute as: Me</strong> and <strong>Who has access: Anyone</strong>, and authorise it.</li>
        <li>Copy the web app URL and add <code>?key=</code> plus your key to the end.</li>
      </ol>
      <pre><code>{script}</code></pre>
      <p>Each order becomes a row with the status <strong>New</strong>; change it to Cooking or Sent as you go. The key in the URL keeps strangers from adding rows. Zapier, Make, n8n, or your POS’s own API work the same way if you prefer them: anything with a URL that accepts JSON.</p>
    </>,
  },
  {
    id: "tool",
    title: "Step 3: Create the save_order tool",
    body: <>
      <p>Open <strong>Tools</strong>, click <strong>Create Tool</strong>, and choose <strong>API Request</strong>:</p>
      <ul>
        <li><strong>Name:</strong> <code>save_order</code></li>
        <li><strong>Description:</strong> “Save a confirmed food order. Use only after the customer has confirmed the items and total.”</li>
        <li><strong>Method:</strong> POST, and <strong>URL:</strong> your web app URL with <code>?key=…</code></li>
        <li><strong>Parameters:</strong> add these, each marked required except notes:</li>
      </ul>
      <Comparison caption="Parameters for the save_order tool" columns={["Type", "Description to give the agent"]} rows={parameters} />
      <p>The agent fills each parameter from the conversation, and Wapzen sends them to your URL as JSON. The sheet’s reply, with the order number, goes back to the agent so it can tell the customer.</p>
      <Note>The agent doesn’t see the customer’s WhatsApp number, which is why it asks for a contact number. The rider needs one anyway, and it may not be the number they’re chatting from.</Note>
    </>,
  },
  {
    id: "instructions",
    title: "Step 4: Write the ordering instructions and go live",
    body: <>
      <p>With the dashboard in <strong>Chat</strong> mode, open <strong>Chat Agents</strong>, click <strong>New chat agent</strong>, and paste instructions like these into its system prompt, filling in the brackets:</p>
      <pre><code>{prompt}</code></pre>
      <p>Attach the menu knowledge base and the <code>save_order</code> tool. Then open <strong>Phone Numbers</strong>, click <strong>New Number</strong>, scan the QR code from WhatsApp’s <strong>Linked devices</strong> screen, and pick this agent for the number. The <Link href="/blog/whatsapp-chatbot-without-business-api#connect">chatbot guide</Link> shows that step with screenshots.</p>
      <p><strong>Test with five real orders</strong> from another phone, including a dish that doesn’t exist, an address outside your area, and a change of mind halfway through. Check each row in the sheet.</p>
      <p>Customers who’d rather call can order by voice too: a Wapzen voice agent with the same <code>save_order</code> tool answers WhatsApp calls and takes the order out loud.</p>
    </>,
  },
  {
    id: "tips",
    title: "Tips that prevent wrong orders",
    body: <>
      <ul>
        <li><strong>Always read the order back</strong> with the total before saving. Most mistakes are caught right there.</li>
        <li><strong>Put the delivery area and minimum order early</strong> in the conversation, not after the customer has chosen five dishes.</li>
        <li><strong>Give a time range</strong> (35–45 minutes), not a promise.</li>
        <li><strong>Hand over complaints and refunds.</strong> A short apology and “the owner will reply” beats an AI arguing about a cold pizza.</li>
        <li><strong>Read the day’s chats</strong> for a week and add every unanswered question to the knowledge base.</li>
        <li><strong>Keep an eye on carts.</strong> The chat agent answers text messages, not voice notes or images, so if you also use the catalog, check carts yourself.</li>
      </ul>
      <p>Selling products rather than meals? The same pattern works for stores, and <Link href="/blog/whatsapp-cod-order-confirmation">COD order confirmation calls</Link> cut fake cash-on-delivery orders. For bookings instead of orders, see <Link href="/blog/whatsapp-appointment-booking">WhatsApp appointment booking</Link>.</p>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device. Use it to answer customers who message you, never to send bulk messages: WhatsApp restricts numbers that do.</Note>
    </>,
  },
];

export default function WhatsAppFoodOrderingSystemPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp food ordering system.<br /><span>Take orders for free.</span></>}
    lead="Three ways to take food orders on WhatsApp, from the free catalog and cart to an AI agent that takes each order in conversation, reads it back, and logs it in a Google Sheet your kitchen can see. With the script and instructions to copy."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Free and manual:</strong> the WhatsApp Business catalog and cart. Customers send a cart; you confirm each order yourself.</>,
        <><strong>Automatic:</strong> an AI chat agent reads your menu, takes the order in plain conversation, and saves it to a sheet with an API tool.</>,
        <><strong>No Business API needed</strong> for either. Ordering platforms on the API add in-chat menus and payments, with monthly and per-message costs.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/what-is-a-whatsapp-chatbot", "/blog/whatsapp-appointment-booking"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Orders in, even at rush hour.<br /><span>Answered by AI.</span></>, body: "Create a free AI chat agent, upload your menu, and connect your WhatsApp number by QR code. It starts taking orders right away." }}
  />;
}
