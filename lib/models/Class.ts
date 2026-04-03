import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClass extends Document {
  classId: string;
  name: string;
  grade: string;
  section: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  room: string;
  schedule: string;
  maxStudents: number;
  academicYear: string;
  description: string;
  status: "Active" | "Inactive" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    classId: {
      type: String,
      required: [true, "Class ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    grade: {
      type: String,
      required: [true, "Grade is required"],
      trim: true,
    },
    section: {
      type: String,
      required: [true, "Section is required"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    teacherId: {
      type: String,
      trim: true,
      default: "",
    },
    teacherName: {
      type: String,
      trim: true,
      default: "",
    },
    room: {
      type: String,
      trim: true,
      default: "",
    },
    schedule: {
      type: String,
      trim: true,
      default: "",
    },
    maxStudents: {
      type: Number,
      default: 40,
    },
    academicYear: {
      type: String,
      trim: true,
      default: () => {
        const now = new Date();
        const year = now.getFullYear();
        return `${year}-${year + 1}`;
      },
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Completed"],
      default: "Active",
    },
  },
  { timestamps: true }
);

if (mongoose.models.Class) {
  delete mongoose.models.Class;
}

const Class: Model<IClass> = mongoose.model<IClass>("Class", ClassSchema);

export default Class;
