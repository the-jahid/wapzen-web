import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// German: the blog only. Register each post in lib/blogPosts.ts with locale "de".
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="de">{children}</PublicShell>;
}
