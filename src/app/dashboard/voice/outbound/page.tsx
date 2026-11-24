import { Suspense } from "react";
import { OutboundPage } from "@/components/nav/voicePages";

export default function Page() {
  // The page reads the open broadcast from the URL (useSearchParams).
  return <Suspense><OutboundPage /></Suspense>;
}
