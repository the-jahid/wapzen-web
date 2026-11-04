"use client";

// What the conversation list and the conversation page both draw: the contact's
// avatar colour, dates, the per-contact AI switch and the empty and error states.

const avatarColors = ["#52525b", "#3f3f46", "#63636b", "#4a4a52", "#5a5a63", "#44444c"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

// The avatar colour is derived from the id so a contact keeps the same one
// between visits without anything having to be stored.
export function avatarColor(id: string): string {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
  return avatarColors[hash % avatarColors.length];
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

// The per-contact AI switch, on a row and in the thread header. It stops the
// click there, so switching it on a row doesn't also open the thread.
export function AiReplySwitch({
  busy,
  className,
  on,
  onToggle,
}: {
  busy: boolean;
  className?: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      aria-checked={on}
      aria-label={on ? "AI replies on for this contact. Switch off" : "AI replies off for this contact. Switch on"}
      className={`cv-ai-switch${on ? " is-on" : ""}${className ? ` ${className}` : ""}`}
      disabled={busy}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      onKeyDown={(event) => event.stopPropagation()}
      role="switch"
      title={on ? "The AI answers this contact" : "The AI stays quiet for this contact"}
      type="button"
    >
      <span className="cv-ai-track">
        <span className="cv-ai-knob" />
      </span>
      <span className="cv-ai-label">{on ? "AI on" : "AI off"}</span>
    </button>
  );
}

export function ChatIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" width="24">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 20.5l1.6-4.6A8.3 8.3 0 0 1 3.6 11 8.4 8.4 0 0 1 12 3h.5a8.4 8.4 0 0 1 8.5 8.5z" />
    </svg>
  );
}

export const conversationPartsCSS = `
.cv-error{background:var(--app-rose-soft);border:1px solid var(--app-rose-border);border-radius:10px;color:var(--app-rose-text);flex:0 0 auto;font-size:11.5px;padding:9px 11px}

.cv-empty{align-items:center;color:var(--app-muted);display:flex;flex:1 1 auto;flex-direction:column;font-size:12.5px;gap:8px;justify-content:center;min-height:200px;padding:24px;text-align:center}
.cv-empty strong{color:var(--app-text-strong);font-size:15px}
.cv-empty>span:last-child{line-height:1.65;max-width:44ch}
.cv-empty-icon{align-items:center;background:var(--app-primary-soft);border:1px solid var(--app-primary-ring);border-radius:15px;color:var(--app-primary-text);display:flex;height:50px;justify-content:center;width:50px}
.cv-spinner{animation:cv-spin .8s linear infinite;border:2px solid var(--app-line-strong);border-radius:50%;border-top-color:var(--app-primary);height:19px;width:19px}
@keyframes cv-spin{to{transform:rotate(360deg)}}

.cv-avatar{align-items:center;border-radius:50%;color:#fff;display:flex;flex:0 0 auto;font-size:12.5px;font-weight:800;height:34px;justify-content:center;width:34px}

.cv-ai-switch{align-items:center;background:none;border:0;border-radius:999px;color:var(--app-muted);cursor:pointer;display:inline-flex;font:inherit;font-size:10.5px;font-weight:800;gap:7px;padding:2px;white-space:nowrap}
.cv-ai-switch:focus-visible{outline:2px solid var(--app-primary);outline-offset:2px}
.cv-ai-switch:disabled{cursor:progress;opacity:.6}
.cv-ai-switch.is-on{color:var(--app-text-strong)}
.cv-ai-track{background:var(--app-panel-hover);border:1px solid var(--app-line-strong);border-radius:999px;display:block;flex:0 0 auto;height:20px;padding:2px;transition:background .18s ease,border-color .18s ease;width:36px}
.cv-ai-knob{background:var(--app-muted);border-radius:50%;display:block;height:14px;transition:transform .18s ease,background .18s ease;width:14px}
.cv-ai-switch.is-on .cv-ai-track{background:var(--app-primary);border-color:transparent}
.cv-ai-switch.is-on .cv-ai-knob{background:var(--app-on-accent);transform:translateX(16px)}
.cv-ai-label{min-width:5ch}
@media(prefers-reduced-motion:reduce){.cv-ai-track,.cv-ai-knob{transition:none}}

@media(max-width:420px){
  .cv-avatar{height:32px;width:32px}
}
`;
