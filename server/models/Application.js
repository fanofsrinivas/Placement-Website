const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        stage: {
            type: String,
            enum: ['Applied', 'Screening', 'Test', 'Tech Interview', 'HR', 'Selected', 'Rejected'],
            default: 'Applied',
        },
        stageHistory: [
            {
                stage: String,
                changedAt: { type: Date, default: Date.now },
                changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                notes: String,
            },
        ],
        resumeUrl: String,
        coverLetter: String,
        interviewSchedule: {
            date: Date,
            time: String,
            link: String, // Video call link
            location: String,
            type: { type: String, enum: ['Online', 'Offline'] },
        },
    },
    { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
