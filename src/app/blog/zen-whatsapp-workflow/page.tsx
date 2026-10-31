import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { BlogPost, Note, Screenshot } from "@/components/blog/BlogPost";

// Complements /blog/whatsapp-zen with practical informational intent. The
// first post resolves the brand query; this one earns the "zen whatsapp"
// variant by teaching a genuinely calmer support workflow.
const href = "/blog/zen-whatsapp-workflow";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const faqs = [
  { q: "What is a Zen WhatsApp workflow?", a: "It is a simple way to keep WhatsApp support under control: AI handles repeat questions, a person handles sensitive or unusual cases, and a short weekly review improves the system. It is a workflow idea, not an official WhatsApp feature." },
  { q: "Can AI reply to WhatsApp messages for me?", a: "Yes. With Wapzen, an AI chat agent replies to incoming WhatsApp messages using your instructions and knowledge base. It can run on a personal or WhatsApp Business number connected by QR code." },
  { q: "How do I stop the AI from making up answers?", a: "Give it a focused knowledge base, tell it never to invent missing facts, and set a clear handoff rule. Then review real conversations and add any missing answer to the knowledge base." },
  { q: "Should AI answer every customer message?", a: "No. Let AI handle routine, low-risk questions. Send complaints, refunds, unusual exceptions, sensitive information, and anything outside the knowledge base to a person." },
  { q: "Can I take over a conversation from the AI?", a: "Yes. Wapzen saves incoming conversations in the dashboard, where you can review the thread and reply yourself when a customer needs a person." },
  { q: "How long does it take to set up?", a: "A useful first version can be ready in about 15 minutes if you already have a short FAQ, price list, and policies. Improving it is an ongoing weekly habit rather than a one-time project." },
];

const sections = [
  {
    id: "what-zen-means",
    title: "What a Zen WhatsApp inbox actually looks like",
    body: <>
      <p>A calm inbox is not an empty inbox. It is one where every message has a clear next step. Routine questions get a quick, accurate answer. Important conversations reach a person. Nothing depends on someone remembering to scroll back through yesterday&apos;s chats.</p>
      <p>That is the idea behind a <strong>Zen WhatsApp workflow</strong>: automate the repeatable work, keep humans in control of judgment, and improve the boundary between the two every week.</p>
      <p>You do not need a maze of chatbot menus to get there. A small knowledge base, a careful agent prompt, and one handoff rule are enough for a strong first version.</p>
    </>,
  },
  {
    id: "sort-the-work",
    title: "Step 1: Sort messages into answer, action, or human",
    body: <>
      <p>Read your last 30 customer conversations and put each request into one of three buckets:</p>
      <ul>
        <li><strong>Answer:</strong> opening hours, prices, delivery areas, services, stock rules, and other facts already written down.</li>
        <li><strong>Action:</strong> check an order, request an appointment, collect lead details, or call someone back. These may need an API tool connected to your system.</li>
        <li><strong>Human:</strong> complaints, refunds, exceptions, negotiations, sensitive details, or anything the business has not documented.</li>
      </ul>
      <p>Start by automating only the first bucket. It creates immediate breathing room without asking the AI to make risky decisions.</p>
    </>,
  },
  {
    id: "knowledge-base",
    title: "Step 2: Build a small, useful knowledge base",
    body: <>
      <p>Create short sources around the questions people actually ask. A useful starting set is:</p>
      <ul>
        <li>Products or services and current prices</li>
        <li>Opening hours and locations</li>
        <li>Delivery, payment, cancellation, and return rules</li>
        <li>Five to ten frequently asked questions</li>
      </ul>
      <p>Specific documents beat a giant company handbook. Name each source clearly and remove old versions, so the agent is less likely to retrieve conflicting facts.</p>
      <Screenshot src="/blog/whatsapp-chatbot-without-business-api/knowledge-base.webp" width={1380} height={1244} alt="A Wapzen knowledge base containing a catalogue, shipping rules and a returns policy" caption="A focused knowledge base: one catalogue and a few short policy sources, all marked ready." />
    </>,
  },
  {
    id: "agent-rules",
    title: "Step 3: Give the agent boundaries, not just a personality",
    body: <>
      <p>&ldquo;Be friendly and helpful&rdquo; is not enough. A reliable chat agent needs rules it can follow when the answer is unclear. Start with something like this:</p>
      <blockquote>
        You are the support assistant for [business]. Answer in the customer&apos;s language and keep replies under three sentences. Use the knowledge base for facts. Never invent a price, date, policy, or promise. If the answer is missing, say a teammate will reply soon. Escalate complaints, refunds, and exceptions to a person.
      </blockquote>
      <p>Add tone after the boundaries are clear. The calmest customer experience comes from accurate expectations, not a long list of brand adjectives.</p>
      <Screenshot src="/blog/whatsapp-auto-reply-personal-account/agent-instructions.webp" width={1840} height={1232} alt="Wapzen chat agent instructions with clear response and handoff rules" caption="Short instructions tell the agent how to answer, what not to invent, and when a person should take over." />
    </>,
  },
  {
    id: "connect-test",
    title: "Step 4: Connect WhatsApp and test the awkward questions",
    body: <>
      <p>Connect your number by scanning the Wapzen QR code from WhatsApp&apos;s <strong>Linked devices</strong> screen. Assign the chat agent, activate it, and message the number from another phone.</p>
      <p>Do not test only the easy FAQ. Ask a vague question, misspell a product, request a refund, ask for an unavailable date, and ask about something that is not in the knowledge base. A good test proves the agent can say &ldquo;I don&apos;t know&rdquo; and hand the conversation over cleanly.</p>
      <p>The full setup is in the <Link href="/blog/whatsapp-chatbot-without-business-api">WhatsApp chatbot without the Business API guide</Link>.</p>
      <p>Scanning that code links your number. The code customers scan is a different one: a free <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code generator</Link> makes it, and a pre-filled message like &ldquo;Hi, I want to book&rdquo; tells the agent what they want from the first line.</p>
    </>,
  },
  {
    id: "daily-routine",
    title: "Step 5: Use a five-minute daily routine",
    body: <>
      <ol>
        <li>Open the conversation list and scan new threads.</li>
        <li>Take over anything sensitive, frustrated, or commercially important.</li>
        <li>Mark one missing or weak answer to fix later.</li>
      </ol>
      <p>This should take minutes, not become a second inbox job. The agent handles the queue; you look for exceptions.</p>
      <Screenshot src="/blog/whatsapp-auto-reply-personal-account/ai-reply-conversation.webp" width={1840} height={1396} alt="A Wapzen conversation showing an AI reply and the controls for human takeover" caption="Review the answer in context, then step in when the conversation needs a person." />
    </>,
  },
  {
    id: "weekly-review",
    title: "Step 6: Improve one thing every week",
    body: <>
      <p>Once a week, spend 20 minutes on the conversations that did not go smoothly. Update one of three things:</p>
      <ul>
        <li><strong>Knowledge:</strong> add a missing answer or remove an outdated one.</li>
        <li><strong>Instructions:</strong> make a vague rule more specific.</li>
        <li><strong>Handoff:</strong> move a risky category back to a person.</li>
      </ul>
      <p>A calm system grows from small corrections. You do not need to redesign the whole chatbot whenever one answer is wrong.</p>
    </>,
  },
  {
    id: "do-not-automate",
    title: "What not to automate",
    body: <>
      <p>Leave high-stakes judgment with a person. That includes angry customers, refunds outside the written policy, legal or medical advice, unusual discounts, sensitive personal information, and promises the business may not be able to keep.</p>
      <p>Wapzen also is not a bulk broadcast tool. It links as a device rather than using Meta&apos;s official Business Platform. Use it to answer people who contact you and for expected follow-ups, never for unsolicited mass messages.</p>
      <Note>The goal is not to remove people from customer service. It is to protect their attention for the conversations where judgment and empathy matter.</Note>
    </>,
  },
];

export default function ZenWhatsAppWorkflowPage() {
  return <BlogPost
    href={href}
    heading={<>A Zen WhatsApp workflow.<br /><span>Less inbox, better answers.</span></>}
    lead="A calmer WhatsApp inbox does not come from automating everything. It comes from giving repeat questions to AI, important decisions to people, and every conversation a clear next step."
    summary={{
      title: "The calm-inbox formula",
      items: [
        <><strong>Automate repeat questions first.</strong> Prices, hours, delivery, services, and written policies are the safest place to begin.</>,
        <><strong>Write a clear handoff rule.</strong> Complaints, exceptions, missing facts, and sensitive conversations go to a person.</>,
        <><strong>Review, do not hover.</strong> Scan conversations for five minutes a day and improve one weak answer each week.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={[{ label: "WhatsApp Help Center: how to link a device", href: "https://faq.whatsapp.com/1317564962315842" }]}
    related={["/blog/whatsapp-zen", "/blog/whatsapp-auto-reply-personal-account"]}
    product="/whatsapp-auto-reply"
    cta={{ heading: <>A calmer inbox starts small.<br /><span>Build the first version free.</span></>, body: "Create a Wapzen chat agent, add the questions customers ask every day, and connect your WhatsApp number with a QR code." }}
  />;
}
