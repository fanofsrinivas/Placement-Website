const express = require("express");
const router = express.Router();

const { getPlacementStats } = require("../controllers/placementStatsController");

router.get("/:year", getPlacementStats);

module.exports = router;
