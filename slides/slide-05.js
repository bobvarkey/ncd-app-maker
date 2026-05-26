// slide-05.js — @theliverdoc (Dr Cyriac Abby Philips)
const pptxgen = require("pptxgenjs");

const slideConfig = { type: 'content', index: 5, title: '@theliverdoc — Dr Cyriac Abby Philips' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: theme.accent }
  });

  slide.addText("@theliverdoc", {
    x: 0.5, y: 0.2, w: 6, h: 0.5,
    fontSize: 24, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addText("Dr Cyriac Abby Philips · Senior Consultant, Rajagiri Hospital Kochi", {
    x: 0.5, y: 0.7, w: 6, h: 0.3,
    fontSize: 13, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left", margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 9, h: 0.5,
    fill: { color: theme.primary }
  });
  slide.addText('"Clinician scientist battling Ayush misinformation, busting medical myths"', {
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
    "Expert hepatologist — clinical & transplant hepatology",
    "Leading voice against alternative medicine myths",
    "Highly published researcher on drug-induced liver injury",
    "Active YouTube channel for liver health education",
    "Multi-award winning clinician scientist"
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

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 2.2, w: 4.3, h: 1.2,
    fill: { color: "FFFFFF" },
    line: { color: theme.light, width: 1 }
  });
  slide.addText("In-Person Consultation", {
    x: 5.4, y: 2.3, w: 3.9, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });
  slide.addText("Varies — hospital consultation fees at Rajagiri Hospital, Kochi", {
    x: 5.4, y: 2.55, w: 3.9, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: theme.accent,
    bold: true, align: "left", margin: 0
  });
  slide.addText([
    { text: "Clinical evaluation & diagnostics", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Liver disease management & transplant care", options: { bullet: true, breakLine: true, fontSize: 10 } },
    { text: "Drug-induced liver injury expertise", options: { bullet: true, fontSize: 10 } }
  ], {
    x: 5.4, y: 2.9, w: 3.9, h: 0.6,
    fontFace: "Calibri", color: theme.secondary, align: "left", valign: "top",
    paraSpaceAfter: 2
  });

  slide.addText("No subscription or SaaS product — clinical practice only", {
    x: 5.4, y: 3.55, w: 3.9, h: 0.25,
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
    { text: "Strong personal brand fighting medical misinformation", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Credible clinical + research background", options: { bullet: true, fontSize: 10, bold: false } }
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
    { text: "No product play — purely clinical practice", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Focus on a single specialty (hepatology)", options: { bullet: true, fontSize: 10, bold: false } }
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
  slide.addText("Individual Clinician", {
    x: 7.2, y: 0.2, w: 2.3, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: "FFFFFF",
    bold: true, align: "center", valign: "middle"
  });

  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("5", {
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
  pres.writeFile({ fileName: "slide-05-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
