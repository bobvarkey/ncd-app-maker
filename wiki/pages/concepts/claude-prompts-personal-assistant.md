# Top 10 Claude Prompts — Personal Assistant

_Source: Claude Code system prompt patterns — imperative constraints, anti-validation, task decomposition, static/dynamic boundary_

---

## 1. Morning Briefing

> "60-second briefing. What changed in the last 12 hours? Check: market moves, unusual activity, volume spikes. Rank everything by urgency. Numbers only. No commentary. No disclaimers. If nothing important happened, say 'nothing' and stop."

---

## 2. Thesis Destroyer

> "I believe [YOUR THESIS]. Your job is to destroy this thesis. Find every data point that contradicts it. Calculate the base rate for similar situations. Tell me the probability I am wrong. Do NOT agree with me. I hired you to disagree. If the thesis survives your attack, say why."

---

## 3. Codebase Reverse Engineer

> "Analyze this repo: [URL or paste key files]. Give me exactly 5 things: 1. What it does (1 sentence) 2. Architecture (which files do what) 3. Main algorithm in pseudocode 4. Top 3 security risks 5. How to modify it for: [your use case]. File paths + line numbers for everything."

---

## 4. Personal CTO

> "You are my CTO. Project: [DESCRIBE]. Constraints: $[BUDGET], [TIMELINE], [TEAM]. Decide: 1. Tech stack (pick one, defend it) 2. Architecture (ASCII diagram) 3. MVP scope (what to cut) 4. Top 3 risks + mitigations 5. First week sprint plan. Be opinionated. If two options are close, pick one and tell me why. I'm paying you to decide, not to list pros and cons."

---

## 5. Research Synthesizer

> "Here are [N] articles about [TOPIC]. [paste or upload]. Answer 4 questions: 1. What do ALL sources agree on? 2. Where do they disagree? 3. What does NO ONE mention? 4. What should I DO based on this? Cite sources for each point. If sources conflict, tell me which to trust. Max 500 words. Table format."

---

## 6. Message Ghostwriter

> "Situation: [DESCRIBE]. Goal: [what I want them to do]. Tone: [professional/casual/firm]. Write 2 versions: A: direct and concise; B: diplomatic, relationship-preserving. No 'I hope this finds you well.' No 'please don't hesitate to reach out.' Sound human, not corporate."

---

## 7. Weekly Review

> "This week I did: [LIST]. Analyze: 1. Which tasks moved the needle? 2. What pattern do my productive days have? 3. What am I avoiding? Plan next week: Top 3 priorities (by impact, not urgency); One thing to stop doing; One thing to start doing; Daily schedule (I have [X] hours)."

---

## 8. Learning Accelerator

> "Skill: [WHAT]. Time: [DEADLINE]. Level: [NOW]. Hours/week: [X]. Create: 1. 80/20 curriculum (what 20% gives 80% results) 2. Learn-by-building project plan 3. Top 5 resources (ranked by quality) 4. Milestones to check progress 5. Common mistakes at my level. No fluff. No 'start with fundamentals' if I can skip them. Fastest path to dangerous."

---

## 9. Decision Calculator

> "Decision: [WHAT]. Options: A, B, C. For each: 1. Best case + probability 2. Worst case + probability 3. Expected value (best×prob + worst×prob) 4. Reversible or irreversible? 5. What would tell me in 30 days I chose wrong? Then: pick one. Defend it. I want your opinion, not a balanced overview."

---

## 10. Persistent Project Prompt (Static/Dynamic Boundary)

```
// ═══ STATIC (paste at start of every chat) ═══

You are [ROLE] working on [PROJECT].

Rules (use MUST/NEVER/ALWAYS):
- [RULE 1]
- [RULE 2]
- [RULE 3]

Style:
- Short responses. No emojis. No disclaimers.
- Accuracy over validation.
- If I'm wrong, say so immediately.

Permanent context:
- [FACT 1 that never changes]
- [FACT 2 that never changes]

// ═══ DYNAMIC BOUNDARY �══

// ═══ DYNAMIC (update each session) ═══
Date: [TODAY]
Status: [what's done, what's pending]
This session: [specific task]
```

> This is the exact architecture inside Claude Code. Static rules stay cached and free. Dynamic context is refreshed each session. Apply it to any project that spans multiple conversations.
