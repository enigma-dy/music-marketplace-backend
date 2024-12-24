import packOrder from "../models/packs-order-model.js";
import Notification from "../models/notification-model.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/mailer.js";

export const createOrder = async (req, res) => {
  try {
    const { buyer, pack, amount, license, paymentMethod, transactionId } =
      req.body;

    if (!buyer || !pack || !amount || !paymentMethod || !transactionId) {
      return res.status(400).json({
        status: "failed",
        message: "Missing required fields",
      });
    }

    const newOrder = await packOrder.create({
      buyer,
      pack,
      amount,
      license,
      paymentMethod,
      transactionId,
    });
    // const buyer = req.user;

    const notificationMessage = `A new payment for $${pack} has been made`;

    await Notification.create({
      user: buyer,
      type: "bid",
      message: notificationMessage,
    });

    await sendEmail(
      buyer.email,
      "New pack Order",
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

    const order = await packOrder.findById(id).populate("buyer pack license");

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

    const orders = await packOrder
      .find({ buyer: buyerId })
      .populate("pack license");

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

    const order = await packOrder
      .findByIdAndUpdate(
        id,
        { paymentStatus },
        { new: true, runValidators: true }
      )
      .populate("buyer pack license");

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

    const order = await packOrder.findByIdAndDelete(id);

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

    const result = await packOrder.updateOne(
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
