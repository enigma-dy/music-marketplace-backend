import mongoose from "mongoose";

const packSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Pack title is required"],
      minlength: [3, "Pack title must be at least 3 characters long"],
      maxlength: [100, "Pack title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image URL is required"],
    },
    contents: [
      {
        type: {
          type: String,
          enum: ["beat", "sample", "stem", "preset", "artwork", "other"],
          required: true,
        },
        name: { type: String, required: true },
        size: { type: Number },
        description: { type: String },
      },
    ],
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount must be a positive number"],
      max: [100, "Discount cannot exceed 100%"],
    },
    tags: [
      {
        type: String,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
    license: {
      type: String,
      enum: ["exclusive", "non-exclusive", "royalty-free"],
      default: "royalty-free",
    },
    downloadCount: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Pack = mongoose.model("Pack", packSchema);
export default Pack;
