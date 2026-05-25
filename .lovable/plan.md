This is a large multi-feature request touching most clinical modules. I'll group it into phases so we can ship incrementally and you can review as we go.

## Phase 1 — Hypertension
1. **Hypertensive Crisis Threshold card**: add inline link/anchor jumping to a new "Hypertensive Crisis Management" subsection (with JNC/ESC grades 1–3 classification + urgency vs emergency table + first-line IV agents).
2. **5-Step Investigation Flowchart** (History → Exam → Basic labs → Target organ assessment → Secondary screen) as a visual stepper.
3. **Doses table** for all listed antihypertensives (start/usual/max dose, frequency) added to the Drug Potency accordion.

## Phase 2 — Diabetes
4. **Basal Insulin brand expander**: collapsible under the basal insulin block listing US brand names (Lantus, Basaglar, Toujeo, Semglee, Levemir, Tresiba, Humulin N, Novolin N) and Indian brands (Lantus, Basalog, Glaritus, Basugine, Levemir, Tresiba, Huminsulin N, Insugen-N, Wosulin-N).
5. **Meal Planner** section: cuisine selector (Asian / Indian / Kerala / European / Japanese / Chinese / Korean / American) wired to the existing `diet-generator.ts` + extend `food-data.ts` with new cuisine entries.

## Phase 3 — ASCVD / Lipids
6. **Auto-advance**: when "ASCVD" comorbidity is checked, automatically open the Secondary Prevention calculator panel.
7. **Tooltip** on "ASCVD" showing full form "Atherosclerotic Cardiovascular Disease".
8. **Femoral USG criteria** added beside Aortic atherosclerosis/Carotid plaque >50% (IMT >1.5 mm, plaque, ABI <0.9).
9. **Collapsible Dx criteria** for Metabolic syndrome (NCEP ATP III / IDF) with auto-evaluation from patient data.

## Phase 4 — New Tabs
10. **Asthma/COPD tab** (5th tab on Home): GINA step ladder, GOLD ABCD/ABE, inhaler chart, exacerbation management.
11. **Renal Disease tab** (6th tab): AKI (KDIGO stages), AKD, CKD (GA grid). Renal Dose Adjustment with sex/age/Cr inputs → eGFR auto-calc (CKD-EPI 2021), or manual eGFR override → drug list (metformin, SGLT2, DPP4, insulin, gabapentin, antibiotics: amox-clav, pip-taz, cefepime, meropenem, ciprofloxacin, levofloxacin, vancomycin, TMP-SMX, nitrofurantoin, acyclovir) with eGFR-banded dose adjustments.

## Phase 5 — Women's Health & BMI
12. **Collapsible Dx criteria** for Premature menopause / PCOS (Rotterdam) / Pre-eclampsia (ACOG).
13. **BMI Calculator**: show side-by-side Western (WHO) and Asian (WPRO) cutoffs + collapsible BMI grade selector.

## Phase 6 — Cross-cutting
14. **Sex dropdown** (Male/Female) on every page that has a sex field — audit all forms, replace radio/buttons with Select.
15. **Page summary**: every clinical page gets a "Copy summary" button that builds a plain-text snapshot (patient data + key findings) and copies to clipboard.
16. **Checkbox state fix audit**: review all multi-select risk checklists to ensure independent toggling, persistence, and live risk recomputation.

## Technical notes
- New files: `src/pages/asthma-copd/*`, `src/pages/renal/*`, `src/components/CuisineMealPlanner.tsx`, `src/components/CopySummaryButton.tsx`, `src/components/SexSelect.tsx`, `src/lib/renal-dosing.ts`, `src/lib/insulin-brands.ts`, `src/lib/htn-doses.ts`.
- Reuse existing `calculateEGFR` from `src/lib/patient-data.ts` and `diet-generator.ts` for meal planning.
- All new colors via semantic tokens; collapsibles via `Accordion`/`Collapsible`; tooltips via `Tooltip`.

## Questions before I start
- This is ~6 phases of work. Do you want me to **ship all phases in one go** (long single message, high risk of needing fixes), or **phase by phase** so you can review each?
- For the **meal planner**, should it generate a 7-day plan (existing generator) or just a single-day sample for each cuisine?
- For the **Renal tab**, do you want the antibiotic list limited to ~10 common agents, or a fuller formulary (~30)?
