import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  category: "Academic" | "Event" | "Holiday" | "Circular" | "Emergency" | "General";
  priority: "High" | "Medium" | "Low";
  targetAudience: "All" | "Students" | "Teachers" | "Parents";
  pinned: boolean;
  publishDate: string;
  expiryDate: string;
  attachments: string[];
  createdBy: string;
  createdByName: string;
  status: "Published" | "Draft" | "Expired";
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    content: { type: String, required: [true, "Content is required"] },
    category: {
      type: String,
      enum: ["Academic", "Event", "Holiday", "Circular", "Emergency", "General"],
      default: "General",
    },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    targetAudience: { type: String, enum: ["All", "Students", "Teachers", "Parents"], default: "All" },
    pinned: { type: Boolean, default: false },
    publishDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
    expiryDate: { type: String, default: "" },
    attachments: { type: [String], default: [] },
    createdBy: { type: String, default: "" },
    createdByName: { type: String, default: "" },
    status: { type: String, enum: ["Published", "Draft", "Expired"], default: "Published" },
  },
  { timestamps: true }
);

if (mongoose.models.Announcement) delete mongoose.models.Announcement;

const Announcement: Model<IAnnouncement> = mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
export default Announcement;
