import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Route group for public marketing pages (/pricing, /free-whatsapp-chatbot,
// /free-ai-calling-agent). The group name is not part of the URL.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
