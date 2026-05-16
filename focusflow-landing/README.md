# FocusFlow — AI-Neuroscience Focus Optimizer

> **Unlock your brain's peak performance.** FocusFlow combines real-time EEG attention tracking with AI-powered distraction blocking to help you enter and sustain deep work on your brain's natural schedule.

---

## Product

| | |
|---|---|
| **Tagline** | Your Brain's Optimal Focus, On Command |
| **Status** | Private Beta |
| **Target** | Knowledge workers, developers, students, creatives |

### Core Capabilities

- **EEG Attention Tracking** — Real-time focus monitoring via Muse, Emotiv, or Neurosity headsets
- **AI Distraction Blocking** — Context-aware, adaptive blocking that locks distractions when focus wavers
- **Deep Work Analytics** — Session tracking, pattern identification, and performance trends
- **Smart Scheduling** — AI-driven calendar optimization based on circadian rhythm and past focus data

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Desktop App** | [Tauri](https://tauri.app) (Rust shell + web frontend) |
| **Frontend** | [React](https://react.dev) + TypeScript + Tailwind CSS |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com) (Python) |
| **Database** | [PostgreSQL](https://www.postgresql.org) |
| **ML Pipeline** | ONNX Runtime + custom PyTorch models for focus prediction |
| **Infrastructure** | Docker, DigitalOcean / AWS ECS |
| **Static Hosting** | Vercel or Netlify (landing page, docs site) |

---

## 6-Week Roadmap

| Week | Milestone |
|---|---|
| **1** | Core data model & PostgreSQL schema; FastAPI project scaffold with auth |
| **2** | EEG headset integration SDK (Muse/Emotiv); real-time attention stream ingestion |
| **3** | React desktop app shell (Tauri); live focus dashboard with charting |
| **4** | AI distraction blocking engine; smart scheduling algorithm MVP |
| **5** | Analytics pipeline & reports; Team/Pro tier feature gates |
| **6** | Beta launch — landing page live, waitlist open, initial user onboarding |

---

## Deployment

### Static Landing Page

Deploy `index.html` to any static host:

```bash
# Vercel
vercel --prod

# Netlify (drag-and-drop or CLI)
npx netlify deploy --prod --dir=./focusflow-landing
```

The landing page is a single HTML file with embedded CSS. No build step required.

### Full Application (future)

```
focusflow/
├── desktop/       # Tauri + React app
├── api/           # FastAPI backend
├── ml/            # Focus prediction models
├── landing/       # This directory
└── deploy/        # Docker Compose / Kubernetes manifests
```

---

## Development

```bash
git clone https://github.com/your-org/focusflow
cd focusflow

# Backend
cd api
poetry install
uvicorn app.main:app --reload

# Desktop
cd ../desktop
pnpm install
pnpm tauri dev
```

---

*Built at the intersection of neuroscience and AI. May 2026.*
