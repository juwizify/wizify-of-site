import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wizify OF — Back-office",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard", end: true },
  { href: "/admin/formations", label: "Formations" },
  { href: "/admin/site", label: "Site (mentions globales)" },
  { href: "/", label: "↗ Voir le site public" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-sm font-semibold tracking-tight">
            Wizify OF — Back-office
          </Link>
          <nav className="flex gap-6 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-zinc-500 flex items-center justify-between">
          <span>Wizify OF · Pilotage Qualiopi du site public</span>
          <span className="font-mono">v0.1 — local JSON storage</span>
        </div>
      </footer>
    </div>
  );
}
