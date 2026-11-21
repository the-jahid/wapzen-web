import { Suspense } from "react";
import ToolsPage from "@/components/tools/ToolsPage";

// The page reads its tab from the URL, which needs a Suspense boundary in a
// production build.
export default function Page() {
  return (
    <Suspense>
      <ToolsPage />
    </Suspense>
  );
}
