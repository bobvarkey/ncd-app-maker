# SCHEMA.md — LLM Wiki Conventions

> This file defines the conventions, structure, and workflows for maintaining the wiki.
> Update this as you discover what works for your domain.

---

## Core Principles

- The LLM **writes and maintains all wiki pages** — not the human.
- The human curates sources, asks questions, and directs analysis.
- Every significant action is logged in `log.md`.
- Every new source or page is indexed in `index.md`.
- Pages are cross-linked. Orphan pages should be rare.

---

## Directory Structure

```
wiki/
├── SCHEMA.md          # This file — conventions and config
├── index.md           # Content catalog — all pages with summaries
├── log.md             # Append-only chronological log
├── sources/           # Raw immutable source documents
│   └── [date]-[slug].md
└── pages/             # All wiki pages
    ├── summaries/      # Summary pages for each source
    ├── entities/       # Entity pages (people, places, organizations)
    ├── concepts/       # Concept pages (ideas, topics, techniques)
    ├── comparisons/    # Side-by-side comparison pages
    └── synthesis/     # Synthesis pages combining multiple sources
```

---

## Page Format

Every wiki page should have YAML frontmatter:

```yaml
---
title: Page Title
type: concept | entity | summary | comparison | synthesis
tags: [tag1, tag2]
created: 2026-04-05
modified: 2026-04-05
sources: [1]  # links to source IDs in log
---

# Page Title

Body content...
```

---

## Workflows

### Ingest (New Source)

1. Drop source into `sources/` with filename format: `YYYY-MM-DD-[slug].md`
2. Tell the LLM to process it
3. LLM reads source → writes summary to `pages/summaries/` → updates `index.md` → updates relevant entity/concept pages → appends entry to `log.md`
4. A single source may touch 10-15 pages

### Query (Ask a Question)

1. LLM reads `index.md` to find relevant pages
2. LLM reads relevant pages and synthesizes answer
3. If answer is valuable (comparison, analysis, insight), file it back into wiki as a new page
4. Good answers compound — don't let them disappear into chat history

### Lint (Health Check)

Run periodically:
- Check for contradictions between pages
- Flag stale claims superseded by newer sources
- Find orphan pages with no inbound links
- Find concepts mentioned but lacking their own page
- Suggest missing cross-references and data gaps
- Log lint pass in `log.md`

---

## Index Format

`index.md` is organized by category:

```markdown
# Wiki Index

## Summaries (n sources)
- [Title](pages/summaries/...) — one-line summary | [date]

## Concepts
- [Title](pages/concepts/...) — one-line summary | [date]

## Entities
...

## Comparisons
...

## Synthesis
...

## Sources
...

<!-- stats: n pages, last updated YYYY-MM-DD -->
```

---

## Log Format

`log.md` uses a consistent prefix for grep-ability:

```
## [YYYY-MM-DD] ingest | Source Title
- Action: read, summarized, updated N pages, added cross-links
- Pages touched: page1, page2, page3

## [YYYY-MM-DD] query | Question summary
- Answer filed as: pages/synthesis/...
- Key pages used: page1, page2
```

---

## Source Handling

- Sources are **immutable** — never modify them
- Download images locally using Obsidian Web Clipper's download attachments feature
- For images: read markdown text first, then view images separately
- Sources get a source ID in the log (e.g. `[1]`, `[2]`) used in page frontmatter

---

## Optional Tools

- **qmd** — local BM25/vector search over wiki pages (`brew install qmd`)
- **Obsidian** — recommended frontend for browsing the wiki graph
- **Marp** — markdown slide decks from wiki content (`npx @marp-team/marp-cli slides.md`)
- **Dataview** — Obsidian plugin for querying page frontmatter

---

## Schema Evolution

This schema is a living document. As you develop workflows that work for your domain,
update this file to reflect them. The LLM reads this on every session start.
