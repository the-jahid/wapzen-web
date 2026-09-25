import { redirect } from "next/navigation";

// The dashboard overview is not built yet, so /dashboard opens the default
// (chat) workspace. Its agents page pins the sidebar to chat mode.
export default function DashboardPage() {
  redirect("/dashboard/chat");
}
