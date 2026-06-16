import type { CBCValues, Sex, AnemiaClassification, DiscriminantResult, EvaluationResult } from '../types';

// WHO 2024 Hgb thresholds in g/dL
const WHO_THRESHOLDS: Record<Sex, { normal: number; mild: number; moderate: number; severe: number }> = {
  male:     { normal: 13.0, mild: 11.0, moderate: 8.0, severe: 0 },
  female:   { normal: 12.0, mild: 11.0, moderate: 8.0, severe: 0 },
  child:    { normal: 11.0, mild: 10.0, moderate: 7.0, severe: 0 },
  pregnant: { normal: 11.0, mild: 10.0, moderate: 7.0, severe: 0 },
};

export function classifyAnemia(hgb: number, mcv: number, sex: Sex): AnemiaClassification {
  const t = WHO_THRESHOLDS[sex];

  let severity: AnemiaClassification['severity'];
  if (hgb >= t.normal) severity = 'None';
  else if (hgb >= t.mild) severity = 'Mild';
  else if (hgb >= t.moderate) severity = 'Moderate';
  else severity = 'Severe';

  let morphology: AnemiaClassification['morphology'] = 'N/A';
  if (!isNaN(mcv)) {
    if (mcv < 80) morphology = 'Microcytic';
    else if (mcv <= 100) morphology = 'Normocytic';
    else morphology = 'Macrocytic';
  }

  return {
    severity,
    morphology,
    hgbThreshold: { mild: t.mild, moderate: t.moderate, severe: t.severe },
  };
}

export function evaluate(cbc: CBCValues, sex: Sex): EvaluationResult {
  const hgb = parseNum(cbc.hgb);
  const mcv = parseNum(cbc.mcv);
  const mch = parseNum(cbc.mch);
  const rbc = parseNum(cbc.rbc);
  const rdw = parseNum(cbc.rdw);

  const missingFields: string[] = [];
  if (isNaN(hgb)) missingFields.push('Hemoglobin');
  if (isNaN(mcv)) missingFields.push('MCV');
  if (isNaN(mch)) missingFields.push('MCH');
  if (isNaN(rbc)) missingFields.push('RBC');
  if (isNaN(rdw)) missingFields.push('RDW');

  const classification = !isNaN(hgb) && !isNaN(mcv)
    ? classifyAnemia(hgb, mcv, sex)
    : { severity: 'N/A' as AnemiaClassification['severity'], morphology: 'N/A' as AnemiaClassification['morphology'], hgbThreshold: { mild: 0, moderate: 0, severe: 0 } };

  // Compute discriminant indices for microcytic anemia — allow partial entry
  let discriminantResults: DiscriminantResult[] = [];
  let idaCount = 0;
  let thalCount = 0;
  let consensus: EvaluationResult['consensus'] = 'N/A';

  if (isMicrocytic && hasAnemia) {
    // Compute each index independently — only those with all required fields
    const results: DiscriminantResult[] = [];

    // Mentzer: MCV / RBC
    if (!isNaN(mcv) && !isNaN(rbc)) {
      const mentzer = mcv / rbc;
      results.push({
        name: 'Mentzer Index',
        formula: 'MCV / RBC',
        value: mentzer,
        cutoff: 13,
        interpretation: mentzer > 13 ? 'IDA' : 'Thalassemia',
        direction: '> 13 → IDA  |  ≤ 13 → Thalassemia',
        reference: 'Mentzer WC, 1973',
      });
    }

    // England-Fraser: MCV − RBC − (5 × Hgb) − 3.4
    if (!isNaN(mcv) && !isNaN(rbc) && !isNaN(hgb)) {
      const ef = mcv - rbc - 5 * hgb - 3.4;
      results.push({
        name: 'England-Fraser Index',
        formula: 'MCV − RBC − (5 × Hgb) − 3.4',
        value: ef,
        cutoff: 0,
        interpretation: ef > 0 ? 'IDA' : 'Thalassemia',
        direction: '> 0 → IDA  |  ≤ 0 → Thalassemia',
        reference: 'England JM & Fraser PM, 1973',
      });
    }

    // Shine-Lal: MCV² × MCH / 100
    if (!isNaN(mcv) && !isNaN(mch)) {
      const sl = (mcv * mcv * mch) / 100;
      results.push({
        name: 'Shine-Lal Index',
        formula: 'MCV² × MCH / 100',
        value: sl,
        cutoff: 1530,
        interpretation: sl > 1530 ? 'IDA' : 'Thalassemia',
        direction: '> 1530 → IDA  |  ≤ 1530 → Thalassemia',
        reference: 'Shine I & Lal S, 1977',
      });
    }

    // Green-King: MCV² × RDW / (Hgb × 100)
    if (!isNaN(mcv) && !isNaN(rdw) && !isNaN(hgb)) {
      const gk = (mcv * mcv * rdw) / (hgb * 100);
      results.push({
        name: 'Green-King Index',
        formula: 'MCV² × RDW / (Hgb × 100)',
        value: gk,
        cutoff: 65,
        interpretation: gk > 65 ? 'IDA' : 'Thalassemia',
        direction: '> 65 → IDA  |  ≤ 65 → Thalassemia',
        reference: 'Green R & King R, 1989',
      });
    }

    // RDW Index (RDWI / Jayabose): MCV × RDW / RBC
    if (!isNaN(mcv) && !isNaN(rdw) && !isNaN(rbc)) {
      const rdwi = (mcv * rdw) / rbc;
      results.push({
        name: 'RDW Index (RDWI / Jayabose)',
        formula: 'MCV × RDW / RBC',
        value: rdwi,
        cutoff: 220,
        interpretation: rdwi > 220 ? 'IDA' : 'Thalassemia',
        direction: '> 220 → IDA  |  ≤ 220 → Thalassemia',
        reference: 'Jayabose S et al., 1999',
      });
    }

    // Srivastava: MCH / RBC
    if (!isNaN(mch) && !isNaN(rbc)) {
      const sri = mch / rbc;
      results.push({
        name: 'Srivastava Index',
        formula: 'MCH / RBC',
        value: sri,
        cutoff: 3.8,
        interpretation: sri > 3.8 ? 'IDA' : 'Thalassemia',
        direction: '> 3.8 → IDA  |  ≤ 3.8 → Thalassemia',
        reference: 'Srivastava PC, 1973',
      });
    }

    // Ricerca: RDW / RBC
    if (!isNaN(rdw) && !isNaN(rbc)) {
      const ric = rdw / rbc;
      results.push({
        name: 'Ricerca Index',
        formula: 'RDW / RBC',
        value: ric,
        cutoff: 4.4,
        interpretation: ric > 4.4 ? 'IDA' : 'Thalassemia',
        direction: '> 4.4 → IDA  |  ≤ 4.4 → Thalassemia',
        reference: 'Ricerca BM et al., 1987',
      });
    }

    // Das Gupta: 1.89 × RBC − 0.33 × RDW − 3.28
    if (!isNaN(rbc) && !isNaN(rdw)) {
      const dg = 1.89 * rbc - 0.33 * rdw - 3.28;
      results.push({
        name: 'Das Gupta Index',
        formula: '1.89 × RBC − 0.33 × RDW − 3.28',
        value: dg,
        cutoff: 0,
        interpretation: dg > 0 ? 'Thalassemia' : 'IDA',
        direction: '< 0 → IDA  |  > 0 → Thalassemia',
        reference: 'Das Gupta A et al., 1994',
      });
    }

    // Bordbar: |80 − MCV| × |27 − MCH|
    if (!isNaN(mcv) && !isNaN(mch)) {
      const bord = Math.abs(80 - mcv) * Math.abs(27 - mch);
      results.push({
        name: 'Bordbar Index',
        formula: '|80 − MCV| × |27 − MCH|',
        value: bord,
        cutoff: 44.76,
        interpretation: bord > 44.76 ? 'IDA' : 'Thalassemia',
        direction: '> 44.76 → IDA  |  ≤ 44.76 → Thalassemia',
        reference: 'Bordbar E et al., 2010',
      });
    }

    discriminantResults = results;
    idaCount = results.filter(r => r.interpretation === 'IDA').length;
    thalCount = results.filter(r => r.interpretation === 'Thalassemia').length;
    const total = idaCount + thalCount;
    if (total === 0) {
      consensus = 'N/A';
    } else if (idaCount / total >= 0.6) {
      consensus = 'IDA';
    } else if (thalCount / total >= 0.6) {
      consensus = 'Thalassemia';
    } else {
      consensus = 'Inconclusive';
    }
  }

  return { classification, discriminantResults, idaCount, thalCount, consensus, missingFields };
}
