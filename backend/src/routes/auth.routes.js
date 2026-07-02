const express = require("express");

const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { registerValidator, loginValidator } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.me);

module.exports = router;
