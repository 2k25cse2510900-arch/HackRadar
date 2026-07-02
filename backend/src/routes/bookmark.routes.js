const express = require("express");

const bookmarkController = require("../controllers/bookmark.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createBookmarkValidator,
  bookmarkIdValidator,
} = require("../validators/bookmark.validator");

const router = express.Router();

router.use(authenticate);
router.get("/", bookmarkController.listBookmarks);
router.post("/", createBookmarkValidator, validate, bookmarkController.saveBookmark);
router.delete("/:id", bookmarkIdValidator, validate, bookmarkController.removeBookmark);

module.exports = router;
