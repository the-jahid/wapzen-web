import ChatAgentsPage from "@/components/chat/ChatAgentsPage";

export default async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  return <ChatAgentsPage agentId={agentId} />;
}
