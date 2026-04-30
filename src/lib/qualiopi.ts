/**
 * Qualiopi compliance audit — computes per-formation and site-wide completeness.
 *
 * Each "check" maps to a Qualiopi indicator (RNQ V9), points at a specific
 * field path, and reports filled / missing. The /admin dashboard renders
 * this output as a gauge + indicator-by-indicator status.
 *
 * Indicator titles are condensed; full reference lives in
 * `wizify-of/qualiopi-reference.md` (memory: qualiopi_regulation.md).
 */
import type { Formation, SiteQualiopi } from "./data";

export type CheckStatus = "ok" | "missing" | "partial" | "na";

export type Check = {
  id: string;
  indicator: string;     // "Ind. 1", "Ind. 5", …
  scope: "site" | "formation";
  category:
    | "Identification"
    | "Information publique"
    | "Objectifs"
    | "Prérequis"
    | "Programme"
    | "Pédagogie"
    | "Évaluation"
    | "Tarifs & financement"
    | "Accessibilité handicap"
    | "Résultats"
    | "Amélioration continue"
    | "Formateurs"
    | "Identité OF"
    | "Certification Qualiopi"
    | "Réclamations"
    | "Légal";
  label: string;
  status: CheckStatus;
  detail?: string;
};

// ---------- helpers ----------
const has = (v: unknown): boolean =>
  v !== null && v !== undefined && v !== "" &&
  !(Array.isArray(v) && v.length === 0);

const both = (a: unknown, b: unknown): CheckStatus =>
  has(a) && has(b) ? "ok" : has(a) || has(b) ? "partial" : "missing";

// ---------- per formation ----------

export function auditFormation(f: Formation): Check[] {
  const checks: Check[] = [];

  // Identification — non-Qualiopi but mandatory
  checks.push({
    id: "title",
    indicator: "—",
    scope: "formation",
    category: "Identification",
    label: "Titre",
    status: has(f.identification.title) ? "ok" : "missing",
  });
  checks.push({
    id: "shortDescription",
    indicator: "—",
    scope: "formation",
    category: "Identification",
    label: "Accroche / description courte",
    status: has(f.identification.shortDescription) ? "ok" : "missing",
  });

  // Ind. 1 — Information publique
  const pub = f._ind1_publicInfo;
  checks.push({ id: "duration", indicator: "Ind. 1", scope: "formation", category: "Information publique", label: "Durée totale (heures)", status: has(pub.duration_hours) ? "ok" : "missing" });
  checks.push({ id: "modality", indicator: "Ind. 1", scope: "formation", category: "Information publique", label: "Modalité (e-learning / blended / présentiel)", status: has(pub.modality) ? "ok" : "missing" });
  checks.push({ id: "audience", indicator: "Ind. 1", scope: "formation", category: "Information publique", label: "Public cible", status: has(pub.audience) ? "ok" : "missing" });
  checks.push({ id: "deliveryStart", indicator: "Ind. 1", scope: "formation", category: "Information publique", label: "Délai d'accès", status: has(pub.deliveryStart) ? "ok" : "missing" });

  // Ind. 5 — Objectifs
  checks.push({ id: "objectivesMain", indicator: "Ind. 5", scope: "formation", category: "Objectifs", label: "Objectif général", status: has(f._ind5_objectives.main) ? "ok" : "missing" });
  checks.push({ id: "objectivesOps", indicator: "Ind. 5", scope: "formation", category: "Objectifs", label: "Objectifs opérationnels (verbes d'action)", status: has(f._ind5_objectives.operational) ? "ok" : "missing", detail: f._ind5_objectives.operational.length ? `${f._ind5_objectives.operational.length} item(s)` : undefined });

  // Ind. 8 — Prérequis
  const pre = f._ind8_prerequisites;
  checks.push({ id: "prerequisites", indicator: "Ind. 8", scope: "formation", category: "Prérequis", label: "Prérequis (réglementaires, pro, techniques)", status: (has(pre.regulatory) || has(pre.professional) || has(pre.technical) || has(pre.items)) ? "ok" : "missing" });

  // Programme
  checks.push({ id: "programModules", indicator: "Ind. 1", scope: "formation", category: "Programme", label: "Programme détaillé (modules)", status: has(f._program.modules) ? "ok" : "missing", detail: f._program.modules.length ? `${f._program.modules.length} module(s)` : undefined });

  // Ind. 6 / 19 — Pédagogie
  const ped = f._ind6_19_pedagogy;
  checks.push({ id: "pedagogyMethods", indicator: "Ind. 6", scope: "formation", category: "Pédagogie", label: "Méthodes pédagogiques", status: has(ped.methods) ? "ok" : "missing" });
  checks.push({ id: "pedagogyTools", indicator: "Ind. 19", scope: "formation", category: "Pédagogie", label: "Moyens techniques / supports", status: (has(ped.tools) || has(ped.supports)) ? "ok" : "missing" });
  checks.push({ id: "pedagogyTutoring", indicator: "Ind. 19", scope: "formation", category: "Pédagogie", label: "Modalités de tutorat / accompagnement", status: has(ped.tutoring) ? "ok" : "missing" });
  checks.push({ id: "pedagogyAccess", indicator: "Ind. 1", scope: "formation", category: "Pédagogie", label: "Durée d'accès post-formation", status: has(ped.accessDuration) ? "ok" : "missing" });

  // Ind. 11 — Évaluation
  const ev = f._ind11_evaluation;
  checks.push({ id: "evalModalities", indicator: "Ind. 11", scope: "formation", category: "Évaluation", label: "Modalités d'évaluation", status: has(ev.modalities) ? "ok" : "missing" });
  checks.push({ id: "evalScore", indicator: "Ind. 11", scope: "formation", category: "Évaluation", label: "Seuil de réussite", status: has(ev.passingScore) ? "ok" : "missing" });
  checks.push({ id: "evalCertif", indicator: "Ind. 11", scope: "formation", category: "Évaluation", label: "Attestation / certificat délivré", status: has(ev.certificateDelivered) ? "ok" : "missing" });

  // Ind. 1 — Tarifs
  const pr = f._ind1_pricing;
  checks.push({ id: "priceAmount", indicator: "Ind. 1", scope: "formation", category: "Tarifs & financement", label: "Tarif HT", status: has(pr.amountHT) ? "ok" : "missing" });
  checks.push({ id: "fundingDetails", indicator: "Ind. 1", scope: "formation", category: "Tarifs & financement", label: "Détails financement (OPCO / CPF / FNE)", status: has(pr.fundingDetails) || pr.fundingOPCO || pr.fundingCPF || pr.fundingFNE ? "ok" : "missing" });

  // Ind. 26 — Accessibilité (formation-specific accommodations only;
  // the global referent is checked at site level)
  const acc = f._ind26_accessibility;
  checks.push({ id: "accommodations", indicator: "Ind. 26", scope: "formation", category: "Accessibilité handicap", label: "Adaptations possibles pour cette formation", status: has(acc.accommodations) ? "ok" : "missing" });

  // Ind. 2 — Résultats
  const res = f._ind2_results;
  checks.push({ id: "results", indicator: "Ind. 2", scope: "formation", category: "Résultats", label: "Taux de satisfaction / réussite / complétion", status: (has(res.satisfactionRate) || has(res.completionRate) || has(res.successRate)) ? "ok" : "missing" });
  checks.push({ id: "resultsLearners", indicator: "Ind. 2", scope: "formation", category: "Résultats", label: "Nombre d'apprenants formés", status: has(res.learnersTrained) ? "ok" : "missing" });

  // Formateurs
  checks.push({ id: "trainers", indicator: "Ind. 22", scope: "formation", category: "Formateurs", label: "Formateurs (au moins 1)", status: has(f._trainers) ? "ok" : "missing", detail: f._trainers.length ? `${f._trainers.length} formateur(s)` : undefined });

  return checks;
}

// ---------- site-wide ----------

export function auditSite(s: SiteQualiopi): Check[] {
  const checks: Check[] = [];

  // Identité OF
  checks.push({ id: "legalName", indicator: "—", scope: "site", category: "Identité OF", label: "Raison sociale", status: has(s.organism.legalName) ? "ok" : "missing" });
  checks.push({ id: "siret", indicator: "—", scope: "site", category: "Identité OF", label: "SIRET", status: has(s.organism.siret) ? "ok" : "missing" });
  checks.push({ id: "nda", indicator: "—", scope: "site", category: "Identité OF", label: "Numéro de Déclaration d'Activité (NDA)", status: has(s.organism.ndaNumber) ? "ok" : "missing" });
  checks.push({ id: "address", indicator: "—", scope: "site", category: "Identité OF", label: "Adresse du siège", status: has(s.organism.address) ? "ok" : "missing" });
  checks.push({ id: "contactEmail", indicator: "—", scope: "site", category: "Identité OF", label: "Email de contact", status: has(s.organism.email) ? "ok" : "missing" });

  // Certification Qualiopi
  checks.push({ id: "certifiedSince", indicator: "—", scope: "site", category: "Certification Qualiopi", label: "Date de certification", status: has(s.qualiopiCertif.certifiedSince) ? "ok" : "missing" });
  checks.push({ id: "certifBody", indicator: "—", scope: "site", category: "Certification Qualiopi", label: "Organisme certificateur", status: has(s.qualiopiCertif.certifBody) ? "ok" : "missing" });
  checks.push({ id: "certifLogo", indicator: "—", scope: "site", category: "Certification Qualiopi", label: "Logo Qualiopi affiché", status: has(s.qualiopiCertif.logoUrl) ? "ok" : "missing" });

  // Ind. 26 — Référent handicap
  const h = s._ind26_handicap;
  checks.push({ id: "handicapReferent", indicator: "Ind. 26", scope: "site", category: "Accessibilité handicap", label: "Référent handicap nommé", status: both(h.referentName, h.referentEmail) });
  checks.push({ id: "handicapPolicy", indicator: "Ind. 26", scope: "site", category: "Accessibilité handicap", label: "Politique d'accessibilité publiée", status: has(h.policy) ? "ok" : "missing" });

  // Ind. 31 — Réclamations
  const c = s._ind31_complaints;
  checks.push({ id: "complaintsContact", indicator: "Ind. 31", scope: "site", category: "Réclamations", label: "Procédure réclamation accessible", status: both(c.contactEmail, c.responseSLA) });

  // Ind. 2 — Résultats globaux
  const g = s._ind2_globalResults;
  checks.push({ id: "globalResults", indicator: "Ind. 2", scope: "site", category: "Résultats", label: "Taux globaux publiés", status: (has(g.satisfactionRateGlobal) || has(g.completionRateGlobal) || has(g.learnersTrainedTotal)) ? "ok" : "missing" });

  // Ind. 30 / 32 — Amélioration
  checks.push({ id: "improvementReview", indicator: "Ind. 30/32", scope: "site", category: "Amélioration continue", label: "Revue qualité publiée", status: has(s._ind30_32_improvement.lastReviewDate) ? "ok" : "missing" });

  return checks;
}

// ---------- aggregations ----------

export type Score = { total: number; ok: number; partial: number; missing: number; pct: number };

export function score(checks: Check[]): Score {
  const total = checks.filter((c) => c.status !== "na").length;
  const ok = checks.filter((c) => c.status === "ok").length;
  const partial = checks.filter((c) => c.status === "partial").length;
  const missing = checks.filter((c) => c.status === "missing").length;
  const pct = total === 0 ? 0 : Math.round(((ok + partial * 0.5) / total) * 100);
  return { total, ok, partial, missing, pct };
}
