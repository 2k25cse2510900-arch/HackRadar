const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");

const env = require("./config/env");
const configurePassport = require("./config/passport");
const requestLogger = require("./config/logger");
const routes = require("./routes");
const notFoundMiddleware = require("./middleware/notFound.middleware");
const errorMiddleware = require("./middleware/error.middleware");

require("./services/cron.service");

const app = express();

configurePassport();

app.use(helmet());

// ================= DEBUG LOGS =================
console.log("====================================");
console.log("HackRadar Backend Started");
console.log("NODE_ENV:", env.nodeEnv);
console.log("FRONTEND_URL:", env.frontendUrl);
console.log("====================================");

app.use((req, res, next) => {
  console.log("---------- Incoming Request ----------");
  console.log("Method :", req.method);
  console.log("Path   :", req.originalUrl);
  console.log("Origin :", req.headers.origin);
  console.log("FRONTEND_URL:", env.frontendUrl);
  console.log("--------------------------------------");
  next();
});
// ==============================================

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(passport.initialize());

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HackRadar Backend is Running 🚀",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api", routes);

// 404 Middleware
app.use(notFoundMiddleware);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;