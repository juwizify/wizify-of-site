import { ArrowRightIcon } from "../icons/Icons";

export default function Nav() {
  return (
    <div className="w-full pt-4 flex flex-col items-center justify-center">
      <nav
        className="w-[1200px] h-14 bg-white rounded-[58px] flex items-center justify-between pl-6 pr-2"
        style={{ boxShadow: "var(--shadow-mid)" }}
      >
        <a href="/" className="text-[20px] font-bold text-[var(--color-ink)] tracking-[-0.5px]">
          OF Finance
        </a>
        <ul className="flex items-center gap-8">
          {["Formations", "Pédagogie", "Financement", "Contact"].map((l) => (
            <li key={l}>
              <a href="#" className="text-[16px] font-medium text-[var(--color-text)] hover:text-[var(--color-ink)] transition-colors">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="bg-[var(--color-brand)] text-white rounded-[28px] px-6 py-[10px] flex items-center gap-2 text-[14px] font-semibold hover:bg-[var(--color-brand-hover)] transition-colors"
        >
          Voir nos formations
          <ArrowRightIcon className="w-4 h-4" />
        </a>
      </nav>
    </div>
  );
}
