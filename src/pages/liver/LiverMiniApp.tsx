import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Printer, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// --- Range dropdown helper ---
type Range = { label: string; value: number };
const RANGES: Record<string, Range[]> = {
  age:      [{label:"18-29",value:25},{label:"30-39",value:35},{label:"40-49",value:45},{label:"50-59",value:55},{label:"60-69",value:65},{label:"70-79",value:74},{label:"≥80",value:82}],
  ast:      [{label:"<20",value:15},{label:"20-39",value:30},{label:"40-79",value:60},{label:"80-159",value:120},{label:"160-299",value:220},{label:"≥300",value:400}],
  alt:      [{label:"<20",value:15},{label:"20-39",value:30},{label:"40-79",value:60},{label:"80-159",value:120},{label:"160-299",value:220},{label:"≥300",value:400}],
  alp:      [{label:"<120",value:90},{label:"120-249",value:180},{label:"250-499",value:350},{label:"≥500",value:600}],
  ggt:      [{label:"<50",value:30},{label:"50-149",value:100},{label:"150-299",value:220},{label:"≥300",value:400}],
  bili:     [{label:"<1.0",value:0.7},{label:"1.0-2.0",value:1.5},{label:"2.1-5.0",value:3.5},{label:"5.1-10",value:7},{label:">10",value:15}],
  albumin:  [{label:"<2.8",value:2.5},{label:"2.8-3.4",value:3.1},{label:"3.5-4.0",value:3.8},{label:">4.0",value:4.5}],
  platelets:[{label:"<100",value:80},{label:"100-149",value:125},{label:"150-249",value:200},{label:"250-400",value:300},{label:">400",value:450}],
  inr:      [{label:"<1.1",value:1.0},{label:"1.1-1.3",value:1.2},{label:"1.4-1.7",value:1.5},{label:">1.7",value:2.0}],
  bmi:      [{label:"<25",value:23},{label:"25-29.9",value:27},{label:"30-34.9",value:32},{label:"≥35",value:37}],
  glucose:  [{label:"<100",value:90},{label:"100-125",value:112},{label:"≥126",value:150}],
};

function RangeOrExact({
  id, label, unit, value, onChange, ranges,
}: { id: string; label: string; unit?: string; value: string; onChange: (v: string) => void; ranges: Range[] }) {
  const [mode, setMode] = useState<"range" | "exact">("range");
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs">{label} {unit && <span className="text-muted-foreground">({unit})</span>}</Label>
        <button type="button" onClick={() => setMode(m => m === "range" ? "exact" : "range")}
          className="text-[10px] text-primary hover:underline">{mode === "range" ? "exact" : "range"}</button>
      </div>
      {mode === "range" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={id} className="h-9"><SelectValue placeholder="Select range" /></SelectTrigger>
          <SelectContent>{ranges.map(r => <SelectItem key={r.label} value={String(r.value)}>{r.label}</SelectItem>)}</SelectContent>
        </Select>
      ) : (
        <Input id={id} type="number" inputMode="decimal" className="h-9" value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

// --- Score logic ---
type Risk = "low" | "indeterminate" | "high" | null;

function classifyFIB4(age: number, ast: number, alt: number, plt: number): { score: number; risk: Risk } {
  if (!age || !ast || !alt || !plt) return { score: NaN, risk: null };
  const score = (age * ast) / (plt * Math.sqrt(alt));
  // Age-adjusted: <65 use 1.3/2.67; ≥65 use 2.0/2.67
  const low = age >= 65 ? 2.0 : 1.3;
  const high = 2.67;
  const risk: Risk = score < low ? "low" : score <= high ? "indeterminate" : "high";
  return { score, risk };
}

function classifyAPRI(ast: number, astULN: number, plt: number): { score: number; risk: Risk } {
  if (!ast || !astULN || !plt) return { score: NaN, risk: null };
  const score = ((ast / astULN) * 100) / plt;
  const risk: Risk = score < 0.5 ? "low" : score <= 1.5 ? "indeterminate" : "high";
  return { score, risk };
}

function classifyNFS(age: number, bmi: number, hyperglycemia: boolean, plt: number, alb: number, ast: number, alt: number): { score: number; risk: Risk } {
  if (!age || !bmi || !plt || !alb || !ast || !alt) return { score: NaN, risk: null };
  const ifg = hyperglycemia ? 1 : 0;
  const score = -1.675 + 0.037 * age + 0.094 * bmi + 1.13 * ifg + 0.99 * (ast / alt) - 0.013 * plt - 0.66 * alb;
  const risk: Risk = score < -1.455 ? "low" : score <= 0.676 ? "indeterminate" : "high";
  return { score, risk };
}

function patternFromLFTs(ast: number, alt: number, alp: number, alpULN = 120): "hepatocellular" | "cholestatic" | "mixed" | "normal" | "unknown" {
  if (!ast && !alt && !alp) return "unknown";
  const altULN = 40;
  const altR = alt / altULN;
  const alpR = alp / alpULN;
  if (altR < 1 && alpR < 1) return "normal";
  const R = altR / Math.max(alpR, 0.01);
  if (R >= 5) return "hepatocellular";
  if (R <= 2) return "cholestatic";
  return "mixed";
}

const riskBadge = (r: Risk) => {
  if (r === "low") return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">Low risk</Badge>;
  if (r === "indeterminate") return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30">Indeterminate</Badge>;
  if (r === "high") return <Badge className="bg-red-500/15 text-red-400 border-red-500/30">High risk</Badge>;
  return <Badge variant="outline">—</Badge>;
};

export default function LiverMiniApp() {
  // Inputs
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [bmi, setBmi] = useState("");
  const [ast, setAst] = useState("");
  const [alt, setAlt] = useState("");
  const [alp, setAlp] = useState("");
  const [ggt, setGgt] = useState("");
  const [bili, setBili] = useState("");
  const [alb, setAlb] = useState("");
  const [plt, setPlt] = useState("");
  const [inr, setInr] = useState("");
  const [astULN, setAstULN] = useState("40");

  // Context
  const [diabetes, setDiabetes] = useState(false);
  const [glucoseHigh, setGlucoseHigh] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [viral, setViral] = useState(false);
  const [obesity, setObesity] = useState(false);
  const [meds, setMeds] = useState(false);
  const [pregnant, setPregnant] = useState(false);
  const [jaundice, setJaundice] = useState(false);
  const [encephalopathy, setEncephalopathy] = useState(false);

  const n = (s: string) => parseFloat(s) || 0;

  const fib4 = useMemo(() => classifyFIB4(n(age), n(ast), n(alt), n(plt)), [age, ast, alt, plt]);
  const apri = useMemo(() => classifyAPRI(n(ast), n(astULN), n(plt)), [ast, astULN, plt]);
  const nfs  = useMemo(() => classifyNFS(n(age), n(bmi), diabetes || glucoseHigh, n(plt), n(alb), n(ast), n(alt)),
    [age, bmi, diabetes, glucoseHigh, plt, alb, ast, alt]);

  const pattern = useMemo(() => patternFromLFTs(n(ast), n(alt), n(alp)), [ast, alt, alp]);

  const redFlags = useMemo(() => {
    const flags: string[] = [];
    if (n(bili) >= 3) flags.push(`Bilirubin ${bili} mg/dL — significant hyperbilirubinemia`);
    if (n(inr) >= 1.5) flags.push(`INR ${inr} — coagulopathy, possible acute liver failure`);
    if (n(alb) > 0 && n(alb) < 3.0) flags.push(`Albumin ${alb} g/dL — synthetic dysfunction`);
    if (n(plt) > 0 && n(plt) < 150) flags.push(`Platelets ${plt} — possible portal hypertension`);
    if (n(alt) >= 1000 || n(ast) >= 1000) flags.push("Transaminases >1000 — ischemic, toxic, or viral hepatitis");
    if (encephalopathy) flags.push("Hepatic encephalopathy — urgent referral");
    if (jaundice && n(inr) >= 1.5) flags.push("Jaundice + coagulopathy — ALF criteria, ER referral");
    return flags;
  }, [bili, inr, alb, plt, ast, alt, encephalopathy, jaundice]);

  const pathway = useMemo(() => {
    const steps: string[] = [];
    if (redFlags.length) {
      steps.push("URGENT: features of acute liver failure or decompensation — same-day hepatology/ER referral.");
      return steps;
    }
    if (pattern === "normal") {
      steps.push("LFTs within reference range — no further work-up indicated unless clinical suspicion.");
      return steps;
    }
    steps.push(`Pattern: ${pattern.toUpperCase()} injury.`);
    if (pattern === "hepatocellular") {
      steps.push("Step 1 — Reversible causes: stop hepatotoxic meds (statins, NSAIDs, herbals), assess alcohol intake.");
      steps.push("Step 2 — Viral serologies: HBsAg, anti-HCV, anti-HAV IgM, anti-HEV IgM.");
      steps.push("Step 3 — Metabolic: fasting glucose/HbA1c, lipids, ferritin/transferrin saturation.");
      steps.push("Step 4 — Autoimmune (if persistent >6 mo): ANA, ASMA, IgG, anti-LKM.");
      steps.push("Step 5 — Imaging: abdominal ultrasound for steatosis/structural disease.");
    } else if (pattern === "cholestatic") {
      steps.push("Step 1 — Confirm hepatic origin: fractionate ALP or check GGT (elevated GGT confirms liver).");
      steps.push("Step 2 — Abdominal ultrasound to exclude biliary obstruction.");
      steps.push("Step 3 — If ducts dilated: MRCP / GI referral. If not: AMA (PBC), review drugs.");
    } else if (pattern === "mixed") {
      steps.push("Workup overlaps hepatocellular and cholestatic — pursue both panels and imaging.");
    }

    // Fibrosis triage
    if (!isNaN(fib4.score)) {
      if (fib4.risk === "low") {
        steps.push(`FIB-4 = ${fib4.score.toFixed(2)} → LOW fibrosis risk. Address risk factors; recheck FIB-4 in 1–3 years (sooner if T2DM/obesity).`);
      } else if (fib4.risk === "indeterminate") {
        steps.push(`FIB-4 = ${fib4.score.toFixed(2)} → INDETERMINATE. Confirm with secondary test (FibroScan / ELF / NFS).`);
      } else {
        steps.push(`FIB-4 = ${fib4.score.toFixed(2)} → HIGH fibrosis risk. Refer to hepatology for FibroScan / biopsy.`);
      }
    }
    return steps;
  }, [pattern, fib4, redFlags]);

  const buildSummary = () => {
    const lines = [
      "PRIMARY-CARE LIVER TEST INTERPRETATION",
      "=".repeat(50),
      `Patient: ${sex || "—"}, age ${age || "—"}, BMI ${bmi || "—"}`,
      `Context: ${[diabetes && "T2DM", alcohol && "Alcohol use", viral && "Viral risk", obesity && "Obesity", meds && "Hepatotoxic meds", pregnant && "Pregnant"].filter(Boolean).join(", ") || "none reported"}`,
      "",
      "LABS",
      `  AST ${ast || "—"} / ALT ${alt || "—"} / ALP ${alp || "—"} / GGT ${ggt || "—"}`,
      `  Bilirubin ${bili || "—"} / Albumin ${alb || "—"} / Platelets ${plt || "—"} / INR ${inr || "—"}`,
      "",
      `PATTERN: ${pattern.toUpperCase()}`,
      "",
      "FIBROSIS SCORES",
      `  FIB-4:  ${isNaN(fib4.score) ? "n/a" : fib4.score.toFixed(2)}  (${fib4.risk ?? "n/a"})`,
      `  APRI:   ${isNaN(apri.score) ? "n/a" : apri.score.toFixed(2)}  (${apri.risk ?? "n/a"})`,
      `  NFS:    ${isNaN(nfs.score)  ? "n/a" : nfs.score.toFixed(2)}  (${nfs.risk ?? "n/a"})`,
      "",
      redFlags.length ? "RED FLAGS\n" + redFlags.map(f => "  • " + f).join("\n") + "\n" : "",
      "MANAGEMENT PATHWAY",
      ...pathway.map((s, i) => `  ${i + 1}. ${s}`),
    ];
    return lines.filter(Boolean).join("\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildSummary());
    toast({ title: "Summary copied", description: "Liver assessment copied to clipboard." });
  };

  const handlePrint = () => {
    const html = `<!doctype html><html><head><title>Liver Assessment</title>
      <style>body{font-family:system-ui,sans-serif;max-width:780px;margin:2rem auto;padding:0 1.5rem;color:#111;line-height:1.5}
      h1{font-size:18px;border-bottom:2px solid #333;padding-bottom:6px}
      h2{font-size:14px;margin-top:18px;color:#333}
      pre{white-space:pre-wrap;font-family:inherit;font-size:13px}
      .meta{font-size:11px;color:#666;margin-top:24px;border-top:1px solid #ccc;padding-top:8px}</style></head>
      <body><h1>Primary-Care Liver Test Interpretation</h1>
      <pre>${buildSummary().replace(/</g,"&lt;")}</pre>
      <div class="meta">Generated ${new Date().toLocaleString()} — clinical decision support, not a substitute for clinical judgment.</div>
      <script>window.onload=()=>window.print()</script></body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto p-4">
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Liver Test Interpretation — Primary Care</CardTitle>
          </div>
          <CardDescription>
            Abnormal LFT pathway with FIB-4 (primary triage), APRI and NAFLD Fibrosis Score companions. All computation is local.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Inputs */}
        <Card>
          <CardHeader><CardTitle className="text-base">Patient & Context</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <RangeOrExact id="age" label="Age" unit="years" value={age} onChange={setAge} ranges={RANGES.age} />
              <div className="space-y-1.5">
                <Label className="text-xs">Sex</Label>
                <Select value={sex} onValueChange={setSex}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <RangeOrExact id="bmi" label="BMI" unit="kg/m²" value={bmi} onChange={setBmi} ranges={RANGES.bmi} />
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-2 border-t">
              {[
                ["diabetes","T2DM / pre-diabetes", diabetes, setDiabetes],
                ["glucoseHigh","Fasting glucose ≥110", glucoseHigh, setGlucoseHigh],
                ["obesity","Obesity / metabolic syndrome", obesity, setObesity],
                ["alcohol","Significant alcohol use", alcohol, setAlcohol],
                ["viral","Viral hepatitis risk", viral, setViral],
                ["meds","On hepatotoxic medications", meds, setMeds],
                ["pregnant","Pregnant", pregnant, setPregnant],
                ["jaundice","Clinical jaundice", jaundice, setJaundice],
                ["encephalopathy","Encephalopathy / asterixis", encephalopathy, setEncephalopathy],
              ].map(([id, label, val, setter]: any) => (
                <label key={id} className="flex items-center gap-2 text-xs cursor-pointer">
                  <Checkbox checked={val} onCheckedChange={(v) => setter(!!v)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Liver Labs</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <RangeOrExact id="ast" label="AST" unit="U/L" value={ast} onChange={setAst} ranges={RANGES.ast} />
            <RangeOrExact id="alt" label="ALT" unit="U/L" value={alt} onChange={setAlt} ranges={RANGES.alt} />
            <RangeOrExact id="alp" label="ALP" unit="U/L" value={alp} onChange={setAlp} ranges={RANGES.alp} />
            <RangeOrExact id="ggt" label="GGT" unit="U/L" value={ggt} onChange={setGgt} ranges={RANGES.ggt} />
            <RangeOrExact id="bili" label="Bilirubin" unit="mg/dL" value={bili} onChange={setBili} ranges={RANGES.bili} />
            <RangeOrExact id="alb" label="Albumin" unit="g/dL" value={alb} onChange={setAlb} ranges={RANGES.albumin} />
            <RangeOrExact id="plt" label="Platelets" unit="×10⁹/L" value={plt} onChange={setPlt} ranges={RANGES.platelets} />
            <RangeOrExact id="inr" label="INR" value={inr} onChange={setInr} ranges={RANGES.inr} />
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs">AST upper limit of normal (for APRI)</Label>
              <Input type="number" className="h-9" value={astULN} onChange={e => setAstULN(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <Card className="border-primary/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Computed Plan</CardTitle>
            <CardDescription>Pattern, fibrosis triage and next-step pathway</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}><Copy className="h-4 w-4 mr-1" />Copy</Button>
            <Button size="sm" onClick={handlePrint}><Printer className="h-4 w-4 mr-1" />Print / PDF</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border bg-card/60">
              <div className="text-[10px] uppercase text-muted-foreground">LFT pattern</div>
              <div className="text-sm font-semibold mt-1 capitalize">{pattern}</div>
            </div>
            <div className="p-3 rounded-lg border bg-card/60">
              <div className="text-[10px] uppercase text-muted-foreground">FIB-4 (primary)</div>
              <div className="text-sm font-semibold mt-1">{isNaN(fib4.score) ? "—" : fib4.score.toFixed(2)}</div>
              <div className="mt-1">{riskBadge(fib4.risk)}</div>
            </div>
            <div className="p-3 rounded-lg border bg-card/60">
              <div className="text-[10px] uppercase text-muted-foreground">APRI</div>
              <div className="text-sm font-semibold mt-1">{isNaN(apri.score) ? "—" : apri.score.toFixed(2)}</div>
              <div className="mt-1">{riskBadge(apri.risk)}</div>
            </div>
            <div className="p-3 rounded-lg border bg-card/60">
              <div className="text-[10px] uppercase text-muted-foreground">NAFLD FS</div>
              <div className="text-sm font-semibold mt-1">{isNaN(nfs.score) ? "—" : nfs.score.toFixed(2)}</div>
              <div className="mt-1">{riskBadge(nfs.risk)}</div>
            </div>
          </div>

          {redFlags.length > 0 && (
            <div className="p-3 rounded-lg border border-red-500/40 bg-red-500/5">
              <div className="text-xs font-semibold text-red-400 mb-1">Red flags — urgent referral</div>
              <ul className="text-xs space-y-0.5 list-disc list-inside">
                {redFlags.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
          )}

          <div className="p-3 rounded-lg border bg-card/60">
            <div className="text-xs font-semibold mb-2">Next-step pathway</div>
            <ol className="text-xs space-y-1 list-decimal list-inside">
              {pathway.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>

          <div className="text-[10px] text-muted-foreground">
            FIB-4 cut-offs: &lt;1.3 low / 1.3–2.67 indeterminate / &gt;2.67 high (use 2.0 lower cut-off if age ≥65).
            APRI: &lt;0.5 low / 0.5–1.5 indeterminate / &gt;1.5 high. NFS: &lt;−1.455 low / up to 0.676 indeterminate / &gt;0.676 high.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
