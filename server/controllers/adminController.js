const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const AuditLog = require('../models/AuditLog');

// @desc    Admin Dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCompanies = await User.countDocuments({ role: 'company' });
        const pendingVerifications = await User.countDocuments({ isVerified: false, isEmailVerified: true });
        const pendingJobs = await Job.countDocuments({ status: 'pending' });
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();
        const totalPlaced = await Application.countDocuments({ stage: 'Selected' });

        const recentLogs = await AuditLog.find()
            .populate('actor', 'email role')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            stats: {
                totalStudents, totalCompanies, pendingVerifications,
                pendingJobs, totalJobs, totalApplications, totalPlaced,
            },
            recentLogs,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get users pending verification
// @route   GET /api/admin/verify
exports.getPendingUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;
        const query = { isVerified: false };
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { 'studentProfile.firstName': { $regex: search, $options: 'i' } },
                { 'studentProfile.lastName': { $regex: search, $options: 'i' } },
                { 'companyProfile.companyName': { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(query)
            .select('-password -otp')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({ users, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify/Reject user
// @route   PUT /api/admin/verify/:id
exports.verifyUser = async (req, res) => {
    try {
        const { action, reason } = req.body; // action: 'approve' | 'reject'
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (action === 'approve') {
            user.isVerified = true;
            await user.save();

            await AuditLog.create({
                action: 'USER_VERIFIED',
                actor: req.user._id,
                target: user._id,
                targetModel: 'User',
                details: { email: user.email, role: user.role },
            });

            res.json({ message: 'User verified successfully.' });
        } else if (action === 'reject') {
            await AuditLog.create({
                action: 'USER_REJECTED',
                actor: req.user._id,
                target: user._id,
                targetModel: 'User',
                details: { email: user.email, role: user.role, reason },
            });

            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'User rejected and removed.' });
        } else {
            res.status(400).json({ message: 'Invalid action. Use "approve" or "reject".' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get jobs pending approval
// @route   GET /api/admin/job-approvals
exports.getPendingJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = { status: 'pending' };
        if (search) query.title = { $regex: search, $options: 'i' };

        const jobs = await Job.find(query)
            .populate('company', 'email companyProfile')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Job.countDocuments(query);

        res.json({ jobs, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Approve/Reject job
// @route   PUT /api/admin/job-approvals/:id
exports.approveJob = async (req, res) => {
    try {
        const { action, reason } = req.body;
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        if (action === 'approve') {
            job.status = 'approved';
            job.approvedBy = req.user._id;
            job.approvedAt = new Date();
            await job.save();

            await AuditLog.create({
                action: 'JOB_APPROVED',
                actor: req.user._id,
                target: job._id,
                targetModel: 'Job',
                details: { title: job.title },
            });

            res.json({ message: 'Job approved successfully.', job });
        } else if (action === 'reject') {
            job.status = 'rejected';
            job.rejectionReason = reason;
            await job.save();

            await AuditLog.create({
                action: 'JOB_REJECTED',
                actor: req.user._id,
                target: job._id,
                targetModel: 'Job',
                details: { title: job.title, reason },
            });

            res.json({ message: 'Job rejected.', job });
        } else {
            res.status(400).json({ message: 'Invalid action.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
exports.getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, action, search } = req.query;
        const query = {};
        if (action) query.action = action;

        const logs = await AuditLog.find(query)
            .populate('actor', 'email role')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await AuditLog.countDocuments(query);

        res.json({ logs, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
