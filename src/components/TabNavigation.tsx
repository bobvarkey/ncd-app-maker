import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

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

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-screen bg-card/95 backdrop-blur-md border-r border-border shadow-sm flex flex-col transition-[width] duration-200",
        collapsed ? "w-14" : "w-56"
      )}
      aria-label="Primary"
    >
      <div className="flex items-center justify-between h-12 px-2 border-b border-border shrink-0">
        {!collapsed && (
          <span className="text-xs font-semibold text-muted-foreground px-2 truncate">
            NCD Rx
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        <ul className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path !== "/home" && currentPath.startsWith(item.path + "/"));
            const isBlood = item.path === "/anemia";
            const showBloodSubs = isBlood && currentPath.startsWith("/anemia") && !collapsed;
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
              </li>
            );
          })}
        </ul>
      </nav>

    </aside>
  );
}

export default TabNavigation;
