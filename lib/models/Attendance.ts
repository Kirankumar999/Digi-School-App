import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAttendanceRecord {
  studentId: string;
  studentName: string;
  status: "present" | "absent" | "late" | "leave";
}

export interface IAttendance extends Document {
  date: string;
  classGrade: string;
  section: string;
  records: IAttendanceRecord[];
  markedBy: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalLeave: number;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "late", "leave"],
      required: true,
    },
  },
  { _id: false }
);

const AttendanceSchema = new Schema<IAttendance>(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    classGrade: {
      type: String,
      required: [true, "Class/Grade is required"],
      trim: true,
    },
    section: {
      type: String,
      required: [true, "Section is required"],
      trim: true,
    },
    records: {
      type: [AttendanceRecordSchema],
      default: [],
    },
    markedBy: {
      type: String,
      default: "",
    },
    totalPresent: { type: Number, default: 0 },
    totalAbsent: { type: Number, default: 0 },
    totalLate: { type: Number, default: 0 },
    totalLeave: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AttendanceSchema.index({ date: 1, classGrade: 1, section: 1 }, { unique: true });

if (mongoose.models.Attendance) {
  delete mongoose.models.Attendance;
}

const Attendance: Model<IAttendance> = mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
