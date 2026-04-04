from PIL import Image, ImageDraw, ImageFont
import textwrap

# Create 1080x1350 poster (Instagram portrait)
width, height = 1080, 1350
img = Image.new('RGB', (width, height), '#1a0533')
draw = ImageDraw.Draw(img)

# Gradient background (purple tones)
for y in range(height):
    r = int(26 + (y/height) * 30)
    g = int(5 + (y/height) * 10)
    b = int(51 + (y/height) * 80)
    draw.line([(0, y), (width, y)], fill=(r, g, b))

# Gold accent line
draw.rectangle([40, 40, width-40, 45], fill='#FFD700')
draw.rectangle([40, height-45, width-40, height-40], fill='#FFD700')

try:
    title_font = ImageFont.truetype('/System/Library/Fonts/SFNSDisplay-Bold.ttf', 42)
    header_font = ImageFont.truetype('/System/Library/Fonts/SFNSDisplay-Bold.ttf', 32)
    body_font = ImageFont.truetype('/System/Library/Fonts/SFNSDisplay-Regular.ttf', 24)
    small_font = ImageFont.truetype('/System/Library/Fonts/SFNSDisplay-Regular.ttf', 20)
except:
    title_font = ImageFont.load_default()
    header_font = title_font
    body_font = title_font
    small_font = title_font

# Title
y = 80
draw.text((width//2, y), "INSC 2026", fill='#FFD700', font=title_font, anchor='mm')
y += 50
draw.text((width//2, y), "Extended Thrombolysis Window", fill='white', font=header_font, anchor='mm')

# Divider
y += 40
draw.rectangle([100, y, width-100, y+2], fill='#FFD700')
y += 20

# Main content
lines = [
    "Wake-up strokes: 8-30% of all ischemic strokes",
    "",
    "The Problem: Unknown onset = disqualified from treatment",
    "",
    "The Fix: Midpoint between sleep & wake as timing proxy",
    "",
    "Why 9 hours works:",
    "  • Circadian surge: BP, HR, coagulation",
    "  • DWI-FLAIR: strokes are 'physiologically young'",
    "  • Perfusion mismatch: salvageable penumbra",
    "",
    "Treatment: rtPA or Tenecteplase beyond 4.5h",
    "if penumbra present on perfusion imaging",
    "",
    "Key: penumbra imaging, not the clock ⏰",
]

for line in lines:
    if line.startswith("  •"):
        draw.text((120, y), line, fill='#c0c0c0', font=body_font)
    elif line == "":
        y += 10
        continue
    elif "Problem" in line or "Fix:" in line or "Key:" in line:
        draw.text((80, y), line, fill='#FFD700', font=body_font)
    else:
        draw.text((80, y), line, fill='white', font=body_font)
    y += 32

# Bottom section
y += 20
draw.rectangle([80, y, width-80, y+1], fill='#FFD700')
y += 15
draw.text((width//2, y), "#StrokeCare #INSC2026 #Neurology #WakeUpStroke", fill='#999999', font=small_font, anchor='mm')

# Save
img.save('/Users/bobvarkey/.openclaw/workspace/insc2026_poster.png', quality=95)
print("Poster saved!")
