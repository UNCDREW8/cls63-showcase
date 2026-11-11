export default function SectionHead({ number, label }: { number: string; label: string }) {
  return (
    <div className="section-head">
      <span className="section-head__num">{number}</span>
      <span className="section-head__rule" aria-hidden="true" />
      <span className="section-head__label eyebrow">{label}</span>
    </div>
  );
}
