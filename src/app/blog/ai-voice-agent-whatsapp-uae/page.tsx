import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "ai voice agent uae/dubai", "ai calling agent uae", "ai receptionist dubai",
// "arabic ai voice agent", "free ai voice agent". WhatsApp voice calls are restricted
// inside the UAE (Khaleej Times, May 2026; TDRA approval pending), so the user chose on
// 2026-11-01 to scope this post to callers abroad and say so plainly. A UAE number on
// Wapzen's voice agent has NOT been tested; the post says to test first and that the
// licensing question is for the business's adviser. Voice is in early access, so the
// CTA opens WhatsApp instead of sign-up. Recheck the WhatsApp calling status before
// any edit.
const href = "/blog/ai-voice-agent-whatsapp-uae";
const post = blogPost(href);
const earlyAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like early access to Wapzen voice agents for my business in the UAE.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const reach = [
  ["Customer calls from inside the UAE", "No. WhatsApp calling is restricted on UAE networks", "Answer them on WhatsApp chat or your phone line"],
  ["Customer abroad calls your WhatsApp number", "Yes, this is what the voice agent is for", "Test it from abroad before you rely on it"],
  ["You call an overseas lead on WhatsApp", "Yes, once you add the lead to a campaign", "Only people who asked you to call"],
  ["You call a UAE mobile or landline", "No. Wapzen places WhatsApp calls only", "Use your licensed phone line and follow the telemarketing rules"],
];

const does = [
  ["Answer WhatsApp calls 24/7", "Yes, on the number you already use"],
  ["Call back leads on WhatsApp", "Yes, as soon as a lead is added to a campaign, including by API from your form or CRM"],
  ["Speak your callers’ language", "Arabic, English, Hindi, Urdu, Russian, French, Chinese and more"],
  ["Answer from your information", "Yes, from a knowledge base of text, PDF or Word files"],
  ["Send a WhatsApp message mid-call", "Yes, such as a brochure link, location or an agent’s contact"],
  ["Log every call", "Yes, call history and transcripts in the dashboard"],
  ["Transfer the call to a person", "No. It ends the call and sends the person’s contact by message"],
];

const costs = [
  ["How it bills", "$0.14 a minute on the Start plan", "$0.05 a minute for Vapi, plus each provider at cost", "Free to start in early access"],
  ["1,000 minutes", "About $140", "About $82 to $129 on Vapi’s calculator", "No per-minute charge"],
  ["How it calls", "Phone line", "Phone line, such as Twilio", "WhatsApp, on your number"],
  ["Calling overseas buyers", "International phone rates apply", "International phone rates apply", "A WhatsApp call, so no international phone rate"],
];

const limits = [
  ["No calls inside the UAE", "Customers on UAE networks can’t reach the voice agent", "Use the AI chatbot for text, which works in the UAE"],
  ["Not tested from the UAE yet", "We haven’t verified a UAE number on the voice agent", "Have a colleague abroad call it before you advertise it"],
  ["No transfers", "It can’t hand the live call to a person", "It sends your agent’s contact and notes the request"],
  ["Short pause", "About one to two seconds before each answer", "Ask for short sentences in its instructions"],
  ["Linked device", "Not Meta’s official API", "Call only people who expect your call, or WhatsApp may restrict the number"],
  ["Early access", "Voice is set up with our team", "Message us on WhatsApp to start"],
];

const faqs = [
  { q: "Do WhatsApp calls work in the UAE?", a: "Not on UAE networks. WhatsApp voice and video calling is still restricted on mobile and desktop across the country, and availability depends on approval by the TDRA, the UAE's telecoms regulator. Messages, photos and voice notes work. Approved calling apps include BOTIM and C'Me." },
  { q: "Can a WhatsApp AI voice agent work for a UAE business?", a: "For callers outside the UAE, it can. A Dubai developer or broker with buyers in India, the UK or Europe can let an AI voice agent answer the WhatsApp calls those buyers make, and call back the ones who ask. It can't reach customers calling from inside the UAE. We haven't yet tested a UAE number on Wapzen's voice agent, so test it before you rely on it." },
  { q: "Is there a free AI voice agent for UAE businesses?", a: "Wapzen's voice agent is in early access and free to start, with no per-minute charge, because calls run over WhatsApp. For high call volume we agree a paid plan with you. Phone-line platforms such as Bland AI and Vapi charge per minute." },
  { q: "Does the AI voice agent speak Arabic?", a: "Yes. It speaks Arabic, English and many other languages, including Hindi, Urdu, Russian, French and Chinese. Choose a voice that speaks the language, and write the instructions in the language you want it to use." },
  { q: "What are the UAE telemarketing rules?", a: "Cabinet Resolutions No. 56 and No. 57 of 2024 apply from 27 August 2024. Marketing calls are allowed only from 9am to 6pm, a customer who refuses must not be called again, unanswered calls are limited to once a day and twice a week, calls must come from numbers registered to the company's licence, and calling numbers on the Do Not Call Registry costs AED 50,000 for a first violation, rising to AED 150,000." },
  { q: "Is this legal in the UAE?", a: "We don't claim it is. The TDRA licenses who may offer calling services in the UAE. Ask your legal adviser whether answering overseas callers on WhatsApp with software hosted outside the UAE fits your licence before you use it." },
];

const sources = [
  { label: "Khaleej Times: WhatsApp in the UAE, calling still restricted (May 2026)", href: "https://www.khaleejtimes.com/uae/whatsapp-in-uae-private-chats-not-exempt-from-laws-5-things-to-know" },
  { label: "Clyde & Co: UAE tightens telemarketing regulations", href: "https://www.clydeco.com/en/insights/2024/07/uae-tightens-telemarketing-regulations-what-you-ne" },
  { label: "WAM: Dubai real estate transactions exceed AED431 billion in H1 2025", href: "https://www.wam.ae/en/article/bks1cw0-dubai-real-estate-transactions-exceed-aed431" },
  { label: "Bland AI pricing", href: "https://www.bland.ai/pricing" },
  { label: "Vapi pricing", href: "https://vapi.ai/pricing" },
];

const sections = [
  {
    id: "short-answer",
    title: "Can a UAE business use an AI voice agent on WhatsApp?",
    body: <>
      <p>Yes, but only for callers <strong>outside</strong> the UAE. WhatsApp voice and video calls are still restricted on UAE networks: in May 2026, Khaleej Times reported that WhatsApp calling remains restricted on mobile and desktop across the country, subject to approval by the TDRA. So a WhatsApp AI voice agent can’t answer customers who call from inside the UAE.</p>
      <p>Many UAE businesses get much of their demand from abroad: overseas property investors, tourists planning a trip, international patients and students. Those people often prefer WhatsApp to an international phone call. For them, an AI voice agent can answer WhatsApp calls at any hour, in their language, and call back the ones who ask.</p>
      <p>This guide explains who it suits, what it does, what it costs, the UAE rules that apply, and two caveats you should know before you start.</p>
      <Note>Two caveats. We haven’t yet tested a UAE number on Wapzen’s voice agent, so test it from abroad before you advertise it. And the TDRA licenses calling services in the UAE: ask your legal adviser whether this setup fits your licence. We don’t claim it does.</Note>
    </>,
  },
  {
    id: "who-it-reaches",
    title: "Which calls the voice agent can and can’t handle",
    body: <>
      <Comparison caption="Which calls a WhatsApp AI voice agent can handle for a UAE business" columns={["Can the voice agent handle it?", "What to do"]} rows={reach} />
      <p>For customers inside the UAE, WhatsApp chat still works. An <Link href="/free-whatsapp-chatbot">AI chatbot on the same number</Link> can answer their messages, while the voice agent covers the calls from abroad.</p>
    </>,
  },
  {
    id: "use-cases",
    title: "Who it suits: real estate, hospitality and clinics",
    body: <>
      <ul>
        <li><strong>Real estate developers and brokers.</strong> Foreign investors put AED 228.35 billion into Dubai property in the first half of 2025, according to Dubai Land Department figures reported by WAM, against AED 22.56 billion from GCC investors. Buyers in India, the UK or Europe see an off-plan ad in their evening, which can be late at night in Dubai, and tap “call” on WhatsApp. The agent answers questions about the project, payment plan and handover date from your brochure, asks budget and timeline, and sends the broker’s contact.</li>
        <li><strong>Hotels, holiday homes and tour operators.</strong> Guests planning a trip call before they arrive. The agent answers questions about check-in, transfers, parking and what’s included, and sends the location or booking link by message.</li>
        <li><strong>Clinics with international patients.</strong> The agent shares services, opening hours and how to book a consultation, and takes the request. It never discusses symptoms, and health information stays with your team.</li>
        <li><strong>Lead call-back.</strong> When a form on your website or a portal adds an overseas lead to a campaign by API, the agent calls them on WhatsApp straight away, while they’re still interested.</li>
      </ul>
      <InlineCta href={earlyAccess} title="Try it with your overseas callers" body="Wapzen’s voice agent is in early access and free to start. Message us on WhatsApp and we’ll set it up with you." label="Request early access" />
    </>,
  },
  {
    id: "what-it-does",
    title: "What the voice agent does",
    body: <>
      <Comparison caption="What Wapzen’s AI voice agent does on WhatsApp" columns={["Does it?"]} rows={does} />
      <p>Here is how a call from an overseas buyer might go:</p>
      <Note>Illustrative call. The project, prices and dates are made up. The agent only answers from what’s in your knowledge base.</Note>
      <p><strong>Caller:</strong> “Hi, I saw your ad for the two-bedroom units in [project]. What’s the payment plan?”</p>
      <p><strong>Agent:</strong> “Hello, this is the virtual assistant for [brokerage]. This call is transcribed. For [project], two-bedroom units start from AED 1.9 million, with 10% on booking and the rest in instalments until handover in the fourth quarter of 2028. Are you buying to live in or as an investment?”</p>
      <p><strong>Caller:</strong> “Investment. Can I see the floor plans?”</p>
      <p><strong>Agent:</strong> “Of course. I’ve just sent you the brochure with floor plans on WhatsApp. When would you like to speak to an adviser?”</p>
      <p>The agent doesn’t negotiate, promise rental yields or take payments. Those stay with your team.</p>
    </>,
  },
  {
    id: "rules",
    title: "UAE rules to know: telemarketing, data and AI disclosure",
    body: <>
      <p><strong>Telemarketing (Cabinet Resolutions No. 56 and No. 57 of 2024).</strong> In force since 27 August 2024 for calls to consumers in the UAE. Marketing calls are allowed only between 9am and 6pm. A customer who refuses must not be called again. Unanswered calls are limited to once a day and twice a week. Calls must come from local numbers registered to the company’s commercial licence, and individuals may not market from personal numbers. Calling numbers on the Do Not Call Registry costs AED 50,000 for a first violation, AED 75,000 for a second and AED 150,000 after that. A WhatsApp agent can’t reach UAE consumers anyway, but your phone team must follow these rules.</p>
      <p><strong>Overseas leads.</strong> When you call someone abroad, the rules of their country apply too, along with WhatsApp’s own rules. Call only people who asked you to, and stop as soon as someone says no.</p>
      <p><strong>Data protection.</strong> The UAE’s Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) applies onshore, and the DIFC and ADGM have their own data laws. Wapzen stores data in Singapore, runs servers in Singapore and Germany, and uses AI providers in the US. Tell callers the call is transcribed.</p>
      <p><strong>Say it’s an AI.</strong> Have the agent introduce itself as a virtual assistant in its greeting, as in the sample above. Wapzen doesn’t add that line for you.</p>
      <p>This is general information, not legal advice.</p>
    </>,
  },
  {
    id: "cost",
    title: "What an AI voice agent costs",
    body: <>
      <p>Phone-line AI platforms bill every minute, and calls to overseas buyers add international phone rates on top. On WhatsApp there is no phone rate:</p>
      <Comparison caption="Bland AI, Vapi and Wapzen compared on cost" columns={["Bland AI", "Vapi", "Wapzen"]} rows={costs} />
      <p>Bland and Vapi can call any phone number, which matters if your customers aren’t on WhatsApp. Prices were checked on 25 October 2026, in US dollars. Meta also offers an official <Link href="/blog/whatsapp-business-calling-api">WhatsApp Business Calling API</Link>, with per-minute charges for calls a business makes and a permission step before each customer can be called.</p>
    </>,
  },
  {
    id: "setup",
    title: "How to get started",
    body: <>
      <ol>
        <li><strong>Message us on WhatsApp.</strong> Voice is in early access, so we set it up with you. Tell us where your callers are and whether you want call-backs.</li>
        <li><strong>Write the instructions and greeting.</strong> For example: “You are the virtual assistant for [business] in Dubai. Say you are a virtual assistant and that the call is transcribed. Answer only from your knowledge base, and never invent prices, availability or returns. If the caller wants to negotiate or speak to a person, send them [name]’s WhatsApp contact.”</li>
        <li><strong>Add your information:</strong> projects or services, prices, payment plans, locations and FAQs, as text, PDF or Word files.</li>
        <li><strong>Link a dedicated number,</strong> separate from anyone’s personal WhatsApp, because the agent answers every WhatsApp call to it.</li>
        <li><strong>Test from abroad</strong> before you put the number in ads: have a colleague outside the UAE call it, ask hard questions, and check the transcript.</li>
      </ol>
    </>,
  },
  {
    id: "limits",
    title: "Limits to know before you start",
    body: <>
      <Comparison caption="Limits of Wapzen’s voice agent for UAE businesses" columns={["What happens", "How to handle it"]} rows={limits} />
      <Choose highlight="Wapzen" items={[
        { name: "a phone-line AI platform", points: ["Most of your callers are inside the UAE", "You need live transfers to your team", "Your callers aren’t on WhatsApp"] },
        { name: "Wapzen", points: ["Many of your callers are abroad and use WhatsApp", "You want to answer and call back overseas leads without per-minute fees", "You want to start without code"] },
      ]} />
      <p>Wapzen is an independent product, not made by Meta or WhatsApp.</p>
    </>,
  },
];

export default function AiVoiceAgentWhatsAppUaePage() {
  return <BlogPost
    href={href}
    heading={<>An AI voice agent on WhatsApp for UAE businesses.<br /><span>For the callers you get from abroad.</span></>}
    lead="WhatsApp calls are restricted inside the UAE, but many UAE businesses sell to people abroad who call on WhatsApp: property investors, tourists and international patients. An AI voice agent can answer those calls 24/7, in Arabic, English and their own language. Here’s who it suits, what it costs, the rules, and the caveats."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Inside the UAE:</strong> WhatsApp calls are restricted, so the voice agent can’t reach those callers. Use WhatsApp chat for them.</>,
        <><strong>From abroad:</strong> an AI voice agent can answer overseas callers’ WhatsApp calls 24/7 and call back leads who ask.</>,
        <><strong>Cost:</strong> phone-line AI bills per minute, plus international rates. Wapzen’s voice agent is free to start in early access.</>,
        <><strong>Caveats:</strong> not yet tested on a UAE number, and the licensing question is for your adviser.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-calling-api", "/blog/bland-ai-vs-vapi"]}
    product="/ai-calling-agent-for-real-estate"
    cta={{ heading: <>Answer every overseas call.<br /><span>Try the voice agent on WhatsApp.</span></>, body: "Wapzen’s voice agent is in early access and free to start. Message us on WhatsApp and we’ll set it up with you." }}
    action={{ href: earlyAccess, label: "Request early access" }}
  />;
}
