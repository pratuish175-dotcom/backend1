import Razorpay from "razorpay";
import express from "express";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});

// Create order in Razorpay
router.post("/razorpay", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `order_rcptid_${Math.random()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

export default router;
