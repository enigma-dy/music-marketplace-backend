import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    beat: { type: mongoose.Types.ObjectId, ref: "Beat", required: true },
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    bidAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Bid = mongoose.model("Bid", bidSchema);
export default Bid;
