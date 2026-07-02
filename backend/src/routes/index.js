const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const hackathonRoutes = require("./hackathon.routes");
const bookmarkRoutes = require("./bookmark.routes");
const alertRoutes = require("./alert.routes");
const healthRoutes = require("./health.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/hackathons", hackathonRoutes);
router.use("/bookmarks", bookmarkRoutes);
router.use("/alerts", alertRoutes);
router.use("/health", healthRoutes);

module.exports = router;
