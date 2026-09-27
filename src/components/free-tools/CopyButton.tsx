"use client";

import { useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./FreeTools.module.css";

/** Copies `value`, flipping to a check mark for two seconds. `label` is the accessible name. */
export function CopyButton({ value, label, children, className = "" }: { value: string; label: string; children?: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // No clipboard access (e.g. an insecure origin): let the browser offer the text to copy by hand.
      window.prompt("Copy this:", value);
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return <button type="button" className={`${styles.copyButton} ${className}`} onClick={copy} aria-label={copied ? `Copied ${value}` : label} title={label}>
    {copied ? <Check size={14} /> : <Copy size={14} />}{children && <span>{copied ? "Copied" : children}</span>}
  </button>;
}
