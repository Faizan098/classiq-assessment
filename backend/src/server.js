require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const errorMiddleware = require("./middleware/errorMiddleware");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(helmet());

app.use(express.json());

app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5500",
    "https://classiq-frontend-qtp8.onrender.com"
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);


// Health check
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ClassIQ API is running"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "ClassIQ API is running"
    });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});