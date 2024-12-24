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
      validate: {
        validator: function (value) {
          return /\.(zip|rar|7z|tar|gz)$/.test(value);
        },
        message: "File must be a valid compressed format (zip, rar, etc.)",
      },
    },
    contents: [
      {
        type: {
          type: String,
          enum: ["beat", "sample", "stem", "preset", "artwork", "other"],
          required: true,
        },
        name: { type: String, required: true },
        size: { type: Number }, // File size in bytes
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
    coverImage: {
      type: String,
    },
    license: {
      type: String,
      enum: ["exclusive", "non-exclusive", "royalty-free"],
      default: "royalty-free",
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
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
