// slide-08.js — Key Takeaways + Content Angles
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'summary',
  index: 8,
  title: 'Key Takeaways & Content Angles'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: theme.primary }
  });

  slide.addText("Key Takeaways & Content Angles", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 30, fontFace: "Arial",
    color: theme.primary, bold: true,
    align: "left"
  });

  // LEFT — Key Takeaways
  slide.addText("Key Takeaways", {
    x: 0.5, y: 1.1, w: 4.5, h: 0.4,
    fontSize: 16, fontFace: "Arial",
    color: theme.primary, bold: true,
    align: "left"
  });

  const takeaways = [
    "2026 AHA/ASA guidelines make TNK Class I-equivalent to alteplase within 4.5h",
    "TNK 0.4 mg/kg is explicitly NOT recommended",
    "Basilar artery window expanded to 24h (TRACE-5); ATTENTION-LATE neutral for thrombectomy add-on",
    "Single IV push + ~$3K cost saving = compelling institutional argument",
    "US still off-label; globally already standard of care",
    "Social media sentiment strongly bullish — \"inevitable adoption\" narrative"
  ];

  takeaways.forEach((t, i) => {
    const y = 1.55 + i * 0.5;
    slide.addShape(pres.shapes.OVAL, {
      x: 0.55, y: y + 0.07, w: 0.22, h: 0.22,
      fill: { color: theme.secondary }
    });
    slide.addText(t, {
      x: 0.88, y: y, w: 4.1, h: 0.48,
      fontSize: 11, fontFace: "Arial",
      color: theme.primary, bold: false,
      align: "left", valign: "top"
    });
  });

  // RIGHT — Content Angles
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.15, y: 1.1, w: 4.35, h: 3.55,
    fill: { color: theme.primary },
    rectRadius: 0.1
  });

  slide.addText("Content Angles", {
    x: 5.35, y: 1.25, w: 3.95, h: 0.4,
    fontSize: 16, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "left"
  });

  // Platform tags
  const angles = [
    {
      platform: "Twitter/X",
      hook: "\"Tenecteplase is now Class I-equivalent to alteplase — single push, $3K cheaper, at least as effective. Why is UpToDate still bolding alteplase?\""
    },
    {
      platform: "Twitter/X",
      hook: "\"The 2026 stroke guidelines quietly made 3 huge changes: TNK for all, large core + 24h basilar window, and aggressive BP lowering may actually be harmful.\""
    },
    {
      platform: "LinkedIn",
      hook: "\"The 2026 AHA/ASA guidelines mark the official end of alteplase's monopoly on thrombolysis. For systems that haven't switched yet, the question isn't 'if' but 'when.'\""
    }
  ];

  angles.forEach((a, i) => {
    const y = 1.75 + i * 1.0;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.35, y, w: 1.2, h: 0.28,
      fill: { color: theme.accent },
      rectRadius: 0.14
    });
    slide.addText(a.platform, {
      x: 5.35, y, w: 1.2, h: 0.28,
      fontSize: 9, fontFace: "Arial",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });

    slide.addText(a.hook, {
      x: 5.35, y: y + 0.32, w: 3.95, h: 0.65,
      fontSize: 10, fontFace: "Arial",
      color: theme.light, bold: false,
      italic: true,
      align: "left", valign: "top"
    });
  });

  // Bottom — Confidence badge
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 4.78, w: 2.2, h: 0.35,
    fill: { color: theme.light },
    rectRadius: 0.05
  });
  slide.addText("Confidence: HIGH", {
    x: 0.5, y: 4.78, w: 2.2, h: 0.35,
    fontSize: 10, fontFace: "Arial",
    color: theme.primary, bold: true,
    align: "center", valign: "middle"
  });

  slide.addText("Sources: Twitter/X, LinkedIn, Reddit r/neurology, PubMed, AHA Journals | March 2026", {
    x: 2.85, y: 4.78, w: 6.0, h: 0.35,
    fontSize: 9, fontFace: "Arial",
    color: theme.secondary, bold: false,
    align: "left", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("8", {
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
  pres.writeFile({ fileName: "slide-08-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
