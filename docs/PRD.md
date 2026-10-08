# USTAD ONLINE — MVP Product Requirements Document (PRD)

> **Learn. Decide. Improve. • Frontend + Backend + AI • Build-Ready Specification**

---

## 1. Product Vision
USTAD ONLINE is a practical life-learning platform that helps users improve real-life decision-making skills through interactive scenarios, consequences, feedback, and progress tracking.

**MVP Goal**: Prove that short, personalized decision scenarios create repeat usage and measurable skill improvement.

---

## 2. MVP Scope
- **Frontend**: React + Vite + TypeScript (Mobile-friendly responsive UI + Simulator preview).
- **Authentication + Onboarding**: Age group and goal personalization.
- **Five Core Modules**:
  1. **Decision Making** (Trade-offs, priorities, peer pressure, everyday choices)
  2. **Money Management** (Needs vs. wants, budgeting, saving, unexpected expenses)
  3. **Time Management** (Priorities, scheduling, deadlines, competing commitments)
  4. **Communication** (Conflict, requests, boundaries, tone & clarity)
  5. **Problem Solving** (Break problems into steps, constraints, compare options, recover from setbacks)
- **Daily Challenge & Scenario Engine**: Multiple-choice and short open-text responses.
- **Feedback & Consequence Engine**: Structured evaluation for responses with realistic outcomes.
- **Gamification**: Skill scores (0-100), XP, streaks, and basic achievements.
- **Recommendation Engine**: Personalized next-challenge recommendations based on skill performance.
- **States**: Profile/settings, loading, empty, offline, and error states.

*Out of MVP scope*: Traditional school management, social media feeds, public leaderboard, advanced voice analysis.

---

## 3. Core User Flow
```
SCENARIO ──► DECISION ──► CONSEQUENCE ──► FEEDBACK ──► SKILL UPDATE ──► NEXT CHALLENGE
```
1. Register / login (or demo mode).
2. Select age group and top goals.
3. Complete short onboarding diagnostic assessment.
4. Receive first recommended challenge.
5. Read scenario context & dilemma.
6. Choose option (A, B, C, D) or write custom response.
7. System evaluates response.
8. Show consequence first, then pedagogical feedback + skill impact.
9. Award XP and update streak.
10. Recommend the next challenge.

---

## 4. Frontend Architecture
- **Tech Stack**: React 19, TypeScript, Vite, Vanilla CSS design system.
- **Icons & Polish**: Lucide React, Canvas Confetti.
- **State Management**: React Context (`AppContext`) synced with LocalStorage.
- **Screen Inventory**:
  - Splash / Welcome / Onboarding Flow
  - Home Dashboard (Greeting, Streak, Daily Challenge, 5 Core Skills, XP)
  - Challenges Explorer (Search, Category Filters, Difficulty Tiers)
  - Interactive Challenge Flow (Briefing, Choices, Text Box, Consequence Reveal, Feedback)
  - Skills Diagnostics (5 Skills, Strengths, Growth Opportunities, Progression)
  - Progress View (Overall Analytics, Skill Distribution, Achievements, Decision Journal)
  - Profile & Settings (Demographics, Goals, Notifications, Appearance, Logout)

---

## 5. Backend Architecture (FastAPI Reference)
- **API Framework**: Python + FastAPI
- **Database**: PostgreSQL (SQLAlchemy + Alembic)
- **Auth**: JWT access / refresh tokens
- **Endpoints**:
  - `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
  - `POST /onboarding/profile`, `POST /onboarding/goals`, `POST /onboarding/assessment`
  - `GET /skills`, `GET /skills/{id}`, `POST /skills/{id}/progress`
  - `GET /challenges`, `GET /challenges/daily`, `GET /challenges/recommended`, `GET /challenges/{id}`
  - `POST /challenges/{id}/attempt`
  - `GET /notifications`, `PATCH /notifications/{id}/read`, `POST /notifications/read-all`
