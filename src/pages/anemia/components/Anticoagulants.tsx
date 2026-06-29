import { useState } from 'react';
import {
  Pill,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  FlaskConical,
  Stethoscope,
  Syringe,
  HeartPulse,
  BookOpen,
  Scale,
  FileText,
  ImageIcon,
} from 'lucide-react';

const indications = [
  { indication: 'Non-valvular Atrial Fibrillation', preferred_drug: 'DOAC (Apixaban preferred)', duration: 'Lifelong', notes: 'Based on CHA2DS2-VASc score' },
  { indication: 'Mechanical Prosthetic Valves (AVR / MVR)', preferred_drug: 'Warfarin', duration: 'Lifelong', notes: 'DOACs contraindicated' },
  { indication: 'Rheumatic Mitral Stenosis with AF', preferred_drug: 'Warfarin', duration: 'Lifelong', notes: 'Valvular AF' },
  { indication: 'Unprovoked DVT / PE', preferred_drug: 'DOAC', duration: 'Extended / Lifelong', notes: 'If bleeding risk acceptable' },
  { indication: 'Recurrent DVT / PE', preferred_drug: 'DOAC', duration: 'Lifelong', notes: 'Strong indication' },
  { indication: 'Cancer-associated VTE', preferred_drug: 'Apixaban / LMWH', duration: 'While cancer active', notes: 'DOACs now preferred in many cancers' },
  { indication: 'Antiphospholipid Syndrome (Triple positive)', preferred_drug: 'Warfarin', duration: 'Lifelong', notes: 'DOACs generally avoided' },
  { indication: 'Left Ventricular Thrombus (post-MI)', preferred_drug: 'Warfarin / DOAC', duration: '3-6 months', notes: 'Repeat imaging' },
  { indication: 'Severe Inherited Thrombophilia', preferred_drug: 'DOAC / Warfarin', duration: 'Often lifelong', notes: 'Individualized' },
];

const drugComparison = [
  { drug: 'Apixaban', class: 'Factor Xa inhibitor', dose: '5 mg BID', renal: '2.5 mg BID if 2 of: Age ≥80 yr, Wt ≤60 kg, SCr ≥1.5 mg/dL', monitoring: 'No routine monitoring' },
  { drug: 'Rivaroxaban', class: 'Factor Xa inhibitor', dose: '20 mg OD with food', renal: '15 mg OD if CrCl 15–49 mL/min', monitoring: 'No routine monitoring' },
  { drug: 'Dabigatran', class: 'Direct thrombin inhibitor', dose: '150 mg BID', renal: 'Avoid if CrCl <30 mL/min', monitoring: 'No routine monitoring' },
  { drug: 'Edoxaban', class: 'Factor Xa inhibitor', dose: '60 mg OD', renal: '30 mg OD if CrCl 15–50 mL/min or wt ≤60 kg', monitoring: 'No routine monitoring' },
  { drug: 'Warfarin', class: 'Vitamin K antagonist', dose: 'INR guided (2–3 generally)', renal: 'No adjustment', monitoring: 'INR mandatory' },
];

const afDosing = [
  { drug: 'Apixaban', dose: '5 mg BID', notes: '' },
  { drug: 'Apixaban (Reduced)', dose: '2.5 mg BID if 2 of: Age ≥80 yr, Weight ≤60 kg, Serum creatinine ≥1.5 mg/dL', notes: '' },
  { drug: 'Rivaroxaban', dose: '20 mg OD with food (15 mg OD if CrCl 15–49 mL/min)', notes: '' },
  { drug: 'Dabigatran', dose: '150 mg BID (110 mg BID in elderly / high bleeding risk)', notes: '' },
  { drug: 'Edoxaban', dose: '60 mg OD', notes: '' },
  { drug: 'Warfarin', dose: 'INR target 2–3', notes: '' },
];

const dvtPeDosing = {
  initial: [
    { drug: 'Apixaban', dose: '10 mg BID × 7 days' },
    { drug: 'Rivaroxaban', dose: '15 mg BID × 21 days' },
    { drug: 'Dabigatran', dose: 'Heparin for 5–10 days then 150 mg BID' },
    { drug: 'Edoxaban', dose: 'Heparin for 5–10 days then 60 mg OD' },
    { drug: 'Warfarin', dose: 'Heparin overlap (min 5 days)' },
  ],
  maintenance: [
    { drug: 'Apixaban', dose: '5 mg BID' },
    { drug: 'Rivaroxaban', dose: '20 mg OD' },
    { drug: 'Dabigatran', dose: '150 mg BID' },
    { drug: 'Edoxaban', dose: '60 mg OD' },
    { drug: 'Warfarin', dose: 'INR 2–3' },
  ],
  extended: [
    { drug: 'Apixaban', dose: '2.5 mg BID after 6 months' },
    { drug: 'Rivaroxaban', dose: '10 mg OD after 6 months' },
    { drug: 'Dabigatran', dose: '150 mg BID' },
    { drug: 'Edoxaban', dose: '60 mg OD' },
    { drug: 'Warfarin', dose: 'INR 2–3' },
  ],
};

const inrTargets = [
  { condition: 'Atrial Fibrillation', target: '2.0–3.0' },
  { condition: 'DVT / PE', target: '2.0–3.0' },
  { condition: 'Bioprosthetic Valve', target: '2.0–3.0' },
  { condition: 'Mechanical AVR', target: '2.5–3.5' },
  { condition: 'Mechanical AVR + Risk Factors*', target: '3.0–3.5' },
  { condition: 'Mechanical MVR', target: '2.5–3.5' },
  { condition: 'Antiphospholipid Syndrome', target: '2.0–3.0 (sometimes 3.0–4.0)' },
];

const specialSituations = [
  { situation: 'Mechanical valve', drug: 'Warfarin' },
  { situation: 'Rheumatic MS with AF', drug: 'Warfarin' },
  { situation: 'Triple positive APS', drug: 'Warfarin' },
  { situation: 'Active cancer with VTE', drug: 'Apixaban / LMWH' },
  { situation: 'Elderly with high bleeding risk', drug: 'Apixaban' },
  { situation: 'CKD (non-dialysis)', drug: 'Apixaban' },
  { situation: 'Pregnancy', drug: 'LMWH' },
  { situation: 'Breastfeeding', drug: 'Warfarin / LMWH' },
];

const reversalAgents = [
  { drug: 'Warfarin', agent: 'Vitamin K + 4-factor PCC / FFP' },
  { drug: 'Dabigatran', agent: 'Idarucizumab' },
  { drug: 'Apixaban', agent: 'Andexanet alfa' },
  { drug: 'Rivaroxaban', agent: 'Andexanet alfa' },
  { drug: 'Edoxaban', agent: 'Andexanet alfa' },
  { drug: 'Any DOAC (if specific antidote not available)', agent: '4-factor PCC' },
];

const landmarkTrials = [
  { trial: 'RE-LY (2009)', drug: 'Dabigatran', compared: 'Warfarin', population: 'Non-valvular AF', results: '150 mg BID = stroke vs warfarin; similar major bleeding; 110 mg lower bleed', impact: 'First DOAC success in AF' },
  { trial: 'ROCKET-AF (2011)', drug: 'Rivaroxaban', compared: 'Warfarin', population: 'Non-valvular AF', results: 'Non-inferior for stroke/SE', impact: 'Established rivaroxaban in AF' },
  { trial: 'ARISTOTLE (2011)', drug: 'Apixaban', compared: 'Warfarin', population: 'Non-valvular AF', results: '↓ Stroke, ↓ major bleeding, ↓ mortality', impact: 'Apixaban became preferred DOAC' },
  { trial: 'ENGAGE AF-TIMI 48 (2013)', drug: 'Edoxaban', compared: 'Warfarin', population: 'Non-valvular AF', results: 'Non-inferior; lower bleeding with lower dose', impact: 'Edoxaban effective & safe' },
  { trial: 'EINSTEIN-DVT (2010)', drug: 'Rivaroxaban', compared: 'Enoxaparin / Warfarin', population: 'Acute DVT', results: 'Non-inferior for VTE recurrence, similar bleeding', impact: 'Single drug approach validated' },
  { trial: 'EINSTEIN-PE (2012)', drug: 'Rivaroxaban', compared: 'Enoxaparin / Warfarin', population: 'Acute PE', results: 'Non-inferior; no increase in major bleeding', impact: 'Effective for PE treatment' },
  { trial: 'AMPLIFY (2013)', drug: 'Apixaban', compared: 'Conventional therapy', population: 'Acute VTE', results: 'Non-inferior; ↓ major bleeding', impact: 'One of the best VTE trials' },
  { trial: 'AMPLIFY-EXT (2013)', drug: 'Apixaban', compared: 'Placebo', population: 'After 6–12 mo VTE', results: 'Reduced recurrent VTE; no significant increase in major bleeding', impact: 'Supports extended low-dose therapy' },
  { trial: 'RE-MEDY (2013)', drug: 'Dabigatran', compared: 'Warfarin', population: 'VTE (extended)', results: 'Non-inferior for recurrence; similar bleeding', impact: 'Extended therapy effective' },
  { trial: 'RE-ALIGN (2013)', drug: 'Dabigatran', compared: 'Warfarin', population: 'Mechanical valves', results: '↑ Thrombosis & bleeding with dabigatran', impact: 'DOACs contraindicated in mechanical valves' },
];

const pearls = [
  'Best overall DOAC: Apixaban',
  'Best in elderly / CKD: Apixaban',
  'Best in mechanical valve / APS: Warfarin only',
  'DOAC with specific antidote: Dabigatran (Idarucizumab)',
  'Factor Xa inhibitor antidote: Andexanet alfa',
  'Lowest intracranial hemorrhage risk: Apixaban',
  'Highest GI bleed risk among DOACs: Rivaroxaban / Dabigatran',
];

const takeHomeMessages = [
  'AF → Apixaban 5 mg BID is often the default choice',
  'DVT/PE → Apixaban or Rivaroxaban preferred',
  'Mechanical valve or APS → Warfarin only',
  'Unprovoked recurrent VTE → Consider lifelong anticoagulation after bleeding risk assessment',
  'Always balance thrombosis risk against bleeding risk (HAS-BLED, renal function, age, prior hemorrhage)',
];

function CollapsibleSection({ title, icon: Icon, defaultOpen = false, children }: { title: string; icon: any; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">{title}</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 border-t border-border pt-3">{children}</div>}
    </div>
  );
}

function Table({ headers, rows, renderRow }: { headers: string[]; rows: any[]; renderRow: (row: any, i: number) => React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2 px-2 font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-accent/30">
              {renderRow(row, i)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Anticoagulants() {
  const [showInfographic, setShowInfographic] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Pill className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold">Long Term Anticoagulation</h2>
          <p className="text-xs text-muted-foreground">Indications, Drugs, Dosages and Analysis of Papers</p>
        </div>
      </div>

      {/* Infographic */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <button
          onClick={() => setShowInfographic(!showInfographic)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Anticoagulation Cheat Sheet</span>
          </div>
          {showInfographic ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showInfographic && (
          <div className="border-t border-border p-3">
            <img
              src="/images/anticoagulation-reference.jpg"
              alt="Anticoagulation Cheat Sheet"
              className="w-full max-h-[600px] object-contain rounded-lg"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Indications */}
      <CollapsibleSection title="Indications for Long Term Anticoagulation" icon={Stethoscope} defaultOpen>
        <Table
          headers={['Indication', 'Preferred Drug', 'Duration', 'Notes']}
          rows={indications}
          renderRow={(row, i) => (
            <>
              <td className="py-2 px-2 font-medium">{row.indication}</td>
              <td className="py-2 px-2">
                <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-medium">{row.preferred_drug}</span>
              </td>
              <td className="py-2 px-2 text-muted-foreground">{row.duration}</td>
              <td className="py-2 px-2 text-muted-foreground">{row.notes}</td>
            </>
          )}
        />
      </CollapsibleSection>

      {/* Drug Comparison */}
      <CollapsibleSection title="Oral Anticoagulants Comparison" icon={Pill} defaultOpen>
        <Table
          headers={['Drug', 'Class / Mechanism', 'Standard Dose', 'Renal Adjustment', 'Monitoring']}
          rows={drugComparison}
          renderRow={(row, i) => (
            <>
              <td className="py-2 px-2 font-medium whitespace-nowrap">{row.drug}</td>
              <td className="py-2 px-2 text-muted-foreground">{row.class}</td>
              <td className="py-2 px-2">{row.dose}</td>
              <td className="py-2 px-2 text-muted-foreground text-[11px]">{row.renal}</td>
              <td className="py-2 px-2">
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                  row.monitoring === 'No routine monitoring' ? 'bg-green-900/20 text-green-400' : 'bg-amber-900/20 text-amber-400'
                }`}>{row.monitoring}</span>
              </td>
            </>
          )}
        />
      </CollapsibleSection>

      {/* Dosing in AF */}
      <CollapsibleSection title="Dosing in Atrial Fibrillation" icon={HeartPulse}>
        <Table
          headers={['Drug', 'Dose', 'Notes']}
          rows={afDosing}
          renderRow={(row, i) => (
            <>
              <td className="py-2 px-2 font-medium whitespace-nowrap">{row.drug}</td>
              <td className="py-2 px-2">{row.dose}</td>
              <td className="py-2 px-2 text-muted-foreground">{row.notes}</td>
            </>
          )}
        />
      </CollapsibleSection>

      {/* Dosing in DVT/PE */}
      <CollapsibleSection title="Dosing in DVT / PE" icon={Syringe}>
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Initial Phase</h4>
            <Table
              headers={['Drug', 'Dose']}
              rows={dvtPeDosing.initial}
              renderRow={(row, i) => (
                <><td className="py-2 px-2 font-medium">{row.drug}</td><td className="py-2 px-2">{row.dose}</td></>
              )}
            />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Maintenance Phase</h4>
            <Table
              headers={['Drug', 'Dose']}
              rows={dvtPeDosing.maintenance}
              renderRow={(row, i) => (
                <><td className="py-2 px-2 font-medium">{row.drug}</td><td className="py-2 px-2">{row.dose}</td></>
              )}
            />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Extended Therapy (after 6 months)</h4>
            <Table
              headers={['Drug', 'Dose']}
              rows={dvtPeDosing.extended}
              renderRow={(row, i) => (
                <><td className="py-2 px-2 font-medium">{row.drug}</td><td className="py-2 px-2">{row.dose}</td></>
              )}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* INR Targets */}
      <CollapsibleSection title="INR Targets (Warfarin)" icon={Scale}>
        <Table
          headers={['Condition', 'Target INR']}
          rows={inrTargets}
          renderRow={(row, i) => (
            <><td className="py-2 px-2 font-medium">{row.condition}</td><td className="py-2 px-2 font-mono font-bold">{row.target}</td></>
          )}
        />
        <p className="text-[11px] text-muted-foreground mt-2 italic">*Risk factors: AF, prior thromboembolism, LV dysfunction, hypercoagulable state</p>
      </CollapsibleSection>

      {/* Special Clinical Situations */}
      <CollapsibleSection title="Special Clinical Situations" icon={AlertTriangle}>
        <Table
          headers={['Situation', 'Drug of Choice']}
          rows={specialSituations}
          renderRow={(row, i) => (
            <><td className="py-2 px-2 font-medium">{row.situation}</td><td className="py-2 px-2"><span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-medium">{row.drug}</span></td></>
          )}
        />
      </CollapsibleSection>

      {/* Reversal Agents */}
      <CollapsibleSection title="Reversal Agents" icon={FlaskConical}>
        <Table
          headers={['Drug', 'Reversal Agent']}
          rows={reversalAgents}
          renderRow={(row, i) => (
            <><td className="py-2 px-2 font-medium">{row.drug}</td><td className="py-2 px-2"><span className="inline-block bg-red-900/20 text-red-400 px-2 py-0.5 rounded text-[11px] font-medium">{row.agent}</span></td></>
          )}
        />
      </CollapsibleSection>

      {/* Landmark Trials */}
      <CollapsibleSection title="Landmark Trials — Analysis" icon={BookOpen}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground whitespace-nowrap">Trial (Year)</th>
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Drug</th>
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Compared With</th>
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Population</th>
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Key Results</th>
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Clinical Impact</th>
              </tr>
            </thead>
            <tbody>
              {landmarkTrials.map((t, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-accent/30">
                  <td className="py-2 px-2 font-medium whitespace-nowrap">{t.trial}</td>
                  <td className="py-2 px-2">
                    <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-medium">{t.drug}</span>
                  </td>
                  <td className="py-2 px-2 text-muted-foreground">{t.compared}</td>
                  <td className="py-2 px-2 text-muted-foreground">{t.population}</td>
                  <td className="py-2 px-2 text-muted-foreground">{t.results}</td>
                  <td className="py-2 px-2 text-muted-foreground italic">{t.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

      {/* High-Yield Pearls */}
      <CollapsibleSection title="High-Yield Pearls" icon={FileText}>
        <ul className="space-y-1.5">
          {pearls.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-0.5">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Take-Home Messages */}
      <CollapsibleSection title="Practical Take-Home Messages" icon={Stethoscope} defaultOpen>
        <ul className="space-y-1.5">
          {takeHomeMessages.map((m, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-amber-500 mt-0.5">→</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </CollapsibleSection>
    </div>
  );
}
