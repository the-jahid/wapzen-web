"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { listDashboardChatAgents } from "@/lib/chatAgents";

import styles from "./FreeLimitNotice.module.css";
import { LIMIT_WHATSAPP_URL, WhatsAppGlyph } from "./supportWhatsApp";

// Shown on every dashboard page once the account has used its free replies.
// The limit is checked again on each navigation, so the notice appears when it
// is reached and goes away once a paid plan lifts it.
export function FreeLimitNotice() {
  const { getToken, isSignedIn } = useAuth();
  const pathname = usePathname();
  const [reached, setReached] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    listDashboardChatAgents(getToken)
      .then((agents) => {
        if (!cancelled) setReached(agents.some((agent) => agent.reply_limit_reached));
      })
      // Only a notice: the page itself reports a server that can't be reached.
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [getToken, isSignedIn, pathname]);

  if (!reached || dismissed) return null;

  return (
    <aside className={styles.notice} role="alert">
      <button
        aria-label="Dismiss"
        className={styles.dismiss}
        onClick={() => setDismissed(true)}
        type="button"
      >
        ×
      </button>
      <p className={styles.title}>You have reached your free limit</p>
      <p className={styles.body}>
        You need a paid plan to keep your agent replying. To buy one, message us on WhatsApp.
      </p>
      <a className={styles.whatsapp} href={LIMIT_WHATSAPP_URL} rel="noopener noreferrer" target="_blank">
        <WhatsAppGlyph size={15} />
        Message us on WhatsApp
      </a>
    </aside>
  );
}
