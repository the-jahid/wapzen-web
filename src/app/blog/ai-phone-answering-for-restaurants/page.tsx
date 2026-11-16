import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topic from the voice industry harvest (2026-11-16, docs/seo-research.md, "Voice agent industry
// posts", docs/seo-blog-voice-industries-research.mjs, Google + YouTube + DuckDuckGo in the US,
// India and the UK, scores out of 9 sources). Restaurants were the strongest industry cluster
// (1,415): "ai phone answering service for restaurants" 122 (6/9), "ai phone answering system for
// restaurants" 96, "ai receptionist for restaurants" 90 (9/9), "ai voice agent for restaurants" 81,
// "ai phone ordering" 78 (9/9), "ai phone ordering system" 70, "ai answering service for
// restaurants" 60, plus "whatsapp for restaurants" 60 and "whatsapp ordering for restaurants" 50.
// Competitor facts, read from their own pricing pages 2026-11-16: Maple Voice $150/month ($85
// billed yearly, answering + FAQs + call transfer, no ordering), Maple Pro $350/month ($220 yearly,
// POS orders, reservations incl. OpenTable, phone payment), unlimited minutes; Slang.ai Core
// "starting at" $399 and Premium $599 per location (billing period not stated). Neither page
// mentions WhatsApp.
// Honesty rules: the voice agent answers WhatsApp calls only (not the restaurant's landline or
// mobile network calls), can't transfer a live call, pauses about 1-2 s per turn, has no POS or
// reservation book of its own (orders and bookings land via an API tool, or on chat where Take
// Order saves them, or staff confirm from the transcript). Never claim it answers several calls
// at once. Allergen answers only from the restaurant's written list. Voice is described as
// working (user rule 2026-11-15) and switched on by our team over WhatsApp, as in the other
// posts. "Free to start, no card"; never "unlimited", "fully free" or a reply count.
const href = "/blog/ai-phone-answering-for-restaurants";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like the Wapzen AI voice agent to answer WhatsApp calls for my restaurant.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const handles = [
  ["“Are you open now?”", "Yes", "From your opening hours; it knows today’s date and time"],
  ["“What’s on the menu, and how much is the biryani?”", "Yes", "From the menu and prices you give it"],
  ["“Do you have vegan or halal options?”", "Yes", "Only the dishes you marked that way"],
  ["“Does the curry have nuts?”", "Carefully", "Reads your written allergen list and sends severe allergies to staff"],
  ["“Do you deliver to my area, and how much is delivery?”", "Yes", "From the delivery zones and fees you list"],
  ["“A table for six on Friday at 8 pm”", "Yes", "Takes the request; books it through an API tool or your staff confirm"],
  ["“I want to order two pizzas for pickup”", "Yes, with a setup", "Takes the order by voice; it reaches your kitchen through an API tool or on chat"],
  ["“Send me the menu”", "Yes", "Sends your menu link as a WhatsApp message during the call"],
  ["“Where is my delivery?”", "Only with a tool", "It can’t see your delivery app unless an API tool connects it"],
  ["“My order was wrong”", "Hands over", "Apologises, notes the problem and says the manager will call back"],
];

const turns = [
  { from: "patient" as const, text: "Hi, do you have a table for six on Friday night?" },
  { from: "agent" as const, text: "Hi, you’re through to Demo Kitchen’s virtual assistant. Friday we’re open until 11 pm. What time would you like, and what name is the booking under?" },
  { from: "patient" as const, text: "Eight o’clock, under Maria. One of us is vegetarian." },
  { from: "agent" as const, text: "Lovely, we have six vegetarian mains. So that’s a table for six, this Friday at 8 pm, for Maria. Is that right?" },
  { from: "patient" as const, text: "Yes, that’s right." },
  { from: "agent" as const, text: "Thanks Maria. I’ve sent your request to the team, and they’ll confirm on WhatsApp within the hour. I’ve also sent you our menu link. Anything else?" },
];

const prompt = `You are the virtual assistant that answers WhatsApp calls for Demo Kitchen, a family restaurant with dine-in, pickup and delivery.
Say at the start of each call that you are a virtual assistant.
Speak in short sentences, one idea at a time, and ask one question at a time. This is a phone call, so never read out lists longer than three items; offer to send the menu instead.
Answer only from the menu, prices, opening hours, delivery zones and policies you were given. If something isn't listed, say so and offer to have the team call back. Never invent dishes, prices, offers or delivery times.
Allergies: read out only what the allergen list says. Never say a dish is safe for a severe allergy; say the kitchen handles nuts, gluten and dairy, and that the manager will call back to talk it through.
Table requests: ask for the day, time, number of people and name. Repeat them back, and send the request only after the caller confirms. Say the team will confirm on WhatsApp. Never say a table is free.
Orders: ask for each item and quantity, pickup or delivery, and the address for delivery. Read the whole order and total back, and send it only after the caller says yes.
When the caller asks for the menu or directions, send them as a WhatsApp message.
Complaints, refunds, large events and anything you can't answer: apologise, note the details and say the manager will call back.`;

const compare = [
  ["Which calls it answers", "Calls to your restaurant’s phone line", "WhatsApp calls to the number your customers already message"],
  ["Price, from their pricing pages", "Maple: $150 a month, or $350 with ordering and reservations ($85 and $220 billed yearly). Slang.ai: from $399 or $599 per location", "Free to start, no card, and no per-minute fees"],
  ["Orders into your POS", "Maple Pro sends orders to Toast, Square, Clover and others", "Through an API tool you connect, or on chat with Take Order"],
  ["Reservations", "Maple Pro books OpenTable and others; Slang.ai integrates with reservation systems", "Takes the request; books it through an API tool or your staff confirm"],
  ["Live transfer to staff", "Maple lists automated call transfer", "Not available: the manager calls back"],
  ["Written follow-up", "Text links and confirmations", "WhatsApp messages in the same chat, during the call"],
];

const fit = [
  ["Restaurant whose customers call and message on WhatsApp", "Yes", "Answers the calls your staff miss at rush hour and after closing"],
  ["Takeaway or cloud kitchen taking orders on WhatsApp", "Yes", "Voice for questions, chat for orders that are confirmed and saved"],
  ["Café or bakery in a tourist area", "Yes", "Visitors without a local SIM can call free over WhatsApp"],
  ["Restaurant that gets most calls on a landline", "Not by itself", "It only answers WhatsApp calls; a phone-line product fits better"],
  ["Restaurant that wants phone orders straight into its POS with no setup", "Not out of the box", "Needs an API tool, or a POS-integrated product such as Maple Pro"],
];

const sources = [
  { label: "Maple: AI phone answering pricing for restaurants", href: "https://www.maple.inc/pricing" },
  { label: "Slang.ai: pricing", href: "https://www.slang.ai/pricing" },
  { label: "Meta for Developers: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
];

const questions = [
  {
    id: "what",
    q: "What is AI phone answering for restaurants?",
    answer: "AI phone answering for restaurants is an AI receptionist that picks up calls in a natural voice and answers what callers ask: opening hours, the menu, prices, delivery areas and dietary options. It also takes table and order requests. Wapzen’s voice agent does this for WhatsApp calls, on the number your customers already message, and it’s free to start.",
    body: <>
      <p>The phone rings most when the kitchen is busiest: Friday at 7 pm, Sunday lunch, the hour before closing. Every unanswered call is a table or an order that goes somewhere else. An <strong>AI receptionist for restaurants</strong> answers those calls, from the menu, prices and rules you give it, and hands anything unusual to your staff.</p>
      <p>Most restaurant AI phone systems, such as Maple and Slang.ai, answer your phone line. <strong>Wapzen</strong> answers <strong>WhatsApp calls</strong> instead: it links your restaurant’s WhatsApp number as a device, so the voice agent picks up calls to that number while your phone keeps working. There’s no WhatsApp Business API to set up, and it’s free to start, with no credit card.</p>
      <p>The same number can also run an AI chat agent that answers messages, sends menu photos and takes orders in writing. To see how the chat side works, read about <Link href="/blog/whatsapp-food-ordering-system">WhatsApp food ordering</Link>.</p>
    </>,
  },
  {
    id: "why-whatsapp",
    q: "Why answer restaurant calls on WhatsApp?",
    answer: "Because in many countries that’s how customers call. Your WhatsApp number is on Google, Instagram and your menus, WhatsApp calls are free over data, and visitors without a local SIM can still reach you. The caller lands on the same number where you can send the menu, location and order confirmation in writing. It doesn’t answer landline calls.",
    body: <>
      <ul>
        <li><strong>Customers already tap “call” in WhatsApp.</strong> In India, Brazil, Mexico, the Middle East and much of Europe and Africa, a restaurant’s WhatsApp number is often the one people save.</li>
        <li><strong>The call and the written follow-up share a chat.</strong> The agent can send the menu link, a map pin or a booking summary as a WhatsApp message while the caller is still on the line.</li>
        <li><strong>No per-minute cost.</strong> WhatsApp calls run over the internet, so neither you nor the caller pays per minute.</li>
        <li><strong>Tourists can reach you.</strong> A visitor without a local SIM can still call you on WhatsApp.</li>
      </ul>
      <p>Be clear about the limit: Wapzen answers WhatsApp calls only. If most of your calls come to a landline or a regular mobile number, a phone-line product suits you better, or you can point people to WhatsApp with a “Call us on WhatsApp” link on your Google Business Profile and website.</p>
    </>,
  },
  {
    id: "handles",
    q: "What can an AI receptionist for restaurants answer?",
    answer: "Everyday calls: whether you’re open now, what’s on the menu and what it costs, vegetarian, vegan and halal options, delivery areas and fees, parking and directions. It takes table and order requests and sends the menu by WhatsApp. It reads allergy answers only from your list, and hands complaints and anything it can’t see to your staff.",
    body: <>
      <Comparison caption="How a WhatsApp AI receptionist handles everyday restaurant calls" columns={["Does it handle it?", "How"]} rows={handles} />
      <p>The agent answers from its knowledge base, which is the menu, prices and policies you upload as text, PDF or Word. If something isn’t there, it says so instead of guessing. Update it when the menu or prices change.</p>
    </>,
  },
  {
    id: "orders",
    q: "Can an AI voice agent take phone orders?",
    answer: "Yes, with a destination for the order. The agent takes each item, pickup or delivery and the address, reads the order and total back, and confirms. To reach your kitchen, connect an API tool that sends it to your POS, online ordering system or a sheet, or have callers finish on WhatsApp chat, where Take Order saves it and alerts the kitchen.",
    body: <>
      <p>AI phone ordering is where restaurants gain the most and where setups differ most. Wapzen gives you two routes:</p>
      <ol>
        <li><strong>Voice order with an API tool.</strong> During the call, the agent sends the confirmed order to an address you choose: your POS or online ordering system if it has an API, or an automation tool such as Make or Zapier that writes it to a sheet and messages the kitchen. Test it with a dozen made-up orders first.</li>
        <li><strong>Voice for questions, chat for the order.</strong> The voice agent answers the caller’s questions and sends your menu link. When they’re ready, they write the order in the same WhatsApp chat, and the chat agent’s Take Order confirms it, saves it on your Orders page and sends it to the kitchen’s WhatsApp number.</li>
      </ol>
      <p>Without either, the order exists only in the call transcript on your dashboard, which works only if someone reads every transcript. If you need orders to go into a POS such as Toast or Square with no setup, a POS-integrated product like Maple Pro does that for phone-line calls.</p>
      <Note>Spoken orders go wrong in the same places for AI as for staff: similar dish names, sizes and add-ons. Tell the agent to read the whole order back, and keep dish names distinct in your menu text.</Note>
    </>,
  },
  {
    id: "reservations",
    q: "Can it take table reservations?",
    answer: "It takes the request and confirms the details back. The agent asks for the day, time, party size and name, repeats them and sends the request after the caller says yes. With an API tool it can check availability and book in your reservation system; without one, your staff confirm on WhatsApp. Wapzen has no reservation book of its own.",
    body: <>
      <p>Here’s how a reservation call could go at a made-up restaurant:</p>
      <ChatExample
        business="Demo Kitchen"
        labels={{ subtitle: "WhatsApp call · AI voice agent", agent: "AI agent: ", patient: "Caller: " }}
        turns={turns}
        caption="An illustrative call transcript for a made-up restaurant. The opening hours and menu come from the information the restaurant gave the agent."
        points={[
          { title: "Says it’s a virtual assistant", body: "Callers know straight away that they’re talking to an AI, as your instructions tell it to." },
          { title: "Reads the booking back", body: "It repeats the day, time, party size and name and waits for a clear yes." },
          { title: "Never promises the table", body: "Without a reservation tool it can’t see free tables, so the team confirms." },
          { title: "Sends the menu in the chat", body: "A WhatsApp message during the call, so the caller has it in writing." },
        ]}
      />
      <p>If your reservation system has a public API, someone technical can connect it as an API tool so the agent checks real availability. The <Link href="/blog/whatsapp-appointment-booking">WhatsApp booking guide</Link> shows how a booking tool works.</p>
    </>,
  },
  {
    id: "allergens",
    q: "How should it handle allergy and dietary questions?",
    answer: "Only from your written allergen and dietary information, and never as a guarantee. Give the agent a list of which dishes contain which allergens, and tell it to say that your kitchen handles nuts, gluten and dairy. For severe allergies, it should say the manager will call back rather than promise a dish is safe.",
    body: <>
      <ul>
        <li><strong>Write allergens per dish.</strong> “Contains nuts”, “gluten-free on request” and “cooked in shared fryer” are easy for the agent to read out.</li>
        <li><strong>No guarantees.</strong> Cross-contact happens in most kitchens. Tell the agent never to say a dish is safe for an allergy, as in the sample instructions below.</li>
        <li><strong>Hand over severe allergies.</strong> The agent notes the caller’s question and says the manager will call back.</li>
      </ul>
      <p>Vegetarian, vegan and halal questions are simpler: mark those dishes in your menu text, and the agent offers only those.</p>
    </>,
  },
  {
    id: "send",
    q: "Can it send the menu or location during the call?",
    answer: "Yes. With a send-message tool, the voice agent sends a WhatsApp message to the caller while the call is still going: your menu link, a Google Maps pin, your online ordering link or a summary of the booking request. On chat, the chat agent can also send your menu as a photo or PDF when someone asks.",
    body: <>
      <p>This is where WhatsApp beats a phone line. A caller who asks “what’s on the menu?” doesn’t want twenty dishes read out. The agent can say “I’ve sent you our menu on WhatsApp”, and the link is waiting in the chat when they hang up.</p>
      <p>Set up one message per job, such as the menu link, the directions and the ordering link, and say in the instructions when to send each one.</p>
    </>,
  },
  {
    id: "languages",
    q: "Can the AI receptionist speak other languages?",
    answer: "Yes. You set the language each voice agent speaks, from a long list that includes English, Spanish, Portuguese, Arabic, Hindi, Bengali, French and German, and pick a voice that suits it. Write the menu and instructions in the same language. Restaurants with callers in two languages can run a second agent on a second number.",
    body: <>
      <p>Choose the language most of your callers use. Dish names can stay as they are on your menu; the agent reads them as written.</p>
    </>,
  },
  {
    id: "instructions",
    q: "What should a restaurant voice agent’s instructions say?",
    answer: "Who it is and that it’s a virtual assistant, to speak in short sentences because it’s a call, to answer only from your menu, prices and hours, how to take table and order requests and read them back, what never to promise (free tables, allergy safety, delivery times), when to send the menu by WhatsApp, and when the manager calls back.",
    body: <>
      <p>These instructions are for a made-up restaurant. Change them to yours:</p>
      <pre>{prompt}</pre>
      <ul>
        <li><strong>Keep answers short.</strong> There’s a pause of about one to two seconds before each answer, so long replies make the call feel slow.</li>
        <li><strong>Test it like a difficult caller.</strong> Order something that isn’t on the menu, change your mind halfway, ask about nuts and complain about a late delivery, and check each answer in the transcript.</li>
      </ul>
      <InlineCta href={voiceAccess} title="Answer every WhatsApp call to your restaurant" body="Free to start, no card. Message our team on WhatsApp and we’ll switch the voice agent on for your number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "compare",
    q: "How does it compare with Maple, Slang.ai and other restaurant AI phone systems?",
    answer: "Maple and Slang.ai answer your restaurant’s phone line and connect to POS and reservation systems; their pricing pages list $150 to $599 a month per location and don’t mention WhatsApp. Wapzen answers WhatsApp calls on your current number, is free to start, and needs an API tool or chat for orders to reach the kitchen. It can’t transfer live calls.",
    body: <>
      <Comparison caption="Restaurant AI phone systems compared with Wapzen’s WhatsApp voice agent" columns={["Phone-line AI (Maple, Slang.ai)", "Wapzen"]} rows={compare} />
      <p>Choose a phone-line product if most calls come to your landline and you want orders in your POS on day one. Choose Wapzen if your customers call and message you on WhatsApp and you want those calls answered today without a monthly fee. The two can run side by side: one on the phone line, one on WhatsApp.</p>
    </>,
  },
  {
    id: "cost",
    q: "How much does AI phone answering for restaurants cost?",
    answer: "Wapzen is free to start, with no credit card and no per-minute fees, because the calls run over WhatsApp. Phone-line products charge a monthly fee per location: Maple lists $150 a month for answering and $350 with ordering and reservations, and Slang.ai lists plans from $399 and $599 per location.",
    body: <>
      <ul>
        <li><strong>Wapzen:</strong> free to start on your current number. Restaurants that need more can arrange a paid plan with our team on WhatsApp.</li>
        <li><strong>Maple:</strong> $150 a month for Voice or $350 for Pro, or $85 and $220 a month billed yearly, with unlimited minutes.</li>
        <li><strong>Slang.ai:</strong> Core from $399 and Premium from $599 per location; its page doesn’t say whether that’s monthly.</li>
        <li><strong>Meta’s official Calling API:</strong> calls customers make to a business are free, but calls the business places are billed per minute, and you need an API provider. See <Link href="/blog/whatsapp-calling-api-pricing">WhatsApp calling API pricing</Link>.</li>
      </ul>
      <p>Prices were read from each vendor’s pricing page on 16 November 2026. Check them before you compare.</p>
    </>,
  },
  {
    id: "setup",
    q: "How do I set up an AI receptionist for my restaurant on WhatsApp?",
    answer: "Sign up free and link your restaurant’s WhatsApp number with a pairing code or QR code. Message our team on WhatsApp to switch the voice agent on. Write its instructions, upload your menu, prices, hours, delivery zones and allergen list, add a message with your menu link, connect an order or booking tool if you have one, and test it with calls from another phone.",
    body: <>
      <ol>
        <li><strong>Sign up free.</strong> No card and no API key.</li>
        <li><strong>Link the number.</strong> In WhatsApp: Linked devices › Link a device › Link with phone number instead, and enter the code. On a computer you can scan the QR code.</li>
        <li><strong>Switch on voice.</strong> <a href={voiceAccess} target="_blank" rel="noopener noreferrer">Message our team on WhatsApp</a> and we’ll set up the voice agent for your number.</li>
        <li><strong>Upload what it reads:</strong> menu with prices, opening hours, delivery zones and fees, allergen list and your booking and refund rules.</li>
        <li><strong>Add tools:</strong> a message with your menu link, one with directions, and an API tool for orders or reservations if your systems have one.</li>
        <li><strong>Tell people to call on WhatsApp.</strong> Add your WhatsApp number to Google, Instagram and your menus. Our free <Link href="/tools/whatsapp-link-generator">WhatsApp link generator</Link> makes a link that opens your chat.</li>
        <li><strong>Test it at a quiet time.</strong> Call from another phone, book a table, order, ask about allergies, and read the transcripts.</li>
      </ol>
    </>,
  },
  {
    id: "not-do",
    q: "What doesn’t a WhatsApp AI receptionist for restaurants do?",
    answer: "It doesn’t answer landline or regular mobile calls, transfer a live call to staff, take card payments, or see your POS, reservation book or delivery app unless an API tool connects them. It pauses briefly before each answer. It isn’t Meta’s official API, so call only customers who expect it, and never cold-call lists.",
    body: <>
      <Comparison caption="Which restaurants a WhatsApp AI receptionist suits" columns={["Good fit?", "Why"]} rows={fit} />
      <ul>
        <li><strong>It works on your current number,</strong> personal or WhatsApp Business, as a linked device.</li>
        <li><strong>Outbound calls are for people who asked,</strong> such as a catering enquiry that wants a call back. WhatsApp restricts numbers that make unwanted calls.</li>
        <li>Wapzen is an independent product, not made by Meta or WhatsApp.</li>
      </ul>
    </>,
  },
];

export default function AiPhoneAnsweringForRestaurantsPage() {
  return <QaPost
    href={href}
    heading={<>AI phone answering for restaurants.<br /><span>Answer every WhatsApp call, even at rush hour.</span></>}
    lead="The phone rings most when the kitchen is busiest. Here are 13 questions restaurant owners ask before handing calls to AI: what an AI receptionist for restaurants answers, whether it can take phone orders and table reservations, how it handles allergies, why WhatsApp calls matter, how it compares with Maple and Slang.ai, what it costs and how to set it up."
    verdict={{
      title: "The short answer",
      body: <>An AI receptionist answers your restaurant’s calls in a natural voice, from your own menu, prices and hours. With <strong>Wapzen</strong> it answers <strong>WhatsApp calls</strong> on the number your customers already use: it tells callers if you’re open, answers menu and delivery questions, takes table and order requests and sends the menu by WhatsApp during the call. It doesn’t answer landline calls or transfer live calls. <strong>It’s free to start</strong>, with no per-minute fees.</>,
    }}
    facts={[["Price", "Free to start, no card"], ["Calls it answers", "WhatsApp calls to your number"], ["Per-minute fees", "None"], ["Orders and bookings", "Read back, then sent by tool or chat"]]}
    indexTitle="The 13 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/whatsapp-food-ordering-system", "/blog/whatsapp-calling-api-pricing"]}
    product="/ai-receptionist"
    cta={{ heading: <>Never miss a table or an order.<br /><span>Free to start, with no per-minute fees.</span></>, body: "Message our team on WhatsApp and we’ll switch the AI voice agent on for your restaurant’s number." }}
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
  />;
}
