// slide-05.js — Twitter/X Discourse
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 5,
  title: 'Twitter/X: What\'s Hot'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: theme.primary }
  });

  slide.addText("Twitter/X: What's Trending", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 30, fontFace: "Arial",
    color: theme.primary, bold: true,
    align: "left"
  });

  slide.addText("2026 guidelines dropped in January — the neuro Twitterverse is still buzzing", {
    x: 0.5, y: 0.88, w: 9, h: 0.35,
    fontSize: 13, fontFace: "Arial",
    color: theme.secondary, bold: false,
    align: "left"
  });

  // Theme cards — 2 columns
  const themes = [
    {
      title: "2026 Guidelines Reaction",
      desc: "\"Tenecteplase. Large cores. 24-hour basilar window. No aggressive BP lowering. The 2026 Stroke Guidelines just changed how lives will be saved.\"",
      type: "Most Viral"
    },
    {
      title: "TNK Adoption Momentum",
      desc: "\"Tenecteplase is gaining ground. And aggressive BP control may actually harm patients. Here's what changed.\"",
      type: "High Engagement"
    },
    {
      title: "Anterior LVO + TNK",
      desc: "\"New evidence suggests patients with anterior circulation large vessel occlusion — IV tenecteplase plus thrombectomy...\"",
      type: "Clinical"
    },
    {
      title: "Basilar Artery Window",
      desc: "\"Tenecteplase within 24 hours improves functional outcomes in basilar artery occlusion without increasing hemorrhage or mortality risk — TRACE-5\"",
      type: "Trial Data"
    }
  ];

  const cardW = 4.35;
  const cardH = 1.5;
  const startX = 0.5;
  const startY = 1.35;
  const gapX = 0.3;
  const gapY = 0.2;

  themes.forEach((t, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    // Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: "FFFFFF" },
      rectRadius: 0.08,
      shadow: { type: "outer", blur: 3, offset: 1, angle: 45, color: "000000", opacity: 0.08 }
    });

    // Type tag
    const tagColor = t.type === "Most Viral" ? theme.accent
      : t.type === "High Engagement" ? theme.primary
      : theme.secondary;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.12, y: y + 0.12, w: 1.35, h: 0.26,
      fill: { color: tagColor },
      rectRadius: 0.13
    });
    slide.addText(t.type, {
      x: x + 0.12, y: y + 0.12, w: 1.35, h: 0.26,
      fontSize: 9, fontFace: "Arial",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });

    // Title
    slide.addText(t.title, {
      x: x + 0.12, y: y + 0.45, w: cardW - 0.24, h: 0.32,
      fontSize: 14, fontFace: "Arial",
      color: theme.primary, bold: true,
      align: "left"
    });

    // Quote
    slide.addText(t.desc, {
      x: x + 0.12, y: y + 0.78, w: cardW - 0.24, h: 0.65,
      fontSize: 9.5, fontFace: "Arial",
      color: theme.secondary, bold: false,
      italic: true,
      align: "left", valign: "top"
    });
  });

  // Bottom insight
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 4.65, w: 9, h: 0.55,
    fill: { color: theme.primary },
    rectRadius: 0.06
  });
  slide.addText("Key Insight: Prehospital TNK, large core expansion, and basilar window are the 3 hottest discussion threads", {
    x: 0.65, y: 4.65, w: 8.7, h: 0.55,
    fontSize: 12, fontFace: "Arial",
    color: "FFFFFF", bold: false,
    align: "center", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("5", {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });

  return slide;
}

if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = {
    primary: "006d77",
    secondary: "83c5be",
    accent: "e29578",
    light: "ffddd2",
    bg: "edf6f9"
  };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-05-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
