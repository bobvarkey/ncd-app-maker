---
name: x-twitter-bookmarks-memory
description: Capture and index Twitter/X bookmarks, threads, and saved content for long-term memory; convert to structured markdown and store in OpenClaw memory DB for quick retrieval and contextual reasoning.
metadata:
  openclaw:
    emoji: 🐦
    user-invocable: true
    requires:
      env: ["TWITTER_API_KEY", "TWITTER_API_SECRET"]
---

# X/Twitter Bookmarks Memory

**Primary purpose:** Transform user bookmarks and saved tweets from X/Twitter into a searchable, indexed memory store within OpenClaw. Enable quick recall, topic-based clustering, and backlinking to original posts.

---
## Activation
- Trigger when user asks to save/bookmark, summarize, or recall Twitter bookmarks or threads.
- Optionally run on a schedule to refresh saved bookmarks.

---
## Workflow (example)
1. Fetch bookmarks/likes/threads via X API (requires keys).
2. Normalize into Markdown with fields: date, author, text, url, tags, engagement metrics.
3. Store in SQLite/vector DB (memory) with indexing for fast retrieval.
4. Provide quick recall prompts by topic, date, or author.

---
## Sample prompts
- Save latest bookmark: "Save this tweet as memory: [tweet URL] by [author], text: ..."
- Recall by topic: "Show me bookmarks about stroke management from last 30 days."
- Quick summary: "Summarize bookmarks on atrial fibrillation from X in the last week." 

---
## Output format
Markdown+YAML front matter for each record when stored, including:
- id, date, author, text, url, tags, engagement

---
Notes
- Ensure compliance with Twitter API terms and user privacy.
- This skill assumes you have valid TWITTER_API_KEY and TWITTER_API_SECRET in your environment.
