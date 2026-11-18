import { redirect } from "next/navigation";
import { currentSession, canWrite } from "@/lib/care/auth";
import CareApp from "./CareApp";

export const dynamic = "force-dynamic";

export default async function CarePage() {
  const s = await currentSession();
  if (!s) redirect("/care/login");
  return <CareApp name={s.n} canWrite={canWrite(s)} />;
}
