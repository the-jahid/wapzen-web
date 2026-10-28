import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Brazilian Portuguese marketing pages and blog. Register each page in
// lib/marketingPages.ts (posts in lib/blogPosts.ts) with locale "pt-BR" and,
// where there is one, the English page it translates (alternateOf).
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="pt-BR">{children}</PublicShell>;
}
