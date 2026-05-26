// slide-02.js — Market Positioning Matrix (2x2: Price vs Target Size)
const pptxgen = require("pptxgenjs");

const slideConfig = { type: 'content', index: 2, title: 'Market Positioning Matrix' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Market Positioning Matrix", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 28, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 0.95, w: 2, h: 0,
    line: { color: theme.accent, width: 2 }
  });

  // --- 2x2 Grid area ---
  const gx = 0.8, gy = 1.4, gw = 8.2, gh = 3.8;

  // Axis lines (the box)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: gx, y: gy, w: gw, h: gh,
    fill: { color: theme.bg },
    line: { color: theme.secondary, width: 1 }
  });

  // Vertical divider
  slide.addShape(pres.shapes.LINE, {
    x: gx + gw / 2, y: gy, w: 0, h: gh,
    line: { color: theme.secondary, width: 0.75, dashType: "dash" }
  });

  // Horizontal divider
  slide.addShape(pres.shapes.LINE, {
    x: gx, y: gy + gh / 2, w: gw, h: 0,
    line: { color: theme.secondary, width: 0.75, dashType: "dash" }
  });

  // Axis labels
  slide.addText("Small ← Target Customer Size → Large", {
    x: gx, y: gy + gh + 0.1, w: gw, h: 0.3,
    fontSize: 11, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "center"
  });

  slide.addText("Price →\nLow                                     High", {
    x: 0.05, y: gy, w: 0.7, h: gh,
    fontSize: 10, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "center", valign: "middle"
  });

  // Quadrant labels (small text)
  const qs = 9, qc = theme.secondary;

  // Top-left: Low price, Small customers
  slide.addText("Low Cost\nIndividual Focus", {
    x: gx + 0.1, y: gy + 0.05, w: gw / 2 - 0.2, h: 0.35,
    fontSize: qs, fontFace: "Calibri", color: theme.accent,
    italic: true, align: "left"
  });

  // Top-right: High price, Small customers
  slide.addText("Premium Individual", {
    x: gx + gw / 2 + 0.1, y: gy + 0.05, w: gw / 2 - 0.2, h: 0.35,
    fontSize: qs, fontFace: "Calibri", color: theme.accent,
    italic: true, align: "left"
  });

  // Bottom-left: Low price, Large customers
  slide.addText("High Volume / Mass Market", {
    x: gx + 0.1, y: gy + gh / 2 + 0.05, w: gw / 2 - 0.2, h: 0.35,
    fontSize: qs, fontFace: "Calibri", color: theme.accent,
    italic: true, align: "left"
  });

  // Bottom-right: High price, Large customers
  slide.addText("Enterprise / Premium Scale", {
    x: gx + gw / 2 + 0.1, y: gy + gh / 2 + 0.05, w: gw / 2 - 0.2, h: 0.35,
    fontSize: qs, fontFace: "Calibri", color: theme.accent,
    italic: true, align: "left"
  });

  // --- Plot competitors as circles ---

  // Helper: position (price 0-1 on x within quadrant, size 0-1 on y within quadrant)
  // cx/cy are absolute center coords for each marker

  const dotSize = 0.32;
  const fontSize = 7;

  // @hyderabaddoctor — Low price (~₹1,200/visit), individual patients — Top-Left quadrant
  const x1 = gx + (gw / 2) * 0.15, y1 = gy + (gh / 2) * 0.25;
  slide.addShape(pres.shapes.OVAL, {
    x: x1 - dotSize / 2, y: y1 - dotSize / 2, w: dotSize, h: dotSize,
    fill: { color: theme.primary }
  });
  slide.addText("@hyderabad\ndoctor", {
    x: x1 + dotSize / 2 + 0.05, y: y1 - 0.2, w: 1.5, h: 0.5,
    fontSize: fontSize, fontFace: "Calibri", color: theme.secondary, bold: false, align: "left"
  });

  // @theliverdoc — Low price (hospital visit), individual patients — Top-Left
  const x2 = gx + (gw / 2) * 0.4, y2 = gy + (gh / 2) * 0.5;
  slide.addShape(pres.shapes.OVAL, {
    x: x2 - dotSize / 2, y: y2 - dotSize / 2, w: dotSize, h: dotSize,
    fill: { color: theme.primary }
  });
  slide.addText("@theliverdoc", {
    x: x2 + dotSize / 2 + 0.05, y: y2 - 0.15, w: 1.3, h: 0.4,
    fontSize: fontSize, fontFace: "Calibri", color: theme.secondary, bold: false, align: "left"
  });

  // @EricTopol (Ground Truths) — $8/mo, individuals — Top-Left to Top-Right boundary
  const x3 = gx + (gw / 2) * 0.75, y3 = gy + (gh / 2) * 0.3;
  slide.addShape(pres.shapes.OVAL, {
    x: x3 - dotSize / 2, y: y3 - dotSize / 2, w: dotSize, h: dotSize,
    fill: { color: theme.accent }
  });
  slide.addText("@EricTopol\n(Ground Truths)", {
    x: x3 + dotSize / 2 + 0.05, y: y3 - 0.25, w: 1.5, h: 0.6,
    fontSize: fontSize, fontFace: "Calibri", color: theme.primary, bold: false, align: "left"
  });

  // @JAMANeuro — $649/yr, academic/institutional — Top-Right
  const x4 = gx + gw / 2 + (gw / 2) * 0.2, y4 = gy + (gh / 2) * 0.35;
  slide.addShape(pres.shapes.OVAL, {
    x: x4 - dotSize / 2, y: y4 - dotSize / 2, w: dotSize, h: dotSize,
    fill: { color: theme.primary }
  });
  slide.addText("@JAMANeuro", {
    x: x4 + dotSize / 2 + 0.05, y: y4 - 0.15, w: 1.3, h: 0.4,
    fontSize: fontSize, fontFace: "Calibri", color: theme.secondary, bold: false, align: "left"
  });

  // @GreenJournal — Included w/ AAN membership (mid), entire AAN membership + institutions — Bottom-Right
  const x5 = gx + gw / 2 + (gw / 2) * 0.6, y5 = gy + gh / 2 + (gh / 2) * 0.3;
  slide.addShape(pres.shapes.OVAL, {
    x: x5 - dotSize / 2, y: y5 - dotSize / 2, w: dotSize, h: dotSize,
    fill: { color: theme.primary }
  });
  slide.addText("@GreenJournal\n(Neurology)", {
    x: x5 + dotSize / 2 + 0.05, y: y5 - 0.25, w: 1.5, h: 0.6,
    fontSize: fontSize, fontFace: "Calibri", color: theme.secondary, bold: false, align: "left"
  });

  // Page badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("2", {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fontSize: 12, fontFace: "Arial", color: "FFFFFF",
    bold: true, align: "center", valign: "middle"
  });

  return slide;
}

if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = { primary: "22223b", secondary: "4a4e69", accent: "9a8c98", light: "c9ada7", bg: "f2e9e4" };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-02-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
