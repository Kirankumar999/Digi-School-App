import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacher extends Document {
  teacherId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  subject: string;
  department: string;
  qualification: string;
  experience: string;
  address: string;
  joiningDate: string;
  salary: string;
  status: "Active" | "Inactive" | "On Leave" | "Resigned";
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    teacherId: {
      type: String,
      required: [true, "Teacher ID is required"],
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
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    joiningDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    salary: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave", "Resigned"],
      default: "Active",
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

if (mongoose.models.Teacher) {
  delete mongoose.models.Teacher;
}

const Teacher: Model<ITeacher> = mongoose.model<ITeacher>("Teacher", TeacherSchema);

export default Teacher;
