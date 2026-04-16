#!/usr/bin/env python3
"""X/Twitter scraper using Chrome DevTools Protocol directly."""

import json
import sqlite3
import os
import re
import urllib.request
import urllib.parse
from datetime import datetime

CDP_URL = "http://localhost:9222"

def get_cdpws_url():
    version = json.loads(urllib.request.urlopen(f"{CDP_URL}/json/version").read())
    return version.get("webSocketDebuggerUrl")

def list_tabs():
    tabs = json.loads(urllib.request.urlopen(f"{CDP_URL}/json/list").read())
    return tabs

def navigate_to(ws_url, url):
    """Use Python websocket to connect to Chrome and navigate."""
    try:
        import websocket
    except ImportError:
        import subprocess
        subprocess.run(["pip3", "install", "websocket-client"], capture_output=True)
        import websocket
    
    ws = websocket.create_connection(ws_url, timeout=30)
    
    # Enable Page domain
    ws.send(json.dumps({"id": 1, "method": "Page.enable"}))
    ws.recv()
    
    # Navigate
    ws.send(json.dumps({"id": 2, "method": "Page.navigate", "params": {"url": url}}))
    
    # Wait for load
    while True:
        msg = ws.recv()
        data = json.loads(msg)
        if data.get("method") == "Page.loadEventFired":
            break
    
    # Give JS time to render
    import time
    time.sleep(5)
    
    return ws

def get_html(ws):
    """Get document HTML."""
    ws.send(json.dumps({"id": 10, "method": "Runtime.evaluate", "params": {"expression": "document.documentElement.outerHTML", "returnByValue": True}}))
    resp = json.loads(ws.recv())
    return resp.get("result", {}).get("result", {}).get("value", "")

def extract_posts(html):
    """Extract posts from X search HTML."""
    posts = []
    
    # Look for article elements with data-testid
    article_pattern = re.compile(r'<article[^>]*data-testid="tweet"[^>]*>(.*?)</article>', re.DOTALL)
    articles = article_pattern.findall(html)
    
    for article in articles:
        try:
            # Extract author
            author_match = re.search(r'<span[^>]*class="[^"]*css-901oao[^"]*r-1khlxwv[^"]*"[^>]*>([^<]+)</span>', article)
            author = author_match.group(1) if author_match else "Unknown"
            
            # Extract handle
            handle_match = re.search(r'@([a-zA-Z0-9_]+)', article)
            handle = "@" + handle_match.group(1) if handle_match else "Unknown"
            
            # Extract text
            text_patterns = [
                r'data-testid="tweetText"[^>]*>(.*?)</span>',
                r'<span[^>]*class="[^"]*css-901oao[^"]*"[^>]*>([^<]{20,})</span>'
            ]
            text = ""
            for pat in text_patterns:
                m = re.search(pat, article, re.DOTALL)
                if m:
                    text = re.sub(r'<[^>]+>', '', m.group(1))[:500]
                    break
            
            # Extract engagement
            likes_match = re.search(r'([\d,]+)\s*(?:like|likes)', article, re.IGNORECASE)
            likes = int(likes_match.group(1).replace(",", "")) if likes_match else 0
            
            retweets_match = re.search(r'([\d,]+)\s*(?:retweet|retweets)', article, re.IGNORECASE)
            retweets = int(retweets_match.group(1).replace(",", "")) if retweets_match else 0
            
            # Extract time
            time_match = re.search(r'<time[^>]*datetime="([^"]+)"', article)
            post_time = time_match.group(1) if time_match else ""
            
            if text and len(text) > 10:
                posts.append({
                    "author": author[:100],
                    "handle": handle[:50],
                    "text": text[:500],
                    "likes": likes,
                    "retweets": retweets,
                    "time": post_time,
                    "url": ""
                })
        except Exception as e:
            continue
    
    return posts

def save_to_db(posts, search_query):
    """Save posts to SQLite database."""
    db_path = "/Users/bobvarkey/.openclaw/workspace/memory_x_posts.db"
    
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Create table if not exists
    c.execute('''CREATE TABLE IF NOT EXISTS x_posts
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  author TEXT, handle TEXT, text TEXT, likes INTEGER, 
                  retweets INTEGER, post_time TEXT, url TEXT, 
                  search_query TEXT, scraped_at TEXT)''')
    
    for post in posts:
        c.execute('''INSERT INTO x_posts 
                     (author, handle, text, likes, retweets, post_time, url, search_query, scraped_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (post["author"], post["handle"], post["text"], post["likes"],
                   post["retweets"], post["time"], post["url"], search_query,
                   datetime.now().isoformat()))
    
    conn.commit()
    conn.close()
    return len(posts)

def append_markdown_report(posts, search_query):
    """Append posts to markdown report."""
    os.makedirs("/Users/bobvarkey/.openclaw/workspace/knowledge-base/x-scrapes", exist_ok=True)
    report_path = f"/Users/bobvarkey/.openclaw/workspace/knowledge-base/x-scrapes/x-scrape-{datetime.now().strftime('%Y-%m-%d')}.md"
    
    with open(report_path, "a") as f:
        f.write(f"\n## {search_query}\n")
        f.write(f"Scraped at: {datetime.now().isoformat()}\n\n")
        
        if not posts:
            f.write("No posts found.\n")
            return 0
        
        f.write(f"Found {len(posts)} posts:\n\n")
        
        high_engagement = [p for p in posts if p["likes"] > 50]
        if high_engagement:
            f.write(f"### High Engagement Posts (>50 likes): {len(high_engagement)}\n\n")
            for p in high_engagement:
                f.write(f"**{p['author']}** ({p['handle']})\n")
                f.write(f"- Likes: {p['likes']} | Retweets: {p['retweets']}\n")
                f.write(f"- Time: {p['time']}\n")
                f.write(f"- {p['text'][:200]}...\n\n")
        
        f.write(f"### All Posts ({len(posts)})\n\n")
        for p in posts:
            f.write(f"- **{p['author']}** ({p['handle']}) | Likes: {p['likes']} | RT: {p['retweets']} | {p['time']}\n")
            f.write(f"  {p['text'][:150]}...\n\n")
    
    return len(posts), len(high_engagement)

def main():
    searches = [
        ("neurointervention/thrombectomy/stroke", "https://x.com/search?q=neurointervention%20OR%20thrombectomy%20OR%20%23Neurointervention%20OR%20%23stroke&src=typed_query&f=top&since:today"),
        ("cerebral AVM/aneurysm/endovascular", "https://x.com/search?q=cerebral%20AVM%20OR%20intracranial%20aneurysm%20OR%20endovascular&src=typed_query&f=top&since:today")
    ]
    
    total_posts = 0
    total_high_engagement = 0
    
    try:
        ws_url = get_cdpws_url()
        print(f"Connecting to Chrome at: {ws_url}")
        
        for name, url in searches:
            print(f"\n=== Scraping: {name} ===")
            print(f"URL: {url}")
            
            try:
                import websocket
                ws = websocket.create_connection(ws_url, timeout=30)
                
                # Enable Page domain
                ws.send(json.dumps({"id": 1, "method": "Page.enable"}))
                ws.recv()
                
                # Navigate
                ws.send(json.dumps({"id": 2, "method": "Page.navigate", "params": {"url": url}}))
                
                # Wait for load
                while True:
                    msg = ws.recv()
                    data = json.loads(msg)
                    if data.get("method") == "Page.loadEventFired":
                        break
                
                # Wait for JS to render
                import time
                time.sleep(5)
                
                # Get HTML
                ws.send(json.dumps({"id": 10, "method": "Runtime.evaluate", "params": {"expression": "document.documentElement.outerHTML", "returnByValue": True}}))
                resp = json.loads(ws.recv())
                html = resp.get("result", {}).get("result", {}).get("value", "")
                
                ws.close()
                
                posts = extract_posts(html)
                print(f"Extracted {len(posts)} posts from HTML")
                
                count, high = append_markdown_report(posts, name)
                total_posts += count
                total_high_engagement += high
                
                save_to_db(posts, name)
                print(f"Saved to DB and markdown report")
                
            except Exception as e:
                print(f"Error scraping {name}: {e}")
                import traceback
                traceback.print_exc()
        
        print(f"\n=== SUMMARY ===")
        print(f"Total posts found: {total_posts}")
        print(f"High engagement posts (>50 likes): {total_high_engagement}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
