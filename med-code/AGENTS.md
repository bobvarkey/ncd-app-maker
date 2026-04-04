# MedCode Agent - Commands

## What It Does
Proposes coding ideas for neurology/medical projects. Supervised by main agent.

## Commands

| Command | Action |
|---------|--------|
| `medcode ideas` | Get 3 coding ideas from today's research |
| `medcode project <topic>` | Deep dive into one project idea |
| `medcode stack` | Tech stack recommendations |

## Input
Reads from: `~/neuro-daily/[date]/neuro-content-research.md`

## Output
Saves ideas to: `~/neuro-daily/[date]/medcode-ideas.md`

## Example
```
User: medcode ideas
MedCode: Here are 3 project ideas from today's stroke research:
1. Real-time thrombectomy outcome predictor
2. CT perfusion automated ASPECTS calculator
3. Stroke triage AI assistant
```
