import { CheckIcon, XIcon } from "../../icons/Icons";

const AVANT = [
  "PDF statiques et indigestes",
  "QCM ennuyeux et répétitifs",
  "Taux de complétion < 30%",
  "Aucun engagement apprenant",
];

const APRES = [
  "Micro-learning visuel et interactif",
  "Quiz gamifiés et engageants",
  "88% de taux de complétion",
  "Attestations conformes incluses",
];

export default function AvantApres() {
  return (
    <section
      className="w-full bg-[var(--color-brand)] px-[120px] py-[100px] rounded-t-[40px] flex flex-col items-center gap-14"
      style={{ boxShadow: "0 0 24px rgb(0 0 0 / 0.125)" }}
    >
      <p className="text-[14px] font-semibold text-white tracking-[3px] uppercase">LA PÉDAGOGIE</p>
      <h2 className="text-[38px] font-bold text-white tracking-[-2px] text-center leading-[1.1]">
        La formation réglementaire
        <br />
        peut être mieux.
      </h2>

      <div className="w-[1100px] grid grid-cols-2 gap-10">
        <div className="bg-white/10 rounded-xl p-7 px-8 flex flex-col gap-5 border border-white/20">
          <h3 className="text-[24px] font-bold text-white">Avant</h3>
          {AVANT.map((t) => (
            <div key={t} className="flex items-center gap-3">
              <XIcon className="w-5 h-5 text-[var(--color-danger)]" />
              <span className="text-[16px] text-white">{t}</span>
            </div>
          ))}
        </div>

        <div className="bg-white/10 rounded-xl p-7 px-8 flex flex-col gap-5 border border-white/20">
          <h3 className="text-[24px] font-bold text-white">Après</h3>
          {APRES.map((t) => (
            <div key={t} className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-[var(--color-success)]" />
              <span className="text-[16px] text-white">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
