# ⚡ TRIAD — Three AI Experiences in One

CoFounder · Murder Mystery · Devil's Advocate

---

## What is this?

TRIAD is a 3-in-1 AI experience app where each mode is a completely different AI persona with its own UI, theme, and mechanics:

| Mode | What it does |
|------|-------------|
| ⚡ CoFounder AI | Brutally honest startup co-founder. Validates ideas, challenges assumptions, gives real GTM/monetization feedback. Has "Brutal Mode" for investor-level harshness. |
| 🕵️ Murder Mystery | You're the detective. AI generates a unique murder case with 4 suspects, 6 clues, and one secret killer. Interrogate, investigate, accuse. |
| 💀 Devil's Advocate | State any belief. AI takes the opposite position and never backs down. Tracks your "conviction score" as you argue. |

---

## Features

- **Mode switcher** — seamless transition between 3 completely different experiences
- **Streaming responses** — token-by-token, live typing cursor
- **Per-mode side panels** — Startup Context / Case File / Debate Score
- **Adaptive UI** — each mode has its own color scheme, typography, and atmosphere
- **Mystery case tracking** — suspects, clues found, progress bar
- **Debate conviction meter** — live score that drops as you lose arguments
- **Quick action buttons** — contextual prompts per mode
- **Brutal Mode toggle** — CoFounder becomes an investor tearing apart your pitch
- **Mobile responsive** — sidebar collapses to bottom sheet

---

## Stack

- Next.js 14 (App Router) + TypeScript
- TailwindCSS + Framer Motion
- Zustand state management
- Gemini API (OpenAI-compatible endpoint)
- Edge runtime streaming

---

## Setup

```bash
git clone <repo>
cd triad-ai
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
npm run dev
```

Get a free Gemini key at: https://aistudio.google.com/apikey

---

## .env.local

```
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-2.0-flash-lite
```

---

## Deploy to Vercel

```bash
vercel
vercel env add GEMINI_API_KEY
```
