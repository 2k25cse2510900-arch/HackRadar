const mongoose = require("mongoose");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const health = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      },
      "Service healthy"
    )
  );
});

module.exports = {
  health,
};
