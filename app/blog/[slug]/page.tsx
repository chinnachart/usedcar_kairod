import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { CtaBox, RelatedPosts } from "@/components/Sections";
import { POSTS, postBySlug, type Block } from "@/lib/posts";
import { SITE, abs } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = postBySlug((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.description, publishedTime: p.date },
  };
}

function render(b: Block, i: number) {
  if ("h2" in b) return <h2 key={i}>{b.h2}</h2>;
  if ("p" in b) return <p key={i}>{b.p}</p>;
  if ("ul" in b) return <ul key={i}>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>;
  return <ol key={i}>{b.ol.map((x) => <li key={x}>{x}</li>)}</ol>;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = postBySlug((await params).slug);
  if (!p) notFound();
  return (
    <div className="container">
      <Breadcrumbs items={[{ name: "บทความ", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }]} />
      <article className="section prose">
        <h1>{p.title}</h1>
        <p className="muted">อัปเดต {new Date(p.date).toLocaleDateString("th-TH", { dateStyle: "long" })}</p>
        {p.blocks.map(render)}
      </article>
      <CtaBox />
      <section className="section"><h2>บทความที่เกี่ยวข้อง</h2><RelatedPosts exclude={p.slug} /></section>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        dateModified: p.date,
        mainEntityOfPage: abs(`/blog/${p.slug}`),
        author: { "@type": "Organization", name: SITE.fullName },
        publisher: { "@id": abs("/#business") },
      }} />
    </div>
  );
}
