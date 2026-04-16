import mongoose, { Schema, Document, Model } from "mongoose";

export interface IParent extends Document {
  phone: string;
  name: string;
  studentIds: string[];
  studentNames: string[];
  otp: string;
  otpExpiry: Date | null;
  verified: boolean;
  preferredLanguage: "en" | "mr" | "hi";
  notificationPrefs: {
    sms: boolean;
    whatsapp: boolean;
  };
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ParentSchema = new Schema<IParent>(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true, default: "" },
    studentIds: { type: [String], default: [] },
    studentNames: { type: [String], default: [] },
    otp: { type: String, default: "" },
    otpExpiry: { type: Date, default: null },
    verified: { type: Boolean, default: false },
    preferredLanguage: { type: String, enum: ["en", "mr", "hi"], default: "mr" },
    notificationPrefs: {
      sms: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
    },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

if (mongoose.models.Parent) delete mongoose.models.Parent;

const Parent: Model<IParent> = mongoose.model<IParent>("Parent", ParentSchema);
export default Parent;
