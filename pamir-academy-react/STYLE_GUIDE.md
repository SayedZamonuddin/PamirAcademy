# Pamir Academy — Platform Style & Theme Reference

> Internal reference for AI-assisted development. Consult this file before creating
> or modifying any page to maintain visual and structural consistency.

---

## 1. Technology Stack

| Layer | Tool |
|-------|------|
| Framework | React 18+ (JSX, functional components, hooks) |
| Routing | `react-router-dom` (BrowserRouter) — **never** `react-router` |
| Styling | **Tailwind CSS** utility classes (inline in JSX). No external CSS for new pages. |
| Icons | Inline SVG components defined per-file (no icon library) |
| Images | Plain `<img>` tags — **never** `ImageWithFallback` or `figma:asset` |
| Logo | Always `<img src="/logo/final_logo.svg" alt="Pamir Academy" />` |
| State | React `useState` / `useEffect`. `localStorage` for persistence across pages. |
| Build | Vite |

---

## 2. Color Palette

### Core Brand Colors

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| **Primary Green** | `#006236` | `bg-[#006236]` / `text-[#006236]` | Buttons, active states, headings, borders, icons, sidebar highlights |
| **Primary Green Hover** | `#004d2a` | `hover:bg-[#004d2a]` | Button hover states |
| **Danger Red** | `#c51310` | `bg-[#c51310]` / `text-[#c51310]` | Destructive actions, end-call, error states, live indicators |
| **Danger Red (alt)** | `#FB001D` | `bg-[#FB001D]` | Schedule "system check" status |

### Neutral Grays

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| **Page Background** | `#a7a7a7` | `bg-[#a7a7a7]` | Full-page background for panel layouts and registration pages |
| **Panel / Sidebar BG** | `#7d807f` | `bg-[#7d807f]` | Sidebar background, main content area background (panel pages) |
| **Card / Surface** | `#d9d9d9` | `bg-[#d9d9d9]` | Cards, tables, chat areas, form surfaces, schedule grid |
| **Light Background** | `#f5f5f5` | `bg-[#f5f5f5]` | PersonalInfo form page background (exception) |
| **Dark Overlay** | `rgba(0,0,0,0.7)` | `bg-black/70` | Note boxes, dark overlays |
| **Footer** | `rgba(0,0,0,0.65-0.85)` | `bg-black/65` to `bg-black/85` | Footer background |

### Semantic Accent Colors (Tailwind built-ins used alongside brand)

| Color | Usage |
|-------|-------|
| `bg-amber-500` / `text-amber-500` | Warnings, pending status, current month highlight |
| `bg-blue-500` / `text-blue-600` | Booked sessions, secondary data series, info accents |
| `bg-purple-500` | Tertiary accent (exercises, individual students category) |
| `bg-gray-300` to `bg-gray-500` | Inactive, disabled, muted text |

### Opacity Patterns

- `text-white/60`, `text-white/70`, `text-white/75` — subtitle/muted white text
- `bg-[#006236]/5`, `bg-[#006236]/10`, `bg-[#006236]/15`, `bg-[#006236]/20` — light green tints for hover/selected/highlight backgrounds
- `border-[#006236]/10`, `border-[#006236]/15`, `border-[#006236]/20` — subtle green borders

---

## 3. Typography

### Font Family

```
font-['Nunito_Sans']
```

Applied on the outermost page `<div>`. Every page uses this.

### Responsive Font Sizing Pattern

The platform uses **CSS `clamp()`** extensively for fluid typography:

```
text-[clamp(MIN, PREFERRED_VW, MAX)]
```

Common sizes:

| Role | Class |
|------|-------|
| Page title (h1) | `text-[clamp(24px,3vw,40px)]` or `text-[clamp(32px,5vw,60px)]` |
| Section heading (h2/h3) | `text-[clamp(18px,2vw,26px)]` or `text-[clamp(14px,1.4vw,20px)]` |
| Body / label | `text-[clamp(12px,1.2vw,16px)]` or `text-[clamp(13px,1.1vw,16px)]` |
| Small / caption | `text-[clamp(10px,0.9vw,13px)]` or `text-xs` |
| Sidebar label | `text-[11px]` |

### Font Weight

- **Bold headings**: `font-bold` (700)
- **Semi-bold labels**: `font-semibold` (600)
- **Normal body**: default (400)

### Text Colors by Context

| Context | Color |
|---------|-------|
| Panel page headings | `text-white` |
| Panel card headings / labels | `text-[#006236]` |
| Panel card values (big numbers) | `text-[#006236] font-bold` |
| Panel card sublabels | `text-gray-500 text-xs` or `text-gray-400` |
| Registration page headings | `text-[#006236]` or `text-black` |
| Registration form labels | `text-black font-semibold` |
| Muted / inactive text | `text-[#a7a7a7]`, `text-[#7d807f]`, `text-gray-400` |
| Footer links | `text-white/75` |

---

## 4. Page Layout Architecture

### 4.1 Panel Pages (Admin & Teacher)

Panel pages are wrapped in a **layout component** (`DashboardLayout` or `TeacherLayout`):

```
<Layout activePage="key">
  <div className="flex-1 ..."> {/* page content */} </div>
</Layout>
```

**Layout structure (outermost → innermost):**

```
div.font-['Nunito_Sans'] w-screen min-h-screen flex flex-col bg-[#a7a7a7]
├── header (logo left, user info + avatar + buttons right)
│     px-[clamp(16px,4vw,80px)] py-4 min-h-[80px]
├── div.flex-1 flex gap-1 px-[3px]
│   ├── nav (sidebar) — w-[90px] bg-[#7d807f] rounded-2xl border-[3px] border-[#006236]
│   └── div (main content) — flex-1 bg-[#7d807f] rounded-2xl border-[3px] border-[#006236]
│         └── {children}
├── p (help link) — centered
└── footer — bg-black/65, 3-column grid (About, Contact, Location)
```

**Sidebar nav items:** `{ key, label, icon: SvgComponent, path }`
- Active item: `text-white`
- Inactive item: `text-[#006236]`
- Icon size: `width="40" height="40" viewBox="0 0 100 100"`
- Label: `text-[11px] text-center`

**Content area pattern for panel page children:**

```jsx
<div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto flex flex-col gap-5">
  {/* Page header */}
  <div className="flex items-center justify-between flex-wrap gap-4">
    <div>
      <h1 className="text-white text-[clamp(24px,3vw,40px)] font-bold m-0">Title</h1>
      <p className="text-white/60 text-sm m-0 mt-1">Subtitle</p>
    </div>
    {/* Action buttons on the right */}
  </div>

  {/* Summary cards */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {/* Cards... */}
  </div>

  {/* Content sections */}
  <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
    {/* Section content */}
  </div>
</div>
```

### 4.2 Registration Pages (Student & Teacher)

Registration pages are **standalone** (no sidebar layout). They share this skeleton:

```
div.font-['Nunito_Sans'] w-screen min-h-screen flex flex-col bg-[#a7a7a7]
├── header — logo left, LOGIN button right
│     px-[clamp(24px,5vw,80px)] py-4
├── Step indicator bar (optional)
│     max-w-[900px] mx-auto, progress bars with labels
├── main.flex-1 px-[clamp(24px,5vw,80px)] pb-10
│   └── div.max-w-[1200px] mx-auto
│       ├── Note box (optional): bg-black/70 rounded-3xl
│       ├── Form / content
│       ├── PREVIOUS / NEXT navigation
│       └── Help text link
└── footer — bg-black/85, same 3-column pattern
```

**Step indicator pattern:**

```jsx
{STEPS.map((step, i) => (
  <div className="flex flex-col items-center gap-2 flex-1">
    <span className={`text-[clamp(12px,1.2vw,18px)] whitespace-nowrap ${
      i === ACTIVE_STEP ? "text-[#006236] font-semibold" : "text-[#d9d9d9]"
    }`}>{step}</span>
    <div className={`h-2.5 w-full max-w-[200px] rounded-full ${
      i === ACTIVE_STEP ? "bg-[#006236]" : "bg-[#d9d9d9]"
    }`}/>
  </div>
))}
```

---

## 5. Component Patterns

### 5.1 Buttons

| Type | Classes |
|------|---------|
| **Primary action** | `bg-[#006236] text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider` |
| **Primary hover** | Add `hover:bg-[#004d2a] transition-colors` |
| **Danger** | `bg-[#c51310] text-white px-6 py-2.5 rounded-full border-none cursor-pointer` |
| **Secondary / ghost** | `bg-transparent text-white border border-white/30 px-4 py-2 rounded-full cursor-pointer` |
| **Inactive / disabled** | `bg-[#7d807f] text-white rounded-full cursor-default` |
| **Small toolbar** | `px-4 py-2 rounded-full text-xs` or `px-5 py-2.5 rounded-full text-sm` |
| **Pill filter toggle** | `px-3.5 py-1.5 rounded-full text-sm` — active: `bg-[#006236] text-white`, inactive: `bg-white text-[#006236]` |

All buttons use `rounded-full` (pill shape). No squared buttons in the platform.

### 5.2 Cards (Summary / Stats)

```jsx
<div className="bg-[#d9d9d9] rounded-2xl p-[clamp(14px,1.5vw,24px)] flex items-center gap-3">
  <div className="bg-[#006236] w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0">
    {/* Icon */}
  </div>
  <div>
    <p className="text-gray-500 text-xs m-0">Label</p>
    <p className="text-[#006236] text-[clamp(20px,2vw,28px)] font-bold m-0">Value</p>
  </div>
</div>
```

### 5.3 Content Section Blocks

```jsx
<div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
  <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0 mb-4">Section Title</h3>
  {/* Content */}
</div>
```

### 5.4 Form Inputs (Registration)

```jsx
const inputCls = "w-full bg-[#d9d9d9] rounded-full px-6 py-3.5 border-none outline-none text-black";
```

- Rounded pill shape (`rounded-full`)
- Gray background (`bg-[#d9d9d9]`)
- Placeholder color: defaults to gray

### 5.5 Form Inputs (Panel / Builder pages, dark context)

```jsx
const inputDark = "w-full px-3 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm outline-none focus:border-white/40 transition-colors";
```

### 5.6 Tables

- Header row: `bg-[#006236] text-white text-[clamp(11px,1vw,14px)] font-semibold`
- Body: `bg-[#d9d9d9]` with `divide-y divide-[#006236]/10`
- Row hover: `hover:bg-[#006236]/5 transition-colors`
- Grid layout: `grid grid-cols-[...]` with explicit column ratios

### 5.7 Chat / Messages

- Chat bubble (sent): `bg-[#006236] rounded-[20px_20px_4px_20px]`
- Chat bubble (received): `bg-[#7d807f] rounded-[20px_20px_20px_4px]`
- Both: `text-white px-4 py-2.5` or `px-5 py-2.5`
- Input bar: `bg-white rounded-full py-2 pr-3 pl-5 border border-[#006236]/20`

### 5.8 Status Badges

```jsx
<span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#006236]/15 text-[#006236]">
  Active
</span>
```

- Success / Active: `bg-[#006236]/15 text-[#006236]`
- Pending: `bg-amber-100 text-amber-600`
- Error / Failed: `bg-[#c51310]/15 text-[#c51310]`
- Inactive: `bg-gray-300 text-gray-500`

### 5.9 Avatars

```jsx
<div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-[#006236]">
  <img src={url} alt="Name" className="w-full h-full object-cover" />
</div>
```

Sizes vary: `w-9 h-9` (table), `w-10 h-10` (chat), `w-11 h-11` (contact list), `w-[50px] h-[50px]` (header).

### 5.10 Breadcrumbs

```jsx
<div className="bg-[#006236] rounded-full py-2.5 px-[clamp(16px,2vw,32px)] flex items-center justify-between gap-3">
  {BREADCRUMBS.map((crumb, idx) => (
    <span key={idx} className="flex items-center gap-1.5">
      <span className="text-white text-[clamp(12px,1.2vw,16px)]">{crumb}</span>
      {idx < BREADCRUMBS.length - 1 && /* chevron arrow SVG */}
    </span>
  ))}
</div>
```

### 5.11 Video / Live Session Area

- Container: `bg-[#1a1a1a] rounded-2xl relative overflow-hidden`
- PiP window: `absolute bottom-16 left-3 w-[clamp(80px,10vw,140px)] rounded-xl border-2 border-[#006236]`
- Controls bar: `absolute bottom-0 inset-x-0`, gradient background `linear-gradient(transparent, rgba(0,0,0,0.75))`
- Control button: `w-[clamp(36px,4vw,48px)] h-[clamp(36px,4vw,48px)] rounded-full hover:scale-110 transition-transform`

---

## 6. Spacing & Sizing Conventions

### Responsive Padding (clamp)

| Context | Pattern |
|---------|---------|
| Page horizontal padding (registration) | `px-[clamp(24px,5vw,80px)]` |
| Page horizontal padding (panel header) | `px-[clamp(16px,4vw,80px)]` |
| Content area padding (panel) | `p-[clamp(16px,3vw,40px)]` |
| Card internal padding | `p-[clamp(14px,1.5vw,24px)]` or `p-[clamp(16px,2vw,28px)]` |

### Common Gaps

- Section gap: `gap-5` (20px)
- Card grid gap: `gap-3` (12px) or `gap-4` (16px)
- Element gap: `gap-2` (8px), `gap-2.5` (10px), `gap-3` (12px)

### Border Radius

- **Full pill**: `rounded-full` — buttons, inputs, badges, avatar, breadcrumb bar
- **Large card**: `rounded-2xl` (16px) — content cards, panels, sidebar, video area
- **Medium card**: `rounded-xl` (12px) — icon containers, tooltips
- **Small**: `rounded-[10px]` — tags, labels
- **Huge feature**: `rounded-[30px]` or `rounded-3xl` — note boxes, special cards

---

## 7. SVG Icon Conventions

- All icons are **inline SVG React components** defined at the top of each file
- Sidebar icons: `width="40" height="40" viewBox="0 0 100 100"`
- In-content icons: `width="16-24" height="16-24" viewBox="0 0 24 24"`
- Stroke-based: `fill="none" stroke="currentColor" strokeWidth="2"` with `strokeLinecap="round" strokeLinejoin="round"`
- Fill-based (for solid icons): `fill="currentColor"` or `fill="#fff"`
- Color inherits via `currentColor` — controlled by parent's `text-*` class

---

## 8. Footer (Shared Pattern)

All pages use the same footer structure:

```jsx
<footer className="bg-black/65 text-white px-[clamp(24px,5vw,80px)] py-12">
  <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-8">
    <div>
      <h3 className="text-white mb-4">About</h3>
      <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
        {["Impact","Internship","About"].map(i => (
          <li key={i}><a href="#" className="text-white/75 no-underline">{i}</a></li>
        ))}
      </ul>
    </div>
    <div className="text-center">
      <h3 className="text-white mb-4">Contact</h3>
      <ul>...</ul>  {/* Help Center, Share Your Story, Email */}
    </div>
    <div className="text-right">
      <h3 className="text-white mb-4">Location</h3>
      <ul>...</ul>  {/* Khorog, London, Dushanbe */}
    </div>
  </div>
  <div className="max-w-[1200px] mx-auto mt-10">
    <div className="h-[50px] bg-white/20 rounded-xl" />
  </div>
</footer>
```

Panel pages use `bg-black/65`. Registration pages use `bg-black/85`.

---

## 9. Help Link (Shared)

Appears between main content and footer:

```jsx
<p className="text-center mt-8">
  <span className="text-[#7d807f]">If you need our help? </span>
  <a href="#" className="text-[#006236] no-underline">contact us</a>
</p>
```

---

## 10. File Organization

```
src/
├── pages/
│   ├── panel/
│   │   ├── admin/           ← Admin dashboard pages
│   │   │   ├── DashboardLayout.jsx    ← Admin layout (sidebar + header)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Schedule.jsx
│   │   │   ├── Statistics.jsx
│   │   │   ├── Meeting.jsx            ← TeacherDemo (admin side)
│   │   │   ├── TestBuilder.jsx
│   │   │   └── course-builder/
│   │   │       ├── CourseBuilder.jsx
│   │   │       └── ContentBlockEditor.jsx
│   │   └── teacher/          ← Teacher dashboard pages
│   │       ├── TeacherLayout.jsx      ← Teacher layout (sidebar + header)
│   │       ├── TeacherStats.jsx
│   │       ├── TeacherLiveSession.jsx
│   │       ├── TeacherSchedule.jsx
│   │       ├── TeacherMessages.jsx
│   │       └── TeacherPayments.jsx
│   ├── registration/
│   │   ├── RegisterAs.jsx
│   │   ├── Employee.jsx
│   │   ├── student/          ← Student registration flow (standalone pages)
│   │   │   ├── PersonalInfo.jsx
│   │   │   ├── SubjectSelection.jsx
│   │   │   ├── ExamStart.jsx
│   │   │   ├── ExamInProgress.jsx
│   │   │   ├── Exam.jsx
│   │   │   ├── ExamResult.jsx
│   │   │   └── PlacementAndGroupAssignment.jsx
│   │   └── teacher/          ← Teacher registration flow (standalone pages)
│   │       ├── TeacherSubjects.jsx
│   │       ├── TeacherExam.jsx
│   │       └── DemoSession.jsx
│   ├── Home.jsx, About.jsx, Products.jsx, Subjects.jsx, LearnMore.jsx
│   ├── lesson/LessonEnvironment.jsx
│   └── course/UnitView.jsx
├── App.jsx                   ← All routes defined here
└── App.css
```

### Naming Conventions

- **Panel pages**: PascalCase, prefixed by role for teacher (`TeacherStats`, `TeacherMessages`)
- **Admin pages**: No prefix (`Dashboard`, `Messages`, `Statistics`)
- **Registration pages**: Descriptive name (`PersonalInfo`, `ExamStart`, `DemoSession`)
- **Layout components**: `DashboardLayout` (admin), `TeacherLayout` (teacher)
- **Route-to-activePage key mapping**: The layout's `activePage` prop must match a `key` in the layout's `NAV_ITEMS` array

---

## 11. Data / State Patterns

- **Sample data** is hardcoded as `const` arrays/objects at the top of each file
- **Images** use Unsplash URLs (high-quality, free) — defined as constants
- **localStorage keys in use**:
  - `selectedSubjects` — student's chosen subjects
  - `currentExamSubject` — which subject the student is currently taking
  - `examResults` — array of exam result objects
  - `examStatus` — object tracking completed exams
  - `adminTests` — admin test builder draft data
  - `publishedTests` — published test questions
  - `demoSessionNotes` — teacher's demo session notes
  - `pamir_auth_user`, `pamir_auth_profile` — auth state (Django-ready stub)

---

## 12. Quick Checklist for New Pages

1. **Import `useNavigate` from `"react-router-dom"`** (never `"react-router"`)
2. **Use `<img>` for images** (never `ImageWithFallback` or `figma:asset`)
3. **Logo**: `<img src="/logo/final_logo.svg" alt="Pamir Academy" />`
4. **Font**: wrap page in `font-['Nunito_Sans']`
5. **Background**: `bg-[#a7a7a7]` (standard) or `bg-[#f5f5f5]` (forms)
6. **Panel page?** → Wrap in `DashboardLayout` or `TeacherLayout` with correct `activePage`
7. **Registration page?** → Standalone with header + step indicator + footer
8. **Add route in `App.jsx`**
9. **If panel page**: add sidebar entry in the relevant layout's `NAV_ITEMS`
10. **Use `clamp()` for all responsive sizing** — never hardcode px for text/padding
11. **Buttons are always `rounded-full`** (pill-shaped)
12. **Cards are always `rounded-2xl bg-[#d9d9d9]`**
13. **Run `npm run build`** to verify no import/compile errors
