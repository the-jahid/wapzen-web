import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Finnish: the blog only. Register each post in lib/blogPosts.ts with locale "fi".
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="fi">{children}</PublicShell>;
}
