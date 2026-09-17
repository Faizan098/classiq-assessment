const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    signup,
    login,
    getMe,
    logout
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Limit authentication attempts
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Maximum 10 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    }
});

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);

router.get("/me", authMiddleware, getMe);
router.post("/logout", logout);

module.exports = router;