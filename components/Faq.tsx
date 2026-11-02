import JsonLd from "./JsonLd";

export type QA = { q: string; a: string };

export default function Faq({ items, title = "คำถามที่พบบ่อย" }: { items: QA[]; title?: string }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      <div className="faq">
        {items.map((x) => (
          <details key={x.q}>
            <summary>{x.q}</summary>
            <p>{x.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
      }} />
    </section>
  );
}
