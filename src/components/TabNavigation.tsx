import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Syringe, Dna, Activity, Wind, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
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

const VISIBLE_COLLAPSED = 9;

export function TabNavigation() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const currentPath = location.pathname;

  useEffect(() => {
    document.body.classList.add("has-tab-navigation");
    return () => document.body.classList.remove("has-tab-navigation");
  }, []);

  const isExpanded = expanded || typeof window !== "undefined" && window.innerWidth >= 1024;
  const itemsToShow = isExpanded ? navItems : navItems.slice(0, VISIBLE_COLLAPSED);

  return (
    <>
      {/* Top collapsible tabs */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        {/* Expand/Collapse button */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center h-6 text-xs text-muted-foreground hover:bg-muted transition-colors border-b border-border"
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {/* Tabs container */}
        <nav className={cn(
          "overflow-x-auto transition-all duration-300",
          expanded ? "h-[68px]" : "h-20"
        )}>
          <div className={cn(
            "flex items-center px-2 gap-1 min-w-max h-full",
            !expanded && "flex-wrap justify-start"
          )}>
            {navItems.map((item, idx) => {
              if (!expanded && idx >= VISIBLE_COLLAPSED) return null;
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
      </div>

      {/* Spacer */}
      <div className="h-[68px]" />
    </>
  );
}

export default TabNavigation;