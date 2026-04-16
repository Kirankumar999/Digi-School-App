import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  type: "attendance" | "fee" | "exam" | "announcement" | "report";
  title: string;
  message: string;
  recipientPhone: string;
  recipientName: string;
  studentId: string;
  studentName: string;
  channel: "sms" | "whatsapp" | "in-app";
  status: "sent" | "pending" | "failed";
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: { type: String, enum: ["attendance", "fee", "exam", "announcement", "report"], required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    recipientPhone: { type: String, default: "" },
    recipientName: { type: String, default: "" },
    studentId: { type: String, default: "" },
    studentName: { type: String, default: "" },
    channel: { type: String, enum: ["sms", "whatsapp", "in-app"], default: "in-app" },
    status: { type: String, enum: ["sent", "pending", "failed"], default: "pending" },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipientPhone: 1, createdAt: -1 });

if (mongoose.models.Notification) delete mongoose.models.Notification;

const Notification: Model<INotification> = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
