import Bid from "../models/bid-model.js";
import Beat from "../models/beat-model.js";
import Notification from "../models/notification-model.js";
import { sendEmail } from "../utils/mailer.js";

export const createBid = async (req, res) => {
  try {
    const { beat, bidAmount } = req.body;
    const user = req.user.id;

    if (!beat || !bidAmount || bidAmount < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Beat and a valid bid amount are required.",
      });
    }

    const newBid = await Bid.create({ beat, user, bidAmount });

    const beatData = await Beat.findById(beat).populate("artist");
    if (!beatData) {
      return res.status(404).json({
        status: "failed",
        message: "Beat not found.",
      });
    }

    const notificationMessage = `A new bid of $${bidAmount} has been placed on your beat "${beatData.title}".`;
    await Notification.create({
      user: beatData.artist._id,
      type: "bid",
      message: notificationMessage,
    });

    await sendEmail(
      beatData.artist.email,
      "New Bid Notification",
      `<p>${notificationMessage}</p>`
    );

    res.status(201).json({
      status: "successful",
      message: "Bid created successfully, and the owner has been notified.",
      bid: newBid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getBidsForBeat = async (req, res) => {
  try {
    const { beatId } = req.params;

    const bids = await Bid.find({ beat: beatId })
      .populate("user", "username")
      .sort({ created_at: -1 });

    if (bids.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No bids found for this beat.",
      });
    }

    res.status(200).json({
      status: "successful",
      message: "Bids retrieved successfully.",
      bids,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const updateBidStatus = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid status. Allowed values are 'accepted' or 'rejected'.",
      });
    }

    const updatedBid = await Bid.findByIdAndUpdate(
      bidId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedBid) {
      return res.status(404).json({
        status: "failed",
        message: "Bid not found.",
      });
    }

    const notificationMessage = `Your bid of $${updatedBid.bidAmount} on the beat has been ${status}.`;
    await Notification.create({
      user: updatedBid.user,
      type: "bid",
      message: notificationMessage,
    });

    res.status(200).json({
      status: "successful",
      message: `Bid ${status} successfully.`,
      bid: updatedBid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getBidsForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const bids = await Bid.find({ user: userId })
      .populate("beat", "title")
      .sort({ created_at: -1 });

    res.status(200).json({
      status: "successful",
      message: "User bids retrieved successfully.",
      bids,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};
