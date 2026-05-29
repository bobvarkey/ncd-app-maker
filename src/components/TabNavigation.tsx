import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  { path: "/diabetes",                label: "Diabetes",  icon: "💉", active: "bg-red-500/10 text-red-400 border-red-500/30" },
  { path: "/hypertension",            label: "HTN",       icon: "❤️", active: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  { path: "/lipids",                  label: "Lipids",    icon: "💧", active: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { path: "/thyroid",                 label: "Thyroid",   icon: "🔬", active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  { path: "/obesity/bmi-calculator",  label: "Obesity",   icon: "⚖️", active: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  { path: "/respiratory",             label: "COPD",      icon: "🫁", active: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  { path: "/renal-dosing",            label: "Renal",     icon: "🫘", active: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { path: "/anemia",                  label: "Blood",     icon: "🩸", active: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
];

export function TabNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    document.body.classList.add("has-tab-navigation");
    return () => document.body.classList.remove("has-tab-navigation");
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
        <nav
          className="overflow-x-auto scrollbar-thin"
          aria-label="Primary"
        >
          <div className="flex items-center gap-1 px-3 h-12 min-w-max">
            {navItems.map((item) => {
              const isActive =
                currentPath === item.path ||
                (item.path !== "/home" && currentPath.startsWith(item.path + "/")) ||
                (item.path !== "/home" && currentPath === item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all border",
                    isActive
                      ? item.active
                      : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-sm leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Spacer to offset fixed nav */}
      <div className="h-12" />
    </>
  );
}

export default TabNavigation;
