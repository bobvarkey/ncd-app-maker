---
title: Obsidian Web Clipper
type: entity
tags: [tool, browser-extension, scraping]
created: 2026-04-05
modified: 2026-04-05
sources: [1]
---

# Obsidian Web Clipper

## What It Is

A browser extension that converts web articles to markdown. Very useful for quickly getting sources into your raw collection.

- Available for Chrome, Firefox, Edge, Brave
- Install from browser extension store

## Key Features

- Clip full article or selection
- Auto-extract clean content (removes ads, navigation)
- Download images locally (see tip below)
- Save directly to Obsidian vault

## Tip: Download Images Locally

1. In Obsidian Settings → Files and links → Set "Attachment folder path" to `raw/assets/`
2. Settings → Hotkeys → Find "Download attachments for current file" → Bind to hotkey (e.g., Ctrl+Shift+D)
3. After clipping an article → hit hotkey → all images download to local disk

This is optional but useful:
- LLM can view and reference images directly
- No broken URLs if online content disappears
- Note: LLMs can't read markdown with inline images in one pass. Read text first, then view images separately for full context.

## Related

- [[Obsidian]] — the app this integrates with
- [[Ingest Workflow]] — one way sources enter the wiki
