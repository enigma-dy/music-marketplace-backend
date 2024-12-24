import mongoose from "mongoose";

const modificationRequestSchema = new mongoose.Schema(
  {
    beat: { type: mongoose.Types.ObjectId, ref: "Beat", required: true },
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    details: { type: String, required: true }, // Details of the requested modification
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ModificationRequest = mongoose.model(
  "ModificationRequest",
  modificationRequestSchema
);
export default ModificationRequest;
