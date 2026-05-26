// slide-08.js — Side-by-Side Pricing Comparison Table
const pptxgen = require("pptxgenjs");

const slideConfig = { type: 'content', index: 8, title: 'Pricing Comparison' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addText("Pricing Comparison Across All 5 Competitors", {
    x: 0.5, y: 0.2, w: 9, h: 0.5,
    fontSize: 22, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 0.75, w: 1.8, h: 0,
    line: { color: theme.accent, width: 2 }
  });

  // Build the table
  const headerRow = [
    { text: "Competitor", options: { bold: true, color: "FFFFFF", fill: { color: theme.primary }, fontSize: 10, fontFace: "Calibri", align: "left" } },
    { text: "Category", options: { bold: true, color: "FFFFFF", fill: { color: theme.primary }, fontSize: 10, fontFace: "Calibri", align: "left" } },
    { text: "Free Tier", options: { bold: true, color: "FFFFFF", fill: { color: theme.primary }, fontSize: 10, fontFace: "Calibri", align: "center" } },
    { text: "Paid Entry", options: { bold: true, color: "FFFFFF", fill: { color: theme.primary }, fontSize: 10, fontFace: "Calibri", align: "center" } },
    { text: "Enterprise", options: { bold: true, color: "FFFFFF", fill: { color: theme.primary }, fontSize: 10, fontFace: "Calibri", align: "center" } },
    { text: "Notes", options: { bold: true, color: "FFFFFF", fill: { color: theme.primary }, fontSize: 10, fontFace: "Calibri", align: "left" } }
  ];

  const row1 = [
    { text: "@hyderabaddoctor", options: { bold: true, fontSize: 9, fontFace: "Calibri", color: theme.primary, fill: { color: "FFFFFF" } } },
    { text: "Clinician", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, fill: { color: "FFFFFF" } } },
    { text: "—", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, align: "center", fill: { color: "FFFFFF" } } },
    { text: "₹1,200/visit", options: { fontSize: 9, fontFace: "Calibri", color: theme.accent, bold: true, align: "center", fill: { color: "FFFFFF" } } },
    { text: "—", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, align: "center", fill: { color: "FFFFFF" } } },
    { text: "Per-visit fee, not SaaS", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, fill: { color: "FFFFFF" } } }
  ];

  const row2 = [
    { text: "@EricTopol", options: { bold: true, fontSize: 9, fontFace: "Calibri", color: theme.primary, fill: { color: theme.light } } },
    { text: "Newsletter", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, fill: { color: theme.light } } },
    { text: "✓ Free posts", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, align: "center", fill: { color: theme.light } } },
    { text: "$8/mo", options: { fontSize: 9, fontFace: "Calibri", color: theme.accent, bold: true, align: "center", fill: { color: theme.light } } },
    { text: "—", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, align: "center", fill: { color: theme.light } } },
    { text: "Proceeds fund Scripps Res.", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, fill: { color: theme.light } } }
  ];

  const row3 = [
    { text: "@theliverdoc", options: { bold: true, fontSize: 9, fontFace: "Calibri", color: theme.primary, fill: { color: "FFFFFF" } } },
    { text: "Clinician", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, fill: { color: "FFFFFF" } } },
    { text: "—", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, align: "center", fill: { color: "FFFFFF" } } },
    { text: "Varies", options: { fontSize: 9, fontFace: "Calibri", color: theme.accent, bold: true, align: "center", fill: { color: "FFFFFF" } } },
    { text: "—", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, align: "center", fill: { color: "FFFFFF" } } },
    { text: "Hospital fees only", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, fill: { color: "FFFFFF" } } }
  ];

  const row4 = [
    { text: "@JAMANeuro", options: { bold: true, fontSize: 9, fontFace: "Calibri", color: theme.primary, fill: { color: theme.light } } },
    { text: "Journal", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, fill: { color: theme.light } } },
    { text: "—", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, align: "center", fill: { color: theme.light } } },
    { text: "$649/yr", options: { fontSize: 9, fontFace: "Calibri", color: theme.accent, bold: true, align: "center", fill: { color: theme.light } } },
    { text: "Custom", options: { fontSize: 9, fontFace: "Calibri", color: theme.accent, align: "center", fill: { color: theme.light } } },
    { text: "APC ~$5K for OA", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, fill: { color: theme.light } } }
  ];

  const row5 = [
    { text: "@GreenJournal", options: { bold: true, fontSize: 9, fontFace: "Calibri", color: theme.primary, fill: { color: "FFFFFF" } } },
    { text: "Journal", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, fill: { color: "FFFFFF" } } },
    { text: "—", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, align: "center", fill: { color: "FFFFFF" } } },
    { text: "AAN member incl.", options: { fontSize: 9, fontFace: "Calibri", color: theme.accent, bold: true, align: "center", fill: { color: "FFFFFF" } } },
    { text: "Custom", options: { fontSize: 9, fontFace: "Calibri", color: theme.accent, align: "center", fill: { color: "FFFFFF" } } },
    { text: "Non-member: Custom", options: { fontSize: 9, fontFace: "Calibri", color: theme.secondary, fill: { color: "FFFFFF" } } }
  ];

  slide.addTable([headerRow, row1, row2, row3, row4, row5], {
    x: 0.4, y: 1.1, w: 9.2,
    colW: [1.6, 1.0, 0.9, 1.3, 0.9, 2.5],
    border: { pt: 0.5, color: theme.light },
    rowH: [0.35, 0.35, 0.35, 0.35, 0.35, 0.35],
    margin: [2, 4, 2, 4]
  });

  // Callout box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.4, w: 9.2, h: 1.6,
    fill: { color: "FFFFFF" },
    line: { color: theme.light, width: 1 }
  });

  slide.addText("Key Pricing Observations", {
    x: 0.6, y: 3.5, w: 8.8, h: 0.3,
    fontSize: 14, fontFace: "Georgia", color: theme.primary,
    bold: true, align: "left", margin: 0
  });

  const obs = [
    "Only @EricTopol has a true free tier (all core posts) and transparent pricing ($8/mo)",
    "@JAMANeuro at $649/yr is the most expensive individual option — premium journal pricing",
    "@GreenJournal bundles journal access into AAN membership — price is opaque for non-members",
    "None of the five competitors offer a SaaS/product platform — they are journals, newsletters, or clinical practices"
  ];

  slide.addText(obs.map((o, i) => ({
    text: o,
    options: { bullet: { code: "25B6" }, breakLine: i < obs.length - 1, fontSize: 10, color: theme.secondary, bold: false }
  })), {
    x: 0.6, y: 3.85, w: 8.8, h: 1.0,
    fontFace: "Calibri", align: "left", valign: "top",
    paraSpaceAfter: 3
  });

  // Page badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("8", {
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
  pres.writeFile({ fileName: "slide-08-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
