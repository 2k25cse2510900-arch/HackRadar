const Bookmark = require("../models/Bookmark");
const ApiError = require("../utils/ApiError");
const hackathonService = require("./hackathon.service");

async function listBookmarks(userId) {
  const bookmarks = await Bookmark.find({ user: userId }).sort({ createdAt: -1 });
  return bookmarks.map((bookmark) => ({
    ...bookmark.toObject(),
    hackathon: hackathonService.getHackathonById(bookmark.hackathonId),
  }));
}

async function saveBookmark(userId, hackathonId) {
  hackathonService.getHackathonById(hackathonId);

  try {
    return await Bookmark.create({ user: userId, hackathonId });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Hackathon is already bookmarked");
    }
    throw error;
  }
}

async function removeBookmark(userId, bookmarkId) {
  const bookmark = await Bookmark.findOneAndDelete({ _id: bookmarkId, user: userId });
  if (!bookmark) {
    throw new ApiError(404, "Bookmark not found");
  }
  return bookmark;
}

module.exports = {
  listBookmarks,
  saveBookmark,
  removeBookmark,
};
