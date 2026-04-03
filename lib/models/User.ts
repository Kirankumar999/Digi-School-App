import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
  profilePicture: string;
  phone: string;
  bio: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "admin",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [250, "Bio must be at most 250 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
