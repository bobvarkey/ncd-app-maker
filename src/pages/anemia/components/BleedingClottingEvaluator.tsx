import { useMemo, useState } from "react";
import { Activity, Droplets, AlertTriangle, ClipboardList, FlaskConical, Stethoscope } from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Mode = "bleeding" | "clotting";

/* ------------------------------- BLEEDING -------------------------------- */

type PtAptt = "" | "normal" | "prolonged";
type PltState = "" | "low" | "normal";
type Schisto = "" | "yes" | "no";
type MixCorrect = "" | "corrects" | "no";

function BleedingAlgorithm() {
  const [plt, setPlt] = useState<PltState>("");
  const [pt, setPt] = useState<PtAptt>("");
  const [aptt, setAptt] = useState<PtAptt>("");
  const [schisto, setSchisto] = useState<Schisto>("");
  const [fibrinogenLow, setFibrinogenLow] = useState(false);
  const [mix, setMix] = useState<MixCorrect>("");

  const interpretation = useMemo(() => {
    const lines: { label: string; tone: "danger" | "warning" | "primary" | "neutral" }[] = [];

    if (plt === "low") {
      if (schisto === "yes") {
        if (pt === "prolonged" || aptt === "prolonged" || fibrinogenLow) {
          lines.push({ label: "DIC — schistocytes + thrombocytopenia + prolonged PT/aPTT or low fibrinogen.", tone: "danger" });
          lines.push({ label: "Next: D-dimer, fibrinogen trend, treat underlying cause.", tone: "neutral" });
        } else {
          lines.push({ label: "TTP / HUS likely — schistocytes + thrombocytopenia with normal PT/aPTT.", tone: "danger" });
          lines.push({ label: "Next: LDH, haptoglobin, indirect bilirubin, creatinine, ADAMTS13.", tone: "neutral" });
        }
      } else if (schisto === "no") {
        lines.push({ label: "Isolated thrombocytopenia — ITP, drug-induced, marrow failure, hypersplenism.", tone: "warning" });
        lines.push({ label: "Next: medication review, HIV/HCV, ANA, marrow studies if indicated.", tone: "neutral" });
      }
    } else if (plt === "normal") {
      if (pt === "prolonged" && aptt === "normal") {
        lines.push({ label: "Isolated ↑PT — vitamin K deficiency, warfarin, factor VII deficiency, early liver disease.", tone: "primary" });
      } else if (pt === "normal" && aptt === "prolonged") {
        lines.push({ label: "Isolated ↑aPTT — heparin, lupus anticoagulant, factor VIII/IX/XI deficiency, vWD.", tone: "primary" });
      } else if (pt === "prolonged" && aptt === "prolonged") {
        lines.push({ label: "Both ↑PT and ↑aPTT — severe factor deficiency, DIC, advanced liver disease, massive transfusion, severe vit K deficiency.", tone: "danger" });
      } else if (pt === "normal" && aptt === "normal") {
        lines.push({ label: "Normal screen with bleeding — vWD, platelet function disorder, factor XIII deficiency, vascular/connective tissue cause.", tone: "warning" });
        lines.push({ label: "Next: vWF Ag / activity, factor VIII, PFA-100, factor XIII (urea clot solubility).", tone: "neutral" });
      }

      if ((pt === "prolonged" || aptt === "prolonged") && mix) {
        if (mix === "corrects") {
          lines.push({ label: "Mixing study corrects → factor deficiency. Order specific factor assays.", tone: "primary" });
        } else {
          lines.push({ label: "Mixing study does NOT correct → inhibitor or anticoagulant effect (e.g., lupus anticoagulant, acquired hemophilia, heparin).", tone: "danger" });
        }
      }
    }

    return lines;
  }, [plt, pt, aptt, schisto, fibrinogenLow, mix]);

  return (
    <div className="space-y-4">
      <SectionCard title="Step 1 — Clinical phenotype" icon={<Stethoscope className="h-4 w-4" />} tone="primary" defaultOpen>
        <div className="grid gap-3 md:grid-cols-2 text-sm">
          <div className="rounded-md border border-border bg-card p-3">
            <p className="font-semibold mb-1">Platelet / vWF pattern</p>
            <p className="text-muted-foreground">Mucocutaneous bleeding, petechiae, epistaxis, gum bleeding, menorrhagia, immediate post-procedure bleeding.</p>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <p className="font-semibold mb-1">Coagulation factor pattern</p>
            <p className="text-muted-foreground">Deep tissue bleeding, hemarthrosis, muscle hematomas, delayed post-procedure bleeding.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          ISTH-BAT bleeding score cutoff: ≥3 in males, ≥5 in females, ≥3 in children = abnormal.
        </p>
      </SectionCard>

      <SectionCard title="Step 2 — First-line labs" icon={<FlaskConical className="h-4 w-4" />} tone="accent" defaultOpen>
        <div className="grid gap-3 md:grid-cols-2 text-sm">
          <Field label="Platelet count">
            <Select value={plt} onChange={(v) => setPlt(v as PltState)} options={[
              { value: "", label: "Select…" },
              { value: "low", label: "Low" },
              { value: "normal", label: "Normal" },
            ]} />
          </Field>
          <Field label="PT / INR">
            <Select value={pt} onChange={(v) => setPt(v as PtAptt)} options={[
              { value: "", label: "Select…" },
              { value: "normal", label: "Normal" },
              { value: "prolonged", label: "Prolonged" },
            ]} />
          </Field>
          <Field label="aPTT">
            <Select value={aptt} onChange={(v) => setAptt(v as PtAptt)} options={[
              { value: "", label: "Select…" },
              { value: "normal", label: "Normal" },
              { value: "prolonged", label: "Prolonged" },
            ]} />
          </Field>
          <Field label="Schistocytes on smear">
            <Select value={schisto} onChange={(v) => setSchisto(v as Schisto)} options={[
              { value: "", label: "Select…" },
              { value: "yes", label: "Present" },
              { value: "no", label: "Absent" },
            ]} />
          </Field>
          <Field label="Fibrinogen low?">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={fibrinogenLow} onChange={(e) => setFibrinogenLow(e.target.checked)} />
              <span>Yes, fibrinogen below normal</span>
            </label>
          </Field>
          <Field label="Mixing study (if PT/aPTT prolonged)">
            <Select value={mix} onChange={(v) => setMix(v as MixCorrect)} options={[
              { value: "", label: "Not done" },
              { value: "corrects", label: "Corrects" },
              { value: "no", label: "Does NOT correct" },
            ]} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Interpretation" icon={<ClipboardList className="h-4 w-4" />} tone="warning" defaultOpen>
        {interpretation.length === 0 ? (
          <p className="text-sm text-muted-foreground">Enter platelet count and PT/aPTT to see interpretation.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {interpretation.map((l, i) => (
              <li key={i} className={`rounded-md border px-3 py-2 ${toneClass(l.tone)}`}>{l.label}</li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="PT/aPTT pattern reference" icon={<ClipboardList className="h-4 w-4" />} tone="neutral" defaultOpen={false}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PT</TableHead>
              <TableHead>aPTT</TableHead>
              <TableHead>Likely cause</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>↑</TableCell><TableCell>Normal</TableCell><TableCell>Factor VII deficiency, vitamin K deficiency, warfarin, early liver disease</TableCell></TableRow>
            <TableRow><TableCell>Normal</TableCell><TableCell>↑</TableCell><TableCell>Factor VIII/IX/XI/XII deficiency, vWD, lupus anticoagulant, heparin</TableCell></TableRow>
            <TableRow><TableCell>↑</TableCell><TableCell>↑</TableCell><TableCell>Vitamin K deficiency, liver disease, DIC, common pathway deficiency</TableCell></TableRow>
            <TableRow><TableCell>Normal</TableCell><TableCell>Normal</TableCell><TableCell>Platelet disorder, vWD, factor XIII deficiency, vascular cause</TableCell></TableRow>
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Targeted confirmatory tests" icon={<FlaskConical className="h-4 w-4" />} tone="indigo" defaultOpen={false}>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>vWD panel — vWF antigen, vWF activity (Ristocetin cofactor), factor VIII</li>
          <li>Platelet function — PFA-100, light transmission aggregometry</li>
          <li>Factor assays after mixing study correction</li>
          <li>Factor XIII — urea clot solubility for delayed bleeding with normal screen</li>
          <li>DIC workup — D-dimer, fibrinogen, smear, PT/aPTT, platelets</li>
          <li>Acquired hemophilia — factor VIII inhibitor (Bethesda assay)</li>
        </ul>
      </SectionCard>
    </div>
  );
}

/* ------------------------------- CLOTTING -------------------------------- */

function ClottingAlgorithm() {
  const [age, setAge] = useState(false);
  const [unusual, setUnusual] = useState(false);
  const [recurrent, setRecurrent] = useState(false);
  const [family, setFamily] = useState(false);
  const [pregLoss, setPregLoss] = useState(false);
  const [acute, setAcute] = useState(false);
  const [onAnticoag, setOnAnticoag] = useState(false);

  const score =
    (age ? 2 : 0) + (unusual ? 2 : 0) + (recurrent ? 2 : 0) + (family ? 2 : 0) + (pregLoss ? 2 : 0);
  const indicated = score >= 2;

  return (
    <div className="space-y-4">
      <SectionCard title="Step 1 — Is thrombophilia workup indicated?" icon={<Stethoscope className="h-4 w-4" />} tone="primary" defaultOpen>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <Check label="Age < 50 at first VTE (+2)" checked={age} onChange={setAge} />
          <Check label="Unusual site (splanchnic, CVT) (+2)" checked={unusual} onChange={setUnusual} />
          <Check label="Recurrent VTE (+2)" checked={recurrent} onChange={setRecurrent} />
          <Check label="Family history of VTE (+2)" checked={family} onChange={setFamily} />
          <Check label="Recurrent pregnancy loss (+2)" checked={pregLoss} onChange={setPregLoss} />
        </div>
        <div className={`mt-3 rounded-md border px-3 py-2 text-sm ${indicated ? toneClass("primary") : toneClass("neutral")}`}>
          Score: <strong>{score}</strong> — {indicated ? "Thrombophilia testing warranted." : "Testing not strongly indicated. Look for provoking factors first."}
        </div>
        <div className="grid gap-2 text-sm md:grid-cols-2 mt-3">
          <Check label="Currently in acute thrombosis phase" checked={acute} onChange={setAcute} />
          <Check label="Currently on anticoagulation" checked={onAnticoag} onChange={setOnAnticoag} />
        </div>
        {(acute || onAnticoag) && (
          <div className={`mt-3 rounded-md border px-3 py-2 text-sm ${toneClass("warning")}`}>
            Defer most thrombophilia tests — acute thrombosis and anticoagulants distort results. APS antibodies and genetic tests (FVL, prothrombin G20210A) are still reliable; defer protein C/S, antithrombin, lupus anticoagulant where possible.
          </div>
        )}
      </SectionCard>

      <SectionCard title="Step 2 — Acquired causes to exclude first" icon={<AlertTriangle className="h-4 w-4" />} tone="warning" defaultOpen>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Surgery, trauma, immobilization, hospitalization</li>
          <li>Active malignancy, chemotherapy</li>
          <li>Pregnancy / postpartum, estrogen exposure (OCP, HRT)</li>
          <li>Nephrotic syndrome, inflammatory states, infection</li>
          <li>Myeloproliferative disease (consider JAK2 in splanchnic / cerebral venous thrombosis)</li>
          <li>Indwelling catheters, mechanical devices</li>
        </ul>
      </SectionCard>

      <SectionCard title="Step 3 — Inherited thrombophilia panel" icon={<FlaskConical className="h-4 w-4" />} tone="indigo" defaultOpen={false}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Relative VTE risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>Factor V Leiden</TableCell><TableCell>4–7× heterozygous</TableCell></TableRow>
            <TableRow><TableCell>Prothrombin G20210A</TableCell><TableCell>2–3×</TableCell></TableRow>
            <TableRow><TableCell>Antithrombin deficiency</TableCell><TableCell>10–20×</TableCell></TableRow>
            <TableRow><TableCell>Protein C deficiency</TableCell><TableCell>5–10×</TableCell></TableRow>
            <TableRow><TableCell>Protein S deficiency</TableCell><TableCell>5–10×</TableCell></TableRow>
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Step 4 — Antiphospholipid syndrome (APS) workup" icon={<FlaskConical className="h-4 w-4" />} tone="danger" defaultOpen={false}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Interpretation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>Lupus anticoagulant</TableCell><TableCell>Positive = high risk; confirm with DRVVT</TableCell></TableRow>
            <TableRow><TableCell>Anti-cardiolipin IgG/IgM</TableCell><TableCell>≥ 40 GPL/MPL</TableCell></TableRow>
            <TableRow><TableCell>Anti-β2 glycoprotein I</TableCell><TableCell>≥ 99th percentile</TableCell></TableRow>
            <TableRow><TableCell>DRVVT</TableCell><TableCell>Confirmatory for lupus anticoagulant</TableCell></TableRow>
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground mt-3">
          Definite APS = clinical criterion + ≥1 lab positive on 2 occasions ≥ 12 weeks apart.
        </p>
      </SectionCard>

      <SectionCard title="Step 5 — Management snapshot" icon={<ClipboardList className="h-4 w-4" />} tone="emerald" defaultOpen={false}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Finding</TableHead>
              <TableHead>Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>Factor V Leiden heterozygous</TableCell><TableCell>Anticoagulate if surgery/pregnancy; usual-duration treatment for VTE</TableCell></TableRow>
            <TableRow><TableCell>Antithrombin deficiency</TableCell><TableCell>3–6 months minimum; consider lifelong if unprovoked/recurrent</TableCell></TableRow>
            <TableRow><TableCell>Protein C / S deficiency</TableCell><TableCell>Warfarin with heparin bridge (skin necrosis risk); caution in pregnancy</TableCell></TableRow>
            <TableRow><TableCell>Triple-positive APS</TableCell><TableCell>Warfarin (avoid DOACs); long-term anticoagulation</TableCell></TableRow>
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}

/* ------------------------------ Shared UI -------------------------------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function toneClass(tone: "danger" | "warning" | "primary" | "neutral") {
  switch (tone) {
    case "danger": return "border-destructive/40 bg-destructive/5 text-destructive";
    case "warning": return "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-400";
    case "primary": return "border-primary/40 bg-primary/5 text-primary";
    default: return "border-border bg-card text-foreground";
  }
}

/* -------------------------------- Root ----------------------------------- */

export default function BleedingClottingEvaluator() {
  const [mode, setMode] = useState<Mode>("bleeding");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("bleeding")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "bleeding"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <Droplets className="h-4 w-4" />
          Bleeding Algorithm
        </button>
        <button
          onClick={() => setMode("clotting")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "clotting"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <Activity className="h-4 w-4" />
          Clotting / Thrombophilia
        </button>
      </div>

      {mode === "bleeding" ? <BleedingAlgorithm /> : <ClottingAlgorithm />}
    </div>
  );
}
