# LIFEOS — MVP Product Requirements Document (PRD)

> **Learn by Living • Frontend + Backend + AI • Build-Ready Specification**

---

## 1. Product Vision
LifeOS is an AI-powered practical life-learning platform. Users practice realistic everyday situations, make decisions, see consequences, receive feedback, and improve through repeated practice. 

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
- **AI Feedback**: Structured evaluation for open-text responses.
- **Gamification**: Skill scores (0-100), XP, streaks, and basic achievements.
- **Recommendation Engine**: Personalized next-challenge recommendations based on skill performance.
- **States**: Profile/settings, loading, empty, offline, and error states.

*Out of MVP scope*: Payments, social feed, public leaderboard, school/admin dashboard, advanced voice analysis.

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
8. Show consequence first, then AI feedback + skill impact.
9. Award XP and update streak.
10. Recommend the next challenge.

---

## 4. Frontend Architecture
- **Tech Stack**: React, TypeScript, Vite, Vanilla CSS design system.
- **Icons & Polish**: Lucide React, Canvas Confetti.
- **State Management**: React Context (`AppContext`) synced with LocalStorage.
- **Screen Inventory**:
  - Splash / Welcome / Onboarding Flow
  - Home Dashboard (Greeting, Streak, Daily Challenge, 5 Modules, XP)
  - Scenario Player (Briefing, Choices, AI Text Box, Consequence Reveal, Feedback)
  - Challenges Explorer (Search, Module Filters, Difficulty Tiers)
  - Skills Analytics (Radar / Bar breakdowns, Mastery levels)
  - Progress View (Streaks, Trophies, Decision History Journal)
  - Profile Settings (Demographics, Personas, FastAPI Backend Config)

---

## 5. Backend Architecture (FastAPI Reference)
- **API Framework**: Python + FastAPI
- **Database**: PostgreSQL (SQLAlchemy + Alembic)
- **Auth**: JWT access / refresh tokens
- **Endpoints**:
  - `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
  - `POST /onboarding/profile`, `POST /onboarding/goals`, `POST /onboarding/assessment`
  - `GET /modules`, `GET /scenarios`, `GET /scenarios/recommended`, `GET /scenarios/{id}`
  - `POST /scenarios/{id}/start`, `POST /attempts/{id}/responses`, `POST /attempts/{id}/evaluate`
  - `GET /skills`, `GET /progress/overview`, `GET /streak`, `GET /achievements`

---

## 6. AI Evaluation Schema
Output schema expected from AI evaluation:
- `overall_score`: Integer (0 - 100)
- `skill_scores`: Key-value pairs of skill ID to score delta
- `strengths`: List of identified positive traits
- `improvements`: List of growth opportunities
- `consequence_explanation`: Narrative of realistic outcome
- `next_action`: Actionable follow-up recommendation
- `retry_available`: Boolean
