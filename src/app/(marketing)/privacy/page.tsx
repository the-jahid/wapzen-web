import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/site";
import tools from "@/components/free-tools/FreeTools.module.css";
import styles from "@/components/marketing/Marketing.module.css";

// Every statement here describes what the Go and NestJS servers really do:
// what they save, skip and delete. Change the wording, and `updated`, whenever
// that behaviour or a provider below changes. Don't add a legal name, address
// or email until one exists.
const path = "/privacy";
const title = "Privacy Policy";
const description = "What Wapzen collects, how WhatsApp messages and calls are handled by our AI agents, which providers process them, and how to delete your data.";
const updated = { iso: "2026-10-30", label: "30 October 2026" };

export const metadata: Metadata = pageMetadata({ title, description, path });

const contact = <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">WhatsApp on {siteConfig.whatsapp.label}</a>;

const providers: Array<{ name: string; href: string; use: string }> = [
  { name: "Cloudflare", href: "https://www.cloudflare.com/privacypolicy/", use: "delivers and protects the website" },
  { name: "Vercel", href: "https://vercel.com/legal/privacy-policy", use: "hosts the website" },
  { name: "Render", href: "https://render.com/privacy", use: "runs our application servers" },
  { name: "Supabase", href: "https://supabase.com/privacy", use: "hosts our database" },
  { name: "Clerk", href: "https://clerk.com/legal/privacy", use: "handles sign-up, sign-in and account sessions" },
  { name: "OpenAI", href: "https://openai.com/policies/privacy-policy/", use: "generates AI replies, transcribes and speaks on calls, and indexes knowledge bases" },
  { name: "Anthropic", href: "https://www.anthropic.com/legal/privacy", use: "generates AI replies" },
  { name: "ElevenLabs", href: "https://elevenlabs.io/privacy-policy", use: "transcribes and speaks on calls" },
  { name: "Pinecone", href: "https://www.pinecone.io/privacy/", use: "stores the searchable index of knowledge bases" },
  { name: "WhatsApp (Meta)", href: "https://www.whatsapp.com/legal/privacy-policy", use: "carries messages and calls, under its own terms and privacy policy" },
];

const summary = [
  "We don't sell personal data, and we don't use it for advertising.",
  "To run an agent, we send message text and call audio to AI providers. Wapzen doesn't train AI models on it.",
  "We save call transcripts as text, not call audio.",
  "Our website has no advertising or analytics trackers.",
  "You can delete conversations, calls and knowledge sources from your dashboard, or ask us to close your account.",
];

const sections: Array<{ id: string; title: string; body: ReactNode }> = [
  {
    id: "who",
    title: "Who this policy covers",
    body: <>
      <p>Wapzen runs the website at wapzen.io and the service that connects AI chat and voice agents to WhatsApp numbers. This policy applies to people who visit the site, people with a Wapzen account, and people who message or call a business that uses Wapzen.</p>
      <p>Our role depends on the information. We decide how account and website information is used. For what passes through an agent, such as customer messages, call transcripts, leads and knowledge base files, the business that owns the account decides how it is used and we process it on that business&apos;s behalf.</p>
      <p>If you messaged or called a business that uses Wapzen, that business is your first contact for questions about your information. You can also contact us and we will help.</p>
    </>,
  },
  {
    id: "collect",
    title: "What we collect",
    body: <>
      <ul>
        <li><strong>Account details.</strong> Your email address, username and sign-in ID. Clerk handles passwords and social sign-in, so we don&apos;t see your password.</li>
        <li><strong>WhatsApp connection.</strong> The number you link, the encryption keys and session data that keep it linked, and the contact details WhatsApp syncs to a linked device, such as contact names and numbers.</li>
        <li><strong>Messages.</strong> On a number with a live chat agent, we save incoming one-to-one text messages, the sender&apos;s number and WhatsApp display name, and the replies sent. Group chats, status updates and channel posts are skipped, messages with no text aren&apos;t saved, and messages you send from your own phone aren&apos;t saved. Replies you send from the dashboard are saved.</li>
        <li><strong>Calls.</strong> The number on the other end, the time, duration and outcome, and a text transcript. Call audio is streamed to speech providers during the call and isn&apos;t kept by Wapzen.</li>
        <li><strong>Leads.</strong> The phone numbers, names and email addresses you add to outbound campaigns, with each lead&apos;s call status.</li>
        <li><strong>Agent setup.</strong> Your prompts and agent settings, the text and files you add to knowledge bases, and the addresses and credentials of API tools you configure.</li>
        <li><strong>Activity records.</strong> Sign-ins, attempts to link a number and their outcome, and how many AI replies each agent and number has sent.</li>
        <li><strong>Technical data.</strong> Our hosting providers process IP addresses and request logs to deliver and protect the service.</li>
        <li><strong>Support messages.</strong> If you contact us on WhatsApp, we receive your number and what you send us.</li>
      </ul>
      <p>We don&apos;t take card details on this website. If you arrange a paid plan with us, we keep the records needed for that arrangement.</p>
    </>,
  },
  {
    id: "browser",
    title: "Cookies and browser storage",
    body: <>
      <p>We use the cookies Clerk needs to keep you signed in. Your browser also stores your theme, dashboard mode and any agent API key you choose to save there. These settings stay in your browser.</p>
      <p>The free tools under <Link href="/tools">/tools</Link> run in your browser. Phone numbers and text you type into them aren&apos;t sent to us, and recent numbers are kept only on your device.</p>
    </>,
  },
  {
    id: "use",
    title: "How we use information",
    body: <>
      <ul>
        <li>To provide the service: keep numbers linked, run your agents, and show your conversations, calls and campaigns.</li>
        <li>To search your knowledge bases when an agent needs them.</li>
        <li>To apply usage limits, prevent abuse, and keep the service secure.</li>
        <li>To help when you ask for support, and to tell you about important changes.</li>
      </ul>
      <p>Where laws such as the GDPR require a legal basis, we rely on performing our contract with you, on our legitimate interest in running and protecting the service, on legal obligations, and on your consent where it is needed.</p>
    </>,
  },
  {
    id: "ai",
    title: "How AI agents handle messages and calls",
    body: <>
      <p>Linking a number makes Wapzen a linked device on that WhatsApp account, like WhatsApp Web. WhatsApp&apos;s end-to-end encryption protects a message on its way to the device, so messages are decrypted on our servers in order to be read and answered.</p>
      <p>When an agent replies, we send the message, recent conversation history, the agent&apos;s instructions and any relevant knowledge base text to an AI provider. On a call, audio is sent live to speech providers. Agents can also send information to API tools the business has set up, which are run by that business or the companies it chooses.</p>
      <p>AI replies are automated and can be wrong, so don&apos;t rely on them for medical, legal, financial or emergency decisions. Wapzen doesn&apos;t use agent replies to make decisions about you that have legal or similarly significant effects.</p>
    </>,
  },
  {
    id: "providers",
    title: "Who we share information with",
    body: <>
      <p>We share information with the providers below, only as needed to run the service. Each one handles it under its own terms and privacy policy.</p>
      <ul>{providers.map((provider) => <li key={provider.name}><a href={provider.href} target="_blank" rel="noopener noreferrer">{provider.name}</a>: {provider.use}.</li>)}</ul>
      <p>We may also disclose information if the law requires it, to protect people or the service, or as part of a merger or sale of the business. We don&apos;t sell personal data.</p>
    </>,
  },
  {
    id: "transfers",
    title: "Where information is processed",
    body: <>
      <p>Our main database is in Singapore, and our application servers run in Singapore and Germany. Our providers may process information in the United States and other countries, so it can leave the country you live in. Where the law requires it, we rely on the transfer safeguards our providers offer.</p>
    </>,
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: <>
      <ul>
        <li><strong>Conversations, calls and leads</strong> stay until you delete them or your account is closed. They don&apos;t expire automatically.</li>
        <li><strong>Knowledge base sources</strong> stay until you delete them, which also removes them from the search index.</li>
        <li><strong>Linked numbers.</strong> Disconnecting a number removes its connection record from your account.</li>
        <li><strong>Closed accounts.</strong> We delete the account and the information stored under it. Copies in provider backups and logs disappear on those providers&apos; own schedules.</li>
        <li><strong>Reply counts.</strong> We keep a count of AI replies against each WhatsApp number, even after the number is disconnected or the account is closed, so free limits can&apos;t be reset. The count holds the number and a total, not message content.</li>
      </ul>
    </>,
  },
  {
    id: "security",
    title: "Security",
    body: <>
      <p>We use access controls and encrypted connections to our providers, and each account can only reach its own data. No online service is completely secure, so we can&apos;t guarantee that information will never be exposed. If you think your account has been compromised, contact us straight away.</p>
    </>,
  },
  {
    id: "rights",
    title: "Your choices and rights",
    body: <>
      <p>Depending on where you live, including the EU, the UK, Brazil, California and India, you may have the right to access, correct, delete or receive a copy of your information, to object to or limit how it is used, and to withdraw consent. You may also complain to your local data protection authority.</p>
      <p>You can delete conversations, calls, leads, agents and knowledge sources in your dashboard and disconnect a number at any time. Unlinking Wapzen from WhatsApp on your phone also ends the connection. For anything else, including closing your account, contact us on {contact}. We aim to reply within 30 days.</p>
      <p>If your information reached us through a business that uses Wapzen, we may need to pass your request to that business.</p>
    </>,
  },
  {
    id: "businesses",
    title: "If you use Wapzen for your business",
    body: <>
      <p>You are responsible for your use of Wapzen with your customers and contacts. That includes telling them they are dealing with an AI agent where the law requires it, having a lawful reason to contact the leads you upload, respecting opt-outs, and following WhatsApp&apos;s terms. Only add the personal or sensitive information your agents really need.</p>
      <p>Wapzen isn&apos;t affiliated with or endorsed by WhatsApp or Meta.</p>
    </>,
  },
  {
    id: "children",
    title: "Children",
    body: <>
      <p>Wapzen is a business tool and isn&apos;t meant for anyone under 16. If you believe a child has given us personal information, contact us and we will delete it.</p>
    </>,
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: <>
      <p>When this policy changes, we update it here and change the date at the top. If a change is significant, we will also tell account holders.</p>
      <p>For privacy questions or requests, contact us on {contact}. You can read more <Link href="/about">about Wapzen</Link> too.</p>
    </>,
  },
];

function jsonLd() {
  const url = `${siteConfig.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: "en",
        dateModified: updated.iso,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteConfig.name, item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },
    ],
  };
}

export default function PrivacyPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }} />
    <header className={tools.hero}>
      <nav className={tools.crumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
      <span className={tools.eyebrow}><span />Legal</span>
      <h1 className={tools.title}>Privacy <span>policy.</span></h1>
      <p className={tools.lead}>What we collect, how your WhatsApp messages and calls are handled, and how to delete your data.</p>
      <p className={styles.legalDate}>Last updated <time dateTime={updated.iso}>{updated.label}</time></p>
    </header>

    <div className={styles.legal}>
      <aside className={styles.legalSummary} aria-labelledby="summary-title">
        <h2 id="summary-title">The short version</h2>
        <ul>{summary.map((point) => <li key={point}>{point}</li>)}</ul>
      </aside>

      <nav className={styles.legalToc} aria-label="On this page">
        <ol>{sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
      </nav>

      {sections.map((section, i) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
        <h2 id={`${section.id}-title`}><span aria-hidden="true">{i + 1}.</span> {section.title}</h2>
        {section.body}
      </section>)}
    </div>
  </>;
}
