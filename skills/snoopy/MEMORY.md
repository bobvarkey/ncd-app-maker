# Snoopy — Memory

## Identity
- **Name:** Snoopy
- **Type:** Daily briefing sub-agent
- **Owner:** Surya Joseph (@Surya Joseph, Telegram ID: 8529861391)
- **Created:** 2026-04-05
- **Last updated:** 2026-05-07
- **Purpose:** Curates and delivers a thoughtful morning briefing every day at 6 AM IST

## Briefing Contents
1. Bashō haiku (rotated from 10-item list, index = day_of_year % 10)
2. Rural development news (live DuckDuckGo news search)
3. Ikebana news (live DuckDuckGo news search)
4. Poem extract or Shakespeare quote (rotated from 10-item list, same rotation as haiku)
5. Word of the day (rotated from 15-item list, index = day_of_year % 15)

## Rotation Logic
- All lists rotate by `day_of_year % list_length`
- Both haiku (10 items) and poem/quote (10 items) use the same rotation index
- Word of the day (15 items) uses its own `day_of_year % 15` index

## Delivery
- **Channel:** Telegram
- **Target:** 8529861391 (Surya Joseph's direct DM with this bot via bot4 account)
- **Schedule:** 6:00 AM IST daily
- **Cron expression:** `30 0 * * *` (00:30 UTC = 06:00 IST)

## Cron Job Details
- **Job ID:** db3ef906-7887-42ff-a893-cbd2824a4f1c
- **Schedule:** `30 0 * * *` (06:00 AM IST, every day)
- **Timezone:** Asia/Kolkata
- **Session:** isolated
- **Delivery:** announce → telegram → 8529861391 via bot4 account (`--account bot4`)
- **Timeout:** 300s (bumped from 120s)
- **Model:** ollama/deepseek-v4-flash:cloud
- **Skill file:** /Users/bobvarkey/.openclaw/workspace/skills/snoopy/SKILL.md
- **Memory file:** /Users/bobvarkey/.openclaw/workspace/skills/snoopy/MEMORY.md

## Fix History
- **2026-05-07:** Increased timeout from 120s to 300s to prevent "job execution timed out" errors
- **2026-05-07:** Changed model from `ollama/qwen2.5-coder:7b` to `ollama/deepseek-v4-flash:cloud` for faster execution
- **2026-05-07:** Fixed delivery account — set `--account bot4` (was defaulting to "default" account which didn't have the user's DM)
- **2026-05-07:** Fixed cron message to use full absolute paths (was using ~ which resolved incorrectly in isolated subagent sessions)
- **2026-05-07:** Removed message-tool send instruction from cron payload — delivery handled by announce mode

## Troubleshooting
- If delivery fails ("chat not found"): verify the cron's delivery.accountId is set to `bot4` and delivery.to is `8529861391`
- If the agent can't find skill files: use full absolute paths (/Users/bobvarkey/.openclaw/workspace/skills/snoopy/...) instead of ~
- If timing out: increase --timeout-seconds or use a faster model
- The cron runs as an isolated subagent — paths must be absolute
