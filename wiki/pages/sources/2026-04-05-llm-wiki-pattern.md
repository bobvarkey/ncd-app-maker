---
title: LLM Wiki — Pattern Overview
type: source
tags: [knowledge-management, llm, pattern, wiki, rag]
created: 2026-04-05
source_id: 1
---

# LLM Wiki — Pattern Overview (Source)

## Core Idea

Most people's experience with LLMs and documents is RAG: upload files, retrieve chunks at query time, generate answer. The LLM re-discovers knowledge from scratch every time. Nothing accumulates.

The alternative: a **persistent wiki** — a structured, interlinked collection of markdown files between you and the raw sources. When you add a source, the LLM reads it, extracts key information, and integrates it into the wiki — updating entity pages, revising summaries, noting contradictions, strengthening synthesis. Knowledge is compiled once and kept current.

**Key difference**: the wiki is a compounding artifact. Cross-references already exist. Contradictions are flagged. Synthesis reflects everything you've read.

## Who Does What

- **Human**: curates sources, directs analysis, asks questions, thinks about meaning
- **LLM**: reads sources, writes and maintains all wiki pages, does all bookkeeping
- The human works with the LLM agent on one side and Obsidian on the other

## Applicable Contexts

- Personal: goals, health, psychology, self-improvement
- Research: deep topic exploration over weeks/months
- Reading books: filing chapters, building character/theme/plot wiki
- Business/team: internal wiki from Slack, meetings, documents
- Competitive analysis, due diligence, trip planning, course notes

## Architecture: Three Layers

1. **Raw sources** — immutable source documents (articles, papers, images, data)
2. **Wiki layer** — the persistent, LLM-maintained markdown layer (summaries, entities, concepts, comparisons, synthesis)
3. **Optional tools** — CLI search (qmd), Obsidian frontend, Marp slides, Dataview plugin

## Schema

Two key files:
- **SCHEMA.md** — tells the LLM how the wiki is structured, conventions, workflows. Co-evolved by human and LLM.
- **index.md** — catalog of all wiki pages with one-line summaries. LLM updates on every ingest.
- **log.md** — append-only chronological record (ingests, queries, lint passes). Prefix format for grep-ability.

## Workflows

### Ingest
1. Drop new source into `sources/`
2. LLM reads source, writes summary, updates index, updates relevant pages, logs entry
3. One source may touch 10-15 wiki pages

### Query
1. LLM reads index to find relevant pages
2. Reads pages, synthesizes answer with citations
3. If answer is valuable, file it back into wiki as new page

### Lint
Periodically check for: contradictions, stale claims, orphan pages, missing concept pages, missing cross-references, data gaps.

## Tools & Tips

- **Obsidian Web Clipper**: browser extension to capture web articles as markdown + download images locally
- **Obsidian graph view**: see the shape of the wiki — hubs and orphans
- **Marp**: markdown slide decks from wiki content
- **Dataview**: query over YAML frontmatter for dynamic tables
- **qmd**: local BM25/vector search + LLM re-ranking for wiki pages
- **git**: the wiki is just markdown files — version history and branching for free

## Why It Works

The tedious part of knowledge bases isn't reading or thinking — it's the bookkeeping. Updating cross-references, keeping summaries current, noting contradictions. Humans abandon wikis because maintenance burden grows faster than value. LLMs don't get bored, don't forget cross-references, and can touch 15 files in one pass.

Related to Vannevar Bush's Memex (1945) — a personal, curated knowledge store with associative trails. Bush couldn't solve who does the maintenance. The LLM does.
