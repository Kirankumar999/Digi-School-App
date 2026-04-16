import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubjectMark {
  subject: string;
  maxMarks: number;
  obtained: number;
  grade: string;
  passingMarks: number;
  passed: boolean;
}

export interface IExamResult extends Document {
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  marks: ISubjectMark[];
  totalMax: number;
  totalObtained: number;
  percentage: number;
  overallGrade: string;
  rank: number;
  status: "Pass" | "Fail";
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectMarkSchema = new Schema<ISubjectMark>(
  {
    subject: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    obtained: { type: Number, required: true },
    grade: { type: String, default: "" },
    passingMarks: { type: Number, default: 0 },
    passed: { type: Boolean, default: true },
  },
  { _id: false }
);

const ExamResultSchema = new Schema<IExamResult>(
  {
    examId: { type: String, required: true },
    examName: { type: String, required: true, trim: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    section: { type: String, trim: true, default: "" },
    marks: { type: [SubjectMarkSchema], default: [] },
    totalMax: { type: Number, default: 0 },
    totalObtained: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    overallGrade: { type: String, default: "" },
    rank: { type: Number, default: 0 },
    status: { type: String, enum: ["Pass", "Fail"], default: "Pass" },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

ExamResultSchema.index({ examId: 1, studentId: 1 }, { unique: true });

if (mongoose.models.ExamResult) delete mongoose.models.ExamResult;

const ExamResult: Model<IExamResult> = mongoose.model<IExamResult>("ExamResult", ExamResultSchema);
export default ExamResult;
