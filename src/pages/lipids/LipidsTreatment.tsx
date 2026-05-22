import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SectionCard } from "@/components/ui/section-card";
import {
  Pill,
  AlertCircle,
  TrendingDown,
  Activity,
  Utensils,
  Info,
  ChevronDown,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Statin Intensity Categories
const STATIN_INTENSITY = [
  {
    category: "High-Intensity Statins",
    goal: "LDL-C reduction ≥50%",
    color: "text-danger",
    bgColor: "bg-danger/5",
    borderColor: "border-danger/20",
    statins: [
      { name: "Atorvastatin", dose: "40–80 mg daily" },
      { name: "Rosuvastatin", dose: "20–40 mg daily" },
    ],
    indications: [
      "Clinical ASCVD",
      "LDL-C ≥190 mg/dL",
      "Age 40–75 with diabetes",
      "10-year ASCVD risk ≥20%",
    ],
  },
  {
    category: "Moderate-Intensity Statins",
    goal: "LDL-C reduction 30–49%",
    color: "text-warning",
    bgColor: "bg-warning/5",
    borderColor: "border-warning/20",
    statins: [
      { name: "Atorvastatin", dose: "10–20 mg daily" },
      { name: "Rosuvastatin", dose: "5–10 mg daily" },
      { name: "Simvastatin", dose: "20–40 mg daily" },
      { name: "Pravastatin", dose: "40–80 mg daily" },
      { name: "Pitavastatin", dose: "2–4 mg daily" },
    ],
    indications: [
      "10-year ASCVD risk 7.5–19.9%",
      "Age 40–75 with diabetes + 10-yr risk <7.5%",
      "CAC score 1–99 AU",
    ],
  },
  {
    category: "Low-Intensity Statins",
    goal: "LDL-C reduction <30%",
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
    statins: [
      { name: "Simvastatin", dose: "10 mg daily" },
      { name: "Pravastatin", dose: "10–20 mg daily" },
      { name: "Lovastatin", dose: "20 mg daily" },
      { name: "Fluvastatin", dose: "20–40 mg daily" },
    ],
    indications: [
      "10-year ASCVD risk 5–7.5%",
      "Cannot tolerate moderate intensity",
      "Age >75 with limited life expectancy",
    ],
  },
];

// Add-on Therapy Options
const ADDON_THERAPIES = [
  {
    name: "Ezetimibe",
    class: "Cholesterol Absorption Inhibitor",
    mechanism: "Inhibits intestinal cholesterol absorption",
    ldlReduction: "15–20%",
    firstLine: true,
    dosing: "10 mg once daily",
    notes: "First-line add-on if statin-intolerant or not at goal",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/5",
    borderColor: "border-emerald-500/20",
  },
  {
    name: "PCSK9 Inhibitors",
    class: "PCSK9 Monoclonal Antibodies",
    mechanism: "Increase hepatic LDL receptor recycling",
    ldlReduction: "50–60%",
    firstLine: false,
    agents: [
      { name: "Evolocumab", dosing: "140 mg SC every 2 weeks or 420 mg monthly" },
      { name: "Alirocumab", dosing: "75–150 mg SC every 2 weeks" },
    ],
    indications: [
      "FH (familial hypercholesterolemia)",
      "ASCVD on max statin ± ezetimibe not at goal",
      "Statin intolerance with high-risk features",
    ],
    color: "text-purple-600",
    bgColor: "bg-purple-500/5",
    borderColor: "border-purple-500/20",
  },
  {
    name: "Bempedoic Acid",
    class: "ATP Citrate Lyase Inhibitor",
    mechanism: "Upstream inhibition of cholesterol synthesis",
    ldlReduction: "15–25%",
    firstLine: false,
    dosing: "180 mg once daily",
    notes: "Option for statin-intolerant patients; ↓ CV events in CLEAR trial",
    color: "text-cyan-600",
    bgColor: "bg-cyan-500/5",
    borderColor: "border-cyan-500/20",
  },
  {
    name: "Inclisiran",
    class: "siRNA (PCSK9 synthesis inhibitor)",
    mechanism: "Reduces hepatic PCSK9 synthesis",
    ldlReduction: "50%",
    firstLine: false,
    dosing: "Initial: Day 1, Day 90, then every 6 months",
    notes: "Twice-yearly dosing advantage for adherence",
    color: "text-indigo-600",
    bgColor: "bg-indigo-500/5",
    borderColor: "border-indigo-500/20",
  },
];

// TG Management Protocols
const TG_MANAGEMENT = [
  {
    level: "Borderline High (150–199 mg/dL)",
    action: "Lifestyle intervention",
    color: "text-warning",
    bgColor: "bg-warning/5",
    borderColor: "border-warning/20",
    lifestyle: ["Weight loss (5–10%)", "Reduce refined carbohydrates", "Increase physical activity"],
  },
  {
    level: "High (200–499 mg/dL)",
    action: "Address secondary causes + lifestyle",
    color: "text-orange-600",
    bgColor: "bg-orange-500/5",
    borderColor: "border-orange-500/20",
    lifestyle: [
      "Strict carbohydrate restriction",
      "Limit alcohol",
      "Optimize glycemic control",
      "Consider fenofibrate if ASCVD risk",
    ],
  },
  {
    level: "Very High (≥500 mg/dL)",
    action: "Urgent: Pancreatitis risk",
    color: "text-danger",
    bgColor: "bg-danger/5",
    borderColor: "border-danger/20",
    lifestyle: [
      "Very low-fat diet (<15% calories)",
      "Fibrate (fenofibrate preferred)",
      "Omega-3 fatty acids (2–4 g/day)",
      "Consider insulin if diabetic",
    ],
  },
];

// Treatment Algorithms by Risk Category
const TREATMENT_ALGORITHMS = [
  {
    category: "Very High Risk ASCVD",
    color: "text-danger",
    bgColor: "bg-danger/5",
    borderColor: "border-danger/20",
    steps: [
      "Start high-intensity statin → LDL <55 mg/dL (<1.4 mmol/L)",
      "Add ezetimibe if not at goal",
      "Add PCSK9 inhibitor if still not at goal",
      "Consider bempedoic acid if statin-intolerant",
      "Monitor adherence and lifestyle",
    ],
    targets: {
      ldl: "<55 mg/dL",
      nonHdl: "<85 mg/dL",
      apoB: "<55 mg/dL (optional)",
    },
  },
  {
    category: "High Risk (Not Very High)",
    color: "text-warning",
    bgColor: "bg-warning/5",
    borderColor: "border-warning/20",
    steps: [
      "Start moderate-intensity statin → LDL <70 mg/dL (<1.8 mmol/L)",
      "Add ezetimibe if not at goal",
      "Add bempedoic acid if statin-intolerant",
      "Optional goal: <55 mg/dL if tolerated",
    ],
    targets: {
      ldl: "<70 mg/dL",
      nonHdl: "<100 mg/dL",
      apoB: "<70 mg/dL (optional)",
    },
  },
  {
    category: "Severe Hypercholesterolemia (LDL ≥190)",
    color: "text-purple-600",
    bgColor: "bg-purple-500/5",
    borderColor: "border-purple-500/20",
    steps: [
      "Cascade screening + genetic testing",
      "High-intensity statin immediately",
      "Add ezetimibe",
      "Add PCSK9 inhibitor if not at goal",
      "LDL apheresis for homozygous FH",
    ],
    targets: {
      ldl: "<100 mg/dL (or ↓≥50%)",
      nonHdl: "<130 mg/dL",
      apoB: "<100 mg/dL",
    },
  },
];

// Statin Intolerance Management
const STATIN_INTOLERANCE = [
  {
    step: 1,
    title: "Confirm Intolerance",
    description:
      "Rule out secondary causes (hypothyroidism, drug interactions, vitamin D deficiency)",
    color: "text-primary",
  },
  {
    step: 2,
    title: "Rechallenge",
    description: "Try different statin (hydrophilic: pravastatin, rosuvastatin) or lower dose",
    color: "text-warning",
  },
  {
    step: 3,
    title: "Alternate Day Dosing",
    description: "Long-acting statins (rosuvastatin, atorvastatin) every other day",
    color: "text-orange-600",
  },
  {
    step: 4,
    title: "Non-Statin Therapy",
    description: "Ezetimibe ± bempedoic acid, consider PCSK9i if high risk",
    color: "text-danger",
  },
];

// Lifestyle Recommendations
const LIFESTYLE_RECOMMENDATIONS = [
  {
    category: "Diet",
    icon: Utensils,
    color: "text-emerald-600",
    recommendations: [
      "Reduce saturated fat to <6% of calories",
      "Eliminate trans fats",
      "Increase soluble fiber (oats, legumes) 10–25g/day",
      "Add plant sterols/stanols 2g/day",
      "Consider Mediterranean or DASH diet pattern",
    ],
  },
  {
    category: "Physical Activity",
    icon: Activity,
    color: "text-blue-600",
    recommendations: [
      "Aerobic activity: 150 min/week moderate or 75 min/week vigorous",
      "Resistance training: 2 days/week",
      "Reduce sedentary time",
      "Can raise HDL-C by 5–10%",
    ],
  },
  {
    category: "Weight Management",
    icon: TrendingDown,
    color: "text-purple-600",
    recommendations: [
      "Target 5–10% weight loss if overweight/obese",
      "Every 1 kg loss → LDL-C ↓ ~0.8 mg/dL",
      "Improves TG, HDL-C, and metabolic syndrome",
      "Consider GLP-1 agonists if BMI ≥30 or ≥27 with comorbidities",
    ],
  },
];

// Monitoring Schedule
const MONITORING_SCHEDULE = [
  {
    timing: "Baseline",
    assessments: ["Fasting lipid panel", "ALT", "CK (if muscle symptoms)", "TSH (if indicated)"],
    color: "text-primary",
    bgColor: "bg-primary/5",
  },
  {
    timing: "4–12 weeks after initiation",
    assessments: ["Repeat lipid panel", "Assess adherence", "Check for side effects"],
    color: "text-warning",
    bgColor: "bg-warning/5",
  },
  {
    timing: "Every 3–12 months",
    assessments: ["Lipid panel", "Reinforce lifestyle", "Monitor goals"],
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/5",
  },
];

export default function LipidsTreatment() {
  const [openIntensity, setOpenIntensity] = useState<string | null>("high");
  const [openAlgorithm, setOpenAlgorithm] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Statin Intensity Guide */}
      <Card className="border-blue-500/30 bg-blue-500/5 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
            <Pill className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Statin Intensity Guide</h3>
            <p className="text-sm text-muted-foreground">
              Select appropriate statin intensity based on patient risk profile
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {STATIN_INTENSITY.map((intensity) => (
            <Collapsible
              key={intensity.category}
              open={openIntensity === intensity.category}
              onOpenChange={(open) => setOpenIntensity(open ? intensity.category : null)}
            >
              <div className={`rounded-lg border ${intensity.borderColor} ${intensity.bgColor} overflow-hidden`}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${intensity.color}`}>{intensity.category}</span>
                      <span className="text-xs text-muted-foreground">({intensity.goal})</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openIntensity === intensity.category ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Available Statins:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {intensity.statins.map((statin) => (
                          <div
                            key={statin.name}
                            className="flex justify-between items-center p-2 rounded bg-background border border-border/50 text-sm"
                          >
                            <span className="font-medium">{statin.name}</span>
                            <span className="text-xs text-muted-foreground">{statin.dose}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Indications:</p>
                      <ul className="space-y-1">
                        {intensity.indications.map((ind, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className={`${intensity.color} mt-1`}>•</span>
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </Card>

      {/* Treatment Algorithms by Risk Category */}
      <Card className="border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-md border border-emerald-500/30">
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">Treatment Algorithms</h3>
        </div>

        <div className="space-y-3">
          {TREATMENT_ALGORITHMS.map((algo) => (
            <Collapsible
              key={algo.category}
              open={openAlgorithm === algo.category}
              onOpenChange={(open) => setOpenAlgorithm(open ? algo.category : null)}
            >
              <div className={`rounded-lg border ${algo.borderColor} ${algo.bgColor} overflow-hidden`}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:opacity-80 transition-opacity">
                    <span className={`font-semibold ${algo.color}`}>{algo.category}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openAlgorithm === algo.category ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-4">
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-background border border-border/50">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">LDL-C Target</p>
                        <p className={`font-bold ${algo.color}`}>{algo.targets.ldl}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Non-HDL-C</p>
                        <p className="font-bold text-foreground">{algo.targets.nonHdl}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">ApoB (optional)</p>
                        <p className="font-bold text-foreground">{algo.targets.apoB}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Step-by-Step:</p>
                      <ol className="space-y-2">
                        {algo.steps.map((step, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className={`${algo.color} font-bold mt-0.5 min-w-[20px]`}>{idx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </Card>

      {/* Add-on Therapy Options */}
      <Card className="border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30">
            <Pill className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">Add-On Therapy Options</h3>
        </div>

        <div className="space-y-4">
          {ADDON_THERAPIES.map((therapy) => (
            <div
              key={therapy.name}
              className={`rounded-lg border ${therapy.borderColor} ${therapy.bgColor} p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold ${therapy.color}`}>{therapy.name}</h4>
                  {therapy.firstLine && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      First-Line
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-muted-foreground">{therapy.class}</span>
              </div>

              <p className="text-sm text-foreground mb-2">{therapy.mechanism}</p>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">LDL-C Reduction:</span>
                <span className={`text-sm font-bold ${therapy.color}`}>{therapy.ldlReduction}</span>
              </div>

              {"agents" in therapy && therapy.agents && (
                <div className="space-y-1 mb-2">
                  {therapy.agents.map((agent) => (
                    <div key={agent.name} className="flex justify-between text-sm">
                      <span className="font-medium">{agent.name}</span>
                      <span className="text-xs text-muted-foreground">{agent.dosing}</span>
                    </div>
                  ))}
                </div>
              )}

              {"dosing" in therapy && !("agents" in therapy) && (
                <p className="text-sm text-muted-foreground mb-2">Dosing: {therapy.dosing}</p>
              )}

              {"indications" in therapy && therapy.indications && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Key Indications:</p>
                  <ul className="space-y-1">
                    {therapy.indications.map((ind, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-2">
                        <span className={therapy.color}>•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {"notes" in therapy && therapy.notes && (
                <p className="mt-2 text-xs text-muted-foreground italic">{therapy.notes}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* TG Management Protocols */}
      <Card className="border-amber-500/30 bg-amber-500/5 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Triglyceride Management</h3>
            <p className="text-sm text-muted-foreground">Risk-based approach to elevated triglycerides</p>
          </div>
        </div>

        <div className="space-y-3">
          {TG_MANAGEMENT.map((tg) => (
            <div
              key={tg.level}
              className={`rounded-lg border ${tg.borderColor} ${tg.bgColor} p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${tg.color}`}>{tg.level}</span>
                <span className="text-xs font-medium text-muted-foreground">{tg.action}</span>
              </div>
              <ul className="space-y-1">
                {tg.lifestyle.map((item, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className={tg.color}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-amber-500/20 bg-background p-3">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-amber-500" />
            <p className="text-xs font-semibold text-foreground">Pancreatitis Risk Threshold</p>
          </div>
          <p className="text-sm text-foreground">
            TG ≥500 mg/dL (≥5.6 mmol/L) significantly increases pancreatitis risk. Urgent
            intervention required with very low-fat diet and fibrate therapy.
          </p>
        </div>
      </Card>

      {/* Statin Intolerance Management */}
      <SectionCard
        title="Statin Intolerance Management"
        tone="cyan"
        icon={<AlertCircle className="h-4 w-4" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {STATIN_INTOLERANCE.map((step) => (
            <div
              key={step.step}
              className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20"
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${step.color.replace("text-", "bg-").replace("600", "500")}/20`}
              >
                <span className={`text-xs font-bold ${step.color}`}>{step.step}</span>
              </div>
              <div>
                <p className={`font-semibold ${step.color} mb-1`}>{step.title}</p>
                <p className="text-sm text-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Lifestyle Recommendations */}
      <SectionCard
        title="Lifestyle Interventions"
        tone="emerald"
        icon={<Utensils className="h-4 w-4" />}
        defaultOpen={false}
      >
        <div className="space-y-4">
          {LIFESTYLE_RECOMMENDATIONS.map((item) => (
            <div key={item.category} className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-md ${item.color.replace("text-", "bg-").replace("600", "500")}/20`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <h4 className={`font-semibold ${item.color}`}>{item.category}</h4>
              </div>
              <ul className="space-y-1 ml-10">
                {item.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className={item.color}>•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Monitoring Schedule */}
      <SectionCard
        title="Monitoring Schedule"
        tone="indigo"
        icon={<Activity className="h-4 w-4" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {MONITORING_SCHEDULE.map((monitor) => (
            <div
              key={monitor.timing}
              className={`rounded-lg border border-border ${monitor.bgColor} p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${monitor.color}`}>{monitor.timing}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {monitor.assessments.map((assessment) => (
                  <span
                    key={assessment}
                    className="rounded-full bg-background border border-border px-2 py-1 text-xs"
                  >
                    {assessment}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
