const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const generateJAF = require('../utils/generateJAF');
const { sendStatusEmail } = require('../utils/sendEmail');
const { createStyledWorkbook, formatCandidateData } = require('../utils/excelUtils');

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
            status: 'pending',
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

        const pipeline = {
            Applied: [], Screening: [], Test: [],
            'Tech Interview': [], HR: [], Selected: [], Rejected: [],
        };

        const allApps = await Application.find({ job: jobId }).populate('student', 'email studentProfile');
        allApps.forEach((app) => {
            if (pipeline[app.stage]) pipeline[app.stage].push(app);
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

        const job = await Job.findOne({ _id: application.job, company: req.user._id });
        if (!job) return res.status(403).json({ message: 'Access denied.' });

        const oldStage = application.stage;
        application.stage = stage;
        application.stageHistory.push({ stage, changedBy: req.user._id, notes });
        await application.save();

        if (stage === 'Selected' && oldStage !== 'Selected') {
            await Job.findByIdAndUpdate(application.job, { $inc: { selectedCount: 1 } });
        }

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

// @desc    Export candidates list (professional formatting)
// @route   GET /api/company/jobs/:jobId/export
exports.exportCandidates = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findOne({ _id: jobId, company: req.user._id });
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        const applications = await Application.find({ job: jobId })
            .populate('student', 'email studentProfile');

        const data = formatCandidateData(applications);

        const stageCounts = {};
        applications.forEach((app) => { stageCounts[app.stage] = (stageCounts[app.stage] || 0) + 1; });

        const summary = [
            { label: 'Job Title', value: job.title },
            { label: 'Total Applicants', value: applications.length },
            ...Object.entries(stageCounts).map(([stage, count]) => ({ label: `Stage: ${stage}`, value: count })),
            { label: 'Export Date', value: new Date().toLocaleDateString('en-IN') },
        ];

        const buffer = createStyledWorkbook({
            sheets: [{ name: 'Candidates', data }],
            summary,
        });

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=Candidates_${job.title.replace(/\s+/g, '_')}.xlsx`,
        });
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all student registrations/applications across all company jobs
// @route   GET /api/company/registrations
exports.getStudentRegistrations = async (req, res) => {
    try {
        const { page = 1, limit = 50, search, stage, branch, jobId } = req.query;

        const jobQuery = { company: req.user._id };
        if (jobId) jobQuery._id = jobId;

        const jobs = await Job.find(jobQuery).select('_id title');
        const jobIds = jobs.map((j) => j._id);

        const appQuery = { job: { $in: jobIds } };
        if (stage) appQuery.stage = stage;

        let applications = await Application.find(appQuery)
            .populate('student', 'email studentProfile')
            .populate('job', 'title jobType packageLPA deadline')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        if (search) {
            const s = search.toLowerCase();
            applications = applications.filter((app) => {
                const sp = app.student?.studentProfile;
                const name = `${sp?.firstName || ''} ${sp?.lastName || ''}`.toLowerCase();
                const email = (app.student?.email || '').toLowerCase();
                const roll = (sp?.rollNumber || '').toLowerCase();
                return name.includes(s) || email.includes(s) || roll.includes(s);
            });
        }

        if (branch) {
            applications = applications.filter((app) => app.student?.studentProfile?.branch === branch);
        }

        const total = await Application.countDocuments(appQuery);

        const registrations = applications.map((app) => {
            const sp = app.student?.studentProfile || {};
            return {
                _id: app._id,
                studentId: app.student?._id,
                studentName: `${sp.firstName || ''} ${sp.lastName || ''}`.trim(),
                rollNumber: sp.rollNumber || '',
                branch: sp.branch || '',
                degree: sp.degree || '',
                cgpa: sp.cgpa || 0,
                activeBacklogs: sp.activeBacklogs || 0,
                email: app.student?.email || '',
                phone: sp.phone || '',
                gender: sp.gender || '',
                tenthPercentage: sp.tenthPercentage || null,
                twelfthPercentage: sp.twelfthPercentage || null,
                resumeUrl: sp.resumeUrl || '',
                isPlaced: sp.isPlaced || false,
                placedCompany: sp.placedCompany || '',
                stage: app.stage,
                jobTitle: app.job?.title || '',
                jobType: app.job?.jobType || '',
                packageLPA: app.job?.packageLPA || {},
                appliedDate: app.createdAt,
                updatedDate: app.updatedAt,
            };
        });

        res.json({
            registrations,
            jobs: jobs.map((j) => ({ _id: j._id, title: j.title })),
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Export all student registrations across all jobs
// @route   GET /api/company/registrations/export
exports.exportStudentRegistrations = async (req, res) => {
    try {
        const jobs = await Job.find({ company: req.user._id }).select('_id title');
        const jobIds = jobs.map((j) => j._id);

        const applications = await Application.find({ job: { $in: jobIds } })
            .populate('student', 'email studentProfile')
            .populate('job', 'title jobType packageLPA');

        const data = formatCandidateData(applications).map((row, idx) => ({
            ...row,
            'Job Title': applications[idx]?.job?.title || 'N/A',
            'Job Type': applications[idx]?.job?.jobType || 'N/A',
        }));

        const stageCounts = {};
        applications.forEach((app) => { stageCounts[app.stage] = (stageCounts[app.stage] || 0) + 1; });

        const summary = [
            { label: 'Total Registrations', value: applications.length },
            ...Object.entries(stageCounts).map(([stage, count]) => ({ label: `Stage: ${stage}`, value: count })),
            { label: 'Total Jobs', value: jobs.length },
            { label: 'Export Date', value: new Date().toLocaleDateString('en-IN') },
        ];

        const buffer = createStyledWorkbook({
            sheets: [{ name: 'Student Registrations', data }],
            summary,
        });

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=Student_Registrations.xlsx',
        });
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
