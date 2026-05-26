// slide-01.js — Cover: Competitive Landscape
const pptxgen = require("pptxgenjs");

const slideConfig = { type: 'cover', index: 1, title: 'Competitive Landscape' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  // Large decorative circle top-right
  slide.addShape(pres.shapes.OVAL, {
    x: 6.5, y: -1.5, w: 5, h: 5,
    fill: { color: theme.secondary, transparency: 60 }
  });

  // Small decorative circle bottom-left
  slide.addShape(pres.shapes.OVAL, {
    x: -1, y: 3.5, w: 3.5, h: 3.5,
    fill: { color: theme.secondary, transparency: 70 }
  });

  // Thin accent line
  slide.addShape(pres.shapes.LINE, {
    x: 0.6, y: 0.6, w: 2.5, h: 0,
    line: { color: theme.accent, width: 3 }
  });

  // Main title
  slide.addText("Competitive Landscape", {
    x: 0.6, y: 1.2, w: 7, h: 1.2,
    fontSize: 44, fontFace: "Georgia", color: theme.bg,
    bold: true, align: "left", valign: "middle"
  });

  // Subtitle
  slide.addText("[Your Product Name]", {
    x: 0.6, y: 2.5, w: 7, h: 0.6,
    fontSize: 28, fontFace: "Calibri", color: theme.light,
    bold: false, align: "left", valign: "middle"
  });

  // Date
  slide.addText("Market Analysis  ·  May 2026", {
    x: 0.6, y: 3.4, w: 5, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left"
  });

  // Bottom bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.125, w: 10, h: 0.5,
    fill: { color: theme.secondary }
  });

  slide.addText("Competitor Analysis: @hyderabaddoctor · @EricTopol · @theliverdoc · @JAMANeuro · @GreenJournal", {
    x: 0.6, y: 5.125, w: 8.8, h: 0.5,
    fontSize: 11, fontFace: "Calibri", color: theme.bg,
    bold: false, align: "left", valign: "middle"
  });

  return slide;
}

if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = { primary: "22223b", secondary: "4a4e69", accent: "9a8c98", light: "c9ada7", bg: "f2e9e4" };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-01-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
