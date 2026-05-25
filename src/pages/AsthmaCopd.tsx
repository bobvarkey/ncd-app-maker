import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Wind, AlertTriangle, Activity, Pill, BookOpen } from "lucide-react";
import { useMode } from "@/hooks/use-mode";

const accent = "#22d3ee"; // cyan

const GINA_STEPS = [
  { step: 1, controller: "Low-dose ICS-formoterol PRN", reliever: "ICS-formoterol PRN", notes: "All adults & adolescents with asthma" },
  { step: 2, controller: "Low-dose ICS-formoterol PRN (MART)", reliever: "ICS-formoterol PRN", notes: "Symptoms ≥2/month" },
  { step: 3, controller: "Low-dose maintenance ICS-formoterol (MART)", reliever: "ICS-formoterol PRN", notes: "Symptoms most days" },
  { step: 4, controller: "Medium-dose ICS-formoterol (MART)", reliever: "ICS-formoterol PRN", notes: "Severe daily symptoms or exacerbation" },
  { step: 5, controller: "High-dose ICS-LABA + add-on (LAMA, biologic)", reliever: "ICS-formoterol PRN", notes: "Refer to specialist; phenotype-guided biologic" },
];

const GOLD_GROUPS = [
  { group: "A", criteria: "0–1 exacerbation, mMRC 0–1, CAT <10", tx: "Bronchodilator (SABA/SAMA or LAMA/LABA)" },
  { group: "B", criteria: "0–1 exacerbation, mMRC ≥2 or CAT ≥10", tx: "LABA + LAMA" },
  { group: "E", criteria: "≥2 mod exacerbations OR ≥1 hospitalization", tx: "LABA + LAMA (+ ICS if eos ≥300)" },
];

const INHALERS = [
  { drug: "Salbutamol (Albuterol)", class: "SABA", brands: "Ventolin, Asthalin, ProAir", dose: "100–200 µg PRN q4–6h" },
  { drug: "Ipratropium", class: "SAMA", brands: "Atrovent", dose: "20–40 µg QID" },
  { drug: "Salmeterol", class: "LABA", brands: "Serevent", dose: "50 µg BD" },
  { drug: "Formoterol", class: "LABA", brands: "Foradil, Oxis", dose: "12 µg BD" },
  { drug: "Tiotropium", class: "LAMA", brands: "Spiriva, Tiova", dose: "18 µg HandiHaler OD or 5 µg Respimat OD" },
  { drug: "Glycopyrronium", class: "LAMA", brands: "Seebri", dose: "50 µg OD" },
  { drug: "Umeclidinium", class: "LAMA", brands: "Incruse", dose: "62.5 µg OD" },
  { drug: "Budesonide", class: "ICS", brands: "Pulmicort, Budecort", dose: "200–800 µg/day" },
  { drug: "Fluticasone propionate", class: "ICS", brands: "Flixotide, Flohale", dose: "100–500 µg BD" },
  { drug: "Beclomethasone", class: "ICS", brands: "Beclate, QVAR", dose: "100–400 µg BD" },
  { drug: "Budesonide/Formoterol", class: "ICS-LABA (MART)", brands: "Symbicort, Foracort", dose: "160/4.5 1–2 puffs BD + PRN" },
  { drug: "Fluticasone/Salmeterol", class: "ICS-LABA", brands: "Seretide, Advair", dose: "100–500/50 BD" },
  { drug: "Fluticasone/Vilanterol", class: "ICS-LABA", brands: "Breo Ellipta", dose: "100/25 OD" },
  { drug: "Tio/Olo/Fluticasone furoate", class: "Triple", brands: "Trelegy", dose: "100/62.5/25 OD" },
  { drug: "Bud/Glyco/Formoterol", class: "Triple", brands: "Breztri", dose: "160/9/4.8 BD" },
];

export default function AsthmaCopd() {
  const [mode] = useMode();
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <Wind className="h-6 w-6" style={{ color: accent }} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold tracking-tight">Asthma & COPD</h1>
            <p className="text-sm text-muted-foreground">GINA 2024 · GOLD 2024 management</p>
          </div>
          <Badge variant="outline" className="ml-auto" style={{ color: accent, borderColor: "rgba(34,211,238,0.3)" }}>{mode === "easy" ? "Easy mode" : "Complex mode"}</Badge>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview"><BookOpen className="h-4 w-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="asthma"><Activity className="h-4 w-4 mr-2" />Asthma (GINA)</TabsTrigger>
            <TabsTrigger value="copd"><Wind className="h-4 w-4 mr-2" />COPD (GOLD)</TabsTrigger>
            <TabsTrigger value="inhalers"><Pill className="h-4 w-4 mr-2" />Inhalers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Quick differentiation</AlertTitle>
              <AlertDescription className="text-sm">
                Asthma: variable airflow limitation, reversible, often atopic, onset childhood, eos-driven. COPD: persistent airflow limitation (post-BD FEV₁/FVC &lt; 0.70), smoking/exposure, neutrophilic, onset &gt;40y.
              </AlertDescription>
            </Alert>
            <Card>
              <CardHeader><CardTitle className="text-lg">Diagnostic criteria</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Asthma:</strong> symptoms (wheeze, cough, dyspnea, chest tightness) + reversible airflow limitation (FEV₁ ↑ &gt;12% & 200mL post-BD, PEF diurnal variation &gt;10%, or improvement after 4-wk ICS).</p>
                <p><strong>COPD:</strong> post-BD FEV₁/FVC &lt; 0.70. Severity by FEV₁% predicted — GOLD 1 ≥80, 2 50–79, 3 30–49, 4 &lt;30.</p>
                <p><strong>ACO (overlap):</strong> features of both; treat as asthma (ICS-containing).</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="asthma" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">GINA 2024 Stepwise Management</CardTitle>
                <p className="text-xs text-muted-foreground">Track 1 (preferred) — ICS-formoterol as reliever throughout</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {GINA_STEPS.map((s) => (
                    <div key={s.step} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge style={{ background: accent, color: "white" }}>Step {s.step}</Badge>
                        <span className="text-sm font-medium">{s.controller}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Reliever: {s.reliever} · {s.notes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {mode === "complex" && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Acute Asthma Exacerbation</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p><strong>Initial:</strong> O₂ to SpO₂ 93–95%, salbutamol 4–10 puffs via spacer q20 min × 3, ipratropium if severe, oral prednisolone 40–50 mg × 5–7 days.</p>
                  <p><strong>Severe:</strong> Continuous neb, IV MgSO₄ 2g over 20 min, ICU if exhaustion / silent chest / PEF &lt; 33% / pCO₂ rising.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="copd" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">GOLD ABE Classification</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {GOLD_GROUPS.map((g) => (
                    <div key={g.group} className="p-3 border rounded-lg">
                      <Badge className="mb-2" style={{ background: accent, color: "white" }}>Group {g.group}</Badge>
                      <p className="text-xs text-muted-foreground mb-2">{g.criteria}</p>
                      <p className="text-sm font-medium">{g.tx}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {mode === "complex" && (
              <Card>
                <CardHeader><CardTitle className="text-lg">COPD Exacerbation Management</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p><strong>SABA/SAMA</strong> neb q4–6h · <strong>Prednisolone</strong> 40 mg PO × 5 days · <strong>Antibiotic</strong> (amox-clav, doxycycline, azithromycin) if purulent sputum or mech ventilation.</p>
                  <p><strong>O₂</strong> target SpO₂ 88–92% (CO₂ retainers). <strong>NIV</strong> for pH &lt; 7.35 + pCO₂ &gt; 45.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inhalers" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">Inhaler Reference</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-border/60 rounded">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="text-left p-2">Drug</th>
                        <th className="text-left p-2">Class</th>
                        <th className="text-left p-2">Brands</th>
                        <th className="text-left p-2">Adult dose</th>
                      </tr>
                    </thead>
                    <tbody className="[&>tr]:border-t [&>tr]:border-border/40">
                      {INHALERS.map((i) => (
                        <tr key={i.drug}>
                          <td className="p-2 font-medium">{i.drug}</td>
                          <td className="p-2 text-muted-foreground">{i.class}</td>
                          <td className="p-2 text-muted-foreground">{i.brands}</td>
                          <td className="p-2">{i.dose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
