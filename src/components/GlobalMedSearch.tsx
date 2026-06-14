import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Pill, X, FileText, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { RENAL_DATA } from "@/calculators/diabetes/RenalDosing";
import { ANTIBIOTICS_DATA } from "@/calculators/diabetes/antibiotics-data";
import { ANTICOAGULANTS_DATA } from "@/calculators/diabetes/anticoagulants-data";
import { ADDITIONAL_MEDS_DATA } from "@/calculators/diabetes/additional-meds-data";

const ALL_MEDS = [
  ...RENAL_DATA,
  ...ANTIBIOTICS_DATA,
  ...ANTICOAGULANTS_DATA,
  ...ADDITIONAL_MEDS_DATA,
];

// Clinical topics and conditions that can be searched
const CLINICAL_TOPICS = [
  // Hypertension / Secondary causes
  { id: "reninoma", label: "Reninoma (JG Cell Tumor)", path: "/hypertension/secondary-htn", keywords: ["reninoma", "juxtaglomerular", "renal vein renin", "high renin hypertension", "secondary hypertension"] },
  { id: "primary-aldosteronism", label: "Primary Aldosteronism", path: "/hypertension/secondary-htn", keywords: ["aldosteronism", "conn syndrome", "arr", "aldosterone renin ratio", "hypokalemia", "adrenal"] },
  { id: "pheochromocytoma", label: "Pheochromocytoma", path: "/hypertension/secondary-htn", keywords: ["pheochromocytoma", "metanephrines", "catecholamine", "adrenal tumor"] },
  { id: "cushings", label: "Cushing's Syndrome", path: "/hypertension/secondary-htn", keywords: ["cushing", "cortisol", "dexamethasone suppression", " ACTH", "pituitary adrenal"] },
  { id: "sleep-apnea", label: "Sleep Apnea Screening", path: "/hypertension/secondary-htn", keywords: ["sleep apnea", "osa", "polysomnography", "cpap", "snoring"] },
  { id: "renal-artery-stenosis", label: "Renal Artery Stenosis", path: "/hypertension/secondary-htn", keywords: ["renal artery stenosis", "ras", "fibromuscular dysplasia", "atherosclerotic"] },
  { id: "secondary-htn", label: "Secondary Hypertension", path: "/hypertension/secondary-htn", keywords: ["secondary hypertension", "secondary cause", "endocrine hypertension"] },
  // Thyroid
  { id: "hypothyroidism", label: "Hypothyroidism", path: "/thyroid", keywords: ["hypothyroidism", "low t4", "high tsh", "thyroid deficiency"] },
  { id: "hyperthyroidism", label: "Hyperthyroidism", path: "/thyroid", keywords: ["hyperthyroidism", "thyrotoxicosis", "high t4", "low tsh", "graves"] },
  { id: "thyroid-nodules", label: "Thyroid Nodules", path: "/thyroid", keywords: ["thyroid nodule", "fna", "thyroid ultrasound", "tirads"] },
  // Diabetes
  { id: "type1-dm", label: "Type 1 Diabetes", path: "/diabetes/type1", keywords: ["type 1 diabetes", "t1dm", "insulin dependent", "autoimmune diabetes"] },
  { id: "type2-dm", label: "Type 2 Diabetes", path: "/diabetes", keywords: ["type 2 diabetes", "t2dm", "insulin resistance", "metformin"] },
  { id: " gestational-diabetes", label: "Gestational Diabetes", path: "/diabetes", keywords: ["gestational diabetes", "gdm", "pregnancy diabetes"] },
  { id: "dka", label: "DKA (Diabetic Ketoacidosis)", path: "/diabetes", keywords: [" dka", "diabetic ketoacidosis", "ketoacidosis", "diabetes emergency"] },
  { id: "hhs", label: "HHS (Hyperosmolar Hyperglycemic State)", path: "/diabetes", keywords: ["hhs", "hyperosmolar", "hyperglycemic coma", "non-ketotic"] },
  // Anemia
  { id: "iron-deficiency-anemia", label: "Iron Deficiency Anemia", path: "/anemia", keywords: ["iron deficiency", "microcytic anemia", "ferritin", "tsat", "iron studies"] },
  { id: "b12-deficiency", label: "Vitamin B12 Deficiency", path: "/anemia", keywords: ["b12 deficiency", "cobalamin", "megaloblastic", "pernicious anemia"] },
  { id: "folate-deficiency", label: "Folate Deficiency", path: "/anemia", keywords: ["folate deficiency", "folic acid", "megaloblastic anemia"] },
  { id: "anemia-chronic-disease", label: "Anemia of Chronic Disease", path: "/anemia", keywords: ["anemia chronic disease", "anemia inflammation", "normocytic anemia"] },
  // Lipids
  { id: "statins", label: "Statin Therapy", path: "/lipids", keywords: ["statins", "atorvastatin", "rosuvastatin", "simvastatin", "cholesterol"] },
  { id: "familial-hypercholesterolemia", label: "Familial Hypercholesterolemia", path: "/lipids", keywords: ["familial hypercholesterolemia", "fh", "ldl", "atherosclerosis"] },
  // Obesity
  { id: "obesity", label: "Obesity Management", path: "/obesity/bmi-calculator", keywords: ["obesity", "bmi", "weight loss", "overweight"] },
  { id: "glp1-agonists", label: "GLP-1 Agonists", path: "/obesity/glp1-obesity", keywords: ["glp1", "semaglutide", "tirzepatide", "wegovy", "ozempic", "weight loss"] },
  // Renal
  { id: "ckd", label: "CKD (Chronic Kidney Disease)", path: "/hypertension/gfr", keywords: ["ckd", "chronic kidney disease", "renal failure", "esrd"] },
  { id: "aki", label: "AKI (Acute Kidney Injury)", path: "/hypertension/gfr", keywords: ["aki", "acute kidney injury", " renal failure", "creatinine rise"] },
  // Other conditions
  { id: "copd", label: "COPD Assessment", path: "/respiratory/copd", keywords: ["copd", "gold", "emphysema", "chronic bronchitis"] },
  { id: "anemia-evaluator", label: "Anemia Workup", path: "/anemia", keywords: ["anemia", "hemoglobin", "mcv", "anemia evaluation"] },
];

export function GlobalMedSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];

    // Search both medications and clinical topics
    const medResults = ALL_MEDS
      .filter(
        (m) =>
          m.drug.toLowerCase().includes(term) ||
          m.drugClass.toLowerCase().includes(term)
      )
      .slice(0, 5)
      .map(m => ({ type: 'medication' as const, ...m }));

    const topicResults = CLINICAL_TOPICS
      .filter(
        (t) =>
          t.label.toLowerCase().includes(term) ||
          t.keywords?.some(k => k.includes(term))
      )
      .slice(0, 5)
      .map(t => ({ type: 'topic' as const, ...t }));

    // Interleave results: medications first, then topics
    return [...medResults, ...topicResults].slice(0, 8);
  }, [q]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        wrapRef.current?.querySelector("input")?.focus();
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function goToDrug(drug: string) {
    setOpen(false);
    setQ("");
    navigate(`/renal-dosing?q=${encodeURIComponent(drug)}`);
  }

  return (
    <div
      ref={wrapRef}
      className="fixed top-3 right-4 z-[60] w-[min(92vw,400px)] md:w-80"
    >
      <div
        className={cn(
          "relative flex items-center gap-2 rounded-full border bg-card/95 backdrop-blur-md shadow-lg transition-all",
          open ? "border-primary/50 ring-2 ring-primary/20" : "border-border"
        )}
      >
        <Search className="ml-3 h-4 w-4 text-primary shrink-0" />
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search any topic — reninoma, hypothyroidism, medications…"
          className="flex-1 bg-transparent py-2 pr-2 text-sm placeholder:text-muted-foreground focus:outline-none"
          aria-label="Search medications"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setOpen(false);
            }}
            className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <kbd className="mr-3 hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {open && q.trim() && (
        <div className="mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-border bg-card/98 backdrop-blur-md shadow-xl">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No medications or topics found for "{q}".
            </div>
          ) : (
            <ul className="py-1">
              {results.map((item, idx) => (
                <li key={item.type === 'medication' ? `${item.drug}-${item.drugClass}` : item.id}>
                  {item.type === 'medication' ? (
                    <button
                      type="button"
                      onClick={() => goToDrug(item.drug)}
                      className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors"
                    >
                      <Pill className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {item.drug}
                          </span>
                          <span className="text-xs uppercase tracking-wide text-muted-foreground shrink-0">
                            {item.drugClass}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          Normal: {item.normalDose}
                        </div>
                        {item.hepatic && (
                          <div className="text-xs text-accent mt-0.5 line-clamp-1">
                            Hepatic: {item.hepatic}
                          </div>
                        )}
                      </div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setQ("");
                        navigate(item.path);
                      }}
                      className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors"
                    >
                      <FileText className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {item.label}
                          </span>
                          <span className="text-xs uppercase tracking-wide text-blue-500 shrink-0">
                            Topic
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.keywords?.slice(0, 3).join(", ")}
                        </div>
                      </div>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
            <kbd className="rounded bg-muted px-1">↵</kbd> to open • Medications or clinical topics
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalMedSearch;
