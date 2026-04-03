import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorksheet extends Document {
  worksheetId: string;
  title: string;
  classNum: number;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  language: "English" | "Hindi" | "Bilingual";
  questionTypes: string[];
  numQuestions: number;
  totalMarks: number;
  estimatedTime: string;
  instructions: string;
  questions: Record<string, unknown>[];
  includeAnswerKey: boolean;
  pdfPath: string;
  generatedBy: string;
  cached: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WorksheetSchema = new Schema<IWorksheet>(
  {
    worksheetId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    classNum: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    chapter: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    language: {
      type: String,
      enum: ["English", "Hindi", "Marathi", "Bilingual"],
      default: "English",
    },
    questionTypes: [{ type: String }],
    numQuestions: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    estimatedTime: {
      type: String,
      default: "",
    },
    instructions: {
      type: String,
      default: "",
    },
    questions: {
      type: Schema.Types.Mixed,
      required: true,
    },
    includeAnswerKey: {
      type: Boolean,
      default: true,
    },
    pdfPath: {
      type: String,
      default: "",
    },
    generatedBy: {
      type: String,
      default: "",
    },
    cached: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

if (mongoose.models.Worksheet) {
  delete mongoose.models.Worksheet;
}

const Worksheet: Model<IWorksheet> = mongoose.model<IWorksheet>("Worksheet", WorksheetSchema);

export default Worksheet;
