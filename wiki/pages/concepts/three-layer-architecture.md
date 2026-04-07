---
title: Three-Layer Architecture
type: concept
tags: [architecture, layers, system-design]
created: 2026-04-05
modified: 2026-04-05
sources: [1]
---

# Three-Layer Architecture

## The Three Layers

```
┌─────────────────────────────────────────────┐
│           Layer 3: Optional Tools            │
│   (CLI search, Obsidian, Marp, Dataview)    │
├─────────────────────────────────────────────┤
│            Layer 2: Wiki Layer              │
│  (LLM-maintained: summaries, entities,      │
│   concepts, comparisons, synthesis)         │
├─────────────────────────────────────────────┤
│           Layer 1: Raw Sources               │
│     (immutable: articles, papers,           │
│      images, data files)                     │
└─────────────────────────────────────────────┘
```

## Layer 1: Raw Sources

- Your curated collection of source documents
- **Immutable** — the LLM reads but never modifies
- This is your source of truth
- Format: markdown, PDF, images, data files

## Layer 2: Wiki

- The LLM-maintained middle layer
- Contains: summaries, entities, concepts, comparisons, synthesis
- All cross-references live here
- Updated by LLM on every ingest

## Layer 3: Optional Tools

- **qmd**: local BM25/vector search for wiki pages
- **Obsidian**: frontend for browsing, graph view
- **Marp**: markdown → slide decks
- **Dataview**: query frontmatter for dynamic tables
- **git**: version history and collaboration

## Why Layer Separations Matters

- Raw sources = immutable truth
- Wiki = actively maintained synthesis
- Tools = convenient access patterns

Each layer has a different update cadence and ownership model.

## Related Concepts

- [[Persistent Wiki]] — what layer 2 is
- [[RAG vs Wiki]] — where the wiki layer adds value vs RAG
- [[Ingest Workflow]] — how layer 1 flows to layer 2
- [[Query Workflow]] — how layer 3 queries layer 2
