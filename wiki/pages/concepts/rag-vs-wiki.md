---
title: RAG vs Wiki
type: concept
tags: [rag, comparison, knowledge-management]
created: 2026-04-05
modified: 2026-04-05
sources: [1]
---

# RAG vs Wiki

## RAG (Retrieval-Augmented Generation)

Most people's LLM + document workflow:

1. Upload documents to ChatGPT / notebook system
2. At query time, system retrieves relevant chunks via embeddings/similarity search
3. LLM generates answer from retrieved chunks
4. Chat ends — nothing is accumulated

**Problems:**
- Every question re-derives knowledge from scratch — no compounding
- Cross-document synthesis requires finding and stitching fragments every time
- Retrieval quality depends on chunking strategy and embedding model
- Nothing is kept current — new sources don't update old knowledge

## Wiki Approach

1. Add source to raw collection
2. LLM reads source, writes/updating wiki pages (summary, entities, concepts, comparisons)
3. Human queries the wiki — answers draw on pre-synthesized, cross-linked knowledge
4. Good answers are filed back as new wiki pages

**Advantages:**
- Knowledge is compiled once and kept current
- Cross-references already exist — no fragment assembly needed
- Contradictions between sources are flagged in the wiki
- Answers compound — each query can add to the wiki

## Comparison Table

| | RAG | Wiki |
|---|---|---|
| Knowledge state | Re-derived per query | Persists and compounds |
| Cross-document synthesis | Manual fragment assembly | Pre-built and maintained |
| New source impact | Just adds to retrieval pool | Updates synthesis, flags contradictions |
| Maintenance cost | None (but also none accumulated) | Near-zero (LLM handles it) |
| Best for | One-off questions | Long-running knowledge projects |

## When to Use Each

- **RAG**: one-off questions, small document sets, ad-hoc analysis
- **Wiki**: research projects, accumulating knowledge over time, synthesis-heavy work

## Related Concepts

- [[Persistent Wiki]] — the wiki approach in detail
- [[Query Workflow]] — how wiki queries work and why answers can be filed back
