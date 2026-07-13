import { useState, useMemo } from "react";
import {
  Heart, Activity, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp,
  Stethoscope, Shield, Wind, Syringe, Bone, Brain, Eye, Weight, Timer,
  User, Bed, Droplets, Thermometer, Pill, Scissors, FileText, Zap,
  ArrowRight, Search, Calculator, Scale, Clock, Gauge,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ─── RCRI (Revised Cardiac Risk Index) ───
interface RCRIFactor {
  id: string;
  label: string;
  points: number;
  active: boolean;
}

const RCRI_FACTORS: RCRIFactor[] = [
  { id: "hx_ischemic", label: "History of ischemic heart disease (MI, angina, CABG, PCI)", points: 1, active: false },
  { id: "hx_hf", label: "History of heart failure", points: 1, active: false },
  { id: "hx_cva", label: "History of cerebrovascular disease (TIA, stroke)", points: 1, active: false },
  { id: "dm_insulin", label: "Diabetes mellitus requiring insulin therapy", points: 1, active: false },
  { id: "ckd", label: "Chronic kidney disease (Cr > 2.0 mg/dL)", points: 1, active: false },
  { id: "high_risk_surg", label: "High-risk surgery (intraperitoneal, intrathoracic, suprainguinal vascular)", points: 1, active: false },
];

const RCRI_CLASSES = [
  { label: "Class I", points: "0", risk: "0.4%", color: "text-success" },
  { label: "Class II", points: "1", risk: "0.9%", color: "text-success" },
  { label: "Class III", points: "2", risk: "6.6%", color: "text-warning" },
  { label: "Class IV", points: "≥3", risk: "11%", color: "text-destructive" },
];

// ─── ASA Physical Status ───
const ASA_CLASSES = [
  { class: "I", description: "Normal healthy patient", example: "Healthy, non-smoking, no meds", color: "text-success" },
  { class: "II", description: "Mild systemic disease", example: "Mild DM, HTN, obesity, smoker", color: "text-success" },
  { class: "III", description: "Severe systemic disease", example: "DM with complications, COPD, CAD", color: "text-warning" },
  { class: "IV", description: "Severe disease — constant threat to life", example: "Sepsis, severe HF, ESRD", color: "text-warning" },
  { class: "V", description: "Moribund — not expected to survive without surgery", example: "Ruptured AAA, massive trauma", color: "text-destructive" },
  { class: "VI", description: "Declared brain-dead — organ donor", example: "Organ procurement", color: "text-muted-foreground" },
];

// ─── Mallampati Score ───
const MALLAMPATI_CLASSES = [
  { class: "I", description: "Soft palate, uvula, fauces, pillars visible", risk: "Low", intubation: "Easy", color: "text-success" },
  { class: "II", description: "Soft palate, uvula, fauces visible", risk: "Low", intubation: "Easy", color: "text-success" },
  { class: "III", description: "Soft palate, base of uvula visible", risk: "Moderate", intubation: "Moderate difficulty", color: "text-warning" },
  { class: "IV", description: "Only hard palate visible", risk: "High", intubation: "Difficult", color: "text-destructive" },
];

// ─── Caprini VTE Risk Score ───
interface CapriniFactor {
  id: string;
  label: string;
  points: number;
  active: boolean;
  group: "minor" | "moderate" | "major" | "high";
}

const CAPRINI_FACTORS: CapriniFactor[] = [
  // 1 point each
  { id: "age_41_60", label: "Age 41–60 years", points: 1, active: false, group: "minor" },
  { id: "bmi_25", label: "BMI > 25 kg/m²", points: 1, active: false, group: "minor" },
  { id: "pregnancy", label: "Pregnancy or postpartum (<1 month)", points: 1, active: false, group: "minor" },
  { id: "hx_abortion", label: "History of unexplained stillborn infant, recurrent spontaneous abortion, or preterm birth", points: 1, active: false, group: "minor" },
  { id: "edema", label: "Leg edema, varicose veins, or venous stasis", points: 1, active: false, group: "minor" },
  { id: "sepsis", label: "Sepsis (<1 month)", points: 1, active: false, group: "minor" },
  { id: "major_surg", label: "Major surgery (<1 month)", points: 1, active: false, group: "minor" },
  { id: "acute_mi", label: "Acute MI, HF exacerbation, or serious medical illness", points: 1, active: false, group: "minor" },
  { id: "copd", label: "COPD or pneumonia", points: 1, active: false, group: "minor" },
  { id: "bed_rest", label: "Bed rest >72 hours", points: 1, active: false, group: "minor" },
  { id: "pneumonia", label: "Pneumonia", points: 1, active: false, group: "minor" },
  { id: "central_line", label: "Central venous access", points: 1, active: false, group: "minor" },
  { id: "blood_transfusion", label: "Blood transfusion (<1 month)", points: 1, active: false, group: "minor" },
  // 2 points each
  { id: "age_61_74", label: "Age 61–74 years", points: 2, active: false, group: "moderate" },
  { id: "arthroscopic", label: "Arthroscopic surgery", points: 2, active: false, group: "moderate" },
  { id: "malignancy", label: "Malignancy (current or previous)", points: 2, active: false, group: "moderate" },
  { id: "laparoscopic", label: "Laparoscopic surgery (>45 min)", points: 2, active: false, group: "moderate" },
  { id: "bed_rest_72h", label: "Bed rest >72 hours", points: 2, active: false, group: "moderate" },
  { id: "cast_immobilization", label: "Plaster cast or splint", points: 2, active: false, group: "moderate" },
  // 3 points each
  { id: "age_75", label: "Age ≥75 years", points: 3, active: false, group: "major" },
  { id: "vte_hx", label: "History of VTE (DVT/PE)", points: 3, active: false, group: "major" },
  { id: "family_vte", label: "Family history of VTE", points: 3, active: false, group: "major" },
  { id: "factor_v_leiden", label: "Factor V Leiden", points: 3, active: false, group: "major" },
  { id: "prothrombin", label: "Prothrombin 20210A", points: 3, active: false, group: "major" },
  { id: "lupus_anticoag", label: "Lupus anticoagulant", points: 3, active: false, group: "major" },
  { id: "anticardiolipin", label: "Anticardiolipin antibodies", points: 3, active: false, group: "major" },
  { id: "elevated_homocysteine", label: "Elevated serum homocysteine", points: 3, active: false, group: "major" },
  { id: "hx_heparin", label: "Heparin-induced thrombocytopenia (HIT)", points: 3, active: false, group: "major" },
  { id: "other_thrombophilia", label: "Other congenital/acquired thrombophilia", points: 3, active: false, group: "major" },
  // 5 points each
  { id: "elective_arthroplasty", label: "Elective major lower extremity arthroplasty", points: 5, active: false, group: "high" },
  { id: "hip_pelvis_fracture", label: "Hip, pelvis, or leg fracture", points: 5, active: false, group: "high" },
  { id: "stroke", label: "Stroke (<1 month)", points: 5, active: false, group: "high" },
  { id: "acute_spinal_cord", label: "Acute spinal cord injury (<1 month)", points: 5, active: false, group: "high" },
  { id: "multiple_trauma", label: "Multiple trauma (<1 month)", points: 5, active: false, group: "high" },
];

const CAPRINI_RISK_LEVELS = [
  { min: 0, max: 1, risk: "Low", vte_risk: "<10%", prophylaxis: "Early ambulation ± mechanical", color: "text-success" },
  { min: 2, max: 3, risk: "Moderate", vte_risk: "10–20%", prophylaxis: "Mechanical ± pharmacologic", color: "text-warning" },
  { min: 4, max: 5, risk: "High", vte_risk: "20–30%", prophylaxis: "Pharmacologic + mechanical", color: "text-warning" },
  { min: 6, max: 99, risk: "Very High", vte_risk: ">30%", prophylaxis: "Pharmacologic + mechanical ± extended prophylaxis", color: "text-destructive" },
];

// ─── Surgical Apgar Score ───
interface ApgarInputs {
  estimatedBloodLoss: string;
  lowestMAP: string;
  lowestHR: string;
}

const APGAR_POINTS_MAP = (ebl: number, map: number, hr: number): number => {
  let points = 0;
  // EBL
  if (ebl <= 100) points += 4;
  else if (ebl <= 600) points += 3;
  else if (ebl <= 1000) points += 2;
  else if (ebl <= 1500) points += 1;
  else points += 0;
  // MAP
  if (map > 70) points += 4;
  else if (map > 60) points += 3;
  else if (map > 50) points += 2;
  else if (map > 40) points += 1;
  else points += 0;
  // HR
  if (hr <= 70) points += 4;
  else if (hr <= 90) points += 3;
  else if (hr <= 110) points += 2;
  else if (hr <= 130) points += 1;
  else points += 0;
  return points;
};

const APGAR_RISK = [
  { min: 9, max: 10, risk: "Very Low", mortality: "0.2%", morbidity: "5.4%", color: "text-success" },
  { min: 7, max: 8, risk: "Low", mortality: "0.7%", morbidity: "9.8%", color: "text-success" },
  { min: 5, max: 6, risk: "Moderate", mortality: "2.5%", morbidity: "17.5%", color: "text-warning" },
  { min: 3, max: 4, risk: "High", mortality: "7.6%", morbidity: "32.6%", color: "text-warning" },
  { min: 0, max: 2, risk: "Very High", mortality: "21.5%", morbidity: "56.2%", color: "text-destructive" },
];

// ─── STOP-Bang (OSA Screening) ───
interface STOPBangItem {
  id: string;
  label: string;
  active: boolean;
}

const STOPBANG_ITEMS: STOPBangItem[] = [
  { id: "snore", label: "Snoring (loud enough to be heard through closed doors)", active: false },
  { id: "tired", label: "Tired/fatigued during daytime despite adequate sleep", active: false },
  { id: "observed", label: "Observed apnea (someone witnessed you stop breathing)", active: false },
  { id: "pressure", label: "High blood pressure (treated or untreated)", active: false },
  { id: "bmi_35", label: "BMI > 35 kg/m²", active: false },
  { id: "age_50", label: "Age > 50 years", active: false },
  { id: "neck", label: "Neck circumference > 40 cm (male) or > 35 cm (female)", active: false },
  { id: "gender_male", label: "Male gender", active: false },
];

const STOPBANG_RISK = [
  { min: 0, max: 2, risk: "Low", osa_prob: "Low probability of moderate-severe OSA", color: "text-success" },
  { min: 3, max: 4, risk: "Intermediate", osa_prob: "Consider polysomnography if high clinical suspicion", color: "text-warning" },
  { min: 5, max: 8, risk: "High", osa_prob: "High probability of moderate-severe OSA — consider PSG", color: "text-destructive" },
];

// ─── NSQIP Simplified Risk ───
interface NSQIPInputs {
  age: string;
  sex: "male" | "female" | "";
  functionalStatus: "independent" | "partially" | "totally" | "";
  ascites: "yes" | "no" | "";
  copd: "yes" | "no" | "";
  dm: "none" | "oral" | "insulin" | "";
  htn: "yes" | "no" | "";
  chf: "yes" | "no" | "";
  dialysis: "yes" | "no" | "";
  steroid: "yes" | "no" | "";
  weightLoss: "yes" | "no" | "";
  bleeding: "yes" | "no" | "";
  sepsis: "none" | "sirs" | "sepsis" | "septic" | "";
  surgeryType: "low" | "intermediate" | "high" | "";
  emergency: "yes" | "no" | "";
}

// ─── Perioperative Medication Management ───
interface MedManagement {
  drug: string;
  preop: string;
  postop: string;
  notes: string;
  category: "cardiac" | "endocrine" | "renal" | "pulmonary" | "cns" | "rheum" | "gi" | "other";
}

const PERIOP_MEDS: MedManagement[] = [
  // Cardiac
  { drug: "Beta-blockers", preop: "Continue (withhold day of surgery if hypotension)", postop: "Resume as soon as hemodynamically stable", notes: "Withdrawal can cause rebound tachycardia, hypertension, ischemia. Taper if discontinuing.", category: "cardiac" },
  { drug: "Statins", preop: "Continue (take morning of surgery)", postop: "Resume ASAP", notes: "Perioperative statin reduces MI risk. Withdrawal increases cardiac events.", category: "cardiac" },
  { drug: "Aspirin (primary prevention)", preop: "Hold 5–7 days before surgery", postop: "Resume when bleeding risk low (usually 24–48h)", notes: "Low bleeding risk procedures (dental, skin, cataract) — continue aspirin.", category: "cardiac" },
  { drug: "Aspirin (secondary prevention)", preop: "Continue for most surgeries (hold for high bleeding risk)", postop: "Resume ASAP", notes: "Bridging with GP IIb/IIIa inhibitors rarely needed. Discuss with cardiology.", category: "cardiac" },
  { drug: "P2Y12 inhibitors (clopidogrel, ticagrelor, prasugrel)", preop: "Hold 5–7 days (clopidogrel), 3–5 days (ticagrelor), 7 days (prasugrel)", postop: "Resume when bleeding risk low", notes: "Bare metal stent: hold 4 weeks. DES: hold 6–12 months if possible. Bridging with cangrelor or tirofiban in high-risk.", category: "cardiac" },
  { drug: "Warfarin", preop: "Hold 5 days, bridge with LMWH if high thromboembolic risk", postop: "Resume when hemostasis achieved (usually 12–24h)", notes: "High risk: mechanical mitral valve, AF with CHA₂DS₂-VASc ≥6, recent VTE (<3 months).", category: "cardiac" },
  { drug: "DOACs (apixaban, rivaroxaban, edoxaban, dabigatran)", preop: "Hold 24–48h (low bleeding risk) or 48–72h (high bleeding risk)", postop: "Resume when hemostasis achieved (usually 24–48h)", notes: "Renal function affects timing. Dabigatran: hold longer if CrCl <50. No routine bridging needed.", category: "cardiac" },
  { drug: "ACEi/ARBs", preop: "Hold 24h before surgery (or morning of)", postop: "Resume when hemodynamically stable (usually 24–48h)", notes: "Continue in HF with reduced EF. Associated with intraoperative hypotension. Restart before discharge.", category: "cardiac" },
  { drug: "CCBs (non-DHP: verapamil, diltiazem)", preop: "Continue (hold if hypotension)", postop: "Resume when stable", notes: "Rate control for AF. Avoid in WPW with pre-excited AF.", category: "cardiac" },
  { drug: "CCBs (DHP: amlodipine, nifedipine)", preop: "Continue", postop: "Resume when stable", notes: "No significant perioperative concerns.", category: "cardiac" },
  { drug: "Digoxin", preop: "Continue (check levels)", postop: "Resume when stable", notes: "Narrow therapeutic window. Monitor K+, Mg²⁺, renal function. Toxicity risk with hypokalemia.", category: "cardiac" },
  { drug: "Amiodarone", preop: "Continue", postop: "Resume when stable", notes: "Long half-life (40–55 days). Monitor thyroid, LFTs, pulmonary. Drug interactions (CYP inhibitor).", category: "cardiac" },
  { drug: "Diuretics", preop: "Hold morning of surgery (or continue if HF)", postop: "Resume when stable, monitor electrolytes", notes: "Hypovolemia risk. Check K+ pre-op. Continue in HF to avoid pulmonary congestion.", category: "cardiac" },
  { drug: "Nitrates", preop: "Continue (transdermal patch may be removed for surgery)", postop: "Resume when stable", notes: "Avoid hypotension. Transdermal: remove if risk of hypotension.", category: "cardiac" },
  { drug: "Antiarrhythmics", preop: "Continue all antiarrhythmics", postop: "Resume when stable", notes: "Check drug levels (digoxin, procainamide). Monitor QT interval. Avoid QT-prolonging drugs.", category: "cardiac" },
  // Endocrine
  { drug: "Insulin (Type 1 DM)", preop: "Reduce basal insulin by 20–30% day before. Give 50–80% basal on morning of surgery.", postop: "Resume basal + correction. Sliding scale alone is inadequate.", notes: "NEVER hold basal insulin in Type 1 DM — risk of DKA. Target BG 140–180 mg/dL perioperatively. Hourly glucose monitoring.", category: "endocrine" },
  { drug: "Insulin (Type 2 DM)", preop: "Hold short-acting. Give 50–80% basal on morning of surgery.", postop: "Resume basal + correction when eating", notes: "Consider insulin infusion for prolonged surgery or poor control. Target BG 140–180 mg/dL.", category: "endocrine" },
  { drug: "Metformin", preop: "Hold 24h before surgery (or morning of)", postop: "Resume when renal function stable and eating", notes: "Lactic acidosis risk with renal impairment, contrast, hypotension. Hold 48h after contrast.", category: "endocrine" },
  { drug: "Sulfonylureas (glipizide, glimepiride)", preop: "Hold morning of surgery", postop: "Resume when eating", notes: "Hypoglycemia risk with NPO status. Long-acting (glibenclamide) hold 24h before.", category: "endocrine" },
  { drug: "DPP-4 inhibitors (sitagliptin, linagliptin)", preop: "Continue or hold morning of surgery", postop: "Resume when eating", notes: "Low hypoglycemia risk. Safe perioperatively.", category: "endocrine" },
  { drug: "GLP-1 RAs (semaglutide, liraglutide, dulaglutide)", preop: "Hold weekly GLP-1 RAs 1 week before. Hold daily GLP-1 RAs day before.", postop: "Resume when eating and GI function normal", notes: "Gastroparesis risk — increased aspiration risk. Consider rapid sequence induction. Hold before procedures requiring sedation.", category: "endocrine" },
  { drug: "SGLT2 inhibitors (empagliflozin, dapagliflozin)", preop: "Hold 3–4 days before surgery", postop: "Resume when eating and euglycemic", notes: "Euglycemic DKA risk. Hold 3–4 days before elective surgery. Monitor ketones if ill.", category: "endocrine" },
  { drug: "TZDs (pioglitazone)", preop: "Continue (hold if HF exacerbation)", postop: "Resume when eating", notes: "Fluid retention risk. Avoid in NYHA III/IV HF.", category: "endocrine" },
  { drug: "Corticosteroids (chronic)", preop: "Continue usual dose. Consider stress-dose for major surgery.", postop: "Continue stress dose, taper over 1–2 days", notes: "Adrenal insufficiency risk with chronic use. Stress dose: hydrocortisone 50–100 mg IV q8h for major surgery.", category: "endocrine" },
  { drug: "Thyroid hormone (levothyroxine)", preop: "Continue (take morning of surgery with small sip of water)", postop: "Resume when eating", notes: "Long half-life (7 days). Missing 1–2 doses is safe. IV form available if prolonged NPO.", category: "endocrine" },
  { drug: "Antithyroid drugs (methimazole, PTU)", preop: "Continue", postop: "Resume when stable", notes: "Monitor for agranulocytosis (fever, sore throat). Check CBC if symptomatic.", category: "endocrine" },
  { drug: "Estrogen/HRT/OCPs", preop: "Continue (or hold 4 weeks before major surgery if high VTE risk)", postop: "Resume when fully mobile", notes: "Increased VTE risk. Consider holding for major orthopedic or cancer surgery. Weigh risk vs benefit.", category: "endocrine" },
  { drug: "Testosterone", preop: "Continue", postop: "Resume when stable", notes: "No significant perioperative concerns.", category: "endocrine" },
  // Pulmonary
  { drug: "Inhaled bronchodilators (SABA, LABA, LAMA)", preop: "Continue (take morning of surgery)", postop: "Resume ASAP", notes: "Essential for COPD/asthma. Continue through perioperative period. May need MDI with spacer if unable to coordinate.", category: "pulmonary" },
  { drug: "Inhaled corticosteroids (ICS)", preop: "Continue", postop: "Resume ASAP", notes: "Continue to prevent exacerbation. May need IV hydrocortisone if unable to inhale.", category: "pulmonary" },
  { drug: "Leukotriene receptor antagonists (montelukast)", preop: "Continue", postop: "Resume when stable", notes: "No significant perioperative concerns.", category: "pulmonary" },
  { drug: "Theophylline", preop: "Continue (check levels)", postop: "Resume when stable", notes: "Narrow therapeutic window. Drug interactions. Monitor levels.", category: "pulmonary" },
  // CNS
  { drug: "SSRIs/SNRIs", preop: "Continue (abrupt withdrawal causes discontinuation syndrome)", postop: "Resume ASAP", notes: "Increased bleeding risk (especially with NSAIDs/anticoagulants). Taper if discontinuing.", category: "cns" },
  { drug: "MAOIs", preop: "Hold 2 weeks before elective surgery (if possible)", postop: "Resume when stable", notes: "Risk of hypertensive crisis with sympathomimetics. Serotonin syndrome risk. Consult psychiatry.", category: "cns" },
  { drug: "Lithium", preop: "Hold 24–72h before surgery (check levels)", postop: "Resume when stable and euvolemic", notes: "Narrow therapeutic window. Dehydration, NSAIDs, diuretics increase toxicity. Monitor levels, renal function.", category: "cns" },
  { drug: "Antipsychotics", preop: "Continue (consider QT monitoring)", postop: "Resume when stable", notes: "QT prolongation risk. Monitor QTc. Avoid other QT-prolonging drugs. Haloperidol IV for acute agitation.", category: "cns" },
  { drug: "Benzodiazepines (chronic)", preop: "Continue (do not abruptly withdraw)", postop: "Resume when stable", notes: "Withdrawal causes seizures, delirium. Taper if discontinuing. Use short-acting for sedation.", category: "cns" },
  { drug: "Antiepileptics", preop: "Continue (take morning of surgery with small sip of water)", postop: "Resume when stable", notes: "IV forms available if NPO. Check levels (phenytoin, valproate, carbamazepine). Drug interactions.", category: "cns" },
  { drug: "Parkinson's medications (levodopa/carbidopa)", preop: "Continue (hold morning of surgery if prolonged NPO)", postop: "Resume ASAP", notes: "Withdrawal causes rigidity, aspiration, NMS. Consider transdermal rotigotine if NPO. Avoid droperidol, metoclopramide.", category: "cns" },
  { drug: "Anticholinesterases (donepezil, rivastigmine)", preop: "Continue (hold morning of surgery)", postop: "Resume when stable", notes: "May prolong succinylcholine effect. Withdrawal worsens cognition.", category: "cns" },
  // Rheumatology
  { drug: "Methotrexate", preop: "Continue (hold 1 week before if high infection risk)", postop: "Resume when wound healing adequate", notes: "Low-dose MTX for RA: continue perioperatively. High-dose: hold 1 week. Monitor renal function.", category: "rheum" },
  { drug: "Biologics (TNFi, IL-6i, etc.)", preop: "Hold 1–2 dosing cycles before surgery", postop: "Resume when wound healing adequate (usually 14 days)", notes: "Increased infection risk. Time surgery at end of dosing cycle. Resume when no signs of infection.", category: "rheum" },
  { drug: "Hydroxychloroquine", preop: "Continue", postop: "Resume when stable", notes: "No significant perioperative concerns.", category: "rheum" },
  { drug: "Sulfasalazine", preop: "Continue", postop: "Resume when stable", notes: "No significant perioperative concerns.", category: "rheum" },
  { drug: "Leflunomide", preop: "Continue", postop: "Resume when stable", notes: "Long half-life. Cholestyramine washout if needed.", category: "rheum" },
  { drug: "Colchicine", preop: "Continue (hold if renal impairment)", postop: "Resume when stable", notes: "Monitor renal function. Drug interactions (CYP3A4, P-gp).", category: "rheum" },
  { drug: "NSAIDs", preop: "Hold 1–5 days before surgery (depending on half-life)", postop: "Resume when bleeding risk low", notes: "Increased bleeding risk (platelet dysfunction). Ibuprofen: hold 1 day. Naproxen: hold 3–5 days. Celecoxib: hold 1 day.", category: "rheum" },
  // GI
  { drug: "PPIs (omeprazole, pantoprazole)", preop: "Continue (take morning of surgery)", postop: "Resume when eating", notes: "Stress ulcer prophylaxis in ICU. IV form available.", category: "gi" },
  { drug: "H2RAs (famotidine, ranitidine)", preop: "Continue (take morning of surgery)", postop: "Resume when eating", notes: "IV form available. May reduce gastric volume and acidity.", category: "gi" },
  { drug: "Antiemetics (ondansetron)", preop: "Continue if needed", postop: "Use as needed for PONV", notes: "QT prolongation with ondansetron (dose-dependent). Aprepitant for high-risk PONV.", category: "gi" },
  { drug: "Immunosuppressants (tacrolimus, cyclosporine, mycophenolate)", preop: "Continue (hold morning of surgery if NPO)", postop: "Resume ASAP", notes: "IV forms available. Monitor levels. Risk of rejection if held too long.", category: "other" },
  { drug: "Antiretrovirals (ART)", preop: "Continue (take morning of surgery with small sip of water)", postop: "Resume ASAP", notes: "IV forms limited. Drug interactions with anesthetics. Check with ID/pharmacy.", category: "other" },
  { drug: "Antibiotics (chronic/prophylactic)", preop: "Continue (time surgical prophylaxis appropriately)", postop: "Resume when stable", notes: "Surgical prophylaxis: give within 60 min before incision. Redose for prolonged surgery or blood loss.", category: "other" },
  { drug: "Anticoagulants (prophylactic LMWH)", preop: "Hold 12h before surgery (or 24h if high dose)", postop: "Start 6–12h post-op (or 24h if high bleeding risk)", notes: "Neuraxial anesthesia: hold 12h (LMWH prophylactic), 24h (LMWH therapeutic).", category: "other" },
];

// ─── Perioperative Labs ───
interface PreopLab {
  test: string;
  indication: string;
  timing: string;
  notes: string;
}

const PREOP_LABS: PreopLab[] = [
  { test: "CBC", indication: "Major surgery, age >65, anemia symptoms, bleeding history", timing: "Within 30 days", notes: "Hb <10 g/dL may warrant further workup. Platelets <100K: bleeding risk." },
  { test: "BMP / Renal function", indication: "Age >50, CKD, DM, HTN, diuretics, ACEi/ARBs, contrast", timing: "Within 30 days", notes: "Cr >2.0: assess GFR. K+ <3.5 or >5.5: correct before surgery." },
  { test: "Coagulation (PT/PTT/INR)", indication: "Anticoagulant use, bleeding history, liver disease, malnutrition", timing: "Within 30 days", notes: "INR >1.5: increased bleeding risk. Correct with vitamin K or FFP if needed." },
  { test: "LFTs", indication: "Liver disease, alcohol use, hepatotoxic meds, biliary surgery", timing: "Within 30 days", notes: "Child-Pugh class affects surgical risk. AST/ALT >3x ULN: evaluate before elective surgery." },
  { test: "ECG", indication: "Age >65, cardiac history, DM, HTN, symptoms, high-risk surgery", timing: "Within 30 days", notes: "New changes: evaluate before surgery. Rhythm other than sinus: assess significance." },
  { test: "Chest X-ray", indication: "Age >70, cardiac/pulmonary disease, smokers, respiratory symptoms", timing: "Within 6 months", notes: "Not routine. Only if clinically indicated. New findings: evaluate before surgery." },
  { test: "Echocardiogram", indication: "Dyspnea of unknown cause, HF, murmur, known valve disease, prior abnormal echo", timing: "Within 12 months", notes: "LVEF <40%: high risk. Severe AS: consider valve intervention before elective non-cardiac surgery." },
  { test: "Stress test / Cardiac imaging", indication: "≥1 RCRI factor with poor functional capacity (<4 METs) undergoing high-risk surgery", timing: "Within 6 months", notes: "Only if results will change management. Do not routinely screen." },
  { test: "HbA1c", indication: "DM (known or suspected), poor glycemic control", timing: "Within 3 months", notes: "HbA1c >8%: increased infection risk. Optimize before elective surgery." },
  { test: "BNP / NT-proBNP", indication: "HF suspicion, dyspnea, high-risk surgery in elderly", timing: "Within 30 days", notes: "BNP >100 pg/mL or NT-proBNP >300 pg/mL: increased cardiac risk." },
  { test: "Troponin", indication: "ACS suspicion, high-risk patients undergoing high-risk surgery", timing: "Baseline + 48–72h post-op", notes: "Routine screening not recommended. Check if signs/symptoms of myocardial injury." },
  { test: "Pregnancy test", indication: "All women of childbearing age", timing: "Day of surgery", notes: "Mandatory before elective surgery. Discuss risks/benefits if positive." },
  { test: "Type & Screen / Crossmatch", indication: "Anticipated blood loss >500 mL, anemia, bleeding risk", timing: "Within 72 hours", notes: "Type & screen for low-risk. Crossmatch for high-risk. Antibody screen if prior transfusion." },
  { test: "Drug levels (digoxin, lithium, anticonvulsants)", indication: "Narrow therapeutic index drugs, toxicity concern", timing: "Within 24–48 hours", notes: "Therapeutic range: digoxin 0.5–1.0 ng/mL, lithium 0.6–1.2 mEq/L." },
];

// ─── Component ───
const PerioperativeCalculators = () => {
  const [activeTab, setActiveTab] = useState("rcri");

  return (
    <div className="space-y-5 animate-slide-in">
      <div>
        <h1 className="text-xl font-heading font-bold">Perioperative Calculators</h1>
        <p className="text-sm text-muted-foreground">
          Pre-operative risk assessment, intra-operative scoring, and medication management tools
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="rcri" className="text-xs">RCRI</TabsTrigger>
          <TabsTrigger value="asa" className="text-xs">ASA Class</TabsTrigger>
          <TabsTrigger value="mallampati" className="text-xs">Mallampati</TabsTrigger>
          <TabsTrigger value="stopbang" className="text-xs">STOP-Bang</TabsTrigger>
          <TabsTrigger value="caprini" className="text-xs">Caprini VTE</TabsTrigger>
          <TabsTrigger value="apgar" className="text-xs">Surgical Apgar</TabsTrigger>
          <TabsTrigger value="meds" className="text-xs">Med Management</TabsTrigger>
          <TabsTrigger value="labs" className="text-xs">Pre-op Labs</TabsTrigger>
        </TabsList>

        {/* ─── RCRI ─── */}
        <TabsContent value="rcri" className="mt-4 space-y-4">
          <RCRICalculator />
        </TabsContent>

        {/* ─── ASA ─── */}
        <TabsContent value="asa" className="mt-4 space-y-4">
          <ASACalculator />
        </TabsContent>

        {/* ─── Mallampati ─── */}
        <TabsContent value="mallampati" className="mt-4 space-y-4">
          <MallampatiCalculator />
        </TabsContent>

        {/* ─── STOP-Bang ─── */}
        <TabsContent value="stopbang" className="mt-4 space-y-4">
          <STOPBangCalculator />
        </TabsContent>

        {/* ─── Caprini ─── */}
        <TabsContent value="caprini" className="mt-4 space-y-4">
          <CapriniCalculator />
        </TabsContent>

        {/* ─── Surgical Apgar ─── */}
        <TabsContent value="apgar" className="mt-4 space-y-4">
          <SurgicalApgarCalculator />
        </TabsContent>

        {/* ─── Med Management ─── */}
        <TabsContent value="meds" className="mt-4 space-y-4">
          <PeriopMedManagement />
        </TabsContent>

        {/* ─── Pre-op Labs ─── */}
        <TabsContent value="labs" className="mt-4 space-y-4">
          <PreopLabsGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ─── RCRI Calculator ───
const RCRICalculator = () => {
  const [factors, setFactors] = useState<RCRIFactor[]>(RCRI_FACTORS);

  const toggleFactor = (id: string) => {
    setFactors(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const result = useMemo(() => {
    const total = factors.filter(f => f.active).reduce((s, f) => s + f.points, 0);
    const cls = total === 0 ? RCRI_CLASSES[0] : total === 1 ? RCRI_CLASSES[1] : total === 2 ? RCRI_CLASSES[2] : RCRI_CLASSES[3];
    return { total, cls, active: factors.filter(f => f.active) };
  }, [factors]);

  return (
    <div className="space-y-4">
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            Revised Cardiac Risk Index (RCRI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Lee et al., Circulation 1999. Predicts major cardiac complications (MI, pulmonary edema, VF, cardiac arrest, complete heart block) in non-cardiac surgery.
          </p>

          {/* Result */}
          <div className={`clinical-card border-l-4 mb-4 ${
            result.total === 0 ? "border-l-success" :
            result.total === 1 ? "border-l-success" :
            result.total === 2 ? "border-l-warning" : "border-l-destructive"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.total <= 1 ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <AlertTriangle className={`w-5 h-5 ${result.cls.color}`} />
                )}
                <div>
                  <h3 className="font-heading font-bold text-lg">{result.cls.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {result.active.length} factors · {result.total} point{result.total !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-3xl font-heading font-bold ${result.cls.color}`}>{result.cls.risk}</span>
                <span className="text-xs text-muted-foreground block">MACE risk</span>
              </div>
            </div>
          </div>

          {/* Risk classes reference */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {RCRI_CLASSES.map(cls => (
              <div key={cls.label} className={`p-2 rounded-lg text-center ${
                cls.color === "text-success" ? "bg-success/10 border border-success/20" :
                cls.color === "text-warning" ? "bg-warning/10 border border-warning/20" :
                "bg-destructive/10 border border-destructive/20"
              }`}>
                <div className="font-medium text-sm">{cls.label}</div>
                <div className="text-xs text-muted-foreground">{cls.points} pts</div>
                <div className={`text-lg font-bold ${cls.color}`}>{cls.risk}</div>
                <div className="text-xs text-muted-foreground">MACE</div>
              </div>
            ))}
          </div>

          {/* Factors */}
          <div className="space-y-2">
            {factors.map(f => (
              <label key={f.id} className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors cursor-pointer ${
                f.active ? "bg-warning/5 border border-warning/20" : "hover:bg-muted/30"
              }`}>
                <Switch
                  checked={f.active}
                  onCheckedChange={() => toggleFactor(f.id)}
                  className="mt-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{f.label}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                      +{f.points}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Management by class */}
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
            <h4 className="text-sm font-medium mb-2">Management by RCRI Class</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-success/5 border border-success/20">
                <strong>Class I–II (0–1 factors):</strong> Proceed with surgery. No additional cardiac testing needed.
              </div>
              <div className="p-2 rounded bg-warning/5 border border-warning/20">
                <strong>Class III (2 factors):</strong> Consider cardiac consultation. Optimize medical management. Beta-blockers if on chronic therapy.
              </div>
              <div className="p-2 rounded bg-destructive/5 border border-destructive/20">
                <strong>Class IV (≥3 factors):</strong> Cardiology consult recommended. Consider postponing for optimization. Beta-blockers, statins. Discuss risk/benefit.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── ASA Physical Status ───
const ASACalculator = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            ASA Physical Status Classification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            American Society of Anesthesiologists physical status classification system. A global assessment of a patient's pre-operative physical state.
          </p>

          <div className="space-y-2">
            {ASA_CLASSES.map(asa => (
              <button
                key={asa.class}
                onClick={() => setSelectedClass(asa.class)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedClass === asa.class
                    ? "bg-primary/5 border-primary/30"
                    : "bg-muted/20 border-border/40 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${asa.color}`}>ASA {asa.class}</span>
                    <div>
                      <p className="text-sm font-medium">{asa.description}</p>
                      <p className="text-xs text-muted-foreground">{asa.example}</p>
                    </div>
                  </div>
                  {selectedClass === asa.class && (
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {selectedClass && (
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-medium mb-2">Selected: ASA {selectedClass}</h4>
              <p className="text-xs text-muted-foreground">
                {selectedClass === "I" && "Normal healthy patient. No medical problems. No smoking. No medications."}
                {selectedClass === "II" && "Mild systemic disease without functional limitation. Well-controlled conditions."}
                {selectedClass === "III" && "Severe systemic disease with definite functional limitation. Requires ongoing management."}
                {selectedClass === "IV" && "Severe systemic disease that is a constant threat to life. ICU-level care may be needed."}
                {selectedClass === "V" && "Moribund patient not expected to survive without surgery. Emergency salvage procedure."}
                {selectedClass === "VI" && "Declared brain-dead. Organ procurement surgery only."}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                <strong>Note:</strong> ASA class alone does not predict surgical risk. Use with RCRI or other risk calculators.
              </div>
            </div>
          )}

          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
            <h4 className="text-xs font-medium mb-1">ASA with Emergency Modifier</h4>
            <p className="text-xs text-muted-foreground">
              Add "E" suffix for emergency surgery (e.g., ASA IIIE). Emergency surgery increases risk by approximately 1 ASA class equivalent.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Mallampati Score ───
const MallampatiCalculator = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");

  return (
    <div className="space-y-4">
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-4 h-4 text-violet-500" />
            Mallampati Score (Airway Assessment)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Modified Mallampati classification predicts difficulty of endotracheal intubation. Assessed with patient sitting, mouth open, tongue protruded, without phonation.
          </p>

          {/* Visual guide */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {MALLAMPATI_CLASSES.map(m => (
              <button
                key={m.class}
                onClick={() => setSelectedClass(m.class)}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedClass === m.class
                    ? "bg-primary/5 border-primary/30"
                    : "bg-muted/20 border-border/40 hover:bg-muted/30"
                }`}
              >
                <div className={`text-2xl font-bold ${m.color}`}>{m.class}</div>
                <div className="text-xs mt-1">{m.description}</div>
                <div className={`text-xs mt-1 font-medium ${m.color}`}>{m.risk} risk</div>
                {selectedClass === m.class && (
                  <CheckCircle className="w-4 h-4 text-primary mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>

          {selectedClass && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-medium mb-1">Class {selectedClass}</h4>
              <p className="text-xs text-muted-foreground">
                {selectedClass === "I" && "Full visualization of soft palate, uvula, fauces, and pillars. Intubation expected to be easy."}
                {selectedClass === "II" && "Soft palate, uvula, and fauces visible. Intubation expected to be easy."}
                {selectedClass === "III" && "Only soft palate and base of uvula visible. Intubation may be moderately difficult."}
                {selectedClass === "IV" && "Only hard palate visible. Intubation expected to be difficult. Consider awake fiberoptic intubation."}
              </p>
            </div>
          )}

          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
            <h4 className="text-xs font-medium mb-1">Other Airway Assessment Tests</h4>
            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
              <div className="p-2 rounded bg-background/50">
                <strong>Thyromental Distance:</strong> &lt;6 cm → difficult intubation
              </div>
              <div className="p-2 rounded bg-background/50">
                <strong>Mouth Opening:</strong> &lt;3 cm → difficult intubation
              </div>
              <div className="p-2 rounded bg-background/50">
                <strong>Neck Extension:</strong> Limited → difficult intubation
              </div>
              <div className="p-2 rounded bg-background/50">
                <strong>Upper Lip Bite Test:</strong> Class III → difficult
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── STOP-Bang Calculator ───
const STOPBangCalculator = () => {
  const [items, setItems] = useState<STOPBangItem[]>(STOPBANG_ITEMS);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  };

  const result = useMemo(() => {
    const total = items.filter(i => i.active).length;
    const level = total <= 2 ? STOPBANG_RISK[0] : total <= 4 ? STOPBANG_RISK[1] : STOPBANG_RISK[2];
    return { total, level };
  }, [items]);

  return (
    <div className="space-y-4">
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Wind className="w-4 h-4 text-cyan-500" />
            STOP-Bang (OSA Screening)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Screening tool for obstructive sleep apnea. Validated in surgical populations. High sensitivity for moderate-severe OSA.
          </p>

          {/* Result */}
          <div className={`clinical-card border-l-4 mb-4 ${
            result.total <= 2 ? "border-l-success" :
            result.total <= 4 ? "border-l-warning" : "border-l-destructive"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.total <= 2 ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <AlertTriangle className={`w-5 h-5 ${result.level.color}`} />
                )}
                <div>
                  <h3 className="font-heading font-bold text-lg">{result.level.risk} Risk</h3>
                  <p className="text-xs text-muted-foreground">
                    {result.total}/8 positive
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-heading font-bold ${result.level.color}`}>{result.total}</span>
                <span className="text-xs text-muted-foreground block">of 8</span>
              </div>
            </div>
            <p className="text-xs mt-2 text-muted-foreground">{result.level.osa_prob}</p>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {items.map(item => (
              <label key={item.id} className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors cursor-pointer ${
                item.active ? "bg-warning/5 border border-warning/20" : "hover:bg-muted/30"
              }`}>
                <Switch
                  checked={item.active}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-0.5 shrink-0"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>

          {/* Perioperative implications */}
          {result.total >= 3 && (
            <div className="mt-4 p-3 rounded-lg bg-warning/5 border border-warning/20">
              <h4 className="text-sm font-medium mb-2">Perioperative Implications</h4>
              <ul className="text-xs space-y-1">
                <li>• Consider polysomnography before elective major surgery</li>
                <li>• If known OSA: bring CPAP/BiPAP device to hospital</li>
                <li>• Avoid or minimize opioids (respiratory depression risk)</li>
                <li>• Consider regional anesthesia when possible</li>
                <li>• Monitor with continuous pulse oximetry post-operatively</li>
                <li>• Semi-upright positioning in recovery</li>
                <li>• Consider extended monitoring in PACU</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Caprini VTE Risk Score ───
const CapriniCalculator = () => {
  const [factors, setFactors] = useState<CapriniFactor[]>(CAPRINI_FACTORS);

  const toggleFactor = (id: string) => {
    setFactors(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const result = useMemo(() => {
    const total = factors.filter(f => f.active).reduce((s, f) => s + f.points, 0);
    const level = CAPRINI_RISK_LEVELS.find(l => total >= l.min && total <= l.max) || CAPRINI_RISK_LEVELS[3];
    return { total, level, active: factors.filter(f => f.active) };
  }, [factors]);

  const groupLabels: Record<string, string> = {
    minor: "1 point each",
    moderate: "2 points each",
    major: "3 points each",
    high: "5 points each",
  };

  const groupColors: Record<string, string> = {
    minor: "border-l-success",
    moderate: "border-l-warning",
    major: "border-l-warning",
    high: "border-l-destructive",
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Droplets className="w-4 h-4 text-indigo-500" />
            Caprini VTE Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Venous thromboembolism risk assessment for surgical patients. Guides VTE prophylaxis decisions.
          </p>

          {/* Result */}
          <div className={`clinical-card border-l-4 mb-4 ${
            result.level.color === "text-success" ? "border-l-success" :
            result.level.color === "text-warning" ? "border-l-warning" : "border-l-destructive"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.total <= 1 ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <AlertTriangle className={`w-5 h-5 ${result.level.color}`} />
                )}
                <div>
                  <h3 className="font-heading font-bold text-lg">{result.level.risk} Risk</h3>
                  <p className="text-xs text-muted-foreground">
                    {result.active.length} factors · {result.total} points
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-heading font-bold ${result.level.color}`}>{result.total}</span>
                <span className="text-xs text-muted-foreground block">points</span>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="p-1.5 rounded bg-muted/50">
                <span className="text-muted-foreground">VTE risk: </span>
                <strong>{result.level.vte_risk}</strong>
              </div>
              <div className="p-1.5 rounded bg-muted/50">
                <span className="text-muted-foreground">Prophylaxis: </span>
                <strong>{result.level.prophylaxis}</strong>
              </div>
            </div>
          </div>

          {/* Risk levels reference */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {CAPRINI_RISK_LEVELS.map(l => (
              <div key={l.risk} className={`p-2 rounded-lg text-center ${
                l.color === "text-success" ? "bg-success/10 border border-success/20" :
                l.color === "text-warning" ? "bg-warning/10 border border-warning/20" :
                "bg-destructive/10 border border-destructive/20"
              }`}>
                <div className="font-medium text-sm">{l.risk}</div>
                <div className="text-xs text-muted-foreground">{l.min}–{l.max} pts</div>
                <div className={`text-lg font-bold ${l.color}`}>{l.vte_risk}</div>
              </div>
            ))}
          </div>

          {/* Factors by group */}
          {(["minor", "moderate", "major", "high"] as const).map(group => {
            const groupFactors = factors.filter(f => f.group === group);
            const activeCount = groupFactors.filter(f => f.active).length;
            return (
              <div key={group} className={`mb-3 p-3 rounded-lg border-l-4 ${groupColors[group]} bg-muted/20`}>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">
                  {groupLabels[group]} ({activeCount} selected)
                </h4>
                <div className="space-y-1.5">
                  {groupFactors.map(f => (
                    <label key={f.id} className={`flex items-start gap-2 p-1.5 rounded transition-colors cursor-pointer ${
                      f.active ? "bg-warning/5" : "hover:bg-muted/30"
                    }`}>
                      <Switch
                        checked={f.active}
                        onCheckedChange={() => toggleFactor(f.id)}
                        className="mt-0.5 shrink-0 scale-75"
                      />
                      <span className="text-xs flex-1">{f.label}</span>
                      <span className="text-xs text-muted-foreground shrink-0">+{f.points}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Surgical Apgar Score ───
const SurgicalApgarCalculator = () => {
  const [inputs, setInputs] = useState<ApgarInputs>({
    estimatedBloodLoss: "",
    lowestMAP: "",
    lowestHR: "",
  });

  const updateInput = (field: keyof ApgarInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const result = useMemo(() => {
    const ebl = parseFloat(inputs.estimatedBloodLoss);
    const map = parseFloat(inputs.lowestMAP);
    const hr = parseFloat(inputs.lowestHR);

    if (isNaN(ebl) || isNaN(map) || isNaN(hr)) return null;

    const points = APGAR_POINTS_MAP(ebl, map, hr);
    const level = APGAR_RISK.find(l => points >= l.min && points <= l.max) || APGAR_RISK[4];
    return { points, level };
  }, [inputs]);

  return (
    <div className="space-y-4">
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Timer className="w-4 h-4 text-amber-500" />
            Surgical Apgar Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Intra-operative 10-point score predicting post-operative morbidity and mortality. Based on estimated blood loss, lowest MAP, and lowest heart rate.
          </p>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Estimated Blood Loss (mL)</Label>
              <Input
                type="number"
                placeholder="e.g., 300"
                value={inputs.estimatedBloodLoss}
                onChange={e => updateInput("estimatedBloodLoss", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Lowest MAP (mmHg)</Label>
              <Input
                type="number"
                placeholder="e.g., 65"
                value={inputs.lowestMAP}
                onChange={e => updateInput("lowestMAP", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Lowest Heart Rate (bpm)</Label>
              <Input
                type="number"
                placeholder="e.g., 80"
                value={inputs.lowestHR}
                onChange={e => updateInput("lowestHR", e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className={`clinical-card border-l-4 mb-4 ${
              result.level.color === "text-success" ? "border-l-success" :
              result.level.color === "text-warning" ? "border-l-warning" : "border-l-destructive"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {result.points >= 7 ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <AlertTriangle className={`w-5 h-5 ${result.level.color}`} />
                  )}
                  <div>
                    <h3 className="font-heading font-bold text-lg">
                      {result.points}/10 — {result.level.risk}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {result.level.risk} risk of major complication or mortality
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-heading font-bold ${result.level.color}`}>{result.points}</span>
                  <span className="text-xs text-muted-foreground block">/ 10</span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="p-1.5 rounded bg-muted/50">
                  <span className="text-muted-foreground">Mortality: </span>
                  <strong>{result.level.mortality}</strong>
                </div>
                <div className="p-1.5 rounded bg-muted/50">
                  <span className="text-muted-foreground">Morbidity: </span>
                  <strong>{result.level.morbidity}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Scoring reference */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <h4 className="text-xs font-medium mb-2">Scoring Reference</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="font-medium mb-1">EBL (mL)</div>
                <div className="space-y-0.5 text-muted-foreground">
                  <div>≤100 → 4 pts</div>
                  <div>101–600 → 3 pts</div>
                  <div>601–1000 → 2 pts</div>
                  <div>1001–1500 → 1 pt</div>
                  <div>&gt;1500 → 0 pts</div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Lowest MAP</div>
                <div className="space-y-0.5 text-muted-foreground">
                  <div>&gt;70 → 4 pts</div>
                  <div>61–70 → 3 pts</div>
                  <div>51–60 → 2 pts</div>
                  <div>41–50 → 1 pt</div>
                  <div>≤40 → 0 pts</div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Lowest HR</div>
                <div className="space-y-0.5 text-muted-foreground">
                  <div>≤70 → 4 pts</div>
                  <div>71–90 → 3 pts</div>
                  <div>91–110 → 2 pts</div>
                  <div>111–130 → 1 pt</div>
                  <div>&gt;130 → 0 pts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk table */}
          <div className="mt-3 grid grid-cols-5 gap-1 text-center text-xs">
            {APGAR_RISK.map(l => (
              <div key={l.min} className={`p-1.5 rounded ${
                l.color === "text-success" ? "bg-success/10" :
                l.color === "text-warning" ? "bg-warning/10" : "bg-destructive/10"
              }`}>
                <div className={`font-bold ${l.color}`}>{l.min}–{l.max}</div>
                <div className="text-muted-foreground">{l.risk}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Perioperative Medication Management ───
const PeriopMedManagement = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedDrug, setExpandedDrug] = useState<string | null>(null);

  const categoryLabels: Record<string, string> = {
    cardiac: "Cardiovascular",
    endocrine: "Endocrine",
    pulmonary: "Pulmonary",
    cns: "CNS/Psychiatry",
    rheum: "Rheumatology",
    gi: "GI",
    other: "Other",
  };

  const categoryColors: Record<string, string> = {
    cardiac: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    endocrine: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    pulmonary: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    cns: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    rheum: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    gi: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    other: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const filtered = useMemo(() => {
    return PERIOP_MEDS.filter(m => {
      if (categoryFilter !== "all" && m.category !== categoryFilter) return false;
      if (search && !m.drug.toLowerCase().includes(search.toLowerCase()) && !m.notes.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, categoryFilter]);

  return (
    <div className="space-y-4">
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Pill className="w-4 h-4 text-green-500" />
            Perioperative Medication Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Guide for managing chronic medications in the perioperative period. Always verify with institutional protocols and consult pharmacy for complex cases.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Input
              placeholder="Search medications..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 text-xs max-w-xs"
            />
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                  categoryFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 border-border/40 hover:bg-muted/50"
                }`}
              >
                All
              </button>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                    categoryFilter === key ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 border-border/40 hover:bg-muted/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Medication list */}
          <div className="space-y-2">
            {filtered.map(med => (
              <Collapsible
                key={med.drug}
                open={expandedDrug === med.drug}
                onOpenChange={() => setExpandedDrug(expandedDrug === med.drug ? null : med.drug)}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full text-left">
                    <div className={`p-3 rounded-lg border transition-colors ${
                      expandedDrug === med.drug ? "bg-muted/50 border-primary/30" : "bg-muted/20 border-border/40 hover:bg-muted/30"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{med.drug}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full border ${categoryColors[med.category]}`}>
                            {categoryLabels[med.category]}
                          </span>
                        </div>
                        {expandedDrug === med.drug ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border/30 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="p-2 rounded bg-background/50 border border-border/20">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Pre-operative</div>
                        <p className="text-xs">{med.preop}</p>
                      </div>
                      <div className="p-2 rounded bg-background/50 border border-border/20">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Post-operative</div>
                        <p className="text-xs">{med.postop}</p>
                      </div>
                    </div>
                    <div className="p-2 rounded bg-warning/5 border border-warning/20">
                      <div className="text-xs font-medium text-warning mb-1">Notes</div>
                      <p className="text-xs">{med.notes}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No medications match your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Pre-op Labs Guide ───
const PreopLabsGuide = () => {
  const [expandedLab, setExpandedLab] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-500" />
            Pre-operative Laboratory Evaluation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Evidence-based guide for pre-operative testing. "Routine" testing is not recommended — test only when clinically indicated.
          </p>

          <div className="space-y-2">
            {PREOP_LABS.map(lab => (
              <Collapsible
                key={lab.test}
                open={expandedLab === lab.test}
                onOpenChange={() => setExpandedLab(expandedLab === lab.test ? null : lab.test)}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full text-left">
                    <div className={`p-3 rounded-lg border transition-colors ${
                      expandedLab === lab.test ? "bg-muted/50 border-primary/30" : "bg-muted/20 border-border/40 hover:bg-muted/30"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{lab.test}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {lab.timing}
                          </span>
                        </div>
                        {expandedLab === lab.test ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border/30 space-y-2">
                    <div className="p-2 rounded bg-background/50 border border-border/20">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Indications</div>
                      <p className="text-xs">{lab.indication}</p>
                    </div>
                    <div className="p-2 rounded bg-warning/5 border border-warning/20">
                      <div className="text-xs font-medium text-warning mb-1">Notes</div>
                      <p className="text-xs">{lab.notes}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-medium text-primary mb-1">Key Principles</h4>
            <ul className="text-xs space-y-1">
              <li>• <strong>Do not</strong> order "routine" pre-operative labs — test only when results will change management</li>
              <li>• <strong>Age alone</strong> is not an indication for most tests (except ECG for age &gt;65)</li>
              <li>• <strong>Abnormal results</strong> should be evaluated and corrected before elective surgery when possible</li>
              <li>• <strong>Document</strong> the indication for each test in the medical record</li>
              <li>• <strong>Repeat testing</strong> is rarely needed if recent (&lt;30 days) results are available and stable</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerioperativeCalculators;
