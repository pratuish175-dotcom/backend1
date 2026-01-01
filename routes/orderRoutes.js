const express = require("express");
const Order = require("../models/Order.js");
const nodemailer = require("nodemailer");

const router = express.Router();

// Email Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Create Order
router.post("/create-order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    const customer = req.body.customer;

    if (customer?.email) {
      const mailOptions = {
        from: `"E-commerce Store" <${process.env.MAIL_USER}>`,
        to: customer.email,
        subject: "Order Confirmation ✔",
        html: `<h3>Thank you for your purchase!</h3>`,
      };
      transporter.sendMail(mailOptions).catch(console.error);
    }

    res.status(201).json({
      success: true,
      message: "Order Saved Successfully!",
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order Save Failed", error });
  }
});

// 🔥 NEW — Admin — Get All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// 🔥 NEW — Admin — Update Order Status
// Update Order Status API (Admin only)
router.put("/update-status/:orderId", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    res.json({ success: true, updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update Failed" });
  }
});

// User Orders
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get user orders" });
  }
});

// Order Details
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order not found" });
  }
});


module.exports = router;
