import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Saudi Arabia (Arabic, right to left): the blog only. Register each post in
// lib/blogPosts.ts with locale "ar-SA".
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="ar-SA">{children}</PublicShell>;
}
