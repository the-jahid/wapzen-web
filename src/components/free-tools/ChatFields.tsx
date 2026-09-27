"use client";

import { useId, useState } from "react";
import { MAX_MESSAGE, messageTemplates } from "./whatsapp";
import styles from "./FreeTools.module.css";

type ChatFieldsProps = {
  phone: string;
  onPhoneChange: (value: string) => void;
  /** From parsePhone; shown once the number field has been left. */
  phoneError?: string;
  message: string;
  onMessageChange: (value: string) => void;
};

/** The WhatsApp number and pre-filled message inputs every free tool starts with. */
export function ChatFields({ phone, onPhoneChange, phoneError, message, onMessageChange }: ChatFieldsProps) {
  const id = useId();
  const [touched, setTouched] = useState(false);
  const showError = Boolean(phoneError) && touched;

  return <>
    <div className={styles.field}>
      <label htmlFor={`${id}-phone`}>WhatsApp number</label>
      <input
        id={`${id}-phone`}
        className={`${styles.input} ${showError ? styles.invalid : ""}`}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+1 555 123 4567"
        value={phone}
        onChange={(event) => onPhoneChange(event.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={showError}
        aria-describedby={`${id}-phone-hint`}
      />
      <p id={`${id}-phone-hint`} className={showError ? styles.error : styles.hint}>{showError ? phoneError : "Include the country code. Spaces, dashes and + are fine."}</p>
    </div>

    <div className={styles.field}>
      <div className={styles.labelRow}><label htmlFor={`${id}-message`}>Pre-filled message <span>(optional)</span></label><span className={styles.counter}>{message.length}/{MAX_MESSAGE}</span></div>
      <textarea
        id={`${id}-message`}
        className={`${styles.input} ${styles.textarea}`}
        rows={4}
        maxLength={MAX_MESSAGE}
        placeholder="Hi! I'd like to know more about your services."
        value={message}
        onChange={(event) => onMessageChange(event.target.value)}
      />
      <div className={styles.chips} role="group" aria-label="Message templates">
        {messageTemplates.map((template) => <button key={template} type="button" className={styles.chip} aria-pressed={message === template} onClick={() => onMessageChange(template)}>{template}</button>)}
      </div>
      <p className={styles.hint}>Customers see this text ready to send when the chat opens. They can edit it first.</p>
    </div>
  </>;
}
