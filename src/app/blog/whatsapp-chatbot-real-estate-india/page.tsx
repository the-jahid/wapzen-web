import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topic found by the India vertical harvest (2026-11-04, docs/seo-research.md, "India
// posts"): real estate was the strongest vertical, 854, ahead of coaching at 635. Targets:
// "ai chatbot for real estate" (30, 3/3), "whatsapp marketing for real estate" (30, 3/3),
// "real estate crm india" (30, 3/3), "real estate lead generation" (30, 3/3), "99acres
// leads" (19), "magicbricks leads" (18), "ai in real estate india" (18). No English post
// covers this. /ai-calling-agent-for-real-estate is about calls, so this one owns chat
// and links to it. Facts: portal delivery and the 5 to 15 minute window from Sell.do (a
// CRM vendor, said so in the copy), the HBR study via its abstract and write-ups,
// MahaRERA's order of 8 April 2025 via The Realty Today, Kerala via Housing.com. There's
// no ruling on one-to-one WhatsApp replies, and the copy says so. Wapzen has no portal
// integration, can't send files and can't start a chat by itself: the post states all of
// that. Voice is described as working at the user's request; its CTA opens WhatsApp
// because the dashboard still shows VoiceUpdateNote.
const href = "/blog/whatsapp-chatbot-real-estate-india";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my real estate business in India.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const qualify = [
  ["BHK or property type", "Sends the buyer to the right project and price sheet"],
  ["Budget", "Separates serious buyers from early browsers"],
  ["Preferred location", "Lets you offer another project if this one doesn’t fit"],
  ["Self-use or investment", "Changes what your sales adviser leads with"],
  ["When they plan to buy", "Tells your team who to call first"],
  ["Home loan needed?", "Lets your team prepare the loan conversation"],
];

const crm = [
  ["Reply to every enquiry within seconds, day and night", "Depends on the CRM and its add-ons", "Yes"],
  ["Qualify buyers in Hindi or Hinglish", "Depends on the CRM and its add-ons", "Yes"],
  ["Keep the full WhatsApp chat", "Depends on the CRM", "Yes"],
  ["Receive leads directly from property portals", "Often, through integrations", "No"],
  ["Assign leads to a sales team", "Yes", "No"],
  ["Follow-up reminders and a sales pipeline", "Yes", "No"],
  ["Report on which portal brings buyers", "Yes", "No"],
];

const fit = [
  ["Solo broker or small agency on WhatsApp all day", "Yes", "Replies at any hour, so fewer enquiries go cold"],
  ["Builder’s sales office with repeat project questions", "Yes", "Answers price, size and possession questions from your documents"],
  ["Broker selling to NRI buyers in other time zones", "Yes", "Replies while your office is closed"],
  ["Team that needs lead assignment and a pipeline", "Use with a CRM", "An API tool can send details to your CRM"],
  ["Anyone wanting the bot to message bought lists", "No", "Those people never asked to hear from you"],
  ["Business that needs a green tick or approved templates", "No", "Those exist only on the official API"],
];

const prompt = `You are the virtual assistant of Demo Homes, a residential project in Wakad, Pune.
Reply in the customer's language: Hindi, Hinglish, Marathi or English. Use two or three short sentences, and ask one question at a time.
Say in your first message that you are a virtual assistant.
For prices, sizes, possession dates and amenities, use only the project information given to you. If you don't have it, say so and offer a call from our sales team.
Include the RERA registration number when you share project details: [your RERA number].
Find out: BHK, budget, self-use or investment, when they plan to buy, and whether they need a home loan.
Then offer a site visit and ask which day suits them. Say our team will call to confirm it.
Never promise rental returns, price rises, loan approval or a discount. Never say units are running out unless your information says so.`;

const firstMessage = `Namaste {{name}}, aapne Demo Homes, Wakad ke baare mein enquiry ki thi. Main 2BHK aur 3BHK ki details yahin WhatsApp par bata sakta hoon. Aap khud rehne ke liye dekh rahe hain ya investment ke liye?

Demo Homes, RERA: [your RERA number]`;

const launch = `Hello {{name}}, you asked us about homes in {{area}} earlier. We've opened a new tower at Demo Homes, with 2BHK homes from ₹[price]. Would you like the details and a site visit this weekend? Reply STOP if you'd rather not hear from us.

RERA: [your RERA number] | [project link]`;

const visit = `Namaste {{name}}, aapki site visit {{day}} ko {{time}} baje hai, Demo Homes, Wakad mein. Location: [map link]. Agar time badalna ho to yahin bata dijiye.`;

const sources = [
  { label: "Harvard Business Review: The Short Life of Online Sales Leads", href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
  { label: "Sell.do: Real estate portal leads from 99acres, MagicBricks and Housing", href: "https://www.sell.do/blog/real-estate-portal-leads-99acres-magicbricks-housing-2026" },
  { label: "Privyr: Are 99acres lead generation packages worth it?", href: "https://www.privyr.com/blog/are-99acres-lead-generation-packages-worth-the-investment/" },
  { label: "The Realty Today: MahaRERA makes QR code and registration number mandatory in ads", href: "https://therealtytoday.com/news/regulatory/maharera-makes-qr-code-registration-number-mandatory-in-ads-50000-penalty-for-violations/" },
  { label: "Housing.com: QR code mandatory for real estate projects, Kerala RERA", href: "https://housing.com/news/qr-code-mandatory-for-real-estate-projects-from-sep-1-kerala-rera/" },
  { label: "AiSensy: pricing and India message charges", href: "https://aisensy.com/pricing" },
  { label: "TRAI press release No. 11/2025: amendments to the TCCCPR", href: "https://cms.trai.gov.in/sites/default/files/2025-02/PR_No.11of2025.pdf" },
  { label: "YourStory: DPDP Rules 2025 notified, rollout over 18 months", href: "https://yourstory.com/2025/11/digital-personal-data-protection-dpdp-rules-2025-rollout-over-18-months" },
];

const questions = [
  {
    id: "free",
    q: "Is there a free WhatsApp chatbot for real estate agents in India?",
    answer: "Yes. Wapzen gives Indian brokers, channel partners and builders an AI WhatsApp chatbot that is free right now, with no per-message charge and no Meta API key. It replies to property enquiries in seconds on your own number, answers from your project details, qualifies the buyer and notes site-visit requests for your team.",
    body: <>
      <p>Real estate suits an AI agent because buyers tend to ask the same things: price, carpet area, possession date, location, loan options. Those answers are already in your brochure and price sheet. The agent can give them at 10 pm on a Sunday, when your office is closed and a buyer has time to look.</p>
      <p>You don’t need the WhatsApp Business API, a provider or a green tick. <Link href="/blog/free-whatsapp-ai-chatbot-india">Wapzen</Link> links your existing number as a device, so buyers see the number they already know, and you keep using WhatsApp on your phone.</p>
    </>,
  },
  {
    id: "speed",
    q: "Why do property leads go cold so quickly?",
    answer: "Because buyers often enquire on several listings at once, sometimes outside office hours, and the first useful answer can win the conversation. A Harvard Business Review study of US companies found that those trying to reach a lead within an hour were nearly seven times as likely to qualify it as those who took longer.",
    body: <>
      <p>That study isn’t specific to Indian property, but buyers here behave in a similar way. Sell.do, a real estate CRM vendor, says the same buyer’s number usually reaches several listings at once, so “you are racing three other brokers, not a clock”. It suggests responding to portal leads within 5 to 15 minutes. That’s hard to do while you’re at a site visit, and impossible at midnight.</p>
      <p>A chatbot doesn’t close the sale. What it does is give the buyer a useful answer straight away, learn what they want, and hold the conversation until your adviser can call. That also helps with NRI buyers, who may be writing from the Gulf or the US while your office is shut.</p>
    </>,
  },
  {
    id: "portals",
    q: "How does it work with 99acres, MagicBricks and Housing.com leads?",
    answer: "Wapzen doesn’t connect directly to property portals. The portals deliver enquiries to their dashboard and email, and some packages offer CRM or API delivery. Because the AI agent answers people who message your WhatsApp, you send each new lead a short first message, or put your WhatsApp link where buyers see it. The agent handles the replies.",
    body: <>
      <p>There are three practical ways to do this:</p>
      <ol>
        <li><strong>Send a first message to each portal lead.</strong> Do it from your phone, or upload the day’s leads to Bulk Messages with a personalised template. When the buyer replies, the agent takes over.</li>
        <li><strong>Get buyers to message you first.</strong> Put a free <Link href="/tools/whatsapp-link-generator">WhatsApp link</Link> on your website, ads and social posts, and a <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code</Link> on site boards and brochures. Check each portal’s rules before adding a link to a listing.</li>
        <li><strong>Have the voice agent call them.</strong> Add a lead to a voice campaign and the agent calls on WhatsApp straight away. If your CRM receives the portal’s leads, it can add them through our API.</li>
      </ol>
      <p>Here’s a first message for a lead who enquired on a portal:</p>
      <pre>{firstMessage}</pre>
      <p>Add what this message says to the agent’s prompt, so it understands what the buyer is replying to.</p>
      <Note>Portal lead packages aren’t priced publicly: Privyr describes 99acres’ as custom, so ask the portal’s sales team for a quote. The more you pay per lead, the more an unanswered enquiry costs you.</Note>
    </>,
  },
  {
    id: "qualify",
    q: "What should a chatbot ask to qualify a property buyer?",
    answer: "Six things, one at a time: BHK or property type, budget, preferred location, self-use or investment, when they plan to buy, and whether they need a home loan. Then it should offer a site visit and ask which day suits them. Asking everything in one message makes a chat feel like a form, so buyers drop off.",
    body: <>
      <Comparison caption="Six questions an AI agent can ask to qualify a property buyer in India" columns={["Why it matters"]} rows={qualify} />
      <p>Here’s how that could look in Hinglish:</p>
      <ChatExample
        business="Demo Homes, Wakad"
        labels={{ subtitle: "WhatsApp · AI agent", agent: "AI agent: ", patient: "Buyer: " }}
        turns={[
          { from: "patient", text: "Hi, Wakad project mein 2BHK ka price kya hai?" },
          { from: "agent", text: "Namaste! Main Demo Homes ki virtual assistant hoon. 2BHK ₹78 lakh se shuru hote hain, carpet area 712 sq ft, possession December 2027. RERA: [number]. Aap khud rehne ke liye dekh rahe hain ya investment ke liye?" },
          { from: "patient", text: "Khud ke liye. Budget 85 lakh tak hai." },
          { from: "agent", text: "Is budget mein 2BHK aaram se aa jayega. Aap kab tak lena chahte hain?" },
          { from: "patient", text: "Agle 3 mahine mein. Loan bhi chahiye hoga. Rate kitna kam ho sakta hai?" },
          { from: "agent", text: "Loan ka rate aur approval bank tay karta hai, to main iska promise nahi kar sakti. Hamari team aapko loan process samjha degi. Kya aap is weekend site visit karna chahenge?" },
          { from: "patient", text: "Sunday chalega." },
          { from: "agent", text: "Note kar liya: Sunday site visit, 2BHK, budget ₹85 lakh, loan chahiye. Hamari team aaj sham tak call karke time confirm karegi." },
        ]}
        caption="An illustrative chat for a made-up project. Prices and dates come from the documents the broker uploaded."
        points={[
          { title: "One question at a time", body: "The agent gathers budget, purpose and timeline as the chat goes on, without making it feel like a form." },
          { title: "Won’t promise what it can’t", body: "Asked about loan rates, it says the bank decides. The prompt forbids promises on loans, returns and discounts." },
          { title: "Your team confirms the visit", body: "The agent notes the request. It has no calendar of its own unless you connect one with an API tool." },
          { title: "It’s all in one thread", body: "Your adviser reads the whole chat in the dashboard before calling, so the buyer doesn’t repeat anything." },
        ]}
      />
    </>,
  },
  {
    id: "setup",
    q: "How do I set it up in a minute without a Meta API key?",
    answer: "Sign up free, paste the prompt below into the chat agent waiting in your account, and link your number with a QR code or pairing code. The agent goes live as soon as the number is linked, in about a minute. Then upload your brochure and price sheet so it can answer project questions properly.",
    body: <>
      <ol>
        <li><strong>Sign up free.</strong> No card and no API key.</li>
        <li><strong>Paste your prompt.</strong> Use the sample below and change the project details.</li>
        <li><strong>Link your number.</strong> Scan the QR code from WhatsApp’s Linked devices on a computer, or enter the 8-character pairing code on a phone.</li>
        <li><strong>Add your documents.</strong> Upload price sheets, floor plan details and FAQs as text, PDF or Word. Scanned brochures can’t be read, so use a version with selectable text, or type the key facts in.</li>
        <li><strong>Test it.</strong> From another number, ask what buyers ask, including awkward questions like “what returns will I get?”</li>
      </ol>
      <pre>{prompt}</pre>
      <p>Each account has one chat agent, so if you sell several projects, put them all in its knowledge base and have it ask which one the buyer means.</p>
      <InlineCta title="Answer your next property enquiry in seconds" body="Free right now, with no Meta API key, no card and no per-message charge. Set-up takes about a minute." label="Start free" />
    </>,
  },
  {
    id: "cost",
    q: "What does a real estate WhatsApp chatbot cost compared with API platforms?",
    answer: "A broker sending about 7,200 AI replies a month would pay roughly ₹3,749 plus GST on AiSensy’s Basic plan and AI add-on, with more for AI messages past the first 1,000. On Wapzen the same replies cost ₹0 right now, because it doesn’t use the API and has no message charges.",
    body: <>
      <p>Take a broker with 30 enquiries a day and about 8 AI replies per enquiry, which comes to <strong>7,200 replies a month</strong>:</p>
      <ul>
        <li><strong>AiSensy:</strong> ₹1,500 plan + ₹1,350 AI add-on + 6,200 replies × ₹0.145 (₹899) = <strong>₹3,749 + GST</strong>, about ₹4,424. The add-on includes 1,000 AI messages, so the rest cost extra.</li>
        <li><strong>A launch message to 2,000 past enquiries:</strong> 2,000 × ₹1.09 = <strong>₹2,180</strong> per send on AiSensy, plus GST.</li>
        <li><strong>Wapzen:</strong> <strong>₹0</strong> for both. The trade-off is speed and status: at the default 30-second gap, 2,000 messages take about 17 hours, and they aren’t approved API templates.</li>
      </ul>
      <p>For other platforms and Meta’s own rates, see <Link href="/blog/free-whatsapp-ai-chatbot-india">what a WhatsApp chatbot costs in India</Link>.</p>
    </>,
  },
  {
    id: "voice",
    q: "Can the AI answer calls from property buyers too?",
    answer: "Yes, voice is working. Wapzen’s voice agent answers WhatsApp calls on your number, in Hindi, English, Marathi, Tamil and other Indian languages, using the same project information as the chatbot. It can also call new leads on WhatsApp straight away. There’s no per-minute charge. It can’t dial normal phone numbers or transfer a live call.",
    body: <>
      <p>Many property buyers prefer to call, particularly once they’re serious. If they call your WhatsApp while you’re on a site visit, the voice agent can answer, give them the basics and take their requirement. Because it can’t hand over a live call, it tells the buyer your adviser will call back, and can send your adviser’s contact by message.</p>
      <p>There’s more on this in <Link href="/ai-calling-agent-for-real-estate">AI calling for real estate</Link>, and a sample Hindi call in our <Link href="/blog/ai-voice-agent-whatsapp-india#sample">guide for Indian sales teams</Link>.</p>
      <InlineCta href={voiceAccess} title="Add the voice agent for buyers who call" body="Voice is free right now too. Message our team on WhatsApp and we’ll switch it on for your number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "crm",
    q: "Do I need a real estate CRM as well?",
    answer: "If you run a sales team, yes. A real estate CRM assigns leads, tracks follow-ups and reports on each lead source. Wapzen answers and qualifies buyers on WhatsApp and keeps each chat, but it has no pipeline, lead assignment or follow-up reminders. A solo broker can often start without a CRM, and a team can send details to one with an API tool.",
    body: <>
      <Comparison caption="A real estate CRM compared with Wapzen's WhatsApp AI agent" columns={["Real estate CRM", "Wapzen"]} rows={crm} />
      <p>They do different jobs, so many teams would use both: CRMs such as Sell.do and LeadSquared manage the sales process, and the agent handles the first conversation. An <strong>API tool</strong> can send the buyer’s budget, BHK and visit request to your CRM during the chat. Test it a few times before relying on it.</p>
      <p>When your adviser takes over a hot lead, flip that conversation’s <strong>AI switch</strong> off. The agent stops replying to that buyer only and carries on with everyone else. It doesn’t switch off by itself when you reply, so remember to use the switch.</p>
    </>,
  },
  {
    id: "marketing",
    q: "What WhatsApp marketing works for a real estate broker?",
    answer: "Message people who enquired with you or bought from you, about things they’d want to hear: new launches, price revisions and site-visit reminders. Don’t buy lists. Personalise each message, include the RERA number on project messages, leave a gap between sends, and stop when someone asks.",
    body: <>
      <p>Bulk Messages takes an Excel or CSV sheet and fills in placeholders such as <code>{"{{name}}"}</code> from your columns. Here are two messages you can adapt.</p>
      <h3>New launch, to past enquiries</h3>
      <pre>{launch}</pre>
      <h3>Site-visit reminder</h3>
      <pre>{visit}</pre>
      <p>Skip bought property-buyer databases: those people don’t know you and never asked to hear from you. Read our <Link href="/blog/whatsapp-bulk-message-sender-free">guide to bulk messaging</Link> before your first send.</p>
    </>,
  },
  {
    id: "rera",
    q: "What does RERA require in WhatsApp property messages?",
    answer: "It depends on your state. MahaRERA’s April 2025 order requires developers and agents to show the registration number and a QR code in advertisements, including social media, with fines of up to ₹50,000. Kerala RERA has a similar QR rule. Treat WhatsApp sales messages as advertising, and ask your adviser how your state’s rules apply.",
    body: <>
      <p>We didn’t find a ruling specifically about one-to-one WhatsApp replies, so the careful approach is:</p>
      <ul>
        <li><strong>Add the registration number</strong> to the agent’s prompt and to every bulk template about a project.</li>
        <li><strong>Include your agent registration</strong> if you’re a RERA-registered agent.</li>
        <li><strong>Handle the QR code yourself.</strong> The agent replies in text, so it can’t send a QR image. It can share a link to the project’s RERA page. Send the QR image yourself when you share creatives, and ask your adviser if text replies need more.</li>
        <li><strong>Never let it promise returns.</strong> Guaranteed returns, price rises and possession dates that aren’t in your documents can land you in trouble, so forbid them in the prompt.</li>
      </ul>
      <p><strong>Consent.</strong> Most DPDP notice and consent duties apply from May 2027, so build them into your enquiry forms now. <strong>Calls.</strong> TRAI’s 140 and 1600 number series cover calls on phone networks. It isn’t settled how they apply to WhatsApp calls, so don’t treat WhatsApp as a loophole. Call only people who asked.</p>
      <p>This is general information, not legal advice.</p>
    </>,
  },
  {
    id: "limits",
    q: "What can’t a free real estate chatbot do?",
    answer: "Wapzen can’t send PDFs or images, reply in groups, connect directly to portals, keep a pipeline or book a calendar slot without an API tool. It can send up to 100 AI replies an hour, and each account has one chat agent.",
    body: <>
      <Comparison caption="Who a free WhatsApp AI chatbot suits in Indian real estate" columns={["Good fit?", "Why"]} rows={fit} />
      <ul>
        <li><strong>Brochures go as links.</strong> The agent can’t attach a PDF, so host your brochure online and put the link in its information.</li>
        <li><strong>Property groups stay untouched.</strong> The agent ignores groups, so your channel-partner groups won’t get AI replies.</li>
        <li><strong>A big campaign can hit the hourly limit.</strong> Past 100 AI replies in an hour, it goes quiet until the hour ends. Messages are still saved, so send campaigns in batches.</li>
        <li><strong>Check it’s saying the right things.</strong> Read your chats for the first few days, and update the documents when prices change.</li>
      </ul>
      <p>Wapzen is an independent product, not made by Meta or WhatsApp.</p>
    </>,
  },
];

export default function WhatsAppChatbotRealEstateIndiaPage() {
  return <QaPost
    href={href}
    heading={<>A free WhatsApp chatbot for real estate in India.<br /><span>Answer every property enquiry in seconds.</span></>}
    lead="A buyer who enquires at 9 pm is often enquiring with other brokers too. Here’s how Indian brokers, channel partners and builders can put an AI agent on their own WhatsApp number for free, qualify buyers in Hindi or English, and stay on the right side of RERA, with no Meta API key and about a minute of setup."
    verdict={{
      title: "The short answer",
      body: <><strong>Wapzen</strong> is a free AI WhatsApp chatbot that works for real estate in India. It replies to enquiries in seconds on your own number, in Hindi, Hinglish or English, answers from your project documents, asks about budget, BHK and timeline, and notes site-visit requests. Its voice agent answers WhatsApp calls, and 1,000 businesses already use Wapzen. You don’t need a Meta API key. It doesn’t replace a CRM, and it doesn’t plug directly into property portals.</>,
    }}
    facts={[["Price", "₹0 right now"], ["Meta API key", "Not needed"], ["Setup", "About 1 minute"], ["Buyer calls", "Voice agent working"]]}
    indexTitle="The 11 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/free-whatsapp-ai-chatbot-india", "/blog/ai-voice-agent-whatsapp-india"]}
    product="/ai-calling-agent-for-real-estate"
    cta={{ heading: <>Stop losing buyers to a slow reply.<br /><span>Free right now, with no Meta API key.</span></>, body: "Sign up, give the agent your project details and link your number. It takes about a minute, with no card and no per-message charge." }}
  />;
}
