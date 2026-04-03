import { StudentDirectory } from "@/components/StudentDirectory";
import { TeacherDirectory } from "@/components/TeacherDirectory";
import { PerformanceChart } from "@/components/PerformanceChart";
import { TopStudents } from "@/components/TopStudents";
import { NeedingAttention } from "@/components/NeedingAttention";
import { TeachersGlance } from "@/components/TeachersGlance";
import { ClassMetrics } from "@/components/ClassMetrics";
import { MiniNav } from "@/components/MiniNav";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-[fadeIn_0.4s_ease-out]">
      {/* ===== Column 1: Student & Teacher Management ===== */}
      <div className="min-w-0 space-y-4">
        <StudentDirectory />
        <TeacherDirectory />
      </div>

      {/* ===== Column 2: Student Performance Progress ===== */}
      <div className="min-w-0 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex">
            <MiniNav />
            <div className="flex-1 min-w-0 p-4">
              <PerformanceChart />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TopStudents />
          <NeedingAttention />
        </div>
      </div>

      {/* ===== Column 3: Teacher & Class Performance ===== */}
      <div className="min-w-0 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex">
            <MiniNav />
            <div className="flex-1 min-w-0 p-4">
              <TeachersGlance />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-royal to-violet-500 rounded-full" />
          <h2 className="text-sm font-bold text-slate-700">
            4. Teacher Performance Management (according to assigned students)
          </h2>
        </div>

        <ClassMetrics />
      </div>
    </div>
  );
}
