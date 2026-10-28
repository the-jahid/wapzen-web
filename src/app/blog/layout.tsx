import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// English blog index and posts (lib/blogPosts.ts); the Italian blog is app/it/blog.
export default function BlogLayout({ children }: { children: ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
