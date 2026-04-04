---
name: xcellent
description: Free, open-source X (Twitter) growth tool. Analytics dashboard, niche discovery, AI tweet writer, best posting times, and credit usage monitoring — all running locally on your machine. BYOK (Bring Your Own Key) model means users only pay X directly for API usage (~$5-15/mo). A free alternative to SuperX ($39/mo), Typefully, and Tweet Hunter.
---

# Xcellent

Free X growth tool that runs as a **local web app in your browser**. No cloud, no database, no login, no subscription. Everything stays on your machine.

**Important:** Xcellent is a web-based dashboard that runs on localhost. When you start it, it launches a local web server and you access it at `http://localhost:3848` in your browser. It is NOT a CLI tool — it has a full visual UI with charts, tables, and interactive features. Always open the browser URL after starting the server.

## What It Does

1. **Dashboard** — Follower growth, impressions, engagement rate, profile visits
2. **Analytics** — Per-tweet performance, sortable by impressions/likes/engagement
3. **Niche Discovery** — Find accounts and trending content in any niche
4. **AI Tweet Writer** — Generate tweets in the user's voice, with style options
5. **Best Posting Times** — Calculated from the user's actual tweet data
6. **Credit Monitor** — Real-time X API usage tracking in the sidebar
7. **Scheduling** — Post via Postiz integration (optional)

## Quick Start

```bash
# Clone the Xcellent repo
git clone https://github.com/OllieWazza/LarrySkill.git xcellent
cd xcellent

# Install dependencies
cd server && npm install && cd ..
cd ui && npm install && cd ..

# Build UI and start server on an HTTP port (8080)
PORT=8080 bash start.sh
```

Then open http://localhost:8080 in the browser.

## X API Pricing (for users)

Since January 2026, X uses pay-per-use pricing:
- $0.005 per post read
- $0.01 per user lookup  
- $0.01 per post created
- New accounts get a $10 free voucher
- Typical creator usage: **$5-15/month** (vs $39/mo for SuperX)

## AI Tweet Writer

Uses the user's OpenAI API key. Analyzes recent tweets for voice matching, generates 3 drafts per request, shows character count with 280-char limit indicator.

## macOS Local Network Permission

On macOS Sequoia (15.0+), Chrome needs **Local Network** permission to access localhost sites. Enable: System Settings → Privacy & Security → Local Network → enable Google Chrome.
