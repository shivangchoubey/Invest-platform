import mongoose from "mongoose";

const startupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fundingGoal: {
      type: Number,
      required: true,
    },
    amountRaised: {
      type: Number,
      default: 0,
    },
    founder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Startup = mongoose.models.Startup || mongoose.model("Startup", startupSchema);

export default Startup;