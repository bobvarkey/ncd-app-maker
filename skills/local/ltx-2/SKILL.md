---
name: ltx-2
description: LTX-2 is the first DiT-based audio-video foundation model from Lightricks. It generates synchronized audio and video from text prompts or images. Use when you need to generate high-quality videos, image-to-video conversion, video-to-video transformations, or audio-driven video generation.
metadata:
  openclaw:
    emoji: 🎬
    user-invocable: true
    requires:
      binaries: ["python3"]
---

# LTX-2 - Audio-Video Generative Model

**Primary purpose:** Generate high-quality audio-video content using DiT-based diffusion models. LTX-2 is the first audio-video foundation model that produces synchronized audio and video from text or image inputs.

## Activation
- Trigger when user wants to generate videos from text prompts
- Use for image-to-video conversion
- Use for video-to-video transformations with IC-LoRA
- Use for audio-driven video generation
- Use for keyframe interpolation

## Installation

The LTX-2 environment is set up at:
```
~/LTX-2/
```

### Environment Setup
```bash
cd ~/LTX-2
source .venv/bin/activate
```

## Required Models

Before using LTX-2, you need to download models from HuggingFace:
https://huggingface.co/Lightricks/LTX-2.3

### Required Downloads:
1. **Model Checkpoint** (choose one):
   - `ltx-2.3-22b-dev.safetensors` - Development version
   - `ltx-2.3-22b-distilled.safetensors` - Distilled version (faster)

2. **Spatial Upscaler** (for two-stage pipeline):
   - `ltx-2.3-spatial-upscaler-x2-1.0.safetensors`
   - `ltx-2.3-spatial-upscaler-x1.5-1.0.safetensors`

3. **Distilled LoRA** (for two-stage pipelines):
   - `ltx-2.3-22b-distilled-lora-384.safetensors`

4. **Gemma Text Encoder**:
   - Download from https://huggingface.co/google/gemma-3-12b-it-qat-q4_0-unquantized

### Download Location
Place all models in:
```
~/LTX-2/models/
```

## Usage Examples

### Text-to-Video (Two-Stage - Recommended)
```bash
cd ~/LTX-2
source .venv/bin/activate

python -m ltx_pipelines.ti2vid_two_stages \
    --checkpoint-path models/ltx-2.3-22b-distilled.safetensors \
    --distilled-lora models/ltx-2.3-22b-distilled-lora-384.safetensors 0.8 \
    --spatial-upsampler-path models/ltx-2.3-spatial-upscaler-x2-1.0.safetensors \
    --gemma-root models/gemma-3-12b \
    --prompt "A beautiful sunset over the ocean with waves crashing" \
    --output-path output.mp4
```

### Image-to-Video
```bash
python -m ltx_pipelines.ti2vid_two_stages \
    --checkpoint-path models/ltx-2.3-22b-distilled.safetensors \
    --distilled-lora models/ltx-2.3-22b-distilled-lora-384.safetensors 0.8 \
    --spatial-upsampler-path models/ltx-2.3-spatial-upscaler-x2-1.0.safetensors \
    --gemma-root models/gemma-3-12b \
    --image-path input.jpg \
    --prompt "Make the image come alive with motion" \
    --output-path output.mp4
```

### Fast Generation (Distilled Pipeline)
```bash
python -m ltx_pipelines.distilled \
    --checkpoint-path models/ltx-2.3-22b-distilled.safetensors \
    --gemma-root models/gemma-3-12b \
    --prompt "A bird flying in the sky" \
    --output-path output.mp4
```

## Available Pipelines

| Pipeline | Description |
|----------|-------------|
| `ti2vid_two_stages` | Production-quality text/image-to-video with 2x upsampling (recommended) |
| `ti2vid_two_stages_hq` | Same as above but with res_2s second-order sampler |
| `ti2vid_one_stage` | Single-stage generation for quick prototyping |
| `distilled` | Fastest inference with 8 predefined sigmas |
| `ic_lora` | Video-to-video transformations |
| `keyframe_interpolation` | Interpolate between keyframe images |
| `a2vid_two_stage` | Audio-to-video generation |
| `retake` | Regenerate specific time regions of existing videos |

## System Requirements

- **GPU**: Recommended (Apple Silicon M-series or NVIDIA GPU)
- **RAM**: 16GB+ recommended
- **Storage**: 20GB+ for models and outputs

## Notes
- LTX-2 requires significant GPU memory (~16GB VRAM recommended)
- Use the distilled model for faster inference
- Two-stage pipelines produce higher quality output
- Place all downloaded models in ~/LTX-2/models/ directory
