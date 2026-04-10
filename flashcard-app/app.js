'use strict';

// ── Data Layer ──────────────────────────────────────────────
const Store = {
  KEY: 'flashcard_app_v1',

  defaultData() {
    return { decks: [], cards: [], reviews: [] };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : this.defaultData();
    } catch { return this.defaultData(); }
  },

  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  now() { return new Date().toISOString().split('T')[0]; },

  todayStr() { return this.now(); },
};

// ── SRS Engine (SM-2) ────────────────────────────────────────
const SRS = {
  EF_MIN: 1.3,

  newCard() {
    return {
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: Store.now(),
    };
  },

  review(card, rating) {
    // rating: 0=Again, 1=Hard, 2=Good, 3=Easy
    if (rating === 0) {
      // Again
      card.interval = 1;
      card.repetitions = 0;
      card.easeFactor = Math.max(this.EF_MIN, card.easeFactor - 0.2);
    } else if (rating === 1) {
      // Hard
      card.interval = Math.max(1, Math.round(card.interval * 1.2));
      card.repetitions += 1;
      card.easeFactor = Math.max(this.EF_MIN, card.easeFactor - 0.15);
    } else if (rating === 2) {
      // Good
      if (card.repetitions === 0) card.interval = 1;
      else if (card.repetitions === 1) card.interval = 6;
      else card.interval = Math.round(card.interval * card.easeFactor);
      card.repetitions += 1;
    } else {
      // Easy
      if (card.repetitions === 0) card.interval = 4;
      else card.interval = Math.round(card.interval * card.easeFactor * 1.3);
      card.repetitions += 1;
      card.easeFactor = card.easeFactor + 0.15;
    }

    const due = new Date();
    due.setDate(due.getDate() + card.interval);
    card.dueDate = due.toISOString().split('T')[0];
    return card;
  },
};

// ── State ────────────────────────────────────────────────────
let state = {
  data: Store.load(),
  currentView: 'dashboard',
  currentDeckId: null,
  editingCardId: null,
  reviewQueue: [],
  reviewIndex: 0,
  reviewResults: [],
  reviewFlipped: false,
  generatedCards: [],
};

// ── Utilities ────────────────────────────────────────────────
function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function isDue(card) {
  return card.dueDate <= Store.now();
}

function getDeckCards(deckId) {
  return state.data.cards.filter(c => c.deckId === deckId);
}

function getDueCards(deckId) {
  return getDeckCards(deckId).filter(isDue);
}

function getMasteredCount(deckId) {
  return getDeckCards(deckId).filter(c => c.interval >= 21).length;
}

function getStats() {
  const today = Store.now();
  const allCards = state.data.cards;
  const total = allCards.length;
  const due = allCards.filter(isDue).length;
  const mastered = allCards.filter(c => c.interval >= 21).length;

  // Streak: consecutive days with reviews
  const reviewDays = [...new Set(state.data.reviews.map(r => r.date))].sort().reverse();
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const check = d.toISOString().split('T')[0];
    if (reviewDays.includes(check)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }

  return { total, due, mastered, streak };
}

function getWeekChart() {
  const days = [];
  const d = new Date();
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(d);
    dt.setDate(dt.getDate() - i);
    const label = dt.toLocaleDateString('en', { weekday: 'short' });
    const dateStr = dt.toISOString().split('T')[0];
    const count = state.data.reviews.filter(r => r.date === dateStr).length;
    days.push({ label, count });
  }
  return days;
}

// ── Navigation ────────────────────────────────────────────────
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  const view = document.getElementById(`${viewId}-view`);
  if (view) view.classList.add('active');
  const navBtn = document.querySelector(`.nav-link[data-view="${viewId}"]`);
  if (navBtn) navBtn.classList.add('active');
  state.currentView = viewId;

  if (viewId === 'dashboard') renderDashboard();
  if (viewId === 'stats') renderStats();
  if (viewId === 'generator') renderGenerator();
}

// ── Render Dashboard ──────────────────────────────────────────
function renderDashboard() {
  const stats = getStats();
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-due').textContent = stats.due;
  document.getElementById('stat-mastered').textContent = stats.mastered;
  document.getElementById('stat-streak').textContent = stats.streak;

  const deckList = document.getElementById('deck-list');
  const decks = state.data.decks;

  if (decks.length === 0) {
    deckList.innerHTML = `<div class="empty-state"><p>No decks yet — create your first one!</p></div>`;
    return;
  }

  deckList.innerHTML = decks.map(deck => {
    const cards = getDeckCards(deck.id);
    const dueCards = getDueCards(deck.id);
    const mastered = cards.filter(c => c.interval >= 21).length;
    const progress = cards.length ? Math.round((mastered / cards.length) * 100) : 0;
    return `
      <div class="deck-card" onclick="openDeck('${deck.id}')">
        <div class="deck-info">
          <div class="deck-name">${escHtml(deck.name)}</div>
          <div class="deck-meta">${cards.length} card${cards.length !== 1 ? 's' : ''} · ${mastered} mastered</div>
        </div>
        <div class="deck-progress">
          <div class="deck-progress-bar" style="width:${progress}%"></div>
        </div>
        ${dueCards.length ? `<span class="deck-due-badge">${dueCards.length} due</span>` : ''}
        <div class="deck-actions-inline">
          <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); startReview('${deck.id}')" ${dueCards.length === 0 ? 'disabled' : ''}>Review</button>
        </div>
      </div>
    `;
  }).join('');
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Deck Manager ──────────────────────────────────────────────
function openDeck(deckId) {
  state.currentDeckId = deckId;
  const deck = state.data.decks.find(d => d.id === deckId);
  if (!deck) return;
  showView('deck');
  document.getElementById('deck-name').value = deck.name;
  renderCardList();
  document.getElementById('start-review-btn').disabled = getDueCards(deckId).length === 0;
}

function renderCardList() {
  const cards = getDeckCards(state.currentDeckId);
  const list = document.getElementById('card-list');

  if (cards.length === 0) {
    list.innerHTML = `<div class="empty-state"><p>No cards yet — add some!</p></div>`;
    return;
  }

  list.innerHTML = cards.map(card => {
    const due = isDue(card);
    const mastered = card.interval >= 21;
    const badgeClass = mastered ? 'mastered' : due ? 'due' : '';
    const badgeText = mastered ? 'Mastered' : due ? 'Due' : card.dueDate;
    return `
      <div class="card-item">
        <div class="card-preview">
          <div class="card-front-preview">${escHtml(card.front)}</div>
          <div class="card-back-preview">${escHtml(card.back)}</div>
        </div>
        <span class="card-due-badge ${badgeClass}">${badgeText}</span>
        <div class="card-actions">
          <button class="btn btn-ghost btn-small" onclick="editCard('${card.id}')">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteCard('${card.id}')">Del</button>
        </div>
      </div>
    `;
  }).join('');
}

// ── Deck Actions ─────────────────────────────────────────────
function saveDeckName() {
  const deck = state.data.decks.find(d => d.id === state.currentDeckId);
  if (!deck) return;
  deck.name = document.getElementById('deck-name').value.trim() || 'Untitled Deck';
  Store.save(state.data);
}

function deleteDeck() {
  if (!confirm('Delete this deck and all its cards?')) return;
  state.data.cards = state.data.cards.filter(c => c.deckId !== state.currentDeckId);
  state.data.decks = state.data.decks.filter(d => d.id !== state.currentDeckId);
  Store.save(state.data);
  showView('dashboard');
}

// ── Card Editor ───────────────────────────────────────────────
function openCardEditor(cardId = null) {
  state.editingCardId = cardId;
  const modal = document.getElementById('card-editor');
  const title = document.getElementById('card-editor-title');
  const frontEl = document.getElementById('card-front');
  const backEl = document.getElementById('card-back');
  const tagsEl = document.getElementById('card-tags');

  if (cardId) {
    const card = state.data.cards.find(c => c.id === cardId);
    if (card) {
      title.textContent = 'Edit Card';
      frontEl.value = card.front;
      backEl.value = card.back;
      tagsEl.value = (card.tags || []).join(', ');
    }
  } else {
    title.textContent = 'Add Card';
    frontEl.value = '';
    backEl.value = '';
    tagsEl.value = '';
  }

  modal.classList.add('active');
  frontEl.focus();
}

function closeCardEditor() {
  document.getElementById('card-editor').classList.remove('active');
  state.editingCardId = null;
}

function saveCard() {
  const front = document.getElementById('card-front').value.trim();
  const back = document.getElementById('card-back').value.trim();
  const tagsStr = document.getElementById('card-tags').value.trim();
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

  if (!front || !back) { alert('Both front and back are required.'); return; }

  if (state.editingCardId) {
    const card = state.data.cards.find(c => c.id === state.editingCardId);
    if (card) { card.front = front; card.back = back; card.tags = tags; }
  } else {
    const srs = SRS.newCard();
    state.data.cards.push({
      id: uuid(),
      deckId: state.currentDeckId,
      front, back, tags,
      ...srs,
      createdAt: Store.now(),
    });
  }

  Store.save(state.data);
  closeCardEditor();
  renderCardList();
  document.getElementById('start-review-btn').disabled = getDueCards(state.currentDeckId).length === 0;
}

function editCard(cardId) { openCardEditor(cardId); }

function deleteCard(cardId) {
  if (!confirm('Delete this card?')) return;
  state.data.cards = state.data.cards.filter(c => c.id !== cardId);
  Store.save(state.data);
  renderCardList();
}

// ── Review Mode ───────────────────────────────────────────────
function startReview(deckId) {
  const due = getDueCards(deckId);
  if (!due.length) return;

  state.reviewQueue = due;
  state.reviewIndex = 0;
  state.reviewResults = [];
  state.reviewFlipped = false;

  document.getElementById('flip-btn').style.display = '';
  document.getElementById('btn-again').style.display = 'none';
  document.getElementById('btn-hard').style.display = 'none';
  document.getElementById('btn-good').style.display = 'none';
  document.getElementById('btn-easy').style.display = 'none';

  showCard();
  showView('review');
}

function showCard() {
  const card = state.reviewQueue[state.reviewIndex];
  if (!card) { showReviewComplete(); return; }

  document.getElementById('review-progress').textContent = `Card ${state.reviewIndex + 1} of ${state.reviewQueue.length}`;
  document.getElementById('review-front').textContent = card.front;
  document.getElementById('review-back').textContent = card.back;
  document.getElementById('review-tags').innerHTML = (card.tags || []).map(t => `<span class="tag-pill">${escHtml(t)}</span>`).join('');

  const flashcard = document.getElementById('flashcard');
  flashcard.classList.remove('flipped');

  document.getElementById('flip-btn').style.display = '';
  document.getElementById('btn-again').style.display = 'none';
  document.getElementById('btn-hard').style.display = 'none';
  document.getElementById('btn-good').style.display = 'none';
  document.getElementById('btn-easy').style.display = 'none';
}

function flipCard() {
  const flashcard = document.getElementById('flashcard');
  flashcard.classList.add('flipped');
  document.getElementById('flip-btn').style.display = 'none';
  document.getElementById('btn-again').style.display = '';
  document.getElementById('btn-hard').style.display = '';
  document.getElementById('btn-good').style.display = '';
  document.getElementById('btn-easy').style.display = '';
}

function rateCard(rating) {
  const card = state.reviewQueue[state.reviewIndex];
  SRS.review(card, rating);

  state.data.reviews.push({ cardId: card.id, date: Store.now(), rating });
  state.reviewResults.push(rating);
  Store.save(state.data);

  state.reviewIndex++;
  if (state.reviewIndex >= state.reviewQueue.length) {
    showReviewComplete();
  } else {
    showCard();
  }
}

function showReviewComplete() {
  showView('review-complete');
  const reviewed = state.reviewResults.length;
  const goodPlus = state.reviewResults.filter(r => r >= 2).length;
  const accuracy = reviewed ? Math.round((goodPlus / reviewed) * 100) : 0;
  document.getElementById('complete-reviewed').textContent = reviewed;
  document.getElementById('complete-accuracy').textContent = `${accuracy}%`;
}

// ── Generator ────────────────────────────────────────────────
function renderGenerator() {
  state.generatedCards = [];

  // Render deck selector
  const select = document.getElementById('target-deck');
  select.innerHTML = '<option value="">+ Create new deck</option>' +
    state.data.decks.map(d => `<option value="${d.id}">${escHtml(d.name)}</option>`).join('');

  // Tab switcher
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`${btn.dataset.tab}-input`).classList.add('active');
    };
  });

  document.getElementById('generated-preview').style.display = 'none';
}

async function generateCards() {
  const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
  let content = '';
  let apiKey = localStorage.getItem('groq_api_key') || '';

  if (activeTab === 'text') {
    content = document.getElementById('source-text').value.trim();
  } else if (activeTab === 'url') {
    const url = document.getElementById('source-url').value.trim();
    if (!url) { alert('Please enter a URL'); return; }
    const btn = document.getElementById('generate-btn');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Fetching...';
    try {
      const resp = await fetch(url);
      const text = await resp.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      doc.querySelectorAll('script,style,nav,footer,header,aside').forEach(el => el.remove());
      content = doc.body.innerText.slice(0, 8000);
    } catch(e) { alert('Failed to fetch URL: ' + e.message); btn.disabled = false; btn.textContent = 'Generate Cards'; return; }
    btn.disabled = false; btn.textContent = 'Generate Cards';
  } else if (activeTab === 'pdf') {
    const fileInput = document.getElementById('source-pdf');
    if (!fileInput.files[0]) { alert('Please select a PDF file'); return; }
    content = await fileInput.files[0].text().catch(() => '');
    content = content.replace(/[^\x20-\x7E\n]/g, ' ').slice(0, 8000);
  } else if (activeTab === 'ollama') {
    content = document.getElementById('source-ollama').value.trim();
    if (!content) { alert('Paste some study material first'); return; }

    const btn = document.getElementById('generate-btn');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Generating with local AI...';

    const model = document.getElementById('ollama-model').value;

    try {
      const prompt = `You are a flashcard generator. Given the content below, generate 8-12 Q&A flashcards as a JSON array in this exact format:
[{"front":"question","back":"answer","tags":["tag1","tag2"]}]

Rules:
- Questions should test understanding, not just recall
- Answers should be concise but complete
- Return ONLY the JSON array, no markdown, no explanation.

Content:
${content.slice(0, 6000)}`;

      const resp = await fetch(`http://localhost:11434/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt, stream: false, options: { temperature: 0.3, num_predict: 1024 } }),
      });

      if (!resp.ok) throw new Error(`Ollama error: ${resp.status}`);

      const json = await resp.json();
      const raw = json.response || '';

      let cards = [];
      try {
        const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        cards = JSON.parse(cleaned);
        if (!Array.isArray(cards)) throw new Error('Not an array');
      } catch {
        const match = raw.match(/\[[\s\S]+\]/);
        if (match) { try { cards = JSON.parse(match[0]); } catch { /* ignore */ } }
      }

      if (!cards.length) throw new Error('Could not parse generated cards from model output');

      state.generatedCards = cards.map((c, i) => ({
        id: uuid(),
        front: c.front || '',
        back: c.back || '',
        tags: Array.isArray(c.tags) ? c.tags : [],
        checked: true,
      }));

      renderGeneratedPreview();

    } catch(e) {
      alert('Generation failed: ' + e.message);
    } finally {
      btn.disabled = false; btn.textContent = 'Generate Cards';
    }
    return;
  }

  if (!content) { alert('No content to generate from'); return; }

  const btn = document.getElementById('generate-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Generating...';

  try {
    const apiKey = localStorage.getItem('groq_api_key') || '';
    if (!apiKey) {
      const key = prompt('Enter your Groq API key (stored locally):');
      if (!key) { btn.disabled = false; btn.textContent = 'Generate Cards'; return; }
      localStorage.setItem('groq_api_key', key);
    }

    const storedKey = localStorage.getItem('groq_api_key');
    const SYSTEM = `You are a flashcard generator. Given content, generate 5-10 Q&A flashcards as a JSON array. Return ONLY valid JSON like: [{"front":"question","back":"answer","tags":["tag1"]}]. No markdown, no explanation.`;

    const resp = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${storedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: `Generate flashcards from:\n\n${content.slice(0, 6000)}` }
        ],
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${resp.status}`);
    }

    const json = await resp.json();
    const raw = json.choices?.[0]?.message?.content || '';

    // Try to extract JSON from response
    let cards = [];
    try {
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      cards = JSON.parse(cleaned);
      if (!Array.isArray(cards)) throw new Error('Not an array');
    } catch {
      // Try finding JSON array in text
      const match = raw.match(/\[[\s\S]+\]/);
      if (match) {
        try { cards = JSON.parse(match[0]); } catch { /* ignore */ }
      }
    }

    if (!cards.length) throw new Error('Could not parse generated cards');

    state.generatedCards = cards.map((c, i) => ({
      id: uuid(),
      front: c.front || '',
      back: c.back || '',
      tags: Array.isArray(c.tags) ? c.tags : [],
      checked: true,
    }));

    renderGeneratedPreview();

  } catch(e) {
    alert('Generation failed: ' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generate Cards';
  }
}

function renderGeneratedPreview() {
  const preview = document.getElementById('generated-preview');
  const list = document.getElementById('generated-list');
  preview.style.display = '';

  list.innerHTML = state.generatedCards.map((card, i) => `
    <div class="gen-card">
      <div class="gen-card-header">
        <input type="checkbox" id="gen-check-${i}" ${card.checked ? 'checked' : ''} onchange="toggleGenCard(${i})">
        <label for="gen-check-${i}" style="font-size:0.85rem;color:var(--text-secondary)">Include</label>
      </div>
      <div class="gen-card-field">
        <label>Front</label>
        <textarea id="gen-front-${i}" onchange="updateGenCard(${i},'front',this.value)">${escHtml(card.front)}</textarea>
      </div>
      <div class="gen-card-field">
        <label>Back</label>
        <textarea id="gen-back-${i}" onchange="updateGenCard(${i},'back',this.value)">${escHtml(card.back)}</textarea>
      </div>
    </div>
  `).join('');
}

function toggleGenCard(index) {
  state.generatedCards[index].checked = !state.generatedCards[index].checked;
}

function updateGenCard(index, field, value) {
  state.generatedCards[index][field] = value;
}

async function importGeneratedCards() {
  const selected = state.generatedCards.filter(c => c.checked);
  if (!selected.length) { alert('Select at least one card to import'); return; }

  let deckId = document.getElementById('target-deck').value;

  if (!deckId) {
    const name = prompt('New deck name:') || 'Generated Deck';
    deckId = uuid();
    state.data.decks.push({ id: deckId, name, createdAt: Store.now() });
  }

  const srs = SRS.newCard();
  selected.forEach(card => {
    state.data.cards.push({
      id: card.id,
      deckId,
      front: card.front,
      back: card.back,
      tags: card.tags,
      ...srs,
      createdAt: Store.now(),
    });
  });

  Store.save(state.data);

  // Clear inputs
  document.getElementById('source-text').value = '';
  document.getElementById('source-url').value = '';
  document.getElementById('generated-preview').style.display = 'none';
  state.generatedCards = [];

  alert(`Imported ${selected.length} cards!`);
  showView('dashboard');
}

// ── Stats ────────────────────────────────────────────────────
function renderStats() {
  const chart = getWeekChart();
  const maxCount = Math.max(...chart.map(d => d.count), 1);

  const barChart = document.getElementById('bar-chart');
  barChart.innerHTML = chart.map(d => `
    <div class="bar-col">
      <div class="bar" style="height:${Math.max(4, (d.count / maxCount) * 100)}%"></div>
      <div class="bar-label">${d.label}</div>
    </div>
  `).join('');

  const totalReviews = state.data.reviews.length;
  const allCards = state.data.cards;
  const avgEase = allCards.length
    ? (allCards.reduce((s, c) => s + c.easeFactor, 0) / allCards.length).toFixed(2)
    : '2.50';

  document.getElementById('total-reviews').textContent = totalReviews;
  document.getElementById('avg-ease').textContent = avgEase;
}

// ── Delete Confirmation Modal ───────────────────────────────
function setupConfirmModal() {
  const modal = document.getElementById('confirm-modal');
  document.getElementById('confirm-cancel').onclick = () => modal.classList.remove('active');

  window.showConfirm = (title, message, onOk) => {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-ok').onclick = () => { modal.classList.remove('active'); onOk(); };
    modal.classList.add('active');
  };
}

// ── Event Wiring ─────────────────────────────────────────────
function setupEvents() {
  // Nav
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  // Dashboard
  document.getElementById('create-deck-btn').addEventListener('click', () => {
    const name = prompt('Deck name:');
    if (!name) return;
    const id = uuid();
    state.data.decks.push({ id, name, createdAt: Store.now() });
    Store.save(state.data);
    openDeck(id);
  });

  // Deck view
  document.getElementById('back-to-dashboard').addEventListener('click', () => {
    saveDeckName();
    showView('dashboard');
  });
  document.getElementById('deck-name').addEventListener('change', saveDeckName);
  document.getElementById('delete-deck-btn').addEventListener('click', deleteDeck);
  document.getElementById('add-card-btn').addEventListener('click', () => openCardEditor());
  document.getElementById('start-review-btn').addEventListener('click', () => startReview(state.currentDeckId));

  // Card editor
  document.getElementById('cancel-card').addEventListener('click', closeCardEditor);
  document.getElementById('save-card').addEventListener('click', saveCard);
  document.getElementById('card-editor').addEventListener('click', (e) => {
    if (e.target.id === 'card-editor') closeCardEditor();
  });

  // Review
  document.getElementById('flip-btn').addEventListener('click', flipCard);
  document.getElementById('flashcard').addEventListener('click', () => {
    if (!state.reviewFlipped) { flipCard(); state.reviewFlipped = true; }
  });
  document.getElementById('btn-again').addEventListener('click', () => rateCard(0));
  document.getElementById('btn-hard').addEventListener('click', () => rateCard(1));
  document.getElementById('btn-good').addEventListener('click', () => rateCard(2));
  document.getElementById('btn-easy').addEventListener('click', () => rateCard(3));
  document.getElementById('exit-review').addEventListener('click', () => {
    saveDeckName();
    showView('dashboard');
  });
  document.getElementById('done-review').addEventListener('click', () => {
    saveDeckName();
    showView('dashboard');
  });

  // Generator
  document.getElementById('generate-btn').addEventListener('click', generateCards);
  document.getElementById('import-cards').addEventListener('click', importGeneratedCards);

  // JSON Import
  document.getElementById('import-json').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const cards = JSON.parse(text);
      if (!Array.isArray(cards)) throw new Error('Not an array');
      state.generatedCards = cards.map((c, i) => ({
        id: uuid(),
        front: c.front || '',
        back: c.back || '',
        tags: Array.isArray(c.tags) ? c.tags : [],
        checked: true,
      }));
      renderGeneratedPreview();
    } catch(err) { alert('Invalid JSON file: ' + err.message); }
    e.target.value = '';
  });

  // Confirm modal
  setupConfirmModal();
}

// ── Init ────────────────────────────────────────────────────
function init() {
  setupEvents();
  showView('dashboard');
}

document.addEventListener('DOMContentLoaded', init);
