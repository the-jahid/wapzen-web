import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topic from the voice industry harvest (2026-11-16, docs/seo-research.md, "Voice agent industry
// posts", docs/seo-blog-voice-industries-research.mjs, US/IN/GB x Google/YouTube/DuckDuckGo,
// scores out of 9 sources). Salons (621): "ai receptionist for salon" 80 (5/9), "ai receptionist
// for hair salon" 76 (6/9), "ai receptionist for nail salon" 51 (6/9), "ai receptionist for
// beauty salon" 51, "ai receptionist for med spa" 41 (6/9), "ai receptionist for salons" 40,
// "ai voice agent for salons" 30, "phone answering system for salon" 30, plus WhatsApp phrases
// "whatsapp api for salon", "salon whatsapp marketing". Trades scored higher (849) but has almost
// no WhatsApp demand, so salons were picked for fit.
// Competitor facts read 2026-11-16 from their own pages: Smith.ai AI receptionist Free (25 calls,
// $3 each after), Pro $150/month (75 calls); My AI Front Desk $99/month ($79 billed yearly) for
// 200 minutes, then 25 credits ($0.25) a minute; Zenoti's AI Receptionist answers missed and
// after-hours calls 24/7 and books into the Zenoti calendar, no price shown; Booksy's blog (29
// Oct 2026) shows a "Booksy AI Receptionist" that books into the Booksy calendar, no price. None
// mentions WhatsApp. Fresha's AI price was only in third-party posts, so it isn't cited.
// Voice limits: WhatsApp calls only, no live transfer, ~1-2 s pause, no salon calendar of its own
// (API tool or staff confirm), can't check whether a deposit was paid, campaign leads carry only
// name/number/email (rebooking calls are generic). Med spas: front desk only, no medical advice.
// Voice described as working (user rule 2026-11-15), switched on over WhatsApp. "Free to start".
const href = "/blog/ai-receptionist-for-salons";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like the Wapzen AI voice agent to answer WhatsApp calls for my salon.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const handles = [
  ["“How much is a balayage?”", "Yes", "From your price list, with “from” prices and a consultation where the price varies"],
  ["“How long does a gel manicure take?”", "Yes", "From the service times you list"],
  ["“Who does men’s fades on Saturdays?”", "Yes", "From the stylists, barbers and days you list"],
  ["“Are you open late on Thursday?”", "Yes", "From your opening hours; it knows today’s date and time"],
  ["“Can I book a cut and colour with Ana next week?”", "Yes", "Takes the request; books through an API tool or your team confirms"],
  ["“Can you fit me in today?”", "Partly", "It can’t see your diary without an API tool, so the team confirms"],
  ["“I need to cancel tomorrow’s appointment”", "Yes", "Takes the request and explains your cancellation policy"],
  ["“Do I need a patch test?”", "Yes", "Explains your patch test rule exactly as you wrote it"],
  ["“Is Botox safe for me?”", "No", "Medical questions go to your practitioner, who calls back"],
  ["“I’m unhappy with my colour”", "Hands over", "Apologises, notes the details and says the manager will call back"],
];

const turns = [
  { from: "patient" as const, text: "Hi, how much is a cut and colour? And can I come on Saturday?" },
  { from: "agent" as const, text: "Hi, you’re through to Demo Salon’s virtual assistant. A cut and full colour is from $120, depending on hair length. Saturday we’re open 9 to 5. Do you have a stylist in mind?" },
  { from: "patient" as const, text: "Ana did my hair last time. Morning if possible. I’m Leila." },
  { from: "agent" as const, text: "Ana works Saturdays. Have you had a colour with us in the last six months? If not, we need a quick patch test 48 hours before." },
  { from: "patient" as const, text: "Yes, in the summer." },
  { from: "agent" as const, text: "Great. So that’s a cut and colour with Ana, Saturday morning, for Leila. We take a $20 deposit to hold the slot. Shall I send the request?" },
  { from: "patient" as const, text: "Yes please." },
  { from: "agent" as const, text: "Done. The team will confirm the exact time on WhatsApp, and I’ve sent you the deposit link. See you Saturday!" },
];

const prompt = `You are the virtual assistant that answers WhatsApp calls for Demo Salon, a hair and beauty salon.
Say at the start of each call that you are a virtual assistant.
Speak warmly, in short sentences, and ask one question at a time. This is a phone call: never read out the whole price list; give the price asked for and offer to send the list by WhatsApp.
Answer only from the services, prices, durations, stylists, opening hours and policies you were given. For services priced by hair length or condition, give the "from" price and say the stylist confirms it. Never invent prices, offers or availability.
Booking requests: ask for the service, the stylist if they have one, the day and time that suit them and their name. For colour, ask whether they had a colour with us in the last six months and explain the patch test rule if not. Repeat the request back, mention the deposit, send the request only after the caller says yes, and say the team will confirm the time on WhatsApp. Never say a slot is free.
When the caller agrees to a booking, send the deposit link. When they ask for prices or directions, send the price list or the map pin.
Cancellations: explain the cancellation policy and take the request. Don't argue about fees.
Complaints, refunds, allergies or skin reactions, and anything medical: apologise, note the details and say the manager will call back.`;

const compare = [
  ["Which calls it answers", "Calls to your salon’s phone line", "WhatsApp calls to the number your clients already message"],
  ["Price, from their own pages", "Smith.ai: free for 25 calls, Pro from $150 a month. My AI Front Desk: $99 a month for 200 minutes. Zenoti and Booksy: no price shown", "Free to start, no card, and no per-minute fees"],
  ["Booking", "Zenoti and Booksy book into their own calendars", "Takes the request; books through an API tool or your team confirms"],
  ["Deposits", "Handled by the booking software", "Sends your deposit link by WhatsApp; your team checks payment"],
  ["Written follow-up", "SMS and text links", "WhatsApp messages in the same chat, during the call"],
];

const fit = [
  ["Hair or beauty salon whose clients call and message on WhatsApp", "Yes", "Answers the calls you miss while your hands are in someone’s hair"],
  ["Barbershop or nail bar with walk-ins and regulars", "Yes", "Answers prices, services and opening hours while you cut"],
  ["Solo stylist, lash or brow artist working alone", "Yes", "Takes booking requests while you work"],
  ["Day spa or med spa", "Yes, for the front desk", "Treatments, prices and consultations; medical questions go to your practitioner"],
  ["Salon that wants calls booked straight into its software with no setup", "Not out of the box", "Needs an API tool, or your booking software’s own AI receptionist"],
  ["Salon that gets most calls on a landline", "Not by itself", "It only answers WhatsApp calls"],
];

const sources = [
  { label: "Smith.ai: AI receptionist pricing", href: "https://smith.ai/pricing/ai-receptionist" },
  { label: "My AI Front Desk: pricing", href: "https://www.myaifrontdesk.com/pricing" },
  { label: "Zenoti: AI Receptionist", href: "https://www.zenoti.com/ai-receptionist" },
  { label: "Booksy: AI receptionist for hair salons (29 October 2026)", href: "https://biz.booksy.com/blog/ai-receptionist-for-hair-salons" },
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
];

const questions = [
  {
    id: "what",
    q: "What is an AI receptionist for salons?",
    answer: "An AI receptionist for salons is a voice agent that answers your salon’s calls while you’re with a client: prices, service times, stylists, opening hours, booking and cancellation requests, deposits and patch tests. Wapzen’s version answers WhatsApp calls on the number your clients already message, and it’s free to start.",
    body: <>
      <p>Your hands are full of foils, the phone rings, and you can’t answer. The client who called books somewhere else. An <strong>AI receptionist for hair salons, nail salons, barbers and spas</strong> picks up instead, answers from your own price list and rules, and takes the booking request for your team to confirm.</p>
      <p>Most salon AI receptionists answer your phone line. <strong>Wapzen</strong> answers <strong>WhatsApp calls</strong>: it links your salon’s WhatsApp number as a device, so the AI voice agent picks up calls to that number while your phone keeps working. There’s no WhatsApp Business API to set up, and it’s free to start, with no credit card.</p>
      <p>The same number can run an AI chat agent too, which answers messages and sends your price list and photos of your work. To see how the chat side works, read <Link href="/blog/whatsapp-appointment-booking">WhatsApp appointment booking</Link>.</p>
    </>,
  },
  {
    id: "why-whatsapp",
    q: "Why should a salon answer WhatsApp calls?",
    answer: "Because many clients book their hair, nails and beauty treatments on WhatsApp. They find you on Instagram or Google and tap the WhatsApp button, the call is free over data, and the booking, deposit link and directions arrive in the same chat. It doesn’t answer landline calls, so it suits salons whose clients already call on WhatsApp.",
    body: <>
      <ul>
        <li><strong>Your clients are already there.</strong> In India, Brazil, Mexico, the Middle East, the UK and much of Europe and Africa, many salons put their WhatsApp number on Instagram and Google.</li>
        <li><strong>The call and the booking share a chat.</strong> The price list, the deposit link and the confirmed time all arrive in WhatsApp.</li>
        <li><strong>No per-minute cost.</strong> WhatsApp calls run over the internet.</li>
        <li><strong>You don’t stop mid-service.</strong> The agent answers while you finish the client in the chair.</li>
      </ul>
      <p>The limit: Wapzen answers WhatsApp calls only. If most clients ring your landline, your booking software’s AI receptionist or a phone-line product suits you better.</p>
    </>,
  },
  {
    id: "handles",
    q: "What can a salon AI receptionist answer?",
    answer: "Most of the calls your front desk takes: prices and “from” prices, how long each service takes, which stylist or barber does what and when, opening hours, booking, reschedule and cancellation requests, deposit and cancellation policies and patch test rules. Medical, complaint and refund calls go to you. It can’t see your diary without an API tool.",
    body: <>
      <Comparison caption="How a WhatsApp AI receptionist handles everyday salon calls" columns={["Does it handle it?", "How"]} rows={handles} />
      <p>The agent answers from what you upload as text, PDF or Word. Write prices per service, with durations, and say which ones need a consultation. If a service isn’t listed, it says so instead of guessing.</p>
    </>,
  },
  {
    id: "booking",
    q: "Can an AI receptionist book salon appointments?",
    answer: "It takes the booking request, reads it back and confirms. The agent asks for the service, stylist, day and time and the client’s name, repeats them and sends the request after a yes. With an API tool it can book in your salon software; without one, your team confirms the time on WhatsApp. Wapzen has no salon diary of its own.",
    body: <>
      <p>Here’s how a booking call could go at a made-up salon:</p>
      <ChatExample
        business="Demo Salon"
        labels={{ subtitle: "WhatsApp call · AI voice agent", agent: "AI agent: ", patient: "Caller: " }}
        turns={turns}
        caption="An illustrative call transcript for a made-up salon. The prices, stylist days and policies come from the information the salon gave the agent."
        points={[
          { title: "Quotes your price", body: "A “from” price, because colour depends on hair length, as the salon wrote." },
          { title: "Checks the patch test", body: "It asks the question you told it to ask before booking colour." },
          { title: "Mentions the deposit", body: "And sends your deposit link by WhatsApp once the caller agrees." },
          { title: "Never promises the slot", body: "Without a diary tool it can’t see free times, so the team confirms." },
        ]}
      />
      <p>Booking platforms such as Zenoti and Booksy now offer their own AI receptionists that book straight into their calendars on phone calls. If your salon software has a public API, someone technical can connect it to Wapzen as an API tool instead, so the agent checks real free times on WhatsApp calls.</p>
    </>,
  },
  {
    id: "no-shows",
    q: "Can it cut no-shows and take deposits?",
    answer: "It helps. The agent explains your deposit and cancellation policy on every booking call and sends your deposit link by WhatsApp during the call, so the client can pay before hanging up. It can’t check whether the deposit was paid; your team does. It doesn’t send appointment reminders by itself; your booking software or your team sends those.",
    body: <>
      <ul>
        <li><strong>Say the policy every time.</strong> “We take a $20 deposit, refundable with 24 hours’ notice” is easy for the agent to repeat.</li>
        <li><strong>One link, sent at the right moment.</strong> Set up a message with your deposit or payment link and tell the agent to send it once the caller agrees to book.</li>
        <li><strong>Reminders come from elsewhere.</strong> Keep using your booking software’s reminders, or send them yourself on WhatsApp.</li>
      </ul>
    </>,
  },
  {
    id: "rebooking",
    q: "Can it call clients to rebook?",
    answer: "Yes, with a general message. Add clients who agreed to hear from you to an outbound calling campaign, and the agent calls each one on WhatsApp, says it’s the salon’s virtual assistant, mentions this week’s openings or an offer, and takes a booking request. Each client carries only a name, number and email, so it can’t mention their last visit or service.",
    body: <>
      <p>“It’s been a while since we saw you, and Ana has openings this week” works. “Your roots are due six weeks after your 3 October colour” doesn’t, because the campaign doesn’t hold each client’s history.</p>
      <ul>
        <li><strong>Only clients who opted in.</strong> WhatsApp restricts numbers that make unwanted calls, and nobody likes a cold call from their salon.</li>
        <li><strong>Add clients one by one or by API.</strong> There’s no CSV import, and no automatic redial.</li>
        <li><strong>Every call has a transcript,</strong> so you can see who asked to book.</li>
      </ul>
    </>,
  },
  {
    id: "med-spa",
    q: "Can a med spa use an AI receptionist?",
    answer: "Yes, for front-desk calls: treatment menus, prices, opening hours, consultation requests and aftercare instructions you write. It must not give medical advice about injectables, laser or skin treatments, or say a treatment is suitable for someone. Health questions, reactions and contraindications go to your practitioner, who calls back.",
    body: <>
      <p>Tell the agent which treatments need a consultation first, and have it book the consultation rather than the treatment. Don’t let it ask about medical history on the call; your practitioner does that in person. Rules for aesthetic treatments differ by country, so check what applies to you.</p>
      <Note>Wapzen doesn’t sign HIPAA business associate agreements. A US med spa that handles protected health information should ask its compliance adviser before using any AI on calls.</Note>
    </>,
  },
  {
    id: "send",
    q: "Can it send the price list or directions during the call?",
    answer: "Yes. With a send-message tool, the voice agent sends a WhatsApp message to the caller while the call is still going: your price list link, a Google Maps pin, your Instagram portfolio, a deposit link or a summary of the booking request. On chat, the chat agent can also send photos of your work and your price list as an image or PDF.",
    body: <>
      <p>A caller who asks “how much are your nails?” doesn’t want thirty prices read out. The agent gives the one they asked about and says “I’ve sent you our full price list on WhatsApp.” Set up one message per job and say in the instructions when to send each.</p>
    </>,
  },
  {
    id: "instructions",
    q: "What should a salon AI receptionist’s instructions say?",
    answer: "Who it is and that it’s a virtual assistant, to speak warmly and briefly, to answer only from your services, prices and stylists, how to take a booking request and read it back, your patch test, deposit and cancellation rules, what never to promise (free slots, medical safety), when to send links, and when the manager calls back.",
    body: <>
      <p>These instructions are for a made-up salon. Change them to yours:</p>
      <pre>{prompt}</pre>
      <ul>
        <li><strong>Keep answers short.</strong> There’s a pause of about one to two seconds before each answer, so long replies make a call feel slow.</li>
        <li><strong>Test it like a tricky client.</strong> Ask for a discount, ask for a stylist on her day off, mention a reaction to hair dye, and read each transcript.</li>
      </ul>
      <InlineCta href={voiceAccess} title="Answer every WhatsApp call to your salon" body="Free to start, no card. Message our team on WhatsApp and we’ll switch the voice agent on for your number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "compare",
    q: "How does it compare with other salon AI receptionists?",
    answer: "Booking software such as Zenoti and Booksy offer AI receptionists that book into their own calendars on phone calls, with no price shown on their pages. General ones such as Smith.ai and My AI Front Desk charge by call or minute. None of them mentions WhatsApp. Wapzen answers WhatsApp calls on your number, is free to start and books through a tool or your team.",
    body: <>
      <Comparison caption="Salon AI receptionists compared with Wapzen’s WhatsApp voice agent" columns={["Phone-line AI (Zenoti, Booksy, Smith.ai, My AI Front Desk)", "Wapzen"]} rows={compare} />
      <p>Choose your booking software’s AI receptionist if you already use that software, most clients ring your phone line, and you want bookings in your diary automatically. Choose Wapzen if your clients call and message you on WhatsApp and you want those calls answered today without a monthly fee. They can run side by side.</p>
    </>,
  },
  {
    id: "cost",
    q: "How much does an AI receptionist for a salon cost?",
    answer: "Wapzen is free to start, with no card and no per-minute fees, because calls run over WhatsApp. Smith.ai’s AI receptionist is free for 25 calls a month, then $3 a call, or from $150 a month on Pro. My AI Front Desk is $99 a month for 200 minutes, then $0.25 a minute. Zenoti and Booksy don’t show a price.",
    body: <>
      <ul>
        <li><strong>Wapzen:</strong> free to start on your current number. Salons that need more can arrange a paid plan with our team on WhatsApp.</li>
        <li><strong>Smith.ai:</strong> free for 25 calls a month, then $3 a call; Pro from $150 a month for 75 calls.</li>
        <li><strong>My AI Front Desk:</strong> $99 a month, or $79 billed yearly, for 200 minutes, then $0.25 a minute.</li>
        <li><strong>Zenoti and Booksy:</strong> no price on their AI receptionist pages; it comes with their software.</li>
      </ul>
      <p>Prices were read from each vendor’s page on 16 November 2026. Check them before you compare.</p>
    </>,
  },
  {
    id: "setup",
    q: "How do I set up an AI receptionist for my salon on WhatsApp?",
    answer: "Sign up free and link your salon’s WhatsApp number with a pairing code or QR code. Message our team on WhatsApp to switch the voice agent on. Write its instructions, upload your services, prices, durations, stylists, hours and policies, add messages with your price list, map and deposit links, and test it with calls from another phone.",
    body: <>
      <ol>
        <li><strong>Sign up free.</strong> No card and no API key.</li>
        <li><strong>Link the number.</strong> In WhatsApp: Linked devices › Link a device › Link with phone number instead, and enter the code. On a computer you can scan the QR code.</li>
        <li><strong>Switch on voice.</strong> <a href={voiceAccess} target="_blank" rel="noopener noreferrer">Message our team on WhatsApp</a> and we’ll set up the voice agent for your number.</li>
        <li><strong>Upload what it reads:</strong> services with prices and durations, stylists and their days, opening hours, and your deposit, cancellation and patch test rules.</li>
        <li><strong>Add tools:</strong> messages with your price list, map pin and deposit link, and an API tool to your booking software if it has one.</li>
        <li><strong>Tell clients to call on WhatsApp.</strong> Put your WhatsApp number on Instagram and Google. Our free <Link href="/tools/whatsapp-link-generator">WhatsApp link generator</Link> makes a link that opens your chat.</li>
        <li><strong>Test it between clients.</strong> Call from another phone, book, cancel, ask for a discount, and read the transcripts.</li>
      </ol>
    </>,
  },
  {
    id: "not-do",
    q: "What doesn’t a WhatsApp AI receptionist for salons do?",
    answer: "It doesn’t answer landline calls, transfer a live call, see your diary or check payments unless an API tool connects them, send appointment reminders by itself, or give medical advice. It pauses briefly before each answer. It isn’t Meta’s official API, so it should only call clients who agreed to hear from you.",
    body: <>
      <Comparison caption="Which salons and spas a WhatsApp AI receptionist suits" columns={["Good fit?", "Why"]} rows={fit} />
      <ul>
        <li><strong>It works on your current number,</strong> personal or WhatsApp Business, as a linked device.</li>
        <li>Wapzen is an independent product, not made by Meta or WhatsApp.</li>
      </ul>
    </>,
  },
];

export default function AiReceptionistForSalonsPage() {
  return <QaPost
    href={href}
    heading={<>AI receptionist for salons and spas.<br /><span>Answer every WhatsApp call, even mid-colour.</span></>}
    lead="Clients who can’t get through book somewhere else. Here are 13 questions salon, barber, nail and spa owners ask before handing calls to AI: what a salon AI receptionist answers, how it takes booking requests, deposits and patch tests, rebooking calls, med spa limits, how it compares with Zenoti, Booksy, Smith.ai and My AI Front Desk, what it costs and how to set it up."
    verdict={{
      title: "The short answer",
      body: <>An AI receptionist answers your salon’s calls from your own price list, stylists and rules. With <strong>Wapzen</strong> it answers <strong>WhatsApp calls</strong> on the number your clients already use: it quotes prices, takes booking requests for your team to confirm, explains deposits and patch tests and sends your price list and deposit link by WhatsApp during the call. It can’t see your diary without a tool or transfer live calls. <strong>It’s free to start</strong>, with no per-minute fees.</>,
    }}
    facts={[["Price", "Free to start, no card"], ["Calls it answers", "WhatsApp calls to your number"], ["Bookings", "Requests read back, then confirmed"], ["Deposits", "Link sent during the call"]]}
    indexTitle="The 13 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/whatsapp-appointment-booking", "/blog/ai-phone-answering-for-restaurants"]}
    product="/ai-receptionist"
    cta={{ heading: <>Book clients while you work.<br /><span>Free to start, with no per-minute fees.</span></>, body: "Message our team on WhatsApp and we’ll switch the AI voice agent on for your salon’s number." }}
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
  />;
}
