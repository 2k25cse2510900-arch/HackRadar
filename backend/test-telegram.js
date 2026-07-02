require("dotenv").config();

const { sendTelegramMessage } = require("./src/services/telegram.service");

(async () => {
  await sendTelegramMessage("🚀 HackRadar Telegram Alert is working!");
  console.log("Message sent!");
})();