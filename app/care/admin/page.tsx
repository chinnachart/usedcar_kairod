import { redirect } from "next/navigation";
import { currentSession } from "@/lib/care/auth";
import AdminApp from "./AdminApp";

export const dynamic = "force-dynamic";

export default async function CareAdminPage() {
  const s = await currentSession();
  if (!s) redirect("/care/login");
  if (s.r !== "admin") redirect("/care");
  return <AdminApp />;
}
