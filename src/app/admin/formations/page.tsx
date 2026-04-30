import Link from "next/link";
import { readFormations } from "@/lib/data";
import { auditFormation, score } from "@/lib/qualiopi";

export default async function FormationsList() {
  const formations = await readFormations();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Formations</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {formations.length} formation(s) · cliquer pour éditer les champs Qualiopi.
          </p>
        </div>
      </header>

      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
        {formations.map((f) => {
          const s = score(auditFormation(f));
          const tone =
            s.pct === 100 ? "bg-emerald-500" :
            s.pct >= 80   ? "bg-sky-500" :
            s.pct >= 50   ? "bg-amber-500" :
                            "bg-rose-500";
          return (
            <li key={f.slug}>
              <Link
                href={`/admin/formations/${f.slug}`}
                className="px-5 py-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {f.identification.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 font-mono truncate">
                    /{f.slug} · {f.specialtyCode ?? "—"} · {f.certifType}
                  </p>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded ${
                  f._meta.published ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"
                }`}>
                  {f._meta.published ? "Publiée" : "Brouillon"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900 w-10 text-right">{s.pct}%</span>
                  <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full ${tone}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
                <span className="text-zinc-400">→</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
