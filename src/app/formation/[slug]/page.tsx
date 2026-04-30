import { notFound } from "next/navigation";
import { readFormation, readFormations } from "@/lib/data";
import OFAccueil from "@/generated/OFAccueil"; // not used but ensures generator stays imported somewhere
import MissingBadge from "@/components/site/MissingBadge";
import Link from "next/link";

export async function generateStaticParams() {
  const all = await readFormations();
  return all.map((f) => ({ slug: f.slug }));
}

void OFAccueil; // silence unused import warning — kept to ensure generator output still tree-shaken sanely

const sectionStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center" as const,
  padding: "100px 120px",
  gap: 56,
  fontFamily: "Poppins",
};

const containerStyle = {
  width: "100%",
  maxWidth: 1100,
  display: "flex",
  flexDirection: "column" as const,
  gap: 32,
};

const labelStyle = {
  fontSize: 14,
  fontWeight: 600,
  color: "#3340FA",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
};

const titleStyle = {
  fontSize: 38,
  fontWeight: 700,
  color: "#1A1A1A",
  letterSpacing: "-2px",
  lineHeight: 1.1,
  textAlign: "center" as const,
};

const bodyStyle = {
  fontSize: 16,
  color: "#555555",
  lineHeight: 1.6,
};

export default async function FormationPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await readFormation(slug);
  if (!f) notFound();

  const pub = f._ind1_publicInfo;
  const obj = f._ind5_objectives;
  const pre = f._ind8_prerequisites;
  const ped = f._ind6_19_pedagogy;
  const ev = f._ind11_evaluation;
  const pr = f._ind1_pricing;
  const acc = f._ind26_accessibility;
  const res = f._ind2_results;
  const imp = f._ind30_32_improvement;

  return (
    <main style={{ width: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF" }}>
      {/* ----- NAV ----- */}
      <div style={{ width: "100%", paddingTop: 16, display: "flex", justifyContent: "center" }}>
        <nav
          data-name="Nav Bar"
          style={{
            width: 1200,
            height: 56,
            background: "#FFFFFF",
            borderRadius: 58,
            padding: "0 8px 0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 17.5px rgba(0,0,0,0.082)",
          }}
        >
          <Link href="/" style={{ fontFamily: "Poppins", fontSize: 20, fontWeight: 700, color: "#1A1A1A", textDecoration: "none" }}>
            OF Finance
          </Link>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <Link href="/catalogue" style={{ fontFamily: "Poppins", fontSize: 16, fontWeight: 500, color: "#555555", textDecoration: "none" }}>Formations</Link>
            <Link href="/#pedagogie" style={{ fontFamily: "Poppins", fontSize: 16, fontWeight: 500, color: "#555555", textDecoration: "none" }}>Pédagogie</Link>
            <Link href="/#financement" style={{ fontFamily: "Poppins", fontSize: 16, fontWeight: 500, color: "#555555", textDecoration: "none" }}>Financement</Link>
            <Link href="/a-propos" style={{ fontFamily: "Poppins", fontSize: 16, fontWeight: 500, color: "#555555", textDecoration: "none" }}>Contact</Link>
          </div>
          <Link href="/catalogue" style={{ alignSelf: "stretch", display: "flex", alignItems: "center", background: "#3340FA", color: "#FFFFFF", padding: "0 24px", borderRadius: 28, fontFamily: "Poppins", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Voir nos formations
          </Link>
        </nav>
      </div>

      {/* ----- BREADCRUMB ----- */}
      <div style={{ width: "100%", padding: "24px 120px 0", fontFamily: "Poppins", fontSize: 13, color: "#999999", display: "flex", gap: 8 }}>
        <Link href="/" style={{ color: "#999999", textDecoration: "none" }}>Accueil</Link>
        <span>›</span>
        <Link href="/catalogue" style={{ color: "#999999", textDecoration: "none" }}>Catalogue</Link>
        <span>›</span>
        <span style={{ color: "#1A1A1A" }}>{f.identification.title}</span>
      </div>

      {/* ----- HERO FORMATION ----- */}
      <section data-name="Hero Formation" style={{ width: "100%", padding: "60px 120px 80px", display: "flex", gap: 60 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24, fontFamily: "Poppins" }}>
          {f.identification.badge ? (
            <span style={{ alignSelf: "flex-start", background: "#E8E9FF", color: "#3340FA", fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 8 }}>
              {f.identification.badge}
            </span>
          ) : (
            <MissingBadge inline indicator="—" field="Badge" />
          )}
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-1.5px", lineHeight: 1.1, margin: 0 }}>
            {f.identification.title}
          </h1>
          {f.identification.shortDescription ? (
            <p style={bodyStyle}>{f.identification.shortDescription}</p>
          ) : (
            <MissingBadge indicator="—" field="Accroche / description courte" hint="Une phrase qui résume la formation, visible en hero." />
          )}
          {/* Quick meta */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 8 }}>
            <Pill ok={!!pub.duration_hours} label={pub.duration_hours ? `${pub.duration_hours} h` : "Durée à compléter"} />
            <Pill ok={!!pub.modality} label={pub.modality ? labelModality(pub.modality) : "Modalité à compléter"} />
            <Pill ok={!!pub.audience} label={pub.audience ? "Public défini" : "Public à compléter"} />
            <Pill ok={!!pub.deliveryStart} label={pub.deliveryStart ? `Accès : ${labelDelivery(pub.deliveryStart)}` : "Délai à compléter"} />
          </div>
        </div>

        {/* Side card: pricing + CTAs */}
        <aside style={{ width: 360, background: "#FFFFFF", border: "1px solid #E8E9FF", borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 16, fontFamily: "Poppins", boxShadow: "0 0 24px rgba(0,0,0,0.063)" }}>
          {pr.amountHT !== null ? (
            <p style={{ fontSize: 32, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
              {pr.amountHT} {pr.currency} <span style={{ fontSize: 16, fontWeight: 500, color: "#555555" }}>HT</span>
            </p>
          ) : (
            <MissingBadge indicator="Ind. 1" field="Tarif" hint="Tarif HT visible obligatoire — saisir dans le back-office." />
          )}
          <div style={{ fontSize: 14, color: "#555555", lineHeight: 1.6 }}>
            {pr.fundingOPCO && <p style={{ margin: "4px 0" }}>✓ Finançable OPCO</p>}
            {pr.fundingCPF && <p style={{ margin: "4px 0" }}>✓ Finançable CPF</p>}
            {pr.fundingFNE && <p style={{ margin: "4px 0" }}>✓ Finançable FNE-Formation</p>}
            {!pr.fundingOPCO && !pr.fundingCPF && !pr.fundingFNE && (
              <MissingBadge inline indicator="Ind. 1" field="Financement" />
            )}
          </div>
          <Link href="/a-propos" style={{ display: "block", textAlign: "center", background: "#3340FA", color: "#FFFFFF", padding: "14px 24px", borderRadius: 12, textDecoration: "none", fontSize: 16, fontWeight: 600 }}>
            Je m&apos;inscris
          </Link>
          <Link href="#programme" style={{ display: "block", textAlign: "center", background: "#FFFFFF", color: "#3340FA", border: "2px solid #3340FA", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontSize: 16, fontWeight: 600 }}>
            Voir le programme
          </Link>
        </aside>
      </section>

      {/* ----- OBJECTIFS Ind. 5 ----- */}
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <span style={labelStyle}>OBJECTIFS PÉDAGOGIQUES</span>
          <h2 style={titleStyle}>À l&apos;issue de cette formation</h2>
          {obj.main || obj.operational.length > 0 ? (
            <>
              {obj.main && <p style={{ ...bodyStyle, fontSize: 18, textAlign: "center" }}>{obj.main}</p>}
              {obj.operational.length > 0 && (
                <ul style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, listStyle: "none", padding: 0, width: "100%", maxWidth: 800 }}>
                  {obj.operational.map((o, i) => (
                    <li key={i} style={{ background: "#F0F4FF", padding: "16px 20px", borderRadius: 12, fontSize: 15, color: "#1A1A1A", lineHeight: 1.5 }}>
                      ✓ {o}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <MissingBadge indicator="Ind. 5" field="Objectifs pédagogiques" hint="Objectif général + liste d'objectifs opérationnels (verbes d'action)." />
          )}
        </div>
      </section>

      {/* ----- PUBLIC & PRÉREQUIS Ind. 8 ----- */}
      <section style={{ ...sectionStyle, background: "#F8F9FA" }}>
        <div style={containerStyle}>
          <span style={labelStyle}>PUBLIC &amp; PRÉREQUIS</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 28, border: "1px solid #E8E9FF" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", margin: "0 0 12px" }}>Public cible</h3>
              {pub.audience ? <p style={bodyStyle}>{pub.audience}</p> : <MissingBadge indicator="Ind. 1" field="Public cible" />}
            </div>
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 28, border: "1px solid #E8E9FF" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", margin: "0 0 12px" }}>Prérequis</h3>
              {pre.regulatory || pre.professional || pre.technical || pre.items.length > 0 ? (
                <ul style={{ ...bodyStyle, paddingLeft: 20, margin: 0 }}>
                  {pre.regulatory && <li>{pre.regulatory}</li>}
                  {pre.professional && <li>{pre.professional}</li>}
                  {pre.technical && <li>{pre.technical}</li>}
                  {pre.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              ) : (
                <MissingBadge indicator="Ind. 8" field="Prérequis" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ----- PROGRAMME ----- */}
      <section id="programme" style={sectionStyle}>
        <div style={containerStyle}>
          <span style={labelStyle}>PROGRAMME</span>
          <h2 style={titleStyle}>Détail du parcours</h2>
          {f._program.intro && <p style={{ ...bodyStyle, fontSize: 18, textAlign: "center", maxWidth: 800, margin: "0 auto" }}>{f._program.intro}</p>}
          {f._program.modules.length > 0 ? (
            <ol style={{ display: "flex", flexDirection: "column", gap: 16, listStyle: "none", padding: 0, counterReset: "m" }}>
              {f._program.modules.map((m, i) => (
                <li key={i} style={{ background: "#FFFFFF", border: "1px solid #E8E9FF", borderRadius: 12, padding: 24 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#3340FA", fontWeight: 600 }}>MODULE {i + 1}{m.duration_hours && ` · ${m.duration_hours}h`}</p>
                  <h3 style={{ margin: "4px 0 12px", fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>{m.title}</h3>
                  {m.content && <p style={bodyStyle}>{m.content}</p>}
                </li>
              ))}
            </ol>
          ) : (
            <MissingBadge indicator="Ind. 1" field="Programme détaillé" hint="Liste des modules avec durée et contenu — éditeur dédié à venir." />
          )}
        </div>
      </section>

      {/* ----- MODALITÉS PÉDAGOGIQUES Ind. 6 / 19 ----- */}
      <section style={{ ...sectionStyle, background: "#F0F4FF" }}>
        <div style={containerStyle}>
          <span style={labelStyle}>MODALITÉS PÉDAGOGIQUES</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            <SubBlock title="Méthodes" items={ped.methods} indicator="Ind. 6" />
            <SubBlock title="Outils & plateformes" items={ped.tools} indicator="Ind. 19" />
            <SubBlock title="Supports remis" items={ped.supports} indicator="Ind. 19" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            <KV label="Tutorat" value={ped.tutoring} indicator="Ind. 19" />
            <KV label="Durée d'accès" value={ped.accessDuration} indicator="Ind. 1" />
          </div>
        </div>
      </section>

      {/* ----- ÉVALUATION Ind. 11 ----- */}
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <span style={labelStyle}>MODALITÉS D&apos;ÉVALUATION</span>
          <SubBlock title="Modalités" items={ev.modalities} indicator="Ind. 11" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            <KV label="Seuil de réussite" value={ev.passingScore !== null ? `${ev.passingScore}%` : null} indicator="Ind. 11" />
            <KV label="Examen certifiant" value={ev.certifyingExam} indicator="Ind. 11" />
            <KV label="Document délivré" value={ev.certificateDelivered} indicator="Ind. 11" />
          </div>
          <KV label="Feedback aux apprenants" value={ev.feedback} indicator="Ind. 11" wide />
        </div>
      </section>

      {/* ----- ACCESSIBILITÉ HANDICAP Ind. 26 ----- */}
      <section style={{ ...sectionStyle, background: "#FAFBFC" }}>
        <div style={containerStyle}>
          <span style={labelStyle}>ACCESSIBILITÉ HANDICAP</span>
          <SubBlock title="Adaptations possibles" items={acc.accommodations} indicator="Ind. 26" />
          <SubBlock title="Partenaires mobilisés" items={acc.partners} indicator="Ind. 26" />
        </div>
      </section>

      {/* ----- RÉSULTATS Ind. 2 ----- */}
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <span style={labelStyle}>RÉSULTATS &amp; QUALIOPI</span>
          <h2 style={titleStyle}>Indicateurs publics</h2>
          {res.satisfactionRate !== null || res.completionRate !== null || res.successRate !== null || res.learnersTrained !== null ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
              <Stat n={res.satisfactionRate !== null ? `${res.satisfactionRate}%` : null} label="Satisfaction" />
              <Stat n={res.completionRate !== null ? `${res.completionRate}%` : null} label="Complétion" />
              <Stat n={res.successRate !== null ? `${res.successRate}%` : null} label="Réussite" />
              <Stat n={res.learnersTrained?.toString() ?? null} label="Apprenants formés" />
            </div>
          ) : (
            <MissingBadge indicator="Ind. 2" field="Taux de satisfaction / réussite / complétion" hint="Obligatoire en publication continue (mise à jour annuelle minimum)." />
          )}
          {res.lastUpdate && <p style={{ ...bodyStyle, fontSize: 13, textAlign: "center" }}>{res.scope} · mise à jour {res.lastUpdate}</p>}
        </div>
      </section>

      {/* ----- AMÉLIORATION CONTINUE Ind. 30 / 32 ----- */}
      <section style={{ ...sectionStyle, background: "#F8F9FA" }}>
        <div style={containerStyle}>
          <span style={labelStyle}>AMÉLIORATION CONTINUE</span>
          <KV label="Recueil des feedbacks" value={imp.feedbackProcess} indicator="Ind. 30" wide />
          <KV label="Dernière revue qualité" value={imp.lastReview} indicator="Ind. 32" />
          {imp.correctiveActions.length > 0 ? (
            <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0 }}>
              {imp.correctiveActions.map((a, i) => (
                <li key={i} style={{ background: "#FFFFFF", borderRadius: 12, padding: 20, border: "1px solid #E8E9FF" }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#999999" }}>{a.date}</p>
                  <p style={{ margin: "4px 0", fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>{a.issue}</p>
                  <p style={{ margin: 0, fontSize: 14, color: "#555555" }}>→ {a.action}</p>
                  {a.outcome && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#1DC19D" }}>✓ {a.outcome}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <MissingBadge indicator="Ind. 32" field="Actions correctives" hint="Au moins 1-2 actions concrètes documentées (cycle PDCA)." />
          )}
        </div>
      </section>

      {/* ----- ENCADRÉ LÉGAL ----- */}
      <section style={{ ...sectionStyle, background: "#FFFFFF", padding: "60px 120px" }}>
        <div style={{ ...containerStyle, alignItems: "flex-start" }}>
          <div style={{ width: "100%", background: "#FAFBFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: 28, fontFamily: "Poppins" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>Mentions légales — Qualiopi Ind. 1</h3>
            <p style={{ ...bodyStyle, fontSize: 13 }}>
              Cette formation est référencée auprès de l&apos;organisme certificateur Qualiopi. Le présent document tient lieu de descriptif Qualiopi
              au sens du décret n° 2019-565. Pour toute réclamation, voir la <Link href="/mentions" style={{ color: "#3340FA" }}>procédure dédiée</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ----- FOOTER (reuse generated visual style) ----- */}
      <footer style={{ width: "100%", background: "#3340FA", padding: "48px 120px", color: "#FFFFFF", fontFamily: "Poppins", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>OF Formation</p>
          <p style={{ fontSize: 13, color: "#CCCCCC", margin: "8px 0 0", maxWidth: 280 }}>
            Organisme de formation certifié Qualiopi, spécialisé dans le secteur bancaire et financier.
          </p>
        </div>
        <Link href="/" style={{ color: "#FFFFFF", fontSize: 14, textDecoration: "underline" }}>← Retour accueil</Link>
      </footer>
    </main>
  );
}

// ---------- inline helpers ----------

function Pill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      background: ok ? "#E8E9FF" : "#FFF8E1",
      color: ok ? "#3340FA" : "#92400E",
      fontFamily: "Poppins",
    }}>
      {ok ? "✓" : "⚠"} {label}
    </span>
  );
}

function SubBlock({ title, items, indicator }: { title: string; items: string[]; indicator: string }) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 12px", fontFamily: "Poppins" }}>{title}</h3>
      {items.length > 0 ? (
        <ul style={{ paddingLeft: 20, margin: 0, fontSize: 15, color: "#555555", lineHeight: 1.6, fontFamily: "Poppins" }}>
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      ) : (
        <MissingBadge indicator={indicator} field={title} />
      )}
    </div>
  );
}

function KV({ label, value, indicator, wide }: { label: string; value: string | null; indicator: string; wide?: boolean }) {
  return (
    <div style={{ gridColumn: wide ? "1 / -1" : "auto" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#999999", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1, fontFamily: "Poppins" }}>{label}</p>
      {value ? (
        <p style={{ fontSize: 15, color: "#1A1A1A", margin: 0, fontFamily: "Poppins" }}>{value}</p>
      ) : (
        <MissingBadge inline indicator={indicator} field={label} />
      )}
    </div>
  );
}

function Stat({ n, label }: { n: string | null; label: string }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E8E9FF", borderRadius: 16, padding: 28, textAlign: "center", fontFamily: "Poppins" }}>
      {n ? (
        <p style={{ fontSize: 42, fontWeight: 700, color: "#3340FA", margin: 0, lineHeight: 1 }}>{n}</p>
      ) : (
        <MissingBadge inline indicator="Ind. 2" field={label} />
      )}
      <p style={{ fontSize: 14, color: "#555555", margin: "8px 0 0" }}>{label}</p>
    </div>
  );
}

function labelModality(m: string): string {
  return { "e-learning": "E-learning", blended: "Blended", presentiel: "Présentiel" }[m] ?? m;
}
function labelDelivery(d: string): string {
  return { immediate: "immédiat", scheduled: "sessions planifiées", on_demand: "à la demande" }[d] ?? d;
}
