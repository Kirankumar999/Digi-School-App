import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDoubtQuestion extends Document {
  studentId: string;
  studentName: string;
  classGrade: string;
  subject: string;
  chapter: string;
  question: string;
  questionImage: string;
  answer: string;
  language: "English" | "Marathi" | "Hindi";
  answeredBy: string;
  status: "Answered" | "Pending" | "Failed";
  createdAt: Date;
  updatedAt: Date;
}

const DoubtQuestionSchema = new Schema<IDoubtQuestion>(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, required: true, trim: true },
    classGrade: { type: String, required: true, trim: true },
    subject: { type: String, trim: true, default: "" },
    chapter: { type: String, trim: true, default: "" },
    question: { type: String, default: "" },
    questionImage: { type: String, default: "" },
    answer: { type: String, default: "" },
    language: { type: String, enum: ["English", "Marathi", "Hindi"], default: "English" },
    answeredBy: { type: String, default: "AI" },
    status: { type: String, enum: ["Answered", "Pending", "Failed"], default: "Pending" },
  },
  { timestamps: true }
);

DoubtQuestionSchema.index({ studentId: 1, createdAt: -1 });

if (mongoose.models.DoubtQuestion) delete mongoose.models.DoubtQuestion;

const DoubtQuestion: Model<IDoubtQuestion> = mongoose.model<IDoubtQuestion>("DoubtQuestion", DoubtQuestionSchema);
export default DoubtQuestion;
