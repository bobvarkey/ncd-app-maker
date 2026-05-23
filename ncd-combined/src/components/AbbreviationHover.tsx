import React from "react";

const ABBREVIATIONS: Record<string, string> = {
  "ASCVD": "Atherosclerotic Cardiovascular Disease — includes CAD (MI, angina, revasc), cerebrovascular disease (stroke/TIA), and PAD",
  "GLP-1 RA": "Glucagon-Like Peptide-1 Receptor Agonist — e.g., Semaglutide, Liraglutide, Dulaglutide. Promotes insulin secretion, slows gastric emptying, induces weight loss.",
  "GLP-1": "Glucagon-Like Peptide-1 — incretin hormone that stimulates insulin secretion in response to meals",
  "SGLT2i": "Sodium-Glucose Cotransporter-2 Inhibitor — e.g., Empagliflozin, Dapagliflozin. Reduces glucose reabsorption in kidney, provides CV/renal protection.",
  "SGLT2": "Sodium-Glucose Cotransporter-2 — transporter in proximal renal tubule responsible for 90% of glucose reabsorption",
  "CKD": "Chronic Kidney Disease — persistent kidney damage or reduced eGFR < 60 for ≥ 3 months",
  "OSA": "Obstructive Sleep Apnea — repetitive upper airway collapse during sleep causing intermittent hypoxia",
  "NAFLD": "Non-Alcoholic Fatty Liver Disease — hepatic steatosis without significant alcohol use",
  "MASLD": "Metabolic Dysfunction-Associated Steatotic Liver Disease — updated nomenclature for NAFLD",
  "CVD": "Cardiovascular Disease — encompasses CAD, cerebrovascular disease, and peripheral vascular disease",
  "HF": "Heart Failure — clinical syndrome of impaired ventricular filling or ejection",
  "HFrEF": "Heart Failure with reduced Ejection Fraction — LVEF ≤ 40%",
  "eGFR": "estimated Glomerular Filtration Rate — measure of kidney function (mL/min/1.73m²)",
  "BMI": "Body Mass Index — weight (kg) / height (m)². Asian thresholds: normal < 23, overweight 23-24.9, obese ≥ 25",
  "HbA1c": "Glycated Hemoglobin — average blood glucose over 2-3 months. Normal < 5.7%, Prediabetes 5.7-6.4%, Diabetes ≥ 6.5%",
  "LDL": "Low-Density Lipoprotein — 'bad cholesterol', primary target of lipid-lowering therapy",
  "LDL-C": "Low-Density Lipoprotein Cholesterol — calculated or directly measured LDL fraction",
  "HDL": "High-Density Lipoprotein — 'good cholesterol', < 40 mg/dL (♂) or < 50 mg/dL (♀) is low",
  "HDL-C": "High-Density Lipoprotein Cholesterol — cardioprotective lipoprotein fraction",
  "TG": "Triglycerides — fasting ≥ 150 mg/dL elevated, ≥ 500 mg/dL severe (pancreatitis risk)",
  "FH": "Familial Hypercholesterolemia — genetic disorder causing severely elevated LDL-C from birth",
  "HoFH": "Homozygous Familial Hypercholesterolemia — both alleles affected, extremely high LDL, requires specialized therapy",
  "TOD": "Target Organ Damage — microvascular (retinopathy, nephropathy, neuropathy) or macrovascular (LVH, diastolic dysfunction)",
  "PAD": "Peripheral Arterial Disease — atherosclerotic narrowing of peripheral arteries, ABI < 0.9",
  "MI": "Myocardial Infarction — heart attack, necrosis of cardiac muscle due to ischemia",
  "CABG": "Coronary Artery Bypass Graft — surgical revascularization of coronary arteries",
  "ACS": "Acute Coronary Syndrome — encompasses STEMI, NSTEMI, and unstable angina",
  "PCSK9i": "Proprotein Convertase Subtilisin/Kexin type 9 inhibitor — e.g., Evolocumab, Alirocumab. Dramatically lowers LDL by increasing hepatic LDL receptor availability.",
  "PCSK9": "Proprotein Convertase Subtilisin/Kexin type 9 — enzyme that degrades LDL receptors, limiting hepatic LDL clearance",
  "ACEi": "Angiotensin-Converting Enzyme Inhibitor — e.g., Ramipril, Enalapril. First-line for HTN with CKD/DM.",
  "ARB": "Angiotensin Receptor Blocker — e.g., Losartan, Telmisartan. Alternative to ACEi.",
  "CCB": "Calcium Channel Blocker — e.g., Amlodipine, Nifedipine. First-line antihypertensive.",
  "HTN": "Hypertension — sustained BP ≥ 130/80 mmHg or on treatment",
  "DM": "Diabetes Mellitus — HbA1c ≥ 6.5% or FBG ≥ 126 mg/dL on two occasions",
  "CAD": "Coronary Artery Disease — atherosclerotic narrowing of coronary arteries",
  "TIA": "Transient Ischemic Attack — temporary focal neurological deficit due to ischemia, resolves within 24h",
  "CVA": "Cerebrovascular Accident — stroke, ischemic or hemorrhagic",
  "LVH": "Left Ventricular Hypertrophy — increased LV mass, marker of hypertensive heart disease",
  "Lp(a)": "Lipoprotein(a) — genetically determined lipoprotein, ≥ 50 mg/dL = elevated ASCVD risk",
  "ApoB": "Apolipoprotein B — main apolipoprotein of atherogenic lipoproteins, > 130 mg/dL = elevated",
  "hsCRP": "High-Sensitivity C-Reactive Protein — inflammatory marker, ≥ 2 mg/L = elevated CV risk",
  "CAC": "Coronary Artery Calcium — CT-measured coronary calcification, Agatston score quantifies plaque burden",
  "ARR": "Aldosterone-to-Renin Ratio — screening test for primary hyperaldosteronism",
  "PRA": "Plasma Renin Activity — measure of renin-angiotensin system activity",
  "DST": "Dexamethasone Suppression Test — screening for Cushing syndrome",
  "CPAP": "Continuous Positive Airway Pressure — treatment for OSA",
  "GLP-1 RA": "Glucagon-Like Peptide-1 Receptor Agonist — e.g., Semaglutide, Liraglutide, Dulaglutide, Tirzepatide (also GIP). CV benefit, weight loss.",
  "SBP": "Systolic Blood Pressure",
  "DBP": "Diastolic Blood Pressure",
  "BP": "Blood Pressure",
  "UACR": "Urine Albumin-to-Creatinine Ratio — marker of kidney damage, ≥ 30 mg/g = abnormal",
  "MetS": "Metabolic Syndrome — ≥ 3 of: ↑waist, ↑TG, ↓HDL, ↑BP, ↑glucose",
  "MACE": "Major Adverse Cardiac Events — composite: CV death, MI, stroke",
  "ENaC": "Epithelial Sodium Channel — sodium channel in collecting duct, gain-of-function mutation causes Liddle syndrome",
  "AME": "Apparent Mineralocorticoid Excess — 11β-HSD2 deficiency causing HTN with low renin/aldosterone",
  "GRA": "Glucocorticoid-Remediable Aldosteronism — aldosterone high, responds to dexamethasone",
  "CAH": "Congenital Adrenal Hyperplasia — 11β-hydroxylase or 17α-hydroxylase deficiency",
  "WNK": "With No Lysine kinase — mutations cause Gordon syndrome (hyperkalemic HTN)",
  "NPH": "Neutral Protamine Hagedorn — intermediate-acting insulin",
  "BID": "Bis In Die — twice daily dosing",
  "OD": "Omni Die — once daily dosing",
  "SC": "Subcutaneous — route of administration",
  "q2w": "Every 2 weeks — dosing frequency",
};

export function AbbreviationHover({ term, children, definition: override }: { term: string; children?: React.ReactNode; definition?: string }) {
  const fullForm = override || ABBREVIATIONS[term];
  if (!fullForm) return <>{children || term}</>;

  return (
    <span className="group relative inline-block">
      <span className="text-foreground font-medium underline decoration-dotted decoration-primary/40 cursor-help">
        {children || term}
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 hidden group-hover:block z-50">
        <div className="bg-popover text-popover-foreground text-xs p-3 rounded-lg shadow-xl border border-border">
          <p className="font-semibold text-primary mb-1">{term}</p>
          <p className="text-muted-foreground leading-relaxed">{fullForm}</p>
        </div>
      </div>
    </span>
  );
}

export function AbbreviationHoverInline({ children, definition }: { children: React.ReactNode; definition: string }) {
  return (
    <span className="group relative inline-block">
      <span className="text-foreground underline decoration-dotted decoration-primary/40 cursor-help">
        {children}
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 hidden group-hover:block z-50">
        <div className="bg-popover text-popover-foreground text-xs p-3 rounded-lg shadow-xl border border-border">
          <p className="text-muted-foreground leading-relaxed">{definition}</p>
        </div>
      </div>
    </span>
  );
}

export default AbbreviationHover;
