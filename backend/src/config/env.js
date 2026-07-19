require("dotenv").config();

const readEnv = (key, fallback = "") => {
  const value = process.env[key];
  return typeof value === "string" && value.trim() ? value.trim() : String(fallback).trim();
};

const readOptionalEnv = (key) => {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : "";
};

const readRequiredEnv = (key) => {
  const value = readOptionalEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const trimTrailingSlashes = (value) => value.replace(/\/+$/, "");

const frontendUrl = trimTrailingSlashes(
  readOptionalEnv("FRONTEND_URL") || readOptionalEnv("CLIENT_URL")
);
const googleClientId = readOptionalEnv("GOOGLE_CLIENT_ID");
const googleClientSecret = readOptionalEnv("GOOGLE_CLIENT_SECRET");
const googleCallbackUrl = trimTrailingSlashes(readOptionalEnv("GOOGLE_CALLBACK_URL"));

if (!frontendUrl) {
  throw new Error("Missing required environment variable: FRONTEND_URL (or CLIENT_URL)");
}

if ((googleClientId || googleClientSecret || googleCallbackUrl) && (!googleClientId || !googleClientSecret || !googleCallbackUrl)) {
  throw new Error(
    "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL must be set together"
  );
}

const env = {
  nodeEnv: readEnv("NODE_ENV", "development"),
  port: Number(process.env.PORT || 5000),
  mongodbUri: readRequiredEnv("MONGODB_URI"),
  jwtSecret: readRequiredEnv("JWT_SECRET"),
  jwtExpiresIn: readEnv("JWT_EXPIRES_IN", "7d"),
  frontendUrl,
  clientUrl: frontendUrl,
  googleClientId,
  googleClientSecret,
  googleCallbackUrl,
  emailUser: readEnv("EMAIL_USER"),
  emailPass: readEnv("EMAIL_PASS"),
  telegramBotToken: readEnv("TELEGRAM_BOT_TOKEN"),
};

module.exports = env;
