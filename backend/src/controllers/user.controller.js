const userService = require("../services/user.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user);

const telegram = {
  connected: req.user.telegramVerified,
  verified: req.user.telegramVerified,
};

res.status(200).json(
  new ApiResponse(
    200,
    {
      profile,
      telegram,
    },
    "Profile fetched"
  )
);
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfile(
    req.user,
    req.body
  );

  res.status(200).json(
    new ApiResponse(200, { profile }, "Profile updated")
  );
});

const requestTelegramVerification = asyncHandler(async (req, res) => {
  const result =
    await userService.generateTelegramVerificationCode(req.user);

  res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Verification code generated"
    )
  );
});

module.exports = {
  getProfile,
  updateProfile,
  requestTelegramVerification,
};