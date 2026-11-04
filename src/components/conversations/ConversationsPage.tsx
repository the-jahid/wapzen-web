"use client";

import { useEffect, useState } from "react";
import { useCachedState } from "@/lib/pageCache";
import { useAuth } from "@clerk/nextjs";
import ConversationsShell from "@/components/conversations/ConversationsShell";
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
  const [agents, setAgents] = useCachedState<ConversationAgentOption[]>("conversations:agent-options", []);
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
  }, [getToken, setAgents]);

  return (
    <ConversationsShell label="Conversations">
      {agentsError ? (
        <div
          style={{
            background: "var(--app-amber-soft)",
            border: "1px solid var(--app-amber-border)",
            borderRadius: 10,
            color: "var(--app-amber)",
            flex: "0 0 auto",
            fontSize: 11.5,
            marginBottom: 12,
            padding: "9px 11px",
          }}
        >
          {agentsError}
        </div>
      ) : null}
      <ChatConversationsWorkspace agents={agents} />
    </ConversationsShell>
  );
}
