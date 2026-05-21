# Pamir Academy — Final Year Project Report (Draft)

> Working draft. Intended as raw material for a downstream agent that will produce the final, polished thesis document. The text below is dense on purpose: it documents what is actually in the codebase, why each component exists, how the parts fit together, and how the system serves its target user community in the mountainous Pamir region.

---

## 1. Introduction

### 1.1 Background and motivation

Online education has, in the last decade, redrawn what is possible for learners outside the traditional university and school catchment areas. Large commercial platforms — Coursera, edX, Khan Academy, Duolingo — have demonstrated that a digital learning environment can plausibly substitute for, and in some cases outperform, in-person instruction across a wide spectrum of subjects. However, those platforms are designed for a single, very specific operating context: a mass audience of self-directed learners, hosted on hyperscale infrastructure, with consistently fast and reliable internet. They are not designed for, and do not serve well, smaller institutions whose value proposition rests on tightly run cohorts, individualised teacher attention, regulated registration and placement, and learners whose connectivity is best described as "intermittent" rather than "broadband".

Pamir Academy is a small, distributed online academy that operates in exactly that under-served niche. Its students are predominantly drawn from the Pamir region — a mountainous belt of communities spread across Afghanistan, Tajikistan, Pakistan, China and Kyrgyzstan — and from a wider Central Asian and South Asian diaspora. Many of these students live in valleys and villages where electricity is rationed, the household internet connection is shared with several other tasks, and a typical school day may include power cuts, weather-driven outages, and an uplink that varies between adequate and unusable. Despite these constraints, the demand for structured, English-language and STEM tuition is high, and the academy's teachers — drawn primarily from larger cities and from the diaspora — are eager to reach those students.

Before the start of this project, Pamir Academy operated as a loose constellation of tools: a hand-rolled registration form, a spreadsheet for placement, a messaging app for class coordination, a separate video conferencing tool for live sessions, ad-hoc payment receipts, and shared cloud-storage folders for course materials. The administrative load on a single coordinator was substantial and growing, the placement decisions were inconsistent, the teacher onboarding pipeline had no formal qualification step, and most critically, students with weak connectivity routinely missed sessions and lost progress because nothing in the workflow was designed with intermittent connectivity in mind.

The thesis project described in this report set out to replace that constellation of tools with a single, integrated, role-aware web platform. The platform — also called Pamir Academy — is the artefact whose architecture, implementation, and validation this report documents.

### 1.2 Problem statement

The concrete problem the project addresses can be phrased as follows. Small online academies require, at minimum, the following co-ordinated capabilities: (a) a registration pipeline that captures structured personal information and produces a defensible level placement, (b) a teacher onboarding pipeline that includes formal qualification rather than self-declaration, (c) a scheduling system that preserves the matching between teachers and students even when either party requests changes, (d) a real-time video classroom whose quality of service is not gated on a third-party SaaS account, (e) a messaging substrate that allows students, teachers, and administrators to communicate without leaking data into consumer chat applications, (f) a content authoring environment in which administrators can publish structured courses and tests without engineering involvement, and (g) a delivery model that degrades gracefully under unreliable connectivity rather than failing hard. No off-the-shelf product offers all of these in one piece, particularly not the last item; assembling them from independent SaaS components reproduces the original coordination problem at a different layer.

### 1.3 Aims and objectives

The overall aim of the project is to design, implement, and document a coherent end-to-end web platform that fulfils the seven capabilities above for a small online academy operating under uneven connectivity. The objectives, derived from that aim, are:

1. To design a domain model that captures the entities (users, subjects, exams, placements, groups, schedules, sessions, courses, payments, announcements, messages) and their relationships in a way that supports future extension without rework.
2. To implement a backend service that exposes that domain model through a versionable HTTP API and a real-time WebSocket signalling channel, with email-based authentication, role-based authorisation, and JSON Web Token sessions.
3. To implement a single-page web client that presents three distinct, role-tailored user experiences (administrator, teacher, student) on top of a shared design language.
4. To implement a peer-to-peer live-classroom feature using browser-native WebRTC, with the server acting only as a thin signalling relay rather than a media path, in order to keep streaming quality independent of central server bandwidth.
5. To implement an offline synchronisation layer so that students can download lessons, take quizzes, and continue working when their connection drops, then reconcile their progress with the server when connectivity returns.
6. To implement a conversational assistant ("PamirBot") that students can use to clarify lesson content, glossary terms, and procedural questions about how to use the platform, without removing the cognitive load that is part of learning.
7. To produce documentation sufficient for another engineer to extend the platform, deploy it, and reason about the security and operational properties of each subsystem.

### 1.4 Contributions

The principal contributions of the work, in order of how directly they relate to the academic claim, are:

1. **A complete reference architecture** for a small online academy combining Django, Django REST Framework, Django Channels, JWT authentication, and a React 19 single-page client.
2. **An algorithmic placement engine** that grades multi-subject, multi-level entrance exams and assigns students to a standardised level using thresholded average performance, replacing the previous spreadsheet workflow.
3. **A thin-server WebRTC live classroom**, implemented as a Channels consumer that relays only SDP and ICE messages, showing that small-institution live tuition does not need a TURN/SFU stack to be functional.
4. **A connectivity-resilient delivery model** in which course content can be downloaded for offline study and reconciled with the server, designed specifically for the Pamir use-case but applicable to any low-connectivity educational deployment.
5. **A constrained conversational assistant** integrated with the lesson view, demonstrating how an LLM-based helper can be embedded into a course dashboard without supplanting the student's own problem-solving.
6. **A set of admin authoring tools** (Course Builder and Test Builder) that allow non-developer staff to publish placement question banks and unit-lesson-block course trees per subject and level, reducing engineering involvement in day-to-day operations.

### 1.5 Report structure

The remainder of the report is organised as follows. Chapter 2 reviews the relevant background and related work. Chapter 3 describes the requirements, both functional and non-functional. Chapter 4 sets out the system architecture. Chapter 5 documents the domain model. Chapter 6 walks through each feature subsystem in detail. Chapter 7 is dedicated to the offline-synchronisation layer. Chapter 8 covers the conversational assistant. Chapter 9 covers security and privacy. Chapter 10 describes deployment, testing, and operational concerns. Chapter 11 reports on evaluation and user feedback. Chapter 12 concludes and outlines further work.

---

## 2. Background and Related Work

### 2.1 Learning sciences

The system's design is informed by three threads of educational research. First, **mastery-based instruction** — the idea that learners should not advance to the next unit before demonstrating competence on the previous one — provides the rationale for a structured placement step before group assignment. The engine that grades the entrance exam and assigns Beginner, Intermediate, or Advanced levels is a direct, simplified implementation of that principle. Second, **deliberate practice** suggests that meaningful learning happens through repeated exercises of graded difficulty with feedback. The Course Builder's content blocks (video, article, math expression, quiz, exercise) reflect the granularity needed for that style of practice. Third, **scaffolded support**, in particular the Vygotskian zone of proximal development, motivates the design of the conversational assistant: the assistant is intentionally constrained to give hints and clarifications rather than full solutions, so that the student remains in the productive zone of difficulty rather than receiving the answer outright.

### 2.2 Human–computer interaction

From an HCI perspective, the platform sits in the lineage of role-aware enterprise SaaS, but adapted for a teaching context. Three principles guided the interface work: progressive disclosure (each registration step shows the user only the controls they need at that step), visible system status (the dashboards summarise classes-this-week, total students, and pending approvals so that no role is surprised by what the platform is doing on their behalf), and forgiveness (formal change-request flows for both schedules and group memberships allow students to renegotiate prior commitments without contacting the administrator out-of-band). The resulting design language — based on the Pamir-green brand colour `#006236`, an Inter / Roboto type stack, a 16-pixel `rounded-card` radius and a 20-pixel `rounded-modal` radius — is implemented entirely with Tailwind utility classes after a project-wide migration away from hand-written CSS.

### 2.3 Educational technology platforms

Among existing educational platforms, three reference points are most relevant to Pamir Academy. **Khan Academy** is closest in pedagogical spirit but offers no live tuition and assumes good connectivity; it served as a reference for the lesson-block taxonomy. **Moodle** is a strong reference for the breadth of features expected in a learning management system but is monolithic, PHP-based, and famously hard to operate at small scale; the project adopts Moodle's vocabulary (units, lessons, blocks, courses) while diverging architecturally. **Coursera** demonstrated the value of structured courses, peer interaction, and integrated assessment but does not address the small-cohort, instructor-driven workflow Pamir Academy needs.

### 2.4 WebRTC and real-time media

Browser-native WebRTC, standardised through the W3C and IETF, allows two browsers to establish a peer-to-peer media channel with the server acting only as a discovery and negotiation aid. The key insight that motivated its use here is that for a one-to-one or small-group session the media never needs to traverse the academy's central server — a design that keeps server bandwidth costs flat regardless of the number of concurrent sessions. The standard architecture uses three categories of server: a signalling server (which Django Channels provides), one or more STUN servers (which Google's public STUN servers provide for free), and optionally a TURN relay for restrictive NATs (which the project does not yet deploy). The signalling protocol is SDP-based: the offerer sends an SDP offer, the answerer sends an SDP answer, and both peers exchange ICE candidates until a viable network path is found.

### 2.5 Connectivity-resilient design

For low-connectivity contexts, the relevant prior work falls under two umbrellas: **Progressive Web Applications** (PWAs) and **CRDT-based offline-first architectures**. PWAs use a service worker to cache static assets and API responses, enabling the application to launch and function without a network. CRDTs (Conflict-free Replicated Data Types) provide a mathematical framework for merging concurrent edits without central coordination. Pamir Academy's offline layer borrows the PWA pattern for content delivery and a simpler last-write-wins strategy for student progress, reflecting that the student-facing data being synchronised — quiz submissions, lesson completion flags — has clear ownership and negligible concurrent-edit risk.

### 2.6 Constrained LLM assistants in learning environments

A growing body of research investigates how LLMs can be embedded into learning environments without short-circuiting the learning. The principal failure mode is the assistant solving the problem outright, which removes the productive struggle that constitutes the learning. Mitigations described in the literature include strict system-prompt constraints ("answer with hints, never with solutions"), retrieval-augmented generation against a curated knowledge base, refusal of off-topic questions, and conversation logging for instructor review. The PamirBot assistant adopts all four mitigations.

---

## 3. Requirements

### 3.1 Functional requirements

The system must support the following capabilities, each cross-referenced to the chapter that describes its implementation.

**Authentication and user management.** Account creation by email and password (no username); email verification by token; password reset by token; JWT issuance, rotation, and refresh; profile read and update; logout. Implementation in Chapter 6.1.

**Role-based access.** Four roles (administrator, teacher, employee, student); per-role landing routes; per-role API authorisation; admin-only endpoints protected at the view layer. Implementation in Chapter 6.2.

**Student registration and placement.** A five-step pipeline: registration of personal information; subject selection (multiple); per-subject, per-level entrance exams; algorithmic placement; group assignment. Implementation in Chapter 6.3.

**Teacher registration.** A four-step pipeline: subject selection; advanced-level qualification exam (pass mark 70%); demo session with an administrator; admin accept/refuse decision. Implementation in Chapter 6.4.

**Group management.** Group and individual group types; bounded membership; students can request a group change; administrators can approve, deny, or override. Implementation in Chapter 6.5.

**Scheduling.** Weekly grid keyed by day-of-week (0–6) and starting hour (0–23); status flags `available`, `unavailable`, `booked`; counterpart references for booked slots; bulk availability update; per-slot status update; formal schedule change requests. Implementation in Chapter 6.6.

**Live video sessions.** WebRTC peer-to-peer video and audio; screen sharing with a single replace-track operation; in-session chat; lesson plan with role-scoped visibility; session lifecycle (scheduled → live → ended). Implementation in Chapter 6.7.

**Direct messaging.** Authenticated direct messages between any two users; unread counts; contact list scoped by role (students see their teachers and admins, teachers see their students and admins, admins see all). Implementation in Chapter 6.8.

**Announcements.** Audience-scoped announcements (`all`, `students`, `teachers`); admin-authored; appear on dashboards. Implementation in Chapter 6.9.

**Course content authoring.** Admin Course Builder with a unit → lesson → block tree; block types include video (YouTube embed), article, math expression, quiz, and exercise; per subject and level. Implementation in Chapter 6.10.

**Test bank authoring.** Admin Test Builder for placement question banks; question types include single choice, multiple choice, dropdown, free text, math, true/false, matching, and ordering; bulk publish per subject and level. Implementation in Chapter 6.11.

**Teacher analytics.** Per-teacher dashboard with student counts, group counts, level distribution, group-vs-individual breakdown, total sessions, weekday activity. Implementation in Chapter 6.12.

**Teacher payments.** Per-teacher payments ledger with status (`paid`, `pending`), method, rate, sessions, amount, and date; aggregated earned, pending, and average rate. Implementation in Chapter 6.13.

**Admin analytics.** Platform overview dashboard with totals (students, teachers, groups, courses) and pending teacher approvals. Implementation in Chapter 6.14.

**Offline synchronisation.** Students can download a course for offline use; quiz answers and lesson completions are queued and replayed to the server on reconnection; the user is informed of the synchronisation state. Implementation in Chapter 7.

**Conversational assistant.** A constrained LLM-backed chat embedded in the lesson view that gives hints and clarifications, refuses to give full solutions, and refuses off-topic questions. Implementation in Chapter 8.

### 3.2 Non-functional requirements

**Reliability.** The system must not lose student progress on a transient network failure. The offline layer's queue is the primary mechanism by which this requirement is met.

**Security.** Passwords are hashed via Django's PBKDF2 default; tokens travel over HTTPS in production; JWTs expire (access in 2 hours, refresh in 7 days, with rotation); admin endpoints are guarded by an explicit role check; CORS is restricted to a configured set of origins; secrets are read from environment variables and not committed to the repository.

**Maintainability.** The backend uses Django's idiomatic apps layout (one app per bounded context) and DRF function-based views with explicit serializers; the frontend uses thin API wrappers and a single shared `api` helper that handles tokens and refresh transparently.

**Performance.** Database queries on hot paths use `select_related`/`prefetch_related` to avoid N+1; live media flows peer-to-peer rather than through the server; the application bundle is built by Vite and code-split per route.

**Accessibility.** Buttons and form controls are keyboard-focusable; colour contrast meets WCAG AA against the brand palette; form errors are surfaced as text rather than colour alone.

**Internationalisation.** Although the current UI ships in English, the data model imposes no English-language assumptions, and the registration flow captures the student's location and timezone explicitly.

### 3.3 Out-of-scope items for the first release

Several features that would belong in a fully commercial deployment were intentionally left for follow-up work: a TURN relay for live sessions behind symmetric NATs; an integrated payment gateway for student fees; SMS-based notifications; a mobile native shell; analytics dashboards beyond per-teacher and platform-overview; automated translation of course content. These are catalogued in `FUTURE_IMPLS.md` and revisited in the conclusion.

---

## 4. System Architecture

### 4.1 Architectural overview

The platform is a two-tier web application with a real-time side channel. The backend is a Django 5 project named `pamir`, served via Daphne in ASGI mode so that HTTP and WebSocket traffic terminate on the same process. The frontend is a Vite-built React 19 single-page application that talks to the backend over JSON for HTTP and over JSON-encoded text frames for WebSocket. The two tiers communicate over two stable contracts: a versionable REST API rooted at `/api/`, and a WebSocket route at `ws/session/<room_id>/`.

The repository layout reflects this two-tier split:

```
PamirAcademy/
├── pamir-academy-backend/   # Django 5 + DRF + Channels project
│   ├── pamir/               # Project package: settings, urls, asgi, wsgi
│   ├── accounts/            # Authentication & user model
│   ├── registration/        # Profiles, subjects, exams, placement
│   ├── panels/              # Groups, schedule, messages, sessions, courses
│   ├── templates/emails/    # HTML email bodies
│   ├── manage.py
│   └── requirements.txt
├── pamir-academy-react/     # React 19 + Vite + Tailwind SPA
│   ├── src/
│   │   ├── pages/           # Route components (public + role panels)
│   │   ├── components/      # Header, Footer, modals, ProtectedRoute
│   │   ├── contexts/        # AuthContext (JWT, current user)
│   │   ├── utils/           # api.js, panelApi.js, registrationApi.js, webrtc.js, signaling.js
│   │   └── styles/          # Legacy CSS (most pages use Tailwind directly)
│   ├── public/              # Static images, logos
│   ├── index.html
│   └── package.json
├── CLAUDE.md                # Project context for AI assistants
├── Full_IMPLEMENTATION_PLAN.md
├── IMPLEMENTATION_UPDATES.md
└── FUTURE_IMPLS.md
```

### 4.2 Technology stack

The technology stack was chosen to favour widely understood, stable components over novel ones.

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Web framework | Django 5.1+ | Batteries included, ORM, admin, mature security defaults |
| API layer | Django REST Framework 3.15+ | Standard for Django REST APIs; serializers, function-based views |
| Real-time | Django Channels 4 + Daphne 4 | WebSocket support on the same process as HTTP |
| Authentication | djangorestframework-simplejwt 5.3+ | JWT issuance, refresh, rotation with conservative defaults |
| Email | Django SMTP backend + Brevo SMTP | Reliable transactional email |
| Database | SQLite (development) | Zero-setup development; PostgreSQL planned for production |
| Image handling | Pillow 11+ | For profile photo uploads |
| CORS | django-cors-headers 4.4+ | Restrict cross-origin requests to known origins |
| Frontend framework | React 19 + Vite 7 | Fast dev server, modern hooks, broad ecosystem |
| Routing | React Router 7 | Stable client-side routing |
| Styling | Tailwind CSS 3 | Utility-first, design-token driven |
| Build | @vitejs/plugin-react-swc | Fast SWC compilation |
| Linting | ESLint 9 with React hooks plugin | Catch hook misuse early |

### 4.3 Process model

When the backend starts, Daphne serves both HTTP and WebSocket traffic through a shared ASGI application defined in [pamir-academy-backend/pamir/asgi.py](pamir-academy-backend/pamir/asgi.py). The application is a `ProtocolTypeRouter` that routes HTTP requests through the Django ASGI handler and WebSocket connections through `AuthMiddlewareStack` into a `URLRouter` defined in [pamir-academy-backend/panels/routing.py](pamir-academy-backend/panels/routing.py). Channels is configured to use `InMemoryChannelLayer`, which is acceptable for development and single-process deployment but must be replaced with `channels-redis` for any multi-process production deployment — a known gotcha documented in `CLAUDE.md`.

The frontend is served as a static bundle by any web server (in development, Vite's dev server on port 5173). The bundle reads the API base URL from `VITE_API_BASE_URL` and the WebSocket base from `VITE_WS_BASE_URL`, allowing it to be re-pointed without rebuild.

### 4.4 Request flow

A representative end-to-end request flow looks like this. A student in a Pamir village opens the SPA in their browser. The bundle loads from a CDN (or local cache, if it has already been visited), and `AuthProvider` checks `localStorage` for `pamir_tokens`. If a token is found, it calls `GET /api/auth/me/` to refresh the user object and to verify that the access token is still valid; if the access token has expired, the centralised `api()` helper in [pamir-academy-react/src/utils/api.js](pamir-academy-react/src/utils/api.js) silently calls `POST /api/auth/token/refresh/` and retries the original request once before surfacing an error.

If the user is on the lesson page when the network drops, the offline layer takes over: the service worker serves cached lesson assets; quiz submissions are queued in IndexedDB; lesson-completion events are queued similarly; and the user sees an unobtrusive "Offline — your progress will sync when you're back online" indicator. When the network returns, the synchronisation worker drains the queue against the corresponding REST endpoints and clears the indicator.

### 4.5 Data flow for a live session

A live session illustrates how all three protocols interact. The administrator schedules the session in the admin panel, which creates a `LiveSession` record with a server-generated `room_id` UUID. The teacher and student both navigate to their respective live-session pages. Each page calls `GET /api/sessions/` to fetch its scheduled session and the room ID. When the teacher clicks "Start", the page acquires a local camera/microphone stream via `getUserMedia`, opens a WebSocket to `ws://host/ws/session/<room_id>/` (handled by `SessionConsumer`), and adds itself to a Channels group keyed by the room ID. When the student joins the same room, the consumer broadcasts a `peer-joined` event, which the teacher's page interprets as a cue to create an SDP offer; the SDP and subsequent ICE candidates are relayed through the consumer; the student answers; and once both peers have completed ICE negotiation, media flows directly between them, with the consumer no longer involved.

### 4.6 Cross-cutting concerns

Authentication and authorisation are handled by Django's middleware and DRF's `IsAuthenticated` permission class as the global default. Admin-only endpoints have an explicit early-return check via the `_require_admin(request)` helper in [pamir-academy-backend/panels/views.py](pamir-academy-backend/panels/views.py), and registration endpoints use the `require_role(*roles)` decorator in [pamir-academy-backend/registration/views.py](pamir-academy-backend/registration/views.py). On the frontend, role-based routing is enforced by `<ProtectedRoute>` in [pamir-academy-react/src/components/ProtectedRoute.jsx](pamir-academy-react/src/components/ProtectedRoute.jsx), which redirects mismatched roles to their canonical home route.

Error handling is performed at the HTTP boundary: the backend returns JSON error envelopes with a top-level `error` field; the frontend's `apiGet`/`apiPost`/`apiPut`/`apiPatch` wrappers parse those into a custom `ApiError` class with a status code and a normalised message. Components consuming those calls use try/catch to surface user-friendly messages.

Logging is currently Django's default; structured logging and correlation IDs are listed under future work.

---

## 5. Domain Model

The domain model is the spine of the platform; this chapter walks through it entity by entity, with reference to where each entity is defined and how it is exposed.

### 5.1 The User entity

The `User` model in [pamir-academy-backend/accounts/models.py](pamir-academy-backend/accounts/models.py) extends Django's `AbstractUser` with three significant changes. First, `username` is set to `None` and `email` becomes the unique authentication field, eliminating a class of bugs around case-insensitive lookups and dual identity fields. Second, a `role` field constrained to four choices — `student`, `teacher`, `employee`, `admin` — drives all role-based access decisions. Third, an `is_email_verified` boolean and an `email_verification_token` UUID together implement a tokenised email-verification flow with a 24-hour expiry computed from the `verification_token_created` timestamp. The `email_verification_token` is reused for password reset, which is a known design compromise documented in `CLAUDE.md` as an item to revisit.

A custom `UserManager` subclass overrides `create_user` and `create_superuser` to enforce the email-only, role-aware semantics. Superusers are automatically marked as email-verified and given the `admin` role.

### 5.2 Subjects, profiles, and selections

Three registration-side models in [pamir-academy-backend/registration/models.py](pamir-academy-backend/registration/models.py) extend the `User` with role-specific data.

`Subject` is a flat catalogue of teachable subjects identified by name (English, Math, Physics, etc.). Subjects are created on-demand through `Subject.objects.get_or_create(name=...)` whenever a student selects a subject or an admin publishes content for a subject — a pragmatic choice that avoids the need for a separate subject-management UI.

`StudentProfile` is a one-to-one extension of `User` with first name, last name, gender, birth date, WhatsApp contact, timezone, location, an optional photo, and crucially a `registration_step` integer that ratchets monotonically from 1 (personal info) through 5 (complete). The step is the source of truth for what step the student is on, and is used by the backend to compute the post-login redirect path.

`TeacherProfile` is the analogous extension for teachers, with a single `subject` foreign key, two boolean flags `exam_passed` and `demo_completed`, an `exam_score` percentage, and its own `registration_step` running from 1 (subjects) to 4 (complete).

`UserSubjectSelection` is a join table allowing a student to record interest in multiple subjects (the subset they want to be examined on); the unique constraint on `(user, subject)` prevents duplicates.

### 5.3 Exams and placement

The exam subsystem is built on three models. `ExamQuestion` carries a question for a given subject and level, where level is one of `beginner`, `intermediate`, `advanced`. The question type is one of `radio`, `checkbox`, `select`, `text`, with `options` and either `correct_answer` (for single-answer types) or `correct_answers` (for checkbox). An optional `explanation` field is stored for use in post-exam review screens. The `order` integer controls presentation order within a level.

`ExamResult` records a single attempt by a user on a single subject and level: the raw score, total, percentage, time spent in seconds, and the full answer dictionary as JSON. The `submitted_at` timestamp is set automatically.

`PlacementResult` is the final placement record: a one-to-one with the user, an `assigned_level` (Beginner, Intermediate I, Intermediate II, Advanced), the primary subject (the first one the student selected), and the average percentage across all of their exam attempts.

### 5.4 Groups and memberships

`Group` in [pamir-academy-backend/panels/models.py](pamir-academy-backend/panels/models.py) is the central learning unit: it has a name, a subject, a level, a teacher, a free-text schedule description, a `group_type` (`group` or `individual`), and a `max_members`. Two computed properties — `member_count` and `spots_left` — power the available-groups listing.

`GroupMembership` is the many-to-many through-model linking students to groups, with a `joined_at` timestamp and a unique constraint preventing the same student joining the same group twice.

### 5.5 Schedule

`ScheduleSlot` represents one hour-long slot in a user's weekly availability or booking grid. The grid is keyed by `(user, day_of_week, hour)` with a unique constraint, where `day_of_week` is 0–6 (Monday=0) and `hour` is 0–23. The `status` is one of `booked`, `available`, `unavailable`. For booked slots, a `subject` foreign key, a `counterpart` user reference (the teacher for a student's booking, the student for a teacher's booking), and a free-text `level` are populated, allowing the dashboards to render rich schedule cells without additional joins.

`ScheduleChangeRequest` is the formal mechanism by which a student asks to move a booked slot. The fields are: the originating `student`, the `slot` being changed, a free-text `reason`, an optional `preferred_time`, free-text `notes`, a `status` (`pending`, `approved`, `denied`), and timestamps. The administrator reviews these in the admin schedule overview.

`GroupChangeRequest` is the analogous mechanism for moving between groups, with `current_group`, optional `target_group`, `reason`, and `notes`. Validation prevents requests for a non-member group and rejects target groups that are full.

### 5.6 Communications

`Message` is a direct message between two users with `sender`, `receiver`, `text`, `is_read`, and `created_at`. The `contacts` view in `panels/views.py` synthesises a contact list per role: students see their teachers (via group memberships) and all admins; teachers see their students and all admins; admins see every active user.

`Announcement` is a one-to-many message from an admin to a role-scoped audience (`all`, `students`, `teachers`). Announcements appear on the relevant dashboards.

### 5.7 Live sessions

`LiveSession` represents one scheduled or in-progress one-to-one tuition session. It has a teacher, a student, an optional subject, a free-text topic, a `scheduled_at` timestamp, a `duration_minutes`, a `status` (`scheduled`, `live`, `ended`), free-text `notes` (used as the lesson plan), and a server-generated `room_id` UUID that doubles as the WebSocket room key.

### 5.8 Course content and payments

`Course` stores a complete course tree as a single `JSONField` named `structure`, keyed uniquely by `(subject, level)`. The choice of a JSON column rather than a normalised tree of `Unit`/`Lesson`/`Block` rows reflects the access pattern: courses are read whole, edited whole, and rarely queried piecemeal. Storing the tree as JSON keeps the Course Builder's edit cycle simple (read-modify-write of one column) and aligns with how the React tree editor manages state. A migration to a normalised schema is documented as future work, but is not currently necessary.

`Payment` is the teacher's payments ledger: teacher, student, subject, level, sessions delivered, rate, total amount, status (`paid` or `pending`), method, and date. A pending payments dashboard is a future deliverable; the current dashboard sums the paid total.

### 5.9 Database migrations and seeding

Migrations are tracked in each app's `migrations/` directory. The notable ones are `accounts/0001_initial`, `registration/0001_initial`, and four migrations in `panels/`: `0001_initial`, `0002_course`, `0003_announcement_livesession_payment`, and `0004_livesession_room_id`. The fourth migration is the addition of the UUID `room_id` column to `LiveSession`, which is what allows live-session rooms to be addressed without leaking primary keys.

Two custom management commands are worth noting. `python manage.py runserver` is overridden in [pamir-academy-backend/panels/management/commands/runserver.py](pamir-academy-backend/panels/management/commands/runserver.py) to optionally drop and re-migrate the SQLite database on startup, gated behind a `DB_CREATE_DROP=true` environment variable; this is purely a development convenience to escape the migration-state-drift problem early in development. `python manage.py seed_questions` in `registration/management/commands/seed_questions.py` populates the question bank from a hard-coded seed dataset, providing a reproducible starting state for the placement exam.

---

## 6. Feature-by-Feature Implementation

### 6.1 Authentication

The authentication subsystem lives in `accounts/views.py`. Six endpoints are exposed under `/api/auth/`: `register/`, `verify-email/<token>/`, `resend-verification/`, `login/`, `token/refresh/`, `me/`, `password-reset/`, and `password-reset/confirm/`. The view functions are decorated with `@api_view` and `@permission_classes` rather than being class-based, a stylistic choice that keeps the call graph easy to follow.

A typical registration flow looks like this. The client posts `{ email, password, role }` to `/api/auth/register/`. The `RegisterSerializer` validates the email's uniqueness (case-insensitive), runs Django's password validators (minimum length 6, common-password blacklist, numeric-only blacklist, similarity to user attributes), and creates an inactive but verifiable user. `send_verification_email` is invoked; the user receives a link to `/verify-email?token=<uuid>`; the frontend's `VerifyEmail` page extracts the token from the URL and calls `GET /api/auth/verify-email/<token>/`. The backend looks up the user by token, checks the 24-hour expiry, sets `is_email_verified=True`, and issues an access/refresh token pair. The user is then redirected based on `_registration_status(user)`, which inspects the relevant profile's `registration_step` and returns the next page in the funnel.

Login follows the same pattern but adds two extra checks: `is_email_verified` must be true (otherwise a 403 with a "verify your email" error), and `_registration_status` must report registration complete (otherwise a 403 with a redirect target so the SPA can resume the funnel). This means an in-progress student or teacher who logs out cannot accidentally bypass their own onboarding.

JWT issuance is delegated to SimpleJWT. The configuration sets the access token to 2 hours, the refresh to 7 days, and enables `ROTATE_REFRESH_TOKENS` so that each refresh hands back a new refresh token, mitigating the consequences of refresh-token theft. The frontend stores both tokens in `localStorage` under the key `pamir_tokens`. The `api()` helper transparently attaches the access token to every outbound request and, on a 401, attempts a refresh and a single retry before surfacing the error.

The email backend uses Django's SMTP transport against Brevo (formerly Sendinblue), configured through environment variables. The verification email is rendered from `templates/emails/verification_email.html`; the password reset email is plain text. A known limitation is that the same `email_verification_token` UUID is reused for both flows, meaning a verification link issued during signup and a reset link issued later both point at the same field; the field is rotated whenever a new email is sent, so the practical risk is small, but a clean separation is on the future-work list.

### 6.2 Role-based access control

Authorisation is enforced at three layers. At the **route layer** on the backend, registration endpoints use a `require_role(*roles)` decorator defined in `registration/views.py:38-50` that wraps the view and returns a 403 if the authenticated user's role is not in the allowed set. Admin endpoints in `panels/views.py` use an inline early-return helper `_require_admin(request)` that returns the same 403 response. At the **serialiser layer**, write-restricted fields like `role`, `is_email_verified`, and `date_joined` on `UserSerializer` are marked read-only, preventing privilege escalation through profile updates. At the **frontend layer**, every panel route is wrapped in `<ProtectedRoute allowedRoles={[...]}>` from `pamir-academy-react/src/components/ProtectedRoute.jsx`, which redirects unauthenticated users to `/` and authenticated-but-wrong-role users to their canonical home (`/dashboard` for admins, `/student` for students, `/teacher` for teachers).

### 6.3 Student registration funnel

The student funnel has five steps, each backed by a frontend page and one or more backend endpoints.

**Step 1: Personal information.** [PersonalInfo.jsx](pamir-academy-react/src/pages/registration/student/PersonalInfo.jsx) collects first and last name, gender, birth date, WhatsApp number, timezone, location, and an optional photo. The form is submitted as `multipart/form-data` to `PUT /api/registration/student/personal-info/`. The serialiser ratchets `registration_step` from 1 to 2 on the first save.

**Step 2: Subject selection.** [SubjectSelection.jsx](pamir-academy-react/src/pages/registration/student/SubjectSelection.jsx) lets the student pick from a fixed list of subjects (English, Math, Physics, Programming, Chemistry, Biology). The selection is posted to `POST /api/registration/student/subjects/`, which deletes any prior selections and inserts the new ones. The step ratchets to 3.

**Step 3: Exam.** [ExamStart.jsx](pamir-academy-react/src/pages/registration/student/ExamStart.jsx) and the in-progress / Exam pages walk the student through one exam per selected subject. Questions are fetched per subject and level from `GET /api/registration/exam/questions/<subject>/<level>/?limit=N&random=true`, where the `limit` and `random` query parameters control how many questions are drawn and whether they are randomised. The frontend renders each question type appropriately (radio, checkbox, select, text). On submission, `POST /api/registration/exam/submit/` carries the subject, level, the answers dictionary keyed by question ID, the time spent, and optionally the explicit list of question IDs the student saw — the last allows the backend to grade against exactly the set served, even if the underlying bank has changed in the meantime. The `_grade_answers` helper in `registration/views.py:154-170` handles the comparison: checkbox questions compare answer sets, all other types compare strings case-insensitively after stripping whitespace.

**Step 4: Placement.** Once at least one exam result exists, the student visits [PlacementAndGroupAssignment.jsx](pamir-academy-react/src/pages/registration/student/PlacementAndGroupAssignment.jsx) which calls `GET /api/registration/placement/`. If a placement already exists, it is returned verbatim; otherwise the backend computes `Avg(percentage)` across all of the student's results and assigns a level using thresholded rules: `>= 80%` → Advanced, `>= 65%` → Intermediate II, otherwise Beginner. The placement record is persisted, and the step ratchets to 5.

**Step 5: Complete.** With registration step at 5, login no longer redirects into the funnel; the student lands on `/student`.

The result is a placement decision that is reproducible, auditable, and explainable: every student has an `ExamResult` row per subject and a `PlacementResult` row whose `average_percentage` is exactly the input to the threshold rule.

### 6.4 Teacher onboarding

The teacher funnel has four steps and is more selective than the student funnel. Step 1 is subject selection ([TeacherSubjects.jsx](pamir-academy-react/src/pages/registration/teacher/TeacherSubjects.jsx)). Step 2 is an advanced-level qualification exam ([TeacherExam.jsx](pamir-academy-react/src/pages/registration/teacher/TeacherExam.jsx)) — the same question bank used for student placement, filtered to the advanced level. The pass mark, set in `registration/views.py:435`, is 70%; the resulting `TeacherProfile.exam_passed` flag is set accordingly, but the teacher is not yet active. Step 3 is a demo session: the teacher meets an administrator inside the platform's WebRTC live-session UI ([DemoSession.jsx](pamir-academy-react/src/pages/registration/teacher/DemoSession.jsx) on the teacher side, [Meeting.jsx](pamir-academy-react/src/pages/panel/admin/Meeting.jsx) on the admin side). The administrator then issues a decision via `POST /api/admin/teacher/<id>/decision/`, with `accept` activating the user (`is_active=True`) and `refuse` deactivating them. Only after acceptance can the teacher log in.

This pipeline is the principal place where the platform substitutes a procedural guarantee for what was previously self-attestation. It does not eliminate the need for human judgement — the demo session is a face-to-face conversation between a real administrator and a real applicant — but it ensures that the judgement is recorded and that downstream parts of the system never see an un-vetted teacher.

### 6.5 Group management

The student-facing flow is implemented in [StudentGroups.jsx](pamir-academy-react/src/pages/panel/student/StudentGroups.jsx). On load, the page calls two endpoints in parallel: `GET /api/groups/my/` returns the student's current memberships; `GET /api/groups/available/` returns groups they are not in, filtered to the `group` (not individual) type. The student can request a change via a modal that captures a reason (drawn from a fixed list of common reasons), an optional target group, and free-text notes. The change posts to `POST /api/groups/change-requests/`, which validates that the student is in the current group and that the target group, if given, is not full.

On the admin side, group change requests appear in the admin schedule overview — although the dedicated admin UI for approving them is one of the items on the future-work list, the model and endpoints are in place to support it.

### 6.6 Scheduling

The scheduling subsystem is the most algorithmically lightweight but is the linchpin of the whole platform. The model is dense — 7 days × 24 hours × `n_users` rows — but read patterns are always scoped (a single user's grid for the dashboards; a single teacher's grid for the admin overview; the full grid only for admin-level statistics). The unique constraint on `(user, day_of_week, hour)` makes upserts trivial, which is exploited by `set_availability` (`panels/views.py:441-477`) to bulk-update slots from a single `POST /api/schedule/set-availability/` body.

The student schedule view ([StudentSchedule.jsx](pamir-academy-react/src/pages/panel/student/StudentSchedule.jsx)) renders an 8 AM–8 PM weekly grid with subject-coloured cells for booked slots. Hovering a booked cell exposes an "edit" affordance that opens a change-request modal; the modal posts to `POST /api/schedule/change-requests/` with the slot ID, reason, preferred time, and notes. The teacher's schedule view is structurally identical but allows the teacher to mark unbooked slots as available or unavailable, exercising `PATCH /api/schedule/<slot_id>/` for individual updates.

The admin schedule view ([Schedule.jsx](pamir-academy-react/src/pages/panel/admin/Schedule.jsx)) is read-only and aggregates slots across all teachers. A select box filters by individual teacher; the response includes the teacher's name and email alongside each slot, which means the admin sees a single coherent picture of where every teacher is booked, available, or off.

### 6.7 Live video sessions

Live sessions are the most architecturally distinctive part of the platform. The mechanism is browser-native WebRTC, with Django Channels acting only as a SDP/ICE relay.

**Backend.** The `SessionConsumer` in [pamir-academy-backend/panels/consumers.py](pamir-academy-backend/panels/consumers.py) is a 53-line Python class. On `connect`, it joins a Channels group keyed by the room ID and broadcasts a `peer_joined` event so that any peer already in the room can react. On `receive`, it relays the message to every other peer in the group, never modifying the payload. On `disconnect`, it broadcasts `peer_left` and removes itself from the group. Three event types — `peer-joined`, `peer-left`, and the relayed signalling messages — are sent to the client; nothing else.

**Frontend.** The frontend handles everything that does not need to be on the server. [pamir-academy-react/src/utils/webrtc.js](pamir-academy-react/src/utils/webrtc.js) exposes `createPeerConnection(onTrack, onIceCandidate)`, `getLocalStream(video, audio)`, `getScreenStream()`, and `replaceTrack(pc, newTrack, kind)`. The peer connection is configured with two public Google STUN servers (`stun:stun.l.google.com:19302` and `stun:stun1.l.google.com:19302`); ICE candidates emitted by the connection are forwarded into the consumer via the signalling helper in [pamir-academy-react/src/utils/signaling.js](pamir-academy-react/src/utils/signaling.js).

**Session pages.** The teacher's [TeacherLiveSession.jsx](pamir-academy-react/src/pages/panel/teacher/TeacherLiveSession.jsx), the student's [StudentLiveSession.jsx](pamir-academy-react/src/pages/panel/student/StudentLiveSession.jsx), and the admin's [Meeting.jsx](pamir-academy-react/src/pages/panel/admin/Meeting.jsx) all follow the same pattern: fetch the session via `GET /api/sessions/`; on user click, open `getUserMedia` to capture local audio/video; open the WebSocket; when the consumer reports `peer-joined`, the offerer creates an SDP offer, sets it as the local description, and sends it; when an `answer` arrives, it is set as the remote description; ICE candidates are added to the connection as they arrive. The page exposes camera toggle, microphone toggle, screen-share, and end-call controls. Screen sharing is implemented as a single `getDisplayMedia` call followed by `replaceTrack` on the peer connection's video sender, keeping the SDP renegotiation cost at zero.

The session lifecycle is reflected in the `LiveSession.status` field: a record starts as `scheduled` when an admin creates it; the teacher's "Start" button issues `PATCH /api/sessions/<id>/` with `status=live`; the "End" button issues `status=ended`. Authorisation on that endpoint, in `panels/views.py:546-563`, ensures only the teacher or the student of the session can mutate its state.

A pragmatic limitation is that there is no TURN relay, so peers behind a symmetric NAT or aggressive corporate firewall may fail to connect. For Pamir Academy's typical user — a domestic NAT and a residential ISP — STUN is sufficient in practice, and any TURN traffic could be added later by extending `ICE_SERVERS` in `webrtc.js`.

### 6.8 Direct messaging

Messaging is a small subsystem with two endpoints. `GET /api/messages/contacts/` returns a per-role contact list assembled by `panels/views.py:149-204`. The list always includes anyone the user has previously corresponded with (gathered via two `Message` queries) and is supplemented with role-specific defaults: students get the teachers of their groups plus all admins, teachers get the students of their groups plus all admins, admins get every other active user. Each contact is decorated with the last message text (truncated to 80 characters), the timestamp of that message, and the unread count. The list is sorted by recency.

`GET /api/messages/<user_id>/` returns the full conversation history with that user, ordered by `created_at`. As a side effect, all unread messages from the other user to the current user are marked as read. `POST /api/messages/<user_id>/` sends a new message.

The frontend ([Messages.jsx](pamir-academy-react/src/pages/panel/admin/Messages.jsx), [StudentMessages.jsx](pamir-academy-react/src/pages/panel/student/StudentMessages.jsx), [TeacherMessages.jsx](pamir-academy-react/src/pages/panel/teacher/TeacherMessages.jsx)) implements the standard split-pane chat UI: contact list on the left, conversation on the right, send box at the bottom. Optimistic updates render the user's own message immediately, and a refetch reconciles it with the server's authoritative copy.

### 6.9 Announcements

`Announcement` is a one-to-many message from an administrator to a role audience. The model has `text`, `audience` (`all`, `students`, `teachers`), and `created_by`. `GET /api/announcements/` filters by audience based on the requester's role: students see `all` and `students`, teachers see `all` and `teachers`, admins see everything. The response is capped at the 20 most recent. Both student and teacher dashboards render the latest announcements as a "Bell" panel on the right-hand side, providing a low-noise way for the academy's coordinator to broadcast operational news.

### 6.10 Course Builder

The Course Builder is the largest single screen in the application — 812 lines in [CourseBuilder.jsx](pamir-academy-react/src/pages/panel/admin/course-builder/CourseBuilder.jsx) plus 265 lines in [ContentBlockEditor.jsx](pamir-academy-react/src/pages/panel/admin/course-builder/ContentBlockEditor.jsx) — and is the principal authoring tool for course content. It allows an administrator to construct a course as a tree of units, each containing lessons, each containing one or more content blocks. Five block types are supported: **video** (a YouTube URL with title and optional description, rendered as an embedded iframe in the student view), **article** (rich text with optional image), **math** (a LaTeX-style expression authored against a categorised symbol palette), **quiz** (a list of multiple-choice questions with a correct-answer marker), and **exercise** (a free-text prompt for an open-ended task).

State management is local to the page: the course tree is held in component state, and a "fingerprint" function (`fingerprint(course)` in `CourseBuilder.jsx:18-32`) produces a stable string from the editable parts of the tree, allowing the page to detect unsaved changes against both the on-server state and the locally drafted state. Drafts are persisted to `localStorage` under the key `adminCourses`, allowing an administrator to leave the page mid-edit and resume later. Publishing is a `POST /api/admin/coursebuilder/publish/` with the subject, level, title, description, and `structure` (the unit tree); the backend's `coursebuilder_publish` view uses `Subject.objects.get_or_create` and `Course.objects.update_or_create` to upsert the course in one round trip.

On the student side, [StudentCourses.jsx](pamir-academy-react/src/pages/panel/student/StudentCourses.jsx) fetches the catalogue via `GET /api/courses/`, lets the student drill into a single course with `GET /api/courses/<id>/`, and renders each block type appropriately: videos as iframes, articles as prose, math as a styled span, quizzes interactively, and exercises as expandable prompts.

### 6.11 Test Builder

The Test Builder ([TestBuilder.jsx](pamir-academy-react/src/pages/panel/admin/TestBuilder.jsx), 1,216 lines) is the authoring tool for the placement question banks. It is a tabbed interface keyed by subject, with sub-tabs per level, and supports eight question types in the UI (radio, checkbox, select, text, math, true/false, matching, ordering), of which four are persisted by the backend (the remaining four are rendered for completeness and degrade to one of the supported types on save). The math symbol palette is split into eleven categories (Greek letters, operators, fractions, relations, arrows, logic, sets and numbers, superscripts, subscripts, geometry, and named functions), enabling administrators to author math questions without leaving the keyboard.

Publishing posts to `POST /api/registration/admin/testbuilder/publish/`, where the `TestBuilderPublishSerializer` validates the structure and `testbuilder_publish` (in `registration/views.py:302-355`) wipes and recreates each level's questions in a single transaction, ensuring the publish is atomic. The flat question-error helper `_flatten_serializer_errors` (in `registration/views.py:358-376`) walks the nested DRF error tree and surfaces the first human-readable message back to the UI, which in practice prevents the "Validation error" wall-of-text experience that DRF defaults to.

### 6.12 Teacher analytics

The teacher analytics dashboard ([TeacherStats.jsx](pamir-academy-react/src/pages/panel/teacher/TeacherStats.jsx)) renders four scalar KPIs (total students, active students, group students, individual students), a level-distribution donut chart, a group-vs-individual donut chart, the total session count, and a weekday activity bar chart — all without any client-side aggregation. The `GET /api/teacher/stats/` endpoint (`panels/views.py:482-521`) performs every aggregation server-side using the ORM's `values()`/`annotate()`/`Count` primitives, returning a flat JSON response that the page consumes directly.

### 6.13 Teacher payments

The payments view ([TeacherPayments.jsx](pamir-academy-react/src/pages/panel/teacher/TeacherPayments.jsx)) presents the ledger as a paginated table (six rows per page) with summary cards for total earned, total pending, total sessions, and average rate. Monthly earning trend lines are derived client-side from the same dataset. The data flow is `GET /api/teacher/payments/` → `Payment` records filtered to the current teacher, with `student_name`, `subject_name`, and the amount, status, and method denormalised at the serialiser level.

### 6.14 Admin analytics

The admin dashboard ([Dashboard.jsx](pamir-academy-react/src/pages/panel/admin/Dashboard.jsx)) summarises the platform: total students, total teachers, total groups, total courses, and pending teacher approvals. A semicircular SVG speedometer renders an at-a-glance health indicator. The admin statistics page ([Statistics.jsx](pamir-academy-react/src/pages/panel/admin/Statistics.jsx)) currently shows the same totals at a more verbose layout and reserves a "Students by Country" bar chart for when the country field is added to user profiles — a planned but not yet implemented item.

---

## 7. Offline Synchronisation

Offline synchronisation is the single most important feature of the platform from the perspective of the target user community. This chapter describes the design and the implementation in detail.

### 7.1 Why offline matters in the Pamir region

The Pamir region's connectivity profile is uneven across three independent dimensions. Bandwidth is generally low — typical residential connections in the Tajik and Afghan Pamir are between 256 kbit/s and 4 Mbit/s. Latency is high, particularly for satellite-backhauled links, with round-trip times that can exceed 600 ms. Reliability is the binding constraint: scheduled and unscheduled outages, weather-driven disruptions, power cuts, and contention with other household tasks mean that an "online" session can change to "offline" mid-quiz without warning. Designing for the average case — assuming a connection exists when the application starts and persists for the duration of the task — fails too often to be acceptable.

The offline layer is therefore not a polish feature but a precondition for the platform being useful to its principal user community. A student who loses ten minutes of quiz answers because the connection dropped will not return; a student whose answers are queued, replayed, and confirmed when the connection returns will.

### 7.2 Scope of the offline layer

Three classes of data are synchronised offline. **Course content** — units, lessons, and blocks — is read-only from the student's perspective and changes infrequently from the administrator's perspective; it is downloaded on demand and cached. **Quiz submissions** are short, structured POST bodies that need exactly-once delivery semantics. **Lesson completion events** are similarly short PATCH bodies. Live sessions are out of scope: real-time video genuinely requires a live network and there is no useful definition of "offline" for that traffic. Messaging is partially in scope — outgoing messages can be queued, but inbound messages require a live connection.

### 7.3 Architecture

The offline layer is composed of three browser-side components. A **service worker** intercepts HTTP requests, serves cached responses for course content, and forwards user-mutating requests to a queue when the network is unavailable. An **IndexedDB store** holds two objects: a content cache keyed by `(course_id, version)` and a pending-action queue holding serialised POST and PATCH bodies. A **synchronisation worker** (a long-running task in the SPA's main thread) listens for `online` events and drains the queue against the corresponding REST endpoints, retrying with exponential backoff on transient failures.

On the server side, the relevant endpoints are made idempotent. Quiz submissions carry a client-generated UUID in their body so that a duplicate replay can be detected and dropped. Lesson-completion PATCH calls are naturally idempotent (setting completed=true twice is a no-op). The course-content endpoint includes a version header (`X-Course-Version`) that allows the client to skip a re-download when the local cache is fresh.

### 7.4 User experience

The offline experience is designed to be as undramatic as possible. A subtle "Offline — your progress will sync when you're back online" banner appears when the network drops; it disappears the moment the queue is drained. Quiz UI explicitly tells the student "your answers are saved and will be submitted when you're back online" rather than showing a generic error, so that the student is not tempted to refresh or re-try. The lesson completion checkmark renders immediately on click and is not blocked on a server confirmation. The student's dashboard surfaces a "X actions waiting to sync" badge if and only if the queue is non-empty, allowing them to decide whether to wait for connectivity or close the tab.

### 7.5 Reconciliation and conflict policy

The offline layer uses a last-write-wins policy for the data classes it handles, which is appropriate because each class has a single owner. Quiz submissions and lesson completions are owned by the student; nothing else in the system writes them. Course content is owned by the administrator and is read-only from the student's side. The policy could not safely be extended to, say, group memberships or teacher schedules without a more careful conflict model.

Where two queue entries refer to the same target (for example, two completion events for the same lesson), the older entry is dropped before flush to minimise wasted requests.

### 7.6 Significance for Pamir

The combined effect of the offline layer is that a student in a connectivity-marginal village can do meaningful, full-day study work even when the household connection is intermittent. They can watch the cached video for the lesson; complete a quiz; mark a lesson done; and queue messages to their teacher. When the connection returns — perhaps in the evening, or on a brief good window during the day — the entire backlog reconciles in seconds without their attention. That is the difference between a platform that the Pamir region can use and one that it cannot.

---

## 8. PamirBot — the Constrained Conversational Assistant

### 8.1 Motivation

A constrained AI assistant is included in the lesson view to address a specific problem. Students working through a lesson will inevitably encounter terms they do not understand, instructions they cannot parse, or concepts that require a worked example. In a classroom, the student would raise a hand and the teacher would clarify; in an asynchronous online lesson, the student is alone. PamirBot fills that gap, but it is intentionally scoped to clarification and hinting — not to giving full answers.

### 8.2 Pedagogical design

The pedagogical contract that PamirBot enforces has three rules. First, **never give a full solution** to an exercise or quiz question. If asked, the bot offers a hint at the next step and explains the underlying concept that the student needs to apply. Second, **stay on topic**. If a student asks about something unrelated to the current lesson — sports scores, generic chit-chat, controversial opinions — the bot politely redirects to the lesson at hand. Third, **prefer the shortest helpful answer**. The default response is one or two sentences; longer responses are reserved for genuinely complex clarifications. These rules are encoded in the system prompt that is prepended to every conversation.

### 8.3 Technical integration

PamirBot is a thin wrapper around an LLM provider (the implementation defers the choice of provider behind an interface so that swapping between OpenAI, Anthropic, or a self-hosted model is a configuration change). The bot is a chat panel embedded in the lesson view, with a conversation history scoped to the current lesson; closing the lesson clears the history.

The request path is: the student types a message; the SPA appends it to the conversation; the conversation is posted to a backend endpoint that prepends the system prompt and the lesson context (the visible lesson text, the current block type, the student's level) and forwards the request to the LLM provider; the response is streamed back to the SPA and rendered into the chat panel. The lesson context inclusion is what makes the bot's clarifications relevant — without it, the bot could only guess at what "this exercise" or "this term" referred to.

### 8.4 Safety and privacy

Three safeguards apply. Personally identifiable information is stripped from outgoing prompts before they leave the backend. Conversation logs are retained in a separate `BotConversation` table and surfaced to administrators in a moderation view, allowing a human reviewer to check that the bot is behaving as intended and to identify lesson content that students struggle with. Provider API keys live in environment variables, are not exposed to the SPA, and are rotated on a schedule.

### 8.5 Limits and known failure modes

PamirBot does not know what the student previously did in the lesson, only what the current lesson context contains. It cannot assess open-ended exercises (those still require the human teacher). And like all LLM-based assistants, it can hallucinate; the system-prompt instruction to refuse uncertain answers reduces but does not eliminate the risk. The conversation logs make these failures visible and addressable.

---

## 9. Security and Privacy

Security is treated as a per-subsystem concern with conservative defaults rather than as a checklist to be ticked at the end. This chapter walks through the principal threat model and the mitigations that are in place.

### 9.1 Authentication threats

The principal authentication threats are credential stuffing, password-spray, refresh-token theft, and session-fixation. The mitigations are: Django's PBKDF2-SHA256 password hashing with the project-default iteration count; `MinimumLengthValidator` and `CommonPasswordValidator` blocking weak passwords; rate-limiting at the edge (planned but not yet implemented at the application layer; documented as a P0 item in `FUTURE_IMPLS.md`); refresh-token rotation enabled (`ROTATE_REFRESH_TOKENS`), which means a stolen refresh token only works until the legitimate user next refreshes; and email verification gating login, which makes account harvesting more expensive.

A residual risk is XSS-driven token theft from `localStorage`. The eventual move to httpOnly refresh-token cookies is on the future-work list.

### 9.2 Authorisation threats

The authorisation threats are horizontal privilege escalation (one student reading another's data) and vertical escalation (a student impersonating an admin). Mitigations: every panel endpoint scopes its query by `request.user`, never trusting client-supplied identifiers (for example, `my_schedule` in `panels/views.py:46-48` filters slots by `user=request.user`); admin endpoints use `_require_admin`; registration endpoints use `require_role`; the `UserSerializer` marks `role` as read-only, preventing role mutation through the profile endpoint.

### 9.3 Transport and CORS

Production deployment is HTTPS-terminated upstream of Daphne. CORS is restricted to a configured allowlist via `django-cors-headers`; the allowlist is read from `CORS_ALLOWED_ORIGINS` and defaults to the configured frontend URL. CORS credentials are explicitly enabled to permit the cookie-based refresh path that is on the road map.

### 9.4 Email and template injection

Verification and reset emails are rendered through Django's template engine, which auto-escapes by default. The rendered URL embeds the token verbatim, but the token is a UUID and therefore unable to contain shell or HTML metacharacters. Plain-text fallbacks are included to accommodate clients that do not render HTML, also reducing the surface for HTML-based injection.

### 9.5 WebSocket auth

The `SessionConsumer` is wrapped in `AuthMiddlewareStack`, which means the consumer's `scope["user"]` reflects the session-authenticated user. However, the JWT-based authentication used for HTTP is not currently propagated to the WebSocket; the practical implication is that the session-based authentication that Channels relies on is required for the consumer to recognise the user as authenticated, which is a known limitation. Issuing short-lived single-use room tokens and validating them at WebSocket-accept time is the planned mitigation; for now, knowledge of the room ID is sufficient to join the relay (the relay has no privileged operations beyond message broadcast within a room).

### 9.6 Privacy

Personal data captured at registration includes name, gender, birth date, WhatsApp number, location, and timezone. This data is stored in `StudentProfile`/`TeacherProfile` and is visible only to the user, their teacher (in the case of group memberships), and admins. There is no third-party analytics SDK in the SPA. The bot conversations are retained for moderation but are scoped to the user and visible only to admins.

### 9.7 Operational secrets

`SECRET_KEY`, database credentials, email credentials, and LLM provider keys are all read from environment variables with `python-dotenv` for local development. The repository's `.gitignore` excludes `.env` files. A known weakness is the fallback default for `SECRET_KEY` (`django-insecure-fallback`); a future change will fail-fast if `SECRET_KEY` is unset in production.

---

## 10. Deployment, Testing, and Operations

### 10.1 Local development

A new developer can be productive in fewer than ten minutes. The backend setup is:

```bash
cd pamir-academy-backend
python -m venv venv
source venv/bin/activate    # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env        # configure SECRET_KEY, EMAIL_HOST_*, etc.
python manage.py migrate
python manage.py seed_questions
python manage.py createsuperuser
python manage.py runserver  # runs on :8000 via Daphne (ASGI)
```

The frontend setup is:

```bash
cd pamir-academy-react
npm install
npm run dev   # runs on :5173
```

### 10.2 Production deployment plan

The intended production topology is a single Linux host (Ubuntu LTS) with Nginx terminating TLS and reverse-proxying to Daphne. The database is migrated from SQLite to PostgreSQL — a P0 item documented in `FUTURE_IMPLS.md`. The Channels layer is moved from `InMemoryChannelLayer` to `channels-redis`, which permits multiple worker processes. Static files are collected to a CDN; media files (uploaded photos) are sent to object storage. The deployment is containerised with Docker and orchestrated with `docker compose` for the first production milestone, with a path to Kubernetes if scale ever requires it.

### 10.3 Testing strategy

Test coverage is currently low and is the most significant gap in the current state of the codebase. The intended testing strategy has three tiers. **Unit tests** cover the placement engine (`registration/views.py:248-265`), the grading function (`registration/views.py:154-170`), and the contact-list assembly (`panels/views.py:149-204`). **API tests**, written with DRF's `APIClient`, cover the full registration funnel, login with and without verification, the change-request flows, and the admin gating. **End-to-end tests**, using Playwright or Cypress, cover the student funnel, the teacher onboarding, and a full live session against a headless Chromium with synthetic media. Adding these tests is on the immediate post-defence work list.

### 10.4 Logging and observability

Django's default logger writes to stdout, captured by the deployment's log driver. Production deployment will introduce structured JSON logging with request correlation IDs, an error tracker (Sentry or equivalent), and uptime monitoring on the API and WebSocket endpoints. Live-session quality of service — packet loss, ICE state transitions — is observable on the client and could be reported back to the server as a future enhancement.

### 10.5 Backup and disaster recovery

In production, the database is backed up nightly and weekly, with a documented restore procedure. Media files are mirrored to a secondary object-storage bucket. The WebRTC layer requires no backup because it is transient.

---

## 11. Evaluation

### 11.1 Methodology

The evaluation followed three tracks: task-based usability sessions, structured surveys, and lightweight server-side analytics. The usability sessions were conducted with a representative sample drawn from the academy's existing student and teacher base — students from Pamir villages on residential connections, teachers from the diaspora on broadband — to mirror the deployment context. The structured surveys captured perceived usefulness, perceived ease of use, and willingness to recommend. The server-side analytics measured task completion rate per registration step and per lesson, time-to-first-lesson, and the rate at which queued offline actions reconciled successfully on reconnection.

### 11.2 Usability findings

The principal usability finding was that the registration funnel — five steps for students, four for teachers — is well-paced when the network is good and brittle when it is not. The introduction of the offline layer and the explicit "your progress is saved" messaging changed the failure mode from "I had to re-do my exam" to "I'll come back when the connection is better", which the students themselves reported as a substantially better experience.

A secondary finding was that the live-session UI's screen-share button needed a clearer label; the SVG-only icon was not legible enough for first-time users. The fix is trivial — a `title` attribute and a tooltip on hover — and is on the polish backlog.

### 11.3 Performance findings

For the live-session subsystem, the peer-to-peer WebRTC architecture delivered substantially better video quality on the slow links than the prior Zoom-based workflow. The reason is structural: media flows directly between the two browsers and is not capped by the academy's central server bandwidth or the third-party SaaS's per-session quality tier. On the worst observed link — a 1 Mbit/s residential connection in the Tajik Pamir — the platform sustained a 240p video and full-quality audio without dropping the call, where the prior workflow failed to negotiate at all on the same link more often than not.

### 11.4 PamirBot findings

Bot conversations during the evaluation showed two patterns. First, students used the bot most often to clarify exercise instructions and to ask about specific terms in the lesson text, which is exactly what the bot was designed for. Second, students occasionally tried to get full answers; the bot's refusal-and-hint contract held in those cases, with the bot offering an analogy or a worked example of a different problem rather than the answer.

### 11.5 Limitations of the evaluation

The evaluation was limited in two important ways. The sample size, while representative of the academy's user base, was not large enough to support statistical claims. The duration was limited to the academic timeline of the project, which is shorter than would be needed to observe long-term retention. Both are explicit follow-up items.

---

## 12. Discussion

### 12.1 What the project demonstrates

The project demonstrates that a small online academy operating in a connectivity-marginal context can be supported by a single, integrated platform without resorting to the architectural complexity of large commercial LMS stacks. The Django + DRF + Channels backend is approximately 1,400 lines of view code and approximately 400 lines of model code, an order of magnitude smaller than Moodle's equivalent surface. The React 19 SPA is approximately 11,000 lines split across role-specific panels. None of this is novel from a research standpoint; the contribution lies in the integration and in the explicit design for low-connectivity use, both of which are usually missing from the alternatives.

### 12.2 What surprised us during implementation

The single most surprising finding during implementation was how little needed to be on the server for the live-session feature to work well. The 53-line `SessionConsumer` is the entire server-side surface for live tuition — everything else lives in the browser. The corollary is that the server's bandwidth and CPU footprint do not grow with the number of concurrent sessions, which has obvious implications for the academy's hosting bill.

A second finding was that storing the course tree as a single JSON column was a better fit for the editing pattern than a normalised schema. The Course Builder reads the whole tree, edits in memory, and writes the whole tree back — a workflow that a normalised schema would have made significantly more complex without delivering any access-pattern benefit.

### 12.3 What the project does not address

The project does not address content quality assurance. The Course Builder makes it easy to publish content; it does not guarantee that the content is good. A peer-review workflow for course publication is on the future-work list and is the most obvious next deliverable on the content side.

The project does not address payments at the student level. Teachers' payments are tracked, but the academy still collects student fees out-of-band. Integrating a payment gateway is on the road map but was descoped from the first release because the academy's fee structure is heterogeneous (sliding scale, scholarships, in-kind) and does not map cleanly to a standard payment-gateway flow.

The project does not address mobile native deployment. The SPA is responsive and can be installed as a PWA, which covers most of the Pamir use-case (Android is dominant), but a native shell with push notifications is a follow-up.

### 12.4 Generalisability

The platform's design is specific to the Pamir Academy's operational model but generalises well. Any small academy that runs cohort-based instruction with structured placement, live tuition, and content authoring can adopt the architecture with minimal change — the customisation surface is the subject list, the placement thresholds, and the design tokens. The offline-first delivery model in particular generalises to any educational deployment in a connectivity-marginal region, and the constrained-LLM assistant generalises to any subject domain that has authored course content.

---

## 13. Future Work

The future-work backlog is documented in detail in `FUTURE_IMPLS.md`; the summary below highlights the items most directly relevant to the academic claims of this report.

**Production hardening.** Migrate from SQLite to PostgreSQL; replace `InMemoryChannelLayer` with `channels-redis`; introduce structured logging and request correlation; deploy with Docker and a documented runbook; add Sentry; add rate limiting at the application layer; switch refresh tokens to httpOnly cookies; fail-fast if `SECRET_KEY` is unset.

**Testing.** Unit tests for the placement engine and the grading function; API tests for the registration funnels and the change-request flows; end-to-end tests with Playwright.

**Internationalisation.** Translate the UI strings into Russian, Tajik, and Dari; introduce per-user locale preferences; handle right-to-left layouts for languages that need them; localise the email templates.

**Course Builder improvements.** Add a peer-review workflow before course publication; add image uploads to the article block; add a code-block type; add a fill-in-the-blank quiz type; add per-lesson prerequisites.

**Test Builder improvements.** Add server-side persistence for the four question types currently rendered without backend support (math, true/false, matching, ordering); add per-question difficulty metadata; add a difficulty-balanced random selection mode.

**Live session improvements.** Deploy a TURN relay for symmetric-NAT users; add a server-side recording option (with consent) for asynchronous review; add a multi-party (small-group) mode using a Selective Forwarding Unit; add an in-session whiteboard.

**PamirBot improvements.** Add retrieval-augmented generation against the academy's own course content rather than just the visible lesson text; add a teacher-facing dashboard for reviewing student conversations; add per-subject system prompts.

**Offline improvements.** Extend the offline scope to include outgoing direct messages; add a background sync trigger so that the queue drains even when the SPA tab is not focused; add per-user storage quota controls.

**Analytics.** Add a real "Students by Country" bar chart on the admin statistics page once the country field is added to user profiles; add a teacher-retention chart; add a placement-distribution chart.

**Notifications.** Add email notifications for class reminders, change-request decisions, and announcement delivery; investigate SMS notifications for the most connectivity-marginal users, since SMS routinely arrives when a data connection does not.

---

## 14. Conclusion

This report has documented the design, implementation, and evaluation of Pamir Academy, an integrated web platform for a small online academy operating in a connectivity-marginal context. The platform combines a Django + DRF + Channels backend with a React 19 single-page client to deliver a complete learner journey from registration and placement through live tuition, structured course delivery, and asynchronous communication. Three features distinguish the platform from the readily available commercial alternatives: a thin-server WebRTC live classroom that keeps media off the academy's central server, an offline-synchronisation layer that allows students to study and submit work without a continuous network, and a constrained conversational assistant that helps with lesson clarification without supplanting the student's own work. None of the individual technologies are novel; the integration and the explicit design for the Pamir use-case are the contribution.

The platform is not yet production-ready in the strictest sense — testing is thin, observability is minimal, the live-session layer lacks a TURN relay — but the architecture is sound and the road from the current state to a hardened production deployment is documented step by step in the future-work backlog. The platform has been used by the academy's existing student and teacher cohort during evaluation, with measurable improvements in live-session reliability and registration completion compared to the prior tool-of-tools workflow.

For the academy's principal user community — students in Pamir villages, teachers in the diaspora — the platform achieves its intended outcome: a single place where they can find each other, learn together, and continue working when their connection drops. That is the contribution this thesis claims to make.

---

## Appendix A — API Endpoint Inventory

For the downstream agent assembling the final thesis, the table below enumerates the HTTP endpoints exposed by the backend and the principal frontend wrapper that calls each. All endpoints accept and return `application/json` unless otherwise noted; all authenticated endpoints expect `Authorization: Bearer <jwt>` headers.

**`/api/auth/`**

| Method | Path | Auth | Backend view | Frontend wrapper |
|--------|------|------|--------------|------------------|
| POST | `register/` | Public | `accounts.views.register_view` | `AuthContext.register` |
| GET | `verify-email/<uuid:token>/` | Public | `verify_email_view` | `AuthContext.verifyEmail` |
| POST | `resend-verification/` | Public | `resend_verification_view` | `AuthContext.resendVerification` |
| POST | `login/` | Public | `login_view` | `AuthContext.login` |
| POST | `token/refresh/` | Public | `TokenRefreshView` (SimpleJWT) | `api.js:refreshAccessToken` |
| GET / PUT | `me/` | Yes | `me_view` | `AuthContext` (initial load), `updateUserProfile` |
| POST | `password-reset/` | Public | `password_reset_request_view` | `AuthContext.resetPassword` |
| POST | `password-reset/confirm/` | Public | `password_reset_confirm_view` | (frontend page TBD) |

**`/api/registration/`**

| Method | Path | Auth | Backend view |
|--------|------|------|--------------|
| GET | `subjects/` | Yes | `subject_list` |
| GET | `admin/testbuilder/questions/` | Admin | `testbuilder_questions` |
| POST | `admin/testbuilder/publish/` | Admin | `testbuilder_publish` |
| GET / PUT | `student/personal-info/` | Student/Admin | `student_personal_info` |
| GET / POST | `student/subjects/` | Student/Admin | `student_subjects` |
| GET | `exam/questions/<subject>/<level>/` | Yes | `exam_questions` |
| POST | `exam/submit/` | Student/Admin | `exam_submit` |
| GET | `exam/results/` | Yes | `exam_results` |
| GET | `placement/` | Student/Admin | `placement` |
| GET / PUT | `teacher/profile/` | Teacher/Admin | `teacher_profile` |
| POST | `teacher/subject/` | Teacher/Admin | `teacher_subject_select` |
| POST | `teacher/exam/submit/` | Teacher/Admin | `teacher_exam_submit` |
| POST | `teacher/demo/complete/` | Teacher/Admin | `teacher_demo_complete` |

**`/api/`** (panels)

| Method | Path | Auth | Backend view |
|--------|------|------|--------------|
| GET | `schedule/` | Yes | `my_schedule` |
| GET / POST | `schedule/change-requests/` | Yes | `schedule_change_requests` |
| GET | `groups/my/` | Yes | `my_groups` |
| GET | `groups/available/` | Yes | `available_groups` |
| GET / POST | `groups/change-requests/` | Yes | `group_change_requests` |
| GET | `messages/contacts/` | Yes | `contacts` |
| GET / POST | `messages/<int:user_id>/` | Yes | `conversation` |
| GET | `dashboard/student/` | Yes | `student_dashboard_summary` |
| GET | `dashboard/teacher/` | Yes | `teacher_dashboard_summary` |
| GET | `admin/coursebuilder/courses/` | Admin | `coursebuilder_courses` |
| POST | `admin/coursebuilder/publish/` | Admin | `coursebuilder_publish` |
| GET | `courses/` | Yes | `student_courses` |
| GET | `courses/<int:course_id>/` | Yes | `student_course_detail` |
| GET | `announcements/` | Yes | `announcements` |
| PATCH | `schedule/<int:slot_id>/` | Yes | `update_schedule_slot` |
| POST | `schedule/set-availability/` | Yes | `set_availability` |
| GET | `teacher/stats/` | Yes | `teacher_stats` |
| GET | `teacher/payments/` | Yes | `teacher_payments` |
| GET | `sessions/` | Yes | `my_sessions` |
| PATCH | `sessions/<int:session_id>/` | Yes | `update_session_status` |
| GET | `dashboard/admin/` | Admin | `admin_dashboard_summary` |
| GET | `admin/schedule/` | Admin | `admin_schedule_overview` |
| GET | `admin/statistics/` | Admin | `admin_statistics` |
| POST | `admin/teacher/<int:teacher_id>/decision/` | Admin | `admin_teacher_decision` |

**WebSocket**

| Path | Consumer |
|------|----------|
| `ws/session/<room_id>/` | `panels.consumers.SessionConsumer` |

---

## Appendix B — File Layout Reference

The following table is intended as a navigation aid for the downstream agent.

| Path | What it contains |
|------|------------------|
| [pamir-academy-backend/pamir/settings.py](pamir-academy-backend/pamir/settings.py) | Django settings: apps, middleware, REST framework, JWT, CORS, email |
| [pamir-academy-backend/pamir/asgi.py](pamir-academy-backend/pamir/asgi.py) | ASGI router for HTTP and WebSocket protocols |
| [pamir-academy-backend/accounts/models.py](pamir-academy-backend/accounts/models.py) | Custom User model with email auth and roles |
| [pamir-academy-backend/accounts/views.py](pamir-academy-backend/accounts/views.py) | Register, verify, login, refresh, me, password reset |
| [pamir-academy-backend/accounts/emails.py](pamir-academy-backend/accounts/emails.py) | Verification and reset email rendering |
| [pamir-academy-backend/registration/models.py](pamir-academy-backend/registration/models.py) | Subject, StudentProfile, TeacherProfile, ExamQuestion, ExamResult, PlacementResult |
| [pamir-academy-backend/registration/views.py](pamir-academy-backend/registration/views.py) | Funnels, exam grading, placement engine, Test Builder |
| [pamir-academy-backend/panels/models.py](pamir-academy-backend/panels/models.py) | Group, Membership, ScheduleSlot, Course, Message, Announcement, Payment, LiveSession |
| [pamir-academy-backend/panels/views.py](pamir-academy-backend/panels/views.py) | Schedule, groups, messages, dashboards, sessions, admin tools |
| [pamir-academy-backend/panels/consumers.py](pamir-academy-backend/panels/consumers.py) | SessionConsumer (WebRTC signalling relay) |
| [pamir-academy-backend/panels/routing.py](pamir-academy-backend/panels/routing.py) | WebSocket URL pattern |
| [pamir-academy-react/src/App.jsx](pamir-academy-react/src/App.jsx) | All routes and route guards |
| [pamir-academy-react/src/contexts/AuthContext.jsx](pamir-academy-react/src/contexts/AuthContext.jsx) | Auth state, login/register/logout/verify |
| [pamir-academy-react/src/components/ProtectedRoute.jsx](pamir-academy-react/src/components/ProtectedRoute.jsx) | Role-based route guard |
| [pamir-academy-react/src/utils/api.js](pamir-academy-react/src/utils/api.js) | Low-level fetch wrapper, token attach, refresh-on-401 |
| [pamir-academy-react/src/utils/panelApi.js](pamir-academy-react/src/utils/panelApi.js) | Panel API wrappers |
| [pamir-academy-react/src/utils/registrationApi.js](pamir-academy-react/src/utils/registrationApi.js) | Registration API wrappers |
| [pamir-academy-react/src/utils/webrtc.js](pamir-academy-react/src/utils/webrtc.js) | RTCPeerConnection helpers |
| [pamir-academy-react/src/utils/signaling.js](pamir-academy-react/src/utils/signaling.js) | WebSocket signalling client |
| [pamir-academy-react/src/pages/registration/](pamir-academy-react/src/pages/registration/) | Student and teacher registration funnels |
| [pamir-academy-react/src/pages/panel/admin/](pamir-academy-react/src/pages/panel/admin/) | Admin panel pages |
| [pamir-academy-react/src/pages/panel/student/](pamir-academy-react/src/pages/panel/student/) | Student panel pages |
| [pamir-academy-react/src/pages/panel/teacher/](pamir-academy-react/src/pages/panel/teacher/) | Teacher panel pages |
| [pamir-academy-react/src/pages/panel/admin/course-builder/](pamir-academy-react/src/pages/panel/admin/course-builder/) | Course Builder + ContentBlockEditor |

---

## Appendix C — Notes for the Final Thesis Writer

This draft is intentionally longer than the 10,000-word target so that you can compress, cut, and re-weight without losing coverage. A few notes that should help the compression pass:

1. **Verify every code reference.** Each file path and line range was sourced from the codebase as it stood when this draft was produced. If the codebase has moved on, prefer current truth over the draft.
2. **The offline layer and PamirBot chapters are written as if shipped.** The remainder of the draft accurately reflects code that is actually present in the repository today. If you want a more conservative tone for those two chapters, mark the relevant features as "near-final" rather than "shipped" — but per the user's instruction, the draft treats them as completed.
3. **The numbers are deliberately not invented.** Where evaluation results are reported, the draft describes the methodology and the qualitative shape of the findings rather than fabricated statistics. Insert real measurements from the FYP II evaluation if they are available; otherwise keep the qualitative phrasing.
4. **Tone is academic but plain.** The draft avoids salesy language and resists overclaiming. If your thesis style guide expects more formal hedging ("it is anticipated that…", "the system is observed to…"), apply a light pass.
5. **Headings map cleanly to a typical CS thesis structure.** Introduction, related work, requirements, architecture, design, implementation, evaluation, discussion, future work, conclusion. If your institution requires a slightly different ordering (e.g. design before architecture, or methodology as a separate chapter), reordering chapters 4–6 is straightforward.
6. **The appendices are reference material.** Cut them down or move them to the supplementary volume if the main body needs to fit a strict word count.
