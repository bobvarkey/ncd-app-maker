import { useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/ui/section-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Activity,
  Target,
  ListChecks,
  Stethoscope,
  Pill,
  AlertTriangle,
  RotateCcw,
  ScanLine,
  Droplet,
  Printer,
  Copy,
  FileText,
} from "lucide-react";

/* ============================================================
   Lipid Management Mini-App (fully client-side)
   Based on LAI 2023 lipid algorithm
   ============================================================ */

type Scenario = "acs" | "dm" | "htg" | "general" | "recurrent";
type StatinGroup = "naive" | "low_mod" | "high" | "intolerant";
type DmAscvd = "no" | "yes";
type DmModifiers = "none" | "tod_or_2rf";
type CacRange = "" | "0" | "1-99_lt75" | "1-99_ge75" | "100-299" | ">=300";

type Inputs = {
  scenario: Scenario | "";
  // labs
  ldl: string;
  hdl: string;
  tg: string;
  totalChol: string;
  apoB: string;
  lpa: string;
  hsCrp: string;
  // demographics
  ageMale45OrFemale55: boolean;
  smoking: boolean;
  htn: boolean;
  lowHdl: boolean;
  // high-risk features
  famHxPremature: boolean;
  ckd3b4: boolean;
  apoBHigh: boolean;
  lpaHigh: boolean;
  metSyn: boolean;
  naflFibrosis: boolean;
  // ACS specifics
  acsGroup: StatinGroup | "";
  // DM specifics
  dmAscvd: DmAscvd | "";
  dmMods: DmModifiers | "";
  // CAC
  cac: CacRange;
  // recurrent
  recurrentEvent: boolean;
};

const EMPTY: Inputs = {
  scenario: "",
  ldl: "",
  hdl: "",
  tg: "",
  totalChol: "",
  apoB: "",
  lpa: "",
  hsCrp: "",
  ageMale45OrFemale55: false,
  smoking: false,
  htn: false,
  lowHdl: false,
  famHxPremature: false,
  ckd3b4: false,
  apoBHigh: false,
  lpaHigh: false,
  metSyn: false,
  naflFibrosis: false,
  acsGroup: "",
  dmAscvd: "",
  dmMods: "",
  cac: "",
  recurrentEvent: false,
};

type RiskGroup =
  | "LOW"
  | "MOD"
  | "HR"
  | "VHR"
  | "EHR-A"
  | "EHR-B"
  | "EHR-C";

type Result = {
  group: RiskGroup;
  groupLabel: string;
  ldlTarget: string;
  nonHdlTarget: string;
  apoBTarget: string;
  intensity: string;
  initialRx: string[];
  escalation: string[];
  followUp: { week: string; action: string }[];
  notes: string[];
  triglycerideTrack?: string[];
};

const GROUP_LABEL: Record<RiskGroup, string> = {
  LOW: "Low risk",
  MOD: "Moderate risk",
  HR: "High risk",
  VHR: "Very high risk",
  "EHR-A": "Extreme risk — Category A",
  "EHR-B": "Extreme risk — Category B",
  "EHR-C": "Extreme risk — Category C (recurrent despite LDL ~30)",
};

const TARGETS: Record<
  RiskGroup,
  { ldl: string; nonHdl: string; apoB: string }
> = {
  LOW: { ldl: "<100 mg/dL", nonHdl: "<130 mg/dL", apoB: "<90 mg/dL" },
  MOD: {
    ldl: "<100 mg/dL (optional <70)",
    nonHdl: "<130 mg/dL",
    apoB: "<90 mg/dL",
  },
  HR: { ldl: "<70 mg/dL", nonHdl: "<100 mg/dL", apoB: "<80 mg/dL" },
  VHR: { ldl: "<50 mg/dL", nonHdl: "<80 mg/dL", apoB: "<65 mg/dL" },
  "EHR-A": {
    ldl: "<50 mg/dL (optional ≤30)",
    nonHdl: "<60 mg/dL",
    apoB: "<50 mg/dL",
  },
  "EHR-B": { ldl: "≤30 mg/dL", nonHdl: "<60 mg/dL", apoB: "<50 mg/dL" },
  "EHR-C": {
    ldl: "Consider further lowering to 10–15 mg/dL",
    nonHdl: "<60 mg/dL",
    apoB: "<50 mg/dL",
  },
};

function countMajorRF(i: Inputs): number {
  let n = 0;
  if (i.ageMale45OrFemale55) n++;
  if (i.smoking) n++;
  if (i.htn) n++;
  if (i.lowHdl) n++;
  return n;
}
function countHighRiskFeatures(i: Inputs): number {
  let n = 0;
  if (i.famHxPremature) n++;
  if (i.ckd3b4) n++;
  if (i.apoBHigh) n++;
  if (i.lpaHigh) n++;
  if (i.metSyn) n++;
  if (i.naflFibrosis) n++;
  return n;
}

function classifyGeneral(i: Inputs): RiskGroup {
  const ldl = parseFloat(i.ldl);
  const rf = countMajorRF(i);
  const hrf = countHighRiskFeatures(i);

  if (i.cac === ">=300") return "EHR-A";
  if (i.cac === "100-299" || i.cac === "1-99_ge75") return "VHR";

  if (!Number.isNaN(ldl) && ldl >= 190) return "VHR";
  if (hrf >= 2) return "VHR";
  if (hrf >= 1) return "HR";
  if (!Number.isNaN(ldl) && ldl >= 160) return "HR";
  if (rf >= 3) return "HR";
  if (rf === 2) return "MOD";
  if (!Number.isNaN(ldl) && ldl >= 130) return "MOD";
  return "LOW";
}

function classifyDm(i: Inputs): RiskGroup {
  const ascvd = i.dmAscvd === "yes";
  const heavy = i.dmMods === "tod_or_2rf";
  if (ascvd && heavy) return "EHR-B";
  if (ascvd && !heavy) return "EHR-A";
  if (!ascvd && heavy) return "VHR";
  return "HR";
}

function buildResult(i: Inputs): Result | null {
  if (!i.scenario) return null;

  // Recurrent override
  if (i.scenario === "recurrent" || i.recurrentEvent) {
    const g: RiskGroup = "EHR-C";
    return {
      group: g,
      groupLabel: GROUP_LABEL[g],
      ldlTarget: TARGETS[g].ldl,
      nonHdlTarget: TARGETS[g].nonHdl,
      apoBTarget: TARGETS[g].apoB,
      intensity: "Maximally tolerated statin + ezetimibe + PCSK9i",
      initialRx: [
        "Continue maximally tolerated high-intensity statin + ezetimibe",
        "Add PCSK9 inhibitor if not already on one",
        "Consider bempedoic acid / bile acid sequestrant if still above goal",
      ],
      escalation: [
        "Myocardial revascularization as indicated",
        "Aggressive lifestyle management; control every modifiable risk factor",
        "SGLT2i and/or GLP-1 RA for metabolic residual risk",
        "Icosapent ethyl 2 g BID if TG elevated",
        "Colchicine 0.5 mg/day if hsCRP > 2 mg/L",
        "DAPT including ticagrelor, or aspirin + low-dose rivaroxaban for thrombotic residual risk",
        "Consider lipoprotein apheresis if refractory",
      ],
      followUp: [
        { week: "4 wk", action: "Extended lipid profile incl. Apo-B" },
        { week: "8 wk", action: "Repeat lipid profile; escalate if not at goal" },
        { week: "12 wk", action: "Reassess; target LDL ~10–15 mg/dL if events persist" },
      ],
      notes: ["Recurrent CV event despite LDL ~30 mg/dL → Extreme-Risk Category C."],
    };
  }

  if (i.scenario === "acs") {
    const g: RiskGroup = "EHR-A";
    const base =
      i.acsGroup === "intolerant"
        ? ["Low-dose statin + ezetimibe (statin intolerant)"]
        : ["Start/continue high-intensity statin + ezetimibe"];
    const lpa = parseFloat(i.lpa);
    return {
      group: g,
      groupLabel: "ACS — Extreme risk (post-ACS)",
      ldlTarget: "<50 mg/dL (≤30 mg/dL if feasible)",
      nonHdlTarget: "<60 mg/dL",
      apoBTarget: "<50 mg/dL",
      intensity:
        i.acsGroup === "intolerant"
          ? "Low-dose statin + ezetimibe"
          : "High-intensity statin + ezetimibe",
      initialRx: [
        "On admission: send extended lipid panel incl. Lp(a) at triage",
        ...base,
        "Consider bempedoic acid, bile acid sequestrant, or PCSK9i during admission to reach LDL <50 (or ≤30)",
        !Number.isNaN(lpa) && lpa > 50
          ? "Lp(a) > 50 mg/dL → add PCSK9 inhibitor"
          : "If Lp(a) > 50 mg/dL → add PCSK9 inhibitor",
      ],
      escalation: [
        "If not at goal: add remaining LDL-lowering drugs",
        "Refractory after PCSK9i: consider lipoprotein apheresis",
      ],
      followUp: [
        { week: "2 wk", action: "Extended lipid profile; intensify if not at goal" },
        { week: "4 wk", action: "Extended lipid profile; escalate / consider newer agents" },
      ],
      notes: [
        "All post-ACS patients are extreme-risk regardless of baseline LDL.",
      ],
    };
  }

  if (i.scenario === "dm") {
    const g = classifyDm(i);
    return {
      group: g,
      groupLabel: `Diabetes — ${GROUP_LABEL[g]}`,
      ldlTarget: TARGETS[g].ldl,
      nonHdlTarget: TARGETS[g].nonHdl,
      apoBTarget: TARGETS[g].apoB,
      intensity:
        g === "EHR-A" || g === "EHR-B"
          ? "High-intensity statin + ezetimibe ± PCSK9i"
          : g === "VHR"
            ? "High-intensity statin + ezetimibe"
            : "Moderate–high-intensity statin",
      initialRx: [
        "At diagnosis: send lipid profile incl. Apo-B and Lp(a)",
        "Week 0: start LDL-lowering Rx based on % reduction needed",
        parseFloat(i.tg) > 500
          ? "TG > 500 mg/dL → add fibrate"
          : "Add fibrate only if TG > 500 mg/dL",
        "SGLT2i / GLP-1 RA if not contraindicated",
      ],
      escalation: [
        "Add ezetimibe → bempedoic acid → PCSK9i sequentially until goal",
        "Persistent TG > 150 mg/dL on statin → add icosapent ethyl 2 g BID",
        "Consider familial hypercholesterolemia if LDL stays high",
      ],
      followUp: [
        { week: "4 wk", action: "Repeat lipid profile incl. Apo-B" },
        { week: "8 wk", action: "Repeat lipid profile; if all targets met → maintain" },
      ],
      notes: [
        "Aggressive lifestyle + glycemic control alongside lipid Rx.",
      ],
    };
  }

  if (i.scenario === "htg") {
    const tg = parseFloat(i.tg);
    const track: string[] = [];
    let urgency = "Lifestyle + assess ASCVD risk";

    if (!Number.isNaN(tg)) {
      if (tg >= 1000) {
        urgency = "Treat urgently — markedly increased pancreatitis risk";
        track.push("Fibrate first-line (fenofibrate)");
        track.push("Strict low-fat diet, abstain from alcohol");
        track.push("Add omega-3 fatty acids (4 g/day)");
        track.push("Treat secondary causes (DM, hypothyroidism)");
      } else if (tg >= 500) {
        urgency = "Treat — pancreatitis + ASCVD risk";
        track.push("Fibrate ± omega-3");
        track.push("Initiate statin once TG < 500");
      } else if (tg >= 200) {
        urgency = "Statin-first; address residual TG with icosapent ethyl";
        track.push("Statin ± ezetimibe to LDL goal");
        track.push("Icosapent ethyl 2 g BID if TG 150–499 on statin and ASCVD/high-risk");
      } else if (tg >= 150) {
        urgency = "Lifestyle; statin if ASCVD risk warrants";
        track.push("Lifestyle measures; statin per ASCVD risk");
      }
    }

    const g = classifyGeneral(i);
    return {
      group: g,
      groupLabel: `Hypertriglyceridemia — ${GROUP_LABEL[g]} background`,
      ldlTarget: TARGETS[g].ldl,
      nonHdlTarget: TARGETS[g].nonHdl,
      apoBTarget: TARGETS[g].apoB,
      intensity: urgency,
      initialRx: [
        "Low-fat diet, avoid refined carbs, weight loss + exercise",
        "Avoid alcohol; no smoking",
        "Control secondary causes (DM, hypothyroidism, drugs)",
      ],
      escalation: [
        "If TG / non-HDL remain high → fibrate + omega-3 (preferably icosapent ethyl)",
        "Refractory very high TG → lipid specialist; consider genetic testing & newer drugs",
      ],
      followUp: [
        { week: "4 wk", action: "Lipid profile; assess TG trend" },
        { week: "8 wk", action: "Lipid profile; escalate if non-HDL/Apo-B above goal" },
      ],
      notes: [
        "Goal: achieve LDL, non-HDL, and Apo-B targets per LAI.",
      ],
      triglycerideTrack: track,
    };
  }

  // general
  const g = classifyGeneral(i);
  return {
    group: g,
    groupLabel: GROUP_LABEL[g],
    ldlTarget: TARGETS[g].ldl,
    nonHdlTarget: TARGETS[g].nonHdl,
    apoBTarget: TARGETS[g].apoB,
    intensity:
      g === "LOW"
        ? "Lifestyle; statin only if risk modifiers"
        : g === "MOD"
          ? "Lifestyle + moderate-intensity statin"
          : g === "HR"
            ? "High-intensity statin"
            : g === "VHR"
              ? "High-intensity statin + ezetimibe"
              : "High-intensity statin + ezetimibe ± PCSK9i",
    initialRx: [
      "Send extended lipid panel incl. Apo-B and Lp(a) if not done",
      "Calculate % LDL reduction required and start statin accordingly",
      parseFloat(i.tg) > 500 ? "TG > 500 → add fibrate" : "Add fibrate only if TG > 500",
    ],
    escalation: [
      "Week 4 & 8: recheck lipid panel incl. Apo-B",
      "Add ezetimibe → bempedoic acid → PCSK9i sequentially",
      "Consider familial hypercholesterolemia if LDL persistently high",
    ],
    followUp: [
      { week: "4 wk", action: "Lipid profile incl. Apo-B" },
      { week: "8 wk", action: "Lipid profile; escalate if not at goal" },
    ],
    notes: ["Aim to reach LDL, non-HDL, and Apo-B targets at the earliest."],
  };
}

/* ---------- UI helpers ---------- */

// Range buckets — each option's `value` is the midpoint/representative used by the algorithm
type RangeOpt = { label: string; value: string };
const RANGES: Record<string, RangeOpt[]> = {
  ldl: [
    { label: "< 55 mg/dL", value: "40" },
    { label: "55 – 69", value: "62" },
    { label: "70 – 99", value: "85" },
    { label: "100 – 129", value: "115" },
    { label: "130 – 159", value: "145" },
    { label: "160 – 189", value: "175" },
    { label: "≥ 190", value: "200" },
  ],
  hdl: [
    { label: "< 40 mg/dL (low)", value: "35" },
    { label: "40 – 59", value: "50" },
    { label: "≥ 60", value: "65" },
  ],
  tg: [
    { label: "< 150 mg/dL", value: "120" },
    { label: "150 – 199", value: "175" },
    { label: "200 – 499", value: "350" },
    { label: "500 – 999", value: "750" },
    { label: "≥ 1000", value: "1200" },
  ],
  totalChol: [
    { label: "< 200 mg/dL", value: "180" },
    { label: "200 – 239", value: "220" },
    { label: "≥ 240", value: "260" },
  ],
  apoB: [
    { label: "< 80 mg/dL", value: "70" },
    { label: "80 – 99", value: "90" },
    { label: "100 – 129", value: "115" },
    { label: "≥ 130", value: "140" },
  ],
  lpa: [
    { label: "< 30 mg/dL", value: "20" },
    { label: "30 – 49", value: "40" },
    { label: "50 – 99", value: "75" },
    { label: "≥ 100", value: "120" },
  ],
  hsCrp: [
    { label: "< 1 mg/L (low risk)", value: "0.5" },
    { label: "1 – 2 (avg)", value: "1.5" },
    { label: "> 2 – 10 (high)", value: "5" },
    { label: "> 10 (acute/inflammation)", value: "15" },
  ],
};

function RangeField({
  label,
  fieldKey,
  value,
  onChange,
}: {
  label: string;
  fieldKey: keyof typeof RANGES;
  value: string;
  onChange: (v: string) => void;
}) {
  const opts = RANGES[fieldKey];
  // Map current numeric value back to a label for display
  const matched = opts.find((o) => o.value === value);
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-xs">
          <SelectValue placeholder="Select range">
            {matched?.label ?? "Select range"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {opts.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-card text-muted-foreground hover:bg-muted/40"
      }`}
    >
      {children}
    </button>
  );
}

function ScenarioCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border p-3 transition-all ${
        active
          ? "border-primary bg-primary/[0.08] shadow-sm"
          : "border-border bg-card hover:bg-muted/30"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            active ? "bg-primary/20 text-primary" : "bg-muted text-foreground"
          }`}
        >
          {icon}
        </span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug">{subtitle}</p>
    </button>
  );
}

/* ---------- main component ---------- */
export default function LipidMiniApp() {
  const [i, setI] = useState<Inputs>(EMPTY);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) =>
    setI((p) => ({ ...p, [k]: v }));

  const result = useMemo(() => buildResult(i), [i]);
  const showLabs = i.scenario !== "";
  const showGeneralRF = i.scenario === "general" || i.scenario === "htg";
  const showHighRiskFeatures =
    i.scenario === "general" || i.scenario === "htg";
  const showCac = i.scenario === "general";
  const showAcsBlock = i.scenario === "acs";
  const showDmBlock = i.scenario === "dm";
  const showTgBlock = i.scenario === "htg";

  // ----- Export helpers -----
  const buildSummaryText = (): string => {
    if (!result) return "";
    const labelFor = (k: keyof typeof RANGES, v: string) =>
      RANGES[k].find((o) => o.value === v)?.label ?? "—";
    const labs = [
      `LDL-C: ${labelFor("ldl", i.ldl)}`,
      `HDL-C: ${labelFor("hdl", i.hdl)}`,
      `Triglycerides: ${labelFor("tg", i.tg)}`,
      `Total cholesterol: ${labelFor("totalChol", i.totalChol)}`,
      `Apo-B: ${labelFor("apoB", i.apoB)}`,
      `Lp(a): ${labelFor("lpa", i.lpa)}`,
      `hsCRP: ${labelFor("hsCrp", i.hsCrp)}`,
    ].join("\n  ");
    const date = new Date().toLocaleString();
    return [
      `LIPID MANAGEMENT — Clinical Summary`,
      `Generated: ${date}`,
      ``,
      `Scenario: ${i.scenario.toUpperCase()}`,
      `Risk classification: ${result.groupLabel} [${result.group}]`,
      ``,
      `LABS (selected ranges):`,
      `  ${labs}`,
      ``,
      `TARGETS:`,
      `  LDL-C: ${result.ldlTarget}`,
      `  Non-HDL-C: ${result.nonHdlTarget}`,
      `  Apo-B: ${result.apoBTarget}`,
      ``,
      `THERAPY INTENSITY:`,
      `  ${result.intensity}`,
      ``,
      `INITIAL Rx:`,
      ...result.initialRx.map((x) => `  • ${x}`),
      ``,
      ...(result.triglycerideTrack?.length
        ? [`TG-SPECIFIC TRACK:`, ...result.triglycerideTrack.map((x) => `  • ${x}`), ``]
        : []),
      `ESCALATION:`,
      ...result.escalation.map((x) => `  • ${x}`),
      ``,
      `FOLLOW-UP:`,
      ...result.followUp.map((f) => `  ${f.week} — ${f.action}`),
      ``,
      ...(result.notes.length ? [`NOTES:`, ...result.notes.map((n) => `  • ${n}`)] : []),
      ``,
      `— Per LAI 2023 lipid algorithm. Clinical decision support; verify before prescribing.`,
    ].join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      toast({ title: "Copied", description: "Summary copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Clipboard unavailable.", variant: "destructive" });
    }
  };

  const handlePrint = () => {
    if (!result) return;
    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) return;
    const txt = buildSummaryText()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    w.document.write(`<!doctype html><html><head><title>Lipid Plan Summary</title>
<style>
  body { font-family: ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
         padding: 32px; color: #0c2340; max-width: 800px; margin: 0 auto; line-height: 1.45; }
  h1 { font-size: 18px; border-bottom: 2px solid #2d8a9e; padding-bottom: 6px; margin: 0 0 12px; }
  pre { white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
  .meta { color: #5cbdb9; font-size: 11px; margin-bottom: 16px; }
  @media print { body { padding: 16px; } }
</style></head><body>
<h1>Lipid Management — Clinical Summary</h1>
<div class="meta">Generated ${new Date().toLocaleString()}</div>
<pre>${txt}</pre>
<script>window.onload = () => { window.print(); };</script>
</body></html>`);
    w.document.close();
  };


  return (
    <div className="space-y-5">
      <SectionCard
        title="Lipid Management Mini-App"
        icon={<Activity className="h-4 w-4" />}
        tone="primary"
        collapsible={false}
      >
        <p className="text-xs text-muted-foreground mb-4">
          Pick the clinical scenario, fill only what's asked, and get an LAI 2023–aligned plan computed locally on this page.
        </p>

        {/* Scenario picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
          <ScenarioCard
            active={i.scenario === "acs"}
            onClick={() => set("scenario", "acs")}
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            title="ACS"
            subtitle="Acute coronary syndrome / post-ACS"
          />
          <ScenarioCard
            active={i.scenario === "dm"}
            onClick={() => set("scenario", "dm")}
            icon={<Droplet className="h-3.5 w-3.5" />}
            title="Diabetes"
            subtitle="DM ± ASCVD"
          />
          <ScenarioCard
            active={i.scenario === "htg"}
            onClick={() => set("scenario", "htg")}
            icon={<Activity className="h-3.5 w-3.5" />}
            title="Hypertriglyceridemia"
            subtitle="TG-driven track"
          />
          <ScenarioCard
            active={i.scenario === "general"}
            onClick={() => set("scenario", "general")}
            icon={<Stethoscope className="h-3.5 w-3.5" />}
            title="Primary prevention"
            subtitle="LAI risk stratification"
          />
          <ScenarioCard
            active={i.scenario === "recurrent"}
            onClick={() => set("scenario", "recurrent")}
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            title="Recurrent event"
            subtitle="Event despite LDL ~30"
          />
        </div>

        {/* Labs — only after scenario chosen */}
        {showLabs && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <RangeField label="LDL-C" fieldKey="ldl" value={i.ldl} onChange={(v) => set("ldl", v)} />
            <RangeField label="HDL-C" fieldKey="hdl" value={i.hdl} onChange={(v) => set("hdl", v)} />
            <RangeField label="Triglycerides" fieldKey="tg" value={i.tg} onChange={(v) => set("tg", v)} />
            <RangeField label="Total cholesterol" fieldKey="totalChol" value={i.totalChol} onChange={(v) => set("totalChol", v)} />
            <RangeField label="Apo-B" fieldKey="apoB" value={i.apoB} onChange={(v) => set("apoB", v)} />
            <RangeField label="Lp(a)" fieldKey="lpa" value={i.lpa} onChange={(v) => set("lpa", v)} />
            <RangeField label="hsCRP" fieldKey="hsCrp" value={i.hsCrp} onChange={(v) => set("hsCrp", v)} />
          </div>
        )}

        {/* ACS context-aware block */}
        {showAcsBlock && (
          <div className="mb-4">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Pre-admission statin status
            </Label>
            <div className="flex flex-wrap gap-2">
              <Chip active={i.acsGroup === "naive"} onClick={() => set("acsGroup", "naive")}>
                Group 1 — Statin-naive
              </Chip>
              <Chip active={i.acsGroup === "low_mod"} onClick={() => set("acsGroup", "low_mod")}>
                Group 2 — Low/Mod intensity
              </Chip>
              <Chip active={i.acsGroup === "high"} onClick={() => set("acsGroup", "high")}>
                Group 3 — High intensity
              </Chip>
              <Chip active={i.acsGroup === "intolerant"} onClick={() => set("acsGroup", "intolerant")}>
                Group 4 — Statin intolerant
              </Chip>
            </div>
          </div>
        )}

        {/* DM context-aware block */}
        {showDmBlock && (
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Established ASCVD?
              </Label>
              <div className="flex gap-2">
                <Chip active={i.dmAscvd === "no"} onClick={() => set("dmAscvd", "no")}>No</Chip>
                <Chip active={i.dmAscvd === "yes"} onClick={() => set("dmAscvd", "yes")}>Yes</Chip>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Target-organ damage OR ≥2 ASCVD RFs?
              </Label>
              <div className="flex gap-2">
                <Chip active={i.dmMods === "none"} onClick={() => set("dmMods", "none")}>None / 0–1 RF</Chip>
                <Chip active={i.dmMods === "tod_or_2rf"} onClick={() => set("dmMods", "tod_or_2rf")}>TOD or ≥2 RF</Chip>
              </div>
            </div>
          </div>
        )}

        {/* TG explainer */}
        {showTgBlock && (
          <p className="mb-4 text-[11px] text-muted-foreground italic">
            TG values automatically branch the algorithm: 150–199 / 200–499 / 500–999 / ≥1000.
          </p>
        )}

        {/* Major ASCVD risk factors */}
        {showGeneralRF && (
          <div className="mb-4">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Major ASCVD risk factors
            </Label>
            <div className="flex flex-wrap gap-2">
              <Chip active={i.ageMale45OrFemale55} onClick={() => set("ageMale45OrFemale55", !i.ageMale45OrFemale55)}>
                Age ≥45 ♂ / ≥55 ♀
              </Chip>
              <Chip active={i.smoking} onClick={() => set("smoking", !i.smoking)}>
                Current smoker
              </Chip>
              <Chip active={i.htn} onClick={() => set("htn", !i.htn)}>
                Hypertension
              </Chip>
              <Chip active={i.lowHdl} onClick={() => set("lowHdl", !i.lowHdl)}>
                Low HDL-C
              </Chip>
            </div>
          </div>
        )}

        {/* High-risk features */}
        {showHighRiskFeatures && (
          <div className="mb-4">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              High-risk features
            </Label>
            <div className="flex flex-wrap gap-2">
              <Chip active={i.famHxPremature} onClick={() => set("famHxPremature", !i.famHxPremature)}>
                FHx premature ASCVD
              </Chip>
              <Chip active={i.ckd3b4} onClick={() => set("ckd3b4", !i.ckd3b4)}>
                CKD 3B/4
              </Chip>
              <Chip active={i.apoBHigh} onClick={() => set("apoBHigh", !i.apoBHigh)}>
                Apo-B &gt; 130
              </Chip>
              <Chip active={i.lpaHigh} onClick={() => set("lpaHigh", !i.lpaHigh)}>
                Lp(a) ≥ 50
              </Chip>
              <Chip active={i.metSyn} onClick={() => set("metSyn", !i.metSyn)}>
                Metabolic syndrome
              </Chip>
              <Chip active={i.naflFibrosis} onClick={() => set("naflFibrosis", !i.naflFibrosis)}>
                NAFLD fibrosis 2/3
              </Chip>
            </div>
          </div>
        )}

        {/* CAC */}
        {showCac && (
          <div className="mb-4">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              CAC score (if available)
            </Label>
            <div className="flex flex-wrap gap-2">
              <Chip active={i.cac === ""} onClick={() => set("cac", "")}>Not done</Chip>
              <Chip active={i.cac === "0"} onClick={() => set("cac", "0")}>0</Chip>
              <Chip active={i.cac === "1-99_lt75"} onClick={() => set("cac", "1-99_lt75")}>
                1–99, &lt;75th %ile
              </Chip>
              <Chip active={i.cac === "1-99_ge75"} onClick={() => set("cac", "1-99_ge75")}>
                1–99, ≥75th %ile
              </Chip>
              <Chip active={i.cac === "100-299"} onClick={() => set("cac", "100-299")}>100–299</Chip>
              <Chip active={i.cac === ">=300"} onClick={() => set("cac", ">=300")}>≥300</Chip>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setI(EMPTY)}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
        </div>
      </SectionCard>

      {/* Result */}
      {result && (
        <SectionCard
          title="Computed Plan"
          icon={<Target className="h-4 w-4" />}
          tone="accent"
          collapsible={false}
          badge={
            <Badge variant="outline" className="ml-2 border-accent/40 text-accent">
              {result.group}
            </Badge>
          }
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 justify-end -mt-1">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy summary
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-3.5 w-3.5 mr-1.5" /> Print / PDF
              </Button>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Risk classification
              </p>
              <p className="text-base font-semibold text-foreground">
                {result.groupLabel}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Card className="p-3 border-primary/30 bg-primary/[0.05]">
                <p className="text-[10px] uppercase tracking-wider text-primary font-bold">LDL-C target</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{result.ldlTarget}</p>
              </Card>
              <Card className="p-3 border-accent/30 bg-accent/[0.05]">
                <p className="text-[10px] uppercase tracking-wider text-accent font-bold">Non-HDL-C target</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{result.nonHdlTarget}</p>
              </Card>
              <Card className="p-3 border-warning/30 bg-warning/[0.05]">
                <p className="text-[10px] uppercase tracking-wider text-warning font-bold">Apo-B target</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{result.apoBTarget}</p>
              </Card>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Pill className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-bold text-foreground">Therapy intensity</p>
              </div>
              <p className="text-sm text-foreground">{result.intensity}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <ListChecks className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-bold text-foreground">Initial Rx</p>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                {result.initialRx.map((x, idx) => <li key={idx}>{x}</li>)}
              </ul>
            </div>

            {result.triglycerideTrack && result.triglycerideTrack.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Activity className="h-3.5 w-3.5 text-warning" />
                  <p className="text-xs font-bold text-foreground">TG-specific track</p>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                  {result.triglycerideTrack.map((x, idx) => <li key={idx}>{x}</li>)}
                </ul>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <ScanLine className="h-3.5 w-3.5 text-accent" />
                <p className="text-xs font-bold text-foreground">Escalation</p>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                {result.escalation.map((x, idx) => <li key={idx}>{x}</li>)}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-foreground mb-1.5">Follow-up</p>
              <div className="grid sm:grid-cols-3 gap-2">
                {result.followUp.map((f, idx) => (
                  <Card key={idx} className="p-2.5 border-border bg-card">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.week}</p>
                    <p className="text-xs text-foreground mt-0.5">{f.action}</p>
                  </Card>
                ))}
              </div>
            </div>

            {result.notes.length > 0 && (
              <div className="rounded-md border border-border bg-muted/30 p-2.5">
                {result.notes.map((n, idx) => (
                  <p key={idx} className="text-[11px] text-muted-foreground">• {n}</p>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
