import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Syringe, Dna, Activity, Wind, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/home", label: "🏠 Homepage", icon: "🏠", color: "primary" },
  { path: "/diabetes", label: "Diabetes", icon: "💉", color: "red-500" },
  { path: "/hypertension", label: "Hypertension", icon: "❤️", color: "orange-500" },
  { path: "/lipids", label: "Lipids", icon: "💧", color: "blue-500" },
  { path: "/obesity/bmi-calculator", label: "Obesity", icon: "⚖️", color: "violet-500" },
  { path: "/respiratory", label: "COPD/Asthma", icon: "🫁", color: "cyan-500" },
  { path: "/renal-dosing", label: "Renal", icon: "🫘", color: "amber-500" },
  { path: "/anemia", label: "Blood Disorders", icon: "🩸", color: "sky-500" },
  { path: "/thyroid", label: "Thyroid", icon: "🔬", color: "emerald-500" },
];

] // End of navItems

// Removed mode switcher: Simple/Moderate/Complex tiers no longer used

export function TabNavigation() {

export function TabNavigation() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPath = location.pathname;

  useEffect(() => {
    document.body.classList.add("has-tab-navigation");
    return () => document.body.classList.remove("has-tab-navigation");
  }, []);

  // Determine active main section
  const activeSection = currentPath.split("/")[1] || "home";

  return (
    <>
      {/* Mobile hamburger */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border lg:hidden"
        aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-56 bg-card border-r border-border z-40",
        "transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Close button mobile */}
        <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 p-1 lg:hidden" aria-label="Close sidebar">
          <X className="h-4 w-4" />
        </button>

        {/* Logo + Search trigger */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <span className="font-serif font-semibold">NCD Rx</span>
            </Link>
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              aria-label="Quick search (Cmd+K)"
            >
              <Search className="h-3 w-3" />
              <kbd className="hidden sm:inline text-[10px]">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-2 space-y-1" aria-labelledby="sidebar-clinical-heading">
          <div className="text-xs font-semibold text-muted-foreground px-2 py-2" id="sidebar-clinical-heading">CLINICAL AREAS</div>
          {navItems.map((item) => {
            const isActive = currentPath === item.path || 
              (item.path !== "/home" && currentPath.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive 
                    ? `bg-${item.color}/10 text-${item.color} border-l-2 border-${item.color}` 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-label={`${item.label}${isActive ? " (current page)" : ""}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          role="presentation"
          aria-hidden="true"
        />
      )}

      {/* Mobile top bar with hamburger */}
      <div className="lg:hidden h-14 flex items-center pl-14 border-b border-border bg-background/95">
        <span className="text-sm font-medium">
          {navItems.find(n => currentPath === n.path || currentPath.startsWith(n.path + "/"))?.label || "NCD Rx"}
        </span>
      </div>
    </>
  );
}

export default TabNavigation;
