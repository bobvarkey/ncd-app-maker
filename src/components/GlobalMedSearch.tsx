import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Pill, X } from "lucide-react";
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

export function GlobalMedSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return ALL_MEDS
      .filter(
        (m) =>
          m.drug.toLowerCase().includes(term) ||
          m.drugClass.toLowerCase().includes(term)
      )
      .slice(0, 8);
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
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-[min(92vw,560px)]"
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
          placeholder="Search any medication — dose, renal & hepatic adjustments…"
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
        <kbd className="mr-3 hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {open && q.trim() && (
        <div className="mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-border bg-card/98 backdrop-blur-md shadow-xl">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No medications found for “{q}”.
            </div>
          ) : (
            <ul className="py-1">
              {results.map((m) => (
                <li key={`${m.drug}-${m.drugClass}`}>
                  <button
                    type="button"
                    onClick={() => goToDrug(m.drug)}
                    className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors"
                  >
                    <Pill className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold text-sm text-foreground truncate">
                          {m.drug}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground shrink-0">
                          {m.drugClass}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        Normal: {m.normalDose}
                      </div>
                      {m.hepatic && (
                        <div className="text-[11px] text-accent mt-0.5 line-clamp-1">
                          Hepatic: {m.hepatic}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
            Press <kbd className="rounded bg-muted px-1">↵</kbd> or click a drug to open full renal &amp; hepatic adjustments.
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalMedSearch;
