import { useState } from 'react';
import type { DiscriminantResult, EvaluationResult } from '../types';
import { FlaskConical, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface Props {
  results: DiscriminantResult[];
  idaCount: number;
  thalCount: number;
  consensus: EvaluationResult['consensus'];
}

const consensusConfig = {
  IDA:          { bg: 'bg-rose-900/30',    border: 'border-rose-800',    text: 'text-rose-400',    label: 'Iron Deficiency Anemia (IDA) likely' },
  Thalassemia:  { bg: 'bg-sky-900/30',     border: 'border-sky-800',     text: 'text-sky-400',     label: 'Thalassemia trait likely' },
  Inconclusive: { bg: 'bg-amber-900/30',   border: 'border-amber-800',   text: 'text-amber-400',   label: 'Inconclusive — further workup needed' },
  'N/A':        { bg: 'bg-white/30',    border: 'border-border',    text: 'text-muted-foreground',    label: 'Not applicable' },
};

export default function DiscriminantTable({ results, idaCount, thalCount, consensus }: Props) {
  const [expanded, setExpanded] = useState(true);
  const total = idaCount + thalCount;
  const cc = consensusConfig[consensus];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-foreground">Discriminant Indices</h2>
          <span className="text-xs bg-sky-900/30 text-sky-400 px-2 py-0.5 rounded-full font-medium border border-sky-800">
            IDA vs Thalassemia
          </span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          {results.length === 0 ? (
            <div className="flex items-start gap-3 bg-gray-100/50 rounded-xl p-4 text-sm text-muted-foreground border border-border">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
              <div>
                Discriminant indices apply to <strong className="text-muted-foreground">microcytic anemia (MCV &lt; 80 fL)</strong>.
                Provide Hemoglobin, RBC, MCV, MCH, and RDW to enable this analysis.
              </div>
            </div>
          ) : (
            <>
              {/* Consensus banner */}
              <div className={`rounded-xl p-4 border mb-5 ${cc.bg} ${cc.border}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className={`font-semibold text-sm ${cc.text}`}>Consensus: {consensus}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{cc.label}</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-rose-400">{idaCount}</div>
                      <div className="text-xs text-muted-foreground">IDA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-sky-400">{thalCount}</div>
                      <div className="text-xs text-muted-foreground">Thal.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-muted-foreground">{total}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>
                {total > 0 && (
                  <div className="mt-3">
                    <div className="h-2 rounded-full bg-gray-700 overflow-hidden flex">
                      <div
                        className="h-full bg-rose-500 transition-all"
                        style={{ width: `${(idaCount / total) * 100}%` }}
                      />
                      <div
                        className="h-full bg-sky-500 transition-all"
                        style={{ width: `${(thalCount / total) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>IDA ({Math.round((idaCount / total) * 100)}%)</span>
                      <span>Thalassemia ({Math.round((thalCount / total) * 100)}%)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Results table */}
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Index</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Formula</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Value</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Cutoff</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Result</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr
                        key={r.name}
                        className={`border-b border-border hover:bg-gray-100/50 transition-colors ${i % 2 === 0 ? '' : 'bg-white'}`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-foreground text-xs leading-tight">{r.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 md:hidden">{r.formula}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{r.direction}</div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-xs hidden md:table-cell">{r.formula}</td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-foreground">
                          {r.value !== null ? r.value.toFixed(2) : '—'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-muted-foreground">{r.cutoff}</td>
                        <td className="py-3 px-4 text-center">
                          {r.interpretation === 'N/A' ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-muted-foreground border border-border">—</span>
                          ) : r.interpretation === 'IDA' ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-900/30 text-rose-400 border border-rose-800">IDA</span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-900/30 text-sky-400 border border-sky-800">Thalassemia</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground hidden lg:table-cell">{r.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-xs text-muted-foreground bg-amber-900/20 border border-amber-800/50 rounded-lg px-3 py-2">
                <strong className="text-amber-400">Clinical note:</strong> These indices differentiate iron deficiency anemia from thalassemia trait in microcytic anemia. Confirmatory testing (serum ferritin, hemoglobin electrophoresis, genetic testing) is required for definitive diagnosis.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
