import express from 'express'
import mongoose from 'mongoose'

import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post("/orders", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { shippingAddress, paymentMethod } = req.body;
        if (!shippingAddress || !paymentMethod) {
            throw new Error("missing required fields");
        }
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId }).session(session);

        if (!cart) {
            throw new Error("cart not found");
        }

        if (cart.cartItems.length === 0) throw new Error("cart is empty");
        const totalPrice = cart.totalPrice;
        if (paymentMethod === "cod") {
            const order = await Order.create({
                user: userId,
                orderItems: cart.cartItems,
                totalPrice,
                shippingAddress,
                paymentStatus: "cod"
            }, { session });
            for (const item of cart.cartItems) {
                const product = await Product.findById(item.product).session(session);
                if (!product) throw new Error("product not found");
                if (product.stock < item.quantity) throw new Error("Insufficient stock");
                product.stock -= item.quantity;
                await product.save({ session });
            }
            await Cart.deleteOne({ user: userId }).session(session);
            await session.commitTransaction();
            return res.status(201).json({
                message: "order placed successfully",
                order
            });
        }

        return res.status(200).json({ message: "payment method not supported" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: error.message });
    } finally {
        await session.endSession();
    }
});


router.get("/orders", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const orderData = await Order.find({ user: userId }).populate("orderItems.product", "name images");
        if (orderData.length === 0) {
            return res.status(404).json({ message: "no orders found", orderData: [] });
        }
        return res.status(200).json(
            {
                message: "orders fetched successfully",
                orderData
            }
        )
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/orders/:orderId", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate("orderItems.product", "name images");

        if (!order) {
            return res.status(404).json({ message: "order not found" });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "not authorized" });
        }

        return res.status(200).json({
            message: "order fetched successfully",
            order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

router.get("/admin/orders", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email address").sort({ createdAt: -1 });//.sort function will sort the orders according to latest

        return res.status(200).json({ message: "orders fetched succcessfully", orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/admin/orders/:orderId/status", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { paymentStatus, orderStatus } = req.body;
        if (!paymentStatus || !orderStatus) {
            return res.status(400).json({ message: "missing required fields" });
        }
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "order not found" });
        }
        order.paymentStatus = paymentStatus;
        order.orderStatus = orderStatus;

        await order.save();
        return res.status(200).json({ message: "status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/admin/orders/:orderId", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
            await Order.findByIdAndDelete(orderId);
            return res.status(200).json({ message: "order deleted successfully", order });
        }
        return res.status(400).json({ message: "cannot delete order" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;