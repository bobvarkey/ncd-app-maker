import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/CommandPalette";
import { GlobalMedSearch } from "@/components/GlobalMedSearch";
import { LabProvider } from "@/components/SmartLabelUpload/GlobalLabContext";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TabNavigation } from "@/components/TabNavigation";
import { AppSidebar } from "@/components/AppSidebar";

// Big Four NCD Pages
import Home from "@/pages/Home";
import Diabetes from "@/pages/Diabetes";
import Hypertension from "@/pages/Hypertension";
import Lipids from "@/pages/Lipids";
import Liver from "@/pages/Liver";

// Anemia Page
import Anemia from "@/pages/Anemia";

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
import HypertensionClinicalCards from "@/pages/hypertension/HypertensionClinicalCards";
import SecondaryHtnPage from "@/pages/hypertension/SecondaryHtnPage";

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
import LipidRiskMiniCalc from "@/calculators/lipids/LipidRiskMini";
import GfrCalculatorCalc from "@/calculators/htn/GfrCalculator";
import DrugInteractionCheckerCalc from "@/calculators/htn/DrugInteractions";
import AntihypertensiveTreatmentAlgorithmCalc from "@/calculators/htn/AntihypertensiveTreatmentAlgorithm";
import AntihypertensivePotencyTableCalc from "@/calculators/htn/AntihypertensivePotencyTable";
import BmiCalculatorCalc from "@/calculators/obesity/BmiCalculator";
import WaistHeightRatioCalc from "@/calculators/obesity/WaistHeightRatio";
import GLP1ObesityAlgorithmCalc from "@/calculators/obesity/GLP1ObesityAlgorithm";

// Iron Calculator
import IronReplacementCalculator from "@/calculators/iron/IronReplacementCalculator";
// Thyroid Calculator
import ThyroidCalculator from "@/calculators/thyroid/ThyroidCalculator";

// Diabetes Buddy Pages
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
import RespiratoryPage from "@/pages/Respiratory";
import PrediabetesAlgorithm from "@/pages/PrediabetesAlgorithm";
import CKDGuideline from "@/pages/CKDGuideline";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import DisclaimerPage from "@/pages/Disclaimer";
import GLP1Administration from "@/pages/GLP1Administration";
import DailyManagementGuide from "@/pages/DailyManagementGuide";
import Type1DMManagement from "@/pages/Type1DMManagement";
import InsulinTherapy from "@/pages/InsulinTherapy";
import Type1Pitfalls from "@/pages/Type1Pitfalls";
import Type2Transition from "@/pages/Type2Transition";
import FeedbackTips from "@/pages/FeedbackTips";

// 404
import NotFound from "@/components/NotFound";

// Fatigue
import Fatigue from "@/pages/Fatigue";

// Vitamin D
import VitaminD from "@/pages/VitaminD";

// PCOS
// import PCOS from "@/pages/PCOS"; // removed — merged into WomenHealth

// Women's Health
import WomenHealth from "@/pages/WomenHealth";

// Infections
import Infections from "@/pages/Infections";

// Acute Diarrhoea
import AcuteDiarrhoeaPage from "@/pages/AcuteDiarrhoeaPage";

// Food Poisoning
import FoodPoisoningPage from "@/pages/FoodPoisoningPage";

// PEP
import PEP from "@/pages/PEP";

// Adult Vaccinations
import AdultVaccinations from "@/pages/AdultVaccinations";

// Electrolytes
import Electrolytes from "@/pages/Electrolytes";

// Hyponatremia / Hypernatremia
import Hyponatremia from "@/pages/Hyponatremia";
import Hypernatremia from "@/pages/Hypernatremia";

// Hyperkalemia / Hypocalcemia / Hypercalcemia
import Hyperkalemia from "@/pages/Hyperkalemia";
import Hypocalcemia from "@/pages/Hypocalcemia";
import Hypercalcemia from "@/pages/Hypercalcemia";
import Hypokalemia from "@/pages/Hypokalemia";
import Hypomagnesemia from "@/pages/Hypomagnesemia";
import Hypermagnesemia from "@/pages/Hypermagnesemia";
import Hypophosphatemia from "@/pages/Hypophosphatemia";
import Hyperphosphatemia from "@/pages/Hyperphosphatemia";

// Hyperglycemic Emergency
import HyperglycemicEmergency from "@/pages/HyperglycemicEmergency";

// Treatment Algorithm Pages
import Type1TreatmentAlgorithm from "@/pages/Type1TreatmentAlgorithm";
import Type2TreatmentAlgorithm from "@/pages/Type2TreatmentAlgorithm";

const queryClient = new QueryClient();

const DiabetesBuddyLayout = () => (
  <div className="min-h-screen flex w-full">
    <AppSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-12 flex items-center border-b bg-card px-2">
        <SidebarTrigger className="ml-2 h-10 w-10 hover:bg-sidebar-accent" aria-label="Toggle sidebar navigation" />
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
    <LabProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CommandPalette />
        <GlobalMedSearch />
        <Routes>
          {/* Landing — redirect to main app */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/index" element={<Navigate to="/home" replace />} />

          {/* Legacy redirects */}
          <Route path="/simple" element={<Navigate to="/home" replace />} />
          <Route path="/moderate" element={<Navigate to="/home" replace />} />
          <Route path="/hard" element={<Navigate to="/home" replace />} />
          <Route path="/landing" element={<Navigate to="/home" replace />} />
          <Route path="/app" element={<Navigate to="/home" replace />} />

          {/* Diabetes Buddy routes with sidebar */}
          <Route path="/db/*" element={<SidebarProvider><DiabetesBuddyLayout /></SidebarProvider>} />

          {/* Main App — unified interface */}
          <Route path="/home" element={<><TabNavigation /><Home /></>} />
          <Route path="/diabetes" element={<><TabNavigation /><Diabetes /></>} />
          <Route path="/hypertension" element={<><TabNavigation /><Hypertension /></>} />
          <Route path="/lipids" element={<><TabNavigation /><Lipids /></>} />
          <Route path="/liver" element={<><TabNavigation /><Liver /></>} />
          <Route path="/anemia" element={<><TabNavigation /><Anemia /></>} />
          <Route path="/diabetes/assessment" element={<><TabNavigation /><DiabetesAssessment /></>} />
          <Route path="/diabetes/overview" element={<><TabNavigation /><DiabetesOverview /></>} />
          <Route path="/diabetes/tab" element={<><TabNavigation /><DiabetesTab /></>} />
          <Route path="/diabetes/treatment" element={<><TabNavigation /><DiabetesTreatment /></>} />
          <Route path="/diabetes/insulin-guide" element={<><TabNavigation /><InsulinGuide /></>} />
          <Route path="/hypertension/assessment" element={<><TabNavigation /><HypertensionAssessment /></>} />
          <Route path="/hypertension/medication-guide" element={<><TabNavigation /><HypertensionMedicationGuide /></>} />
          <Route path="/hypertension/overview" element={<><TabNavigation /><HypertensionOverview /></>} />
          <Route path="/hypertension/tab" element={<><TabNavigation /><HypertensionTab /></>} />
          <Route path="/hypertension/treatment" element={<><TabNavigation /><HypertensionTreatment /></>} />
          <Route path="/hypertension/clinical-cards" element={<><TabNavigation /><HypertensionClinicalCards /></>} />
          <Route path="/hypertension/secondary-htn" element={<><TabNavigation /><SecondaryHtnPage /></>} />
          <Route path="/lipids/assessment" element={<><TabNavigation /><LipidsAssessment /></>} />
          <Route path="/lipids/overview" element={<><TabNavigation /><LipidsOverview /></>} />
          <Route path="/lipids/tab" element={<><TabNavigation /><LipidsTab /></>} />
          <Route path="/lipids/treatment" element={<><TabNavigation /><LipidsTreatment /></>} />
          <Route path="/insulin-titration" element={<><TabNavigation /><InsulinTitrationCalc /></>} />
          <Route path="/sliding-scale" element={<><TabNavigation /><SlidingScaleInsulinCalc /></>} />
          <Route path="/hypo-risk" element={<><TabNavigation /><HypoRiskCalculatorCalc /></>} />
          <Route path="/renal-dosing" element={<><TabNavigation /><RenalDoseAdjustmentCalc /></>} />
          <Route path="/respiratory" element={<><TabNavigation /><RespiratoryPage /></>} />
          <Route path="/respiratory/simple" element={<Navigate to="/respiratory" replace />} />
          <Route path="/respiratory/moderate" element={<Navigate to="/respiratory" replace />} />
          <Route path="/diabetes/medication-algorithm" element={<><TabNavigation /><DiabetesMedicationAlgorithmCalc /></>} />
          <Route path="/lipid-panel" element={<><TabNavigation /><LipidPanelCalc /></>} />
          <Route path="/ascvd-risk" element={<><TabNavigation /><AscvdEmrCalc /></>} />
          <Route path="/lipid-risk-mini" element={<><TabNavigation /><LipidRiskMiniCalc /></>} />
          <Route path="/gfr-calculator" element={<><TabNavigation /><GfrCalculatorCalc /></>} />
          <Route path="/drug-interactions" element={<><TabNavigation /><DrugInteractionCheckerCalc /></>} />
          <Route path="/htn/treatment-algorithm" element={<><TabNavigation /><AntihypertensiveTreatmentAlgorithmCalc /></>} />
          <Route path="/htn/potency-table" element={<><TabNavigation /><AntihypertensivePotencyTableCalc /></>} />
          <Route path="/obesity/bmi-calculator" element={<><TabNavigation /><BmiCalculatorCalc /></>} />
          <Route path="/obesity/waist-height-ratio" element={<><TabNavigation /><WaistHeightRatioCalc /></>} />
          <Route path="/obesity/glp1-algorithm" element={<><TabNavigation /><GLP1ObesityAlgorithmCalc /></>} />
          <Route path="/diet-plan" element={<><TabNavigation /><DietPlanPage /></>} />
          <Route path="/iron-calculator" element={<><TabNavigation /><IronReplacementCalculator /></>} />
          <Route path="/thyroid" element={<><TabNavigation /><ThyroidCalculator /></>} />
          <Route path="/fatigue" element={<><TabNavigation /><Fatigue /></>} />
          <Route path="/vitamin-d" element={<><TabNavigation /><VitaminD /></>} />
          <Route path="/pcos" element={<Navigate to="/women-health?tab=pmos" replace />} />
          <Route path="/women-health" element={<><TabNavigation /><WomenHealth /></>} />
          <Route path="/infections" element={<><TabNavigation /><Infections /></>} />
          <Route path="/acute-diarrhoea" element={<><TabNavigation /><AcuteDiarrhoeaPage /></>} />
          <Route path="/food-poisoning" element={<><TabNavigation /><FoodPoisoningPage /></>} />
          <Route path="/pep" element={<><TabNavigation /><PEP /></>} />
          <Route path="/adult-vaccinations" element={<><TabNavigation /><AdultVaccinations /></>} />
          <Route path="/electrolytes" element={<><TabNavigation /><Electrolytes /></>} />
          <Route path="/hyponatremia" element={<><TabNavigation /><Hyponatremia /></>} />
          <Route path="/hypernatremia" element={<><TabNavigation /><Hypernatremia /></>} />
          <Route path="/hyperkalemia" element={<><TabNavigation /><Hyperkalemia /></>} />
          <Route path="/hypocalcemia" element={<><TabNavigation /><Hypocalcemia /></>} />
          <Route path="/hypercalcemia" element={<><TabNavigation /><Hypercalcemia /></>} />
          <Route path="/hypokalemia" element={<><TabNavigation /><Hypokalemia /></>} />
          <Route path="/hypomagnesemia" element={<><TabNavigation /><Hypomagnesemia /></>} />
          <Route path="/hypermagnesemia" element={<><TabNavigation /><Hypermagnesemia /></>} />
          <Route path="/hypophosphatemia" element={<><TabNavigation /><Hypophosphatemia /></>} />
          <Route path="/hyperphosphatemia" element={<><TabNavigation /><Hyperphosphatemia /></>} />
          <Route path="/hyperglycemic-emergency" element={<><TabNavigation /><HyperglycemicEmergency /></>} />
          <Route path="/type1-treatment-algorithm" element={<><TabNavigation /><Type1TreatmentAlgorithm /></>} />
          <Route path="/type2-treatment-algorithm" element={<><TabNavigation /><Type2TreatmentAlgorithm /></>} />

          {/* Legal / Compliance */}
          <Route path="/privacy" element={<><TabNavigation /><PrivacyPolicy /></>} />
          <Route path="/terms" element={<><TabNavigation /><TermsOfService /></>} />
          <Route path="/disclaimer" element={<><TabNavigation /><DisclaimerPage /></>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LabProvider>
  </QueryClientProvider>
);

export default App;