# DigiSchool - School Management Portal

Management of the school activities, performance evaluations based on exam results. It includes fantastic AI features.

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **Tailwind CSS v4**
- **Chart.js** with react-chartjs-2
- **TypeScript**

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
  layout.tsx           - Root layout with Sidebar, Header, Footer
  page.tsx             - Dashboard page (3-column grid)
  globals.css          - Tailwind v4 theme configuration
components/
  Sidebar.tsx          - Collapsible dark navy sidebar
  Header.tsx           - Sticky header with notifications
  Footer.tsx           - Copyright bar with links
  StudentDirectory.tsx - Student table with search & filters
  TeacherDirectory.tsx - Teacher table with search & filters
  PerformanceChart.tsx - Chart.js bar chart
  TopStudents.tsx      - Top performing students
  NeedingAttention.tsx - Students needing attention
  TeachersGlance.tsx   - Teacher performance overview
  ClassMetrics.tsx     - Class progress with donut charts
  DonutChart.tsx       - Reusable SVG donut chart
  MiniNav.tsx          - Icon-only mini navigation
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
