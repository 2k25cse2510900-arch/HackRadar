const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  await mongoose.connect(uri);
  console.log("Connected");
  process.exit(0);
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
