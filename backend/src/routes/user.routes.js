const express = require("express");

const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { profileValidator } = require("../validators/user.validator");

const router = express.Router();

router.get(
  "/profile",
  authenticate,
  userController.getProfile
);

router.put(
  "/profile",
  authenticate,
  profileValidator,
  validate,
  userController.updateProfile
);

router.post(
  "/telegram/request-code",
  authenticate,
  userController.requestTelegramVerification
);

module.exports = router;