---
title: Query Workflow
type: concept
tags: [workflow, query, knowledge-management]
created: 2026-04-05
modified: 2026-04-05
sources: [1]
---

# Query Workflow

## Definition

The process of asking questions against the wiki and receiving synthesized answers that draw on pre-compiled, cross-linked knowledge.

## Steps

1. **Human asks** a question (not about raw sources, but against the wiki)
2. **LLM reads** `index.md` to find relevant pages
3. **LLM reads** the relevant pages
4. **LLM synthesizes** answer with citations
5. **If valuable**: LLM files answer back into wiki as a new page (comparison, analysis, insight)

## Why It Works Better Than Querying Raw Sources

- Cross-references already exist — no fragment assembly
- Synthesis already done — answers draw on compiled knowledge
- Contradictions flagged — synthesis reflects latest understanding
- Good answers compound — filed back as wiki pages

## Output Formats

Answers can take different forms:
- Markdown page
- Comparison table
- Slide deck (Marp)
- Chart (matplotlib)
- Canvas visualization

## The Compounding Insight

The key insight: **good answers should become new wiki pages**. A comparison you asked for, an analysis you found useful, a connection you discovered — these are valuable and shouldn't disappear into chat history. File them back.

## Related Concepts

- [[Persistent Wiki]] — why this works
- [[RAG vs Wiki]] — contrast with querying raw sources
- [[Ingest Workflow]] — the other main workflow
- [[Index]] — how LLM finds relevant pages
