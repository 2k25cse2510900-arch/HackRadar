const { body, param } = require("express-validator");

const createBookmarkValidator = [
  body("hackathonId").trim().notEmpty().withMessage("Hackathon id is required"),
];

const bookmarkIdValidator = [
  param("id").isMongoId().withMessage("Bookmark id must be a valid MongoDB ObjectId"),
];

module.exports = {
  createBookmarkValidator,
  bookmarkIdValidator,
};
