---
name: headroom
description: The Context Optimization Layer for LLM Applications. Compresses tool outputs that are 70-95% redundant boilerplate, dramatically reducing token usage while preserving accuracy. Use when you need to optimize LLM context, reduce token costs, or compress long outputs before sending to LLMs.
metadata:
  openclaw:
    emoji: 🧠
    user-invocable: true
    requires:
      binaries: ["python3"]
      env: []
---

# Headroom - Context Optimization Layer

**Primary purpose:** Compress LLM context to reduce token usage by 70-95% while preserving accuracy. Headroom intelligently compresses tool outputs, JSON, code, and text using various compression techniques.

## Activation
- Trigger when user wants to reduce token usage in LLM conversations
- Use for compressing long tool outputs, JSON responses, code files
- Use when context window is approaching limits
- Use for cost optimization when working with expensive LLMs

## Features

| Feature | Description |
|---------|-------------|
| **Content Router** | Auto-detects content type, routes to optimal compressor |
| **SmartCrusher** | Universal JSON compression for arrays, objects, nested data |
| **CodeCompressor** | AST-aware compression for Python, JS, Go, Rust, Java, C++ |
| **LLMLingua-2** | ML-based 20x text compression |
| **CCR** | Reversible compression - LLM retrieves originals when needed |
| **Proxy Mode** | Zero code changes - run as proxy server |

## Usage Examples

### Proxy Mode (Recommended for OpenClaw)
```bash
# Start the proxy server
source ~/headroom-env/bin/activate
headroom proxy --port 8787

# Then configure OpenClaw to use the proxy
# Set environment variables for your LLM provider
```

### Python API
```python
from headroom import compress

result = compress(messages, model="claude-sonnet-4-20250514")
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    messages=result.messages
)
print(f"Saved {result.tokens_saved} tokens ({result.compression_ratio:.0%})")
```

### Command Line
```bash
source ~/headroom-env/bin/activate
headroom learn                   # Analyze past sessions
headroom learn --apply          # Write learnings to CLAUDE.md
```

## Requirements
- Python 3.10+
- Virtual environment: ~/headroom-env
- Activate with: `source ~/headroom-env/bin/activate`

## Environment Setup
The headroom package is installed in a virtual environment at:
```
~/headroom-env
```

To use headroom in OpenClaw, activate the environment first:
```bash
source ~/headroom-env/bin/activate
headroom proxy --port 8787
```

## Notes
- Headroom can reduce token usage by 70-95% while maintaining accuracy
- Supports multiple backend providers (OpenAI, Anthropic, Azure, AWS Bedrock, Google Vertex)
- Works with any OpenAI-compatible tool when run as proxy
