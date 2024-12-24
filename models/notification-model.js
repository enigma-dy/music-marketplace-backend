import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["bid", "modification_request"],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
