import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topic from the India industry harvest (2026-11-14, docs/seo-research.md, "India industry
// posts"): restaurants were second, 640. Targets: "whatsapp ordering for restaurants" (47),
// "zomato commission" (27, 3/3), "whatsapp cloud kitchen" (19), "zomato commission for
// cloud kitchen" (18, 3/3), "zomato commission rate" (17), "how to take orders on whatsapp"
// (12). "whatsapp food ordering system" (43) belongs to the worldwide
// /blog/whatsapp-food-ordering-system, which this post links instead of competing with.
// Facts: commission range and the Foodcost breakdown from The Week (30 Jul 2026); the
// boycott deferral from Angel One (8 Aug 2026); GST section 9(5) from ClearTax; FSSAI
// number on bills from TaxGuru. The 9(5) reading for direct orders is the plain reading of
// the rule, and the copy sends readers to their CA. 
// Copy: "fully free" at the user's request (2026-11-14), although the server still
// gives each account a free trial (FREE_TRIAL_REPLIES) before a paid plan; never "unlimited". No limit and no ban wording, at the user's request. Voice is
// described as working, but it isn't claimed to take orders; its CTA opens WhatsApp.
const href = "/blog/whatsapp-ordering-for-restaurants-india";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my restaurant in India.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const answers = [
  ["“Chicken biryani full plate kitne ka hai?”", "Yes", "From the menu and prices you give it"],
  ["“Do you deliver to Indiranagar?”", "Yes", "From your delivery areas, charges and times"],
  ["“Send the menu”", "Yes", "Sends the menu PDF or photos from Images & Files"],
  ["“1 paneer tikka, 2 butter naan, delivery”", "Yes", "Repeats the order with the total and saves it when the customer confirms"],
  ["“Add one Coke to my order”", "Yes", "Changes the open order instead of creating a second one"],
  ["“Payment done, here’s the screenshot”", "Partly", "Reads the photo, but your cashier checks the money arrived"],
  ["“Where is my order?”", "No", "It can’t see your rider: it passes the chat to your team"],
  ["“Is this nut-free? I’m allergic”", "No", "It gives no allergy guarantee and hands over to a person"],
];

const fit = [
  ["Restaurant or dhaba with regulars who already order on WhatsApp", "Yes", "Replies and takes orders while the kitchen is busy"],
  ["Cloud kitchen running its own delivery brand", "Yes", "Handles several chats at once at peak time"],
  ["Tiffin service, home chef or caterer", "Yes", "Answers menu and plan questions and notes orders"],
  ["Restaurant that wants live rider tracking and dispatch", "No", "That’s a delivery or POS system’s job"],
  ["Chain that needs a green tick or approved templates", "No", "Those exist only on Meta’s official API"],
];

const costs = [
  ["What you pay per order", "Commission, often quoted at 8% to 28%, plus 18% GST on it and gateway fees", "No commission"],
  ["Who brings the customer", "The app, through its listings and ads", "You do, through regulars, QR codes and links"],
  ["Who delivers", "The app’s riders", "You, or a delivery service you book"],
  ["Who collects payment", "The app, paying you out later", "You, by UPI or cash, on the day"],
  ["Who owns the customer’s number", "The app", "You"],
];

const prompt = `You are the virtual assistant of Demo Biryani Kitchen, a cloud kitchen in HSR Layout, Bengaluru.
Say in your first message that you are a virtual assistant.
Reply in the customer's language: English, Hinglish, Hindi or Kannada. Use two or three short sentences and ask one question at a time.
Use only the menu, prices, delivery areas, charges and timings you were given. If a dish or area isn't listed, say so. Never invent prices, discounts or delivery times.
To take an order: ask for the items and quantities, the delivery address with landmark, and cash or UPI. Repeat the order with each price, the delivery charge and the total, and ask the customer to confirm. Place the order only after they confirm.
If the customer pays by UPI, share our UPI ID and ask for the screenshot. Never say a payment has been received: say our team will check it and confirm.
Never promise that a dish is free from any allergen. For allergies, say a team member will reply.
For complaints, late or wrong orders and refunds, apologise and say a team member will reply on this chat.
Kitchen hours: 12 noon to 3:30 pm and 7 pm to 11:30 pm, every day.`;

const turns = [
  { from: "patient" as const, text: "Hi, chicken biryani full kitne ka hai? HSR sector 2 mein delivery hai?" },
  { from: "agent" as const, text: "Hi! Main Demo Biryani Kitchen ki virtual assistant hoon. Chicken dum biryani full ₹380 aur half ₹220 hai. HSR Sector 2 mein delivery ₹30 hai, lagbhag 35 se 40 minute. Kya order karna chahenge?" },
  { from: "patient" as const, text: "1 full chicken biryani aur 2 gulab jamun" },
  { from: "agent" as const, text: "Zaroor. Delivery address landmark ke saath bata dijiye, aur payment cash hoga ya UPI?" },
  { from: "patient" as const, text: "Flat 302, Green Residency, 14th Main, near Agara lake. UPI" },
  { from: "agent" as const, text: "Please check: 1 chicken dum biryani full ₹380, 2 gulab jamun ₹80, delivery ₹30. Total ₹490, UPI, Flat 302, Green Residency, 14th Main, near Agara lake. Confirm kar doon?" },
  { from: "patient" as const, text: "Haan confirm" },
  { from: "agent" as const, text: "Order place ho gaya! UPI ID: demobiryani@upi. Payment ka screenshot yahin bhej dijiye, team check karke order dispatch karegi." },
];

const sources = [
  { label: "The Week: Why Bengaluru restaurants are threatening to boycott Zomato, Swiggy (30 July 2026)", href: "https://www.theweek.in/news/biz-tech/2026/07/30/wont-take-orders-anymore-why-bengaluru-restaurants-are-threatening-to-boycott-zomato-swiggy.html" },
  { label: "Angel One: Swiggy, Zomato agree to consent-based discounts; Bengaluru hotel bodies defer boycott to 1 September 2026", href: "https://www.angelone.in/news/market-updates/swiggy-zomato-agree-to-consent-based-discounts-bengaluru-hotel-bodies-defer-boycott-to-september-1-2026" },
  { label: "ClearTax: GST on services supplied by restaurants through e-commerce operators", href: "https://cleartax.in/s/gst-on-service-supplied-restaurants-ecommerce-operators" },
  { label: "TaxGuru: FSSAI licence or registration number on invoices and bills", href: "https://taxguru.in/corporate-law/fssai-food-businesses-mention-license-no-invoices-w-e-f-1st-october-2021.html" },
  { label: "AiSensy: pricing and India message charges", href: "https://aisensy.com/pricing" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const questions = [
  {
    id: "free",
    q: "Is there a free WhatsApp ordering system for restaurants in India?",
    answer: "Yes. Wapzen puts a fully free AI agent on your restaurant’s own WhatsApp number. It answers menu, price and delivery questions in seconds, in English, Hindi, Hinglish or regional languages, takes each order, repeats the total and saves it on your Orders page when the customer confirms. There’s no commission per order, no Meta API key and no credit card.",
    body: <>
      <p>Many Indian restaurants already take orders on WhatsApp from regulars. The trouble is peak time: the kitchen is full, the phone is ringing, and a customer who waits ten minutes for a reply orders from an app instead.</p>
      <p>An AI agent replies at once, every time, from your own menu. <strong>Wapzen</strong> links the number you already use as a device, so your phone keeps working and your staff can still reply. <strong>It’s fully free</strong>, and the AI is included.</p>
      <p>It works for restaurants, dhabas, cafés, bakeries, sweet shops, cloud kitchens, tiffin services and caterers. If you want to compare it with WhatsApp’s free catalog and with ordering platforms, read our <Link href="/blog/whatsapp-food-ordering-system">WhatsApp food ordering system guide</Link>.</p>
    </>,
  },
  {
    id: "commission",
    q: "How much commission do Zomato and Swiggy charge restaurants?",
    answer: "It depends on each restaurant’s deal. In July 2026 the Bruhat Bengaluru Hotels Association put it at 8% to 28% of the order. A breakdown by the pricing tool Foodcost, cited by The Week, gives 24% to 25% commission plus 18% GST on it, 0.1% TDS and about 2% in payment gateway fees. Check your own contract and payout statements.",
    body: <>
      <p>The commission isn’t the only deduction. Restaurants also complain about discounts they didn’t approve and ad charges. In The Week’s example, a ₹400 dish leaves the restaurant around ₹220 after everything, packaging included.</p>
      <ul>
        <li><strong>July 2026:</strong> the BBHA said Bengaluru restaurants would stop taking app orders from 15 August unless commissions, discounts, ad fees and payout deductions were revised.</li>
        <li><strong>August 2026:</strong> after Swiggy and Zomato agreed to consent-based discounts, the hotel bodies deferred the boycott to 1 September, according to Angel One.</li>
        <li><strong>The NRAI</strong> has an antitrust case at the Competition Commission of India against high commissions, price parity and forced exclusivity.</li>
      </ul>
      <p>None of this means leaving the apps. They bring new customers you wouldn’t reach on your own. The point is to take your <strong>repeat</strong> customers’ orders directly, where you keep the whole bill.</p>
      <Note>On a ₹400 order at a 25% commission, the commission alone is ₹100, plus ₹18 GST on it. A direct order on WhatsApp has no commission, though you pay for your own delivery and packaging.</Note>
    </>,
  },
  {
    id: "take-orders",
    q: "How does an AI agent take food orders on WhatsApp?",
    answer: "With Take Order switched on, the agent asks for the items, the address and cash or UPI, repeats the full order with prices, delivery charge and total, and places it only when the customer confirms. The order appears on your Orders page with the customer’s WhatsApp name and number, and an alert can go to your kitchen manager’s WhatsApp.",
    body: <>
      <p>Here’s how a chat at a cloud kitchen could go:</p>
      <ChatExample
        business="Demo Biryani Kitchen, Bengaluru"
        labels={{ subtitle: "WhatsApp · AI agent", agent: "AI agent: ", patient: "Customer: " }}
        turns={turns}
        caption="An illustrative chat for a made-up cloud kitchen at 9 pm. Prices and delivery areas come from the menu the kitchen gave the agent."
        points={[
          { title: "Prices from your menu", body: "The agent quotes your menu. If a dish isn’t on it, it says so instead of guessing." },
          { title: "Confirms before placing", body: "It repeats every item, the delivery charge and the total, and places the order only after a clear yes." },
          { title: "Doesn’t confirm payment", body: "It shares your UPI ID and asks for the screenshot, but your team checks that the money arrived." },
          { title: "Your kitchen gets an alert", body: "With Order alerts on WhatsApp, each new or changed order goes to the number you choose." },
        ]}
      />
      <Comparison caption="What a WhatsApp AI agent does with a restaurant’s everyday messages" columns={["Does it handle it?", "How"]} rows={answers} />
      <p>If a customer adds a dish a minute after ordering, the agent changes the open order instead of creating a second one, and the alert says it changed. For more on this flow, see the <Link href="/blog/whatsapp-order-taking-chatbot">WhatsApp order-taking chatbot</Link> guide.</p>
    </>,
  },
  {
    id: "menu",
    q: "Can it send the menu and photos of dishes?",
    answer: "Yes. Upload your menu as a PDF and photos of your dishes in Images & Files, each with a note on when to send it, such as “send when someone asks for the menu”. The agent sends them in the chat. It also needs the menu as text, PDF or Word in its information, so it can quote prices accurately.",
    body: <>
      <ul>
        <li><strong>Two copies of the menu.</strong> One the agent reads to answer (text with prices), and one it sends to the customer (the designed PDF or photo).</li>
        <li><strong>Daily specials.</strong> Update the information when the special changes. The agent only knows what you gave it.</li>
        <li><strong>Your website or online menu.</strong> On the <strong>Web Search</strong> card, enter your website and the agent reads it to answer. Check that its answers match what’s published.</li>
        <li><strong>Scanned menus can’t be read</strong> as information. Use a file with selectable text, or type the dishes and prices in.</li>
      </ul>
    </>,
  },
  {
    id: "payments",
    q: "Can customers pay by UPI or cash on delivery?",
    answer: "Yes, the agent tells customers how to pay: your UPI ID or QR code, or cash on delivery. It can send your UPI QR image and read the payment screenshot a customer sends, but it can’t check that the money reached your account. Your cashier confirms payments, as they do today.",
    body: <>
      <ul>
        <li><strong>UPI QR as an image.</strong> Upload it in Images & Files with the note “send when the customer chooses UPI”.</li>
        <li><strong>Screenshots aren’t proof.</strong> The sample prompt forbids the agent from saying a payment was received. Check your bank or UPI app before dispatching prepaid orders.</li>
        <li><strong>Cash on delivery:</strong> set a minimum order value in the instructions if you want one, and the agent will apply it.</li>
      </ul>
    </>,
  },
  {
    id: "delivery",
    q: "Who delivers WhatsApp orders, and can the bot track them?",
    answer: "You deliver them, with your own staff or a delivery service you book, and the agent quotes the areas, charges and times you set. It can’t assign riders or track an order on the road. When a customer asks “where is my order?”, the agent tells them a team member will reply, and your team answers.",
    body: <>
      <p>Write your delivery rules clearly in the information, because the agent will quote them exactly:</p>
      <ul>
        <li>The areas or PIN codes you deliver to, and the charge for each.</li>
        <li>Usual delivery times, and longer ones for peak hours or rain.</li>
        <li>The minimum order value, and whether pickup is available.</li>
      </ul>
      <p>To follow up on late orders, each conversation has an AI switch. Turn it off for that customer and reply yourself, then turn it back on.</p>
    </>,
  },
  {
    id: "cloud-kitchen",
    q: "Does it work for cloud kitchens, tiffin services and caterers?",
    answer: "Yes. Cloud kitchens use it to take direct orders for their own brand at peak hours. Tiffin services use it to answer questions about monthly plans, today’s menu and delivery timings, and to note new subscriptions. Caterers use it to collect enquiry details, such as date, guest count and menu, for a quote.",
    body: <>
      <ul>
        <li><strong>Cloud kitchens:</strong> put every brand you run in the information, with its own menu, and tell the agent to ask which brand the customer means.</li>
        <li><strong>Tiffin services:</strong> list your plans (veg or non-veg, lunch or dinner, monthly price) and update the daily menu each morning. Take Order can note a new subscription with the start date and address.</li>
        <li><strong>Caterers and party orders:</strong> have the agent collect the date, venue, number of guests, veg or non-veg and budget, then your team sends the quote.</li>
      </ul>
    </>,
  },
  {
    id: "direct-orders",
    q: "How do I get customers to order directly on WhatsApp?",
    answer: "Make the WhatsApp number easy to find for people who already know your food: a QR code on bills, table tents and the counter, a WhatsApp link on your Google Business Profile and Instagram, and a message to regulars who order by phone. Then reply fast every time, which the agent does. Read your app contracts before marketing to app customers.",
    body: <>
      <ul>
        <li><strong>A QR code that opens a pre-typed order message.</strong> Make one free with our <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code generator</Link>.</li>
        <li><strong>A WhatsApp link</strong> from our free <Link href="/tools/whatsapp-link-generator">link generator</Link> in your Google listing, Instagram bio and website.</li>
        <li><strong>Regulars first.</strong> Office lunch orders, families and nearby residents are the easiest customers to move to WhatsApp.</li>
        <li><strong>Check your contracts.</strong> Delivery-app agreements can include rules on pricing and on contacting customers who came through the app. Read yours before putting flyers in app orders or pricing direct orders lower.</li>
      </ul>
    </>,
  },
  {
    id: "gst-fssai",
    q: "What changes for GST and FSSAI when you take orders directly?",
    answer: "Since 1 January 2022, Zomato and Swiggy pay the 5% GST on restaurant orders placed through them, under section 9(5) of the CGST Act. On orders you take directly, the restaurant’s own GST rules apply, so check with your CA how to bill them. Your bills should also carry your 14-digit FSSAI licence or registration number.",
    body: <>
      <ul>
        <li><strong>GST:</strong> the app collects and pays GST on its orders; a direct WhatsApp order is your own sale. Your CA will tell you what to charge and how to report it.</li>
        <li><strong>FSSAI:</strong> FSSAI requires your licence or registration number on receipts, invoices and bills, so customers can identify your business.</li>
        <li><strong>Prices on the bill:</strong> the agent quotes the prices in its information. If you add GST or packaging on top, write that in the information too, so the total in the chat matches the bill.</li>
      </ul>
      <p>This is general information, not tax or legal advice.</p>
    </>,
  },
  {
    id: "cost",
    q: "What does a WhatsApp ordering system cost compared with Zomato?",
    answer: "Apps charge per order: at 25%, 600 direct orders a month of ₹400 each would have cost ₹60,000 in commission plus GST on it. An API chatbot platform such as AiSensy costs about ₹3,401 plus GST for 4,800 replies a month, AI add-on included. Wapzen is fully free, with no commission and no Meta message charges.",
    body: <>
      <Comparison caption="Taking an order through a delivery app or directly on WhatsApp" columns={["Delivery app", "Direct on WhatsApp with Wapzen"]} rows={costs} />
      <h3>A worked example</h3>
      <p>Take a cloud kitchen that moves <strong>20 orders a day</strong> from regulars to WhatsApp: 600 orders a month at ₹400, with about 8 replies per order, or 4,800 replies.</p>
      <ul>
        <li><strong>Through an app at 25%:</strong> ₹100 commission per order, or <strong>₹60,000 a month</strong>, plus ₹10,800 GST on the commission.</li>
        <li><strong>On an API platform (AiSensy):</strong> ₹1,500 plan + ₹1,350 AI add-on + 3,800 replies × ₹0.145 (₹551) = <strong>₹3,401 + GST</strong>, about ₹4,013. The add-on covers 1,000 AI messages, so the rest cost extra.</li>
        <li><strong>On Wapzen:</strong> <strong>fully free</strong>, with no commission and no Meta message charges.</li>
      </ul>
      <p>In every direct case, you pay for delivery and packaging yourself. AiSensy’s prices and Meta’s India rates are from 1 October 2026 and change every quarter.</p>
      <InlineCta title="Take your regulars’ orders on WhatsApp" body="Fully free: no commission, no card and no Meta API key, on the number your customers already have." label="Start free" />
    </>,
  },
  {
    id: "calls",
    q: "Can it answer customers who call on WhatsApp?",
    answer: "Yes, voice is working. Wapzen’s voice agent answers WhatsApp calls on your number in a natural voice, in Hindi, English and nine more Indian languages, with the same menu and delivery information as the chatbot. It handles WhatsApp calls only, not mobile or landline calls, and it can’t transfer a live call to your staff.",
    body: <>
      <p>Some customers would rather call than type. When everyone is in the kitchen, the voice agent can answer what’s on the menu, prices, timings and delivery areas. For orders, have it ask the caller to send the order on chat, where it’s confirmed in writing and saved on your Orders page.</p>
      <InlineCta href={voiceAccess} title="Answer the calls you miss at peak time" body="Message our team on WhatsApp and we’ll switch the voice agent on for your number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "setup",
    q: "How do I start taking orders on WhatsApp with AI?",
    answer: "Sign up free, click New chat agent, link your restaurant’s WhatsApp number with an 8-character pairing code on your phone or a QR code on a computer, name the agent and paste your instructions. Add your menu with prices, switch on Take Order, add your kitchen’s number for order alerts, and place a test order from another phone.",
    body: <>
      <ol>
        <li><strong>Sign up free.</strong> No card and no API key.</li>
        <li><strong>Prepare your instructions first.</strong> The agent starts replying as soon as the number is linked.</li>
        <li><strong>Link the number.</strong> In WhatsApp: Linked devices → Link a device → Link with phone number instead, and enter the code. On a computer you can scan the QR code.</li>
        <li><strong>Add your menu and delivery rules</strong> as text, PDF or Word, and the menu PDF and UPI QR in Images & Files.</li>
        <li><strong>Switch on Take Order</strong> and add your kitchen manager’s number under Order alerts on WhatsApp.</li>
        <li><strong>Place a test order</strong> from another number, with a voice note and a change of mind, and check it on the Orders page.</li>
      </ol>
      <p>These instructions are for a made-up cloud kitchen. Change them to yours:</p>
      <pre>{prompt}</pre>
    </>,
  },
  {
    id: "not-do",
    q: "What doesn’t Wapzen do for a restaurant?",
    answer: "It doesn’t check UPI payments, print KOTs or bills, assign riders, track deliveries or connect to your POS by itself, and it doesn’t message customers first. It isn’t Meta’s official platform, so there are no approved templates or green tick. In WhatsApp groups it stays quiet unless you switch it on for a group.",
    body: <>
      <Comparison caption="Which food businesses a WhatsApp AI ordering agent suits" columns={["Good fit?", "Why"]} rows={fit} />
      <ul>
        <li><strong>Your POS or billing software:</strong> if it has a public API, an API tool can send it each order. That needs someone technical. Otherwise, your team enters orders from the Orders page.</li>
        <li><strong>It works on your current number,</strong> personal or WhatsApp Business, as a linked device.</li>
        <li><strong>It doesn’t alert you to complaints.</strong> Agree who checks the chats during service.</li>
        <li>Wapzen is an independent product, not made by Meta or WhatsApp.</li>
      </ul>
    </>,
  },
];

export default function WhatsAppOrderingRestaurantsIndiaPage() {
  return <QaPost
    href={href}
    heading={<>WhatsApp ordering for restaurants in India.<br /><span>A fully free AI agent that takes orders.</span></>}
    lead="Every order from a regular that goes through a delivery app pays its commission. Here are 13 questions Indian restaurants, cloud kitchens and tiffin services ask before taking orders directly on WhatsApp with an AI agent: what Zomato and Swiggy really charge, how the agent takes and confirms orders, UPI and delivery, GST and FSSAI, what it costs, and how to start free."
    verdict={{
      title: "The short answer",
      body: <>A restaurant in India can take orders on its own WhatsApp with <strong>Wapzen</strong>. The AI agent answers menu and delivery questions in seconds, in Hindi, Hinglish or English, takes each order, repeats the total, saves it on your Orders page and alerts your kitchen. Direct orders pay no commission. <strong>It’s fully free</strong>, with no Meta API key and no Meta per-message charges.</>,
    }}
    facts={[["Price", "Fully free"], ["Commission", "None on direct orders"], ["Meta API key", "Not needed"], ["Orders", "Saved and sent to your kitchen"]]}
    indexTitle="The 13 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/free-whatsapp-ai-chatbot-india", "/blog/whatsapp-food-ordering-system"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Keep the whole bill on your regulars’ orders.<br /><span>Fully free, with no Meta API key.</span></>, body: "Sign up, give the agent your menu and delivery areas, and link your restaurant’s number. No card and no commission." }}
  />;
}
