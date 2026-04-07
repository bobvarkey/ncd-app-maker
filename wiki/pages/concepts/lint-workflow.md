---
title: Lint Workflow
type: concept
tags: [workflow, maintenance, health-check]
created: 2026-04-05
modified: 2026-04-05
sources: [1]
---

# Lint Workflow

## Definition

Periodic health-checks to maintain wiki quality, consistency, and coverage as it grows.

## What to Check

Run periodically (e.g., weekly or after N ingests):

1. **Contradictions**: Any claims in one page that contradict newer sources?
2. **Stale claims**: Have newer sources superseded older information?
3. **Orphan pages**: Pages with no inbound links?
4. **Missing concept pages**: Concepts mentioned but lacking their own page?
5. **Missing cross-references**: Should-link-but-don't pairs?
6. **Data gaps**: Areas that could be filled with a web search?

## How to Run

Tell the LLM: "Run a lint pass on the wiki"

The LLM will:
- Read through pages
- Identify issues
- Suggest fixes
- Log the lint pass in `log.md`

## Output

Lint passes typically produce:
- List of issues found
- Suggested new pages to create
- Suggested cross-references to add
- Suggestions for new sources to look for

## Why It Matters

As wikis grow, inconsistency accumulates. Without linting:
- Stale claims mislead future queries
- Orphan pages indicate coverage gaps
- Missing cross-references reduce synthesis quality

LLMs excel at this — they can scan hundreds of pages for patterns humans would miss.

## Related Concepts

- [[Persistent Wiki]] — what linting maintains
- [[Ingest Workflow]] — what makes linting important (every ingest touches many pages)
- [[Log]] — where lint passes are recorded
