import lipidTargetGuide from "@/assets/lipid-target-guide.png.asset.json";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ClipboardCopy,
  ArrowLeft,
  Heart,
  ChevronDown,
  User,
  TestTube,
  FileText,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/* ────────────────────────────────────────────────────────────
   Streamlined ASCVD Risk Mini-App
   - Mobile-first, progressive disclosure
   - Single risk summary
   - No duplicate risk-factor sections
   ──────────────────────────────────────────────────────────── */

type Sex = "" | "male" | "female";
type CkdStage = "" | "3a" | "3b" | "4" | "5";
type Ethnicity =
  | ""
  | "south_asian"
  | "east_asian"
  | "white"
  | "black"
  | "hispanic"
  | "other";

interface Patient {
  name: string;
  age: string;
  sex: Sex;
  mrn: string;
  ethnicity: Ethnicity;
}

interface MajorRisk {
  ascvd: boolean;
  diabetes: boolean;
  htn: boolean;
  smoker: boolean;
  ckd: boolean;
  ckdStage: CkdStage;
  famHx: boolean;
}

interface Labs {
  ldl: string;
  hdl: string;
  tg: string;
  hba1c: string;
  apoB: string;
  lpaMg: string;
  lpaNmol: string;
}

interface Enhancers {
  metSyn: boolean;
  inflam: boolean;
  prematureMeno: boolean;
  preeclampsia: boolean;
  hsCrp: boolean;
  abi: boolean;
  subclinical: boolean;
}

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : NaN;
};

export default function AscvdEmr() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient>({
    name: "",
    age: "",
    sex: "",
    mrn: "",
    ethnicity: "",
  });

  const [risk, setRisk] = useState<MajorRisk>({
    ascvd: false,
    diabetes: false,
    htn: false,
    smoker: false,
    ckd: false,
    ckdStage: "",
    famHx: false,
  });

  const [labs, setLabs] = useState<Labs>({
    ldl: "",
    hdl: "",
    tg: "",
    hba1c: "",
    apoB: "",
    lpaMg: "",
    lpaNmol: "",
  });

  const [enh, setEnh] = useState<Enhancers>({
    metSyn: false,
    inflam: false,
    prematureMeno: false,
    preeclampsia: false,
    hsCrp: false,
    abi: false,
    subclinical: false,
  });

  const [advLipidsOpen, setAdvLipidsOpen] = useState(false);
  const [enhOpen, setEnhOpen] = useState(false);

  // ─── Automatic detection from labs + CKD stage ───
  const auto = useMemo(() => {
    const ldl = num(labs.ldl);
    const tg = num(labs.tg);
    const apoB = num(labs.apoB);
    const lpaMg = num(labs.lpaMg);
    const lpaNmol = num(labs.lpaNmol);
    const advancedCkd =
      risk.ckd && (risk.ckdStage === "3b" || risk.ckdStage === "4" || risk.ckdStage === "5");
    return {
      persistLdl: ldl >= 160,
      persistTg: tg >= 175,
      apoBHigh: apoB >= 130,
      lpaHigh: lpaMg >= 50 || lpaNmol >= 125,
      ckdEnhancer: advancedCkd,
    };
  }, [labs, risk.ckd, risk.ckdStage]);

  // ─── Pure scoring engine (also used for per-driver contribution) ───
  type ScoreInputs = {
    age: number; ldl: number; hdl: number;
    smoker: boolean; diabetes: boolean; htn: boolean;
    ckd: boolean; famHx: boolean; southAsian: boolean;
    lpaHigh: boolean; apoBHigh: boolean;
    persistLdl: boolean; persistTg: boolean;
    metSyn: boolean; inflam: boolean; hsCrp: boolean;
    subclinical: boolean; abi: boolean;
    prematureMeno: boolean; preeclampsia: boolean;
    ckdEnhancer: boolean;
  };

  const scoreRisk = (i: ScoreInputs): number => {
    let r = 0;
    r += (i.age - 30) * 0.6;
    r += (i.ldl - 100) * 0.12;
    r -= (i.hdl - 40) * 0.25;
    if (i.smoker) r += 10;
    if (i.diabetes) r += 12;
    if (i.htn) r += 6;
    if (i.ckd) r += 5;
    if (i.ckdEnhancer) r += 2;
    if (i.famHx) r += 3;
    if (i.southAsian) r += 2;
    if (i.lpaHigh) r += 3;
    if (i.apoBHigh) r += 2;
    if (i.persistLdl) r += 3;
    if (i.persistTg) r += 1.5;
    if (i.metSyn) r += 2;
    if (i.inflam) r += 1.5;
    if (i.hsCrp) r += 1.5;
    if (i.subclinical) r += 4;
    if (i.abi) r += 2;
    if (i.prematureMeno) r += 1;
    if (i.preeclampsia) r += 1;
    return Math.max(1, Math.min(r, 40));
  };

  const ageN = num(patient.age);
  const ldlN = num(labs.ldl);
  const hdlN = num(labs.hdl);
  const hasCore = !!ageN && !!ldlN && !!hdlN;
  const southAsian = patient.ethnicity === "south_asian";

  const baseInputs: ScoreInputs = {
    age: ageN, ldl: ldlN, hdl: hdlN,
    smoker: risk.smoker, diabetes: risk.diabetes, htn: risk.htn,
    ckd: risk.ckd, famHx: risk.famHx, southAsian,
    lpaHigh: auto.lpaHigh, apoBHigh: auto.apoBHigh,
    persistLdl: auto.persistLdl, persistTg: auto.persistTg,
    metSyn: enh.metSyn, inflam: enh.inflam, hsCrp: enh.hsCrp,
    subclinical: enh.subclinical, abi: enh.abi,
    prematureMeno: enh.prematureMeno, preeclampsia: enh.preeclampsia,
    ckdEnhancer: auto.ckdEnhancer,
  };

  const computed = useMemo(
    () => (hasCore ? scoreRisk(baseInputs) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasCore, JSON.stringify(baseInputs)]
  );

  const category = useMemo(() => {
    if (risk.ascvd) return "HIGH" as const;
    if (computed == null) return "—" as const;
    if (computed >= 20) return "HIGH" as const;
    if (computed >= 7.5) return "INTERMEDIATE" as const;
    if (computed >= 5) return "BORDERLINE" as const;
    return "LOW" as const;
  }, [computed, risk.ascvd]);

  // ─── LAI 2023 sub-classification (South Asians) ───
  // Activated only when ethnicity = South Asian. Stratifies into VHR / EHR-A/B/C
  // based on established ASCVD, polyvascular/extreme markers, and high-risk features.
  type LaiSub = "" | "VHR" | "EHR-A" | "EHR-B" | "EHR-C";
  const laiSubclass = useMemo<LaiSub>(() => {
    if (!southAsian || !hasCore) return "";
    const hrfCount = [
      risk.famHx,
      auto.ckdEnhancer,
      auto.apoBHigh,
      auto.lpaHigh,
      auto.persistLdl,
      enh.metSyn,
    ].filter(Boolean).length;
    const polyvascular = enh.subclinical && enh.abi;
    const extreme = auto.apoBHigh && auto.lpaHigh;

    if (risk.ascvd) {
      // Recurrent / refractory proxy: ASCVD + persistent LDL ≥160 despite enhancers
      if (auto.persistLdl) return "EHR-C";
      if (polyvascular || extreme) return "EHR-B";
      return "EHR-A";
    }
    if (risk.diabetes && hrfCount >= 2) return "EHR-A";
    if (ldlN >= 190) return "VHR";
    if (hrfCount >= 2) return "VHR";
    if (risk.diabetes && hrfCount >= 1) return "VHR";
    return "";
  }, [southAsian, hasCore, risk.ascvd, risk.diabetes, risk.famHx, auto, enh, ldlN]);

  const LAI_LABEL: Record<Exclude<LaiSub, "">, string> = {
    VHR: "Very High Risk",
    "EHR-A": "Extreme Risk — Category A",
    "EHR-B": "Extreme Risk — Category B (polyvascular / extreme markers)",
    "EHR-C": "Extreme Risk — Category C (refractory / recurrent)",
  };
  const LAI_LDL: Record<Exclude<LaiSub, "">, string> = {
    VHR: "<50 mg/dL",
    "EHR-A": "<50 mg/dL (optional ≤30)",
    "EHR-B": "≤30 mg/dL",
    "EHR-C": "10–15 mg/dL (consider further lowering)",
  };


  const ldlGoal =
    category === "HIGH"
      ? "<55 mg/dL (secondary prevention) or <70 mg/dL"
      : category === "INTERMEDIATE"
      ? "<70 mg/dL"
      : category === "BORDERLINE"
      ? "<100 mg/dL"
      : "<100 mg/dL";

  const therapy =
    category === "HIGH"
      ? "High-intensity statin ± ezetimibe ± PCSK9i"
      : category === "INTERMEDIATE"
      ? "Moderate–high-intensity statin"
      : category === "BORDERLINE"
      ? "Discuss statin; consider CAC for refinement"
      : "Lifestyle therapy";

  // ─── Per-driver impact (real-time, ranked) ───
  type Driver = { label: string; delta: number; auto?: boolean };
  const drivers = useMemo<Driver[]>(() => {
    if (!hasCore) return [];
    const base = scoreRisk(baseInputs);
    const list: Driver[] = [];

    const tryFlag = (label: string, key: keyof ScoreInputs, isAuto = false) => {
      if (!baseInputs[key]) return;
      const alt = { ...baseInputs, [key]: false } as ScoreInputs;
      const d = base - scoreRisk(alt);
      if (d !== 0) list.push({ label, delta: d, auto: isAuto });
    };

    // Continuous (numeric) drivers — counterfactual = reference value
    const ldlRef = { ...baseInputs, ldl: 100 };
    const ldlDelta = base - scoreRisk(ldlRef);
    if (Math.abs(ldlDelta) >= 0.1)
      list.push({ label: `LDL-C ${ldlN} mg/dL`, delta: ldlDelta });

    const hdlRef = { ...baseInputs, hdl: 50 };
    const hdlDelta = base - scoreRisk(hdlRef);
    if (Math.abs(hdlDelta) >= 0.1)
      list.push({ label: `HDL-C ${hdlN} mg/dL`, delta: hdlDelta });

    const ageRef = { ...baseInputs, age: 40 };
    const ageDelta = base - scoreRisk(ageRef);
    if (Math.abs(ageDelta) >= 0.1)
      list.push({ label: `Age ${ageN} y`, delta: ageDelta });

    // Major risk factors
    tryFlag("Diabetes", "diabetes");
    tryFlag("Current smoker", "smoker");
    tryFlag("Hypertension", "htn");
    tryFlag(
      `CKD${risk.ckdStage ? ` stage ${risk.ckdStage.toUpperCase()}` : ""}`,
      "ckd"
    );
    tryFlag("Family hx premature ASCVD", "famHx");
    tryFlag("South Asian ethnicity", "southAsian");

    // Auto-detected enhancers
    tryFlag("Lp(a) elevated", "lpaHigh", true);
    tryFlag("ApoB ≥130", "apoBHigh", true);
    tryFlag("Persistent ↑ LDL-C (≥160)", "persistLdl", true);
    tryFlag("Persistent ↑ TG (≥175)", "persistTg", true);
    tryFlag("Advanced CKD enhancer", "ckdEnhancer", true);

    // User enhancers
    tryFlag("Metabolic syndrome", "metSyn");
    tryFlag("Chronic inflammation", "inflam");
    tryFlag("hs-CRP >2", "hsCrp");
    tryFlag("Subclinical atherosclerosis", "subclinical");
    tryFlag("ABI <0.9", "abi");
    tryFlag("Premature menopause", "prematureMeno");
    tryFlag("Preeclampsia hx", "preeclampsia");

    return list.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCore, JSON.stringify(baseInputs), risk.ckdStage]);



  // ─── EMR Note ───
  const note = useMemo(() => {
    const factorList = drivers.length
      ? drivers
          .map(
            (d) =>
              `  • ${d.label}  (${d.delta >= 0 ? "+" : ""}${d.delta.toFixed(1)}%)${d.auto ? "  [auto]" : ""}`
          )
          .join("\n")
      : "  • None recorded";
    return [
      "ASCVD RISK ASSESSMENT",
      "",
      `Patient: ${patient.name || "—"}${patient.mrn ? ` (MRN ${patient.mrn})` : ""}`,
      `Age: ${patient.age || "—"}    Sex: ${patient.sex || "—"}    Ethnicity: ${patient.ethnicity || "—"}`,
      "",
      "Major Risk Factors / Drivers:",
      factorList,
      "",
      "Lipid Profile:",
      `  LDL-C: ${labs.ldl || "—"} mg/dL`,
      `  HDL-C: ${labs.hdl || "—"} mg/dL`,
      `  TG:    ${labs.tg || "—"} mg/dL`,
      `  HbA1c: ${labs.hba1c || "—"} %`,
      ...(labs.apoB ? [`  ApoB:  ${labs.apoB} mg/dL`] : []),
      ...(labs.lpaMg || labs.lpaNmol
        ? [`  Lp(a): ${labs.lpaMg || "—"} mg/dL / ${labs.lpaNmol || "—"} nmol/L`]
        : []),
      "",
      `10-Year ASCVD Risk: ${computed != null ? computed.toFixed(1) + "%" : "—"}  (${category})`,
      ...(southAsian && laiSubclass
        ? [`LAI 2023 Sub-classification: ${laiSubclass} — ${LAI_LABEL[laiSubclass]}`]
        : []),
      `LDL Goal: ${southAsian && laiSubclass ? LAI_LDL[laiSubclass] : ldlGoal}`,
      `Recommendation: ${therapy}`,
    ].join("\n");
  }, [patient, labs, computed, category, ldlGoal, therapy, drivers, southAsian, laiSubclass]);

  const setM = (k: keyof MajorRisk, v: boolean) =>
    setRisk((p) => ({ ...p, [k]: v }));
  const setL = (k: keyof Labs, v: string) =>
    setLabs((p) => ({ ...p, [k]: v }));
  const setE = (k: keyof Enhancers, v: boolean) =>
    setEnh((p) => ({ ...p, [k]: v }));

  const majorList: { key: keyof MajorRisk; label: string }[] = [
    { key: "ascvd", label: "Established ASCVD" },
    { key: "diabetes", label: "Diabetes" },
    { key: "htn", label: "Hypertension" },
    { key: "smoker", label: "Current Smoker" },
    { key: "ckd", label: "Chronic Kidney Disease" },
    { key: "famHx", label: "Family Hx Premature ASCVD" },
  ];

  const enhList: { key: keyof Enhancers; label: string }[] = [
    { key: "metSyn", label: "Metabolic Syndrome" },
    { key: "inflam", label: "Chronic Inflammatory Disease" },
    { key: "prematureMeno", label: "Premature Menopause" },
    { key: "preeclampsia", label: "History of Preeclampsia" },
    { key: "hsCrp", label: "hs-CRP >2 mg/L" },
    { key: "abi", label: "ABI <0.9" },
    { key: "subclinical", label: "Subclinical Atherosclerosis (CAC/Plaque)" },
  ];

  const riskTone =
    category === "HIGH"
      ? "danger"
      : category === "INTERMEDIATE"
      ? "warning"
      : category === "BORDERLINE"
      ? "warning"
      : category === "LOW"
      ? "accent"
      : "neutral";

  return (
    <div className="min-h-screen bg-background px-3 py-4 md:py-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            ASCVD Risk Assessment
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Streamlined primary-prevention pathway · EMR note ready
          </p>
        </div>

        {/* ── 1. Patient Information ── */}
        <SectionCard
          title="Patient Information"
          tone="cyan"
          icon={<User className="h-4 w-4" />}
          collapsible={false}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Patient Name
              </label>
              <Input
                value={patient.name}
                onChange={(e) =>
                  setPatient({ ...patient, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Age
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={patient.age}
                onChange={(e) =>
                  setPatient({ ...patient, age: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Sex
              </label>
              <Select
                value={patient.sex}
                onValueChange={(v) =>
                  setPatient({ ...patient, sex: v as Sex })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Ethnicity
              </label>
              <Select
                value={patient.ethnicity}
                onValueChange={(v) =>
                  setPatient({ ...patient, ethnicity: v as Ethnicity })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="south_asian">South Asian (LAI 2023 sub-classification)</SelectItem>
                  <SelectItem value="east_asian">East Asian</SelectItem>
                  <SelectItem value="white">White / Caucasian</SelectItem>
                  <SelectItem value="black">Black / African ancestry</SelectItem>
                  <SelectItem value="hispanic">Hispanic / Latino</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {southAsian && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  South Asian selected — risk auto-enhanced and LAI 2023 VHR/EHR sub-classification enabled.
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                MRN (optional)
              </label>
              <Input
                value={patient.mrn}
                onChange={(e) =>
                  setPatient({ ...patient, mrn: e.target.value })
                }
              />
            </div>

          </div>
        </SectionCard>

        {/* ── 2. Major Risk Factors ── */}
        <SectionCard
          title="Major Risk Factors"
          tone="purple"
          icon={<Heart className="h-4 w-4" />}
          collapsible={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {majorList.map(({ key, label }) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                  risk[key] as boolean
                    ? "bg-warning/10 ring-1 ring-warning/20"
                    : "hover:bg-muted/40"
                }`}
              >
                <Checkbox
                  checked={risk[key] as boolean}
                  onCheckedChange={(v) => setM(key, !!v)}
                />
                <span className="text-foreground">{label}</span>
              </label>
            ))}
          </div>
          {risk.ckd && (
            <div className="mt-3 ml-1">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                CKD Stage
              </label>
              <Select
                value={risk.ckdStage}
                onValueChange={(v) =>
                  setRisk((p) => ({ ...p, ckdStage: v as CkdStage }))
                }
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3a">Stage 3A (eGFR 45–59)</SelectItem>
                  <SelectItem value="3b">Stage 3B (eGFR 30–44)</SelectItem>
                  <SelectItem value="4">Stage 4 (eGFR 15–29)</SelectItem>
                  <SelectItem value="5">Stage 5 (eGFR &lt;15)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </SectionCard>

        {/* ── 3. Lipid & Metabolic Data ── */}
        <SectionCard
          title="Lipid & Metabolic Data"
          tone="warning"
          icon={<TestTube className="h-4 w-4" />}
          collapsible={false}
        >
          <div className="grid grid-cols-2 gap-3">
            {([
              ["ldl", "LDL-C (mg/dL)"],
              ["hdl", "HDL-C (mg/dL)"],
              ["tg", "Triglycerides (mg/dL)"],
              ["hba1c", "HbA1c (%)"],
            ] as const).map(([k, lbl]) => (
              <div key={k}>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  {lbl}
                </label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={labs[k]}
                  onChange={(e) => setL(k, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Auto-detected flags */}
          {(auto.persistLdl ||
            auto.persistTg ||
            auto.apoBHigh ||
            auto.lpaHigh ||
            auto.ckdEnhancer) && (
            <div className="mt-3 rounded-lg bg-warning/8 px-3 py-2 text-xs">
              <div className="mb-1 flex items-center gap-1.5 font-semibold text-warning">
                <Sparkles className="h-3.5 w-3.5" />
                Auto-detected risk enhancers (live)
              </div>
              <ul className="ml-1 space-y-0.5 text-foreground">
                {auto.persistLdl && <li>• Persistent primary hypercholesterolemia (LDL ≥160)</li>}
                {auto.persistTg && <li>• Persistent hypertriglyceridemia (TG ≥175)</li>}
                {auto.apoBHigh && <li>• ApoB ≥130 mg/dL</li>}
                {auto.lpaHigh && <li>• Lipoprotein(a) elevated (≥50 mg/dL or ≥125 nmol/L)</li>}
                {auto.ckdEnhancer && (
                  <li>• Advanced CKD enhancer (stage {risk.ckdStage.toUpperCase()})</li>
                )}
              </ul>
            </div>
          )}


          {/* Advanced lipids collapsible */}
          <Collapsible
            open={advLipidsOpen}
            onOpenChange={setAdvLipidsOpen}
            className="mt-3"
          >
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted/50 transition-colors">
                Advanced lipid markers
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    advLipidsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  ApoB (mg/dL)
                </label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={labs.apoB}
                  onChange={(e) => setL("apoB", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Lp(a) mg/dL
                </label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={labs.lpaMg}
                  onChange={(e) => setL("lpaMg", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Lp(a) nmol/L
                </label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={labs.lpaNmol}
                  onChange={(e) => setL("lpaNmol", e.target.value)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </SectionCard>

        {/* ── 4. Advanced Risk Enhancers ── */}
        <SectionCard
          title="Advanced Risk Enhancers"
          tone="indigo"
          icon={<Sparkles className="h-4 w-4" />}
          collapsible={false}
        >
          <Collapsible open={enhOpen} onOpenChange={setEnhOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted/50 transition-colors">
                {Object.values(enh).filter(Boolean).length > 0
                  ? `${Object.values(enh).filter(Boolean).length} selected`
                  : "Show enhancers"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    enhOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {enhList.map(({ key, label }) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                    enh[key]
                      ? "bg-warning/10 ring-1 ring-warning/20"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <Checkbox
                    checked={enh[key]}
                    onCheckedChange={(v) => setE(key, !!v)}
                  />
                  <span className="text-foreground">{label}</span>
                </label>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </SectionCard>

        {/* ── Risk Summary ── */}
        <SectionCard
          title="Risk Summary"
          tone={riskTone}
          icon={<TrendingUp className="h-4 w-4" />}
          collapsible={false}
          badge={
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                category === "HIGH"
                  ? "bg-danger/15 text-danger"
                  : category === "INTERMEDIATE" || category === "BORDERLINE"
                  ? "bg-warning/15 text-warning"
                  : category === "LOW"
                  ? "bg-accent/15 text-accent"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {computed != null ? `${computed.toFixed(1)}%` : "—"}
            </span>
          }
        >
          <div className="space-y-2 text-sm">
            <Row label="10-Year ASCVD Risk" value={computed != null ? `${computed.toFixed(1)}%` : "—"} />
            <Row label="Risk Category" value={category} />
            {southAsian && laiSubclass && (
              <div className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    LAI 2023 (South Asian)
                  </span>
                  <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[11px] font-bold text-danger">
                    {laiSubclass}
                  </span>
                </div>
                <p className="mt-1 text-xs text-foreground">{LAI_LABEL[laiSubclass]}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  LDL target: {LAI_LDL[laiSubclass]}
                </p>
              </div>
            )}
            <Row label="LDL Goal" value={southAsian && laiSubclass ? LAI_LDL[laiSubclass] : ldlGoal} />
            <Row label="Recommended Therapy" value={therapy} />
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-muted-foreground">Key Drivers</div>
                <div className="text-[10px] text-muted-foreground">Δ vs. reference patient</div>
              </div>
              {drivers.length === 0 ? (
                <div className="text-muted-foreground text-sm mt-1">
                  Enter age, LDL, HDL and risk factors to see contributions.
                </div>
              ) : (
                <ul className="mt-1.5 space-y-1">
                  {drivers.map((d) => {
                    const pos = d.delta >= 0;
                    const mag = Math.min(100, (Math.abs(d.delta) / Math.max(1, Math.abs(drivers[0].delta))) * 100);
                    return (
                      <li
                        key={d.label}
                        className="relative overflow-hidden rounded-md border border-border/60 bg-muted/30 px-2.5 py-1.5"
                      >
                        <div
                          aria-hidden
                          className={`absolute inset-y-0 left-0 ${pos ? "bg-danger/10" : "bg-accent/15"}`}
                          style={{ width: `${mag}%` }}
                        />
                        <div className="relative flex items-center justify-between gap-2 text-xs">
                          <span className="flex items-center gap-1.5 text-foreground">
                            {d.label}
                            {d.auto && (
                              <span className="rounded bg-warning/15 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-warning">
                                auto
                              </span>
                            )}
                          </span>
                          <span
                            className={`font-mono font-semibold ${
                              pos ? "text-danger" : "text-accent"
                            }`}
                          >
                            {pos ? "+" : ""}
                            {d.delta.toFixed(1)}%
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Lipid Targets Reference */}
            <div className="mt-3">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                Lipid Targets by Risk Category
              </div>
              <img
                src={lipidTargetGuide.url}
                alt="Lipid targets guide by risk category — LDL-C and ApoB goals"
                className="w-full rounded-lg border border-border/60"
                loading="lazy"
              />
            </div>
          </div>
        </SectionCard>

        {/* ── EMR Note ── */}
        <SectionCard
          title="EMR Note"
          tone="emerald"
          icon={<FileText className="h-4 w-4" />}
          collapsible={false}
        >
          <textarea
            value={note}
            readOnly
            className="w-full h-56 rounded-lg border border-input bg-background p-3 text-xs text-foreground font-mono resize-none"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(note);
              toast.success("Note copied to clipboard");
            }}
            className="w-full mt-3 gap-2"
          >
            <ClipboardCopy className="h-4 w-4" />
            Copy to EMR
          </Button>
        </SectionCard>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}
