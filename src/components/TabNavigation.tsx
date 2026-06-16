import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, X, Pill, FileText } from "lucide-react";
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

// Clinical topics for search
const CLINICAL_TOPICS = [
  { id: "reninoma", label: "Reninoma (JG Cell Tumor)", path: "/hypertension/secondary-htn", keywords: ["reninoma", "juxtaglomerular", "renal vein renin", "high renin hypertension"] },
  { id: "primary-aldosteronism", label: "Primary Aldosteronism", path: "/hypertension/secondary-htn", keywords: ["aldosteronism", "conn", "arr", "aldosterone"] },
  { id: "pheochromocytoma", label: "Pheochromocytoma", path: "/hypertension/secondary-htn", keywords: ["pheochromocytoma", "metanephrines", "catecholamine"] },
  { id: "cushings", label: "Cushing's Syndrome", path: "/hypertension/secondary-htn", keywords: ["cushing", "cortisol", "dexamethasone"] },
  { id: "sleep-apnea", label: "Sleep Apnea", path: "/hypertension/secondary-htn", keywords: ["sleep apnea", "osa", "polysomnography"] },
  { id: "hypothyroidism", label: "Hypothyroidism", path: "/thyroid", keywords: ["hypothyroidism", "low t4", "high tsh"] },
  { id: "hyperthyroidism", label: "Hyperthyroidism", path: "/thyroid", keywords: ["hyperthyroidism", "thyrotoxicosis", "graves"] },
  { id: "thyroid-nodules", label: "Thyroid Nodules", path: "/thyroid", keywords: ["thyroid nodule", "fna"] },
  { id: "type1-dm", label: "Type 1 Diabetes", path: "/diabetes/type1", keywords: ["type 1 diabetes", "t1dm"] },
  { id: "type2-dm", label: "Type 2 Diabetes", path: "/diabetes", keywords: ["type 2 diabetes", "t2dm"] },
  { id: "dk", label: "DKA", path: "/diabetes", keywords: [" dka", "diabetic ketoacidosis"] },
  { id: "hhs", label: "HHS", path: "/diabetes", keywords: ["hhs", "hyperosmolar hyperglycemic"] },
  { id: "iron-deficiency", label: "Iron Deficiency Anemia", path: "/anemia", keywords: ["iron deficiency", "microcytic"] },
  { id: "b12-deficiency", label: "B12 Deficiency", path: "/anemia", keywords: ["b12 deficiency", "cobalamin", "megaloblastic"] },
  { id: "statins", label: "Statins", path: "/lipids", keywords: ["statins", "atorvastatin", "cholesterol"] },
  { id: "glp1", label: "GLP-1 Agonists", path: "/obesity/glp1-obesity", keywords: ["glp1", "semaglutide", "wegovy"] },
  { id: "ckd", label: "CKD", path: "/hypertension/gfr", keywords: ["ckd", "chronic kidney disease"] },
  { id: "copd", label: "COPD", path: "/respiratory/copd", keywords: ["copd", "gold", "emphysema"] },
];

const bloodSubItems = [
  { tab: "anemia", label: "Anemia Evaluator", icon: "🔬" },
  { tab: "thrombocytopenia", label: "Thrombocytopenia", icon: "💧" },
  { tab: "bleeding-clotting", label: "Bleeding / Clotting", icon: "🩹" },
  { tab: "iron", label: "Iron Parameters", icon: "💉" },
];

function BloodSubNav() {
  const [searchParams] = useSearchParams();
  const current = searchParams.get("tab") ?? "anemia";
  return (
    <ul className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-border pl-2">
      {bloodSubItems.map((s) => {
        const isActive = current === s.tab;
        return (
          <li key={s.tab}>
            <Link
              to={`/anemia?tab=${s.tab}`}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                isActive
                  ? "bg-sky-500/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-sm leading-none">{s.icon}</span>
              <span className="truncate">{s.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const htnSubItems = [
  { path: "/hypertension/secondary-htn", label: "Secondary HTN", icon: "🔍" },
];

function HtnSubNav() {
  const location = useLocation();
  return (
    <ul className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-border pl-2">
      {htnSubItems.map((s) => {
        const isActive = location.pathname === s.path;
        return (
          <li key={s.path}>
            <Link
              to={s.path}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                isActive
                  ? "bg-warning/100/10 text-warning"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-sm leading-none">{s.icon}</span>
              <span className="truncate">{s.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

type NavItem = {
  path: string;
  label: string;
  icon: string;
  /** Tailwind classes for active state (must be static so JIT picks them up) */
  active: string;
};

const electrolyteSubItems = [
  { path: "/hyponatremia", label: "Hyponatremia", icon: "🧂" },
  { path: "/hypernatremia", label: "Hypernatremia", icon: "🌡️" },
  { path: "/hyperkalemia", label: "Hyperkalemia", icon: "💥" },
  { path: "/hypokalemia", label: "Hypokalemia", icon: "⚡" },
  { path: "/hypocalcemia", label: "Hypocalcemia", icon: "🦴" },
  { path: "/hypercalcemia", label: "Hypercalcemia", icon: "🔥" },
  { path: "/hypomagnesemia", label: "Hypomagnesemia", icon: "🦴" },
  { path: "/hypermagnesemia", label: "Hypermagnesemia", icon: "🪨" },
  { path: "/hypophosphatemia", label: "Hypophosphatemia", icon: "🦷" },
  { path: "/hyperphosphatemia", label: "Hyperphosphatemia", icon: "🪨" },
];

function ElectrolyteSubNav() {
  const location = useLocation();
  return (
    <ul className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-border pl-2">
      {electrolyteSubItems.map((s) => {
        const isActive = location.pathname === s.path;
        return (
          <li key={s.path}>
            <Link
              to={s.path}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                isActive
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-sm leading-none">{s.icon}</span>
              <span className="truncate">{s.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const navItems: NavItem[] = [
  { path: "/home",                    label: "Home",      icon: "🏠", active: "bg-primary/10 text-primary border-primary/30" },
  { path: "/simple",                  label: "Simple",    icon: "⚡", active: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { path: "/moderate",                label: "Moderate",  icon: "🏥", active: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  { path: "/diabetes",                label: "Diabetes",  icon: "💉", active: "bg-destructive/100/10 text-destructive border-red-500/30" },
  { path: "/hypertension",            label: "Hypertension", icon: "❤️", active: "bg-warning/100/10 text-warning border-warning/30" },
  { path: "/lipids",                  label: "Lipids",    icon: "💧", active: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { path: "/liver",                   label: "Liver",     icon: "🧬", active: "bg-lime-500/10 text-lime-400 border-lime-500/30" },
  { path: "/thyroid",                 label: "Thyroid",   icon: "🔬", active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  { path: "/obesity/bmi-calculator",  label: "Obesity",   icon: "⚖️", active: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  { path: "/respiratory",             label: "COPD",      icon: "🫁", active: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  { path: "/renal-dosing",            label: "Renal",     icon: "🫘", active: "bg-warning/100/10 text-warning border-amber-500/30" },
  { path: "/anemia",                  label: "Blood",     icon: "🩸", active: "bg-sky-500/10 text-primary border-sky-500/30" },
  { path: "/fatigue",                label: "Fatigue",   icon: "😴", active: "bg-warning/100/10 text-warning border-amber-500/30" },
  { path: "/infections",             label: "Infections", icon: "🦠", active: "bg-rose-500/10 text-destructive border-rose-500/30" },
  { path: "/pep",                   label: "PEP",       icon: "🛡️", active: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { path: "/electrolytes",          label: "Electrolyte Disturbances", icon: "⚡", active: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
];

export function TabNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  // Search state
  const [searchQ, setSearchQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    const term = searchQ.trim().toLowerCase();
    if (!term) return [];
    const meds = ALL_MEDS
      .filter((m) => m.drug.toLowerCase().includes(term) || m.drugClass.toLowerCase().includes(term))
      .slice(0, 5)
      .map(m => ({ type: 'med' as const, ...m }));
    const topics = CLINICAL_TOPICS
      .filter((t) => t.label.toLowerCase().includes(term) || t.keywords?.some(k => k.includes(term)))
      .slice(0, 5)
      .map(t => ({ type: 'topic' as const, ...t }));
    return [...meds, ...topics].slice(0, 8);
  }, [searchQ]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setCollapsed(false);
      }
      if (e.key === "Escape") setSearchOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.classList.add("has-tab-navigation");
    return () => document.body.classList.remove("has-tab-navigation");
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("tab-navigation-collapsed", collapsed);
    return () => document.body.classList.remove("tab-navigation-collapsed");
  }, [collapsed]);

  // Close search on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function goToDrug(drug: string) {
    setSearchOpen(false);
    setSearchQ("");
    navigate(`/renal-dosing?q=${encodeURIComponent(drug)}`);
  }

  // Medication result item
  const MedResultItem = ({ m }: { m: typeof ALL_MEDS[number] }) => (
    <button
      type="button"
      onClick={() => goToDrug(m.drug)}
      className="w-full flex items-start gap-3 px-3 py-2 text-left hover:bg-muted/60 transition-colors"
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
      </div>
    </button>
  );

  // Clinical topic result item
  const TopicResultItem = ({ t }: { t: typeof CLINICAL_TOPICS[number] }) => {
    const navigate = useNavigate();
    return (
      <button
        type="button"
        onClick={() => { setSearchOpen(false); navigate(t.path); }}
        className="w-full flex items-start gap-3 px-3 py-2 text-left hover:bg-muted/60 transition-colors"
      >
        <FileText className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-semibold text-sm text-foreground truncate">
              {t.label}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-blue-500 shrink-0">
              Topic
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-screen bg-card/95 backdrop-blur-md border-r border-border shadow-sm flex flex-col transition-[width] duration-200",
        collapsed ? "w-14" : "w-56"
      )}
      aria-label="Primary"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-12 px-2 border-b border-border shrink-0">
        {!collapsed && (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition-colors w-full"
          >
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground truncate">Search meds…</span>
          </button>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="mx-auto inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Search panel (inside sidebar when open) */}
      {searchOpen && !collapsed && (
        <div ref={searchRef} className="border-b border-border px-2 py-2">
          <div className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2">
            <Search className="h-3.5 w-3.5 text-primary shrink-0" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Medication or topic name…"
              className="flex-1 bg-transparent py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            {searchQ && (
              <button type="button" onClick={() => { setSearchQ(""); setSearchOpen(false); }} className="shrink-0">
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
          {searchQ && (
            <div className="mt-1 max-h-40 overflow-y-auto">
              {searchResults.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">No medications or topics found.</p>
              ) : (
              <ul className="py-1">
                {searchResults.map((item) => (
                  <li key={item.type === 'med' ? `${item.drug}-${item.drugClass}` : item.id}>
                    {item.type === 'med' ? <MedResultItem m={item} /> : <TopicResultItem t={item} />}
                  </li>
                ))}
              </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating search modal when collapsed */}
      {searchOpen && collapsed && (
        <div className="absolute left-full top-0 ml-1 w-56 rounded-lg border border-border bg-card shadow-xl z-50 p-2" ref={searchRef}>
          <div className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2">
            <Search className="h-3.5 w-3.5 text-primary shrink-0" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search meds, topics…"
              className="flex-1 bg-transparent py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            <button type="button" onClick={() => { setSearchQ(""); setSearchOpen(false); }} className="shrink-0">
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
          {searchQ && (
            <div className="mt-1 max-h-40 overflow-y-auto">
              {searchResults.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">No medications or topics found.</p>
              ) : (
              <ul className="py-1">
                {searchResults.map((item) => (
                  <li key={item.type === 'med' ? `${item.drug}-${item.drugClass}` : item.id}>
                    {item.type === 'med' ? <MedResultItem m={item} /> : <TopicResultItem t={item} />}
                  </li>
                ))}
              </ul>
              )}
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        <ul className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path !== "/home" && currentPath.startsWith(item.path + "/"));
            const isBlood = item.path === "/anemia";
            const isHtn = item.path === "/hypertension";
            const isElectrolyte = item.path === "/electrolytes";
            const showBloodSubs = isBlood && currentPath.startsWith("/anemia") && !collapsed;
            const showHtnSubs = isHtn && currentPath.startsWith("/hypertension") && !collapsed;
            const showElectrolyteSubs = isElectrolyte && (currentPath.startsWith("/electrolytes") || electrolyteSubItems.some(s => currentPath.startsWith(s.path))) && !collapsed;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  title={item.label}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-all border",
                    collapsed && "justify-center",
                    isActive
                      ? item.active
                      : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
                {showBloodSubs && <BloodSubNav />}
                {showHtnSubs && <HtnSubNav />}
                {showElectrolyteSubs && <ElectrolyteSubNav />}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default TabNavigation;