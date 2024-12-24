import mongoose from "mongoose";

const licenseSchema = mongoose.Schema({
  beat: {
    type: mongoose.Types.ObjectId,
    ref: "Beat",
    required: [true, "Beat is required"],
  },
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Buyer is required"],
  },
  licenseType: {
    type: String,
    enum: ["exclusive", "non-exclusive"],
    required: [true, "License type is required"],
    message: "{VALUE} is not a valid license type",
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"],
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
  },
  usageLimit: {
    type: Number,
    default: 1,
    min: [1, "Usage limit must be at least 1"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const License = mongoose.model("License", licenseSchema);
export default License;
