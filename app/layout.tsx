import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { SITE, abs, lineAddFriendUrl } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCta from "@/components/FloatingCta";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";

const font = Noto_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "รับซื้อรถมือสอง กรุงเทพฯ ให้ราคาสูง ประเมินฟรีทาง LINE | KaiRod", template: "%s | KaiRod" },
  description: "รับซื้อรถมือสองทุกยี่ห้อทั่วกรุงเทพฯ 50 เขต ประเมินราคาฟรีผ่าน LINE นัดดูรถถึงที่ รถติดไฟแนนซ์ก็ขายได้ จ่ายเงินไว เอกสารถูกต้อง",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "th_TH", siteName: SITE.fullName },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
};

export const viewport: Viewport = { themeColor: "#0b5cff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={font.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingCta />
        <Analytics />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "AutomotiveBusiness",
          "@id": abs("/#business"),
          name: SITE.fullName,
          url: SITE.url,
          description: "บริการรับซื้อรถยนต์มือสองทุกยี่ห้อในกรุงเทพมหานคร",
          areaServed: { "@type": "City", name: "กรุงเทพมหานคร" },
          ...(SITE.phone ? { telephone: SITE.phone } : {}),
          sameAs: [lineAddFriendUrl()],
        }} />
      </body>
    </html>
  );
}
