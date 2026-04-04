// slide-02.js — Table of Contents
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'toc',
  index: 2,
  title: 'Agenda'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Top accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: theme.primary }
  });

  // Page title
  slide.addText("Agenda", {
    x: 0.5, y: 0.35, w: 9, h: 0.7,
    fontSize: 36, fontFace: "Arial",
    color: theme.primary, bold: true,
    align: "left"
  });

  // Section items
  const sections = [
    { num: "01", title: "Trial Evidence", desc: "Key studies: AcT, TNK-TPA, TRACE-III, TIMELESS, TRACE-5" },
    { num: "02", title: "2026 AHA/ASA Guidelines", desc: "Class I-equivalent recommendation, dosing, expanded windows" },
    { num: "03", title: "Twitter/X Discourse", desc: "What's trending, key themes, viral posts" },
    { num: "04", title: "Professional Sentiment", desc: "Reddit & LinkedIn opinions, adoption trends" },
    { num: "05", title: "Key Takeaways", desc: "Summary + content angles for medical content creation" }
  ];

  const startY = 1.25;
  const rowH = 0.78;

  sections.forEach((s, i) => {
    const y = startY + i * rowH;

    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.5, y: y + 0.08, w: 0.48, h: 0.48,
      fill: { color: theme.primary }
    });
    slide.addText(s.num, {
      x: 0.5, y: y + 0.08, w: 0.48, h: 0.48,
      fontSize: 13, fontFace: "Arial",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });

    // Title
    slide.addText(s.title, {
      x: 1.15, y: y, w: 4, h: 0.38,
      fontSize: 18, fontFace: "Arial",
      color: theme.primary, bold: true,
      align: "left", valign: "middle"
    });

    // Description
    slide.addText(s.desc, {
      x: 1.15, y: y + 0.36, w: 7.5, h: 0.35,
      fontSize: 12, fontFace: "Arial",
      color: theme.secondary, bold: false,
      align: "left", valign: "top"
    });

    // Divider line
    if (i < sections.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y: y + rowH - 0.04, w: 9, h: 0.01,
        fill: { color: theme.light }
      });
    }
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("2", {
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
  pres.writeFile({ fileName: "slide-02-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
