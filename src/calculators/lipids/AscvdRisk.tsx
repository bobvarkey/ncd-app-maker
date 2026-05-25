import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ClipboardCopy, ArrowLeft, AlertTriangle, Heart, ChevronDown, User, TestTube, FileText, TrendingUp, ShieldQuestion, HeartPulse, Info, HelpCircle } from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import { RiskFactorChip } from "@/components/ui/risk-factor-chip";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ASCVD_ESTABLISHED, SUBCLINICAL_ITEMS, HIGH_CAC_ITEMS, CKD_ITEMS,
  FHX_ITEMS, EXTREME_ELEVATION_ITEMS, TOD_MICROVASCULAR, TOD_MACROVASCULAR,
  TOD_ALL, countCheckedItems, type SubItem,
  RISK_ENHANCERS_2019,
} from "@/lib/clinicalConstants";

// ─── Sub-checklist renderer ───
function SubChecklist({
  items, checked, toggle, title, defaultOpen = false,
}: {
  items: SubItem[]; checked: Record<string, boolean>;
  toggle: (id: string) => void; title: string; defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const checkedCount = items.filter((item) => checked[item.id]).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="ml-8 mt-2 mb-1">
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
          <span className="text-xs font-semibold text-muted-foreground">{title} {checkedCount > 0 && `(${checkedCount}/${items.length})`}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1.5 rounded-b-lg border-x border-b border-border bg-muted/30 p-3 pt-0 mt-0">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-1.5 transition-colors text-sm ${
              checked[item.id] ? "bg-warning/10 ring-1 ring-warning/15" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox checked={!!checked[item.id]} onCheckedChange={() => toggle(item.id)} className="mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-sm leading-snug text-foreground">{item.label}</span>
              {item.qualifier && (
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{item.qualifier}</p>
              )}
            </div>
          </label>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── TOD sub-checklist (micro + macro) ───
function TodSubChecklist({
  checked, toggle, colorClass = "warning",
}: {
  checked: Record<string, boolean>; toggle: (id: string) => void; colorClass?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const microCount = TOD_MICROVASCULAR.filter((t) => checked[t.id]).length;
  const macroCount = TOD_MACROVASCULAR.filter((t) => checked[t.id]).length;
  const totalCount = microCount + macroCount;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="ml-8 mt-2 mb-1">
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
          <span className="text-xs font-semibold text-muted-foreground">Target Organ Damage Criteria {totalCount > 0 && `(${totalCount}/2+)`}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 rounded-b-lg border-x border-b border-border bg-muted/30 p-3 pt-0">
        {([
          { title: "Microvascular", items: TOD_MICROVASCULAR },
          { title: "Macrovascular / Cardiac", items: TOD_MACROVASCULAR },
        ] as const).map(({ title, items }) => (
          <div key={title}>
            <p className={`text-[11px] font-bold text-${colorClass}/80 uppercase tracking-wide mb-1.5`}>{title}</p>
            <div className="space-y-1.5">
              {items.map((tod) => (
                <label
                  key={tod.id}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-1.5 transition-colors text-sm ${
                    checked[tod.id] ? `bg-${colorClass}/10 ring-1 ring-${colorClass}/15` : "hover:bg-muted/50"
                  }`}
                >
                  <Checkbox checked={!!checked[tod.id]} onCheckedChange={() => toggle(tod.id)} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm leading-snug text-foreground">{tod.label}</span>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{tod.qualifier}</p>
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

// ─── ASCVD Explanation Card ───
function AscvdInfoCard({ inline = false }: { inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const [subtypeOpen, setSubtypeOpen] = useState<Record<string, boolean>>({
    established: true,
    subclinical: false,
    equivalents: false,
  });
  const toggleSubtype = (key: string) =>
    setSubtypeOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const wrapper = (
    <div className={`rounded-xl border border-rose-200 dark:border-rose-800/40 bg-rose-50/60 dark:bg-rose-950/20 p-4 space-y-3 ${inline ? "" : "mt-2"}`}>
      <div className="flex items-start gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
          <HeartPulse className="h-4 w-4" />
        </span>
        <div className="min-w-1 flex-1">
          <h4 className="text-xs font-bold text-foreground">What is ASCVD?</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Atherosclerotic Cardiovascular Disease (ASCVD)</strong> is the
            broad term for conditions caused by atherosclerotic plaque buildup in arterial walls, leading to
            reduced blood flow, thrombosis, and end-organ ischemia.
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            In lipid-guideline context, “established ASCVD” means a prior documented event or revascularization
            due to atherosclerosis — this upgrades the patient to <strong className="text-foreground">secondary prevention</strong> with
            aggressive LDL-C targets.
          </p>
        </div>
      </div>

      {/* Collapsible Subtypes */}
      <div className="space-y-2 pt-1">
        {/* Established */}
        <Collapsible open={subtypeOpen.established} onOpenChange={() => toggleSubtype("established")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-rose-200/60 dark:border-rose-800/30 bg-white/60 dark:bg-rose-950/30 px-3 py-2.5 transition-colors hover:bg-white dark:hover:bg-rose-950/40">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Established ASCVD Subtypes</span>
            <ChevronDown className={`h-4 w-4 text-rose-500 transition-transform ${subtypeOpen.established ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-1.5 space-y-2 rounded-b-lg border-x border-b border-rose-200/60 dark:border-rose-800/30 bg-white/40 dark:bg-rose-950/20 px-3 py-2.5">
              {ASCVD_ESTABLISHED.map((item) => (
                <HoverCard key={item.id} openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <button type="button" className="flex w-full gap-2 text-left rounded-md hover:bg-rose-100/40 dark:hover:bg-rose-900/20 transition-colors px-1 py-0.5 -mx-1 cursor-help">
                      <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-foreground inline-flex items-center gap-1">
                          {item.label}
                          <Info className="h-3 w-3 text-rose-500/70" />
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-snug">{item.qualifier}</p>
                      </div>
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" align="start" className="w-72 border-rose-200 dark:border-rose-800/40 bg-popover">
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-rose-700 dark:text-rose-400">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{item.qualifier}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Subclinical */}
        <Collapsible open={subtypeOpen.subclinical} onOpenChange={() => toggleSubtype("subclinical")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-indigo-200/60 dark:border-indigo-800/30 bg-white/60 dark:bg-indigo-950/20 px-3 py-2.5 transition-colors hover:bg-white dark:hover:bg-indigo-950/30">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Subclinical Atherosclerosis</span>
            <ChevronDown className={`h-4 w-4 text-indigo-500 transition-transform ${subtypeOpen.subclinical ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-1.5 space-y-2 rounded-b-lg border-x border-b border-indigo-200/60 dark:border-indigo-800/30 bg-white/40 dark:bg-indigo-950/20 px-3 py-2.5">
              {SUBCLINICAL_ITEMS.map((item) => (
                <div key={item.id} className="flex gap-2">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  <div>
                    <p className="text-[11px] font-semibold text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{item.qualifier}</p>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Equivalents */}
        <Collapsible open={subtypeOpen.equivalents} onOpenChange={() => toggleSubtype("equivalents")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-amber-200/60 dark:border-amber-800/30 bg-white/60 dark:bg-amber-950/20 px-3 py-2.5 transition-colors hover:bg-white dark:hover:bg-amber-950/30">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">ASCVD Risk Equivalents</span>
            <ChevronDown className={`h-4 w-4 text-amber-500 transition-transform ${subtypeOpen.equivalents ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-1.5 space-y-2 rounded-b-lg border-x border-b border-amber-200/60 dark:border-amber-800/30 bg-white/40 dark:bg-amber-950/20 px-3 py-2.5 text-[11px] text-muted-foreground leading-snug">
              <p>
                <strong className="text-foreground">Diabetes + Target Organ Damage (TOD):</strong> Retinopathy,
                nephropathy (UACR ≥30), neuropathy, LVH, or subclinical atherosclerosis.
              </p>
              <p>
                <strong className="text-foreground">Familial Hypercholesterolemia (FH):</strong> Dutch Lipid Clinic
                Network definite/probable FH, pathogenic LDLR/APOB/PCSK9 mutation, or phenotype with LDL-C ≥190 mg/dL
                plus tendon xanthomas / corneal arcus &lt;45 y.
              </p>
              <p>
                <strong className="text-foreground">CKD Stage 3B/4:</strong> eGFR 30–44 (3B) or 15–29 (4) mL/min/1.73 m²,
                especially with albuminuria (UACR ≥30 mg/g).
              </p>
              <p>
                <strong className="text-foreground">Polyvascular disease:</strong> Atherosclerotic disease in ≥2 arterial
                territories (coronary, cerebrovascular, peripheral).
              </p>
              <p>
                <strong className="text-foreground">High CAC / Plaque burden:</strong> CAC ≥100 AU or ≥75th percentile,
                or multi-territory plaque on imaging.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <p className="text-[10px] text-muted-foreground italic">
        Ref: 2018 AHA/ACC Cholesterol Guideline; 2026 ACC/AHA Dyslipidemia Guideline.
      </p>
    </div>
  );

  if (inline) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-1">
          {wrapper}
        </div>
      </Collapsible>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-800/40 bg-rose-50 dark:bg-rose-950/30 px-3 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer">
        <HelpCircle className="h-4 w-4" />
        What counts as ASCVD? Click to see criteria &amp; subtypes
        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>{wrapper}</CollapsibleContent>
    </Collapsible>
  );
}

// ─── Qualifier sections config ───
const ASCVD_HISTORY_ITEMS = [
  { id: "q_ascvd", label: "Established ASCVD", subKey: "ascvd" as const },
  { id: "q_cac", label: "High coronary calcium / extensive plaque burden", subKey: "cac" as const },
  { id: "q_ckd", label: "CKD Stage 3B/4", subKey: "ckd" as const },
  { id: "q_fhx", label: "Family history of premature CHD / ASCVD", subKey: "fhx" as const },
  { id: "q_dmtod", label: "Diabetes with target organ damage", subKey: "dmtod" as const },
  { id: "q_subclinical", label: "Subclinical atherosclerosis", subKey: "subclinical" as const },
  { id: "q_extreme", label: "Extreme elevation of a single risk factor", subKey: "extreme" as const },
];

const SUB_MAP: Record<string, SubItem[]> = {
  ascvd: ASCVD_ESTABLISHED,
  cac: HIGH_CAC_ITEMS,
  ckd: CKD_ITEMS,
  fhx: FHX_ITEMS,
  subclinical: SUBCLINICAL_ITEMS,
  extreme: EXTREME_ELEVATION_ITEMS,
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

export default function AscvdEmr() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    name: "", age: "" as unknown as number, sex: "", mrn: "",
  });
  const [data, setData] = useState<PatientData>({
    ascvd: false, diabetes: false, smoker: false, htn: false,
    ldl: "" as unknown as number, hdl: "" as unknown as number, hba1c: "" as unknown as number,
  });
  const [qChecked, setQChecked] = useState<Record<string, boolean>>({});
  const [fhxOpen, setFhxOpen] = useState(false);

  const toggleQ = (id: string) =>
    setQChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  // ─── 2019 ACC/AHA Risk-Enhancing Factors (user-driven) ───
  const [enhChecked, setEnhChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(RISK_ENHANCERS_2019.map(e => [e.id, false]))
  );
  const toggleEnh = (id: string) => setEnhChecked(prev => ({ ...prev, [id]: !prev[id] }));

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
  const category = !risk ? "—" : data.ascvd || risk >= 20 ? "HIGH" : risk >= 7.5 ? "INTERMEDIATE" : risk >= 5 ? "BORDERLINE" : "LOW";
  const ldlTarget = category === "HIGH" ? "<50 mg/dL" : category === "LOW" ? "<100 mg/dL" : "<70 mg/dL";
  const treatment = category === "HIGH" ? "High-intensity statin ± ezetimibe ± PCSK9" : category === "LOW" ? "Lifestyle only" : "Moderate-intensity statin";

  // ─── Status badge ───
  const getStatusBadge = (item: typeof ASCVD_HISTORY_ITEMS[0]) => {
    const sub = item.subKey === "dmtod" ? TOD_ALL : SUB_MAP[item.subKey];
    if (!sub) return null;
    const count = countCheckedItems(sub, qChecked);
    const met = autoQual[item.id];
    return (
      <span className={`ml-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
        met ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"
      }`}>
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
      lines.push(`▸ ASCVD HISTORY & EXTREME RISK MODIFIERS (${qualChecked.length}/${ASCVD_HISTORY_ITEMS.length}):`);
      for (const item of qualChecked) {
        lines.push(`  ✓ ${item.label}`);
        if (item.subKey === "dmtod") {
          const micro = TOD_MICROVASCULAR.filter((t) => qChecked[t.id]);
          const macro = TOD_MACROVASCULAR.filter((t) => qChecked[t.id]);
          if (micro.length > 0) {
            lines.push("      Microvascular:");
            micro.forEach((t) => lines.push(`        • ${t.label}`));
          }
          if (macro.length > 0) {
            lines.push("      Macrovascular/Cardiac:");
            macro.forEach((t) => lines.push(`        • ${t.label}`));
          }
        } else if (item.subKey === "fhx") {
          const fhxChecked = FHX_ITEMS.filter((f) => qChecked[f.id]);
          fhxChecked.forEach((f) => lines.push(`      • ${f.label}`));
        } else {
          const sub = SUB_MAP[item.subKey];
          if (sub) {
            sub.filter((s) => qChecked[s.id]).forEach((s) => lines.push(`      • ${s.label}`));
          }
        }
      }
    }
    lines.push("▸ FOLLOW-UP:");
    lines.push("  Repeat lipids in 6–12 months.");

    return lines.join("\n");
  }, [patient, data, risk, category, ldlTarget, treatment, qChecked, autoQual]);

  const toggles: (keyof PatientData)[] = ["ascvd", "diabetes", "smoker", "htn"];
  const labs: (keyof PatientData)[] = ["ldl", "hdl", "hba1c"];

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back Home
        </Button>

        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            ASCVD Risk Assessment
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ACC/AHA Primary Prevention Pathway with EMR Note Generator
          </p>
        </div>

        <AscvdInfoCard />

        <SectionCard
          title="Patient Profile"
          tone="cyan"
          icon={<User className="h-4 w-4" />}
          collapsible={false}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(["name", "mrn"] as const).map((k) => (
              <div key={k}>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">{k === "mrn" ? "MRN" : "Patient Name"}</label>
                <Input value={patient[k]} onChange={(e) => setPatient({ ...patient, [k]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Age</label>
              <Input type="number" value={patient.age} onChange={(e) => setPatient({ ...patient, age: +e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Sex</label>
              <Input value={patient.sex} onChange={(e) => setPatient({ ...patient, sex: e.target.value })} />
            </div>
          </div>
        </SectionCard>

        {/* Conditions */}
        <SectionCard
          title="Conditions"
          tone="purple"
          icon={<Heart className="h-4 w-4" />}
          collapsible={false}
        >
          <div className="flex gap-3 flex-wrap">
            {toggles.map((k) => (
              <label key={k} className="flex cursor-pointer items-center gap-2">
                <Checkbox checked={data[k] as boolean} onCheckedChange={() => setData({ ...data, [k]: !data[k] })} />
                <span className="text-sm font-medium text-foreground">{k.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </SectionCard>

        {/* Labs */}
        <SectionCard
          title="Lab Values"
          tone="warning"
          icon={<TestTube className="h-4 w-4" />}
          collapsible={false}
        >
          <div className="grid grid-cols-3 gap-4">
            {labs.map((lab) => (
              <div key={lab}>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">{lab.toUpperCase()}</label>
                <Input type="number" value={data[lab] as number} onChange={(e) => setData({ ...data, [lab]: +e.target.value })} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Risk Card */}
        <SectionCard
          title={`10-Year ASCVD Risk — ${category}`}
          tone={category === "HIGH" ? "danger" : category === "LOW" ? "accent" : category === "—" ? "neutral" : "warning"}
          icon={<TrendingUp className="h-4 w-4" />}
          collapsible={false}
          badge={
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              category === "HIGH" ? "bg-danger/15 text-danger"
              : category === "LOW" ? "bg-accent/15 text-accent"
              : category === "—" ? "bg-muted text-muted-foreground"
              : "bg-warning/15 text-warning"
            }`}>
              {risk != null ? `${risk.toFixed(1)}%` : "—"}
            </span>
          }
        >
          <div className={`rounded-lg px-4 py-3 ${
            category === "HIGH" ? "bg-danger/8"
            : category === "LOW" ? "bg-accent/8"
            : category === "—" ? "bg-muted/30"
            : "bg-warning/8"
          }`}>
            <div className="text-sm">
              <span className="font-semibold text-foreground">LDL Target:</span> <span className="text-foreground">{ldlTarget}</span>
            </div>
            <div className="text-sm mt-1">
              <span className="font-semibold text-foreground">Plan:</span> <span className="text-foreground">{treatment}</span>
            </div>
          </div>
        </SectionCard>

        {/* ─── 2019 ACC/AHA Risk-Enhancing Factors ─── */}
        <SectionCard
          title="2019 ACC/AHA Risk-Enhancing Factors"
          tone="indigo"
          icon={<ShieldQuestion className="h-4 w-4" />}
          collapsible={false}
          badge={
            <span className="rounded-full bg-[hsl(245_70%_55%)]/15 px-2 py-0.5 text-[10px] font-bold text-[hsl(245_70%_55%)]">
              {enhCount}/{RISK_ENHANCERS_2019.length}
            </span>
          }
        >
          <p className="mb-3 text-[11px] text-muted-foreground leading-snug">
            Use these factors to refine therapy decisions when 10-yr ASCVD risk is{" "}
            <strong className="text-foreground">borderline (5–&lt;7.5%)</strong> or{" "}
            <strong className="text-foreground">intermediate (7.5–&lt;20%)</strong>.
            Presence of one or more favors statin initiation or intensification.
            A <strong className="text-foreground">"suggested"</strong> badge appears when an entered value meets the criterion — confirm clinically before checking.
          </p>

          {Array.from(new Set(RISK_ENHANCERS_2019.map(e => e.category))).map((cat) => (
            <div key={cat} className="mb-3">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{cat}</p>
              <div className="space-y-1.5">
                {RISK_ENHANCERS_2019.filter(e => e.category === cat).map((item) => {
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
                      rightSlot={isSuggested ? (
                        <span
                          className="rounded-full bg-[hsl(245_70%_55%)]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[hsl(245_70%_55%)]"
                          title="Your entered value meets this criterion — click the chip to confirm."
                        >
                          suggested
                        </span>
                      ) : undefined}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </SectionCard>

        {/* ─── ASCVD History & Extreme Risk Modifiers ─── */}
        <SectionCard
          title="ASCVD History & Extreme Risk Modifiers"
          tone="indigo"
          icon={<AlertTriangle className="h-4 w-4" />}
          collapsible={false}
          badge={qualifiedCount > 0 ? (
            <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold text-warning">
              {qualifiedCount}/{ASCVD_HISTORY_ITEMS.length}
            </span>
          ) : undefined}
        >
          <p className="text-xs text-muted-foreground mb-3">
            Expand sub-criteria to auto-qualify each category. All selections are reflected in the EMR note.
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
                    <SubChecklist items={ASCVD_ESTABLISHED} checked={qChecked} toggle={toggleQ}
                      title="Select applicable ASCVD manifestations (≥1 required):" />
                  )}
                  {item.subKey === "cac" && (
                    <SubChecklist items={HIGH_CAC_ITEMS} checked={qChecked} toggle={toggleQ}
                      title="Select applicable high CAC / plaque burden findings (≥1 required):" />
                  )}
                  {item.subKey === "ckd" && (
                    <SubChecklist items={CKD_ITEMS} checked={qChecked} toggle={toggleQ}
                      title="Select CKD stage and albuminuria status (≥1 required):" />
                  )}
                  {item.subKey === "subclinical" && (
                    <SubChecklist items={SUBCLINICAL_ITEMS} checked={qChecked} toggle={toggleQ}
                      title="Select applicable subclinical findings (≥1 required):" />
                  )}
                  {item.subKey === "extreme" && (
                    <SubChecklist items={EXTREME_ELEVATION_ITEMS} checked={qChecked} toggle={toggleQ}
                      title="Select applicable extreme risk factor elevations (≥1 required):" />
                  )}
                  {item.subKey === "fhx" && (
                    <Collapsible open={fhxOpen} onOpenChange={setFhxOpen} className="ml-8 mt-2 mb-1">
                      <CollapsibleTrigger asChild>
                        <button className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                          <span className="text-xs font-semibold text-muted-foreground">
                            Premature CHD / ASCVD {FHX_ITEMS.filter((f) => qChecked[f.id]).length > 0 && `(${FHX_ITEMS.filter((f) => qChecked[f.id]).length}/${FHX_ITEMS.length})`}
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${fhxOpen ? "rotate-180" : ""}`} />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1.5 rounded-b-lg border-x border-b border-border bg-muted/30 p-3 pt-0">
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          "Premature" = CHD or atherosclerotic CVD event in a <strong className="text-foreground">male &lt;55 y</strong> or <strong className="text-foreground">female &lt;65 y</strong>.
                        </p>
                        {FHX_ITEMS.map((f) => (
                          <label
                            key={f.id}
                            className={`flex cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-1.5 transition-colors text-sm ${
                              qChecked[f.id] ? "bg-warning/10 ring-1 ring-warning/15" : "hover:bg-muted/50"
                            }`}
                          >
                            <Checkbox checked={!!qChecked[f.id]} onCheckedChange={() => toggleQ(f.id)} className="mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm leading-snug text-foreground">{f.label}</span>
                              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{f.qualifier}</p>
                            </div>
                          </label>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                  {item.subKey === "dmtod" && (
                    <TodSubChecklist checked={qChecked} toggle={toggleQ} />
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* EMR Note */}
        <SectionCard
          title="EMR Note"
          tone="emerald"
          icon={<FileText className="h-4 w-4" />}
          collapsible={false}
        >
          <textarea
            value={generateNote}
            readOnly
            className="w-full h-64 rounded-lg border border-input bg-background p-3 text-sm text-foreground font-mono resize-none"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(generateNote);
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
