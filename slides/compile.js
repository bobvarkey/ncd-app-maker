// slides/compile.js — Build final presentation
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'OpenClaw Research Agent';
pres.title = 'Competitive Landscape Analysis';

const theme = {
  primary: "22223b",    // dark — titles, strong elements
  secondary: "4a4e69",  // muted — body text, subtle
  accent: "9a8c98",     // mid-tone — highlights
  light: "c9ada7",      // light accent — subtext
  bg: "f2e9e4"          // background — warm beige
};

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const slideModule = require(`./slide-${num}.js`);
  slideModule.createSlide(pres, theme);
}

pres.writeFile({ fileName: './output/Competitive_Landscape_Deck.pptx' })
  .then(() => console.log('✅ Presentation created: output/Competitive_Landscape_Deck.pptx'))
  .catch(err => console.error('❌ Error:', err));
