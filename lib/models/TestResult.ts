import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestionEval {
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  marksAwarded: number;
  maxMarks: number;
  feedback: string;
  isCorrect: boolean;
}

export interface ITestResult extends Document {
  testResultId: string;
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  studentGrade: string;
  studentSection: string;
  testName: string;
  subject: string;
  chapter: string;
  classNum: number;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  grade: string;
  questions: IQuestionEval[];
  overallFeedback: string;
  strengths: string[];
  areasToImprove: string[];
  imageData: string;
  evaluatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionEvalSchema = new Schema({
  questionNumber: { type: Number, required: true },
  questionText: { type: String, default: "" },
  studentAnswer: { type: String, default: "" },
  correctAnswer: { type: String, default: "" },
  marksAwarded: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  feedback: { type: String, default: "" },
  isCorrect: { type: Boolean, default: false },
}, { _id: false });

const TestResultSchema = new Schema<ITestResult>(
  {
    testResultId: { type: String, required: true, unique: true, trim: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    studentGrade: { type: String, required: true },
    studentSection: { type: String, default: "" },
    testName: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    chapter: { type: String, trim: true, default: "" },
    classNum: { type: Number, required: true, min: 1, max: 12 },
    totalMarks: { type: Number, required: true },
    marksObtained: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, default: "" },
    questions: [QuestionEvalSchema],
    overallFeedback: { type: String, default: "" },
    strengths: [{ type: String }],
    areasToImprove: [{ type: String }],
    imageData: { type: String, default: "" },
    evaluatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

TestResultSchema.index({ studentId: 1, createdAt: -1 });
TestResultSchema.index({ subject: 1, classNum: 1 });

if (mongoose.models.TestResult) {
  delete mongoose.models.TestResult;
}

const TestResult: Model<ITestResult> = mongoose.model<ITestResult>("TestResult", TestResultSchema);

export default TestResult;
