#!/usr/bin/env python3
"""
Fetch up to 10,000 PubMed citations for traditional medicine adverse events.
Writes incrementally to a markdown file so you don't lose progress.
"""

import sys
import time
import json
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from pubmed import create_pubmed, format_summary

QUERY = (
    '"traditional medicine"[Text Word] OR Ayurveda[Text Word] OR '
    'homeopathy[Text Word] OR Unani[Text Word] OR Siddha[Text Word] OR '
    '"traditional Chinese medicine"[Text Word] '
    'AND (adverse event[Text Word] OR "adverse reaction"[Text Word] OR '
    'toxicity[Text Word] OR safety[Text Word]) '
    'AND (Review[pt] OR "systematic review"[tiab] OR meta-analysis[pt])'
)

MAX = 10000
BATCH = 200  # NCBI returns max 10k, but we'll fetch in chunks
RATE_DELAY = 0.35  # ~3 req/sec without API key

OUTPUT = Path("/Users/bobvarkey/.openclaw/workspace/pubmed-traditional-medicine-adverse-events.md")


def format_article_markdown(article, index):
    lines = []
    lines.append(f"### {index}. {article.title or 'No title'}\n")

    # Authors
    authors = []
    if hasattr(article, 'authors') and article.authors:
        for a in article.authors[:8]:
            ln = a.get('lastname', '')
            fn = a.get('firstname', '')
            if ln:
                ini = fn[0] + '.' if fn else ''
                authors.append(f"{ln} {ini}".strip())
        if len(article.authors) > 8:
            authors.append(f"et al. (+{len(article.authors)-8} more)")
    if authors:
        lines.append(f"**Authors:** {', '.join(authors)}\n")

    # Journal & date
    journal = getattr(article, 'journal', '') or ''
    pub_date = ''
    if hasattr(article, 'publication_date') and article.publication_date:
        pub_date = article.publication_date.strftime("%Y %b %d")
    if journal:
        lines.append(f"**Journal:** {journal}" + (f", {pub_date}" if pub_date else "") + "\n")

    # PMID & DOI
    pmid = getattr(article, 'pubmed_id', '') or ''
    doi = getattr(article, 'doi', '') or ''
    if pmid:
        lines.append(f"**PMID:** [{pmid}](https://pubmed.ncbi.nlm.nih.gov/{pmid}/)\n")
    if doi:
        lines.append(f"**DOI:** {doi}\n")

    # Abstract
    abstract = getattr(article, 'abstract', '') or ''
    if abstract:
        lines.append(f"**Abstract:** {abstract}\n")

    # Keywords
    keywords = getattr(article, 'keywords', []) or []
    if keywords:
        kw_str = ', '.join(keywords[:15])
        lines.append(f"**Keywords:** {kw_str}\n")

    lines.append("---\n")
    return "\n".join(lines)


def main():
    print(f"Query: {QUERY}")
    print(f"Target: up to {MAX} results")
    print(f"Output: {OUTPUT}")

    # Init output file
    with open(OUTPUT, "w") as f:
        f.write(f"# Traditional Medicine — Adverse Events & Safety\n")
        f.write(f"# PubMed Systematic Reviews & Meta-Analyses\n\n")
        f.write(f"**Search date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"**Query:** {QUERY}\n\n")
        f.write("---\n\n")

    pubmed = create_pubmed()

    fetched = 0
    batch_num = 0

    try:
        print("Starting query...")
        results = pubmed.query(QUERY, max_results=MAX)
        articles = list(results)
        total = len(articles)
        print(f"Total articles returned: {total}")

        for i, article in enumerate(articles, 1):
            try:
                md = format_article_markdown(article, i)
                with open(OUTPUT, "a") as f:
                    f.write(md)
                fetched += 1

                if i % 100 == 0:
                    print(f"  Written {i}/{total} articles...")
                    time.sleep(RATE_DELAY)
            except Exception as e:
                print(f"  Error on article {i}: {e}")
                continue

    except KeyboardInterrupt:
        print(f"\nInterrupted. Wrote {fetched} of ~{MAX} articles.")

    print(f"\nDone! Wrote {fetched} articles to {OUTPUT}")


if __name__ == "__main__":
    main()