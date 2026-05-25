import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Heart,
  AlertTriangle,
  Target,
  Activity,
  CheckCircle,
  Info,
} from "lucide-react";

// Category colors for hypertension (orange theme)
const categoryColors = {
  accent: "#fb923c",
  bg: "rgba(251,146,60,0.12)",
  border: "rgba(251,146,60,0.2)",
};

// ESC 2024 Blood Pressure Classification
interface BPStage {
  category: string;
  sbp: string;
  dbp: string;
  color: string;
  description: string;
}

const bpClassification: BPStage[] = [
  {
    category: "Optimal",
    sbp: "< 120",
    dbp: "< 80",
    color: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
    description: "Continue healthy lifestyle",
  },
  {
    category: "Normal",
    sbp: "120-129",
    dbp: "80-84",
    color: "bg-green-500/20 text-green-700 border-green-500/30",
    description: "Lifestyle counseling",
  },
  {
    category: "High Normal",
    sbp: "130-139",
    dbp: "85-89",
    color: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    description: "Lifestyle modification, monitor closely",
  },
  {
    category: "Grade 1 Hypertension",
    sbp: "140-159",
    dbp: "90-99",
    color: "bg-orange-500/20 text-orange-700 border-orange-500/30",
    description: "Confirm with repeated measurements; consider pharmacotherapy",
  },
  {
    category: "Grade 2 Hypertension",
    sbp: "160-179",
    dbp: "100-109",
    color: "bg-red-500/20 text-red-700 border-red-500/30",
    description: "Initiate antihypertensive therapy",
  },
  {
    category: "Grade 3 Hypertension",
    sbp: "≥ 180",
    dbp: "≥ 110",
    color: "bg-destructive/20 text-destructive border-destructive/30",
    description: "Urgent evaluation and treatment required",
  },
];

// Risk Stratification
interface RiskFactor {
  category: string;
  factors: string[];
  color: string;
}

const riskFactors: RiskFactor[] = [
  {
    category: "Low Risk",
    factors: ["No risk factors", "No target organ damage"],
    color: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
  },
  {
    category: "Moderate Risk",
    factors: [
      "1-2 risk factors",
      "No target organ damage",
      "No established CVD",
    ],
    color: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  },
  {
    category: "High Risk",
    factors: [
      "≥ 3 risk factors",
      "Target organ damage",
      "Diabetes without organ damage",
      "CKD stage 3",
    ],
    color: "bg-orange-500/20 text-orange-700 border-orange-500/30",
  },
  {
    category: "Very High Risk",
    factors: [
      "Established CVD",
      "CKD stage ≥ 4",
      "Diabetes with organ damage",
      "Grade 3 HTN with risk factors",
    ],
    color: "bg-destructive/20 text-destructive border-destructive/30",
  },
];

// Target BP Guidelines
interface TargetBP {
  population: string;
  target: string;
  evidence: string;
}

const targetBPGuidelines: TargetBP[] = [
  {
    population: "General population (< 65 years)",
    target: "< 130/80 mmHg",
    evidence: "STEP, SPRINT trials",
  },
  {
    population: "Older adults (≥ 65 years)",
    target: "< 140/90 mmHg (SBP 130-139 if tolerated)",
    evidence: "SPRINT, HYVET trials",
  },
  {
    population: "Diabetes",
    target: "< 130/80 mmHg",
    evidence: "ACCORD, ADVANCE trials",
  },
  {
    population: "CKD with proteinuria",
    target: "< 130/80 mmHg (≤ 125/75 if heavy proteinuria)",
    evidence: "KDIGO 2021 guidelines",
  },
  {
    population: "Post-stroke",
    target: "< 130/80 mmHg",
    evidence: "PROGRESS trial",
  },
  {
    population: "CAD/PAD",
    target: "< 130/80 mmHg",
    evidence: "ESC 2024 guidelines",
  },
];

// Secondary Causes Checklist
const secondaryCauses = [
  {
    category: "Renal",
    conditions: [
      "Chronic kidney disease",
      "Polycystic kidney disease",
      "Renovascular disease",
      "Renal parenchymal disease",
    ],
  },
  {
    category: "Endocrine",
    conditions: [
      "Primary aldosteronism",
      "Cushing's syndrome",
      "Pheochromocytoma",
      "Hyper-/Hypothyroidism",
      "Hyperparathyroidism",
      "Acromegaly",
    ],
  },
  {
    category: "Vascular",
    conditions: [
      "Coarctation of aorta",
      "Takayasu arteritis",
      "Fibromuscular dysplasia",
    ],
  },
  {
    category: "Medications/Substances",
    conditions: [
      "NSAIDs",
      "Oral contraceptives",
      "Corticosteroids",
      "Calcineurin inhibitors",
      "Erythropoietin",
      "Decongestants",
      "Licorice",
      "Cocaine/Amphetamines",
    ],
  },
  {
    category: "Sleep",
    conditions: ["Obstructive sleep apnea", "Central sleep apnea"],
  },
];

export default function HypertensionOverview() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Alert for Emergency */}
      <Alert className="border-amber-500/40 bg-amber-500/5">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-700">Hypertensive Crisis Threshold</AlertTitle>
        <AlertDescription className="text-amber-600 text-sm space-y-2">
          <p>
            BP ≥ 180/120 mmHg requires immediate evaluation. If accompanied by acute target organ damage
            (encephalopathy, pulmonary edema, AKI, aortic dissection), treat as hypertensive emergency.
          </p>
          <a href="#htn-crisis-management" className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900">
            → Jump to Hypertensive Crisis Management (grades & IV agents)
          </a>
        </AlertDescription>
      </Alert>

      {/* 5-Step Investigation Flowchart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" style={{ color: categoryColors.accent }} />
            <CardTitle className="text-lg">5-Step Investigation Flowchart</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Stepwise work-up of newly-diagnosed or uncontrolled hypertension (ESC 2024)
          </p>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {[
              { step: 1, title: "Confirm diagnosis", detail: "≥2 office readings on ≥2 visits; confirm with HBPM (≥135/85) or ABPM (24h ≥130/80, daytime ≥135/85, night ≥120/70). Exclude white-coat / masked HTN." },
              { step: 2, title: "History & examination", detail: "Onset, family hx, lifestyle (salt, alcohol, OSA), drugs (NSAIDs, OCP, decongestants, licorice, steroids, stimulants). Exam: BMI, waist, bilateral BP, fundoscopy, carotid/abdominal bruits, peripheral pulses, signs of Cushing/thyroid/CoA." },
              { step: 3, title: "Basic labs & ECG", detail: "Na, K, Cr, eGFR, fasting glucose / HbA1c, lipid panel, TSH, uric acid, urinalysis (protein/blood), urine ACR, Hb, 12-lead ECG." },
              { step: 4, title: "Target organ damage assessment", detail: "Echo (LVH, diastolic function), carotid USG (IMT, plaque), ABI, urine ACR, fundoscopy (Keith-Wagener), cognitive screen if elderly." },
              { step: 5, title: "Secondary HTN screen (if indicated)", detail: "Trigger: onset <30 or >55y, resistant HTN, abrupt worsening, hypokalemia, malignant HTN, suggestive features. → Aldo/renin ratio, plasma/urine metanephrines, renal artery Doppler/CTA, overnight dex suppression, polysomnography. See Secondary HTN Checklist in Assessment tab." },
            ].map((s) => (
              <li key={s.step} className="flex gap-3 p-3 rounded-lg border border-border/60 hover:border-orange-500/30 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: categoryColors.accent }}>
                  {s.step}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Hypertensive Crisis Management */}
      <Card id="htn-crisis-management" className="border-amber-500/40 scroll-mt-24">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Hypertensive Crisis: Grades, Classification & Management</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            ESC 2024 / ACC 2017 — distinguish urgency from emergency to guide rate and route of BP lowering
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">HTN Grades (ESC)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-border/60 rounded">
                <thead className="bg-muted/40">
                  <tr><th className="text-left p-2">Grade</th><th className="text-center p-2">SBP</th><th className="text-center p-2">DBP</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/40"><td className="p-2">Grade 1 (mild)</td><td className="text-center">140–159</td><td className="text-center">90–99</td></tr>
                  <tr className="border-t border-border/40"><td className="p-2">Grade 2 (moderate)</td><td className="text-center">160–179</td><td className="text-center">100–109</td></tr>
                  <tr className="border-t border-border/40"><td className="p-2">Grade 3 (severe)</td><td className="text-center">≥180</td><td className="text-center">≥110</td></tr>
                  <tr className="border-t border-border/40 bg-amber-500/5"><td className="p-2 font-medium">Hypertensive crisis</td><td className="text-center" colSpan={2}>≥180/120</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <p className="text-sm font-semibold text-amber-700 mb-1">Hypertensive Urgency</p>
              <p className="text-xs text-muted-foreground mb-2">SBP ≥180 and/or DBP ≥120 <strong>without</strong> acute target-organ damage.</p>
              <p className="text-xs"><strong>Goal:</strong> reduce BP gradually over 24–48h with PO agents. Outpatient / observation.</p>
              <p className="text-xs mt-2"><strong>Oral options:</strong> Captopril 25mg PO, Labetalol 200–400mg PO, Clonidine 0.1–0.2mg PO, Amlodipine 5–10mg PO, Prazosin 1–2mg PO.</p>
            </div>
            <div className="p-3 rounded-lg border border-red-500/40 bg-red-500/5">
              <p className="text-sm font-semibold text-red-700 mb-1">Hypertensive Emergency</p>
              <p className="text-xs text-muted-foreground mb-2">Severe HTN <strong>with</strong> acute end-organ damage (encephalopathy, ICH, ACS, pulm. edema, aortic dissection, AKI, eclampsia, retinal hemorrhage).</p>
              <p className="text-xs"><strong>Goal:</strong> reduce MAP by ≤25% in 1st hour, then to 160/100 over 2–6h. Aortic dissection: SBP &lt;120 in 20 min. Ischemic stroke: do NOT lower unless &gt;220/120 or thrombolysis planned. ICU + arterial line + IV agent.</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">First-line IV Agents</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-border/60 rounded">
                <thead className="bg-muted/40">
                  <tr><th className="text-left p-2">Agent</th><th className="text-left p-2">Dose</th><th className="text-left p-2">Preferred indication</th></tr>
                </thead>
                <tbody className="[&>tr]:border-t [&>tr]:border-border/40">
                  <tr><td className="p-2 font-medium">Labetalol</td><td className="p-2">10–20 mg IV bolus q10 min (max 300 mg) or 0.5–2 mg/min</td><td className="p-2">Most emergencies, pregnancy, ICH</td></tr>
                  <tr><td className="p-2 font-medium">Nicardipine</td><td className="p-2">5 mg/h IV, titrate by 2.5 mg/h q5–15 min (max 15)</td><td className="p-2">Most emergencies, ICH, ischemic stroke</td></tr>
                  <tr><td className="p-2 font-medium">Esmolol</td><td className="p-2">500 µg/kg load, then 50–300 µg/kg/min</td><td className="p-2">Aortic dissection (with vasodilator), peri-op</td></tr>
                  <tr><td className="p-2 font-medium">Nitroglycerin</td><td className="p-2">5–200 µg/min IV</td><td className="p-2">ACS, acute pulmonary edema</td></tr>
                  <tr><td className="p-2 font-medium">Nitroprusside</td><td className="p-2">0.25–10 µg/kg/min IV</td><td className="p-2">Aortic dissection, refractory (cyanide risk)</td></tr>
                  <tr><td className="p-2 font-medium">Hydralazine</td><td className="p-2">5–10 mg IV q20 min</td><td className="p-2">Eclampsia / pre-eclampsia</td></tr>
                  <tr><td className="p-2 font-medium">Phentolamine</td><td className="p-2">5–15 mg IV bolus</td><td className="p-2">Catecholamine excess (pheo, cocaine, MAOI)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BP Classification Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" style={{ color: categoryColors.accent }} />
            <CardTitle className="text-lg">ESC 2024 BP Classification</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on office blood pressure measurements (mmHg)
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium">Category</th>
                  <th className="text-center py-3 px-2 font-medium">SBP</th>
                  <th className="text-center py-3 px-2 font-medium">DBP</th>
                  <th className="text-left py-3 px-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {bpClassification.map((stage, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedStage(selectedStage === stage.category ? null : stage.category)}
                  >
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={stage.color}>
                        {stage.category}
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-2 font-medium">{stage.sbp}</td>
                    <td className="text-center py-3 px-2 font-medium">{stage.dbp}</td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">{stage.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 inline mr-1" />
              <strong>Note:</strong> When systolic and diastolic values fall into different categories,
              the higher category applies. Classification should be based on at least 2 readings on
              2 separate occasions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Stratification */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" style={{ color: categoryColors.accent }} />
            <CardTitle className="text-lg">Risk Stratification</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on cardiovascular risk factors, target organ damage, and associated conditions
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((risk, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border/60 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={risk.color}>
                    {risk.category}
                  </Badge>
                </div>
                <ul className="space-y-1">
                  {risk.factors.map((factor, fIndex) => (
                    <li key={fIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 mt-1 flex-shrink-0" style={{ color: categoryColors.accent }} />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="cv-risk-factors">
              <AccordionTrigger className="text-sm font-medium">
                CV Risk Factors Details
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <p className="font-medium">Major Risk Factors:</p>
                    <ul className="space-y-1 text-muted-foreground text-xs">
                      <li>• Age (men ≥ 55, women ≥ 65)</li>
                      <li>• Smoking</li>
                      <li>• Dyslipidemia</li>
                      <li>• Family history of premature CVD</li>
                      <li>• Obesity (BMI ≥ 30 kg/m²)</li>
                      <li>• Abdominal obesity (men ≥ 102cm, women ≥ 88cm)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Target Organ Damage:</p>
                    <ul className="space-y-1 text-muted-foreground text-xs">
                      <li>• Left ventricular hypertrophy</li>
                      <li>• Carotid intima-media thickening</li>
                      <li>• Decreased eGFR or elevated creatinine</li>
                      <li>• Microalbuminuria</li>
                      <li>• Retinal changes</li>
                      <li>• Atherosclerotic plaques</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Target BP Guidelines */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" style={{ color: categoryColors.accent }} />
            <CardTitle className="text-lg">Target Blood Pressure Guidelines</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {targetBPGuidelines.map((guideline, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 gap-2"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{guideline.population}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    style={{ color: categoryColors.accent, borderColor: categoryColors.border }}
                  >
                    {guideline.target}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{guideline.evidence}</span>
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-4 border-blue-500/30 bg-blue-500/5">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-600 text-sm">
              Individualize targets based on tolerability. SPRINT trial showed benefit of
              SBP &lt; 120 mmHg in high-risk patients, but may not be appropriate for all.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Secondary Causes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" style={{ color: categoryColors.accent }} />
            <CardTitle className="text-lg">Secondary Causes of Hypertension</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Consider screening when: onset &lt; 30 years, resistant HTN, sudden onset,
            severe HTN, or hypokalemia with normal sodium
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryCauses.map((category, index) => (
              <div key={index} className="p-3 rounded-lg border border-border/50">
                <p className="text-sm font-medium mb-2" style={{ color: categoryColors.accent }}>
                  {category.category}
                </p>
                <ul className="space-y-1">
                  {category.conditions.map((condition, cIndex) => (
                    <li key={cIndex} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs font-medium text-amber-700 mb-2">Screening Recommendations</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Primary aldosteronism: Screen if hypokalemia, resistant HTN, or adrenal incidentaloma</li>
              <li>• Renovascular disease: Consider if sudden onset, flash pulmonary edema, or asymmetric kidneys</li>
              <li>• Pheochromocytoma: Screen if episodic symptoms, family history, or adrenal mass</li>
              <li>• Cushing's: Screen if central obesity, purple striae, proximal myopathy</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
