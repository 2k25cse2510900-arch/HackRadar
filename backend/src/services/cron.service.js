const { buildReminderEmail } = require("../templates/email.template");
const { buildTelegramReminder } = require("../templates/telegram.template");
const cron = require("node-cron");
const Alert = require("../models/Alert");
const User = require("../models/User");
const { sendEmail } = require("./email.service");
const { sendTelegramMessage } = require("./telegram.service");

cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking alerts...");

  try {
    const alerts = await Alert.find({
      enabled: true,
      alertTime: { $lte: new Date() },
    });

    console.log(`Found ${alerts.length} alert(s)`);

    for (const alert of alerts) {
      const user = await User.findById(alert.user);

      if (!user) continue;

const canSendEmail = !!user.email;

const canSendTelegram =
  user.telegramVerified &&
  user.telegramChatId;

      // ==========================
      // Send Email
      // ==========================

      if (canSendEmail && alert.channels.includes("email")) {
  try {
    await sendEmail({
      to: user.email,
      subject: `⏰ Reminder: ${alert.title}`,
      html: buildReminderEmail({
        firstName: user.firstName,
        title: alert.title,
      }),
    });

    console.log("📧 Email sent");
  } catch (err) {
    console.error(err.message);
  }
}

      // ==========================
// Send Telegram
// ==========================

if (canSendTelegram && alert.channels.includes("telegram")) {
  try {
    await sendTelegramMessage(
      user.telegramChatId,
      buildTelegramReminder({
        firstName: user.firstName,
        title: alert.title,
      })
    );

    console.log("📲 Telegram sent");
  } catch (err) {
    console.log(err.message);
  }
}

      // ==========================
      // Disable Alert
      // ==========================
      alert.enabled = false;
      alert.lastTriggeredAt = new Date();
      await alert.save();

      console.log(`🚫 Alert disabled: ${alert.title}`);
    }
  } catch (err) {
    console.error("❌ Cron Error:", err.message);
  }
});