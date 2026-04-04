#!/bin/bash
# Researcher Subagent Wrapper

TOPIC="$1"

if [ -z "$TOPIC" ]; then
    echo "Usage: researcher <topic>"
    echo "Example: researcher 'stroke thrombectomy'"
    exit 1
fi

python3 ~/.openclaw/workspace/agents/Researcher/scripts/researcher.py --topic "$TOPIC"
