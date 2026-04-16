# AutoReason - Native OpenClaw Implementation

Implements the AutoReason iterative self-refinement tournament natively in OpenClaw using subagents.

## Concept

AutoReason fixes 3 failure modes of naive self-refinement:
1. **Prompt bias** — models hallucinate flaws when asked to critique
2. **Scope creep** — outputs expand unchecked each pass
3. **Lack of restraint** — models never say "no changes needed"

The fix: a tournament where "do nothing" is a first-class option, judged by fresh agents with no shared context.

## Architecture

```
User Prompt
    ↓
┌─ Round N ──────────────────────────┐
│                                   │
│  Agent A (incumbent) ─→ Version A  │
│  Agent B (adversary)  ─→ Version B │
│  Agent AB (synthesizer) ─→ Version AB│
│                                   │
│  3 Judge Agents ─→ Blind Borda    │
│                                   │
│  Winner → Incumbent for next round│
│  (or converge if A wins 2×)       │
└───────────────────────────────────┘
    ↓
Final Answer (or converge early)
```

## Usage

```
/autoreason <question or task>
```

## Parameters (configurable)

- `max_rounds`: Maximum tournament rounds (default: 10)
- `judge_count`: Number of judges (default: 3, use 7 for hard tasks)
- `wins_for_convergence`: Consecutive A wins to stop early (default: 2)
- `model`: Model for sub-agents (default: from config)

## Process

### Round execution:
1. Spawn **Agent A** with original prompt → incumbent version
2. Spawn **Agent B** with prompt + A's output + "find flaws" → adversarial revision
3. Spawn **Agent AB** with prompt + A + B → synthesis of both
4. Spawn **N Judges** (fresh agents, no context of A/B/AB identity) → each ranks the 3 versions
5. Tally Borda count → winner becomes incumbent for next round

### Convergence:
- If A (incumbent) wins k=2 consecutive rounds → output A, stop
- If max rounds reached → output current incumbent

## Prompt Engineering

### Agent A (Incumbent):
```
You are the incumbent. Your job is to provide the best answer.
Only revise if you see a genuine flaw. "Good enough" counts as correct.
Output your response directly.
```

### Agent B (Adversary):
```
You are an adversarial critic. The current answer is:
[CURRENT ANSWER]

Find specific, verifiable weaknesses. Write a BETTER version that fixes those flaws.
Do not expand scope. Focus on accuracy and clarity.
Output your improved version directly.
```

### Agent AB (Synthesizer):
```
You are a synthesizer. Two approaches exist:
A: [VERSION A]
B: [VERSION B]

Create a synthesis that takes the best from both while avoiding their weaknesses.
Output your synthesis directly.
```

### Judge Prompt (blind):
```
You are a judge in a blind tournament. Rank these 3 responses from BEST to WORST.
Consider: accuracy, clarity, depth, practical value.
You MUST output exactly 3 lines, one per rank:

1. [CHOICE LETTER]
2. [CHOICE LETTER]
3. [CHOICE LETTER]

Choices: A, B, AB (letters only, no explanation on the rank lines).
```

## Borda Count Scoring

- 1st place: 2 points
- 2nd place: 1 point
- 3rd place: 0 points

Sum across all judges. Highest score wins.

## Response to User

Show:
1. Number of rounds run
2. Winner selection
3. Final answer
4. If converged early: note which round triggered convergence

## Edge Cases

- If all judges rank same version last → that version is clearly inferior
- If A keeps winning → convergence is working as intended
- If tie → run one more round with fresh judges
- Sub-agent failure → retry once, then pick best available result

## Requirements

OpenClaw subagent spawning via `sessions_spawn`. No external dependencies.