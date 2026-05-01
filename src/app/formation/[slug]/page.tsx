import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Award, BookOpen, Building2, Calendar, ChevronDown, ChevronRight, CircleCheck,
  Download, GraduationCap, HelpCircle, Monitor, Timer, User, Users,
} from "lucide-react";
import { readFormation, readFormations, readSiteQualiopi, type Formation } from "@/lib/data";
import MissingBadge from "@/components/site/MissingBadge";

/**
 * Public formation page — visual structure pulled verbatim from
 * `src/generated/OFFormationTemplate.tsx` (which itself is generated from the .pen).
 * Each [CMS: …] slot from the maquette is bound to a formation field.
 * Where data is missing, a MissingBadge replaces the value but the surrounding
 * layout (containers, padding, color, radius) stays identical to the mockup.
 */

export async function generateStaticParams() {
  const all = await readFormations();
  return all.map((f) => ({ slug: f.slug }));
}

export default async function FormationPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await readFormation(slug);
  if (!f) notFound();
  const site = await readSiteQualiopi();

  return (
    <main style={{ width: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF" }}>
      {/* ----- NAV ----- */}
      <Nav />

      {/* ============ PART 1 — HERO TO PROGRAMME ============ */}
      <Breadcrumb categoryLabel={f.identification.badge ?? "Catalogue"} title={f.identification.title} />
      <Hero f={f} />
      <Objectifs f={f} />
      <PublicEtPrerequis f={f} />
      <Programme f={f} />

      {/* ============ PART 2 — MODALITÉS TO FORMATEURS ============ */}
      <ModalitesPedagogiques f={f} />
      <Organisation f={f} />
      <AccessibiliteHandicap f={f} site={site} />
      <TarifsFinancement f={f} />
      <Formateurs f={f} />

      {/* ============ PART 3 — RÉSULTATS TO LEGAL ============ */}
      <Resultats f={f} />
      <EncadreLegal />

      {/* ----- FOOTER ----- */}
      <Footer />
    </main>
  );
}

/* =====================================================================
   SHARED ATOMS / TOKENS
   ===================================================================== */

const POPPINS = "Poppins";
const blueBg = "#3340FA";
const blueLight = "#F0F4FF";
const ink = "#1A1A1A";
const txt = "#555555";
const muted = "#999999";
const lineColor = "#E8E9FF";
const cardShadow = "0px 8px 24px #00000010";

const SECTION = (extra: object = {}) => ({
  display: "flex" as const,
  flexDirection: "column" as const,
  width: "100%",
  alignSelf: "stretch" as const,
  padding: "80px 120px",
  background: "#FFFFFF",
  alignItems: "flex-start" as const,
  ...extra,
});

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span style={{ fontFamily: POPPINS, fontSize: 14, fontWeight: 700, letterSpacing: 3, color: dark ? "#FFFFFF99" : blueBg }}>
      {children}
    </span>
  );
}

function SectionTitle({ children, dark = false, size = 36 }: { children: React.ReactNode; dark?: boolean; size?: number }) {
  return (
    <span style={{ fontFamily: POPPINS, fontSize: size, fontWeight: 700, color: dark ? "#FFFFFF" : ink, lineHeight: 1.2 }}>
      {children}
    </span>
  );
}

/* =====================================================================
   NAV (matches all other pages — same data-name as maquette)
   ===================================================================== */

function Nav() {
  return (
    <div style={{ width: "100%", paddingTop: 16, display: "flex", justifyContent: "center" }}>
      <nav data-name="Nav Bar" style={{ width: 1200, height: 56, background: "#FFFFFF", borderRadius: 58, padding: "0 8px 0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 17.5px rgba(0,0,0,0.082)" }}>
        <Link href="/" style={{ fontFamily: POPPINS, fontSize: 20, fontWeight: 700, color: ink, textDecoration: "none", letterSpacing: -0.5 }}>OF Finance</Link>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <Link href="/catalogue" style={{ fontFamily: POPPINS, fontSize: 16, fontWeight: 500, color: txt, textDecoration: "none" }}>Formations</Link>
          <Link href="/#pedagogie" style={{ fontFamily: POPPINS, fontSize: 16, fontWeight: 500, color: txt, textDecoration: "none" }}>Pédagogie</Link>
          <Link href="/#financement" style={{ fontFamily: POPPINS, fontSize: 16, fontWeight: 500, color: txt, textDecoration: "none" }}>Financement</Link>
          <Link href="/a-propos" style={{ fontFamily: POPPINS, fontSize: 16, fontWeight: 500, color: txt, textDecoration: "none" }}>Contact</Link>
        </div>
        <Link href="/catalogue" style={{ alignSelf: "stretch", display: "flex", alignItems: "center", background: blueBg, color: "#FFFFFF", padding: "0 24px", borderRadius: 28, fontFamily: POPPINS, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          Voir nos formations
        </Link>
      </nav>
    </div>
  );
}

/* =====================================================================
   BREADCRUMB
   ===================================================================== */

function Breadcrumb({ categoryLabel, title }: { categoryLabel: string; title: string }) {
  return (
    <div data-name="Breadcrumb" style={{ display: "flex", flexDirection: "row", width: "100%", padding: "16px 120px", gap: 8, alignItems: "center" }}>
      <Link href="/" style={{ fontFamily: POPPINS, fontSize: 13, color: muted, textDecoration: "none" }}>Accueil</Link>
      <ChevronRight size={14} strokeWidth={2} style={{ color: muted }} />
      <Link href="/catalogue" style={{ fontFamily: POPPINS, fontSize: 13, color: muted, textDecoration: "none" }}>Catalogue</Link>
      <ChevronRight size={14} strokeWidth={2} style={{ color: muted }} />
      <span style={{ fontFamily: POPPINS, fontSize: 13, color: muted }}>{categoryLabel}</span>
      <ChevronRight size={14} strokeWidth={2} style={{ color: muted }} />
      <span style={{ fontFamily: POPPINS, fontSize: 13, fontWeight: 500, color: ink }}>{title}</span>
    </div>
  );
}

/* =====================================================================
   HERO FORMATION  (left content + 400px sidebar card)
   ===================================================================== */

function Hero({ f }: { f: Formation }) {
  const pub = f._ind1_publicInfo;
  const pr = f._ind1_pricing;
  const priceLabel = pr.amountHT !== null ? formatPrice(pr.amountHT, pr.currency) + " HT" : null;

  return (
    <div data-name="Hero Formation" style={{ display: "flex", flexDirection: "row", width: "100%", padding: "80px 120px", gap: 48, background: "#FFFFFF" }}>
      {/* LEFT */}
      <div data-name="Hero Left" style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: 0, gap: 20, alignItems: "flex-start" }}>
        {f.identification.badge ? (
          <div style={{ display: "flex", padding: "6px 14px", borderRadius: 8, background: lineColor }}>
            <span style={{ fontFamily: POPPINS, fontSize: 12, fontWeight: 700, color: blueBg }}>
              {f.identification.badge}
            </span>
          </div>
        ) : (
          <MissingBadge inline indicator="—" field="Badge thématique" />
        )}
        <span style={{ fontFamily: POPPINS, fontSize: 38, fontWeight: 700, lineHeight: 1.2, color: ink, width: "100%", whiteSpace: "pre-line" }}>
          {f.identification.title}
        </span>
        {f.identification.shortDescription ? (
          <span style={{ fontFamily: POPPINS, fontSize: 18, fontWeight: 400, lineHeight: 1.5, color: txt, width: "100%" }}>
            {f.identification.shortDescription}
          </span>
        ) : (
          <MissingBadge indicator="—" field="Accroche / description courte" />
        )}
      </div>

      {/* SIDEBAR CARD 400 */}
      <div data-name="Sidebar Card" style={{ display: "flex", flexDirection: "column", width: 400, padding: 32, gap: 24, borderRadius: 16, background: "#FFFFFF", border: `1px solid ${lineColor}`, boxShadow: cardShadow }}>
        {/* Price row */}
        <div data-name="Price Row" style={{ display: "flex", flexDirection: "row", width: "100%", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {priceLabel ? (
            <span style={{ fontFamily: POPPINS, fontSize: 28, fontWeight: 700, color: ink }}>{priceLabel}</span>
          ) : (
            <MissingBadge inline indicator="Ind. 1" field="Tarif HT" />
          )}
          {pr.fundingOPCO && (
            <div style={{ display: "flex", padding: "4px 10px", borderRadius: 8, background: "#E6F9F4" }}>
              <span style={{ fontFamily: POPPINS, fontSize: 11, fontWeight: 700, color: "#1dc19d" }}>Finançable OPCO</span>
            </div>
          )}
        </div>

        {/* Info rows (Durée / Modalité / Délais / Format) */}
        <div data-name="Info Rows" style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16 }}>
          <InfoRow Icon={Timer} value={pub.duration_hours ? `${pub.duration_hours} heure${pub.duration_hours > 1 ? "s" : ""}` : null} indicator="Ind. 1" field="Durée" />
          <InfoRow Icon={Monitor} value={pub.modality ? labelModality(pub.modality) : null} indicator="Ind. 1" field="Modalité" />
          <InfoRow Icon={Calendar} value={pub.deliveryStart ? `${labelDelivery(pub.deliveryStart)}${pub.deliveryStartDetail ? ` — ${pub.deliveryStartDetail}` : ""}` : null} indicator="Ind. 1" field="Délai d'accès" />
          <InfoRow Icon={Users} value={pub.audience ? truncate(pub.audience, 60) : null} indicator="Ind. 1" field="Public cible" />
        </div>

        {/* CTAs (radius 50, primary brand fill / secondary outline) */}
        <Link href="/a-propos" data-cta-primary style={{ width: "100%", display: "flex", padding: "16px 24px", borderRadius: 50, background: blueBg, alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
          <span style={{ fontFamily: POPPINS, fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>Je m&apos;inscris</span>
        </Link>
        <Link href="#programme" data-cta-secondary style={{ width: "100%", display: "flex", padding: "14px 24px", gap: 8, borderRadius: 50, background: "#FFFFFF", alignItems: "center", justifyContent: "center", border: `1.5px solid ${blueBg}`, textDecoration: "none" }}>
          <Download size={18} strokeWidth={2} style={{ color: blueBg }} />
          <span style={{ fontFamily: POPPINS, fontSize: 14, fontWeight: 600, color: blueBg }}>Télécharger le programme PDF</span>
        </Link>

        {/* Mini financing labels */}
        {(pr.fundingOPCO || pr.fundingCPF || pr.fundingFNE) && (
          <div data-name="Logos financement" style={{ display: "flex", width: "100%", gap: 16, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {pr.fundingOPCO && <span style={{ fontFamily: POPPINS, fontSize: 11, fontWeight: 600, color: muted }}>OPCO Atlas</span>}
            {pr.fundingOPCO && (pr.fundingCPF || pr.fundingFNE) && <span style={{ fontFamily: POPPINS, fontSize: 11, color: "#CCCCCC" }}>•</span>}
            {pr.fundingCPF && <span style={{ fontFamily: POPPINS, fontSize: 11, fontWeight: 600, color: muted }}>Éligible CPF</span>}
            {pr.fundingCPF && pr.fundingFNE && <span style={{ fontFamily: POPPINS, fontSize: 11, color: "#CCCCCC" }}>•</span>}
            {pr.fundingFNE && <span style={{ fontFamily: POPPINS, fontSize: 11, fontWeight: 600, color: muted }}>FNE-Formation</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ Icon, value, indicator, field }: { Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>; value: string | null; indicator: string; field: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: 12, alignItems: "center" }}>
      <Icon size={20} strokeWidth={2} style={{ color: blueBg, flexShrink: 0 }} />
      {value ? (
        <span style={{ fontFamily: POPPINS, fontSize: 14, color: txt }}>{value}</span>
      ) : (
        <MissingBadge inline indicator={indicator} field={field} />
      )}
    </div>
  );
}

/* =====================================================================
   OBJECTIFS PÉDAGOGIQUES (BLUE bg, rounded-top 24)
   ===================================================================== */

function Objectifs({ f }: { f: Formation }) {
  const obj = f._ind5_objectives;
  const items = obj.operational ?? [];

  return (
    <div data-name="Objectifs Pédagogiques" style={SECTION({ padding: "80px 120px", gap: 40, borderRadius: "24px 24px 0 0", background: blueBg })}>
      <SectionLabel dark>OBJECTIFS</SectionLabel>
      <SectionTitle dark size={32}>
        À l&apos;issue de cette formation, vous serez capable de :
      </SectionTitle>
      {obj.main || items.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 20 }}>
          {obj.main && (
            <span style={{ fontFamily: POPPINS, fontSize: 18, fontWeight: 500, lineHeight: 1.4, color: "#FFFFFF" }}>{obj.main}</span>
          )}
          {items.map((o, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "row", width: "100%", gap: 16 }}>
              <CircleCheck size={24} strokeWidth={2} style={{ color: "#FFFFFF", flexShrink: 0 }} />
              <span style={{ fontFamily: POPPINS, fontSize: 16, lineHeight: 1.5, color: "#FFFFFFCC", flex: "1 1 0", minWidth: 0 }}>{o}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <MissingBadge indicator="Ind. 5" field="Objectifs pédagogiques" hint="Au moins 3-4 objectifs opérationnels (verbes d'action)." />
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   PUBLIC & PRÉREQUIS (2 cols, no card backgrounds)
   ===================================================================== */

function PublicEtPrerequis({ f }: { f: Formation }) {
  const pub = f._ind1_publicInfo;
  const pre = f._ind8_prerequisites;
  const audienceLines = pub.audience ? splitLines(pub.audience) : [];
  const prereqsText = [pre.regulatory, pre.professional, pre.technical, ...pre.items].filter(Boolean).join("\n\n");

  return (
    <div data-name="Public & Prérequis" style={{ display: "flex", flexDirection: "row", width: "100%", padding: "80px 120px", gap: 64, background: "#FFFFFF" }}>
      <div data-name="Public cible" style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: 0, gap: 24 }}>
        <span style={{ fontFamily: POPPINS, fontSize: 28, fontWeight: 700, color: ink }}>Public cible</span>
        {audienceLines.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16 }}>
            {audienceLines.map((line, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "row", width: "100%", gap: 12, alignItems: "flex-start" }}>
                <User size={20} strokeWidth={2} style={{ color: blueBg, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: POPPINS, fontSize: 15, lineHeight: 1.5, color: txt, flex: "1 1 0", minWidth: 0 }}>{line}</span>
              </div>
            ))}
          </div>
        ) : (
          <MissingBadge indicator="Ind. 1" field="Public cible" />
        )}
      </div>
      <div data-name="Prérequis" style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: 0, gap: 24 }}>
        <span style={{ fontFamily: POPPINS, fontSize: 28, fontWeight: 700, color: ink }}>Prérequis</span>
        {prereqsText ? (
          <span style={{ fontFamily: POPPINS, fontSize: 15, lineHeight: 1.6, color: txt, width: "100%", whiteSpace: "pre-line" }}>{prereqsText}</span>
        ) : (
          <MissingBadge indicator="Ind. 8" field="Prérequis" />
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   PROGRAMME (light gray bg + date badge)
   ===================================================================== */

function Programme({ f }: { f: Formation }) {
  const modules = f._program.modules ?? [];
  const lastUpdate = f._meta.updatedAt;

  return (
    <div id="programme" data-name="Programme" style={SECTION({ padding: "80px 120px", gap: 32, background: "#F8F9FA" })}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16 }}>
        <SectionLabel>PROGRAMME</SectionLabel>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: 16, alignItems: "center" }}>
          <span style={{ fontFamily: POPPINS, fontSize: 32, fontWeight: 700, color: ink }}>Programme détaillé</span>
          {lastUpdate && (
            <div style={{ display: "flex", padding: "4px 12px", borderRadius: 8, background: "#FFF3E0" }}>
              <span style={{ fontFamily: POPPINS, fontSize: 11, fontWeight: 600, color: "#E65100" }}>Mis à jour le {formatDate(lastUpdate)}</span>
            </div>
          )}
        </div>
      </div>

      {modules.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 12 }}>
          {modules.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "row", width: "100%", padding: "24px 28px", borderRadius: 12, background: "#FFFFFF", alignItems: "center", justifyContent: "space-between", border: `1px solid ${lineColor}`, boxShadow: "0px 4px 12px #00000008" }}>
              <div style={{ display: "flex", flexDirection: "row", flex: "1 1 0", minWidth: 0, gap: 12, alignItems: "center" }}>
                <span style={{ fontFamily: POPPINS, fontSize: 14, fontWeight: 700, color: blueBg }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: POPPINS, fontSize: 16, fontWeight: 600, color: ink }}>{m.title}</span>
              </div>
              {m.duration_hours && (
                <span style={{ fontFamily: POPPINS, fontSize: 13, color: muted }}>{m.duration_hours}h</span>
              )}
              <ChevronDown size={20} strokeWidth={2} style={{ color: muted }} />
            </div>
          ))}
        </div>
      ) : (
        <MissingBadge indicator="Ind. 1" field="Programme détaillé" hint="Liste de modules avec durée et contenu — éditeur dédié à venir dans le back-office." />
      )}
    </div>
  );
}

/* =====================================================================
   MODALITÉS PÉDAGOGIQUES (white, 4 colonnes avec icon containers 60x60)
   ===================================================================== */

function ModalitesPedagogiques({ f }: { f: Formation }) {
  const ped = f._ind6_19_pedagogy;
  const ev = f._ind11_evaluation;

  return (
    <div data-name="Section — Modalités pédagogiques" style={SECTION({ padding: "80px 120px", gap: 40 })}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 12 }}>
        <SectionLabel>PÉDAGOGIE</SectionLabel>
        <SectionTitle>Modalités pédagogiques</SectionTitle>
      </div>
      <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: 32 }}>
        <ModaliteCard Icon={Monitor} title="Modalité" content={f._ind1_publicInfo.modality ? labelModality(f._ind1_publicInfo.modality) : null} indicator="Ind. 6" field="Modalité" />
        <ModaliteCard Icon={BookOpen} title="Méthodes" content={ped.methods.length ? ped.methods.join("\n") : null} indicator="Ind. 6" field="Méthodes pédagogiques" />
        <ModaliteCard Icon={HelpCircle} title="Ressources" content={ped.tools.length || ped.supports.length ? [...ped.tools, ...ped.supports].join("\n") : null} indicator="Ind. 19" field="Outils & supports" />
        <ModaliteCard Icon={CircleCheck} title="Évaluation" content={ev.modalities.length ? ev.modalities.join("\n") : null} indicator="Ind. 11" field="Modalités d'évaluation" />
      </div>
    </div>
  );
}

function ModaliteCard({ Icon, title, content, indicator, field }: { Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>; title: string; content: string | null; indicator: string; field: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: 0, gap: 16 }}>
      <div style={{ display: "flex", width: 60, height: 60, borderRadius: 16, background: blueLight, alignItems: "center", justifyContent: "center" }}>
        <Icon size={28} strokeWidth={2} style={{ color: blueBg }} />
      </div>
      <span style={{ fontFamily: POPPINS, fontSize: 16, fontWeight: 700, color: ink }}>{title}</span>
      {content ? (
        <span style={{ fontFamily: POPPINS, fontSize: 14, lineHeight: 1.5, color: txt, width: "100%", whiteSpace: "pre-line" }}>{content}</span>
      ) : (
        <MissingBadge inline indicator={indicator} field={field} />
      )}
    </div>
  );
}

/* =====================================================================
   ORGANISATION (BLUE bg, rounded-top, info table)
   ===================================================================== */

function Organisation({ f }: { f: Formation }) {
  const pub = f._ind1_publicInfo;
  const ped = f._ind6_19_pedagogy;

  const rows: { label: string; value: string | null; indicator: string }[] = [
    { label: "Durée totale", value: pub.duration_hours ? `${pub.duration_hours} heures` : null, indicator: "Ind. 1" },
    { label: "Format", value: pub.format, indicator: "Ind. 1" },
    { label: "Délai d'accès", value: pub.deliveryStart ? `${labelDelivery(pub.deliveryStart)}${pub.deliveryStartDetail ? ` (${pub.deliveryStartDetail})` : ""}` : null, indicator: "Ind. 1" },
    { label: "Durée d'accès post-formation", value: ped.accessDuration, indicator: "Ind. 1" },
    { label: "Tutorat", value: ped.tutoring, indicator: "Ind. 19" },
    { label: "Langue", value: pub.language === "fr" ? "Français" : pub.language },
  ].map((r) => ({ ...r, indicator: r.indicator ?? "—" }));

  return (
    <div data-name="Section — Organisation" style={SECTION({ padding: "80px 120px", gap: 40, borderRadius: "24px 24px 0 0", background: blueBg })}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 12 }}>
        <SectionLabel dark>ORGANISATION</SectionLabel>
        <SectionTitle dark>Informations pratiques</SectionTitle>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", borderRadius: 12, background: "#FFFFFF", border: `1px solid ${lineColor}`, boxShadow: cardShadow }}>
        {rows.map((row, i) => (
          <div key={row.label} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "row", width: "100%", padding: "20px 28px", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <span style={{ fontFamily: POPPINS, fontSize: 15, color: txt }}>{row.label}</span>
              {row.value ? (
                <span style={{ fontFamily: POPPINS, fontSize: 15, fontWeight: 600, color: ink, textAlign: "right" }}>{row.value}</span>
              ) : (
                <MissingBadge inline indicator={row.indicator} field={row.label} />
              )}
            </div>
            {i < rows.length - 1 && <div style={{ width: "100%", height: 1, background: lineColor }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================================
   ACCESSIBILITÉ HANDICAP
   ===================================================================== */

function AccessibiliteHandicap({ f, site }: { f: Formation; site: Awaited<ReturnType<typeof readSiteQualiopi>> }) {
  const referent = f._ind26_accessibility.referent ?? site._ind26_handicap.referentName;
  const email = f._ind26_accessibility.referentEmail ?? site._ind26_handicap.referentEmail;
  const policy = site._ind26_handicap.policy;
  const accommodations = f._ind26_accessibility.accommodations;

  return (
    <div data-name="Section — Accessibilité Handicap" style={{ display: "flex", flexDirection: "row", width: "100%", padding: "60px 120px", gap: 24, background: "#FFFFFF", alignItems: "center" }}>
      <div style={{ display: "flex", width: 60, height: 60, borderRadius: 16, background: blueLight, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <HelpCircle size={32} strokeWidth={2} style={{ color: blueBg }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: 0, gap: 6 }}>
        <span style={{ fontFamily: POPPINS, fontSize: 18, fontWeight: 700, color: ink }}>Accessibilité</span>
        {policy ? (
          <span style={{ fontFamily: POPPINS, fontSize: 14, lineHeight: 1.6, color: txt, width: "100%" }}>{policy}</span>
        ) : (
          <span style={{ fontFamily: POPPINS, fontSize: 14, lineHeight: 1.6, color: txt, width: "100%" }}>
            Cette formation est accessible aux personnes en situation de handicap.
            {referent && email ? ` Contactez ${referent} (${email}) pour adapter les modalités.` : " "}
          </span>
        )}
        {accommodations.length > 0 && (
          <ul style={{ margin: "8px 0 0", paddingLeft: 20, fontFamily: POPPINS, fontSize: 14, color: txt, lineHeight: 1.5 }}>
            {accommodations.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        )}
        {!referent && !email && <MissingBadge inline indicator="Ind. 26" field="Référent handicap" />}
      </div>
    </div>
  );
}

/* =====================================================================
   TARIFS & FINANCEMENT (light bg, big price + 4 funding cards)
   ===================================================================== */

function TarifsFinancement({ f }: { f: Formation }) {
  const pr = f._ind1_pricing;
  const priceLabel = pr.amountHT !== null ? formatPrice(pr.amountHT, pr.currency) : null;

  return (
    <div data-name="Section — Tarifs & Financement" style={SECTION({ padding: "80px 120px", gap: 40, background: "#F8F9FA" })}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 12 }}>
        <SectionLabel>TARIFS</SectionLabel>
        <SectionTitle>Tarifs et financement</SectionTitle>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 8 }}>
        {priceLabel ? (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <span style={{ fontFamily: POPPINS, fontSize: 38, fontWeight: 700, color: ink }}>{priceLabel}</span>
            <span style={{ fontFamily: POPPINS, fontSize: 18, color: txt }}>HT{pr.perPerson ? " / personne" : ""}</span>
          </div>
        ) : (
          <MissingBadge indicator="Ind. 1" field="Tarif HT" hint="Le tarif doit être visible publiquement." />
        )}
        {pr.fundingDetails && (
          <span style={{ fontFamily: POPPINS, fontSize: 16, color: txt }}>{pr.fundingDetails}</span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: 20 }}>
        {pr.fundingOPCO && <FundingCard Icon={Building2} title="OPCO Atlas" desc={"Prise en charge possible\nvia votre OPCO"} />}
        {pr.fundingCPF && <FundingCard Icon={GraduationCap} title="CPF" desc={"Éligible au CPF"} />}
        {pr.fundingFNE && <FundingCard Icon={HelpCircle} title="FNE-Formation" desc={"Aide de l'État pour la\nformation des salariés"} />}
        <FundingCard Icon={Building2} title="Employeur direct" desc={"Plan de développement\ndes compétences"} />
      </div>
      <Link href="/#financement" style={{ fontFamily: POPPINS, fontSize: 15, fontWeight: 600, color: blueBg, textDecoration: "none" }}>
        Comment financer ma formation ? →
      </Link>
    </div>
  );
}

function FundingCard({ Icon, title, desc }: { Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: 0, padding: "28px 24px", gap: 16, borderRadius: 12, background: "#FFFFFF", border: `1px solid ${lineColor}`, boxShadow: cardShadow }}>
      <div style={{ display: "flex", width: 48, height: 48, borderRadius: 12, background: blueLight, alignItems: "center", justifyContent: "center" }}>
        <Icon size={24} strokeWidth={2} style={{ color: blueBg }} />
      </div>
      <span style={{ fontFamily: POPPINS, fontSize: 15, fontWeight: 700, color: ink }}>{title}</span>
      <span style={{ fontFamily: POPPINS, fontSize: 13, lineHeight: 1.5, color: txt, whiteSpace: "pre-line" }}>{desc}</span>
    </div>
  );
}

/* =====================================================================
   FORMATEURS
   ===================================================================== */

function Formateurs({ f }: { f: Formation }) {
  return (
    <div data-name="Section — Formateurs" style={SECTION({ padding: "80px 120px", gap: 40 })}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 12 }}>
        <SectionLabel>FORMATEURS</SectionLabel>
        <SectionTitle>Vos formateurs</SectionTitle>
      </div>
      {f._trainers.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: 32, flexWrap: "wrap" }}>
          {f._trainers.map((t, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: 280, padding: "32px 28px", gap: 16, borderRadius: 12, background: "#FFFFFF", alignItems: "center", border: `1px solid ${lineColor}`, boxShadow: cardShadow }}>
              <div style={{ display: "flex", width: 80, height: 80, borderRadius: 40, background: lineColor, alignItems: "center", justifyContent: "center" }}>
                <User size={36} strokeWidth={2} style={{ color: blueBg }} />
              </div>
              <span style={{ fontFamily: POPPINS, fontSize: 18, fontWeight: 700, color: ink }}>{t.name}</span>
              {t.role && <span style={{ fontFamily: POPPINS, fontSize: 14, fontWeight: 500, color: blueBg }}>{t.role}</span>}
              {t.bio && <span style={{ fontFamily: POPPINS, fontSize: 14, lineHeight: 1.6, textAlign: "center", color: txt, width: "100%" }}>{t.bio}</span>}
              {t.qualifications.length > 0 && (
                <div style={{ display: "flex", padding: "6px 14px", gap: 6, borderRadius: 20, background: blueLight, alignItems: "center" }}>
                  <Award size={14} strokeWidth={2} style={{ color: blueBg }} />
                  <span style={{ fontFamily: POPPINS, fontSize: 12, fontWeight: 600, color: blueBg }}>{t.qualifications.join(" · ")}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <MissingBadge indicator="Ind. 22" field="Formateurs" hint="Au moins 1 formateur visible avec son nom, rôle, et qualifications." />
      )}
    </div>
  );
}

/* =====================================================================
   RÉSULTATS (BLUE bg, 4 stats cards)
   ===================================================================== */

function Resultats({ f }: { f: Formation }) {
  const r = f._ind2_results;
  const stats = [
    { value: r.satisfactionRate !== null ? `${r.satisfactionRate}%` : null, label: "Taux de\nsatisfaction" },
    { value: r.learnersTrained?.toString() ?? null, label: "Apprenants\nformés" },
    { value: r.completionRate !== null ? `${r.completionRate}%` : null, label: "Taux de\ncomplétion" },
    { value: r.successRate !== null ? `${r.successRate}%` : null, label: "Taux de\nréussite" },
  ];
  const anyValue = stats.some((s) => s.value);

  return (
    <div data-name="Section Résultats" style={{ display: "flex", flexDirection: "column", width: "100%", padding: "80px 120px", gap: 48, background: blueBg, alignItems: "center" }}>
      <SectionLabel dark>RÉSULTATS</SectionLabel>
      <SectionTitle dark>Indicateurs de qualité</SectionTitle>
      {anyValue ? (
        <div style={{ display: "flex", flexDirection: "row", width: 1100, gap: 24, justifyContent: "center" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: 0, padding: "32px 24px", gap: 8, borderRadius: 12, background: "#4450FA", alignItems: "center" }}>
              {s.value ? (
                <span style={{ fontFamily: POPPINS, fontSize: 42, fontWeight: 700, color: "#FFFFFF" }}>{s.value}</span>
              ) : (
                <span style={{ fontFamily: POPPINS, fontSize: 18, color: "#FFFFFF99" }}>—</span>
              )}
              <span style={{ fontFamily: POPPINS, fontSize: 14, fontWeight: 500, textAlign: "center", color: "#FFFFFFCC", whiteSpace: "pre-line" }}>{s.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ width: 800 }}>
          <MissingBadge indicator="Ind. 2" field="Indicateurs de qualité" hint="Au moins satisfaction + complétion + réussite (ou apprenants formés). Mise à jour annuelle minimum." />
        </div>
      )}
      {r.lastUpdate && (
        <span style={{ fontFamily: POPPINS, fontSize: 12, color: "#FFFFFF99" }}>Dernière mise à jour : {formatDate(r.lastUpdate)} · {r.scope}</span>
      )}
    </div>
  );
}

/* =====================================================================
   ENCADRÉ LÉGAL
   ===================================================================== */

function EncadreLegal() {
  return (
    <div data-name="Encadré Légal" style={{ display: "flex", flexDirection: "column", width: "100%", padding: "60px 120px", gap: 16, background: "#FFFFFF" }}>
      <div style={{ width: "100%", background: "#FAFBFC", border: `1px solid ${lineColor}`, borderRadius: 16, padding: 28 }}>
        <h3 style={{ margin: "0 0 12px", fontFamily: POPPINS, fontSize: 16, fontWeight: 700, color: ink }}>Mentions légales — Qualiopi Indicateur 1</h3>
        <p style={{ margin: 0, fontFamily: POPPINS, fontSize: 13, lineHeight: 1.6, color: txt }}>
          Cette fiche tient lieu de descriptif Qualiopi au sens du décret n° 2019-565. Pour toute réclamation, voir la
          {" "}<Link href="/mentions" style={{ color: blueBg }}>procédure dédiée</Link>.
        </p>
      </div>
    </div>
  );
}

/* =====================================================================
   FOOTER (4 cols, identique aux autres pages publiques)
   ===================================================================== */

function Footer() {
  return (
    <footer style={{ background: blueBg, padding: "48px 120px", color: "#FFFFFF", fontFamily: POPPINS, display: "flex", flexDirection: "column", gap: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
        <div style={{ width: 300 }}>
          <p style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>OF Formation</p>
          <p style={{ fontSize: 13, color: "#CCCCCC", margin: "8px 0 0", lineHeight: 1.5 }}>
            Organisme de formation certifié Qualiopi, spécialisé dans le secteur bancaire et financier.
          </p>
        </div>
        <FooterCol title="Navigation" links={[
          { href: "/", label: "Accueil" },
          { href: "/catalogue", label: "Nos formations" },
          { href: "/a-propos", label: "À propos" },
          { href: "/#financement", label: "Financement" },
        ]} />
        <FooterCol title="Légal" links={[
          { href: "/mentions", label: "Mentions légales" },
          { href: "/mentions", label: "CGV" },
          { href: "/mentions", label: "Politique de confidentialité" },
          { href: "/mentions", label: "Accessibilité handicap" },
        ]} />
        <FooterCol title="Contact" links={[
          { href: "mailto:contact@of-formation.fr", label: "contact@of-formation.fr" },
          { href: "/a-propos", label: "Paris, France" },
        ]} />
      </div>
      <div style={{ height: 1, background: "#4450FA", width: "100%" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <p style={{ fontSize: 12, color: "#CCCCCC", margin: 0 }}>© 2026 OF Formation. Tous droits réservés.</p>
        <p style={{ fontSize: 11, color: "#FFFFFFAA", margin: 0 }}>Certification Qualiopi — La qualité reconnue par l&apos;État</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
      {links.map((l) => (
        <Link key={l.label} href={l.href} style={{ fontSize: 13, color: "#CCCCCC", textDecoration: "none" }}>{l.label}</Link>
      ))}
    </div>
  );
}

/* =====================================================================
   FORMAT HELPERS
   ===================================================================== */

function formatPrice(amount: number, currency: string): string {
  const sign = currency === "EUR" ? "€" : currency;
  // 2 490 € (espace insécable comme séparateur de milliers à la française)
  const formatted = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount);
  return `${formatted} ${sign}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function labelModality(m: string): string {
  return ({ "e-learning": "E-learning", blended: "Blended", presentiel: "Présentiel" } as Record<string, string>)[m] ?? m;
}

function labelDelivery(d: string): string {
  return ({ immediate: "Immédiat", scheduled: "Sessions planifiées", on_demand: "À la demande" } as Record<string, string>)[d] ?? d;
}

function splitLines(s: string): string[] {
  return s.split("\n").map((x) => x.replace(/^[\s•·\-–—*]+/, "").trim()).filter(Boolean);
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
