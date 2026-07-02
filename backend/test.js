const mongoose = require("mongoose");

mongoose.connect("MONGODB_URI=mongodb+srv://hackradaradmin:Et79zdNnGesUxlB6@hackradar-cluster.qyztrbh.mongodb.net/hackradar?retryWrites=true&w=majority&appName=hackradar-cluster")
.then(() => {
    console.log("✅ Connected Successfully");
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});