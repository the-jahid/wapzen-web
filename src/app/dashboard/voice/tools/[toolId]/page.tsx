import { Suspense } from "react";
import ToolsPage from "@/components/tools/ToolsPage";

// One tool on its own page. The list page links here when a tool is clicked.
// ToolsPage reads search params, which needs a Suspense boundary in a
// production build.
export default async function Page({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  return (
    <Suspense>
      <ToolsPage toolId={toolId} />
    </Suspense>
  );
}
