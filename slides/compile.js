// compile.js — Tenecteplase Social Media Landscape Deck
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

const theme = {
  primary: "006d77",    // deep teal
  secondary: "83c5be",  // light teal
  accent: "e29578",     // coral
  light: "ffddd2",      // light pink
  bg: "edf6f9"          // very light blue
};

// Load all 8 slides
for (let i = 1; i <= 8; i++) {
  const num = String(i).padStart(2, '0');
  const slideModule = require(`./slide-${num}.js`);
  slideModule.createSlide(pres, theme);
}

pres.writeFile({ fileName: './output/tenecteplase-social-media-2026.pptx' })
  .then(() => console.log('Done: ./output/tenecteplase-social-media-2026.pptx'))
  .catch(err => console.error('Error:', err));
