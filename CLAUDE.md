# CLAUDE.md — PamirAcademy Project Context

> This file is for Claude Code. It provides the full context needed to understand and work on this project.

---

## What Is PamirAcademy?

An online language academy platform where **students** take placement exams, get assigned to groups by level, attend live video sessions with **teachers**, and follow structured courses. **Admins** manage everything: teacher approvals, course/test building, scheduling, and statistics.

---

## Repository Structure

```
PamirAcademy/
  pamir-academy-backend/     # Django 5 + DRF + Channels (ASGI via Daphne)
  pamir-academy-react/       # React 19 + Vite + Tailwind CSS
  Full_IMPLEMENTATION_PLAN.md  # DONE (gitignored)
  IMPLEMENTATION_UPDATES.md    # DONE (gitignored)
  FUTURE_IMPLS.md              # Production readiness roadmap
```

---

## Tech Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Backend | Django 5, DRF, SimpleJWT, Channels, Daphne | ASGI for WebSocket support |
| Frontend | React 19, Vite 7, React Router 7, Tailwind 3 | SPA, no SSR |
| Database | SQLite (dev only) | Must migrate to PostgreSQL for production |
| Auth | JWT (SimpleJWT) | 2hr access, 7d refresh, auto-rotate |
| Email | Brevo SMTP | For verification + password reset |
| WebRTC | Browser-native + Channels signaling | Live video sessions |
| Env | python-dotenv (.env) | Frontend uses Vite VITE_ prefix |

---

## Django Apps

### `accounts`
- Custom User model (email-based, no username)
- Roles: `student`, `teacher`, `employee`, `admin`
- Fields: `email`, `role`, `display_name`, `is_email_verified`, `email_verification_token`
- Views: register, login, verify-email, me, password-reset, resend-verification
- JWT tokens issued on login/verify

### `registration`
- Models: `Subject`, `StudentProfile`, `TeacherProfile`, `UserSubjectSelection`, `ExamQuestion`, `ExamResult`, `PlacementResult`
- Student flow: personal info -> subject selection -> exam per subject/level -> placement -> group assignment
- Teacher flow: subject selection -> qualification exam -> demo session -> admin approval
- `registration_step` field tracks progress (1-5 for students, 1-4 for teachers)

### `panels`
- Models: `Group`, `GroupMembership`, `ScheduleSlot`, `ScheduleChangeRequest`, `GroupChangeRequest`, `Course`, `Message`, `Announcement`, `Payment`, `LiveSession`
- Views (~20): schedule, groups, messages, dashboards (student/teacher/admin), announcements, payments, stats, sessions, course builder, test builder, admin tools
- WebSocket consumer: `consumers.py` — relays WebRTC signaling (SDP/ICE) for live sessions
- Routing: `routing.py` — `ws/session/<room_id>/`

---

## API Base URL

Backend: `http://127.0.0.1:8000/api/`

URL config:
- `/api/auth/` -> `accounts.urls`
- `/api/registration/` -> `registration.urls`
- `/api/` -> `panels.urls`

---

## Key Backend Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register/` | POST | No | Create account |
| `/api/auth/login/` | POST | No | Get JWT tokens |
| `/api/auth/verify-email/<token>/` | GET | No | Verify email |
| `/api/auth/me/` | GET/PUT | Yes | Get/update profile |
| `/api/auth/token/refresh/` | POST | No | Refresh JWT |
| `/api/schedule/` | GET | Yes | My schedule slots |
| `/api/groups/my/` | GET | Yes | My groups |
| `/api/groups/available/` | GET | Yes | Available groups |
| `/api/messages/contacts/` | GET | Yes | Message contacts |
| `/api/messages/<userId>/` | GET/POST | Yes | Conversation |
| `/api/dashboard/student/` | GET | Yes | Student summary |
| `/api/dashboard/teacher/` | GET | Yes | Teacher summary |
| `/api/dashboard/admin/` | GET | Yes | Admin summary |
| `/api/announcements/` | GET | Yes | Announcements |
| `/api/sessions/` | GET | Yes | Live sessions |
| `/api/teacher/stats/` | GET | Yes | Teacher statistics |
| `/api/teacher/payments/` | GET | Yes | Teacher payments |
| `/api/courses/` | GET | Yes | Student courses |

---

## Frontend Structure

```
src/
  App.jsx              # All routes defined here
  App.css              # Global styles
  index.css            # Tailwind directives + base CSS (bloated)
  main.jsx             # Entry point, wraps in AuthProvider
  components/
    LoginModal.jsx     # Login/register modal
    ProtectedRoute.jsx # Role-based route guard
  contexts/
    AuthContext.jsx     # Auth state, login/logout/register functions
  utils/
    api.js             # Low-level HTTP: apiGet, apiPost, apiPut, apiPatch + token management
    panelApi.js        # Panel API wrappers (getMySchedule, getContacts, etc.)
    registrationApi.js # Registration API wrappers
    webrtc.js          # WebRTC helpers (createPeerConnection, getLocalStream, getScreenStream)
  pages/
    Home.jsx, LearnMore.jsx, Products.jsx, Subjects.jsx, About.jsx  # Public pages
    registration/      # Student & teacher registration flows
    lesson/            # Lesson environment
    course/            # Course unit viewer
    panel/
      admin/           # Dashboard, Schedule, Statistics, Messages, Meeting, CourseBuilder, TestBuilder
      student/         # Dashboard, Schedule, Groups, Messages, Courses, LiveSession
      teacher/         # Dashboard, Schedule, Stats, Messages, Payments, LiveSession
```

---

## Auth Flow

1. User registers with email + password + role
2. Backend creates User (is_email_verified=False), sends verification email
3. User clicks link -> `/verify-email?token=<uuid>`
4. Backend verifies, issues JWT tokens, redirects to registration flow
5. Student completes: personal info -> subjects -> exams -> placement -> groups
6. Teacher completes: subjects -> exam -> demo session -> waits for admin approval
7. After login, JWT stored in localStorage under `pamir_tokens`
8. `api.js` auto-attaches Bearer token, auto-refreshes on 401

---

## Role-Based Access

| Route Pattern | Role |
|--------------|------|
| `/admin/*`, `/dashboard`, `/schedule`, `/statistics`, `/messages`, `/demo`, `/course-builder`, `/test-builder` | admin |
| `/teacher/*` | teacher |
| `/student/*` | student |
| `/lesson-environment`, `/unit-view` | any authenticated |
| Everything else | public |

Protected by `<ProtectedRoute allowedRoles={[...]}>` wrapper components in App.jsx.

---

## What Has Been Implemented (Completed Plans)

All items from `Full_IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_UPDATES.md` are done:
- All frontend pages wired to real API endpoints (no hardcoded mock data)
- Bug fixes: DRF pagination removed, contacts view fixed, set_availability validation
- Backend endpoints: announcements, schedule CRUD, teacher stats/payments, live sessions, admin dashboard/schedule/statistics/teacher-decision
- WebRTC: Django Channels signaling server, frontend webrtc.js helpers, live session pages with real video/audio/screen-share
- Models: Announcement, Payment, LiveSession (with room_id UUID)
- apiPatch added to api.js

---

## What Still Needs Work

See `FUTURE_IMPLS.md` for the full roadmap. Key items:
- **P0**: Security hardening (SECRET_KEY, DEBUG defaults, rate limiting), PostgreSQL migration
- **P1**: Testing (zero coverage), error handling, API docs, Docker/CI, logging
- **P2**: Lazy loading, pagination, i18n, payment integration, notifications

---

## Development Setup

```bash
# Backend
cd pamir-academy-backend
python -m venv venv && source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env  # configure variables
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver  # runs on :8000 via Daphne (ASGI)

# Frontend
cd pamir-academy-react
npm install
npm run dev  # runs on :5173
```

---

## Important Conventions

- Backend uses function-based views with `@api_view` decorators (not ViewSets/class-based)
- Frontend uses `useState` + `useEffect` for data fetching (no React Query, no Redux)
- API wrappers in `panelApi.js` call lower-level functions in `api.js`
- All API responses are plain JSON (no pagination wrapper — global pagination was removed)
- Admin permission is checked inline with a `_require_admin(request)` helper, not a DRF permission class
- `display_name` on User model is the primary name field (set during registration)
- Schedule uses `day_of_week` (0=Mon, 6=Sun) and `hour` (0-23)
- Groups have `group_type` ("group" or "individual") and `max_members`
- WebSocket URL: `ws://host/ws/session/<room_id>/` (no JWT auth on WS yet)

---

## UI / Design System (April 2026 Overhaul)

A comprehensive UI migration was completed moving from legacy vanilla CSS to Tailwind utility classes. Key details:

### Design Tokens (tailwind.config.js)
- **Brand colors**: `brand` (#006236), `brand-dark` (#004d2a), `brand-light` (#e6f2ec), `brand-muted` (#4a6b5a)
- **Surface colors**: `surface` (#F9FAFB), `surface-card` (#FFFFFF), `surface-panel` (#F3F4F6), `surface-sidebar` (#FFFFFF)
- **Accent**: `accent-red` (#C5221F)
- **Fonts**: Inter (primary) + Roboto (fallback), loaded from Google Fonts in `index.html`
- **Shadows**: `shadow-card`, `shadow-card-hover`, `shadow-modal` — defined in Tailwind config
- **Border radius**: `rounded-card` (16px), `rounded-modal` (20px) — defined in Tailwind config

### Component Patterns
- **Header**: Sticky white bar with `bg-white/95 backdrop-blur-md`, inline SVG icons (no PNG imports)
- **Footer**: Dark green `bg-[#0a2e1a]`, 3-column grid, opacity hover transitions
- **Modals** (LoginModal, ApplyModal): `backdrop-blur-sm` overlay, `shadow-modal`, `rounded-modal`
- **Cards**: White `bg-white rounded-2xl shadow-card` pattern used throughout
- **Registration pages**: `bg-surface` background, white header with `border-b border-gray-100 shadow-sm`, step progress bars using `bg-brand` / `bg-gray-200`
- **Dashboard layouts** (Admin, Student, Teacher): `bg-surface` body, white sidebar with `bg-brand-light` active states
- **Buttons**: `bg-brand text-white rounded-full hover:bg-brand-dark transition-colors` pattern

### CSS Files Status
- **Migrated to pure Tailwind** (no CSS imports): Home, About, Products, Subjects, LearnMore, Header, Footer, LoginModal, ApplyModal, all Registration pages, all Dashboard layouts
- **Still using legacy CSS**: Exercise.jsx, Contact.jsx, OurPillars.jsx, LessonEnvironment.jsx, UnitView.jsx — these pages were NOT part of the UI overhaul and still import from `src/styles/`
- **Deleted CSS files**: All registration CSS (`styles/registration/`), `home.css`, `about.css`, `products.css`, `subjects.css`, `learn-more.css`, and their responsive counterparts
- **Remaining CSS files**: `index.css` (Tailwind directives + some legacy base styles), `App.css`, `general.css`, `exercise.css`, `footer/`, `lesson/`, `course/unit-view.css` — only used by non-migrated pages

### Important Notes for Future Work
- When creating new pages/components, use Tailwind utility classes with the design tokens above — do NOT create new CSS files
- The `index.css` file still has some legacy vanilla CSS mixed with Tailwind `@tailwind` directives — cleanup is pending
- All inline color values like `text-[#006236]` should be replaced with `text-brand` when touching those files
- Pages that still use legacy CSS (Exercise, Contact, OurPillars, LessonEnvironment, UnitView) should be migrated to Tailwind when modified

---

## Known Gotchas

1. **InMemoryChannelLayer**: WebSocket only works in single-process mode. Multi-worker needs Redis.
2. **SQLite**: No concurrent write support. Will fail under load.
3. **SECRET_KEY fallback**: App runs with insecure key if .env is missing — dangerous.
4. **No .env.example**: New devs don't know what env vars are needed.
5. **CSS bloat**: `index.css` has old vanilla CSS mixed with Tailwind directives.
6. **email_verification_token reuse**: Same token field for email verify AND password reset — they conflict.
7. **No tests**: Zero test coverage. Any refactoring is risky.
8. **Token in localStorage**: Vulnerable to XSS. Consider httpOnly cookies for production.
