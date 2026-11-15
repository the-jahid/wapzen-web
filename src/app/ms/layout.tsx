import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Malay (Malaysia): the blog only. Register each post in lib/blogPosts.ts with locale "ms".
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="ms">{children}</PublicShell>;
}
