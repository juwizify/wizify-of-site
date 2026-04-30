import Link from "next/link";
import { readFormations, readSiteQualiopi } from "@/lib/data";
import { auditFormation, auditSite, score } from "@/lib/qualiopi";
import Gauge from "@/components/admin/Gauge";
import CheckList from "@/components/admin/CheckList";

export default async function AdminDashboard() {
  const formations = await readFormations();
  const site = await readSiteQualiopi();

  const siteChecks = auditSite(site);
  const siteScore = score(siteChecks);

  const perFormation = formations.map((f) => {
    const checks = auditFormation(f);
    return { formation: f, checks, s: score(checks) };
  });

  const allFormationChecks = perFormation.flatMap((p) => p.checks);
  const formationScore = score(allFormationChecks);

  // Global = average weighted by check count
  const totalChecks = siteChecks.length + allFormationChecks.length;
  const totalOkEquivalent =
    siteScore.ok + siteScore.partial * 0.5 + formationScore.ok + formationScore.partial * 0.5;
  const globalPct = totalChecks === 0 ? 0 : Math.round((totalOkEquivalent / totalChecks) * 100);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Qualiopi</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Vue d&apos;ensemble de la conformité du site public aux indicateurs RNQ V9.
        </p>
      </header>

      {/* Top cards: 3 gauges */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-zinc-200 p-6 flex flex-col items-center text-center">
          <Gauge pct={globalPct} size={140} />
          <p className="mt-3 text-sm font-medium text-zinc-900">Conformité globale</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {totalChecks - Math.round(totalOkEquivalent)} contrôles à traiter sur {totalChecks}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-6 flex flex-col items-center text-center">
          <Gauge pct={siteScore.pct} size={140} label="Mentions site-wide" />
          <p className="mt-3 text-xs text-zinc-500">
            {siteScore.ok} renseignés · {siteScore.partial} partiels · {siteScore.missing} manquants
          </p>
          <Link href="/admin/site" className="mt-3 text-xs font-medium text-zinc-700 hover:text-zinc-900 underline">
            Voir le détail →
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-6 flex flex-col items-center text-center">
          <Gauge pct={formationScore.pct} size={140} label={`${formations.length} formations`} />
          <p className="mt-3 text-xs text-zinc-500">
            {formationScore.ok} renseignés · {formationScore.partial} partiels · {formationScore.missing} manquants
          </p>
          <Link href="/admin/formations" className="mt-3 text-xs font-medium text-zinc-700 hover:text-zinc-900 underline">
            Voir les formations →
          </Link>
        </div>
      </section>

      {/* Per-formation breakdown */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          Formations
        </h2>
        <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
          {perFormation.map(({ formation, s }) => (
            <li key={formation.slug}>
              <Link
                href={`/admin/formations/${formation.slug}`}
                className="px-5 py-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {formation.identification.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 font-mono truncate">
                    {formation.slug} · {formation.specialtyCode ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-600">
                  <span className="text-emerald-600">{s.ok} ok</span>
                  <span className="text-amber-600">{s.partial} partiels</span>
                  <span className="text-rose-600">{s.missing} manquants</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm font-semibold text-zinc-900 w-10 text-right">{s.pct}%</span>
                  <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${s.pct}%`,
                        background:
                          s.pct === 100 ? "#10b981" :
                          s.pct >= 80   ? "#0ea5e9" :
                          s.pct >= 50   ? "#f59e0b" :
                                          "#f43f5e",
                      }}
                    />
                  </div>
                </div>
                <span className="text-zinc-400">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Site-wide missing */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          À traiter — site-wide ({siteChecks.filter(c => c.status !== "ok").length})
        </h2>
        <CheckList checks={siteChecks} hideOk />
      </section>
    </div>
  );
}
