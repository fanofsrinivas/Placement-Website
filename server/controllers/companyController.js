const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const generateJAF = require('../utils/generateJAF');
const { sendStatusEmail } = require('../utils/sendEmail');

// @desc    Get company dashboard
// @route   GET /api/company/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const companyId = req.user._id;

        const totalJobs = await Job.countDocuments({ company: companyId });
        const activeJobs = await Job.countDocuments({ company: companyId, status: 'approved', deadline: { $gte: new Date() } });
        const pendingJobs = await Job.countDocuments({ company: companyId, status: 'pending' });

        const jobIds = await Job.find({ company: companyId }).select('_id');
        const ids = jobIds.map((j) => j._id);
        const totalApplications = await Application.countDocuments({ job: { $in: ids } });
        const selectedCandidates = await Application.countDocuments({ job: { $in: ids }, stage: 'Selected' });

        const recentJobs = await Job.find({ company: companyId }).sort({ createdAt: -1 }).limit(5);

        res.json({
            stats: { totalJobs, activeJobs, pendingJobs, totalApplications, selectedCandidates },
            recentJobs,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create job posting
// @route   POST /api/company/jobs
exports.createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            company: req.user._id,
            status: 'pending', // ALWAYS pending by default
        });

        await AuditLog.create({
            action: 'JOB_POSTED',
            actor: req.user._id,
            target: job._id,
            targetModel: 'Job',
            details: { title: job.title },
        });

        res.status(201).json({ message: 'Job posted successfully. Awaiting admin approval.', job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get company's jobs
// @route   GET /api/company/jobs
exports.getJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const query = { company: req.user._id };
        if (status) query.status = status;
        if (search) query.title = { $regex: search, $options: 'i' };

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/company/jobs/:id
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, company: req.user._id });
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        // If job was already approved & substantive change is made, reset to pending
        const substantiveFields = ['title', 'description', 'eligibility', 'packageLPA'];
        const hasSubstantiveChange = substantiveFields.some((f) => req.body[f] !== undefined);
        if (job.status === 'approved' && hasSubstantiveChange) {
            req.body.status = 'pending';
        }

        Object.assign(job, req.body);
        await job.save();

        res.json({ message: 'Job updated successfully.', job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/company/jobs/:id
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, company: req.user._id });
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        // Delete related applications
        await Application.deleteMany({ job: job._id });

        res.json({ message: 'Job deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get candidates for a job (Pipeline)
// @route   GET /api/company/jobs/:jobId/candidates
exports.getCandidates = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { page = 1, limit = 50, stage, search } = req.query;

        // Verify job belongs to this company
        const job = await Job.findOne({ _id: jobId, company: req.user._id });
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        const query = { job: jobId };
        if (stage) query.stage = stage;

        let applications = await Application.find(query)
            .populate('student', 'email studentProfile')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        if (search) {
            applications = applications.filter((app) => {
                const sp = app.student.studentProfile;
                const name = `${sp.firstName || ''} ${sp.lastName || ''}`.toLowerCase();
                return name.includes(search.toLowerCase()) || app.student.email.includes(search.toLowerCase());
            });
        }

        const total = await Application.countDocuments(query);

        // Group by stage for Kanban
        const pipeline = {
            Applied: [],
            Screening: [],
            Test: [],
            'Tech Interview': [],
            HR: [],
            Selected: [],
            Rejected: [],
        };

        const allApps = await Application.find({ job: jobId }).populate('student', 'email studentProfile');
        allApps.forEach((app) => {
            if (pipeline[app.stage]) {
                pipeline[app.stage].push(app);
            }
        });

        res.json({ pipeline, applications, total, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update candidate stage (Kanban move)
// @route   PUT /api/company/applications/:id/stage
exports.updateCandidateStage = async (req, res) => {
    try {
        const { stage, notes } = req.body;
        const validStages = ['Applied', 'Screening', 'Test', 'Tech Interview', 'HR', 'Selected', 'Rejected'];
        if (!validStages.includes(stage)) {
            return res.status(400).json({ message: 'Invalid stage.' });
        }

        const application = await Application.findById(req.params.id).populate('student', 'email studentProfile');
        if (!application) return res.status(404).json({ message: 'Application not found.' });

        // Verify the job belongs to this company
        const job = await Job.findOne({ _id: application.job, company: req.user._id });
        if (!job) return res.status(403).json({ message: 'Access denied.' });

        const oldStage = application.stage;
        application.stage = stage;
        application.stageHistory.push({
            stage,
            changedBy: req.user._id,
            notes,
        });
        await application.save();

        // If selected, update counters
        if (stage === 'Selected' && oldStage !== 'Selected') {
            await Job.findByIdAndUpdate(application.job, { $inc: { selectedCount: 1 } });
        }

        // Send email notification
        const studentName = `${application.student.studentProfile?.firstName || ''} ${application.student.studentProfile?.lastName || ''}`.trim();
        await sendStatusEmail(application.student.email, studentName, job.title, stage);

        await AuditLog.create({
            action: 'APPLICATION_STAGE_CHANGED',
            actor: req.user._id,
            target: application._id,
            targetModel: 'Application',
            details: { oldStage, newStage: stage, jobTitle: job.title },
        });

        res.json({ message: `Candidate moved to ${stage}.`, application });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Schedule interview
// @route   PUT /api/company/applications/:id/interview
exports.scheduleInterview = async (req, res) => {
    try {
        const { date, time, link, location, type } = req.body;

        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found.' });

        const job = await Job.findOne({ _id: application.job, company: req.user._id });
        if (!job) return res.status(403).json({ message: 'Access denied.' });

        application.interviewSchedule = { date, time, link, location, type };
        await application.save();

        res.json({ message: 'Interview scheduled.', application });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Generate JAF PDF
// @route   GET /api/company/jobs/:id/jaf
exports.generateJAFPdf = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, company: req.user._id });
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        const company = await User.findById(req.user._id);
        const pdfBuffer = await generateJAF(job, company);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=JAF_${job.title.replace(/\s+/g, '_')}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Export candidates list
// @route   GET /api/company/jobs/:jobId/export
exports.exportCandidates = async (req, res) => {
    try {
        const XLSX = require('xlsx');
        const { jobId } = req.params;

        const job = await Job.findOne({ _id: jobId, company: req.user._id });
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        const applications = await Application.find({ job: jobId }).populate('student', 'email studentProfile');

        const data = applications.map((app) => ({
            Name: `${app.student.studentProfile?.firstName || ''} ${app.student.studentProfile?.lastName || ''}`,
            Email: app.student.email,
            'Roll Number': app.student.studentProfile?.rollNumber || '',
            Branch: app.student.studentProfile?.branch || '',
            CGPA: app.student.studentProfile?.cgpa || '',
            Stage: app.stage,
            'Applied Date': app.createdAt.toISOString().split('T')[0],
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=Candidates_${job.title.replace(/\s+/g, '_')}.xlsx`,
        });
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
