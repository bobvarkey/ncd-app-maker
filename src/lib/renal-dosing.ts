export interface RenalDrugAdjust {
  drug: string;
  class: string;
  normal: string;
  egfr_30_59?: string;
  egfr_15_29?: string;
  egfr_lt15?: string;
  notes?: string;
}

export const RENAL_DRUGS: RenalDrugAdjust[] = [
  // Antidiabetics
  { drug: "Metformin", class: "Biguanide", normal: "500–2000 mg/day", egfr_30_59: "Max 1000 mg/day; reassess", egfr_15_29: "Avoid / discontinue", egfr_lt15: "Contraindicated" },
  { drug: "Sitagliptin", class: "DPP-4", normal: "100 mg OD", egfr_30_59: "50 mg OD (45–<60: full)", egfr_15_29: "25 mg OD", egfr_lt15: "25 mg OD" },
  { drug: "Linagliptin", class: "DPP-4", normal: "5 mg OD", egfr_30_59: "5 mg OD", egfr_15_29: "5 mg OD", egfr_lt15: "5 mg OD (no adjust)" },
  { drug: "Empagliflozin", class: "SGLT2", normal: "10–25 mg OD", egfr_30_59: "10 mg OD", egfr_15_29: "Initiate if eGFR ≥20; continue if started", egfr_lt15: "Avoid / dialysis: discontinue" },
  { drug: "Dapagliflozin", class: "SGLT2", normal: "10 mg OD", egfr_30_59: "10 mg OD", egfr_15_29: "Continue if started (≥25)", egfr_lt15: "Avoid" },
  { drug: "Insulin", class: "Insulin", normal: "Per regimen", egfr_30_59: "Reduce ~25%", egfr_15_29: "Reduce ~50%", egfr_lt15: "Individualize, ↓ further" },
  { drug: "Glipizide", class: "Sulfonylurea", normal: "5–20 mg/day", egfr_30_59: "Start low, titrate", egfr_15_29: "Use cautiously", egfr_lt15: "Avoid" },
  { drug: "Glimepiride", class: "Sulfonylurea", normal: "1–8 mg OD", egfr_30_59: "Start 1 mg", egfr_15_29: "Avoid", egfr_lt15: "Avoid" },
  // Analgesics / neuro
  { drug: "Gabapentin", class: "Anticonvulsant", normal: "300–1200 mg TDS", egfr_30_59: "200–700 mg BD–TDS", egfr_15_29: "200–700 mg OD", egfr_lt15: "100–300 mg OD" },
  { drug: "Pregabalin", class: "Anticonvulsant", normal: "75–300 mg BD", egfr_30_59: "75 mg BD max", egfr_15_29: "25–75 mg OD", egfr_lt15: "25–50 mg OD" },
  { drug: "Tramadol", class: "Opioid", normal: "50–100 mg q4–6h", egfr_30_59: "50–100 mg q12h", egfr_15_29: "50 mg q12h", egfr_lt15: "Avoid" },
  // Cardiac
  { drug: "Digoxin", class: "Cardiac glycoside", normal: "0.125–0.25 mg OD", egfr_30_59: "0.125 mg OD or QOD", egfr_15_29: "0.0625–0.125 mg OD", egfr_lt15: "0.0625 mg OD; monitor levels" },
  { drug: "Atenolol", class: "β-blocker", normal: "50–100 mg OD", egfr_30_59: "50 mg OD", egfr_15_29: "25 mg OD", egfr_lt15: "25 mg QOD" },
  { drug: "Enoxaparin", class: "LMWH", normal: "1 mg/kg BD", egfr_30_59: "1 mg/kg BD", egfr_15_29: "1 mg/kg OD", egfr_lt15: "Avoid; use UFH" },
  { drug: "Rivaroxaban", class: "DOAC", normal: "20 mg OD (AF)", egfr_30_59: "15 mg OD", egfr_15_29: "15 mg OD (avoid <15)", egfr_lt15: "Avoid" },
  { drug: "Apixaban", class: "DOAC", normal: "5 mg BD", egfr_30_59: "5 mg BD", egfr_15_29: "2.5 mg BD if age ≥80 or wt ≤60", egfr_lt15: "2.5 mg BD (limited data)" },
  { drug: "Dabigatran", class: "DOAC", normal: "150 mg BD", egfr_30_59: "110–150 mg BD", egfr_15_29: "75 mg BD or avoid", egfr_lt15: "Contraindicated" },
  // Antibiotics
  { drug: "Amoxicillin", class: "Penicillin", normal: "500 mg TDS", egfr_30_59: "500 mg TDS", egfr_15_29: "500 mg BD", egfr_lt15: "500 mg OD" },
  { drug: "Amoxicillin-Clavulanate", class: "β-lactam/BLI", normal: "625 mg TDS / 1g BD", egfr_30_59: "625 mg BD", egfr_15_29: "625 mg OD", egfr_lt15: "375–625 mg OD post-HD" },
  { drug: "Piperacillin-Tazobactam", class: "β-lactam/BLI", normal: "4.5 g IV q6h", egfr_30_59: "3.375 g q6h", egfr_15_29: "2.25 g q6h", egfr_lt15: "2.25 g q8h" },
  { drug: "Cefepime", class: "Cephalosporin", normal: "2 g IV q8h", egfr_30_59: "2 g q12h", egfr_15_29: "1 g q24h", egfr_lt15: "500 mg q24h" },
  { drug: "Ceftriaxone", class: "Cephalosporin", normal: "1–2 g IV q24h", egfr_30_59: "No adjust", egfr_15_29: "No adjust", egfr_lt15: "Max 2 g/day" },
  { drug: "Meropenem", class: "Carbapenem", normal: "1 g IV q8h", egfr_30_59: "1 g q12h", egfr_15_29: "500 mg q12h", egfr_lt15: "500 mg q24h" },
  { drug: "Vancomycin (IV)", class: "Glycopeptide", normal: "15–20 mg/kg q8–12h", egfr_30_59: "15 mg/kg q24h, monitor", egfr_15_29: "15 mg/kg q48h", egfr_lt15: "Load 25 mg/kg, redose by levels" },
  { drug: "Gentamicin", class: "Aminoglycoside", normal: "5–7 mg/kg q24h", egfr_30_59: "q36h", egfr_15_29: "q48h", egfr_lt15: "Avoid or by levels" },
  { drug: "Ciprofloxacin", class: "Fluoroquinolone", normal: "500 mg PO BD / 400 mg IV BD", egfr_30_59: "250–500 mg BD", egfr_15_29: "250–500 mg OD", egfr_lt15: "250–500 mg OD" },
  { drug: "Levofloxacin", class: "Fluoroquinolone", normal: "750 mg OD", egfr_30_59: "750 mg q48h", egfr_15_29: "750 mg load → 500 mg q48h", egfr_lt15: "750 mg load → 500 mg q48h" },
  { drug: "TMP-SMX", class: "Folate antag.", normal: "1 DS BD", egfr_30_59: "Full dose", egfr_15_29: "Reduce 50%", egfr_lt15: "Avoid" },
  { drug: "Nitrofurantoin", class: "Nitrofuran", normal: "100 mg BD", egfr_30_59: "Avoid if <60", egfr_15_29: "Avoid", egfr_lt15: "Avoid" },
  { drug: "Acyclovir (IV)", class: "Antiviral", normal: "5–10 mg/kg q8h", egfr_30_59: "5–10 mg/kg q12h", egfr_15_29: "5–10 mg/kg q24h", egfr_lt15: "2.5–5 mg/kg q24h" },
  { drug: "Fluconazole", class: "Azole", normal: "200–400 mg OD", egfr_30_59: "Full dose", egfr_15_29: "50% dose", egfr_lt15: "50% dose" },
  { drug: "Metronidazole", class: "Nitroimidazole", normal: "500 mg TDS", egfr_30_59: "No adjust", egfr_15_29: "No adjust", egfr_lt15: "Reduce dose 50% (ESRD)" },
];

export function bandForEgfr(egfr: number): "normal" | "30-59" | "15-29" | "<15" {
  if (egfr >= 60) return "normal";
  if (egfr >= 30) return "30-59";
  if (egfr >= 15) return "15-29";
  return "<15";
}

export function ckdStageFromEgfr(egfr: number): string {
  if (egfr >= 90) return "G1 (Normal/high)";
  if (egfr >= 60) return "G2 (Mildly decreased)";
  if (egfr >= 45) return "G3a";
  if (egfr >= 30) return "G3b";
  if (egfr >= 15) return "G4 (Severe)";
  return "G5 (Kidney failure)";
}
