import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeeTransaction extends Document {
  transactionId: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  academicYear: string;
  amountPaid: number;
  totalFee: number;
  paymentDate: string;
  paymentMode: "Cash" | "Online" | "Cheque" | "UPI";
  receiptNumber: string;
  status: "Paid" | "Partial" | "Pending" | "Waived";
  scholarshipType: string;
  scholarshipAmount: number;
  remarks: string;
  collectedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeeTransactionSchema = new Schema<IFeeTransaction>(
  {
    transactionId: { type: String, required: true, unique: true, trim: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    section: { type: String, trim: true, default: "" },
    academicYear: { type: String, required: true, trim: true },
    amountPaid: { type: Number, required: true, min: 0 },
    totalFee: { type: Number, default: 0 },
    paymentDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
    paymentMode: { type: String, enum: ["Cash", "Online", "Cheque", "UPI"], default: "Cash" },
    receiptNumber: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["Paid", "Partial", "Pending", "Waived"], default: "Paid" },
    scholarshipType: { type: String, trim: true, default: "" },
    scholarshipAmount: { type: Number, default: 0 },
    remarks: { type: String, trim: true, default: "" },
    collectedBy: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

FeeTransactionSchema.index({ studentId: 1, academicYear: 1 });

if (mongoose.models.FeeTransaction) delete mongoose.models.FeeTransaction;

const FeeTransaction: Model<IFeeTransaction> = mongoose.model<IFeeTransaction>("FeeTransaction", FeeTransactionSchema);
export default FeeTransaction;
