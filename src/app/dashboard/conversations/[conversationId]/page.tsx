import ConversationThreadPage from "@/components/conversations/ConversationThreadPage";

// ?agent=<id> says the thread was opened from that chat agent's Conversation
// tab, so the page's back arrow returns there rather than to the whole inbox.
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ conversationId: string }>;
  searchParams: Promise<{ agent?: string | string[] }>;
}) {
  const { conversationId } = await params;
  const { agent } = await searchParams;
  return (
    <ConversationThreadPage
      conversationId={conversationId}
      fromAgentId={typeof agent === "string" && agent ? agent : undefined}
    />
  );
}
