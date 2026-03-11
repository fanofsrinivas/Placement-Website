const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

const router = express.Router();

// @desc    Get placement statistics (public)
// @route   GET /api/public/stats
router.get('/stats', async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const placedStudents = await User.countDocuments({ role: 'student', 'studentProfile.isPlaced': true });
        const totalCompanies = await User.countDocuments({ role: 'company', isVerified: true });
        const activeJobs = await Job.countDocuments({ status: 'approved', deadline: { $gte: new Date() } });

        const packageStats = await Application.aggregate([
            { $match: { stage: 'Selected' } },
            { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobDetails' } },
            { $unwind: '$jobDetails' },
            {
                $group: {
                    _id: null,
                    avgPackage: { $avg: '$jobDetails.packageLPA.min' },
                    maxPackage: { $max: '$jobDetails.packageLPA.max' },
                    totalOffers: { $sum: 1 },
                },
            },
        ]);

        // Branch-wise stats for charts
        const branchWise = await User.aggregate([
            { $match: { role: 'student', 'studentProfile.isPlaced': true } },
            {
                $group: {
                    _id: '$studentProfile.branch',
                    count: { $sum: 1 },
                    avgPackage: { $avg: '$studentProfile.placedPackage' },
                },
            },
            { $sort: { count: -1 } },
        ]);

        // Top recruiters
        const topRecruiters = await User.find({ role: 'company', isVerified: true })
            .select('companyProfile.companyName companyProfile.logoUrl companyProfile.industry')
            .limit(20);

        res.json({
            totalStudents,
            placedStudents,
            placementRate: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0,
            totalCompanies,
            activeJobs,
            ...(packageStats[0] || { avgPackage: 0, maxPackage: 0, totalOffers: 0 }),
            branchWise,
            topRecruiters,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get approved jobs (public listing)
// @route   GET /api/public/jobs
router.get('/jobs', async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = { status: 'approved', deadline: { $gte: new Date() } };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const jobs = await Job.find(query)
            .populate('company', 'companyProfile.companyName companyProfile.logoUrl companyProfile.industry')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Job.countDocuments(query);

        res.json({ jobs, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
