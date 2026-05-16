# YouTube Script: Meta's TRIBE v2 — A Foundation Model of the Human Brain

**Target:** 8-10 minutes (~1400 words) | **Tone:** Conversational, engaging | **Audience:** Tech enthusiasts, AI builders, neuroscience-curious

---

## ACT I: THE HOOK & THE PROBLEM (0:00 - 2:30)

**[HOST on camera, sitting in a modern studio setup. Energetic, direct.]**

**HOST:**
What if I told you Meta just trained an AI on *one thousand hours* of human brain scans — and now it can predict what you're thinking?

**[CUT TO: Split screen — left side shows fMRI brain scan lighting up, right side shows movie clip the subject is watching. The brain activity mirrors the movie's visual changes.]**

**HOST (V.O.):**
Not in the cheesy sci-fi way. I mean it can watch a movie clip, listen to a podcast, or read a sentence — and then accurately predict which parts of your brain would light up. With *several times* the accuracy of anything we've had before.

**[BACK TO HOST]**

**HOST:**
This is TRIBE v2 — released by Meta's FAIR lab and ENS Paris just a couple of weeks ago. And it's not just another AI model. It might be the closest thing we have to a unified theory of the human brain.

**[CUT TO: B-roll of fMRI machine, MRI scanning room, electrodes being placed on a subject's head]**

**HOST (V.O.):**
Here's the problem TRIBE v2 solves. Neuroscience today is… fragmented. Really fragmented. We have one model for vision. Another model for hearing. Another for language. Each one lives in its own silo, trained on its own specific experiment, and none of them talk to each other.

**[GRAPHIC: A messy web of disconnected boxes labeled "Vision Model," "Language Model," "Auditory Model" with no connections between them.]**

**HOST (V.O.):**
It's like having a separate GPS for every street in your city instead of one map. You can find your way around — but you have zero idea how the streets connect.

**[BACK TO HOST]**

**HOST:**
The paper puts it beautifully — and I'm paraphrasing here — "cognitive neuroscience is fragmented into specialized models, each tailored to specific experimental paradigms, preventing a unified model of cognition." 

That fragmentation is a huge bottleneck. Every new experiment means building a new pipeline from scratch. You can't easily compare results across labs. And most importantly — you can't ask "how does the *whole* brain work together?"

TRIBE v2 is the first real attempt at changing that.

---

## ACT II: THE DISCOVERY — What They Built (2:30 - 6:30)

**[CUT TO: Animated diagram showing three input streams — video, audio, text — converging into one model]**

**HOST (V.O.):**
So what *is* TRIBE v2? Let me break it down.

First, the name: TRIBE stands for… actually I don't think they officially expanded it. But v2 tells you everything — this is version two. The first version won the 2025 Algonauts Challenge, which is basically the Olympics of brain encoding models. 

Version two is on another planet.

**[GRAPHIC: Key stats fly in one by one — "1,117 hours of fMRI" / "720 human subjects" / "Tri-modal: Video, Audio, Text" / "20,484 cortical vertices"]**

**HOST (V.O.):**
The team — led by Stéphane d'Ascoli, Jérémy Rapin, and Jean-Rémi King at Meta FAIR — trained TRIBE v2 on over a thousand hours of fMRI data from 720 human subjects. That's the largest unified brain dataset ever assembled for a single model.

**[BACK TO HOST]**

**HOST:**
Now, here's where it gets clever. TRIBE v2 doesn't learn to "see" or "hear" from scratch. It borrows from the best AI models we already have:

**[CUT TO: Diagram showing three pre-trained models feeding into TRIBE v2]**

**HOST (V.O.):**
For text, it uses LLaMA 3.2. For video, Meta's own V-JEPA2. For audio, Wav2Vec-BERT 2.0. These are state-of-the-art models that already understand their respective modalities. TRIBE v2's job is to learn how your brain *encodes* that information.

**[ANIMATION: Three streams merge into a transformer, which then projects onto a brain surface map]**

**HOST (V.O.):**
It takes those high-dimensional embeddings from all three modalities, runs them through a temporal transformer that looks at a 100-second window, and then — this is the magic — projects directly onto the surface of your cortex. Over twenty thousand cortical vertices, plus nearly nine thousand subcortical voxels.

**[BACK TO HOST — lean in, more intense]**

**HOST:**
And this is where we hit **holy shit moment number one**.

**[GRAPHIC: "HOLY SHIT #1" in big text]**

**HOST (V.O.):**
TRIBE v2 can predict a *group average* brain response for subjects it has *never seen* — and it's more accurate than the actual brain recording of many individual subjects within that cohort. 

Let that sink in. The model's prediction of what a *new person's* brain would do while watching a movie is *better* than some actual people's own brain recordings.

**[CUT TO: Graph showing TRIBE v2's group correlation at ~0.4 vs. individual subject correlations scattered below]**

**HOST (V.O.):**
On the Human Connectome Project dataset — that's the 7 Tesla high-resolution fMRI — TRIBE v2 achieved a two-fold improvement over the median subject's own group-predictivity. Two. Times. Better. Than. Actual. Brains.

**[BACK TO HOST]**

**HOST:**
**Holy shit moment number two** — scaling laws.

**[GRAPHIC: Log-linear scaling plot — no plateau in sight]**

**HOST (V.O.):**
The team found that as they fed TRIBE v2 more training data, its accuracy kept going up — log-linearly — with *no plateau*. In AI, this is the holy grail. It means TRIBE v2 is data-hungry in the best possible way. As neuroimaging datasets grow — and they will — this model just keeps getting better.

**[CUT TO: Side-by-side comparison — old linear model vs. TRIBE v2 predictions vs. actual brain activity]**

**HOST (V.O.):**
Compared to traditional linear encoding models — which have been the gold standard for over a decade — TRIBE v2 delivers "several-fold improvements in accuracy." That's not marketing speak. That's the actual language from the paper. Several. Fold.

**[BACK TO HOST]**

**HOST:**
Okay but here's the part that made me actually say "holy shit" out loud.

**Holy shit moment number three** — in-silico experiments.

**[GRAPHIC: "HOLY SHIT #3 — IN SILICO EXPERIMENTS" — lab equipment being replaced with a computer]**

**HOST (V.O.):**
TRIBE v2 can run *virtual neuroscience experiments*. No human subjects. No fMRI machine. No ethical approval board. Just the model.

The team tested it on seminal visual and language paradigms — the kinds of experiments that built modern neuroscience. Things like showing images of faces vs. objects, or sentences with emotional vs. neutral content.

**[CUT TO: Brain maps side by side — "Ground Truth" vs. "TRIBE v2 Prediction" — they're nearly identical]**

**HOST (V.O.):**
And TRIBE v2 recovered the same results that took decades of empirical research to establish. The fusiform face area lighting up for faces. The visual word form area responding to text. Language networks activating for sentences vs. non-words. The model didn't just memorize — it *understood* the functional organization of the brain.

**[CUT TO: B-roll of a researcher at a computer, running simulations]**

**HOST (V.O.):**
Think about what this enables. Before you run a $50,000 fMRI study with 30 human subjects? You pilot it *in silico* first. You test your hypotheses on TRIBE v2. You refine your stimuli. You identify which brain regions are likely to respond. And *then* you go to the lab with a much sharper question.

This is the kind of acceleration that could change neuroscience the way AlphaFold changed biology.

**[BACK TO HOST]**

**HOST:**
And it's all open source. Code, weights, demo — available on GitHub and Hugging Face right now. Over eighteen hundred stars on GitHub already. The demo is live at aidemos.atmeta.com slash tribev2. Go play with it.

---

## ACT III: THE IMPLICATIONS (6:30 - 9:00)

**[HOST, more thoughtful now. Slower pace.]**

**HOST:**
So what does this *mean*?

**[CUT TO: Montage of fMRI brain scans dissolving into futuristic medical scenes]**

**HOST (V.O.):**
First, TRIBE v2 is a paradigm shift for neuroscience research. For decades, the field has been doing what computer scientists call "handcrafted features" — building bespoke models for every experiment. TRIBE v2 says: use one foundation model. Fine-tune it for your specific question. Done.

**[GRAPHIC: Fragmented neuroscience tools on the left → unified TRIBE v2 framework on the right]**

**HOST (V.O.):**
The paper already shows that with just one hour of fine-tuning data for a new subject, TRIBE v2 improves two- to four-fold over training a linear model from scratch. That's the power of transfer learning in a domain that's historically been data-starved.

**[BACK TO HOST]**

**HOST:**
Second — and this is the bigger picture — TRIBE v2 is a step toward what some people are calling "digital twins" of the brain.

**[CUT TO: Futuristic concept animation — a holographic brain being rotated and analyzed]**

**HOST (V.O.):**
If you can predict brain responses to arbitrary stimuli across modalities, and do it accurately enough to run virtual experiments… you're not just modeling cognition anymore. You're beginning to *simulate* it. Not AGI, not consciousness — but a meaningful computational model of how the human brain represents and processes information.

**[BACK TO HOST]**

**HOST:**
Here's what I find most exciting, though. The model's internal representations are interpretable. The team ran independent component analysis — ICA — on TRIBE v2's latent features and found they correspond to real neuroscientific concepts. Face selectivity. Motion sensitivity. Language processing. The model spontaneously learned the same functional organization that neuroscientists spent decades mapping.

**[GRAPHIC: ICA components visualized on a brain surface — color-coded by function]**

**HOST (V.O.):**
This is the kind of convergence that tells you you're onto something real. When an AI trained purely to predict fMRI activity starts carving up the brain into the same regions we've identified through thousands of experiments, it means the model is capturing actual structure.

**[BACK TO HOST]**

**HOST:**
Now, I do want to be honest about the limits. TRIBE v2 predicts fMRI — blood flow — which is an indirect measure of neural activity. It's at the millimeter scale but still lags seconds behind actual firing. It doesn't capture everything happening in your brain. And generalization to completely out-of-distribution stimuli — stuff wildly different from its training data — still needs work.

**[CUT TO: The messy web graphic from earlier, but now with TRIBE v2 as a central hub connecting everything]**

**HOST (V.O.):**
But the direction is clear. This is the unification that neuroscience has been missing. And it came from AI.

**[BACK TO HOST, upbeat, closing energy]**

**HOST:**
If you're building at the intersection of AI and neuroscience — or you just want to understand how your own brain works — TRIBE v2 is a must-watch. I'll link the paper, the code, and the demo in the description. 

---

## OUTRO & CTA (9:00 - 9:30)

**[HOST, direct camera, energetic]**

**HOST:**
Here's my question for you in the comments: If you could run ANY virtual experiment on a simulated brain, what would you test? Memory formation? Dreaming? How music triggers emotion? Drop it below — I read every comment.

**[CUT TO: Quick montage of the three holy shit moments — brain prediction > actual brain, scaling law graph, in-silico experiment match]**

**HOST (V.O.):**
If you want more AI x Neuroscience content — and I mean the *real* stuff, not the hype — hit subscribe. We're covering every major brain-AI paper as it drops. Turn on notifications so you don't miss the next one.

**[HOST on camera, one last beat]**

**HOST:**
Your brain just watched a video about a model that can predict your brain. Think about that. See you in the next one.

**[FADE TO BLACK — channel logo + "SUBSCRIBE" animation + links to TRIBE v2 paper/github/demo]**

---

## APPENDIX: Production Notes

### Recommended B-Roll Sources
- fMRI machine footage (free stock: Pexels, Pixabay)
- Brain scan animations (use Manim or similar for brain surface rendering)
- Meta AI logos / FAIR branding (fair use for commentary)
- Human Connectome Project visuals (public dataset)
- IBC (Individual Brain Charting) dataset visuals

### Key Numbers to Emphasize Visually
| Stat | Visual Treatment |
|---|---|
| 1,117 hours of fMRI | Animated counter |
| 720 human subjects | Dot grid filling up |
| Several-fold improvement | Before/after comparison |
| ~0.4 group correlation | Gauge or bar chart |
| 20,484 cortical vertices | Brain surface grid |
| 4 pre-trained models | Pipeline diagram |

### "Holy Shit" Moment Checklist
- [x] #1: Model predicts new subjects better than actual recordings
- [x] #2: Log-linear scaling with no plateau
- [x] #3: In-silico experiments reproduce decades of neuroscience

### Suggested Thumbnail
- **Style:** Split screen — left: glowing fMRI brain scan with prediction overlay, right: Meta AI logo
- **Text overlay:** "META TRAINED AI ON 1,000 HOURS OF BRAIN SCANS"
- **Smaller text:** "TRIBE v2 Explained"
- **Expression:** Wide-eyed, pointing at the brain scan
