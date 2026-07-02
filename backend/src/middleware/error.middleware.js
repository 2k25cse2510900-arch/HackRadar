const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const env = require("../config/env");
const logger = require("../utils/logger");

function errorMiddleware(error, req, res, next) {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;

  if (statusCode === 500) {
    logger.error(error);
  }

  const response = new ApiResponse(statusCode, null, message);
  if (error.errors?.length) {
    response.errors = error.errors;
  }
  if (env.nodeEnv !== "production" && error.stack) {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorMiddleware;
