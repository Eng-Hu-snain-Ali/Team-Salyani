# LifeOS — Learn by Living

> **AI-Powered Practical Life-Learning Platform**  
> Practice realistic everyday situations • Make decisions • See consequences • Build real-world resilience

---

## 🌟 Overview & Product Vision

**LifeOS** is an interactive learning platform where users practice realistic everyday situations, make high-stakes or subtle choices, experience immediate cause-and-effect consequences, and receive structured AI feedback to improve their practical intuition.

### Core Loop
```
SCENARIO ──► DECISION ──► CONSEQUENCE ──► AI FEEDBACK ──► SKILL UPDATE ──► NEXT CHALLENGE
```

---

## 🗂️ Five Foundational Modules

1. **🧭 Decision Making**: Trade-offs, opportunity costs, peer pressure, and avoiding analysis paralysis.
2. **💳 Money Management**: Budgeting, cashflow resilience, handling unexpected expenses, and splitting group bills.
3. **⏱️ Time Management**: Prioritization under competing deadlines, avoiding procrastination traps, and protecting peak energy.
4. **💬 Communication**: Diplomatic boundary assertion, de-escalating team conflict, and constructive accountability.
5. **🔧 Problem Solving**: High-pressure crisis recovery, constraint identification, and structured troubleshooting.

---

## 🏗️ Repository Architecture

This repository is organized to support seamless full-stack collaboration:

```
Team-Salyani/
├── frontend/               # React + Vite + TypeScript Web & Mobile UI
│   ├── src/
│   │   ├── components/     # Reusable UI & Screen modules
│   │   │   ├── common/     # Header, BottomNav, Badges, Modals
│   │   │   ├── home/       # Daily Challenge hero, streak matrix, XP level
│   │   │   ├── scenario/   # Core loop player (Multiple choice & Open-Text AI)
│   │   │   ├── challenges/ # Explorer with search & module filtering
│   │   │   ├── skills/     # 5 Core skills breakdown & mastery meters
│   │   │   ├── progress/   # Habit streaks, trophies & decision journal
│   │   │   ├── profile/    # Personas, goals editor, and FastAPI config
│   │   │   └── onboarding/ # 5-step diagnostic & calibration wizard
│   │   ├── context/        # AppContext (persistent state, local storage)
│   │   ├── data/           # Seed scenarios, skills, achievements
│   │   ├── services/       # API client & client-side AI evaluation fallback
│   │   └── types/          # Strict TypeScript domain interfaces
│   ├── index.html          # Entry HTML with typography & SEO
│   └── package.json
└── backend/                # FastAPI + PostgreSQL + SQLAlchemy (For backend teammates)
```

---

## 🚀 Running the Frontend Locally

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## ⚡ Key Frontend Features Implemented

- **✨ Rich Modern Aesthetics**: Dark obsidian palette, vibrant module accents, glassmorphic surfaces, and celebration confetti.
- **📱 Dual Viewport Engine**: One-click toggle between standard full-width responsive web layout and an interactive iPhone frame simulator.
- **🧠 Hybrid AI Evaluation**:
  - Connects out-of-the-box to FastAPI endpoints (`http://localhost:8000/attempts/evaluate`).
  - Seamless built-in heuristic AI evaluation fallback that runs 100% offline without crashing when the backend is not yet started.
- **🎯 Full PRD Feature Set**:
  - Onboarding assessment & baseline calibration.
  - Multi-choice and open-text AI responses.
  - Consequence reveal first, followed by AI feedback and trade-off analysis.
  - Persistent streak tracking, XP levels, and unlocked achievement trophies.
  - Granular skill radar & competency progression.
