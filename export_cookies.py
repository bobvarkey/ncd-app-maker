#!/usr/bin/env python3
"""
Export X.com cookies using Playwright.
Launches a visible browser — log in to X, then press Enter here.
Cookies are saved to ~/.x_cookies.json and reused by x_scrape.py.
"""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json, sys

COOKIE_FILE = Path.home() / ".x_cookies.json"


def main():
    print("=" * 60)
    print("X.com Cookie Exporter for Playwright Scraper")
    print("=" * 60)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        ctx = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
        )
        page = ctx.new_page()
        page.goto("https://x.com", wait_until="load", timeout=15000)

        print("\nBrowser opened — go to the window and log in to X.")
        print("Once logged in, press ENTER here to save cookies.")
        print(f"Cookie file: {COOKIE_FILE}")
        print()

        # Wait for Enter keypress
        input("Press ENTER after logging in: ")

        # Give page a moment to settle
        page.wait_for_timeout(3000)

        cookies = ctx.cookies()
        with open(COOKIE_FILE, "w") as f:
            json.dump(cookies, f, indent=2)

        print(f"\nSaved {len(cookies)} cookies to {COOKIE_FILE}")

        # Quick check
        auth_cookies = [c for c in cookies if "auth" in c["name"].lower() or
                        "session" in c["name"].lower() or
                        "ct0" in c["name"].lower()]
        print(f"Auth tokens found: {len(auth_cookies)}")

        if not auth_cookies:
            print("WARNING: No obvious auth tokens found. Login may have failed.")

        browser.close()
        print("Done!")


if __name__ == "__main__":
    main()