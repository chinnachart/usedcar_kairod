// ส่ง event ไป Vercel Web Analytics และ GA4 (ถ้าตั้ง NEXT_PUBLIC_GA_ID ไว้) — "generate_lead" = ลีด
import { track as vercelTrack } from "@vercel/analytics";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}
export function track(event: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  try { vercelTrack(event, params); } catch {}
  if (window.gtag) window.gtag("event", event, params);
}
