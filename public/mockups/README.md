# EduPulse — School Management App (UX/UI Mockup)

A complete, fully usable design mockup for a modern **School Management Application**, built with pure HTML, CSS, and JavaScript. No build step, no frameworks — open `index.html` in any browser.

> Designed by a senior product designer mindset: clean information hierarchy, accessible contrasts, micro-interactions, and a slick dark/light theme.

---

## Features

- **Slick, modern design** — gradient accents, glassmorphism touches, soft shadows, rounded geometry
- **Dark & Light mode** — animated theme toggle, persisted to `localStorage`, respects OS preference on first visit
- **Rich animations** — animated counters, reveal-on-scroll, gradient brand-mark shine, pulsing notification dot, hover lift, doughnut/line chart transitions
- **Fully responsive** — adapts from 1440px desktop to 360px mobile with a mobile sidebar drawer + bottom nav
- **Charts** — Chart.js powered line, doughnut, bar, polar-area visualizations; auto-rebuild on theme change
- **9 complete screens** — covering the full school OS journey

## Screens

| File | Description |
|------|-------------|
| `index.html` | Login / sign-in with hero panel |
| `dashboard.html` | KPI overview, schedule, activity, charts |
| `students.html` | Student directory with filters & pagination |
| `teachers.html` | Faculty directory (card grid) |
| `classes.html` | Subject/class catalogue (rich cards) |
| `attendance.html` | Take attendance + monthly heatmap |
| `timetable.html` | Weekly grid with substitutions & rooms |
| `grades.html` | Performance charts + exam log |
| `fees.html` | Collections, transactions, invoices |
| `messages.html` | Inbox + conversation thread |
| `settings.html` | Profile, appearance, notifications, security |

## File structure

```
School_Management_App/
├── index.html            # Login
├── dashboard.html
├── students.html
├── teachers.html
├── classes.html
├── attendance.html
├── timetable.html
├── grades.html
├── fees.html
├── messages.html
├── settings.html
├── css/
│   └── styles.css        # Design system, themes, components, responsive
├── js/
│   ├── shell.js          # Builds sidebar, top bar and mobile nav into each page
│   └── app.js            # Theme toggle, animations, counters, sidebar drawer
└── README.md
```

## Running

Just open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
The login button navigates to the dashboard. From there, every sidebar / mobile-nav item is wired up.

> No server required. No `npm install`. Pure static.

## Tech & assets (CDN)

- [Inter](https://fonts.google.com/specimen/Inter) — typography
- [Lucide Icons](https://lucide.dev/) — icon set
- [Chart.js 4](https://www.chartjs.org/) — analytics charts

## Design system at a glance

- **Brand gradient**: `#6366f1 → #8b5cf6 → #ec4899` (indigo → violet → pink)
- **Accent gradients**: cool (cyan→indigo), warm (amber→pink), success (emerald→cyan)
- **Radii**: 8 / 12 / 16 / 22 / 28 px scale
- **Motion**: 160 / 260 / 420 ms cubic-bezier(.4,0,.2,1)
- **Shadows**: tier sm / md / lg with brand-tinted glow on hover

## Accessibility

- Focus rings on all interactive elements (`:focus-visible`)
- Color contrast meets WCAG AA on both themes
- Semantic landmarks (`header`, `main`, `aside`, `nav`)
- Keyboard-friendly toggles, switches, and tabs

## Notes for developers

- The shared sidebar/topbar are injected by `js/shell.js` so each page stays small.
  To create a new page, simply add:
  ```html
  <div data-shell page-title="My Page" page-crumbs="Home / My Page">
     ...your content...
  </div>
  <script src="js/shell.js"></script>
  <script src="js/app.js"></script>
  ```
- Theme is controlled by `data-theme="light|dark"` on `<html>`.
- Counters animate any element with `data-count="..."` (optional `data-prefix`, `data-suffix`, `data-decimals`).
- Reveal-on-scroll: add `class="reveal"` to any element.

---

© 2026 EduPulse — Design mockup.
