import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplets, Activity, AlertTriangle, Calculator, Pill } from "lucide-react";
import { calculateEGFR } from "@/lib/patient-data";
import { RENAL_DRUGS, bandForEgfr, ckdStageFromEgfr } from "@/lib/renal-dosing";
import { useMode } from "@/hooks/use-mode";

const accent = "#34d399"; // emerald

export default function RenalDisease() {
  const [mode] = useMode();
  const [tab, setTab] = useState("overview");

  // Renal dose calculator
  const [sex, setSex] = useState<"M" | "F">("M");
  const [age, setAge] = useState("60");
  const [creat, setCreat] = useState("1.2");
  const [manualEgfr, setManualEgfr] = useState("");

  const autoEgfr = useMemo(() => {
    const a = parseInt(age);
    const c = parseFloat(creat);
    if (!a || !c) return 0;
    return calculateEGFR(c, a, sex);
  }, [age, creat, sex]);

  const usedEgfr = manualEgfr ? parseFloat(manualEgfr) : autoEgfr;
  const band = usedEgfr > 0 ? bandForEgfr(usedEgfr) : null;
  const ckdStage = usedEgfr > 0 ? ckdStageFromEgfr(usedEgfr) : "—";

  const valueFor = (drug: typeof RENAL_DRUGS[0]) => {
    if (!band) return drug.normal;
    if (band === "normal") return drug.normal;
    if (band === "30-59") return drug.egfr_30_59 || drug.normal;
    if (band === "15-29") return drug.egfr_15_29 || drug.normal;
    return drug.egfr_lt15 || drug.normal;
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <Droplets className="h-6 w-6" style={{ color: accent }} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold tracking-tight">Renal Disease</h1>
            <p className="text-sm text-muted-foreground">AKI · AKD · CKD — KDIGO 2024</p>
          </div>
          <Badge variant="outline" className="ml-auto" style={{ color: accent, borderColor: "rgba(52,211,153,0.3)" }}>{mode === "easy" ? "Easy mode" : "Complex mode"}</Badge>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview"><Activity className="h-4 w-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="aki"><AlertTriangle className="h-4 w-4 mr-2" />AKI/AKD</TabsTrigger>
            <TabsTrigger value="ckd"><Droplets className="h-4 w-4 mr-2" />CKD</TabsTrigger>
            <TabsTrigger value="dosing"><Pill className="h-4 w-4 mr-2" />Renal Dosing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">Definitions (KDIGO)</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>AKI:</strong> ↑ SCr ≥0.3 mg/dL in 48h, or ↑ ≥1.5× baseline in 7d, or UO &lt; 0.5 mL/kg/h for ≥6h.</p>
                <p><strong>AKD (Acute Kidney Disease):</strong> AKI or eGFR &lt; 60 / kidney damage for &lt;3 months.</p>
                <p><strong>CKD:</strong> abnormalities of kidney structure or function present for &gt;3 months. Staged by GFR (G1–G5) and albuminuria (A1–A3).</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aki" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">KDIGO AKI Staging</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-border/60 rounded">
                    <thead className="bg-muted/40">
                      <tr><th className="text-left p-2">Stage</th><th className="text-left p-2">SCr criteria</th><th className="text-left p-2">Urine output</th></tr>
                    </thead>
                    <tbody className="[&>tr]:border-t [&>tr]:border-border/40">
                      <tr><td className="p-2 font-medium">1</td><td className="p-2">1.5–1.9× baseline or ↑ ≥0.3 mg/dL</td><td className="p-2">&lt;0.5 mL/kg/h × 6–12h</td></tr>
                      <tr><td className="p-2 font-medium">2</td><td className="p-2">2.0–2.9× baseline</td><td className="p-2">&lt;0.5 mL/kg/h ≥12h</td></tr>
                      <tr><td className="p-2 font-medium">3</td><td className="p-2">≥3× baseline OR ≥4 mg/dL OR RRT</td><td className="p-2">&lt;0.3 mL/kg/h ≥24h or anuria ≥12h</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {mode === "complex" && (
              <Card>
                <CardHeader><CardTitle className="text-lg">AKI Work-up & Management</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p><strong>Pre-renal:</strong> volume status, FENa &lt;1%, BUN/Cr &gt;20. Fluid challenge.</p>
                  <p><strong>Intrinsic:</strong> urinalysis (casts), CK, complement, ANCA, anti-GBM if indicated. Stop nephrotoxins.</p>
                  <p><strong>Post-renal:</strong> renal USG, bladder scan, relieve obstruction.</p>
                  <p><strong>RRT indications (AEIOU):</strong> Acidosis, Electrolytes (K&gt;6.5), Ingestion, Overload, Uremia (pericarditis, encephalopathy).</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ckd" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">CKD GA Staging (KDIGO)</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Combine GFR category (G1 ≥90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 &lt;15) with albuminuria (A1 &lt;30, A2 30–300, A3 &gt;300 mg/g).</p>
                <p>Refer nephrology: G4–G5, A3, eGFR drop &gt;5/y, refractory HTN/anemia, hyperkalemia, suspected genetic kidney disease.</p>
              </CardContent>
            </Card>
            {mode === "complex" && (
              <Card>
                <CardHeader><CardTitle className="text-lg">CKD Management Pillars</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>1. BP &lt; 120 systolic (SPRINT) using ACEi/ARB titrated to max tolerated.</p>
                  <p>2. SGLT2i (dapa/empa) if eGFR ≥20 — slows progression, regardless of DM.</p>
                  <p>3. Finerenone if T2DM + albuminuria on max ACEi/ARB + K &lt; 5.</p>
                  <p>4. Statin for ASCVD prevention. Anemia: target Hb 10–11.5 (ESA + iron).</p>
                  <p>5. CKD-MBD: phosphate binder if PO₄ rising, active vit D / calcimimetic for SHPT.</p>
                  <p>6. Acidosis: NaHCO₃ if HCO₃ &lt; 22.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dosing" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2"><Calculator className="h-5 w-5" style={{ color: accent }} /><CardTitle className="text-lg">Renal Dose Adjustment</CardTitle></div>
                <p className="text-xs text-muted-foreground">Enter sex + age + creatinine to auto-calculate eGFR (CKD-EPI 2021), or enter eGFR directly</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <Label>Sex</Label>
                    <Select value={sex} onValueChange={(v) => setSex(v as "M" | "F")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Age (y)</Label>
                    <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                  </div>
                  <div>
                    <Label>Creatinine (mg/dL)</Label>
                    <Input type="number" step="0.1" value={creat} onChange={(e) => setCreat(e.target.value)} />
                  </div>
                  <div>
                    <Label>Or eGFR (override)</Label>
                    <Input type="number" placeholder={String(autoEgfr || "")} value={manualEgfr} onChange={(e) => setManualEgfr(e.target.value)} />
                  </div>
                </div>

                {usedEgfr > 0 && (
                  <Alert style={{ borderColor: "rgba(52,211,153,0.4)" }}>
                    <Droplets className="h-4 w-4" style={{ color: accent }} />
                    <AlertTitle>eGFR ≈ {usedEgfr} mL/min/1.73m² · {ckdStage}</AlertTitle>
                    <AlertDescription className="text-xs">Band: {band}. Doses below adjusted automatically.</AlertDescription>
                  </Alert>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-border/60 rounded">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="text-left p-2">Drug</th>
                        <th className="text-left p-2">Class</th>
                        <th className="text-left p-2">Adjusted dose</th>
                      </tr>
                    </thead>
                    <tbody className="[&>tr]:border-t [&>tr]:border-border/40">
                      {RENAL_DRUGS.map((d) => (
                        <tr key={d.drug}>
                          <td className="p-2 font-medium">{d.drug}</td>
                          <td className="p-2 text-muted-foreground">{d.class}</td>
                          <td className="p-2">{valueFor(d)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-muted-foreground">eGFR via CKD-EPI 2021 (race-free). Always confirm dosing in current product information; consider drug levels for narrow-therapeutic-index agents (vancomycin, aminoglycosides, digoxin).</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
