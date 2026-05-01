"use client";
import { useFormStatus } from "react-dom";
import Link from "next/link";

/**
 * Submit bar with pending state + last-saved indicator.
 * Lives inside the <form> so useFormStatus is scoped to it.
 */
export default function SaveBar({
  previewHref,
  updatedAt,
}: {
  previewHref: string;
  updatedAt: string | null;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center gap-3 pt-2 sticky bottom-4 bg-zinc-50/90 backdrop-blur p-3 -mx-3 rounded-md border border-zinc-200">
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 text-white text-sm font-medium px-4 py-2 hover:bg-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
      <Link
        href={previewHref}
        target="_blank"
        className="text-sm text-zinc-600 hover:text-zinc-900 underline"
      >
        Prévisualiser ↗
      </Link>
      <span className="ml-auto text-xs text-zinc-500">
        {updatedAt
          ? `Dernier enregistrement : ${formatTime(updatedAt)}`
          : "Jamais enregistré"}
      </span>
    </div>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
