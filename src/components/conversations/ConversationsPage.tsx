"use client";

import ConversationsSplit from "@/components/conversations/ConversationsSplit";

// The account's whole chat inbox: every contact in one list. Picking one moves
// to /dashboard/conversations/<id>, which opens that thread in a drawer over
// the list.
export default function ConversationsPage() {
  return <ConversationsSplit>{null}</ConversationsSplit>;
}
