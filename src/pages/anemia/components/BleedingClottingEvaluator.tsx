import { useMemo, useState } from "react";
import {
  Activity,
  Droplets,
  AlertTriangle,
  ClipboardList,
  FlaskConical,
  Stethoscope,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Pill,
  HeartPulse,
  Info,
} from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Mode = "" | "bleeding" | "clotting";

/* ============================ BLEEDING WIZARD ============================ */

type Phenotype = "" | "mucocutaneous" | "deep" | "mixed";
type PltState = "" | "low" | "normal";
type PtAptt = "" | "normal" | "prolonged";
type Schisto = "" | "yes" | "no";
type MixCorrect = "" | "corrects" | "no";

type Recommendation = {
  diagnosis: string;
  tone: "danger" | "warning" | "primary" | "neutral";
  nextTests: string[];
  confirmatory: string[];
};

function buildBleedingRecommendation(s: {
  phenotype: Phenotype;
  plt: PltState;
  pt: PtAptt;
  aptt: PtAptt;
  schisto: Schisto;
  fibrinogenLow: boolean;
  mix: MixCorrect;
}): Recommendation | null {
  const { phenotype, plt, pt, aptt, schisto, fibrinogenLow, mix } = s;

  if (!phenotype || !plt) return null;

  // Low platelet branches
  if (plt === "low") {
    if (!schisto) return null;
    if (schisto === "yes") {
      if (pt === "prolonged" || aptt === "prolonged" || fibrinogenLow) {
        return {
          diagnosis: "DIC — schistocytes + thrombocytopenia + coagulopathy",
          tone: "danger",
          nextTests: ["D-dimer", "Fibrinogen trend", "PT/aPTT serial", "Treat underlying trigger (sepsis, malignancy, OB cause)"],
          confirmatory: ["ISTH DIC score ≥5 = overt DIC", "Falling fibrinogen + rising D-dimer"],
        };
      }
      return {
        diagnosis: "TTP / HUS likely — MAHA + thrombocytopenia, normal coags",
        tone: "danger",
        nextTests: ["LDH", "Haptoglobin", "Indirect bilirubin", "Creatinine", "Reticulocyte count", "Direct Coombs (negative expected)"],
        confirmatory: ["ADAMTS13 activity (<10% = TTP)", "Shiga toxin / stool culture if HUS suspected", "PLASMIC score for TTP probability"],
      };
    }
    return {
      diagnosis: "Isolated thrombocytopenia — ITP, drug-induced, marrow failure, hypersplenism",
      tone: "warning",
      nextTests: ["Medication review (heparin, quinine, sulfa, vancomycin)", "HIV, HCV serology", "H. pylori", "ANA", "TSH"],
      confirmatory: ["Bone marrow biopsy if atypical / >60y / pancytopenia", "HIT 4T score + anti-PF4 if heparin exposure", "Spleen imaging if hypersplenism suspected"],
    };
  }

  // Normal platelets
  if (plt === "normal") {
    if (!pt || !aptt) return null;

    if (pt === "normal" && aptt === "normal") {
      return {
        diagnosis: "Normal screen with bleeding — vWD, platelet function disorder, factor XIII, vascular",
        tone: "warning",
        nextTests: ["vWF antigen", "vWF activity (Ristocetin cofactor)", "Factor VIII activity", "PFA-100 / closure times"],
        confirmatory: ["vWF multimer analysis (type 2 subtyping)", "Light transmission aggregometry", "Factor XIII (urea clot solubility) for delayed bleeding", "Skin biopsy if EDS / vascular cause"],
      };
    }

    if (pt === "prolonged" && aptt === "normal") {
      const base: Recommendation = {
        diagnosis: "Isolated ↑PT — vit K deficiency, warfarin, factor VII deficiency, early liver disease",
        tone: "primary",
        nextTests: ["Medication review (warfarin, antibiotics)", "LFTs, albumin", "Vitamin K trial (10 mg IV/PO)"],
        confirmatory: ["Factor VII assay if PT remains prolonged after vit K", "Mixing study if not done"],
      };
      if (mix === "no") {
        base.diagnosis = "Isolated ↑PT, mixing does NOT correct — inhibitor (rare: anti-VII)";
        base.tone = "danger";
        base.confirmatory = ["Factor VII inhibitor titer", "Hematology referral"];
      }
      return base;
    }

    if (pt === "normal" && aptt === "prolonged") {
      const base: Recommendation = {
        diagnosis: "Isolated ↑aPTT — heparin, lupus anticoagulant, factor VIII/IX/XI deficiency, vWD",
        tone: "primary",
        nextTests: ["Confirm no heparin exposure", "Thrombin time", "vWF panel + factor VIII", "Factor IX, XI assays"],
        confirmatory: ["Mixing study", "Lupus anticoagulant (DRVVT)", "Specific factor assays after mixing"],
      };
      if (mix === "corrects") {
        base.diagnosis = "↑aPTT corrects on mixing → factor deficiency (VIII / IX / XI / XII or vWD)";
        base.tone = "primary";
        base.confirmatory = ["Factor VIII, IX, XI activity", "vWF Ag / activity / multimers", "Family history of hemophilia"];
      } else if (mix === "no") {
        base.diagnosis = "↑aPTT does NOT correct → inhibitor (lupus anticoagulant, acquired hemophilia, heparin)";
        base.tone = "danger";
        base.confirmatory = ["Lupus anticoagulant panel (DRVVT, dilute aPTT)", "Anti-cardiolipin, anti-β2 GPI", "Factor VIII inhibitor (Bethesda) if bleeding"];
      }
      return base;
    }

    if (pt === "prolonged" && aptt === "prolonged") {
      const base: Recommendation = {
        diagnosis: "Both ↑PT and ↑aPTT — severe factor def, DIC, advanced liver disease, massive transfusion, severe vit K deficiency",
        tone: "danger",
        nextTests: ["Fibrinogen", "D-dimer", "Platelets + smear", "LFTs, albumin", "Vitamin K trial"],
        confirmatory: ["Mixing study", "Common pathway factor assays (II, V, X)", "DIC workup if schistocytes / fibrinogen drop"],
      };
      if (mix === "corrects") {
        base.diagnosis = "Both prolonged, corrects on mixing → multi-factor deficiency (liver, vit K, dilution)";
        base.confirmatory = ["Factor V (low in liver, normal in vit K def)", "Factor VII (low first in vit K def)"];
      } else if (mix === "no") {
        base.diagnosis = "Both prolonged, does NOT correct → strong inhibitor or anticoagulant";
        base.confirmatory = ["Lupus anticoagulant", "Thrombin / reptilase time for heparin / dabigatran", "DOAC drug levels"];
      }
      return base;
    }
  }

  return null;
}

function BleedingWizard({ onBack }: { onBack: () => void }) {
  const [phenotype, setPhenotype] = useState<Phenotype>("");
  const [plt, setPlt] = useState<PltState>("");
  const [pt, setPt] = useState<PtAptt>("");
  const [aptt, setAptt] = useState<PtAptt>("");
  const [schisto, setSchisto] = useState<Schisto>("");
  const [fibrinogenLow, setFibrinogenLow] = useState(false);
  const [mix, setMix] = useState<MixCorrect>("");

  const reset = () => {
    setPhenotype(""); setPlt(""); setPt(""); setAptt(""); setSchisto(""); setFibrinogenLow(false); setMix("");
  };

  const rec = useMemo(
    () => buildBleedingRecommendation({ phenotype, plt, pt, aptt, schisto, fibrinogenLow, mix }),
    [phenotype, plt, pt, aptt, schisto, fibrinogenLow, mix],
  );

  const showMix = plt === "normal" && (pt === "prolonged" || aptt === "prolonged");
  const showSchisto = plt === "low";
  const showFibrinogen = plt === "low" && schisto === "yes";

  return (
    <div className="space-y-4">
      <WizardHeader title="Bleeding workup" onBack={onBack} onReset={reset} />

      <Step n={1} title="Clinical phenotype" complete={!!phenotype} icon={<Stethoscope className="h-4 w-4" />}>
        <ChoiceGrid
          value={phenotype}
          onChange={(v) => setPhenotype(v as Phenotype)}
          options={[
            { value: "mucocutaneous", label: "Mucocutaneous", hint: "Petechiae, epistaxis, gum bleeding, menorrhagia, immediate post-op — suggests platelet / vWF" },
            { value: "deep", label: "Deep tissue", hint: "Hemarthrosis, muscle hematomas, delayed post-op — suggests coagulation factor" },
            { value: "mixed", label: "Mixed / unclear", hint: "Features of both or unable to characterize" },
          ]}
        />
      </Step>

      {phenotype && (
        <Step n={2} title="Platelet count" complete={!!plt} icon={<FlaskConical className="h-4 w-4" />}>
          <ChoiceGrid
            value={plt}
            onChange={(v) => { setPlt(v as PltState); setPt(""); setAptt(""); setSchisto(""); setFibrinogenLow(false); setMix(""); }}
            options={[
              { value: "low", label: "Low (< 150 K)" },
              { value: "normal", label: "Normal" },
            ]}
          />
        </Step>
      )}

      {showSchisto && (
        <Step n={3} title="Peripheral smear — schistocytes" complete={!!schisto} icon={<FlaskConical className="h-4 w-4" />}>
          <ChoiceGrid
            value={schisto}
            onChange={(v) => setSchisto(v as Schisto)}
            options={[
              { value: "yes", label: "Schistocytes present" },
              { value: "no", label: "No schistocytes" },
            ]}
          />
          {showFibrinogen && (
            <label className="mt-3 flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm cursor-pointer">
              <input type="checkbox" checked={fibrinogenLow} onChange={(e) => setFibrinogenLow(e.target.checked)} />
              <span>Fibrinogen below normal</span>
            </label>
          )}
          {schisto === "yes" && (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="PT">
                <Select value={pt} onChange={(v) => setPt(v as PtAptt)} options={[
                  { value: "", label: "Select…" },
                  { value: "normal", label: "Normal" },
                  { value: "prolonged", label: "Prolonged" },
                ]} />
              </Field>
              <Field label="aPTT">
                <Select value={aptt} onChange={(v) => setAptt(v as PtAptt)} options={[
                  { value: "", label: "Select…" },
                  { value: "normal", label: "Normal" },
                  { value: "prolonged", label: "Prolonged" },
                ]} />
              </Field>
            </div>
          )}
        </Step>
      )}

      {plt === "normal" && (
        <Step n={3} title="Coagulation screen — PT & aPTT" complete={!!pt && !!aptt} icon={<FlaskConical className="h-4 w-4" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="PT / INR">
              <Select value={pt} onChange={(v) => { setPt(v as PtAptt); setMix(""); }} options={[
                { value: "", label: "Select…" },
                { value: "normal", label: "Normal" },
                { value: "prolonged", label: "Prolonged" },
              ]} />
            </Field>
            <Field label="aPTT">
              <Select value={aptt} onChange={(v) => { setAptt(v as PtAptt); setMix(""); }} options={[
                { value: "", label: "Select…" },
                { value: "normal", label: "Normal" },
                { value: "prolonged", label: "Prolonged" },
              ]} />
            </Field>
          </div>
        </Step>
      )}

      {showMix && (
        <Step n={4} title="Mixing study (1:1 with normal plasma)" complete={!!mix} icon={<FlaskConical className="h-4 w-4" />}>
          <ChoiceGrid
            value={mix}
            onChange={(v) => setMix(v as MixCorrect)}
            options={[
              { value: "corrects", label: "Corrects → factor deficiency" },
              { value: "no", label: "Does NOT correct → inhibitor / anticoagulant" },
            ]}
          />
          <p className="text-xs text-muted-foreground mt-2">Optional — leave blank if not yet done; differential will be broader.</p>
        </Step>
      )}

      {rec && <RecommendationCard rec={rec} />}
    </div>
  );
}

/* ============================ CLOTTING WIZARD ============================ */

type Provoked = "" | "provoked" | "unprovoked";
type Site = "" | "typical" | "unusual";
type Acuity = "" | "acute_on_anticoag" | "off_anticoag";

function buildClottingRecommendation(s: {
  provoked: Provoked;
  site: Site;
  young: boolean;
  recurrent: boolean;
  family: boolean;
  pregLoss: boolean;
  splanchnic: boolean;
  acuity: Acuity;
}): Recommendation | null {
  const { provoked, site, young, recurrent, family, pregLoss, splanchnic, acuity } = s;

  if (!provoked || !site || !acuity) return null;

  const score =
    (young ? 2 : 0) + (recurrent ? 2 : 0) + (family ? 2 : 0) + (pregLoss ? 2 : 0) + (site === "unusual" ? 2 : 0);
  const indicated = provoked === "unprovoked" || score >= 2;

  if (!indicated) {
    return {
      diagnosis: "Thrombophilia workup NOT routinely indicated — provoked event with low risk profile",
      tone: "neutral",
      nextTests: ["Standard anticoagulation per VTE guidelines", "Treat / remove provoking factor", "Reassess at end of treatment course"],
      confirmatory: ["No thrombophilia panel needed unless risk profile changes"],
    };
  }

  const next: string[] = [
    "CBC, PT/INR, aPTT, fibrinogen",
    "Creatinine, LFTs",
    "Age-appropriate cancer screening",
  ];
  const confirmatory: string[] = [];

  // APS — always check in unprovoked/unusual
  confirmatory.push(
    "Lupus anticoagulant (DRVVT + confirmatory)",
    "Anti-cardiolipin IgG/IgM",
    "Anti-β2 glycoprotein I IgG/IgM",
  );

  // Inherited — depending on acuity
  if (acuity === "acute_on_anticoag") {
    next.push("Defer protein C, protein S, antithrombin until off anticoagulation (2 weeks off VKA / DOAC)");
    confirmatory.push(
      "Factor V Leiden (genetic — reliable on anticoag)",
      "Prothrombin G20210A (genetic — reliable on anticoag)",
    );
  } else {
    confirmatory.push(
      "Factor V Leiden / APC resistance",
      "Prothrombin G20210A",
      "Antithrombin activity",
      "Protein C activity",
      "Protein S free antigen + activity",
    );
  }

  if (splanchnic) {
    next.push("JAK2 V617F — myeloproliferative neoplasm screen");
    next.push("PNH flow cytometry (CD55/CD59) if cytopenias");
  }

  if (pregLoss) {
    confirmatory.push("APS panel repeated at ≥12 weeks for definite APS diagnosis");
  }

  return {
    diagnosis: indicated
      ? `Thrombophilia workup indicated (risk score ${score}${provoked === "unprovoked" ? ", unprovoked" : ""})`
      : "Selective workup",
    tone: "primary",
    nextTests: next,
    confirmatory,
  };
}

function ClottingWizard({ onBack }: { onBack: () => void }) {
  const [provoked, setProvoked] = useState<Provoked>("");
  const [site, setSite] = useState<Site>("");
  const [young, setYoung] = useState(false);
  const [recurrent, setRecurrent] = useState(false);
  const [family, setFamily] = useState(false);
  const [pregLoss, setPregLoss] = useState(false);
  const [splanchnic, setSplanchnic] = useState(false);
  const [acuity, setAcuity] = useState<Acuity>("");

  const reset = () => {
    setProvoked(""); setSite(""); setYoung(false); setRecurrent(false);
    setFamily(false); setPregLoss(false); setSplanchnic(false); setAcuity("");
  };

  const rec = useMemo(
    () => buildClottingRecommendation({ provoked, site, young, recurrent, family, pregLoss, splanchnic, acuity }),
    [provoked, site, young, recurrent, family, pregLoss, splanchnic, acuity],
  );

  return (
    <div className="space-y-4">
      <WizardHeader title="Clotting / thrombophilia workup" onBack={onBack} onReset={reset} />

      <Step n={1} title="Was the thrombosis provoked?" complete={!!provoked} icon={<Stethoscope className="h-4 w-4" />}>
        <ChoiceGrid
          value={provoked}
          onChange={(v) => setProvoked(v as Provoked)}
          options={[
            { value: "provoked", label: "Provoked", hint: "Surgery, trauma, immobilization, hospitalization, estrogen, pregnancy, active cancer" },
            { value: "unprovoked", label: "Unprovoked", hint: "No identifiable major trigger" },
          ]}
        />
      </Step>

      {provoked && (
        <Step n={2} title="Site of thrombosis" complete={!!site} icon={<FlaskConical className="h-4 w-4" />}>
          <ChoiceGrid
            value={site}
            onChange={(v) => { setSite(v as Site); if (v !== "unusual") setSplanchnic(false); }}
            options={[
              { value: "typical", label: "Typical (DVT lower limb, PE)" },
              { value: "unusual", label: "Unusual (splanchnic, CVT, upper limb, retinal)" },
            ]}
          />
          {site === "unusual" && (
            <label className="mt-3 flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm cursor-pointer">
              <input type="checkbox" checked={splanchnic} onChange={(e) => setSplanchnic(e.target.checked)} />
              <span>Splanchnic or cerebral venous thrombosis (add JAK2 / PNH screen)</span>
            </label>
          )}
        </Step>
      )}

      {site && (
        <Step n={3} title="Risk modifiers" complete icon={<ClipboardList className="h-4 w-4" />}>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <Check label="Age < 50 at first VTE (+2)" checked={young} onChange={setYoung} />
            <Check label="Recurrent VTE (+2)" checked={recurrent} onChange={setRecurrent} />
            <Check label="Family history of VTE (+2)" checked={family} onChange={setFamily} />
            <Check label="Recurrent pregnancy loss (+2)" checked={pregLoss} onChange={setPregLoss} />
          </div>
        </Step>
      )}

      {site && (
        <Step n={4} title="Current anticoagulation status" complete={!!acuity} icon={<FlaskConical className="h-4 w-4" />}>
          <ChoiceGrid
            value={acuity}
            onChange={(v) => setAcuity(v as Acuity)}
            options={[
              { value: "acute_on_anticoag", label: "Acute event / on anticoagulation", hint: "Defer protein C, S, antithrombin, lupus anticoagulant where possible" },
              { value: "off_anticoag", label: "Off anticoagulation ≥ 2 weeks", hint: "Full panel reliable" },
            ]}
          />
        </Step>
      )}

      {rec && <RecommendationCard rec={rec} />}

      <SectionCard title="Inherited thrombophilia reference" icon={<FlaskConical className="h-4 w-4" />} tone="indigo" defaultOpen={false}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Relative VTE risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>Factor V Leiden (het)</TableCell><TableCell>4–7×</TableCell></TableRow>
            <TableRow><TableCell>Prothrombin G20210A</TableCell><TableCell>2–3×</TableCell></TableRow>
            <TableRow><TableCell>Antithrombin deficiency</TableCell><TableCell>10–20×</TableCell></TableRow>
            <TableRow><TableCell>Protein C deficiency</TableCell><TableCell>5–10×</TableCell></TableRow>
            <TableRow><TableCell>Protein S deficiency</TableCell><TableCell>5–10×</TableCell></TableRow>
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}

/* ============================== SHARED UI =============================== */

function WizardHeader({ title, onBack, onReset }: { title: string; onBack: () => void; onReset: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          ← Change pathway
        </button>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  complete,
  icon,
  children,
}: {
  n: number;
  title: string;
  complete: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <SectionCard
      title={`Step ${n} — ${title}`}
      icon={complete ? <CheckCircle2 className="h-4 w-4" /> : icon}
      tone={complete ? "emerald" : "primary"}
      defaultOpen
    >
      {children}
    </SectionCard>
  );
}

function ChoiceGrid({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; hint?: string }[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`text-left rounded-md border px-3 py-2.5 transition-colors ${
              selected
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card hover:bg-muted/30 text-foreground"
            }`}
          >
            <div className="text-sm font-semibold">{o.label}</div>
            {o.hint && <div className="text-xs text-muted-foreground mt-0.5">{o.hint}</div>}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function toneClass(tone: Recommendation["tone"]) {
  switch (tone) {
    case "danger": return "border-destructive/40 bg-destructive/5 text-destructive";
    case "warning": return "border-amber-500/40 bg-warning/100/5 text-amber-700 dark:text-warning";
    case "primary": return "border-primary/40 bg-primary/5 text-primary";
    default: return "border-border bg-card text-foreground";
  }
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <SectionCard
      title="Recommended next tests"
      icon={<ArrowRight className="h-4 w-4" />}
      tone="warning"
      defaultOpen
    >
      <div className={`rounded-md border px-3 py-2 mb-3 text-sm font-semibold ${toneClass(rec.tone)}`}>
        {rec.diagnosis}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Next tests</h4>
          <ul className="space-y-1.5 text-sm">
            {rec.nextTests.map((t, i) => (
              <li key={i} className="flex gap-2"><ArrowRight className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" /><span>{t}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Confirmatory branch</h4>
          <ul className="space-y-1.5 text-sm">
            {rec.confirmatory.map((t, i) => (
              <li key={i} className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-accent flex-shrink-0" /><span>{t}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}

/* ================================ ROOT ================================== */

export default function BleedingClottingEvaluator() {
  const [mode, setMode] = useState<Mode>("");
  const [showDicReference, setShowDicReference] = useState(false);

  if (mode === "") {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-border bg-card p-4">
          <h2 className="font-display text-base font-bold text-foreground mb-1">Bleeding & clotting evaluator</h2>
          <p className="text-sm text-muted-foreground">Choose a pathway to start the step-by-step workup.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setMode("bleeding")}
            className="text-left rounded-lg border border-border bg-card hover:bg-muted/30 p-4 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Bleeding phenotype</span>
            </div>
            <p className="text-xs text-muted-foreground">Patient is bleeding — work through phenotype → CBC/PT/aPTT → mixing study → confirmatory tests.</p>
          </button>
          <button
            onClick={() => setMode("clotting")}
            className="text-left rounded-lg border border-border bg-card hover:bg-muted/30 p-4 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-5 w-5 text-accent" />
              <span className="font-semibold text-foreground">Clotting / thrombophilia</span>
            </div>
            <p className="text-xs text-muted-foreground">Patient has thrombosis — work through provoked vs unprovoked → site → risk score → targeted panel.</p>
          </button>
        </div>

        {/* DIC Reference Card */}
        <button
          onClick={() => setShowDicReference(!showDicReference)}
          className="w-full flex items-center justify-between rounded-lg border border-teal-500/30 bg-teal-500/5 p-4 hover:bg-teal-500/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-400" />
            <span className="font-semibold text-foreground">DIC (Disseminated Intravascular Coagulation) — Reference</span>
          </div>
          {showDicReference ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {showDicReference && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-5 text-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Triggers */}
              <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-3">
                <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">Triggers</h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-1.5">🦠 <span>Sepsis — most common</span></li>
                  <li className="flex items-start gap-1.5">🦴 <span>Trauma / major surgery</span></li>
                  <li className="flex items-start gap-1.5">🤰 <span>Amniotic fluid embolism (AFE)</span></li>
                  <li className="flex items-start gap-1.5">🧬 <span>AML (esp. acute promyelocytic — M3)</span></li>
                  <li className="flex items-start gap-1.5">🩸 <span>Massive transfusion</span></li>
                </ul>
              </div>

              {/* Key Feature */}
              <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-3">
                <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">Key Feature</h4>
                <p className="text-xs text-foreground font-medium">Systemic Clotting → Simultaneous clotting & bleeding → Systemic Bleeding 🩸</p>
                <p className="text-xs text-muted-foreground mt-1">Pathophysiology: massive thrombin generation → consumption of platelets & clotting factors → microthrombi formation + concurrent fibrinolysis → D-dimer rise.</p>
              </div>

              {/* Labs */}
              <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-3">
                <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">Labs — DIC Profile</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span>🔻 Platelets</span><span className="text-destructive font-medium">Decreased</span></div>
                  <div className="flex justify-between"><span>🔻 Fibrinogen</span><span className="text-destructive font-medium">Decreased</span></div>
                  <div className="flex justify-between"><span>🔺 PT</span><span className="text-amber-400 font-medium">Increased</span></div>
                  <div className="flex justify-between"><span>🔺 PTT</span><span className="text-amber-400 font-medium">Increased</span></div>
                  <div className="flex justify-between"><span>🔺 D-dimer</span><span className="text-rose-400 font-medium">Increased</span></div>
                  <div className="flex justify-between"><span>🔬 Schistocytes</span><span className="text-rose-400 font-medium">Present</span></div>
                </div>
              </div>
            </div>

            {/* Pathophysiology flow */}
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <h4 className="text-xs font-semibold text-foreground mb-3">Mechanism of DIC</h4>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-destructive/10 border border-destructive/30 px-2 py-1 text-destructive font-medium">Trigger (sepsis, trauma, AFE, AML)</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-1 text-amber-400 font-medium">Massive clotting cascade activation</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="rounded-md bg-purple-500/10 border border-purple-500/30 px-2 py-1 text-purple-300 font-medium">Consumption of platelets & clotting factors</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="rounded-md bg-rose-500/10 border border-rose-500/30 px-2 py-1 text-rose-300 font-medium">Microthrombi formation</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="rounded-md bg-sky-500/10 border border-sky-500/30 px-2 py-1 text-sky-300 font-medium">Concurrent fibrinolysis → D-dimer</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                <span>Anti-PF4-heparin complexes → paradoxical thrombosis in HIT (separate mechanism).</span>
              </div>
            </div>

            {/* Management */}
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                <h5 className="text-xs font-bold text-emerald-400 mb-1">1. Treat cause</h5>
                <p className="text-[10px] text-muted-foreground">Antibiotics for sepsis, surgical control, treat malignancy, deliver fetus in AFE</p>
              </div>
              <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-3">
                <h5 className="text-xs font-bold text-sky-300 mb-1">2. FFP</h5>
                <p className="text-[10px] text-muted-foreground">Replaces clotting factors (10–15 mL/kg). Start if PT/PTT prolonged + active bleeding.</p>
              </div>
              <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
                <h5 className="text-xs font-bold text-purple-300 mb-1">3. Cryoprecipitate</h5>
                <p className="text-[10px] text-muted-foreground">For fibrinogen replacement if &lt;100–150 mg/dL with bleeding. 10–15 pooled units.</p>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                <h5 className="text-xs font-bold text-amber-300 mb-1">4. Platelets</h5>
                <p className="text-[10px] text-muted-foreground">Transfuse if &lt;50,000/μL with active bleeding or &lt;20,000/μL with no bleeding.</p>
              </div>
            </div>

            {/* ISTH DIC Score */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <h4 className="text-xs font-semibold text-amber-300 mb-2">ISTH DIC Score</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-muted rounded-md px-2 py-1.5">
                  <span className="block text-muted-foreground">Platelets</span>
                  <span className="font-medium">&gt;100K=0 / 50–100K=1 / &lt;50K=2</span>
                </div>
                <div className="bg-muted rounded-md px-2 py-1.5">
                  <span className="block text-muted-foreground">D-dimer</span>
                  <span className="font-medium">Mod=2 / Strong=3</span>
                </div>
                <div className="bg-muted rounded-md px-2 py-1.5">
                  <span className="block text-muted-foreground">PT prolonged</span>
                  <span className="font-medium">&lt;3s=0 / 3–6s=1 / &gt;6s=2</span>
                </div>
                <div className="bg-muted rounded-md px-2 py-1.5">
                  <span className="block text-muted-foreground">Fibrinogen</span>
                  <span className="font-medium">&gt;1g=0 / &lt;1g=1</span>
                </div>
              </div>
              <p className="text-xs text-amber-400 mt-2 font-medium">Score ≥5 → overt DIC (ISTH diagnostic)</p>
            </div>

            {/* Pearl */}
            <div className="rounded-lg border border-amber-500/30 bg-warning/5 px-3 py-2 flex items-start gap-2">
              <HeartPulse className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-amber-300">DIC Pearls</span>
                <p className="text-xs text-muted-foreground mt-0.5">Catheter & IV site bleeding often suggests DIC. Exception: dilutional thrombocytopenia from massive transfusion. DIC co-presence with TTP is rare — rule out TTP first if schistocytes + neuro/renal signs without coagulopathy.</p>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground">
              Sources: ISTH DIC Scoring (Taylor et al. 2001, Thromb Haemost); British Committee for Standards in Haematology DIC Guidelines (2009); UpToDate 2024.
            </p>
          </div>
        )}

        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-warning/100/5 px-3 py-2 text-xs text-amber-700 dark:text-warning">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <span>Decision-support only. Confirm all recommendations with current guidelines and clinical context.</span>
        </div>
      </div>
    );
  }

  return mode === "bleeding"
    ? <BleedingWizard onBack={() => setMode("")} />
    : <ClottingWizard onBack={() => setMode("")} />;
}
