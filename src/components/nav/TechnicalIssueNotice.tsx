"use client";

import { TriangleAlert, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import styles from "./TechnicalIssueNotice.module.css";

// Set to false once the issue is fixed.
const SHOW_TECHNICAL_ISSUE_NOTICE = false;

// Remembers that this browser closed the notice. Change the suffix when the
// text changes and people who closed the old one should see the new one.
const CLOSED_KEY = "wapzen-notice-closed:reconnect-2026-11-24";

function subscribe(onChange: () => void) {
  // Closing it in one tab closes it in the others.
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readClosed() {
  try {
    return localStorage.getItem(CLOSED_KEY) !== null;
  } catch {
    return false;
  }
}

// The server can't know, so it leaves the notice out: someone who closed it
// must not see it flash while the page loads.
const readClosedOnServer = () => true;

/**
 * A notice at the foot of every dashboard page. Unlike MaintenanceScreen it
 * does not block the page. Once closed it stays closed in that browser.
 */
export function TechnicalIssueNotice() {
  const closedBefore = useSyncExternalStore(subscribe, readClosed, readClosedOnServer);
  // Also kept in state, so it closes even where storage is blocked.
  const [closedNow, setClosedNow] = useState(false);
  if (!SHOW_TECHNICAL_ISSUE_NOTICE || closedBefore || closedNow) return null;

  function close() {
    try {
      localStorage.setItem(CLOSED_KEY, "1");
    } catch {
      // Storage is blocked; it stays closed until the next reload.
    }
    setClosedNow(true);
  }

  return (
    <div className={styles.notice} role="status">
      <TriangleAlert aria-hidden="true" className={styles.icon} size={18} />
      <p className={styles.text}>
        Because of major upgrades, some active agent connections may not work. To fix this issue,
        disconnect your number and connect it again.
      </p>
      <button
        aria-label="Close notice"
        className={styles.close}
        onClick={close}
        type="button"
      >
        <X size={16} />
      </button>
    </div>
  );
}
