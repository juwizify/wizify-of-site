import type { Check } from "@/lib/qualiopi";

const TONE: Record<Check["status"], { bg: string; dot: string; label: string }> = {
  ok:      { bg: "bg-emerald-50",  dot: "bg-emerald-500",  label: "Renseigné"  },
  partial: { bg: "bg-amber-50",    dot: "bg-amber-500",    label: "Partiel"    },
  missing: { bg: "bg-rose-50",     dot: "bg-rose-500",     label: "Manquant"   },
  na:      { bg: "bg-zinc-50",     dot: "bg-zinc-300",     label: "Non concerné" },
};

export default function CheckList({ checks, hideOk = false }: { checks: Check[]; hideOk?: boolean }) {
  // Group by category
  const byCat = new Map<string, Check[]>();
  for (const c of checks) {
    if (hideOk && c.status === "ok") continue;
    const arr = byCat.get(c.category) ?? [];
    arr.push(c);
    byCat.set(c.category, arr);
  }

  if (byCat.size === 0) {
    return (
      <p className="text-sm text-zinc-500 italic">
        {hideOk ? "Tous les contrôles sont passés ✓" : "Aucun contrôle"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {Array.from(byCat.entries()).map(([cat, items]) => (
        <section key={cat}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            {cat}
          </h3>
          <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white">
            {items.map((c) => {
              const t = TONE[c.status];
              return (
                <li key={c.id} className="px-4 py-2.5 flex items-center gap-3">
                  <span className={`inline-block w-2 h-2 rounded-full ${t.dot}`} />
                  <span className="text-sm text-zinc-900 flex-1">{c.label}</span>
                  {c.detail && <span className="text-xs text-zinc-500">{c.detail}</span>}
                  <span className="text-[11px] font-mono text-zinc-400">{c.indicator}</span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded ${t.bg} text-zinc-700`}>
                    {t.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
