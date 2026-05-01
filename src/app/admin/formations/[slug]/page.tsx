import Link from "next/link";
import { notFound } from "next/navigation";
import { readFormation } from "@/lib/data";
import { auditFormation, score } from "@/lib/qualiopi";
import Gauge from "@/components/admin/Gauge";
import CheckList from "@/components/admin/CheckList";
import { Section, Field, TextArea, Select, Checkbox, Row } from "@/components/admin/Field";
import SaveBar from "@/components/admin/SaveBar";
import { saveFormation } from "./actions";

export default async function FormationEdit({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await readFormation(slug);
  if (!f) notFound();

  const checks = auditFormation(f);
  const s = score(checks);
  const save = saveFormation.bind(null, slug);

  // Helpers to format defaultValue
  const v = (x: string | number | null | undefined) => (x ?? "") as string | number;
  const lines = (arr: string[]) => arr.join("\n");

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <Link href="/admin/formations" className="text-xs text-zinc-500 hover:text-zinc-900">
            ← Toutes les formations
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight truncate">
            {f.identification.title}
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            /{f.slug} · {f.specialtyCode ?? "—"} · uuid: {f.qualiobee_uuid?.slice(0, 8) ?? "—"}
          </p>
        </div>
        <Gauge pct={s.pct} size={96} />
      </header>

      <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
        {/* FORM */}
        <form action={save} className="space-y-6">
          <Section title="Identification">
            <Field name="title" label="Titre" defaultValue={f.identification.title} required />
            <TextArea
              name="shortDescription"
              label="Description courte"
              hint="affichée sur le catalogue + en hero de la fiche formation"
              rows={2}
              defaultValue={v(f.identification.shortDescription)}
            />
            <Row>
              <Field name="badge" label="Badge catégorie" hint="ex: Assurance, Crédit" defaultValue={v(f.identification.badge)} />
              <Field name="tagline" label="Accroche (optionnel)" defaultValue={v(f.identification.tagline)} />
            </Row>
          </Section>

          <Section title="Information publique" indicator="Ind. 1" description="Durée, modalité, public, délais d'accès — visibles sur la fiche.">
            <Row cols={3}>
              <Field name="duration_hours" label="Durée (heures)" type="number" min={0} defaultValue={v(f._ind1_publicInfo.duration_hours)} />
              <Select
                name="modality"
                label="Modalité"
                defaultValue={v(f._ind1_publicInfo.modality)}
                options={[
                  { value: "e-learning", label: "E-learning" },
                  { value: "blended", label: "Blended (mixte)" },
                  { value: "presentiel", label: "Présentiel" },
                ]}
              />
              <Field name="language" label="Langue" defaultValue={v(f._ind1_publicInfo.language)} />
            </Row>
            <Field
              name="modalityDetail"
              label="Détail modalité"
              hint="ex: SCORM via Frappe LMS, accès 24/7"
              defaultValue={v(f._ind1_publicInfo.modalityDetail)}
            />
            <Row>
              <Select
                name="deliveryStart"
                label="Délai d'accès"
                defaultValue={v(f._ind1_publicInfo.deliveryStart)}
                options={[
                  { value: "immediate", label: "Immédiat" },
                  { value: "scheduled", label: "Sessions planifiées" },
                  { value: "on_demand", label: "À la demande" },
                ]}
              />
              <Field
                name="deliveryStartDetail"
                label="Précision délai"
                hint='ex: "Sous 48h après inscription"'
                defaultValue={v(f._ind1_publicInfo.deliveryStartDetail)}
              />
            </Row>
            <TextArea
              name="audience"
              label="Public cible"
              hint='ex: "Intermédiaires en assurance immatriculés ORIAS"'
              rows={2}
              defaultValue={v(f._ind1_publicInfo.audience)}
            />
            <Field name="format" label="Format" hint="ex: Asynchrone individuel" defaultValue={v(f._ind1_publicInfo.format)} />
          </Section>

          <Section title="Objectifs pédagogiques" indicator="Ind. 5">
            <TextArea
              name="objectivesMain"
              label="Objectif général"
              hint="1 phrase claire"
              rows={2}
              defaultValue={v(f._ind5_objectives.main)}
            />
            <TextArea
              name="objectivesOperational"
              label="Objectifs opérationnels"
              hint="un par ligne, verbe d'action en début (« Identifier… », « Analyser… »)"
              rows={6}
              defaultValue={lines(f._ind5_objectives.operational)}
            />
          </Section>

          <Section title="Prérequis" indicator="Ind. 8">
            <Row>
              <Field name="preRegulatory" label="Prérequis réglementaires" hint="ex: ORIAS" defaultValue={v(f._ind8_prerequisites.regulatory)} />
              <Field name="preProfessional" label="Prérequis pro" defaultValue={v(f._ind8_prerequisites.professional)} />
            </Row>
            <Field name="preTechnical" label="Prérequis techniques" hint="ex: ordinateur + navigateur récent" defaultValue={v(f._ind8_prerequisites.technical)} />
            <TextArea name="preItems" label="Autres prérequis" hint="un par ligne" rows={3} defaultValue={lines(f._ind8_prerequisites.items)} />
          </Section>

          <Section title="Programme">
            <TextArea name="programIntro" label="Introduction du programme" rows={3} defaultValue={v(f._program.intro)} />
            <p className="text-xs text-zinc-500">
              Modules détaillés : éditeur dédié à venir (
              <span className="font-mono">{f._program.modules.length}</span> module(s) actuellement).
            </p>
          </Section>

          <Section title="Méthodes & moyens pédagogiques" indicator="Ind. 6 / Ind. 19">
            <TextArea name="pedMethods" label="Méthodes pédagogiques" hint="un par ligne" rows={4} defaultValue={lines(f._ind6_19_pedagogy.methods)} />
            <TextArea name="pedTools" label="Outils & plateformes" hint="un par ligne" rows={3} defaultValue={lines(f._ind6_19_pedagogy.tools)} />
            <TextArea name="pedSupports" label="Supports remis" hint="un par ligne" rows={3} defaultValue={lines(f._ind6_19_pedagogy.supports)} />
            <Row>
              <Checkbox name="pedSynchronous" label="Synchrone" defaultChecked={f._ind6_19_pedagogy.synchronous} />
              <Checkbox name="pedAsynchronous" label="Asynchrone" defaultChecked={f._ind6_19_pedagogy.asynchronous} />
            </Row>
            <Row>
              <Field name="pedTutoring" label="Modalités de tutorat" defaultValue={v(f._ind6_19_pedagogy.tutoring)} />
              <Field name="pedAccessDuration" label="Durée d'accès post-formation" defaultValue={v(f._ind6_19_pedagogy.accessDuration)} />
            </Row>
          </Section>

          <Section title="Évaluation" indicator="Ind. 11">
            <TextArea name="evalModalities" label="Modalités d'évaluation" hint="un par ligne (QCM final, mise en situation, etc.)" rows={3} defaultValue={lines(f._ind11_evaluation.modalities)} />
            <Row>
              <Field name="evalPassingScore" label="Seuil de réussite (%)" type="number" min={0} max={100} defaultValue={v(f._ind11_evaluation.passingScore)} />
              <Field name="evalCertifyingExam" label="Examen certifiant" hint='ex: "QCM 30 questions"' defaultValue={v(f._ind11_evaluation.certifyingExam)} />
            </Row>
            <Field name="evalCertificateDelivered" label="Document délivré" defaultValue={v(f._ind11_evaluation.certificateDelivered)} />
            <TextArea name="evalFeedback" label="Modalités de feedback" rows={2} defaultValue={v(f._ind11_evaluation.feedback)} />
          </Section>

          <Section title="Tarifs & financement" indicator="Ind. 1">
            <Row cols={3}>
              <Field name="priceHT" label="Tarif HT" type="number" min={0} step="0.01" defaultValue={v(f._ind1_pricing.amountHT)} />
              <Field name="priceTaxRate" label="TVA (%)" type="number" min={0} max={100} defaultValue={v(f._ind1_pricing.taxRate)} />
              <Field name="priceTTC" label="Tarif TTC" type="number" min={0} step="0.01" defaultValue={v(f._ind1_pricing.amountTTC)} />
            </Row>
            <Row>
              <Field name="priceCurrency" label="Devise" defaultValue={v(f._ind1_pricing.currency)} />
              <Checkbox name="pricePerPerson" label="Par personne" defaultChecked={f._ind1_pricing.perPerson} />
            </Row>
            <TextArea name="priceDiscount" label="Politique de remise (optionnel)" rows={2} defaultValue={v(f._ind1_pricing.discountPolicy)} />
            <div className="flex flex-wrap gap-4">
              <Checkbox name="fundingOPCO" label="Finançable OPCO" defaultChecked={f._ind1_pricing.fundingOPCO} />
              <Checkbox name="fundingCPF" label="Finançable CPF" defaultChecked={f._ind1_pricing.fundingCPF} />
              <Checkbox name="fundingFNE" label="Finançable FNE-Formation" defaultChecked={f._ind1_pricing.fundingFNE} />
            </div>
            <TextArea name="fundingDetails" label="Détails financement" hint="OPCO Atlas, processus, délais…" rows={3} defaultValue={v(f._ind1_pricing.fundingDetails)} />
          </Section>

          <Section title="Accessibilité handicap" indicator="Ind. 26" description="Le référent global est défini dans /admin/site. Ici : adaptations spécifiques à cette formation.">
            <Row>
              <Field name="accessReferent" label="Référent ad hoc (si différent)" defaultValue={v(f._ind26_accessibility.referent)} />
              <Field name="accessReferentEmail" label="Email" type="email" defaultValue={v(f._ind26_accessibility.referentEmail)} />
            </Row>
            <TextArea name="accessAccommodations" label="Adaptations possibles" hint="un par ligne (ex: temps majoré, aide-lecteur)" rows={3} defaultValue={lines(f._ind26_accessibility.accommodations)} />
            <TextArea name="accessPartners" label="Partenaires mobilisés" hint="un par ligne" rows={2} defaultValue={lines(f._ind26_accessibility.partners)} />
          </Section>

          <Section title="Résultats publiés" indicator="Ind. 2">
            <Row cols={3}>
              <Field name="resSatisfaction" label="Taux satisfaction (%)" type="number" min={0} max={100} defaultValue={v(f._ind2_results.satisfactionRate)} />
              <Field name="resCompletion" label="Taux complétion (%)" type="number" min={0} max={100} defaultValue={v(f._ind2_results.completionRate)} />
              <Field name="resSuccess" label="Taux réussite (%)" type="number" min={0} max={100} defaultValue={v(f._ind2_results.successRate)} />
            </Row>
            <Row>
              <Field name="resLearners" label="Apprenants formés" type="number" min={0} defaultValue={v(f._ind2_results.learnersTrained)} />
              <Field name="resLastUpdate" label="Dernière mise à jour" type="date" defaultValue={v(f._ind2_results.lastUpdate)} />
            </Row>
            <Field name="resScope" label="Périmètre" hint="ex: Sur 12 derniers mois" defaultValue={v(f._ind2_results.scope)} />
          </Section>

          <Section title="Amélioration continue" indicator="Ind. 30 / Ind. 32">
            <TextArea name="improvementFeedback" label="Processus de recueil des feedbacks" rows={3} defaultValue={v(f._ind30_32_improvement.feedbackProcess)} />
            <Field name="improvementLastReview" label="Dernière revue qualité" type="date" defaultValue={v(f._ind30_32_improvement.lastReview)} />
          </Section>

          <Section title="Publication">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Tu peux publier à tout moment, même incomplète. Les champs Qualiopi non renseignés
              s&apos;affichent publiquement avec un badge <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-mono text-[11px]">À compléter</span>
              {" "}(visible mais non bloquant).
            </p>
            {s.missing > 0 && (
              <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900">
                ⚠ {s.missing} champ{s.missing > 1 ? "s" : ""} Qualiopi non renseigné{s.missing > 1 ? "s" : ""}
                {s.partial > 0 && ` (+ ${s.partial} partiel${s.partial > 1 ? "s" : ""})`} —
                publication possible mais ces zones apparaîtront en jaune sur la fiche publique.
              </div>
            )}
            <Checkbox name="published" label="Publier sur le site public" defaultChecked={f._meta.published} />
          </Section>

          <SaveBar previewHref={`/formation/${f.slug}`} updatedAt={f._meta.updatedAt} />
        </form>

        {/* SIDEBAR — checks */}
        <aside className="sticky top-6 space-y-4">
          <div className="bg-white rounded-lg border border-zinc-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Conformité Qualiopi
            </p>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-emerald-600">{s.ok} ok</span>
              <span className="text-amber-600">{s.partial} partiels</span>
              <span className="text-rose-600">{s.missing} manquants</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Reste à compléter
            </p>
            <CheckList checks={checks} hideOk />
          </div>
        </aside>
      </div>
    </div>
  );
}
