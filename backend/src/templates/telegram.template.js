function buildTelegramReminder({ firstName, title }) {
  return `
🚀 *HackRadar Reminder*

━━━━━━━━━━━━━━━━━━

👋 Hello *${firstName || "Hacker"}*

🏆 *Hackathon*
${title}

⏰ *Deadline Alert*
Your registration deadline is approaching.

💡 Don't forget to:
• Complete your team
• Submit before the deadline
• Keep your documents ready

━━━━━━━━━━━━━━━━━━

🔥 Good luck and happy hacking!

— Team HackRadar
`;
}

module.exports = {
  buildTelegramReminder,
};