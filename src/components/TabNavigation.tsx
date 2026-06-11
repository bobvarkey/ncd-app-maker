import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, X, Pill } from "lucide-react";
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
    return ALL_MEDS
      .filter((m) => m.drug.toLowerCase().includes(term) || m.drugClass.toLowerCase().includes(term))
      .slice(0, 6);
  }, [searchQ]);

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
              placeholder="Medication name…"
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
                <p className="px-2 py-1.5 text-xs text-muted-foreground">No medications found.</p>
              ) : (
                <ul>
                  {searchResults.map((m) => (
                    <li key={`${m.drug}-${m.drugClass}`}>
                      <button
                        type="button"
                        onClick={() => goToDrug(m.drug)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs rounded hover:bg-muted transition-colors"
                      >
                        <Pill className="h-3 w-3 text-primary shrink-0" />
                        <span className="font-medium text-foreground truncate">{m.drug}</span>
                        <span className="text-muted-foreground truncate">{m.drugClass}</span>
                      </button>
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
              placeholder="Search medications…"
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
                <p className="px-2 py-1.5 text-xs text-muted-foreground">No medications found.</p>
              ) : (
                <ul>
                  {searchResults.map((m) => (
                    <li key={`${m.drug}-${m.drugClass}`}>
                      <button
                        type="button"
                        onClick={() => goToDrug(m.drug)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs rounded hover:bg-muted transition-colors"
                      >
                        <Pill className="h-3 w-3 text-primary shrink-0" />
                        <span className="font-medium text-foreground truncate">{m.drug}</span>
                      </button>
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
            const showBloodSubs = isBlood && currentPath.startsWith("/anemia") && !collapsed;
            const showHtnSubs = isHtn && currentPath.startsWith("/hypertension") && !collapsed;
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
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default TabNavigation;