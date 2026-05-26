// slide-09.js — Feature Parity Matrix
const pptxgen = require("pptxgenjs");

const slideConfig = { type: 'content', index: 9, title: 'Feature Parity Matrix' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addText("Feature Parity Matrix", {
    x: 0.5, y: 0.15, w: 9, h: 0.45,
    fontSize: 22, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 0.65, w: 1.8, h: 0,
    line: { color: theme.accent, width: 2 }
  });

  slide.addText("✓ = Supported  ·  — = Not available  ·  ~ = Partial", {
    x: 5.5, y: 0.2, w: 4, h: 0.35,
    fontSize: 9, fontFace: "Calibri", color: theme.secondary,
    italic: true, align: "right", margin: 0
  });

  // Feature rows
  const features = [
    "Interactive software/product",
    "Peer-reviewed research",
    "Clinical patient care",
    "Newsletter / content",
    "AI / tech in medicine focus",
    "Free tier available",
    "Transparent pricing",
    "Enterprise / institutional plan",
    "Global audience",
    "Evidence-based medicine advocacy"
  ];

  const headers = ["Feature", "@hyderabad\ndoctor", "@EricTopol\nGround Truths", "@theliverdoc", "@JAMANeuro", "@GreenJournal"];

  const checkData = [
    ["—", "—", "—", "—", "—"],
    ["—", "~", "✓", "✓", "✓"],
    ["✓", "—", "✓", "—", "—"],
    ["✓", "✓", "✓", "✓", "✓"],
    ["~", "✓", "—", "—", "—"],
    ["—", "✓", "—", "—", "—"],
    ["✓", "✓", "—", "✓", "~"],
    ["—", "—", "—", "✓", "✓"],
    ["~", "✓", "~", "✓", "✓"],
    ["✓", "✓", "✓", "—", "—"]
  ];

  // Build table header row
  const headerCells = headers.map((h, i) => ({
    text: h,
    options: {
      bold: true, color: "FFFFFF", fill: { color: theme.primary },
      fontSize: i === 0 ? 10 : 8, fontFace: "Calibri",
      align: i === 0 ? "left" : "center",
      valign: "middle"
    }
  }));

  const rows = [headerCells];

  features.forEach((feat, ri) => {
    const cells = [];
    // Feature name
    cells.push({
      text: feat,
      options: {
        bold: true, fontSize: 9, fontFace: "Calibri", color: theme.primary,
        fill: { color: ri % 2 === 0 ? "FFFFFF" : theme.light },
        align: "left"
      }
    });

    // Check marks
    checkData[ri].forEach((val, ci) => {
      const isCheck = val === "✓";
      const isPartial = val === "~";
      cells.push({
        text: val,
        options: {
          bold: true,
          fontSize: 11,
          fontFace: "Calibri",
          color: isCheck ? "2a9d8f" : (isPartial ? theme.accent : theme.light),
          fill: { color: ri % 2 === 0 ? "FFFFFF" : theme.light },
          align: "center",
          valign: "middle"
        }
      });
    });

    rows.push(cells);
  });

  slide.addTable(rows, {
    x: 0.3, y: 0.9, w: 9.4,
    colW: [2.0, 1.4, 1.6, 1.2, 1.4, 1.4],
    border: { pt: 0.5, color: theme.light },
    rowH: [0.38, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32],
    margin: [2, 4, 2, 4]
  });

  // Insight box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.8, w: 9.4, h: 0.6,
    fill: { color: theme.primary }
  });

  slide.addText("Key gap: No competitor offers an interactive software product. All are content distribution (newsletters, journals) or clinical practices.", {
    x: 0.5, y: 4.8, w: 9, h: 0.6,
    fontSize: 11, fontFace: "Calibri", color: theme.bg,
    bold: false, align: "center", valign: "middle"
  });

  // Page badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("9", {
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
  pres.writeFile({ fileName: "slide-09-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
