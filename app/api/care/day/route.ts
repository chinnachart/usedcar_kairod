import { NextResponse } from "next/server";
import { currentSession } from "@/lib/care/auth";
import { readDay } from "@/lib/care/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const s = await currentSession();
  if (!s) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  const date = new URL(req.url).searchParams.get("date") || "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "วันที่ไม่ถูกต้อง" }, { status: 400 });
  try {
    return NextResponse.json(await readDay(date), { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "อ่าน Google Sheet ไม่ได้" }, { status: 502 });
  }
}
