import type { Metadata } from "next";
import "./care.css";

export const metadata: Metadata = {
  title: { absolute: "บันทึกดูแลคุณพ่อ" },
  robots: { index: false, follow: false },
};

export default function CareLayout({ children }: { children: React.ReactNode }) {
  return <div className="care-app">{children}</div>;
}
