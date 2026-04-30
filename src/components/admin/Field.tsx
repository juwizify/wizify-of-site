/**
 * Form primitives for the admin — match the bridge's minimal zinc look.
 */
import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

export function Section({
  title,
  indicator,
  description,
  children,
}: {
  title: string;
  indicator?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-white rounded-lg border border-zinc-200 p-6 space-y-4">
      <header>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
          {indicator && (
            <span className="text-[11px] font-mono px-1.5 py-0.5 bg-zinc-100 text-zinc-700 rounded">
              {indicator}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
      </header>
      {children}
    </section>
  );
}

const labelCls = "block text-xs font-medium text-zinc-700";
const inputCls = "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";

export function Field({
  name,
  label,
  hint,
  ...rest
}: { name: string; label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {hint && <span className="ml-1 text-zinc-400 font-normal">— {hint}</span>}
      </span>
      <input name={name} {...rest} className={`${inputCls} ${rest.className ?? ""}`} />
    </label>
  );
}

export function TextArea({
  name,
  label,
  hint,
  rows = 3,
  ...rest
}: { name: string; label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {hint && <span className="ml-1 text-zinc-400 font-normal">— {hint}</span>}
      </span>
      <textarea name={name} rows={rows} {...rest} className={`${inputCls} font-normal ${rest.className ?? ""}`} />
    </label>
  );
}

export function Select({
  name,
  label,
  hint,
  options,
  ...rest
}: {
  name: string;
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {hint && <span className="ml-1 text-zinc-400 font-normal">— {hint}</span>}
      </span>
      <select name={name} {...rest} className={`${inputCls} ${rest.className ?? ""}`}>
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({
  name,
  label,
  hint,
  defaultChecked,
}: { name: string; label: string; hint?: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 rounded border-zinc-400" />
      <span className="text-sm text-zinc-800">
        {label}
        {hint && <span className="ml-1 text-zinc-400 text-xs">— {hint}</span>}
      </span>
    </label>
  );
}

export function Row({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  const grid = cols === 1 ? "" : cols === 3 ? "grid grid-cols-3 gap-4" : "grid grid-cols-2 gap-4";
  return <div className={grid}>{children}</div>;
}
