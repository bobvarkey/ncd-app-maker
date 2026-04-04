---
name: nano-banana-2
description: "Generate/edit images with Nano Banana 2 (Gemini 3.1 Flash Image Preview). Direct Google API, no inference.sh needed. Supports text-to-image, multi-image editing (up to 14), aspect ratios, Google Search grounding."
allowed-tools: Bash(uv run *)
---

# Nano Banana 2 — Gemini 3.1 Flash Image Preview (Direct API)

Generate and edit images using Google's Gemini 3.1 Flash Image Preview via the Google GenAI Python SDK. **No inference.sh required** — calls Google's API directly.

## Quick Start

**Generate new image:**
```bash
uv run ~/.openclaw/workspace/skills/nano-banana-2/scripts/generate_image.py --prompt "your image description" --filename "output.png"
```

**Edit existing image(s):**
```bash
uv run ~/.openclaw/workspace/skills/nano-banana-2/scripts/generate_image.py --prompt "add a rainbow in the sky" --filename "edited.png" --input-images "original.jpg"
```

**Multiple input images:**
```bash
uv run ~/.openclaw/workspace/skills/nano-banana-2/scripts/generate_image.py --prompt "combine these into a collage" --filename "collage.png" --input-images "img1.jpg" "img2.jpg" "img3.jpg"
```

## API Key

Checks in order:
1. `--api-key` argument
2. `GEMINI_API_KEY` environment variable

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--prompt` | `-p` | Image prompt or editing instructions | **required** |
| `--filename` | `-f` | Output filename | **required** |
| `--input-images` | `-i` | Input image paths (up to 14) | none |
| `--num-images` | `-n` | Number of images to generate | 1 |
| `--aspect-ratio` | `-a` | 1:1, 16:9, 9:16, 4:3, 3:4, auto | auto |
| `--resolution` | `-r` | 1K, 2K, 4K | 1K |
| `--google-search` | | Enable Google Search grounding | off |
| `--api-key` | `-k` | Gemini API key | env var |

## Resolution & Aspect Ratio

- **1K** (default) ~1024px | **2K** ~2048px | **4K** ~4096px
- Aspect ratios: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `auto`

## Google Search Grounding

Enable real-time info (weather, news, current events) in generation:
```bash
uv run .../generate_image.py --prompt "Tokyo weather as art" --filename "tokyo.png" --google-search
```

## Filename Convention

Pattern: `yyyy-mm-dd-hh-mm-ss-descriptive-name.png`

Examples:
- "A serene garden" → `2026-03-13-17-30-00-serene-garden.png`
- "robot portrait" → `2026-03-13-17-31-45-robot-portrait.png`

## Prompt Tips

- **Styles**: photorealistic, illustration, watercolor, oil painting, digital art, anime, 3D render
- **Composition**: close-up, wide shot, aerial view, macro, portrait, landscape
- **Lighting**: natural light, studio lighting, golden hour, dramatic shadows, neon
- **Editing**: Describe only what changes. Everything else stays identical.

## Preflight

- `command -v uv` must exist
- `test -n "$GEMINI_API_KEY"` or pass `--api-key`
- For editing: input images must exist at specified paths

## Examples

**Generate (high-res):**
```bash
uv run ~/.openclaw/workspace/skills/nano-banana-2/scripts/generate_image.py --prompt "medieval castle on a cliff at sunset" --filename "2026-03-13-castle.png" --resolution 4K --aspect-ratio 16:9
```

**Multi-image edit:**
```bash
uv run ~/.openclaw/workspace/skills/nano-banana-2/scripts/generate_image.py --prompt "Merge these two portraits side by side" --filename "merged.png" --input-images "person1.jpg" "person2.jpg"
```
