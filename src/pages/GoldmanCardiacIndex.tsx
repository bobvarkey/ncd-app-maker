import { useState, useMemo } from "react";
import { Heart, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface RiskFactor {
  id: string;
  letter: string;
  factor: string;
  points: number;
  active: boolean;
  category: "history" | "examination" | "ecg" | "vitals" | "lab" | "age";
}

interface RiskClass {
  label: string;
  points: string;
  observedRisk: string;
  color: string;
}

const GOLDMAN_CLASSES: RiskClass[] = [
  { label: "Class I", points: "0", observedRisk: "0.7%", color: "success" },
  { label: "Class II", points: "1–2", observedRisk: "3%", color: "warning" },
  { label: "Class III", points: "3–4", observedRisk: "15%", color: "warning" },
  { label: "Class IV", points: "5+", observedRisk: "30%", color: "destructive" },
];

const GoldmanCardiacIndex = () => {
  const buildInitialFactors = (): RiskFactor[] => [
    // History
    { id: "s3", letter: "S", factor: "S3 gallop or JVP > 12 cm", points: 11, active: false, category: "history" },
    { id: "mi_recent", letter: "M", factor: "MI within 6 months", points: 10, active: false, category: "history" },
    { id: "pvc", letter: "P", factor: "> 5 PVCs/min", points: 7, active: false, category: "history" },
    { id: "ischemic_hd", letter: "O", factor: "Ischemic heart disease", points: 3, active: false, category: "history" },
    { id: "multiple_risk_factors", letter: "M", factor: "Multiple risk factors (DM, HTN, smoking, hyperlipidemia)", points: 2, active: false, category: "history" },

    // Examination
    { id: "aortic_stenosis", letter: "A", factor: "Aortic stenosis (critical)", points: 3, active: false, category: "examination" },

    // ECG
    { id: "rhythm_other", letter: "R", factor: "Rhythm other than sinus or PVCs on last ECG", points: 7, active: false, category: "ecg" },
    { id: "ecg_abnormal", letter: "E", factor: "ECG abnormal (ST-T changes, LVH, LBBB, pacing)", points: 3, active: false, category: "ecg" },

    // Vitals
    { id: "emergency", letter: "E", factor: "Emergency surgery", points: 4, active: false, category: "vitals" },

    // Lab/Vitals
    { id: "poor_medical", letter: "P", factor: "Poor general medical status (bedridden, cachexia)", points: 3, active: false, category: "lab" },
    { id: "elderly", letter: "E", factor: "Age > 70 years", points: 5, active: false, category: "age" },
    { id: "age_60_69", letter: "A", factor: "Age 60–69 years", points: 2, active: false, category: "age" },
  ];

  const [factors, setFactors] = useState<RiskFactor[]>(buildInitialFactors());
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(["history", "examination", "ecg", "vitals", "lab", "age"]));

  const toggleFactor = (id: string) => {
    setFactors(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const result = useMemo(() => {
    const activeFactors = factors.filter(f => f.active);
    const totalPoints = activeFactors.reduce((sum, f) => sum + f.points, 0);

    let riskClass: string;
    let observedRisk: string;
    let color: string;

    if (totalPoints === 0) {
      riskClass = "Class I";
      observedRisk = "0.7%";
      color = "text-success";
    } else if (totalPoints <= 2) {
      riskClass = "Class II";
      observedRisk = "3%";
      color = "text-warning";
    } else if (totalPoints <= 4) {
      riskClass = "Class III";
      observedRisk = "15%";
      color = "text-warning";
    } else {
      riskClass = "Class IV";
      observedRisk = "30%";
      color = "text-destructive";
    }

    return { totalPoints, riskClass, observedRisk, color, activeFactors };
  }, [factors]);

  const categoryLabels: Record<string, { label: string; icon: typeof Heart }> = {
    history: { label: "Cardiac History", icon: Heart },
    examination: { label: "Examination Findings", icon: Info },
    ecg: { label: "ECG Abnormalities", icon: AlertTriangle },
    vitals: { label: "Surgery Urgency", icon: AlertTriangle },
    lab: { label: "General Status", icon: Info },
    age: { label: "Age", icon: Info },
  };

  const grouped = useMemo(() => {
    const cats = ["history", "examination", "ecg", "vitals", "lab", "age"];
    return cats.map(cat => ({
      key: cat,
      ...categoryLabels[cat],
      factors: factors.filter(f => f.category === cat),
      activeCount: factors.filter(f => f.category === cat && f.active).length,
      points: factors.filter(f => f.category === cat && f.active).reduce((s, f) => s + f.points, 0),
    }));
  }, [factors]);

  const riskMeter = () => {
    const maxScore = 60;
    const pct = Math.min((result.totalPoints / maxScore) * 100, 100);
    return (
      <div className="relative h-4 rounded-full overflow-hidden bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: result.totalPoints === 0
              ? "hsl(var(--success))"
              : result.totalPoints <= 4
              ? "hsl(var(--warning))"
              : "hsl(var(--destructive))",
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-slide-in">
      <div>
        <h1 className="text-xl font-heading font-bold">Goldman Cardiac Risk Index</h1>
        <p className="text-sm text-muted-foreground">
          Cardiac risk index for non-cardiac surgery — Goldman et al., N Engl J Med 1977
        </p>
      </div>

      {/* Score result card */}
      <div className={`clinical-card border-l-4 ${
        result.totalPoints === 0 ? "border-l-success" :
        result.totalPoints <= 4 ? "border-l-warning" : "border-l-destructive"
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {result.totalPoints === 0 ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <AlertTriangle className={`w-5 h-5 ${result.color}`} />
            )}
            <div>
              <h3 className="font-heading font-bold text-lg">{result.riskClass}</h3>
              <p className="text-xs text-muted-foreground">
                {result.activeFactors.length} selected · {result.totalPoints} points
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-3xl font-heading font-bold ${result.color}`}>{result.observedRisk}</span>
            <span className="text-xs text-muted-foreground block">mortality risk</span>
          </div>
        </div>

        {riskMeter()}
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Class I (0)</span>
          <span>Class II (1–2)</span>
          <span>Class III (3–4)</span>
          <span>Class IV (5+)</span>
        </div>

        {result.activeFactors.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50">
            <h4 className="text-sm font-medium mb-2">Selected Factors</h4>
            <div className="flex flex-wrap gap-2">
              {result.activeFactors.map(f => (
                <span key={f.id} className="text-xs px-2 py-1 rounded-full bg-background border border-border">
                  <strong>{f.letter}</strong> · {f.factor} (+{f.points})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Risk classes reference */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            Risk Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 text-center">
            {GOLDMAN_CLASSES.map(cls => (
              <div key={cls.label} className={`p-2 rounded-lg ${
                cls.color === "success" ? "bg-success/10 border border-success/20" :
                cls.color === "warning" ? "bg-warning/10 border border-warning/20" :
                "bg-destructive/10 border border-destructive/20"
              }`}>
                <div className="font-medium text-sm">{cls.label}</div>
                <div className="text-xs text-muted-foreground">{cls.points} pts</div>
                <div className={`text-lg font-bold mt-1 ${
                  cls.color === "success" ? "text-success" :
                  cls.color === "warning" ? "text-warning" : "text-destructive"
                }`}>
                  {cls.observedRisk}
                </div>
                <div className="text-xs text-muted-foreground">mortality</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expand All / Collapse All */}
      <div className="flex gap-2">
        <button
          onClick={() => setExpandedCats(new Set(["history", "examination", "ecg", "vitals", "lab", "age"]))}
          className="text-xs px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted"
        >
          Expand All
        </button>
        <button
          onClick={() => setExpandedCats(new Set())}
          className="text-xs px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted"
        >
          Collapse All
        </button>
      </div>

      {/* Risk factor categories */}
      {grouped.map(group => (
        <div key={group.key} className="clinical-card">
          <button onClick={() => toggleCat(group.key)} className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <group.icon className={`w-4 h-4 ${group.points > 0 ? "text-warning" : "text-muted-foreground"}`} />
              <h3 className="section-title">{group.label}</h3>
              {group.activeCount > 0 && (
                <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full">
                  {group.activeCount} active · {group.points} pts
                </span>
              )}
            </div>
            {expandedCats.has(group.key) ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {expandedCats.has(group.key) && (
            <div className="mt-3 space-y-2">
              {group.factors.map(factor => (
                <label key={factor.id} className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors cursor-pointer ${
                  factor.active ? "bg-warning/5 border border-warning/20" : "hover:bg-muted/30"
                }`}>
                  <Switch
                    checked={factor.active}
                    onCheckedChange={() => toggleFactor(factor.id)}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{factor.factor}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        factor.points >= 7 ? "bg-destructive/10 text-destructive" :
                        factor.points >= 3 ? "bg-warning/10 text-warning" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        +{factor.points}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                        {factor.letter}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Clinical notes */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-muted-foreground" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• <strong>Original cohort:</strong> 1001 patients, non-cardiac surgery (1977)</li>
            <li>• <strong>Highest risk factors:</strong> S3/JVP (11 pts), recent MI (10 pts), arrhythmia (7 pts)</li>
            <li>• <strong>Limitations:</strong> Derived before modern perioperative management; may underestimate benefit of beta-blockade, statins</li>
            <li>• <strong>Alternatives:</strong> RCRI (Revised Cardiac Risk Index) for modern risk stratification</li>
          </ul>
        </CardContent>
      </Card>

      {/* JSON output */}
      <Card className="border-border/40 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono">Machine output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono overflow-auto">
{JSON.stringify({
  model: "Goldman Cardiac Index (original)",
  total_points: result.totalPoints,
  selected_factor_count: result.activeFactors.length,
  selected_factors: result.activeFactors.map(f => ({
    id: f.id,
    letter: f.letter,
    factor: f.factor,
    points: f.points,
  })),
  risk_class: result.riskClass,
  score_range: result.totalPoints === 0 ? "0" : result.totalPoints <= 2 ? "1–2" : result.totalPoints <= 4 ? "3–4" : "5+",
  observed_risk: result.observedRisk,
}, null, 1)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoldmanCardiacIndex;