import { redirect } from "next/navigation";

// /dashboard/voice opens the voice workspace's agents list.
export default function Page() {
  redirect("/dashboard/voice/agents");
}
