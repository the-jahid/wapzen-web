import type { Metadata } from "next";
import FollowUpsPage from "@/components/follow-ups/FollowUpsPage";

export const metadata: Metadata = { title: "Follow-ups" };

export default function Page() {
  return <FollowUpsPage />;
}
