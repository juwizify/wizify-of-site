/**
 * Typed read/write helpers for the local JSON content store.
 * Storage = `data/formations.json` and `data/site_qualiopi.json` at the repo root.
 * Used by:
 *   - public site dynamic routes (read-only, server components)
 *   - /admin pages (read + write via server actions)
 *
 * Replace this file's `read*` / `write*` impls with Supabase calls when the
 * Bridge OF connection is wired up. Public types stay stable.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
export const FORMATIONS_PATH = path.join(ROOT, "data", "formations.json");
export const SITE_QUALIOPI_PATH = path.join(ROOT, "data", "site_qualiopi.json");

// ---------- Types ----------

export type Modality = "e-learning" | "blended" | "presentiel" | null;
export type DeliveryStart = "immediate" | "scheduled" | "on_demand" | null;
export type CertifType = "NONE" | "RNCP" | "RS" | "CQPNE" | "BDC" | "VAE";

export type Trainer = {
  name: string;
  role: string | null;
  bio: string | null;
  qualifications: string[];
};

export type ProgramModule = {
  title: string;
  duration_hours: number | null;
  objectives: string[];
  content: string | null;
};

export type CorrectiveAction = {
  date: string;
  issue: string;
  action: string;
  outcome: string | null;
};

export type Formation = {
  slug: string;
  qualiobee_uuid: string | null;
  specialtyCode: string | null;
  certifType: CertifType;
  certifLevel: string | null;

  identification: {
    title: string;
    shortDescription: string | null;
    badge: string | null;
    tagline: string | null;
  };

  _ind1_publicInfo: {
    duration_hours: number | null;
    modality: Modality;
    modalityDetail: string | null;
    language: string;
    deliveryStart: DeliveryStart;
    deliveryStartDetail: string | null;
    audience: string | null;
    format: string | null;
  };

  _ind5_objectives: { main: string | null; operational: string[] };

  _ind8_prerequisites: {
    regulatory: string | null;
    professional: string | null;
    technical: string | null;
    items: string[];
  };

  _program: { intro: string | null; modules: ProgramModule[] };

  _ind6_19_pedagogy: {
    methods: string[];
    tools: string[];
    supports: string[];
    synchronous: boolean;
    asynchronous: boolean;
    tutoring: string | null;
    accessDuration: string | null;
  };

  _ind11_evaluation: {
    modalities: string[];
    passingScore: number | null;
    certifyingExam: string | null;
    certificateDelivered: string | null;
    feedback: string | null;
  };

  _ind1_pricing: {
    amountHT: number | null;
    taxRate: number | null;
    amountTTC: number | null;
    currency: string;
    perPerson: boolean;
    discountPolicy: string | null;
    fundingOPCO: boolean;
    fundingCPF: boolean;
    fundingFNE: boolean;
    fundingDetails: string | null;
  };

  _ind26_accessibility: {
    referent: string | null;
    referentEmail: string | null;
    accommodations: string[];
    partners: string[];
  };

  _ind2_results: {
    satisfactionRate: number | null;
    completionRate: number | null;
    successRate: number | null;
    learnersTrained: number | null;
    lastUpdate: string | null;
    scope: string | null;
  };

  _ind30_32_improvement: {
    feedbackProcess: string | null;
    lastReview: string | null;
    correctiveActions: CorrectiveAction[];
  };

  _trainers: Trainer[];

  _meta: {
    frappe_lms_course: string | null;
    qualiobee_externalId: string | null;
    synced_at: string | null;
    published: boolean;
    createdAt: string | null;
    updatedAt: string | null;
  };
};

export type SiteQualiopi = {
  organism: {
    legalName: string | null;
    siret: string | null;
    ndaNumber: string | null;
    vat: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    directorName: string | null;
    host: string | null;
  };
  qualiopiCertif: {
    certifiedSince: string | null;
    certifBody: string | null;
    scope: string | null;
    logoUrl: string | null;
    publicCertificateUrl: string | null;
  };
  _ind26_handicap: {
    referentName: string | null;
    referentEmail: string | null;
    referentPhone: string | null;
    policy: string | null;
    partnersList: string[];
  };
  _ind31_complaints: {
    contactEmail: string | null;
    responseSLA: string | null;
    procedureUrl: string | null;
  };
  _ind2_globalResults: {
    satisfactionRateGlobal: number | null;
    completionRateGlobal: number | null;
    learnersTrainedTotal: number | null;
    lastUpdate: string | null;
    scope: string | null;
  };
  _ind30_32_improvement: {
    lastReviewDate: string | null;
    correctiveActions: CorrectiveAction[];
    publicReviewUrl: string | null;
  };
  _legal: {
    cgvUrl: string;
    rgpdUrl: string;
    rulesUrl: string;
  };
};

// ---------- Read ----------

export async function readFormations(): Promise<Formation[]> {
  const raw = await fs.readFile(FORMATIONS_PATH, "utf8");
  return JSON.parse(raw) as Formation[];
}

export async function readFormation(slug: string): Promise<Formation | null> {
  const all = await readFormations();
  return all.find((f) => f.slug === slug) ?? null;
}

export async function readSiteQualiopi(): Promise<SiteQualiopi> {
  const raw = await fs.readFile(SITE_QUALIOPI_PATH, "utf8");
  return JSON.parse(raw) as SiteQualiopi;
}

// ---------- Write ----------

export async function writeFormations(items: Formation[]): Promise<void> {
  await fs.writeFile(FORMATIONS_PATH, JSON.stringify(items, null, 2) + "\n", "utf8");
}

export async function updateFormation(
  slug: string,
  patch: Partial<Formation> | ((f: Formation) => Formation),
): Promise<Formation> {
  const all = await readFormations();
  const idx = all.findIndex((f) => f.slug === slug);
  if (idx === -1) throw new Error(`formation not found: ${slug}`);
  const current = all[idx];
  const next =
    typeof patch === "function"
      ? patch(current)
      : ({
          ...current,
          ...patch,
          // _meta merge order matters: current → patch → updatedAt.
          // Without spreading `patch._meta` last, fields like `published`
          // sent in the patch get clobbered by the older current._meta.
          _meta: {
            ...current._meta,
            ...(patch._meta ?? {}),
            updatedAt: new Date().toISOString(),
          },
        } as Formation);
  all[idx] = next;
  await writeFormations(all);
  return next;
}

export async function writeSiteQualiopi(value: SiteQualiopi): Promise<void> {
  await fs.writeFile(SITE_QUALIOPI_PATH, JSON.stringify(value, null, 2) + "\n", "utf8");
}
