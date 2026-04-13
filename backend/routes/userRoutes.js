import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import User from '../models/User.js'
import bcrypt from 'bcrypt'

const router = express.Router();

router.get("/users/profile", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('name email address');
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.status(200).json({ message: "user fetched successfully", user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/users/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const { name, email, password, address } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (address) user.address = address;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        const userData = await User.findById(req.user.id).select("-password");
        return res.status(200).json({ message: "user updated successfully", user: userData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: get all users
router.get("/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        return res.status(200).json({ message: "users fetched successfully", users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;