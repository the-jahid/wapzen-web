import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Italian marketing pages and blog. Register each page in lib/marketingPages.ts
// (posts in lib/blogPosts.ts) with locale "it" and, where there is one, the
// English page it translates (alternateOf).
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="it">{children}</PublicShell>;
}
