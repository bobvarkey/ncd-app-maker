// slide-07.js — @GreenJournal (Neurology / AAN)
const pptxgen = require("pptxgenjs");

const slideConfig = { type: 'content', index: 7, title: '@GreenJournal — Neurology (AAN)' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: theme.accent }
  });

  slide.addText("@GreenJournal", {
    x: 0.5, y: 0.2, w: 6, h: 0.5,
    fontSize: 24, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addText("Neurology  ·  American Academy of Neurology  ·  IF: 9.0", {
    x: 0.5, y: 0.7, w: 6, h: 0.3,
    fontSize: 13, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left", margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 9, h: 0.5,
    fill: { color: theme.primary }
  });
  slide.addText('"The most widely read and highly cited peer-reviewed neurology journal"', {
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
    "Most widely read neurology journal globally",
    "Official journal of AAN (40,000+ members)",
    "75-year publishing legacy since 1951",
    "Short-form article model for faster publication",
    "Integrated CME via AAN Online Learning Center"
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

  // Plan 1: AAN Member
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 2.2, w: 4.3, h: 0.7,
    fill: { color: "FFFFFF" },
    line: { color: theme.accent, width: 1.5 }
  });
  slide.addText("AAN Member (Recommended)", {
    x: 5.4, y: 2.25, w: 2.4, h: 0.25,
    fontSize: 11, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });
  slide.addText("Included", {
    x: 7.6, y: 2.25, w: 1.7, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.accent,
    bold: true, align: "right", margin: 0
  });
  slide.addText("Journal access included with AAN membership dues", {
    x: 5.4, y: 2.5, w: 3.9, h: 0.25,
    fontSize: 10, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left", margin: 0
  });

  // Plan 2: Non-member individual
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.0, w: 4.3, h: 0.55,
    fill: { color: "FFFFFF" },
    line: { color: theme.light, width: 1 }
  });
  slide.addText("Non-Member Individual", {
    x: 5.4, y: 3.05, w: 2, h: 0.2,
    fontSize: 11, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });
  slide.addText("Custom", {
    x: 7.6, y: 3.05, w: 1.7, h: 0.2,
    fontSize: 12, fontFace: "Calibri", color: theme.accent,
    bold: true, align: "right", margin: 0
  });
  slide.addText("Print + online or online-only via LWW", {
    x: 5.4, y: 3.25, w: 3.9, h: 0.2,
    fontSize: 10, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left", margin: 0
  });

  // Plan 3: Institutional
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.65, w: 4.3, h: 0.55,
    fill: { color: "FFFFFF" },
    line: { color: theme.light, width: 1 }
  });
  slide.addText("Institutional / Site License", {
    x: 5.4, y: 3.7, w: 2.5, h: 0.2,
    fontSize: 11, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });
  slide.addText("Custom", {
    x: 7.6, y: 3.7, w: 1.7, h: 0.2,
    fontSize: 12, fontFace: "Calibri", color: theme.accent,
    bold: true, align: "right", margin: 0
  });
  slide.addText("Contact Ovid/Wolters Kluwer for pricing", {
    x: 5.4, y: 3.9, w: 3.9, h: 0.2,
    fontSize: 10, fontFace: "Calibri", color: theme.secondary,
    italic: true, align: "left", margin: 0
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
    { text: "Best reach — 'most widely read' neurology journal", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Deep AAN integration = built-in audience of 40K+", options: { bullet: true, fontSize: 10, bold: false } }
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
    { text: "Lower impact factor (9.0) vs JAMA Neurology (21.4)", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Non-member pricing hidden behind 'Custom' — not transparent", options: { bullet: true, fontSize: 10, bold: false } }
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
  slide.addText("Peer-Reviewed Journal", {
    x: 7.2, y: 0.2, w: 2.3, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: "FFFFFF",
    bold: true, align: "center", valign: "middle"
  });

  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("7", {
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
  pres.writeFile({ fileName: "slide-07-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
