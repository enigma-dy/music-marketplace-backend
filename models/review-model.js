import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.mongoose.Types.ObjectId, ref: "User" },
  beatPack: { type: mongoose.mongoose.Types.ObjectId, ref: "BeatPack" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
