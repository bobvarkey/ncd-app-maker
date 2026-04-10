# Flashcard SRS App — SPEC.md

## 1. Concept & Vision
A sleek, dark-themed flashcard app with SM-2 spaced repetition and AI-powered card generation. Two modes: manual study and AI auto-generation from URLs/text/PDFs. Feels like a premium productivity tool — fast, minimal, focused.

## 2. Design Language

### Colors
- Background: `#0f1117`
- Card surface: `#1a1d27`
- Card surface hover: `#22263a`
- Accent (indigo): `#6366f1`
- Accent hover: `#7c7ff7`
- Text primary: `#e2e8f0`
- Text secondary: `#94a3b8`
- Success (Easy): `#22c55e`
- Warning (Hard): `#f59e0b`
- Danger (Again): `#ef4444`
- Border: `#2d3154`

### Typography
- Font: `Inter` (Google Fonts), fallback `system-ui, sans-serif`
- Headings: 600 weight
- Body: 400 weight

### Motion
- View transitions: fade + slight translateY, 200ms ease
- Card flip: CSS 3D perspective flip, 400ms
- Button hover: scale 1.02, 150ms
- Progress bars: width transition 300ms

## 3. Layout & Structure

### Views (single-page, show/hide)
1. **Dashboard** — bento grid stats + deck list
2. **Deck Manager** — deck detail, card list, add/edit card
3. **Review Mode** — flip card + rating buttons
4. **Generator** — source input + preview + import
5. **Stats** — 7-day bar chart

### Navigation
- Top nav bar: logo left, nav links right (Dashboard, Generator, Stats)
- Back button on sub-views

## 4. Features & Interactions

### Dashboard
- 4 stat cards: Total Cards, Due Today, Cards Mastered, Current Streak
- Deck list with name, card count, due count, progress bar
- "Start Review" button per deck (disabled if no due cards)
- "Create Deck" button

### Deck Manager
- Deck name editable inline
- Card list showing front preview + tag + due status
- Add Card / Edit Card / Delete Card buttons
- Card editor: front textarea, back textarea, tag input
- Delete deck button (with confirmation)

### Review Mode
- Single card view with flip animation
- Front → "Think" button → Flip → Show back
- Rating buttons: Again (red) / Hard (amber) / Good (blue) / Easy (green)
- Progress indicator: "Card 3 of 12"
- Session complete screen with summary

### Generator
- Tab switcher: URL | Text | PDF
- URL: input field → fetch via proxy → preview
- Text: large textarea
- PDF: file upload → extract text
- "Generate Cards" → loading spinner → preview list
- Each generated card: editable front/back, checkbox to include
- "Import Selected" → select target deck or create new

### Stats
- Bar chart: 7 days, reviews per day
- Total reviews all-time
- Average ease factor

## 5. Component Inventory

### Stat Card
- Icon + label + large number
- Subtle glow on accent color

### Deck Card
- Name, due badge, progress bar (0-100%)
- Hover: slight elevation, border highlight

### Flashcard (flip)
- 3D CSS flip on click/button
- Front: question centered
- Back: answer + tags

### Rating Buttons
- 4 buttons in a row: Again, Hard, Good, Easy
- Color-coded, icon + label

### Generator Preview Card
- Editable front/back textareas
- Checkbox to include/exclude
- Tag pills

## 6. Technical Approach

### Storage (LocalStorage)
```json
{
  "decks": [{ "id": "uuid", "name": "string", "createdAt": "ISO" }],
  "cards": [{ "id": "uuid", "deckId": "uuid", "front": "string", "back": "string", "tags": ["string"], "easeFactor": 2.5, "interval": 0, "repetitions": 0, "dueDate": "ISO", "createdAt": "ISO" }],
  "reviews": [{ "cardId": "uuid", "date": "ISO", "rating": 0-3 }]
}
```

### SM-2 Implementation
- On review rating:
  - Again (0): `interval=1, repetitions=0, easeFactor-=0.2 (min 1.3)`
  - Hard (1): `interval*=1.2, easeFactor-=0.15`
  - Good (2): `interval*=easeFactor, repetitions+1`
  - Easy (3): `interval*=easeFactor*1.3, easeFactor+=0.15`
- `dueDate = today + interval days`

### Groq API
- Endpoint: `POST https://api.groq.com/v1/chat/completions`
- Model: `llama-3.3-70b-versatile`
- System prompt: flashcard generator instructions
- Parse JSON response, validate, display preview

### File Structure
```
flashcard-app/
├── SPEC.md
├── index.html
├── styles.css
└── app.js
```