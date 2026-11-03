import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Egypt (Arabic, right to left): the blog only. Register each post in
// lib/blogPosts.ts with locale "ar-EG".
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="ar-EG">{children}</PublicShell>;
}
