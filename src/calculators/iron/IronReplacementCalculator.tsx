import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Droplets,
  Syringe,
  Pill,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Weight,
  Heart,
  Home,
  RotateCcw,
  Calculator,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartLabelUpload, IRON_FIELDS } from "@/components/SmartLabelUpload";

// ── Types ──────────────────────────────────────────────────────
type TabKey = "calculator" | "reference" | "about";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "calculator", label: "Calculator", icon: <Calculator className="h-4 w-4" /> },
  { key: "reference", label: "Reference", icon: <BookOpen className="h-4 w-4" /> },
  { key: "about", label: "About", icon: <Info className="h-4 w-4" /> },
];

interface PatientInputs {
  ferritin: string;
  hemoglobin: string;
  weight: string;
  tsat: string;
  serumIron: string;
  tibc: string;
}

interface ClinicalFlags {
  inflammation: boolean;
  pregnancy: boolean;
  ckd: boolean;
  esa: boolean;
  oralIntolerance: boolean;
  rapidCorrection: boolean;
  ongoingBloodLoss: boolean;
}

interface DiagnosisResult {
  diagnosis: string;
  detail: string;
  label: "absolute" | "early" | "borderline" | "functional" | "none" | "other" | "unknown";
}

interface RecommendationResult {
  route: "IV iron" | "Oral iron";
  isIV: boolean;
  deficit: number;
  doseText: string;
  targetHb: number;
}

// ── Logic ──────────────────────────────────────────────────────
function getTSAT(inputs: PatientInputs): number | null {
  if (inputs.tsat && parseFloat(inputs.tsat) > 0) return parseFloat(inputs.tsat);
  const si = parseFloat(inputs.serumIron);
  const tibc = parseFloat(inputs.tibc);
  if (!isNaN(si) && !isNaN(tibc) && tibc > 0) return (si / tibc) * 100;
  return null;
}

function diagnose(ferritin: number, tsat: number, inflammation: boolean): DiagnosisResult {
  const hasInflam = inflammation;
  const ferritinLow = hasInflam ? ferritin < 100 : ferritin < 30;
  const ferritinBorderline = !hasInflam && ferritin >= 30 && ferritin < 100;
  const ferritinFunctional = ferritin >= 100 && ferritin < 300;
  const ferritinReplete = ferritin >= 300;
  const tsatLow = tsat < 20;
  const tsatNormal = tsat >= 20;

  if (ferritinLow && tsatNormal)
    return { diagnosis: "Early / Latent Iron Deficiency", detail: "Depleted iron stores with preserved TSAT. Oral replacement recommended.", label: "early" };

  if (ferritinBorderline && tsatLow)
    return { diagnosis: "Absolute Iron Deficiency (Borderline Stores)", detail: "Low-normal ferritin with low TSAT — consistent with absolute iron deficiency.", label: "absolute" };

  if (ferritinBorderline && tsatNormal)
    return { diagnosis: "Borderline Iron Stores, Normal TSAT", detail: "Ferritin 30–100 suggests marginal stores. Monitor; consider oral iron if symptomatic.", label: "borderline" };

  if (ferritinLow && tsatLow)
    return { diagnosis: "Absolute Iron Deficiency", detail: "Low ferritin and low TSAT — definitive iron deficiency.", label: "absolute" };

  if (ferritinFunctional && tsatLow) {
    if (hasInflam)
      return { diagnosis: "Functional Iron Deficiency", detail: "Ferritin 100–300 with low TSAT in setting of inflammation — iron trapped in stores.", label: "functional" };
    return { diagnosis: "Possible Functional Iron Deficiency", detail: "Ferritin 100–300 with low TSAT without obvious inflammation. Consider other causes.", label: "functional" };
  }

  if (ferritinFunctional && tsatNormal)
    return { diagnosis: "No Iron Deficiency", detail: "Adequate iron stores and normal TSAT.", label: "none" };

  if (ferritinReplete && tsatLow)
    return { diagnosis: "Low TSAT with Replete Ferritin", detail: "Consider other causes: anemia of chronic disease, mixed deficiencies, or lab error.", label: "other" };

  if (ferritinReplete && tsatNormal)
    return { diagnosis: "Iron Deficiency Unlikely", detail: "Adequate iron stores and normal TSAT.", label: "none" };

  return { diagnosis: "Unable to Classify", detail: "Check input values.", label: "unknown" };
}

function getTargetHb(weight: number, pregnancy: boolean, ckd: boolean): number {
  if (pregnancy) return 11;
  if (ckd) return 12;
  if (weight >= 35) return 14;
  return 13;
}

function getIronStores(weight: number): number {
  return weight >= 35 ? 500 : 15 * weight;
}

function recommend(
  dx: DiagnosisResult,
  hb: number,
  weight: number,
  pregnancy: boolean,
  ckd: boolean,
  esa: boolean,
  intolerance: boolean,
  rapid: boolean,
  bloodLoss: boolean
): RecommendationResult {
  const isIV =
    hb < 10 ||
    ckd ||
    dx.label === "functional" ||
    intolerance ||
    rapid ||
    bloodLoss;

  const targetHb = getTargetHb(weight, pregnancy, ckd);
  const stores = getIronStores(weight);
  const rawDeficit = weight * (targetHb - hb) * 2.4 + stores;
  const deficit = Math.max(0, rawDeficit);

  let doseText: string;
  if (isIV) {
    if (deficit <= 500) {
      doseText = `${Math.round(deficit)} mg → 500 mg IV (single dose)`;
    } else if (deficit <= 1000) {
      doseText = `${Math.round(deficit)} mg → 1000 mg IV (single or split)`;
    } else {
      const rounded = Math.ceil(deficit / 100) * 100;
      doseText = `${Math.round(deficit)} mg → ${rounded} mg IV, split 1–2 doses (max 1000–1500 mg/week per product)`;
    }
  } else {
    doseText = "40–65 mg elemental iron daily or every other day (e.g., ferrous sulfate 325 mg = 65 mg elemental)";
  }

  return { route: isIV ? "IV iron" : "Oral iron", isIV, deficit, doseText, targetHb };
}

function buildNotes(
  dx: DiagnosisResult,
  rec: RecommendationResult,
  pregnancy: boolean,
  ckd: boolean,
  esa: boolean,
  intolerance: boolean,
  rapid: boolean,
  bloodLoss: boolean
): string[] {
  const notes: string[] = [];
  if (dx.label === "none" || dx.label === "borderline" || dx.label === "other")
    notes.push("This result does not indicate a clear need for iron replacement. Re-evaluate clinical context.");
  if (pregnancy)
    notes.push("Pregnancy: target Hb 11 g/dL. Oral is first-line unless rapid correction needed.");
  if (ckd)
    notes.push("CKD: target Hb 12 g/dL. IV iron preferred, especially if on ESA.");
  if (rec.isIV && rec.deficit > 0)
    notes.push(`Ganzoni deficit: ${Math.round(rec.deficit)} mg. Target Hb ${rec.targetHb} g/dL.`);
  if (rec.isIV && dx.label === "functional")
    notes.push("Functional iron deficiency: IV iron bypasses hepcidin-mediated block.");
  if (esa)
    notes.push("ESA use: monitor iron status closely; IV iron often needed to support erythropoiesis.");
  return notes;
}

// ── Default State ──────────────────────────────────────────────
const EMPTY_INPUTS: PatientInputs = {
  ferritin: "",
  hemoglobin: "",
  weight: "",
  tsat: "",
  serumIron: "",
  tibc: "",
};

const DEFAULT_FLAGS: ClinicalFlags = {
  inflammation: false,
  pregnancy: false,
  ckd: false,
  esa: false,
  oralIntolerance: false,
  rapidCorrection: false,
  ongoingBloodLoss: false,
};

// ── Diagnosis severity colors ──────────────────────────────────
const dxColors: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  absolute: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", accent: "bg-red-500" },
  early: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", accent: "bg-amber-500" },
  borderline: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", accent: "bg-yellow-500" },
  functional: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", accent: "bg-orange-500" },
  none: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", accent: "bg-emerald-500" },
  other: { bg: "bg-slate-500/10", border: "border-slate-500/30", text: "text-slate-400", accent: "bg-slate-500" },
  unknown: { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-400", accent: "bg-gray-500" },
};

// ── Component ──────────────────────────────────────────────────
export default function IronReplacementCalculator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("calculator");
  const [inputs, setInputs] = useState<PatientInputs>(EMPTY_INPUTS);
  const [flags, setFlags] = useState<ClinicalFlags>(DEFAULT_FLAGS);
  const [calcResult, setCalcResult] = useState<{ tsat: number; dx: DiagnosisResult; rec: RecommendationResult; notes: string[] } | null>(null);

  // Derived TSAT preview
  const previewTSAT = useMemo(() => getTSAT(inputs), [inputs]);

  const hasRequired = inputs.ferritin && inputs.hemoglobin && inputs.weight;
  const tsatReady = previewTSAT !== null;
  const canCalculate = hasRequired && tsatReady;

  function setInput(key: keyof PatientInputs, value: string) {
    setInputs(prev => ({ ...prev, [key]: value }));
    setCalcResult(null);
  }

  function handleSmartParse(values: Record<string, string>) {
    setInputs(prev => ({ ...prev, ...values }));
  }

  function toggleFlag(key: keyof ClinicalFlags) {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleCalculate() {
    const ferritin = parseFloat(inputs.ferritin);
    const hb = parseFloat(inputs.hemoglobin);
    const w = parseFloat(inputs.weight);
    const tsat = previewTSAT!;

    if (isNaN(ferritin) || isNaN(hb) || isNaN(w) || w <= 0 || tsat === null) return;

    const dx = diagnose(ferritin, tsat, flags.inflammation);
    const rec = recommend(dx, hb, w, flags.pregnancy, flags.ckd, flags.esa, flags.oralIntolerance, flags.rapidCorrection, flags.ongoingBloodLoss);
    const notes = buildNotes(dx, rec, flags.pregnancy, flags.ckd, flags.esa, flags.oralIntolerance, flags.rapidCorrection, flags.ongoingBloodLoss);

    setCalcResult({ tsat, dx, rec, notes });
  }

  function handleReset() {
    setInputs(EMPTY_INPUTS);
    setFlags(DEFAULT_FLAGS);
    setCalcResult(null);
  }

  const colors = calcResult ? dxColors[calcResult.dx.label] ?? dxColors.unknown : dxColors.unknown;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-md">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent truncate">
                Iron Replacement Calculator
              </h1>
              <p className="text-xs font-medium text-blue-500 dark:text-blue-400 truncate">
                Evidence-based iron deficiency diagnosis &amp; Ganzoni dosing
              </p>
            </div>
            <div className="flex items-center gap-2 no-print shrink-0">
              <Button variant="ghost" size="sm" onClick={() => navigate("/anemia")} title="Back to Anemia">
                <Home className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset} title="Reset">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-0.5 pb-2 overflow-x-auto no-print">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-5 space-y-6">
        {activeTab === "calculator" && (
          <>
            {/* Disclaimer */}
            <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-800/50 rounded-xl px-4 py-3 text-sm text-amber-300">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
              <p>
                For <strong>educational and decision-support purposes only</strong>. Always correlate with clinical presentation and current guidelines.
              </p>
            </div>

            <SmartLabelUpload fields={IRON_FIELDS.fields} onParse={handleSmartParse} existingValues={inputs} />

            {/* Inputs */}
            <Card className="clinical-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-primary" />
                  Patient Lab Values
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Row 1: Ferritin, Hb, Weight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ferritin">Ferritin <span className="text-destructive">*</span></Label>
                    <Input
                      id="ferritin" type="number" step="0.1" min="0"
                      placeholder="e.g. 15"
                      value={inputs.ferritin}
                      onChange={(e) => setInput("ferritin", e.target.value)}
                    />
                    <span className="text-[11px] text-muted-foreground">ng/mL</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hemoglobin">Hemoglobin <span className="text-destructive">*</span></Label>
                    <Input
                      id="hemoglobin" type="number" step="0.1" min="0"
                      placeholder="e.g. 9.2"
                      value={inputs.hemoglobin}
                      onChange={(e) => setInput("hemoglobin", e.target.value)}
                    />
                    <span className="text-[11px] text-muted-foreground">g/dL</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight <span className="text-destructive">*</span></Label>
                    <Input
                      id="weight" type="number" step="0.1" min="1"
                      placeholder="e.g. 70"
                      value={inputs.weight}
                      onChange={(e) => setInput("weight", e.target.value)}
                    />
                    <span className="text-[11px] text-muted-foreground">kg</span>
                  </div>
                </div>

                {/* Row 2: TSAT or Serum Iron + TIBC */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Transferrin Saturation (TSAT)</Label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex-1 min-w-[120px]">
                      <Input
                        type="number" step="0.1" min="0" max="100"
                        placeholder="Enter TSAT %"
                        value={inputs.tsat}
                        onChange={(e) => setInput("tsat", e.target.value)}
                        className={inputs.tsat ? "border-primary/40" : ""}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="flex-1 min-w-[120px]">
                      <Input
                        type="number" step="0.1" min="0"
                        placeholder="Serum Iron (µg/dL)"
                        value={inputs.serumIron}
                        onChange={(e) => setInput("serumIron", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <Input
                        type="number" step="0.1" min="0"
                        placeholder="TIBC (µg/dL)"
                        value={inputs.tibc}
                        onChange={(e) => setInput("tibc", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Calculator className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      {inputs.tsat
                        ? "✓ Using direct TSAT entry."
                        : inputs.serumIron && inputs.tibc && parseFloat(inputs.tibc) > 0
                        ? `⇢ Calculated TSAT: ${((parseFloat(inputs.serumIron) / parseFloat(inputs.tibc)) * 100).toFixed(1)}%`
                        : "Enter TSAT directly, or Serum Iron + TIBC to auto-calculate."}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Flags */}
            <Card className="clinical-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Clinical Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "inflammation" as keyof ClinicalFlags, label: "Inflammation / Chronic Disease" },
                    { key: "pregnancy" as keyof ClinicalFlags, label: "Pregnancy" },
                    { key: "ckd" as keyof ClinicalFlags, label: "CKD" },
                    { key: "esa" as keyof ClinicalFlags, label: "On ESA" },
                    { key: "oralIntolerance" as keyof ClinicalFlags, label: "Oral Iron Intolerance / Malabsorption / Failure" },
                    { key: "rapidCorrection" as keyof ClinicalFlags, label: "Rapid Correction Needed (Preop / Symptomatic)" },
                    { key: "ongoingBloodLoss" as keyof ClinicalFlags, label: "Ongoing Heavy Blood Loss" },
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      variant={flags[key] ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFlag(key)}
                      className={cn(
                        "text-xs",
                        flags[key] && "bg-primary text-primary-foreground"
                      )}
                    >
                      {flags[key] && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Calculate */}
            <div className="flex gap-3">
              <Button size="lg" onClick={handleCalculate} disabled={!canCalculate}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
              {!canCalculate && (
                <span className="text-xs text-muted-foreground self-center">
                  {!hasRequired ? "Required: Ferritin, Hemoglobin, Weight" : "Enter TSAT or Serum Iron + TIBC"}
                </span>
              )}
            </div>

            {/* Results */}
            {calcResult && (
              <div id="results" className="space-y-5">
                {/* Diagnosis Card */}
                <div className={cn("rounded-xl border-2 p-5", colors.bg, colors.border)}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-3 h-3 rounded-full", colors.accent)} />
                      <h3 className="text-lg font-bold text-foreground">Diagnosis</h3>
                    </div>
                    <Badge variant="outline" className={cn("text-xs font-medium", colors.text)}>
                      TSAT: {calcResult.tsat.toFixed(1)}%
                    </Badge>
                  </div>
                  <p className={cn("text-xl font-extrabold", colors.text)}>{calcResult.dx.diagnosis}</p>
                  <p className="text-sm text-muted-foreground mt-1">{calcResult.dx.detail}</p>
                </div>

                {/* Recommendation Card */}
                <Card className={cn("clinical-card border-2", calcResult.rec.isIV ? "border-sky-500/30" : "border-emerald-500/30")}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      {calcResult.rec.isIV
                        ? <Syringe className="h-5 w-5 text-sky-400" />
                        : <Pill className="h-5 w-5 text-emerald-400" />
                      }
                      {calcResult.rec.isIV ? "IV Iron Recommendation" : "Oral Iron Recommendation"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className={cn("rounded-lg p-3", calcResult.rec.isIV ? "bg-sky-500/10" : "bg-emerald-500/10")}>
                        <p className="text-xs text-muted-foreground">Route</p>
                        <p className="text-lg font-bold">{calcResult.rec.route}</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Ganzoni Deficit</p>
                        <p className="text-lg font-bold">{calcResult.rec.isIV ? `${Math.round(calcResult.rec.deficit)} mg` : "N/A"}</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Target Hb</p>
                        <p className="text-lg font-bold">{calcResult.rec.targetHb} g/dL</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Iron Stores</p>
                        <p className="text-lg font-bold">{getIronStores(parseFloat(inputs.weight))} mg</p>
                      </div>
                    </div>

                    <div className={cn("rounded-xl border p-4", calcResult.rec.isIV ? "border-sky-500/30 bg-sky-500/5" : "border-emerald-500/30 bg-emerald-500/5")}>
                      <div className="flex items-start gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", calcResult.rec.isIV ? "bg-sky-500/20" : "bg-emerald-500/20")}>
                          {calcResult.rec.isIV
                            ? <Syringe className="h-4 w-4 text-sky-400" />
                            : <Pill className="h-4 w-4 text-emerald-400" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Recommended Dose</p>
                          <p className="text-sm text-muted-foreground mt-1">{calcResult.rec.doseText}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Clinical Notes */}
                {calcResult.notes.length > 0 && (
                  <div className="rounded-xl border border-amber-800/40 bg-amber-900/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-400">Clinical Notes</span>
                    </div>
                    <ul className="space-y-1.5">
                      {calcResult.notes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-300/80">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/50 flex-shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* When IV criteria */}
                {calcResult.rec.isIV && (
                  <Card className="clinical-card border-destructive/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        IV Iron Indicated — Criteria Met
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {parseFloat(inputs.hemoglobin) < 10 && (
                          <Badge variant="destructive">Hb &lt; 10 g/dL</Badge>
                        )}
                        {flags.ckd && <Badge variant="destructive">CKD</Badge>}
                        {calcResult.dx.label === "functional" && <Badge variant="destructive">Functional Iron Deficiency</Badge>}
                        {flags.oralIntolerance && <Badge variant="destructive">Oral Intolerance / Malabsorption</Badge>}
                        {flags.rapidCorrection && <Badge variant="destructive">Rapid Correction Needed</Badge>}
                        {flags.ongoingBloodLoss && <Badge variant="destructive">Ongoing Blood Loss</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Reference Tab ──────────────────────────────── */}
        {activeTab === "reference" && (
          <div className="space-y-6">
            <Card className="clinical-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Diagnostic Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Condition</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ferritin (no infl.)</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ferritin (with infl.)</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">TSAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Absolute iron deficiency", "< 30", "< 100", "< 20%"],
                        ["Functional iron deficiency", "100–300", "100–300", "< 20%"],
                        ["Iron deficiency unlikely", "≥ 300", "≥ 300", "≥ 20%"],
                      ].map((row, i) => (
                        <tr key={i} className={cn("border-b border-border", i % 2 === 0 ? "" : "bg-muted/30")}>
                          <td className="py-3 px-4 text-sm font-medium text-foreground">{row[0]}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{row[1]}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{row[2]}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  TSAT = (Serum Iron ÷ TIBC) × 100. TSAT < 20% suggests inadequate iron for erythropoiesis.
                </p>

                <h4 className="text-sm font-semibold text-foreground mt-6 mb-3">Condition-Specific Thresholds for Iron Replacement</h4>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Condition</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ferritin</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">TSAT</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Restless Legs Syndrome (RLS)", "Target > 75–100", "< 45%", "Treat even without anemia. Target ferritin > 100 µg/L to alleviate neurological symptoms."],
                        ["Chronic Heart Failure", "< 100, or 100–299 if TSAT low", "< 20%", "IV iron recommended regardless of anemia status (ESC Guidelines). Improves QoL and exercise capacity."],
                        ["CKD (Non-Dialysis)", "< 100–500", "< 30%", "Higher cutoffs used — inflammation impairs normal iron usage."],
                        ["CKD on Hemodialysis", "< 200", "< 30%", "Aggressively maintained to support RBC production."],
                        ["IBD (Crohn's / UC)", "< 100", "< 20%", "IV iron preferred due to malabsorption and intolerance of oral iron."],
                        ["Pregnancy", "< 30", "< 20%", "Oral first-line unless severe or rapid correction needed."],
                      ].map((row, i) => (
                        <tr key={i} className={cn("border-b border-border", i % 2 === 0 ? "" : "bg-muted/30")}>
                          <td className="py-3 px-4 text-sm font-medium text-foreground">{row[0]}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{row[1]}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{row[2]}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="clinical-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Syringe className="h-4 w-4 text-primary" />
                  IV Iron Indications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {[
                    "Hb < 10 g/dL (severe anemia)",
                    "Chronic kidney disease (especially on ESA)",
                    "Functional iron deficiency (ferritin ≥ 100, TSAT < 20%)",
                    "Oral iron intolerance / malabsorption / failure",
                    "Rapid correction needed (preoperative / symptomatic)",
                    "Ongoing heavy blood loss",
                  ].map((indication, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                      <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                      <span className="text-muted-foreground">{indication}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="clinical-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  Ganzoni Formula Reference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/30 border border-border p-4">
                  <p className="font-mono text-sm">
                    <span className="text-sky-400 font-bold">Total iron deficit (mg)</span> = weight (kg) × [<span className="text-emerald-400">target Hb</span> − <span className="text-red-400">current Hb (g/dL)</span>] × 2.4 + <span className="text-amber-400">iron stores</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Target Hb</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {[
                        ["≥ 35 kg (most adults)", "14 g/dL"],
                        ["< 35 kg", "13 g/dL"],
                        ["Pregnancy", "11 g/dL"],
                        ["CKD", "12 g/dL"],
                      ].map(([desc, val]) => (
                        <div key={desc} className="flex justify-between py-1 border-b border-border/50 last:border-0">
                          <span>{desc}</span>
                          <span className="font-mono font-semibold text-foreground">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Iron Stores</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {[
                        ["≥ 35 kg", "500 mg"],
                        ["< 35 kg", "15 mg/kg"],
                      ].map(([desc, val]) => (
                        <div key={desc} className="flex justify-between py-1 border-b border-border/50 last:border-0">
                          <span>{desc}</span>
                          <span className="font-mono font-semibold text-foreground">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Practical IV Dosing</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {[
                      ["Deficit ≤ 500 mg", "500 mg IV (single or split dose)"],
                      ["Deficit 500–1000 mg", "1000 mg IV (single dose FCM or split)"],
                      ["Deficit > 1000 mg", "Rounded deficit split 1–2 doses (max 1000–1500 mg/week)"],
                    ].map(([def, dose]) => (
                      <div key={def} className="flex justify-between py-1 border-b border-border/50 last:border-0">
                        <span>{def}</span>
                        <span className="font-mono text-xs text-sky-400 text-right">{dose}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example Scenarios */}
            <Card className="clinical-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Example Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase">Scenario</th>
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase">Ferritin</th>
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase">TSAT</th>
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase">Hb</th>
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase">Route</th>
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase">Dose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Classic IDA", "15", "12%", "9.2", "IV", "1200 mg IV (split)"],
                        ["Functional ID (CKD)", "150", "15%", "10.5", "IV", "1000 mg IV (single/split)"],
                        ["Early iron deficiency", "25", "22%", "12.5", "Oral", "40–65 mg elemental Fe daily"],
                        ["Severe IDA", "10", "8%", "7.5", "IV", "~1700 mg IV (split)"],
                        ["Pregnancy IDA", "20", "14%", "10.0", "Oral", "40–65 mg elemental Fe daily"],
                      ].map((row, i) => (
                        <tr key={i} className={cn("border-b border-border", i % 2 === 0 ? "" : "bg-muted/30")}>
                          <td className="py-2.5 px-3 text-sm font-medium text-foreground">{row[0]}</td>
                          <td className="py-2.5 px-3 text-sm text-muted-foreground">{row[1]}</td>
                          <td className="py-2.5 px-3 text-sm text-muted-foreground">{row[2]}</td>
                          <td className="py-2.5 px-3 text-sm text-muted-foreground">{row[3]}</td>
                          <td className="py-2.5 px-3 text-sm">
                            <Badge variant={row[4] === "IV" ? "destructive" : "secondary"} className="text-xs">{row[4]}</Badge>
                          </td>
                          <td className="py-2.5 px-3 text-xs text-muted-foreground font-mono">{row[5]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── About Tab ──────────────────────────────────── */}
        {activeTab === "about" && (
          <div className="space-y-4">
            <Card className="clinical-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  About This Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  This tool implements an evidence-based iron-replacement decision algorithm using ferritin, TSAT, TIBC, serum iron, hemoglobin, weight, and clinical context to provide a diagnosis and concrete replacement recommendation (oral vs IV, plus approximate dose).
                </p>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Key References</h4>
                  <ul className="space-y-1">
                    <li>• <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9827648/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">How to diagnose iron deficiency in chronic disease - PMC</a></li>
                    <li>• <a href="https://www.perinatology.com/calculators/IV-Iron-Dosing-Calculator.htm" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Iron Dosing Calculator (Iron Deficit) - Perinatology.com</a></li>
                    <li>• <a href="https://www2.gov.bc.ca/gov/content/health/practitioner-professional-resources/bc-guidelines/iron-deficiency" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">BC Guidelines: Iron Deficiency – Diagnosis and Management</a></li>
                    <li>• <a href="https://emedicine.medscape.com/article/202333-treatment" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Medscape: Iron Deficiency Anemia Treatment & Management</a></li>
                    <li>• <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4518169/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Intravenous Iron Therapy in Patients with Iron Deficiency Anemia</a></li>
                    <li>• <a href="https://www.omnicalculator.com/health/transferrin" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Transferrin Saturation Calculator - Omni Calculator</a></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
