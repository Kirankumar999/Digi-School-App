import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPeriod {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  teacherId: string;
  type: "class" | "break" | "assembly" | "lunch" | "free";
}

export interface IDaySchedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  periods: IPeriod[];
}

export interface ITimetable extends Document {
  timetableId: string;
  grade: string;
  section: string;
  academicYear: string;
  schedule: IDaySchedule[];
  effectiveFrom: string;
  status: "Active" | "Draft" | "Archived";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const PeriodSchema = new Schema<IPeriod>(
  {
    periodNumber: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: String, default: "" },
    teacherName: { type: String, default: "" },
    teacherId: { type: String, default: "" },
    type: { type: String, enum: ["class", "break", "assembly", "lunch", "free"], default: "class" },
  },
  { _id: false }
);

const DayScheduleSchema = new Schema<IDaySchedule>(
  {
    day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], required: true },
    periods: { type: [PeriodSchema], default: [] },
  },
  { _id: false }
);

const TimetableSchema = new Schema<ITimetable>(
  {
    timetableId: { type: String, required: true, unique: true, trim: true },
    grade: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    academicYear: {
      type: String,
      trim: true,
      default: () => { const y = new Date().getFullYear(); return `${y}-${y + 1}`; },
    },
    schedule: { type: [DayScheduleSchema], default: [] },
    effectiveFrom: { type: String, default: () => new Date().toISOString().split("T")[0] },
    status: { type: String, enum: ["Active", "Draft", "Archived"], default: "Draft" },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

TimetableSchema.index({ grade: 1, section: 1, academicYear: 1, status: 1 });

if (mongoose.models.Timetable) delete mongoose.models.Timetable;

const Timetable: Model<ITimetable> = mongoose.model<ITimetable>("Timetable", TimetableSchema);
export default Timetable;
