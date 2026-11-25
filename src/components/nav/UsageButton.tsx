"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@clerk/nextjs";
import { CreditCard, Gauge, MessageSquare, Phone, X, Zap } from "lucide-react";
import { listChatAgentLiveStates } from "@/lib/chatAgents";
import { getVoiceUsage, type ApiVoiceUsage } from "@/lib/voiceAgents";
import {
  FREE_TRIAL_WHATSAPP_URL,
  VOICE_MINUTES_WHATSAPP_URL,
  WhatsAppGlyph,
} from "@/components/nav/supportWhatsApp";
import { useCachedState } from "@/lib/pageCache";
import styles from "./DashboardSidebar.module.css";

// From this many replies used the Usage button and ring turn red, the same
// point the near-limit warning shows in the modal.
const USAGE_WARN_FROM = 350;
// Under this many voice seconds left the voice ring turns red (same as the
// voice agents page's amber point).
const VOICE_WARN_SECONDS = 120;

type Usage =
  | { kind: "loading" }
  | { kind: "error" }
  // No chat agent yet: the server only reports usage on an agent.
  | { kind: "none" }
  | { kind: "paid" }
  | { kind: "trial"; used: number; limit: number; ended: boolean };

/**
 * Sidebar "Usage" row. Opens a modal with how many of the account's free AI
 * replies are used and how many are left. The count is per account (shared by
 * all its agents), so any agent's live state carries it; a paid plan has none.
 */
export function UsageButton({
  onOpen,
  variant = "card",
}: {
  onOpen?: () => void;
  /** "card" is the sidebar row; "tab" is a tab in the phone bottom bar. */
  variant?: "card" | "tab";
}) {
  const { getToken, isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);
  // Cached so the button keeps its colour across page changes without a flash.
  const [usage, setUsage] = useCachedState<Usage>("usage:replies", { kind: "loading" });
  const warn = usage.kind === "trial" && usage.used >= USAGE_WARN_FROM;

  // Asked on every page load (the sidebar remounts per page) and again each
  // time the modal opens, so the colour and the numbers stay current.
  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    listChatAgentLiveStates(getToken)
      .then((states) => {
        if (cancelled) return;
        if (states.length === 0) return setUsage({ kind: "none" });
        const withTrial = states.find((state) => state.free_trial);
        if (!withTrial?.free_trial) return setUsage({ kind: "paid" });
        const { used, limit } = withTrial.free_trial;
        setUsage({
          kind: "trial",
          used,
          limit,
          ended: states.some((state) => state.free_trial_ended) || used >= limit,
        });
      })
      .catch(() => {
        // Keep the last answer rather than turning the button back to normal.
        if (!cancelled) setUsage((last) => (last.kind === "loading" ? { kind: "error" } : last));
      });
    return () => {
      cancelled = true;
    };
  }, [getToken, isSignedIn, open, setUsage]);

  // Voice minutes are only asked for while the modal is open. Same cache key as
  // the voice agents page, so each side starts from the other's last answer.
  const [voice, setVoice] = useCachedState<ApiVoiceUsage | null>("voice-usage", null);
  const [voiceFailed, setVoiceFailed] = useState(false);
  useEffect(() => {
    if (!open || !isSignedIn) return;
    let cancelled = false;
    getVoiceUsage(getToken)
      .then((next) => {
        if (cancelled) return;
        setVoice(next);
        setVoiceFailed(false);
      })
      .catch(() => {
        if (!cancelled) setVoiceFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [getToken, isSignedIn, open, setVoice]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  return (
    <>
      {variant === "tab" ? (
        <button
          aria-label={warn ? "Usage: free AI replies almost used up" : "Usage"}
          className={`${styles.tab} ${styles.usageTab}`}
          data-warn={warn || undefined}
          onClick={() => {
            onOpen?.();
            setOpen(true);
          }}
          type="button"
        >
          <span className={styles.tabIcon}>
            <Gauge aria-hidden="true" size={19} strokeWidth={1.9} />
          </span>
          <span aria-hidden="true" className={styles.tabLabel}>Usage</span>
        </button>
      ) : (
        <button
          aria-label={warn ? "Usage: free AI replies almost used up" : "Usage"}
          className={`${styles.supportCard} ${styles.usageButton}`}
          data-warn={warn || undefined}
          onClick={() => {
            onOpen?.();
            setOpen(true);
          }}
          type="button"
        >
          <span className={styles.usageIcon}><Gauge size={13} /></span>
          <span className={styles.supportTitle}>Usage</span>
        </button>
      )}
      {open
        ? createPortal(
            <div className={styles.usageOverlay} onClick={() => setOpen(false)}>
              <div
                aria-labelledby="usage-title"
                aria-modal="true"
                className={styles.usageModal}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
              >
                <button
                  aria-label="Close"
                  className={styles.usageClose}
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X size={16} />
                </button>
                <h2 className={styles.srOnly} id="usage-title">Usage</h2>
                <p className={styles.usageSection}><MessageSquare size={13} /> AI chat replies</p>
                <UsageBody usage={usage} />
                <div className={styles.usageDivider} />
                <p className={styles.usageSection}><Phone size={13} /> Voice call minutes</p>
                <VoiceUsageBody failed={voiceFailed} usage={voice} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function UsageBody({ usage }: { usage: Usage }) {
  if (usage.kind === "loading") return <p className={styles.usageNote}>Loading…</p>;
  if (usage.kind === "error") return <p className={styles.usageNote}>Could not load your usage. Try again in a moment.</p>;
  if (usage.kind === "none") return <p className={styles.usageNote}>Create a chat agent to start using your free AI replies.</p>;

  if (usage.kind === "paid") {
    return (
      <div className={styles.usageCard}>
        <UsageRing fraction={1} label="AI replies" value="∞" />
        <div className={styles.usageInfo}>
          <PlanPill />
          <div className={styles.usagePlan}>Paid plan</div>
          <p className={styles.usageMeta}>Unlimited AI replies · shared by all your chat agents</p>
        </div>
      </div>
    );
  }

  const used = Math.min(usage.used, usage.limit);
  const left = Math.max(usage.limit - usage.used, 0);
  const fraction = usage.limit > 0 ? left / usage.limit : 0;

  const percent = usage.limit > 0 ? Math.min(100, Math.floor((usage.used / usage.limit) * 100)) : 100;
  const nearLimit = !usage.ended && usage.used >= USAGE_WARN_FROM;

  return (
    <>
      <div className={styles.usageCard} data-warn={usage.used >= USAGE_WARN_FROM || undefined}>
        <UsageRing fraction={fraction} label={`of ${usage.limit} replies left`} value={String(left)} />
        <div className={styles.usageInfo}>
          <PlanPill />
          <div className={styles.usagePlan}>
            Free trial <span className={styles.usagePlanSub}>{usage.limit} AI replies</span>
          </div>
          <p className={styles.usageMeta}>
            {used} used · {left} left · shared by all your chat agents
            {usage.ended ? " · trial ended, your agent is off" : ""}
          </p>
          <div className={styles.usageActions}>
            <a
              className={styles.usageCta}
              href={FREE_TRIAL_WHATSAPP_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Zap size={14} />
              Upgrade plan
            </a>
            <a
              className={styles.usageCtaGhost}
              href={FREE_TRIAL_WHATSAPP_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <WhatsAppGlyph size={13} />
              Message us
            </a>
          </div>
        </div>
      </div>
      {nearLimit ? (
        <div className={styles.usageAlert} role="status">
          <span aria-hidden="true" className={styles.usageAlertIcon}>!</span>
          <div className={styles.usageAlertText}>
            <p className={styles.usageAlertTitle}>You are reaching your free limit: {percent}% used</p>
            <p className={styles.usageAlertCopy}>
              You have <strong>{left} {left === 1 ? "AI reply" : "AI replies"} left</strong>. When they run out, your
              AI agent turns off. To keep it running, get a paid plan.
            </p>
            <div
              aria-label="Free replies used"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={percent}
              className={styles.usageAlertMeter}
              role="progressbar"
            >
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

// m:ss, so 7 minutes 30 seconds reads "7:30".
function clock(seconds: number) {
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function VoiceUsageBody({ usage, failed }: { usage: ApiVoiceUsage | null; failed: boolean }) {
  if (!usage) {
    return <p className={styles.usageNote}>{failed ? "Could not load your voice minutes. Try again in a moment." : "Loading…"}</p>;
  }
  const limitMinutes = Math.round(usage.limit_seconds / 60);
  const left = Math.max(0, usage.remaining_seconds);
  const fraction = usage.limit_seconds > 0 ? left / usage.limit_seconds : 0;
  const warn = usage.exhausted || left < VOICE_WARN_SECONDS;

  return (
    <div className={styles.usageCard} data-warn={warn || undefined}>
      <UsageRing fraction={fraction} label={`of ${limitMinutes} min left`} value={clock(left)} />
      <div className={styles.usageInfo}>
        <div className={styles.usagePlan}>
          Voice minutes <span className={styles.usagePlanSub}>{limitMinutes} min</span>
        </div>
        <p className={styles.usageMeta}>
          {clock(usage.used_seconds)} used · {clock(left)} left · shared by all your voice agents
          {usage.exhausted ? " · used up, your voice agents won't answer or call" : ""}
        </p>
        <div className={styles.usageActions}>
          <a
            className={styles.usageCta}
            href={VOICE_MINUTES_WHATSAPP_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Zap size={14} />
            Buy minutes
          </a>
        </div>
      </div>
    </div>
  );
}

function PlanPill() {
  return (
    <span className={styles.usagePill}>
      <CreditCard size={12} />
      Current plan
    </span>
  );
}

// Donut: the coloured arc is what is left, the hatched rest is what is used.
function UsageRing({ fraction, value, label }: { fraction: number; value: string; label: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(1, fraction)) * c;
  // Two rings share the modal, so each needs its own pattern id.
  const hatch = `usage-hatch-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <div className={styles.usageRing}>
      <svg aria-hidden="true" height="132" viewBox="0 0 132 132" width="132">
        <defs>
          <pattern height="5" id={hatch} patternTransform="rotate(45)" patternUnits="userSpaceOnUse" width="5">
            <line stroke="currentColor" strokeWidth="2" x1="0" x2="0" y1="0" y2="5" />
          </pattern>
        </defs>
        <circle className={styles.usageRingTrack} cx="66" cy="66" fill="none" r={r} stroke={`url(#${hatch})`} strokeWidth="14" />
        {filled > 0 ? (
          <circle
            className={styles.usageRingFill}
            cx="66"
            cy="66"
            fill="none"
            r={r}
            strokeDasharray={`${filled} ${c}`}
            strokeWidth="14"
            transform="rotate(-90 66 66)"
          />
        ) : null}
      </svg>
      <div className={styles.usageRingText}>
        <span className={styles.usageRingValue}>{value}</span>
        <span className={styles.usageRingLabel}>{label}</span>
      </div>
    </div>
  );
}
