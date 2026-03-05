#!/bin/bash
# Reddit Monitor - Simple API-based version

WORKSPACE="$HOME/.openclaw/workspace/Reddit"
SUBFILE="$WORKSPACE/subreddits.md"
REPORT_DIR="$WORKSPACE/Report"
DATE=$(date +%Y-%m-%d)
REPORT_FILE="$REPORT_DIR/${DATE}.md"

mkdir -p "$REPORT_DIR"

echo "=== Reddit Monitor: $DATE ==="

# Start report
cat > "$REPORT_FILE" << EOF
# Reddit Daily Report - $DATE

*Generated at $(date)*

---

EOF

while IFS= read -r sub || [ -n "$sub" ]; do
    [ -z "$sub" ] && continue
    
    echo "Processing r/$sub..."
    echo "## r/$sub" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # Fetch via Reddit API
    response=$(curl -s "https://www.reddit.com/r/$sub/hot/.json?limit=15" \
        -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
        -H "Accept: application/json")
    
    if [ -n "$response" ] && echo "$response" | python3 -c "import json,sys; json.load(sys.stdin)" 2>/dev/null; then
        echo "$response" | python3 -c "
import json, sys
data = json.load(sys.stdin)
posts = data['data']['children']
for p in posts:
    d = p['data']
    title = d['title'][:70] + '...' if len(d['title']) > 70 else d['title']
    print(f\"- **{title}** ({d['score']} pts)\")
    print(f\"  Comments: {d['num_comments']} | [Link](https://reddit.com{d['permalink']})\")
" >> "$REPORT_FILE"
    else
        echo "- *Could not fetch posts*" >> "$REPORT_FILE"
    fi
    
    echo "" >> "$REPORT_FILE"
    
done < "$SUBFILE"

echo "---" >> "$REPORT_FILE"
echo "*End of Report*" >> "$REPORT_FILE"

echo "=== Done! Report: $REPORT_FILE ==="
