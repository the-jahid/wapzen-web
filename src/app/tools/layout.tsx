import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
