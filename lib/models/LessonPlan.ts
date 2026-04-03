import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILessonPlan extends Document {
  lessonPlanId: string;
  title: string;
  classNum: number;
  subject: string;
  chapter: string;
  topic: string;
  duration: string;
  teachingMethod: string;
  language: string;
  learningObjectives: string[];
  prerequisites: string[];
  materialsNeeded: string[];
  lessonFlow: Record<string, unknown>[];
  differentiatedInstruction: Record<string, unknown>;
  boardWork: string;
  homework: string;
  assessmentCriteria: string[];
  crossCurricularLinks: string;
  teacherReflection: string;
  pdfPath: string;
  generatedBy: string;
  cached: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LessonPlanSchema = new Schema<ILessonPlan>(
  {
    lessonPlanId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    classNum: { type: Number, required: true, min: 1, max: 8 },
    subject: { type: String, required: true, trim: true },
    chapter: { type: String, required: true, trim: true },
    topic: { type: String, trim: true, default: "" },
    duration: { type: String, required: true },
    teachingMethod: { type: String, required: true },
    language: {
      type: String,
      enum: ["English", "Hindi", "Marathi", "Bilingual"],
      default: "English",
    },
    learningObjectives: [{ type: String }],
    prerequisites: [{ type: String }],
    materialsNeeded: [{ type: String }],
    lessonFlow: { type: Schema.Types.Mixed, required: true },
    differentiatedInstruction: { type: Schema.Types.Mixed, required: true },
    boardWork: { type: String, default: "" },
    homework: { type: String, default: "" },
    assessmentCriteria: [{ type: String }],
    crossCurricularLinks: { type: String, default: "" },
    teacherReflection: { type: String, default: "" },
    pdfPath: { type: String, default: "" },
    generatedBy: { type: String, default: "" },
    cached: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (mongoose.models.LessonPlan) {
  delete mongoose.models.LessonPlan;
}

const LessonPlan: Model<ILessonPlan> = mongoose.model<ILessonPlan>("LessonPlan", LessonPlanSchema);

export default LessonPlan;
