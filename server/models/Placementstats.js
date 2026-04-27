const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },

  overview: {
    totalStudents: Number,
    totalPlaced: Number,
    highestPackage: Number,
    averagePackage: Number,
    medianPackage: Number,
    PlacementPercentage:Number,
    companiesVisited: Number
    
  },

  jobRoles: [
    {
      role: String,
      count: Number,
      color: String
    }
  ],

  salaryDistribution: [
    {
      label: String,
      count: Number,
      color: String
    }
  ],

  branchData: {
    type: Object
  },

  companies: [
    {
      name: String,
      count: Number
    }
  ],

  reportPdfUrl: String
});

module.exports = mongoose.model("PlacementStats", placementSchema, "PlacementStats");
