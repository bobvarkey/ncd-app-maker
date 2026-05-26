// slide-03.js — @hyderabaddoctor (Dr Sudhir Kumar)
const pptxgen = require("pptxgenjs");

const slideConfig = { type: 'content', index: 3, title: '@hyderabaddoctor — Dr Sudhir Kumar' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Top accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: theme.accent }
  });

  // Title
  slide.addText("@hyderabaddoctor", {
    x: 0.5, y: 0.2, w: 6, h: 0.5,
    fontSize: 24, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addText("Dr Sudhir Kumar MD DM · Neurologist, Apollo Hospitals Hyderabad", {
    x: 0.5, y: 0.7, w: 6, h: 0.3,
    fontSize: 13, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left", margin: 0
  });

  // Tagline box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 9, h: 0.5,
    fill: { color: theme.primary }
  });
  slide.addText('"On a mission to prevent people from becoming patients"', {
    x: 0.6, y: 1.1, w: 8.8, h: 0.5,
    fontSize: 12, fontFace: "Calibri", color: theme.light,
    italic: true, align: "center", valign: "middle"
  });

  // Two columns: Left features, Right pricing
  // Left column — Features
  slide.addText("Top Features", {
    x: 0.5, y: 1.8, w: 4.2, h: 0.3,
    fontSize: 14, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  const features = [
    "26+ years neurology expertise at Apollo Hospitals",
    "Daily health education via X threads",
    "Online consultation via Apollo 24/7",
    "Trusted voice on stroke, epilepsy, headache",
    "Large engaged following on X"
  ];

  slide.addText(features.map((f, i) => ({
    text: f,
    options: { bullet: { code: "2713" }, breakLine: i < features.length - 1, fontSize: 11, color: theme.secondary, bold: false }
  })), {
    x: 0.5, y: 2.2, w: 4.2, h: 2.2,
    fontFace: "Calibri", align: "left", valign: "top",
    paraSpaceAfter: 4
  });

  // Right column — Pricing
  slide.addText("Pricing", {
    x: 5.2, y: 1.8, w: 4.3, h: 0.3,
    fontSize: 14, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  // Plan card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 2.2, w: 4.3, h: 1.6,
    fill: { color: "FFFFFF" },
    line: { color: theme.light, width: 1 }
  });

  slide.addText("In-Person Consultation", {
    x: 5.4, y: 2.3, w: 3.9, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addText("₹1,200 (~$14 USD) per visit", {
    x: 5.4, y: 2.55, w: 3.9, h: 0.25,
    fontSize: 11, fontFace: "Calibri", color: theme.accent,
    bold: true, align: "left", margin: 0
  });

  slide.addText([
    { text: "Face-to-face neurological examination", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Prescriptions & follow-up care", options: { bullet: true, breakLine: true, fontSize: 10 } },
    { text: "Apollo Hospitals diagnostic network", options: { bullet: true, fontSize: 10 } }
  ], {
    x: 5.4, y: 2.85, w: 3.9, h: 0.8,
    fontFace: "Calibri", color: theme.secondary, align: "left", valign: "top",
    paraSpaceAfter: 2
  });

  slide.addText("Online Consultation (Apollo 24/7): ₹500–₹1,000 per session", {
    x: 5.4, y: 3.9, w: 3.9, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: theme.secondary,
    italic: true, align: "left", margin: 0
  });

  // Bottom: Strengths / Weaknesses
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 4.35, w: 9, h: 0,
    line: { color: theme.light, width: 1 }
  });

  // Strengths
  slide.addText("What they do well", {
    x: 0.5, y: 4.45, w: 4.5, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addText([
    { text: "Trusted personal brand built over 26+ years", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Massive reach via daily X content", options: { bullet: true, fontSize: 10, bold: false } }
  ], {
    x: 0.5, y: 4.7, w: 4.5, h: 0.7,
    fontFace: "Calibri", color: theme.secondary, align: "left", valign: "top",
    paraSpaceAfter: 2
  });

  // Weaknesses
  slide.addText("Where they're weak", {
    x: 5.2, y: 4.45, w: 4.3, h: 0.25,
    fontSize: 12, fontFace: "Calibri", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addText([
    { text: "No software/product — pure clinical practice", options: { bullet: true, breakLine: true, fontSize: 10, bold: false } },
    { text: "Limited geographic scope (India only)", options: { bullet: true, fontSize: 10, bold: false } }
  ], {
    x: 5.2, y: 4.7, w: 4.3, h: 0.7,
    fontFace: "Calibri", color: theme.secondary, align: "left", valign: "top",
    paraSpaceAfter: 2
  });

  // Target label
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

  // Page badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("3", {
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
  pres.writeFile({ fileName: "slide-03-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
