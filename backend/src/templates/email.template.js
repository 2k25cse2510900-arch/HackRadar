const buildReminderEmail = ({
  firstName,
  title,
  registrationLink,
  registrationDeadline,
  remainingTime,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="
margin:0;
padding:0;
background:#f4f7fc;
font-family:Arial,sans-serif;
">

<div style="
max-width:650px;
margin:40px auto;
background:white;
border-radius:16px;
overflow:hidden;
box-shadow:0 6px 20px rgba(0,0,0,.12);
">

<div style="
background:linear-gradient(90deg,#6A11CB,#2575FC);
padding:30px;
text-align:center;
">

<h1 style="
color:white;
margin:0;
font-size:34px;
">
🚀 HackRadar
</h1>

<p style="
color:white;
margin-top:10px;
font-size:18px;
">
Never Miss A Hackathon Again
</p>

</div>

<div style="padding:40px;">

<h2>Hello ${firstName || "Hacker"} 👋</h2>

<p style="font-size:17px;line-height:1.7;">
Your saved hackathon is approaching.
</p>

<div style="
background:#f6f8fc;
padding:25px;
border-radius:12px;
margin:25px 0;
">

<h2 style="margin-top:0;">
🏆 ${title}
</h2>

<p>
<strong>Registration deadline:</strong> ${registrationDeadline || "Check the official website"}
</p>

<p>
<strong>Time remaining:</strong> ${remainingTime || "Registration deadline is approaching"}
</p>

</div>

<div style="text-align:center;">

<a
href="${registrationLink || "#"}"
style="
display:inline-block;
padding:15px 35px;
background:#2575FC;
color:white;
text-decoration:none;
border-radius:10px;
font-size:18px;
font-weight:bold;
">

Register Now →

</a>

</div>

<hr style="margin:40px 0;">

<p style="
text-align:center;
color:#777;
">

Made with ❤️ by HackRadar

</p>

</div>

</div>

</body>
</html>
`;
};

module.exports = {
  buildReminderEmail,
};
