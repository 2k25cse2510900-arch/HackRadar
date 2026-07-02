const express = require("express");

const hackathonController = require("../controllers/hackathon.controller");

const router = express.Router();

router.get("/", hackathonController.listHackathons);
router.get("/:id", hackathonController.getHackathon);

module.exports = router;
