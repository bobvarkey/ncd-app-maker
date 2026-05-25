import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TabNavigation } from "@/components/TabNavigation";
import { AppSidebar } from "@/components/AppSidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Big Four NCD Pages
import Home from "@/pages/Home";
import Diabetes from "@/pages/Diabetes";
import Hypertension from "@/pages/Hypertension";
import Lipids from "@/pages/Lipids";
import Obesity from "@/pages/Obesity";
import AsthmaCopd from "@/pages/AsthmaCopd";
import RenalDisease from "@/pages/RenalDisease";

// Big Four — Diabetes sub-pages
import DiabetesAssessment from "@/pages/diabetes/DiabetesAssessment";
import DiabetesOverview from "@/pages/diabetes/DiabetesOverview";
import DiabetesTab from "@/pages/diabetes/DiabetesTab";
import DiabetesTreatment from "@/pages/diabetes/DiabetesTreatment";
import InsulinGuide from "@/pages/diabetes/InsulinGuide";

// Big Four — Hypertension sub-pages
import HypertensionAssessment from "@/pages/hypertension/HypertensionAssessment";
import HypertensionMedicationGuide from "@/pages/hypertension/HypertensionMedicationGuide";
import HypertensionOverview from "@/pages/hypertension/HypertensionOverview";
import HypertensionTab from "@/pages/hypertension/HypertensionTab";
import HypertensionTreatment from "@/pages/hypertension/HypertensionTreatment";

// Big Four — Lipids sub-pages
import LipidsAssessment from "@/pages/lipids/LipidsAssessment";
import LipidsOverview from "@/pages/lipids/LipidsOverview";
import LipidsTab from "@/pages/lipids/LipidsTab";
import LipidsTreatment from "@/pages/lipids/LipidsTreatment";

// Big Four — Calculators
import InsulinTitrationCalc from "@/calculators/diabetes/InsulinTitration";
import HypoRiskCalculatorCalc from "@/calculators/diabetes/HypoRisk";
import RenalDoseAdjustmentCalc from "@/calculators/diabetes/RenalDosing";
import SlidingScaleInsulinCalc from "@/calculators/diabetes/SlidingScale";
import DiabetesMedicationAlgorithmCalc from "@/calculators/diabetes/DiabetesMedicationAlgorithm";
import AscvdEmrCalc from "@/calculators/lipids/AscvdRisk";
import LipidPanelCalc from "@/calculators/lipids/LipidPanel";
import GfrCalculatorCalc from "@/calculators/htn/GfrCalculator";
import DrugInteractionCheckerCalc from "@/calculators/htn/DrugInteractions";
import AntihypertensiveTreatmentAlgorithmCalc from "@/calculators/htn/AntihypertensiveTreatmentAlgorithm";
import AntihypertensivePotencyTableCalc from "@/calculators/htn/AntihypertensivePotencyTable";
import BmiCalculatorCalc from "@/calculators/obesity/BmiCalculator";
import WaistHeightRatioCalc from "@/calculators/obesity/WaistHeightRatio";
import GLP1ObesityAlgorithmCalc from "@/calculators/obesity/GLP1ObesityAlgorithm";

// Diabetes Buddy Pages
import LandingPage from "@/pages/LandingPage";
import AssessmentGrid from "@/pages/AssessmentGrid";
import Dashboard from "@/pages/Dashboard";
import PatientInput from "@/pages/PatientInput";
import FoodDatabase from "@/pages/FoodDatabase";
import PlateMethod from "@/pages/PlateMethod";
import MedOptimizer from "@/pages/MedOptimizer";
import DietPlanPage from "@/pages/DietPlanPage";
import Progress from "@/pages/Progress";
import SummaryPage from "@/pages/SummaryPage";
import InsulinTitrationPage from "@/pages/InsulinTitration";
import SlidingScalePage from "@/pages/SlidingScaleInsulin";
import HypoRiskPage from "@/pages/HypoRiskCalculator";
import RenalDosePage from "@/pages/RenalDoseAdjustment";
import PrediabetesAlgorithm from "@/pages/PrediabetesAlgorithm";
import CKDGuideline from "@/pages/CKDGuideline";
import GLP1Administration from "@/pages/GLP1Administration";
import DailyManagementGuide from "@/pages/DailyManagementGuide";
import Type1DMManagement from "@/pages/Type1DMManagement";
import InsulinTherapy from "@/pages/InsulinTherapy";
import Type1Pitfalls from "@/pages/Type1Pitfalls";
import Type2Transition from "@/pages/Type2Transition";
import FeedbackTips from "@/pages/FeedbackTips";

// 404
import NotFound from "@/components/NotFound";

const queryClient = new QueryClient();

const DiabetesBuddyLayout = () => (
  <div className="min-h-screen flex w-full">
    <AppSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-12 flex items-center border-b bg-card px-2">
        <SidebarTrigger className="ml-1" />
        <span className="ml-3 text-sm font-heading font-semibold text-muted-foreground">
          Diabetes Med Optimizer
        </span>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-4xl">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient" element={<PatientInput />} />
          <Route path="/foods" element={<FoodDatabase />} />
          <Route path="/plate" element={<PlateMethod />} />
          <Route path="/medications" element={<MedOptimizer />} />
          <Route path="/diet-plan" element={<DietPlanPage />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/db/insulin-titration" element={<InsulinTitrationPage />} />
          <Route path="/db/sliding-scale" element={<SlidingScalePage />} />
          <Route path="/db/glp1-administration" element={<GLP1Administration />} />
          <Route path="/db/hypo-risk" element={<HypoRiskPage />} />
          <Route path="/db/renal-dosing" element={<RenalDosePage />} />
          <Route path="/db/prediabetes" element={<PrediabetesAlgorithm />} />
          <Route path="/db/ckd-guideline" element={<CKDGuideline />} />
          <Route path="/db/daily-management" element={<DailyManagementGuide />} />
          <Route path="/db/type1-management" element={<Type1DMManagement />} />
          <Route path="/db/insulin-therapy" element={<InsulinTherapy />} />
          <Route path="/db/type1-pitfalls" element={<Type1Pitfalls />} />
          <Route path="/db/type2-transition" element={<Type2Transition />} />
          <Route path="/db/feedback" element={<FeedbackTips />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Full-screen routes — no sidebar, no tab nav */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/app" element={<AssessmentGrid />} />

          {/* Diabetes Buddy routes with sidebar */}
          <Route path="/db/*" element={<SidebarProvider><DiabetesBuddyLayout /></SidebarProvider>} />

          {/* Big Four NCD routes with tab navigation */}
          <Route
            path="/*"
            element={
              <>
                <TabNavigation />
                <Routes>
                  <Route path="/" element={<Home />} />
                  {/* Tab Pages */}
                  <Route path="/diabetes" element={<Diabetes />} />
                  <Route path="/hypertension" element={<Hypertension />} />
                  <Route path="/lipids" element={<Lipids />} />
                  <Route path="/obesity" element={<Obesity />} />
                  <Route path="/asthma-copd" element={<AsthmaCopd />} />
                  <Route path="/renal" element={<RenalDisease />} />
                  {/* Diabetes Sub-pages */}
                  <Route path="/diabetes/assessment" element={<DiabetesAssessment />} />
                  <Route path="/diabetes/overview" element={<DiabetesOverview />} />
                  <Route path="/diabetes/tab" element={<DiabetesTab />} />
                  <Route path="/diabetes/treatment" element={<DiabetesTreatment />} />
                  <Route path="/diabetes/insulin-guide" element={<InsulinGuide />} />
                  {/* Hypertension Sub-pages */}
                  <Route path="/hypertension/assessment" element={<HypertensionAssessment />} />
                  <Route path="/hypertension/medication-guide" element={<HypertensionMedicationGuide />} />
                  <Route path="/hypertension/overview" element={<HypertensionOverview />} />
                  <Route path="/hypertension/tab" element={<HypertensionTab />} />
                  <Route path="/hypertension/treatment" element={<HypertensionTreatment />} />
                  {/* Lipids Sub-pages */}
                  <Route path="/lipids/assessment" element={<LipidsAssessment />} />
                  <Route path="/lipids/overview" element={<LipidsOverview />} />
                  <Route path="/lipids/tab" element={<LipidsTab />} />
                  <Route path="/lipids/treatment" element={<LipidsTreatment />} />
                  {/* Diabetes Calculators */}
                  <Route path="/insulin-titration" element={<InsulinTitrationCalc />} />
                  <Route path="/sliding-scale" element={<SlidingScaleInsulinCalc />} />
                  <Route path="/hypo-risk" element={<HypoRiskCalculatorCalc />} />
                  <Route path="/renal-dosing" element={<RenalDoseAdjustmentCalc />} />
                  <Route path="/diabetes/medication-algorithm" element={<DiabetesMedicationAlgorithmCalc />} />
                  {/* Lipid Calculators */}
                  <Route path="/lipid-panel" element={<LipidPanelCalc />} />
                  <Route path="/ascvd-risk" element={<AscvdEmrCalc />} />
                  {/* Hypertension Calculators */}
                  <Route path="/gfr-calculator" element={<GfrCalculatorCalc />} />
                  <Route path="/drug-interactions" element={<DrugInteractionCheckerCalc />} />
                  <Route path="/htn/treatment-algorithm" element={<AntihypertensiveTreatmentAlgorithmCalc />} />
                  <Route path="/htn/potency-table" element={<AntihypertensivePotencyTableCalc />} />
                  {/* Obesity Calculators */}
                  <Route path="/obesity/bmi-calculator" element={<BmiCalculatorCalc />} />
                  <Route path="/obesity/waist-height-ratio" element={<WaistHeightRatioCalc />} />
                  <Route path="/obesity/glp1-algorithm" element={<GLP1ObesityAlgorithmCalc />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
