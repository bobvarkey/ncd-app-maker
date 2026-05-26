// slide-06.js — @JAMANeuro (JAMA Neurology)
const pptxgen = require("pptxgenjs");

const slideConfig = { type: 'content', index: 6, title: '@JAMANeuro — JAMA Neurology' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: theme.accent }
  });

  slide.addText("@JAMANeuro", {
    x: 0.5, y: 0.2, w: 6, h: 0.5,
    fontSize: 24, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addText("JAMA Neurology  ·  American Medical Association  ·  IF: 21.4", {
    x: 0.5, y: 0.7, w: 6, h: 0.3,
    fontSize: 13, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left", margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 9, h: 0.5,
    fill: { color: theme.primary }
  });
  slide.addText('"Advancing Brain and Nervous System Science"', {
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
    "Impact Factor 21.4 — top-tier neurology journal",
    "Rigorous peer review by JAMA Network",
    "Original investigations, reviews, clinical trials",
    "Global perspective from leading research centers",
    "Multimedia content: podcasts & video summaries"
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

  // Plan 1: Individual
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 2.2, w: 4.3, h: 0.7,
    fill: { color: "FFFFFF" },
    line: { color: theme.light, width: 1 }
  });
  slide.addText("Individual Subscription", {
    x: 5.4, y: 2.25, w: 2, h: 0.25,
    fontSize: 11, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });
  slide.addText("$649/year", {
    x: 7.6, y: 2.25, w: 1.7, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.accent,
    bold: true, align: "right", margin: 0
  });
  slide.addText("Print + online access, monthly issues", {
    x: 5.4, y: 2.5, w: 3.9, h: 0.25,
    fontSize: 10, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left", margin: 0
  });

  // Plan 2: OA APC
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.0, w: 4.3, h: 0.55,
    fill: { color: "FFFFFF" },
    line: { color: theme.light, width: 1 }
  });
  slide.addText("Open Access (Author APC)", {
    x: 5.4, y: 3.05, w: 2.2, h: 0.2,
    fontSize: 11, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });
  slide.addText("~$5,000/article", {
    x: 7.6, y: 3.05, w: 1.7, h: 0.2,
    fontSize: 12, fontFace: "Calibri", color: theme.accent,
    bold: true, align: "right", margin: 0
  });
  slide.addText("CC-BY license, funder OA compliance", {
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
  slide.addText("Contact AMA/Ovid for site license pricing", {
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
    { text: "Premier neurology journal — highest IF in specialty (21.4)", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Backed by AMA brand & JAMA Network ecosystem", options: { bullet: true, fontSize: 10, bold: false } }
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
    { text: "Very expensive for individuals ($649/yr)", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Traditional publication model — slow, read-only", options: { bullet: true, fontSize: 10, bold: false } }
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
  slide.addText("6", {
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
  pres.writeFile({ fileName: "slide-06-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
