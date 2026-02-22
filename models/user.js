import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["FOUNDER", "INVESTOR"],
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ["UNVERIFIED", "VERIFIED"],
      default: "UNVERIFIED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);