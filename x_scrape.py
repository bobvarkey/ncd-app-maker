#!/usr/bin/env python3
"""
X/Twitter scraper using Playwright (headless Chrome).
Uses cookies from ~/.x_cookies.json if available for authenticated scraping.
Falls back to public-facing scraping if no cookies found.
"""

import sqlite3, os, re, json, time
from datetime import datetime
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────────
DB_PATH = "/Users/bobvarkey/.openclaw/workspace/memory_x_posts.db"
MD_DIR = Path("/Users/bobvarkey/.openclaw/workspace/knowledge-base/x-scrapes")
COOKIE_FILE = Path.home() / ".x_cookies.json"
MD_DIR.mkdir(parents=True, exist_ok=True)

SEARCHES = [
    ("stroke-neurointervention", "https://x.com/search?q=stroke%20OR%20thrombectomy%20OR%20neurointervention%20OR%20%23Neurointervention&src=typed_query&f=top"),
    ("neurology", "https://x.com/search?q=neurology%20OR%20%23NeuroTwitter%20OR%20%23NeuroX&src=typed_query&f=top"),
    ("aneurysm-AVM", "https://x.com/search?q=cerebral%20aneurysm%20OR%20AVM%20OR%20endovascular%20OR%20%23Neurovascular&src=typed_query&f=top"),
]

# ── DB ──────────────────────────────────────────────────────────────────────

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS x_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT, handle TEXT, text TEXT, likes INTEGER,
        retweets INTEGER, post_time TEXT, url TEXT,
        search_query TEXT, scraped_at TEXT
    )""")
    conn.commit()
    conn.close()


def save_to_db(posts, search_name):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    now = datetime.now().isoformat()
    for p in posts:
        c.execute("""INSERT INTO x_posts
            (author, handle, text, likes, retweets, post_time, url, search_query, scraped_at)
            VALUES (?,?,?,?,?,?,?,?,?)""",
            (p["author"], p["handle"], p["text"], p["likes"],
             p["retweets"], p["time"], p["url"], search_name, now))
    conn.commit()
    conn.close()


# ── Extract ─────────────────────────────────────────────────────────────────

def extract_posts(page) -> list:
    posts = []
    try:
        articles = page.locator('article[data-testid="tweet"]').all()
    except Exception:
        return posts

    for article in articles:
        try:
            # Author
            author_els = article.locator('[class*="displayName"]').all()
            author = author_els[0].inner_text().strip() if author_els else "Unknown"

            # Handle
            handle_els = article.locator('[class*="screenName"], [class*="caution-inline"]').all()
            handle_text = handle_els[0].inner_text().strip() if handle_els else ""
            handle_m = re.search(r'@(\w+)', handle_text)
            handle = "@" + handle_m.group(1) if handle_m else "@unknown"

            # Text
            text_el = article.locator('[data-testid="tweetText"]').first
            text = text_el.inner_text().strip() if text_el.count() else ""

            # Likes
            likes = 0
            like_els = article.locator('[data-testid="like"]').all()
            if like_els:
                t = like_els[0].inner_text().strip()
                m = re.search(r'([\d,]+)', t)
                if m:
                    likes = int(m.group(1).replace(",", ""))

            # Retweets
            retweets = 0
            rt_els = article.locator('[data-testid="retweet"]').all()
            if rt_els:
                t = rt_els[0].inner_text().strip()
                m = re.search(r'([\d,]+)', t)
                if m:
                    retweets = int(m.group(1).replace(",", ""))

            # Time
            time_els = article.locator('time').all()
            post_time = time_els[0].get_attribute("datetime") if time_els else ""

            # URL
            link_els = article.locator('a[href*="/status/"]').all()
            url = link_els[0].get_attribute("href") if link_els else ""
            if url and not url.startswith("http"):
                url = "https://x.com" + url

            if text and len(text) > 10:
                posts.append({
                    "author": author[:100],
                    "handle": handle[:50],
                    "text": text[:500],
                    "likes": likes,
                    "retweets": retweets,
                    "time": post_time,
                    "url": url,
                })
        except Exception:
            continue
    return posts


# ── Markdown report ─────────────────────────────────────────────────────────

def write_md(posts, search_name):
    today = datetime.now().strftime("%Y-%m-%d")
    md_path = MD_DIR / f"x-scrape-{today}.md"
    mode = "a" if md_path.exists() else "w"
    with open(md_path, mode) as f:
        if mode == "w":
            f.write(f"# X Scrape — {today}\n\n")
        f.write(f"## Search: {search_name}\n")
        f.write(f"Scraped: {datetime.now().isoformat()}\n\n")
        if not posts:
            f.write("No posts found.\n\n")
            return 0
        f.write(f"Found **{len(posts)}** posts.\n\n")
        high = [p for p in posts if p["likes"] >= 50]
        if high:
            f.write(f"### High Engagement (≥50 likes)\n\n")
            for p in sorted(high, key=lambda x: -x["likes"]):
                f.write(f"**{p['author']}** {p['handle']} | Likes: {p['likes']} | RT: {p['retweets']} | {p['time']}\n")
                f.write(f"- {p['text'][:200]}\n- {p['url']}\n\n")
        f.write(f"### All Posts\n\n")
        for p in posts:
            f.write(f"- **{p['author']}** ({p['handle']}) | Likes: {p['likes']} | RT: {p['retweets']} | {p['time']}\n")
            f.write(f"  {p['text'][:150]}...\n")
        f.write("\n")
    return len(posts)


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    init_db()

    from playwright.sync_api import sync_playwright

    cookies = None
    if COOKIE_FILE.exists():
        try:
            cookies = json.loads(COOKIE_FILE.read_text())
            print(f"Loaded {len(cookies)} cookies from {COOKIE_FILE}")
        except Exception as e:
            print(f"Could not load cookies: {e}")
            cookies = None
    else:
        print(f"No cookie file at {COOKIE_FILE} — scraping public view (may hit login wall)")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            extra_http_headers={
                "Accept-Language": "en-US,en;q=0.9",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
        )

        if cookies:
            try:
                ctx.add_cookies(cookies)
                print("Cookies applied successfully")
            except Exception as e:
                print(f"Cookie apply failed: {e}")

        page = ctx.new_page()
        page.set_default_timeout(30000)

        for name, url in SEARCHES:
            print(f"\n=== Scraping: {name} ===")
            try:
                page.goto(url, wait_until="load", timeout=25000)
                page.wait_for_timeout(3000)
                page.evaluate("window.scrollBy(0, 500)")
                page.wait_for_timeout(1500)

                posts = extract_posts(page)
                print(f"  Extracted {len(posts)} posts")

                count = write_md(posts, name)
                save_to_db(posts, name)
                print(f"  Saved {count} posts")

            except Exception as e:
                print(f"  ERROR: {e}")
                import traceback
                traceback.print_exc()

            time.sleep(1)

        browser.close()

    print(f"\n=== Done: {datetime.now().isoformat()} ===")


if __name__ == "__main__":
    main()