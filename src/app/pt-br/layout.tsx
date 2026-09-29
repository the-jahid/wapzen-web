import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Brazilian Portuguese marketing pages. Register each page in lib/marketingPages.ts with
// locale "pt-BR" and the English page it translates (alternateOf).
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="pt-BR">{children}</PublicShell>;
}
