import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note, RowTable } from "@/components/blog/BlogPost";

// Targets "free whatsapp ai chatbot". A buyer's guide, so what it says about
// Wapzen has to pass its own checklist: "free to start" with usage limits (chat
// replies are capped), one fixed model, no voice until it has a backend again.
// Keep those in step with whiskey-bailey-server.
const href = "/blog/best-free-whatsapp-ai-chatbot-guide";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const options = [
  ["WhatsApp Business app", "Free greeting messages, away messages, and saved replies", "Standard messages don’t provide full conversational AI"],
  ["Free trial chatbot platforms", "Access to AI or automation features for evaluation", "Usage or access may end when the trial expires"],
  ["Free-tier chatbot platforms", "An ongoing allowance of conversations or features", "Limits, paid upgrades, or additional fees may apply"],
  ["Open-source or DIY chatbots", "Flexibility to build custom automations", "Hosting, AI models, integrations, and maintenance may cost money"],
  ["Wapzen", "Free to start: AI chat, knowledge bases, and connected tools", "The free start has usage limits, and it connects by QR or pairing code rather than Meta’s official Business Platform"],
];

const pilot = [
  ["Day 1", "Collect your 20 most common customer questions", "Coverage of real customer needs"],
  ["Day 2", "Add your business information and configure the AI", "Setup effort and missing information"],
  ["Day 3", "Test common questions using different wording", "Answer accuracy"],
  ["Day 4", "Test difficult requests, complaints, and unknown questions", "Safety and escalation behavior"],
  ["Day 5", "Test supported languages and, if needed, voice calls", "Conversation quality"],
  ["Day 6", "Review conversation history and correct recurring mistakes", "Ease of maintenance"],
  ["Day 7", "Calculate quality, review operating costs, and decide whether to expand", "Business readiness"],
];

const scorecard = [
  ["Answer accuracy", "5"],
  ["Business knowledge", "5"],
  ["Ease of setup", "5"],
  ["Total cost transparency", "5"],
  ["Integrations", "5"],
  ["Conversation visibility", "5"],
  ["Human escalation", "5"],
  ["Reliability and privacy safeguards", "5"],
  ["Total", "40"],
];

const faqs = [
  { q: "What is the best free WhatsApp AI chatbot?", a: "The best free WhatsApp AI chatbot depends on your needs. For simple greetings, the WhatsApp Business app may be sufficient. For conversational AI, look for reliable knowledge-base answers, transparent costs, appropriate integrations, and a connection method suitable for your business. Wapzen is one free-to-start option worth evaluating, with usage limits on the free start." },
  { q: "Can I create a WhatsApp AI chatbot for free without coding?", a: "Yes. No-code tools let you configure an AI agent using instructions and business information instead of writing software. Wapzen provides a no-code chatbot builder that connects an existing WhatsApp number through a QR code or pairing code." },
  { q: "Can a free WhatsApp chatbot answer customers 24/7?", a: "Some AI chatbot platforms are designed to respond outside staffed business hours. Actual availability depends on the service, its connection, any usage limit on the free plan, and any outages or restrictions." },
  { q: "Is there a free WhatsApp chatbot without a credit card?", a: "Yes. Wapzen is free to start and doesn’t ask for a credit card. Usage limits apply, so check how far the free start will take you before you rely on it." },
  { q: "Can I use a free WhatsApp chatbot with my existing number?", a: "Some platforms support existing numbers. The connection method varies: Wapzen uses linked-device functionality with a QR code or pairing code, while other providers use Meta’s Business Platform and may require different setup steps." },
  { q: "Can a free WhatsApp AI chatbot book appointments?", a: "An AI chatbot can assist with appointment requests. Confirming real bookings requires an appropriately configured calendar or booking integration and successful verification of the requested time slot." },
];

const sources = [
  { label: "WhatsApp Business app features", href: "https://whatsappbusiness.com/products/business-app-features/" },
  { label: "WhatsApp Business Messaging Policy", href: "https://whatsappbusiness.com/policy/" },
  { label: "WhatsApp Help Center: How to link a device", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "what-is-it",
    title: "What is a free WhatsApp AI chatbot?",
    body: <>
      <p>A free WhatsApp AI chatbot is software that uses artificial intelligence to respond to messages received through WhatsApp without requiring a paid chatbot subscription.</p>
      <p>Unlike a traditional autoresponder, an AI chatbot can interpret different questions, use business information to generate relevant answers, and maintain context during a conversation. For a fuller introduction, read <Link href="/blog/what-is-a-whatsapp-chatbot">what a WhatsApp chatbot is</Link>.</p>
      <p>For example, imagine a customer messages your clothing store:</p>
      <blockquote>“Do you have the black jacket in medium? And can I collect it tomorrow?”</blockquote>
      <p>A basic automatic reply might say:</p>
      <blockquote>“Thanks for contacting us! We’ll reply shortly.”</blockquote>
      <p>An AI chatbot with the right product information and inventory integration could identify the requested item, check whether the size is available, and explain the collection options.</p>
      <p>If live inventory isn’t connected, a responsible AI chatbot should say that availability needs to be confirmed rather than inventing an answer.</p>
      <p>That’s the difference between sending an automatic message and actually helping a customer.</p>
    </>,
  },
  {
    id: "really-free",
    title: "Are WhatsApp AI chatbots really free?",
    body: <>
      <p>Some are. However, free WhatsApp automation comes in several different forms. Some tools provide only basic automatic messages. Others offer temporary trials, limited conversation allowances, or AI features that require separate subscriptions.</p>
      <RowTable caption="Free WhatsApp automation options compared" columns={["What you get", "Main limitation"]} rows={options} highlight="Wapzen" />
      <p>The key distinction is that <strong>free software does not always mean zero operating cost</strong>.</p>
      <p>A platform might let you create a chatbot without paying, but still require an AI API key, hosting infrastructure, a WhatsApp Business Platform provider, or usage-based fees.</p>
      <p>Before signing up, examine the full pricing model rather than relying only on a “Start Free” button.</p>
    </>,
  },
  {
    id: "checklist",
    title: "The 12-point checklist for choosing a free WhatsApp AI chatbot",
    body: <>
      <p>Use this checklist to compare tools before connecting your real business number.</p>
      <h3>1. Does it provide real AI-generated answers?</h3>
      <p>A genuine AI chatbot should respond to the meaning of a message, not simply match predefined keywords.</p>
      <p>Ask an unexpected question during testing. Then ask the same question using different wording.</p>
      <p>If the system can only send a fixed response, it may still be useful, but it isn’t the same as a conversational AI agent.</p>
      <h3>2. Can it learn your business information?</h3>
      <p>A useful chatbot needs accurate knowledge about your products and services.</p>
      <p>Look for support for FAQs, service descriptions, pricing, opening hours, delivery terms, and company policies.</p>
      <p>Document uploads can be convenient, but always verify that the chatbot retrieves the correct information.</p>
      <h3>3. Is it free beyond the first few conversations?</h3>
      <p>Check whether the advertised free plan has limits on monthly messages, conversations, AI usage, connected phone numbers, or active agents.</p>
      <p>If a provider says its service is currently free, check whether that is a permanent commitment or simply its present pricing model.</p>
      <h3>4. Do you need a new WhatsApp number?</h3>
      <p>Some systems use Meta’s official WhatsApp Business Platform. Others connect an existing personal or Business account as a linked device.</p>
      <p>These approaches are technically different and can have different requirements, capabilities, and risks.</p>
      <p>Choose based on your business needs, not only setup speed.</p>
      <h3>5. Does it require coding?</h3>
      <p>No-code platforms are generally easier for owners who want to manage the chatbot themselves.</p>
      <p>Custom-built systems provide more flexibility but may require development, hosting, and ongoing maintenance.</p>
      <h3>6. Can it answer questions in your customers’ languages?</h3>
      <p>If your customers use English, Hindi, Bengali, Spanish, Arabic, or other languages, test the chatbot using realistic messages.</p>
      <p>Don’t assume that a tool supporting multiple languages will correctly understand every regional expression or product name.</p>
      <h3>7. Can it perform business actions?</h3>
      <p>Some AI chatbots can connect to external systems for tasks such as checking order status or requesting appointments.</p>
      <p>These actions require correctly configured integrations. The chatbot should never confirm that an action succeeded without an actual confirmation from the relevant system.</p>
      <h3>8. Can you review conversations?</h3>
      <p>Conversation history helps you discover incorrect answers, unanswered questions, and opportunities to improve your knowledge base.</p>
      <p>A dashboard that makes these interactions visible is valuable, especially during the first few weeks.</p>
      <h3>9. Can customers reach a human?</h3>
      <p>Automation shouldn’t become a barrier between your business and its customers.</p>
      <p>Check whether the chatbot can provide a reliable escalation route when customers ask for help beyond its capabilities.</p>
      <h3>10. Does it also support voice calls?</h3>
      <p>Not every business needs this, but it can be useful if customers frequently call instead of typing.</p>
      <p>If a platform offers AI calling, check which calls are supported, how they are billed, and whether they work through WhatsApp or ordinary telephone networks.</p>
      <h3>11. What happens when something fails?</h3>
      <p>Test unavailable integrations, missing information, repeated messages, and temporary disconnections.</p>
      <p>A reliable chatbot should acknowledge uncertainty rather than claim a task was completed.</p>
      <h3>12. Is the connection appropriate for your business?</h3>
      <p>Review the provider’s connection method, data-handling practices, applicable WhatsApp rules, and support arrangements.</p>
      <p>This is especially important when automating a business-critical number or processing sensitive customer information.</p>
      <InlineCta title="Try the checklist on a real agent" body="Wapzen is free to start: create an AI chat agent, add your FAQs, and test it with the questions your customers ask." />
    </>,
  },
  {
    id: "seven-day-test",
    title: "How to evaluate a free WhatsApp chatbot in seven days",
    body: <>
      <p>Instead of choosing a platform based only on its feature list, run a small pilot. Here is a practical seven-day evaluation plan.</p>
      <Comparison caption="A seven-day plan for evaluating a free WhatsApp chatbot" columns={["What to do", "What to measure"]} rows={pilot} />
      <p>You don’t need hundreds of conversations to identify obvious problems.</p>
      <p>Start with realistic tests and gradually expand your evaluation. Don’t treat seven days as proof that an agent will handle every future situation.</p>
    </>,
  },
  {
    id: "scorecard",
    title: "A simple free chatbot evaluation scorecard",
    body: <>
      <p>Give each platform a score from 0 to 5 for the following categories:</p>
      <Comparison caption="Scorecard for comparing free WhatsApp chatbots" columns={["Maximum score"]} rows={scorecard} />
      <p>A high total score doesn’t override a critical privacy or reliability problem.</p>
      <p>For example, if a chatbot regularly gives incorrect refund information, that issue should be resolved even if its setup experience is excellent.</p>
      <p>This scorecard is an editorial comparison framework, not an independently validated industry standard.</p>
    </>,
  },
  {
    id: "business-app",
    title: "Free WhatsApp chatbot versus the WhatsApp Business app",
    body: <>
      <p>One common question is whether you need an external chatbot when the WhatsApp Business app is already free. For simple requirements, you may not.</p>
      <p>The WhatsApp Business app provides built-in greeting messages, away messages, and quick replies. These can be useful if your only goal is to acknowledge a message or tell customers when your team will return.</p>
      <p>But consider a customer who asks:</p>
      <blockquote>“Is the 12-month package cheaper than paying monthly? And do you offer weekend appointments?”</blockquote>
      <p>A standard away message cannot independently research your business information and answer both questions.</p>
      <p>A properly configured conversational AI chatbot can interpret the request, retrieve relevant information, and explain the differences.</p>
      <p><strong>Choose basic automatic messages if you only need acknowledgments. Choose conversational AI if customers regularly ask questions that require specific answers.</strong></p>
    </>,
  },
  {
    id: "without-api",
    title: "What about free WhatsApp chatbots without the Business API?",
    body: <>
      <p>Many businesses encounter the WhatsApp Business API while researching automation.</p>
      <p>Meta’s official WhatsApp Business Platform provides a structured way to build business messaging integrations, with its own technical requirements, pricing, and messaging policies.</p>
      <p>Some third-party services instead connect to WhatsApp using linked-device functionality.</p>
      <p>Wapzen uses this second approach: users connect their existing WhatsApp number with a QR code or a pairing code. Our guide to <Link href="/blog/whatsapp-chatbot-without-business-api">building a chatbot without the Business API</Link> shows the steps.</p>
      <p>This can reduce setup complexity and avoid Meta Business Platform message charges.</p>
      <p>However, a linked-device connection is not equivalent to official Business Platform authorization. Before relying on such a service, evaluate stability, privacy, WhatsApp’s applicable terms, and the consequences of a connection interruption or account restriction.</p>
      <p>An easier setup process should not be the only factor in choosing a business communication system.</p>
    </>,
  },
  {
    id: "wapzen",
    title: "How Wapzen fits into the free WhatsApp AI chatbot market",
    body: <>
      <p><Link href="/">Wapzen</Link> offers a no-code WhatsApp AI chatbot with a different starting point from many subscription-based platforms.</p>
      <p>Wapzen is free to start, with no credit card and no separate OpenAI or Anthropic API key required.</p>
      <p>Its features include:</p>
      <ul>
        <li>AI replies based on your business’s information.</li>
        <li>Support for text, PDF, and Word knowledge sources.</li>
        <li>QR-code or pairing-code linking for existing personal or WhatsApp Business numbers.</li>
        <li>Optional API tools for connected business workflows.</li>
        <li>A built-in Take Order tool that saves confirmed orders to your dashboard.</li>
        <li>Conversation history.</li>
      </ul>
      <p>That makes it worth evaluating if you want to experiment with a free AI chatbot and prefer a no-code setup.</p>
      <p>The important words are <strong>free to start</strong>. The free start has usage limits, and higher volumes need a paid plan, so run item 3 of the checklist on Wapzen too and ask about a paid plan before you build a busy number around it.</p>
      <Note>Wapzen’s chat agent reads text, not voice notes or the contents of images, and it doesn’t reply in groups. It remembers only the last few minutes of a chat. An API tool doesn’t run on every message that should trigger it, so test each one several times. Wapzen is an independent product, not made by Meta or WhatsApp.</Note>
    </>,
  },
  {
    id: "verdict",
    title: "Final verdict: choose the chatbot that solves real customer problems",
    body: <>
      <p>The best free WhatsApp AI chatbot isn’t necessarily the one with the longest feature list.</p>
      <p>It’s the one that reliably answers the questions your customers actually ask, works within your operating requirements, and makes your business easier to manage.</p>
      <p>Start with a small pilot. Measure accuracy. Review difficult conversations. Understand the connection method and costs.</p>
      <p>Then expand automation only when you’re confident in the results.</p>
      <p>Want to see how it works with your business information? <Link href="/free-whatsapp-chatbot">Create your free AI chatbot with Wapzen</Link>: configure an agent, add your FAQs, and test it using the questions your customers ask every day. The <Link href="/blog/whatsapp-ai-auto-reply-customer-conversations">12 customer conversations in our AI auto-reply guide</Link> make a good first test.</p>
    </>,
  },
];

export default function BestFreeWhatsAppAiChatbotGuidePage() {
  return <BlogPost
    href={href}
    heading={<>Free WhatsApp AI chatbot.<br /><span>How to choose the best one in 2026.</span></>}
    lead="You don’t need a large customer support team to provide great service on WhatsApp. But you do need a reliable way to answer customers when you’re busy, away from your phone, or closed for the day. That’s why more business owners are searching for a free WhatsApp AI chatbot, and why it pays to work out what “free” actually means first."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Judge five things:</strong> answer quality, total cost, WhatsApp connection method, business integrations, and reliability.</>,
        <><strong>Free isn’t always zero cost:</strong> a platform may still need an AI API key, hosting, a Business Platform provider, or usage-based fees.</>,
        <><strong>Test before you commit:</strong> run a seven-day pilot with your real questions, then score each platform out of 40.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/what-is-a-whatsapp-chatbot", "/blog/whatsapp-chatbot-without-business-api"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Free is only useful if it works.<br /><span>Test it on your own questions.</span></>, body: "Create an AI chat agent, add your FAQs, and connect your WhatsApp number. It’s free to start." }}
  />;
}
