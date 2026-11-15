import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topic from the sales agent harvest (2026-11-14, docs/seo-research.md, "Sales agent post",
// docs/seo-blog-sales-agent-research.mjs, Google + YouTube + DuckDuckGo in the US, India and
// the UK, scores out of 9 sources): "whatsapp sales automation" 140 (9/9), "ai agent for
// sales" 128 (9/9), "whatsapp sales bot" 125, "whatsapp sales agent" 120 (9/9), "ai sales
// chatbot" 117 (9/9), "how to sell on whatsapp" 109 (9/9), "how to sell on whatsapp business"
// 105 (9/9), "whatsapp ai sales agent" 84, "whatsapp follow up message" 27. No other English
// post targets these. The page answers the question a real customer sent: an agent that
// answers customers, presents products, takes orders, follows up with prospects and helps
// close sales.
// Honesty rules for this post: the chat agent only replies when a customer writes, so it does
// NOT send follow-ups by itself; the post says so and shows what does work (memory of the
// chat, the owner's own follow-up from the dashboard or phone, the agent continuing). It
// doesn't read the WhatsApp Business catalog or check payments. Copy says "free to start"
// because the server gives each account a free trial (FREE_TRIAL_REPLIES) before a paid
// plan; never "unlimited" or "free forever". No reply-limit and no ban wording, at the
// user's request. Voice is described as working, with a WhatsApp CTA, as in the other posts.
// Meta Business Agent facts come from Meta's product page (read 2026-11-14) and the sources
// of /blog/whatsapp-business-ai-agent; MaviBot's two-follow-up cap from its own post.
const href = "/blog/whatsapp-ai-sales-agent";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for sales calls on my WhatsApp number.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const botVsAgent = [
  ["How the buyer asks", "Taps buttons or types a number from a menu", "Writes or speaks in their own words and language"],
  ["Questions it can answer", "Only the paths someone built", "Anything covered by your products, prices and rules"],
  ["Voice notes and photos", "Usually ignored", "Transcribes voice notes and reads photos"],
  ["Recommending products", "A fixed list", "Two or three picks that match what the buyer said"],
  ["Taking the order", "A form, step by step", "In the conversation, confirmed before it’s saved"],
  ["Setting it up", "Drawing every branch of a flow", "Writing instructions and adding your price list"],
];

const handles = [
  ["“How much is the linen shirt in size L?”", "Yes", "From the price list and sizes you give it"],
  ["“Send me photos of it”", "Yes", "Sends the photos you uploaded in Images & Files"],
  ["“Something similar but cheaper?”", "Yes", "Suggests products from your list in that price range"],
  ["A voice note asking about delivery", "Yes", "Transcribes it and answers from your delivery rules"],
  ["A screenshot of a product from your Instagram", "Yes", "Reads the photo and matches it to your list if it can"],
  ["“2 shirts, size L, deliver tomorrow”", "Yes", "Repeats the order with the total and saves it when the buyer confirms"],
  ["“Can you do 30% off?”", "Partly", "Offers only the deals you wrote; anything more goes to you"],
  ["“I’ve paid, check please”", "No", "It can’t see your bank: your team confirms payments"],
  ["“Where is my parcel?”", "No", "Not without an API tool to your system; it passes the chat to you"],
];

const compare = [
  ["Where it runs", "The WhatsApp Business app, for eligible businesses in select markets", "The official WhatsApp Business API", "The number you already use, personal or Business, as a linked device"],
  ["How you start", "Tools › Meta Business Agent in the app", "Onboarding a number onto the API through the platform", "A pairing code or QR code, then your instructions"],
  ["Where it learns your products", "Your catalog, past chats, website and Facebook Page", "Uploaded content such as FAQs, PDFs and website pages", "Your price list, your website and the photos and files you upload"],
  ["Saves orders", "Not described on Meta’s page", "Through flows, integrations or payment links, depending on the platform", "Yes, with Take Order, plus an alert to your WhatsApp"],
  ["Automatic follow-ups", "Not described on Meta’s page", "Yes, with approved message templates", "No: you follow up, and the agent carries on"],
  ["Cost", "Free to start; Meta says paid subscriptions are coming", "A monthly plan, often AI credits, plus Meta’s message charges", "Free to start, no card"],
];

const fit = [
  ["Online store or Instagram seller with a price list", "Yes", "Answers product questions, sends photos and takes orders day and night"],
  ["Shop or boutique that sells by WhatsApp to regulars", "Yes", "Replies while you serve customers in the shop"],
  ["Service business with set packages", "Yes", "Explains packages and prices and collects the details for a quote"],
  ["High-value sales such as furniture, solar or property", "Yes, for the first replies", "Qualifies the buyer, then you take over the chat"],
  ["Team that needs scheduled campaigns and automated follow-up sequences", "No", "That needs the official API with approved templates"],
  ["Shop that needs live stock from its store software", "Only with an API tool", "Someone technical connects your system’s API"],
];

const prompt = `You are the virtual assistant of Demo Threads, an online clothing store.
Say in your first message that you are a virtual assistant.
Reply in the customer's language. Use two or three short sentences and ask one question at a time.
Use only the products, sizes, prices, offers and delivery rules you were given. If something isn't listed, say so. Never invent prices, discounts, stock or delivery dates.
When a customer isn't sure what to buy, ask what it's for and their size or budget, then suggest two or three products from the list with their prices.
When a customer wants to see a product, send its photo from your files.
You may suggest one matching item once per conversation, and only from the list.
Offer only the discounts listed. If a customer asks for a bigger discount, say a team member will reply.
To take an order: ask for the items, sizes and quantities, the delivery address and the payment method. Repeat the order with each price, the delivery charge and the total, and place it only after the customer confirms.
After placing an order, share the payment link. Never say a payment has been received: say our team will confirm it.
For complaints, returns, wholesale orders and anything you can't answer, say a team member will reply on this chat.`;

const turns = [
  { from: "patient" as const, text: "Hi! Is the linen shirt from your Instagram post available in white, size L?" },
  { from: "agent" as const, text: "Hi, I’m Demo Threads’ virtual assistant. Yes, the Coastal linen shirt comes in white from S to XL, $39. Would you like to see photos?" },
  { from: "patient" as const, text: "Yes please. Any discount if I take two?" },
  { from: "agent" as const, text: "📷 Coastal linen shirt, white · 📷 Coastal linen shirt, sage" },
  { from: "agent" as const, text: "This week any two Coastal shirts are $70 instead of $78. Two white, or one white and one sage?" },
  { from: "patient" as const, text: "One white L and one sage L. 22 Lake View Road, card payment" },
  { from: "agent" as const, text: "Please check: Coastal linen shirt white L and sage L, $70 for both, delivery $5. Total $75, to 22 Lake View Road, paid by card. Shall I place the order?" },
  { from: "patient" as const, text: "Yes" },
  { from: "agent" as const, text: "Done, your order #1043 is placed. Here’s our payment link: pay.demothreads.example. Our team will confirm once the payment arrives." },
];

const sources = [
  { label: "Meta: Meta Business Agent on WhatsApp", href: "https://whatsappbusiness.com/products/business-app-ai-agent/" },
  { label: "Meta for Developers: Meta Business Agent overview", href: "https://developers.facebook.com/documentation/meta-business-agent/overview" },
  { label: "Meta for Developers: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
  { label: "Wati: building a fully automated WhatsApp sales agent with Astra (6 May 2026)", href: "https://www.wati.io/en/blog/what-platform-lets-me-build-a-fully-automated-whatsapp-sales-agent-that-takes-leads-from-first-message-to-meeting-booked/" },
  { label: "MaviBot: WhatsApp AI sales agent (16 June 2026)", href: "https://mavibot.ai/posts/whatsapp-ai-sales-agent" },
];

const questions = [
  {
    id: "what",
    q: "What is a WhatsApp AI sales agent?",
    answer: "A WhatsApp AI sales agent is AI that answers your buyers on WhatsApp the way a good salesperson would: it replies in seconds, answers questions about products and prices, recommends what fits, sends photos and price lists, takes the order and hands the chat to you when a person is needed. Wapzen puts one on your own number, free to start.",
    body: <>
      <p>Most sales on WhatsApp start with a question: the price, a size, a photo, whether you deliver. A buyer who waits an hour for the answer has often bought somewhere else. A sales agent answers every one of those questions straight away, at night and on weekends too, from the information you give it.</p>
      <p><strong>Wapzen</strong> links the WhatsApp number you already use as a device, so your phone keeps working and you can still reply yourself. There’s no Meta API key and no card, and the AI is included.</p>
      <p>It suits online stores, Instagram sellers, shops, boutiques and service businesses with a price list. To see how it works behind the scenes, read <Link href="/blog/what-is-a-whatsapp-chatbot">what a WhatsApp chatbot is</Link>.</p>
    </>,
  },
  {
    id: "bot-vs-agent",
    q: "What’s the difference between a WhatsApp sales bot and an AI sales agent?",
    answer: "A sales bot follows a menu someone built: buyers tap buttons or type numbers, and anything off the menu gets stuck. An AI sales agent reads what the buyer actually wrote, in any words or language, answers from your products and rules, and can recommend, compare and take an order in the same conversation. You write instructions instead of drawing a flow.",
    body: <>
      <Comparison caption="A menu-based WhatsApp sales bot compared with an AI sales agent" columns={["Menu sales bot", "AI sales agent"]} rows={botVsAgent} />
      <p>A menu bot still works for one narrow job, such as “press 1 for tracking”. But buyers rarely ask in menu shape. They write “do you have this in blue, and can it come by Friday?”, and an agent can answer both parts at once.</p>
    </>,
  },
  {
    id: "handles",
    q: "What can an AI sales agent handle on WhatsApp?",
    answer: "It handles the questions that come before a sale: prices, sizes, colours, delivery areas and times, offers, comparisons between products and “what do you recommend?”. It sends product photos and price lists, understands voice notes and photos, and takes and confirms orders. It can’t check payments or track parcels by itself; those go to you.",
    body: <>
      <Comparison caption="What a WhatsApp AI sales agent does with everyday buyer messages" columns={["Does it handle it?", "How"]} rows={handles} />
      <p>The agent answers only from what you give it. If a product, price or offer isn’t in its information, it says so instead of guessing, so keep your list up to date.</p>
    </>,
  },
  {
    id: "products",
    q: "How does the agent present products and send photos or catalogs?",
    answer: "Give it three things. A price list as text, PDF or Word in the Knowledge Base, so it can quote products accurately. Product photos and PDFs in Images & Files, each with a note such as “send when someone asks about the Coastal shirt”. And your website on the Web Search card, so it can read your product pages to answer.",
    body: <>
      <ul>
        <li><strong>The price list is what it reads.</strong> Names, sizes or variants, prices, offers and delivery rules. A clear list gives better answers than a designed brochure.</li>
        <li><strong>Images & Files is what it sends.</strong> Photos go as WhatsApp photos and PDFs as documents, when the buyer’s message matches the note you wrote.</li>
        <li><strong>Your website is a backup.</strong> The agent reads pages on your own site. Pages that only appear after a lot of JavaScript loads may not be readable, so check its answers.</li>
        <li><strong>It doesn’t read the catalog inside the WhatsApp Business app.</strong> Put the same products in its price list instead.</li>
        <li><strong>Scanned PDFs can’t be read.</strong> Use a file with selectable text, or type the products in.</li>
      </ul>
    </>,
  },
  {
    id: "orders",
    q: "Can it take orders and close the sale in the chat?",
    answer: "Yes. With Take Order switched on, the agent asks for what your order instructions say, such as items, sizes, address and payment method, repeats the full order with the total, and saves it only after the buyer confirms. Orders appear on your Orders page, and an alert can go to your own WhatsApp. If the buyer changes something minutes later, it updates the same order.",
    body: <>
      <p>Here’s how a sale could go at a made-up clothing store:</p>
      <ChatExample
        business="Demo Threads"
        labels={{ subtitle: "WhatsApp · AI sales agent", agent: "AI agent: ", patient: "Buyer: " }}
        turns={turns}
        caption="An illustrative chat for a made-up store. The products, offer and delivery charge come from the price list the store gave the agent; the 📷 lines stand for the two photos it sent."
        points={[
          { title: "Answers from your list", body: "Sizes, prices and the offer are the ones you wrote. It doesn’t invent a discount to close the sale." },
          { title: "Shows the product", body: "It sends the photos you uploaded when the buyer asks to see them." },
          { title: "Confirms before saving", body: "It repeats every item and the total, and places the order only after a clear yes." },
          { title: "Doesn’t confirm payment", body: "It shares your payment link or bank details, but your team checks the money arrived." },
        ]}
      />
      <p>Add a number under <strong>Order alerts on WhatsApp</strong> and each new or changed order is sent there, so whoever packs orders sees it without opening the dashboard. For more on this flow, read the <Link href="/blog/whatsapp-order-taking-chatbot">WhatsApp order-taking chatbot</Link> guide.</p>
      <InlineCta title="Let an AI agent answer your buyers tonight" body="Free to start: no card and no Meta API key, on the WhatsApp number your customers already have." label="Start free" />
    </>,
  },
  {
    id: "follow-up",
    q: "Can an AI sales agent follow up with prospects automatically?",
    answer: "Not on Wapzen: the agent replies when a buyer writes, and it doesn’t send scheduled follow-ups by itself. It does remember the conversation, so a buyer who comes back days later doesn’t start over, and when you send a follow-up from the dashboard or your phone, the agent carries on the chat when they reply. Automated sequences need the official API with approved templates.",
    body: <>
      <p>On the official WhatsApp Business API, a business can reply freely within 24 hours of the customer’s last message. After that, it can only send a pre-approved template, and Meta charges for it. That’s how API platforms send automatic follow-ups, and why they usually cap them: MaviBot, for example, allows at most two per conversation.</p>
      <p>With Wapzen, follow-up works like this:</p>
      <ol>
        <li><strong>Check who didn’t buy.</strong> On the Conversations page, open the chats that ended with a question or a price and no order.</li>
        <li><strong>Send one short follow-up yourself,</strong> from the dashboard or your phone, with a reason to reply.</li>
        <li><strong>Let the agent take it from there.</strong> When the buyer answers, the agent replies with the whole conversation in mind and can take the order.</li>
      </ol>
      <p>Follow-up messages that get answers are short, personal and give a reason:</p>
      <ul>
        <li>“Hi Priya, the white linen shirt you asked about is back in size L. Shall I put one aside for you?”</li>
        <li>“Hi Sam, did the price list come through? Happy to help you choose the sofa size.”</li>
        <li>“Hi Ana, the two-for-$70 offer ends on Sunday. Would you like me to put your order together?”</li>
      </ul>
      <Note>WhatsApp’s Business Messaging Policy asks businesses to message only people who gave them their number and agreed to hear from them. Follow up with buyers who wrote to you, once or twice at most, and stop if they say no.</Note>
    </>,
  },
  {
    id: "qualify",
    q: "How does an AI sales agent qualify leads?",
    answer: "Write your qualifying questions into its instructions, for example what the buyer needs, quantity, budget, city and when they want it, and tell it to ask them one at a time and then pass the chat to you. The answers stay in the conversation on your dashboard. For bigger sales, that means you only step in once the buyer is ready.",
    body: <>
      <p>Pick the three or four questions your best salesperson always asks. For a furniture store, they might be:</p>
      <ul>
        <li>Which room and what size of space?</li>
        <li>Budget range?</li>
        <li>Delivery city or area?</li>
        <li>When do you need it?</li>
      </ul>
      <p>Then add a rule such as: “When you have all four answers, recommend up to three products from the list and say a team member will contact them with a quote.” You can also have Take Order record each qualified enquiry as an order with those details, so they appear on your Orders page. Test that from another phone before relying on it.</p>
    </>,
  },
  {
    id: "handover",
    q: "When should a person take over the chat from the AI?",
    answer: "Take over for big or custom orders, discounts beyond your listed offers, complaints, returns and anything the agent says a team member will answer. Each conversation on Wapzen has an AI switch: turn it off for that buyer, reply yourself, and switch it back on when you’re done. The agent doesn’t alert you when it hands over, so check your chats regularly.",
    body: <>
      <ul>
        <li><strong>Write the hand-over rules in its instructions,</strong> so it tells the buyer a person will reply instead of improvising.</li>
        <li><strong>Agree who checks the chats,</strong> and how often, during business hours.</li>
        <li><strong>Your own replies stay in the conversation.</strong> When you switch the AI back on, it knows what you said.</li>
      </ul>
    </>,
  },
  {
    id: "instructions",
    q: "What should I put in a sales agent’s instructions?",
    answer: "Tell it who it is and that it must say it’s a virtual assistant, which language and tone to use, to answer only from your price list, how to recommend products, which discounts it may offer, the exact steps to take an order, and when to hand over to a person. Short, specific rules work better than a long sales script.",
    body: <>
      <p>These instructions are for a made-up clothing store. Change them to yours:</p>
      <pre>{prompt}</pre>
      <ul>
        <li><strong>One suggestion, not a hard sell.</strong> An agent told to upsell on every message annoys buyers. One matching item, once, is plenty.</li>
        <li><strong>Name the discounts.</strong> If an offer isn’t written down, the agent won’t give it, which is what you want.</li>
        <li><strong>Test it like a difficult buyer.</strong> Ask for a bigger discount, send a voice note, change your mind about the size, and check each answer.</li>
      </ul>
    </>,
  },
  {
    id: "sell-more",
    q: "How do I sell more on WhatsApp Business with an AI agent?",
    answer: "Make it easy to start a chat and fast to get an answer. Put a WhatsApp link with a pre-typed message in your Instagram bio, website and ads, and a QR code on packaging and in your shop. Then let the agent reply in seconds with prices and photos, suggest two or three products instead of the whole catalog, and confirm the order in the chat.",
    body: <>
      <ul>
        <li><strong>A link that starts the conversation.</strong> Make one free with our <Link href="/tools/whatsapp-link-generator">WhatsApp link generator</Link>, with a message such as “Hi, I’d like to see the new collection”.</li>
        <li><strong>A QR code</strong> on receipts, packaging and your counter, from our <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code generator</Link>.</li>
        <li><strong>Prices up front.</strong> Buyers on WhatsApp ask the price first. An agent that answers with the price and a photo keeps them talking.</li>
        <li><strong>Fewer choices.</strong> Two or three picks that match what the buyer said sell better than sending the whole catalog.</li>
        <li><strong>Close in the chat.</strong> Confirm the order and send the payment link in the same conversation, instead of sending the buyer to a website.</li>
        <li><strong>Follow up once,</strong> with a reason, as in the examples above.</li>
      </ul>
    </>,
  },
  {
    id: "compare",
    q: "How does it compare with Meta Business Agent and API platforms?",
    answer: "Meta Business Agent runs inside the WhatsApp Business app for eligible businesses in select markets and recommends products from your catalog. API platforms such as WATI, AiSensy and MaviBot run on the official API, with approved templates for follow-ups and Meta’s message charges. Wapzen works on the number you already have, takes and saves orders, and is free to start, but doesn’t send automatic follow-ups.",
    body: <>
      <Comparison caption="Three ways to put an AI sales agent on WhatsApp" columns={["Meta Business Agent", "API platforms (WATI, AiSensy, MaviBot)", "Wapzen"]} rows={compare} />
      <p>Choose an API platform if you need a green tick, marketing campaigns or automated follow-up sequences, and are ready for the API setup and per-message costs. Try Meta Business Agent if it’s available for your account. Choose Wapzen if you want an agent on your current number today that answers, shows products and takes orders. Our guide to <Link href="/blog/whatsapp-business-ai-agent">Meta Business Agent</Link> covers it in detail.</p>
    </>,
  },
  {
    id: "cost",
    q: "How much does a WhatsApp AI sales agent cost?",
    answer: "Wapzen is free to start, with no card and no Meta API key. On the official API, Meta’s own agent platform costs $2.00 per million tokens, about 4 to 5 US cents a message by Meta’s estimate. Platforms such as WATI, AiSensy and MaviBot charge a monthly plan, often with AI credits, and Meta charges for template messages on top.",
    body: <>
      <ul>
        <li><strong>Meta Business Agent in the app:</strong> free to start; Meta has said businesses will reach it through paid subscriptions.</li>
        <li><strong>Meta Business Agent Platform on the API:</strong> $2.00 per million tokens since 1 August 2026.</li>
        <li><strong>API platforms:</strong> a plan, AI credits or an AI add-on, and Meta’s charges. Since 1 October 2026, Meta also charges for service replies beyond the first 1,000 a month per number.</li>
        <li><strong>Wapzen:</strong> free to start. It doesn’t use the API, so there are no Meta per-message charges.</li>
      </ul>
      <p>Meta changes its rates every quarter, so check its pricing page before you compare bills.</p>
    </>,
  },
  {
    id: "calls",
    q: "Can the sales agent answer WhatsApp calls too?",
    answer: "Yes, voice is working. Wapzen’s voice agent answers WhatsApp calls on your number in a natural voice, using the same product information as the chat agent. It handles WhatsApp calls only, not mobile or landline calls, and it can’t transfer a live call to your staff. For orders, have it ask the caller to send the order on chat.",
    body: <>
      <p>Some buyers would rather call than type, especially for bigger purchases. The voice agent can answer questions about your products, prices and delivery, and the chat agent then takes the order in writing, where it’s confirmed and saved.</p>
      <InlineCta href={voiceAccess} title="Answer the sales calls you miss" body="Message our team on WhatsApp and we’ll switch the voice agent on for your number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "setup",
    q: "How do I set up a WhatsApp AI sales agent?",
    answer: "Sign up free, click New chat agent and link your WhatsApp number with an 8-character pairing code on your phone or a QR code on a computer, then name the agent. Paste your instructions, add your price list in the Knowledge Base and product photos in Images & Files, switch on Take Order with your order alert number, and test it from another phone.",
    body: <>
      <ol>
        <li><strong>Write your instructions first.</strong> The agent starts answering as soon as the number is linked.</li>
        <li><strong>Sign up free.</strong> No card and no API key.</li>
        <li><strong>Link the number.</strong> In WhatsApp: Linked devices › Link a device › Link with phone number instead, and enter the code. On a computer you can scan the QR code.</li>
        <li><strong>Add your products:</strong> the price list in the Knowledge Base, photos and PDFs in Images & Files, and your website on the Web Search card.</li>
        <li><strong>Switch on Take Order,</strong> write your order instructions and add the number for order alerts.</li>
        <li><strong>Test it as a buyer</strong> from another number: ask for a photo, send a voice note, ask for a discount, place an order and change it.</li>
      </ol>
    </>,
  },
  {
    id: "not-do",
    q: "What doesn’t a WhatsApp AI sales agent on Wapzen do?",
    answer: "It doesn’t message buyers first or send scheduled follow-ups, check payments, read the WhatsApp Business catalog, or connect to your store software by itself. It isn’t Meta’s official platform, so there are no approved templates or green tick. In WhatsApp groups it stays quiet unless you switch it on for a group.",
    body: <>
      <Comparison caption="Which businesses a WhatsApp AI sales agent suits" columns={["Good fit?", "Why"]} rows={fit} />
      <ul>
        <li><strong>Live stock or order tracking:</strong> if your store software has a public API, an API tool can look things up during the chat. That needs someone technical.</li>
        <li><strong>It works on your current number,</strong> personal or WhatsApp Business, as a linked device.</li>
        <li>Wapzen is an independent product, not made by Meta or WhatsApp.</li>
      </ul>
    </>,
  },
];

export default function WhatsAppAiSalesAgentPage() {
  return <QaPost
    href={href}
    heading={<>WhatsApp AI sales agent.<br /><span>Answer, show products and take orders on your own number.</span></>}
    lead="Most WhatsApp sales start with a question, and the buyer who waits for an answer often buys elsewhere. Here are 15 questions business owners ask before handing those chats to an AI sales agent: what it does, how it presents products and takes orders, what follow-up really looks like on WhatsApp, how it compares with Meta Business Agent and API platforms, what it costs, and how to set one up."
    verdict={{
      title: "The short answer",
      body: <>An AI sales agent answers your WhatsApp buyers in seconds, from your own products and prices. With <strong>Wapzen</strong> it runs on the number you already use: it recommends products, sends photos and price lists, understands voice notes, takes and confirms orders, and alerts you on WhatsApp. It doesn’t send follow-ups by itself; you follow up, and it carries on the chat. <strong>It’s free to start</strong>, with no Meta API key.</>,
    }}
    facts={[["Price", "Free to start, no card"], ["Meta API key", "Not needed"], ["Your number", "The one you already use"], ["Orders", "Saved and sent to your WhatsApp"]]}
    indexTitle="The 15 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/whatsapp-order-taking-chatbot", "/blog/whatsapp-business-ai-agent"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Turn WhatsApp questions into orders.<br /><span>Free to start, with no Meta API key.</span></>, body: "Sign up, give the agent your price list and product photos, and link your number. No card needed." }}
  />;
}
