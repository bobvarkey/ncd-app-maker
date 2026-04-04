const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

// Theme - Tech/Modern
const theme = {
  primary: "1a1a2e",    // Dark navy
  secondary: "16213e",  // Dark blue
  accent: "0f3460",     // Medium blue
  light: "e94560",      // Red accent
  bg: "f8f9fa"          // Light gray
};

// Slide 1: Cover
const slide1 = pres.addSlide();
slide1.background = { color: theme.primary };

slide1.addText("Daily Tech Digest", {
  x: 0.5, y: 1.5, w: 9, h: 1,
  fontSize: 44, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center"
});
slide1.addText("March 26, 2026", {
  x: 0.5, y: 2.6, w: 9, h: 0.6,
  fontSize: 24, fontFace: "Arial", color: theme.light, align: "center"
});
slide1.addText("🚀", {
  x: 0.5, y: 3.5, w: 9, h: 0.8,
  fontSize: 40, align: "center"
});

// Slide 2: Top Stories
const slide2 = pres.addSlide();
slide2.background = { color: theme.bg };

slide2.addText("📰 Top Stories", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", color: theme.primary, bold: true
});

const stories = [
  "EU Wants to Scan Your Private Messages — Chat Control proposal sparks privacy debate",
  "Running Tesla Model 3 Computer on Desk — Hacker reverse-engineered crashed Tesla computer",
  "ARC-AGI-3 Released — New AI benchmark for generalized reasoning",
  "Ensu — Local LLM App — Ente released a local-first LLM application",
  "Supreme Court Sides with Cox on Pirated Music — Copyright ruling with ISP implications",
  "Apple Randomly Closes Bug Reports — Developers report Apple closing tickets",
  "Quantization from the Ground Up — Making LLMs smaller and faster",
  "Meta Liable for Child Sexual Exploitation on Platforms — Major lawsuit verdict"
];

let yPos = 1.1;
stories.forEach((story, i) => {
  slide2.addText(`${i + 1}. ${story}`, {
    x: 0.5, y: yPos, w: 9, h: 0.45,
    fontSize: 14, fontFace: "Arial", color: theme.secondary
  });
  yPos += 0.48;
});

// Page badge
slide2.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: theme.accent } });
slide2.addText("2", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 12, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });

// Slide 3: Quick Hits
const slide3 = pres.addSlide();
slide3.background = { color: theme.bg };

slide3.addText("⚡ Quick Hits", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", color: theme.primary, bold: true
});

const hits = [
  "• My DIY FPGA board runs Quake II",
  "• 90% of Claude Code output goes to GitHub repos",
  "• Supreme Court copyright ruling",
  "• Woman reunites with lost dog after 11 years via chip"
];

let yPos3 = 1.1;
hits.forEach((hit) => {
  slide3.addText(hit, {
    x: 0.5, y: yPos3, w: 9, h: 0.6,
    fontSize: 18, fontFace: "Arial", color: theme.secondary
  });
  yPos3 += 0.7;
});

// Page badge
slide3.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: theme.accent } });
slide3.addText("3", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 12, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });

// Slide 4: Closing
const slide4 = pres.addSlide();
slide4.background = { color: theme.primary };

slide4.addText("Have a great Thursday!", {
  x: 0.5, y: 2, w: 9, h: 1,
  fontSize: 36, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center"
});
slide4.addText("🚀", {
  x: 0.5, y: 3.2, w: 9, h: 0.8,
  fontSize: 40, align: "center"
});

// Save
pres.writeFile({ fileName: './output/daily-tech-digest.pptx' })
  .then(() => console.log("✅ Created: output/daily-tech-digest.pptx"))
  .catch(err => console.error(err));