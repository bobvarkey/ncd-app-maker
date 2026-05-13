---
topic: daily
date: 2026-05-12
tags: []
---

# Focusflow Mvp Spec

# FocusFlow MVP Specification

**Product:** AI Cognitive Performance Tracker for Knowledge Workers
**Status:** v0.1 — MVP Spec
**Date:** 2026-05-11
**Context:** Identified as fastest path to SaaS launch during market research (SAAS_RESEARCH_20260510.md — 5 MVP concepts analyzed; FocusFlow ranked #1 for speed-to-market at 6–8 weeks)

---

## 1. Product One-Pager

### Value Proposition

**For knowledge workers losing 3+ hours/day to distractions and cognitive drift, FocusFlow is a passive AI copilot that measures your real-time Focus Score and delivers neuroscience-based micro-interventions to keep you in peak flow state — without adding another dashboard to check.**

Unlike RescueTime (activity tracking only), Brain.fm (audio-only), or productivity timers that ignore cognitive state, FocusFlow combines passive behavioral telemetry with self-report micro-checks to generate a live "Focus Score" validated against known neuroscience markers of attention and flow.

### Target User

**Primary:** Knowledge workers aged 25–45 who work remotely or hybrid
- Already use productivity tools (Notion, Todoist, Obsidian)
- Suspect their attention is fragmented but lack objective data
- Care about cognitive performance (not just output)
- Open to biohacking / quantified self

**Secondary:** Freelancers, researchers, graduate students, neurodivergent knowledge workers (ADHD/autism)

### Key Differentiators

| Problem | Current Solutions | FocusFlow Advantage |
|---------|-------------------|---------------------|
| No real-time feedback | Trackers show end-of-day reports | Live Focus Score + alerts at point of drift |
| Interventions feel generic | Pomodoro timers, ambient sounds | Neuroscience-timed nudges based on current cognitive state |
| Too much friction | Biofeedback requires wearables | Passive from keyboard + mouse + micro-checks (5s) |
| No personalization | One-size-fits-all | ML model adapts to your unique cognitive signature |

### Elevator Pitch

> FocusFlow is the passive cognitive performance tracker that tells you *how focused you actually are* — not just how long you've been working. By analyzing typing patterns, app switching, and 5-second self-checks, it generates a real-time Focus Score and serves neuroscience-timed micro-interventions to keep your brain in flow. No wearables. No extra dashboards. Just your best thinking, longer.

---

## 2. Core Features — Priority Matrix

### P0 — Ship in MVP (Week 1–4)

| Feature | Description | Why P0 |
|---------|-------------|--------|
| **Passive Focus Score Engine** | Real-time score (0–100) derived from: typing cadence (inter-key interval variability), app switching frequency (window focus changes), session/duration, mouse movement entropy | Core differentiator; defines the product |
| **5-Second Micro-Check** | Interrupts at random intervals with a single-question dialog: "How focused do you feel right now?" (1–10 slider). Answers train the model. | Only user input required; builds personalization data |
| **Desktop Tray/Menu Bar App** | macOS (primary) + Windows. Runs silently in menu bar. Shows Focus Score as icon overlay. Persistent background process. | Initial platform; where knowledge workers live |
| **Daily Focus Report** | End-of-day summary: peak focus windows, distraction patterns, focus score trend. Simple markdown/email digest. | Initial retention driver |
| **Focus Session Timer** | Start/stop "Focus Mode" — monitors a single task window. Optional: Pomodoro with adaptive rest timing. | Familiar onboarding hook |
| **Minimal Settings** | Ignore list (apps/domains), working hours, intervention preferences | Essential UX hygiene |

### P1 — Ship in Launch v1 (Week 5–6)

| Feature | Description | Why P1 |
|---------|-------------|--------|
| **Micro-Intervention Engine** | At detected focus drops (+15pts below baseline): breath guide (4-7-8, 10s), "Reset your focus" prompt, visual blink reminder, stretch reminder. Neuroscience-triggered, not time-based. | Converts data into behavior change |
| **Weekly Focus Trends** | Deep dive: focus patterns by day/time, most distracting apps, longest flow sessions, early vs late day performance | Retention + perceived value |
| **Flow Zone Graph** | Visualization of when you enter/exit flow. "Your peak focus window is 10:30–12:15 PM" | Emotional hook ("Know thyself") |
| **Notification Nudge** | System notification at score drop with a single neuroscience tip ("Your focus dropped 20 points. Try 4-7-8 breathing for 10 seconds.") | Paid tier anchor |

### P2 — Post-Launch (Month 2+)

| Feature | Description | Path |
|---------|-------------|------|
| **Cross-Session Memory** | Model remembers your patterns across days; adapts to your weekly rhythm | Core improvement |
| **Team Dashboard** | Org-level focus trends (anonymized) with burnout risk flags | Enterprise upsell |
| **Browser Extension** | Domain-level focus tracking, distraction blocking | Desktop companion |
| **Mobile Companion** | iOS/Android app for micro-checks away from desk; voice-based check-in | Expansion |
| **AI Coach Layer** | Weekly insights in natural language: "Your best deep work happens Tuesday mornings. Protect that time." | Premium tier |
| **Biofeedback Integration** | Oura Ring, Apple Watch HRV for focus calibration | Power user tier |
| **Focus Forecast** | Predict tomorrow's focus windows based on today's patterns + sleep data | Premium differentiator |

---

## 3. Technical Stack Recommendation

### Principle: Ship fast, keep architecture clean enough to scale.

### Frontend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Desktop App | **Tauri v2** (Rust shell + web frontend) | Tiny binary (~5MB vs Electron's 150MB), native tray/menu bar, system APIs, cross-platform with single codebase |
| UI Framework | **React 18 + TypeScript** | Familiar ecosystem, great for data-heavy dashboards |
| State Management | **Zustand** | Minimal boilerplate, good for real-time updates |
| Charts | **Recharts** (React-native charting) | Simple, covers focus graphs, trends |
| Styling | **Tailwind CSS v4** | Speed of development; design system ready |

**Why not Electron?** Knowledge workers hate bloat. Tauri's sub-10MB desktop app signals quality.

### Backend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| API | **FastAPI** (Python 3.12) | Async, auto-docs, ML pipeline integration, excellent for real-time endpoints |
| Database | **PostgreSQL 16** (via Supabase) | Reliable, JSONB for event data, Supabase for auth + realtime | 
| Real-time | **Supabase Realtime / WebSockets** | Live Focus Score push to client |
| Auth | **Supabase Auth** (Magic link / Google OAuth) | Zero-config social auth + email |
| File Storage | **Supabase Storage** | Report exports, user preferences |
| Queue | **Redis + Celery** | Async processing for daily reports, model training |
| Orm | **SQLAlchemy 2.0** (async) | Mature, works with FastAPI |

### ML / Analytics

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Focus Model | **scikit-learn** (ensemble: Random Forest + Gradient Boosting) | No GPU needed for MVP; interpretable features |
| Feature Extraction | **Custom Python** | Features: typing IQR, switching rate, session duration, time-of-day, micro-check labels |
| Model Serving | **ONNX Runtime** (embedded in Tauri for offline) | Runs inference locally — no latency, no cloud dependency |
| Experiment Tracking | **MLflow** | Track model iterations |
| User Telemetry Pipeline | **PostgreSQL + dbt** | Transform raw events to feature tables |

### DevOps

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Cloud | **Railway** or **Fly.io** | Simple deploy, generous free tier, PostgreSQL included |
| CI/CD | **GitHub Actions** | Already in workflow |
| Monitoring | **Sentry** (error tracking) + **PostHog** (product analytics) | Both have generous free tiers |
| Desktop Build | **Tauri GitHub Actions** | Auto-build for macOS + Windows on push |

### Key Architectural Decisions

1. **On-device inference first** — Focus Score computes locally. Cloud sync is optional. Privacy-forward.
2. **Event stream architecture** — Every keystroke, window switch, and micro-check is an event. Events → features → score.
3. **Privacy by default** — Raw keystroke data never leaves the machine. Only aggregated features sync to cloud.
4. **Offline-first** — Full functionality without internet. Sync when available.

---

## 4. 6-Week Roadmap to First Launch

### Week 1 — Foundation (P0: Passive Tracking Core)
```
Mon-Wed: Scaffold Tauri app + tray icon + background process
Thu: Keyboard/mouse event listener (macOS first)
Fri: Window focus change listener + ignore list
Weekend: Daily log event buffer (SQLite local)
**Milestone:** App runs in tray, logs all events to local DB
```

### Week 2 — Focus Score Engine (P0: Algorithm)
```
Mon-Tue: Feature extraction pipeline (typing cadence, switching rate, session metrics)
Wed-Thu: Train initial Focus Score model on synthetically labeled data
Fri: Real-time score computation + tray icon updates
Weekend: Score calibration + fix edge cases
**Milestone:** Consistent Focus Score updating live in tray
```

### Week 3 — Micro-Checks + Basic UX (P0: User Interaction)
```
Mon-Tue: Micro-check dialog (random interval, 1-10 slider)
Wed: Micro-check data logging + model feedback loop
Thu-Fri: Focus Session Timer (start/stop + window monitoring)
Weekend: Settings UI (ignore list, working hours, preferences)
**Milestone:** User can start session, get scored, provide feedback
```

### Week 4 — Reports + Polish (P0: Retention)
```
Mon-Tue: Supabase backend + auth (magic link)
Wed-Thu: Daily Focus Report view (web dashboard)
Fri: Report email digest (SendGrid or Resend)
Weekend: Polish tray icon, fix crash bugs, perf tuning
**Milestone:** MVP alpha — end-to-end flow works on one machine
```

### Week 5 — Interventions Engine (P1: Behavior Change)
```
Mon-Tue: Intervention trigger logic (threshold-based score drops)
Wed-Thu: Breath guide (4-7-8 animation), refocus prompt, stretch reminder
Fri: Notification system (native macOS notifications with tips)
Weekend: Weekly Focus Trends view + Flow Zone Graph
**Milestone:** User receives interventions; can see weekly trends
```

### Week 6 — Launch Prep (P1: Go-to-Market)
```
Mon: Windows build + cross-platform testing
Tue: Windows bug fixes + parity
Wed: Onboarding flow (new user tutorial, first session, calibration)
Thu: Markdown landing page (focusflow.app or similar)
Fri: Public beta / early access launch on ProductHunt + X
Weekend: Fix first-day bugs, monitor Sentry, respond to feedback
**Milestone:** 🚀 Public beta launched
```

### Week 6+ (Post-Launch) — Immediate Iteration Queue
1. Fix bugs + UX issues from beta feedback
2. Browser extension (Chrome first)
3. Team dashboard (enterprise upsell)
4. Mobile companion app (micro-checks + basic dashboard)

---

## 5. Monetization Plan

### Philosophy
> "Freemium with a clear value cliff. The free tier proves cognitive insight exists. The paid tier makes it actionable."

### Pricing Tiers

| Tier | Price | Target | Features |
|------|-------|--------|----------|
| **Free** | $0 | All users | Live Focus Score, 3 micro-checks/day, daily report (basic), session timer, desktop app |
| **Focus** | $12/mo ($8/mo annual) | Individual power users | Unlimited micro-checks, full intervention engine (breath, refocus, blink, stretch), weekly trends, flow zone graph, email reports, 7-day history |
| **Pro** | $29/mo ($19/mo annual) | Advanced users + neurodivergent | Everything in Focus, AI Coach layer (NL insights), focus forecast, HRV integration (Oura/Apple Watch), 30-day history, custom intervention sequences |
| **Team** | $15/seat/mo | Teams, agencies, remote orgs | Pro features + team dashboard, anonymous burnout risk flags, admin controls, custom training, SSO, priority support |

### Pricing Strategy Notes

- **Free tier is intentionally generous** — Focus Score itself is valuable. 3 micro-checks/day is enough for the curious to see the value.
- **Focus tier is the core value unlock** — Interventions are the behavior change mechanism. Most users convert here.
- **Pro tier targets quantified-self enthusiasts** — High willingness to pay, low marginal cost.
- **Team tier addresses the burnout epidemic** — Enterprise L&D budgets are significant ($1,000+/employee/seat for wellness tools).

### Revenue Projections (Conservative)

| Month | Free Users | Paid Users | MRR | Notes |
|-------|-----------|------------|-----|-------|
| M1 (Beta) | 500 | 0 | $0 | Building community |
| M2 | 1,500 | 20 | ~$240 | First conversions from early adopters |
| M3 | 3,000 | 60 | ~$720 | Product Hunt bump fading |
| M6 | 10,000 | 250 | ~$3,500 | Organic growth + content marketing |
| M12 | 40,000 | 1,200 | ~$18,000 | + content flywheel + X threads |
| M18 | 100,000 | 3,500 | ~$55,000 | Team sales starting |
| M24 | 250,000 | 8,000 | ~$130,000 | Mature SaaS |

### Go-to-Market Channels (0 → $100k MRR)

| Channel | Focus | Timeline |
|---------|-------|----------|
| **X Threads** | Neuroscience + productivity crossover content | Week 1 → ongoing |
| **YouTube** | "AI is Making You Dumb" cognitive atrophy angle | Week 3 (script ready) |
| **Product Hunt** | Launch with maker story | Week 6 |
| **Indie Hackers** | Build in public (revenue transparency) | Week 1 → ongoing |
| **Hacker News** | Technical deep-dive on Focus Score algorithm | Week 6 |
| **Reddit** (r/productivity, r/biohackers, r/ADHD) | Genuine value posts, not ads | Week 2 → ongoing |
| **Neuroscience Newsletter** | "The Focus Letter" — weekly cognitive performance tips | Week 4 |

### Cost Structure (Burn Rate)

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| Cloud (Railway/Fly.io) | $25–50 | Scales with users |
| PostgreSQL (Supabase) | $25 (free tier initially) | Free for first 500MB |
| Domain + Email | $15 | focusflow.app + Resend/SendGrid |
| Sentry (error tracking) | $0 | Free tier |
| PostHog (analytics) | $0 | Self-hosted option |
| AI API costs | $0–20 | Minimal — mostly on-device inference |
| **Total** | **$65–110/mo** | |
| **Time investment** | **6 weeks full-time** | Solo founder pace |

---

## Appendix A: Technical Deep-Dive — Focus Score Algorithm

### Input Features (all local, no cloud)

| Feature | Source | What It Captures |
|---------|--------|------------------|
| **Inter-Key Interval Variability (IKI-CV)** | Keystroke timestamps | Consistent rhythm = flow. High variability = distraction/multitasking |
| **Window Switch Rate** | OS focus events | Number of context switches per minute. Inverse correlates with focus |
| **Session Duration** | Focus timer | Time-in-task effect. Attention typically peaks at 25-45 min |
| **Mouse Movement Entropy** | Mouse position log | Low entropy = stable cursor = focused. High entropy = scanning/uncertain |
| **Active Application Category** | Active window info | Category-weighted: IDE/editor > communication tools > social media |
| **Time of Day** | System clock | CV-circadian rhythm of peak focus |
| **Micro-Check Score** | User self-report | Ground truth label for supervised learning |
| **Day of Week** | Calendar | Monday vs Friday patterns |

### Label Generation

- Positive class (focused): micro-check scores 7–10
- Negative class (distracted): micro-check scores 1–4
- Ambiguous: 5–6 (filtered or weighted down)

### Model

**MVP:** Random Forest classifier with quantile-based regression for continuous score
- Pros: Interpretable (feature importance), fast, no GPU, robust to missing data
- Cons: Not as accurate as deep learning (but overkill for MVP)

**V2:** Gradient Boosting (XGBoost/LightGBM) for 5–10% accuracy improvement

### Score Update Frequency

- Every 30 seconds (new event window triggers recalculation)
- Smoothed with exponential moving average (α = 0.3) to prevent jitter

### Privacy Guarantees

- Raw keystroke sequences are NEVER transmitted or stored
- Only aggregated features (IKI-CV, switching rate, etc.) are synced
- User can opt for fully offline operation
- GDPR compliant by design
- Data retention configurable (7/30/90 days)

---

## Appendix B: Focus Score Interpretation Guide

| Score Range | Label | What's Happening | Intervention |
|-------------|-------|------------------|-------------|
| **85–100** | 🔥 Flow State | Deep immersion, consistent rhythm, few switches | None — protect this state |
| **70–84** | 🟢 Focused | Productive, some minor breaks, steady work | None or optional stretch timer |
| **50–69** | 🟡 Mild Drift | Starting to lapse, more switching, irregular typing | Breath guide (10s) |
| **30–49** | 🟠 Distracted | Frequent switches, high typing variability, context-thrashing | Refocus prompt + breath |
| **0–29** | 🔴 Fragmented | Near-zero consistent work, constant context shifts | "Take a break. Reset." + 5-min reset prompt |

---

## Appendix C: Competitive Landscape

| Competitor | Strengths | Weaknesses | FocusFlow Differentiator |
|------------|-----------|------------|-------------------------|
| **RescueTime** | Established, app tracking | No real-time feedback, no neuroscience | Live Focus Score, micro-interventions |
| **Timeular** | Physical tracker, fun | No automatic tracking | Passive, no hardware needed |
| **Toggle Track** | Simple, trusted | Manual only, no cognitive data | Fully passive, ML-based |
| **Brain.fm** | Neuroscience music, strong brand | Audio-only, no tracking | Tracks AND intervenes |
| **NeuroTracker** | Validated cognitive training | Expensive, not passive | Passive + free entry tier |
| **Toggl Plan** | Team project planning | Not cognitive, not real-time | Individual cognitive performance |

---

## Appendix D: Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Privacy concerns about keystroke tracking | High | Medium | On-device processing, never store raw keystrokes, clear privacy policy, open-source client |
| Model doesn't generalize well | Medium | Medium | Bootstrap with synthetic data + early user feedback loop |
| Users find micro-checks annoying | High | Medium | Configurable frequency, start at 3/day, only during drops |
| Market too small | Medium | Low | Target overlaps: productivity × neuroscience × biohacking × neurodivergent = 10M+ potential users |
| No differentiation from RescueTime | High | Low | Focus Score + micro-interventions + neuroscience angle are genuinely different |
| Tauri learning curve slows MVP | Medium | Medium | Prototype UI in React first, then port to Tauri |

---

*This spec is a living document. Update as user feedback and market signals evolve.*
