import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp live chat support" (44, 5/5), "chatbot human handoff" /
// "chatbot to human handoff" / "live agent handoff" / "human takeover in
// chatbot" / "whatsapp live chat agent" (30 each), "live chat handoff" (15),
// autocomplete 2026-10-30 (docs/seo-blog-playbook-research.mjs). Keep in step
// with the server: there is no per-chat pause (closing a thread is bookkeeping,
// pausing the agent stops it everywhere), a dashboard reply joins the agent's
// history but a reply from the phone doesn't, and transfer_call can't bridge a
// call: it speaks, records the destination and hangs up.
const href = "/blog/whatsapp-chatbot-human-handoff";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const triggers = [
  ["They ask for a person", "“Can I talk to someone?”, “Are you a bot?”, “Call me”", "Hand off at once. Don’t argue or try one more answer."],
  ["The AI can’t answer", "The fact isn’t in the knowledge base, or the same question comes back twice", "Hand off, and add the answer to the knowledge base later"],
  ["Money is at stake", "Refunds, discounts, custom quotes, a disputed charge", "Collect the details, then hand off"],
  ["They’re upset", "A complaint, capital letters, “this is the third time”", "Apologise once, hand off, and say when they’ll hear back"],
  ["It’s sensitive", "Health, legal, safety, anything about a child", "Hand off without asking for details"],
  ["They’re ready to buy", "“Can I book a viewing?”, “Send me the invoice”", "Take the details, then let a person close"],
];

const tools = [
  ["Business API team inbox", "Assign the chat to a teammate", "Usually pauses in that chat until it’s closed or handed back", "The teammate closes the chat or returns it to the bot"],
  ["WhatsApp Business app with Meta Business Agent", "Reply yourself, or remove the AI from that chat", "Remove AI from one chat in the contact’s settings", "Add the AI back to the chat"],
  ["Wapzen", "The AI says who will reply and alerts your team", "No per-chat pause yet: the AI steps aside on that topic, or you pause the agent", "Nothing to do: the AI answers the next message, with your reply in its memory"],
];

const rules = `Hand-off rules:
- Hand the chat to a person when the customer asks for one, when the answer isn't in your knowledge base, for refunds, discounts or custom quotes, for complaints, and for anything about health, legal matters or safety.
- To hand off: say "[Name] from our team will reply here [within 1 hour / from 9 am tomorrow]", then use notify_team with the reason and a one-line summary.
- After handing off a topic, don't try to solve it yourself. If the customer writes about it again, say [Name] has their message and will reply here. You can still answer simple questions about other topics.
- Never pretend to be a person. If asked, say you're [Business]'s AI assistant.`;

const notifyParameters = [
  ["reason", "string", "Why: “asked for a person”, “refund”, “complaint”, “answer not found”, or “ready to buy”."],
  ["customer_name", "string", "The customer’s name, if they gave it."],
  ["contact_number", "string (optional)", "A number to reach them on, if they gave one."],
  ["summary", "string", "One or two sentences: what they want and what the AI already told them."],
];

const messages = [
  { title: "During opening hours", text: "Good question, let me get someone from our team for this. [Name] will reply here within [30 minutes]." },
  { title: "After hours", text: "I’ve passed this to our team. We’re closed right now, so [Name] will reply here from [9 am tomorrow]. You don’t need to send it again." },
  { title: "A complaint", text: "I’m sorry this happened. I’ve sent your message to [Name], who handles these personally, and you’ll hear back here today." },
  { title: "Refund or discount", text: "Refunds are approved by our team, so I’ve passed your order details to [Name]. You’ll get an answer here within [1 working day]." },
  { title: "Ready to buy", text: "Great, I’ve sent your details to [Name], who’ll confirm everything with you here shortly." },
  { title: "Handing back", text: "Glad that’s sorted! If you have any other questions, just ask here: our assistant can help any time, and we’re here if you need us." },
];

const faqs = [
  { q: "How do I transfer a WhatsApp chat from a chatbot to a human?", a: "Give the bot clear hand-off rules: when to hand over, what to tell the customer, and how to alert your team. In a Business API team inbox you then assign the chat to a teammate. With Wapzen, the AI tells the customer who will reply, sends your team an alert through an API request tool, and a person replies from the dashboard or the phone." },
  { q: "Can the bot stop replying in one chat when I take over?", a: "It depends on the tool. Business API team inboxes usually pause the bot in a chat assigned to a person, and Meta Business Agent can be removed from a single chat. Wapzen has no per-chat pause yet: the AI steps aside on the handed-off topic, and pausing the agent stops it in every chat." },
  { q: "How will my team know a customer wants a person?", a: "Have the AI send an alert. In Wapzen, a notify_team API request tool posts the reason and a summary to an automation tool such as Zapier, Make, or n8n, which forwards it to email, Slack, or a WhatsApp group. The chats also appear in the dashboard's Conversation tab." },
  { q: "Can an AI agent transfer a WhatsApp call to a person?", a: "Not in Wapzen: a linked device can't bridge a WhatsApp call to a second phone. A Wapzen voice agent can say a colleague will call back, alert your team with a tool, and end the call. When no voice agent is live on the number, calls ring your phone as usual." },
  { q: "Should the chatbot say it's a bot?", a: "Yes. Customers trust a bot that's honest about it, and in the EU the AI Act's transparency rules, which apply from 2 August 2026, require telling people they're talking to an AI unless it's obvious. Say it in the greeting, and have the AI answer truthfully when asked." },
  { q: "How do I hand the chat back to the AI?", a: "Close the conversation politely and tell the customer the assistant can help with anything else. In Wapzen there's nothing to switch: the AI answers the customer's next message. If you paused the agent, turn it back on." },
];

const sources = [
  { label: "Chatlayer docs: Human handover and live chat", href: "https://docs.chatlayer.ai/integrations/human-offloading-live-chat" },
  { label: "EU AI Act, Article 50: Transparency obligations", href: "https://artificialintelligenceact.eu/article/50/" },
];

const sections = [
  {
    id: "when",
    title: "When a WhatsApp chatbot should hand off to a person",
    body: <>
      <p>An AI agent should answer the repeat questions and hand over everything else, quickly and without making the customer ask twice. Six moments call for a person:</p>
      <Comparison caption="When a WhatsApp chatbot should hand a chat to a person" columns={["What it looks like", "What the AI should do"]} rows={triggers} />
      <p>The worst handoff is the one that never happens: a bot that keeps offering the same unhelpful answer to someone who has asked three times for a person. Write the triggers into the agent’s instructions so it hands over the first time.</p>
    </>,
  },
  {
    id: "rules",
    title: "Write the hand-off rules into the instructions",
    body: <>
      <p>Add a block like this to your agent’s instructions. Change the names and times, and keep the last rule:</p>
      <pre><code>{rules}</code></pre>
      <p>Three details make it work. The AI names a <strong>person and a time</strong>, so the customer knows what happens next. It <strong>alerts your team</strong>, so nobody has to watch every chat. And it <strong>steps aside on the topic</strong> it handed over, so it doesn’t talk over the person who takes it. The full guide to writing instructions is <Link href="/blog/ai-agent-system-prompt-examples">AI agent instructions: system prompt examples</Link>.</p>
    </>,
  },
  {
    id: "messages",
    title: "Hand-off messages to copy",
    body: <>
      <p>Use these in the instructions as the lines the AI says, or save them as quick replies for your team:</p>
      <Samples items={messages} />
    </>,
  },
  {
    id: "tools",
    title: "How takeover works in different WhatsApp tools",
    body: <>
      <p>What happens after the handoff depends on how your WhatsApp is connected:</p>
      <Comparison caption="How human takeover works in Business API inboxes, Meta Business Agent and Wapzen" columns={["How a person takes over", "Does the AI pause?", "Handing back"]} rows={tools} />
      <p>Team inboxes on the Business API, such as <a href="https://docs.chatlayer.ai/integrations/human-offloading-live-chat" target="_blank" rel="nofollow noopener noreferrer">Chatlayer’s</a>, pause the bot once a person accepts the chat and resume it when they hand it back. That suits teams of several agents who share one number. Meta’s own agent in the WhatsApp Business app lets you reply yourself or remove the AI from a single chat; see <Link href="/blog/whatsapp-business-ai-agent">the WhatsApp Business AI agent</Link>.</p>
    </>,
  },
  {
    id: "wapzen",
    title: "Handoff in Wapzen, step by step",
    body: <>
      <h3>1. Alert your team</h3>
      <p>Create an <strong>API Request</strong> tool named <code>notify_team</code>, set it to POST to a webhook in Zapier, Make, or n8n, and add these parameters. The automation forwards each alert to email, Slack, or your team’s WhatsApp group:</p>
      <Comparison caption="Parameters for the notify_team tool" columns={["Type", "Description to give the agent"]} rows={notifyParameters} />
      <p>Attach it to the chat agent along with the hand-off rules above. Press <strong>Test tool</strong> once to check that the alert arrives.</p>
      <h3>2. Reply from the dashboard</h3>
      <p>Open the chat agent’s <strong>Conversation</strong> tab, find the thread, and reply there. Your message goes to the customer from your number, and it joins the AI’s memory of the chat, so its next reply builds on what you said instead of contradicting it.</p>
      <p>You can also reply from WhatsApp on your phone, as usual. The customer sees no difference, but the AI doesn’t see messages sent from the phone, so it won’t know what you promised.</p>
      <h3>3. Know what the AI does meanwhile</h3>
      <p>Wapzen has no per-chat pause yet: while the agent is live, it answers every text message. With the rules above, it tells the customer you have their message instead of trying again. If you’d rather answer every chat yourself for a while, during a busy sale or a complaint that needs care, <strong>pause the agent</strong> and switch it back on afterwards. Closing a thread in the Conversation tab only files it; it doesn’t stop the AI.</p>
      <Note>The AI also leaves some messages to you from the start: voice notes, photos, documents, and group chats get no AI reply, so they always wait for a person.</Note>
      <InlineCta title="Let AI answer, and hand over when it should" body="Free right now: an AI agent on your WhatsApp number that answers customers and passes the right chats to your team." />
    </>,
  },
  {
    id: "calls",
    title: "Handoff on WhatsApp calls",
    body: <>
      <p>Wapzen can’t transfer a WhatsApp call to another phone mid-call: a linked device has no way to bridge in a second line. So a voice agent hands off by arranging a call back:</p>
      <ul>
        <li>Give the voice agent the same hand-off rules, with the line “say a colleague will call you back [today / within the hour]”.</li>
        <li>Attach the same <code>notify_team</code> tool, so the callback request reaches your team with a summary, and an <strong>End Call</strong> tool to close politely.</li>
        <li>Wapzen’s <strong>Transfer Call</strong> tool says your message, records where the call should have gone, and ends the call. It can’t connect the caller to a person, so a callback is the honest version.</li>
      </ul>
      <p>When no voice agent is live on the number, WhatsApp calls ring your phone as usual, so some teams pause the voice agent during opening hours and switch it on when they close.</p>
    </>,
  },
  {
    id: "hand-back",
    title: "Handing the chat back to the AI",
    body: <>
      <p>When the person is done, end on a line that tells the customer the assistant is still there, like the “Handing back” message above. In Wapzen there’s nothing to switch: the AI answers the customer’s next message, with your replies in its memory. If you paused the agent, turn it back on.</p>
      <p>Then close the loop: if the handoff happened because the AI didn’t know something, add the answer to the <Link href="/blog/chatbot-knowledge-base">knowledge base</Link>, so the next customer gets it straight away. A short weekly read of the Conversation tab catches most gaps; <Link href="/blog/zen-whatsapp-workflow">a calmer WhatsApp workflow</Link> describes that routine.</p>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device, like WhatsApp Web.</Note>
    </>,
  },
];

export default function WhatsAppChatbotHumanHandoffPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp chatbot human handoff.<br /><span>From AI to a person, and back.</span></>}
    lead="When a WhatsApp chatbot should hand a chat to a person, what it should say, how your team gets alerted, and how takeover works in team inboxes, Meta Business Agent, and Wapzen. With hand-off rules and messages to copy."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Hand off when:</strong> the customer asks for a person, the answer isn’t known, money is involved, they’re upset, or it’s sensitive.</>,
        <><strong>How:</strong> the AI names who will reply and when, alerts your team with a summary, and stops pushing that topic.</>,
        <><strong>Hand back:</strong> a person replies, closes politely, and the AI picks up the next question with the conversation in its memory.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/ai-agent-system-prompt-examples", "/blog/zen-whatsapp-workflow"]}
    product="/whatsapp-ai-customer-service"
    cta={{ heading: <>AI for the questions.<br /><span>People for the rest.</span></>, body: "Create a free AI agent, write your hand-off rules, and link your WhatsApp number. It answers right away and passes the right chats to you." }}
  />;
}
