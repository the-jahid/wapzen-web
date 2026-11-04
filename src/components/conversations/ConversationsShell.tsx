"use client";

import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";

// The frame around the conversation list and the conversation page: the sidebar
// and one panel filling the rest of the screen. `flush` hands the panel's edges
// to a child that draws its own header and composer against them.
export default function ConversationsShell({
  activeLabel = "Conversations",
  children,
  flush = false,
  label,
}: {
  activeLabel?: string;
  children: ReactNode;
  flush?: boolean;
  label: string;
}) {
  return (
    <div className="conv-shell app-accent-green">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <DashboardSidebar activeLabel={activeLabel} stackBelow={900} />

      <main className="conv-main">
        <div className={`conv-content${flush ? " is-flush" : ""}`}>
          <section className={`conv-panel${flush ? " is-flush" : ""}`} aria-label={label}>
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}

const css = `
.conv-shell {
  --bg: var(--app-bg);
  --sidebar: var(--app-sidebar);
  --surface: var(--app-surface);
  --panel: var(--app-panel);
  --border: var(--app-border);
  --text: var(--app-text);
  --muted: var(--app-muted);
  --subtle: var(--app-subtle);
  --faint: var(--app-faint);
  --primary: var(--app-primary);
  --primary-2: var(--app-primary-2);
  --primary-soft: var(--app-primary-soft);
  background: var(--bg);
  color: var(--text);
  display: flex;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  height: 100vh;
  line-height: 1.5;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  width: 100vw;
}
.conv-shell * { box-sizing: border-box; }
.conv-shell button, .conv-shell input, .conv-shell select { font: inherit; }
.conv-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.conv-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.conv-shell ::-webkit-scrollbar-track { background: transparent; }
.conv-main { display: flex; flex: 1; flex-direction: column; height: 100vh; min-width: 0; overflow: hidden; }
/* The panes inside the panel do the scrolling, so the page itself never does:
   the transcript stays put while its messages move. */
.conv-content { display: flex; flex: 1 1 auto; min-height: 0; padding: 18px 30px 24px; }
.conv-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  padding: 14px;
  width: 100%;
}
.conv-panel.is-flush { overflow: hidden; padding: 0; }
/* Wide screens: keep the rows from stretching into one long line. */
@media (min-width: 1680px) {
  .conv-content { padding: 24px 40px 28px; }
  .conv-panel { margin: 0 auto; max-width: 1480px; }
}
@media (max-width: 1100px) {
  .conv-content { padding: 16px 20px 20px; }
}
/* Tablets and phones: the sidebar becomes a drawer behind a top bar, and the
   workspace fills what is left of the screen. */
@media (max-width: 900px) {
  .conv-shell { flex-direction: column; height: 100dvh; max-height: 100dvh; max-width: 100%; width: 100%; }
  .conv-main { flex: 1 1 auto; height: auto; min-height: 0; }
  .conv-content { padding: 14px 16px 18px; }
  .conv-panel { border-radius: 14px; padding: 12px; }
}
@media (max-width: 560px) {
  .conv-content { padding: 12px 12px calc(12px + env(safe-area-inset-bottom)); }
  .conv-panel { background: transparent; border: 0; border-radius: 0; box-shadow: none; padding: 0; }
  .conv-content.is-flush { padding: 0; }
}
`;
