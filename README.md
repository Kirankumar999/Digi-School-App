# DigiSchool — AI-Powered School Management Platform

A comprehensive school management application built with **Next.js 16**, **React 19**, **MongoDB**, and **Claude AI**. Designed for primary and secondary schools (Classes 1–12) with AI-driven features for worksheet generation, lesson planning, answer sheet evaluation, report cards, and performance analytics.

## Features

### Core Management
- **Student Management** — CRUD, Excel bulk upload, profile pictures (camera/upload), detailed profile view with inline editing
- **Teacher Management** — Full teacher records, Excel upload, profile pictures, department/subject filters
- **Class Management** — Create and manage classes, capacity tracking, teacher assignment, schedule management

### AI-Powered Features
- **Smart Worksheet Generator** — AI generates MSCERT (Maharashtra State Board)-aligned worksheets with MCQ, short/long answer, fill-in-the-blank, true/false, and match-the-following questions. Supports English, Hindi, Marathi, and Bilingual output. PDF download with answer keys.
- **AI Lesson Plan Generator** — Generates detailed lesson plans with learning objectives, lesson flow timeline, differentiated instruction, board work, homework, and assessment criteria. Multiple teaching methods supported.
- **AI Answer Sheet Evaluator** — Upload or photograph handwritten answer sheets. Claude's vision AI reads handwriting, evaluates answers against MSCERT curriculum, awards marks with per-question feedback, and generates strengths/improvement areas.
- **AI Report Card Generator** — Aggregates student test data across subjects, generates comprehensive report cards with AI-written remarks, co-scholastic grades, strengths, and parent recommendations. Downloadable as branded PDF.
- **Student Performance Analytics** — School-wide overview (subject performance, grade distribution, monthly trends, top performers), individual student analytics with charts, score timelines, and subject breakdowns.

### Authentication & Security
- JWT-based authentication with HTTP-only cookies
- User signup/login/logout
- Profile management with avatar upload
- Route protection for dashboard pages

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Frontend | React 19, Tailwind CSS v4 |
| Backend | Next.js API Routes |
| Database | MongoDB with Mongoose |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Charts | Chart.js + react-chartjs-2 |
| PDF | Puppeteer-core (HTML → PDF) |
| Validation | Zod schema validation |
| Caching | Redis (ioredis) with in-memory fallback |
| Excel | SheetJS (xlsx) |
| Auth | JWT (jsonwebtoken) + bcryptjs |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Anthropic API key (for AI features)
- Google Chrome (for PDF generation via Puppeteer)

### Installation

```bash
git clone <your-repo-url>
cd Digi-School-App
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/digischool
JWT_SECRET=your-jwt-secret-key
ANTHROPIC_API_KEY=your-anthropic-api-key
CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
REDIS_URL=redis://localhost:6379  # optional — falls back to in-memory cache
```

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
│   ├── (dashboard)/          # Protected dashboard pages
│   │   ├── page.tsx          # Dashboard home
│   │   ├── students/         # Student management
│   │   ├── teachers/         # Teacher management
│   │   ├── classes/          # Class management
│   │   ├── worksheets/       # AI Worksheet Generator
│   │   ├── lesson-plans/     # AI Lesson Plan Generator
│   │   ├── tests/            # AI Answer Sheet Evaluator
│   │   └── reports/          # Analytics & Report Cards
│   ├── api/                  # API routes
│   │   ├── auth/             # Login, signup, logout, profile
│   │   ├── students/         # Student CRUD, upload, photo
│   │   ├── teachers/         # Teacher CRUD, upload, photo
│   │   ├── classes/          # Class CRUD
│   │   ├── worksheets/       # Generate, list, PDF, syllabus
│   │   ├── lesson-plans/     # Generate, list, PDF
│   │   ├── tests/            # Evaluate, list, detail
│   │   ├── report-cards/     # Generate, list, PDF
│   │   └── analytics/        # Overview, student analytics
│   ├── login/                # Login page
│   └── signup/               # Signup page
├── components/               # Reusable UI components
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Header.tsx            # Dashboard header
│   ├── StudentProfile.tsx    # Student detail modal
│   ├── TeacherProfile.tsx    # Teacher detail modal
│   ├── ClassProfile.tsx      # Class detail modal
│   └── ...
├── lib/
│   ├── models/               # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Student.ts
│   │   ├── Teacher.ts
│   │   ├── Class.ts
│   │   ├── Worksheet.ts
│   │   ├── LessonPlan.ts
│   │   ├── TestResult.ts
│   │   └── ReportCard.ts
│   ├── worksheet/            # Worksheet AI pipeline
│   ├── lesson-plan/          # Lesson plan AI pipeline
│   ├── test-evaluator/       # Answer evaluation AI pipeline
│   ├── report-card/          # Report card AI pipeline
│   ├── data/                 # MSCERT syllabus data
│   ├── auth.ts               # JWT helpers
│   ├── mongodb.ts            # DB connection
│   └── AuthContext.tsx        # Client auth context
└── public/                   # Static assets
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
| POST | `/api/worksheets/generate` | Generate AI worksheet |
| GET | `/api/worksheets/:id/pdf` | Download worksheet PDF |
| POST | `/api/lesson-plans/generate` | Generate AI lesson plan |
| POST | `/api/tests/evaluate` | AI evaluate answer sheet (vision) |
| GET | `/api/tests` | List test results |
| POST | `/api/report-cards/generate` | Generate AI report card |
| GET | `/api/report-cards/:id/pdf` | Download report card PDF |
| GET | `/api/analytics/overview` | School-wide analytics |
| GET | `/api/analytics/student/:id` | Individual student analytics |

## License

This project is for educational purposes.
