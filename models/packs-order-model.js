import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Buyer is required"],
  },
  pack: {
    type: mongoose.Types.ObjectId,
    ref: "Packs",
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
    enum: ["paypal", "credit_card", "bank_transfer"],
    required: [true, "Payment method is required"],
    message: "{VALUE} is not a valid payment method",
  },
  transactionId: {
    type: String,
    unique: [true, "Transaction ID must be unique"],
  },
});

const packOrder = mongoose.model("Order", orderSchema);
export default packOrder;
