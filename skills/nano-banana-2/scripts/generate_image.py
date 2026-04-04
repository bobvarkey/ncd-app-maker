#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "google-genai>=1.0.0",
#     "pillow>=10.0.0",
# ]
# ///
"""
Generate images using Google's Gemini 3.1 Flash Image Preview (Nano Banana 2) API.

Usage:
    uv run generate_image.py --prompt "description" --filename "output.png" [options]

Supports: text-to-image, image editing, multi-image input, aspect ratios, Google Search grounding.
"""

import argparse
import base64
import os
import sys
import time
from pathlib import Path


def get_api_key(provided_key: str | None) -> str | None:
    if provided_key:
        return provided_key
    return os.environ.get("GEMINI_API_KEY")


def load_image_as_part(image_path: str):
    """Load an image file and return as genai Part."""
    from google.genai import types
    path = Path(image_path)
    if not path.exists():
        print(f"Error: Image not found: {image_path}", file=sys.stderr)
        sys.exit(1)
    mime_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}
    mime = mime_map.get(path.suffix.lower(), "image/jpeg")
    return types.Part.from_bytes(data=path.read_bytes(), mime_type=mime)


def save_image_data(image_data: bytes, output_path: Path):
    """Save raw image bytes to file."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(image_data)
    print(f"Saved: {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate images with Gemini 3.1 Flash Image Preview (Nano Banana 2)"
    )
    parser.add_argument("--prompt", "-p", required=True, help="Image prompt or editing instructions")
    parser.add_argument("--filename", "-f", required=True, help="Output filename")
    parser.add_argument("--input-images", "-i", nargs="+", help="Input image paths for editing (up to 14)")
    parser.add_argument("--num-images", "-n", type=int, default=1, help="Number of images to generate")
    parser.add_argument("--aspect-ratio", "-a", choices=["1:1", "16:9", "9:16", "4:3", "3:4", "auto"], default="auto", help="Output aspect ratio")
    parser.add_argument("--resolution", "-r", choices=["1K", "2K", "4K"], default="1K", help="Output resolution")
    parser.add_argument("--google-search", action="store_true", help="Enable Google Search grounding")
    parser.add_argument("--api-key", "-k", help="Gemini API key (or set GEMINI_API_KEY)")

    args = parser.parse_args()

    api_key = get_api_key(args.api_key)
    if not api_key:
        print("Error: No API key provided.", file=sys.stderr)
        print("Set GEMINI_API_KEY or pass --api-key", file=sys.stderr)
        sys.exit(1)

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    # Model candidates (try in order, fall back on quota exhaustion)
    model_candidates = [
        "gemini-3.1-flash-image-preview",  # Nano Banana 2
        "gemini-3-pro-image-preview",       # Nano Banana Pro
        "gemini-2.5-flash-image",           # Nano Banana (original)
    ]

    # Build content parts
    parts = [types.Part.from_text(text=args.prompt)]

    # Add input images if provided
    if args.input_images:
        if len(args.input_images) > 14:
            print("Error: Maximum 14 input images", file=sys.stderr)
            sys.exit(1)
        for img_path in args.input_images:
            parts.append(load_image_as_part(img_path))

    # Generation config
    config_params = {
        "response_modalities": ["TEXT", "IMAGE"],
    }

    # Add aspect ratio and resolution hints to prompt if not auto
    if args.aspect_ratio != "auto":
        parts[0] = types.Part.from_text(
            text=f"{args.prompt}\n\nAspect ratio: {args.aspect_ratio}"
        )

    if args.resolution != "1K":
        parts[0] = types.Part.from_text(
            text=f"{parts[0].text}\nResolution: {args.resolution}"
        )

    # Google Search grounding
    if args.google_search:
        config_params["tools"] = [types.Tool(google_search=types.GoogleSearch())]

    config = types.GenerateContentConfig(**config_params)

    # Generate (try models until one works)
    last_error = None
    response = None
    used_model = None
    for model_try in model_candidates:
        try:
            print(f"Generating with {model_try}...")
            response = client.models.generate_content(
                model=model_try,
                contents=types.Content(parts=parts),
                config=config,
            )
            used_model = model_try
            break
        except Exception as e:
            last_error = e
            err_str = str(e)
            if "RESOURCE_EXHAUSTED" in err_str or "429" in err_str or "quota" in err_str.lower():
                print(f"  Quota exhausted for {model_try}, trying next...")
                continue
            else:
                print(f"  Error with {model_try}: {e}", file=sys.stderr)
                continue

    if response is None:
        print(f"All models exhausted. Last error: {last_error}", file=sys.stderr)
        sys.exit(1)

    # Save output images
    output_path = Path(args.filename)
    saved = 0
    for candidate in response.candidates:
        if candidate.content and candidate.content.parts:
            for part in candidate.content.parts:
                if part.inline_data and part.inline_data.data:
                    if saved == 0:
                        save_path = output_path
                    else:
                        stem = output_path.stem
                        suffix = output_path.suffix
                        save_path = output_path.parent / f"{stem}_{saved}{suffix}"
                    save_image_data(part.inline_data.data, save_path)
                    saved += 1
                elif part.text:
                    print(f"Text: {part.text}")

    if saved == 0:
        print("No images generated. Check your prompt and API key.", file=sys.stderr)
        sys.exit(1)

    print(f"Done. {saved} image(s) saved.")


if __name__ == "__main__":
    main()
