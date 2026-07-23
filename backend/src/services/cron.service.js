const { buildReminderEmail } = require("../templates/email.template");
const { buildTelegramReminder } = require("../templates/telegram.template");
const cron = require("node-cron");
const Alert = require("../models/Alert");
const User = require("../models/User");
const { sendEmail } = require("./email.service");
const { sendTelegramMessage } = require("./telegram.service");
const hackathonService = require("./hackathon.service");

const REMINDER_MILESTONES = [
  { key: "sevenDays", hours: 168, label: "7 days" },
  { key: "threeDays", hours: 72, label: "3 days" },
  { key: "oneDay", hours: 24, label: "1 day" },
  { key: "oneHour", hours: 1, label: "1 hour" },
];

cron.schedule("* * * * *", async () => {
  console.log("Checking alerts...");

  try {
    const alerts = await Alert.find({ enabled: true });

    console.log(`Found ${alerts.length} active alert(s) across all users`);

    for (const alert of alerts) {
      console.log("Cron loaded:", {
        id: alert._id,
        title: alert.title,
        enabled: alert.enabled,
        deleted: false,
      });
    }

    for (const alert of alerts) {
      try {
        if (!alert?.enabled || !alert.hackathonId) {
          console.error(
            `Skipping invalid or disabled alert: ${alert?._id || "unknown"}`
          );
          continue;
        }

        let hackathon;

        try {
          hackathon = await hackathonService.getHackathonById(
            alert.hackathonId
          );
        } catch (err) {
          console.error(
            `Unable to load hackathon for alert ${alert._id}: ${err.message}`
          );
          continue;
        }

        const deadlineValue =
          hackathon?.registrationDeadline || hackathon?.deadline;

        if (!deadlineValue) {
          console.error(`Missing registration deadline for alert ${alert._id}`);
          continue;
        }

        const deadline = new Date(deadlineValue);

        if (Number.isNaN(deadline.getTime())) {
          console.error(`Invalid registration deadline for alert ${alert._id}`);
          continue;
        }

        const now = new Date();

        if (now >= deadline) {
          alert.enabled = false;
          await alert.save();
          console.log(
            `Alert disabled after registration deadline: ${alert.title}`
          );
          continue;
        }

        const reminderHours = Number(alert.settings?.reminderTiming || 24);
        const milestone = REMINDER_MILESTONES.find(
          (item) => item.hours === reminderHours
        );

        if (!milestone || alert.remindersSent?.[milestone.key]) continue;

        const triggerTime = new Date(
          deadline.getTime() - milestone.hours * 60 * 60 * 1000
        );

        if (now < triggerTime) continue;

        const claimedAlert = await Alert.findOneAndUpdate(
          {
            _id: alert._id,
            enabled: true,
            [`remindersSent.${milestone.key}`]: { $ne: true },
          },
          {
            $set: {
              [`remindersSent.${milestone.key}`]: true,
              lastTriggeredAt: now,
            },
          },
          { new: true }
        );

        if (!claimedAlert) continue;

        const user = await User.findById(alert.user);

        if (!user) continue;

        const canSendEmail = Boolean(user.email);
        const canSendTelegram =
          user.telegramVerified === true && Boolean(user.telegramChatId);

        if (
          canSendEmail &&
          Array.isArray(alert.channels) &&
          alert.channels.includes("email")
        ) {
          try {
            await sendEmail({
              to: user.email,
              subject: `Reminder: ${alert.title}`,
              html: buildReminderEmail({
                firstName: user.firstName,
                title: alert.title,
                registrationDeadline: deadline.toLocaleString(),
                remainingTime: milestone.label,
                registrationLink: hackathon.officialWebsite,
              }),
            });

            console.log("Reminder email sent");
          } catch (err) {
            console.error(err.message);
          }
        }

        if (
          canSendTelegram &&
          Array.isArray(alert.channels) &&
          alert.channels.includes("telegram")
        ) {
          try {
            await sendTelegramMessage(
              user.telegramChatId,
              buildTelegramReminder({
                firstName: user.firstName,
                title: alert.title,
              })
            );

            console.log("Telegram reminder sent");
          } catch (err) {
            console.log(err.message);
          }
        }

        claimedAlert.enabled = false;
        claimedAlert.lastTriggeredAt = now;
        await claimedAlert.save();

        console.log(`Alert disabled: ${alert.title}`);
      } catch (err) {
        console.error(
          `Alert processing failed for ${alert?._id || "unknown"}:`,
          err?.message || err
        );
      }
    }
  } catch (err) {
    console.error("Cron error:", err.message);
  }
});
