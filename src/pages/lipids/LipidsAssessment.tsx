import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ClipboardCopy,
  TrendingUp,
  User,
  Heart,
  TestTube,
  AlertTriangle,
  ScanLine,
  Target,
  ShieldQuestion,
  Dna,
} from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import { RiskFactorChip } from "@/components/ui/risk-factor-chip";
import { toast } from "sonner";
import {
  ASCVD_ESTABLISHED,
  SUBCLINICAL_ITEMS,
  HIGH_CAC_ITEMS,
  CKD_ITEMS,
  FHX_ITEMS,
  EXTREME_ELEVATION_ITEMS,
  TOD_MICROVASCULAR,
  TOD_MACROVASCULAR,
  TOD_ALL,
  countCheckedItems,
  RISK_ENHANCERS_2019,
} from "@/lib/clinicalConstants";

// ─── Sub-checklist renderer ───
function SubChecklist({
  items,
  checked,
  toggle,
  title,
  defaultOpen = false,
}: {
  items: { id: string; label: string; qualifier?: string }[];
  checked: Record<string, boolean>;
  toggle: (id: string) => void;
  title: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const checkedCount = items.filter((item) => checked[item.id]).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="ml-8 mt-2 mb-1">
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
          <span className="text-xs font-semibold text-muted-foreground">
            {title} {checkedCount > 0 && `(${checkedCount}/${items.length})`}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1.5 rounded-b-lg border-x border-b border-border bg-muted/30 p-3 pt-0 mt-0">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-1.5 transition-colors text-sm ${
              checked[item.id]
                ? "bg-warning/10 ring-1 ring-warning/15"
                : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={!!checked[item.id]}
              onCheckedChange={() => toggle(item.id)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm leading-snug text-foreground">
                {item.label}
              </span>
              {item.qualifier && (
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                  {item.qualifier}
                </p>
              )}
            </div>
          </label>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── TOD sub-checklist ───
function TodSubChecklist({
  checked,
  toggle,
}: {
  checked: Record<string, boolean>;
  toggle: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const microCount = TOD_MICROVASCULAR.filter((t) => checked[t.id]).length;
  const macroCount = TOD_MACROVASCULAR.filter((t) => checked[t.id]).length;
  const totalCount = microCount + macroCount;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="ml-8 mt-2 mb-1">
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
          <span className="text-xs font-semibold text-muted-foreground">
            Target Organ Damage Criteria {totalCount > 0 && `(${totalCount}/2+)`}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 rounded-b-lg border-x border-b border-border bg-muted/30 p-3 pt-0">
        {[
          { title: "Microvascular", items: TOD_MICROVASCULAR },
          { title: "Macrovascular / Cardiac", items: TOD_MACROVASCULAR },
        ].map(({ title, items }) => (
          <div key={title}>
            <p className="text-[11px] font-bold text-warning/80 uppercase tracking-wide mb-1.5">
              {title}
            </p>
            <div className="space-y-1.5">
              {items.map((tod) => (
                <label
                  key={tod.id}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-1.5 transition-colors text-sm ${
                    checked[tod.id]
                      ? "bg-warning/10 ring-1 ring-warning/15"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    checked={!!checked[tod.id]}
                    onCheckedChange={() => toggle(tod.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm leading-snug text-foreground">
                      {tod.label}
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                      {tod.qualifier}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── ASCVD History Items ───
const ASCVD_HISTORY_ITEMS = [
  { id: "q_ascvd", label: "Established ASCVD", subKey: "ascvd" as const },
  { id: "q_cac", label: "High coronary calcium / extensive plaque burden", subKey: "cac" as const },
  { id: "q_ckd", label: "CKD Stage 3B/4", subKey: "ckd" as const },
  { id: "q_fhx", label: "Family history of premature CHD / ASCVD", subKey: "fhx" as const },
  { id: "q_dmtod", label: "Diabetes with target organ damage", subKey: "dmtod" as const },
  { id: "q_subclinical", label: "Subclinical atherosclerosis", subKey: "subclinical" as const },
  { id: "q_extreme", label: "Extreme elevation of a single risk factor", subKey: "extreme" as const },
];

const SUB_MAP: Record<string, { id: string; label: string; qualifier?: string }[]> = {
  ascvd: ASCVD_ESTABLISHED,
  cac: HIGH_CAC_ITEMS,
  ckd: CKD_ITEMS,
  fhx: FHX_ITEMS,
  subclinical: SUBCLINICAL_ITEMS,
  extreme: EXTREME_ELEVATION_ITEMS,
};

// ─── CAC Options for Quick Guide ───
type CacRange = "0" | "1-99" | ">=100" | ">=300";

const CAC_OPTIONS: {
  id: CacRange;
  label: string;
  ldlTarget: string;
  intensity: string;
  rationale: string;
  tone: string;
}[] = [
  {
    id: "0",
    label: "CAC 0",
    ldlTarget: "No specific LDL-C threshold required from CAC",
    intensity: "Statin generally deferrable",
    rationale:
      "No detectable plaque. Risk often LOWER than PREVENT alone suggests. Reasonable to defer statin in borderline / intermediate PREVENT risk; reassess CAC in 5–10 y.",
    tone: "emerald",
  },
  {
    id: "1-99",
    label: "CAC 1–99",
    ldlTarget: "LDL-C < 100 mg/dL (consider < 70 mg/dL)",
    intensity: "Moderate-intensity statin",
    rationale:
      "Mild plaque burden — modest upward risk shift over PREVENT estimate. Initiate moderate-intensity statin, especially if age ≥ 55 y or risk-enhancers present.",
    tone: "amber",
  },
  {
    id: ">=100",
    label: "CAC ≥ 100",
    ldlTarget: "LDL-C < 70 mg/dL (target < 55 mg/dL if enhancers)",
    intensity: "High-intensity statin — START or INTENSIFY",
    rationale:
      "Guideline-endorsed statin trigger (2018 ACC/AHA). Meaningful upward risk shift; PREVENT alone underestimates true ASCVD risk. Initiate high-intensity statin; add ezetimibe if LDL-C above goal.",
    tone: "orange",
  },
  {
    id: ">=300",
    label: "CAC ≥ 300",
    ldlTarget: "LDL-C < 55 mg/dL (consider < 40 if CAC ≥ 1000)",
    intensity: "Maximal statin + add-on therapy",
    rationale:
      "Extensive calcification — risk approaches secondary-prevention levels. Maximally tolerated statin + ezetimibe; consider PCSK9 inhibitor / bempedoic acid. Discuss low-dose aspirin and functional testing.",
    tone: "danger",
  },
];

const TONE_CLASSES: Record<string, { border: string; bg: string; pill: string; text: string }> =
  {
    emerald: {
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/[0.06]",
      pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
      text: "text-emerald-700 dark:text-emerald-400",
    },
    amber: {
      border: "border-amber-500/40",
      bg: "bg-amber-500/[0.06]",
      pill: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
      text: "text-amber-700 dark:text-amber-400",
    },
    orange: {
      border: "border-orange-500/40",
      bg: "bg-orange-500/[0.06]",
      pill: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
      text: "text-orange-700 dark:text-orange-400",
    },
    danger: {
      border: "border-danger/40",
      bg: "bg-danger/[0.06]",
      pill: "bg-danger/15 text-danger",
      text: "text-danger",
    },
  };

interface PatientData {
  ascvd: boolean;
  diabetes: boolean;
  smoker: boolean;
  htn: boolean;
  ldl: number;
  hdl: number;
  hba1c: number;
}

// ─── Lp(a) Risk Stratification Component ───
function LpaRiskStratification() {
  const [lpaLevel, setLpaLevel] = useState<string>("");

  const getRiskInterpretation = (level: number) => {
    if (level < 30) return { risk: "Reference (low)", color: "text-success", multiplier: "1×" };
    if (level < 50) return { risk: "1.2× ASCVD risk", color: "text-primary", multiplier: "1.2×" };
    if (level < 100) return { risk: "1.4× ASCVD risk", color: "text-warning", multiplier: "1.4×" };
    if (level < 150) return { risk: "2× ASCVD risk", color: "text-danger", multiplier: "2×" };
    if (level < 180) return { risk: "3× ASCVD risk", color: "text-danger", multiplier: "3×" };
    return { risk: "4× ASCVD risk", color: "text-danger font-bold", multiplier: "4×" };
  };

  const lpaValue = parseFloat(lpaLevel);
  const interpretation = !isNaN(lpaValue) ? getRiskInterpretation(lpaValue) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[30, 50, 100, 180].map((threshold) => (
          <button
            key={threshold}
            onClick={() => setLpaLevel(threshold.toString())}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              lpaLevel === threshold.toString()
                ? "border-blue-500 bg-blue-500/10 text-blue-600"
                : "border-border bg-card text-foreground hover:bg-muted/40"
            }`}
          >
            {threshold} mg/dL
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Input
          type="number"
          placeholder="Enter Lp(a) level (mg/dL)"
          value={lpaLevel}
          onChange={(e) => setLpaLevel(e.target.value)}
          className="max-w-xs"
        />
        <span className="text-sm text-muted-foreground">mg/dL</span>
      </div>

      {interpretation && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Dna className="h-4 w-4 text-blue-500" />
            <p className="text-sm font-semibold text-foreground">Risk Interpretation</p>
          </div>
          <p className={`text-lg ${interpretation.color}`}>
            {interpretation.multiplier} relative ASCVD risk
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Lp(a) {lpaValue} mg/dL ({(lpaValue * 2.5).toFixed(0)} nmol/L)
          </p>
          {lpaValue >= 50 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              Consider more aggressive LDL-C lowering and earlier statin initiation.
            </p>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-3 font-semibold text-muted-foreground">Lp(a) Level</th>
              <th className="text-left py-2 font-semibold text-muted-foreground">Relative Risk</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-3 text-success">&lt;30 mg/dL (&lt;75 nmol/L)</td>
              <td className="py-2 text-success">Reference (low)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-3 text-primary">30–49 mg/dL (75–124 nmol/L)</td>
              <td className="py-2 text-primary">1.2×</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-3 text-warning">50–99 mg/dL (125–249 nmol/L)</td>
              <td className="py-2 text-warning">1.4×</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-3 text-danger">100–149 mg/dL (250–374 nmol/L)</td>
              <td className="py-2 text-danger font-semibold">2×</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-3 text-danger">150–179 mg/dL (375–449 nmol/L)</td>
              <td className="py-2 text-danger font-semibold">3×</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 text-danger font-bold">≥180 mg/dL (≥450 nmol/L)</td>
              <td className="py-2 text-danger font-bold">4×</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Fix: Import Dna icon
export default function LipidsAssessment() {
  // ─── Patient Data State ───
  const [patient, setPatient] = useState({
    name: "",
    age: "" as unknown as number,
    sex: "",
    mrn: "",
  });

  const [data, setData] = useState<PatientData>({
    ascvd: false,
    diabetes: false,
    smoker: false,
    htn: false,
    ldl: "" as unknown as number,
    hdl: "" as unknown as number,
    hba1c: "" as unknown as number,
  });

  const [qChecked, setQChecked] = useState<Record<string, boolean>>({});
  const [fhxOpen, setFhxOpen] = useState(false);
  const [selectedCac, setSelectedCac] = useState<CacRange | null>(null);

  const toggleQ = (id: string) =>
    setQChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  // ─── Risk-Enhancing Factors ───
  const [enhChecked, setEnhChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(RISK_ENHANCERS_2019.map((e) => [e.id, false]))
  );
  const toggleEnh = (id: string) =>
    setEnhChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const enhSuggested = useMemo<Record<string, boolean>>(() => {
    const ldlV = Number(data.ldl);
    return {
      enh_persistldl: !!ldlV && ldlV >= 160 && ldlV <= 189,
      enh_lpa: false,
      enh_apob: false,
      enh_ckd: false,
      enh_hscrp: false,
      enh_ethnicity: false,
      enh_mets: false,
      enh_fhx: countCheckedItems(FHX_ITEMS, qChecked) >= 1,
    };
  }, [data.ldl, qChecked]);

  const enhCount = Object.values(enhChecked).filter(Boolean).length;

  // ─── Auto-qualification logic ───
  const autoQual = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const item of ASCVD_HISTORY_ITEMS) {
      if (item.subKey === "dmtod") {
        map[item.id] = countCheckedItems(TOD_ALL, qChecked) >= 1;
      } else {
        const sub = SUB_MAP[item.subKey];
        map[item.id] = sub ? countCheckedItems(sub, qChecked) >= 1 : !!qChecked[item.id];
      }
    }
    return map;
  }, [qChecked]);

  const qualifiedCount = ASCVD_HISTORY_ITEMS.filter((i) => autoQual[i.id]).length;

  // ─── Risk calc ───
  const hasEnoughData = !!patient.age && !!data.ldl && !!data.hdl;

  const calculateRisk = () => {
    if (!hasEnoughData) return null;
    let risk = 0;
    risk += (Number(patient.age) - 30) * 0.6;
    risk += (Number(data.ldl) - 100) * 0.12;
    risk -= (Number(data.hdl) - 40) * 0.25;
    if (data.smoker) risk += 10;
    if (data.diabetes) risk += 12;
    if (data.htn) risk += 6;
    return Math.max(1, Math.min(risk, 35));
  };

  const risk = calculateRisk();
  const category = !risk
    ? "—"
    : data.ascvd || risk >= 20
    ? "HIGH"
    : risk >= 7.5
    ? "INTERMEDIATE"
    : risk >= 5
    ? "BORDERLINE"
    : "LOW";

  const ldlTarget =
    category === "HIGH"
      ? "<50 mg/dL"
      : category === "LOW"
      ? "<100 mg/dL"
      : "<70 mg/dL";

  const treatment =
    category === "HIGH"
      ? "High-intensity statin ± ezetimibe ± PCSK9"
      : category === "LOW"
      ? "Lifestyle only"
      : "Moderate-intensity statin";

  // ─── Status badge ───
  const getStatusBadge = (item: (typeof ASCVD_HISTORY_ITEMS)[0]) => {
    const sub = item.subKey === "dmtod" ? TOD_ALL : SUB_MAP[item.subKey];
    if (!sub) return null;
    const count = countCheckedItems(sub, qChecked);
    const met = autoQual[item.id];
    return (
      <span
        className={`ml-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
          met ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"
        }`}
      >
        {count}/{sub.length} — {met ? "Qualified ✓" : "≥1 required"}
      </span>
    );
  };

  // ─── EMR Note ───
  const generateNote = useMemo(() => {
    const lines: string[] = [];
    lines.push("ASCVD RISK ASSESSMENT");
    lines.push(`Patient: ${patient.name} (${patient.mrn})`);
    lines.push(`Age: ${patient.age}, Sex: ${patient.sex}`);
    lines.push(`Date: ${new Date().toLocaleDateString()}`);
    lines.push("▸ CONDITIONS:");
    if (data.ascvd) lines.push("  ✓ Established ASCVD");
    if (data.diabetes) lines.push("  ✓ Diabetes mellitus");
    if (data.smoker) lines.push("  ✓ Active smoker");
    if (data.htn) lines.push("  ✓ Hypertension");
    lines.push("▸ LABS:");
    lines.push(`  LDL-C: ${data.ldl} mg/dL`);
    lines.push(`  HDL-C: ${data.hdl} mg/dL`);
    lines.push(`  HbA1c: ${data.hba1c}%`);
    lines.push(`▸ 10-YEAR ASCVD RISK: ${risk != null ? risk.toFixed(1) + "%" : "—"}`);
    lines.push(`  Category: ${category}`);
    lines.push(`  LDL Target: ${ldlTarget}`);
    lines.push(`  Plan: ${treatment}`);
    const qualChecked = ASCVD_HISTORY_ITEMS.filter((i) => autoQual[i.id]);
    if (qualChecked.length > 0) {
      lines.push(
        `▸ ASCVD HISTORY & EXTREME RISK MODIFIERS (${qualChecked.length}/${ASCVD_HISTORY_ITEMS.length}):`
      );
      for (const item of qualChecked) {
        lines.push(`  ✓ ${item.label}`);
      }
    }
    lines.push("▸ FOLLOW-UP:");
    lines.push("  Repeat lipids in 6–12 months.");

    return lines.join("\n");
  }, [patient, data, risk, category, ldlTarget, treatment, autoQual]);

  const toggles: (keyof PatientData)[] = ["ascvd", "diabetes", "smoker", "htn"];
  const labs: (keyof PatientData)[] = ["ldl", "hdl", "hba1c"];

  const activeCac = CAC_OPTIONS.find((o) => o.id === selectedCac);
  const cacTone = activeCac ? TONE_CLASSES[activeCac.tone] : null;

  return (
    <div className="space-y-6">
      {/* ASCVD Risk Calculator */}
      <SectionCard
        title="ASCVD Risk Calculator"
        tone="cyan"
        icon={<TrendingUp className="h-4 w-4" />}
        collapsible={false}
      >
        {/* Patient Profile */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-blue-500" />
            <h4 className="font-semibold text-foreground">Patient Profile</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Patient Name
              </label>
              <Input
                value={patient.name}
                onChange={(e) => setPatient({ ...patient, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">MRN</label>
              <Input
                value={patient.mrn}
                onChange={(e) => setPatient({ ...patient, mrn: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Age</label>
              <Input
                type="number"
                value={patient.age}
                onChange={(e) => setPatient({ ...patient, age: +e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Sex</label>
              <Input
                value={patient.sex}
                onChange={(e) => setPatient({ ...patient, sex: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-purple-500" />
            <h4 className="font-semibold text-foreground">Conditions</h4>
          </div>
          <div className="flex gap-3 flex-wrap">
            {toggles.map((k) => (
              <label key={k} className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  checked={data[k] as boolean}
                  onCheckedChange={() => setData({ ...data, [k]: !data[k] })}
                />
                <span className="text-sm font-medium text-foreground">
                  {k === "ascvd"
                    ? "ASCVD"
                    : k === "htn"
                    ? "Hypertension"
                    : k.charAt(0).toUpperCase() + k.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Labs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TestTube className="h-4 w-4 text-amber-500" />
            <h4 className="font-semibold text-foreground">Lab Values</h4>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {labs.map((lab) => (
              <div key={lab}>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  {lab.toUpperCase()} {lab === "ldl" || lab === "hdl" ? "(mg/dL)" : "(%)"}
                </label>
                <Input
                  type="number"
                  value={data[lab] as number}
                  onChange={(e) => setData({ ...data, [lab]: +e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Risk Result */}
        <Card
          className={`p-4 mb-6 ${
            category === "HIGH"
              ? "border-danger/30 bg-danger/5"
              : category === "LOW"
              ? "border-emerald-500/30 bg-emerald-500/5"
              : category === "—"
              ? "border-muted bg-muted/30"
              : "border-amber-500/30 bg-amber-500/5"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">10-Year ASCVD Risk</h4>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                category === "HIGH"
                  ? "bg-danger/15 text-danger"
                  : category === "LOW"
                  ? "bg-emerald-500/15 text-emerald-600"
                  : category === "—"
                  ? "bg-muted text-muted-foreground"
                  : "bg-amber-500/15 text-amber-600"
              }`}
            >
              {risk != null ? `${risk.toFixed(1)}%` : "—"} ({category})
            </span>
          </div>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">LDL Target:</span> {ldlTarget}
            </p>
            <p>
              <span className="font-semibold">Treatment:</span> {treatment}
            </p>
          </div>
        </Card>

        {/* Risk-Enhancing Factors */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldQuestion className="h-4 w-4 text-indigo-500" />
            <h4 className="font-semibold text-foreground">2019 ACC/AHA Risk-Enhancing Factors</h4>
            <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold text-indigo-500">
              {enhCount}/{RISK_ENHANCERS_2019.length}
            </span>
          </div>
          <p className="mb-3 text-[11px] text-muted-foreground leading-snug">
            Use these factors to refine therapy decisions when 10-yr ASCVD risk is{" "}
            <strong className="text-foreground">borderline (5–&lt;7.5%)</strong> or{" "}
            <strong className="text-foreground">intermediate (7.5–&lt;20%)</strong>.
            Presence of one or more favors statin initiation or intensification.
          </p>

          {Array.from(new Set(RISK_ENHANCERS_2019.map((e) => e.category))).map((cat) => (
            <div key={cat} className="mb-3">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {cat}
              </p>
              <div className="space-y-1.5">
                {RISK_ENHANCERS_2019.filter((e) => e.category === cat).map((item) => {
                  const isSuggested = !!enhSuggested[item.id] && !enhChecked[item.id];
                  return (
                    <RiskFactorChip
                      key={item.id}
                      label={item.label}
                      qualifier={item.qualifier}
                      tone="indigo"
                      size="sm"
                      checked={!!enhChecked[item.id]}
                      onToggle={() => toggleEnh(item.id)}
                      rightSlot={
                        isSuggested ? (
                          <span
                            className="rounded-full bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-500"
                            title="Your entered value meets this criterion — click the chip to confirm."
                          >
                            suggested
                          </span>
                        ) : undefined
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ASCVD History & Extreme Risk Modifiers */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h4 className="font-semibold text-foreground">ASCVD History & Extreme Risk Modifiers</h4>
            {qualifiedCount > 0 && (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold text-warning">
                {qualifiedCount}/{ASCVD_HISTORY_ITEMS.length}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Expand sub-criteria to auto-qualify each category. All selections are reflected in the
            EMR note.
          </p>
          <div className="space-y-2">
            {ASCVD_HISTORY_ITEMS.map((item) => {
              const isQualified = autoQual[item.id];
              return (
                <div key={item.id}>
                  <div
                    className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      isQualified ? "bg-warning/8 ring-1 ring-warning/20" : "hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox checked={isQualified} disabled className="mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm leading-snug text-foreground">{item.label}</span>
                      {getStatusBadge(item)}
                    </div>
                  </div>

                  {/* Sub-checklists */}
                  {item.subKey === "ascvd" && (
                    <SubChecklist
                      items={ASCVD_ESTABLISHED}
                      checked={qChecked}
                      toggle={toggleQ}
                      title="Select applicable ASCVD manifestations (≥1 required):"
                    />
                  )}
                  {item.subKey === "cac" && (
                    <SubChecklist
                      items={HIGH_CAC_ITEMS}
                      checked={qChecked}
                      toggle={toggleQ}
                      title="Select applicable high CAC / plaque burden findings (≥1 required):"
                    />
                  )}
                  {item.subKey === "ckd" && (
                    <SubChecklist
                      items={CKD_ITEMS}
                      checked={qChecked}
                      toggle={toggleQ}
                      title="Select CKD stage and albuminuria status (≥1 required):"
                    />
                  )}
                  {item.subKey === "subclinical" && (
                    <SubChecklist
                      items={SUBCLINICAL_ITEMS}
                      checked={qChecked}
                      toggle={toggleQ}
                      title="Select applicable subclinical findings (≥1 required):"
                    />
                  )}
                  {item.subKey === "extreme" && (
                    <SubChecklist
                      items={EXTREME_ELEVATION_ITEMS}
                      checked={qChecked}
                      toggle={toggleQ}
                      title="Select applicable extreme risk factor elevations (≥1 required):"
                    />
                  )}
                  {item.subKey === "fhx" && (
                    <Collapsible open={fhxOpen} onOpenChange={setFhxOpen} className="ml-8 mt-2 mb-1">
                      <CollapsibleTrigger asChild>
                        <button className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                          <span className="text-xs font-semibold text-muted-foreground">
                            Premature CHD / ASCVD{" "}
                            {FHX_ITEMS.filter((f) => qChecked[f.id]).length > 0 &&
                              `(${FHX_ITEMS.filter((f) => qChecked[f.id]).length}/${FHX_ITEMS.length})`}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${fhxOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1.5 rounded-b-lg border-x border-b border-border bg-muted/30 p-3 pt-0">
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          "Premature" = CHD or atherosclerotic CVD event in a{" "}
                          <strong className="text-foreground">male &lt;55 y</strong> or{" "}
                          <strong className="text-foreground">female &lt;65 y</strong>.
                        </p>
                        {FHX_ITEMS.map((f) => (
                          <label
                            key={f.id}
                            className={`flex cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-1.5 transition-colors text-sm ${
                              qChecked[f.id]
                                ? "bg-warning/10 ring-1 ring-warning/15"
                                : "hover:bg-muted/50"
                            }`}
                          >
                            <Checkbox
                              checked={!!qChecked[f.id]}
                              onCheckedChange={() => toggleQ(f.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm leading-snug text-foreground">
                                {f.label}
                              </span>
                              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                                {f.qualifier}
                              </p>
                            </div>
                          </label>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                  {item.subKey === "dmtod" && <TodSubChecklist checked={qChecked} toggle={toggleQ} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* EMR Note */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">EMR Note</h4>
          <textarea
            value={generateNote}
            readOnly
            className="w-full h-32 rounded-lg border border-input bg-background p-3 text-sm text-foreground font-mono resize-none"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(generateNote);
              toast.success("Note copied to clipboard");
            }}
            className="w-full mt-3 gap-2"
            variant="outline"
          >
            <ClipboardCopy className="h-4 w-4" />
            Copy to EMR
          </Button>
        </div>
      </SectionCard>

      {/* CAC/LDL Target Guide */}
      <SectionCard
        title="CAC-Based LDL-C Target Guide"
        tone="indigo"
        icon={<ScanLine className="h-4 w-4" />}
        defaultOpen={false}
      >
        <p className="text-xs text-muted-foreground mb-4">
          Select the patient's CAC range to view the suggested LDL-C target and statin intensity.
          Based on 2018 ACC/AHA guidelines.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
          {CAC_OPTIONS.map((opt) => {
            const isActive = selectedCac === opt.id;
            const t = TONE_CLASSES[opt.tone];
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedCac(isActive ? null : opt.id)}
                className={`rounded-md border px-2 py-1.5 text-[11px] font-semibold transition-all ${
                  isActive
                    ? `${t.border} ${t.bg} ${t.text} shadow-sm`
                    : "border-border bg-card text-foreground hover:bg-muted/40"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {activeCac && cacTone && (
          <div className={`mt-2.5 rounded-md border ${cacTone.border} ${cacTone.bg} p-4`}>
            <div className="flex items-start gap-2">
              <Target className={`h-4 w-4 mt-0.5 ${cacTone.text}`} />
              <div className="flex-1">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${cacTone.text}`}>
                  Suggested LDL-C target
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">{activeCac.ldlTarget}</p>
                <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cacTone.pill}`}>
                  {activeCac.intensity}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-foreground">
                  {activeCac.rationale}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-3 font-semibold text-muted-foreground">CAC Score</th>
                <th className="text-left py-2 pr-3 font-semibold text-muted-foreground">Risk / Action</th>
                <th className="text-left py-2 font-semibold text-muted-foreground">LDL-C Target</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-3 font-semibold">0</td>
                <td className="py-2.5 pr-3">Low risk</td>
                <td className="py-2.5 font-semibold">&lt;100 mg/dL (&lt;2.6 mmol/L)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-3 font-semibold">1–99 AU</td>
                <td className="py-2.5 pr-3">Start moderate statin</td>
                <td className="py-2.5 font-semibold">&lt;70 mg/dL (&lt;1.8 mmol/L)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-3 font-semibold">100–399 AU</td>
                <td className="py-2.5 pr-3">High-intensity statin</td>
                <td className="py-2.5 font-semibold">&lt;55 mg/dL (&lt;1.4 mmol/L)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-semibold text-danger">≥400 AU</td>
                <td className="py-2.5 pr-3">Very high-intensity</td>
                <td className="py-2.5 font-semibold">&lt;40 mg/dL (&lt;1.0 mmol/L)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Lp(a) Risk Stratification */}
      <SectionCard
        title="Lp(a) Risk Stratification"
        tone="cyan"
        icon={<Dna className="h-4 w-4" />}
        defaultOpen={false}
      >
        <LpaRiskStratification />
      </SectionCard>
    </div>
  );
}
