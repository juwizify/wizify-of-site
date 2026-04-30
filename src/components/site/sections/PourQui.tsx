import { ScaleIcon, UserIcon, UsersIcon } from "../../icons/Icons";
import type { ComponentType, SVGProps } from "react";

type Persona = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  bullets: string[];
  cta: string;
};

const PERSONAS: Persona[] = [
  {
    Icon: UserIcon,
    title: "CGP indépendants",
    bullets: [
      "Obligations DDA, DCI, LCB-FT",
      "Formation continue annuelle obligatoire",
      "Financement OPCO Atlas simplifié",
    ],
    cta: "Découvrir les parcours CGP →",
  },
  {
    Icon: UsersIcon,
    title: "Responsables formation & DRH",
    bullets: [
      "Déployer des formations engageantes",
      "Suivre les taux de complétion en temps réel",
      "Générer les attestations automatiquement",
    ],
    cta: "Voir les solutions entreprise →",
  },
  {
    Icon: ScaleIcon,
    title: "Responsables conformité",
    bullets: [
      "Preuves de formation auditables",
      "Contenus conformes ACPR et AMF",
      "Mise à jour réglementaire continue",
    ],
    cta: "Voir les formations conformité →",
  },
];

export default function PourQui() {
  return (
    <section
      className="w-full bg-[var(--color-brand)] px-[120px] py-[100px] rounded-t-[40px] flex flex-col items-center gap-14"
      style={{ boxShadow: "var(--shadow-hero)" }}
    >
      <div className="w-[800px] flex flex-col items-center gap-4">
        <p className="text-[14px] font-semibold text-white tracking-[3px] uppercase">POUR QUI</p>
        <h2 className="w-[700px] text-[38px] font-bold text-white tracking-[-2px] leading-[1.2] text-center">
          Des formations pensées pour votre réalité terrain.
        </h2>
      </div>

      <div className="w-[1100px] grid grid-cols-3 gap-6 items-stretch">
        {PERSONAS.map((p) => (
          <article
            key={p.title}
            className="bg-white rounded-xl p-7 px-8 flex flex-col gap-5 border border-[var(--color-line)]"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="w-[60px] h-[60px] bg-[var(--color-brand-100)] rounded-2xl flex items-center justify-center">
              <p.Icon className="w-6 h-6 text-[var(--color-brand)]" />
            </div>
            <h3 className="text-[20px] font-bold text-[var(--color-ink)]">{p.title}</h3>
            <ul className="flex flex-col gap-[10px]">
              {p.bullets.map((b) => (
                <li key={b} className="text-[15px] text-[var(--color-text)] leading-[1.5]">
                  • {b}
                </li>
              ))}
            </ul>
            <a href="#" className="text-[14px] font-semibold text-[var(--color-brand)] mt-auto">
              {p.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
