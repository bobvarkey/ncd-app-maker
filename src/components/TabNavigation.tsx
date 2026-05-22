import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Syringe, Dna, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const tabs: TabItem[] = [
  {
    path: "/",
    label: "Home",
    icon: <Home className="h-4 w-4" />,
    color: "text-primary",
  },
  {
    path: "/diabetes",
    label: "Diabetes",
    icon: <Syringe className="h-4 w-4" />,
    color: "text-red-500",
  },
  {
    path: "/hypertension",
    label: "Hypertension",
    icon: <Heart className="h-4 w-4" />,
    color: "text-orange-500",
  },
  {
    path: "/lipids",
    label: "Lipids",
    icon: <Dna className="h-4 w-4" />,
    color: "text-blue-500",
  },
];

export function TabNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <span className="font-serif font-semibold text-lg tracking-tight">
              NCD <span className="text-muted-foreground font-light">Rx</span>
            </span>
          </Link>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = currentPath === tab.path ||
                (tab.path !== "/" && currentPath.startsWith(tab.path));

              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "bg-muted text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className={cn("transition-colors", isActive ? tab.color : "")}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {isActive && (
                    <span
                      className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                        tab.path === "/" && "bg-primary",
                        tab.path === "/diabetes" && "bg-red-500",
                        tab.path === "/hypertension" && "bg-orange-500",
                        tab.path === "/lipids" && "bg-blue-500"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side placeholder for future features */}
          <div className="ml-auto text-xs text-muted-foreground/60 hidden sm:block">
            Evidence-based · Guideline-driven
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TabNavigation;
