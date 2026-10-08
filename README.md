# USTAD ONLINE — Learn. Decide. Improve.

> **Practical Life-Learning Platform Based on Interactive Real-World Scenarios**  
> *"Master critical life choices before you face them for real."*

---

## 🌟 Product Concept & Vision

**USTAD ONLINE** is an educational life-learning web platform that helps users improve their real-life decision-making skills through interactive scenarios, consequences, feedback, and progress tracking.

Traditional education often neglects the everyday choices that determine health, financial stability, and career trajectories. USTAD ONLINE provides a safe, interactive flight simulator for reality:

```
SCENARIO ──► DECISION ──► CONSEQUENCE ──► FEEDBACK ──► SKILL IMPROVEMENT ──► NEXT CHALLENGE
```

### The Five Core Life Skills

1. **Decision Making**: Trade-offs, priorities, peer pressure, everyday choices, and avoiding cognitive biases.
2. **Money Management**: Budgeting with limited funds, separating needs vs. wants, emergency buffers, and avoiding debt traps.
3. **Time Management**: Ruthless prioritization, deep focus scheduling, setting boundaries, and conquering procrastination.
4. **Communication**: Workplace conflict, diplomatic de-escalation, clear requests, active listening, and difficult conversations.
5. **Problem Solving**: Breaking chaotic problems into structured steps, identifying root causes, and testing high-leverage solutions under pressure.

---

## 🎨 Visual Identity & Design System

- **Brand Name**: USTAD ONLINE
- **Tagline**: *"Learn. Decide. Improve."*
- **Theme**: Seamless Light & Dark mode support with obsidian dark palette and crisp educational light mode.
- **Color Palette**:
  - Primary Blue: `#2563EB`
  - Dark Blue: `#1D4ED8`
  - Background: `#F8FAFC`
  - Cards & Surfaces: `#FFFFFF`
  - Main Text: `#0F172A`
  - Secondary Text: `#64748B`
  - Success Green: `#16A34A`
  - Warning Orange: `#F59E0B`
  - Danger Red: `#DC2626`
  - Accent Purple: `#7C3AED`

---

## 🏗️ Architecture & Technology Stack

The application is built using **React 19 + TypeScript + Vite**, structured for mobile-first responsiveness and complete decoupling from backend logic.

```
lived_project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/             # Header, BottomNav, Modals, Toasts, Skeletons, ProgressBars
│   │   ├── features/
│   │   │   ├── auth/               # Splash Screen, Welcome, Login, Register, Onboarding
│   │   │   ├── home/               # Dashboard, Streak, Level, 5 Core Skills, Daily Challenge
│   │   │   ├── challenges/         # Scenario Player, Decision Choices, Consequence Reveal, Feedback
│   │   │   ├── skills/             # 5 Core Skills Diagnostics, Strengths, Growth Opportunities
│   │   │   ├── progress/           # Learning Analytics, Mastery Distribution, Achievements, Decision Journal
│   │   │   ├── profile/            # User Profile, Learning Goals, Notifications, Theme Mode, Settings
│   │   │   └── notifications/      # Real-time alerts drawer (daily challenges, streak warnings)
│   │   ├── services/
│   │   │   └── api/                # REST API Client & domain service abstractions
│   │   │       ├── apiClient.ts    # Centralized HTTP fetch client (JWT bearer token & headers)
│   │   │       ├── authService.ts  # Auth, login, registration, password reset
│   │   │       ├── challengeService.ts # Scenarios, daily challenges, decisions & feedback
│   │   │       ├── skillService.ts # 5 Skills diagnostics, mastery levels & scores
│   │   │       ├── userService.ts  # Profiles, age groups, learning goals
│   │   │       └── notificationService.ts # Daily scenario & streak alerts
│   │   ├── context/
│   │   │   └── AppContext.tsx      # Global state (theme, active tab, user, skills, challenges, toasts)
│   │   ├── types/
│   │   │   └── index.ts            # Strict domain TypeScript contracts & API schemas
│   │   ├── constants/              # Categories, difficulty tiers, age groups, learning goals
│   │   ├── data/
│   │   │   └── mockData.ts         # High-yield seed scenarios, initial skills, achievements
│   │   ├── App.tsx                 # Viewport shell & routing manager
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Comprehensive USTAD ONLINE design system tokens
│   ├── package.json
│   └── vite.config.ts
└── docs/
    └── PRD.md
```

---

## 🔌 Backend Integration Guide

The frontend is **100% API-ready** with clean service abstractions and typed data models:

1. **Configure API Base URL**:
   Create a `.env` file inside the `frontend/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
2. **Centralized Client**:
   All HTTP communication flows through [`src/services/api/apiClient.ts`](file:///frontend/src/services/api/apiClient.ts).
   - Automatically attaches `Authorization: Bearer <token>` from localStorage (`ustad_online_auth_token`).
   - Normalizes HTTP error responses into typed `ApiError` objects.
   - If `VITE_API_BASE_URL` is empty, it safely uses the rich in-memory provider so frontend teammates can develop and review UI immediately.

3. **Domain Contracts**:
   Inspect [`src/types/index.ts`](file:///frontend/src/types/index.ts) for full TypeScript definitions of `Challenge`, `ChallengeOption`, `SkillData`, `User`, `Achievement`, `NotificationItem`, and `ApiResponse<T>`.

---

## 💻 Running the Frontend Locally

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## ✅ Quality & Build Check

```bash
npm run build
```
*(Runs TypeScript strict type-checking `tsc -b` and Vite production bundling with 0 errors).*
