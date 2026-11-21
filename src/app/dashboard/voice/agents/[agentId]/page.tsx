import { AgentsPage } from "@/components/nav/voicePages";

export default async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  return <AgentsPage agentId={agentId} />;
}
