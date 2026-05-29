import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Syringe, Dna, Activity, Wind, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/home", label: "🏠 Home", icon: "🏠", color: "primary" },
  { path: "/simple", label: "⚡ Simple", icon: "⚡", color: "blue-500" },
  { path: "/moderate", label: "🏥 Moderate", icon: "🏥", color: "purple-500" },
  { path: "/diabetes", label: "💉 Diabetes", icon: "💉", color: "red-500" },
  { path: "/hypertension", label: "❤️ HTN", icon: "❤️", color: "orange-500" },
  { path: "/lipids", label: "💧 Lipids", icon: "💧", color: "blue-500" },
  { path: "/thyroid", label: "🔬 Thyroid", icon: "🔬", color: "emerald-500" },
  { path: "/obesity/bmi-calculator", label: "⚖️ Obesity", icon: "⚖️", color: "violet-500" },
  { path: "/respiratory", label: "🫁 COPD", icon: "🫁", color: "cyan-500" },
  { path: "/renal-dosing", label: "🫘 Renal", icon: "🫘", color: "amber-500" },
  { path: "/anemia", label: "🩸 Blood", icon: "🩸", color: "sky-500" },
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
      {/* Top horizontal scrollable tabs */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-12 bg-card/95 backdrop-blur-sm border-b border-border overflow-x-auto">
        <div className="flex items-center h-full px-2 gap-1 min-w-max">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || 
              (item.path !== "/home" && currentPath.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all",
                  isActive 
                    ? `bg-${item.color}/10 text-${item.color} border border-${item.color}/30` 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for fixed top nav */}
      <div className="h-12" />
    </>
  );
}

export default TabNavigation;