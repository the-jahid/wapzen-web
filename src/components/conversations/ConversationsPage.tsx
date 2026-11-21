"use client";

import ConversationsSplit from "@/components/conversations/ConversationsSplit";
import { ConversationThreadView } from "@/components/conversations/ConversationThreadPage";

// The account's whole chat inbox in Retell's master-detail layout: contacts on
// the left, the most recent thread open on the right until another is picked
// (picking one moves to /dashboard/conversations/<id>).
export default function ConversationsPage() {
  return (
    <ConversationsSplit>
      {(firstId) =>
        firstId ? (
          <ConversationThreadView
            backHref="/dashboard/conversations"
            conversationId={firstId}
            key={firstId}
          />
        ) : null
      }
    </ConversationsSplit>
  );
}
