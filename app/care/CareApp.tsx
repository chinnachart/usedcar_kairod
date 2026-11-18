"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Day = { hours: Record<string, number>; meds: Record<string, boolean>; updatedAt?: string; updatedBy?: string };

const TH_MONTHS = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const TH_DAYS = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];
const THUMB = 30;

const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (k: string) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const thaiDate = (k: string) => { const d = fromKey(k); return `${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`; };
const signed = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : "0");
const zone = (v: number) => (v < 0 ? "stiff" : v > 0 ? "dys" : "ok");
function words(v: number) {
  if (v === 0) return "ปกติ";
  const a = Math.abs(v), base = v < 0 ? "เกร็ง" : "ยุกยิก";
  return a <= 30 ? `${base}เล็กน้อย` : a <= 60 ? `${base}ปานกลาง` : `${base}มาก`;
}
const shiftDay = (k: string, n: number) => { const d = fromKey(k); d.setDate(d.getDate() + n); return keyOf(d); };

function buildReport(day: string, data: Day) {
  const lines = [`อาการคุณพ่อ วันที่ ${thaiDate(day)}`, "(เกร็ง −100 · ปกติ 0 · ยุกยิก +100)"];
  for (let h = 0; h <= 23; h++) {
    const k = pad(h), v = data.hours[k], m = data.meds[k];
    if (typeof v !== "number" && !m) continue;
    lines.push(`${k}.00 ${typeof v === "number" ? `${words(v)} (${signed(v)})` : "–"}${m ? " · กินยา" : ""}`);
  }
  if (lines.length === 2) lines.push("ยังไม่มีการบันทึก");
  return lines.join("\n");
}

export default function CareApp({ name, canWrite }: { name: string; canWrite: boolean }) {
  const [today, setToday] = useState(() => keyOf(new Date()));
  const [day, setDay] = useState(today);
  const [data, setData] = useState<Day>({ hours: {}, meds: {} });
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState("");
  const [showNight, setShowNight] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [nowH, setNowH] = useState(() => new Date().getHours());
  const [path, setPath] = useState("");

  const dataRef = useRef(data); dataRef.current = data;
  const dayRef = useRef(day); dayRef.current = day;
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const inflight = useRef(0);
  const lastEdit = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputs = useRef(new Map<string, HTMLInputElement>());
  const scrolled = useRef(false);

  const hours: number[] = [];
  if (showNight) for (let h = 0; h <= 4; h++) hours.push(h);
  for (let h = 5; h <= 23; h++) hours.push(h);

  useEffect(() => { try { setShowNight(localStorage.getItem("care-night") === "1"); } catch {} }, []);

  // ---------- load + poll ----------
  const load = useCallback(async (d: string, quiet = false) => {
    if (!quiet) setStatus("กำลังโหลด…");
    try {
      const res = await fetch(`/api/care/day?date=${d}`, { cache: "no-store" });
      if (res.status === 401) { window.location.href = "/care/login"; return; }
      if (!res.ok) throw new Error();
      const j = (await res.json()) as Day;
      // ignore if the day changed or the caregiver edited while this was in flight
      if (d !== dayRef.current || timers.current.size || inflight.current || Date.now() - lastEdit.current < 3000) return;
      setData({ hours: j.hours || {}, meds: j.meds || {}, updatedAt: j.updatedAt, updatedBy: j.updatedBy });
      setLoaded(true);
      if (!quiet) setStatus("");
    } catch {
      if (!quiet) setStatus("โหลดข้อมูลไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองใหม่");
    }
  }, []);

  useEffect(() => {
    setLoaded(false);
    setData({ hours: {}, meds: {} });
    load(day);
    const t = setInterval(() => {
      if (document.hidden) return;
      setNowH(new Date().getHours());
      const k = keyOf(new Date());
      setToday(k);
      load(dayRef.current, true);
    }, 30000);
    return () => clearInterval(t);
  }, [day, load]);

  // ---------- save ----------
  const save = useCallback(async (d: string, hour: string) => {
    timers.current.delete(`${d}|${hour}`);
    const cur = dataRef.current;
    const v = cur.hours[hour];
    inflight.current++;
    setStatus("กำลังบันทึก…");
    try {
      const res = await fetch("/api/care/entry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date: d, hour, value: typeof v === "number" ? v : null, med: !!cur.meds[hour] }),
      });
      if (res.status === 401) { window.location.href = "/care/login"; return; }
      if (!res.ok) throw new Error();
      if (!timers.current.size && inflight.current === 1) setStatus(`บันทึกแล้ว ${new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.`);
    } catch {
      setStatus("บันทึกไม่สำเร็จ ตรวจอินเทอร์เน็ต แล้วเลื่อนใหม่อีกครั้ง");
    } finally {
      inflight.current--;
    }
  }, []);

  const schedule = useCallback((hour: string) => {
    const d = dayRef.current, key = `${d}|${hour}`;
    lastEdit.current = Date.now();
    clearTimeout(timers.current.get(key));
    timers.current.set(key, setTimeout(() => save(d, hour), 700));
    setStatus("กำลังบันทึก…");
  }, [save]);

  const flushAll = useCallback(() => {
    timers.current.forEach((t, key) => { clearTimeout(t); const [d, h] = key.split("|"); save(d, h); });
  }, [save]);

  useEffect(() => {
    const onHide = () => { if (document.hidden) flushAll(); };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [flushAll]);

  function setHour(hour: string, v: number | null) {
    setData((p) => {
      const hours = { ...p.hours };
      if (v === null) delete hours[hour]; else hours[hour] = v;
      return { ...p, hours };
    });
    schedule(hour);
  }
  function toggleMed(hour: string) {
    setData((p) => {
      const meds = { ...p.meds };
      if (meds[hour]) delete meds[hour]; else meds[hour] = true;
      return { ...p, meds };
    });
    schedule(hour);
  }
  function goDay(k: string) { flushAll(); scrolled.current = k !== today; setDay(k); }

  // ---------- line graph through the slider thumbs ----------
  const drawLine = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;
    const box = body.getBoundingClientRect();
    let d = "", prev = false;
    for (const h of hours) {
      const k = pad(h), v = dataRef.current.hours[k];
      const el = inputs.current.get(k);
      if (typeof v !== "number" || !el) { prev = false; continue; }
      const r = el.getBoundingClientRect();
      const x = r.left - box.left + THUMB / 2 + ((v + 100) / 200) * (r.width - THUMB);
      const y = r.top - box.top + r.height / 2;
      d += `${prev ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)} `;
      prev = true;
    }
    setPath(d.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNight]);

  useLayoutEffect(() => { drawLine(); }, [data, drawLine]);
  useEffect(() => {
    window.addEventListener("resize", drawLine);
    document.fonts?.ready.then(drawLine);
    return () => window.removeEventListener("resize", drawLine);
  }, [drawLine]);

  useEffect(() => {
    if (loaded && !scrolled.current && day === today) {
      scrolled.current = true;
      document.getElementById(`care-h-${pad(nowH)}`)?.scrollIntoView({ block: "center" });
    }
  }, [loaded, day, today, nowH]);

  // ---------- summary ----------
  const vals = Object.values(data.hours);
  const nStiff = vals.filter((v) => v < 0).length, nOk = vals.filter((v) => v === 0).length, nDys = vals.filter((v) => v > 0).length;
  const nMed = Object.values(data.meds).filter(Boolean).length;
  const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  const isToday = day === today;
  const report = buildReport(day, data);

  async function copyReport() {
    try { await navigator.clipboard.writeText(report); setCopied("คัดลอกแล้ว"); }
    catch { setCopied("คัดลอกไม่ได้ กดค้างที่ข้อความเพื่อคัดลอกเอง"); }
    setTimeout(() => setCopied(""), 2500);
  }
  async function logout() {
    flushAll();
    await fetch("/api/care/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/care/login";
  }

  return (
    <div className="care-wrap">
      <header className="care-top">
        <div>
          <h1>บันทึกดูแลคุณพ่อ</h1>
          <p className="care-sub">สวัสดี {name}{canWrite ? "" : " · ดูได้อย่างเดียว"}</p>
        </div>
        <button className="care-ghost care-sm" type="button" onClick={logout}>ออกจากระบบ</button>
      </header>

      <div className="care-daybar">
        <button className="care-icon" type="button" aria-label="วันก่อนหน้า" onClick={() => goDay(shiftDay(day, -1))}>‹</button>
        <div className="care-date">
          <span>{thaiDate(day)}</span>
          <small>
            วัน{TH_DAYS[fromKey(day).getDay()]}{isToday ? " · วันนี้" : " "}
            {!isToday && <button className="care-link" type="button" onClick={() => goDay(today)}>กลับไปวันนี้</button>}
          </small>
        </div>
        <button className="care-icon" type="button" aria-label="วันถัดไป" disabled={isToday} onClick={() => goDay(shiftDay(day, 1))}>›</button>
      </div>

      <section className="care-summary" aria-label="สรุปวันนี้">
        <div className="care-counts">
          <div className="c-stiff"><b>{nStiff}</b><span>ชม. เกร็ง</span></div>
          <div className="c-ok"><b>{nOk}</b><span>ชม. ปกติ</span></div>
          <div className="c-dys"><b>{nDys}</b><span>ชม. ยุกยิก</span></div>
          <div className="c-med"><b>{nMed}</b><span>ครั้งกินยา</span></div>
        </div>
        <div className="care-bar" aria-hidden="true">
          {vals.length > 0 && ([["stiff", nStiff], ["ok", nOk], ["dys", nDys]] as const).map(([z, n]) =>
            n ? <i key={z} style={{ width: `${(n / vals.length) * 100}%`, background: `var(--c-${z})` }} /> : null)}
        </div>
        <div className="care-extra">
          {vals.length
            ? `บันทึก ${vals.length} ชม. · เกร็งหนักสุด ${signed(Math.min(0, ...vals))} · ยุกยิกมากสุด ${signed(Math.max(0, ...vals))} · ค่าเฉลี่ย ${signed(avg)}`
            : loaded ? "ยังไม่มีการบันทึกของวันนี้" : " "}
        </div>
      </section>

      {canWrite && (
        <p className="care-how">เลื่อนจุดของแต่ละชั่วโมงไปซ้ายหรือขวา ยิ่งไปทางซ้ายยิ่งเกร็งมาก (สุดที่ −100) ตรงกลางคือปกติ (0) ยิ่งไปทางขวายิ่งยุกยิกมาก (สุดที่ +100) เช่น เกร็งนิดหน่อยให้เลื่อนไปที่ −10</p>
      )}

      <section className="care-chart" aria-label="กราฟอาการรายชั่วโมง">
        <div className="care-chead">
          <span className="care-th">เวลา</span>
          <div className="care-scale"><span>เกร็ง<small>−100</small></span><span>ปกติ<small>0</small></span><span>ยุกยิก<small>+100</small></span></div>
          <span className="care-medh">ยา</span>
        </div>
        <button className="care-night" type="button" onClick={() => {
          const v = !showNight; setShowNight(v);
          try { localStorage.setItem("care-night", v ? "1" : "0"); } catch {}
        }}>{showNight ? "ซ่อนช่วงกลางคืน 00–04 น." : "แสดงช่วงกลางคืน 00–04 น."}</button>
        <div className="care-body" ref={bodyRef}>
          <svg className="care-plot" aria-hidden="true"><path d={path} /></svg>
          {hours.map((h) => {
            const k = pad(h);
            const v = data.hours[k];
            const set = typeof v === "number";
            const z = set ? zone(v) : "";
            return (
              <div key={k} id={`care-h-${k}`} className={`care-row${set ? "" : " unset"}${isToday && h === nowH ? " now" : ""}`} data-zone={z}>
                <div className="care-hr">{k}.00</div>
                <div className="care-slot">
                  <div className="care-val">
                    {set ? (
                      <>
                        <b>{signed(v)} {words(v)}</b>
                        {canWrite && <button type="button" className="care-clr" onClick={() => setHour(k, null)}>ล้าง</button>}
                      </>
                    ) : (
                      <span className="care-hint">{canWrite ? "ยังไม่บันทึก · แตะหรือเลื่อน" : "ยังไม่บันทึก"}</span>
                    )}
                  </div>
                  <span className="care-zero" />
                  <input
                    ref={(el) => { if (el) inputs.current.set(k, el); else inputs.current.delete(k); }}
                    type="range" min={-100} max={100} step={5}
                    value={set ? v : 0}
                    disabled={!canWrite}
                    style={set ? ({ "--tc": `var(--c-${z})` } as React.CSSProperties) : undefined}
                    aria-label={`อาการเวลา ${k}.00 น. ซ้ายคือเกร็ง ขวาคือยุกยิก`}
                    aria-valuetext={set ? `${signed(v)} ${words(v)}` : "ยังไม่บันทึก"}
                    onPointerDown={() => { if (!set) setHour(k, 0); }}
                    onChange={(e) => setHour(k, Number(e.target.value))}
                  />
                </div>
                <button type="button" className="care-med" aria-pressed={!!data.meds[k]} aria-label={`${k}.00 น. กินยา`} disabled={!canWrite} onClick={() => toggleMed(k)}>
                  {data.meds[k] ? "กินแล้ว" : "ยา"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <p className="care-status" role="status">{status}</p>
      {data.updatedBy && <p className="care-status">แก้ไขล่าสุดโดย {data.updatedBy}</p>}

      <section className="care-report">
        <button className="care-ghost" type="button" onClick={() => setReportOpen((o) => !o)}>ข้อความสรุปสำหรับส่ง LINE</button>
        {reportOpen && (
          <>
            <pre>{report}</pre>
            <button className="care-ghost" type="button" onClick={copyReport}>{copied || "คัดลอกข้อความ"}</button>
          </>
        )}
      </section>
    </div>
  );
}
