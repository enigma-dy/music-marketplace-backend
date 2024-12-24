import User from "../models/user-model.js";
import mongoose from "mongoose";

export const getMe = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.status(200).json({
      status: "successful",
      message: "User data retrieved successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error. Please try again later.",
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { id } = req.user;
    const updatedData = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid user ID" });
    }

    if (!updatedData) {
      return res
        .status(400)
        .json({ status: "failed", message: "Please provide updated data" });
    }

    const validFields = [
      "username",
      "email",
      "password",
      "profilePicture",
      "bio",
      "location",
    ];
    const invalidFields = Object.keys(updatedData).filter(
      (field) => !validFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        status: "failed",
        message: `Invalid fields: ${invalidFields.join(", ")}`,
      });
    }

    const user = await User.updateOne(
      { _id: id },
      [{ $set: updatedData }, { $set: { lastUpdated: new Date() } }],
      { runValidators: true }
    );

    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "User not found" });
    }

    if (user.modifiedCount === 0) {
      return res.status(400).json({
        status: "failed",
        message: "User not found or no changes made",
      });
    }

    return res.status(200).json({
      status: "successful",
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const deleteMe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid user ID" });
    }

    const user = await User.deleteOne({ _id: id });
    if (!user) {
      res.status(400).json({ status: "failed", message: "user not find" });
    }
    if (result.deletedCount === 0) {
      return res
        .status(400)
        .json({ status: "failed", message: "User not found" });
    }

    return res
      .status(200)
      .json({ status: "sucessful", message: "this user has been deleted" });
  } catch (error) {
    console.error;
    res.status(500).json({ status: "Failed", message: "Server Error" });
  }
};

export const getAllProducer = async (req, res) => {
  try {
    const producers = await User.find({ role: "producer" }).select("-password");

    if (!producers || producers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No producers found on this platform.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "These are all the producers on this platform.",
      data: producers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving producers.",
      error: error.message,
    });
  }
};
