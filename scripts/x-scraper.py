#!/usr/bin/env python3
"""
X/Twitter Scraper - Pulls posts via web scraping (nitter/fallback).
Saves to knowledge base for research tracking.
"""

import json
import os
import sqlite3
from datetime import datetime

DB_PATH = os.path.expanduser("~/.openclaw/workspace/memory_x_posts.db")
OUTPUT_DIR = os.path.expanduser("~/.openclaw/workspace/knowledge-base/x-scrapes")

def setup_db():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        author TEXT,
        handle TEXT,
        date TEXT,
        text TEXT,
        replies INTEGER,
        reposts INTEGER,
        likes INTEGER,
        bookmarks INTEGER,
        views INTEGER,
        url TEXT,
        search_query TEXT,
        scraped_at TEXT
    )""")
    c.execute("""CREATE TABLE IF NOT EXISTS scrape_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT,
        posts_found INTEGER,
        timestamp TEXT
    )""")
    conn.commit()
    return conn

def save_scrape_report(conn, query, posts):
    """Save scraped posts to DB and markdown file."""
    c = conn.cursor()
    ts = datetime.now().isoformat()
    
    for p in posts:
        c.execute("""INSERT OR REPLACE INTO posts 
            (id, author, handle, date, text, replies, reposts, likes, bookmarks, views, url, search_query, scraped_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (p['id'], p['author'], p['handle'], p['date'], p['text'],
             p.get('replies',0), p.get('reposts',0), p.get('likes',0),
             p.get('bookmarks',0), p.get('views',0), p['url'], query, ts))
    
    c.execute("INSERT INTO scrape_runs (query, posts_found, timestamp) VALUES (?,?,?)",
              (query, len(posts), ts))
    conn.commit()
    
    # Save markdown report
    date_str = datetime.now().strftime("%Y-%m-%d")
    md_path = os.path.join(OUTPUT_DIR, f"x-scrape-{date_str}.md")
    
    with open(md_path, 'a') as f:
        f.write(f"\n## Scrape: {query} — {ts[:16]}\n\n")
        for p in posts:
            f.write(f"### @{p['handle']} ({p['date']})\n")
            f.write(f"{p['text'][:500]}\n\n")
            f.write(f"**Engagement:** {p.get('replies',0)} replies · {p.get('reposts',0)} reposts · {p.get('likes',0)} likes · {p.get('views',0)} views\n")
            f.write(f"**Link:** {p['url']}\n\n---\n\n")
    
    print(f"Saved {len(posts)} posts to {md_path}")
    return md_path

if __name__ == "__main__":
    conn = setup_db()
    print("DB ready at", DB_PATH)
    print("Reports at", OUTPUT_DIR)
    conn.close()
