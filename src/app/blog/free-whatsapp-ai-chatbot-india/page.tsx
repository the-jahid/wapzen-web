import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// The India anchor post (user's brief, 2026-11-04: free AI WhatsApp chatbot, Wapzen's
// features, voice is working, no Meta API key, one-minute setup, strong on ChatGPT).
// Targets, gl=in autocomplete (docs/seo-research.md, "India posts"): "chatbot for
// whatsapp free" (35), "whatsapp automation free" (30, 3/3), "how to make whatsapp
// chatbot for free" (28), "whatsapp chatbot india" (20), "whatsapp automation india"
// (20), "whatsapp api without meta" (20), "whatsapp chatbot without api" (20), "whatsapp
// chatbot kaise banaye" (20). /free-whatsapp-chatbot and /blog/free-whatsapp-ai-agent
// are worldwide, so this one owns the rupee costs, Hinglish and Indian competitors.
// Prices read 2026-11-04: AiSensy add-ons and message rates from aisensy.com/pricing
// (plan price ₹1,500 from its own comparison pages), Interakt and WATI from their pricing
// pages. Product claims follow whiskey-bailey-server. Voice is described as working at
// the user's request, but the dashboard still shows VoiceUpdateNote, so the voice CTA
// opens WhatsApp: swap it for sign-up when the note goes. "1,000 businesses" is the user's
// figure (2026-11-04), not checked against the database. The user asked for no mention of
// bans in this post (2026-11-04), so it makes no claim either way about a number's safety;
// /blog/whatsapp-chatbot-without-business-api still answers that question.
const href = "/blog/free-whatsapp-ai-chatbot-india";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my business in India.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const route = [
  ["Meta API key or access token", "Yes, directly or through a provider", "No"],
  ["Meta Business account", "Yes", "No"],
  ["Template approval", "Yes, for messages you start", "No"],
  ["WhatsApp on your phone", "Depends on your provider and set-up", "Keeps working as normal"],
  ["Charge per message", "Yes, past the free allowance", "No"],
  ["Green-tick application", "Available", "Not offered"],
  ["Meta’s official platform", "Yes", "No: Wapzen is independent"],
];

const costs = [
  ["Monthly plan", "₹1,500 (Basic)", "$55 + taxes (Growth)", "$39, billed annually (Growth)", "₹0 right now"],
  ["AI replies", "Add-on: ₹1,350 for 1,000 AI messages", "Add-on: $74.99 with 100 AI messages, then $0.011 each", "2,000 AI credits a month", "Included, no monthly quota"],
  ["Each reply past 1,000 a month", "₹0.145", "Meta’s charge on top", "Meta’s charge on top", "No charge"],
  ["Each marketing message", "₹1.09", "Meta’s charge on top", "Meta’s charge on top", "No charge"],
  ["Calls on WhatsApp", "None on its pricing page", "Human calling on Advanced", "Through Astra, its AI agents", "AI voice agent, free right now"],
  ["Free option", "Free plan without AI or broadcasts", "Free trial", "7-day trial", "Free right now"],
];

const metaAi = [
  ["Made by", "Meta", "Wapzen, an independent company"],
  ["Official Meta product", "Yes", "No: it links as a device"],
  ["Which number", "WhatsApp Business app", "Personal or Business number"],
  ["Who can use it", "Eligible businesses, as it rolls out", "Anyone who signs up"],
  ["Price", "Free to start; Meta says paid subscriptions are coming", "Free right now"],
  ["What it learns from", "Your catalogue, documents and profile", "Your instructions and text, PDF or Word files"],
  ["WhatsApp calls", "Meta describes chats, not voice calls", "Voice agent answers them"],
  ["Connects to your own systems", "Not described for the app", "API tools"],
  ["UPI", "Payments in chat promised “soon”", "No payments in chat: it shares your UPI ID or link"],
];

const fit = [
  ["Shop or service answering the same questions all day", "Yes", "It replies in seconds from your information, day and night"],
  ["Instagram or Meesho seller taking orders on WhatsApp", "Yes", "Take Order collects the details and saves each confirmed order"],
  ["Business whose customers call on WhatsApp", "Yes", "The voice agent answers in Hindi and other Indian languages"],
  ["Brand messaging thousands who never wrote to it", "No", "That needs approved API templates"],
  ["Company that needs a green tick or approved templates", "No", "Those exist only on the official API"],
  ["Team that wants several AI agents on one account", "Not yet", "Each account has one chat agent"],
];

const prompt = `You are the virtual assistant of Demo Saree House, a saree shop in Surat.
Reply in the customer's language: Hindi, Hinglish, Gujarati or English. Keep replies to two or three short sentences.
Say in your first message that you are a virtual assistant.
For prices and stock, use only the information given to you. If you don't have it, say so and offer a call from our team.
We ship across India in 3 to 6 days. Cash on delivery is available above ₹500. For UPI, share [your UPI ID].
Shop hours are Monday to Saturday, 10 am to 8 pm.
To take an order, ask for the product, name and full address with PIN code, repeat the order, and ask the customer to confirm.`;

const sources = [
  { label: "Meta: Business AI on WhatsApp for small businesses in India (May 2026)", href: "https://about.fb.com/news/2026/05/introducing-business-ai-on-whatsapp-for-small-businesses-in-india/" },
  { label: "AiSensy: pricing and India message charges", href: "https://aisensy.com/pricing" },
  { label: "AiSensy: plan comparison", href: "https://aisensy.com/aisensy-vs-interakt-vs-wati" },
  { label: "Interakt: pricing", href: "https://www.interakt.shop/pricing/" },
  { label: "WATI: pricing", href: "https://www.wati.io/pricing/" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "TRAI press release No. 11/2025: amendments to the TCCCPR", href: "https://cms.trai.gov.in/sites/default/files/2025-02/PR_No.11of2025.pdf" },
  { label: "YourStory: DPDP Rules 2025 notified, rollout over 18 months", href: "https://yourstory.com/2025/11/digital-personal-data-protection-dpdp-rules-2025-rollout-over-18-months" },
];

const questions = [
  {
    id: "free",
    q: "Is there a really free AI WhatsApp chatbot in India?",
    answer: "Yes. Wapzen gives Indian businesses an AI WhatsApp chatbot that is free right now: no monthly fee, no per-message charge and no card. It runs on your existing number without the WhatsApp Business API, and 1,000 businesses already use it. Most other options are a short trial, a free plan without AI, or a paid AI add-on on top of Meta’s message charges.",
    body: <>
      <p>Search for a “free WhatsApp chatbot” in India and you’ll mostly find three things:</p>
      <ul>
        <li><strong>A free plan without the AI.</strong> AiSensy’s Free Forever plan gets you onto the official API, but leaves out the AI agent, chatbot flows and broadcasts.</li>
        <li><strong>A short trial.</strong> WATI offers 7 days, and Interakt also starts with a free trial. After that you pay for a plan.</li>
        <li><strong>Fixed auto-replies.</strong> The WhatsApp Business app’s greeting and away messages are free, but they send everyone the same text. They can’t answer “what’s the price of this?”</li>
      </ul>
      <p><Link href="/free-whatsapp-chatbot">Wapzen</Link> works differently. The AI is included, so you don’t need an OpenAI key or any other key. There’s no monthly reply quota, and because it doesn’t use the API, there are no Meta message charges either.</p>
      <p>Quick replies matter here: Meta cites a 2025 Kantar study finding that 91% of online adults in India chat with a business every week.</p>
    </>,
  },
  {
    id: "no-api",
    q: "Can I run a WhatsApp chatbot without a Meta API key?",
    answer: "Yes. Wapzen links your number as a device, like WhatsApp Web, using a QR code or an 8-character pairing code. You don’t need a Meta developer account, an API key, a provider (BSP), business verification or template approval, and you keep using WhatsApp on your phone as normal.",
    body: <>
      <p>Every API provider in India, including AiSensy, Interakt, WATI and Gupshup, still runs on Meta’s platform and passes its charges on to you. So the official API always involves Meta. Wapzen takes a different route: it connects the same way WhatsApp Web does.</p>
      <Comparison caption="What the official WhatsApp Business API needs compared with Wapzen" columns={["Official Business API", "Wapzen"]} rows={route} />
      <p>It works on a personal or a WhatsApp Business number, and you keep your chats. The price of skipping the API is that you don’t get its official status. For the full comparison, read <Link href="/blog/whatsapp-chatbot-without-business-api">how to create a WhatsApp chatbot without the Business API</Link>.</p>
    </>,
  },
  {
    id: "one-minute",
    q: "How do I set up a free WhatsApp chatbot in one minute?",
    answer: "Sign up free, paste a few lines about your business into the agent that’s already waiting in your account, then link your number with a QR code or pairing code. The agent goes live as soon as the number is linked. That takes about a minute; you can add price lists and PDFs afterwards.",
    body: <>
      <ol>
        <li><strong>Sign up free.</strong> No card and no API key. Your account already has a chat agent ready to set up.</li>
        <li><strong>Tell it about your business.</strong> Paste a few lines into its System Prompt: what you sell, your timings and how it should reply.</li>
        <li><strong>Link your number.</strong> On a computer, open WhatsApp on your phone, go to Linked devices, then Link a device, and scan the QR code. On a phone, enter your number and type the 8-character pairing code into WhatsApp. The agent goes live.</li>
        <li><strong>Test it.</strong> Send a message from a different number and ask what your customers usually ask.</li>
      </ol>
      <p>Here’s a sample prompt for a made-up shop. Change the details to match yours:</p>
      <pre>{prompt}</pre>
      <p>A minute gets you live with the basics, but the agent can only answer from what you give it. Add your price list and policies to a knowledge base as text, PDF or Word files, then attach it to the agent. Scanned PDFs can’t be read, so use files with selectable text.</p>
      <Note>The dashboard is in English. The agent replies in whichever languages your prompt asks for.</Note>
    </>,
  },
  {
    id: "kaise-banaye",
    q: "WhatsApp chatbot kaise banaye? (Free, bina API ke)",
    answer: "Wapzen par free account banaiye, agent ke prompt mein apne business ki jaankari likhiye, aur apna WhatsApp number QR code ya pairing code se link kijiye. Koi Meta API key nahi aur koi coding nahi. Lagbhag ek minute mein aapka AI chatbot customers ko Hindi, Hinglish ya English mein jawab dene lagta hai.",
    body: <div lang="hi-Latn">
      <ol>
        <li><strong>Account banaiye.</strong> Sign up free hai, card ki zaroorat nahi. Aapka agent pehle se taiyaar milta hai.</li>
        <li><strong>Prompt likhiye.</strong> Bataiye ki aap kya bechte hain, dukaan kab khulti hai, aur agent ko kis bhasha mein jawab dena hai.</li>
        <li><strong>Number link kijiye.</strong> Computer par: WhatsApp mein Linked devices kholiye aur QR code scan kijiye. Phone par: apna number daaliye aur 8 akshar ka pairing code WhatsApp mein likhiye.</li>
        <li><strong>Test kijiye.</strong> Kisi doosre number se message bhejiye aur dekhiye ki jawab sahi aa raha hai ya nahi.</li>
      </ol>
      <p><strong>WhatsApp auto reply kaise kare?</strong> Personal WhatsApp mein auto reply ka option nahi hota. WhatsApp Business app mein away message hota hai, par woh sabko ek hi jawab bhejta hai. Wapzen ka AI agent har customer ke sawaal ka alag jawab deta hai, aapki di hui jaankari se.</p>
    </div>,
  },
  {
    id: "cost",
    q: "How much does a WhatsApp chatbot cost in India?",
    answer: "On API platforms, plans start around ₹1,500 a month, AI add-ons cost about ₹1,350 to ₹2,499 more, and message charges and 18% GST come on top. Wapzen is ₹0 right now, with no message charges, because it doesn’t use the API.",
    body: <>
      <p>Here are the entry plans of three platforms popular in India, from their own pricing pages, next to Wapzen:</p>
      <Comparison caption="Cost of a WhatsApp AI chatbot in India: AiSensy, Interakt, WATI and Wapzen" columns={["AiSensy", "Interakt", "WATI", "Wapzen"]} rows={costs} />
      <h3>A worked example</h3>
      <p>A shop with 40 chats a day and about 4 AI replies per chat sends around <strong>4,800 replies a month</strong>:</p>
      <ul>
        <li><strong>AiSensy:</strong> ₹1,500 plan + ₹1,350 AI add-on + 3,800 replies × ₹0.145 (₹551) = <strong>₹3,401 + GST</strong>, about ₹4,013. The add-on covers only 1,000 of those AI messages, so the rest cost extra.</li>
        <li><strong>Interakt:</strong> $55 plan + $74.99 AI add-on + 4,700 AI messages × $0.011 ($51.70) = <strong>about $182 + taxes</strong>, plus Meta’s message charges.</li>
        <li><strong>Meta’s Cloud API directly:</strong> 3,800 × ₹0.115 = <strong>₹437 + GST</strong> in message charges, but you still have to build and host the bot and pay for the AI.</li>
        <li><strong>Wapzen:</strong> <strong>₹0</strong> right now.</li>
      </ul>
      <p>API platforms give you things Wapzen doesn’t: approved templates, official status and larger broadcasts. See <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link> for Meta’s full rates, and <Link href="/blog/aisensy-vs-interakt">AiSensy vs Interakt</Link> for those two in detail.</p>
      <Note>Prices come from each vendor’s page on the date of this post, and vendors change them. Meta’s rates change each quarter, so check them before you budget.</Note>
    </>,
  },
  {
    id: "features",
    q: "What can Wapzen’s WhatsApp chatbot do?",
    answer: "It answers one-to-one messages from your information, remembers the chat, takes orders, reads photos, replies to voice notes, sends personalised bulk messages, connects to your own systems and keeps every chat in one dashboard. You can also switch the AI off for any single customer.",
    body: <>
      <ul>
        <li><strong>Answers from your information.</strong> Upload FAQs, price lists and policies as text, PDF or Word. The agent searches them for each message, and you can tell it to say so when something isn’t there.</li>
        <li><strong>Remembers the conversation.</strong> It keeps the last 20 exchanges word for word and a summary of anything earlier, so customers don’t have to repeat themselves.</li>
        <li><strong>Takes orders.</strong> The Take Order tool collects the details, repeats the order, and saves it to your Orders page once the customer confirms.</li>
        <li><strong>Handles voice notes and photos.</strong> Two switches, off by default, let it transcribe voice notes and read photos such as a product screenshot. It always replies in text.</li>
        <li><strong>Sends bulk messages.</strong> Upload an Excel or CSV sheet and send a personalised message to up to 5,000 numbers, 30 seconds apart by default. Only use it for customers who expect to hear from you.</li>
        <li><strong>Connects to your systems.</strong> API tools can check an order’s status or send a lead to your CRM during the chat.</li>
        <li><strong>Lets you step in.</strong> Read every chat in the dashboard and reply yourself. Each conversation has its own switch to turn the AI off for that customer.</li>
        <li><strong>Knows the date and time.</strong> It works in your number’s time zone, so “tomorrow” and “open now” come out right.</li>
      </ul>
      <p>To bring customers to the chat, make a free <Link href="/tools/whatsapp-link-generator">WhatsApp link</Link> or <Link href="/tools/whatsapp-qr-code-generator">QR code</Link> for your shop counter, Instagram bio and pamphlets.</p>
      <InlineCta title="Your free AI WhatsApp chatbot, live in about a minute" body="No Meta API key, no card and no per-message charge. Link your number and the agent starts replying." label="Start free" />
    </>,
  },
  {
    id: "hindi",
    q: "Does it reply in Hindi, Hinglish and regional languages?",
    answer: "Yes. Tell the agent which languages to use and it can reply in Hindi, Hinglish, English, Tamil, Telugu, Bengali, Marathi, Gujarati and others, following whichever one the customer writes in. Test it in your customers’ own style, and check that prices and product names come out correctly before you go live.",
    body: <>
      <p>Here’s how a chat could go for a shop using the prompt above:</p>
      <ChatExample
        business="Demo Saree House"
        labels={{ subtitle: "WhatsApp · AI agent", agent: "AI agent: ", patient: "Customer: " }}
        turns={[
          { from: "patient", text: "Hi, ye banarasi saree ka price kya hai?" },
          { from: "agent", text: "Namaste! Main Demo Saree House ki virtual assistant hoon. Banarasi silk sarees ₹2,499 se shuru hoti hain. Aapko kaunsa colour chahiye?" },
          { from: "patient", text: "Maroon. Pune mein COD milega?" },
          { from: "agent", text: "Haan, Pune mein ₹500 se upar ke orders par COD milta hai, aur delivery 3 se 6 din mein hoti hai. Order ke liye apna naam aur poora address PIN code ke saath bhej dijiye." },
          { from: "patient", text: "Priya Shah, 14 Model Colony, Pune 411016" },
          { from: "agent", text: "Please check kar lijiye: maroon banarasi silk saree, ₹2,499, COD, Priya Shah, 14 Model Colony, Pune 411016. Order confirm kar doon?" },
          { from: "patient", text: "Haan, confirm" },
          { from: "agent", text: "Ho gaya! Aapka order number 1042 hai. Dhanyavaad." },
        ]}
        caption="An illustrative chat for a made-up shop. The price comes from the price list the shop uploaded."
        points={[
          { title: "Follows the customer’s language", body: "The customer writes in Hinglish, so the agent replies in Hinglish. The prompt lists the languages you want." },
          { title: "Answers from your price list", body: "It finds the price in your knowledge base rather than guessing one." },
          { title: "Confirms before saving", body: "With Take Order on, an order is saved only after the customer says yes to the summary." },
          { title: "Says it’s an assistant", body: "The prompt tells it to say so in its first message, which is the honest way to start." },
        ]}
      />
      <p>Many Indian customers prefer voice notes to typing. Turn on <strong>Reply to voice messages</strong> and the agent transcribes each note and replies in text. Try it with real notes in your customers’ languages first, because accuracy can vary with accent and background noise.</p>
    </>,
  },
  {
    id: "voice",
    q: "Can the AI also answer WhatsApp calls?",
    answer: "Yes, voice is working. Wapzen’s voice agent answers WhatsApp calls on your number in a natural voice, in Hindi, English and nine more Indian languages, using the same information as the chatbot. There’s no per-minute charge. It handles WhatsApp calls only, not mobile network or landline calls.",
    body: <>
      <p>Plenty of customers would rather call than type, especially for a quick question. The voice agent takes those calls for you:</p>
      <ul>
        <li><strong>Answers incoming WhatsApp calls</strong> in Hindi, English (India), Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi or Urdu.</li>
        <li><strong>Calls back your leads.</strong> Add a lead to a campaign and the agent calls them on WhatsApp straight away.</li>
        <li><strong>Has no per-minute bill.</strong> Phone-line AI platforms charge by the minute: Bolna lists ₹5.52 a minute pay-as-you-go. WhatsApp calls run over the app.</li>
      </ul>
      <p>Two things to plan for: the agent pauses for a second or two before each answer, and it can’t transfer a live call to a person. It can send your team’s contact instead. Read more on <Link href="/ai-calling-agent-india">AI calling for Indian businesses</Link> and <Link href="/blog/ai-voice-agent-whatsapp-india">AI voice agents for Indian sales teams</Link>.</p>
      <InlineCta href={voiceAccess} title="Turn on the voice agent" body="Voice is free right now too. Message our team on WhatsApp and we’ll switch it on for your number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "meta-ai",
    q: "How is Wapzen different from Meta’s Business AI?",
    answer: "Meta’s agent, launched in India as Business AI in May 2026 and now called Meta Business Agent, lives inside the WhatsApp Business app and is rolling out to eligible businesses, with paid subscriptions planned. Wapzen isn’t made by Meta, but it also works on personal numbers and adds API tools, bulk messages and voice calls.",
    body: <>
      <Comparison caption="Meta Business Agent in the WhatsApp Business app compared with Wapzen" columns={["Meta Business Agent", "Wapzen"]} rows={metaAi} />
      <p>If Meta’s agent already appears in your Tools tab, it’s worth trying: it’s official and free to start, and it says it covers all native Indian languages. Choose Wapzen if you don’t have it yet, you use a personal number, or you need calls, bulk messages or a link to your own systems. Details are in our guide to the <Link href="/blog/whatsapp-business-ai-agent">WhatsApp Business AI agent</Link>.</p>
    </>,
  },
  {
    id: "which",
    q: "Which WhatsApp chatbot should a small Indian business choose?",
    answer: "Choose by what you need. For free AI replies on your existing number with no Meta API key, use Wapzen. For official status, approved templates, a green-tick application and large broadcasts, use an API provider such as AiSensy, Interakt or WATI. If Meta Business Agent is in your app, try that too.",
    body: <>
      <p>Here’s where Wapzen fits and where it doesn’t:</p>
      <Comparison caption="Who a free WhatsApp AI chatbot like Wapzen suits, and who it doesn’t" columns={["Good fit?", "Why"]} rows={fit} />
      <p>If you’re weighing up the API platforms, start with <Link href="/blog/wati-vs-aisensy-vs-interakt">WATI vs AiSensy vs Interakt</Link>. If you already know your industry, we have guides for <Link href="/blog/whatsapp-chatbot-real-estate-india">real estate in India</Link> and <Link href="/blog/whatsapp-chatbot-coaching-institute-india">coaching institutes</Link>.</p>
    </>,
  },
  {
    id: "limits",
    q: "What are the limits of Wapzen’s free chatbot?",
    answer: "Each account has one chat agent, which can send up to 100 AI replies an hour. It answers one-to-one chats, not groups, and its replies are text, so it shares links rather than sending PDFs or images. There’s no monthly reply quota and no per-message charge.",
    body: <>
      <ul>
        <li><strong>100 AI replies an hour per agent.</strong> Past that, the agent stays quiet until the hour is up. Incoming messages are still saved, so you can answer them yourself.</li>
        <li><strong>Groups stay untouched.</strong> The agent doesn’t reply in groups, broadcasts or channels.</li>
        <li><strong>No payments in chat.</strong> It can share your UPI ID or payment link, but it can’t see whether the customer has paid.</li>
        <li><strong>Check the sensitive answers.</strong> Like any AI, it can get things wrong. Read your chats in the first few days and tighten the prompt.</li>
      </ul>
      <p>Wapzen is an independent product, not made by Meta or WhatsApp.</p>
    </>,
  },
  {
    id: "rules",
    q: "What do DPDP and TRAI rules mean for a WhatsApp chatbot?",
    answer: "The DPDP Rules were notified in November 2025 with an 18-month rollout, so most notice and consent duties apply from May 2027. TRAI’s 140 and 1600 number series cover calls on phone networks, and it isn’t settled how they apply to WhatsApp. Collect only what you need, and message only people who expect it.",
    body: <>
      <ul>
        <li><strong>Build consent in now.</strong> On your forms, say you’ll contact people on WhatsApp, who you are and why, and keep that record.</li>
        <li><strong>Ask only for what you need.</strong> A delivery needs a name and an address, not an Aadhaar number.</li>
        <li><strong>Don’t treat WhatsApp as a TRAI loophole.</strong> Call and message only people who asked to hear from you.</li>
        <li><strong>Know where the data goes.</strong> Chats pass through AI providers and stay stored until you delete them. Our <Link href="/privacy">privacy policy</Link> has the details.</li>
      </ul>
      <p>This is general information, not legal advice.</p>
    </>,
  },
];

export default function FreeWhatsAppAiChatbotIndiaPage() {
  return <QaPost
    href={href}
    heading={<>A free AI WhatsApp chatbot for Indian businesses.<br /><span>No Meta API key. Live in about a minute.</span></>}
    lead="Most “free” WhatsApp chatbots in India turn out to be a 7-day trial, a plan without AI, or an API bill that grows with every message. Here are straight answers on what’s really free, what the alternatives cost in rupees, and how to put an AI agent on your own number in about a minute."
    verdict={{
      title: "The short answer",
      body: <>Yes, you can run a free AI WhatsApp chatbot in India. <strong>Wapzen</strong> works on the number you already use, with no Meta API key, no provider, no template approval and no per-message charge, because it links your number as a device. It replies in Hindi, Hinglish, English and regional languages, takes orders, and its voice agent answers WhatsApp calls. Everything is free right now, and 1,000 businesses already use it.</>,
    }}
    facts={[["Price", "₹0 right now"], ["Meta API key", "Not needed"], ["Setup", "About 1 minute"], ["Voice calls", "Working, in Hindi and more"]]}
    indexTitle="The 12 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/whatsapp-chatbot-without-business-api", "/blog/ai-voice-agent-whatsapp-india"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Let your WhatsApp reply for you.<br /><span>Free right now, with no Meta API key.</span></>, body: "Sign up, tell the agent about your business and link your number. It takes about a minute, with no card and no per-message charge." }}
  />;
}
