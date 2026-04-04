// slide-01.js — Cover Page
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'cover',
  index: 1,
  title: 'Tenecteplase in Stroke'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Full background — deep teal
  slide.background = { color: theme.primary };

  // Decorative accent bar — left side
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.25, h: 5.625,
    fill: { color: theme.accent }
  });

  // Decorative horizontal line — coral accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.9, w: 3.5, h: 0.06,
    fill: { color: theme.light }
  });

  // Main title
  slide.addText("Tenecteplase in Stroke", {
    x: 0.6, y: 1.6, w: 8.5, h: 1.2,
    fontSize: 52, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "left", valign: "bottom"
  });

  // Subtitle
  slide.addText("Social Media Landscape — What's the Buzz?", {
    x: 0.6, y: 3.0, w: 8.5, h: 0.7,
    fontSize: 22, fontFace: "Arial",
    color: theme.light, bold: false,
    align: "left", valign: "top"
  });

  // Date / Occasion
  slide.addText("March 2026", {
    x: 0.6, y: 4.6, w: 4, h: 0.4,
    fontSize: 14, fontFace: "Arial",
    color: theme.accent, bold: false,
    align: "left"
  });

  // Bottom right decorative circle
  slide.addShape(pres.shapes.OVAL, {
    x: 8.2, y: 4.0, w: 1.8, h: 1.8,
    fill: { color: theme.secondary, transparency: 60 }
  });

  slide.addShape(pres.shapes.OVAL, {
    x: 8.6, y: 4.4, w: 1.2, h: 1.2,
    fill: { color: theme.accent, transparency: 40 }
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
  pres.writeFile({ fileName: "slide-01-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
