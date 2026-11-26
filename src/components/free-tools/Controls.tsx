"use client";

import { useId } from "react";
import styles from "./FreeTools.module.css";

// Form controls shared by the design-heavy tools (QR code, chat button).

export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (value: T) => void }) {
  return <div className={styles.segmented} role="radiogroup" aria-label={label}>
    {options.map((option) => <button key={option.value} type="button" role="radio" aria-checked={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}
  </div>;
}

export function ColorPicker({ label, value, swatches, onChange }: { label: string; value: string; swatches: Array<{ name: string; value: string }>; onChange: (value: string) => void }) {
  const id = useId();
  return <div className={styles.field}>
    <span className={styles.fieldLabel} id={`${id}-label`}>{label}</span>
    <div className={styles.swatches} role="group" aria-labelledby={`${id}-label`}>
      {swatches.map((swatch) => <button key={swatch.value} type="button" className={styles.swatch} style={{ background: swatch.value }} aria-label={swatch.name} aria-pressed={value === swatch.value} title={swatch.name} onClick={() => onChange(swatch.value)} />)}
      <label className={styles.customColor} title="Custom colour">
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} aria-label={`Custom ${label.toLowerCase()}`} />
        <span>{value.toUpperCase()}</span>
      </label>
    </div>
  </div>;
}
