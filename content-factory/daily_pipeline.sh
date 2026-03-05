#!/bin/bash
# Content Factory Daily Pipeline
# Runs at 8 AM - Research → Write Thread → Thumbnail

CONTENT_DIR="$HOME/.openclaw/workspace/content-factory"
REPORT_DIR="$CONTENT_DIR/reports"
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +"%H:%M")

mkdir -p "$REPORT_DIR"

echo "=== Content Factory: $DATE $TIMESTAMP ==="

# ===== STEP 1: RESEARCH =====
echo "[1/3] Research..."

cat > "$REPORT_DIR/research_$DATE.md" << 'HEADER'
# Research Report - DATE_PLACEHOLDER

*Generated at TIMESTAMP_PLACEHOLDER*

## Top Trending Topics

HEADER

# Use iPhone User Agent to avoid blocking
UA="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"

# Fetch from Reddit
response=$(curl -s -A "$UA" "https://www.reddit.com/r/neurology/hot/.json?limit=8" \
    -H "Accept: application/json" 2>/dev/null)

if [ -n "$response" ] && echo "$response" | python3 -c "import json,sys; json.load(sys.stdin)" 2>/dev/null; then
    echo "$response" | python3 -c "
import json, sys
data = json.load(sys.stdin)
posts = data['data']['children']
print('### r/neurology - Hot Posts')
print()
for i, p in enumerate(posts[:5], 1):
    d = p['data']
    title = d['title'][:65] + '...' if len(d['title']) > 65 else d['title']
    print(f\"{i}. **{title}**\")
    print(f\"   {d['score']} pts | {d['num_comments']} comments\")
    print()
" >> "$REPORT_DIR/research_$DATE.md"
fi

# Get the top topic
TOPIC=$(grep -m1 "1\." "$REPORT_DIR/research_$DATE.md" | sed 's/^[0-9]\. \*\*//' | sed 's/\*\*$//' | tr -d '\n')

echo "Research done"

# ===== STEP 2: THREAD =====
echo "[2/3] Writing Thread..."

cat > "$REPORT_DIR/thread_$DATE.md" << EOF
# Twitter Thread - $DATE

*Topic: $TOPIC*

---

**1/$** 🧵 THREAD: $TOPIC

A breakthrough in neurology that's changing how we think about brain health. Here's what you need to know 👇

---

**2/$** 

Why this matters:
• Affects millions of patients worldwide
• Changes clinical practice
• Opens new research directions

---

**3/$** 

The science behind it:
[Key findings from recent research]

---

**4/$** 

What neurologists are saying:
"The implications for patient care are significant" - experts

---

**5/$** 

What this means for you:
• If you're a patient: new treatment options
• If you're a doctor: updated protocols
• If you're in research: new avenues to explore

---

**6/$** 

The future:
This is just the beginning. Expect more developments in the next 12-18 months.

---

**7/$** 

If you found this useful:
→ Follow for more neurology insights
→ Like/Retweet to share
→ Comment your thoughts

#Neurology #Neuroscience #AI #Healthcare

---

*Edit with your voice before posting!*
EOF

echo "Thread done"

# ===== STEP 3: THUMBNAIL =====
echo "[3/3] Thumbnail..."

curl -s -L "https://gen.pollinations.ai/image/Twitter%20thread%20cover%20image%2C%20neurology%20brain%20AI%2C%20modern%20design%2C%20bold%20typography%2C%20blue%20orange%20gradient%2C%20professional%20social%20media?model=flux&width=1200&height=675&nologo=true" \
    -o "$REPORT_DIR/thumbnail_$DATE.png" --max-time 180 2>/dev/null

[ -s "$REPORT_DIR/thumbnail_$DATE.png" ] && echo "Thumbnail ready" || rm -f "$REPORT_DIR/thumbnail_$DATE.png"

# Fix timestamps in file
sed -i "" "s/DATE_PLACEHOLDER/$DATE/g" "$REPORT_DIR/research_$DATE.md"
sed -i "" "s/TIMESTAMP_PLACEHOLDER/$TIMESTAMP/g" "$REPORT_DIR/research_$DATE.md"

echo "=== Done ==="
