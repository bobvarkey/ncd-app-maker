---
title: Persistent Wiki
type: concept
tags: [knowledge-management, wiki, compounding]
created: 2026-04-05
modified: 2026-04-05
sources: [1]
---

# Persistent Wiki

## Definition

A structured, interlinked collection of markdown files that sits between you and your raw sources. Unlike a document collection that you query at need, a persistent wiki is **actively maintained** by an LLM — pages are updated, cross-references are kept current, and contradictions are flagged after every ingest.

## Why "Persistent" Matters

Most knowledge management fails because:

1. **No accumulation** — RAG systems re-derive knowledge from scratch at every query
2. **Maintenance burden** — humans abandon wikis because updating N files per new source doesn't scale
3. **No synthesis** — individual document summaries don't capture cross-document insights

A persistent wiki solves all three:

- Knowledge is **compiled once** and kept current — not re-derived per query
- The LLM handles maintenance at near-zero cost — touching 15 files in one pass
- Every new source **updates the synthesis** — not just the summary of itself

## Core Properties

- **Layered**: sits between human and raw sources; raw sources are immutable
- **LLM-maintained**: the LLM writes and updates all pages; human only curates sources
- **Compounding**: each ingest strengthens and updates the whole wiki, not just one page
- **Interlinked**: cross-references are explicit wiki links, not just keyword matches

## Relation to Other Concepts

- [[RAG vs Wiki]] — contrasts this with the retrieval-at-query-time approach
- [[Ingest Workflow]] — how new sources are processed into the wiki
- [[Query Workflow]] — how questions are answered against the wiki
- [[Three-Layer Architecture]] — where the wiki sits in the overall stack
