import { ArrowRightIcon, CheckIcon } from "../../icons/Icons";

type Card = {
  badge: string;
  title: string;
  meta: string;
};

const CARDS: Card[] = [
  { badge: "Assurance", title: "DDA — Directive\nDistribution Assurance", meta: "15h • E-learning" },
  { badge: "Crédit", title: "DCI — Directive\nCrédit Immobilier", meta: "7h • E-learning" },
  { badge: "Conformité", title: "LCB-FT — Lutte\nanti-blanchiment", meta: "7h • E-learning" },
  { badge: "Certification", title: "Certification AMF", meta: "35h • Blended" },
];

function FormationCard({ c }: { c: Card }) {
  return (
    <article
      className="bg-white rounded-xl p-7 px-8 flex flex-col gap-4 border border-[var(--color-line)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <span className="self-start bg-[var(--color-brand-200)] text-[var(--color-brand)] text-[12px] font-semibold rounded-lg px-3 py-1">
        {c.badge}
      </span>
      <h3 className="text-[18px] font-bold text-[var(--color-ink)] whitespace-pre-line leading-[1.3]">
        {c.title}
      </h3>
      <p className="text-[14px] text-[var(--color-text-muted)]">{c.meta}</p>
      <div className="flex items-center gap-2">
        <CheckIcon className="w-4 h-4 text-[var(--color-success)]" />
        <span className="text-[14px] font-medium text-[var(--color-success)]">Finançable OPCO</span>
      </div>
      <a href="#" className="text-[14px] font-semibold text-[var(--color-brand)] mt-auto">
        En savoir plus →
      </a>
    </article>
  );
}

export default function Formations() {
  return (
    <section
      id="formations"
      className="w-full px-[120px] py-[100px] flex flex-col items-center gap-14"
    >
      <p className="text-[14px] font-semibold text-[var(--color-brand)] tracking-[3px] uppercase">
        NOS FORMATIONS
      </p>
      <h2 className="text-[38px] font-bold text-[var(--color-ink)] tracking-[-2px] text-center leading-[1.1]">
        Des parcours conçus
        <br />
        pour votre métier.
      </h2>
      <p className="text-[18px] text-[var(--color-text)] text-center">
        Conformes, finançables, prêtes à déployer.
      </p>

      <div className="w-[1100px] grid grid-cols-4 gap-6 items-stretch">
        {CARDS.map((c) => (
          <FormationCard key={c.badge} c={c} />
        ))}
      </div>

      <a
        href="#"
        className="bg-[var(--color-brand)] text-white rounded-lg px-8 py-4 flex items-center gap-2 text-[16px] font-semibold hover:bg-[var(--color-brand-hover)] transition-colors"
      >
        Voir nos formations
        <ArrowRightIcon className="w-4 h-4" />
      </a>
    </section>
  );
}
