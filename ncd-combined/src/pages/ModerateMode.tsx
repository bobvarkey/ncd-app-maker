import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Syringe, Heart, Dna, Scale, Activity, ArrowLeft, Calculator, AlertTriangle, Info, TestTube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionCard } from "@/components/ui/section-card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

function ModeNav() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-6 px-1">
      <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Home
      </Button>
      <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg p-1">
        <button onClick={() => navigate("/easy")} className="px-3 py-1.5 text-xs font-semibold rounded-md text-muted-foreground hover:bg-muted">Easy</button>
        <button onClick={() => navigate("/moderate")} className="px-3 py-1.5 text-xs font-semibold rounded-md bg-orange-500/15 text-orange-600 border border-orange-500/30">Moderate</button>
        <button onClick={() => navigate("/home")} className="px-3 py-1.5 text-xs font-semibold rounded-md text-muted-foreground hover:bg-muted">Complex</button>
      </div>
    </div>
  );
}

/* ─── Diabetes (Moderate) ─── */
function DiabetesModerate() {
  const [hba1c, setHba1c] = useState("");
  const [fbg, setFbg] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [egfr, setEgfr] = useState("");
  const [hasCVD, setHasCVD] = useState(false);
  const [hasCKD, setHasCKD] = useState(false);
  const [hasHF, setHasHF] = useState(false);
  const [currentDose, setCurrentDose] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [insulinRec, setInsulinRec] = useState<string | null>(null);

  const calculate = () => {
    const a1c = parseFloat(hba1c);
    const f = parseFloat(fbg);
    const dose = parseFloat(currentDose);
    const gfr = parseFloat(egfr) || 60;
    const w = parseFloat(weight);

    const lines: string[] = [];
    lines.push("📊 Risk-Stratified Recommendations:");
    lines.push("");

    // Metformin decision
    if (gfr >= 30) {
      const maxMetformin = gfr >= 45 ? "2000 mg/day" : "1000 mg/day";
      lines.push(`✅ Metformin: Start 500 mg BID (max ${maxMetformin}${gfr < 45 ? " — eGFR 30-44" : ""})`);
    } else {
      lines.push("❌ Metformin: Contraindicated (eGFR < 30)");
    }

    // SGLT2i / GLP-1 based on comorbidities
    if (hasCVD || hasCKD || hasHF) {
      if (gfr >= 25) {
        lines.push("✅ SGLT2i (Empagliflozin 10 mg / Dapagliflozin 10 mg): CV + renal protection");
        if (hasHF) lines.push("   Dapagliflozin preferred for HF (DELIVER/DAPA-HF)");
      }
    }
    if ((hasCVD && a1c >= 7) || (w && w > 70)) {
      lines.push("✅ GLP-1 RA (Semaglutide 0.25 mg → 0.5 mg weekly): CV benefit + weight loss");
    }

    // Insulin titration suggestion
    if (a1c >= 7.5 || dose > 0) {
      lines.push("");
      lines.push("💉 Insulin Assessment:");

      if (a1c >= 9 || f >= 200) {
        lines.push("   HbA1c ≥ 9% or FBG ≥ 200: Start basal insulin");
        const startingDose = w ? Math.round(w * 0.2) : 10;
        lines.push(`   Glargine ${startingDose} U SC bedtime (0.2 U/kg/day)`);
      }

      if (dose > 0 && f > 0) {
        const avgReading = f;
        if (avgReading > 130) {
          const increase = avgReading > 180 ? 4 : 2;
          lines.push(`   Current ${dose} U → increase by ${increase} U to ${dose + increase} U`);
          lines.push(`   Reason: FBG ${avgReading} > target (70-130 mg/dL)`);
        } else if (avgReading < 70) {
          const decrease = avgReading < 54 ? 4 : 2;
          lines.push(`   Current ${dose} U → DECREASE by ${decrease} U to ${Math.max(0, dose - decrease)} U`);
          lines.push(`   ⚠ Hypoglycemia detected (FBG ${avgReading})`);
        } else {
          lines.push(`   Current ${dose} U — At target. Maintain dose.`);
        }
      }
    }

    lines.push("");
    lines.push("Targets: HbA1c < 7.0% · FBG < 130 · TBG < 180 mg/dL");
    setResult(lines.join("\n"));
  };

  return (
    <SectionCard title="Diabetes — Guideline-Integrated" icon={<Syringe className="h-4 w-4" />} tone="danger">
      <div className="max-w-xl space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div><Label className="text-xs">HbA1c (%)</Label><Input type="number" step="0.1" value={hba1c} onChange={e => setHba1c(e.target.value)} placeholder="7.2" className="h-9" /></div>
          <div><Label className="text-xs">FBG (mg/dL)</Label><Input type="number" value={fbg} onChange={e => setFbg(e.target.value)} placeholder="140" className="h-9" /></div>
          <div><Label className="text-xs">Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="55" className="h-9" /></div>
          <div><Label className="text-xs">Weight (kg)</Label><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="75" className="h-9" /></div>
          <div><Label className="text-xs">eGFR</Label><Input type="number" value={egfr} onChange={e => setEgfr(e.target.value)} placeholder="90" className="h-9" /></div>
          <div><Label className="text-xs">Current Insulin (U)</Label><Input type="number" value={currentDose} onChange={e => setCurrentDose(e.target.value)} placeholder="10" className="h-9" /></div>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasCVD} onChange={e => setHasCVD(e.target.checked)} className="rounded" /><span className="text-xs">CVD</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasCKD} onChange={e => setHasCKD(e.target.checked)} className="rounded" /><span className="text-xs">CKD</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasHF} onChange={e => setHasHF(e.target.checked)} className="rounded" /><span className="text-xs">Heart Failure</span></label>
        </div>
        <Button size="sm" onClick={calculate} className="w-full"><Calculator className="h-3.5 w-3.5 mr-1.5" /> Generate Recommendations</Button>
        {result && <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{result}</div>}
      </div>
    </SectionCard>
  );
}

/* ─── Hypertension (Moderate) ─── */
function HypertensionModerate() {
  const [sbp, setSbp] = useState("");
  const [dbp, setDbp] = useState("");
  const [age, setAge] = useState("");
  const [hasCKD, setHasCKD] = useState(false);
  const [hasDM, setHasDM] = useState(false);
  const [hasCAD, setHasCAD] = useState(false);
  const [currentMeds, setCurrentMeds] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const s = parseInt(sbp);
    const d = parseInt(dbp);
    const lines: string[] = [];

    let grade = gradeHTN(s, d);
    lines.push(`📊 BP: ${s}/${d} mmHg — ${grade}`);

    if (grade === "Normal" || grade === "High-Normal") {
      lines.push("✅ At target. Continue lifestyle measures.");
    } else {
      lines.push("");
      lines.push("🔄 Treatment Algorithm:");

      if (hasCKD || hasDM) {
        lines.push("Step 1: ACEi/ARB (Ramipril 2.5-5 mg / Losartan 50 mg)");
        if (s >= 140) lines.push("Step 2: Add CCB (Amlodipine 5-10 mg)");
        if (s >= 150) lines.push("Step 3: Add Thiazide diuretic (Chlorthalidone 12.5-25 mg)");
        if (hasCKD) lines.push("Note: Monitor K+ and Cr within 2 weeks of ACEi/ARB start");
      } else {
        lines.push("Step 1: CCB (Amlodipine 5 mg) OR Thiazide (Chlorthalidone 12.5 mg)");
        if (s >= 150) lines.push("Step 2: Add second agent from another class");
        if (s >= 160) lines.push("Step 3: Triple therapy — ACEi/ARB + CCB + Thiazide");
      }

      lines.push("");
      lines.push("⚠ Drug Interaction Check:");
      if (currentMeds.toLowerCase().includes("nsaid")) lines.push("  NSAIDs: Reduce antihypertensive efficacy. Limit use.");
      if (currentMeds.toLowerCase().includes("steroid") || currentMeds.toLowerCase().includes("pred")) lines.push("  Steroids: May cause fluid retention & BP elevation.");
      if (currentMeds.toLowerCase().includes("spiro") || currentMeds.toLowerCase().includes("epler")) lines.push("  Monitor K+ with ACEi/ARB + K-sparing diuretic.");

      lines.push("\nTarget: < 130/80 mmHg");
    }
    setResult(lines.join("\n"));
  };

  const gradeHTN = (s: number, d: number): string => {
    if (s < 120 && d < 80) return "Normal";
    if (s < 130 && d < 85) return "High-Normal";
    if (s < 140 || d < 90) return "Grade 1 HTN";
    if (s < 160 || d < 100) return "Grade 2 HTN";
    return "Grade 3 HTN";
  };

  return (
    <SectionCard title="Hypertension — ESC Algorithm + Drug Check" icon={<Heart className="h-4 w-4" />} tone="warning">
      <div className="max-w-xl space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div><Label className="text-xs">SBP</Label><Input type="number" value={sbp} onChange={e => setSbp(e.target.value)} placeholder="145" className="h-9" /></div>
          <div><Label className="text-xs">DBP</Label><Input type="number" value={dbp} onChange={e => setDbp(e.target.value)} placeholder="92" className="h-9" /></div>
          <div><Label className="text-xs">Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="55" className="h-9" /></div>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasCKD} onChange={e => setHasCKD(e.target.checked)} className="rounded" /><span className="text-xs">CKD</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasDM} onChange={e => setHasDM(e.target.checked)} className="rounded" /><span className="text-xs">Diabetes</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasCAD} onChange={e => setHasCAD(e.target.checked)} className="rounded" /><span className="text-xs">CAD</span></label>
        </div>
        <div><Label className="text-xs">Current Medications (for interaction check)</Label><Input type="text" value={currentMeds} onChange={e => setCurrentMeds(e.target.value)} placeholder="e.g., ibuprofen, prednisone" className="h-9" /></div>
        <Button size="sm" onClick={calculate} className="w-full"><Calculator className="h-3.5 w-3.5 mr-1.5" /> Generate</Button>
        {result && <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{result}</div>}
      </div>
    </SectionCard>
  );
}

/* ─── Lipids (Moderate) ─── */
function LipidsModerate() {
  const [ldl, setLdl] = useState("");
  const [hdl, setHdl] = useState("");
  const [tg, setTg] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [hasASCVD, setHasASCVD] = useState(false);
  const [hasDM, setHasDM] = useState(false);
  const [hasCKD, setHasCKD] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [htn, setHtn] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Live risk computation
  const getRisk = () => {
    if (hasASCVD) return { cat: "Very High Risk", target: "< 55 mg/dL", intensity: "High", color: "text-red-600 bg-red-50 border-red-200" };
    if (hasDM && (smoker || hasHTN || hasCKD)) return { cat: "Very High Risk", target: "< 55 mg/dL", intensity: "High", color: "text-red-600 bg-red-50 border-red-200" };
    if (hasDM || hasCKD) return { cat: "High Risk", target: "< 70 mg/dL", intensity: "High", color: "text-orange-600 bg-orange-50 border-orange-200" };
    const s = getScore();
    if (s >= 3) return { cat: "High Risk", target: "< 70 mg/dL", intensity: "High", color: "text-orange-600 bg-orange-50 border-orange-200" };
    if (s >= 2) return { cat: "Moderate Risk", target: "< 100 mg/dL", intensity: "Moderate", color: "text-amber-600 bg-amber-50 border-amber-200" };
    const l = parseFloat(ldl);
    if (!isNaN(l) && l >= 160) return { cat: "Moderate Risk", target: "< 100 mg/dL", intensity: "Moderate", color: "text-amber-600 bg-amber-50 border-amber-200" };
    return { cat: "Low Risk", target: "< 130 mg/dL", intensity: "Lifestyle", color: "text-green-600 bg-green-50 border-green-200" };
  };

  const getScore = () => {
    const a = parseInt(age);
    let s = 0;
    if (!isNaN(a) && ((a >= 45 && sex === "male") || (a >= 55 && sex === "female"))) s += 1;
    if (smoker) s += 1;
    if (htn) s += 1;
    const h = parseFloat(hdl);
    if (!isNaN(h) && h < 40) s += 1;
    if (hasDM) s += 1;
    if (hasCKD) s += 1;
    return s;
  };

  const riskPreview = getRisk();
  const score = getScore();

  const calculate = () => {
    const l = parseFloat(ldl);
    const h = parseFloat(hdl);
    const t = parseFloat(tg);

    const lines: string[] = [];

    lines.push(`📊 Risk Category: ${riskPreview.cat} (Risk factors: ${score})`);
    lines.push(`   LDL: ${l || "?"} · HDL: ${h || "?"} · TG: ${t || "?"}`);
    lines.push(`   Target LDL: ${riskPreview.target}`);
    lines.push("");

    if (!isNaN(l)) {
      const targetNum = parseInt(riskPreview.target.replace(/[< >mg/dL]/g, ""));
      if (l <= targetNum) {
        lines.push("✅ LDL at target. Continue current therapy.");
      } else {
        lines.push(`⚠ ${l - targetNum} mg/dL above target (LDL ${l}, target ${riskPreview.target})`);
        lines.push(`➡️ Start: ${riskPreview.intensity}`);
        if (riskPreview.intensity === "High") lines.push("   Atorvastatin 40-80 mg OD or Rosuvastatin 20-40 mg OD");
        else if (riskPreview.intensity === "Moderate") lines.push("   Atorvastatin 10-20 mg OD or Rosuvastatin 5-10 mg OD");
        if (hasASCVD && l >= 70) lines.push("➡️ Consider adding Ezetimibe 10 mg");
      }
    }

    if (t >= 500) {
      lines.push("⚠ TG ≥ 500: Fenofibrate 145 mg for pancreatitis prevention");
      lines.push("   Avoid Gemfibrozil with statins (myopathy risk)");
    }
    if (t >= 200 && t < 500 && hasDM && hasASCVD) {
      lines.push("    Icosapent ethyl (Vascepa) 2 g BID for CV risk reduction (REDUCE-IT)");
    }

    lines.push("\nLp(a): Consider testing if early ASCVD or family history");
    lines.push("Monitoring: Lipids at 6 weeks, then 6-12 monthly once at target");

    setResult(lines.join("\n"));
  };

  return (
    <SectionCard title="Lipids — ASCVD Risk Score" icon={<Dna className="h-4 w-4" />} tone="primary">
      <div className="max-w-xl space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div><Label className="text-xs">LDL</Label><Input type="number" value={ldl} onChange={e => setLdl(e.target.value)} placeholder="130" className="h-9" /></div>
          <div><Label className="text-xs">HDL</Label><Input type="number" value={hdl} onChange={e => setHdl(e.target.value)} placeholder="42" className="h-9" /></div>
          <div><Label className="text-xs">TG</Label><Input type="number" value={tg} onChange={e => setTg(e.target.value)} placeholder="150" className="h-9" /></div>
          <div><Label className="text-xs">Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="55" className="h-9" /></div>
          <div>
            <Label className="text-xs">Sex</Label>
            <Select value={sex} onValueChange={(v: "male" | "female") => setSex(v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasASCVD} onChange={e => setHasASCVD(e.target.checked)} className="rounded" /><span className="text-xs">ASCVD Hx</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasDM} onChange={e => setHasDM(e.target.checked)} className="rounded" /><span className="text-xs">Diabetes</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasCKD} onChange={e => setHasCKD(e.target.checked)} className="rounded" /><span className="text-xs">CKD</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={smoker} onChange={e => setSmoker(e.target.checked)} className="rounded" /><span className="text-xs">Smoker</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={htn} onChange={e => setHtn(e.target.checked)} className="rounded" /><span className="text-xs">HTN</span></label>
        </div>

        {/* Live Risk Preview */}
        <div className={`p-3 rounded-lg border text-xs ${riskPreview.color}`}>
          <span className="font-semibold">{riskPreview.cat}</span>
          <span className="ml-2">→ LDL Target: <strong>{riskPreview.target}</strong></span>
          <span className="ml-2 text-[10px]">({riskPreview.intensity} · {score} factor{score !== 1 ? "s" : ""})</span>
        </div>

        <Button size="sm" onClick={calculate} className="w-full"><Calculator className="h-3.5 w-3.5 mr-1.5" /> Calculate Risk & Treatment</Button>
        {result && <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{result}</div>}
      </div>
    </SectionCard>
  );
}

/* ─── Obesity (Moderate) ─── */
function ObesityModerate() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [waist, setWaist] = useState("");
  const [hasDM, setHasDM] = useState(false);
  const [hasHTN, setHasHTN] = useState(false);
  const [hasOSA, setHasOSA] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const wa = parseFloat(waist);

    const bmi = w / ((h / 100) * (h / 100));
    const whr = wa ? wa / (h / 100) : null;

    const lines: string[] = [];
    lines.push(`📊 BMI: ${bmi.toFixed(1)} kg/m²`);
    if (whr) lines.push(`   Waist-Height Ratio: ${whr.toFixed(2)} ${whr >= 0.5 ? "⚠ Elevated" : "✅ Normal"}`);

    let cat: string;
    let rx: string;
    let med: string[] = [];

    if (bmi < 23) {
      cat = "Normal (Indian)"; rx = "Maintain lifestyle.";
    } else if (bmi < 25) {
      cat = "Overweight — At risk"; rx = "Diet + exercise. Screen for MetS.";
      if (hasDM || hasHTN) med.push("Consider GLP-1 RA (Semaglutide 1.0 mg)");
    } else if (bmi < 30) {
      cat = "Obese Class I"; rx = "500 kcal deficit + 150 min exercise/week";
      med.push("GLP-1 RA: Semaglutide 0.25 mg → 2.4 mg weekly");
    } else if (bmi < 35) {
      cat = "Obese Class II"; rx = "Structured weight program";
      med.push("GLP-1 RA: Semaglutide 2.4 mg weekly");
      med.push("Consider Tirzepatide 2.5 mg → 15 mg weekly (superior weight loss)");
      if (hasDM) med.push("Bariatric referral if BMI ≥ 32.5 with diabetes");
    } else {
      cat = "Obese Class III"; rx = "Refer bariatric surgery evaluation";
      med.push("Pre-op: GLP-1 RA (Semaglutide 2.4 mg / Tirzepatide 15 mg)");
      med.push("BMI ≥ 40: Surgery + medical therapy");
    }

    lines.push(`   Category: ${cat}`);
    lines.push(`   Plan: ${rx}`);
    if (med.length > 0) { lines.push(""); lines.push("💊 Medications:"); med.forEach(m => lines.push(`   • ${m}`)); }

    lines.push("\nTarget: 5-10% weight loss over 6 months");
    setResult(lines.join("\n"));
  };

  return (
    <SectionCard title="Obesity — GLP-1 Algorithm" icon={<Scale className="h-4 w-4" />} tone="purple">
      <div className="max-w-xl space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div><Label className="text-xs">Weight (kg)</Label><Input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="75" className="h-9" /></div>
          <div><Label className="text-xs">Height (cm)</Label><Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" className="h-9" /></div>
          <div><Label className="text-xs">Waist (cm)</Label><Input type="number" value={waist} onChange={e => setWaist(e.target.value)} placeholder="95" className="h-9" /></div>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasDM} onChange={e => setHasDM(e.target.checked)} className="rounded" /><span className="text-xs">Diabetes</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasHTN} onChange={e => setHasHTN(e.target.checked)} className="rounded" /><span className="text-xs">HTN</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasOSA} onChange={e => setHasOSA(e.target.checked)} className="rounded" /><span className="text-xs">OSA</span></label>
        </div>
        <Button size="sm" onClick={calculate} className="w-full"><Calculator className="h-3.5 w-3.5 mr-1.5" /> Assess & Recommend</Button>
        {result && <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{result}</div>}
      </div>
    </SectionCard>
  );
}

export default function ModerateMode() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <ModeNav />
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Moderate Mode</h1>
          <p className="text-sm text-muted-foreground">Guideline-integrated recommendations with risk stratification and comorbidity-based algorithm selection.</p>
        </div>
        <div className="space-y-4">
          <DiabetesModerate />
          <HypertensionModerate />
          <LipidsModerate />
          <ObesityModerate />
        </div>
        <p className="text-center text-xs text-muted-foreground/60 mt-6">Guidelines: ADA 2026 · ESC/ESH 2024 · LAI 2023 · ACC/AHA</p>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 px-4 flex items-center justify-center gap-3 z-50">
        <button onClick={() => window.location.href = "/"} className="px-3 py-1.5 text-xs font-semibold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">🏠 Homepage</button>
        <span className="text-[10px] text-muted-foreground/40">|</span>
        <button onClick={() => window.location.href = "/easy"} className="px-3 py-1.5 text-xs font-semibold rounded-md text-muted-foreground hover:bg-muted transition-colors">🟢 Easy</button>
        <button onClick={() => window.location.href = "/moderate"} className="px-3 py-1.5 text-xs font-semibold rounded-md bg-orange-500/15 text-orange-600 border border-orange-500/30 hover:bg-orange-500/25 transition-colors">🟠 Moderate</button>
        <button onClick={() => window.location.href = "/home"} className="px-3 py-1.5 text-xs font-semibold rounded-md text-muted-foreground hover:bg-muted transition-colors">🔴 Complex</button>
      </div>
      <div className="h-14" />
    </div>
  );
}
