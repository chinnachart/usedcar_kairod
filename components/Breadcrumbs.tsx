import Link from "next/link";
import JsonLd from "./JsonLd";
import { abs } from "@/lib/site";

export type Crumb = { name: string; path: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "หน้าแรก", path: "/" }, ...items];
  return (
    <>
      <nav className="breadcrumbs" aria-label="breadcrumb">
        {all.map((c, i) => (
          <span key={c.path}>
            {i < all.length - 1 ? <Link href={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
            {i < all.length - 1 && " › "}
          </span>
        ))}
      </nav>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
      }} />
    </>
  );
}
