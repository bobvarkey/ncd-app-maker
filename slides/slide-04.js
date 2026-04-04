// slide-04.js — 2026 AHA/ASA Guidelines Update
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 4,
  title: '2026 AHA/ASA Stroke Guidelines'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: theme.primary }
  });

  slide.addText("2026 AHA/ASA Stroke Guidelines", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 30, fontFace: "Arial",
    color: theme.primary, bold: true,
    align: "left"
  });

  slide.addText("The biggest change in thrombolysis in a decade", {
    x: 0.5, y: 0.88, w: 9, h: 0.35,
    fontSize: 13, fontFace: "Arial",
    color: theme.secondary, bold: false,
    align: "left"
  });

  // Left column — big stat callout
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.4, w: 4.2, h: 2.2,
    fill: { color: theme.primary },
    rectRadius: 0.1
  });

  slide.addText("Class I", {
    x: 0.5, y: 1.55, w: 4.2, h: 0.9,
    fontSize: 60, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });

  slide.addText("Equivalent to Alteplase", {
    x: 0.5, y: 2.45, w: 4.2, h: 0.45,
    fontSize: 16, fontFace: "Arial",
    color: theme.light, bold: false,
    align: "center", valign: "top"
  });

  slide.addText("TNK 0.25 mg/kg within 4.5 hours", {
    x: 0.5, y: 2.95, w: 4.2, h: 0.4,
    fontSize: 11, fontFace: "Arial",
    color: theme.light, bold: false,
    align: "center", valign: "top"
  });

  // Right column — key points
  const points = [
    { icon: "●", text: "TNK 0.25 mg/kg (max 25 mg) — standard dose" },
    { icon: "●", text: "TNK 0.4 mg/kg NOT recommended — higher bleeding risk, no added benefit" },
    { icon: "●", text: "Major LVO ≤4.5h: Class I — TNK equivalent to alteplase" },
    { icon: "●", text: "Minor neuro deficit, no major occlusion: Class IIb — TNK may be considered" },
    { icon: "●", text: "Prehospital (mobile stroke unit): TNK suggested over alteplase (weak rec)" },
    { icon: "●", text: "Still off-label in the US — but widely adopted globally" }
  ];

  const startY = 1.45;
  const lineH = 0.55;

  points.forEach((p, i) => {
    const y = startY + i * lineH;
    const isWarning = p.text.includes("NOT recommended");
    const dotColor = isWarning ? theme.accent : theme.secondary;

    slide.addText(p.icon, {
      x: 4.9, y: y + 0.05, w: 0.2, h: 0.3,
      fontSize: 8, fontFace: "Arial",
      color: dotColor, bold: true,
      align: "center"
    });

    slide.addText(p.text, {
      x: 5.1, y: y, w: 4.5, h: 0.5,
      fontSize: 12, fontFace: "Arial",
      color: isWarning ? theme.accent : theme.primary,
      bold: isWarning,
      align: "left", valign: "top"
    });
  });

  // Bottom note
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.8, w: 9, h: 0.01,
    fill: { color: theme.light }
  });

  slide.addText("Key Reference: Prabhakaran SM et al., 2026 AHA/ASA Guideline for the Early Management of AIS, Stroke. 2026", {
    x: 0.5, y: 3.88, w: 9, h: 0.35,
    fontSize: 9, fontFace: "Arial",
    color: theme.secondary, bold: false,
    align: "left"
  });

  // Source badge
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 4.28, w: 2.6, h: 0.35,
    fill: { color: theme.light },
    rectRadius: 0.05
  });
  slide.addText("Published: Jan 26, 2026", {
    x: 0.5, y: 4.28, w: 2.6, h: 0.35,
    fontSize: 10, fontFace: "Arial",
    color: theme.primary, bold: false,
    align: "center", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("4", {
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
  pres.writeFile({ fileName: "slide-04-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
