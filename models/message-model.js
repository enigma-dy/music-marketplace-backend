import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  from: { type: mongoose.mongoose.Types.ObjectId, ref: "User" },
  to: { type: mongoose.mongoose.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
