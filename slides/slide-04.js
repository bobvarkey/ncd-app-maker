// slide-04.js — @EricTopol (Ground Truths)
const pptxgen = require("pptxgenjs");

const slideConfig = { type: 'content', index: 4, title: '@EricTopol — Ground Truths' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: theme.accent }
  });

  slide.addText("@EricTopol", {
    x: 0.5, y: 0.2, w: 6, h: 0.5,
    fontSize: 24, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addText("Ground Truths (Substack)  ·  Scripps Research  ·  Author 'Deep Medicine'", {
    x: 0.5, y: 0.7, w: 6, h: 0.3,
    fontSize: 13, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left", margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 9, h: 0.5,
    fill: { color: theme.primary }
  });
  slide.addText('"Facts, data and analytics about biomedical matters"', {
    x: 0.6, y: 1.1, w: 8.8, h: 0.5,
    fontSize: 12, fontFace: "Calibri", color: theme.light,
    italic: true, align: "center", valign: "middle"
  });

  // Left — Features
  slide.addText("Top Features", {
    x: 0.5, y: 1.8, w: 4.2, h: 0.3,
    fontSize: 14, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  const features = [
    "In-depth biomedical research analysis",
    "Weekly newsletter + podcast format",
    "AI in healthcare coverage (author of Deep Medicine)",
    "Over 206K free subscribers, 1000+ paid",
    "Pre-tax proceeds fund Scripps Research"
  ];

  slide.addText(features.map((f, i) => ({
    text: f,
    options: { bullet: { code: "2713" }, breakLine: i < features.length - 1, fontSize: 11, color: theme.secondary, bold: false }
  })), {
    x: 0.5, y: 2.2, w: 4.2, h: 2.2,
    fontFace: "Calibri", align: "left", valign: "top",
    paraSpaceAfter: 4
  });

  // Right — Pricing
  slide.addText("Pricing", {
    x: 5.2, y: 1.8, w: 4.3, h: 0.3,
    fontSize: 14, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  // Free plan
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 2.2, w: 4.3, h: 0.7,
    fill: { color: "FFFFFF" },
    line: { color: theme.light, width: 1 }
  });
  slide.addText("Free", {
    x: 5.4, y: 2.25, w: 1.5, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });
  slide.addText("$0/month", {
    x: 7.8, y: 2.25, w: 1.5, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.accent,
    bold: true, align: "right", margin: 0
  });
  slide.addText("All core posts delivered to inbox", {
    x: 5.4, y: 2.5, w: 3.9, h: 0.25,
    fontSize: 10, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left", margin: 0
  });

  // Paid plan
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.0, w: 4.3, h: 0.9,
    fill: { color: "FFFFFF" },
    line: { color: theme.accent, width: 1.5 }
  });
  slide.addText("Paid (Recommended)", {
    x: 5.4, y: 3.05, w: 1.8, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });
  slide.addText("$8/month or $80/year", {
    x: 7.0, y: 3.05, w: 2.3, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.accent,
    bold: true, align: "right", margin: 0
  });
  slide.addText([
    { text: "Podcast episodes & Q&A sessions", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Recommendations & topic requests", options: { bullet: true, breakLine: true, fontSize: 10 } },
    { text: "Proceeds support Scripps Research", options: { bullet: true, fontSize: 10 } }
  ], {
    x: 5.4, y: 3.3, w: 3.9, h: 0.5,
    fontFace: "Calibri", color: theme.secondary, align: "left", valign: "top",
    paraSpaceAfter: 2
  });

  // Bottom
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 4.35, w: 9, h: 0,
    line: { color: theme.light, width: 1 }
  });

  slide.addText("What they do well", {
    x: 0.5, y: 4.45, w: 4.5, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });
  slide.addText([
    { text: "Unmatched credibility — top 10 most cited researcher", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Large engaged audience (206K+ subscribers)", options: { bullet: true, fontSize: 10, bold: false } }
  ], {
    x: 0.5, y: 4.7, w: 4.5, h: 0.7,
    fontFace: "Calibri", color: theme.secondary, align: "left", valign: "top",
    paraSpaceAfter: 2
  });

  slide.addText("Where they're weak", {
    x: 5.2, y: 4.45, w: 4.3, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });
  slide.addText([
    { text: "No software product — newsletter only", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Read-only content, no interactive tools", options: { bullet: true, fontSize: 10, bold: false } }
  ], {
    x: 5.2, y: 4.7, w: 4.3, h: 0.7,
    fontFace: "Calibri", color: theme.secondary, align: "left", valign: "top",
    paraSpaceAfter: 2
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 7.2, y: 0.2, w: 2.3, h: 0.3,
    fill: { color: theme.accent },
    rectRadius: 0.15
  });
  slide.addText("Newsletter / Influencer", {
    x: 7.2, y: 0.2, w: 2.3, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: "FFFFFF",
    bold: true, align: "center", valign: "middle"
  });

  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("4", {
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
  pres.writeFile({ fileName: "slide-04-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
