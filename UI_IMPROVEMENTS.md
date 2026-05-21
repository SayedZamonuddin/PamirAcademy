# UI Improvements Plan: Pamir Academy

## Overview & Design Philosophy

The platform's legacy identity is built on **green** (`#006236`), **gray**, and **white**. The goal is NOT to abandon this palette but to **modernize how it's used**. The current mid-gray body (`rgb(185,185,185)`) makes the entire app feel heavy and dated. The fix: shift gray from "background color" to "text and border utility", and let **white** and **very light gray** do the heavy lifting as canvas colors, while green remains the primary brand accent.

**What changes:** Surface colors, shadows, spacing, transitions, layout responsiveness, CSS organization.
**What stays:** The green-gray-white palette, the logo, the general layout structure (header on top, sidebar in panels, footer at bottom).

---

## Phase 0: Foundation (Do This First)

Everything else depends on these foundational changes. Complete this phase before touching any individual page.

### 0A. Tailwind Config — Define the Design System

**File:** `pamir-academy-react/tailwind.config.js`

Replace the empty config with brand tokens so every page can use consistent semantic names instead of hardcoded hex values:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#006236',    // primary green (rgb(0,98,54))
          dark: '#004d2a',       // hover/active green
          light: '#e6f2ec',      // very light green tint for active states
          muted: '#4a6b5a',      // muted green for inactive sidebar icons
        },
        surface: {
          DEFAULT: '#F9FAFB',    // page background (replaces rgb(185,185,185))
          card: '#FFFFFF',       // card/modal backgrounds (replaces #d9d9d9)
          panel: '#F3F4F6',      // panel content area background
          sidebar: '#FFFFFF',    // sidebar background
        },
        accent: {
          red: '#C5221F',        // warnings, errors, notification badges
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Arial', 'Helvetica', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '25px',
        'modal': '20px',
        'input': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
        'modal': '0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
```

**Why these specific values:**
- `surface.DEFAULT` (#F9FAFB) is Tailwind's `gray-50` — bright enough to feel modern without being stark white
- `brand.light` (#e6f2ec) is a 10% tint of the brand green — for active backgrounds in sidebar/nav
- Card shadows use two-layer technique for depth realism
- `Inter` font added as primary — it's the standard for modern SaaS UIs. Roboto stays as fallback.

**After this:** Install Inter font. Add to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 0B. Global Body Background

**File:** `pamir-academy-react/src/index.css`

Change from:
```css
body {
  margin: 0;
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  background-color: rgb(185, 185, 185);
}
```

To:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Inter', 'Roboto', Arial, Helvetica, sans-serif;
  background-color: #F9FAFB;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Also in** `src/styles/general.css` line 3: the `body` rule there duplicates the one in `index.css` with `background-color: rgb(185, 185, 185)`. **Remove lines 1-7** of `general.css` (the entire `body` block) since `index.css` is the source of truth.

### 0C. Remove Debug Borders

**File:** `src/styles/general.css` — Remove all malformed debug borders throughout:
- Line 12: `border: 1px redsolid;` → remove entirely
- Line 20: `border: 1px blacksolid;` → remove entirely
- Line 33: `border: 1px yellowsolid;` → remove entirely
- Line 137: `border: 1px blacksolid;` → remove entirely
- Line 266: `border: 1px orangesolid;` → remove entirely
- Line 303: `border: 1px redsolid;` → remove entirely

**File:** `src/styles/home.css`:
- Line 3: `border: 1px blacksolid;` → remove entirely
- Line 58: `border: 1px redsolid;` → remove entirely
- Line 124: `border: 1px blacksolid;` → remove entirely

These are clearly leftover debug borders (the syntax `redsolid` is even invalid CSS). They add visual noise and must go.

### 0D. Fix the Fixed-Width Container

**File:** `src/styles/general.css` lines 252-260 and `src/styles/subjects.css` lines 1-11

The `.inside-main-body-without-logo-apply-css` class forces `width: 1055px` — a hardcoded pixel width that breaks responsiveness.

Change from:
```css
.inside-main-body-without-logo-apply-css {
  width: 1055px;
  height: auto;
}
```

To:
```css
.inside-main-body-without-logo-apply-css {
  width: 100%;
  max-width: 1100px;
  height: auto;
  padding-left: 20px;
  padding-right: 20px;
}
```

Apply the same fix to every CSS file that hardcodes `width: 1055px`:
- `src/styles/home.css`: `.front-page-learn-more-black` (line 18), `.front-page-image-container-css` (line 22), `.our-team-white-banner-css` (line 139)
- `src/styles/about.css`: `.about-white-banner-css` (line 19), `.about-video-container-css` (line 27), `.components-main-container-css` (line 46)
- `src/styles/products.css`: `.products-white-banner-css` (line 19), `.product-main-container-css` (line 34), `.product-elements-container-css` (line 68)
- `src/styles/subjects.css`: `.subjects-white-banner-css` (line 29), `.subject-container-css` (line 46), `.subject-title-container-css` (line 55)
- `src/styles/learn-more.css`: `.learn-more-white-banner-css` (line 19)

All should become: `width: 100%; max-width: 1100px;`

---

## Phase 1: Global Components (Header, Footer, Modals)

These appear on every page. Fixing them first creates immediate, site-wide visual lift.

### 1A. Header & Navigation

**Files:** `src/components/Header.jsx`, `src/styles/general.css`

**Current problems:**
- Logo container has hardcoded `width: 200px; margin-left: 100px` — breaks on small screens
- Login/Apply buttons use the dull gray `rgb(143, 146, 145)` as default state — looks disabled
- Navbar has `padding-left: 400px` — absurd hardcoded offset
- Search bar is split into separate input + button with mismatched borders
- No sticky behavior — header scrolls away

**Changes to `Header.jsx`:** Rewrite the outer structure using Tailwind. The header should become a sticky, clean white bar:

**Top bar (logo + auth buttons):**
```jsx
<div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
    {/* Logo - responsive sizing */}
    <Link to="/" className="flex-shrink-0">
      <img src="/logo/final_logo.svg" alt="Pamir Academy" className="h-10 sm:h-12 w-auto" />
    </Link>
    
    {/* Auth buttons or user menu */}
    <div className="flex items-center gap-3">
      {/* ... existing auth logic, but buttons use: */}
      {/* bg-brand text-white px-5 py-2 rounded-button hover:bg-brand-dark transition-colors font-medium text-sm */}
    </div>
  </div>
</div>
```

**Search bar:** Merge input and icon into a single cohesive unit:
```jsx
<div className="relative max-w-lg mx-auto mt-6">
  <input 
    type="text" 
    placeholder="Search courses, subjects..." 
    className="w-full h-11 pl-11 pr-4 rounded-full bg-gray-100 border border-gray-200 
               focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent 
               text-sm text-gray-700 placeholder:text-gray-400 transition-all"
  />
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" ...>
    {/* search icon SVG */}
  </svg>
</div>
```

**Navigation bar:** Replace the hardcoded `padding-left: 400px` layout. Use centered flex:
```jsx
<nav className="max-w-7xl mx-auto px-4 mt-4">
  <div className="flex items-center justify-center gap-8 sm:gap-12">
    {[
      { to: '/', icon: HomeIcon, label: 'Home' },
      { to: '/subjects', icon: SubjectsIcon, label: 'Subjects' },
      { to: '/products', icon: ProductsIcon, label: 'Products' },
      { to: '/about', icon: AboutIcon, label: 'About' },
    ].map(item => (
      <Link key={item.to} to={item.to} 
        className="flex flex-col items-center gap-1 text-gray-500 hover:text-brand transition-colors group">
        <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-medium">{item.label}</span>
      </Link>
    ))}
  </div>
</nav>
```

**CSS to remove from `general.css`:** After migrating to Tailwind, delete these class blocks:
- `.logo-login-container-css` (lines 9-15)
- `.logo-container-css` (lines 16-21)
- `.login-apply-now-container-css` (lines 27-35)
- `.login-gray-css, .apply-now-gray-css` (lines 36-48)
- `.login-css, .apply-now-css` (lines 49-61)
- `.search-container-css` through `.search-img-css` (lines 262-297)
- `.header-css` through `.navbar-icons-css` (lines 299-327)

**Important:** Replace the PNG icons (`/icons/home-icon.png`, etc.) with inline SVGs. PNG icons look pixelated at different sizes and cannot be color-controlled. Use simple SVG icons (Heroicons or similar).

### 1B. Login Modal

**File:** `src/components/LoginModal.jsx`

**Current problems:**
- Gray background `#d9d9d9` — looks like a dirty window
- Close button positioned with `margin-top: -30px; margin-right: -600px` — fragile hack
- Dual class system: has BOTH legacy CSS classes AND Tailwind classes on the same elements

**Changes:**
1. Remove all legacy CSS class names (`login-apply-background-black-css`, `login-apply-background-gray-css`, etc.) — they're redundant since Tailwind classes already exist on the same elements.

2. Change the modal card background from gray to white:
   - Old: `bg-[#d9d9d9]`
   - New: `bg-white`

3. Add proper shadow to the modal card: `shadow-modal`

4. Fix close button positioning — use CSS `absolute` relative to the modal card (which is already `relative`):
   - Remove: `login-apply-x-cancel-css` class
   - Keep: `absolute -top-3 -right-3 bg-brand w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-brand-dark transition-colors shadow-lg`

5. Backdrop: keep `fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]`, add `backdrop-blur-sm` for the modern frosted effect.

6. Input fields — update border radius from pill (`rounded-[20px]`) to a softer modern radius:
   - `rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition-all`

7. Submit button: Keep green, add slight rounding update:
   - `rounded-xl` instead of `rounded-[15px]` (visually similar but semantically cleaner)

### 1C. Apply Modal

**File:** `src/components/ApplyModal.jsx`

Apply the same changes as Login Modal:
- White background instead of gray
- Remove legacy CSS classes
- Same input/button styling
- Same close button fix
- Remove the `apply-x-cancel-css` class that uses `margin-top: -48px; margin-right: -605px`

### 1D. Footer

**File:** `src/components/Footer.jsx`, `src/styles/footer/footer.css`

**Current:** Pure black background (`rgba(3,3,3)`), basic link list, fixed `height: 300px`

**Changes:**
- Background: Change from pure black to deep green-black `bg-gray-900` or brand-aligned `bg-[#0a2e1a]` (very dark green — honors the legacy palette while being more sophisticated than plain black)
- Remove fixed `height: 300px` — let content determine height with proper padding (`py-12 sm:py-16`)
- Layout: Use CSS grid instead of basic flex for the About/Contact/Location columns:
  ```
  grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto px-6
  ```
- Column headers ("About", "Contact", "Location") should be slightly larger and bolder: `text-white font-semibold text-base mb-4`
- Links: `text-gray-400 hover:text-white transition-colors text-sm leading-relaxed`
- Social icons section: Center properly, give icons hover effects: `opacity-70 hover:opacity-100 transition-opacity`
- Add a bottom bar: `border-t border-white/10 mt-8 pt-6 text-center text-gray-500 text-xs` with copyright text

**CSS to delete:** The entire `src/styles/footer/footer.css` file and `src/styles/footer/footer-responsive-css/responsive-footer.css` after migration to Tailwind.

---

## Phase 2: Home Page

**File:** `src/pages/Home.jsx`, `src/styles/home.css`

### 2A. Hero Section (Front Page Learn More)

**Current:** Dark overlay `rgba(3,3,3,0.66)` over background image, hardcoded to `1055px` width and `400px` height.

**Changes:**
- Make the hero full-width within the content container: `w-full aspect-[21/9] sm:aspect-[21/8] relative overflow-hidden rounded-2xl`
- Replace the flat dark overlay with a gradient: `bg-gradient-to-t from-black/70 via-black/30 to-transparent`
- Position text at the bottom of the hero rather than dead center — this is the modern editorial pattern:
  ```jsx
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent 
                  flex flex-col justify-end p-8 sm:p-12">
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">Pamir Academy</h1>
    <p className="text-white/80 text-sm sm:text-base max-w-xl mb-6">{inputShortText[currentImageIndex]}</p>
    <Link to="/learn-more" 
      className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white 
                 px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg w-fit">
      Learn More
      <svg ...arrow-right />
    </Link>
  </div>
  ```
- Image transition: Add `transition-opacity duration-700` for smoother image crossfade

### 2B. Slider Controls

**Current:** PNG arrow images (`moving-left.png`, `moving-right.png`) in large 60x50px buttons.

**Changes:** Replace with SVG chevrons in clean circular buttons:
```jsx
<button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center 
                   hover:bg-gray-50 hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed">
  <svg className="w-5 h-5 text-gray-700" ...chevron-left />
</button>
```

Indicator dots: Change from filled green circles to a more subtle design:
```jsx
<div className={`w-2 h-2 rounded-full transition-all ${
  active ? 'bg-brand w-6' : 'bg-gray-300'
}`} />
```
The active dot elongates instead of just changing color — modern micro-interaction.

### 2C. Statistics Bar

**Current:** Green background `rgb(0,98,54)`, height `200px`, italic gray labels `rgb(167,167,167)`.

**Changes — keep the green bar but refine it:**
- Add gradient: `bg-gradient-to-r from-brand to-brand-dark`
- Add `rounded-2xl` (already has `rounded-20px` which is similar)
- Numbers: Keep white, reduce from `55px` to a responsive `text-4xl sm:text-5xl font-bold`
- Labels: Change from italic gray to clean white with slight transparency:
  - Old: `color: rgb(167,167,167); font-style: italic;`
  - New: `text-white/70 text-sm font-medium tracking-wide uppercase` (remove italic — it looks dated)
- Add `mt-16` instead of `margin-top: 100px` (Tailwind's `mt-16` = 64px — 100px is excessive spacing)

### 2D. Section Title Banners ("Our Students", "Our Teachers", "Our Team")

**Current:** Semi-transparent gray banner `rgba(217,217,217,0.6)` with green text, hardcoded width `1055px`.

**Changes:** Make them cleaner and more distinct:
```jsx
<div className="mt-16 mb-8">
  <h2 className="text-2xl sm:text-3xl font-bold text-brand text-center">Our Students</h2>
  <div className="w-16 h-1 bg-brand rounded-full mx-auto mt-3"></div>
</div>
```
The gray banner gets replaced with a simple heading + small green underline accent. This is cleaner and doesn't need absolute positioning.

### 2E. Profile Cards (Students, Teachers, Team)

**Current:** Gray semi-transparent background `rgba(217,217,217,0.6)`, fixed `300px` width, profile image overlaps top with absolute positioning and green border.

**Changes:**
- Background: `bg-white` (white card floating over the light gray page background)
- Shadow: `shadow-card hover:shadow-card-hover transition-all duration-300`
- Border radius: `rounded-2xl` (keep existing `20px` radius — it's good)
- Width: Change from fixed `300px` to responsive: `w-full max-w-[300px]`
- Profile image border: Keep the green border `border-brand` — it's a nice brand touch
- Profile image background: Keep `bg-white` fallback
- Hover: `hover:-translate-y-1` (keep existing translateY but reduce from 5px to 4px via Tailwind)
- Name text: `text-brand font-semibold text-lg` (keep green)
- Title text: Change from italic to `text-gray-500 text-sm font-medium` (remove italic — it looks dated paired with the gray)
- Description text: `text-gray-600 text-sm leading-relaxed text-center`
- Remove `min-height: 180px; max-height: 180px` on description — let content breathe, use line-clamp if needed: `line-clamp-6`

**Card container:** Change from `flex-wrap: nowrap` to a responsive grid:
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center
```
This handles all screen sizes gracefully.

---

## Phase 3: Other Public Pages

### 3A. About Page

**File:** `src/pages/About.jsx`, `src/styles/about.css`

**Current problems:**
- Title banner is green background with gray text — inverted from other pages (inconsistency)
- Video container is gray `rgba(217,217,217,0.9)` with no shadow
- Category buttons (News, School, Art, etc.) have chaotic sizing: Art has `padding: 10px 150px`, Partners has `margin-left: 200px`

**Changes:**

**Title:** Use the same heading pattern as Home page sections:
```jsx
<h1 className="text-3xl font-bold text-brand text-center mt-12">About</h1>
<div className="w-16 h-1 bg-brand rounded-full mx-auto mt-3 mb-8"></div>
```

**Video container:** Modern responsive embed:
```jsx
<div className="max-w-4xl mx-auto">
  <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-gray-900/5">
    <iframe className="w-full h-full" ... />
  </div>
</div>
```
Delete the hardcoded `width: 1055px; height: 400px` from `about.css`.

**Category buttons grid:** Replace the chaotic flex columns with a uniform grid:
```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-10">
  {['News', 'School', 'Art', 'Music', 'Culture', 'Partners', 'Values', 'Mission'].map(item => (
    <button key={item} className="bg-white border border-gray-200 px-6 py-4 rounded-xl 
                                   text-brand font-medium text-lg
                                   hover:border-brand hover:shadow-md transition-all text-center">
      {item}
    </button>
  ))}
</div>
```
This replaces ALL the individual `.new-css`, `.school-css`, `.art-css`, `.partners-css`, etc. classes. Every button gets the same sizing, same style. Art no longer has `150px` padding, Partners no longer has `200px` left margin.

**CSS to delete:** The entire `src/styles/about.css` and `src/styles/main-page-responsive-css/responsive-about.css`.

### 3B. Products Page

**File:** `src/pages/Products.jsx`, `src/styles/products.css`

**Current problems:**
- Main container: gray `rgba(217,217,217,1)`, fixed `1055px × 400px`
- Product name on black background — harsh contrast
- "Pay" button is pure black — inconsistent with green brand
- Referral modal uses `margin-right: -600px` for close button (same hack as login modal)

**Changes:**
- Main container: `bg-white rounded-2xl shadow-card p-6 sm:p-8` (white card)
- Product name badge: Change from black to brand green: `bg-brand text-white px-4 py-2 rounded-lg font-medium`
- Product image: `rounded-xl border border-gray-200` (remove the green border — it competes with the name badge)
- Price: `text-3xl font-bold text-brand` (green price stands out)
- Add to Cart button: Keep `bg-brand text-white rounded-full` — this is correct
- Pay button: Change from black `rgb(0,0,0)` to `bg-brand-dark text-white rounded-full` (dark green instead of black)
- Cart icon: Replace PNG with SVG, add badge for count using `absolute -top-1 -right-1 bg-accent-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center`
- Referral modal: Apply same fixes as Login Modal — white background, proper close button positioning, `backdrop-blur-sm`
- Remove the `margin-right: -600px` from `.cancel-student-referral-box-css`

### 3C. Subjects Page

**File:** `src/pages/Subjects.jsx`, `src/styles/subjects.css`

**Current problems:**
- Each subject is an accordion with gray background, green title badge, and a video container
- Down arrow icon has `margin-left: 900px` — hardcoded offset
- Video container is `800px` fixed width with a green border

**Changes:**
- Subject accordion header: `bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all cursor-pointer flex items-center justify-between px-6 py-4`
- Title badge: Keep `bg-white text-brand` pill but clean up: `px-4 py-1.5 rounded-lg font-semibold`
- Down arrow: Replace `margin-left: 900px` with `ml-auto` (Flexbox's natural right-alignment)
- Replace PNG arrow with SVG chevron: `w-5 h-5 text-gray-400 transition-transform` (add `rotate-180` class when expanded)
- Video container: `w-full max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden border-2 border-brand/30` (responsive, lighter green border)
- Video title & exercise buttons: Keep green but use consistent pill styling: `bg-brand text-white px-4 py-2 rounded-full text-sm font-medium`

### 3D. Learn More Page

**File:** `src/pages/LearnMore.jsx`, `src/styles/learn-more.css`

**Current:** Q&A blocks with gray questions (`rgba(217,217,217,1)`) and green answers (`rgb(0,98,54)`).

**Changes:**
- Question blocks: `bg-white rounded-xl shadow-card p-5 text-brand font-medium` (white card, green text — keeps the green identity)
- Answer blocks: `bg-brand/5 rounded-xl p-5 text-gray-700 leading-relaxed border-l-4 border-brand` (very light green tint instead of solid green background — makes the text actually readable)
- Spacing between Q&A pairs: `space-y-4`

---

## Phase 4: Dashboard/Panel Layouts

### 4A. Admin, Student, Teacher Layouts

**Files:**
- `src/pages/panel/admin/DashboardLayout.jsx`
- `src/pages/panel/student/StudentLayout.jsx`
- `src/pages/panel/teacher/TeacherLayout.jsx`

**Current state:** These are already mostly Tailwind-based (good!), but use inconsistent gray tones:
- Page background: `bg-[#d6dad8]` (a greenish-gray)
- Content area: `bg-[#e4e8e6]` (slightly lighter greenish-gray)
- Sidebar: `bg-[#c8ceca]/80` with `border-[#006236]/40`

**Changes — align with the new surface system:**
- Page background: `bg-surface` (maps to `#F9FAFB` — consistent with public pages)
- Sidebar: `bg-white border-r border-gray-200 shadow-sm` (clean white sidebar instead of translucent gray). Remove `rounded-2xl` and the green border — sidebars should feel structural, not floating.
- Content area: `bg-surface-panel rounded-xl` (maps to `#F3F4F6`)
- Sidebar active state: Keep `text-brand bg-brand-light` (already close to what exists)
- Sidebar inactive: `text-gray-500 hover:text-brand hover:bg-gray-50`

**Header within layouts:** Currently uses the green logout button — keep that. But align the header style:
```
bg-white border-b border-gray-200 px-6 py-4
```

**Help text at bottom:** Keep but style as: `text-center py-4 text-sm text-gray-400`

### 4B. Individual Panel Pages

**Files:** All pages in `src/pages/panel/admin/`, `src/pages/panel/student/`, `src/pages/panel/teacher/`

**General rules for all panel pages:**
- Stat cards: `bg-white rounded-xl shadow-card p-5` with a left-side color accent (green bar or icon)
- Tables: `bg-white rounded-xl shadow-card overflow-hidden` with `divide-y divide-gray-100` rows
- Section headings within panels: `text-xl font-semibold text-gray-900 mb-4`
- Empty states: Center text with `text-gray-400 text-sm` and a subtle icon
- Loading spinners: Keep the green color `border-brand`
- Charts/speedometers: Keep `#006236` for the primary fill, use `#e5e7eb` (gray-200) for unfilled portions instead of `#d9d9d9`

**Admin Dashboard specific (`Dashboard.jsx`):**
- The speedometer SVG already uses `#006236` — keep this
- Change `#d9d9d9` track color to `#e5e7eb` for better contrast on white cards

---

## Phase 5: Registration Pages

**Files:** `src/styles/registration/reg-general.css`, `src/styles/registration/reg-as.css`, `src/styles/registration/student-reg/*.css`

**General approach:**
- These are multi-step form flows. Apply the same input styling as the updated modals:
  - Inputs: `w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all`
  - Labels: `text-sm font-medium text-gray-700 mb-1.5`
  - Submit buttons: `bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-medium transition-colors`
- Step indicator: Use green for completed steps, green outline for current, gray for upcoming:
  ```
  Completed: bg-brand text-white
  Current: border-2 border-brand text-brand
  Upcoming: bg-gray-200 text-gray-400
  ```
- Form containers: `bg-white rounded-2xl shadow-card p-6 sm:p-8 max-w-2xl mx-auto`

---

## Phase 6: CSS Cleanup

After all pages are migrated to Tailwind, delete or empty these legacy CSS files:

**Safe to delete entirely (all rules migrated):**
- `src/styles/general.css`
- `src/styles/home.css`
- `src/styles/about.css`
- `src/styles/products.css`
- `src/styles/subjects.css`
- `src/styles/learn-more.css`
- `src/styles/exercise.css`
- `src/styles/footer/footer.css`
- `src/styles/footer/contact.css`
- `src/styles/footer/locations.css`
- `src/styles/footer/our-pillars.css`
- All files in `src/styles/main-page-responsive-css/`
- All files in `src/styles/footer/footer-responsive-css/`

**Keep but refactor:**
- `src/styles/lesson/lesson-environment.css` — review and migrate to Tailwind
- `src/styles/course/unit-view.css` — review and migrate to Tailwind
- `src/styles/registration/*.css` — migrate to Tailwind

**Then remove the CSS imports from all JSX files.** Each page currently imports 4-6 CSS files (e.g., `Home.jsx` imports `general.css`, `home.css`, `responsive-general.css`, `responsive-home.css`, `footer.css`, `responsive-footer.css`). After migration, none of these imports should remain.

---

## Quick Reference: Color Migration Map

| Current Value | Where Used | New Value | Tailwind Class |
|---|---|---|---|
| `rgb(185, 185, 185)` / `#b9b9b9` | Body background | `#F9FAFB` | `bg-surface` |
| `rgba(217, 217, 217, 1)` / `#d9d9d9` | Modal bg, card bg, banners | `#FFFFFF` | `bg-white` or `bg-surface-card` |
| `rgba(217, 217, 217, 0.6)` | Profile cards, section banners | `#FFFFFF` | `bg-white` |
| `rgb(0, 98, 54)` / `#006236` | Brand green (buttons, text, accents) | `#006236` (keep) | `bg-brand` / `text-brand` |
| `#004d2a` | Hover green | `#004d2a` (keep) | `bg-brand-dark` / `hover:bg-brand-dark` |
| `rgb(143, 146, 145)` | Inactive button gray | Remove (use brand green for all CTAs) | `bg-brand` |
| `rgb(167, 167, 167)` | Statistics labels | `rgba(255,255,255,0.7)` | `text-white/70` |
| `rgba(3, 3, 3)` | Footer background | `#0a2e1a` | Custom dark green |
| `rgb(0, 0, 0)` | Product name, Pay button | `#006236` | `bg-brand` |
| `rgb(197, 34, 31)` / `#c5221f` | Error text, notification badges | `#C5221F` (keep) | `text-accent-red` |
| `rgb(125, 128, 127)` / `#7d807f` | Secondary text | `#6B7280` | `text-gray-500` |
| `#d6dad8` | Dashboard page bg | `#F9FAFB` | `bg-surface` |
| `#e4e8e6` | Dashboard content bg | `#F3F4F6` | `bg-surface-panel` |
| `#c8ceca` | Dashboard sidebar bg | `#FFFFFF` | `bg-white` |

---

## Implementation Order Summary

1. **Phase 0** — Foundation: Tailwind config, body background, debug borders, fixed widths
2. **Phase 1** — Global components: Header, Modals, Footer
3. **Phase 2** — Home page (most visible, most complex)
4. **Phase 3** — About, Products, Subjects, Learn More
5. **Phase 4** — Dashboard layouts (admin, student, teacher)
6. **Phase 5** — Registration pages
7. **Phase 6** — CSS cleanup (delete legacy files, remove imports)

Each phase should be tested in the browser before moving to the next. The site should look correct and consistent after each phase.

---

## Rules for the Implementing Agent

1. **Never break existing functionality.** Every button, link, modal, and form must still work after styling changes. If a CSS class is used in JavaScript logic (e.g., toggling `.active`), migrate the class carefully.
2. **Use the Tailwind config tokens** (`bg-brand`, `text-brand`, `bg-surface`, etc.) instead of hardcoding `bg-[#006236]`. This is the whole point of Phase 0.
3. **Mobile-first.** When adding responsive classes, the base class should target mobile, then layer `sm:`, `md:`, `lg:` breakpoints on top.
4. **Preserve the green.** Every page should still feel "Pamir Academy green". The green is used for: primary buttons, active states, links, key headings, statistics bar, profile image borders. Don't reduce its presence — just ensure it appears on clean white/light backgrounds so it pops more.
5. **Don't add new npm dependencies** for UI (no component libraries like shadcn, MUI, etc.). Tailwind is sufficient.
6. **Test at three widths:** 375px (phone), 768px (tablet), 1440px (desktop). The current site breaks badly on mobile due to hardcoded pixel widths.
7. **When deleting a CSS file,** first search the entire codebase for any import of that file and any reference to its class names. Only delete after confirming all classes have been migrated.
