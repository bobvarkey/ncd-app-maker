// slide-07.js — TNK vs Alteplase Adoption
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 7,
  title: 'TNK vs Alteplase: Adoption Outlook'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: theme.primary }
  });

  slide.addText("TNK vs Alteplase: Adoption Outlook", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 30, fontFace: "Arial",
    color: theme.primary, bold: true,
    align: "left"
  });

  slide.addText("Where the evidence, practicality, and sentiment are pointing", {
    x: 0.5, y: 0.88, w: 9, h: 0.35,
    fontSize: 13, fontFace: "Arial",
    color: theme.secondary, bold: false,
    align: "left"
  });

  // Comparison table
  const headers = ["Dimension", "Tenecteplase", "Alteplase"];
  const rows = [
    ["Evidence", "Class I-equivalent (2026)", "Standard of care"],
    ["Dosing", "Single IV push (0.25 mg/kg)", "1-hour infusion (0.9 mg/kg)"],
    ["Cost", "~ $3,000 cheaper per dose", "Standard pricing"],
    ["FDA Status", "Off-label (stroke)", "FDA approved"],
    ["Global Use", "Widely adopted (India, Europe, AU)", "Still dominant in US"],
    ["Practicality", "Fibrin-specific, easier logistics", "Requires infusion pump"],
    ["Social Sentiment", "Trending, enthusiastic", "Viewed as legacy option"]
  ];

  const colWidths = [2.2, 3.3, 3.3];
  const startX = 0.5;
  const startY = 1.35;
  const rowH = 0.48;
  const headerH = 0.52;

  // Header row
  let xPos = startX;
  headers.forEach((h, i) => {
    const isCenter = i > 0;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: startY, w: colWidths[i], h: headerH,
      fill: { color: theme.primary }
    });
    slide.addText(h, {
      x: xPos, y: startY, w: colWidths[i], h: headerH,
      fontSize: 13, fontFace: "Arial",
      color: "FFFFFF", bold: true,
      align: isCenter ? "center" : "left",
      valign: "middle"
    });
    xPos += colWidths[i];
  });

  // Data rows
  rows.forEach((row, ri) => {
    const y = startY + headerH + ri * rowH;
    const isEven = ri % 2 === 0;
    const bgColor = isEven ? "FFFFFF" : theme.bg;

    xPos = startX;
    row.forEach((cell, ci) => {
      const isCenter = ci > 0;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: xPos, y, w: colWidths[ci], h: rowH,
        fill: { color: bgColor },
        line: { color: theme.light, width: 0.5 }
      });

      // Highlight TNK advantages
      let cellColor = theme.primary;
      if (ci === 1 && (ri === 2 || ri === 5 || ri === 6)) {
        cellColor = theme.secondary;
      }
      if (ci === 2 && ri === 3) {
        cellColor = theme.accent;
      }

      slide.addText(cell, {
        x: xPos + 0.08, y, w: colWidths[ci] - 0.16, h: rowH,
        fontSize: 11, fontFace: "Arial",
        color: cellColor, bold: ci === 0,
        align: isCenter ? "center" : "left",
        valign: "middle"
      });
      xPos += colWidths[ci];
    });
  });

  // Bottom verdict
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 4.65, w: 9, h: 0.55,
    fill: { color: theme.primary },
    rectRadius: 0.06
  });
  slide.addText("Verdict: TNK adoption is inevitable — question is how fast, not whether", {
    x: 0.65, y: 4.65, w: 8.7, h: 0.55,
    fontSize: 13, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("7", {
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
  pres.writeFile({ fileName: "slide-07-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
