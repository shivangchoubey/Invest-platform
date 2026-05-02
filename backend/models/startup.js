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
    opportunity: {
      type: String,
    },
    industryType: {
      type: String,
      enum: ['SAAS', 'GREENTECH', 'FINTECH', 'HEALTH', 'WEALTH', 'TECH', 'FMCG', 'AI', 'EDTECH'],
      default: 'TECH'
    },
    image: {
      type: String,
    },
    verificationStatus:{
      type:String,
      enum:["PENDING","APPROVED","REJECTED", "REMOVED"],
      default:"PENDING",
    },
    flags: [{
      investor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
    }],
  },
  { timestamps: true }
);

const Startup = mongoose.models.Startup || mongoose.model("Startup", startupSchema);

export default Startup;