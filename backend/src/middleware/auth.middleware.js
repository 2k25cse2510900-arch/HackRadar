const jwt = require("jsonwebtoken");

const jwtConfig = require("../config/jwt");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Authentication token is required");
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtConfig.secret);
  } catch {
    throw new ApiError(401, "Invalid or expired authentication token");
  }

  const user = await User.findById(payload.sub).select("-passwordHash");
  if (!user) {
    throw new ApiError(401, "Authenticated user no longer exists");
  }

  req.user = user;
  next();
});

module.exports = authenticate;
