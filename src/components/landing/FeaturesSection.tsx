import {
  ArrowDownLeft,
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Braces,
  Check,
  CheckCheck,
  FileText,
  MessageSquare,
  Phone,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import styles from "./FeaturesSection.module.css";

const features = [
  {
    key: "chat",
    icon: MessageSquare,
    label: "Conversations, covered",
    title: "WhatsApp AI chat agent",
    body: "Create an agent that replies to incoming WhatsApp text messages using your instructions, knowledge bases, and connected API tools.",
    tags: ["AI text replies", "Custom prompt", "Chat history"],
    preview: ChatPreview,
  },
  {
    key: "voice",
    icon: Phone,
    label: "A voice for your business",
    title: "WhatsApp AI voice agent",
    body: "Build a voice agent for inbound calls, outbound calls, or both. Choose its voice, language, prompt, and transcription settings.",
    tags: ["Inbound calls", "Outbound calls", "Voice settings"],
    preview: VoicePreview,
  },
  {
    key: "campaign",
    icon: Radio,
    label: "Reach the next conversation",
    title: "Outbound call campaigns",
    body: "Organize leads into campaigns, assign a voice agent, place WhatsApp calls, and review campaign activity and results.",
    tags: ["Campaign leads", "Call activity", "Analytics"],
    preview: CampaignPreview,
  },
  {
    key: "knowledge",
    icon: BookOpen,
    label: "Your knowledge. Their superpower.",
    title: "Knowledge bases and tools",
    body: "Give chat and voice agents business context from your documents and text. Connect API request tools for actions in your own systems.",
    tags: ["Business knowledge", "API requests", "Agent tools"],
    preview: KnowledgePreview,
  },
];

function ChatPreview() {
  return (
    <div className={styles.chatWindow}>
      <div className={styles.previewHeader}>
        <span className={styles.avatar}><Sparkles size={15} /></span>
        <span>Wapzen assistant<span className={styles.online}>Ready to help</span></span>
        <span className={styles.example}>Example chat</span>
      </div>
      <div className={styles.messages}>
        <div className={styles.customerMessage}>Hi! What services do you offer?</div>
        <div className={styles.agentMessage}>
          Happy to help. What are you looking for?
          <CheckCheck size={14} />
        </div>
        <span className={styles.replyNote}><Sparkles size={12} /> Your knowledge, in every reply</span>
      </div>
    </div>
  );
}

const waveform = [12, 20, 14, 30, 42, 25, 48, 34, 18, 38, 56, 30, 44, 22, 50, 36, 20, 42, 28, 16, 32, 22, 12];

function VoicePreview() {
  return (
    <div className={styles.voicePreview}>
      <div className={styles.voiceOrb}><AudioLines size={30} strokeWidth={1.5} /></div>
      <div className={styles.waveform}>
        {waveform.map((height, index) => (
          <span key={index} style={{ height }} />
        ))}
      </div>
      <div className={styles.callDirections}>
        <span><ArrowDownLeft size={13} /> Inbound</span>
        <i />
        <span><ArrowUpRight size={13} /> Outbound</span>
      </div>
    </div>
  );
}

function CampaignPreview() {
  return (
    <div className={styles.campaignWindow}>
      <div className={styles.campaignHeader}>
        <span><Radio size={14} /> Example campaign</span>
        <span className={styles.status}>In progress</span>
      </div>
      <div className={styles.campaignRow}>
        <span className={styles.leadAvatar}>JD</span>
        <span>Lead follow-up<span className={styles.rowDetail}>WhatsApp voice call</span></span>
        <span className={styles.complete}><Check size={12} /> Completed</span>
      </div>
      <div className={styles.campaignRow}>
        <span className={styles.leadAvatar}>SK</span>
        <span>Product inquiry<span className={styles.rowDetail}>WhatsApp voice call</span></span>
        <span className={styles.calling}><AudioLines size={12} /> Calling</span>
      </div>
    </div>
  );
}

function KnowledgePreview() {
  return (
    <div className={styles.knowledgeFlow}>
      <div className={styles.sources}>
        <span><FileText size={15} /> Documents</span>
        <span><BookOpen size={15} /> Business context</span>
        <span><Braces size={15} /> API tools</span>
      </div>
      <div className={styles.connector}><span /><span /><span /></div>
      <div className={styles.agentNode}>
        <Sparkles size={23} />
        <span>Your agent</span>
      </div>
      <div className={styles.outputLine} />
      <div className={styles.outputs}><MessageSquare size={18} /><Phone size={18} /></div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section
      aria-labelledby="capabilities-heading"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
      id="capabilities"
    >
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}><span /> WhatsApp AI agent builder</p>
          <h2 id="capabilities-heading" className={styles.title}>
            Create AI agents for<br className="hidden sm:block" />{" "}
            <span>WhatsApp messages and calls</span>
          </h2>
        </div>
        <p className={styles.intro}>
          Configure chat and voice agents around the way your business
          communicates. Add knowledge and actions as your workflow grows.
        </p>
      </div>

      <div className={styles.grid}>
        {features.map(({ key, icon: Icon, label, title, body, tags, preview: Preview }, index) => (
          <article className={`${styles.card} ${styles[key]}`} key={key}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}><Icon size={18} strokeWidth={1.7} /></span>
              <span>{label}</span>
              <span className={styles.number}>0{index + 1}</span>
            </div>
            {/* Illustrative product previews, not interactive dashboard controls. */}
            <div aria-hidden="true" className={styles.preview}><Preview /></div>
            <div className={styles.cardContent}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
            <ul className={styles.tags} aria-label={`${title} features`}>
              {tags.map((tag) => <li key={tag}><Check size={12} aria-hidden="true" />{tag}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <p className={styles.footnote}><Users size={14} aria-hidden="true" /> One connected number. Chat, voice, and the context behind both.</p>
    </section>
  );
}
