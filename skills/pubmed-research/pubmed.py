#!/usr/bin/env python3
"""
PubMed Research CLI — Search and analyze biomedical literature.

Usage:
    python pubmed.py search "query" [--max 10] [--journal "Name"] [--since 2025-01-01]
    python pubmed.py abstract PMID
    python pubmed.py mesh PMID
    python pubmed.py batch topics.txt [--max 3] [--output results.json]
    python pubmed.py recent "Journal Name" [--days 7] [--max 10]
"""

import argparse
import json
import sys
from datetime import datetime, timedelta

try:
    from pymed import PubMed
except ImportError:
    print("ERROR: pymed not installed. Run: uv pip install pymed")
    sys.exit(1)


def create_pubmed():
    """Create PubMed client with optional API key."""
    import os
    email = os.environ.get("NCBI_EMAIL", "research@openclaw.local")
    api_key = os.environ.get("NCBI_API_KEY", None)
    return PubMed(tool="OpenClawPubMed", email=email)


def format_summary(article, index=None):
    """Format a single article as human-readable summary."""
    lines = []
    prefix = f"[{index}] " if index else ""
    
    title = article.title or "No title"
    lines.append(f"{prefix}{title}")
    
    # Authors
    authors = []
    if hasattr(article, 'authors') and article.authors:
        for a in article.authors[:5]:
            lastname = a.get('lastname', '')
            firstname = a.get('firstname', '')
            if lastname:
                authors.append(f"{lastname} {firstname[0] + '.' if firstname else ''}")
    if authors:
        author_str = ", ".join(authors)
        if len(article.authors) > 5:
            author_str += ", et al."
        lines.append(f"    Authors: {author_str}")
    
    # Journal and date
    journal = getattr(article, 'journal', '') or ''
    pub_date = ''
    if hasattr(article, 'publication_date') and article.publication_date:
        pub_date = article.publication_date.strftime("%Y %b")
    if journal or pub_date:
        lines.append(f"    Journal: {journal}{', ' + pub_date if pub_date else ''}")
    
    # PMID
    pmid = getattr(article, 'pubmed_id', '') or ''
    if pmid:
        lines.append(f"    PMID: {pmid}")
    
    # DOI
    doi = getattr(article, 'doi', '') or ''
    if doi:
        lines.append(f"    DOI: {doi}")
    
    # Abstract snippet
    abstract = getattr(article, 'abstract', '') or ''
    if abstract:
        snippet = abstract[:250].replace('\n', ' ')
        if len(abstract) > 250:
            snippet += "..."
        lines.append(f"    Abstract: {snippet}")
    
    return "\n".join(lines)


def format_json(article):
    """Format article as JSON dict."""
    data = {
        "title": getattr(article, 'title', None),
        "pubmed_id": getattr(article, 'pubmed_id', None),
        "doi": getattr(article, 'doi', None),
        "journal": getattr(article, 'journal', None),
        "abstract": getattr(article, 'abstract', None),
        "publication_date": str(getattr(article, 'publication_date', '')),
        "keywords": getattr(article, 'keywords', []),
        "authors": [],
    }
    if hasattr(article, 'authors') and article.authors:
        for a in article.authors:
            data["authors"].append({
                "lastname": a.get('lastname', ''),
                "firstname": a.get('firstname', ''),
                "affiliation": a.get('affiliation', ''),
            })
    return data


def format_bibtex(article):
    """Format article as BibTeX entry."""
    pmid = getattr(article, 'pubmed_id', 'unknown')
    title = (getattr(article, 'title', '') or '').replace('{', '').replace('}', '')
    
    authors = []
    if hasattr(article, 'authors') and article.authors:
        for a in article.authors:
            lastname = a.get('lastname', '')
            firstname = a.get('firstname', '')
            if lastname:
                authors.append(f"{lastname}, {firstname}")
    author_str = " and ".join(authors)
    
    journal = getattr(article, 'journal', '') or ''
    year = ''
    if hasattr(article, 'publication_date') and article.publication_date:
        year = article.publication_date.year
    
    doi = getattr(article, 'doi', '') or ''
    
    lines = [
        f"@article{{{pmid},",
        f'  title     = {{{title}}},',
        f'  author    = {{{author_str}}},',
        f'  journal   = {{{journal}}},',
        f'  year      = {{{year}}},',
    ]
    if doi:
        lines.append(f'  doi       = {{{doi}}},')
    lines.append(f'  pmid      = {{{pmid}}}')
    lines.append('}')
    return "\n".join(lines)


def search_articles(query, max_results=10, journal=None, since=None, until=None, author=None):
    """Search PubMed and return articles."""
    pubmed = create_pubmed()
    
    # Build query
    full_query = query
    if journal:
        full_query += f' AND "{journal}"[Journal]'
    if author:
        full_query += f' AND {author}[Author]'
    if since or until:
        from_date = since or "1800-01-01"
        to_date = until or datetime.now().strftime("%Y-%m-%d")
        full_query += f' AND ("{from_date}"[Date - Publication] : "{to_date}"[Date - Publication])'
    
    try:
        results = pubmed.query(full_query, max_results=max_results)
        articles = list(results)
        return articles
    except Exception as e:
        print(f"ERROR: PubMed query failed: {e}", file=sys.stderr)
        return []


def cmd_search(args):
    """Search command handler."""
    articles = search_articles(
        args.query,
        max_results=args.max,
        journal=args.journal,
        since=args.since,
        until=args.until,
        author=args.author,
    )
    
    if not articles:
        print("No results found.")
        return
    
    print(f"Found {len(articles)} result(s) for: \"{args.query}\"\n")
    
    if args.format == "json":
        output = [format_json(a) for a in articles]
        print(json.dumps(output, indent=2, default=str))
    elif args.format == "bibtex":
        for a in articles:
            print(format_bibtex(a))
            print()
    else:
        for i, article in enumerate(articles, 1):
            print(format_summary(article, i))
            print()


def cmd_abstract(args):
    """Abstract command handler."""
    pubmed = create_pubmed()
    try:
        results = pubmed.query(f"{args.pmid}[uid]", max_results=1)
        articles = list(results)
        if not articles:
            print(f"No article found with PMID: {args.pmid}")
            return
        article = articles[0]
        print(f"Title: {article.title}\n")
        if article.abstract:
            print(article.abstract)
        else:
            print("(No abstract available)")
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)


def cmd_mesh(args):
    """MeSH terms command handler."""
    pubmed = create_pubmed()
    try:
        results = pubmed.query(f"{args.pmid}[uid]", max_results=1)
        articles = list(results)
        if not articles:
            print(f"No article found with PMID: {args.pmid}")
            return
        article = articles[0]
        keywords = getattr(article, 'keywords', []) or []
        if keywords:
            print(f"MeSH/Keywords for PMID {args.pmid}:")
            for kw in keywords:
                print(f"  - {kw}")
        else:
            print(f"No MeSH terms found for PMID {args.pmid}")
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)


def cmd_batch(args):
    """Batch search command handler."""
    with open(args.topics, 'r') as f:
        topics = [line.strip() for line in f if line.strip()]
    
    all_results = {}
    for topic in topics:
        print(f"Searching: {topic}...", file=sys.stderr)
        articles = search_articles(topic, max_results=args.max)
        all_results[topic] = [format_json(a) for a in articles]
    
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(all_results, f, indent=2, default=str)
        print(f"Results saved to {args.output}", file=sys.stderr)
    else:
        print(json.dumps(all_results, indent=2, default=str))


def cmd_recent(args):
    """Recent papers from a specific journal."""
    days_ago = datetime.now() - timedelta(days=args.days)
    since = days_ago.strftime("%Y-%m-%d")
    
    articles = search_articles(
        "*",  # all topics
        max_results=args.max,
        journal=args.journal,
        since=since,
    )
    
    if not articles:
        print(f"No recent papers found in \"{args.journal}\" (last {args.days} days).")
        return
    
    print(f"Recent papers from \"{args.journal}\" (last {args.days} days): {len(articles)} found\n")
    for i, article in enumerate(articles, 1):
        print(format_summary(article, i))
        print()


def main():
    parser = argparse.ArgumentParser(
        description="PubMed Research CLI — Search biomedical literature",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # search
    search_p = subparsers.add_parser("search", help="Search PubMed")
    search_p.add_argument("query", help="Search query")
    search_p.add_argument("--max", type=int, default=10, help="Max results (default: 10)")
    search_p.add_argument("--journal", help="Filter by journal name")
    search_p.add_argument("--since", help="Papers after date (YYYY-MM-DD)")
    search_p.add_argument("--until", help="Papers before date (YYYY-MM-DD)")
    search_p.add_argument("--author", help="Filter by author last name")
    search_p.add_argument("--format", choices=["summary", "json", "bibtex"], default="summary")
    
    # abstract
    abstract_p = subparsers.add_parser("abstract", help="Fetch full abstract by PMID")
    abstract_p.add_argument("pmid", help="PubMed ID")
    
    # mesh
    mesh_p = subparsers.add_parser("mesh", help="Get MeSH terms for a paper")
    mesh_p.add_argument("pmid", help="PubMed ID")
    
    # batch
    batch_p = subparsers.add_parser("batch", help="Search multiple topics from file")
    batch_p.add_argument("topics", help="File with one query per line")
    batch_p.add_argument("--max", type=int, default=3, help="Results per topic")
    batch_p.add_argument("--output", help="Output JSON file")
    
    # recent
    recent_p = subparsers.add_parser("recent", help="Recent papers from a journal")
    recent_p.add_argument("journal", help="Journal name")
    recent_p.add_argument("--days", type=int, default=7, help="Look back N days")
    recent_p.add_argument("--max", type=int, default=10, help="Max results")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    commands = {
        "search": cmd_search,
        "abstract": cmd_abstract,
        "mesh": cmd_mesh,
        "batch": cmd_batch,
        "recent": cmd_recent,
    }
    
    commands[args.command](args)


if __name__ == "__main__":
    main()
