<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-r183-000?style=for-the-badge&logo=threedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Zero_Date_Libraries-✓-22c55e?style=for-the-badge" />
</p>

# 📅 TUF Interactive Wall Calendar

> A premium, physics-driven wall calendar built entirely in React — no external date libraries. Features realistic page-flip animations, 3D parallax tilt, an immersive WebGL starfield, drag-to-select date ranges, and an intelligent notes system that autonomously detects dates from natural language.

<!-- Replace with actual screenshot -->
![Calendar Preview](https://via.placeholder.com/1200x700/0d0d0d/f97316?text=TUF+Interactive+Wall+Calendar)

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| 🌐 **Live Demo** | [Live Demo URL — Placeholder] |
| 🎥 **Video Walkthrough** | [Video Walkthrough URL — Placeholder] |
| 📦 **Repository** | [github.com/shailesh2909/tuf-assesment](https://github.com/shailesh2909/tuf-assesment) |

---

## 🧠 Overview & Product Philosophy

Most calendar UIs are flat, lifeless grids. This project rejects that paradigm entirely.

The core design thesis was: **"What if a digital calendar felt as tangible as the one hanging on your wall?"** — combining realistic paper physics, invisible-until-needed navigation, and a dark-mode terminal-inspired aesthetic inspired by the [takeUforward](https://takeuforward.org/) brand.

### Why Physics Over Flat UI?

- **Tactile memory** — Users develop spatial memory with page-flip interactions. A physically simulated calendar creates stronger mental anchors for date recall.
- **Invisible UI is better UI** — Navigation arrows only appear contextually. The hover zones and floating cursor pill reduce visual clutter to zero when not in use.
- **Zero external date math** — All date calculations (days in month, first day offset, leap years) are derived from native `Date()` constructor math. No `date-fns`, no `moment.js`, no `dayjs`. This was a deliberate constraint to demonstrate raw JavaScript proficiency.

---

## ✨ Core Features

### 🃏 Realistic Page-Flip Animations
Utilized `react-pageflip`'s physics engine to simulate authentic paper peeling — complete with shadow mapping, page curl depth, and configurable flip timing (1.1s). The flip direction, shadow opacity, and z-indexing are fine-tuned for a soft-paper feel rather than rigid CSS rotations.

### 🎯 Interactive 3D Parallax Tilt
The entire calendar responds to mouse movement with a spring-physics 3D tilt effect powered by `framer-motion`. The `perspective: 1000px` parent combined with `rotateX`/`rotateY` on a spring (`stiffness: 75, damping: 20`) creates a premium depth-of-field sensation.

### 🌌 Immersive WebGL Background
A Three.js-powered scene (`@react-three/fiber` + `@react-three/drei`) renders behind the calendar with:
- A procedural **starfield** (2000 particles, depth-faded)
- **Floating icosahedron nodes** representing DSA concepts, with wireframe and solid variants
- Dual-point lighting (orange + green) for atmospheric depth

### 📐 Drag-to-Select Date Ranges
Custom grid interaction logic using `onMouseDown` → `onMouseEnter` → `onMouseUp` event chain. Users can click-and-drag across any date cells to highlight a contiguous range, displayed with smooth orange highlight bridges and scaled endpoints. A global `mouseup` listener ensures drag completion even when the cursor leaves the grid.

### 🧠 Agentic "Smart" Notes
The notes panel uses **Regex-powered NLP** to autonomously detect date mentions in plain text:
```
Pattern: /\b(\d{1,2})(?:st|nd|rd|th)?\b/gi
```
When a user types `"Meeting on the 15th"` or `"Deploy by 3rd"`, the parser extracts the day numbers and places a **red dot indicator** (●) on exactly those dates in the calendar grid — zero user configuration required.

### ♿ Keyboard Accessibility (a11y)
Full WCAG-compliant keyboard navigation:
- **Tab** into the calendar grid
- **Arrow Keys** (←→↑↓) traverse dates with 7-column awareness
- **Enter** selects the focused date
- Proper `role="grid"`, `role="gridcell"`, `aria-label`, and `aria-selected` attributes
- Visual **focus ring** with glow effect on the active cell

### 📱 Fully Responsive Design
The calendar maintains its 800×1000 internal layout at all viewport sizes via a custom `useCalendarScale()` hook that applies `CSS transform: scale()`. On mobile:
- Scale factor dynamically computed from `window.innerWidth` / `window.innerHeight`
- Navigation arrows relocate inside the calendar edges
- Arrow buttons gain `backdrop-filter: blur(8px)` for glassmorphism

### ♾️ Cyclic Month Navigation
December → January and January → December transitions are seamless. The navigation logic wraps indices modulo 12, using `turnToPage()` for boundary jumps and `flip()` for animated intermediate transitions.

### 💾 localStorage Persistence
Notes auto-persist to `localStorage` under the key `tufCalNotes`. Notes are serialized per-month as a JSON map (`{ JANUARY: "text", ... }`). A toast notification (`framer-motion` AnimatePresence) confirms each save.

### 🖌️ TUF Brand Design System
A centralized design token object (`TUF = { bg, surface, border, orange, ... }`) ensures perfect brand consistency. All 12 months feature curated Unsplash hero images paired with DSA topic labels (Arrays, DP, Graphs, etc.) and category tags.

---

## 🏗️ Technical Architecture

```
┌──────────────────────────────────────────────────────┐
│                    App (Orchestrator)                  │
│  ┌──────────┐  ┌───────────┐  ┌────────────────────┐ │
│  │  State    │  │  Scale    │  │   3D Tilt Engine   │ │
│  │  Manager  │  │  Engine   │  │  (mousePos spring) │ │
│  │ notes{}   │  │ useScale  │  │  framer-motion     │ │
│  │ curPage   │  │ isMobile  │  │  rotateX/Y         │ │
│  │ selRange  │  │ scale     │  │                    │ │
│  └─────┬────┘  └─────┬─────┘  └────────┬───────────┘ │
│        │             │                  │             │
│  ┌─────▼─────────────▼──────────────────▼───────────┐ │
│  │              motion.div (3D wrapper)              │ │
│  │  ┌─────────────────────────────────────────────┐  │ │
│  │  │         HTMLFlipBook (Physics Engine)        │  │ │
│  │  │  ┌───────────────────────────────────────┐  │  │ │
│  │  │  │         CalendarPage × 12             │  │  │ │
│  │  │  │  ┌─────────┐  ┌──────────────────┐   │  │  │ │
│  │  │  │  │  Hero    │  │  Bottom Panel    │   │  │  │ │
│  │  │  │  │  Image   │  │  ┌────┐ ┌─────┐ │   │  │  │ │
│  │  │  │  │  + Badge │  │  │Note│ │Grid │ │   │  │  │ │
│  │  │  │  │  + Tag   │  │  │    │ │     │ │   │  │  │ │
│  │  │  │  └─────────┘  │  │    │ │Drag │ │   │  │  │ │
│  │  │  │               │  │    │ │Range│ │   │  │  │ │
│  │  │  │               │  └────┘ └─────┘ │   │  │  │ │
│  │  │  │               └──────────────────┘   │  │  │ │
│  │  │  └───────────────────────────────────────┘  │  │ │
│  │  └─────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────┘ │
│                                                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │           TUFBackground3D (WebGL Canvas)           │ │
│  │  Stars(2000) + FloatingNodes(5) + Dual Lighting    │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### State Flow

| State | Owner | Consumers | Persistence |
|-------|-------|-----------|-------------|
| `notes{}` | App | CalendarPage (via `initialNote` prop) | `localStorage` |
| `curPage` | App | HTMLFlipBook, CalendarPage (`isActivePage`) | Memory |
| `selStart/selEnd` | App | CalendarPage (highlight rendering) | Memory |
| `localNote` | CalendarPage | Textarea, `useMentionedDays` hook | Ephemeral (saved on click) |
| `mousePos` | App | `motion.div` tilt animation | Memory |
| `scale/isMobile` | `useCalendarScale` | Layout wrapper, arrow positioning | Memory |

### Key Architectural Decisions

1. **Local Note State Isolation** — The textarea in each `CalendarPage` uses its own `useState(localNote)` instead of lifting every keystroke to App. This prevents the entire 12-page flipbook from re-rendering on each character typed — a critical performance optimization.

2. **CSS `transform: scale()` Responsiveness** — Rather than rebuilding layouts for mobile, the entire 800×1000 calendar is rendered at full resolution and scaled via CSS transforms. This preserves pixel-perfect rendering at any viewport size with zero layout recalculation.

3. **`forwardRef` for Physics Binding** — `CalendarPage` uses `React.forwardRef` so that `react-pageflip` can attach its internal DOM measurement refs to each page for accurate flip physics calculations.

4. **`useMemo` for Regex Parsing** — The `useMentionedDays` hook memoizes regex extraction so date detection only recalculates when the note text or month boundary actually changes.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2 | Component architecture & hooks |
| **Vite** | 8.0 | Build tool & HMR dev server |
| **Tailwind CSS** | 4.2 | Utility-first styling |
| **react-pageflip** | 2.0 | Page-flip physics simulation |
| **framer-motion** | 12.38 | Spring animations, 3D tilt, toast transitions |
| **Three.js** | r183 | WebGL background scene |
| **@react-three/fiber** | 9.5 | React reconciler for Three.js |
| **@react-three/drei** | 10.7 | Stars, Float, and helper components |
| **lucide-react** | 1.7 | Crisp SVG icon system |
| **Native `Date()`** | — | All date math — zero external date libraries |

---

## 🚀 Local Setup & Installation

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or yarn/pnpm)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/shailesh2909/tuf-assesment.git
cd tuf-assesment/calendar-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will be live at **`http://localhost:5173`** with hot module replacement enabled.

### Production Build

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
calendar-app/
├── index.html                # Entry HTML with viewport meta
├── vite.config.js            # Vite + React plugin configuration
├── eslint.config.js          # ESLint rules
├── package.json              # Dependencies & scripts
├── README.md                 # This file
├── public/
│   ├── favicon.svg           # Browser tab icon
│   └── icons.svg             # Icon sprites
└── src/
    ├── main.jsx              # React DOM root mount
    ├── App.jsx               # Core application (~620 lines)
    ├── Background3D.jsx      # Three.js WebGL starfield scene
    ├── index.css             # Global styles + Tailwind imports
    ├── App.css               # Component-specific styles
    └── assets/
        ├── hero.png          # Hero image asset
        ├── react.svg         # React logo
        └── vite.svg          # Vite logo
```

---

## 🗺️ Future Roadmap

With additional development time, the following enhancements are planned:

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 High | **Year Navigation** | Arrows or dropdown to switch between years (2022, 2023, ...) |
| 🔴 High | **Event CRUD System** | Click a date → modal for creating/editing/deleting events with title, time, and color coding |
| 🟡 Medium | **Drag Gestures on Mobile** | Touch-based swipe-to-flip using `react-pageflip`'s touch API |
| 🟡 Medium | **Export to ICS** | Generate `.ics` calendar files from saved notes for importing into Google Calendar / Outlook |
| 🟢 Low | **Theme Switcher** | Toggle between TUF dark mode, light mode, and custom color themes |
| 🟢 Low | **Print-Friendly View** | CSS `@media print` stylesheet for printing individual months |
| 🟢 Low | **PWA Support** | Service worker + manifest for offline access and "Add to Home Screen" |

---

## 📝 Design Decisions Log

| Decision | Rationale |
|----------|-----------|
| No `date-fns` / `moment.js` | Demonstrates raw JS date math proficiency; reduces bundle by ~15KB gzipped |
| `react-pageflip` over CSS animations | CSS `rotateY` produces rigid, mechanical flips. The physics engine provides natural paper curl, shadow mapping, and momentum |
| `JetBrains Mono` font | Monospace typeface aligns with the "developer tool" brand identity of TUF |
| `localStorage` over backend | Keeps the project strictly frontend-only per challenge requirements; instant save/load with zero latency |
| `transform: scale()` over responsive layouts | Single render path for all viewports; avoids duplicating layout logic for mobile/tablet/desktop breakpoints |
| Local textarea state | Prevents N×12 re-renders per keystroke by isolating note editing from the App-level state tree |

---

<p align="center">
  <sub>Built with ☕ and obsessive attention to detail for the <strong>takeUforward Frontend Engineering Challenge</strong></sub>
</p>
