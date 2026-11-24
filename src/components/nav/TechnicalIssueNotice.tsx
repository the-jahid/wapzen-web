"use client";

import { TriangleAlert, X } from "lucide-react";
import { useState } from "react";

import styles from "./TechnicalIssueNotice.module.css";

// Set to false once the issue is fixed.
const SHOW_TECHNICAL_ISSUE_NOTICE = true;

/**
 * A notice at the foot of every dashboard page. Unlike MaintenanceScreen it
 * does not block the page. Closing it lasts until the next reload.
 */
export function TechnicalIssueNotice() {
  const [closed, setClosed] = useState(false);
  if (!SHOW_TECHNICAL_ISSUE_NOTICE || closed) return null;

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
        onClick={() => setClosed(true)}
        type="button"
      >
        <X size={16} />
      </button>
    </div>
  );
}
