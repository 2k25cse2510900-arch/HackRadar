const crypto = require("crypto");

const { isProfileComplete, stripLegacyProfileFields } = require("../utils/profileCompletion");

async function getProfile(user) {
  const profile = user.profile?.toObject?.() || user.profile || {};
  const nextProfile = {
    ...stripLegacyProfileFields(profile),
    countryCode: profile.countryCode || "+91",
    phoneNumber: profile.phoneNumber || user.phoneNumber || "",
  };

  if (!user.profileCompleted && isProfileComplete(nextProfile)) {
    user.profileCompleted = true;
    await user.save();
  }

  return {
    ...nextProfile,
  };
}

async function updateProfile(user, profile) {
  const baseProfile = stripLegacyProfileFields(user.profile?.toObject?.() || {});
  const nextProfile = {
    ...baseProfile,
    ...stripLegacyProfileFields(profile),
  };

  if (typeof profile.countryCode !== "undefined") {
    nextProfile.countryCode = profile.countryCode;
  } else if (!nextProfile.countryCode) {
    nextProfile.countryCode = "+91";
  }

  if (typeof profile.phoneNumber !== "undefined") {
    nextProfile.phoneNumber = profile.phoneNumber;
    user.phoneNumber = profile.phoneNumber;
  }

  user.profile = {
    ...nextProfile,
  };

  user.profileCompleted = isProfileComplete({
    ...nextProfile,
    countryCode: typeof profile.countryCode !== "undefined" ? profile.countryCode : nextProfile.countryCode,
    phoneNumber: typeof profile.phoneNumber !== "undefined" ? profile.phoneNumber : user.phoneNumber,
  });

  await user.save();

  return user.profile;
}

async function generateTelegramVerificationCode(user) {
  const code = crypto.randomInt(100000, 999999).toString();

  user.telegramVerificationCode = code;
  user.telegramVerificationExpires = new Date(
    Date.now() + 10 * 60 * 1000
  );

  user.telegramVerified = false;

  await user.save();

  return {
    code,
    expires: user.telegramVerificationExpires,
  };
}

async function verifyTelegram(user, chatId) {
  user.telegramChatId = chatId;
  user.telegramVerified = true;

  user.telegramVerificationCode = "";
  user.telegramVerificationExpires = null;

  await user.save();

  return user;
}

async function getTelegramStatus(user) {
  return {
    connected: user.telegramVerified,
    verified: user.telegramVerified,
    chatId: user.telegramChatId,
  };
}

module.exports = {
  getProfile,
  updateProfile,
  generateTelegramVerificationCode,
  verifyTelegram,
  getTelegramStatus,
};
