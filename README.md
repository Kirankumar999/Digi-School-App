# DigiSchool — AI-Powered School Management Platform

<p align="center">
  <img src="public/logo.svg" alt="DigiSchool Logo" width="120" />
</p>

A comprehensive school management application built with **Next.js 15**, **React 19**, **MongoDB**, and **AI APIs** (Gemini & Claude). Designed for primary and secondary schools (Classes 1–12) with AI-driven features for worksheet generation, lesson planning, answer sheet evaluation, report cards, and performance analytics.

Supports **English** and **Marathi (मराठी)** languages with full i18n.

## Features

### Core Management
- **Student Management** — CRUD, Excel bulk upload, profile pictures (camera/upload), detailed profile view with inline editing
- **Teacher Management** — Full teacher records, Excel upload, profile pictures, department/subject filters
- **Class Management** — Create and manage classes, capacity tracking, teacher assignment, schedule management
- **Attendance Tracking** — Daily attendance for students and teachers
- **Exam Management** — Create exams, record results, track performance
- **Fee Management** — Fee structures, payment tracking, transaction history
- **Timetable** — Weekly schedule management per class
- **Notices & Announcements** — School-wide communication system
- **Compliance Dashboard** — Track regulatory requirements

### AI-Powered Features
- **Smart Worksheet Generator** — AI generates MSCERT (Maharashtra State Board)-aligned worksheets with MCQ, short/long answer, fill-in-the-blank, true/false, and match-the-following questions. Supports English, Hindi, Marathi, and Bilingual output. PDF download with answer keys.
- **AI Lesson Plan Generator** — Generates detailed lesson plans with learning objectives, lesson flow timeline, differentiated instruction, board work, homework, and assessment criteria. Multiple teaching methods supported.
- **AI Answer Sheet Evaluator** — Upload or photograph handwritten answer sheets. AI reads handwriting, evaluates answers against MSCERT curriculum, awards marks with per-question feedback, and generates strengths/improvement areas.
- **AI Report Card Generator** — Aggregates student test data across subjects, generates comprehensive report cards with AI-written remarks, co-scholastic grades, strengths, and parent recommendations. Downloadable as branded PDF.
- **AI Doubt Solver** — Students can ask doubts and get AI-powered explanations.
- **Student Performance Analytics** — School-wide overview (subject performance, grade distribution, monthly trends, top performers), individual student analytics with charts, score timelines, and subject breakdowns.

### Internationalization (i18n)
- Full **English** and **Marathi** language support
- Real-time language toggle in the header
- All UI labels, dropdowns, database-driven content translated
- Mukta font for Devanagari script

### Progressive Web App (PWA)
- Installable on mobile and desktop
- Offline indicator
- Service worker for caching

### Authentication & Security
- JWT-based authentication with HTTP-only cookies
- User signup/login/logout with role-based access (Admin, Teacher, Student)
- Profile management with avatar upload
- Route protection for dashboard pages

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Frontend | React 19, Tailwind CSS v4 |
| Backend | Next.js API Routes |
| Database | MongoDB with Mongoose |
| AI | Google Gemini API, Anthropic Claude API |
| Charts | Chart.js + react-chartjs-2 |
| PDF | Puppeteer-core (HTML → PDF) |
| Validation | Zod schema validation |
| Caching | Redis (ioredis) with in-memory fallback |
| Excel | SheetJS (xlsx) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| i18n | Custom React Context with JSON translations |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Google Gemini API key and/or Anthropic API key (for AI features)
- Google Chrome (for PDF generation via Puppeteer)

### Installation

```bash
git clone https://github.com/Kirankumar999/Digi-School-App.git
cd Digi-School-App
npm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

See [`.env.example`](.env.example) for all required variables.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Digi-School-App/
├── app/
│   ├── (dashboard)/              # Protected dashboard pages
│   │   ├── page.tsx              # Dashboard home
│   │   ├── students/             # Student management
│   │   ├── teachers/             # Teacher management
│   │   ├── classes/              # Class management
│   │   ├── attendance/           # Attendance tracking
│   │   ├── exams/                # Exam management
│   │   ├── fees/                 # Fee management
│   │   ├── timetable/            # Timetable scheduling
│   │   ├── notices/              # Announcements
│   │   ├── compliance/           # Compliance dashboard
│   │   ├── worksheets/           # AI Worksheet Generator
│   │   ├── lesson-plans/         # AI Lesson Plan Generator
│   │   ├── doubt-solver/         # AI Doubt Solver
│   │   ├── tests/                # AI Answer Sheet Evaluator
│   │   ├── reports/              # Analytics & Report Cards
│   │   ├── settings/             # App settings
│   │   └── profile/              # User profile
│   ├── api/                      # API routes
│   │   ├── auth/                 # Login, signup, logout, profile
│   │   ├── students/             # Student CRUD, upload, photo
│   │   ├── teachers/             # Teacher CRUD, upload, photo
│   │   ├── classes/              # Class CRUD
│   │   ├── attendance/           # Attendance API
│   │   ├── exams/                # Exam API
│   │   ├── fees/                 # Fee API
│   │   ├── timetable/            # Timetable API
│   │   ├── announcements/        # Announcements API
│   │   ├── worksheets/           # Generate, list, PDF, syllabus
│   │   ├── lesson-plans/         # Generate, list, PDF
│   │   ├── doubt-solver/         # AI doubt resolution
│   │   ├── tests/                # Evaluate, list, detail
│   │   ├── report-cards/         # Generate, list, PDF
│   │   └── analytics/            # Overview, student analytics
│   ├── login/                    # Login page
│   └── signup/                   # Signup page
├── components/                   # Reusable UI components
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── Header.tsx                # Dashboard header with language toggle
│   ├── Footer.tsx                # Dashboard footer
│   ├── OfflineIndicator.tsx      # PWA offline status
│   ├── PWAInstall.tsx            # PWA install prompt
│   └── ...                       # Profile modals, etc.
├── lib/
│   ├── models/                   # Mongoose schemas
│   ├── i18n/                     # Internationalization
│   │   ├── en.json               # English translations
│   │   ├── mr.json               # Marathi translations
│   │   └── LocaleContext.tsx      # i18n React context
│   ├── ai/                       # AI client utilities
│   ├── worksheet/                # Worksheet AI pipeline
│   ├── lesson-plan/              # Lesson plan AI pipeline
│   ├── test-evaluator/           # Answer evaluation AI pipeline
│   ├── report-card/              # Report card AI pipeline
│   ├── data/                     # MSCERT syllabus data
│   ├── auth.ts                   # JWT helpers
│   ├── mongodb.ts                # DB connection
│   └── AuthContext.tsx            # Client auth context
├── public/                       # Static assets
│   ├── logo.svg                  # App logo (SVG)
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker
└── .env.example                  # Environment variable template
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/students` | List students (search, filter, paginate) |
| POST | `/api/students` | Add student |
| POST | `/api/students/upload` | Bulk upload via Excel |
| GET | `/api/teachers` | List teachers |
| POST | `/api/teachers` | Add teacher |
| GET | `/api/classes` | List classes |
| POST | `/api/attendance` | Record attendance |
| GET | `/api/exams` | List exams |
| GET | `/api/fees` | Fee structures and transactions |
| GET | `/api/timetable` | Get timetable |
| POST | `/api/worksheets/generate` | Generate AI worksheet |
| GET | `/api/worksheets/:id/pdf` | Download worksheet PDF |
| POST | `/api/lesson-plans/generate` | Generate AI lesson plan |
| POST | `/api/tests/evaluate` | AI evaluate answer sheet |
| POST | `/api/report-cards/generate` | Generate AI report card |
| GET | `/api/report-cards/:id/pdf` | Download report card PDF |
| GET | `/api/analytics/overview` | School-wide analytics |
| GET | `/api/analytics/student/:id` | Individual student analytics |

## License

This project is for educational purposes.
