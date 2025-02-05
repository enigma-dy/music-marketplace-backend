import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const ROLES = ["explorer", "producer", "admin"];

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"],
    minlength: [3, "Username must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email must be unique"],
    validate: function (email) {
      return validator.isEmail(email);
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ROLES,
    default: "explorer",
    validate: {
      validator: (value) => {
        return ["explorer", "producer", "admin"].includes(value);
      },
      message: "{VALUE} is not a valid role",
    },
  },
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  socialLinks: [
    {
      platform: {
        type: String,
        enum: ["instagram", "twitter", "youtube"],
      },
      link: {
        type: String,
      },
    },
  ],
  location: {
    type: String,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
    if (this.username) {
      this.username = this.username.toLowerCase();
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateToken = async function () {
  const payload = { id: this._id, email: this.email, role: this.role };
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
