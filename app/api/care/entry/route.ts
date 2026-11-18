import { NextResponse } from "next/server";
import { currentSession, canWrite } from "@/lib/care/auth";
import { writeHour } from "@/lib/care/sheets";

export const runtime = "nodejs";

// Body: { date: "YYYY-MM-DD", hour: "00".."23", value: -100..100 | null, med: boolean }
export async function POST(req: Request) {
  const s = await currentSession();
  if (!s) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  if (!canWrite(s)) return NextResponse.json({ error: "บัญชีนี้ดูได้อย่างเดียว" }, { status: 403 });

  let b: { date?: string; hour?: string; value?: number | null; med?: boolean };
  try { b = await req.json(); } catch { b = {}; }
  const date = String(b.date || "");
  const hour = String(b.hour || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3])$/.test(hour)) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }
  let value: number | null = null;
  if (b.value !== null && b.value !== undefined) {
    const v = Number(b.value);
    if (!Number.isFinite(v)) return NextResponse.json({ error: "ค่าอาการไม่ถูกต้อง" }, { status: 400 });
    value = Math.max(-100, Math.min(100, Math.round(v)));
  }
  try {
    await writeHour(date, hour, value, Boolean(b.med), s.n || s.u);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "บันทึกลง Google Sheet ไม่สำเร็จ" }, { status: 502 });
  }
}
