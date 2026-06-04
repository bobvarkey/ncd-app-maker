import { useState } from "react";
import { Pill, FlaskConical, Search, AlertTriangle, Syringe, Droplet, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { ANTIBIOTICS_DATA } from "./antibiotics-data";
import { ANTICOAGULANTS_DATA } from "./anticoagulants-data";
import { cn } from "@/lib/utils";
import { SmartLabelUpload, RENAL_FIELDS } from "@/components/SmartLabelUpload";

export type { DoseEntry };

type DoseEntry = {
  drug: string;
  drugClass: string;
  normalDose: string;
  eGFR60_89: string;
  eGFR45_59: string;
  eGFR30_44: string;
  eGFR15_29: string;
  eGFRBelow15: string;
  notes: string;
  hepatic?: string;
};

const RENAL_DATA: DoseEntry[] = [
  {
    drug: "Metformin",
    drugClass: "Biguanide",
    normalDose: "500–2000 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Max 1000 mg/day",
    eGFR15_29: "Contraindicated",
    eGFRBelow15: "Contraindicated",
    notes: "Do not initiate if eGFR <30. Reassess if <45.",
  },
  {
    drug: "Empagliflozin",
    drugClass: "SGLT2 Inhibitor",
    normalDose: "10–25 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Do not initiate; may continue if already on",
    eGFRBelow15: "Contraindicated",
    notes: "CV/renal benefit persists at lower eGFR. Glycemic efficacy reduced below 45.",
  },
  {
    drug: "Dapagliflozin",
    drugClass: "SGLT2 Inhibitor",
    normalDose: "5–10 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Do not initiate; may continue if already on",
    eGFRBelow15: "Contraindicated",
    notes: "Approved for CKD and HF benefit regardless of diabetes.",
  },
  {
    drug: "Canagliflozin",
    drugClass: "SGLT2 Inhibitor",
    normalDose: "100–300 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "Max 100 mg/day",
    eGFR30_44: "Max 100 mg/day",
    eGFR15_29: "Contraindicated",
    eGFRBelow15: "Contraindicated",
    notes: "Monitor for amputation risk in peripheral vascular disease.",
  },
  {
    drug: "Semaglutide (oral)",
    drugClass: "GLP-1 RA",
    normalDose: "3–14 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Use with caution",
    eGFRBelow15: "Limited data",
    notes: "GI side effects may worsen dehydration in CKD.",
  },
  {
    drug: "Semaglutide (SC)",
    drugClass: "GLP-1 RA",
    normalDose: "0.25–2 mg/week",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Use with caution",
    eGFRBelow15: "Limited data",
    notes: "Proven CV benefit (SUSTAIN-6, SELECT).",
  },
  {
    drug: "Liraglutide",
    drugClass: "GLP-1 RA",
    normalDose: "0.6–1.8 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Use with caution",
    eGFRBelow15: "Limited data",
    notes: "CV benefit proven (LEADER trial).",
  },
  {
    drug: "Dulaglutide",
    drugClass: "GLP-1 RA",
    normalDose: "0.75–4.5 mg/week",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Use with caution",
    eGFRBelow15: "Limited data",
    notes: "Renal composite benefit shown in REWIND.",
  },
  {
    drug: "Tirzepatide",
    drugClass: "GIP/GLP-1 RA",
    normalDose: "2.5–15 mg/week",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Use with caution",
    eGFRBelow15: "Limited data",
    notes: "Superior HbA1c and weight reduction (SURPASS trials).",
  },
  {
    drug: "Alogliptin",
    drugClass: "DPP-4 Inhibitor",
    normalDose: "25 mg/day",
    eGFR60_89: "25 mg/day",
    eGFR45_59: "12.5 mg/day",
    eGFR30_44: "12.5 mg/day",
    eGFR15_29: "6.25 mg/day",
    eGFRBelow15: "6.25 mg/day",
    notes: "Renally excreted; dose-adjust by CrCl. FDA boxed warning: HF risk.",
    hepatic: "No adjustment for mild–moderate (Child–Pugh A/B). Not studied in severe hepatic impairment — avoid.",
  },
  {
    drug: "Sitagliptin",
    drugClass: "DPP-4 Inhibitor",
    normalDose: "100 mg/day",
    eGFR60_89: "100 mg/day",
    eGFR45_59: "100 mg/day (50 mg if CrCl <50)",
    eGFR30_44: "50 mg/day",
    eGFR15_29: "25 mg/day",
    eGFRBelow15: "25 mg/day",
    notes: "Can be used across all stages of CKD with dose adjustment. Per ESRD label: 25 mg OD.",
    hepatic: "No adjustment for mild–moderate (Child–Pugh ≤9). Not studied in severe hepatic impairment.",
  },
  {
    drug: "Saxagliptin",
    drugClass: "DPP-4 Inhibitor",
    normalDose: "5 mg/day",
    eGFR60_89: "5 mg/day",
    eGFR45_59: "5 mg/day",
    eGFR30_44: "2.5 mg/day",
    eGFR15_29: "2.5 mg/day",
    eGFRBelow15: "2.5 mg/day (avoid in ESRD on dialysis)",
    notes: "Caution: associated with HF hospitalization (SAVOR-TIMI 53). Reduce dose with strong CYP3A4/5 inhibitors.",
    hepatic: "No adjustment for any degree of hepatic impairment; use with caution in severe.",
  },
  {
    drug: "Linagliptin",
    drugClass: "DPP-4 Inhibitor",
    normalDose: "5 mg/day",
    eGFR60_89: "5 mg/day",
    eGFR45_59: "5 mg/day",
    eGFR30_44: "5 mg/day",
    eGFR15_29: "5 mg/day",
    eGFRBelow15: "5 mg/day",
    notes: "No renal dose adjustment needed — primarily biliary/hepatic elimination (<5% renal).",
    hepatic: "No dose adjustment required in any degree of hepatic impairment.",
  },
  {
    drug: "Vildagliptin",
    drugClass: "DPP-4 Inhibitor",
    normalDose: "50 mg BID",
    eGFR60_89: "50 mg BID (50 mg OD if dual therapy with SU)",
    eGFR45_59: "50 mg once daily",
    eGFR30_44: "50 mg once daily",
    eGFR15_29: "50 mg once daily",
    eGFRBelow15: "50 mg once daily",
    notes: "Widely used in India. Monitor LFTs at baseline, q3 months ×1 year, then periodically.",
    hepatic: "Contraindicated if ALT/AST >3× ULN or any pre-existing hepatic impairment.",
  },
  {
    drug: "Pioglitazone",
    drugClass: "Thiazolidinedione",
    normalDose: "15–45 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "No adjustment",
    eGFRBelow15: "No adjustment",
    notes: "Avoid in HF (NYHA III–IV). Risk of fluid retention.",
  },
  {
    drug: "Glimepiride",
    drugClass: "Sulfonylurea",
    normalDose: "1–4 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "Start at 1 mg",
    eGFR30_44: "Start at 1 mg",
    eGFR15_29: "Avoid",
    eGFRBelow15: "Avoid",
    notes: "High hypo risk in CKD — active metabolites accumulate.",
  },
  {
    drug: "Gliclazide",
    drugClass: "Sulfonylurea",
    normalDose: "40–320 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Use with caution",
    eGFR15_29: "Avoid",
    eGFRBelow15: "Avoid",
    notes: "Preferred SU in CKD (hepatic metabolism). Still carries hypo risk.",
  },
  {
    drug: "Glipizide",
    drugClass: "Sulfonylurea",
    normalDose: "2.5–20 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Start low",
    eGFR15_29: "Avoid",
    eGFRBelow15: "Avoid",
    notes: "Short-acting, hepatic metabolism. Preferred SU if CKD stage 3.",
  },
  {
    drug: "Insulin Glargine",
    drugClass: "Basal Insulin",
    normalDose: "Individualized",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Reduce dose 25%",
    eGFR15_29: "Reduce dose 50%",
    eGFRBelow15: "Reduce dose 50%+",
    notes: "Insulin clearance is reduced in CKD — high hypo risk.",
  },
  {
    drug: "Insulin Degludec",
    drugClass: "Basal Insulin",
    normalDose: "Individualized",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Reduce dose 25%",
    eGFR15_29: "Reduce dose 50%",
    eGFRBelow15: "Reduce dose 50%+",
    notes: "Ultra-long acting — lower hypo risk vs glargine in CKD.",
  },
  {
    drug: "Finerenone",
    drugClass: "MRA (non-steroidal)",
    normalDose: "10–20 mg/day",
    eGFR60_89: "20 mg/day",
    eGFR45_59: "20 mg/day",
    eGFR30_44: "10 mg/day",
    eGFR15_29: "10 mg/day",
    eGFRBelow15: "Avoid",
    notes: "Indicated for CKD + T2DM. Monitor K+ closely. Do not start if K >5.0.",
  },
];

const eGFRColumns = [
  { key: "eGFR60_89" as const, label: "60–89" },
  { key: "eGFR45_59" as const, label: "45–59" },
  { key: "eGFR30_44" as const, label: "30–44" },
  { key: "eGFR15_29" as const, label: "15–29" },
  { key: "eGFRBelow15" as const, label: "<15" },
];

const cellStyle = (val: string) => {
  const v = val.toLowerCase();
  if (v.includes("contraindicated") || v === "avoid")
    return "bg-destructive/10 text-destructive font-medium";
  if (v.includes("caution") || v.includes("reduce") || v.includes("start low") || v.includes("start at") || v.includes("max") || v.includes("do not initiate"))
    return "bg-warning/10 text-warning font-medium";
  if (v.includes("limited"))
    return "bg-muted text-muted-foreground";
  return "";
};

const RenalDoseAdjustment = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");

  function handleSmartParse(values: Record<string, string>) {
    if (values.egfr) setSearch(`eGFR ${values.egfr}`);
    if (values.creatinine) setSearch(`creatinine ${values.creatinine}`);
    if (values.weight) setSearch(`weight ${values.weight}`);
  }
  const [category, setCategory] = useState<"all" | "diabetes" | "antibiotics" | "anticoagulants">("all");

  const activeData =
    category === "antibiotics" ? ANTIBIOTICS_DATA
    : category === "anticoagulants" ? ANTICOAGULANTS_DATA
    : category === "diabetes" ? RENAL_DATA
    : [...RENAL_DATA, ...ANTIBIOTICS_DATA, ...ANTICOAGULANTS_DATA];
  const classes = [...new Set(activeData.map(d => d.drugClass))];

  const filtered = activeData.filter(d => {
    const matchSearch = !search || d.drug.toLowerCase().includes(search.toLowerCase()) || d.drugClass.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "all" || d.drugClass === classFilter;
    return matchSearch && matchClass;
  });

  

  return (
    <div className="space-y-5 animate-slide-in">
      <div>
        <h1 className="text-xl font-heading font-bold flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          Renal &amp; Hepatic Dose Adjustment
        </h1>
        <p className="text-sm text-muted-foreground">Search any medication for renal (eGFR) and hepatic dose modifications (ADA 2026 + KDIGO)</p>
      </div>

      {/* Prominent Universal Search */}
      <div className="clinical-card p-4 border-primary/30 bg-primary/5">
        <label className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 block">
          Search any medication
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Type a drug name or class (e.g. metformin, DPP-4, apixaban, ceftriaxone)…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-11 text-base"
              autoFocus
            />
          </div>
          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            className="h-11 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All Classes</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{filtered.length} medication{filtered.length === 1 ? "" : "s"} matched · shows renal (eGFR) and hepatic adjustments</p>
      </div>


      {/* Category Toggle */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setCategory("all"); setClassFilter("all"); setSearch(""); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            category === "all"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Layers className="h-4 w-4" />
          All Drugs
        </button>
        <button
          onClick={() => { setCategory("diabetes"); setClassFilter("all"); setSearch(""); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            category === "diabetes"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Pill className="h-4 w-4" />
          Diabetes
        </button>
        <button
          onClick={() => { setCategory("antibiotics"); setClassFilter("all"); setSearch(""); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            category === "antibiotics"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Syringe className="h-4 w-4" />
          Antibiotics
        </button>
        <button
          onClick={() => { setCategory("anticoagulants"); setClassFilter("all"); setSearch(""); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            category === "anticoagulants"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Droplet className="h-4 w-4" />
          Anticoagulants
        </button>
        <span className="text-xs text-muted-foreground self-center ml-2">{filtered.length} drugs</span>
      </div>

      {/* Legend */}
      <div className="clinical-card p-3 flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-destructive/20 border border-destructive/30" /> Contraindicated / Avoid</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-warning/20 border border-warning/30" /> Dose adjustment required</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-muted border border-border" /> Limited data</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-background border border-border" /> No adjustment</span>
      </div>

      <div className="mt-4">
        <SmartLabelUpload fields={RENAL_FIELDS.fields} onParse={handleSmartParse} existingValues={{}} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search drug or class..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={classFilter}
          onChange={e => setClassFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="clinical-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[140px] sticky left-0 bg-muted/50 z-10">Drug</TableHead>
                <TableHead className="min-w-[100px]">Class</TableHead>
                <TableHead className="min-w-[120px]">Normal Dose</TableHead>
                {eGFRColumns.map(col => (
                  <TableHead key={col.key} className="min-w-[110px] text-center">
                    <div className="text-[10px] text-muted-foreground">eGFR</div>
                    <div>{col.label}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium sticky left-0 bg-card z-10">
                    <div className="flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-primary shrink-0" />
                      {d.drug}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.drugClass}</TableCell>
                  <TableCell className="text-xs">{d.normalDose}</TableCell>
                  {eGFRColumns.map(col => (
                    <TableCell key={col.key} className={`text-xs text-center ${cellStyle(d[col.key])}`}>
                      {d[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No medications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Clinical Notes */}
      <div className="clinical-card">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <h3 className="section-title">Clinical Notes</h3>
        </div>
        <div className="space-y-2">
          {filtered.filter(d => d.notes).map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="font-medium text-primary min-w-[100px]">{d.drug}:</span>
              <span className="text-muted-foreground">{d.notes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RenalDoseAdjustment;
