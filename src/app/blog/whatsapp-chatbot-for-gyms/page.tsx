import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topic from the gym harvest (2026-11-14, docs/seo-research.md, "Gym post",
// docs/seo-blog-gym-research.mjs, Google + YouTube + DuckDuckGo in the US, India and the UK,
// scores out of 9 sources): "ai for gyms" 60 (6/9), "fitness chatbot" 60 (6/9), "gym
// automation" 60 (6/9), "ai receptionist for gyms" 57, "gym lead generation" 54 (6/9), "ai
// automation for gyms" 51 (6/9), "gym chatbot" / "ai chatbot for gym" 30, plus message
// phrases: "follow up message for gym inquiry", "gym membership renewal message (sample)",
// "gym fee reminder message", "gym welcome message", "gym whatsapp group". No other post
// covers gyms. Page-one results (checked 2026-11-14) are vendor pages: Zenoti, Glofox, ABC
// Fitness (Replify), My AI Front Desk, Pabbly, Aurora Inbox.
// Competitor facts, read 2026-11-14: Glofox AI agents and ABC Fitness's Replify list phone,
// SMS, email and web chat; Zenoti's AI Receptionist is phone-first plus text and web chat. None
// of the three pages mentions WhatsApp or lists a price. Gymdesk's post refused the fetch (403),
// so it isn't cited.
// Honesty rules for this post: the chat agent only replies when someone writes, so it does NOT
// send renewal reminders or follow-ups by itself; the post gives samples the owner sends. Wapzen
// has no class calendar: Take Order acts as a trial-request form (built for product orders, so
// the post says to test it) and staff confirm the slot. It can't see billing or a live
// schedule. Copy says "fully free" at the user's request (2026-11-14, as in the India posts), despite
// the server's free trial (FREE_TRIAL_REPLIES); never "unlimited" or "free forever";
// no reply-limit and no ban wording, at the user's request. Voice is described as working, with
// a WhatsApp CTA, as in the other posts. Groups: off by default, replies when tagged or replied to.
const href = "/blog/whatsapp-chatbot-for-gyms";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my gym's WhatsApp number.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const handles = [
  ["“How much is a monthly membership?”", "Yes", "From the price list you give it"],
  ["“What time do you open on Sunday?”", "Yes", "From your opening hours"],
  ["“Send me the class timetable”", "Yes", "Sends the timetable image or PDF you uploaded"],
  ["A voice note asking about parking and showers", "Yes", "Transcribes it and answers from your gym’s details"],
  ["“Can I try a class first?”", "Yes", "Takes a trial request for your front desk to confirm"],
  ["“How much is personal training?”", "Yes", "From the trainers and packages you list"],
  ["“Is there a student discount?”", "Partly", "Offers only the discounts you wrote; anything else goes to you"],
  ["“I want to freeze my membership”", "Hands over", "Explains your rules and says a team member will reply"],
  ["“Is the 6 pm class full?”", "No", "It can’t see your live booking system without an API tool"],
  ["“My card was charged twice”", "No", "It can’t see billing: your team checks it"],
];

const turns = [
  { from: "patient" as const, text: "Hi, how much is membership? I’m mostly free in the evenings" },
  { from: "agent" as const, text: "Hi, I’m Demo Fitness Club’s virtual assistant. Membership is $45 a month or $450 for a year, and every group class is included. Evening classes run from 6 to 8 pm on weekdays. Would you like to try a free class first?" },
  { from: "patient" as const, text: "Yes please, what’s on this week?" },
  { from: "agent" as const, text: "📷 This week’s class timetable" },
  { from: "agent" as const, text: "Good evening picks for a first visit are HIIT on Tuesday at 6 pm and Yoga on Thursday at 7 pm. Which would you like?" },
  { from: "patient" as const, text: "HIIT on Tuesday. I’m Sam" },
  { from: "agent" as const, text: "Please check: a free trial class, HIIT, Tuesday at 6 pm, for Sam. Shall I send the request to our front desk?" },
  { from: "patient" as const, text: "Yes" },
  { from: "agent" as const, text: "Done, your trial request is in. Our front desk will confirm your spot on this chat. Bring a towel and water, and arrive 10 minutes early." },
];

const prompt = `You are the virtual assistant of Demo Fitness Club, a gym with group classes and personal training.
Say in your first message that you are a virtual assistant.
Reply in the person's language. Use two or three short sentences and ask one question at a time.
Use only the memberships, prices, offers, opening hours, classes and trainers you were given. If something isn't listed, say so. Never invent prices, discounts or class times.
When someone asks about joining, ask what they want to train for and when they're free, then suggest a membership and one or two classes that fit.
When someone asks for the timetable, send the timetable from your files.
Offer every new visitor one free trial class. To take a trial request, ask for their name, the class and the day. Repeat it back and send the request only after they confirm. Say the front desk will confirm the spot. Never say a class has space.
Don't give medical, injury or diet advice. If someone mentions an injury, a health condition or pregnancy, say a trainer will reply and suggest they check with their doctor before starting.
For freezing or cancelling a membership, billing questions, complaints and anything you can't answer, explain the written rules if you have them and say a team member will reply on this chat. Don't try to talk anyone out of cancelling.`;

const followUps = [
  { title: "Enquiry follow-up, the next day", text: "Hi Sam, thanks for asking about membership yesterday. Would you like to try a free class this week? Tuesday’s 6 pm HIIT still has room." },
  { title: "After a trial class", text: "Hi Sam, great to see you at HIIT on Tuesday! If you join this week, your first month is $35 instead of $45. Want me to send the details?" },
  { title: "Welcome message for a new member", text: "Welcome to Demo Fitness Club, Ana! Your first session with Coach Lee is Saturday at 9 am. Reply here any time with questions about classes or timings." },
  { title: "Membership renewal message", text: "Hi Priya, your membership ends on Friday. Renew for 12 months before then and it’s $450 instead of $540. Reply YES and we’ll send the payment link." },
  { title: "Fee reminder message", text: "Hi Tom, a friendly reminder that this month’s fee of $45 is due on the 5th. You can pay at the desk or with the link we sent. Thank you!" },
  { title: "Member who stopped coming", text: "Hi Raj, we haven’t seen you in a few weeks. Is everything OK? Our new beginner strength class on Mondays at 7 pm could be a nice restart." },
];

const compare = [
  ["Channels", "Phone, SMS, email and web chat, by their own pages (Zenoti is phone-first); WhatsApp isn’t mentioned", "WhatsApp chats and WhatsApp calls on the number you already use"],
  ["Gym software", "Built to work with their own management software; some connect to other CRMs", "Works without gym software"],
  ["Trial and tour bookings", "Books into the live schedule", "Takes the request; your front desk confirms the slot"],
  ["Lead follow-up", "Follows up by phone, text and email", "You follow up; the agent carries on the chat"],
  ["Price", "Not listed on their pages: demo or sales call", "Fully free, no card"],
];

const fit = [
  ["Independent gym that gets enquiries on WhatsApp", "Yes", "Answers prices, timings and trials while your staff train members"],
  ["Yoga, pilates, dance or martial arts studio", "Yes", "Sends the timetable and takes trial requests"],
  ["Personal trainer who works alone", "Yes", "Replies while you’re with a client"],
  ["CrossFit box or boutique studio with a booking app", "Yes, for enquiries", "Answers questions and sends people to your app to book"],
  ["Gym that wants AI to book straight into its schedule and handle billing", "Not by itself", "Needs an API tool to your system, or your gym software’s own AI"],
  ["Gym that needs automatic renewal and payment reminders", "No", "Use your gym software, or the official API with approved templates"],
];

const sources = [
  { label: "Glofox: AI agents for gyms and studios", href: "https://www.glofox.com/features/ai-agents" },
  { label: "ABC Fitness: AI receptionist and sales agent (Replify)", href: "https://abcfitness.com/replify-announcement/" },
  { label: "Zenoti: AI receptionist for gyms (19 October 2026)", href: "https://www.zenoti.com/thecheckin/ai-receptionist-for-gyms" },
  { label: "Meta for Developers: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
];

const questions = [
  {
    id: "what",
    q: "What can AI do for a gym on WhatsApp?",
    answer: "AI can be your gym’s receptionist on WhatsApp: it answers membership prices, opening hours, class times and personal training questions in seconds, sends your timetable, takes trial class requests and hands members to your staff for freezes, billing and complaints. Wapzen puts one on the number your gym already uses, and it’s fully free.",
    body: <>
      <p>Most people who want to join a gym send a message before they visit: the price, the hours, whether there’s a women’s area, whether they can try a class. Those messages often arrive at 10 pm or while your front desk is busy. A gym chatbot answers all of them straight away, from the information you give it.</p>
      <p><strong>Wapzen</strong> links your gym’s WhatsApp number as a device, so your phone keeps working and your staff can still reply. <strong>It’s fully free</strong>: no Meta API key, no card and no gym software needed, and the AI is included.</p>
      <p>It suits gyms, fitness clubs, yoga, pilates and dance studios, martial arts schools, CrossFit boxes and personal trainers. To see how it works behind the scenes, read <Link href="/blog/what-is-a-whatsapp-chatbot">what a WhatsApp chatbot is</Link>.</p>
    </>,
  },
  {
    id: "handles",
    q: "What questions can a gym chatbot answer?",
    answer: "It answers the questions your front desk hears every day: membership prices and offers, opening hours, class times, trainers, personal training packages, facilities, parking and what to bring. It sends the timetable, understands voice notes and photos, and takes trial requests. It can’t see a live booking system or billing by itself; those go to your staff.",
    body: <>
      <Comparison caption="How a WhatsApp gym chatbot handles everyday messages" columns={["Does it handle it?", "How"]} rows={handles} />
      <p>The agent answers only from what you give it. If a price or class isn’t in its information, it says so instead of guessing, so update it when your timetable or offers change.</p>
    </>,
  },
  {
    id: "timetable",
    q: "How does it send class timetables, prices and photos?",
    answer: "Give it three things. Your prices, opening hours, classes and trainers as text, PDF or Word in the Knowledge Base, so it can answer accurately. Your timetable image, price card and photos of the gym in Images & Files, each with a note such as “send when someone asks for the timetable”. And your website on the Web Search card.",
    body: <>
      <ul>
        <li><strong>The Knowledge Base is what it reads.</strong> Memberships with prices, joining fees, offers, opening hours, each class with its day, time and level, and your trainers. Plain text works better than a designed poster.</li>
        <li><strong>Images & Files is what it sends.</strong> Images go as WhatsApp photos and PDFs as documents, when the person’s message matches the note you wrote.</li>
        <li><strong>Change the timetable in both places.</strong> When classes move, replace the image and update the text, or the agent will quote the old times.</li>
        <li><strong>Scanned PDFs can’t be read.</strong> Use a file with selectable text, or type the timetable in.</li>
      </ul>
    </>,
  },
  {
    id: "trials",
    q: "Can it book trial classes and gym tours?",
    answer: "It takes the request, and your front desk confirms it. With Take Order switched on, the agent asks for the person’s name, the class or tour and the day, repeats it back and saves it only after they confirm. Requests appear on your Orders page and can be sent to a staff member’s WhatsApp. Wapzen has no class calendar of its own.",
    body: <>
      <p>Here’s how a first enquiry could go at a made-up gym:</p>
      <ChatExample
        business="Demo Fitness Club"
        labels={{ subtitle: "WhatsApp · AI gym assistant", agent: "AI agent: ", patient: "Visitor: " }}
        turns={turns}
        caption="An illustrative chat for a made-up gym. The prices and classes come from the information the gym gave the agent; the 📷 line stands for the timetable image it sent."
        points={[
          { title: "Answers from your list", body: "Prices and class times are the ones you wrote. It doesn’t invent an offer to win the member." },
          { title: "Sends the timetable", body: "It shares the image you uploaded when someone asks what’s on." },
          { title: "Confirms before saving", body: "It repeats the name, class and day, and sends the request only after a clear yes." },
          { title: "Staff confirm the spot", body: "It can’t see how full a class is, so your front desk replies to confirm." },
        ]}
      />
      <p>Take Order was built for product orders, so here it works as a trial request form. Test it with a few made-up requests before you rely on it. If your booking software has a public API, someone technical can connect it with an API tool so the agent checks real class spaces; the <Link href="/blog/whatsapp-appointment-booking">WhatsApp appointment booking</Link> guide shows how.</p>
      <InlineCta title="Answer tonight’s gym enquiries" body="Fully free: no card and no Meta API key, on the WhatsApp number your members already have." label="Start free" />
    </>,
  },
  {
    id: "leads",
    q: "How can a gym get more members from WhatsApp?",
    answer: "Make it easy to message you and fast to get an answer. Put a WhatsApp link with a pre-typed message on your Instagram bio, Google Business Profile and website, and a QR code at the front desk and on flyers. Let the AI reply in seconds with the price and a free trial offer, then follow up once with people who asked but didn’t book.",
    body: <>
      <ul>
        <li><strong>Speed wins the member.</strong> Someone comparing gyms messages two or three at once. The first one to answer with a price and a trial offer usually gets the visit.</li>
        <li><strong>A link that starts the chat.</strong> Make one free with our <Link href="/tools/whatsapp-link-generator">WhatsApp link generator</Link>, with a message such as “Hi, I’d like to try a free class”.</li>
        <li><strong>A QR code</strong> on posters, flyers and the front desk, from our <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code generator</Link>.</li>
        <li><strong>One clear next step.</strong> Tell the agent to offer a free class or a tour in every first conversation, instead of only listing prices.</li>
        <li><strong>Check the chats that went quiet.</strong> On the Conversations page, find people who asked the price and didn’t book a trial, and send them one short follow-up.</li>
      </ul>
    </>,
  },
  {
    id: "follow-up",
    q: "Can it send renewal reminders and follow up enquiries automatically?",
    answer: "Not on Wapzen: the agent replies when someone writes, and it doesn’t send reminders or follow-ups by itself. You send them from the dashboard or your phone, and when the member replies, the agent carries on the chat with the whole conversation in mind. Automatic reminder sequences need your gym software or the official WhatsApp API with approved templates.",
    body: <>
      <p>On the official WhatsApp Business API, a business can only message someone outside a 24-hour window with a pre-approved template, and Meta charges for it. That’s how gym software and API platforms send automatic renewal and payment reminders.</p>
      <p>With Wapzen, send these yourself. Short, personal messages with a reason to reply work best. Change the names, prices and dates to yours:</p>
      <Samples items={followUps} />
      <p>When the member answers, the agent picks up from there: it can send the payment details you gave it, answer questions about the plan or take a trial request.</p>
      <Note>WhatsApp’s Business Messaging Policy asks businesses to message only people who gave them their number and agreed to hear from them. Send reminders to your own members and enquiries, and stop if someone asks you to.</Note>
    </>,
  },
  {
    id: "members",
    q: "What happens when a member wants to freeze, cancel or complain?",
    answer: "Write your rules into the agent’s instructions: it explains your freeze and cancellation policy and says a team member will reply. Each conversation on Wapzen has an AI switch, so a staff member can turn the AI off for that member, reply personally and switch it back on. Don’t let the AI try to talk people out of cancelling.",
    body: <>
      <ul>
        <li><strong>Cancellations and complaints need a person.</strong> Members who are upset or leaving want to be heard, not handled by a script.</li>
        <li><strong>The agent doesn’t alert you when it hands over,</strong> so agree who checks the chats and how often.</li>
        <li><strong>Your replies stay in the conversation.</strong> When you switch the AI back on, it knows what you said.</li>
        <li><strong>It works in any language,</strong> so members who write in another language get answers in theirs.</li>
      </ul>
    </>,
  },
  {
    id: "groups",
    q: "Can the AI answer in our gym’s WhatsApp group?",
    answer: "Yes, if you want it to. Many gyms run WhatsApp groups for members or for one class. On Wapzen the agent stays quiet in groups unless you switch it on for that group in the Groups tab. Then it replies only when someone tags it or replies to one of its messages, so it doesn’t jump into every conversation.",
    body: <>
      <p>A group agent is useful for questions like “is the gym open on the bank holiday?” or “what time is Saturday’s spin class?”, which members otherwise ask the coach directly. Try it in one group first and tell members how to ask it.</p>
    </>,
  },
  {
    id: "health",
    q: "Can a gym chatbot give workout or diet advice?",
    answer: "It shouldn’t, and you can tell it not to. A gym chatbot is best at the front-desk job: prices, classes, trials and timings. It can say which classes suit beginners if you write that down. For injuries, health conditions, pregnancy, training plans and diets, have it pass the chat to a trainer and suggest checking with a doctor.",
    body: <>
      <p>AI tools for personal trainers that write workout programmes are a different kind of product. On WhatsApp, the agent’s job is to answer the people who want to train with you and get them through the door. Your trainers do the coaching.</p>
    </>,
  },
  {
    id: "instructions",
    q: "What should I put in a gym chatbot’s instructions?",
    answer: "Tell it who it is and that it must say it’s a virtual assistant, which language and tone to use, to answer only from your prices and timetable, to offer a free trial, how to take a trial request, what it must never promise, such as class spaces or health advice, and when to hand over to your staff.",
    body: <>
      <p>These instructions are for a made-up gym. Change them to yours:</p>
      <pre>{prompt}</pre>
      <ul>
        <li><strong>Name the offers.</strong> If a discount isn’t written down, the agent won’t give it, which is what you want.</li>
        <li><strong>Test it like a difficult visitor.</strong> Ask for a bigger discount, send a voice note, mention a bad knee, try to cancel, and check each answer.</li>
      </ul>
    </>,
  },
  {
    id: "compare",
    q: "How does it compare with gym software AI receptionists?",
    answer: "Gym software companies such as Glofox, ABC Fitness and Zenoti sell AI receptionists that answer phone calls, SMS, email and web chat and book straight into their own schedules; their pages don’t mention WhatsApp or list a price. Wapzen works on WhatsApp only, on your current number, without gym software, and is fully free, but your staff confirm bookings.",
    body: <>
      <Comparison caption="Gym software AI receptionists compared with a WhatsApp AI agent" columns={["Gym software AI (Glofox, ABC Fitness, Zenoti)", "Wapzen"]} rows={compare} />
      <p>Choose your gym software’s AI if you already use that software, get most enquiries by phone, SMS or web chat, and want bookings and follow-ups fully automatic. Choose Wapzen if your members and leads write to you on WhatsApp and you want them answered today, without changing software. The two can sit side by side.</p>
    </>,
  },
  {
    id: "cost",
    q: "How much does a WhatsApp chatbot for a gym cost?",
    answer: "Wapzen is fully free, with no card and no Meta API key, and it doesn’t use the API, so there are no Meta per-message charges. Gym software AI receptionists don’t list prices on their pages; you book a demo. API chatbot platforms charge a monthly plan, and Meta charges for template messages such as renewal reminders.",
    body: <>
      <ul>
        <li><strong>Wapzen:</strong> fully free, on your current number.</li>
        <li><strong>Gym software AI:</strong> priced by the vendor, usually on top of the management software.</li>
        <li><strong>API platforms:</strong> a plan and often AI credits, plus Meta’s charges. Since 1 October 2026, Meta also charges for service replies beyond the first 1,000 a month per number.</li>
      </ul>
      <p>Meta changes its rates every quarter, so check its pricing page before you compare bills.</p>
    </>,
  },
  {
    id: "calls",
    q: "Can it answer WhatsApp calls to the gym too?",
    answer: "Yes, voice is working. Wapzen’s voice agent answers WhatsApp calls on your number in a natural voice, using the same gym information as the chat agent. It handles WhatsApp calls only, not calls to your mobile or landline number, and it can’t transfer a live call to your staff. For trial requests, have it ask the caller to send the details on chat.",
    body: <>
      <p>Some people would rather call than type, especially older members. The voice agent can answer questions about prices, hours and classes, and the chat agent then takes the trial request in writing, where it’s confirmed and saved.</p>
      <InlineCta href={voiceAccess} title="Answer the gym calls you miss" body="Message our team on WhatsApp and we’ll switch the voice agent on for your number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "setup",
    q: "How do I set up a WhatsApp chatbot for my gym?",
    answer: "Sign up free, click New chat agent and link your gym’s WhatsApp number with an 8-character pairing code on your phone or a QR code on a computer, then name the agent. Paste your instructions, add your prices and timetable in the Knowledge Base and the timetable image in Images & Files, switch on Take Order for trial requests, and test it from another phone.",
    body: <>
      <ol>
        <li><strong>Write your instructions first.</strong> The agent starts answering as soon as the number is linked.</li>
        <li><strong>Sign up free.</strong> No card and no API key.</li>
        <li><strong>Link the number.</strong> In WhatsApp: Linked devices › Link a device › Link with phone number instead, and enter the code. On a computer you can scan the QR code.</li>
        <li><strong>Add your gym’s details:</strong> prices, hours, classes and trainers in the Knowledge Base, the timetable and price card in Images & Files, and your website on the Web Search card.</li>
        <li><strong>Switch on Take Order,</strong> list the details for a trial request, and add the front desk’s number under Order alerts on WhatsApp.</li>
        <li><strong>Test it as a new visitor</strong> from another number: ask the price, ask for the timetable, send a voice note, book a trial and try to cancel a membership.</li>
      </ol>
    </>,
  },
  {
    id: "not-do",
    q: "What doesn’t a gym chatbot on Wapzen do?",
    answer: "It doesn’t message members first or send automatic reminders, see your class calendar or billing, take payments, give medical advice, or connect to your gym software by itself. It isn’t Meta’s official platform, so there are no approved templates or green tick. In WhatsApp groups it stays quiet unless you switch it on for a group.",
    body: <>
      <Comparison caption="Which fitness businesses a WhatsApp AI agent suits" columns={["Good fit?", "Why"]} rows={fit} />
      <ul>
        <li><strong>It works on your current number,</strong> personal or WhatsApp Business, as a linked device.</li>
        <li>Wapzen is an independent product, not made by Meta or WhatsApp.</li>
      </ul>
    </>,
  },
];

export default function WhatsAppChatbotForGymsPage() {
  return <QaPost
    href={href}
    heading={<>AI for gyms on WhatsApp.<br /><span>Answer every membership enquiry on your own number.</span></>}
    lead="People who want to join a gym message first: the price, the hours, whether they can try a class. Here are 15 questions gym and studio owners ask before handing those chats to AI: what a gym chatbot answers, how it sends timetables and takes trial requests, what follow-up and renewal reminders look like on WhatsApp, with sample messages, how it compares with gym software AI receptionists, what it costs and how to set one up."
    verdict={{
      title: "The short answer",
      body: <>A WhatsApp chatbot answers your gym’s enquiries in seconds, from your own prices and timetable. With <strong>Wapzen</strong> it runs on the number you already use: it quotes memberships, sends the class timetable, understands voice notes, takes trial requests for your front desk and hands members to your staff. It doesn’t send reminders by itself; you do, and it carries on the chat. <strong>It’s fully free</strong>, with no Meta API key.</>,
    }}
    facts={[["Price", "Fully free, no card"], ["Meta API key", "Not needed"], ["Your number", "The one your gym already uses"], ["Trial requests", "Saved and sent to your WhatsApp"]]}
    indexTitle="The 15 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/whatsapp-appointment-booking", "/blog/whatsapp-ai-sales-agent"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Turn gym enquiries into trial visits.<br /><span>Fully free, with no Meta API key.</span></>, body: "Sign up, give the agent your prices and timetable, and link your gym’s number. No card needed." }}
  />;
}
