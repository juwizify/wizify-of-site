import { PlusIcon } from "../../icons/Icons";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "Est-ce que les contenus sont conformes aux exigences réglementaires ?",
    a: "On travaille avec des banques et assureurs depuis des années. On sait ce que vos équipes conformité vont demander et on l'intègre dès la conception.",
  },
  {
    q: "Qui est propriétaire des contenus livrés ?",
    a: "Vous. Les créations vous appartiennent dès le paiement complet. On vous livre les fichiers sources.",
  },
  {
    q: "Dans quels formats sont livrés les contenus ?",
    a: "PNG, SVG, PDF selon le projet — prêts à diffuser sur tous vos canaux.",
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "Ça dépend du projet. On définit le planning ensemble lors du Diagnostic Pédagogique.",
  },
  {
    q: "Combien ça coûte ?",
    a: "Une fiche pédagogique, c'est à partir de 1 500 € HT. Chaque projet est différent — le Diagnostic Pédagogique est gratuit et sans engagement, il permet de cadrer vos besoins et de vous proposer un tarif adapté.",
  },
  {
    q: "On peut commencer avec un petit projet pour tester ?",
    a: "Absolument. Beaucoup de nos clients commencent par une ou deux fiches avant d'aller plus loin. Le Diagnostic sert aussi à ça — identifier le bon point de départ.",
  },
];

export default function Faq() {
  return (
    <div className="w-full bg-white pt-[100px] flex flex-col items-center gap-14 border-t border-[var(--color-line)]">
      <div className="w-[800px] flex flex-col items-center gap-4">
        <p className="text-[14px] font-semibold text-[var(--color-brand)] tracking-[3px] uppercase">
          FAQ
        </p>
        <h2 className="text-[38px] font-bold text-[var(--color-ink)] tracking-[-2px] text-center">
          Questions fréquentes
        </h2>
      </div>

      <div className="w-[800px] flex flex-col">
        {ITEMS.map((it, i) => (
          <details key={i} className="group py-6 border-b border-[var(--color-line-2)] last:border-b-0">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-[16px] font-semibold text-[var(--color-ink)]">{it.q}</span>
              <PlusIcon className="w-5 h-5 text-[var(--color-text-muted)] transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-3 text-[14px] text-[var(--color-text-soft)] leading-[1.6]">{it.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
