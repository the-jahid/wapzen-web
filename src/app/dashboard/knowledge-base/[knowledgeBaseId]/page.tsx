import KnowledgeBasePage from "@/components/knowledge-base/KnowledgeBasePage";

// One knowledge base on its own page. The list page links here when a base
// is clicked.
export default async function Page({ params }: { params: Promise<{ knowledgeBaseId: string }> }) {
  const { knowledgeBaseId } = await params;
  return <KnowledgeBasePage knowledgeBaseId={knowledgeBaseId} />;
}
