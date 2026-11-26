"use client";

import { useId, useState, type FormEvent } from "react";
import { Store } from "lucide-react";
import { AiResults, GenerateButton, LanguageField, ToneField, useAiTool, type Language, type Tone } from "./AiTools";
import styles from "./FreeTools.module.css";

// Kinds must match BUSINESS_KINDS in whiskey's free-tools-prompts.ts.
export const messageKinds = [
  { value: "greeting", label: "Greeting message", hint: "Hours, what you sell, how to order or book." },
  { value: "away", label: "Away message", hint: "Your opening hours and when you reply." },
  { value: "description", label: "Business description", hint: "What you offer, who for, where, and what makes you different." },
  { value: "quick_replies", label: "Quick replies", hint: "Prices, hours, location, delivery and payment options." },
  { value: "promotion", label: "Offer / broadcast", hint: "The offer, the price or discount, and when it ends." },
  { value: "order_confirmation", label: "Order confirmation", hint: "Delivery or pickup time, payment method." },
  { value: "payment_reminder", label: "Payment reminder", hint: "Amount, due date and how to pay." },
  { value: "appointment_reminder", label: "Appointment reminder", hint: "Date, time, address and what to bring." },
  { value: "follow_up", label: "Follow-up", hint: "What the customer asked about." },
  { value: "review_request", label: "Review request", hint: "Where to leave the review." },
] as const;
type Kind = (typeof messageKinds)[number]["value"];

const DESCRIPTION_LIMIT = 512;

export function AiBusinessMessageGenerator() {
  const id = useId();
  const [kind, setKind] = useState<Kind>("greeting");
  const [businessName, setBusinessName] = useState("");
  const [business, setBusiness] = useState("");
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState<Tone>("friendly");
  const [language, setLanguage] = useState<Language>("auto");
  const [touched, setTouched] = useState(false);
  const ai = useAiTool();
  const current = messageKinds.find((k) => k.value === kind) ?? messageKinds[0];
  const nameMissing = !businessName.trim();
  const businessMissing = !business.trim();

  function run() {
    setTouched(true);
    if (nameMissing || businessMissing) return;
    void ai.generate({ tool: "business", kind, businessName, business, details, tone, language });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    run();
  }

  return <div className={styles.toolCard}>
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <span className={styles.fieldLabel} id={`${id}-kind`}>Message type</span>
        <div className={styles.chips} role="radiogroup" aria-labelledby={`${id}-kind`}>
          {messageKinds.map((k) => <button key={k.value} type="button" role="radio" className={styles.chip} aria-checked={kind === k.value} onClick={() => setKind(k.value)}>{k.label}</button>)}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-name`}>Business name</label>
        <input id={`${id}-name`} className={`${styles.input} ${touched && nameMissing ? styles.invalid : ""}`} maxLength={80} value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Bella Pizza" aria-invalid={touched && nameMissing} />
        {touched && nameMissing && <p className={styles.error}>Add your business name.</p>}
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}><label htmlFor={`${id}-business`}>What your business does</label><span className={styles.counter}>{business.length}/300</span></div>
        <input id={`${id}-business`} className={`${styles.input} ${touched && businessMissing ? styles.invalid : ""}`} maxLength={300} value={business} onChange={(event) => setBusiness(event.target.value)} placeholder="Pizza delivery in Lisbon" aria-invalid={touched && businessMissing} />
        {touched && businessMissing && <p className={styles.error}>Say in a few words what you do.</p>}
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}><label htmlFor={`${id}-details`}>Details <span>(optional)</span></label><span className={styles.counter}>{details.length}/1000</span></div>
        <textarea id={`${id}-details`} className={`${styles.input} ${styles.textarea}`} rows={4} maxLength={1000} value={details} onChange={(event) => setDetails(event.target.value)} placeholder={current.hint} />
        <p className={styles.hint}>Useful here: {current.hint.toLowerCase()} The AI uses only what you write; missing facts come back as [placeholders].</p>
      </div>

      <ToneField value={tone} onChange={setTone} />
      <LanguageField value={language} onChange={setLanguage} autoLabel="Same as my details" />
      <GenerateButton loading={ai.status === "loading"}>{kind === "quick_replies" ? "Write 5 quick replies" : "Write 3 options"}</GenerateButton>
    </form>

    <AiResults
      state={ai}
      onRegenerate={run}
      emptyIcon={<Store size={34} strokeWidth={1.4} />}
      emptyText="Pick a message type, add your business name, and click Write. Ready-to-send messages appear here."
      note={kind === "description" ? (text) => <p className={text.length > DESCRIPTION_LIMIT ? styles.error : styles.hint}>{text.length}/{DESCRIPTION_LIMIT} characters{text.length > DESCRIPTION_LIMIT ? ": too long for the WhatsApp Business description, shorten it" : ""}</p> : undefined}
    />
  </div>;
}
