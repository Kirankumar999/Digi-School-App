import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISchoolEvent extends Document {
  title: string;
  description: string;
  eventType: "Academic" | "Cultural" | "Sports" | "Holiday" | "PTM" | "Exam" | "Other";
  startDate: string;
  endDate: string;
  allDay: boolean;
  location: string;
  organizer: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolEventSchema = new Schema<ISchoolEvent>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, default: "" },
    eventType: {
      type: String,
      enum: ["Academic", "Cultural", "Sports", "Holiday", "PTM", "Exam", "Other"],
      default: "Other",
    },
    startDate: { type: String, required: true },
    endDate: { type: String, default: "" },
    allDay: { type: Boolean, default: true },
    location: { type: String, trim: true, default: "" },
    organizer: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

if (mongoose.models.SchoolEvent) delete mongoose.models.SchoolEvent;

const SchoolEvent: Model<ISchoolEvent> = mongoose.model<ISchoolEvent>("SchoolEvent", SchoolEventSchema);
export default SchoolEvent;
