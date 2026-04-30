import { ArrowRightIcon } from "../../icons/Icons";

const LOGOS = ["OPCO Atlas", "CPF", "FNE-Formation", "Qualiopi"];

export default function Financement() {
  return (
    <section className="w-full bg-[var(--color-surface)] px-[120px] py-20 flex flex-col items-center gap-10">
      <div className="w-[800px] flex flex-col items-center gap-4">
        <p className="text-[14px] font-semibold text-[var(--color-brand)] tracking-[3px] uppercase">
          FINANCEMENT
        </p>
        <h2 className="w-[700px] text-[38px] font-bold text-[var(--color-ink)] tracking-[-2px] leading-[1.2] text-center">
          Vos formations financées jusqu&apos;à 100%.
        </h2>
        <p className="w-[650px] text-[18px] text-[var(--color-text)] leading-[1.6] text-center">
          En tant qu&apos;organisme certifié Qualiopi, nos formations sont éligibles aux financements
          OPCO, CPF et FNE-Formation. On vous accompagne dans les démarches.
        </p>
      </div>

      <div className="w-[800px] flex items-center justify-center gap-12">
        {LOGOS.map((l) => (
          <div
            key={l}
            className="w-40 h-20 bg-white rounded-xl flex items-center justify-center border border-[var(--color-line)]"
          >
            <span className="text-[14px] font-semibold text-[var(--color-text-muted)]">{l}</span>
          </div>
        ))}
      </div>

      <a
        href="#"
        className="h-12 bg-[var(--color-brand)] text-white rounded-xl px-10 py-4 flex items-center gap-2 text-[18px] font-semibold hover:bg-[var(--color-brand-hover)] transition-colors"
      >
        Comment financer ma formation ?
        <ArrowRightIcon className="w-[18px] h-[18px]" />
      </a>
    </section>
  );
}
