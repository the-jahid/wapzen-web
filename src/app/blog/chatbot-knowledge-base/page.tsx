import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "chatbot knowledge base" / "ai knowledge base" / "rag chatbot" /
// "train ai on your own data" (50, 5/5), "knowledge base for chatbot" /
// "knowledge base examples" / "how to train chatbot on your own data" /
// "knowledge base best practices" (40), "chatbot training data" (36), "faq
// chatbot" (34), autocomplete 2026-10-30 (docs/seo-blog-playbook-research.mjs).
// The retrieval numbers must match the server: a chat reply searches with the
// message plus the last 4 messages, takes up to 4 passages, and passes at most
// 3,000 characters of them, titles included; chunks default to 2,000/400
// characters; files are refused over 300,000 characters; no URL sources.
const href = "/blog/chatbot-knowledge-base";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const contents = [
  ["The basics", "Opening hours, address and landmarks, contact numbers, areas you serve"],
  ["What you sell", "Each product or service with its price, sizes or durations, and what’s included"],
  ["Policies", "Delivery times and charges, payment methods, returns, cancellations, warranties"],
  ["How things work", "How to book, order, pay, or reschedule, step by step"],
  ["Real questions", "The 30 questions customers actually ask, in their words, with your answers"],
  ["What you don’t do", "“We don’t ship abroad”, “No home visits”, “No walk-ins on Sundays”"],
];

const before = `Our Services
We offer a wide range of premium services. Please see the
table below for details. Prices are subject to change.
[a table pasted from a PDF: Service | 30 min | 60 min ...]
For the above, discounts apply on weekdays. See above.`;

const after = `Haircut prices at Glow Salon (updated October 2026)
Women's haircut: ₹600 for short hair, ₹800 for long hair.
Men's haircut: ₹350. Kids under 10: ₹250.
Weekday discount: 10% off haircuts Monday to Thursday, before 4 pm.

Do I need an appointment for a haircut at Glow Salon?
Walk-ins are welcome Monday to Saturday. On Sundays we take
appointments only. Book on WhatsApp or call 98XXXXXXXX.`;

const chunkSizes = [
  ["FAQs and short facts", "700–1,000", "200–400", "Three or four separate answers fit in what the AI reads per reply"],
  ["Policies and guides", "1,500–2,000 (the default)", "400 (the default)", "Keeps each section’s steps together"],
  ["Long product documents", "2,000–3,000", "400–600", "Fewer, larger passages for detailed specs"],
];

const faqs = [
  { q: "What is a chatbot knowledge base?", a: "It's the set of documents an AI chatbot answers from: prices, policies, product details, and FAQs. For each message, the chatbot finds the most relevant passages and writes its reply from them, so its answers are only as good, and as current, as what you put in." },
  { q: "Can I train a chatbot on my own data?", a: "Yes, and usually without training a model at all. Upload your documents to a knowledge base: they're split into passages and searched for every question, a method called retrieval-augmented generation (RAG). Updating the documents updates the answers straight away." },
  { q: "What file types can a knowledge base use?", a: "In Wapzen: PDF (with real text, not scans), Word .docx, plain text, Markdown, CSV, JSON, HTML, and a few other text formats, up to 10 files at a time and 10 MB each. You can also paste text straight in." },
  { q: "Can the chatbot read my website?", a: "Not by its address: Wapzen doesn't crawl websites. Copy the text of your key pages, such as prices, FAQ, and policies, into knowledge base sources. Cleaning it up as you paste usually gives better answers than a raw page would." },
  { q: "Why does my chatbot give wrong or vague answers?", a: "Usually because the fact is missing, outdated, contradicted somewhere else, or buried in a long passage the search doesn't match well. Add the missing answer in plain words, delete old versions, and split long documents into one topic per source." },
  { q: "How do I update the knowledge base?", a: "Delete the old source and add the new version. Sources can't be edited in place yet, so keep the originals in a folder on your computer, dated, and replace them whenever prices or policies change." },
];

const sources = [
  { label: "University of Minnesota: Structuring Content for RAG Chatbots", href: "https://conservancy.umn.edu/items/5b7d4cc8-9995-4d56-accd-a35af680bc68" },
  { label: "OpenAI: Retrieval guide", href: "https://developers.openai.com/api/docs/guides/retrieval" },
];

const sections = [
  {
    id: "how-it-works",
    title: "How a chatbot uses its knowledge base",
    body: <>
      <p>“Training an AI on your own data” rarely means training anything. Your documents are split into passages, and each passage is turned into numbers that capture its meaning. When a customer writes, the system looks for the passages closest in meaning to the message and hands those to the AI along with its instructions. This is called <strong>retrieval-augmented generation</strong>, or RAG.</p>
      <p>Here is what that looks like in Wapzen, for every chat reply:</p>
      <ol>
        <li>It searches with the customer’s message plus the last few messages, so a follow-up like “and for kids?” still finds the haircut prices.</li>
        <li>It takes the <strong>four best passages</strong> that are a reasonable match, and nothing below that bar.</li>
        <li>It gives the AI up to <strong>3,000 characters</strong> of them, each labelled with its source title, and tells it to say the answer wasn’t found rather than guess.</li>
      </ol>
      <p>Voice agents search the same way when they need a fact during a call. The lesson is the same for both: the AI never reads your whole knowledge base, only a few passages at a time. Every passage has to make sense on its own.</p>
    </>,
  },
  {
    id: "what-to-include",
    title: "What to put in it",
    body: <>
      <p>Start from the questions you already answer every day, not from your brochure:</p>
      <Comparison caption="What to include in a chatbot knowledge base" columns={["Examples"]} rows={contents} />
      <p>The last row matters more than it looks. Without “we don’t ship abroad”, the AI has no way to say no, and the customer gets a vague answer. Scroll back through your last hundred chats and note every question; that list is your first draft.</p>
      <p>Leave out how the agent should behave (that goes in its <Link href="/blog/ai-agent-system-prompt-examples">instructions</Link>), old offers, internal notes, and anything about individual customers.</p>
    </>,
  },
  {
    id: "write",
    title: "Write it so the AI finds the right answer",
    body: <>
      <p>The search matches meaning, so the way a passage is written decides whether it’s found. Compare a typical brochure page with the same facts rewritten:</p>
      <h3>Before</h3>
      <pre><code>{before}</code></pre>
      <h3>After</h3>
      <pre><code>{after}</code></pre>
      <ul>
        <li><strong>Name the subject in every paragraph.</strong> “Haircut prices at Glow Salon”, not “Our services”. A passage read on its own has no “above”.</li>
        <li><strong>Write questions the way customers type them,</strong> with the answer right under each.</li>
        <li><strong>Turn tables into sentences</strong> or “label: value” lines. Tables copied out of PDFs often come out scrambled.</li>
        <li><strong>Date anything that changes,</strong> and say how long an offer lasts.</li>
        <li><strong>Use your customers’ words.</strong> If they say “COD”, write “cash on delivery (COD)”. If they write in Hindi or Spanish, add the key answers in that language too.</li>
        <li><strong>One fact, one place.</strong> Two price lists that disagree produce answers that disagree.</li>
      </ul>
    </>,
  },
  {
    id: "split",
    title: "Split it into sources and chunks",
    body: <>
      <p>Add one <strong>source</strong> per topic: “Haircut prices”, “Colour and treatments”, “Booking and cancellation”, “Location and parking”. Clear source titles help twice: the AI sees the title above every passage, and you can find and replace one topic without touching the rest.</p>
      <p>Each source is then split into <strong>chunks</strong>, the passages the search returns. Wapzen keeps paragraphs whole where it can, then sentences. You set the sizes, in characters, for each knowledge base:</p>
      <Comparison caption="Suggested chunk sizes by type of content" columns={["Max chunk size", "Min chunk size", "Why"]} rows={chunkSizes} />
      <p>The default maximum, 2,000 characters, means one long passage can take up most of the 3,000 characters the AI reads per reply. For a knowledge base of short FAQs, a smaller maximum lets three or four different answers fit instead. New sizes apply to sources added after the change, so set them before you upload, or delete and re-add the sources afterwards.</p>
    </>,
  },
  {
    id: "files",
    title: "File formats and limits",
    body: <>
      <ul>
        <li><strong>Works well:</strong> pasted text, Word <code>.docx</code>, PDFs with real text, Markdown, plain text, CSV, JSON, and HTML files.</li>
        <li><strong>Doesn’t work:</strong> scanned PDFs and photos of menus, which contain no text to read; Wapzen refuses them with a message naming the file. Type the text out, or run the scan through a text-recognition tool first.</li>
        <li><strong>Limits:</strong> up to 10 files per upload, 10 MB each, and 300,000 characters of text per source. A bigger file is refused rather than cut short, so split it.</li>
        <li><strong>Websites:</strong> there’s no option to add a web address. Copy the page text in instead.</li>
        <li><strong>Titles:</strong> use plain letters, numbers, and punctuation, without the <code>#</code> sign, and keep each title unique.</li>
      </ul>
      <InlineCta title="Build a knowledge base your chatbot answers from" body="Free right now: upload your price list and FAQs to Wapzen, attach them to an AI agent, and link your WhatsApp number." />
    </>,
  },
  {
    id: "test",
    title: "Test it, then fix the gaps",
    body: <>
      <ol>
        <li><strong>Write 20 test questions</strong> from real chats, including two the knowledge base can’t answer and one vague follow-up like “how much for that?”.</li>
        <li><strong>Message your number from another phone</strong> and check every answer against your price list.</li>
        <li><strong>For each wrong answer, find the cause:</strong> missing fact, two facts that disagree, or the answer buried in a long passage. Fix the source, delete the old one, and add the new version.</li>
        <li><strong>Check the “not found” answers.</strong> When the AI can’t find something, the instructions should make it say so, which shows you exactly what to add.</li>
      </ol>
      <p>After launch, read a week of chats in the agent’s Conversation tab every Friday and add one answer for each question it fumbled. Most knowledge bases stop needing changes after a month or so, except for prices.</p>
      <Note>Sources can’t be edited or refreshed in place yet: to update one, delete it and add the new version. Keep your originals in a dated folder so it takes a minute.</Note>
    </>,
  },
  {
    id: "mistakes",
    title: "Five mistakes that cause bad answers",
    body: <>
      <ul>
        <li><strong>One giant brochure PDF.</strong> The answer is in there, but in passages full of marketing copy that match nothing well.</li>
        <li><strong>Facts in the instructions as well.</strong> When the instructions say ₹500 and the price list says ₹600, the AI picks one.</li>
        <li><strong>Old versions left in.</strong> Last year’s price list is still a match for “how much”.</li>
        <li><strong>Pictures of text.</strong> Menus, rate cards, and timetables saved as images give the AI nothing to read.</li>
        <li><strong>Vague titles</strong> like <code>doc1.pdf</code> or “Info”, which give the AI no clue what a passage is about.</li>
      </ul>
      <p>Get the knowledge base right and the rest is easy. For the next step, see <Link href="/blog/what-is-a-whatsapp-chatbot">what a WhatsApp chatbot is and how to set one up</Link>.</p>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device, so there’s no Business API account and no Meta message fees for its replies.</Note>
    </>,
  },
];

export default function ChatbotKnowledgeBasePage() {
  return <BlogPost
    href={href}
    heading={<>A chatbot knowledge base.<br /><span>That gives the right answers.</span></>}
    lead="How to build the knowledge base your AI chatbot answers from: how retrieval works, what to include, how to write and split it so the right passage is found, which files work, and how to test it and fix the gaps."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>How it works:</strong> for each message, the chatbot finds a few relevant passages and answers from them, so every passage must stand on its own.</>,
        <><strong>What to include:</strong> basics, prices, policies, step-by-step processes, real customer questions, and what you don’t do.</>,
        <><strong>How to write it:</strong> one topic per source, the subject named in every paragraph, tables turned into sentences, and dates on prices.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/ai-agent-system-prompt-examples", "/blog/what-is-a-whatsapp-chatbot"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Your answers, written once.<br /><span>Given every time.</span></>, body: "Create a free knowledge base, attach it to an AI agent, and link your WhatsApp number. It answers from your documents right away." }}
  />;
}
