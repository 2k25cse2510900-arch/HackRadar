require("dotenv").config();

const { sendEmail } = require("./src/services/email.service");

async function testEmail() {
  try {
    await sendEmail({
      to: "krishchaddha69@gmail.com",
      subject: "🚀 HackRadar Email Test",
      html: `
        <h1>Hello from HackRadar!</h1>

        <p>This is your first email sent from the backend.</p>

        <hr>

        <p>If you're reading this, Nodemailer is configured correctly.</p>

        <h3>Congratulations 🎉</h3>
      `,
    });

    console.log("✅ Test email sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send email");
    console.error(err);
  }
}

testEmail();