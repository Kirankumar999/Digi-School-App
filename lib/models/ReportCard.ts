import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubjectGrade {
  subject: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  grade: string;
  testsCount: number;
  remarks: string;
}

export interface IReportCard extends Document {
  reportCardId: string;
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  studentGrade: string;
  studentSection: string;
  classNum: number;
  term: string;
  academicYear: string;
  subjectGrades: ISubjectGrade[];
  overallPercentage: number;
  overallGrade: string;
  rank: string;
  attendance: { totalDays: number; presentDays: number; percentage: number };
  aiRemarks: string;
  strengths: string[];
  areasToImprove: string[];
  recommendations: string[];
  teacherComments: string;
  principalComments: string;
  coScholastic: { activity: string; grade: string }[];
  generatedBy: string;
  pdfPath: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectGradeSchema = new Schema(
  {
    subject: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    marksObtained: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    testsCount: { type: Number, default: 0 },
    remarks: { type: String, default: "" },
  },
  { _id: false }
);

const ReportCardSchema = new Schema<IReportCard>(
  {
    reportCardId: { type: String, required: true, unique: true, trim: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    studentGrade: { type: String, required: true },
    studentSection: { type: String, default: "" },
    classNum: { type: Number, required: true, min: 1, max: 12 },
    term: { type: String, required: true, enum: ["Term 1", "Term 2", "Annual"] },
    academicYear: { type: String, required: true },
    subjectGrades: [SubjectGradeSchema],
    overallPercentage: { type: Number, required: true },
    overallGrade: { type: String, required: true },
    rank: { type: String, default: "" },
    attendance: {
      totalDays: { type: Number, default: 0 },
      presentDays: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
    },
    aiRemarks: { type: String, default: "" },
    strengths: [{ type: String }],
    areasToImprove: [{ type: String }],
    recommendations: [{ type: String }],
    teacherComments: { type: String, default: "" },
    principalComments: { type: String, default: "" },
    coScholastic: [
      {
        activity: { type: String },
        grade: { type: String },
      },
    ],
    generatedBy: { type: String, default: "" },
    pdfPath: { type: String, default: "" },
  },
  { timestamps: true }
);

ReportCardSchema.index({ studentId: 1, term: 1, academicYear: 1 });

if (mongoose.models.ReportCard) {
  delete mongoose.models.ReportCard;
}

const ReportCard: Model<IReportCard> = mongoose.model<IReportCard>("ReportCard", ReportCardSchema);
export default ReportCard;
