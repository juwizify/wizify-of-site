import { StarIcon } from "../../icons/Icons";
import Faq from "./Faq";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "« Enfin une formation DDA qui ne donne pas envie de dormir. Les infographies sont claires, les quiz vraiment utiles. Mon équipe a adoré. »",
    name: "Sophie M.",
    role: "Responsable formation — Banque Populaire",
  },
  {
    quote:
      "« Le format micro-learning est parfait pour mes conseillers. 15 minutes par jour, pas besoin de bloquer une journée entière. Et le taux de complétion a explosé. »",
    name: "Marc D.",
    role: "CGP indépendant — ANACOFI",
  },
  {
    quote:
      "« L'accompagnement au financement OPCO a été un vrai plus. Tout était pris en charge, on n'a eu qu'à se concentrer sur l'apprentissage. »",
    name: "Julie R.",
    role: "Responsable conformité — Crédit Agricole",
  },
];

function Card({ t }: { t: Testimonial }) {
  return (
    <article
      className="bg-white rounded-xl p-7 px-8 flex flex-col gap-5 border border-[var(--color-line)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex gap-[2px] text-[var(--color-warning)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="w-4 h-4" />
        ))}
      </div>
      <p className="text-[15px] text-[var(--color-text)] leading-[1.6]">{t.quote}</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 rounded-full bg-[var(--color-brand-100)]" />
        <div className="flex flex-col gap-[2px]">
          <p className="text-[14px] font-semibold text-[var(--color-ink)]">{t.name}</p>
          <p className="text-[12px] text-[var(--color-text-muted)]">{t.role}</p>
        </div>
      </div>
    </article>
  );
}

export default function Temoignages() {
  return (
    <section className="w-full bg-white px-[120px] py-[100px] flex flex-col items-center gap-14 border-t border-[var(--color-line)]">
      <div className="w-[800px] flex flex-col items-center gap-4">
        <p className="text-[14px] font-semibold text-[var(--color-brand)] tracking-[3px] uppercase">
          TÉMOIGNAGES
        </p>
        <h2 className="w-[700px] text-[38px] font-bold text-[var(--color-ink)] tracking-[-2px] leading-[1.2] text-center">
          Ce qu&apos;en disent nos apprenants.
        </h2>
      </div>

      <div className="w-[1100px] grid grid-cols-3 gap-6 items-stretch">
        {TESTIMONIALS.map((t) => (
          <Card key={t.name} t={t} />
        ))}
      </div>

      <Faq />
    </section>
  );
}
