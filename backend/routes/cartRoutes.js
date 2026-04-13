import express from 'express'
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();


router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }

        const price = product.price;
        if (quantity <= 0 || price < 0) {
            return res.status(400).json({ message: "quantity or price is invalid" });
        }
        // BUG FIX: was hardcoded "64f1a2b3c4d5e6f7890abcd1" — now uses real logged-in user
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            await Cart.create({
                user: userId,
                cartItems: [
                    {
                        product: productId,
                        quantity,
                        price
                    }
                ],
                totalPrice: quantity * price
            });
            return res.status(201).json({ message: "cart created" })
        }
        else {
            const existsProduct = cart.cartItems.find(item => item.product.toString() === productId);
            if (existsProduct) {
                existsProduct.quantity += quantity;
                cart.totalPrice += quantity * price;
                await cart.save();

                return res.status(200).json({ message: "cart updated" });
            }
            else {
                cart.cartItems.push({
                    product: productId,
                    quantity,
                    price
                });
                cart.totalPrice += quantity * price;

                await cart.save();

                return res.status(200).json({ message: "Added new product" });
            }
        }


    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

router.get("/", authMiddleware, async (req, res) => {
    try {
        // BUG FIX: was hardcoded userId — now uses real logged-in user
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId }).populate("cartItems.product", "name price images");
        
        if (!cart) {
            return res.status(200).json({ message: "cart is empty", cart: null });
        }
        let totalAmount = 0;
        cart.cartItems.forEach(item => {
            totalAmount += item.product.price * item.quantity;
        })
        return res.status(200).json({message:"cart fetched successfully", cart, totalAmount});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:productId", authMiddleware, async (req, res) => {
    try {

        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }
        const price = product.price;
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(200).json({ message: "cart is empty " });
        }
        const existsProduct = cart.cartItems.find(item => item.product.toString() === productId);
        if (!existsProduct) {
            return res.status(404).json({ message: "product not found to delete" });
        }

        if (existsProduct.quantity > 1) {
            existsProduct.quantity -= 1;
            cart.totalPrice -= price;
        }
        else {
            cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);
            cart.totalPrice -= price;
        }
        await cart.save();
        return res.status(200).json({ message: "product removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});


router.put("/update", authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(404).json({ message: "Missing required fields" });
        }
        if (quantity <= 0) {
            return res.status(400).json({ message: "invalid quantity" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(200).json({ message: "product not found" });
        }
        const price = product.price;
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            await Cart.create({
                user: userId,
                cartItems: [
                    {
                        product: productId,
                        quantity,
                        price
                    }
                ],
                totalPrice: quantity * price
            });
            return res.status(201).json({ message: "Cart created successfully" });
        }
        else {
            const existsProduct = cart.cartItems.find(item => item.product.toString() === productId);
            if (existsProduct) {
                cart.totalPrice -= existsProduct.quantity * price;
                existsProduct.quantity = quantity;
                cart.totalPrice += quantity * price;
                await cart.save();
                return res.status(201).json({ message: "cart updated" });
            }
            else {
                cart.cartItems.push({
                    product: productId,
                    quantity,
                    price
                })
                cart.totalPrice += quantity * price;
                await cart.save();
                return res.status(201).json({ message: "cart updated" });
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;