---
name: daily-intelligence-briefing
description: "Daily intelligence briefing — searches AI news, neurointervention/stroke news, and X trends. Runs at 8:00 AM IST via cron."
cron:
  id: 89a6debd-731b-45fa-acb8-17b87c29a228
  schedule: "0 8 * * *"
  tz: "Asia/Kolkata"
---

# Daily Intelligence Briefing

Run this briefing each morning. Search across three categories and deliver the top 3 most important developments per category.

## Search Backend
Use **Tavily** for all searches. Example setup:
```bash
export TAVILY_API_KEY="your-key"  # Already configured in environment
```

## Three Categories to Search

### 1. ARTIFICIAL INTELLIGENCE
Search query: `AI model releases announcements ${DATE} OR OpenClaw Hermes agentic AI workflows viral tools`
- Major model releases or announcements
- News on OpenClaw and Hermes and agentic workflows
- Viral research, tools, or workflows worth knowing about

### 2. NEUROINTERVENTION AND STROKE
Search query: `neurointervention stroke trials devices ${DATE} OR cerebrovascular new developments`
- Major trials
- News on devices
- Underreported stories with potential impact
- New developments

### 3. WHAT'S TRENDING ON X
Search query: `site:x.com AI neuroscience trending posts ${DATE} OR site:x.com neurology viral`
- Top posts and conversations across AI and Neuroscience
- Emerging creators or accounts worth following
- Any narratives building momentum right now

## Output Format

For each of the 3 categories, provide:

**Category Name**

1. **[Headline]**
   - **What happened:** (2-3 sentences)
   - **Why it matters:** (1-2 sentences)
   - **Follow-up:** (any action items or things to watch)

2. **[Headline]**
   - **What happened:**
   - **Why it matters:**
   - **Follow-up:**

3. **[Headline]**
   - **What happened:**
   - **Why it matters:**
   - **Follow-up:**

## Rules
- Lead with the biggest story first
- Keep it tight — no fluff, no filler
- Use Tavily's `include_answer=True` for AI-generated summaries
- Set `max_results=5` per search to stay focused
- Format final output clean and scannable

## Delivery
Post the completed briefing to **Telegram** via the `message` tool with `action=send` and `channel=telegram`.
