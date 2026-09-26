"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import ChatConversationsWorkspace, {
  type ConversationAgentOption,
} from "@/components/chat/ChatConversationsWorkspace";
import { listDashboardChatAgents } from "@/lib/chatAgents";

// The account's whole chat inbox: every thread every chat agent has answered,
// in one place. The chat-agent editor has the same workspace narrowed to one
// agent; this page passes the agent list instead, which is what turns on the
// agent filter and labels each thread with who answered it.

export default function ConversationsPage() {
  const { getToken } = useAuth();
  const [agents, setAgents] = useState<ConversationAgentOption[]>([]);
  const [agentsError, setAgentsError] = useState("");

  // The agent list only labels and filters the threads, so failing to load it
  // is a missing label rather than an empty page: the conversations below load
  // on their own either way.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listDashboardChatAgents(getToken);
        if (cancelled) return;
        setAgents(list.map((agent) => ({ id: agent.id, name: agent.agent.name })));
      } catch (loadError) {
        if (cancelled) return;
        setAgentsError(loadError instanceof Error ? loadError.message : "Could not load your chat agents");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  return (
    <div className="conv-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <DashboardSidebar activeLabel="Conversations" stackBelow={900} />

      <main className="conv-main">
        <div className="conv-content">
          <section className="conv-panel" aria-label="Conversations">
            {agentsError ? <div className="conv-warning">{agentsError}</div> : null}
            <ChatConversationsWorkspace agents={agents} />
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
  padding: 14px;
  width: 100%;
}
.conv-warning { background: var(--app-amber-soft); border: 1px solid var(--app-amber-border); border-radius: 10px; color: var(--app-amber); flex: 0 0 auto; font-size: 11.5px; margin-bottom: 12px; padding: 9px 11px; }
/* The top bar and drawer backdrop only exist below the tablet breakpoint. */
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
}
`;
