"use client";

import { useRef, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import styles from "./FreeTools.module.css";

/** The generated wa.me link with Copy and Test buttons. */
export function LinkBox({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // No clipboard access (e.g. an insecure origin): select the text so Ctrl/Cmd+C works.
      input.current?.select();
      return;
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return <>
    <input ref={input} className={`${styles.input} ${styles.linkInput}`} value={link} readOnly aria-label="Generated WhatsApp link" onFocus={(event) => event.target.select()} />
    <div className={styles.actions}>
      <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={copyLink}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied!" : "Copy link"}</button>
      <a className={`${styles.btn} ${styles.btnSecondary}`} href={link} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} />Test in WhatsApp</a>
    </div>
    <p className={styles.srOnly} aria-live="polite">{copied ? "Link copied to clipboard" : ""}</p>
  </>;
}
