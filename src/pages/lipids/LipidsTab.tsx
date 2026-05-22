import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calculator, Pill, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LipidsOverview from "./LipidsOverview";
import LipidsAssessment from "./LipidsAssessment";
import LipidsTreatment from "./LipidsTreatment";

export default function LipidsTab() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Grain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1.5 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <svg
                className="h-6 w-6 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M2 12h20" />
                <circle cx="12" cy="12" r="8" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold tracking-tight text-foreground">
                Lipid Management
              </h1>
              <p className="text-muted-foreground">
                Comprehensive lipid assessment and treatment with ACC/AHA and LAI
                2023 guidelines
              </p>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="assessment"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Risk Assessment</span>
              <span className="sm:hidden">Assessment</span>
            </TabsTrigger>
            <TabsTrigger
              value="treatment"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600"
            >
              <Pill className="h-4 w-4" />
              <span className="hidden sm:inline">Treatment</span>
              <span className="sm:hidden">Treatment</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <LipidsOverview />
          </TabsContent>

          <TabsContent value="assessment" className="mt-0">
            <LipidsAssessment />
          </TabsContent>

          <TabsContent value="treatment" className="mt-0">
            <LipidsTreatment />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
