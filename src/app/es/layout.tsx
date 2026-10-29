import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Spanish (written for Spain) marketing pages and blog. Register each page in lib/marketingPages.ts
// (posts in lib/blogPosts.ts) with locale "es" and the English page it translates (alternateOf).
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="es">{children}</PublicShell>;
}
