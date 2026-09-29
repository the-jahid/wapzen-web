import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Italian marketing pages. Register each page in lib/marketingPages.ts with
// locale "it" and the English page it translates (alternateOf).
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="it">{children}</PublicShell>;
}
