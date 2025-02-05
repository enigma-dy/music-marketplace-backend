import mongoose from "mongoose";
import ModificationRequest from "../models/modification-model.js";
import Beat from "../models/beat-model.js";
import Notification from "../models/notification-model.js";

export const createModificationRequest = async (req, res) => {
  try {
    const { beat, details } = req.body;
    const user = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(beat)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid beat ID format" });
    }
    if (!beat || !details) {
      return res
        .status(400)
        .json({ status: "failed", message: "Please Fill All Required Fields" });
    }

    if (!user) {
      return res.status(400).json({ status: "failed", message: "Pls Login" });
    }

    const beatData = await Beat.findById(beat);
    if (!beatData) {
      return res
        .status(404)
        .json({ status: "failed", message: "Beat not found" });
    }

    const newRequest = await ModificationRequest.create({
      beat,
      user,
      details,
    });

    const notificationMessage = `A new modification request has been submitted for your beat "${beatData.title}".`;
    await Notification.create({
      user: beatData.createdBy,
      type: "modification_request",
      message: notificationMessage,
    });

    res.status(201).json({
      status: "successful",
      message: "Modification request created successfully.",
      request: newRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};
