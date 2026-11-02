// ส่ง event ไป GA4 (ถ้าตั้ง NEXT_PUBLIC_GA_ID ไว้) — ใช้ตั้งเป็น Key event ใน GA4 เพื่อนับลีด
declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && window.gtag) window.gtag("event", event, params);
}
