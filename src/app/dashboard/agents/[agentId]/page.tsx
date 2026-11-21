import { redirect } from "next/navigation";

// Voice pages moved under /dashboard/voice; old links still land.
export default async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  redirect(`/dashboard/voice/agents/${encodeURIComponent(agentId)}`);
}
