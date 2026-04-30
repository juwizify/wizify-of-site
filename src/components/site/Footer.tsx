import { LinkedinIcon, TwitterIcon } from "../icons/Icons";

const NAV_LINKS = ["Accueil", "Nos formations", "Notre pédagogie", "Financement", "Contact"];
const FORMATIONS = ["DDA", "DCI", "LCB-FT", "Certification AMF", "Catalogue complet"];
const LEGAL = [
  "Mentions légales",
  "CGV",
  "Politique de confidentialité",
  "Accessibilité handicap",
  "Règlement intérieur",
];
const CONTACT = ["contact@of-formation.fr", "01 23 45 67 89", "Paris, France"];

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-[14px] font-semibold text-white">{title}</h4>
      {items.map((it) => (
        <a key={it} href="#" className="text-[13px] text-[#CCCCCC] hover:text-white transition-colors">
          {it}
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[var(--color-brand)] py-12 px-[120px] flex flex-col gap-10">
      <div className="flex justify-between">
        <div className="w-[300px] flex flex-col gap-3">
          <p className="text-[22px] font-bold text-white">OF Formation</p>
          <p className="text-[13px] text-[#CCCCCC] leading-[1.5] w-[280px]">
            Organisme de formation certifié Qualiopi, spécialisé dans le secteur bancaire et financier.
          </p>
          <p className="text-[11px] text-white/65">
            N° de déclaration d&apos;activité : 11 75 XXXXX 75
          </p>
        </div>
        <div className="flex gap-16">
          <Column title="Navigation" items={NAV_LINKS} />
          <Column title="Formations" items={FORMATIONS} />
          <Column title="Légal" items={LEGAL} />
          <Column title="Contact" items={CONTACT} />
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-brand-hover)]" />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[12px] text-[#CCCCCC]">© 2026 OF Formation. Tous droits réservés.</p>
          <p className="text-[11px] text-white/65">
            Certification Qualiopi — La qualité reconnue par l&apos;État
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" aria-label="LinkedIn" className="text-[#CCCCCC] hover:text-white transition-colors">
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Twitter / X" className="text-[#CCCCCC] hover:text-white transition-colors">
            <TwitterIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
