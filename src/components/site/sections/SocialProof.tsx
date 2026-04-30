const STATS = [
  { num: "97%", label: "Taux de satisfaction" },
  { num: "2 500+", label: "Apprenants formés" },
  { num: "100%", label: "Finançable OPCO" },
];

export default function SocialProof() {
  return (
    <section className="w-full bg-[var(--color-surface)] px-[120px] py-20 flex flex-col items-center gap-8">
      <p className="text-[14px] font-semibold text-[var(--color-brand)] tracking-[3px] uppercase">
        EN CHIFFRES
      </p>
      <div className="w-[1100px] flex items-center justify-center gap-16">
        {STATS.map((s) => (
          <div key={s.num} className="flex-1 flex flex-col items-center gap-2">
            <p className="text-[56px] font-bold text-[var(--color-brand)] leading-none">{s.num}</p>
            <p className="text-[16px] text-[var(--color-text)]">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
