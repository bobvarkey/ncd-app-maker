---
name: pubmed-research
description: Search PubMed for medical and neuroscience research papers. Query by topic, author, journal, date range. Fetch abstracts, MeSH terms, and citation data. Use when searching medical literature, finding neurology papers, checking recent research on a clinical topic, or looking up trial results.
---

# PubMed Research

Search PubMed's 35M+ biomedical citations from the command line. Built on `pymed` (Python wrapper for NCBI's E-utilities).

## Setup

```bash
cd ~/.openclaw/workspace/skills/pubmed-research
uv pip install pymed
```

No API key required for basic usage (NCBI allows 3 requests/sec without key; 10/sec with key).

## Quick Search

```bash
# Search by topic
uv run python pubmed.py search "thrombectomy stroke outcomes" --max 5

# Search neurology journals only
uv run python pubmed.py search "endovascular therapy" --journal "Stroke" --max 5

# Search by date range
uv run python pubmed.py search "CRISPR neurodegeneration" --since 2025-01-01 --max 10

# Get full abstract
uv run python pubmed.py abstract PMID_HERE
```

## Commands

### `search` — Find papers

```bash
uv run python pubmed.py search "QUERY" [options]

Options:
  --max N          Max results (default: 10, max: 100)
  --journal NAME   Filter by journal name
  --since DATE     Only papers after this date (YYYY-MM-DD)
  --until DATE     Only papers before this date (YYYY-MM-DD)
  --author NAME    Filter by author last name
  --format OUTPUT  Output format: summary (default), json, bibtex
```

### `abstract` — Fetch full abstract by PMID

```bash
uv run python pubmed.py abstract 12345678
```

### `mesh` — Get MeSH terms for a paper

```bash
uv run python pubmed.py mesh 12345678
```

### `batch` — Search multiple topics at once

```bash
uv run python pubmed.py batch topics.txt --max 3 --output results.json
```

Where `topics.txt` has one query per line.

### `recent` — Latest papers from specific journals

```bash
uv run python pubmed.py recent "Stroke" --days 7 --max 10
```

## Key Neurology Journals

Use these journal names with `--journal`:
- `Stroke` — cerebrovascular disease
- `Journal of neurointerventional surgery` — neurointervention
- `Neurology` — general neurology
- `Annals of neurology` — clinical neuroscience
- `Brain` — neuroscience
- `Lancet neurology` — high-impact reviews
- `JAMA neurology` — clinical studies
- `Epilepsia` — epilepsy
- `Movement disorders` — movement disorders
- `Muscle & nerve` — neuromuscular
- `Clinical neurophysiology` — EEG/EMG/EP
- `Sleep` — sleep medicine
- `Neurocritical care` — neuro ICU

## Output Formats

**summary** (default):
```
[1] Title of paper
    Authors: Smith J, Doe A, et al.
    Journal: Stroke, 2026 Mar
    PMID: 12345678
    DOI: 10.1161/...
    Abstract: First 200 chars...
```

**json**: Full structured data for programmatic use.

**bibtex**: Citation format for LaTeX/reference managers.

## Examples

**Morning research scan:**
```bash
uv run python pubmed.py search "mechanical thrombectomy" --since 2026-03-01 --max 10
```

**Track a specific trial:**
```bash
uv run python pubmed.py search "SWIFT DIRECT trial" --max 5
```

**Check what a specific author published:**
```bash
uv run python pubmed.py search "stroke" --author "Nogueira" --max 10
```

**Bulk journal scan:**
```bash
uv run python pubmed.py recent "Journal of neurointerventional surgery" --days 3 --max 15
```

## Integration with Daily Workflow

- **Morning brief**: Run `recent` for top neuro journals, summarize findings
- **Research cron**: Auto-scan new papers matching saved queries
- **Content creation**: Search trending topics, pull abstracts for X/LinkedIn posts

## Rate Limits

- Without API key: 3 requests/second
- With API key: 10 requests/second
- Set key: `export NCBI_API_KEY=your_key` (get free at https://www.ncbi.nlm.nih.gov/account/settings/)

## Source

- Library: [pymed](https://github.com/gijswobben/pymed) (MIT, 215 stars)
- Data: [NCBI E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25501/)
