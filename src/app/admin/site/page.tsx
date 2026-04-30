import Link from "next/link";
import { readSiteQualiopi } from "@/lib/data";
import { auditSite, score } from "@/lib/qualiopi";
import Gauge from "@/components/admin/Gauge";
import CheckList from "@/components/admin/CheckList";

export default async function AdminSitePage() {
  const site = await readSiteQualiopi();
  const checks = auditSite(site);
  const s = score(checks);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-6">
        <div>
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-900">
            ← Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Mentions globales du site</h1>
          <p className="mt-1 text-sm text-zinc-600 max-w-2xl">
            Informations qui s&apos;affichent partout (footer, page Mentions, page Accueil…). Ces champs étant statiques, on
            ne propose pas de formulaire ici — la liste signale ce qui manque pour conformité Qualiopi.
            Les valeurs sont à hardcoder dans <span className="font-mono">data/site_qualiopi.json</span>.
          </p>
        </div>
        <Gauge pct={s.pct} size={96} />
      </header>

      <section className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
        <p className="font-medium">Mode édition non implémenté</p>
        <p className="mt-1 text-amber-800/80">
          Édite directement <code className="font-mono text-xs bg-white px-1 py-0.5 rounded">data/site_qualiopi.json</code>{" "}
          puis rafraîchis. Le dashboard se met à jour automatiquement.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          État ({s.ok}/{s.total} renseignés)
        </h2>
        <CheckList checks={checks} />
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          Snapshot actuel
        </h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-xs overflow-x-auto font-mono">
          {JSON.stringify(site, null, 2)}
        </pre>
      </section>
    </div>
  );
}
