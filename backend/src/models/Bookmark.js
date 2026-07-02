const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    hackathonId: { type: String, required: true, trim: true },
  },
  { timestamps: true, collection: "Bookmarks" }
);

bookmarkSchema.index({ user: 1, hackathonId: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
