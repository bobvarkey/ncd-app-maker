---
title: Ingest Workflow
type: concept
tags: [workflow, ingest, knowledge-management]
created: 2026-04-05
modified: 2026-04-05
sources: [1]
---

# Ingest Workflow

## Definition

The process of adding a new source to the wiki — from dropping it in `sources/` to completing all wiki updates.

## Steps

1. **Drop source** into `wiki/sources/` with filename format: `YYYY-MM-DD-[slug].[ext]`
2. **Tell the LLM** to process the source (e.g., "ingest this article")
3. **LLM reads** the source and discusses key takeaways with you
4. **LLM writes** summary page in `pages/summaries/`
5. **LLM updates** `index.md` with new page entries
6. **LLM updates** relevant entity and concept pages (may touch 10-15 pages)
7. **LLM appends** entry to `log.md`

## What a Single Ingest Touches

- Source document itself
- Summary page (new)
- Possibly new entity pages
- Possibly new concept pages
- Existing pages that need updating/cross-referencing
- Index
- Log

That's why it's powerful — one source update ripples across the wiki.

## Human Involvement Options

- **One-at-a-time with supervision**: Human reads summaries, checks updates, guides emphasis. Recommended for important sources.
- **Batch with less supervision**: Drop many sources, let LLM process autonomously. Good for bulk ingestion.

## Related Concepts

- [[Persistent Wiki]] — what makes this workflow valuable
- [[Query Workflow]] — the other main workflow
- [[Lint Workflow]] — periodic health-checks
- [[Log Format]] — how ingest is recorded
