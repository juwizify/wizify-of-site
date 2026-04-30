import Link from "next/link";
import { readFormations } from "@/lib/data";
import MissingBadge from "@/components/site/MissingBadge";

/**
 * Public catalogue — driven by data/formations.json.
 * Visual style preserved from the .pen mockup; cards are rendered from the
 * published formations. Drafts are shown with a "Brouillon" indicator so the
 * editor can preview without exposing them via published=true.
 */
export default async function CataloguePage() {
  const all = await readFormations();
  const published = all.filter((f) => f._meta.published);
  const drafts = all.filter((f) => !f._meta.published);

  return (
    <main style={{ width: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF", fontFamily: "Poppins" }}>
      {/* NAV (kept identical to other pages — duplicated here for self-contained route) */}
      <div style={{ width: "100%", paddingTop: 16, display: "flex", justifyContent: "center" }}>
        <nav data-name="Nav Bar" style={{ width: 1200, height: 56, background: "#FFFFFF", borderRadius: 58, padding: "0 8px 0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 17.5px rgba(0,0,0,0.082)" }}>
          <Link href="/" style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", textDecoration: "none" }}>OF Finance</Link>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <Link href="/catalogue" style={{ fontSize: 16, fontWeight: 500, color: "#3340FA", textDecoration: "none" }}>Formations</Link>
            <Link href="/#pedagogie" style={{ fontSize: 16, fontWeight: 500, color: "#555555", textDecoration: "none" }}>Pédagogie</Link>
            <Link href="/#financement" style={{ fontSize: 16, fontWeight: 500, color: "#555555", textDecoration: "none" }}>Financement</Link>
            <Link href="/a-propos" style={{ fontSize: 16, fontWeight: 500, color: "#555555", textDecoration: "none" }}>Contact</Link>
          </div>
          <Link href="/a-propos" style={{ alignSelf: "stretch", display: "flex", alignItems: "center", background: "#3340FA", color: "#FFFFFF", padding: "0 24px", borderRadius: 28, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Nous contacter
          </Link>
        </nav>
      </div>

      {/* HEADER */}
      <header style={{ padding: "80px 120px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#3340FA", letterSpacing: 3, textTransform: "uppercase" }}>CATALOGUE</span>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-1.5px", margin: 0, lineHeight: 1.1 }}>
          Nos formations
        </h1>
        <p style={{ fontSize: 18, color: "#555555", maxWidth: 600, margin: 0 }}>
          {published.length > 0
            ? `${published.length} formation${published.length > 1 ? "s" : ""} certifiée${published.length > 1 ? "s" : ""} et finançable${published.length > 1 ? "s" : ""}.`
            : "Catalogue en construction — les fiches formations seront publiées une fois leurs informations Qualiopi complétées."}
        </p>
      </header>

      {/* GRID */}
      <section style={{ padding: "40px 120px 100px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 1200, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {published.length === 0 ? (
            <div style={{ gridColumn: "1 / -1" }}>
              <MissingBadge
                indicator="—"
                field="Catalogue vide"
                hint="Aucune formation n'a encore le statut « Publiée ». Active la publication via /admin une fois les champs Qualiopi renseignés."
              />
            </div>
          ) : (
            published.map((f) => <FormationCard key={f.slug} f={f} />)
          )}

          {/* Drafts shown as muted previews so editors can verify rendering */}
          {drafts.length > 0 && (
            <div style={{ gridColumn: "1 / -1", marginTop: 32, padding: "20px 24px", background: "#FFF8E1", border: "1px dashed #F59E0B", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#92400E" }}>
                {drafts.length} brouillon{drafts.length > 1 ? "s" : ""} — visible{drafts.length > 1 ? "s" : ""} ci-dessous (non publié{drafts.length > 1 ? "s" : ""})
              </p>
              <Link href="/admin/formations" style={{ fontSize: 13, color: "#92400E", textDecoration: "underline" }}>
                Gérer dans le back-office →
              </Link>
            </div>
          )}
          {drafts.map((f) => <FormationCard key={f.slug} f={f} draft />)}
        </div>
      </section>

      {/* SUR-MESURE BANNER */}
      <section style={{ padding: "80px 120px", background: "#F8F9FA", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-1px", margin: 0 }}>Vous ne trouvez pas votre formation ?</h2>
        <p style={{ fontSize: 16, color: "#555555", maxWidth: 600, margin: 0 }}>
          Nous concevons des formations sur mesure adaptées à vos enjeux métier et réglementaires.
        </p>
        <Link href="/a-propos" style={{ background: "#3340FA", color: "#FFFFFF", padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
          Demander une formation sur mesure →
        </Link>
      </section>

      {/* FOOTER (slim) */}
      <footer style={{ background: "#3340FA", padding: "48px 120px", color: "#FFFFFF", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
        <div>
          <p style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>OF Formation</p>
          <p style={{ fontSize: 13, color: "#CCCCCC", margin: "8px 0 0", maxWidth: 280 }}>
            Organisme de formation certifié Qualiopi, spécialisé dans le secteur bancaire et financier.
          </p>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 13 }}>
          <Link href="/" style={{ color: "#FFFFFF", textDecoration: "none" }}>Accueil</Link>
          <Link href="/a-propos" style={{ color: "#FFFFFF", textDecoration: "none" }}>À propos</Link>
          <Link href="/mentions" style={{ color: "#FFFFFF", textDecoration: "none" }}>Mentions légales</Link>
        </div>
      </footer>
    </main>
  );
}

function FormationCard({ f, draft = false }: { f: Awaited<ReturnType<typeof readFormations>>[number]; draft?: boolean }) {
  const pub = f._ind1_publicInfo;
  const pricing = f._ind1_pricing;
  return (
    <Link
      href={`/formation/${f.slug}`}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E9FF",
        borderRadius: 16,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        textDecoration: "none",
        boxShadow: "0 0 24px rgba(0,0,0,0.063)",
        opacity: draft ? 0.7 : 1,
        position: "relative",
      }}
    >
      {draft && (
        <span style={{ position: "absolute", top: 12, right: 12, fontSize: 11, fontWeight: 600, color: "#92400E", background: "#FFE082", padding: "2px 8px", borderRadius: 6 }}>
          Brouillon
        </span>
      )}
      {f.identification.badge ? (
        <span style={{ alignSelf: "flex-start", background: "#E8E9FF", color: "#3340FA", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 8 }}>
          {f.identification.badge}
        </span>
      ) : (
        <MissingBadge inline indicator="—" field="Badge" />
      )}
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1.3 }}>
        {f.identification.title}
      </h3>
      <p style={{ fontSize: 14, color: "#999999", margin: 0 }}>
        {pub.duration_hours ? `${pub.duration_hours} h` : <MissingPiece label="Durée" />}
        {" • "}
        {pub.modality ? labelModality(pub.modality) : <MissingPiece label="Modalité" />}
      </p>
      {pricing.fundingOPCO && (
        <span style={{ fontSize: 14, color: "#1DC19D", fontWeight: 500 }}>✓ Finançable OPCO</span>
      )}
      <span style={{ marginTop: "auto", fontSize: 14, fontWeight: 600, color: "#3340FA" }}>
        En savoir plus →
      </span>
    </Link>
  );
}

function MissingPiece({ label }: { label: string }) {
  return <span style={{ color: "#92400E", background: "#FFE082", padding: "1px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{label} ?</span>;
}

function labelModality(m: string): string {
  return ({ "e-learning": "E-learning", blended: "Blended", presentiel: "Présentiel" } as Record<string, string>)[m] ?? m;
}
