import { useState } from 'react';
import { Timer, TrendingUp, TrendingDown, Activity, Info, ChevronDown, ChevronUp, AlertTriangle, FlaskConical, ClipboardList, Stethoscope, ArrowRight } from 'lucide-react';

interface ESRRange {
  group: string;
  age: string;
  range: string;
  max: number;
}

const NORMAL_RANGES: ESRRange[] = [
  { group: 'Male', age: '< 50 years', range: '< 15 mm/hr', max: 15 },
  { group: 'Male', age: '> 50 years', range: '< 20 mm/hr', max: 20 },
  { group: 'Female', age: '< 50 years', range: '< 20 mm/hr', max: 20 },
  { group: 'Female', age: '> 50 years', range: '< 30 mm/hr', max: 30 },
];

const ELEVATED_CAUSES = {
  infection: ['Pneumonia', 'UTIs', 'Sepsis'],
  inflammation: ['Rheumatoid arthritis', 'Lupus', 'Vasculitis'],
  cancer: ['Lymphoma', 'Multiple myeloma', 'Metastatic cancers'],
  other: ['Anemia', 'Pregnancy', 'Kidney disease', 'Heart disease', 'Trauma', 'Preeclampsia'],
};

const LOW_CAUSES = [
  'Polycythemia',
  'Sickle cell disease',
  'Spherocytosis',
  'Low protein levels',
  'Leukemia',
  'Congestive heart failure',
];

export default function ESRInterpretation() {
  const [esrValue, setEsrValue] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [showRanges, setShowRanges] = useState(true);

  const esrNum = parseFloat(esrValue);
  const ageNum = parseFloat(age);

  function getNormalMax(): number | null {
    if (!sex) return null;
    if (sex === 'male') return ageNum >= 50 ? 20 : 15;
    return ageNum >= 50 ? 30 : 20;
  }

  const normalMax = getNormalMax();
  let interpretation: 'normal' | 'high' | 'low' | null = null;
  if (!isNaN(esrNum) && normalMax !== null) {
    if (esrNum < 1) interpretation = 'low';
    else if (esrNum <= normalMax) interpretation = 'normal';
    else interpretation = 'high';
  }

  return (
    <div className="space-y-6">
      {/* Header / Definition */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-200">
              <Timer className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">ESR Interpretation</h2>
              <p className="text-xs text-muted-foreground">Erythrocyte Sedimentation Rate</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground leading-relaxed">
                  <strong>ESR</strong> is a measure of how fast red blood cells settle in a tube over one hour.
                  Standard methods include <strong>Westergren</strong> or <strong>Wintrobe</strong>.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Slow settling = normal RBC sedimentation. Fast settling = elevated ESR.
                </p>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">ESR Value</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={esrValue}
                  onChange={(e) => setEsrValue(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">mm/hr</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Sex</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSex('male')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    sex === 'male'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-white text-foreground border-border hover:border-gray-400'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setSex('female')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    sex === 'female'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-white text-foreground border-border hover:border-gray-400'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          {/* Interpretation result */}
          {interpretation && (
            <div
              className={`rounded-xl border p-4 flex items-center gap-3 ${
                interpretation === 'normal'
                  ? 'bg-emerald-50 border-emerald-200'
                  : interpretation === 'high'
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              {interpretation === 'normal' && <Activity className="w-5 h-5 text-emerald-600" />}
              {interpretation === 'high' && <TrendingUp className="w-5 h-5 text-rose-600" />}
              {interpretation === 'low' && <TrendingDown className="w-5 h-5 text-amber-600" />}
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {interpretation === 'normal' && 'ESR within normal range'}
                  {interpretation === 'high' && `Elevated ESR (> ${normalMax} mm/hr for ${sex}, age ${ageNum}+)`}
                  {interpretation === 'low' && 'Low ESR (< 1 mm/hr)'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {interpretation === 'normal' && 'No acute inflammatory process suggested by ESR alone.'}
                  {interpretation === 'high' && 'Consider infection, inflammation, malignancy, or other causes below.'}
                  {interpretation === 'low' && 'Consider polycythemia, sickle cell disease, low protein, CHF, or leukemia.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Normal Ranges */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <button
          onClick={() => setShowRanges(!showRanges)}
          className="w-full p-6 flex items-center justify-between border-b border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center border border-sky-200">
              <Activity className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-foreground">Normal ESR Ranges</h3>
              <p className="text-xs text-muted-foreground">Age and sex-specific reference values</p>
            </div>
          </div>
          {showRanges ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </button>

        {showRanges && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Group</th>
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Age</th>
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Upper Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {NORMAL_RANGES.map((r, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2 px-3 text-muted-foreground">{r.group}</td>
                      <td className="py-2 px-3 text-muted-foreground">{r.age}</td>
                      <td className="py-2 px-3 font-medium text-foreground">{r.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Higher values in females and older adults reflect physiological differences in plasma proteins and hematocrit.
            </p>
          </div>
        )}
      </div>

      {/* Elevated ESR Causes */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-200">
              <TrendingUp className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Causes of Elevated ESR</h3>
              <p className="text-xs text-muted-foreground">Common and important differentials</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {Object.entries(ELEVATED_CAUSES).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground capitalize mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-foreground border border-border"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low ESR Causes */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-200">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Causes of Low ESR</h3>
              <p className="text-xs text-muted-foreground">Less common but clinically significant</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {LOW_CAUSES.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-foreground border border-border"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Low ESR usually reflects altered red-cell morphology (e.g., sickled or spherocytic cells) or reduced plasma fibrinogen.
          </p>
        </div>
      </div>
    </div>
  );
}
