import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Teacher from "@/lib/models/Teacher";
import Timetable from "@/lib/models/Timetable";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const DEFAULT_PERIODS = [
  { periodNumber: 1, startTime: "08:00", endTime: "08:10", subject: "Assembly", type: "assembly" as const, teacherName: "", teacherId: "" },
  { periodNumber: 2, startTime: "08:10", endTime: "08:50", subject: "", type: "class" as const, teacherName: "", teacherId: "" },
  { periodNumber: 3, startTime: "08:50", endTime: "09:30", subject: "", type: "class" as const, teacherName: "", teacherId: "" },
  { periodNumber: 4, startTime: "09:30", endTime: "09:45", subject: "Break", type: "break" as const, teacherName: "", teacherId: "" },
  { periodNumber: 5, startTime: "09:45", endTime: "10:25", subject: "", type: "class" as const, teacherName: "", teacherId: "" },
  { periodNumber: 6, startTime: "10:25", endTime: "11:05", subject: "", type: "class" as const, teacherName: "", teacherId: "" },
  { periodNumber: 7, startTime: "11:05", endTime: "11:45", subject: "", type: "class" as const, teacherName: "", teacherId: "" },
  { periodNumber: 8, startTime: "11:45", endTime: "12:30", subject: "Lunch", type: "lunch" as const, teacherName: "", teacherId: "" },
  { periodNumber: 9, startTime: "12:30", endTime: "13:10", subject: "", type: "class" as const, teacherName: "", teacherId: "" },
  { periodNumber: 10, startTime: "13:10", endTime: "13:50", subject: "", type: "class" as const, teacherName: "", teacherId: "" },
];

const SUBJECTS_BY_GRADE: Record<string, string[]> = {
  "1": ["Mathematics", "Marathi", "English", "EVS", "Drawing"],
  "2": ["Mathematics", "Marathi", "English", "EVS", "Drawing"],
  "3": ["Mathematics", "Marathi", "English", "EVS", "Hindi", "Drawing"],
  "4": ["Mathematics", "Marathi", "English", "EVS", "Hindi", "Drawing"],
  "5": ["Mathematics", "Marathi", "English", "EVS", "Hindi", "Drawing"],
  "6": ["Mathematics", "Marathi", "English", "Science", "Hindi", "Social Science", "Drawing"],
  "7": ["Mathematics", "Marathi", "English", "Science", "Hindi", "Social Science", "Drawing"],
  "8": ["Mathematics", "Marathi", "English", "Science", "Hindi", "Social Science", "Drawing"],
  "9": ["Mathematics", "Marathi", "English", "Science", "Hindi", "Social Science", "IT"],
  "10": ["Mathematics", "Marathi", "English", "Science", "Hindi", "Social Science", "IT"],
};

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { grade, section } = await req.json();
    if (!grade || !section) return NextResponse.json({ error: "Grade and section required" }, { status: 400 });

    await connectDB();
    const teachers = await Teacher.find({ status: "Active" }).lean();
    const subjects = SUBJECTS_BY_GRADE[grade] || SUBJECTS_BY_GRADE["5"];

    const schedule = DAYS.map((day) => {
      const periods = DEFAULT_PERIODS.map((p) => {
        if (p.type !== "class") return { ...p };

        const subjectIdx = (p.periodNumber + DAYS.indexOf(day)) % subjects.length;
        const subject = subjects[subjectIdx];
        const teacher = teachers.find((t) => t.subject?.toLowerCase() === subject.toLowerCase());

        return {
          ...p,
          subject,
          teacherName: teacher ? `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() || teacher.teacherId : "",
          teacherId: teacher ? (teacher._id as string).toString() : "",
        };
      });
      return { day, periods };
    });

    const timetableId = `TT-${grade}-${section}-${Date.now().toString(36).toUpperCase()}`;

    await Timetable.updateMany(
      { grade, section, status: "Active" },
      { $set: { status: "Archived" } }
    );

    const timetable = await Timetable.create({
      timetableId,
      grade,
      section,
      schedule,
      status: "Active",
      createdBy: user.name || "",
    });

    return NextResponse.json({ message: "Timetable generated", timetable }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
