import express from 'express'
import Razorpay from 'razorpay'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import authMiddleware from '../middleware/authMiddleware.js'
import crypto from 'crypto'
import Product from '../models/Product.js'
import dotenv from "dotenv"
dotenv.config()
const router = express.Router();



router.post("/payment/create-order", authMiddleware, async (req, res) => {
    try {
        // Validate Razorpay keys are configured
        if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'YOUR_RAZORPAY_KEY_ID_HERE') {
            return res.status(500).json({ message: "Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file." });
        }

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const { shippingAddress } = req.body;
        if (!shippingAddress) return res.status(400).json({ message: "missing required fields" });

        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        if (cart.cartItems.length === 0) return res.status(400).json({ message: "cart is empty" });

        // Step 1: Create Razorpay order FIRST (before saving to our DB)
        // so that if Razorpay fails we don't create a dangling DB order
        const totalAmount = cart.totalPrice * 100; // Razorpay needs amount in paise
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: totalAmount,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        });

        // Step 2: Save our order to DB, linked to the Razorpay order
        const newOrder = await Order.create({
            user: userId,
            orderItems: cart.cartItems,
            totalPrice: cart.totalPrice,
            shippingAddress,
            razorpayOrderId: razorpayOrder.id
        });

        console.log("Razorpay order created:", razorpayOrder.id, "| DB order:", newOrder._id);
        return res.status(200).json({ message: "order created successfully", razorpayOrder });

    } catch (error) {
        // Razorpay SDK errors use error.error.description — not error.message
        const message = error?.error?.description || error?.message || "Failed to create Razorpay order";
        console.error("Razorpay create-order error:", error);
        res.status(500).json({ message });
    }
});

router.post("/payment/verify", authMiddleware, async (req, res) => {
    // No session — local standalone MongoDB does NOT support transactions
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user.id;

        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
        if (!order) return res.status(404).json({ message: "order not found" });

        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        if (order.paymentStatus === 'paid') {
            return res.status(400).json({ message: "Payment is already done" });
        }

        // Verify the signature sent by Razorpay
        const expected_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (expected_signature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        // Check stock before touching anything
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ message: "Product not found" });
            if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }

        // Decrement stock
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        // Mark order paid
        order.paymentStatus = "paid";
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        // Clear the cart
        await Cart.deleteOne({ user: userId });

        return res.status(200).json({ message: "Payment verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;
