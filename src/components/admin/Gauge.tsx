/**
 * Circular Qualiopi completeness gauge (server component).
 * Color steps: <50% rose · 50-79% amber · 80-99% sky · 100% emerald.
 */
type Props = {
  pct: number;
  size?: number;
  label?: string;
};

export default function Gauge({ pct, size = 140, label }: Props) {
  const safe = Math.max(0, Math.min(100, Math.round(pct)));
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (safe / 100) * c;

  const color =
    safe === 100 ? "#10b981" :
    safe >= 80   ? "#0ea5e9" :
    safe >= 50   ? "#f59e0b" :
                   "#f43f5e";

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 400ms ease, stroke 200ms ease" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          fontSize={Math.min(size * 0.22, 24)}
          fontWeight={700}
          fill="#18181b"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          {safe}%
        </text>
      </svg>
      {label && <span className="text-xs font-medium text-zinc-600">{label}</span>}
    </div>
  );
}
