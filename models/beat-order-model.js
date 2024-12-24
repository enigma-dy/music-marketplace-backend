import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique ID generation

const orderBeatSchema = mongoose.Schema({
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Buyer is required"],
  },
  beat: {
    type: mongoose.Types.ObjectId,
    ref: "Beat",
    required: [true, "Beat is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be a positive number"],
  },
  license: {
    type: mongoose.Types.ObjectId,
    ref: "License",
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
    message: "{VALUE} is not a valid payment status",
  },
  paymentMethod: {
    type: String,
    enum: ["paypal", "debit_card", "bank_transfer"],
    default: "debit_card",
    required: [true, "Payment method is required"],
    message: "{VALUE} is not a valid payment method",
  },
  transactionId: {
    type: String,
    unique: [true, "Transaction ID must be unique"],
    default: uuidv4,
  },
});

const BeatOrder = mongoose.model("BeatOrder", orderBeatSchema);
export default BeatOrder;
