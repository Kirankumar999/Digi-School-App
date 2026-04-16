import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeeComponent {
  name: string;
  amount: number;
}

export interface IFeeStructure extends Document {
  grade: string;
  academicYear: string;
  components: IFeeComponent[];
  totalAmount: number;
  dueDate: string;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const FeeComponentSchema = new Schema<IFeeComponent>(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const FeeStructureSchema = new Schema<IFeeStructure>(
  {
    grade: { type: String, required: true, trim: true },
    academicYear: {
      type: String,
      required: true,
      trim: true,
      default: () => {
        const y = new Date().getFullYear();
        return `${y}-${y + 1}`;
      },
    },
    components: { type: [FeeComponentSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
    dueDate: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

FeeStructureSchema.index({ grade: 1, academicYear: 1 }, { unique: true });

if (mongoose.models.FeeStructure) delete mongoose.models.FeeStructure;

const FeeStructure: Model<IFeeStructure> = mongoose.model<IFeeStructure>("FeeStructure", FeeStructureSchema);
export default FeeStructure;
