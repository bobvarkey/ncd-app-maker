import { useMemo, useState } from "react";
import { AlertTriangle, ShieldAlert, Activity, Scissors, Copy, Printer, Siren } from "lucide-react";
import { toast } from "sonner";

type Regimen = { drug: string; dose: string; route: string; notes?: string };

type SeriousCondition = {
  id: string;
  label: string;
  category: "Emergency" | "Serious CA" | "Nosocomial";
  emergency: boolean;
  workingDx: string;
  empiric: Regimen[];
  mrsaAdd?: Regimen;
  mdrEscalation?: string;
  pcnSevereAlt?: string;
  duration: string;
  monitoring: string[];
  sourceControl: string;
  escalation: string[];
  stewardship: string[];
  redFlags: string[];
  presetScenario: string;
};

const CONDITIONS: SeriousCondition[] = [
  {
    id: "sepsis_unknown_source",
    label: "Sepsis — unknown source",
    category: "Emergency",
    emergency: true,
    workingDx: "Sepsis until proven otherwise. Do not delay antibiotics for cultures (target <1 h).",
    empiric: [
      { drug: "Piperacillin-tazobactam", dose: "4.5 g q6h (extended infusion if available)", route: "IV" },
      { drug: "Cefepime (alt)", dose: "2 g q8h", route: "IV" },
      { drug: "Meropenem (if shock / MDR risk)", dose: "1 g q8h (2 g q8h if severe)", route: "IV" },
    ],
    mrsaAdd: { drug: "Vancomycin", dose: "25–30 mg/kg load, then by levels", route: "IV", notes: "Add if MRSA risk, line/skin source, severe sepsis" },
    mdrEscalation: "Shock, recent broad abx, prior MDR, healthcare exposure → meropenem ± aminoglycoside.",
    duration: "Reassess at 48–72 h; total 7–10 d typical (source-dependent)",
    monitoring: ["Lactate trend", "MAP / vasopressors", "Cultures × 2 sets before abx if no delay", "Renal & hepatic function", "Vancomycin levels"],
    sourceControl: "Hunt for source: CXR, urinalysis, abdominal imaging, skin exam, line review. Drain/debride/remove early.",
    escalation: ["Lactate ≥4 or persistent ≥2", "MAP <65 despite fluids → pressors + ICU", "End-organ dysfunction"],
    stewardship: ["De-escalate at 48–72 h based on cultures", "Stop empiric MRSA cover if MRSA screen/cultures negative at 48 h", "Document indication + planned duration"],
    redFlags: ["Hypotension / shock", "Altered mental status", "Lactate ≥4", "Mottled skin, oliguria"],
    presetScenario: "65 y/o, BP 84/50, HR 122, lactate 4.2, recent hospitalization → severe sepsis with MDR risk.",
  },
  {
    id: "community_acquired_pneumonia",
    label: "Community-acquired pneumonia",
    category: "Serious CA",
    emergency: false,
    workingDx: "CAP — stratify outpatient / inpatient ward / ICU (CURB-65, PSI).",
    empiric: [
      { drug: "Outpatient low-risk: Amoxicillin", dose: "1 g PO TID", route: "PO" },
      { drug: "Outpatient with comorbidities: Amoxicillin-clavulanate + Azithromycin", dose: "875/125 mg BID + 500→250 mg", route: "PO" },
      { drug: "Inpatient ward: Ceftriaxone + Azithromycin", dose: "1–2 g daily + 500 mg daily", route: "IV" },
      { drug: "ICU: Ceftriaxone + Azithromycin (or respiratory FQ)", dose: "2 g daily + 500 mg daily", route: "IV" },
    ],
    mrsaAdd: { drug: "Vancomycin or Linezolid", dose: "Vanco 25–30 mg/kg load; Linezolid 600 mg q12h", route: "IV", notes: "Add only if MRSA risk: prior MRSA, recent IV abx, cavitary disease, post-influenza necrotizing PNA" },
    mdrEscalation: "Add anti-pseudomonal (pip-tazo or cefepime) only for structural lung dz, prior Pseudomonas, recent IV abx.",
    pcnSevereAlt: "Levofloxacin 750 mg IV/PO daily monotherapy.",
    duration: "5 days if clinically stable at 48–72 h; longer for complications.",
    monitoring: ["SpO2, RR, work of breathing", "Lactate if severe", "Procalcitonin (de-escalation)", "Blood + sputum cultures, Legionella/pneumococcal UAg"],
    sourceControl: "Drain parapneumonic effusion / empyema. Treat influenza co-infection.",
    escalation: ["SpO2 <90% on RA / increasing O2 needs", "Multilobar / bilateral infiltrates", "Hemodynamic instability → ICU"],
    stewardship: ["Switch IV → PO when afebrile & tolerating PO", "De-escalate to pathogen-directed therapy"],
    redFlags: ["RR ≥30", "SpO2 <90%", "Hypotension", "Confusion", "BUN ≥7 mmol/L (CURB-65)"],
    presetScenario: "78 y/o, RR 28, SpO2 88%, confused, BUN 9 → CURB-65 ≥3, admit + IV ceftriaxone + azithromycin.",
  },
  {
    id: "meningitis",
    label: "Bacterial meningitis",
    category: "Emergency",
    emergency: true,
    workingDx: "Bacterial meningitis — EMERGENCY. Give abx within 1 h; do not delay for CT/LP.",
    empiric: [
      { drug: "Ceftriaxone", dose: "2 g q12h", route: "IV" },
      { drug: "Vancomycin", dose: "25–30 mg/kg load then by levels", route: "IV" },
      { drug: "Ampicillin (age >50, immunocompromised, pregnant)", dose: "2 g q4h", route: "IV", notes: "Listeria cover" },
      { drug: "Dexamethasone", dose: "0.15 mg/kg q6h × 4 d", route: "IV", notes: "Give with or before first abx dose (pneumococcal)" },
    ],
    pcnSevereAlt: "Meropenem 2 g q8h + vancomycin (ID consult).",
    duration: "Pathogen-directed (7–21 d).",
    monitoring: ["Neuro checks q1–2h", "ICP signs", "CSF Gram stain, culture, PCR", "Vancomycin levels"],
    sourceControl: "Treat sinusitis/otitis/mastoiditis source; neurosurgery if abscess or shunt.",
    escalation: ["GCS drop, seizures, focal deficit → ICU + neurosurgery", "Add acyclovir if encephalitis cannot be excluded"],
    stewardship: ["Narrow to pathogen and susceptibilities", "Stop ampicillin if no Listeria"],
    redFlags: ["Petechial/purpuric rash (meningococcemia)", "Coma / seizures", "Septic shock", "Papilledema / focal deficit"],
    presetScenario: "72 y/o, fever + neck stiffness + confusion → ceftriaxone + vancomycin + ampicillin + dexamethasone NOW.",
  },
  {
    id: "encephalitis",
    label: "Encephalitis",
    category: "Emergency",
    emergency: true,
    workingDx: "Assume HSV encephalitis until excluded.",
    empiric: [
      { drug: "Acyclovir", dose: "10 mg/kg IBW q8h (renal-adjusted)", route: "IV", notes: "Start immediately — do not wait for PCR" },
      { drug: "Ceftriaxone + Vancomycin", dose: "as for meningitis", route: "IV", notes: "If bacterial meningitis not excluded" },
    ],
    duration: "Acyclovir 14–21 d if HSV PCR positive.",
    monitoring: ["Neuro checks", "Renal function (acyclovir nephrotoxicity → hydrate)", "EEG if seizures", "HSV/VZV/enterovirus PCR on CSF"],
    sourceControl: "Imaging (MRI temporal lobes), neurology consult.",
    escalation: ["Status epilepticus / coma → ICU", "Cerebral edema → mannitol, neurosurg"],
    stewardship: ["Stop acyclovir if HSV/VZV PCR neg + clinical picture against", "De-escalate bacterial cover per CSF"],
    redFlags: ["Personality change + fever", "Seizures", "Focal deficit", "Decreased GCS"],
    presetScenario: "45 y/o fever + behavioral change + temporal lobe seizure → acyclovir + bacterial cover until LP.",
  },
  {
    id: "pyelonephritis",
    label: "Pyelonephritis (complicated)",
    category: "Serious CA",
    emergency: false,
    workingDx: "Upper UTI ± sepsis. Assess obstruction, pregnancy, renal impairment.",
    empiric: [
      { drug: "Ceftriaxone", dose: "1–2 g daily", route: "IV" },
      { drug: "Piperacillin-tazobactam (severe/complicated)", dose: "4.5 g q8h", route: "IV" },
      { drug: "Meropenem (ESBL risk)", dose: "1 g q8h", route: "IV" },
    ],
    pcnSevereAlt: "Ciprofloxacin 400 mg IV q12h or aztreonam 1–2 g q8h.",
    duration: "7 d (FQ) or 10–14 d (β-lactam); longer if bacteremia or abscess.",
    monitoring: ["Urine + blood cultures", "Renal function", "Imaging if no improvement at 48–72 h"],
    sourceControl: "Relieve obstruction (stent, nephrostomy) urgently if hydronephrosis/stone.",
    escalation: ["Sepsis / shock → ICU + broad abx", "Obstruction → urology emergency", "Pregnancy → admit"],
    stewardship: ["IV → PO when afebrile 24 h", "Narrow per culture"],
    redFlags: ["Hemodynamic instability", "Obstruction / hydronephrosis", "Pregnancy", "Failure to improve at 72 h"],
    presetScenario: "Pregnant, fever 39.5, flank pain → admit, ceftriaxone IV, US for obstruction.",
  },
  {
    id: "cholangitis",
    label: "Acute cholangitis",
    category: "Emergency",
    emergency: true,
    workingDx: "Charcot triad / Tokyo criteria. Needs urgent biliary drainage + antibiotics.",
    empiric: [
      { drug: "Piperacillin-tazobactam", dose: "4.5 g q8h", route: "IV" },
      { drug: "Ceftriaxone + Metronidazole", dose: "2 g daily + 500 mg q8h", route: "IV" },
      { drug: "Meropenem (severe / resistant risk)", dose: "1 g q8h", route: "IV" },
    ],
    pcnSevereAlt: "Ciprofloxacin + metronidazole or aztreonam + metronidazole.",
    duration: "4–7 d after adequate source control.",
    monitoring: ["Bilirubin, ALT, ALP", "Lactate", "Blood cultures", "Coagulation"],
    sourceControl: "ERCP / PTC for biliary drainage — do not delay.",
    escalation: ["Sepsis → ICU + meropenem", "Suppurative cholangitis → emergency drainage"],
    stewardship: ["Narrow per bile/blood cultures", "Short course after drainage"],
    redFlags: ["Hypotension", "Altered mental status (Reynolds pentad)", "Bilirubin rapidly rising", "Failed drainage"],
    presetScenario: "70 y/o, fever + RUQ pain + jaundice + hypotension → pip-tazo IV + urgent ERCP.",
  },
  {
    id: "infective_endocarditis",
    label: "Infective endocarditis",
    category: "Serious CA",
    emergency: false,
    workingDx: "Duke criteria. Obtain 3 sets of blood cultures from separate sites before antibiotics if patient is stable.",
    empiric: [
      { drug: "Vancomycin", dose: "25–30 mg/kg load, then by levels", route: "IV" },
      { drug: "Ceftriaxone (selected native valve)", dose: "2 g daily", route: "IV", notes: "Per local practice / ID input" },
    ],
    mdrEscalation: "Prosthetic valve / healthcare-associated → add gentamicin + rifampin per ID; consider broader gram-negative cover.",
    pcnSevereAlt: "Vancomycin monotherapy until ID guidance.",
    duration: "4–6 weeks IV (pathogen + valve dependent).",
    monitoring: ["Daily blood cultures until clear", "Echo (TTE → TEE)", "Vancomycin troughs", "Embolic surveillance"],
    sourceControl: "Cardiac surgery referral early for heart failure, abscess, large vegetation, persistent bacteremia.",
    escalation: ["Heart failure → urgent surgery", "Persistent bacteremia >5–7 d", "Stroke / embolic events"],
    stewardship: ["ID consultation mandatory", "Pathogen-directed therapy"],
    redFlags: ["New murmur + heart failure", "Embolic stroke", "Conduction block (perivalvular abscess)", "Persistent positive blood cultures"],
    presetScenario: "IVDU, fever, new TR murmur → 3 sets BC, vancomycin IV, TTE/TEE, ID + cardiothoracic consult.",
  },
  {
    id: "necrotizing_soft_tissue_infection",
    label: "Necrotizing soft tissue infection",
    category: "Emergency",
    emergency: true,
    workingDx: "Surgical emergency. Pain out of proportion, crepitus, bullae, rapid spread. Do NOT delay debridement.",
    empiric: [
      { drug: "Piperacillin-tazobactam", dose: "4.5 g q6h", route: "IV" },
      { drug: "Vancomycin", dose: "25–30 mg/kg load then by levels", route: "IV" },
      { drug: "Clindamycin", dose: "900 mg q8h", route: "IV", notes: "Anti-toxin effect (suppresses streptococcal/staphylococcal toxin)" },
      { drug: "Meropenem (alt to pip-tazo in MDR risk)", dose: "1 g q8h", route: "IV" },
    ],
    pcnSevereAlt: "Meropenem + vancomycin + clindamycin (allergy consult).",
    duration: "Continue until no further debridement needed + clinical improvement (typically ≥2 weeks).",
    monitoring: ["Surgical reassessment q12–24 h", "Lactate, CK", "Renal function", "LRINEC score (supportive only)"],
    sourceControl: "Emergency surgical debridement — definitive treatment. Repeat as needed.",
    escalation: ["Shock → ICU + vasopressors", "Consider IVIG for toxic shock", "Hyperbaric O2 (selected centres)"],
    stewardship: ["Narrow once Gram stain / cultures available", "Continue clindamycin until toxin production controlled"],
    redFlags: ["Pain out of proportion", "Crepitus / bullae / skin necrosis", "Hypotension", "Rapid progression"],
    presetScenario: "Diabetic, severe leg pain, dusky skin, crepitus, BP 90/50 → OR NOW + pip-tazo + vanc + clinda.",
  },
  {
    id: "cdi",
    label: "C. difficile infection",
    category: "Nosocomial",
    emergency: false,
    workingDx: "CDI — stratify non-severe, severe (WBC ≥15 or Cr ≥1.5× baseline), fulminant (hypotension/ileus/megacolon).",
    empiric: [
      { drug: "Fidaxomicin (preferred where available)", dose: "200 mg PO BID", route: "PO" },
      { drug: "Vancomycin oral", dose: "125 mg PO QID", route: "PO" },
      { drug: "Fulminant: Vancomycin PO + IV metronidazole", dose: "Vanco 500 mg PO/NG QID + metro 500 mg IV q8h ± vanco PR", route: "PO/PR/IV" },
    ],
    duration: "10 days standard; tapered/pulsed for recurrence.",
    monitoring: ["WBC, creatinine", "Lactate (fulminant)", "Stool frequency", "Abdominal exam ± CT for megacolon"],
    sourceControl: "Stop unnecessary antibiotics; stop PPI if possible. Surgery for fulminant disease unresponsive to therapy.",
    escalation: ["Fulminant → surgical consult, ICU", "Recurrence → fidaxomicin / FMT", "Toxic megacolon → emergency colectomy"],
    stewardship: ["Avoid metronidazole monotherapy except mild + no alternative", "Strict contact precautions, soap & water hand hygiene"],
    redFlags: ["Hypotension", "Ileus / abdominal distention", "WBC ≥25", "Lactate ≥5", "Megacolon on imaging"],
    presetScenario: "Post-abx diarrhea, WBC 22, Cr 1.8× → severe CDI → fidaxomicin or vancomycin PO.",
  },
  {
    id: "ventilator_associated_pneumonia",
    label: "Ventilator-associated pneumonia (VAP)",
    category: "Nosocomial",
    emergency: false,
    workingDx: "New infiltrate + fever/leukocytosis + purulent secretions ≥48 h after intubation. Use local antibiogram.",
    empiric: [
      { drug: "Piperacillin-tazobactam", dose: "4.5 g q6h (extended infusion)", route: "IV" },
      { drug: "Cefepime", dose: "2 g q8h", route: "IV" },
      { drug: "Meropenem (high MDR risk)", dose: "1–2 g q8h", route: "IV" },
    ],
    mrsaAdd: { drug: "Vancomycin or Linezolid", dose: "Vanco by levels; Linezolid 600 mg q12h", route: "IV", notes: "Add if MRSA risk / prevalence >10–20%" },
    mdrEscalation: "Double gram-negative cover (β-lactam + aminoglycoside/FQ) if septic shock or high MDR risk.",
    duration: "7 days (de-escalate based on cultures and clinical response).",
    monitoring: ["Lower respiratory cultures (BAL/ETA)", "Procalcitonin trend", "Daily SBT / extubation readiness"],
    sourceControl: "Elevate head of bed, oral chlorhexidine, subglottic suction, daily sedation interruption.",
    escalation: ["Worsening oxygenation → ARDS care", "Multilobar / cavitary → broaden + ID consult"],
    stewardship: ["De-escalate at 48–72 h", "Stop MRSA cover if MRSA-negative respiratory culture"],
    redFlags: ["Septic shock", "Multilobar progression", "Persistent positive cultures despite therapy"],
    presetScenario: "Day 5 vented, new RLL infiltrate, fever, purulent ETA → cefepime + vancomycin per local rates.",
  },
  {
    id: "hospital_acquired_pneumonia",
    label: "Hospital-acquired pneumonia (HAP)",
    category: "Nosocomial",
    emergency: false,
    workingDx: "Pneumonia ≥48 h after admission, not present at admission. Risk-stratify for MDR.",
    empiric: [
      { drug: "Cefepime", dose: "2 g q8h", route: "IV" },
      { drug: "Piperacillin-tazobactam", dose: "4.5 g q6h", route: "IV" },
      { drug: "Meropenem (resistant GN risk)", dose: "1 g q8h", route: "IV" },
    ],
    mrsaAdd: { drug: "Vancomycin or Linezolid", dose: "Vanco by levels; Linezolid 600 mg q12h", route: "IV", notes: "Add if MRSA risk factors" },
    duration: "7 days typically.",
    monitoring: ["Cultures + susceptibilities", "Oxygenation", "Procalcitonin trend"],
    sourceControl: "Aspiration precautions, mobilisation, deep breathing.",
    escalation: ["Respiratory failure → ICU/intubation", "Empyema → drainage"],
    stewardship: ["Narrow / de-escalate to organism-directed therapy"],
    redFlags: ["Hemodynamic instability", "Hypoxia despite O2", "Cavitation / multilobar"],
    presetScenario: "Day 4 post-op, new infiltrate + fever, no MDR risk → cefepime monotherapy 7 d.",
  },
  {
    id: "catheter_associated_uti",
    label: "Catheter-associated UTI (CAUTI)",
    category: "Nosocomial",
    emergency: false,
    workingDx: "Symptomatic UTI in catheterised patient (do not treat asymptomatic bacteriuria except pregnancy/pre-urologic procedure).",
    empiric: [
      { drug: "Ceftriaxone", dose: "1–2 g daily", route: "IV" },
      { drug: "Piperacillin-tazobactam (severe)", dose: "4.5 g q8h", route: "IV" },
      { drug: "Meropenem (ESBL risk)", dose: "1 g q8h", route: "IV" },
    ],
    pcnSevereAlt: "Aztreonam or ciprofloxacin (per susceptibilities).",
    duration: "7 days (responsive) – 10–14 days (delayed response).",
    monitoring: ["Urine + blood cultures BEFORE abx", "Renal function"],
    sourceControl: "Remove or replace catheter prior to starting antibiotics whenever feasible.",
    escalation: ["Bacteremia / sepsis → broaden cover, admit", "Obstruction → urology"],
    stewardship: ["Do NOT treat asymptomatic bacteriuria", "Narrow per culture", "Remove catheter ASAP"],
    redFlags: ["Sepsis", "Obstruction", "Recurrent infections (consider stones, prostatitis)"],
    presetScenario: "Long-term catheter, fever + flank pain → replace catheter, send culture, start ceftriaxone.",
  },
  {
    id: "line_related_bloodstream_infection",
    label: "Line-related bloodstream infection (CLABSI)",
    category: "Nosocomial",
    emergency: false,
    workingDx: "Suspect with fever + line in situ ± exit-site signs. Paired blood cultures (peripheral + line).",
    empiric: [
      { drug: "Vancomycin", dose: "25–30 mg/kg load then by levels", route: "IV" },
      { drug: "Add gram-negative cover (Cefepime or Pip-tazo) if unstable / immunocompromised / femoral line", dose: "Cefepime 2 g q8h or pip-tazo 4.5 g q6h", route: "IV" },
      { drug: "Meropenem (high MDR risk)", dose: "1 g q8h", route: "IV" },
      { drug: "Echinocandin if Candida suspected (TPN, prolonged abx, femoral line)", dose: "Caspofungin 70 mg load → 50 mg daily", route: "IV" },
    ],
    duration: "Pathogen-dependent: CoNS 5–7 d, S. aureus ≥14 d (longer if endocarditis/metastatic), gram-negatives 7–14 d, Candida ≥14 d after first negative BC.",
    monitoring: ["Repeat BC q24–48 h until clear", "Echocardiogram for S. aureus / Candida", "Tip culture if removed"],
    sourceControl: "Remove line for S. aureus, Candida, Pseudomonas, mycobacteria, tunnel infection, persistent bacteremia, sepsis.",
    escalation: ["Septic shock → broad + ICU", "Metastatic infection (endocarditis, osteomyelitis) → ID + extended therapy"],
    stewardship: ["Narrow per cultures + susceptibilities", "Antibiotic-lock therapy if line preserved"],
    redFlags: ["Septic shock", "Persistent bacteremia >72 h on therapy", "Embolic phenomena", "Tunnel/pocket infection"],
    presetScenario: "Central line, fever, BP 90/60, paired BCs differential time-to-positivity → vancomycin + remove line.",
  },
  {
    id: "surgical_site_infection",
    label: "Surgical site infection",
    category: "Nosocomial",
    emergency: false,
    workingDx: "Stratify superficial vs deep/organ-space. Drainage / source control first when indicated.",
    empiric: [
      { drug: "Cefazolin (clean wound, skin flora)", dose: "1–2 g q8h", route: "IV" },
      { drug: "Flucloxacillin (alt)", dose: "1–2 g q6h", route: "IV/PO" },
      { drug: "Add Vancomycin (MRSA risk)", dose: "by levels", route: "IV" },
      { drug: "Intra-abdominal / GU surgery: Piperacillin-tazobactam", dose: "4.5 g q8h", route: "IV" },
    ],
    pcnSevereAlt: "Vancomycin ± aztreonam ± metronidazole.",
    duration: "After source control: 4–7 d (uncomplicated) to longer for deep/prosthetic.",
    monitoring: ["Wound exam", "WBC / CRP trend", "Cultures from deep wound (not swab only)"],
    sourceControl: "Open / drain wound. Remove infected hardware / mesh if needed.",
    escalation: ["Sepsis → broaden + admit", "Deep/prosthetic → surgical + ID consult"],
    stewardship: ["Narrow per culture", "Don't treat skin colonisers", "Avoid prolonged courses after adequate source control"],
    redFlags: ["Crepitus / bullae (necrotizing)", "Hemodynamic instability", "Mediastinitis / fascial dehiscence", "Prosthetic involvement"],
    presetScenario: "Post-laparotomy day 5, wound erythema + purulence, fever → open wound + cefazolin (± vanc per MRSA risk).",
  },
  {
    id: "infected_pressure_injury",
    label: "Infected pressure injury",
    category: "Serious CA",
    emergency: false,
    workingDx: "Assess depth (stage), surrounding cellulitis, osteomyelitis risk, need for debridement.",
    empiric: [
      { drug: "Mild: Amoxicillin-clavulanate or Cephalexin", dose: "875/125 mg PO BID or 500 mg PO QID", route: "PO" },
      { drug: "Severe / polymicrobial: Piperacillin-tazobactam", dose: "4.5 g q8h", route: "IV" },
      { drug: "Add Vancomycin (MRSA risk)", dose: "by levels", route: "IV" },
    ],
    pcnSevereAlt: "Levofloxacin + metronidazole ± vancomycin.",
    duration: "7–14 d soft tissue; 4–6 weeks if osteomyelitis confirmed.",
    monitoring: ["Wound assessment", "Probe-to-bone test, MRI if osteo suspected", "Deep tissue / bone culture"],
    sourceControl: "Debride necrotic tissue; offload pressure; nutrition optimisation.",
    escalation: ["Sepsis → broad + admit", "Osteomyelitis → ID + surgical debridement"],
    stewardship: ["Avoid superficial swab-driven therapy", "Narrow per deep culture"],
    redFlags: ["Systemic sepsis", "Exposed bone / probe-to-bone", "Necrotizing features", "Rapid progression"],
    presetScenario: "Stage 4 sacral ulcer, fever, exposed bone → MRI, pip-tazo IV + vancomycin, surgical debridement.",
  },
  {
    id: "febrile_neutropenia",
    label: "Febrile neutropenia",
    category: "Emergency",
    emergency: true,
    workingDx: "ANC <500 (or expected) + T ≥38.3 once or ≥38.0 sustained. TIME-CRITICAL — abx within 1 h.",
    empiric: [
      { drug: "Piperacillin-tazobactam", dose: "4.5 g q6h", route: "IV" },
      { drug: "Cefepime", dose: "2 g q8h", route: "IV" },
      { drug: "Meropenem (unstable / resistant risk)", dose: "1 g q8h", route: "IV" },
    ],
    mrsaAdd: { drug: "Vancomycin", dose: "by levels", route: "IV", notes: "Only with specific indication: hypotension, line infection, skin/soft-tissue, severe mucositis, prior MRSA, pneumonia" },
    mdrEscalation: "Add aminoglycoside in shock or known MDR colonisation.",
    pcnSevereAlt: "Aztreonam + vancomycin ± aminoglycoside (or meropenem if non-anaphylactic).",
    duration: "Until ANC recovery and afebrile ≥48 h (source-dependent).",
    monitoring: ["Cultures × 2 (peripheral + line)", "Daily exam (perianal, oral, line)", "CXR, urinalysis", "G-CSF if appropriate"],
    sourceControl: "Hunt for source — mucositis, line, perianal, sinus, lung. Remove infected line.",
    escalation: ["Septic shock → ICU", "Persistent fever >72–96 h → add empiric antifungal (echinocandin or voriconazole)"],
    stewardship: ["Stop vancomycin at 48 h if no MRSA indication / negative cultures", "Narrow per cultures"],
    redFlags: ["Hypotension", "Mucositis with bleeding", "New respiratory symptoms", "Altered mental status", "ANC <100 prolonged"],
    presetScenario: "Day 10 post-chemo, T 38.5, ANC 200 → cultures + pip-tazo IV within 1 h.",
  },
];

type Ctx = {
  conditionId: string;
  age: string;
  weight: string;
  pregnant: boolean;
  pcnAllergy: "none" | "mild" | "severe";
  severe: boolean;
  shock: boolean;
  icu: boolean;
  renal: boolean;
  liver: boolean;
  mrsaRisk: boolean;
  mdrRisk: boolean;
  recentHosp: boolean;
  recentAbx: boolean;
  device: boolean;
  neutropenia: boolean;
  sourceControl: boolean;
};

const PILL_INPUT =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

export default function SeriousInfections() {
  const [ctx, setCtx] = useState<Ctx>({
    conditionId: "sepsis_unknown_source",
    age: "",
    weight: "",
    pregnant: false,
    pcnAllergy: "none",
    severe: false,
    shock: false,
    icu: false,
    renal: false,
    liver: false,
    mrsaRisk: false,
    mdrRisk: false,
    recentHosp: false,
    recentAbx: false,
    device: false,
    neutropenia: false,
    sourceControl: false,
  });

  const condition = useMemo(
    () => CONDITIONS.find((c) => c.id === ctx.conditionId)!,
    [ctx.conditionId],
  );

  const grouped = useMemo(() => {
    const m: Record<string, SeriousCondition[]> = {};
    CONDITIONS.forEach((c) => {
      (m[c.category] ||= []).push(c);
    });
    return m;
  }, []);

  const showMrsa = condition.mrsaAdd && (ctx.mrsaRisk || ctx.shock || ctx.device || condition.id === "infective_endocarditis");
  const showMdr = condition.mdrEscalation && (ctx.mdrRisk || ctx.shock || ctx.recentAbx || ctx.recentHosp);
  const showPcnAlt = ctx.pcnAllergy === "severe" && condition.pcnSevereAlt;

  const summary = useMemo(() => {
    const out: string[] = [];
    out.push(`Serious/Nosocomial Infection Plan — ${condition.label}`);
    out.push(`Date: ${new Date().toLocaleString()}`);
    if (ctx.age) out.push(`Age: ${ctx.age}${ctx.weight ? ` | Weight: ${ctx.weight} kg` : ""}`);
    const flags = [
      ctx.pregnant && "Pregnant",
      ctx.pcnAllergy !== "none" && `PCN allergy ${ctx.pcnAllergy}`,
      ctx.severe && "Severe illness",
      ctx.shock && "Shock",
      ctx.icu && "ICU",
      ctx.renal && "Renal impairment",
      ctx.liver && "Hepatic impairment",
      ctx.mrsaRisk && "MRSA risk",
      ctx.mdrRisk && "MDR risk",
      ctx.recentHosp && "Recent hospitalization",
      ctx.recentAbx && "Recent antibiotics",
      ctx.device && "Indwelling device",
      ctx.neutropenia && "Neutropenia",
    ].filter(Boolean);
    if (flags.length) out.push(`Flags: ${flags.join(", ")}`);
    out.push("");
    out.push(`Working diagnosis: ${condition.workingDx}`);
    out.push("");
    out.push("Most common empiric regimens to start:");
    condition.empiric.forEach((r) => out.push(`  • ${r.drug} — ${r.dose} (${r.route})${r.notes ? ` [${r.notes}]` : ""}`));
    if (showMrsa && condition.mrsaAdd) out.push(`  + ADD MRSA cover: ${condition.mrsaAdd.drug} — ${condition.mrsaAdd.dose} (${condition.mrsaAdd.route})`);
    if (showMdr) out.push(`  + MDR escalation: ${condition.mdrEscalation}`);
    if (showPcnAlt) out.push(`  Severe PCN allergy alt: ${condition.pcnSevereAlt}`);
    out.push("");
    out.push(`Duration: ${condition.duration}`);
    out.push(`Monitoring: ${condition.monitoring.join("; ")}`);
    out.push(`Source control: ${condition.sourceControl}`);
    out.push(`Escalation: ${condition.escalation.join("; ")}`);
    out.push(`Stewardship: ${condition.stewardship.join("; ")}`);
    out.push(`Red flags: ${condition.redFlags.join("; ")}`);
    out.push("");
    out.push("Disclaimer: Decision-support only. Does not replace local antibiograms, ID consultation, renal-dose adjustment, allergy review, source control, or sepsis escalation.");
    return out.join("\n");
  }, [condition, ctx, showMrsa, showMdr, showPcnAlt]);

  const handlePreset = () => {
    toast.info("Auto-filled typical scenario", { description: condition.presetScenario });
    if (condition.id === "sepsis_unknown_source") {
      setCtx((p) => ({ ...p, age: "65", shock: true, severe: true, mdrRisk: true, recentHosp: true }));
    } else if (condition.id === "meningitis") {
      setCtx((p) => ({ ...p, age: "72", severe: true }));
    } else if (condition.id === "catheter_associated_uti") {
      setCtx((p) => ({ ...p, age: "70", device: true }));
    } else if (condition.id === "febrile_neutropenia") {
      setCtx((p) => ({ ...p, neutropenia: true, severe: true, recentAbx: true }));
    } else if (condition.id === "necrotizing_soft_tissue_infection") {
      setCtx((p) => ({ ...p, severe: true, shock: true, sourceControl: true }));
    } else if (condition.id === "ventilator_associated_pneumonia") {
      setCtx((p) => ({ ...p, icu: true, device: true, mdrRisk: true, mrsaRisk: true }));
    } else if (condition.id === "line_related_bloodstream_infection") {
      setCtx((p) => ({ ...p, device: true, mrsaRisk: true, severe: true }));
    }
  };

  const setField = <K extends keyof Ctx>(k: K, v: Ctx[K]) => setCtx((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-4">
      {/* Disclaimer */}
      <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-900 flex gap-2">
        <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          Decision-support only. <strong>Does NOT replace local antibiograms, ID consultation, renal-dose adjustment,
          allergy review, source control, or sepsis escalation.</strong> Always verify pregnancy, allergy, cultures, and imaging.
        </div>
      </div>

      {/* Syndrome picker */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Syndrome</h2>
          <button
            onClick={handlePreset}
            className="text-xs rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-primary hover:bg-primary/20"
          >
            Auto-fill typical scenario
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {(["Emergency", "Serious CA", "Nosocomial"] as const).map((cat) => (
            <div key={cat} className="space-y-1">
              <div className={`text-[10px] uppercase tracking-wide font-semibold ${cat === "Emergency" ? "text-red-700" : "text-muted-foreground"}`}>
                {cat === "Emergency" && <Siren className="inline h-3 w-3 mr-1" />}
                {cat}
              </div>
              <div className="flex flex-col gap-1">
                {(grouped[cat] || []).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setField("conditionId", c.id)}
                    className={`text-left text-xs rounded-md border px-2 py-1.5 transition ${
                      ctx.conditionId === c.id
                        ? "border-primary bg-primary/10 text-primary"
                        : c.emergency
                        ? "border-red-200 hover:bg-red-50"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inputs */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h2 className="text-sm font-semibold">Patient context</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Age (yrs)</label>
            <input className={PILL_INPUT} inputMode="numeric" value={ctx.age}
              onChange={(e) => setField("age", e.target.value.replace(/[^\d.]/g, ""))} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Weight (kg)</label>
            <input className={PILL_INPUT} inputMode="numeric" value={ctx.weight}
              onChange={(e) => setField("weight", e.target.value.replace(/[^\d.]/g, ""))} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Penicillin allergy</label>
            <select className={PILL_INPUT} value={ctx.pcnAllergy}
              onChange={(e) => setField("pcnAllergy", e.target.value as Ctx["pcnAllergy"])}>
              <option value="none">None</option>
              <option value="mild">Mild (rash)</option>
              <option value="severe">Severe / anaphylaxis</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4"
                checked={ctx.pregnant} onChange={(e) => setField("pregnant", e.target.checked)} />
              Pregnant
            </label>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {([
            ["severe", "Severe illness"],
            ["shock", "Septic shock"],
            ["icu", "ICU level care"],
            ["renal", "Renal impairment"],
            ["liver", "Hepatic impairment"],
            ["mrsaRisk", "MRSA risk"],
            ["mdrRisk", "MDR risk"],
            ["recentHosp", "Recent hospitalization (90 d)"],
            ["recentAbx", "Recent antibiotics (90 d)"],
            ["device", "Indwelling device / line"],
            ["neutropenia", "Neutropenia (ANC <500)"],
            ["sourceControl", "Source control needed"],
          ] as const).map(([k, label]) => (
            <label key={k} className="inline-flex items-center gap-2 text-xs">
              <input type="checkbox" className="h-4 w-4"
                checked={ctx[k] as boolean}
                onChange={(e) => setField(k, e.target.checked as never)} />
              {label}
            </label>
          ))}
        </div>
      </section>

      {/* Output */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-4 print:border-none print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
              {condition.emergency && <Siren className="h-5 w-5 text-red-600" />}
              {condition.label}
            </h2>
            <p className="text-xs text-muted-foreground">{condition.category}</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <button
              onClick={async () => { await navigator.clipboard.writeText(summary); toast.success("Summary copied"); }}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Working dx */}
        <div className={`rounded-md border px-3 py-2 text-sm ${
          condition.emergency
            ? "border-red-300 bg-red-50 text-red-900"
            : "border-emerald-300 bg-emerald-50 text-emerald-900"
        }`}>
          <div className="font-semibold">Working diagnosis</div>
          <div className="text-xs mt-0.5">{condition.workingDx}</div>
        </div>

        {/* Empiric */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Most common empiric regimens to start</h3>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Drug</th>
                  <th className="px-3 py-2 text-left">Adult dose</th>
                  <th className="px-3 py-2 text-left">Route</th>
                </tr>
              </thead>
              <tbody>
                {condition.empiric.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">{r.drug}</td>
                    <td className="px-3 py-2">{r.dose}</td>
                    <td className="px-3 py-2">
                      {r.route}
                      {r.notes && <div className="text-xs text-muted-foreground mt-0.5">{r.notes}</div>}
                    </td>
                  </tr>
                ))}
                {showMrsa && condition.mrsaAdd && (
                  <tr className="border-t border-border bg-amber-50">
                    <td className="px-3 py-2 font-medium text-amber-900">+ {condition.mrsaAdd.drug} <span className="text-[10px] uppercase">MRSA add-on</span></td>
                    <td className="px-3 py-2 text-amber-900">{condition.mrsaAdd.dose}</td>
                    <td className="px-3 py-2 text-amber-900">
                      {condition.mrsaAdd.route}
                      {condition.mrsaAdd.notes && <div className="text-xs mt-0.5">{condition.mrsaAdd.notes}</div>}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {showMdr && (
            <div className="rounded-md border border-orange-200 bg-orange-50 p-2 text-xs text-orange-900">
              <strong>MDR escalation:</strong> {condition.mdrEscalation}
            </div>
          )}
          {showPcnAlt && (
            <div className="rounded-md border border-purple-200 bg-purple-50 p-2 text-xs text-purple-900">
              <strong>Severe PCN allergy alternative:</strong> {condition.pcnSevereAlt}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            <strong>Duration:</strong> {condition.duration}
          </div>
        </div>

        {/* Source control + monitoring */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs">
            <div className="font-semibold text-blue-900 flex items-center gap-1">
              <Scissors className="h-3.5 w-3.5" /> Source control
            </div>
            <div className="mt-1 text-blue-900">{condition.sourceControl}</div>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
            <div className="font-semibold text-slate-900 flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" /> Monitoring
            </div>
            <ul className="mt-1 list-disc pl-5 text-slate-900 space-y-0.5">
              {condition.monitoring.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        </div>

        {/* Escalation + red flags */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs">
            <div className="font-semibold text-amber-900">Escalation flags</div>
            <ul className="mt-1 list-disc pl-5 text-amber-900 space-y-0.5">
              {condition.escalation.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-xs">
            <div className="font-semibold text-red-900 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Red flags — escalate / refer urgently
            </div>
            <ul className="mt-1 list-disc pl-5 text-red-900 space-y-0.5">
              {condition.redFlags.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </div>

        {/* Stewardship */}
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs">
          <div className="font-semibold text-emerald-900">Stewardship reminders</div>
          <ul className="mt-1 list-disc pl-5 text-emerald-900 space-y-0.5">
            {condition.stewardship.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">Plain-text summary</summary>
          <pre className="mt-2 whitespace-pre-wrap rounded-md border border-border bg-muted/50 p-3 font-mono text-[11px]">
{summary}
          </pre>
        </details>
      </section>
    </div>
  );
}
