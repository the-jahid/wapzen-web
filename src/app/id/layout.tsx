import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Indonesian: the blog only. Register each post in lib/blogPosts.ts with locale "id".
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="id">{children}</PublicShell>;
}
