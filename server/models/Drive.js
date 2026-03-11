const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Drive title is required'],
            trim: true,
        },
        academicYear: {
            type: String,
            required: true, // e.g. "2025-2026"
        },
        description: String,
        startDate: { type: Date, required: true },
        endDate: Date,
        status: {
            type: String,
            enum: ['upcoming', 'active', 'completed'],
            default: 'upcoming',
        },
        eligibility: {
            branches: [String],
            minCGPA: { type: Number, default: 0 },
            maxBacklogs: { type: Number, default: 0 },
            degrees: [String],
            passingYears: [Number],
        },
        companies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        jobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
        coordinators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        stats: {
            totalRegistered: { type: Number, default: 0 },
            totalPlaced: { type: Number, default: 0 },
            highestPackage: { type: Number, default: 0 },
            averagePackage: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Drive', driveSchema);
