// slide-10.js — Recommendations & Differentiation
const pptxgen = require("pptxgenjs");

const slideConfig = { type: 'summary', index: 10, title: 'Recommendations' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Recommendations", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 28, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 0.95, w: 2, h: 0,
    line: { color: theme.accent, width: 2 }
  });

  slide.addText("Where [Your Product Name] should differentiate", {
    x: 0.5, y: 1.1, w: 9, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: theme.secondary,
    bold: false, align: "left", margin: 0
  });

  // Recommendation cards — 3 columns
  const recs = [
    {
      num: "01",
      title: "Build a software product,\nnot just content",
      body: "None of the five competitors offer an interactive software/SaaS product. They are all content distribution (journals, newsletters) or clinical practices. The opportunity is to build a tool clinicians actually use — not just read."
    },
    {
      num: "02",
      title: "Own the AI-in-medicine\nniche no one owns",
      body: "Eric Topol covers AI in medicine through written analysis, but no competitor offers an interactive AI-powered clinical tool. Position as the AI-native healthcare platform — combining the credibility of peer-reviewed evidence with actionable software."
    },
    {
      num: "03",
      title: "Transparent, accessible\npricing as a moat",
      body: "Journals hide behind '$649/yr' and 'Custom' pricing. Clinicians charge per visit. Only a Substack shows transparent pricing. A clear freemium or affordable subscription model would be a distinct advantage over both journal gatekeeping and per-visit fees."
    }
  ];

  const cardW = 2.8;
  const gap = 0.2;
  const startX = 0.5;
  const cardY = 1.7;
  const cardH = 3.5;

  recs.forEach((rec, i) => {
    const cx = startX + i * (cardW + gap);

    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cardY, w: cardW, h: cardH,
      fill: { color: "FFFFFF" },
      line: { color: theme.light, width: 1 }
    });

    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: cx + 0.3, y: cardY + 0.25, w: 0.5, h: 0.5,
      fill: { color: theme.primary }
    });
    slide.addText(rec.num, {
      x: cx + 0.3, y: cardY + 0.25, w: 0.5, h: 0.5,
      fontSize: 16, fontFace: "Georgia", color: theme.bg,
      bold: true, align: "center", valign: "middle"
    });

    // Title
    slide.addText(rec.title, {
      x: cx + 0.3, y: cardY + 0.9, w: cardW - 0.6, h: 0.8,
      fontSize: 13, fontFace: "Georgia", color: theme.primary,
      bold: true, align: "left", valign: "top", margin: 0
    });

    // Body
    slide.addText(rec.body, {
      x: cx + 0.3, y: cardY + 1.8, w: cardW - 0.6, h: 1.5,
      fontSize: 10, fontFace: "Calibri", color: theme.secondary,
      bold: false, align: "left", valign: "top",
      lineSpacingMultiple: 1.3, margin: 0
    });
  });

  // Bottom bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.125, w: 10, h: 0.5,
    fill: { color: theme.primary }
  });

  slide.addText("The opportunity: Be the first interactive, AI-enabled, transparently-priced platform in this competitive set", {
    x: 0.5, y: 5.125, w: 9, h: 0.5,
    fontSize: 11, fontFace: "Calibri", color: theme.bg,
    bold: false, align: "center", valign: "middle"
  });

  // Page badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("10", {
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
  pres.writeFile({ fileName: "slide-10-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
