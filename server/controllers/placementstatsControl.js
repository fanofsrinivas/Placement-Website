const PlacementStats = require("../models/PlacementStats");

exports.getPlacementStats = async (req, res) => {
  try {
    const year = Number(req.params.year);

    console.log("Requested year:", year); // debug

    const data = await PlacementStats.findOne({ year });

    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
