// slide-06.js — Reddit & LinkedIn Sentiment
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 6,
  title: 'Reddit & LinkedIn: Professional Pulse'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: theme.primary }
  });

  slide.addText("Reddit & LinkedIn: Professional Pulse", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 30, fontFace: "Arial",
    color: theme.primary, bold: true,
    align: "left"
  });

  // Two column layout
  // LEFT — Reddit
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.3, w: 4.35, h: 3.45,
    fill: { color: "FFFFFF" },
    rectRadius: 0.1,
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, color: "000000", opacity: 0.08 }
  });

  // Reddit header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 4.35, h: 0.55,
    fill: { color: theme.secondary }
  });
  slide.addText("Reddit — r/neurology", {
    x: 0.5, y: 1.3, w: 4.35, h: 0.55,
    fontSize: 14, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });

  const redditPoints = [
    "MS3 noticed TNK articles but UpToDate still shows alteplase as first line — community clarifies TNK is non-inferior + cheaper",
    "Trainees see TNK as the inevitable standard; older docs slower to adopt",
    "Key cited advantage: ~$3,000 cost savings per dose",
    "FDA off-label status creates a gap between evidence and formal guidance",
    "Thread sentiment: curious, cautiously enthusiastic, waiting for broader institutional adoption"
  ];

  redditPoints.forEach((p, i) => {
    const y = 2.0 + i * 0.52;
    slide.addText("›", {
      x: 0.65, y: y, w: 0.2, h: 0.35,
      fontSize: 14, fontFace: "Arial",
      color: theme.accent, bold: true,
      align: "left"
    });
    slide.addText(p, {
      x: 0.88, y: y, w: 3.8, h: 0.5,
      fontSize: 10.5, fontFace: "Arial",
      color: theme.primary, bold: false,
      align: "left", valign: "top"
    });
  });

  // RIGHT — LinkedIn
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.15, y: 1.3, w: 4.35, h: 3.45,
    fill: { color: "FFFFFF" },
    rectRadius: 0.1,
    shadow: { type: "outer", blur: 3, offset: 1, angle: 45, color: "000000", opacity: 0.08 }
  });

  // LinkedIn header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.15, y: 1.3, w: 4.35, h: 0.55,
    fill: { color: theme.primary }
  });
  slide.addText("LinkedIn — Physicians & Academics", {
    x: 5.15, y: 1.3, w: 4.35, h: 0.55,
    fontSize: 14, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });

  const linkedinPoints = [
    "\"Stroke Care Update – Tenecteplase in the 2026 AIS Guideline\" — highest engagement posts",
    "Reactions: \"This changes everything\" / \"Landscape officially shifted\"",
    "Practical advantages highlighted: single IV push, fibrin-specific, easier logistics",
    "2026 guidelines endorsement giving confidence to early adopters",
    "Debate: US off-label status vs global standard of care —professionals unconcerned about liability"
  ];

  linkedinPoints.forEach((p, i) => {
    const y = 2.0 + i * 0.52;
    slide.addText("›", {
      x: 5.3, y: y, w: 0.2, h: 0.35,
      fontSize: 14, fontFace: "Arial",
      color: theme.accent, bold: true,
      align: "left"
    });
    slide.addText(p, {
      x: 5.53, y: y, w: 3.8, h: 0.5,
      fontSize: 10.5, fontFace: "Arial",
      color: theme.primary, bold: false,
      align: "left", valign: "top"
    });
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("6", {
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
  pres.writeFile({ fileName: "slide-06-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
