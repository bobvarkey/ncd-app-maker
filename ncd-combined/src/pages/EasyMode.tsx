import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Syringe, Heart, Dna, Scale, Activity, ArrowLeft, Calculator, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionCard } from "@/components/ui/section-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ModeNav() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-6 px-1">
      <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>
      <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg p-1">
        <button onClick={() => navigate("/easy")} className="px-3 py-1.5 text-xs font-semibold rounded-md bg-green-500/15 text-green-600 border border-green-500/30">Easy</button>
        <button onClick={() => navigate("/moderate")} className="px-3 py-1.5 text-xs font-semibold rounded-md text-muted-foreground hover:bg-muted">Moderate</button>
        <button onClick={() => navigate("/hard")} className="px-3 py-1.5 text-xs font-semibold rounded-md text-muted-foreground hover:bg-muted">Hard</button>
      </div>
    </div>
  );
}

/* ─── Diabetes Calculator (Easy) ─── */
function DiabetesCalc() {
  const [fbg, setFbg] = useState("");
  const [hba1c, setHba1c] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const a1c = parseFloat(hba1c);
    const f = parseFloat(fbg);
    const a = parseInt(age);
    const w = parseFloat(weight);
    if (!a1c && !f) { setResult("Enter at least HbA1c or FBG"); return; }

    const lines: string[] = [];
    if (a1c >= 6.5 || f >= 126) {
      lines.push("✅ Diabetes diagnosed");
      if (a1c >= 9) {
        lines.push("➡️ HbA1c ≥ 9%: Consider insulin therapy");
        lines.push("   Metformin + Basal insulin (Glargine 10U bedtime)");
      } else {
        lines.push("➡️ Start Metformin 500 mg BID, titrate to 1000 mg BID");
      }
      if (w && w > 70) {
        lines.push("➡️ Overweight: Consider GLP-1 RA (Semaglutide 0.25 mg weekly)");
      }
      if (a1c >= 7.5) {
        lines.push("➡️ Add SGLT2i (Empagliflozin 10 mg) for CV/renal protection");
      }
      lines.push(`\nTarget: HbA1c < 7.0%, FBG < 130 mg/dL`);
    } else if (a1c >= 5.7 || f >= 100) {
      lines.push("⚠️ Prediabetes range");
      lines.push("➡️ Lifestyle modification + Metformin if age < 60 or BMI ≥ 35");
      lines.push("➡️ Repeat HbA1c in 3-6 months");
    } else {
      lines.push("✅ Normal glucose. Maintain lifestyle.");
    }
    setResult(lines.join("\n"));
  };

  return (
    <SectionCard title="Diabetes" icon={<Syringe className="h-4 w-4" />} tone="danger" defaultOpen={false}>
      <div className="max-w-md space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">HbA1c (%)</Label><Input type="number" step="0.1" value={hba1c} onChange={e => setHba1c(e.target.value)} placeholder="e.g. 7.2" className="h-9" /></div>
          <div><Label className="text-xs">FBG (mg/dL)</Label><Input type="number" value={fbg} onChange={e => setFbg(e.target.value)} placeholder="e.g. 140" className="h-9" /></div>
          <div><Label className="text-xs">Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 55" className="h-9" /></div>
          <div><Label className="text-xs">Weight (kg)</Label><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 75" className="h-9" /></div>
        </div>
        <Button size="sm" onClick={calculate} className="w-full"><Calculator className="h-3.5 w-3.5 mr-1.5" /> Calculate</Button>
        {result && <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{result}</div>}
      </div>
    </SectionCard>
  );
}

/* ─── Hypertension Calculator (Easy) ─── */
function HypertensionCalc() {
  const [sbp, setSbp] = useState("");
  const [dbp, setDbp] = useState("");
  const [age, setAge] = useState("");
  const [hasCKD, setHasCKD] = useState(false);
  const [hasDM, setHasDM] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const s = parseInt(sbp);
    const d = parseInt(dbp);
    const a = parseInt(age);

    const lines: string[] = [];
    let grade = "";
    if (s < 120 && d < 80) grade = "Normal";
    else if (s < 130 && d < 85) grade = "High-Normal";
    else if (s < 140 || d < 90) grade = "Grade 1 HTN";
    else if (s < 160 || d < 100) grade = "Grade 2 HTN";
    else grade = "Grade 3 HTN";

    lines.push(`📊 BP Classification: ${grade}`);
    lines.push(`   ${s || "?"}/${d || "?"} mmHg`);
    lines.push("");

    if (grade === "Normal" || grade === "High-Normal") {
      lines.push("✅ Target achieved. Lifestyle maintenance.");
    } else {
      if (hasCKD || hasDM) {
        lines.push("➡️ Start ACEi (Ramipril 2.5-5 mg OD) or ARB (Losartan 50 mg OD)");
        lines.push("   Reason: CKD or DM present — RAS blocker first-line");
      } else {
        lines.push("➡️ Start CCB (Amlodipine 5 mg OD)");
        lines.push("   Alternative: Thiazide diuretic (Chlorthalidone 12.5 mg)");
      }

      if (s >= 160 || d >= 100) {
        lines.push("➡️ Grade 2+: Consider dual therapy add-on");
        lines.push("   ACEi/ARB + CCB or ACEi/ARB + Thiazide");
      }

      lines.push("\nTarget: BP < 130/80 mmHg");
    }
    setResult(lines.join("\n"));
  };

  return (
    <SectionCard title="Hypertension" icon={<Heart className="h-4 w-4" />} tone="warning" defaultOpen={false}>
      <div className="max-w-md space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">SBP (mmHg)</Label><Input type="number" value={sbp} onChange={e => setSbp(e.target.value)} placeholder="e.g. 145" className="h-9" /></div>
          <div><Label className="text-xs">DBP (mmHg)</Label><Input type="number" value={dbp} onChange={e => setDbp(e.target.value)} placeholder="e.g. 92" className="h-9" /></div>
          <div><Label className="text-xs">Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 55" className="h-9" /></div>
        </div>
        <div className="flex gap-4 pt-1">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasCKD} onChange={e => setHasCKD(e.target.checked)} className="rounded" /><span className="text-xs">CKD</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasDM} onChange={e => setHasDM(e.target.checked)} className="rounded" /><span className="text-xs">Diabetes</span></label>
        </div>
        <Button size="sm" onClick={calculate} className="w-full"><Calculator className="h-3.5 w-3.5 mr-1.5" /> Calculate</Button>
        {result && <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{result}</div>}
      </div>
    </SectionCard>
  );
}

/* ─── Lipids Calculator (Easy) with Risk Modifiers ─── */
function LipidsCalc() {
  const [ldl, setLdl] = useState("");
  const [hdl, setHdl] = useState("");
  const [tg, setTg] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [hasASCVD, setHasASCVD] = useState(false);
  const [hasDM, setHasDM] = useState(false);
  const [hasCKD, setHasCKD] = useState(false);
  const [hasFH, setHasFH] = useState(false);
  const [hasSevereHyperLDL, setHasSevereHyperLDL] = useState(false);
  const [hasHTN, setHasHTN] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Compute risk category and target LIVE based on selected modifiers
  const getRiskCategory = () => {
    if (hasASCVD) return { risk: "Very High Risk", target: "< 55 mg/dL", intensity: "High", color: "text-red-600" };
    if (hasDM && (hasCKD || hasFH || hasSevereHyperLDL)) return { risk: "Very High Risk", target: "< 55 mg/dL", intensity: "High", color: "text-red-600" };
    if (hasDM || hasFH || hasSevereHyperLDL || hasCKD) return { risk: "High Risk", target: "< 70 mg/dL", intensity: "High", color: "text-orange-600" };
    const a = parseInt(age);
    if (!isNaN(a) && ((a >= 45 && sex === "male") || (a >= 55 && sex === "female"))) {
      let modCount = 0;
      if (hasHTN) modCount++;
      if (smoker) modCount++;
      const h = parseFloat(hdl);
      if (!isNaN(h) && h < 40) modCount++;
      if (modCount >= 2) return { risk: "High Risk", target: "< 70 mg/dL", intensity: "High", color: "text-orange-600" };
      if (modCount >= 1) return { risk: "Moderate Risk", target: "< 100 mg/dL", intensity: "Moderate", color: "text-amber-600" };
    }
    const l = parseFloat(ldl);
    if (!isNaN(l) && l >= 160) return { risk: "Moderate Risk", target: "< 100 mg/dL", intensity: "Moderate", color: "text-amber-600" };
    if (!isNaN(a) && a > 40) return { risk: "Moderate Risk", target: "< 100 mg/dL", intensity: "Moderate", color: "text-amber-600" };
    return { risk: "Low Risk", target: "< 130 mg/dL", intensity: "Lifestyle", color: "text-green-600" };
  };

  const riskInfo = getRiskCategory();

  const calculate = () => {
    const l = parseFloat(ldl);
    const h = parseFloat(hdl);
    const t = parseFloat(tg);
    const a = parseInt(age);

    const lines: string[] = [];

    // Risk modifier summary
    const activeModifiers = [];
    if (hasASCVD) activeModifiers.push("ASCVD history");
    if (hasDM) activeModifiers.push("Diabetes");
    if (hasCKD) activeModifiers.push("CKD (eGFR < 60)");
    if (hasFH) activeModifiers.push("Family history of premature ASCVD");
    if (hasSevereHyperLDL) activeModifiers.push("Severe hypercholesterolemia (LDL ≥ 190)");
    if (hasHTN) activeModifiers.push("Hypertension");
    if (smoker) activeModifiers.push("Smoking");

    lines.push(`📊 Risk Category: ${riskInfo.risk}`);
    if (activeModifiers.length > 0) lines.push(`   Modifiers: ${activeModifiers.join(", ")}`);
    else lines.push("   Modifiers: None");
    lines.push(`   LDL Target: ${riskInfo.target}`);
    lines.push("");

    // Where is the patient vs target?
    if (!isNaN(l)) {
      const targetNum = parseInt(riskInfo.target.replace(/[< >mg/dL]/g, ""));
      if (l <= targetNum) {
        lines.push("✅ At target LDL. Maintain current therapy.");
      } else {
        const above = l - targetNum;
        lines.push(`⚠ ${above} mg/dL above target (current LDL ${l}, target ${riskInfo.target})`);
        lines.push(`➡️ Start ${riskInfo.intensity} intensity statin`);
        if (riskInfo.intensity === "High") lines.push("   Atorvastatin 40-80 mg OD or Rosuvastatin 20-40 mg OD");
        else if (riskInfo.intensity === "Moderate") lines.push("   Atorvastatin 10-20 mg OD or Rosuvastatin 5-10 mg OD");
        else lines.push("   Lifestyle modification. Recheck lipids in 6-12 months.");

        if (activeModifiers.includes("ASCVD history") && l >= 70) {
          lines.push("➡️ Consider adding Ezetimibe 10 mg OD");
        }
      }
    } else {
      lines.push("ℹ️ Enter LDL value above and click Calculate");
    }

    if (!isNaN(t) && t >= 500) {
      lines.push("");
      lines.push("⚠ TG ≥ 500 mg/dL: Add Fenofibrate 145 mg OD for pancreatitis prevention");
    }

    lines.push("");
    lines.push("Monitoring: Lipids at 6 weeks, then 6-12 monthly");

    setResult(lines.join("\n"));
  };

  return (
    <SectionCard title="Lipids" icon={<Dna className="h-4 w-4" />} tone="primary" defaultOpen={false}>
      <div className="max-w-md space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">LDL (mg/dL)</Label><Input type="number" value={ldl} onChange={e => setLdl(e.target.value)} placeholder="e.g. 130" className="h-9" /></div>
          <div><Label className="text-xs">HDL (mg/dL)</Label><Input type="number" value={hdl} onChange={e => setHdl(e.target.value)} placeholder="e.g. 42" className="h-9" /></div>
          <div><Label className="text-xs">TG (mg/dL)</Label><Input type="number" value={tg} onChange={e => setTg(e.target.value)} placeholder="e.g. 150" className="h-9" /></div>
          <div><Label className="text-xs">Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 55" className="h-9" /></div>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs">Sex</Label>
          <Select value={sex} onValueChange={(v: "male" | "female") => setSex(v)}>
            <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Risk Modifiers */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">Risk Modifiers — toggle to set LDL target</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasASCVD} onChange={e => setHasASCVD(e.target.checked)} className="rounded" /><span className="text-xs">ASCVD History</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasDM} onChange={e => setHasDM(e.target.checked)} className="rounded" /><span className="text-xs">Diabetes</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasCKD} onChange={e => setHasCKD(e.target.checked)} className="rounded" /><span className="text-xs">CKD (eGFR &lt; 60)</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasFH} onChange={e => setHasFH(e.target.checked)} className="rounded" /><span className="text-xs">Family Hx ASCVD</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasSevereHyperLDL} onChange={e => setHasSevereHyperLDL(e.target.checked)} className="rounded" /><span className="text-xs">LDL ≥ 190 (Severe)</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasHTN} onChange={e => setHasHTN(e.target.checked)} className="rounded" /><span className="text-xs">Hypertension</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={smoker} onChange={e => setSmoker(e.target.checked)} className="rounded" /><span className="text-xs">Smoker</span></label>
          </div>
        </div>

        {/* Live Risk Target Preview */}
        <div className={`p-3 rounded-lg border text-xs ${riskInfo.color} ${riskInfo.risk.includes("Very High") ? "bg-red-50 border-red-200" : riskInfo.risk.includes("High") ? "bg-orange-50 border-orange-200" : riskInfo.risk.includes("Moderate") ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
          <span className="font-semibold">{riskInfo.risk}</span>
          <span className="ml-2">→ LDL Target: <strong>{riskInfo.target}</strong></span>
          <span className="ml-2 text-[10px]">({riskInfo.intensity})</span>
        </div>

        <Button size="sm" onClick={calculate} className="w-full"><Calculator className="h-3.5 w-3.5 mr-1.5" /> Calculate &amp; Recommend</Button>
        {result && <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{result}</div>}
      </div>
    </SectionCard>
  );
}

/* ─── Obesity Calculator (Easy) ─── */
function ObesityCalc() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h) { setResult("Enter weight and height"); return; }

    const bmi = w / ((h / 100) * (h / 100));
    let category: string;
    let rec: string;

    if (bmi < 18.5) { category = "Underweight"; rec = "Rule out eating disorder, malnutrition, or hyperthyroidism."; }
    else if (bmi < 23) { category = "Normal"; rec = "Maintain healthy lifestyle."; }
    else if (bmi < 25) { category = "Overweight (Indian: At risk)"; rec = "Lifestyle advice. Screen for metabolic syndrome."; }
    else if (bmi < 30) { category = "Obese Class I"; rec = "Diet (500 kcal deficit) + exercise 150 min/week. Consider GLP-1 RA if comorbidities."; }
    else if (bmi < 35) { category = "Obese Class II"; rec = "Pharmacotherapy (GLP-1 RA). Consider bariatric referral if BMI ≥ 32.5 with diabetes."; }
    else { category = "Obese Class III"; rec = "Refer for bariatric evaluation. GLP-1 RA (Semaglutide 2.4 mg weekly)."; }

    const lines: string[] = [];
    lines.push(`📊 BMI: ${bmi.toFixed(1)} kg/m²`);
    lines.push(`   Category: ${category}`);
    lines.push("");
    lines.push(`➡️ ${rec}`);
    setResult(lines.join("\n"));
  };

  return (
    <SectionCard title="Obesity & Weight" icon={<Scale className="h-4 w-4" />} tone="purple" defaultOpen={false}>
      <div className="max-w-md space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Weight (kg)</Label><Input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 75" className="h-9" /></div>
          <div><Label className="text-xs">Height (cm)</Label><Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 170" className="h-9" /></div>
        </div>
        <Button size="sm" onClick={calculate} className="w-full"><Calculator className="h-3.5 w-3.5 mr-1.5" /> Calculate</Button>
        {result && <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{result}</div>}
      </div>
    </SectionCard>
  );
}

export default function EasyMode() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <ModeNav />
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Easy Mode</h1>
          <p className="text-sm text-muted-foreground">Quick calculators for all 4 NCDs. Simple inputs, clear outputs.</p>
        </div>
        <div className="space-y-4">
          <DiabetesCalc />
          <HypertensionCalc />
          <LipidsCalc />
          <ObesityCalc />
        </div>
        <p className="text-center text-xs text-muted-foreground/60 mt-6">v1.0 · ADA 2026 · ESC/ESH 2024 · LAI 2023</p>
      </div>
    </div>
  );
}
