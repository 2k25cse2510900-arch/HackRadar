const { sendEmail } = require("./email.service");
const Alert = require("../models/Alert");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const hackathonService = require("./hackathon.service");
const logger = require("../utils/logger");

async function listAlerts(userId) {
  return Alert.find({ user: userId }).sort({ createdAt: -1 });
}

function getAlertTime(hackathon, payload) {
  if (payload.demoMode) {
    const minutes = Number(payload.demoMinutes || 2);
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  const deadline = new Date(
    hackathon.registrationDeadline || hackathon.deadline
  );

  if (Number.isNaN(deadline.getTime())) {
    throw new ApiError(422, "Hackathon registration deadline is invalid");
  }

  // Default: 24 hours before registration deadline
  return new Date(deadline.getTime() - 24 * 60 * 60 * 1000);
}

async function sendAlertCreatedEmail(user, alert, alertTime) {
  if (!user?.email) return;

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  await sendEmail({
    to: user.email,
    subject: "HackRadar Alert Created",
    html: `
      <h2>Hello ${fullName},</h2>

      <p>Your HackRadar reminder has been created successfully.</p>

      <hr>

      <h3>Alert Details</h3>

      <p><strong>Title:</strong> ${alert.title}</p>

      <p><strong>Frequency:</strong> ${alert.frequency}</p>

      <p><strong>Status:</strong> ${
        alert.enabled ? "Enabled" : "Disabled"
      }</p>

      <p><strong>Reminder Time:</strong> ${alertTime}</p>

      <br>

      <p>You will receive a reminder before the registration deadline.</p>

      <br>

      <h3>Happy Hacking 🚀</h3>

      <p>HackRadar Team</p>
    `,
  }).catch((err) => {
    logger.warn("Alert confirmation email failed:", err.message);
  });
}

async function createAlert(userId, payload, requestContext = {}) {
  console.log("=================================");
  console.log("CREATE ALERT API HIT");
  console.log("Payload:", payload);

  const hackathon = await hackathonService.getHackathonById(
    payload.hackathonId
  );

  console.log("Hackathon Found:", hackathon.id);

  const alertTime = getAlertTime(hackathon, payload);

  console.log("Calculated Alert Time:", alertTime);

  const existingAlert = await Alert.findOne({
    user: userId,
    hackathonId: payload.hackathonId,
    enabled: true,
  });

  if (existingAlert) {
    console.log("Active alert already exists:", existingAlert.id);
    return existingAlert;
  }

  console.info("[Alert Creation]", {
    hackathonId: payload.hackathonId,
    caller: requestContext.caller || "unknown",
    requestUrl: requestContext.requestUrl || "unknown",
  });

  const alert = await Alert.create({
    user: userId,
    hackathonId: payload.hackathonId,
    title: payload.title,
    channels: payload.channels || ["email", "telegram"],
    frequency: payload.frequency || "once",
    enabled: true,
    alertTime,
    settings: payload.settings || {},
  });

  console.log("✅ Alert Saved Successfully");
  console.log(alert);

  const user = await User.findById(userId);

  await sendAlertCreatedEmail(user, alert, alertTime);

  return alert;
}

async function updateAlert(userId, alertId, payload) {
  if (payload.hackathonId) {
    await hackathonService.getHackathonById(payload.hackathonId);
  }

  const alert = await Alert.findOneAndUpdate(
    {
      _id: alertId,
      user: userId,
    },
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }

  return alert;
}

async function deleteAlert(userId, alertId) {
  const alert = await Alert.findOneAndDelete({
    _id: alertId,
    user: userId,
  });

  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }

  return alert;
}

module.exports = {
  listAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
};
