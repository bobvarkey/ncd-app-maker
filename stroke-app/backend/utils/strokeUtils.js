/**
 * Stroke Clinical Decision Support — Core Utilities
 * Backend version (Node.js)
 * 
 * AHA/ASA 2025 Guidelines based.
 * All BP thresholds use AHA-recommended values.
 * All doses use weight in kg.
 */

/**
 * Standard tPA (alteplase) eligibility — 0-4.5 hour window
 * AHA/ASA 2025: BP >185/110 requires treatment before tPA
 */
function checkTPAEligibility(onsetMinutes, nihss, systolicBP, diastolicBP, weightKg, glucose) {
  const onsetHours = onsetMinutes / 60;
  const exclusions = [];
  let eligible = true;

  // ─── TIME WINDOW ───
  if (onsetMinutes < 0) {
    eligible = false;
    exclusions.push('Onset time cannot be negative');
  } else if (onsetHours > 4.5) {
    eligible = false;
    exclusions.push('Outside standard tPA window (>4.5h from onset)');
  }

  // ─── BP THRESHOLD ─── FIXED: AHA 2025 = >185/110 ───
  if (systolicBP > 185) {
    eligible = false;
    exclusions.push('Systolic BP >185 mmHg — requires BP management before tPA');
  }
  if (diastolicBP > 110) {
    eligible = false;
    exclusions.push('Diastolic BP >110 mmHg — requires BP management before tPA');
  }

  // ─── NIHSS ───
  if (nihss > 42) {
    eligible = false;
    exclusions.push('NIHSS score >42 is invalid');
  }

  // ─── GLUCOSE ───
  if (glucose < 50) {
    eligible = false;
    exclusions.push('Glucose <50 mg/dL —hypoglycemia must be corrected');
  }

  // ─── WEIGHT ───
  if (weightKg <= 0 || weightKg > 500) {
    eligible = false;
    exclusions.push('Invalid weight — must be in kg');
  }

  // ─── STANDARD tPA DOSE (0.9 mg/kg, max 90 mg) ───
  const alteplaseDose = Math.min(weightKg * 0.9, 90);
  const bolus = +(alteplaseDose * 0.1).toFixed(1);   // 10% bolus
  const infusion = +(alteplaseDose - bolus).toFixed(1); // 90% infusion over 60 min

  // ─── BP MANAGEMENT TARGETS ───
  // Labetalol: 10mg IVP, repeat q10min or 10-20mg/h IV infusion
  // Nicardipine: 5mg/h IV, titrate to target
  // Clevidipine: 1-2 mg/h, titrate
  // Target: maintain BP ≤185/110 before tPA, ≤180/105 during/after
  const bpManagement = {
    targetPreTPA: '≤185/110 mmHg',
    targetDuring: '≤180/105 mmHg',
    agents: [
      { drug: 'Labetalol', dose: '10mg IVP, repeat q10min PRN, or 10-20mg/h IV infusion', notes: 'Avoid in severe bradycardia, asthma' },
      { drug: 'Nicardipine', dose: '5mg/h IV, titrate q5min (max 15mg/h)', notes: 'Preferred in most guidelines' },
      { drug: 'Clevidipine', dose: '1-2 mg/h IV, double q5min to effect', notes: 'Ultra-short acting, easy titration' },
    ]
  };

  return {
    eligible,
    window: onsetHours <= 4.5 ? 'Standard (0-4.5h)' : 'Outside window',
    onsetHours: +onsetHours.toFixed(2),
    alteplaseDose: {
      total: +alteplaseDose.toFixed(1),
      bolusMG: bolus,
      infusionMG: infusion,
      infusionML: +(infusion / 10).toFixed(1),  // 1 mg/mL concentration
      infusionMinutes: 60,
      maxDoseMG: 90,
      protocol: '0.9 mg/kg IV (10% bolus, 90% infusion over 60 min)',
    },
    exclusions,
    bpManagement,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Extended tPA window (wake-up stroke, 4.5-9h) — requires CTP/MRI
 */
function checkTPAExtended(onsetMinutes, nihss, systolicBP, diastolicBP, glucose, weightKg, hasCTP, hasMRI) {
  const onsetHours = onsetMinutes / 60;
  const result = checkTPAEligibility(onsetMinutes, nihss, systolicBP, diastolicBP, weightKg, glucose);
  
  // Override window assessment
  if (onsetHours > 4.5 && onsetHours <= 9) {
    if (!hasCTP && !hasMRI) {
      result.eligible = false;
      result.exclusions.push('Extended window requires CTP or MRI — cannot give tPA without perfusion imaging');
    } else {
      result.window = 'Extended (4.5-9h) — requires imaging confirmation';
      result.imagingRequired = true;
    }
  } else if (onsetHours > 9) {
    result.eligible = false;
    result.exclusions.push('tPA window >9 hours — no current evidence support');
  }

  return result;
}

/**
 * EVT eligibility — AHA/ASA 2025 (DAWN/DEFUSE-3 based)
 * BP: >185/110 requires treatment before EVT
 */
function checkEVTEligibility(data) {
  const {
    onsetHours,
    age,
    nihss,
    systolicBP,
    diastolicBP,
    hasCTA,
    hasLVO,
    aspects,
    coreVolume,
    penumbraVolume,
    mismatchRatio,
    imagingHours,
  } = data;

  const exclusions = [];
  let eligible = true;

  // ─── TIME WINDOW ───
  if (onsetHours < 0) {
    eligible = false;
    exclusions.push('Onset time cannot be negative');
  } else if (onsetHours > 24) {
    // Some patients up to 24h with collateral imaging
    eligible = false;
    exclusions.push('Outside EVT window (>24h from onset)');
  }

  // ─── CTA REQUIRED ───
  if (!hasCTA) {
    eligible = false;
    exclusions.push('CTA is required to evaluate for LVO before EVT');
  }

  // ─── BP THRESHOLD ─── FIXED: >185/110 for EVT ───
  if (systolicBP > 185) {
    eligible = false;
    exclusions.push('Systolic BP >185 mmHg — requires BP management before EVT');
  }
  if (diastolicBP > 110) {
    eligible = false;
    exclusions.push('Diastolic BP >110 mmHg — requires BP management before EVT');
  }

  // ─── DAWN CRITERIA (6-24h) ───
  const inDawnWindow = onsetHours > 6 && onsetHours <= 24;
  if (inDawnWindow && age >= 18 && nihss >= 6) {
    if (coreVolume <= 30 && mismatchRatio >= 1.8) {
      eligible = true;
      exclusions.length = 0; // Clear exclusions — meets DAWN
      return {
        eligible: true,
        criteria: 'DAWN (6-24h with CTP: age≥18, NIHSS≥6, core≤30mL, mismatch≥1.8)',
        window: 'DAWN eligible',
        coreVolume,
        mismatchRatio,
        recommendations: ['Proceed to thrombectomy', 'Notify neurointerventional team'],
        exclusions: [],
      };
    } else if (!coreVolume || !mismatchRatio) {
      // Need CTP to apply DAWN
      eligible = false;
      exclusions.push('DAWN criteria require CTP: core volume and mismatch ratio must be documented');
    }
  }

  // ─── DEFUSE-3 CRITERIA (6-16h) ───
  const inDefuseWindow = onsetHours >= 6 && onsetHours <= 16;
  if (inDefuseWindow && coreVolume <= 70 && mismatchRatio >= 1.8) {
    eligible = true;
    exclusions.length = 0;
    return {
      eligible: true,
      criteria: 'DEFUSE-3 (6-16h with CTP: core≤70mL, mismatch≥1.8)',
      window: 'DEFUSE-3 eligible',
      coreVolume,
      mismatchRatio,
      recommendations: ['Proceed to thrombectomy', 'Notify neurointerventional team'],
      exclusions: [],
    };
  }

  // ─── STANDARD WINDOW (0-6h) ───
  if (onsetHours <= 6 && hasLVO) {
    eligible = true;
    exclusions.length = 0;
    return {
      eligible: true,
      criteria: 'Standard EVT (0-6h for LVO)',
      window: 'Standard window',
      recommendations: ['Proceed to thrombectomy', 'Notify neurointerventional team'],
      exclusions: [],
    };
  }

  // ─── ASPECTS ───
  if (aspects != null && aspects < 6) {
    eligible = false;
    exclusions.push(`ASPECTS <6 — poor prognosis for EVT, proceed with caution`);
  }

  return {
    eligible,
    window: onsetHours <= 6 ? 'Standard (0-6h)' : onsetHours <= 16 ? 'DEFUSE-3 window' : onsetHours <= 24 ? 'DAWN window' : 'Outside window',
    onsetHours: +((onsetHours || 0)).toFixed(2),
    criteria: eligible ? 'Meets criteria' : 'Does not meet current criteria',
    exclusions,
    bpManagement: {
      target: '≤185/110 mmHg before procedure',
      agents: ['Labetalol 10mg IVP', 'Nicardipine 5mg/h IV'],
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * CTA Collateral grading (Tan, Maas, ASITN/SIR, Multiphase)
 */
function gradeCollateral(collateralGrade, gradeType = 'Tan') {
  const grades = {
    Tan: [
      { grade: 0, description: 'No collateral vessels visible', reperfusionRate: '<10%', outcome: 'Very poor' },
      { grade: 1, description: 'Collateral filling >0 but ≤50% of the occluded territory', reperfusionRate: '10-25%', outcome: 'Poor' },
      { grade: 2, description: 'Collateral filling >50% but <100% of the occluded territory', reperfusionRate: '50-75%', outcome: 'Moderate' },
      { grade: 3, description: '100% collateral filling of the occluded territory', reperfusionRate: '>90%', outcome: 'Good' },
    ],
    Maas: [
      { grade: 0, description: 'Not visible', reperfusionRate: '<10%', outcome: 'Very poor' },
      { grade: 1, description: '<50% of the territory', reperfusionRate: '10-25%', outcome: 'Poor' },
      { grade: 2, description: '50-99% of the territory', reperfusionRate: '50-75%', outcome: 'Moderate' },
      { grade: 3, description: '100% collateral filling', reperfusionRate: '>90%', outcome: 'Good' },
      { grade: 4, description: 'Late-filling collateral vessels', reperfusionRate: 'Variable', outcome: 'Variable' },
    ],
    'ASITN/SIR': [
      { grade: 0, description: 'No collateral flow', reperfusionRate: '<10%', outcome: 'Very poor' },
      { grade: 1, description: 'Slow collateral filling, none to ischemic territory', reperfusionRate: '10-25%', outcome: 'Poor' },
      { grade: 2, description: 'Partial collateral filling of ischemic territory', reperfusionRate: '50-75%', outcome: 'Moderate' },
      { grade: 3, description: 'Slow but complete collateral filling of ischemic territory', reperfusionRate: '>90%', outcome: 'Good' },
      { grade: 4, description: '100% collateral flow with some/slow washout', reperfusionRate: '>95%', outcome: 'Excellent' },
    ],
  };

  const scale = grades[gradeType] || grades.Tan;
  return {
    scale: gradeType,
    grade,
    ...(scale.find(g => g.grade === collateralGrade) || {}),
  };
}

/**
 * CTP Penumbra calculation
 */
function calculatePenumbra(coreMl, penumbraMl) {
  if (coreMl == null || penumbraMl == null) return null;
  const mismatch = penumbraMl - coreMl;
  const ratio = penumbraMl > 0 ? penumbraMl / coreMl : 0;

  return {
    coreVolumeML: coreMl,
    penumbraVolumeML: penumbraMl,
    mismatchVolumeML: Math.max(0, mismatch),
    mismatchRatio: +ratio.toFixed(2),
    interpretation: ratio >= 1.8 && coreMl <= 70
      ? 'Favorable imaging profile — consider extended-window EVT'
      : ratio < 1.8
        ? 'Insufficient mismatch ratio'
        : coreMl > 70
          ? 'Large core — careful risk-benefit analysis needed'
          : 'Favorable',
  };
}

/**
 * Management pathway based on assessment
 */
function getManagementPathway(assessment) {
  const { eligible, eligibleEVT, diagnosis } = assessment;
  const pathway = {
    immediate: [],
    tPA: null,
    EVT: null,
    monitoring: [],
    disposition: '',
  };

  // ─── IMMEDIATE ───
  pathway.immediate.push(
    'Establish IV access ×2',
    'Continuous cardiac monitoring + pulse oximetry',
    'STAT non-contrast cranial CT',
    'STAT CTA (intracranial + cervical)',
    'Point-of-care glucose',
    'Blood for CBC, CMP, coag panel, troponin, T4, TSH',
    'BP management if >185/110 (labetalol or nicardipine)',
  );

  // ─── tPA PATHWAY ───
  if (eligible) {
    pathway.tPA = {
      status: 'ELIGIBLE',
      drug: 'Alteplase (tPA)',
      dose: assessment.alteplaseDose,
      bolus: assessment.alteplaseDose ? `${assessment.alteplaseDose.total * 0.1}mg IV push over 1 min` : null,
      infusion: assessment.alteplaseDose ? `${assessment.alteplaseDose.total * 0.9}mg IV over 60 min` : null,
      blood pressure: '≤180/105 mmHg during and for 24h post-tPA',
      antithrombotics: 'No antithrombotics for 24h post-tPA',
    };
  } else if (assessment.exclusions?.length) {
    pathway.tPA = { status: 'NOT ELIGIBLE', reasons: assessment.exclusions };
  }

  // ─── EVT PATHWAY ───
  if (eligibleEVT) {
    pathway.EVT = {
      status: 'ELIGIBLE',
      criteria: assessment.criteria || 'Meets EVT criteria',
      recommendations: ['Notify neurointerventional radiology STAT', 'Prep for thrombectomy', 'Anesthesia consultation'],
    };
  } else if (assessment.exclusions?.length) {
    pathway.EVT = { status: 'NOT ELIGIBLE', reasons: assessment.exclusions };
  }

  // ─── MONITORING ───
  pathway.monitoring.push(
    'NIHSS every 15 min during tPA infusion',
    'BP every 15 min ×2h, then every 30 min ×6h, then hourly ×16h',
    'Neuro checks per unit protocol',
    'Watch for tPA complications: bleeding, angioedema, anaphylaxis',
    'Repeat CT head if neurological deterioration',
  );

  // ─── DISPOSITION ───
  pathway.disposition = eligibleEVT || eligible
    ? 'Stroke unit or Neuro ICU — monitor closely'
    : 'Emergency department observation — reassess in 24h';

  return pathway;
}

/**
 * Run all calculations for an assessment
 */
function calculateAll(assessmentData, weightKg) {
  const tPA = checkTPAEligibility(
    assessmentData.onsetMinutes,
    assessmentData.nihss,
    assessmentData.systolicBP,
    assessmentData.diastolicBP,
    weightKg,
    assessmentData.glucose,
  );

  const EVT = checkEVTEligibility({
    onsetHours: assessmentData.onsetMinutes / 60,
    age: assessmentData.age,
    nihss: assessmentData.nihss,
    systolicBP: assessmentData.systolicBP,
    diastolicBP: assessmentData.diastolicBP,
    hasCTA: assessmentData.hasCTA,
    hasLVO: assessmentData.hasLVO,
    aspects: assessmentData.aspects,
    coreVolume: assessmentData.coreVolume,
    penumbraVolume: assessmentData.penumbraVolume,
    mismatchRatio: assessmentData.mismatchRatio,
    imagingHours: assessmentData.imagingMinutes ? assessmentData.imagingMinutes / 60 : null,
  });

  const pathway = getManagementPathway({ ...tPA, eligibleEVT: EVT.eligible, criteria: EVT.criteria });

  return {
    tPA,
    EVT,
    pathway,
    penumbra: calculatePenumbra(assessmentData.coreVolume, assessmentData.penumbraVolume),
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  checkTPAEligibility,
  checkTPAExtended,
  checkEVTEligibility,
  gradeCollateral,
  calculatePenumbra,
  getManagementPathway,
  calculateAll,
};
