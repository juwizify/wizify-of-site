import { ArrowRightIcon, PlayIcon, ShieldIcon } from "../../icons/Icons";

const LOGOS = ["Qualiopi", "OPCO Atlas", "ANACOFI", "CNCGP"];

export default function Hero() {
  return (
    <section className="w-full px-[120px] pt-20 pb-[100px] flex flex-col items-center gap-10">
      {/* Badge */}
      <div className="bg-[var(--color-brand-200)] rounded-[24px] px-5 py-2 flex items-center gap-2">
        <ShieldIcon className="w-[18px] h-[18px] text-[var(--color-brand)]" />
        <span className="text-[14px] font-semibold text-[var(--color-brand)]">
          Certifié Qualiopi — Formation professionnelle
        </span>
      </div>

      {/* H1 */}
      <h1 className="text-[42px] font-bold text-[var(--color-ink)] tracking-[-1.5px] text-center leading-[1.1]">
        La formation bancaire
        <br />
        et financière, enfin conçue
        <br />
        pour être comprise.
      </h1>

      {/* Subtitle */}
      <p className="text-[18px] text-[var(--color-text)] text-center leading-[1.5]">
        Micro-learning visuel, gamifié, conforme — financé par votre OPCO.
        <br />
        Pour les CGP, banquiers et professionnels de la finance.
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-4">
        <a
          href="#formations"
          className="h-13 bg-[var(--color-brand)] text-white rounded-xl px-10 py-4 flex items-center gap-[10px] text-[18px] font-semibold hover:bg-[var(--color-brand-hover)] transition-colors"
        >
          Voir nos formations
          <ArrowRightIcon className="w-5 h-5" />
        </a>
        <a
          href="#contact"
          className="h-13 bg-white text-[var(--color-brand)] rounded-xl px-10 py-4 flex items-center gap-[10px] text-[18px] font-semibold border border-[var(--color-brand)] hover:bg-[var(--color-brand-50)] transition-colors"
        >
          Nous contacter
        </a>
      </div>

      {/* Logo bar */}
      <div className="w-full pt-10 flex flex-col items-center gap-5">
        <p className="text-[14px] font-medium text-[var(--color-text-muted)]">
          Ils nous font confiance
        </p>
        <div className="flex items-center justify-center gap-12">
          {LOGOS.map((l) => (
            <div
              key={l}
              className="bg-[var(--color-chip)] rounded-lg px-6 py-3 flex items-center justify-center"
            >
              <span className="text-[14px] font-medium text-[var(--color-text-muted)]">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Video placeholder */}
      <div className="w-[900px] h-[506px] bg-[var(--color-ink)] rounded-2xl flex flex-col items-center justify-center gap-5">
        <button
          aria-label="Lecture"
          className="w-24 h-24 bg-[var(--color-brand)] rounded-full flex items-center justify-center hover:bg-[var(--color-brand-hover)] transition-colors"
        >
          <PlayIcon className="w-12 h-12 text-white" />
        </button>
        <p className="text-[18px] font-medium text-white text-center">
          Découvrez notre approche
          <br />
          en 2 minutes
        </p>
      </div>
    </section>
  );
}
