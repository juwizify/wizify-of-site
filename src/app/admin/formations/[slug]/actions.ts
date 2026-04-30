"use server";
import { revalidatePath } from "next/cache";
import { readFormation, updateFormation, type Formation } from "@/lib/data";

// Tiny helpers — coerce form-data strings to typed values
const str = (fd: FormData, k: string): string | null => {
  const v = fd.get(k);
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
};
const num = (fd: FormData, k: string): number | null => {
  const v = str(fd, k);
  if (v === null) return null;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const bool = (fd: FormData, k: string): boolean => fd.get(k) === "on";
const lines = (fd: FormData, k: string): string[] => {
  const v = str(fd, k);
  return v ? v.split("\n").map((s) => s.trim()).filter(Boolean) : [];
};

export async function saveFormation(slug: string, fd: FormData): Promise<void> {
  const current = await readFormation(slug);
  if (!current) throw new Error(`Formation introuvable : ${slug}`);

  const next: Formation = {
    ...current,
    identification: {
      title: str(fd, "title") ?? current.identification.title,
      shortDescription: str(fd, "shortDescription"),
      badge: str(fd, "badge"),
      tagline: str(fd, "tagline"),
    },
    _ind1_publicInfo: {
      duration_hours: num(fd, "duration_hours"),
      modality: (str(fd, "modality") as Formation["_ind1_publicInfo"]["modality"]) ?? null,
      modalityDetail: str(fd, "modalityDetail"),
      language: str(fd, "language") ?? "fr",
      deliveryStart: (str(fd, "deliveryStart") as Formation["_ind1_publicInfo"]["deliveryStart"]) ?? null,
      deliveryStartDetail: str(fd, "deliveryStartDetail"),
      audience: str(fd, "audience"),
      format: str(fd, "format"),
    },
    _ind5_objectives: {
      main: str(fd, "objectivesMain"),
      operational: lines(fd, "objectivesOperational"),
    },
    _ind8_prerequisites: {
      regulatory: str(fd, "preRegulatory"),
      professional: str(fd, "preProfessional"),
      technical: str(fd, "preTechnical"),
      items: lines(fd, "preItems"),
    },
    _program: {
      intro: str(fd, "programIntro"),
      modules: current._program.modules, // edited via dedicated UI later
    },
    _ind6_19_pedagogy: {
      methods: lines(fd, "pedMethods"),
      tools: lines(fd, "pedTools"),
      supports: lines(fd, "pedSupports"),
      synchronous: bool(fd, "pedSynchronous"),
      asynchronous: bool(fd, "pedAsynchronous"),
      tutoring: str(fd, "pedTutoring"),
      accessDuration: str(fd, "pedAccessDuration"),
    },
    _ind11_evaluation: {
      modalities: lines(fd, "evalModalities"),
      passingScore: num(fd, "evalPassingScore"),
      certifyingExam: str(fd, "evalCertifyingExam"),
      certificateDelivered: str(fd, "evalCertificateDelivered"),
      feedback: str(fd, "evalFeedback"),
    },
    _ind1_pricing: {
      amountHT: num(fd, "priceHT"),
      taxRate: num(fd, "priceTaxRate") ?? 20,
      amountTTC: num(fd, "priceTTC"),
      currency: str(fd, "priceCurrency") ?? "EUR",
      perPerson: bool(fd, "pricePerPerson"),
      discountPolicy: str(fd, "priceDiscount"),
      fundingOPCO: bool(fd, "fundingOPCO"),
      fundingCPF: bool(fd, "fundingCPF"),
      fundingFNE: bool(fd, "fundingFNE"),
      fundingDetails: str(fd, "fundingDetails"),
    },
    _ind26_accessibility: {
      referent: str(fd, "accessReferent"),
      referentEmail: str(fd, "accessReferentEmail"),
      accommodations: lines(fd, "accessAccommodations"),
      partners: lines(fd, "accessPartners"),
    },
    _ind2_results: {
      satisfactionRate: num(fd, "resSatisfaction"),
      completionRate: num(fd, "resCompletion"),
      successRate: num(fd, "resSuccess"),
      learnersTrained: num(fd, "resLearners"),
      lastUpdate: str(fd, "resLastUpdate"),
      scope: str(fd, "resScope") ?? "Sur 12 derniers mois",
    },
    _ind30_32_improvement: {
      feedbackProcess: str(fd, "improvementFeedback"),
      lastReview: str(fd, "improvementLastReview"),
      correctiveActions: current._ind30_32_improvement.correctiveActions,
    },
    _trainers: current._trainers, // edited via dedicated UI later
    _meta: {
      ...current._meta,
      published: bool(fd, "published"),
      updatedAt: new Date().toISOString(),
    },
  };

  await updateFormation(slug, next);
  revalidatePath(`/admin/formations/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/formations");
  revalidatePath(`/formation/${slug}`);
  revalidatePath("/catalogue");
  revalidatePath("/");
}
