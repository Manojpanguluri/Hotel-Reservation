const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = new User({ name, email, password: hashedPassword });
        await newuser.save();
        res.send('User Registered Successfully');
    } catch(error) {
        return res.status(400).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        let isMatch = false;

        // Check if password matches bcrypt hash
        if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Legacy plaintext password check
            if (user.password === password) {
                isMatch = true;
                // Transparently upgrade legacy plaintext password to bcrypt hash
                user.password = await bcrypt.hash(password, 10);
                await user.save();
            }
        }

        if (isMatch) {
            const temp = {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                _id: user._id,
            };
            res.send(temp);
        } else {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch(error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
});

router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.send(users);
    } catch(error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = router;
