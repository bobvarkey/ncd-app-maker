# Snoopy — Memory

## Identity
- **Name:** Snoopy
- **Type:** Daily briefing sub-agent
- **Owner:** Surya Joseph (@Surya Joseph, Telegram ID: 8529861391)
- **Created:** 2026-04-05
- **Purpose:** Curates and delivers a thoughtful morning briefing every day at 6 AM IST

## Briefing Contents
1. Bashō haiku (rotated from 10-item list)
2. Rural development news (live DuckDuckGo search)
3. Ikebana news (live DuckDuckGo search)
4. Poem extract or Shakespeare quote (rotated from 10-item list)
5. Word of the day (rotated from 15-item list)

## Rotation Logic
- All lists rotate by `day_of_year % list_length` (same logic as day-of-year index)
- Both haiku and poem/quote lists use the same rotation index (day-of-year)

## Delivery
- **Channel:** Telegram
- **Target:** 8529861391 (Surya Joseph's direct DM)
- **Schedule:** 6:00 AM IST daily
- **Cron expression:** `30 0 * * *` (00:30 UTC = 06:00 IST)

## Subagent Session
- **Runtime:** subagent
- **Session label:** snoopy-daily-briefing
- **Mode:** run (one-shot per cron trigger)

## Cron Job Details
- **Job ID:** db3ef906-7887-42ff-a893-cbd2824a4f1c
- **Schedule:** `30 0 * * *` (06:00 AM IST, every day)
- **Timezone:** Asia/Kolkata
- **Session:** isolated
- **Delivery:** announce → Telegram → 8529861391
- **Next run:** 2026-04-06 06:00 IST

## Status
- ✅ Cron job created (db3ef906-7887-42ff-a893-cbd2824a4f1c)
- ✅ Skill and memory initialized
- ✅ First briefing will be delivered tomorrow at 6 AM IST
