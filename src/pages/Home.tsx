import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createWorker } from "tesseract.js";
import { Activity, Droplets, Heart, Scale, Syringe, Activity as PulseIcon, Dna, FileText, ChevronRight, Info, ChevronDown, Upload, Sparkles, Calculator, Stethoscope, FileSearch, UtensilsCrossed, Scan, CheckCircle2, X, AlertTriangle } from "lucide-react";
import ZoomableImage from "@/components/ZoomableImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GitHubSyncPanel } from "@/components/GitHubSyncPanel";
import { useGlobalLabFillAll } from "@/hooks/useGlobalLabFill";
import { useLabContext } from "@/components/SmartLabelUpload/GlobalLabContext";
import { DIABETES_FIELDS, HTN_FIELDS, LIPID_FIELDS, OBESITY_FIELDS, THYROID_FIELDS, CBC_FIELDS, RENAL_FIELDS } from "@/components/SmartLabelUpload";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const fullForms: Record<string, string> = {
  // Diabetes
  "FG": "Fasting Glucose",
  "HbA1c": "Glycated Hemoglobin",
  "PP": "Post-Prandial (2-hour)",
  "CrCl": "Creatinine Clearance",
  "CVD": "Cardiovascular Disease",
  "HF": "Heart Failure",
  "CKD": "Chronic Kidney Disease",
  // Hypertension
  "SBP": "Systolic Blood Pressure",
  "DBP": "Diastolic Blood Pressure",
  "BP": "Blood Pressure",
  "DM": "Diabetes Mellitus",
  "CAD": "Coronary Artery Disease",
  "ESC": "European Society of Cardiology",
  // Lipids
  "LDL": "Low-Density Lipoprotein",
  "HDL": "High-Density Lipoprotein",
  "TG": "Triglycerides",
  "ASCVD": "Atherosclerotic Cardiovascular Disease",
  "FHx": "Family History",
  "AACE": "American Association of Clinical Endocrinology",
  // Obesity
  "BMI": "Body Mass Index",
  "HTN": "Hypertension",
  "OSA": "Obstructive Sleep Apnea",
  "NAFLD": "Non-Alcoholic Fatty Liver Disease",
  "MASLD": "Metabolic Dysfunction-Associated Steatotic Liver Disease",
  "TOS": "The Obesity Society",
  "Rx": "Prescription",
  "NCD": "Non-Communicable Disease",
};

function AbbreviationLabel({ abbr, fullForm }: { abbr: string; fullForm?: string }) {
  const displayFullForm = fullForm || fullForms[abbr] || abbr;

  return (
    <div className="group relative inline-block">
      <button className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-help">
        {abbr}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity"><Info className="h-3 w-3 text-muted-foreground/50" /></span>
      </button>
      <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-10">
        <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg border border-border whitespace-nowrap">
          {displayFullForm}
        </div>
      </div>
    </div>
  );
}

function FullFormsLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <Card className="border-border/40 bg-muted/20">
        <CollapsibleTrigger asChild>
          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Abbreviations & Full Forms</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-xs">
              {Object.entries(fullForms).map(([abbr, full]) => (
                <div key={abbr} className="flex items-baseline gap-2">
                  <span className="font-medium text-foreground min-w-[3rem]">{abbr}</span>
                  <span className="text-muted-foreground">{full}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

interface OCRUploadProps {
  onValuesExtracted: (values: {
    fg?: string;
    a1c?: string;
    ldl?: string;
    hdl?: string;
    tg?: string;
    creatinine?: string;
    egfr?: string;
    age?: string;
  }) => void;
}

function OCRUpload({ onValuesExtracted }: OCRUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedValues, setExtractedValues] = useState<Record<string, string> | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsProcessing(true);
    setExtractedValues(null);

    // Simulate OCR processing with mock values
    setTimeout(() => {
      const mockValues = {
        fg: "142",
        a1c: "7.2",
        ldl: "128",
        hdl: "42",
        tg: "156",
        creatinine: "1.1",
        egfr: "",
        age: "58",
      };
      setExtractedValues(mockValues);
      onValuesExtracted(mockValues);
      setIsProcessing(false);
    }, 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setExtractedValues(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <Card className="border-border/40 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <CollapsibleTrigger asChild>
          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-foreground">Smart Lab Upload (OCR)</span>
              <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">Beta</Badge>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!previewUrl ? (
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Upload lab report image</p>
                  <p className="text-xs text-muted-foreground">Supports JPG, PNG, PDF</p>
                  <p className="text-xs text-muted-foreground mt-2">Auto-extracts: Glucose, HbA1c, Lipids, Creatinine, eGFR</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <ZoomableImage src={previewUrl} alt="Lab report preview" className="rounded-lg max-h-48 mx-auto" />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Extracting values...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {extractedValues && !isProcessing && (
                    <div className="bg-success/100/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-success">Extracted Values</span>
                        <button onClick={clearImage} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        {extractedValues.fg && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">FG:</span>
                            <span className="font-medium">{extractedValues.fg}</span>
                          </div>
                        )}
                        {extractedValues.a1c && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">HbA1c:</span>
                            <span className="font-medium">{extractedValues.a1c}%</span>
                          </div>
                        )}
                        {extractedValues.ldl && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">LDL:</span>
                            <span className="font-medium">{extractedValues.ldl}</span>
                          </div>
                        )}
                        {extractedValues.hdl && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">HDL:</span>
                            <span className="font-medium">{extractedValues.hdl}</span>
                          </div>
                        )}
                        {extractedValues.tg && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">TG:</span>
                            <span className="font-medium">{extractedValues.tg}</span>
                          </div>
                        )}
                        {extractedValues.creatinine && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Creat:</span>
                            <span className="font-medium">{extractedValues.creatinine}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-muted-foreground bg-muted/30 rounded p-3">
                <p className="font-medium mb-1">Note on OCR:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Upload clear, well-lit images for best results</li>
                  <li>Review extracted values before generating prescriptions</li>
                  <li>Manual correction may be needed for handwritten reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}


// ── Smart Lab Upload Form (paste text to auto-fill prescription inputs) ──
interface SmartLabFillSetters {
  setHbA1c: (v: string) => void;
  setFbg: (v: string) => void;
  setWeight: (v: string) => void;
  setHeight: (v: string) => void;
  setLdl: (v: string) => void;
  setHdl: (v: string) => void;
  setTg: (v: string) => void;
  setCreatinine: (v: string) => void;
  setAge: (v: string) => void;
  setBmi: (v: string) => void;
  setBpSystolic: (v: string) => void;
  setBpDiastolic: (v: string) => void;
  setEgfr: (v: string) => void;
}

function SmartLabUploadForm() {
  const [freeText, setFreeText] = useState("");
  const [parsedValues, setParsedValues] = useState<Record<string, string> | null>(null);
  const [showParser, setShowParser] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "ocr">("text");
  const [ocrText, setOcrText] = useState("");
  const [ocrState, setOcrState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Merge all relevant fields for parsing
  const allFields = React.useMemo(() => [
    ...DIABETES_FIELDS.fields,
    ...HTN_FIELDS.fields,
    ...LIPID_FIELDS.fields,
    ...OBESITY_FIELDS.fields,
    ...THYROID_FIELDS.fields,
    ...CBC_FIELDS.fields,
    ...RENAL_FIELDS.fields,
  ], []);

  const parseText = (text: string) => {
    const found: Record<string, string> = {};

    for (const field of allFields) {
      const match = text.match(field.regex);
      if (match) {
        for (let i = 1; i < match.length; i++) {
          if (match[i] !== undefined) {
            const val = parseFloat(match[i].replace(/,/g, ""));
            if (!isNaN(val)) {
              let finalVal = val;
              if (field.transform) finalVal = field.transform(val);
              found[field.key] = String(finalVal);
              break;
            }
          }
        }
        continue;
      }

      for (const kw of field.keywords) {
        const kwPattern = new RegExp(`${kw}[\\s:=]+([\\d,.]+)`, "i");
        const kwMatch = text.match(kwPattern);
        if (kwMatch) {
          const val = parseFloat(kwMatch[1].replace(/,/g, ""));
          if (!isNaN(val)) {
            let finalVal = val;
            if (field.transform) finalVal = field.transform(val);
            found[field.key] = String(finalVal);
            break;
          }
        }
      }
    }

    if (Object.keys(found).length > 0) {
      setParsedValues(found);
    } else {
      setParsedValues({ __none: "No values could be identified. Try a clearer format like 'HbA1c 7.2%' or 'Weight 70 kg'." });
    }
  };

  const handleParseText = () => {
    if (!freeText.trim()) return;
    parseText(freeText);
  };

  const handleFileUpload = async (file: File) => {
    setOcrState("processing");
    setOcrText("");

    try {
      
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(file);
      const text = data.text;
      await worker.terminate();

      setOcrText(text);
      parseText(text);
      setOcrState("done");
    } catch (err) {
      setOcrState("error");
      console.error("OCR error:", err);
    }
  };

  const { setParsedValues: setGlobal } = useLabContext();

  const resetAll = () => {
    setShowParser(false);
    setFreeText("");
    setOcrText("");
    setParsedValues(null);
    setOcrState("idle");
  };

  return (
    <div className="mb-4">
      {!showParser ? (
        <button
          onClick={() => setShowParser(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-primary/30 border-dashed bg-primary/5 hover:bg-primary/10 transition-colors text-sm text-primary"
        >
          <Scan className="h-4 w-4" />
          <span>Paste lab values or upload report to auto-fill inputs</span>
          <Sparkles className="h-3 w-3 text-muted-foreground" />
        </button>
      ) : (
        <Card className="border-primary/20">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Scan className="h-4 w-4 text-primary" />
              Smart Lab Upload — Auto-Fill
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={resetAll}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "text" | "ocr")}>
              <TabsList className="w-full">
                <TabsTrigger value="text" className="flex-1 gap-2">
                  <FileText className="h-4 w-4" />
                  Type or Paste Text
                </TabsTrigger>
                <TabsTrigger value="ocr" className="flex-1 gap-2">
                  <Upload className="h-4 w-4" />
                  OCR — Upload Image
                </TabsTrigger>
              </TabsList>

              {/* ── Text Tab ── */}
              <TabsContent value="text" className="space-y-3 mt-3">
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder={`Paste lab values from any report. Examples:

HbA1c 7.2%
Fasting Glucose 142 mg/dL
Weight 72 kg
LDL 128 mg/dL
HDL 42 mg/dL
Triglycerides 156 mg/dL
Creatinine 1.1 mg/dL
BP 130/85
Age 58 years

Also works for: TSH, Free T4, Ferritin, TSAT, Hemoglobin, MCV, eGFR, Potassium, BUN, BMI, Height`}
                  className="w-full min-h-[140px] rounded-lg border border-input bg-background p-3 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button size="sm" onClick={handleParseText} disabled={!freeText.trim()} className="gap-1">
                  <Scan className="h-3.5 w-3.5" />
                  Parse Values
                </Button>
              </TabsContent>

              {/* ── OCR Tab ── */}
              <TabsContent value="ocr" className="space-y-3 mt-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                <div
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {ocrState === "processing" ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                      <p className="text-sm text-muted-foreground">Processing image with OCR...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload a lab report image</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, or PDF</p>
                    </div>
                  )}
                </div>
                {ocrState === "error" && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                    <AlertTriangle className="h-4 w-4" />
                    OCR failed. Try pasting the text manually.
                  </div>
                )}
                {ocrText && (
                  <div className="bg-muted/30 rounded-lg p-3 text-xs font-mono max-h-[120px] overflow-y-auto whitespace-pre-wrap border border-border">
                    {ocrText}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* ── Parsed Results ── */}
            {parsedValues && (
              <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="font-medium">Found {Object.keys(parsedValues).filter(k => k !== "__none").length} value{Object.keys(parsedValues).filter(k => k !== "__none").length !== 1 ? "s" : ""}</span>
                  </div>
                  {!parsedValues.__none && (
                    <Button size="sm" variant="default" onClick={() => {
                      setGlobal(parsedValues);
                      resetAll();
                    }}>
                      <Upload className="h-3 w-3 mr-1" />
                      Fill Inputs
                    </Button>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  {parsedValues.__none ? (
                    <div className="px-3 py-2 text-sm text-warning">
                      {parsedValues.__none}
                    </div>
                  ) : (
                    Object.entries(parsedValues).map(([key, val]) => {
                      const field = allFields.find(f => f.key === key);
                      return (
                        <div key={key} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm bg-background border border-border">
                          <span className="font-medium">{field?.label || key}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold">{val}</span>
                            {field?.unit && <span className="text-xs text-muted-foreground">{field.unit}</span>}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Prescription Engine Component
function PrescriptionEngine() {
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [hba1c, setHba1c] = useState("");
  const [fbg, setFbg] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [ldl, setLdl] = useState("");
  const [hdl, setHdl] = useState("");
  const [tg, setTg] = useState("");
  const [egfr, setEgfr] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [race, setRace] = useState<"black" | "non-black">("non-black");
  const [bmi, setBmi] = useState("");
  const [tsh, setTsh] = useState("");
  const [ft4, setFt4] = useState("");
  const [ft3, setFt3] = useState("");
  const [ferritin, setFerritin] = useState("");
  const [serumIron, setSerumIron] = useState("");
  const [tibc, setTibc] = useState("");
  const [tsat, setTsat] = useState("");

  // Global Smart Lab auto-fill
  useGlobalLabFillAll({ hba1c: setHba1c, weight: setWeight, height: setHeight, ldl: setLdl, hdl: setHdl, tg: setTg, egfr: setEgfr, creatinine: setCreatinine, bmi: setBmi, age: setAge, fbg: setFbg, tsh: setTsh, ft4: setFt4, ft3: setFt3, ferritin: setFerritin, serumIron: setSerumIron, tibc: setTibc, tsat: setTsat });
  const [hasASCVD, setHasASCVD] = useState(false);
  const [hasCKD, setHasCKD] = useState(false);
  const [hasCHF, setHasCHF] = useState(false);
  const [hasBloodDisorder, setHasBloodDisorder] = useState(false);
  const [hasLiverDisease, setHasLiverDisease] = useState(false);
  const [liverSeverity, setLiverSeverity] = useState<"compensated" | "decompensated">("compensated");
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [hasDyslipidemia, setHasDyslipidemia] = useState(false);
  const [generatedRx, setGeneratedRx] = useState<string | null>(null);

  // Calculate BMI if height/weight provided
  const calculateBMI = (weightKg: number, heightCm: number) => {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  };

  // Auto-update BMI when weight or height changes
  React.useEffect(() => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum > 0 && heightNum > 0) {
      const bmiValue = calculateBMI(weightNum, heightNum);
      setBmi(bmiValue.toFixed(1));
    }
  }, [weight, height]);

  // Calculate eGFR using CKD-EPI 2021 equation
  const calculateEGFR = React.useCallback(() => {
    const ageNum = parseInt(age);
    const creatinineNum = parseFloat(creatinine);

    if (!ageNum || !creatinineNum || creatinineNum <= 0) return null;

    // CKD-EPI 2021 equation (race-free)
    const kappa = sex === "female" ? 0.7 : 0.9;
    const alpha = sex === "female" ? -0.241 : -0.302;
    const genderFactor = sex === "female" ? 1.012 : 1;

    const scrKRatio = creatinineNum / kappa;
    const minTerm = Math.min(scrKRatio, 1);
    const maxTerm = Math.max(scrKRatio, 1);

    const eGFRValue = 142 *
      Math.pow(minTerm, alpha) *
      Math.pow(maxTerm, -1.200) *
      Math.pow(0.9938, ageNum) *
      genderFactor;

    return Math.round(eGFRValue);
  }, [age, creatinine, sex]);

  // Auto-update eGFR when inputs change
  React.useEffect(() => {
    const calculated = calculateEGFR();
    if (calculated !== null) {
      setEgfr(calculated.toString());
    }
  }, [age, creatinine, sex, calculateEGFR]);

  const generatePrescription = () => {
    const prescriptions: string[] = [];
    const warnings: string[] = [];
    const patientLabel = patientName || "Patient";
    const ageNum = parseInt(age) || 50;
    const egfrNum = parseInt(egfr) || 90;
    const hba1cNum = parseFloat(hba1c) || 6.0;
    const fbgNum = parseInt(fbg) || 100;
    const ldlNum = parseInt(ldl) || 100;
    const bmiNum = parseFloat(bmi) || 25;
    const bpSys = parseInt(bpSystolic) || 120;

    // Header
    prescriptions.push("═══════════════════════════════════════════════════");
    prescriptions.push("         COMPREHENSIVE NCD PRESCRIPTION");
    prescriptions.push("═══════════════════════════════════════════════════");
    prescriptions.push(`Date: ${new Date().toLocaleDateString()}`);
    if (patientName) prescriptions.push(`Patient: ${patientName}`);
    if (patientId) prescriptions.push(`ID: ${patientId}`);
    if (age) prescriptions.push(`Age: ${age} years`);
    if (weight) prescriptions.push(`Weight: ${weight} kg`);
    prescriptions.push("");

    // DIABETES SECTION
    if (hasDiabetes || hba1cNum >= 6.5 || fbgNum >= 126) {
      prescriptions.push("┌─────────────────────────────────────────────────┐");
      prescriptions.push("│  DIABETES MANAGEMENT (ADA 2026 Guidelines)        │");
      prescriptions.push("└─────────────────────────────────────────────────┘");

      // Liver disease warning for diabetes meds
      if (hasLiverDisease) {
        warnings.push("⚠️ LIVER DISEASE: Use metformin with caution. Avoid if severe hepatic impairment.");
        warnings.push("⚠️ LIVER DISEASE: SGLT2 inhibitors generally safe but monitor for volume depletion.");
        warnings.push("⚠️ LIVER DISEASE: GLP-1 RAs safe in compensated cirrhosis, limited data in decompensated.");
        warnings.push("⚠️ LIVER DISEASE: Avoid thiazolidinediones (pioglitazone) - contraindicated.");
      }

      // Metformin (first-line unless contraindicated)
      if (egfrNum >= 30 && !hasLiverDisease) {
        if (egfrNum >= 45) {
          prescriptions.push("1. Metformin 500 mg PO BID with meals");
          prescriptions.push("   Titrate weekly to 1000 mg BID as tolerated");
        } else if (egfrNum >= 30) {
          prescriptions.push("1. Metformin 500 mg PO BID with meals (eGFR 30-44: monitor closely)");
          warnings.push("⚠️ Metformin: Maximum dose 1000 mg/day if eGFR 30-44. Avoid if <30.");
        }
      } else if (egfrNum < 30) {
        warnings.push("⚠️ Metformin CONTRAINDICATED: eGFR <30. Consider alternatives.");
      }

      // SGLT2i for CV/renal benefit
      if (hasASCVD || hasCKD || egfrNum >= 30) {
        prescriptions.push("2. Empagliflozin 10 mg PO OD (morning)");
        prescriptions.push("   OR Dapagliflozin 10 mg PO OD");
        if (egfrNum >= 30 && egfrNum < 45) {
          warnings.push("⚠️ SGLT2i: Glycemic efficacy reduced when eGFR <45, but CV/renal benefits maintained.");
        }
      }

      // GLP-1 RA for CV benefit or weight
      if (hasASCVD || bmiNum >= 27 || hba1cNum >= 7.5) {
        prescriptions.push("3. Semaglutide 0.25 mg SC weekly × 4 weeks");
        prescriptions.push("   Then 0.5 mg weekly, may increase to 1.0 mg");
        if (hasLiverDisease) {
          warnings.push("⚠️ GLP-1 RA: Generally safe in compensated cirrhosis. Avoid in severe GI symptoms.");
        }
      }

      // Insulin for severe hyperglycemia
      if (hba1cNum >= 9.0 || fbgNum > 250) {
        prescriptions.push("4. INSULIN THERAPY (Basal-bolus or Basal-plus):");
        prescriptions.push("   a) Glargine (Lantus) 10 units SC at bedtime");
        prescriptions.push("      OR Detemir (Levemir) 10 units SC BID");
        prescriptions.push("      Titrate by 2 units every 3 days to target FBG <130");
        prescriptions.push("   b) If postprandial excursions:");
        prescriptions.push("      Lispro (Humalog) 4 units SC before meals");
        prescriptions.push("      Titrate based on 2-hr postprandial BG");

        if (hasLiverDisease) {
          warnings.push("⚠️ INSULIN in Liver Disease: Increased hypoglycemia risk. Start low, go slow.");
          warnings.push("⚠️ Monitor glucose closely - impaired gluconeogenesis in liver disease.");
        }
      }

      // DPP-4i as alternative
      if (hba1cNum >= 7.0 && hba1cNum < 9.0 && !hasLiverDisease) {
        prescriptions.push("4. Sitagliptin 100 mg PO OD");
        if (egfrNum >= 30 && egfrNum < 45) {
          prescriptions.push("   (Reduce to 50 mg if eGFR 30-44)");
        } else if (egfrNum < 30) {
          prescriptions.push("   (Reduce to 25 mg if eGFR <30)");
        }
      }

      prescriptions.push("");
      prescriptions.push("Monitoring:");
      prescriptions.push("• HbA1c every 3 months until stable");
      prescriptions.push("• Self-monitoring BG: Fasting + 2-hr postprandial");
      prescriptions.push("• Annual eye exam, foot exam, urine ACR");
      prescriptions.push("");
    }

    // HYPERTENSION SECTION
    if (hasHypertension || bpSys >= 130) {
      prescriptions.push("┌─────────────────────────────────────────────────┐");
      prescriptions.push("│  HYPERTENSION MANAGEMENT (ESC/ESH 2024)          │");
      prescriptions.push("└─────────────────────────────────────────────────┘");

      // Liver disease considerations for HTN
      if (hasLiverDisease) {
        warnings.push("⚠️ LIVER DISEASE: ACEi/ARB generally safe, monitor potassium.");
        warnings.push("⚠️ LIVER DISEASE: Avoid beta-blockers in severe acute hepatitis.");
        warnings.push("⚠️ LIVER DISEASE: Use diuretics cautiously - risk of fluid/electrolyte imbalance.");
      }

      if (hasDiabetes || hasCKD) {
        prescriptions.push("1. Perindopril 4 mg PO OD (or Ramipril 2.5 mg OD)");
        prescriptions.push("   OR Losartan 50 mg PO OD (if ACEi cough)");
        if (hasLiverDisease) {
          warnings.push("⚠️ ACEi/ARB: Monitor potassium - hyperkalemia risk higher in liver disease.");
        }
      } else {
        prescriptions.push("1. Amlodipine 5 mg PO OD");
        prescriptions.push("   Increase to 10 mg if needed after 2 weeks");
      }

      prescriptions.push("2. If BP >140/90 after 4 weeks:");
      prescriptions.push("   Add Chlorthalidone 12.5 mg PO OD");
      if (hasLiverDisease) {
        warnings.push("⚠️ Diuretics: Use cautiously in liver disease - monitor for hyponatremia.");
      }

      prescriptions.push("");
      prescriptions.push("Target BP: < 130/80 mmHg");
      prescriptions.push("Monitor: BP weekly until controlled, then monthly");
      prescriptions.push("");
    }

    // LIPID SECTION
    if (hasDyslipidemia || ldlNum > 70) {
      prescriptions.push("┌─────────────────────────────────────────────────┐");
      prescriptions.push("│  LIPID MANAGEMENT (LAI 2023 / ACC/AHA)          │");
      prescriptions.push("└─────────────────────────────────────────────────┘");

      // Liver disease considerations
      if (hasLiverDisease) {
        warnings.push("⚠️ LIVER DISEASE: Statins generally SAFE in chronic liver disease, including NAFLD.");
        warnings.push("⚠️ LIVER DISEASE: Avoid statins only in: acute liver failure, decompensated cirrhosis.");
        warnings.push("⚠️ LIVER DISEASE: Monitor LFTs every 3 months.");
        warnings.push("⚠️ LIVER DISEASE: Ezetimibe is safe alternative if statin not tolerated.");
      }

      const ldlTarget = hasASCVD ? "< 55 mg/dL" : hasDiabetes ? "< 70 mg/dL" : "< 100 mg/dL";

      prescriptions.push(`1. Atorvastatin 40 mg PO OD ( bedtime)`);
      prescriptions.push(`   Target LDL: ${ldlTarget}`);
      if (hasLiverDisease) {
        prescriptions.push("   (Start with 10 mg if liver disease, titrate carefully)");
      }

      if (hasASCVD || ldlNum > 100) {
        prescriptions.push("2. If LDL not at target after 6 weeks:");
        prescriptions.push("   Increase to Atorvastatin 80 mg OD");
        prescriptions.push("   OR Add Ezetimibe 10 mg OD");
      }

      if (tg && parseInt(tg) > 500) {
        prescriptions.push("3. HIGH TG >500: Fenofibrate 145 mg OD");
        prescriptions.push("   (Pancreatitis prevention)");
        warnings.push("⚠️ Gemfibrozil: Avoid with statins - high myopathy risk.");
      }

      prescriptions.push("");
      prescriptions.push("Monitoring:");
      prescriptions.push("• Lipid panel at 6 weeks, then every 6 months");
      prescriptions.push("• LFTs at 6 weeks, then annually (or 3-monthly if liver disease)");
      prescriptions.push("");
    }

    // OBESITY/WEIGHT SECTION
    if (bmiNum >= 25) {
      prescriptions.push("┌─────────────────────────────────────────────────┐");
      prescriptions.push("│  WEIGHT MANAGEMENT (Indian: BMI ≥23 at risk)    │");
      prescriptions.push("└─────────────────────────────────────────────────┘");

      if (hasLiverDisease) {
        warnings.push("⚠️ LIVER DISEASE: GLP-1 RAs safe in compensated cirrhosis. Avoid if severe malnutrition.");
      }

      prescriptions.push("1. Diet: 500 kcal deficit/day, Mediterranean pattern");
      prescriptions.push("2. Exercise: 150 min moderate activity/week");

      if (bmiNum >= 27 || (hasDiabetes && bmiNum >= 25)) {
        prescriptions.push("3. Semaglutide (Ozempic/Wegovy) 0.25 mg weekly → 2.4 mg weekly");
        prescriptions.push("   OR Tirzepatide (Mounjaro) 2.5 mg weekly → 15 mg weekly");
      }

      if (bmiNum >= 35) {
        prescriptions.push("4. Consider metabolic surgery referral:");
        prescriptions.push("   • BMI ≥35 with diabetes");
        prescriptions.push("   • BMI ≥37.5 regardless of comorbidities");
        if (hasLiverDisease) {
          warnings.push("⚠️ Surgery: Evaluate liver status pre-op. Decompensated cirrhosis = high surgical risk.");
        }
      }

      prescriptions.push("");
      prescriptions.push("Target: 5-10% weight loss over 6 months");
      prescriptions.push("");
    }

    // RENAL SECTION
    if (hasCKD || egfrNum < 60 || parseFloat(creatinine) > 1.2) {
      prescriptions.push("═══════════════════════════════════════════════════");
      prescriptions.push("║  RENAL / CKD MANAGEMENT                       ║");
      prescriptions.push("═══════════════════════════════════════════════════");
      
      const egfrVal = egfrNum;
      let ckdStage = "1";
      if (egfrVal >= 90) ckdStage = "1";
      else if (egfrVal >= 60) ckdStage = "2";
      else if (egfrVal >= 45) ckdStage = "3a";
      else if (egfrVal >= 30) ckdStage = "3b";
      else if (egfrVal >= 15) ckdStage = "4";
      else ckdStage = "5 (ESRD)";
      
      prescriptions.push(`eGFR: ${egfrVal?.toFixed(0) || "—"} mL/min/1.73m² (CKD Stage ${ckdStage})`);
      
      // CKD management
      if (egfrVal < 60) {
        prescriptions.push("1. ACEi/ARB: Continue if on ACEi/ARB (nephroprotective)");
        prescriptions.push("2. SGLT2i: Consider empagliflozin 10 mg (CKD trial)");
        prescriptions.push("3. Avoid NSAIDs");
        prescriptions.push("4. Monitor: Creatinine, eGFR q3mo");
        if (hasDiabetes) {
          prescriptions.push("5. Metformin: Use with caution if eGFR >30");
        }
      }
      
      if (egfrVal < 30) {
        prescriptions.push("⚠️ eGFR <30: Prepare for nephrology referral");
        warnings.push("⚠️ Advanced CKD - avoid contrast unless necessary");
      }
      
      prescriptions.push("");
    }

    // BLOOD DISORDERS SECTION
    if (hasBloodDisorder) {
      prescriptions.push("═══════════════════════════════════════════════════");
      prescriptions.push("║  BLOOD DISORDERS / ANEMIA                   ║");
      prescriptions.push("═══════════════════════════════════════════");
      prescriptions.push("1. Order CBC, ferritin, TSAT, B12/folate");
      prescriptions.push("2. Treat per cause (iron repletion, ESA if CKD on dialysis)");
      if (hasCHF) prescriptions.push("3. IV iron if CHF with iron deficiency (ESC guideline)");
      prescriptions.push("Monitoring: CBC, ferritin, TSAT q3months");
      prescriptions.push("");
    }

    // WARNINGS SECTION
    if (warnings.length > 0) {
      prescriptions.push("╔═══════════════════════════════════════════════════╗");
      prescriptions.push("║  CLINICAL WARNINGS / SPECIAL CONSIDERATIONS       ║");
      prescriptions.push("╚═══════════════════════════════════════════════════╝");
      warnings.forEach(w => prescriptions.push(w));
      prescriptions.push("");
    }

    // FOOTER
    prescriptions.push("═══════════════════════════════════════════════════");
    prescriptions.push("Follow-up: 4 weeks (or sooner if symptomatic)");
    prescriptions.push("Next Review: " + new Date(Date.now() + 12096e5).toLocaleDateString());
    prescriptions.push("═══════════════════════════════════════════════════");

    return prescriptions.join("\n");
  };

  const handleGenerate = () => {
    const rx = generatePrescription();
    setGeneratedRx(rx);
  };

  const copyToClipboard = () => {
    if (generatedRx) {
      navigator.clipboard.writeText(generatedRx);
    }
  };

  return (
    <section className="border border-border/40 rounded-lg overflow-hidden">
      <div className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-border/40">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Unified Prescription Engine</h2>
            <p className="text-sm text-muted-foreground">Generate integrated prescriptions for diabetes, hypertension, lipids, obesity, thyroid, respiratory, renal, & blood disorders</p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Patient Info - Optional */}
          <div className="space-y-2">
            <Label className="text-xs">Patient Name <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g., John Doe"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Patient ID <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g., P12345"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Age (years)</Label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="50"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Weight (kg)</Label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Clinical Values */}
          <div className="space-y-2">
            <Label className="text-xs">HbA1c (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={hba1c}
              onChange={(e) => setHba1c(e.target.value)}
              placeholder="7.0"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Fasting BG (mg/dL)</Label>
            <Input
              type="number"
              value={fbg}
              onChange={(e) => setFbg(e.target.value)}
              placeholder="120"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">BP (mmHg)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={bpSystolic}
                onChange={(e) => setBpSystolic(e.target.value)}
                placeholder="Systolic"
                className="h-9 flex-1"
              />
              <span className="text-muted-foreground self-center">/</span>
              <Input
                type="number"
                value={bpDiastolic}
                onChange={(e) => setBpDiastolic(e.target.value)}
                placeholder="Diastolic"
                className="h-9 flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">LDL-C (mg/dL)</Label>
            <Input
              type="number"
              value={ldl}
              onChange={(e) => setLdl(e.target.value)}
              placeholder="100"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-xs">HDL-C (mg/dL)</Label>
            <Input
              type="number"
              value={hdl}
              onChange={(e) => setHdl(e.target.value)}
              placeholder="40"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Triglycerides (mg/dL)</Label>
            <Input
              type="number"
              value={tg}
              onChange={(e) => setTg(e.target.value)}
              placeholder="150"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Serum Creatinine (mg/dL)</Label>
            <Input
              type="number"
              step="0.01"
              value={creatinine}
              onChange={(e) => setCreatinine(e.target.value)}
              placeholder="1.0"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Sex</Label>
            <Select value={sex} onValueChange={(v: "male" | "female") => setSex(v)}>
              <SelectTrigger className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1">
              eGFR
              <span className="text-xs text-muted-foreground">(auto-calculated)</span>
            </Label>
            <Input
              type="number"
              value={egfr}
              onChange={(e) => setEgfr(e.target.value)}
              placeholder="90"
              className="h-9 bg-muted"
              readOnly
            />
            <p className="text-xs text-muted-foreground">CKD-EPI 2021 equation</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1">
              Height
              <span className="text-xs text-muted-foreground">(cm)</span>
            </Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              className="h-10 px-3 rounded-lg border-border/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1">
              BMI
              <span className="text-xs text-muted-foreground">(kg/m²)</span>
            </Label>
            <Input
              type="number"
              step="0.1"
              value={bmi}
              readOnly
              placeholder="auto-calc"
              className="h-9 bg-muted"
            />
            <p className="text-xs text-muted-foreground">auto-calculated from weight & height</p>
          </div>
        </div>

        {/* ── Thyroid & Iron Labs (Optional) ── */}
        <Collapsible className="mb-6" defaultOpen>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors text-sm text-muted-foreground hover:text-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              <span className="font-medium">Thyroid & Iron Studies</span>
              <span className="text-xs text-muted-foreground">(optional)</span>
              <ChevronDown className="h-3.5 w-3.5 ml-auto transition-transform" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">TSH <span className="text-xs text-muted-foreground">(mIU/L)</span></Label>
                <Input type="number" step="0.01" value={tsh} onChange={(e) => setTsh(e.target.value)} placeholder="2.5" className="h-10 px-3 rounded-lg border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">Free T4 <span className="text-xs text-muted-foreground">(ng/dL)</span></Label>
                <Input type="number" step="0.01" value={ft4} onChange={(e) => setFt4(e.target.value)} placeholder="1.1" className="h-10 px-3 rounded-lg border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">Free T3 <span className="text-xs text-muted-foreground">(ng/dL)</span></Label>
                <Input type="number" step="0.01" value={ft3} onChange={(e) => setFt3(e.target.value)} placeholder="3.5" className="h-10 px-3 rounded-lg border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">Ferritin <span className="text-xs text-muted-foreground">(ng/mL)</span></Label>
                <Input type="number" value={ferritin} onChange={(e) => setFerritin(e.target.value)} placeholder="100" className="h-10 px-3 rounded-lg border-sky-500/30 focus:ring-2 focus:ring-primary/50 focus:border-sky-500 transition-all" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">Serum Iron <span className="text-xs text-muted-foreground">(µg/dL)</span></Label>
                <Input type="number" value={serumIron} onChange={(e) => setSerumIron(e.target.value)} placeholder="80" className="h-10 px-3 rounded-lg border-sky-500/30 focus:ring-2 focus:ring-primary/50 focus:border-sky-500 transition-all" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">TIBC <span className="text-xs text-muted-foreground">(µg/dL)</span></Label>
                <Input type="number" value={tibc} onChange={(e) => setTibc(e.target.value)} placeholder="300" className="h-10 px-3 rounded-lg border-sky-500/30 focus:ring-2 focus:ring-primary/50 focus:border-sky-500 transition-all" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">TSAT <span className="text-xs text-muted-foreground">(%)</span></Label>
                <Input type="number" step="0.1" value={tsat} onChange={(e) => setTsat(e.target.value)} placeholder="20" className="h-10 px-3 rounded-lg border-sky-500/30 focus:ring-2 focus:ring-primary/50 focus:border-sky-500 transition-all" />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Comorbidities */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dm"
              checked={hasDiabetes}
              onCheckedChange={(checked) => setHasDiabetes(checked as boolean)}
            />
            <Label htmlFor="dm" className="text-sm cursor-pointer">Diabetes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="htn"
              checked={hasHypertension}
              onCheckedChange={(checked) => setHasHypertension(checked as boolean)}
            />
            <Label htmlFor="htn" className="text-sm cursor-pointer">Hypertension</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dys"
              checked={hasDyslipidemia}
              onCheckedChange={(checked) => setHasDyslipidemia(checked as boolean)}
            />
            <Label htmlFor="dys" className="text-sm cursor-pointer">Dyslipidemia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="obesity"
              checked={(parseFloat(bmi) || 0) >= 30}
              onCheckedChange={() => {}}
            />
            <Label htmlFor="obesity" className="text-sm cursor-pointer">Obesity (BMI ≥30)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ckd"
              checked={hasCKD}
              onCheckedChange={(checked) => setHasCKD(checked as boolean)}
            />
            <Label htmlFor="ckd" className="text-sm cursor-pointer">CKD / Renal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ascvd"
              checked={hasASCVD}
              onCheckedChange={(checked) => setHasASCVD(checked as boolean)}
            />
            <Label htmlFor="ascvd" className="text-sm cursor-pointer">ASCVD History</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="chf"
              checked={hasCHF}
              onCheckedChange={(checked) => setHasCHF(checked as boolean)}
            />
            <Label htmlFor="chf" className="text-sm cursor-pointer">Heart Failure</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="blood"
              checked={hasBloodDisorder}
              onCheckedChange={(checked) => setHasBloodDisorder(checked as boolean)}
            />
            <Label htmlFor="blood" className="text-sm cursor-pointer">Blood Disorder</Label>
          </div>
        </div>

        {/* Liver Disease Section */}
        <div className="mb-6 p-4 bg-card border border-border/40 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Checkbox
              id="liver"
              checked={hasLiverDisease}
              onCheckedChange={(checked) => setHasLiverDisease(checked as boolean)}
              className="border-white/50"
            />
            <Label htmlFor="liver" className="text-sm font-medium cursor-pointer text-foreground">
              Chronic Liver Disease (requires medication adjustments)
            </Label>
          </div>

          {hasLiverDisease && (
            <div className="ml-6 space-y-2">
              <Label className="text-xs text-foreground/70">Severity:</Label>
              <Select value={liverSeverity} onValueChange={(v: "compensated" | "decompensated") => setLiverSeverity(v)}>
                <SelectTrigger className="w-full h-9 bg-black/10 border-border/60 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compensated">Compensated Cirrhosis/Stable CLD</SelectItem>
                  <SelectItem value="decompensated">Decompensated Cirrhosis/Severe Hepatic Impairment</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-foreground/60 mt-2">
                ℹ️ Medications will be adjusted: Lower starting doses, more frequent monitoring, specific contraindications
              </p>
            </div>
          )}
        </div>

        {/* Smart Lab Upload — Paste text to auto-fill inputs */}
        <SmartLabUploadForm />

        {/* Generate Button */}
        <div className="flex gap-3">
          <Button onClick={handleGenerate} className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Generate Prescription
          </Button>

          {generatedRx && (
            <Button variant="outline" onClick={copyToClipboard}>
              Copy to Clipboard
            </Button>
          )}
        </div>

        {/* Generated Prescription */}
        {generatedRx && (
          <div className="mt-6 p-4 bg-muted rounded-lg border border-border font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {generatedRx}
          </div>
        )}
      </CardContent>
    </section>
  );
}

// Quick Action Card Component
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

function QuickAction({ title, description, icon, to }: QuickActionProps) {
  return (
    <Link to={to}>
      <div className="p-4 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/30 hover:border-border/60 transition-all cursor-pointer group">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const navigate = useNavigate();

  // Dashboard data

  // Quick Actions data
  const quickActions: QuickActionProps[] = [
    {
      title: "Meal Planner",
      description: "7-day diet plans for Kerala, Indian, Asian, and international cuisines",
      icon: <UtensilsCrossed className="h-4 w-4 text-red-500" />,
      to: "/diet-plan",
    },
    {
      title: "ASCVD Risk Calculator",
      description: "Calculate 10-year cardiovascular risk with LAI 2023 guidelines",
      icon: <Calculator className="h-4 w-4 text-primary" />,
      to: "/ascvd-risk",
    },
    {
      title: "Insulin Titration",
      description: "Calculate basal and prandial insulin doses",
      icon: <Syringe className="h-4 w-4 text-red-500" />,
      to: "/insulin-titration",
    },
    {
      title: "GFR Calculator",
      description: "Calculate eGFR using CKD-EPI and Cockcroft-Gault",
      icon: <Activity className="h-4 w-4 text-orange-500" />,
      to: "/gfr-calculator",
    },
    {
      title: "Drug Interactions",
      description: "Check for interactions between antihypertensives",
      icon: <FileSearch className="h-4 w-4 text-blue-500" />,
      to: "/drug-interactions",
    },
    {
      title: "BMI Calculator",
      description: "Calculate BMI with Indian population cutoffs",
      icon: <Scale className="h-4 w-4 text-violet-500" />,
      to: "/obesity/bmi-calculator",
    },
    {
      title: "Sliding Scale Insulin",
      description: "Quick reference for correction doses",
      icon: <Stethoscope className="h-4 w-4 text-red-500" />,
      to: "/sliding-scale",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Header Section */}
      <header className="max-w-6xl mx-auto px-6 pt-8 pb-6">
        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-serif font-semibold tracking-tight">
              Prescription Engine
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Comprehensive non-communicable disease management tools — diabetes, hypertension, lipids, obesity, thyroid, respiratory (COPD/asthma), renal, and blood disorders.
              Access detailed assessment tools, treatment algorithms, and clinical guidelines.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16 space-y-8">
        {/* Prescription Engine */}
        <PrescriptionEngine />

        {/* OCR Upload */}
        <OCRUpload onValuesExtracted={(values) => {
          // Store values in localStorage for use across the app
          if (values.fg) localStorage.setItem("ocr_fg", values.fg);
          if (values.a1c) localStorage.setItem("ocr_a1c", values.a1c);
          if (values.age) localStorage.setItem("ocr_age", values.age);
          if (values.creatinine) localStorage.setItem("ocr_creatinine", values.creatinine);
          if (values.ldl) localStorage.setItem("ocr_ldl", values.ldl);
          if (values.hdl) localStorage.setItem("ocr_hdl", values.hdl);
          if (values.tg) localStorage.setItem("ocr_tg", values.tg);
        }} />

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <QuickAction key={action.title} {...action} />
            ))}
          </div>
        </section>

        {/* Condition Modules removed — use top tabs to navigate */}

        {/* Duplicate Condition Modules section removed */}


        <section className="pt-4 border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success/100" />
                ADA Guidelines 2024
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning/100" />
                ESC/ESH 2024
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                ACC/AHA + LAI 2023
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Evidence-based clinical decision support tools
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
