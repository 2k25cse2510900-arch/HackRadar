const bookmarkService = require("../services/bookmark.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const listBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await bookmarkService.listBookmarks(req.user._id);
  res.status(200).json(new ApiResponse(200, { bookmarks }, "Bookmarks fetched"));
});

const saveBookmark = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.saveBookmark(req.user._id, req.body.hackathonId);
  res.status(201).json(new ApiResponse(201, { bookmark }, "Bookmark saved"));
});

const removeBookmark = asyncHandler(async (req, res) => {
  await bookmarkService.removeBookmark(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Bookmark removed"));
});

module.exports = {
  listBookmarks,
  saveBookmark,
  removeBookmark,
};
