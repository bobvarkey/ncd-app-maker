# Meta-Analysis Skill

PRISMA-compliant meta-analysis pipeline for neurology workflows.

## Features
- Binary outcomes (OR meta-analysis)
- Continuous outcomes (SMD for neurology scales: MMSE, mRS)
- PRISMA forest plots
- I² heterogeneity testing
- Publication bias assessment

## Usage
```bash
cd ~/.openclaw/workspace/AutoResearchClaw/researchclaw/meta
python prisma_meta_analyzer.py --csv your_data.csv --type binary
python prisma_meta_analyzer.py --csv your_data.csv --type continuous
```

## Input Format
CSV with columns: study, e1, n1, e2, n2 (for binary) or study, m1, sd1, n1, m2, sd2, n2 (for continuous)

## Output
- Pooled OR/SMD with 95% CI
- I² heterogeneity
- PRISMA forest plot
- Abstract markdown
