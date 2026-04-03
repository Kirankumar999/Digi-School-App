import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  grade: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  enrollmentDate: string;
  status: "Active" | "Inactive" | "Graduated" | "Transferred";
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
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
    guardianName: {
      type: String,
      trim: true,
      default: "",
    },
    guardianPhone: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    enrollmentDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Graduated", "Transferred"],
      default: "Active",
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

if (mongoose.models.Student) {
  delete mongoose.models.Student;
}

const Student: Model<IStudent> = mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
