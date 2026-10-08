# LifeLore — Real Stories. Real Lessons.

> **Social Learning Platform Based on Real-Life Experiences**  
> *"People learn from people who have already lived through the experience."*

---

## 🌟 Product Concept & Vision

**LifeLore** is a mobile-first social learning platform where people discover, read, watch, save, discuss, and learn from real human experiences.

Instead of generic social media feeds with algorithmic doom-scrolling, LifeLore is an educational repository designed like a blend of **Medium + Reddit + modern learning platform**:

```
DISCOVER EXPERIENCE ──► LEARN FROM IT ──► APPLY THE LESSON ──► SHARE YOUR OWN EXPERIENCE
```

### What People Share & Learn:
- **Written Stories**: Freelancing struggles, moving abroad, career pivots, early startup failures.
- **Videos**: Deep breakdowns with structured key takeaways.
- **PDF Guides & Resources**: Survival checklists, relocation roadmaps, revision frameworks.
- **Actionable Lessons**: Numbered rules (`01`, `02`, `03`) with concrete next actions.
- **Helpful Feedback**: A community-driven rating system (*"Was this experience helpful?"*).

---

## 🎨 Visual Identity & Brand

- **Brand Name**: LifeLore
- **Tagline**: *"Real Stories. Real Lessons."*
- **Theme**: Seamless Light & Dark mode support with obsidian dark palette and crisp editorial light mode.
- **Design Philosophy**: High trust, human empathy, clean typography, rounded cards, subtle glassmorphic borders, and zero childish clutter.

---

## 🏗️ Frontend Architecture

The frontend is built using **React 19 + TypeScript + Vite**, structured for mobile-first responsiveness and complete decoupling from backend logic.

```
Team-Salyani/
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── common/             # Reusable UI system (Header, BottomNav, Cards, Modals, Toasts)
    │   ├── features/
    │   │   ├── auth/               # Splash, Welcome, Login, Register, Onboarding flow
    │   │   ├── home/               # Home Dashboard ("Learn from lives", Recommended, Trending, Short Lessons)
    │   │   ├── explore/            # Full-text search, Format pills, Category chips, Sort options
    │   │   ├── experiences/        # Long-form structured reading & dedicated video player
    │   │   ├── create/             # "Share Your Experience" multi-step publishing & media dropzone
    │   │   ├── saved/              # Saved experiences library categorized by format
    │   │   ├── profile/            # User profile, learning goals, stats, Edit Profile modal
    │   │   ├── comments/           # Constructive discussion threads with replies & reporting
    │   │   └── notifications/      # Real-time interaction drawer (likes, comments, helpful marks)
    │   ├── services/
    │   │   └── api/                # REST API Client & domain service abstractions
    │   │       ├── apiClient.ts    # Centralized HTTP fetch client (JWT bearer token & headers)
    │   │       ├── authService.ts  # Auth, login, registration, password reset
    │   │       ├── experienceService.ts # Feed, search, filters, publish, voting
    │   │       ├── commentService.ts # Threaded discussions, moderation reporting
    │   │       ├── userService.ts  # Profiles, topics of interest, follow graph
    │   │       └── notificationService.ts # Activity alerts & unread badges
    │   ├── context/
    │   │   └── AppContext.tsx      # Global theme, auth session, navigation & toast state
    │   ├── types/
    │   │   └── index.ts            # Strict domain TypeScript contracts & API schemas
    │   ├── constants/              # Categories, content types, and sorting tokens
    │   ├── data/
    │   │   └── mockData.ts         # High-yield seed data for local preview & testing
    │   ├── App.tsx                 # Viewport shell & routing manager
    │   ├── main.tsx                # Entry point
    │   └── index.css               # Comprehensive LifeLore design system tokens
    ├── package.json
    └── vite.config.ts
```

---

## 🔌 Backend Integration Guide (For Backend Engineers)

The frontend is **100% API-ready** with clean service abstractions and typed data models:

1. **Configure API Base URL**:
   Create a `.env` file inside the `frontend/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
2. **Centralized Client**:
   All HTTP communication flows through [`src/services/api/apiClient.ts`](file:///frontend/src/services/api/apiClient.ts).
   - Automatically attaches `Authorization: Bearer <token>` from localStorage.
   - Normalizes HTTP error responses into typed `ApiError` objects.
   - If `VITE_API_BASE_URL` is empty, it safely uses the rich in-memory provider so frontend teammates can develop and review UI immediately.

3. **Domain Contracts**:
   Inspect [`src/types/index.ts`](file:///frontend/src/types/index.ts) for full TypeScript definitions of `Experience`, `User`, `Lesson`, `Comment`, `Notification`, `CreateExperiencePayload`, and `ApiResponse<T>`.

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
