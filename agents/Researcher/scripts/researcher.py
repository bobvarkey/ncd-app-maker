#!/usr/bin/env python3
"""
Neurology Research Scraper - Searches PubMed for RCTs and meta-analyses
"""
import requests
from bs4 import BeautifulSoup
import json
import time
import random
import argparse
from urllib.parse import quote
import re

def scrape_pubmed(topic):
    """Scrape high-impact RCTs/meta-analyses from PubMed."""
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    })
    
    search_url = f"https://pubmed.ncbi.nlm.nih.gov/?term={quote(topic)}&filter=pubt.randomizedcontrolledtrial&filter=pubt.meta-analysis&size=20"
    time.sleep(random.uniform(1, 3))
    
    resp = session.get(search_url)
    soup = BeautifulSoup(resp.content, 'html.parser')
    papers = soup.find_all('article', class_='full-docsum')
    
    results = []
    for paper in papers[:15]:
        try:
            # Get title
            title_elem = paper.find('a', class_='docsum-title')
            title = title_elem.text.strip() if title_elem else "N/A"
            
            # Get PMID from data attribute or href
            pmid = paper.get('data-docsum-pmid', '')
            if not pmid:
                link = paper.find('a', class_='docsum-title')
                if link and link.get('href'):
                    match = re.search(r'/(\d+)/', link.get('href'))
                    pmid = match.group(1) if match else 'N/A'
            
            # Get journal
            journal = "N/A"
            for span in paper.find_all('span', class_='jrnl'):
                journal = span.text.strip()
                break
            
            results.append({
                'title': title,
                'pmid': pmid if pmid else 'N/A',
                'journal': journal,
                'url': f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/" if pmid else "#"
            })
        except Exception as e:
            continue
    
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Neurology Research Scraper')
    parser.add_argument('topic', type=str, help='Topic to search')
    args = parser.parse_args()
    
    print(f"Searching PubMed for: {args.topic}")
    results = scrape_pubmed(args.topic)
    
    if results:
        print(f"\nFound {len(results)} papers:\n")
        for i, r in enumerate(results, 1):
            title = r['title'][:75] + "..." if len(r['title']) > 75 else r['title']
            print(f"{i}. {title}")
            print(f"   PMID: {r['pmid']} | {r['journal']}")
            print(f"   🔗 {r['url']}\n")
    else:
        print("No results found. Try a different topic.")
