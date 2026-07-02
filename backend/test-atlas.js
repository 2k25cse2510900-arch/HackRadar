const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://hackradaradmin:Et79zdNnGesUxlB6@hackradar-cluster.qyztrbh.mongodb.net/hackradar?retryWrites=true&w=majority&appName=hackradar-cluster")
.then(() => {
    console.log("✅ Connected");
    process.exit(0);
})
.catch(err => {
    console.log(err);
    process.exit(1);
});