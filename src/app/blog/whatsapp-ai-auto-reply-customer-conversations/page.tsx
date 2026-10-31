import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp ai auto reply". Every conversation is an illustration, so
// don't call them real. What the post says about Wapzen follows
// whiskey-bailey-server: "free to start" with usage limits, no per-chat pause
// (sample 12 must not promise the bot will stop), and no voice for now.
const href = "/blog/whatsapp-ai-auto-reply-customer-conversations";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const conversationTypes = [
  ["Low-risk, information-based", "AI can usually answer from verified content", "Business hours, standard product information, delivery policy"],
  ["Requires live verification", "AI should use an approved connected system", "Order status, inventory, appointment availability"],
  ["High-risk or unresolved", "Escalate to an authorized person or process", "Sensitive account changes, disputed refunds, serious complaints"],
];

const faqs = [
  { q: "What is the best free WhatsApp AI auto-reply bot?", a: "The best option depends on whether you need fixed messages or conversational AI. The WhatsApp Business app works for basic greetings and away messages. Wapzen is a free-to-start option for AI-generated replies based on business information, with usage limits on the free start." },
  { q: "How do I make WhatsApp reply automatically using AI?", a: "You need an AI chatbot service connected to your WhatsApp number. Configure the agent’s instructions, provide accurate business information, connect the number using the supported method, and test conversations before relying on automation." },
  { q: "Can WhatsApp Business automatically answer customer questions?", a: "Its built-in greeting and away messages send predefined text. For more flexible conversational answers, businesses can use an appropriate AI system or supported business AI features." },
  { q: "Can AI reply to WhatsApp messages at night?", a: "An AI chatbot can be configured to respond outside working hours, subject to the platform and connection remaining available. It should use accurate business hours and avoid promising services that aren’t actually available overnight." },
  { q: "Can I use ChatGPT for WhatsApp auto replies?", a: "Businesses can build conversational WhatsApp agents using GPT models through compatible platforms and integrations. An AI model by itself is not a complete WhatsApp automation service; it needs a supported connection and business-specific configuration." },
  { q: "Is a free WhatsApp AI auto-reply tool suitable for small businesses?", a: "It can be useful for testing routine customer-support automation. Small businesses should still review response accuracy, total costs, usage limits, privacy, WhatsApp connection requirements, and how customers can reach a person." },
];

const sources = [
  { label: "WhatsApp Business app features", href: "https://whatsappbusiness.com/products/business-app-features/" },
  { label: "WhatsApp Business Messaging Policy", href: "https://whatsappbusiness.com/policy/" },
  { label: "WhatsApp Help Center: How to link a device", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "what-is-it",
    title: "What is WhatsApp AI auto reply?",
    body: <>
      <p>WhatsApp AI auto reply is a method of automatically responding to incoming WhatsApp messages using artificial intelligence.</p>
      <p>Unlike a traditional autoresponder, which sends predefined text, an AI chatbot interprets the customer’s message and generates a response using its instructions, conversation context, and available business information.</p>
      <p>For example:</p>
      <p><strong>Traditional auto reply:</strong></p>
      <blockquote>“Thank you for contacting us. Our team will respond during business hours.”</blockquote>
      <p><strong>AI auto reply:</strong></p>
      <blockquote>“Yes, we offer home delivery in your area. Delivery normally takes two business days according to our current shipping policy. Would you like details about the delivery charges?”</blockquote>
      <p>The second response is more useful because it addresses the customer’s question.</p>
      <p>However, the AI must have access to the correct shipping policy. It shouldn’t guess delivery times or prices.</p>
    </>,
  },
  {
    id: "examples",
    title: "12 WhatsApp AI auto-reply examples for business",
    body: <>
      <p>The following scenarios show where AI can provide more value than a simple automatic message.</p>
      <Note>All conversations below are illustrative examples, not actual customer transcripts or verified performance results.</Note>

      <h3>1. Answering two questions in one message</h3>
      <p><strong>Customer:</strong> “How much is your premium package and does it include installation?”</p>
      <p><strong>AI agent:</strong> “Our Premium package is $149, and installation is included according to our current service information. Are you looking for installation at your home or office?”</p>
      <p><strong>Why it works:</strong> The agent addresses both parts of the question and asks a relevant follow-up.</p>
      <p><strong>Important rule:</strong> The example price and installation terms are fictional. An actual agent must use verified information from your business.</p>
      <p>Multi-question messages are common in customer service, and a good AI chatbot should avoid replying to only one part.</p>

      <h3>2. Helping customers choose between products</h3>
      <p><strong>Customer:</strong> “What’s the difference between your Basic and Pro plans? I don’t know which one I need.”</p>
      <p><strong>AI agent:</strong> “Basic is designed for customers who need [Basic feature], while Pro includes [additional feature]. What will you mainly use the service for? I can help you compare them.”</p>
      <p><strong>Why it works:</strong> The agent helps the customer make a decision instead of simply listing products.</p>
      <p><strong>Important rule:</strong> AI should recommend products only using genuine product specifications, not invented advantages.</p>
      <p>This type of conversation can be especially useful for subscription businesses, service providers, and online stores.</p>

      <h3>3. Checking delivery availability</h3>
      <p><strong>Customer:</strong> “Do you deliver to my postcode?”</p>
      <p><strong>AI agent:</strong> “I can help check. Please share your delivery postcode. I’ll compare it with the locations listed in our delivery policy.”</p>
      <p><strong>Customer:</strong> “SW1A 1AA.”</p>
      <p><strong>AI agent:</strong> “According to our published delivery area list, [verified delivery result]. Would you like to see the delivery options?”</p>
      <p><strong>Why it works:</strong> The agent asks for the missing information before making a claim.</p>
      <p><strong>Important rule:</strong> If delivery eligibility changes frequently, a live shipping integration is better than a static document.</p>
      <p>The agent should never promise delivery to a location that your business hasn’t confirmed it serves.</p>

      <h3>4. Responding to an out-of-stock product</h3>
      <p><strong>Customer:</strong> “I need the black hoodie in medium. Is it available?”</p>
      <p><strong>AI agent:</strong> “I can help you check. Let me confirm the current availability for the black hoodie in medium.”</p>
      <p>If a connected inventory system confirms that the item is unavailable, the agent could respond:</p>
      <blockquote>“That size is currently unavailable. Would you like to check another color or a similar product?”</blockquote>
      <p><strong>Why it works:</strong> The bot guides the customer toward another option without inventing stock information.</p>
      <p><strong>Important rule:</strong> An AI model alone cannot guarantee real-time inventory accuracy. A verified inventory source is needed for live stock claims.</p>

      <h3>5. Handling appointment requests</h3>
      <p><strong>Customer:</strong> “Can I book an appointment this Friday afternoon?”</p>
      <p><strong>AI agent:</strong> “Certainly. Is this for an initial consultation or an existing service? I can then help check the appropriate availability.”</p>
      <p><strong>Customer:</strong> “Initial consultation.”</p>
      <p><strong>AI agent:</strong> “Thanks. I’ll check the available Friday afternoon slots.”</p>
      <p>After a successful booking-system response, the agent can present available options or confirm a completed booking.</p>
      <p><strong>Why it works:</strong> The conversation collects the information needed to move toward a booking.</p>
      <p><strong>Important rule:</strong> Don’t say “Your appointment is confirmed” unless the connected calendar actually created the appointment.</p>
      <p>Without a booking integration, the AI can collect a request and explain that someone must confirm it. Our <Link href="/blog/whatsapp-appointment-booking">WhatsApp appointment booking guide</Link> compares the options.</p>

      <h3>6. Answering order-status questions</h3>
      <p><strong>Customer:</strong> “Where is my order? I paid three days ago.”</p>
      <p><strong>AI agent:</strong> “I can help you check its status. Please provide your order reference through our approved verification process.”</p>
      <p>After securely verifying the customer and receiving an order-system response:</p>
      <blockquote>“Your order is currently marked as dispatched. The tracking information available in our system is [verified tracking information].”</blockquote>
      <p><strong>Why it works:</strong> The chatbot uses the customer’s actual order information rather than providing a generic message.</p>
      <p><strong>Important rule:</strong> Don’t expose account or order details without the necessary verification. If the order system is unavailable, the agent should explain that it cannot check the current status. Our <Link href="/blog/whatsapp-order-tracking-bot">WhatsApp order tracking guide</Link> covers this flow in detail.</p>

      <h3>7. Explaining refund policies</h3>
      <p><strong>Customer:</strong> “I bought something last week and want to return it. Can I get my money back?”</p>
      <p><strong>AI agent:</strong> “I can explain our return policy. According to our current policy, [verified eligibility conditions]. Could you tell me when you received the item and whether it has been used?”</p>
      <p><strong>Why it works:</strong> The bot helps the customer understand the relevant conditions before they begin the return process.</p>
      <p><strong>Important rule:</strong> Do not guarantee a refund unless the business policy and applicable law support that outcome.</p>
      <p>This is an area where precise instructions matter more than a persuasive tone.</p>

      <h3>8. Answering questions outside business hours</h3>
      <p><strong>Customer:</strong> “Are you open tomorrow? And can I come without an appointment?”</p>
      <p><strong>AI agent:</strong> “Our published hours for tomorrow are [verified hours]. According to our visiting policy, [appointment requirement]. Would you like help planning your visit?”</p>
      <p><strong>Why it works:</strong> The business can provide useful information even when employees aren’t online.</p>
      <p><strong>Important rule:</strong> If tomorrow is a holiday or the hours are uncertain, the bot should acknowledge that rather than assume the normal schedule applies.</p>
      <p>A 24/7 chatbot doesn’t mean every service is available 24/7. It means the customer can receive assistance outside staffed hours.</p>

      <h3>9. Responding to requests for discounts</h3>
      <p><strong>Customer:</strong> “Can you give me 20% off if I buy today?”</p>
      <p><strong>AI agent:</strong> “I can check our current offers. The promotions available in our information are [verified offers]. I can’t approve a discount that isn’t listed, but I can help you compare the available options.”</p>
      <p><strong>Why it works:</strong> The chatbot remains helpful without inventing promotional offers.</p>
      <p><strong>Important rule:</strong> The AI should never negotiate beyond pricing limits approved by the business.</p>
      <p>This protects margins and reduces the risk of customers being promised discounts that staff cannot honor.</p>

      <h3>10. Understanding multilingual messages</h3>
      <p><strong>Customer:</strong> “Bhai, delivery koto din lagbe?”</p>
      <p>This is a Bengali-English conversational message asking how many days delivery will take.</p>
      <p><strong>AI agent:</strong> “Delivery time depends on your location. Apnar delivery area ba postcode ta bolben? Ami available information check kore bolchi.”</p>
      <p><strong>Why it works:</strong> A multilingual agent can understand the customer’s preferred way of communicating and ask for the information needed to help.</p>
      <p><strong>Important rule:</strong> Test the actual languages and language combinations your customers use. Do not assume fluent-sounding replies are always factually accurate.</p>
      <p>For businesses serving international or multilingual audiences, language flexibility can be a practical benefit.</p>

      <h3>11. Managing an unhappy customer</h3>
      <p><strong>Customer:</strong> “This is ridiculous. I’ve contacted you three times and nobody has fixed my problem!”</p>
      <p><strong>AI agent:</strong> “I’m sorry you’ve had to follow up repeatedly. I don’t want to make you repeat everything again. Could you briefly confirm the issue? I can help identify the next step and explain how to reach our support team.”</p>
      <p><strong>Why it works:</strong> The bot recognizes frustration and avoids treating the conversation like an ordinary sales inquiry.</p>
      <p><strong>Important rule:</strong> Repeated unresolved complaints should trigger a clear route to human support. The AI shouldn’t claim that a human has been notified unless that notification actually occurred.</p>
      <p>A chatbot’s job isn’t to win an argument with the customer. It’s to move the conversation toward a resolution.</p>

      <h3>12. Recognizing when a customer wants a person</h3>
      <p><strong>Customer:</strong> “Stop sending automated messages. I want to speak with someone.”</p>
      <p><strong>AI agent:</strong> “Understood. You can reach our support team directly through [verified contact method].”</p>
      <p><strong>Why it works:</strong> The agent respects the customer’s request instead of forcing them through additional automated questions.</p>
      <p><strong>Important rule:</strong> The business needs an actual, accessible human-support process. A chatbot must not pretend that a handoff has happened if no transfer capability exists, or promise to stop replying unless it really can.</p>
    </>,
  },
  {
    id: "which-messages",
    title: "Which WhatsApp messages should businesses automate?",
    body: <>
      <p>Not all conversations are equally suitable for AI. A useful approach is to divide them into three categories.</p>
      <Comparison caption="Which WhatsApp conversations to automate and which to escalate" columns={["Recommended approach", "Example"]} rows={conversationTypes} />
      <p>This model helps businesses automate routine work without giving the AI unlimited authority.</p>
      <p>Start with low-risk questions, then expand to connected workflows after testing.</p>
    </>,
  },
  {
    id: "configure",
    title: "How to configure useful WhatsApp AI auto replies",
    body: <>
      <p>The quality of your chatbot depends partly on the information and rules you give it. Before connecting your number, prepare the following information.</p>
      <ul>
        <li><strong>Your business facts:</strong> Name, operating hours, locations, products, services, and verified prices.</li>
        <li><strong>Your customer-service policies:</strong> Delivery terms, returns, refunds, cancellations, and escalation contacts.</li>
        <li><strong>Your agent boundaries:</strong> What the chatbot is allowed to answer, what it must verify, and which actions require human approval.</li>
        <li><strong>Your integrations:</strong> Identify which live systems the agent will need for inventory, bookings, or order tracking.</li>
        <li><strong>Your review process:</strong> Decide who will check conversations and correct inaccurate answers.</li>
      </ul>
      <p>You don’t need to automate your entire business on day one.</p>
      <p>Begin with the questions your team answers repeatedly and make sure the agent handles them correctly.</p>
    </>,
  },
  {
    id: "free",
    title: "Can you set up WhatsApp AI auto reply for free?",
    body: <>
      <p>Yes. There are free options, but they serve different purposes.</p>
      <p>The WhatsApp Business app provides built-in greeting and away messages. Those are useful for acknowledging customers, but they are fixed messages rather than full conversational AI responses. We collected <Link href="/blog/whatsapp-business-greeting-message">40 greeting message examples</Link> if that’s all you need.</p>
      <p>For an AI-powered option, <Link href="/whatsapp-auto-reply">Wapzen’s WhatsApp auto reply</Link> is a no-code chatbot that replies using business information. It’s free to start: the free start has usage limits, and higher volumes need a paid plan.</p>
      <p>You can configure an agent, add business documents or FAQs, and connect an existing WhatsApp number with a QR code or pairing code. You do not need to buy an AI API key separately.</p>
      <p>Its connection is not Meta’s official WhatsApp Business Platform. Businesses should consider the reliability, policy, and privacy implications of third-party linked-device connections before using them for critical operations.</p>
      <Note>If you test these conversations on Wapzen: the agent reads text, not voice notes or the contents of images, and it remembers only the last few minutes of a chat. Live checks like samples 3 to 6 need an API tool, and a tool doesn’t run on every message that should trigger it, so test each one several times and treat “one moment, I’ll check” with no result as a failure. An agent has no per-chat pause: it answers every message until you pause the agent, which stops it for all chats, so sample 12 needs a real contact route.</Note>
      <InlineCta title="Turn repeat questions into useful replies" body="Free to start: an AI chat agent on your existing number that answers from your own business information." />
    </>,
  },
  {
    id: "measure",
    title: "How to measure whether AI auto replies are helping",
    body: <>
      <p>Don’t judge your chatbot only by the number of messages it sends. Track the quality and outcomes of the conversations.</p>
      <p>Four useful measures are:</p>
      <ul>
        <li><strong>Verified resolution rate:</strong> The share of eligible customer requests that AI actually solves correctly.</li>
        <li><strong>Escalation quality:</strong> Whether customers who need a person can reach the appropriate support channel.</li>
        <li><strong>Repeat-contact rate:</strong> How often customers return with the same unresolved issue.</li>
        <li><strong>Answer accuracy:</strong> Whether the chatbot’s statements match your current business information.</li>
      </ul>
      <p>For example, answering 500 conversations sounds impressive. But if 200 customers need to message again because the answers were incomplete, that activity doesn’t represent 500 successful resolutions.</p>
      <p>Review a representative sample of conversations and improve the source information whenever repeated errors appear.</p>
    </>,
  },
  {
    id: "mistakes",
    title: "Common WhatsApp AI auto-reply mistakes",
    body: <>
      <h3>Giving the AI outdated information</h3>
      <p>If your business changes prices or policies but the chatbot still uses old documents, it may provide incorrect answers.</p>
      <p>Make knowledge-base updates part of your normal operations.</p>
      <h3>Allowing the chatbot to invent answers</h3>
      <p>An AI agent should be instructed to explain uncertainty and provide an appropriate alternative when it lacks verified information.</p>
      <p>A careful answer is better than a confident false promise.</p>
      <h3>Claiming that a task was completed without confirmation</h3>
      <p>An agent should not claim it booked an appointment, updated an order, or notified support unless the relevant system confirms that action.</p>
      <h3>Automating every customer interaction</h3>
      <p>Some interactions require empathy, judgment, authorization, or secure human assistance.</p>
      <p>Automation should make support easier, not remove access to people.</p>
      <h3>Sending unwanted messages</h3>
      <p>WhatsApp business messaging is subject to applicable rules, consent requirements, and restrictions on unsolicited communication.</p>
      <p>In particular, official Business Platform messaging has specific template and customer-service-window requirements, while other connection methods have different technical and policy considerations.</p>
      <p>A tool that can send messages does not automatically mean every messaging use case is permitted.</p>
    </>,
  },
  {
    id: "final-thoughts",
    title: "Final thoughts",
    body: <>
      <p>Customers don’t message your business because they want to receive an automatic greeting.</p>
      <p>They message because they have a question, need help making a decision, or want something resolved.</p>
      <p>That’s why an effective WhatsApp AI auto-reply system should do more than acknowledge messages.</p>
      <p>It should understand the question, use correct business information, explain what it can and cannot do, and guide the customer toward the next appropriate step.</p>
      <p>Start with a few common conversations. Test them carefully. Then expand.</p>
      <p>Still choosing a platform? Our guide to <Link href="/blog/best-free-whatsapp-ai-chatbot-guide">choosing a free WhatsApp AI chatbot</Link> has a checklist and a seven-day test. Otherwise, <Link href="/free-whatsapp-chatbot">try Wapzen’s free WhatsApp AI chatbot</Link> and run these scenarios with your own business information.</p>
    </>,
  },
];

export default function WhatsAppAiAutoReplyCustomerConversationsPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp AI auto reply.<br /><span>12 customer conversations to automate.</span></>}
    lead="A customer messages your business at 10:43 PM: “Hi, is the blue one available? Can I get it delivered tomorrow?” Nobody is available to answer, and by morning they’ve bought from another store. A WhatsApp AI auto-reply system is designed to address exactly that, as long as you know which conversations to automate and what it should never say."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>What it does:</strong> interprets each customer’s message and replies from your instructions and business information, instead of sending everyone the same text.</>,
        <><strong>What to automate first:</strong> low-risk questions answered from verified content, then connected workflows such as order status once they’re tested.</>,
        <><strong>What to keep with people:</strong> disputed refunds, sensitive account changes, serious complaints, and anyone who asks for a person.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/best-free-whatsapp-ai-chatbot-guide", "/blog/whatsapp-auto-reply-personal-account"]}
    product="/whatsapp-auto-reply"
    cta={{ heading: <>Don’t just acknowledge the message.<br /><span>Answer it.</span></>, body: "Create an AI chat agent, add your business information, and connect your WhatsApp number. It’s free to start." }}
  />;
}
