import { Suspense } from "react";
import ConversationsPage from "@/components/conversations/ConversationsPage";

// The page opens the thread named in the URL, which needs a Suspense boundary
// in a production build.
export default function Page() {
  return (
    <Suspense>
      <ConversationsPage />
    </Suspense>
  );
}
