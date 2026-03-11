const Drive = require('../models/Drive');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const XLSX = require('xlsx');

// @desc    TPO Dashboard
// @route   GET /api/tpo/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const totalDrives = await Drive.countDocuments();
        const activeDrives = await Drive.countDocuments({ status: 'active' });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const placedStudents = await User.countDocuments({ role: 'student', 'studentProfile.isPlaced': true });
        const totalCompanies = await User.countDocuments({ role: 'company', isVerified: true });
        const totalJobs = await Job.countDocuments({ status: 'approved' });

        // Package stats
        const packageStats = await Application.aggregate([
            { $match: { stage: 'Selected' } },
            { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobDetails' } },
            { $unwind: '$jobDetails' },
            {
                $group: {
                    _id: null,
                    avgPackage: { $avg: '$jobDetails.packageLPA.min' },
                    maxPackage: { $max: '$jobDetails.packageLPA.max' },
                    minPackage: { $min: '$jobDetails.packageLPA.min' },
                    totalOffers: { $sum: 1 },
                },
            },
        ]);

        res.json({
            stats: {
                totalDrives, activeDrives, totalStudents, placedStudents,
                totalCompanies, totalJobs,
                ...(packageStats[0] || { avgPackage: 0, maxPackage: 0, minPackage: 0, totalOffers: 0 }),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    CRUD Drives
exports.createDrive = async (req, res) => {
    try {
        const drive = await Drive.create({ ...req.body, createdBy: req.user._id });

        await AuditLog.create({
            action: 'DRIVE_CREATED',
            actor: req.user._id,
            target: drive._id,
            targetModel: 'Drive',
            details: { title: drive.title },
        });

        res.status(201).json({ message: 'Drive created successfully.', drive });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDrives = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const query = {};
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

exports.updateDrive = async (req, res) => {
    try {
        const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!drive) return res.status(404).json({ message: 'Drive not found.' });

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

exports.deleteDrive = async (req, res) => {
    try {
        const drive = await Drive.findByIdAndDelete(req.params.id);
        if (!drive) return res.status(404).json({ message: 'Drive not found.' });
        res.json({ message: 'Drive deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Download Excel import template
// @route   GET /api/tpo/legacy/template
exports.downloadTemplate = async (req, res) => {
    try {
        const headers = [
            'Student Name', 'Email', 'Roll Number', 'Branch', 'Degree',
            'CGPA', 'Company Name', 'Job Title', 'Package (LPA)',
            'Placement Year', 'Job Type',
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers]);
        XLSX.utils.book_append_sheet(wb, ws, 'Template');
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=CPMS_Legacy_Import_Template.xlsx',
        });
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Parse uploaded Excel and return preview
// @route   POST /api/tpo/legacy/parse
exports.parseExcel = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Please upload a file.' });

        // Read from local file
        const fs = require('fs');
        const buffer = fs.readFileSync(req.file.path);
        const wb = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = wb.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
        const headers = Object.keys(data[0] || {});

        const fileUrl = `/uploads/excel/${req.file.filename}`;

        res.json({
            headers,
            preview: data.slice(0, 5),
            totalRows: data.length,
            fileUrl,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error parsing file', error: error.message });
    }
};

// @desc    Validate mapped data
// @route   POST /api/tpo/legacy/validate
exports.validateData = async (req, res) => {
    try {
        const { data, columnMap } = req.body;
        const errors = [];
        const valid = [];

        data.forEach((row, idx) => {
            const rowErrors = [];
            const mapped = {};

            Object.entries(columnMap).forEach(([field, col]) => {
                mapped[field] = row[col];
            });

            if (!mapped.studentName) rowErrors.push('Student Name is required');
            if (!mapped.email) rowErrors.push('Email is required');
            if (!mapped.companyName) rowErrors.push('Company Name is required');
            if (mapped.cgpa && (isNaN(mapped.cgpa) || mapped.cgpa < 0 || mapped.cgpa > 10)) {
                rowErrors.push('CGPA must be 0-10');
            }

            if (rowErrors.length > 0) {
                errors.push({ row: idx + 1, errors: rowErrors });
            } else {
                valid.push(mapped);
            }
        });

        res.json({ valid, errors, totalValid: valid.length, totalErrors: errors.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Import validated data
// @route   POST /api/tpo/legacy/import
exports.importData = async (req, res) => {
    try {
        const { records } = req.body;
        let imported = 0;
        let skipped = 0;
        const details = [];

        for (const record of records) {
            try {
                // Check if student already exists
                let student = await User.findOne({ email: record.email });

                if (!student) {
                    student = await User.create({
                        email: record.email,
                        password: 'ChangeMe@123', // temporary
                        role: 'student',
                        isVerified: true,
                        isEmailVerified: true,
                        studentProfile: {
                            firstName: record.studentName?.split(' ')[0] || '',
                            lastName: record.studentName?.split(' ').slice(1).join(' ') || '',
                            rollNumber: record.rollNumber,
                            branch: record.branch,
                            degree: record.degree,
                            cgpa: parseFloat(record.cgpa) || 0,
                            passingYear: parseInt(record.placementYear) || new Date().getFullYear(),
                            isPlaced: true,
                            placedCompany: record.companyName,
                            placedPackage: parseFloat(record.packageLPA) || 0,
                        },
                    });
                } else {
                    student.studentProfile.isPlaced = true;
                    student.studentProfile.placedCompany = record.companyName;
                    student.studentProfile.placedPackage = parseFloat(record.packageLPA) || 0;
                    await student.save();
                }

                imported++;
                details.push({ email: record.email, status: 'imported' });
            } catch (err) {
                skipped++;
                details.push({ email: record.email, status: 'skipped', error: err.message });
            }
        }

        await AuditLog.create({
            action: 'LEGACY_DATA_IMPORTED',
            actor: req.user._id,
            details: { imported, skipped, total: records.length },
        });

        res.json({
            message: `Import complete: ${imported} imported, ${skipped} skipped.`,
            imported, skipped, total: records.length, details,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Placement analytics
// @route   GET /api/tpo/analytics
exports.getAnalytics = async (req, res) => {
    try {
        // Branch-wise placement
        const branchWise = await User.aggregate([
            { $match: { role: 'student', 'studentProfile.isPlaced': true } },
            {
                $group: {
                    _id: '$studentProfile.branch',
                    placed: { $sum: 1 },
                    avgPackage: { $avg: '$studentProfile.placedPackage' },
                    maxPackage: { $max: '$studentProfile.placedPackage' },
                },
            },
            { $sort: { placed: -1 } },
        ]);

        // Year-wise placement
        const yearWise = await User.aggregate([
            { $match: { role: 'student', 'studentProfile.isPlaced': true } },
            {
                $group: {
                    _id: '$studentProfile.passingYear',
                    placed: { $sum: 1 },
                    avgPackage: { $avg: '$studentProfile.placedPackage' },
                    maxPackage: { $max: '$studentProfile.placedPackage' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Total stats per branch
        const branchTotal = await User.aggregate([
            { $match: { role: 'student' } },
            { $group: { _id: '$studentProfile.branch', total: { $sum: 1 } } },
        ]);

        // Company-wise offers
        const companyWise = await Application.aggregate([
            { $match: { stage: 'Selected' } },
            { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'job' } },
            { $unwind: '$job' },
            { $lookup: { from: 'users', localField: 'job.company', foreignField: '_id', as: 'company' } },
            { $unwind: '$company' },
            {
                $group: {
                    _id: '$company.companyProfile.companyName',
                    offers: { $sum: 1 },
                    avgPackage: { $avg: '$job.packageLPA.min' },
                },
            },
            { $sort: { offers: -1 } },
            { $limit: 20 },
        ]);

        res.json({ branchWise, yearWise, branchTotal, companyWise });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
