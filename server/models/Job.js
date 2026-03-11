const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Job description is required'],
        },
        jobType: {
            type: String,
            enum: ['Full-Time', 'Internship', '6-Month Internship + FTE', 'PPO'],
            required: true,
        },
        location: String,
        packageLPA: {
            min: { type: Number, required: true },
            max: { type: Number },
        },
        stipend: Number, // For internships
        eligibility: {
            branches: [{ type: String }],
            minCGPA: { type: Number, default: 0 },
            maxBacklogs: { type: Number, default: 0 },
            degrees: [{ type: String }],
            passingYears: [{ type: Number }],
            gender: { type: String, enum: ['All', 'Male', 'Female'], default: 'All' },
        },
        skills: [String],
        deadline: {
            type: Date,
            required: [true, 'Application deadline is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'closed'],
            default: 'pending',
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedAt: Date,
        rejectionReason: String,
        driveId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Drive',
        },
        applicantCount: { type: Number, default: 0 },
        selectedCount: { type: Number, default: 0 },
        jafGenerated: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index for efficient queries
jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ company: 1 });

module.exports = mongoose.model('Job', jobSchema);
