#!/usr/bin/env python3
"""
X AI News Scraper - Lex Fridman, Yann LeCun, Andrej Karpathy, Fei-Fei Li, Timnit Gebru
Filters: No politics, high-quality AI/ML/research content
Output: Markdown summary
"""

import json
import os
from datetime import datetime

# Target accounts to scrape
TARGET_ACCOUNTS = [
    "lexfridman",      # Lex Fridman - AI/ML podcasts, robotics, ethics
    "ylecun",          # Yann LeCun - Meta AI, vision, self-supervised learning
    "karpathy",        # Andrej Karpathy - Deep learning tutorials
    "drfeifei",        # Fei-Fei Li - Stanford vision, multimodal AI
    "timnitGebru",     # Timnit Gebru - AI ethics, fairness
    "elonmusk",        # AI + tech (often relevant)
    "sama",            # Sam Altman - OpenAI
    "AndrewYNg",       # Andrew Ng - AI education
    "goodfellow_ian",  # Ian Goodfellow - GANs, ML
    "JeffDean",        # Google AI
]

# Keywords to prioritize (AI/ML/tech research)
PRIORITY_KEYWORDS = [
    "research", "paper", "model", "training", "dataset", "benchmark",
    "AI", "ML", "LLM", "transformer", "GPT", "Claude", "Gemini",
    "deep learning", "neural", "vision", "NLP", "robotics",
    "self-supervised", "reinforcement", "agent", "multimodal",
    "open source", "release", "announcement", "demo", "code", "github"
]

# Keywords to EXCLUDE (politics, drama)
EXCLUDE_KEYWORDS = [
    "politics", "political", "election", "trump", "biden",
    "war", "conflict", "geopolitics", "protest", "rally",
    "cancel", "drama", "controversy", "outrage", "scandal"
]

def analyze_post(post):
    """Analyze if post is high-quality AI content."""
    text = post.get("text", "").lower()
    
    # Check exclusions first
    for kw in EXCLUDE_KEYWORDS:
        if kw in text:
            return False, "excluded"
    
    # Check priority keywords
    priority_count = sum(1 for kw in PRIORITY_KEYWORDS if kw in text)
    
    return priority_count >= 1, "included"

def format_summary(posts):
    """Format posts into markdown summary."""
    date = datetime.now().strftime("%Y-%m-%d")
    
    md = f"""# X AI News Daily — {date}

## 🎯 Accounts Monitored
{", ".join(f"@{a}" for a in TARGET_ACCOUNTS)}

## 🔥 High-Engagement Posts

"""
    
    # Sort by engagement
    sorted_posts = sorted(posts, key=lambda x: x.get("likes", 0) + x.get("reposts", 0)*2, reverse=True)
    
    for i, p in enumerate(sorted_posts[:15], 1):
        md += f"""### {i}. @{p['handle']} — {p.get('date', '')}
{p['text'][:300]}{'...' if len(p.get('text','')) > 300 else ''}

📊 {p.get('replies',0)} 💬 · {p.get('reposts',0)} 🔁 · {p.get('likes',0)} ❤️ · {p.get('views',0)} 👁️

---
"""
    
    md += f"""
## 🏗️ Builders & Projects

"""
    
    # Find posts about builds/projects
    build_posts = [p for p in posts if any(kw in p.get("text","").lower() for kw in ["build", "release", "demo", "launch", "open source", "github"])]
    for p in build_posts[:5]:
        md += f"- @{p['handle']}: {p['text'][:150]}...\n"
    
    md += """
## 📚 Research & Papers

"""
    
    # Find research posts
    research_posts = [p for p in posts if any(kw in p.get("text","").lower() for kw in ["paper", "research", "study", "arxiv", "publication"])]
    for p in research_posts[:5]:
        md += f"- @{p['handle']}: {p['text'][:150]}...\n"
    
    md += f"""
---
*Generated: {datetime.now().isoformat()}*
*Filtered: No politics, high-quality AI/ML content*
"""
    
    return md

if __name__ == "__main__":
    print("X AI Scraper ready.")
    print("Run with browser automation for live data.")
