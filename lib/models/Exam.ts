import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExamSubject {
  name: string;
  maxMarks: number;
  passingMarks: number;
  date: string;
}

export interface IExam extends Document {
  examId: string;
  name: string;
  type: "Unit Test" | "Semester" | "Annual" | "Practice";
  grade: string;
  section: string;
  academicYear: string;
  subjects: IExamSubject[];
  startDate: string;
  endDate: string;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSubjectSchema = new Schema<IExamSubject>(
  {
    name: { type: String, required: true, trim: true },
    maxMarks: { type: Number, required: true, min: 0 },
    passingMarks: { type: Number, required: true, min: 0 },
    date: { type: String, default: "" },
  },
  { _id: false }
);

const ExamSchema = new Schema<IExam>(
  {
    examId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Unit Test", "Semester", "Annual", "Practice"], required: true },
    grade: { type: String, required: true, trim: true },
    section: { type: String, trim: true, default: "" },
    academicYear: {
      type: String,
      trim: true,
      default: () => { const y = new Date().getFullYear(); return `${y}-${y + 1}`; },
    },
    subjects: { type: [ExamSubjectSchema], default: [] },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    status: { type: String, enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], default: "Upcoming" },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

if (mongoose.models.Exam) delete mongoose.models.Exam;

const Exam: Model<IExam> = mongoose.model<IExam>("Exam", ExamSchema);
export default Exam;
