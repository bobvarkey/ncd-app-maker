#!/usr/bin/env python3
"""
Memory Organizer - Nightly maintenance script
Sorts loose files from root into topic subfolders based on keyword matching.
Adds YAML frontmatter if missing.
Topics: cabinet, content, products, technical, x, user, daily (fallback)
No LLM calls - pure keyword matching. Idempotent.
"""

import os
import re
import shutil
from datetime import datetime
from pathlib import Path

ROOT = Path.home() / ".openclaw" / "workspace"
TOPICS = {
    "cabinet": ["secret", "config", "credential", "auth", "key", "token"],
    "content": ["post", "thread", "tweet", "blog", "article", "content"],
    "products": ["product", "app", "service", "tool", "skill"],
    "technical": ["code", "script", "python", "api", "model", "system"],
    "x": ["twitter", "x.com", "tweet", "bookmark"],
    "user": ["user", "customer", "client", "profile"],
    "daily": []  # fallback
}

def get_topic(filename: str) -> str:
    """Determine topic based on filename keywords."""
    filename_lower = filename.lower()
    for topic, keywords in TOPICS.items():
        if not keywords:  # skip fallback
            continue
        for kw in keywords:
            if kw in filename_lower:
                return topic
    return "daily"  # fallback

def has_yaml_frontmatter(content: str) -> bool:
    """Check if file already has YAML frontmatter."""
    return content.strip().startswith("---")

def add_frontmatter(filepath: Path, topic: str) -> None:
    """Add YAML frontmatter to file if missing."""
    try:
        content = filepath.read_text(encoding="utf-8")
    except Exception:
        return
    
    if has_yaml_frontmatter(content):
        return  # Already has frontmatter
    
    # Extract title from filename
    title = filepath.stem.replace("-", " ").replace("_", " ").title()
    
    # Create frontmatter
    date_str = datetime.now().strftime("%Y-%m-%d")
    frontmatter = f"""---
topic: {topic}
date: {date_str}
tags: []
---

# {title}

"""
    
    # Prepend frontmatter
    new_content = frontmatter + content
    filepath.write_text(new_content, encoding="utf-8")
    print(f"  Added frontmatter to {filepath.name}")

def organize_memory(root: Path, dry_run: bool = True) -> dict:
    """Organize loose files into topic subfolders."""
    stats = {"moved": 0, "frontmatter": 0, "skipped": 0}
    
    # Get all topic folders
    topic_folders = {}
    for topic in TOPICS:
        topic_path = root / topic
        topic_folders[topic] = topic_path
        if not dry_run:
            topic_path.mkdir(parents=True, exist_ok=True)
    
    # Scan root for loose files
    for item in root.iterdir():
        # Skip directories and special folders
        if item.is_dir():
            if item.name in TOPICS or item.name.startswith("."):
                continue
            stats["skipped"] += 1
            continue
        
        if item.name.startswith("."):
            stats["skipped"] += 1
            continue
        
        # Skip non-text files
        if item.suffix not in [".md", ".txt", ".json", ".yaml", ".yml"]:
            stats["skipped"] += 1
            continue
        
        # Determine target topic
        topic = get_topic(item.name)
        target = topic_folders[topic]
        
        if dry_run:
            print(f"  [DRY-RUN] Would move {item.name} -> {topic}/")
            stats["moved"] += 1
        else:
            dest = target / item.name
            # Handle name conflicts
            if dest.exists():
                dest = target / f"{item.stem}_{datetime.now().strftime('%Y%m%d')}{item.suffix}"
            shutil.move(str(item), str(dest))
            print(f"  Moved {item.name} -> {topic}/")
            stats["moved"] += 1
            
            # Add frontmatter
            add_frontmatter(dest, topic)
            stats["frontmatter"] += 1
    
    return stats

if __name__ == "__main__":
    import sys
    
    dry_run = "--dry-run" in sys.argv or "-n" in sys.argv
    
    if dry_run:
        print("[Memory Organizer] DRY RUN MODE")
    else:
        print("[Memory Organizer] Running...")
    
    stats = organize_memory(ROOT, dry_run=dry_run)
    print(f"\nSummary: {stats['moved']} files processed, {stats['frontmatter']} frontmatter added, {stats['skipped']} skipped")
