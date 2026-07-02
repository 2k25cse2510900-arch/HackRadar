const hackathonService = require("../services/hackathon.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const listHackathons = asyncHandler(async (req, res) => {
  const hackathons = hackathonService.listHackathons();
  res.status(200).json(new ApiResponse(200, { hackathons }, "Hackathons fetched"));
});

const getHackathon = asyncHandler(async (req, res) => {
  const hackathon = hackathonService.getHackathonById(req.params.id);
  res.status(200).json(new ApiResponse(200, { hackathon }, "Hackathon fetched"));
});

module.exports = {
  listHackathons,
  getHackathon,
};
