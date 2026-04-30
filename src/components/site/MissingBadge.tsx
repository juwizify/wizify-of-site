/**
 * Visible placeholder shown on the public site for any Qualiopi-required field
 * that hasn't been filled in via /admin yet.
 * Hard to miss visually so it can't ship to prod accidentally.
 */
type Props = {
  indicator: string;        // ex: "Ind. 5"
  field: string;            // ex: "Objectifs pédagogiques"
  hint?: string;             // optional one-liner of what should go here
  inline?: boolean;          // small inline variant
};

export default function MissingBadge({ indicator, field, hint, inline = false }: Props) {
  if (inline) {
    return (
      <span
        title={`${indicator} · à renseigner via /admin`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "#FFE082",
          color: "#92400E",
          fontSize: 12,
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: 6,
          fontFamily: "Poppins",
          verticalAlign: "middle",
        }}
      >
        <span style={{ width: 6, height: 6, background: "#F59E0B", borderRadius: "50%" }} />
        À compléter — {indicator}
      </span>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        background: "#FFF8E1",
        border: "1px dashed #F59E0B",
        color: "#92400E",
        padding: "12px 16px",
        borderRadius: 10,
        fontFamily: "Poppins",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>⚠</span>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
          {field} — {indicator} · à compléter
        </p>
        {hint && (
          <p style={{ margin: "4px 0 0 0", fontSize: 13, fontWeight: 400, color: "#7c2d12" }}>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
