import type { ReactNode } from "react";

import styles from "./RetellPage.module.css";

/** Class names for the shared Retell-style list table (see RetellPage.module.css). */
export const rt = styles;

/**
 * The Retell-style page header: the page title on the left, its search and
 * buttons on the right. On phones the controls drop under the title.
 */
export function PageHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className={styles.head}>
      <h1 className={styles.title}>{title}</h1>
      {children ? <div className={styles.actions}>{children}</div> : null}
    </div>
  );
}
