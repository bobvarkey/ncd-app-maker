---
title: qmd
type: entity
tags: [tool, search, local]
created: 2026-04-05
modified: 2026-04-05
sources: [1]
---

# qmd

## What It Is

A local search engine for markdown files. Provides hybrid BM25/vector search with LLM re-ranking — all on-device.

- CLI and MCP server
- Install via: `brew install qmd`

## Use in LLM Wiki

At small scale, `index.md` is enough for navigation. At larger scale, qmd provides:
- Full-text search over wiki pages
- BM25 ranking (keyword-based)
- Vector search (semantic similarity)
- LLM re-ranking for better results

## When to Add

- When index.md becomes unwieldy (~100+ sources, hundreds of pages)
- When you need semantic search beyond keyword matching

## Related

- [[Three-Layer Architecture]] — sits in layer 3 (optional tools)
- [[Index]] — simpler alternative at small scale
