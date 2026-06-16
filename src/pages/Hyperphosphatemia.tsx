import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle, Droplets, Stethoscope, FlaskConical, Heart,
  HeartPulse, Brain, Pill, Syringe, Activity, Copy,
  Download, Clock, ShieldAlert, ChevronRight, ChevronDown,
  Calculator, Kidney, Zap, Bone,
} from "lucide-react";
import { downloadTextFile } from "@/lib/clinical-utils";
import { toast } from "sonner";

// ══════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════

type Severity = "mild" | "moderate" | "severe" | null;
type CauseBranch = "ckd" | "excess_intake" | "cellular_release" | "other" | null;

interface StepState {
  step1_complete: boolean;
  step2_complete: boolean;
  step3_complete: boolean;
  step4_complete: boolean;
}

// ══════════════════════════════════════════════
// Guidelines
// ══════════════════════════════════════════════

const GUIDELINES = [
  "MSD Manual 2025",
  "KDIGO CKD-MBD",
  "KDOQI",
  "RCH guideline",
];

const DEFINITION = "Serum PO₄ >4.5 mg/dL (>1.46 mmol/L)";

// ══════════════════════════════════════════════
// Severity ranges
// ══════════════════════════════════════════════

const SEVERITY_RANGES = [
  { level: "Mild", range: "4.5–5.5 mg/dL", color: "text-green-400", bg: "bg-green-500/5", border: "border-green-500/20" },
  { level: "Moderate", range: "5.5–7.0 mg/dL", color: "text-yellow-400", bg: "bg-yellow-500/5", border: "border-yellow-500/20" },
  { level: "Severe", range: ">7.0 mg/dL", color: "text-red-400", bg: "bg-red-500/5", border: "border-red-500/20" },
];

// ══════════════════════════════════════════════
// Safety rules
// ══════════════════════════════════════════════

const SAFETY_RULES = [
  {
    icon: <Kidney className="h-4 w-4" />,
    title: "Correct Hypocalcemia If Present",
    detail: "Hyperphosphatemia causes Ca²⁺ × PO₄ precipitation. Check calcium and correct if low to prevent tetany and soft tissue calcification.",
    color: "text-red-500",
    bg: "bg-red-500/5",
    border: "border-red-500/20",
  },
  {
    icon: <Pill className="h-4 w-4" />,
    title: "Use Phosphate Binders with Meals",
    detail: "Binders (Ca-based, sevelamer, lanthanum) must be taken with food to chelate dietary phosphate. Dosing depends on meal size. Start with meals containing the most phosphate.",
    color: "text-amber-500",
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
  },
  {
    icon: <Brain className="h-4 w-4" />,
    title: "Restrict Ca-Based Binders When Hypercalcemic or Low PTH",
    detail: "Risk of vascular calcification — prefer sevelamer or lanthanum in adynamic bone disease / low PTH states.",
    color: "text-purple-500",
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
  },
  {
    icon: <Droplets className="h-4 w-4" />,
    title: "Dialyze When Refractory or Severe",
    detail: "Hemodialysis is the fastest way to remove phosphate. Indicated for severe AKI/CKD with refractory hyperphosphatemia or life-threatening Ca × PO₄ product.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/5",
    border: "border-cyan-500/20",
  },
];

// ══════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════

export default function Hyperphosphatemia() {
  // ── Step 1: Confirm ──
  const [serumPhos, setSerumPhos] = useState("");
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [serumCa, setSerumCa] = useState("");

  // ── Step 2: Severity ──
  const [severity, setSeverity] = useState<Severity>(null);
  const [hasHypocalcemia, setHasHypocalcemia] = useState<boolean | null>(null);
  const [egfr, setEgfr] = useState("");

  // ── Step 3: Treatment ──
  const [dietRestriction, setDietRestriction] = useState<boolean | null>(null);
  const [bindersStarted, setBindersStarted] = useState<boolean | null>(null);

  // ── Step 4: Cause ──
  const [cause, setCause] = useState<CauseBranch>(null);
  const [hasCkd, setHasCkd] = useState<boolean | null>(null);
  const [hasRelease, setHasRelease] = useState<boolean | null>(null);

  // ── UI state ──
  const [expandedSection, setExpandedSection] = useState<string | null>("step1");

  // ── Step progression ──
  const steps: StepState = useMemo(() => ({
    step1_complete: confirmed === true,
    step2_complete: severity !== null,
    step3_complete: dietRestriction !== null,
    step4_complete: cause !== null,
  }), [confirmed, severity, dietRestriction, cause]);

  // ── Unit conversion ──
  const phosMgDl = serumPhos ? parseFloat(serumPhos) : null;
  const phosMmolL = phosMgDl !== null && !isNaN(phosMgDl) ? (phosMgDl / 3.1).toFixed(2) : null;

  // ── Step 1 ──
  const confirmHyperphosphatemia = () => {
    const phos = parseFloat(serumPhos);
    if (isNaN(phos)) { toast.error("Enter serum phosphate"); return; }
    if (phos <= 4.5) { toast.error("PO₄ ≤4.5 mg/dL — not hyperphosphatemia"); return; }
    setConfirmed(true);
    toast.success("Hyperphosphatemia confirmed.");
    setExpandedSection("step2");
  };

  // ── Step 2 ──
  const classifySeverity = () => {
    const phos = parseFloat(serumPhos);
    if (isNaN(phos)) return;
    if (phos > 7.0) { setSeverity("severe"); toast.error("Severe hyperphosphatemia"); }
    else if (phos > 5.5) { setSeverity("moderate"); toast.warning("Moderate hyperphosphatemia"); }
    else { setSeverity("mild"); toast.info("Mild hyperphosphatemia"); }
    setExpandedSection("step3");
  };

  // ── Step 3 ──
  const initTreatment = () => {
    setDietRestriction(true);
    if (severity === "severe" || severity === "moderate" || hasCkd === true) {
      setBindersStarted(true);
      toast.info("Dietary restriction + phosphate binders indicated");
    } else {
      setBindersStarted(false);
      toast.success("Dietary restriction may be sufficient for mild cases");
    }
    setExpandedSection("step4");
  };

  // ── Step 4 ──
  const determineCause = () => {
    if (hasCkd === true) {
      setCause("ckd");
      toast.info("CKD-related — impaired renal excretion");
    } else if (hasRelease === true) {
      setCause("cellular_release");
      toast.info("Cellular release — tumor lysis, rhabdomyolysis, hemolysis");
    } else {
      setCause("excess_intake");
      toast.info("Excess intake — diet, supplements, enemas");
    }
  };

  // ── Clinical note ──
  const generateNote = () => {
    const lines: string[] = [
      "═══ Hyperphosphatemia Clinical Summary ═══",
      `Serum PO₄: ${serumPhos || "—"} mg/dL (${phosMmolL || "—"} mmol/L)`,
      `Serum Ca²⁺: ${serumCa || "—"} mg/dL`,
      "",
    ];
    if (steps.step2_complete) {
      lines.push(`Severity: ${severity?.toUpperCase() || "?"}`);
      lines.push(`eGFR: ${egfr || "—"} mL/min/1.73m²`);
      lines.push(`Hypocalcemia: ${hasHypocalcemia === null ? "?" : hasHypocalcemia ? "Yes" : "No"}`);
      lines.push("");
    }
    if (steps.step3_complete) {
      lines.push("Management:");
      lines.push("  • Dietary phosphate restriction");
      lines.push(bindersStarted ? "  • Phosphate binders (with meals): Ca-based / sevelamer / lanthanum" : "  • No binders needed at this time");
      lines.push("");
    }
    if (steps.step4_complete) {
      lines.push(`Etiology: ${
        cause === "ckd" ? "CKD (impaired excretion)" :
        cause === "cellular_release" ? "Cellular release (tumor lysis / rhabdomyolysis)" :
        "Excess intake"
      }`);
    }
    return lines.join("\n");
  };

  const copyNote = () => { navigator.clipboard.writeText(generateNote()); toast.success("Copied"); };
  const downloadNote = () => { downloadTextFile(generateNote(), `hyperphosphatemia-${Date.now()}.txt`); toast.success("Downloaded"); };
  const resetAll = () => {
    setSerumPhos(""); setConfirmed(null); setSerumCa(""); setSeverity(null);
    setHasHypocalcemia(null); setEgfr(""); setDietRestriction(null); setBindersStarted(null);
    setCause(null); setHasCkd(null); setHasRelease(null); setExpandedSection("step1");
    toast.info("Reset");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bone className="h-6 w-6 text-amber-400" />
            Hyperphosphatemia Decision Support
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{DEFINITION} — {GUIDELINES.join(", ")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyNote}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
          <Button variant="outline" size="sm" onClick={downloadNote}><Download className="h-4 w-4 mr-1" /> Export</Button>
          <Button variant="ghost" size="sm" onClick={resetAll}>Reset</Button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <Badge variant={steps.step1_complete ? "default" : "outline"}>Step 1: Confirm</Badge>
        <ChevronRight className="h-3 w-3" />
        <Badge variant={steps.step2_complete ? "default" : "outline"}>Step 2: Severity</Badge>
        <ChevronRight className="h-3 w-3" />
        <Badge variant={steps.step3_complete ? "default" : "outline"}>Step 3: Treatment</Badge>
        <ChevronRight className="h-3 w-3" />
        <Badge variant={steps.step4_complete ? "default" : "outline"}>Step 4: Cause</Badge>
      </div>

      {/* STEP 1 */}
      <Card className="border-blue-500/20">
        <button onClick={() => setExpandedSection(expandedSection === "step1" ? null : "step1")} className="w-full text-left">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-base">Step 1: Confirm Hyperphosphatemia</CardTitle>
              </div>
              {expandedSection === "step1" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <CardDescription>Check serum phosphate and calcium, assess renal function</CardDescription>
          </CardHeader>
        </button>
        {expandedSection === "step1" && (
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Serum PO₄ (mg/dL)</Label>
                <Input type="number" step="0.1" placeholder="e.g. 6.2" value={serumPhos} onChange={(e) => setSerumPhos(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Serum Ca²⁺ (mg/dL)</Label>
                <Input type="number" step="0.1" placeholder="e.g. 8.5" value={serumCa} onChange={(e) => setSerumCa(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Conversion</Label>
                <div className="text-xs text-muted-foreground p-2 rounded bg-muted/50">
                  {phosMmolL ? <p><span className="font-semibold">{phosMgDl?.toFixed(1)} mg/dL</span> = <span className="font-semibold">{phosMmolL} mmol/L</span></p> : <p>Normal: 2.5–4.5 mg/dL</p>}
                  <p>mg/dL ÷ 3.1 = mmol/L</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-orange-500/10 bg-orange-500/5 text-xs text-muted-foreground">
              <p className="font-semibold text-orange-400 mb-1">⚠ Check Ca × PO₄ product:</p>
              <p>If both elevated → risk of metastatic calcification. Keep Ca × PO₄ &lt;55 mg²/dL² (or &lt;4.4 mmol²/L²).</p>
              {serumCa && phosMgDl && !isNaN(parseFloat(serumCa)) ? (
                <p className="mt-1">
                  Current product: <span className="font-semibold">{(parseFloat(serumCa) * phosMgDl).toFixed(0)}</span> mg²/dL²
                  {(parseFloat(serumCa) * phosMgDl) >= 55 ? <span className="text-red-400"> — HIGH RISK</span> : <span className="text-green-400"> — OK</span>}
                </p>
              ) : null}
            </div>

            <Button onClick={confirmHyperphosphatemia} className="w-full" disabled={!serumPhos}>Confirm Hyperphosphatemia</Button>
            {confirmed === true && (
              <div className="p-3 rounded-lg border bg-amber-500/5 border-amber-500/20 text-sm">
                <p className="font-semibold text-amber-400">⚠ True hyperphosphatemia confirmed</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* STEP 2 */}
      <Card className={`border-${severity ? "green" : "purple"}-500/20 ${!steps.step1_complete ? "opacity-50 pointer-events-none" : ""}`}>
        <button onClick={() => setExpandedSection(expandedSection === "step2" ? null : "step2")} className="w-full text-left">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-base">Step 2: Severity & Risk Assessment</CardTitle>
              </div>
              {expandedSection === "step2" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <CardDescription>Classify severity, check eGFR, assess hypocalcemia risk</CardDescription>
          </CardHeader>
        </button>
        {expandedSection === "step2" && (
          <CardContent className="space-y-4 pt-0">
            <Button onClick={classifySeverity} className="w-full" disabled={!serumPhos}>Classify Severity</Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {SEVERITY_RANGES.map((sr) => (
                <div key={sr.level} className={`p-3 rounded-lg border ${sr.border} ${sr.bg}`}>
                  <div className={`text-sm font-bold ${sr.color}`}>{sr.level}</div>
                  <div className="text-xs text-muted-foreground">{sr.range}</div>
                </div>
              ))}
            </div>

            {severity && (
              <div className={`p-3 rounded-lg border text-sm ${
                severity === "severe" ? "bg-red-500/5 border-red-500/20 text-red-400" :
                severity === "moderate" ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-400" :
                "bg-green-500/5 border-green-500/20 text-green-400"
              }`}>
                <p className="font-semibold">
                  {severity === "severe" && "⚠ Severe (>7.0 mg/dL) — aggressive treatment"}
                  {severity === "moderate" && "⚠ Moderate (5.5–7.0 mg/dL)"}
                  {severity === "mild" && "✓ Mild (4.5–5.5 mg/dL)"}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>eGFR (mL/min/1.73m²)</Label>
                <Input type="number" placeholder="e.g. 35" value={egfr} onChange={(e) => setEgfr(e.target.value)} />
              </div>
              <div>
                <Label className="mb-2 block">Hypocalcemia?</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={hasHypocalcemia === true ? "default" : "outline"} size="sm" onClick={() => setHasHypocalcemia(true)} className={hasHypocalcemia === true ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : ""}>Yes</Button>
                  <Button variant={hasHypocalcemia === false ? "default" : "outline"} size="sm" onClick={() => setHasHypocalcemia(false)}>No</Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* STEP 3 */}
      <Card className={`border-${dietRestriction !== null ? "green" : "rose"}-500/20 ${!steps.step2_complete ? "opacity-50 pointer-events-none" : ""}`}>
        <button onClick={() => setExpandedSection(expandedSection === "step3" ? null : "step3")} className="w-full text-left">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-rose-400" />
                <CardTitle className="text-base">Step 3: Treatment</CardTitle>
              </div>
              {expandedSection === "step3" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <CardDescription>Dietary restriction → Phosphate binders → Dialysis</CardDescription>
          </CardHeader>
        </button>
        {expandedSection === "step3" && (
          <CardContent className="space-y-4 pt-0">
            <Button onClick={initTreatment} className="w-full">Initiate Management</Button>

            <div className="p-4 rounded-lg border border-green-500/10 bg-green-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold text-sm">1. Dietary Phosphate Restriction</h3>
              </div>
              <p className="text-xs text-muted-foreground">Limit high-phosphate foods: dairy, nuts, seeds, organ meats, cola drinks, whole grains. Aim for 800–1000 mg/day in CKD.</p>
            </div>

            <div className={`p-4 rounded-lg border ${bindersStarted === true ? "border-amber-500/20 bg-amber-500/5" : "border-border"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Pill className={`h-5 w-5 ${bindersStarted === true ? "text-amber-400" : "text-muted-foreground"}`} />
                <h3 className="font-semibold text-sm">2. Phosphate Binders</h3>
                {bindersStarted === true && <Badge className="text-[10px] bg-amber-500/20 text-amber-400">INDICATED</Badge>}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• <span className="font-semibold">Must be taken with meals</span> to chelate dietary phosphate</p>
                <p>• <span className="font-semibold">Ca-based:</span> Calcium carbonate / acetate — effective but risk of hypercalcemia</p>
                <p>• <span className="font-semibold">Non-Ca-based:</span> Sevelamer (carbonate/HCl), Lanthanum carbonate</p>
                <p>• <span className="font-semibold">Dosing:</span> Start with largest meal. Titrate based on PO₄ levels.</p>
                <p>• <span className="font-semibold">CKD-MBD:</span> Use non-Ca binders in adynamic bone / low PTH / hypercalcemia</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-cyan-500/10 bg-cyan-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-5 w-5 text-cyan-400" />
                <h3 className="font-semibold text-sm">3. Dialysis (if refractory / severe)</h3>
              </div>
              <p className="text-xs text-muted-foreground">Hemodialysis is fastest PO₄ removal. Indicated for severe AKI/CKD with refractory hyperphosphatemia, life-threatening Ca × PO₄ product.</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* STEP 4 */}
      <Card className={`border-${cause ? "green" : "teal"}-500/20 ${!steps.step3_complete ? "opacity-50 pointer-events-none" : ""}`}>
        <button onClick={() => setExpandedSection(expandedSection === "step4" ? null : "step4")} className="w-full text-left">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-teal-400" />
                <CardTitle className="text-base">Step 4: Find the Cause</CardTitle>
              </div>
              {expandedSection === "step4" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <CardDescription>CKD → Cellular release → Excess intake</CardDescription>
          </CardHeader>
        </button>
        {expandedSection === "step4" && (
          <CardContent className="space-y-4 pt-0">
            <div>
              <Label className="mb-2 block">Does the patient have CKD (eGFR &lt;30) or AKI?</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant={hasCkd === true ? "default" : "outline"} onClick={() => setHasCkd(true)} className={hasCkd === true ? "bg-red-500/20 text-red-400 border-red-500/30" : ""}>Yes — CKD/AKI</Button>
                <Button variant={hasCkd === false ? "default" : "outline"} onClick={() => setHasCkd(false)}>No</Button>
              </div>
            </div>

            {hasCkd === false && (
              <div>
                <Label className="mb-2 block">Evidence of cellular release? (tumor lysis, rhabdomyolysis, hemolysis, acidosis)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={hasRelease === true ? "default" : "outline"} onClick={() => setHasRelease(true)} className={hasRelease === true ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : ""}>Yes</Button>
                  <Button variant={hasRelease === false ? "default" : "outline"} onClick={() => setHasRelease(false)}>No</Button>
                </div>
              </div>
            )}

            <Button onClick={determineCause} className="w-full" disabled={hasCkd === null}>Determine Cause</Button>

            {cause && (
              <div className={`p-4 rounded-lg border ${
                cause === "ckd" ? "border-red-500/20 bg-red-500/5" :
                cause === "cellular_release" ? "border-orange-500/20 bg-orange-500/5" :
                "border-green-500/20 bg-green-500/5"
              }`}>
                <h3 className="text-sm font-bold mb-2">
                  {cause === "ckd" ? "🫘 CKD — Impaired Excretion" :
                   cause === "cellular_release" ? "💥 Cellular Release" :
                   "🍽️ Excess Intake"}
                </h3>
                <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                  {cause === "ckd" && <>
                    <li>eGFR &lt;30 → impaired phosphate excretion</li>
                    <li>Combine dietary restriction + binders + dialysis as needed</li>
                    <li>Monitor Ca × PO₄ product, PTH, vitamin D</li>
                    <li>Avoid Ca-based binders if PTH low / hypercalcemic</li>
                  </>}
                  {cause === "cellular_release" && <>
                    <li>Tumor lysis syndrome, rhabdomyolysis, hemolysis, severe acidosis</li>
                    <li>Treat underlying cause aggressively</li>
                    <li>Rasburicase for tumor lysis (if uric acid also elevated)</li>
                    <li>Dialysis may be needed for severe cases</li>
                  </>}
                  {cause === "excess_intake" && <>
                    <li>Excessive dietary intake, phosphate-containing enemas, supplements</li>
                    <li>Source removal + dietary counseling usually sufficient</li>
                    <li>Binders if moderate-severe or persistent</li>
                  </>}
                </ul>
              </div>
            )}

            <Separator />
            <div className="p-3 rounded-lg border border-blue-500/10 bg-blue-500/5 text-xs text-muted-foreground">
              <p className="font-semibold text-blue-400 mb-1">Common causes summary:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div><p className="font-semibold">🫘 Impaired excretion</p><p>CKD, AKI</p></div>
                <div><p className="font-semibold">💥 Cellular release</p><p>Tumor lysis, rhabdo, hemolysis, acidosis</p></div>
                <div><p className="font-semibold">🍽️ Excess intake</p><p>Diet, enemas, supplements, vitamin D excess</p></div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Safety */}
      <Card className="border-red-500/20">
        <button onClick={() => setExpandedSection(expandedSection === "safety" ? null : "safety")} className="w-full text-left">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <CardTitle className="text-base">⚠ Safety Rules</CardTitle>
              </div>
              {expandedSection === "safety" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <CardDescription>Critical safety rules for hyperphosphatemia management</CardDescription>
          </CardHeader>
        </button>
        {expandedSection === "safety" && (
          <CardContent className="space-y-3 pt-0">
            {SAFETY_RULES.map((rule, i) => (
              <div key={i} className={`p-3 rounded-lg border ${rule.border} ${rule.bg} flex items-start gap-3`}>
                <span className={`mt-0.5 ${rule.color}`}>{rule.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{rule.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{rule.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
