const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const AuditLog = require('../models/AuditLog');
const { branchMatches } = require('../utils/branchMapping');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get student profile
// @route   GET /api/student/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otp');
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.calculateProfileCompletion();
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
exports.updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            'firstName', 'lastName', 'rollNumber', 'branch', 'degree',
            'cgpa', 'activeBacklogs', 'tenthPercentage', 'twelfthPercentage',
            'phone', 'gender', 'dateOfBirth', 'passingYear', 'skills',
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[`studentProfile.${field}`] = req.body[field];
            }
        }

        // CGPA validation
        if (req.body.cgpa !== undefined && (req.body.cgpa < 0 || req.body.cgpa > 10)) {
            return res.status(400).json({ message: 'CGPA must be between 0 and 10.' });
        }

        const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true }).select('-password -otp');

        user.calculateProfileCompletion();
        await user.save();

        await AuditLog.create({
            action: 'PROFILE_UPDATED',
            actor: req.user._id,
            target: req.user._id,
            targetModel: 'User',
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload resume
// @route   POST /api/student/resume
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Please upload a file.' });

        const user = await User.findById(req.user._id);

        // Delete old resume from local disk (skipped for this mock)
        // if (user.studentProfile?.resumePublicId) {
        //     const oldPath = path.join(__dirname, '..', 'uploads', 'resumes', user.studentProfile.resumePublicId);
        //     if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        // }

        const relativeUrl = `/uploads/resumes/${req.file.filename}`;

        user.studentProfile.resumeUrl = relativeUrl;
        user.studentProfile.resumePublicId = req.file.filename;
        user.calculateProfileCompletion();
        await user.save();

        res.json({ message: 'Resume uploaded successfully', resumeUrl: relativeUrl });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Browse jobs (with eligibility filtering)
// @route   GET /api/student/jobs
exports.browseJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, branch, jobType } = req.query;
        const student = await User.findById(req.user._id);
        const sp = student.studentProfile;

        const query = { status: 'approved', deadline: { $gte: new Date() } };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        if (branch) query['eligibility.branches'] = branch;
        if (jobType) query.jobType = jobType;

        const jobs = await Job.find(query)
            .populate('company', 'companyProfile.companyName companyProfile.logoUrl companyProfile.industry')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Job.countDocuments(query);

        // Add eligibility status to each job
        const jobsWithEligibility = jobs.map((job) => {
            const j = job.toObject();
            const reasons = [];

            if (j.eligibility.minCGPA && sp.cgpa < j.eligibility.minCGPA) {
                reasons.push(`Minimum CGPA required: ${j.eligibility.minCGPA}. Your CGPA: ${sp.cgpa}`);
            }
            if (j.eligibility.maxBacklogs !== undefined && sp.activeBacklogs > j.eligibility.maxBacklogs) {
                reasons.push(`Maximum backlogs allowed: ${j.eligibility.maxBacklogs}. Your backlogs: ${sp.activeBacklogs}`);
            }
            if (j.eligibility.branches?.length > 0 && !branchMatches(sp.branch, j.eligibility.branches)) {
                reasons.push(`Your branch (${sp.branch}) is not eligible.`);
            }
            if (j.eligibility.degrees?.length > 0 && !j.eligibility.degrees.includes(sp.degree)) {
                reasons.push(`Your degree (${sp.degree}) is not eligible.`);
            }
            if (j.eligibility.passingYears?.length > 0 && !j.eligibility.passingYears.includes(sp.passingYear)) {
                reasons.push(`Your passing year (${sp.passingYear}) is not eligible.`);
            }

            j.isEligible = reasons.length === 0;
            j.ineligibilityReasons = reasons;

            return j;
        });

        res.json({
            jobs: jobsWithEligibility,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Apply to job
// @route   POST /api/student/apply/:jobId
exports.applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const student = await User.findById(req.user._id);
        const sp = student.studentProfile;
        const job = await Job.findById(jobId);

        if (!job) return res.status(404).json({ message: 'Job not found.' });
        if (job.status !== 'approved') return res.status(400).json({ message: 'This job is not accepting applications.' });
        if (new Date() > job.deadline) return res.status(400).json({ message: 'Application deadline has passed.' });

        // Eligibility check
        const reasons = [];
        if (job.eligibility.minCGPA && sp.cgpa < job.eligibility.minCGPA) {
            reasons.push(`Minimum CGPA required: ${job.eligibility.minCGPA}. Your CGPA: ${sp.cgpa}`);
        }
        if (job.eligibility.maxBacklogs !== undefined && sp.activeBacklogs > job.eligibility.maxBacklogs) {
            reasons.push(`Maximum backlogs allowed: ${job.eligibility.maxBacklogs}. Your backlogs: ${sp.activeBacklogs}`);
        }
        if (job.eligibility.branches?.length > 0 && !branchMatches(sp.branch, job.eligibility.branches)) {
            reasons.push(`Your branch (${sp.branch}) is not eligible.`);
        }

        if (reasons.length > 0) {
            return res.status(403).json({
                message: 'You are not eligible for this job.',
                reasons,
            });
        }

        // Check duplicate
        const existing = await Application.findOne({ student: req.user._id, job: jobId });
        if (existing) return res.status(400).json({ message: 'You have already applied to this job.' });

        const application = await Application.create({
            student: req.user._id,
            job: jobId,
            resumeUrl: sp.resumeUrl,
            coverLetter: req.body.coverLetter,
            stageHistory: [{ stage: 'Applied', changedBy: req.user._id }],
        });

        // Increment applicant count
        await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

        await AuditLog.create({
            action: 'APPLICATION_SUBMITTED',
            actor: req.user._id,
            target: application._id,
            targetModel: 'Application',
            details: { jobId, jobTitle: job.title },
        });

        res.status(201).json({ message: 'Applied successfully!', application });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already applied to this job.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get my applications
// @route   GET /api/student/applications
exports.getMyApplications = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const applications = await Application.find({ student: req.user._id })
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'companyProfile.companyName companyProfile.logoUrl' },
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Application.countDocuments({ student: req.user._id });

        res.json({
            applications,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get student dashboard stats
// @route   GET /api/student/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otp');
        user.calculateProfileCompletion();
        await user.save();

        const totalApplications = await Application.countDocuments({ student: req.user._id });
        const pendingApplications = await Application.countDocuments({ student: req.user._id, stage: 'Applied' });
        const interviewsScheduled = await Application.countDocuments({
            student: req.user._id,
            stage: { $in: ['Tech Interview', 'HR'] },
        });
        const selected = await Application.countDocuments({ student: req.user._id, stage: 'Selected' });

        const recentApplications = await Application.find({ student: req.user._id })
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'companyProfile.companyName companyProfile.logoUrl' },
            })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            user,
            stats: { totalApplications, pendingApplications, interviewsScheduled, selected },
            recentApplications,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
