const express = require("express");
const router = express.Router();

const { getPlacementStats } = require("../controllers/placementstatsControl");

router.get("/:year", getPlacementStats);

module.exports = router;
