import { redirect } from "next/navigation";

// The dashboard overview is not built yet; the agents workspace is the only
// dashboard surface, so /dashboard lands there.
export default function DashboardPage() {
  redirect("/dashboard/agents");
}
