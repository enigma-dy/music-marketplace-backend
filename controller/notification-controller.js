import Notification from "../models/notification-model";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ user: userId }).sort({
      created_at: -1,
    });

    res.status(200).json({
      status: "successful",
      message: "Notifications retrieved successfully.",
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};
