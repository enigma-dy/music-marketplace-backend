import BeatOrder from "../models/beat-order-model.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/mailer.js";

export const createOrder = async (req, res) => {
  try {
    const { buyer, beat, amount, license, paymentMethod, transactionId } =
      req.body;

    if (!buyer || !beat || !amount || !paymentMethod || !transactionId) {
      return res.status(400).json({
        status: "failed",
        message: "Missing required fields",
      });
    }

    const newOrder = await BeatOrder.create({
      buyer,
      beat,
      amount,
      license,
      paymentMethod,
      transactionId,
    });

    const notificationMessage = `A new payment for $${beat} has been made`;

    await Notification.create({
      user: buyer._id,
      type: "bid",
      message: notificationMessage,
    });

    await sendEmail(
      buyer.email,
      "New Beat Order",
      `<p>${notificationMessage}</p>`
    );

    res.status(201).json({
      status: "successful",
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid order ID",
      });
    }

    const order = await BeatOrder.findById(id).populate("buyer beat license");

    if (!order) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "successful",
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getOrdersByBuyer = async (req, res) => {
  try {
    const { buyerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid buyer ID",
      });
    }

    const orders = await BeatOrder.find({ buyer: buyerId }).populate(
      "beat license"
    );

    res.status(200).json({
      status: "successful",
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid order ID",
      });
    }

    if (!["pending", "completed", "failed"].includes(paymentStatus)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid payment status",
      });
    }

    const order = await BeatOrder.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true, runValidators: true }
    ).populate("buyer beat license");

    if (!order) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "successful",
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid order ID",
      });
    }

    const order = await BeatOrder.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "successful",
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const markOrderAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid order ID",
      });
    }

    const result = await BeatOrder.updateOne(
      { _id: id },
      { $set: { deliveryStatus: "delivered" } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "successful",
      message: "Order marked as delivered",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};
