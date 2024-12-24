import mongoose from "mongoose";

const beatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Beat title is required"],
      minlength: [3, "Beat title must be at least 3 characters long"],
    },
    artist: String,
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Genre is required"],
      ref: "Genre",
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    filePath: {
      type: String,
      required: [true, "File URL is required"],
    },
    previewUrl: {
      type: String,
    },
    ablum: {
      type: String,
    },
    tags: {
      type: [String],
      index: true,
    },
    license: {
      type: String,
      enum: ["exclusive", "non-exclusive"],
      default: "non-exclusive",
    },
  },
  {
    timestamps: true,
  }
);

const Beat = mongoose.model("Beat", beatSchema);
export default Beat;
