import Notification from "../models/notification-model.js";
import Beat from "../models/beat-model.js";
import { sendEmail } from "../utils/mailer.js";
import ModificationRequest from "../models/modification-model.js";

export const createModificationRequest = async (req, res) => {
  try {
    const { beat, details } = req.body;
    const user = req.user.id;

    const newRequest = await ModificationRequest.create({
      beat,
      user,
      details,
    });

    const beatData = await Beat.findById(beat).populate("artist");

    const notificationMessage = `A new modification request has been submitted for your beat "${beatData.title}".`;
    await Notification.create({
      user: beatData.artist._id,
      type: "modification_request",
      message: notificationMessage,
    });

    await sendEmail(
      beatData.artist.email,
      "Modification Request Notification",
      `<p>${notificationMessage}</p>`
    );

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
