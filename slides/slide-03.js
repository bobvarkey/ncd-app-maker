// slide-03.js — Trial Evidence Summary (Updated March 29, 2026)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 3,
  title: 'Trial Evidence at a Glance'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Header bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: theme.primary }
  });

  // Slide title
  slide.addText("Trial Evidence at a Glance", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 30, fontFace: "Arial",
    color: theme.primary, bold: true,
    align: "left"
  });

  // Subtitle
  slide.addText("Key trials & meta-analyses — updated March 2026", {
    x: 0.5, y: 0.88, w: 9, h: 0.35,
    fontSize: 13, fontFace: "Arial",
    color: theme.secondary, bold: false,
    align: "left"
  });

  const trials = [
    {
      name: "AcT Trial",
      pop: "AIS ≤4.5h",
      finding: "Tenecteplase non-inferior to alteplase; now standard of care",
      tag: "Practice-Defining"
    },
    {
      name: "TNK-TPA / NMA",
      pop: "AIS LVO + EVT",
      finding: "TNK bridging → better 90d mRS than EVT alone or alteplase+EVT",
      tag: "LVO Focus"
    },
    {
      name: "TRACE-III",
      pop: "AIS 4.5–24h",
      finding: "Improved outcomes in perfusion-mismatch patients",
      tag: "Late Window"
    },
    {
      name: "TIMELESS",
      pop: "Late window",
      finding: "Neutral — no benefit in unselected late window population",
      tag: "Late Window"
    },
    {
      name: "TRACE-5 (Lancet)",
      pop: "Basilar occlusion ≤24h",
      finding: "Improved functional outcomes, no ↑ hemorrhage or mortality",
      tag: "Basilar"
    },
    {
      name: "New NMA (Stroke 2026)",
      pop: "4 RCTs, 4.5–24h",
      finding: "First NMA to separate EVT± settings — TNK benefits late window when context accounted for",
      tag: "New"
    }
  ];

  const cols = 3;
  const cardW = 2.9;
  const cardH = 1.55;
  const startX = 0.5;
  const startY = 1.35;
  const gapX = 0.2;
  const gapY = 0.18;

  trials.forEach((t, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: "FFFFFF" },
      rectRadius: 0.08,
      shadow: { type: "outer", blur: 3, offset: 1, angle: 45, color: "000000", opacity: 0.08 }
    });

    const tagColor = t.tag === "Practice-Defining" ? theme.primary
      : t.tag === "LVO Focus" ? theme.secondary
      : t.tag === "New" ? theme.accent
      : t.tag === "Late Window" ? theme.light
      : theme.light;
    const tagTextColor = (t.tag === "Practice-Defining" || t.tag === "LVO Focus" || t.tag === "New") ? "FFFFFF" : theme.primary;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.12, y: y + 0.12, w: 1.3, h: 0.28,
      fill: { color: tagColor },
      rectRadius: 0.14
    });
    slide.addText(t.tag, {
      x: x + 0.12, y: y + 0.12, w: 1.3, h: 0.28,
      fontSize: 9, fontFace: "Arial",
      color: tagTextColor, bold: true,
      align: "center", valign: "middle"
    });

    slide.addText(t.name, {
      x: x + 0.12, y: y + 0.46, w: cardW - 0.24, h: 0.32,
      fontSize: 14, fontFace: "Arial",
      color: theme.primary, bold: true,
      align: "left", valign: "middle"
    });

    slide.addText(t.pop, {
      x: x + 0.12, y: y + 0.76, w: cardW - 0.24, h: 0.22,
      fontSize: 10, fontFace: "Arial",
      color: theme.accent, bold: true,
      align: "left"
    });

    slide.addText(t.finding, {
      x: x + 0.12, y: y + 0.97, w: cardW - 0.24, h: 0.5,
      fontSize: 10, fontFace: "Arial",
      color: theme.secondary, bold: false,
      align: "left", valign: "top"
    });
  });

  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("3", {
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
  pres.writeFile({ fileName: "slide-03-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
