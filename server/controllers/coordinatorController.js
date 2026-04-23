const Drive = require('../models/Drive');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { createStyledWorkbook, formatApplicationData, formatStudentData } = require('../utils/excelUtils');

// @desc    Coordinator Dashboard
// @route   GET /api/coordinator/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const coordinator = await User.findById(userId);
        const departments = coordinator?.coordinatorProfile?.departments || [];

        // Drives this coordinator is assigned to or created
        const assignedDrives = await Drive.countDocuments({
            $or: [{ coordinators: userId }, { createdBy: userId }],
        });
        const activeDrives = await Drive.countDocuments({
            $or: [{ coordinators: userId }, { createdBy: userId }],
            status: 'active',
        });

        // Jobs created within those drives
        const drives = await Drive.find({
            $or: [{ coordinators: userId }, { createdBy: userId }],
        }).select('_id');
        const driveIds = drives.map((d) => d._id);

        const totalJobs = await Job.countDocuments({ driveId: { $in: driveIds } });
        const pendingJobs = await Job.countDocuments({ driveId: { $in: driveIds }, status: 'pending' });

        // Applications for jobs in these drives
        const jobs = await Job.find({ driveId: { $in: driveIds } }).select('_id');
        const jobIds = jobs.map((j) => j._id);
        const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
        const selectedApplications = await Application.countDocuments({ job: { $in: jobIds }, stage: 'Selected' });

        // Department-specific stats
        let departmentStats = null;
        if (departments.length > 0) {
            const deptStudents = await User.countDocuments({
                role: 'student',
                'studentProfile.branch': { $in: departments },
            });
            const deptPlaced = await User.countDocuments({
                role: 'student',
                'studentProfile.branch': { $in: departments },
                'studentProfile.isPlaced': true,
            });
            departmentStats = {
                departments,
                totalStudents: deptStudents,
                placedStudents: deptPlaced,
                placementRate: deptStudents > 0 ? Math.round((deptPlaced / deptStudents) * 100) : 0,
            };
        }

        const recentDrives = await Drive.find({
            $or: [{ coordinators: userId }, { createdBy: userId }],
        })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                assignedDrives,
                activeDrives,
                totalJobs,
                pendingJobs,
                totalApplications,
                selectedApplications,
            },
            departmentStats,
            recentDrives,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get drives (assigned or created by coordinator)
// @route   GET /api/coordinator/drives
exports.getDrives = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const query = {
            $or: [{ coordinators: req.user._id }, { createdBy: req.user._id }],
        };
        if (status) query.status = status;
        if (search) query.title = { $regex: search, $options: 'i' };

        const drives = await Drive.find(query)
            .populate('createdBy', 'email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Drive.countDocuments(query);

        res.json({ drives, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new drive
// @route   POST /api/coordinator/drives
exports.createDrive = async (req, res) => {
    try {
        const drive = await Drive.create({
            ...req.body,
            createdBy: req.user._id,
            coordinators: [req.user._id],
        });

        await AuditLog.create({
            action: 'DRIVE_CREATED',
            actor: req.user._id,
            target: drive._id,
            targetModel: 'Drive',
            details: { title: drive.title, createdByCoordinator: true },
        });

        res.status(201).json({ message: 'Drive created successfully.', drive });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a drive
// @route   PUT /api/coordinator/drives/:id
exports.updateDrive = async (req, res) => {
    try {
        const drive = await Drive.findOne({
            _id: req.params.id,
            $or: [{ coordinators: req.user._id }, { createdBy: req.user._id }],
        });
        if (!drive) return res.status(404).json({ message: 'Drive not found or access denied.' });

        Object.assign(drive, req.body);
        await drive.save();

        await AuditLog.create({
            action: 'DRIVE_UPDATED',
            actor: req.user._id,
            target: drive._id,
            targetModel: 'Drive',
        });

        res.json({ message: 'Drive updated.', drive });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add company to a drive
// @route   POST /api/coordinator/drives/:driveId/companies
exports.addCompanyToDrive = async (req, res) => {
    try {
        const drive = await Drive.findOne({
            _id: req.params.driveId,
            $or: [{ coordinators: req.user._id }, { createdBy: req.user._id }],
        });
        if (!drive) return res.status(404).json({ message: 'Drive not found or access denied.' });

        const { companyId } = req.body;
        if (!drive.companies.includes(companyId)) {
            drive.companies.push(companyId);
            await drive.save();
        }

        res.json({ message: 'Company added to drive.', drive });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a job posting with branch eligibility
// @route   POST /api/coordinator/jobs
exports.createJobPosting = async (req, res) => {
    try {
        const { driveId, title, description, jobType, location, packageLPA, stipend,
            eligibility, skills, deadline, companyId } = req.body;

        if (driveId) {
            const drive = await Drive.findOne({
                _id: driveId,
                $or: [{ coordinators: req.user._id }, { createdBy: req.user._id }],
            });
            if (!drive) return res.status(403).json({ message: 'Access denied to this drive.' });
        }

        const job = await Job.create({
            company: companyId || req.user._id,
            title, description, jobType, location, packageLPA, stipend,
            eligibility, skills, deadline, driveId,
            status: 'pending',
        });

        if (driveId) {
            await Drive.findByIdAndUpdate(driveId, { $push: { jobs: job._id } });
        }

        await AuditLog.create({
            action: 'JOB_POSTED',
            actor: req.user._id,
            target: job._id,
            targetModel: 'Job',
            details: { title: job.title, postedByCoordinator: true },
        });

        res.status(201).json({ message: 'Job posted. Awaiting approval.', job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all applications for drives this coordinator manages (for data grid)
// @route   GET /api/coordinator/applications
exports.getApplications = async (req, res) => {
    try {
        const { page = 1, limit = 100, search, stage, branch, driveId } = req.query;

        const driveQuery = {
            $or: [{ coordinators: req.user._id }, { createdBy: req.user._id }],
        };
        if (driveId) driveQuery._id = driveId;

        const drives = await Drive.find(driveQuery).select('_id');
        const driveIds = drives.map((d) => d._id);

        const jobQuery = { driveId: { $in: driveIds } };
        const jobs = await Job.find(jobQuery).select('_id title');
        const jobIds = jobs.map((j) => j._id);

        const appQuery = { job: { $in: jobIds } };
        if (stage) appQuery.stage = stage;

        let applications = await Application.find(appQuery)
            .populate('student', 'email studentProfile')
            .populate({
                path: 'job',
                select: 'title company packageLPA jobType driveId',
                populate: { path: 'company', select: 'companyProfile.companyName' },
            })
            .sort({ updatedAt: -1 })
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

        const gridData = applications.map((app) => {
            const sp = app.student?.studentProfile || {};
            return {
                _id: app._id,
                studentName: `${sp.firstName || ''} ${sp.lastName || ''}`.trim(),
                rollNumber: sp.rollNumber || '',
                branch: sp.branch || '',
                degree: sp.degree || '',
                cgpa: sp.cgpa || 0,
                email: app.student?.email || '',
                phone: sp.phone || '',
                stage: app.stage,
                jobTitle: app.job?.title || '',
                companyName: app.job?.company?.companyProfile?.companyName || '',
                packageLPA: app.job?.packageLPA || {},
                jobType: app.job?.jobType || '',
                appliedDate: app.createdAt,
                updatedDate: app.updatedAt,
            };
        });

        res.json({
            applications: gridData,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update application data (from grid editing)
// @route   PUT /api/coordinator/applications/:id
exports.updateApplicationData = async (req, res) => {
    try {
        const { stage, notes } = req.body;
        const application = await Application.findById(req.params.id).populate('student', 'email studentProfile');
        if (!application) return res.status(404).json({ message: 'Application not found.' });

        const job = await Job.findById(application.job);
        if (job && job.driveId) {
            const drive = await Drive.findOne({
                _id: job.driveId,
                $or: [{ coordinators: req.user._id }, { createdBy: req.user._id }],
            });
            if (!drive) return res.status(403).json({ message: 'Access denied.' });
        }

        const oldStage = application.stage;

        if (stage && stage !== oldStage) {
            application.stage = stage;
            application.stageHistory.push({
                stage,
                changedBy: req.user._id,
                notes: notes || `Stage changed by coordinator`,
            });

            if (stage === 'Selected' && oldStage !== 'Selected') {
                await Job.findByIdAndUpdate(application.job, { $inc: { selectedCount: 1 } });
            }
        }

        await application.save();

        await AuditLog.create({
            action: 'APPLICATION_STAGE_CHANGED',
            actor: req.user._id,
            target: application._id,
            targetModel: 'Application',
            details: { oldStage, newStage: stage, changedByCoordinator: true },
        });

        res.json({ message: 'Application updated.', application });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Export applications to Excel (professional formatting)
// @route   GET /api/coordinator/applications/export
exports.exportApplicationsExcel = async (req, res) => {
    try {
        const drives = await Drive.find({
            $or: [{ coordinators: req.user._id }, { createdBy: req.user._id }],
        }).select('_id title');
        const driveIds = drives.map((d) => d._id);

        const jobs = await Job.find({ driveId: { $in: driveIds } }).select('_id title');
        const jobIds = jobs.map((j) => j._id);

        const applications = await Application.find({ job: { $in: jobIds } })
            .populate('student', 'email studentProfile')
            .populate({
                path: 'job',
                select: 'title company packageLPA jobType',
                populate: { path: 'company', select: 'companyProfile.companyName' },
            });

        const data = formatApplicationData(applications);

        // Stage summary
        const stageCounts = {};
        applications.forEach((app) => { stageCounts[app.stage] = (stageCounts[app.stage] || 0) + 1; });

        // Branch summary
        const branchCounts = {};
        applications.forEach((app) => {
            const branch = app.student?.studentProfile?.branch || 'Unknown';
            branchCounts[branch] = (branchCounts[branch] || 0) + 1;
        });

        const summary = [
            { label: 'Total Applications', value: applications.length },
            { label: 'Total Drives', value: drives.length },
            { label: 'Total Jobs', value: jobs.length },
            ...Object.entries(stageCounts).map(([stage, count]) => ({ label: `Stage: ${stage}`, value: count })),
            { label: '---', value: '---' },
            ...Object.entries(branchCounts).map(([branch, count]) => ({ label: `Branch: ${branch}`, value: count })),
            { label: 'Export Date', value: new Date().toLocaleDateString('en-IN') },
        ];

        const buffer = createStyledWorkbook({
            sheets: [{ name: 'Applications', data }],
            summary,
        });

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=Coordinator_Applications_Export.xlsx',
        });
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all verified companies (for adding to drives)
// @route   GET /api/coordinator/companies
exports.getCompanies = async (req, res) => {
    try {
        const { search } = req.query;
        const query = { role: 'company', isVerified: true };
        if (search) {
            query['companyProfile.companyName'] = { $regex: search, $options: 'i' };
        }

        const companies = await User.find(query)
            .select('email companyProfile')
            .sort({ 'companyProfile.companyName': 1 })
            .limit(50);

        res.json({ companies });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get students in coordinator's department(s)
// @route   GET /api/coordinator/students
exports.getDepartmentStudents = async (req, res) => {
    try {
        const { page = 1, limit = 50, search, branch, placed, sort: sortField = 'name' } = req.query;

        const coordinator = await User.findById(req.user._id);
        const departments = coordinator?.coordinatorProfile?.departments || [];

        // Build query
        const query = { role: 'student' };

        // If coordinator has departments assigned, filter by them
        // Allow branch query param to override for specific department view
        if (branch) {
            query['studentProfile.branch'] = branch;
        } else if (departments.length > 0) {
            query['studentProfile.branch'] = { $in: departments };
        }

        if (placed === 'yes') query['studentProfile.isPlaced'] = true;
        if (placed === 'no') query['studentProfile.isPlaced'] = { $ne: true };

        if (search) {
            query.$or = [
                { 'studentProfile.firstName': { $regex: search, $options: 'i' } },
                { 'studentProfile.lastName': { $regex: search, $options: 'i' } },
                { 'studentProfile.rollNumber': { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Sort
        let sortObj = { 'studentProfile.firstName': 1 };
        if (sortField === 'cgpa') sortObj = { 'studentProfile.cgpa': -1 };
        if (sortField === 'roll') sortObj = { 'studentProfile.rollNumber': 1 };
        if (sortField === 'recent') sortObj = { createdAt: -1 };

        const students = await User.find(query)
            .select('-password -otp')
            .sort(sortObj)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        // Get department stats
        const deptStudentCount = departments.length > 0
            ? await User.countDocuments({ role: 'student', 'studentProfile.branch': { $in: departments } })
            : total;
        const deptPlacedCount = departments.length > 0
            ? await User.countDocuments({ role: 'student', 'studentProfile.branch': { $in: departments }, 'studentProfile.isPlaced': true })
            : await User.countDocuments({ role: 'student', 'studentProfile.isPlaced': true });

        const formatted = students.map((s) => {
            const sp = s.studentProfile || {};
            return {
                _id: s._id,
                name: `${sp.firstName || ''} ${sp.lastName || ''}`.trim(),
                rollNumber: sp.rollNumber || '',
                email: s.email,
                branch: sp.branch || '',
                degree: sp.degree || '',
                cgpa: sp.cgpa || 0,
                activeBacklogs: sp.activeBacklogs || 0,
                phone: sp.phone || '',
                gender: sp.gender || '',
                passingYear: sp.passingYear || '',
                isPlaced: sp.isPlaced || false,
                placedCompany: sp.placedCompany || '',
                placedPackage: sp.placedPackage || 0,
                profileCompleted: sp.profileCompleted || 0,
                isVerified: s.isVerified,
                isEmailVerified: s.isEmailVerified,
            };
        });

        res.json({
            students: formatted,
            departments,
            stats: {
                totalStudents: deptStudentCount,
                placedStudents: deptPlacedCount,
                placementRate: deptStudentCount > 0 ? Math.round((deptPlacedCount / deptStudentCount) * 100) : 0,
            },
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Export department students to Excel
// @route   GET /api/coordinator/students/export
exports.exportDepartmentStudents = async (req, res) => {
    try {
        const coordinator = await User.findById(req.user._id);
        const departments = coordinator?.coordinatorProfile?.departments || [];

        const query = { role: 'student' };
        if (departments.length > 0) {
            query['studentProfile.branch'] = { $in: departments };
        }

        const students = await User.find(query).select('-password -otp').sort({ 'studentProfile.branch': 1, 'studentProfile.firstName': 1 });

        const data = formatStudentData(students);

        // Department-wise summary
        const deptCounts = {};
        const deptPlaced = {};
        students.forEach((s) => {
            const br = s.studentProfile?.branch || 'Unknown';
            deptCounts[br] = (deptCounts[br] || 0) + 1;
            if (s.studentProfile?.isPlaced) deptPlaced[br] = (deptPlaced[br] || 0) + 1;
        });

        const summary = [
            { label: 'Total Students', value: students.length },
            { label: 'Total Placed', value: students.filter(s => s.studentProfile?.isPlaced).length },
            { label: '---', value: '---' },
            ...Object.entries(deptCounts).map(([dept, count]) => ({
                label: `${dept}: Total / Placed`,
                value: `${count} / ${deptPlaced[dept] || 0}`,
            })),
            { label: 'Export Date', value: new Date().toLocaleDateString('en-IN') },
        ];

        const buffer = createStyledWorkbook({
            sheets: [{ name: 'Department Students', data }],
            summary,
        });

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=Department_Students_${departments.join('_') || 'All'}.xlsx`,
        });
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
