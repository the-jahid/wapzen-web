import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { JobBoard, PlaybookPost, PromptFile, SetupSteps, Templates, VoiceCard } from "@/components/blog/PlaybookPost";

// Freelancer / reseller post, asked for 2026-11-17 ("freelancers who can resell Wapzen and give
// service to users"). Keywords from docs/seo-blog-reseller-research.mjs (Google, YouTube and
// DuckDuckGo autocomplete, US/IN/GB): "how to start an ai automation agency" 129, "whatsapp api
// reseller" 98, "whatsapp automation agency" 90, "how to sell ai agents to businesses" 90,
// "whatsapp automation services" 90, "white label whatsapp chatbot" 90, "make money with ai
// agents" 90, "white label ai agents" 87, "selling chatbots to businesses" 82, "chatbot freelance
// jobs" 75, plus "whatsapp chatbot reseller", "ai agent freelance", "chatbot agency". See
// docs/seo-research.md, "Freelancer reseller post".
// There is NO reseller program in the product: the user chose (2026-11-17) "partner via
// WhatsApp": the post says message the team to resell Wapzen and states no commission, discount
// or white-label terms. Never invent them. Wapzen isn't white label (clients see Wapzen), and the
// free start has one chat agent per account, so each client gets an account of their own.
// Competitor facts read on their own pages 2026-11-17: BotPenguin White-Label from $600/year,
// Reseller from $500/year with 30% recurring commission; Robofy Accelerator $799/year for 10
// client sub-accounts (~16,000 AI messages a month); Wassenger reseller = your own prices and
// commission, a one-time set-up fee with no amount listed. Market prices: TechConcepts €149 setup
// + €49/month before VAT; Hyperleap (updated 10 Nov 2026) India custom integration ₹50,000-2,00,000
// one-time, ₹10,000-25,000/month maintenance. Recheck before editing.
// Copy rules: "free to start, no card", never a reply count, "unlimited" or "free forever"; the
// voice agent works (WhatsApp calls only, no transfer); never "no ban risk".
const href = "/blog/whatsapp-chatbot-reseller";
const post = blogPost(href);
const partner = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'm a freelancer and I'd like to resell Wapzen to my clients.")}`;
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I resell Wapzen and I'd like the voice agent turned on for my client's WhatsApp number.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const packages = [
  ["Starter: FAQ assistant", "Instructions, a knowledge base built from the price list and FAQ, testing, a short handover call", "Salons, tutors, small shops, repair services", "One setup fee"],
  ["Sales assistant", "Starter, plus photos and PDFs it sends, Take Order with alerts to a staff phone, handover rules and website reading", "Restaurants, online shops, real estate, car dealers", "Setup fee plus monthly care"],
  ["Pro assistant", "Sales, plus API tools to the client’s booking system or CRM and an AI voice agent for WhatsApp calls", "Clinics with booking software, hotels, busy teams", "Larger setup fee plus monthly care"],
  ["Monthly care", "Read the chats, fix wrong answers, update prices, menus and offers, check the number is still linked", "Every client after setup", "Monthly fee"],
];

const compare = [
  ["BotPenguin White-Label", "From $600 a year", "Yes: your brand, domain and logo", "You set the client prices; extras such as on-premise hosting cost more"],
  ["BotPenguin Reseller", "From $500 a year", "No: you sell BotPenguin", "30% recurring commission on your clients’ plans"],
  ["Robofy reseller (Accelerator)", "$799 a year", "Yes", "10 client sub-accounts and about 16,000 AI messages a month"],
  ["Wassenger reseller", "A one-time set-up fee (amount not listed)", "Yes: your logo, brand and domain", "You set your own prices and commission after signing a reseller agreement"],
  ["Wapzen", "Free to start, no card", "No: clients see Wapzen", "Runs on each client’s own WhatsApp number with no Business API; reseller terms are arranged with our team on WhatsApp"],
];

const prompt = `You are the WhatsApp assistant of [BUSINESS NAME], a [TYPE OF BUSINESS] in [CITY].
Say in your first message that you are the [BUSINESS NAME] virtual assistant.
Reply in the customer's language, in two or three short sentences, and ask one question at a time.
Answer only from the information you were given: [PRODUCTS OR SERVICES], prices, opening hours ([HOURS]), location, delivery and policies. If something isn't there, say you will check with the team. Never invent prices, discounts or stock.
When someone wants to [ORDER / BOOK], ask for [THE DETAILS TO COLLECT]. Repeat them back and save the request only after the customer says yes. Say the team will confirm on this chat.
When a customer asks for [THE MENU / PRICE LIST / PHOTOS], send the file for it.
Never ask for card numbers, passwords or photos of ID.
Complaints, refunds, payment problems and anything you can't answer: say a member of the team will reply on this chat soon.`;

const pitches = [
  { title: "First message to a local business", when: "One business at a time, to the number it publishes for customers", text: "Hi Sara, I’m Daniel, I set up AI assistants on WhatsApp for local businesses in Lisbon. I can put one on this same number for Bloom Salon: it answers prices, opening hours and booking questions in seconds, day and night, in your customers’ language, and passes anything tricky to you. Could I show you a 5-minute demo built with your own price list?" },
  { title: "Demo invitation", when: "After you load their prices into your demo agent", text: "Here’s the demo I built with your price list: message [your demo number] and ask anything a customer would ask. Try “how much is a haircut and colour?” or send a voice note. It only knows what you’d tell it, and I can change any answer you don’t like." },
  { title: "Proposal", when: "After the demo, when they say yes", text: "Here’s what I’d set up for Bloom Salon:\n• An AI assistant on your current WhatsApp number, live in 2 days\n• Your prices, services and photos, sent when customers ask\n• Booking requests saved and sent to your phone for you to confirm\nSetup: [your price]. Monthly care: [your price], I read the chats every week, fix answers and update your prices.\nThe assistant runs on Wapzen, which is free to start; you pay me for the setup and the care." },
  { title: "Go-live message to the client", when: "The day the assistant goes live", text: "Your assistant is live ✅\n• See every chat on the Conversations page\n• To reply yourself, switch the AI off for that contact, reply, then switch it back on\n• Booking requests appear on the Orders page and on your phone\n• Open WhatsApp on your phone at least once every two weeks so the link stays active\nI’ll check the chats on Friday and send you what I changed." },
  { title: "Monthly report", when: "Once a month, with your care invoice", text: "November for Bloom Salon: the assistant answered 214 chats, saved 38 booking requests and passed 9 chats to you. I added the new winter prices and fixed the answer about parking. Next month: the Christmas opening hours. Anything you want it to say differently?" },
  { title: "Follow-up, once", when: "If a business didn’t answer your first message", text: "Hi Sara, just checking you saw my message about a WhatsApp assistant for Bloom Salon. If now isn’t a good time, no problem, I won’t message again." },
];

export default function WhatsAppChatbotResellerPage() {
  return <PlaybookPost
    href={href}
    heading={<>Become a WhatsApp chatbot reseller.<br /><span>Sell AI agents to businesses as a freelancer.</span></>}
    lead="Every shop, clinic and salon near you gets WhatsApp messages it can’t answer fast enough. This guide shows freelancers how to turn that into a service business: set up a WhatsApp AI agent on Wapzen for each client, on the client’s own number and with no WhatsApp Business API, charge for the setup and the monthly care, and talk to us about reselling Wapzen."
    answer={{
      title: "The short answer",
      body: <>A WhatsApp chatbot reseller is a freelancer or agency that sets up AI chatbots for businesses and is paid for it. With <strong>Wapzen</strong> you don’t have to become a WhatsApp API reseller, buy a white-label panel or wait for Meta’s approval: you link an AI agent to the WhatsApp number the business already uses, write its instructions and knowledge base, and charge a setup fee plus a monthly fee to keep it sharp. Wapzen is <strong>free to start</strong> for your clients, with no card. To resell Wapzen, <a href={partner} target="_blank" rel="noopener noreferrer">message our team on WhatsApp</a>.</>,
      specs: [["Cost to start", "Free, no card"], ["Works on", "Each client’s current WhatsApp number"], ["WhatsApp Business API", "Not needed"], ["Reseller terms", "Arranged with our team on WhatsApp"]],
    }}
    chapters={[
      {
        id: "what",
        title: "What a WhatsApp chatbot reseller does",
        body: <>
          <p>People who sell WhatsApp automation services to businesses usually work in one of three ways:</p>
          <ul>
            <li><strong>WhatsApp API reseller.</strong> You resell a WhatsApp Business API platform, walk each client through Meta’s business verification and message template approval, and the client pays the platform plus Meta’s per-message charges. It suits big senders of broadcasts. Our <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing guide</Link> shows what those charges add up to.</li>
            <li><strong>White-label chatbot reseller.</strong> You pay a yearly fee for a chatbot builder that carries your own brand and domain, then sell sub-accounts to clients at your own price.</li>
            <li><strong>Setup-and-care reseller.</strong> You build and look after the AI agent on a platform the client can see, and charge for your work. This is how reselling Wapzen works today.</li>
          </ul>
          <p>Whatever you call it, a WhatsApp automation agency, an AI automation agency or freelance chatbot work, the client is paying for the same thing: their customers get fast, correct answers on WhatsApp without the owner typing them. The software is the easy part. The value you sell is knowing the business, writing the instructions, loading the right information and fixing answers until they’re right.</p>
          <p>A Wapzen agent isn’t a menu bot that makes customers press 1, 2 or 3. It reads each message the way the customer wrote it, including voice notes and photos, and replies from what you gave it. If you’re new to this, start with <Link href="/blog/what-is-a-whatsapp-chatbot">what a WhatsApp chatbot is</Link>.</p>
        </>,
      },
      {
        id: "why",
        title: "Why WhatsApp AI agents are easy to sell to businesses",
        body: <>
          <ul>
            <li><strong>Every business already has the problem.</strong> The same twenty questions arrive every day, many of them at night or while the owner is with a customer, and slow replies lose sales.</li>
            <li><strong>The demo sells it.</strong> Let the owner message your demo agent loaded with their own price list. A correct answer in a few seconds does more than any slide.</li>
            <li><strong>No API project.</strong> Wapzen links to the client’s number as a device, like WhatsApp Web. There’s no Meta verification, no template approval, no new number and no per-message fee from Meta, and the client keeps using WhatsApp on their phone as before. Our guide to a <Link href="/blog/whatsapp-chatbot-without-business-api">WhatsApp chatbot without the Business API</Link> explains the difference.</li>
            <li><strong>Nothing for the client to pay up front.</strong> Wapzen is free to start, so the client’s only cost is your work. That makes the yes easier.</li>
            <li><strong>It needs care every month.</strong> Prices, menus, offers and opening hours change, so a monthly care fee is easy to explain.</li>
            <li><strong>You don’t need to code.</strong> The skills are writing clear instructions and organising information. Freelancers who can work with APIs can add bookings and CRM lookups through API tools, and charge more for it.</li>
          </ul>
          <InlineCta title="Want to resell Wapzen?" body="Tell us where you work and who your clients are. We’ll talk you through reselling Wapzen on WhatsApp." label="Message us to resell" href={partner} />
        </>,
      },
      {
        id: "jobs",
        title: "Who does what: Wapzen, you and your client",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "Wapzen runs it", note: "The platform and the AI", items: ["The AI model and the servers", "The link to the client’s WhatsApp number", "Replies day and night, in the customer’s language", "Voice notes and photos from customers", "Sending the client’s photos and PDFs", "Saving orders and requests, with WhatsApp alerts", "Answering WhatsApp calls with the voice agent"] },
            { tone: "request", title: "You build and look after it", note: "What the client pays you for", items: ["Finding the client and running the demo", "Writing the agent’s instructions", "Turning price lists, menus and FAQs into a knowledge base", "Uploading photos and documents with notes on when to send them", "Setting up Take Order and the alert number", "Testing it like a real customer", "Reading the chats every week and fixing answers", "API tools for bookings or CRM, if you’re technical"] },
            { tone: "team", title: "The client keeps", note: "Their business, their number", items: ["Their WhatsApp number and Wapzen account", "Confirming orders, bookings and payments", "Replying when the AI hands a chat over", "Sending offers to customers who agreed to get them", "Opening WhatsApp on the phone now and then"] },
          ]} />
          <p><strong>One account per client.</strong> The free start includes one chat agent on one WhatsApp number, so each client gets their own Wapzen account. That also keeps every business’s chats, orders and files apart. Create the account with an email the client controls, so the business owns its account and conversations even if you stop working together. Wapzen has no team seats or agency panel yet, so agree with each client how you’ll sign in for the monthly care. If you’d rather run several agents under one account, ask us about a paid plan when you message us.</p>
        </>,
      },
      {
        id: "offer",
        title: "WhatsApp automation services to offer, and what to charge",
        body: <>
          <p>Sell packages, not hours. Most clients understand three levels and a care plan:</p>
          <RowTable caption="WhatsApp AI agent packages a freelancer can sell" firstColumn="Package" columns={["What you set up", "Best for", "How to charge"]} rows={packages} />
          <p><strong>What others charge.</strong> One agency, TechConcepts, lists €149 setup plus €49 a month before VAT for a WhatsApp and Instagram chatbot with monthly tweaks. In India, Hyperleap’s 2026 cost breakdown puts custom WhatsApp integration work at ₹50,000 to ₹2,00,000 one-time and ₹10,000 to ₹25,000 a month to maintain; that’s custom development on the API, a bigger job than a no-code setup. Prices for your city will be different, so ask two or three local businesses what they would pay before you print a price list.</p>
          <p><strong>A simple way to set your price:</strong> count your real hours. Most of a setup is collecting information, writing instructions and testing, usually an afternoon. Multiply your hours by your hourly rate, then add a little for the value: a salon that books three more clients a week earns more than your fee. Charge the monthly care by the time you’ll spend reading chats and updating information, usually an hour or two a month for a small business.</p>
          <Note>Be open about the platform. Your client can find out that Wapzen is free to start, so don’t sell the software as if it were yours. Sell what they can’t do in an afternoon themselves: the instructions, the knowledge base, the testing and the monthly care. The proposal template below says it plainly.</Note>
        </>,
      },
      {
        id: "sell",
        title: "How to sell AI agents to local businesses",
        body: <>
          <p><strong>Pick one kind of business first.</strong> A niche makes your demo, your instructions and your price list reusable. Good first niches have lots of repeated questions and information that already exists in a fixed form: a menu, a price list, a timetable. Our playbooks show what the agent does in each one: <Link href="/blog/ai-chatbot-for-hotels">hotels</Link>, <Link href="/blog/whatsapp-for-schools">schools</Link>, <Link href="/blog/ai-for-car-dealerships">car dealerships</Link>, <Link href="/blog/whatsapp-chatbot-for-gyms">gyms</Link>, <Link href="/blog/whatsapp-chatbot-for-clinics-india">clinics</Link>, <Link href="/blog/whatsapp-chatbot-real-estate-india">real estate</Link> and <Link href="/blog/whatsapp-food-ordering-system">restaurants that take orders</Link>.</p>
          <p><strong>Build your demo on your own number.</strong> Sign up free, link your own WhatsApp and use your account as the demo. Before each meeting, paste in the prospect’s public prices and opening hours from their website or Google profile, then hand them your phone or your number. Ask to see about twenty of their recent customer messages: they tell you what the agent must answer and give you a realistic quote.</p>
          <p><strong>Contact businesses one at a time.</strong> Don’t paste the same message to hundreds of numbers: your own number is your shop window. Visit in person, call, or write one personal message. If someone says no, don’t message again. Messages you can copy and change:</p>
          <Templates items={pitches} />
          <p>The names, numbers and figures are made up; replace them with yours. For the sales side of the agent itself, read our guide to the <Link href="/blog/whatsapp-ai-sales-agent">WhatsApp AI sales agent</Link>.</p>
        </>,
      },
      {
        id: "setup",
        title: "Client setup in one afternoon",
        body: <>
          <SetupSteps items={[
            { title: "Collect the client’s information", time: "1 hour", body: <>Price list, menu or catalogue, opening hours, delivery areas, policies, the questions they get most, product or room photos and PDFs. Also ask who takes over when the AI hands a chat on, and which phone should get order alerts. Plain text, Word or PDF all work.</> },
            { title: "Create the client’s Wapzen account", time: "5 min", body: <>Sign up free with an email the client controls. No card is needed.</> },
            { title: "Link the client’s WhatsApp number", time: "5 min", body: <>In person, the client scans the QR code on your laptop from WhatsApp › Linked devices › Link a device. Remotely, on a call, the client taps <em>Link with phone number instead</em> and types the 8-character pairing code you read out. The agent starts answering as soon as the number links, so have the instructions from step 4 ready to paste.</> },
            { title: "Paste the instructions", time: "15 min", body: <>Copy the template below, fill in the brackets with the client’s details and paste it into the agent’s prompt.</> },
            { title: "Add knowledge, files and the website", time: "30 min", body: <>Put the price list and FAQ in the <strong>Knowledge Base</strong>. Upload photos, menus and price lists in <strong>Images &amp; Files</strong>, each with a note such as “send when someone asks for the menu”. Add the client’s website on the <strong>Web Search</strong> card.</> },
            { title: "Switch on Take Order and alerts", time: "10 min", body: <>Write what an order or booking request needs, and add the staff phone under order alerts, so every new or changed order reaches it on WhatsApp. Read more in the <Link href="/blog/whatsapp-order-taking-chatbot">order-taking chatbot guide</Link>.</> },
            { title: "Test it like a customer, with the client watching", time: "30 min", body: <>From another phone: ask in another language, send a voice note and a photo, ask for a discount, place an order and complain. Fix the instructions wherever an answer is wrong. Then show the client the Conversations page and the AI switch for each contact.</> },
          ]} />
          <PromptFile name="client-assistant-instructions.txt" text={prompt} />
          <p>Keep a filled-in copy for each client. When you sign your second salon or restaurant, most of the work is already done. For more examples, read <Link href="/blog/whatsapp-business-greeting-message">WhatsApp greeting messages</Link>.</p>
        </>,
      },
      {
        id: "care",
        title: "Monthly care: the part clients keep paying for",
        body: <>
          <p>A setup fee is paid once. Care is what turns one client into steady income, and it’s also what makes the agent good. Each month:</p>
          <ul>
            <li><strong>Read the conversations.</strong> Look for wrong answers, questions the agent couldn’t answer and chats it passed to the team. Each one is a line to add or fix.</li>
            <li><strong>Update the information.</strong> New prices, seasonal menus, holidays, offers, products that sold out.</li>
            <li><strong>Count the results.</strong> Wapzen has no chat report page yet, so count from the Conversations and Orders pages and send a short report like the template above.</li>
            <li><strong>Check the link.</strong> WhatsApp logs out linked devices when the phone itself isn’t used for about 14 days, and a number can have at most four linked devices. If the agent stops replying, link the number again.</li>
            <li><strong>Suggest the next step.</strong> A new file to send, booking requests through Take Order, an API tool to the client’s booking system, or the voice agent below.</li>
          </ul>
        </>,
      },
      {
        id: "voice",
        title: "Upsell: an AI voice agent for WhatsApp calls",
        body: <>
          <p>Many customers call a business’s WhatsApp number instead of typing, and those calls ring while the owner is busy. Answering them is an easy upgrade to sell.</p>
          <VoiceCard
            title="Turn on the voice agent for a client"
            body="Wapzen’s voice agent picks up WhatsApp calls to your client’s number in a natural voice and answers from the same information as the chat agent."
            points={["Answers WhatsApp calls day and night", "Speaks the language you set for it", "Calls leads back over WhatsApp in calling campaigns", "Saves every call’s transcript"]}
            href={voiceAccess}
            label="Turn on the voice agent"
          />
          <p>Message our team on WhatsApp and we’ll switch the voice agent on for your client’s number. It works on WhatsApp calls only: it doesn’t dial regular phone numbers, and it can’t transfer a live call to a person.</p>
        </>,
      },
      {
        id: "rules",
        title: "Rules that protect you and your clients",
        body: <>
          <ul>
            <li><strong>Say what it is.</strong> Tell clients the agent runs on Wapzen and that Wapzen isn’t an official WhatsApp or Meta product. WhatsApp’s own terms still apply to their number.</li>
            <li><strong>The agent answers; it doesn’t broadcast.</strong> It replies to people who message the business and never starts chats on its own. Offers and reminders come from the client, sent only to customers who gave their number and agreed to hear from them, as <a href="https://business.whatsapp.com/policy" target="_blank" rel="nofollow noopener noreferrer">WhatsApp’s Business Messaging Policy</a> asks.</li>
              <li><strong>Keep secrets out.</strong> Door codes, staff numbers, supplier prices and anything private stay out of the knowledge base, because the agent may tell anyone who asks.</li>
            <li><strong>Plan the handover.</strong> Decide with the client which chats the AI passes on and who answers them. Our <Link href="/privacy">privacy policy</Link> explains what Wapzen stores and how to delete it.</li>
            <li><strong>AI makes mistakes.</strong> Clear instructions and weekly reading keep them rare. Never let the agent decide refunds, medical or legal questions.</li>
          </ul>
        </>,
      },
      {
        id: "compare",
        title: "White label WhatsApp chatbot programs vs reselling Wapzen",
        body: <>
          <RowTable caption="Reseller and white-label chatbot programs compared, checked 17 November 2026" firstColumn="Program" columns={["Cost to you", "White label", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p><strong>Choose a white-label platform</strong> if your own brand on the dashboard matters more than your margin, or if you sell to many clients who need one inbox across WhatsApp, Instagram and web chat. <strong>Choose Wapzen</strong> if you want to start this week with no fee of your own, put AI agents on the numbers your clients already use, and sell your service rather than a panel.</p>
          <p>Platforms built on the WhatsApp Business API also pass Meta’s charges to your clients: template messages, and since 1 October 2026 service replies beyond the first 1,000 a month per number. Wapzen doesn’t use the API, so there’s nothing from Meta on top.</p>
        </>,
      },
    ]}
    faq={[
      { q: "What is a WhatsApp chatbot reseller?", a: "A freelancer or agency that sets up WhatsApp chatbots or AI agents for businesses and is paid for it, either by reselling a platform’s plans or by charging for setup and monthly care. With Wapzen you set up an AI agent on each client’s own WhatsApp number and charge for your work." },
      { q: "How do I become a Wapzen reseller?", a: "Message the Wapzen team on WhatsApp and tell us where you work and who your clients are; we arrange reselling with you there. Meanwhile you can sign up free and build your demo agent on your own number." },
      { q: "Do I need to become a WhatsApp Business API reseller?", a: "Not to resell Wapzen. Wapzen links to the client’s existing WhatsApp or WhatsApp Business app number as a device, like WhatsApp Web, so there is no Meta verification, no message templates and no per-message fee from Meta." },
      { q: "Is Wapzen a white label WhatsApp chatbot?", a: "No. Your clients see the Wapzen name in the dashboard. You sell your service under your own name: the instructions, the knowledge base, the testing and the monthly care." },
      { q: "How much should I charge a business for a WhatsApp chatbot?", a: "Price by your real hours plus the value to the client, as a setup fee and a monthly care fee. As examples, one agency lists €149 setup plus €49 a month before VAT, and custom WhatsApp integration work in India runs from ₹50,000 one-time with ₹10,000 or more a month to maintain. Ask local businesses what they would pay before you fix prices." },
      { q: "Can I manage several clients from one Wapzen account?", a: "The free start includes one chat agent on one WhatsApp number per account, so each client gets an account of their own, created with an email the client controls. That also keeps each business’s chats and orders apart. For several agents under one account, ask the Wapzen team about a paid plan." },
      { q: "Can I set up a client’s WhatsApp remotely?", a: "Yes. On a call, the client opens WhatsApp › Linked devices › Link a device › Link with phone number instead and types the pairing code shown in Wapzen. Everything else, the instructions, knowledge base and files, you do from your own computer." },
      { q: "Does the client need the WhatsApp Business app?", a: "No. Wapzen works with WhatsApp Business app numbers and with personal WhatsApp numbers, and the client keeps using WhatsApp on their phone while the agent replies." },
      { q: "Which businesses buy WhatsApp AI agents?", a: "Businesses that get the same questions every day and have their information in a fixed form: restaurants and cloud kitchens, salons, clinics, gyms, hotels and guest houses, schools and tutors, real estate agents, car dealers and online shops." },
      { q: "Can I start a WhatsApp AI automation agency with no money?", a: "You can start with no software cost: Wapzen is free to start, with no card, for you and your clients. What you need is time to build a good demo and to learn each client’s business. Coding is optional; it lets you add API tools for bookings and CRM lookups." },
      { q: "Can the agent send broadcasts or bulk messages for my clients?", a: "No. The chat agent answers people who message the business; it doesn’t send broadcasts, bulk messages or automatic follow-ups. For large broadcasts to opted-in customers, the WhatsApp Business API through a provider is the right tool." },
    ]}
    sources={[
      { label: "BotPenguin: partner programs", href: "https://botpenguin.com/partners" },
      { label: "Robofy: white-label reseller plans", href: "https://www.robofy.ai/reseller-plan-ai-chatbot" },
      { label: "Wassenger: reseller program", href: "https://wassenger.com/blog/en/start-a-side-business-introducing-the-wassenger-reseller-program" },
      { label: "TechConcepts: WhatsApp & Instagram chatbot price", href: "https://techconcepts.org/local/whatsapp-instagram-chatbot" },
      { label: "Hyperleap: WhatsApp chatbot pricing in India 2026", href: "https://hyperleap.ai/blog/whatsapp-chatbot-pricing-india-2026" },
      { label: "Meta for Developers: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
      { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
    ]}
    related={["/blog/whatsapp-ai-sales-agent", "/blog/whatsapp-chatbot-without-business-api"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Start your WhatsApp AI agency this week.<br /><span>Message us to resell Wapzen.</span></>, body: "Tell us where you work and who your clients are. Meanwhile, sign up free and build your demo agent on your own WhatsApp number." }}
    action={{ href: partner, label: "Message us to resell" }}
  />;
}
