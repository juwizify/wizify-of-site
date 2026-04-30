import { AwardIcon, BookIcon, ChartIcon, GamepadIcon } from "../../icons/Icons";
import type { ComponentType, SVGProps } from "react";

type Block = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
};

const BLOCKS: Block[] = [
  {
    Icon: BookIcon,
    title: "Micro-learning illustré",
    desc: "Séquences courtes de 5 à\n15 minutes, rythmées par\ndes visuels pédagogiques.",
  },
  {
    Icon: ChartIcon,
    title: "Infographies visuelles",
    desc: "Chaque concept clé\nsynthétisé dans une fiche\nvisuelle mémorisable.",
  },
  {
    Icon: GamepadIcon,
    title: "Quiz gamifiés",
    desc: "Des évaluations interactives\nqui renforcent la\nmémorisation.",
  },
  {
    Icon: AwardIcon,
    title: "Attestations conformes",
    desc: "Certificats et attestations\ngénérés automatiquement,\nconformes Qualiopi.",
  },
];

export default function Pedagogie() {
  return (
    <section className="w-full px-[120px] py-[100px] flex flex-col items-center gap-14">
      <p className="text-[14px] font-semibold text-[var(--color-brand)] tracking-[3px] uppercase">
        NOTRE APPROCHE
      </p>
      <h2 className="text-[38px] font-bold text-[var(--color-ink)] tracking-[-2px] text-center leading-[1.1]">
        Apprendre autrement.
        <br />
        Retenir vraiment.
      </h2>

      <div className="w-[1100px] grid grid-cols-4 gap-6">
        {BLOCKS.map((b) => (
          <div key={b.title} className="px-5 py-6 flex flex-col gap-4">
            <div className="w-[60px] h-[60px] bg-[var(--color-brand-100)] rounded-2xl flex items-center justify-center">
              <b.Icon className="w-6 h-6 text-[var(--color-brand)]" />
            </div>
            <h3 className="text-[20px] font-bold text-[var(--color-ink)]">{b.title}</h3>
            <p className="text-[16px] text-[var(--color-text)] leading-[1.5] whitespace-pre-line">
              {b.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="w-[743px] h-[418px] bg-[var(--color-chip)] rounded-[20px] flex items-center justify-center">
        <p className="text-[18px] font-medium text-[var(--color-text-muted)] text-center">
          Aperçu de la plateforme
        </p>
      </div>
    </section>
  );
}
