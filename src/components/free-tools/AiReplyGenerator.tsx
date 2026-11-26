"use client";

import { useId, useState, type FormEvent } from "react";
import { MessageSquareReply } from "lucide-react";
import { AiResults, GenerateButton, LanguageField, ToneField, useAiTool, type Language, type Tone } from "./AiTools";
import styles from "./FreeTools.module.css";

const MAX_MESSAGE = 2000;
const MAX_CONTEXT = 1000;

const examples = [
  { name: "Price question", message: "Hi, how much is a haircut? And are you open on Sunday?", context: "Hair salon. Men's haircut $25, women's $45. Open Mon–Sat 9am–7pm, closed Sunday.", tone: "friendly" },
  { name: "Late order complaint", message: "I ordered 5 days ago and still nothing. This is really bad service.", context: "Online clothing shop. Orders usually arrive in 3–5 working days.", tone: "apologetic" },
  { name: "Asking for a discount", message: "Can you give me a better price if I buy 3?", context: "", tone: "persuasive" },
  { name: "Boss wants an update", message: "Hey, where are we with the client report? Need it by Friday.", context: "", tone: "professional" },
] as const;

export function AiReplyGenerator() {
  const id = useId();
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("friendly");
  const [language, setLanguage] = useState<Language>("auto");
  const [touched, setTouched] = useState(false);
  const ai = useAiTool();
  const missing = !message.trim();

  function run() {
    setTouched(true);
    if (missing) return;
    void ai.generate({ tool: "reply", message, context, tone, language });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    run();
  }

  return <div className={styles.toolCard}>
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <div className={styles.labelRow}><label htmlFor={`${id}-message`}>Message you received</label><span className={styles.counter}>{message.length}/{MAX_MESSAGE}</span></div>
        <textarea id={`${id}-message`} className={`${styles.input} ${styles.textarea} ${touched && missing ? styles.invalid : ""}`} rows={5} maxLength={MAX_MESSAGE} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Paste the WhatsApp message you need to answer." aria-invalid={touched && missing} />
        {touched && missing && <p className={styles.error}>Paste the message you want to reply to.</p>}
        <div className={styles.chips} role="group" aria-label="Example messages">
          {examples.map((example) => <button key={example.name} type="button" className={styles.chip} aria-pressed={message === example.message} onClick={() => { setMessage(example.message); setContext(example.context); setTone(example.tone); }}>{example.name}</button>)}
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}><label htmlFor={`${id}-context`}>About you or your business <span>(optional)</span></label><span className={styles.counter}>{context.length}/{MAX_CONTEXT}</span></div>
        <textarea id={`${id}-context`} className={`${styles.input} ${styles.textarea}`} rows={3} maxLength={MAX_CONTEXT} value={context} onChange={(event) => setContext(event.target.value)} placeholder="Prices, opening hours, delivery times, or anything the reply should say." />
        <p className={styles.hint}>The AI only uses facts you give it. Anything missing, like a price, comes back as a [placeholder] for you to fill in.</p>
      </div>

      <ToneField value={tone} onChange={setTone} />
      <LanguageField value={language} onChange={setLanguage} autoLabel="Same as the message" />
      <GenerateButton loading={ai.status === "loading"}>Write 3 replies</GenerateButton>
    </form>

    <AiResults state={ai} onRegenerate={run} emptyIcon={<MessageSquareReply size={34} strokeWidth={1.4} />} emptyText="Paste a message and click Write 3 replies. Your reply options appear here, ready to copy or send." />
  </div>;
}
