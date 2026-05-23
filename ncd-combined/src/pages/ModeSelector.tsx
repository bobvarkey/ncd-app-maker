import { useNavigate } from "react-router-dom";
import { Activity, Heart, Dna, Scale, ArrowRight, Syringe, Sparkles, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const modes = [
  {
    id: "easy",
    title: "Easy Mode",
    tagline: "Quick Clinical Calculator",
    description: "Simple input, straightforward output for all 4 NCDs. Just the essentials — perfect for fast bedside reference or a quick second opinion.",
    icon: Sparkles,
    badge: "Basic",
    badgeColor: "bg-green-500/15 text-green-600 border-green-500/30",
    accent: "from-green-500 to-emerald-600",
    features: ["Diabetes: FBG + HbA1c → tx rec", "Hypertension: BP + age → class + drug", "Lipids: LDL/HDL → risk + statin", "Obesity: Wt/Ht → BMI + category"],
    color: "green",
    route: "/easy",
  },
  {
    id: "moderate",
    title: "Moderate Mode",
    tagline: "Guideline-Integrated Advisor",
    description: "More inputs, risk stratification, and guideline references. Includes drug interactions, insulin titration suggestions, and ASCVD risk scoring.",
    icon: Zap,
    badge: "Intermediate",
    badgeColor: "bg-orange-500/15 text-orange-600 border-orange-500/30",
    accent: "from-orange-500 to-amber-600",
    features: ["Insulin titration + hypo risk", "Drug interaction checker", "ASCVD 10-year risk score", "GLP-1 obesity algorithm"],
    color: "orange",
    route: "/moderate",
  },
  {
    id: "complex",
    title: "Complex Mode",
    tagline: "Full Clinical Decision Support",
    description: "The complete app with all data points, algorithms, and guidelines from the full database. Full prescription generator, OCR upload, and comprehensive sub-sections.",
    icon: Brain,
    badge: "Advanced",
    badgeColor: "bg-purple-500/15 text-purple-600 border-purple-500/30",
    accent: "from-purple-500 to-violet-600",
    features: ["Full prescription generator", "Smart Lab Upload (OCR)", "Comprehensive sub-pages", "Renal/CV/liver adjustments"],
    color: "purple",
    route: "/home",
  },
];

export default function ModeSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 max-w-5xl w-full space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Activity className="h-4 w-4" />
            NCD Clinical Toolkit
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Choose Your Mode
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Three tiers of clinical decision support for diabetes, hypertension, lipids, and obesity.
            Pick the depth that matches your need.
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => navigate(mode.route)}
                className="group relative text-left rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r ${mode.accent}`} />

                {/* Icon + Badge */}
                <div className="flex items-start justify-between mb-4 mt-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.accent} bg-opacity-20 flex items-center justify-center shadow-sm`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className={`text-xs font-semibold ${mode.badgeColor}`}>
                    {mode.badge}
                  </Badge>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold mb-1">{mode.title}</h2>
                <p className="text-sm font-medium text-muted-foreground mb-3">{mode.tagline}</p>
                <p className="text-sm text-muted-foreground/80 mb-4 leading-relaxed">
                  {mode.description}
                </p>

                {/* Features */}
                <ul className="space-y-1.5 mb-5">
                  {mode.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-${mode.color}-500`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`flex items-center gap-1.5 text-sm font-semibold text-${mode.color}-600 dark:text-${mode.color}-400 group-hover:gap-2 transition-all`}>
                  Open {mode.title}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/60">
          Guidelines: ADA 2026 · ESC/ESH 2024 · LAI 2023 · WHO · ACC/AHA
        </p>
      </div>
    </div>
  );
}
