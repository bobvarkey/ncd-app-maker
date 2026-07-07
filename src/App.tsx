import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/CommandPalette";
import { GlobalMedSearch } from "@/components/GlobalMedSearch";
import { LabProvider } from "@/components/SmartLabelUpload/GlobalLabContext";
import BackToHome from "@/components/BackToHome";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TabNavigation } from "@/components/TabNavigation";
import { AppSidebar } from "@/components/AppSidebar";

// Lazy-loaded page components
const Home = lazy(() => import("@/pages/Home"));
const Diabetes = lazy(() => import("@/pages/Diabetes"));
const Hypertension = lazy(() => import("@/pages/Hypertension"));
const Lipids = lazy(() => import("@/pages/Lipids"));
const Liver = lazy(() => import("@/pages/Liver"));
const Anemia = lazy(() => import("@/pages/Anemia"));
const DiabetesAssessment = lazy(() => import("@/pages/diabetes/DiabetesAssessment"));
const DiabetesOverview = lazy(() => import("@/pages/diabetes/DiabetesOverview"));
const DiabetesTab = lazy(() => import("@/pages/diabetes/DiabetesTab"));
const DiabetesTreatment = lazy(() => import("@/pages/diabetes/DiabetesTreatment"));
const InsulinGuide = lazy(() => import("@/pages/diabetes/InsulinGuide"));
const HypertensionAssessment = lazy(() => import("@/pages/hypertension/HypertensionAssessment"));
const HypertensionMedicationGuide = lazy(() => import("@/pages/hypertension/HypertensionMedicationGuide"));
const HypertensionOverview = lazy(() => import("@/pages/hypertension/HypertensionOverview"));
const HypertensionTab = lazy(() => import("@/pages/hypertension/HypertensionTab"));
const HypertensionTreatment = lazy(() => import("@/pages/hypertension/HypertensionTreatment"));
const HypertensionClinicalCards = lazy(() => import("@/pages/hypertension/HypertensionClinicalCards"));
const SecondaryHtnPage = lazy(() => import("@/pages/hypertension/SecondaryHtnPage"));
const MRASelectionAlgorithm = lazy(() => import("@/pages/hypertension/MRASelectionAlgorithm"));
const LipidsAssessment = lazy(() => import("@/pages/lipids/LipidsAssessment"));
const LipidsOverview = lazy(() => import("@/pages/lipids/LipidsOverview"));
const LipidsTab = lazy(() => import("@/pages/lipids/LipidsTab"));
const LipidsTreatment = lazy(() => import("@/pages/lipids/LipidsTreatment"));
const InsulinTitrationCalc = lazy(() => import("@/calculators/diabetes/InsulinTitration"));
const HypoRiskCalculatorCalc = lazy(() => import("@/calculators/diabetes/HypoRisk"));
const RenalDoseAdjustmentCalc = lazy(() => import("@/calculators/diabetes/RenalDosing"));
const SlidingScaleInsulinCalc = lazy(() => import("@/calculators/diabetes/SlidingScale"));
const DiabetesMedicationAlgorithmCalc = lazy(() => import("@/calculators/diabetes/DiabetesMedicationAlgorithm"));
const AscvdEmrCalc = lazy(() => import("@/calculators/lipids/AscvdRisk"));
const LipidPanelCalc = lazy(() => import("@/calculators/lipids/LipidPanel"));
const LipidRiskMiniCalc = lazy(() => import("@/calculators/lipids/LipidRiskMini"));
const GfrCalculatorCalc = lazy(() => import("@/calculators/htn/GfrCalculator"));
const DrugInteractionCheckerCalc = lazy(() => import("@/calculators/htn/DrugInteractions"));
const AntihypertensiveTreatmentAlgorithmCalc = lazy(() => import("@/calculators/htn/AntihypertensiveTreatmentAlgorithm"));
const AntihypertensivePotencyTableCalc = lazy(() => import("@/calculators/htn/AntihypertensivePotencyTable"));
const BmiCalculatorCalc = lazy(() => import("@/calculators/obesity/BmiCalculator"));
const WaistHeightRatioCalc = lazy(() => import("@/calculators/obesity/WaistHeightRatio"));
const GLP1ObesityAlgorithmCalc = lazy(() => import("@/calculators/obesity/GLP1ObesityAlgorithm"));
const IronReplacementCalculator = lazy(() => import("@/calculators/iron/IronReplacementCalculator"));
const ThyroidCalculator = lazy(() => import("@/calculators/thyroid/ThyroidCalculator"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const PatientInput = lazy(() => import("@/pages/PatientInput"));
const FoodDatabase = lazy(() => import("@/pages/FoodDatabase"));
const PlateMethod = lazy(() => import("@/pages/PlateMethod"));
const MedOptimizer = lazy(() => import("@/pages/MedOptimizer"));
const DietPlanPage = lazy(() => import("@/pages/DietPlanPage"));
const Progress = lazy(() => import("@/pages/Progress"));
const SummaryPage = lazy(() => import("@/pages/SummaryPage"));
const InsulinTitrationPage = lazy(() => import("@/pages/InsulinTitration"));
const SlidingScalePage = lazy(() => import("@/pages/SlidingScaleInsulin"));
const HypoRiskPage = lazy(() => import("@/pages/HypoRiskCalculator"));
const RenalDosePage = lazy(() => import("@/pages/RenalDoseAdjustment"));
const RespiratoryPage = lazy(() => import("@/pages/Respiratory"));
const PrediabetesAlgorithm = lazy(() => import("@/pages/PrediabetesAlgorithm"));
const CKDGuideline = lazy(() => import("@/pages/CKDGuideline"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const DisclaimerPage = lazy(() => import("@/pages/Disclaimer"));
const ImageGallery = lazy(() => import("@/pages/ImageGallery"));
const GLP1Administration = lazy(() => import("@/pages/GLP1Administration"));
const DailyManagementGuide = lazy(() => import("@/pages/DailyManagementGuide"));
const Type1DMManagement = lazy(() => import("@/pages/Type1DMManagement"));
const InsulinTherapy = lazy(() => import("@/pages/InsulinTherapy"));
const Type1Pitfalls = lazy(() => import("@/pages/Type1Pitfalls"));
const Type2Transition = lazy(() => import("@/pages/Type2Transition"));
const FeedbackTips = lazy(() => import("@/pages/FeedbackTips"));
const NotFound = lazy(() => import("@/components/NotFound"));
const Fatigue = lazy(() => import("@/pages/Fatigue"));
const VitaminD = lazy(() => import("@/pages/VitaminD"));
const WomenHealth = lazy(() => import("@/pages/WomenHealth"));
const Infections = lazy(() => import("@/pages/Infections"));
const AcuteDiarrhoeaPage = lazy(() => import("@/pages/AcuteDiarrhoeaPage"));
const FoodPoisoningPage = lazy(() => import("@/pages/FoodPoisoningPage"));
const PEP = lazy(() => import("@/pages/PEP"));
const AdultVaccinations = lazy(() => import("@/pages/AdultVaccinations"));
const AKICriteria = lazy(() => import("@/pages/AKICriteria"));
const AcidBaseDisorders = lazy(() => import("@/pages/AcidBaseDisorders"));
const MetabolicAlkalosis = lazy(() => import("@/pages/MetabolicAlkalosis"));
const Geriatrics = lazy(() => import("@/pages/Geriatrics"));
const Electrolytes = lazy(() => import("@/pages/Electrolytes"));
const Hyponatremia = lazy(() => import("@/pages/Hyponatremia"));
const Hypernatremia = lazy(() => import("@/pages/Hypernatremia"));
const Hyperkalemia = lazy(() => import("@/pages/Hyperkalemia"));
const Hypocalcemia = lazy(() => import("@/pages/Hypocalcemia"));
const Hypercalcemia = lazy(() => import("@/pages/Hypercalcemia"));
const Hypokalemia = lazy(() => import("@/pages/Hypokalemia"));
const Hypomagnesemia = lazy(() => import("@/pages/Hypomagnesemia"));
const Hypermagnesemia = lazy(() => import("@/pages/Hypermagnesemia"));
const Hypophosphatemia = lazy(() => import("@/pages/Hypophosphatemia"));
const FCMHypophosphatemia = lazy(() => import("@/pages/FCMHypophosphatemia"));
const Hyperphosphatemia = lazy(() => import("@/pages/Hyperphosphatemia"));
const HyperglycemicEmergency = lazy(() => import("@/pages/HyperglycemicEmergency"));
const Type1TreatmentAlgorithm = lazy(() => import("@/pages/Type1TreatmentAlgorithm"));
const Type2TreatmentAlgorithm = lazy(() => import("@/pages/Type2TreatmentAlgorithm"));
const GoldmanCardiacIndex = lazy(() => import("@/pages/GoldmanCardiacIndex"));

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
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
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
        </Suspense>
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
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
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
          <Route path="/hypertension/mra-selection" element={<><TabNavigation /><MRASelectionAlgorithm /></>} />
          <Route path="/lipids/assessment" element={<><TabNavigation /><LipidsAssessment /></>} />
          <Route path="/lipids/overview" element={<><TabNavigation /><LipidsOverview /></>} />
          <Route path="/lipids/tab" element={<><TabNavigation /><LipidsTab /></>} />
          <Route path="/lipids/treatment" element={<><TabNavigation /><LipidsTreatment /></>} />
          <Route path="/insulin-titration" element={<><TabNavigation /><InsulinTitrationCalc /></>} />
          <Route path="/sliding-scale" element={<><TabNavigation /><SlidingScaleInsulinCalc /></>} />
          <Route path="/hypo-risk" element={<><TabNavigation /><HypoRiskCalculatorCalc /></>} />
          <Route path="/renal-dosing" element={<><TabNavigation /><RenalDosePage /></>} />
          <Route path="/aki-criteria" element={<><TabNavigation /><AKICriteria /></>} />
          <Route path="/acid-base" element={<><TabNavigation /><AcidBaseDisorders /></>} />
          <Route path="/metabolic-alkalosis" element={<Navigate to="/acid-base?tab=metabolic-alkalosis" replace />} />
          <Route path="/geriatrics" element={<><TabNavigation /><Geriatrics /></>} />
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
          <Route path="/fcm-hypophosphatemia" element={<><TabNavigation /><FCMHypophosphatemia /></>} />
          <Route path="/hyperphosphatemia" element={<><TabNavigation /><Hyperphosphatemia /></>} />
          <Route path="/hyperglycemic-emergency" element={<><TabNavigation /><HyperglycemicEmergency /></>} />
          <Route path="/type1-treatment-algorithm" element={<><TabNavigation /><Type1TreatmentAlgorithm /></>} />
          <Route path="/type2-treatment-algorithm" element={<><TabNavigation /><Type2TreatmentAlgorithm /></>} />
          <Route path="/goldman-cardiac" element={<><TabNavigation /><GoldmanCardiacIndex /></>} />

          {/* Legal / Compliance */}
          <Route path="/privacy" element={<><TabNavigation /><PrivacyPolicy /></>} />
          <Route path="/terms" element={<><TabNavigation /><TermsOfService /></>} />
          <Route path="/disclaimer" element={<><TabNavigation /><DisclaimerPage /></>} />
          <Route path="/images" element={<><TabNavigation /><ImageGallery /></>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <BackToHome />
      </BrowserRouter>
    </TooltipProvider>
    </LabProvider>
  </QueryClientProvider>
);

export default App;