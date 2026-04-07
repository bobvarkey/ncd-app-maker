---
title: LLM Wiki — Pattern Overview
type: summary
tags: [knowledge-management, llm, pattern, wiki, rag]
created: 2026-04-05
modified: 2026-04-05
sources: [1]
---

# LLM Wiki — Pattern Overview

## Summary

A pattern for using an LLM to build and maintain a persistent, compounding wiki layered between you and your raw sources. Unlike RAG (which re-derives knowledge at every query), a wiki accumulates — the LLM writes summary pages, updates entity/concept pages, flags contradictions, and maintains cross-references after every source ingest. Knowledge compounds over time.

## Key Claims

- The wiki is a **persistent, compounding artifact** — not re-derived per query
- The LLM is the sole writer and maintainer of all wiki pages
- The human is curator, question-asker, and analyst — not a wiki editor
- Three layers: raw sources (immutable) → wiki → optional CLI tools (qmd, Obsidian, Marp)
- A single source ingest can touch 10-15 wiki pages
- The main maintenance cost (cross-references, updates, bookkeeping) is near-zero for LLMs

## What It's Good For

Personal knowledge tracking, research deep-dives, book reading companions, business wikis from Slack/meetings, competitive analysis, course notes.

## Related Concepts

- [[Persistent Wiki]] — the core concept
- [[RAG vs Wiki]] — why this beats retrieval-at-query-time
- [[Three-Layer Architecture]] — how the pieces fit together
