const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { createStyledWorkbook, formatStudentData } = require('../utils/excelUtils');

// @desc    Faculty Dashboard — department stats & recent activity
// @route   GET /api/faculty/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const faculty = await User.findById(req.user._id);
        const departments = faculty?.facultyProfile?.departments || [];

        // Department student counts
        const deptQuery = { role: 'student' };
        if (departments.length > 0) {
            deptQuery['studentProfile.branch'] = { $in: departments };
        }

        const totalStudents = await User.countDocuments(deptQuery);
        const placedStudents = await User.countDocuments({
            ...deptQuery,
            'studentProfile.isPlaced': true,
        });
        const verifiedStudents = await User.countDocuments({
            ...deptQuery,
            isVerified: true,
        });

        // Recent placements in department
        const recentPlacements = await User.find({
            ...deptQuery,
            'studentProfile.isPlaced': true,
        })
            .select('email studentProfile')
            .sort({ updatedAt: -1 })
            .limit(10);

        // Department-wise breakdown
        const departmentBreakdown = [];
        for (const dept of departments) {
            const total = await User.countDocuments({
                role: 'student',
                'studentProfile.branch': dept,
            });
            const placed = await User.countDocuments({
                role: 'student',
                'studentProfile.branch': dept,
                'studentProfile.isPlaced': true,
            });
            departmentBreakdown.push({
                department: dept,
                totalStudents: total,
                placedStudents: placed,
                placementRate: total > 0 ? Math.round((placed / total) * 100) : 0,
            });
        }

        // Degree-wise stats for the department
        const degreeStats = await User.aggregate([
            { $match: deptQuery },
            {
                $group: {
                    _id: '$studentProfile.degree',
                    total: { $sum: 1 },
                    placed: {
                        $sum: { $cond: ['$studentProfile.isPlaced', 1, 0] },
                    },
                    avgCgpa: { $avg: '$studentProfile.cgpa' },
                },
            },
            { $sort: { total: -1 } },
        ]);

        res.json({
            facultyName: `${faculty?.facultyProfile?.firstName || ''} ${faculty?.facultyProfile?.lastName || ''}`.trim(),
            designation: faculty?.facultyProfile?.designation || '',
            departments,
            stats: {
                totalStudents,
                placedStudents,
                verifiedStudents,
                placementRate: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0,
            },
            departmentBreakdown,
            degreeStats,
            recentPlacements: recentPlacements.map((s) => ({
                name: `${s.studentProfile?.firstName || ''} ${s.studentProfile?.lastName || ''}`.trim(),
                rollNumber: s.studentProfile?.rollNumber || '',
                branch: s.studentProfile?.branch || '',
                company: s.studentProfile?.placedCompany || '',
                package: s.studentProfile?.placedPackage || 0,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get students in faculty's department(s)
// @route   GET /api/faculty/students
exports.getDepartmentStudents = async (req, res) => {
    try {
        const { page = 1, limit = 50, search, branch, placed, degree, sort: sortField = 'name' } = req.query;

        const faculty = await User.findById(req.user._id);
        const departments = faculty?.facultyProfile?.departments || [];

        const query = { role: 'student' };

        if (branch) {
            query['studentProfile.branch'] = branch;
        } else if (departments.length > 0) {
            query['studentProfile.branch'] = { $in: departments };
        }

        if (placed === 'yes') query['studentProfile.isPlaced'] = true;
        if (placed === 'no') query['studentProfile.isPlaced'] = { $ne: true };
        if (degree) query['studentProfile.degree'] = degree;

        if (search) {
            query.$or = [
                { 'studentProfile.firstName': { $regex: search, $options: 'i' } },
                { 'studentProfile.lastName': { $regex: search, $options: 'i' } },
                { 'studentProfile.rollNumber': { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

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
// @route   GET /api/faculty/students/export
exports.exportDepartmentStudents = async (req, res) => {
    try {
        const faculty = await User.findById(req.user._id);
        const departments = faculty?.facultyProfile?.departments || [];

        const query = { role: 'student' };
        if (departments.length > 0) {
            query['studentProfile.branch'] = { $in: departments };
        }

        const students = await User.find(query)
            .select('-password -otp')
            .sort({ 'studentProfile.branch': 1, 'studentProfile.firstName': 1 });

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
            { label: 'Faculty', value: `${faculty?.facultyProfile?.firstName || ''} ${faculty?.facultyProfile?.lastName || ''}`.trim() },
            { label: 'Designation', value: faculty?.facultyProfile?.designation || '' },
            { label: 'Departments', value: departments.join(', ') || 'All' },
            { label: '---', value: '---' },
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
            'Content-Disposition': `attachment; filename=Faculty_Department_Students_${departments.join('_') || 'All'}.xlsx`,
        });
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get placement report for department
// @route   GET /api/faculty/placements
exports.getDepartmentPlacements = async (req, res) => {
    try {
        const faculty = await User.findById(req.user._id);
        const departments = faculty?.facultyProfile?.departments || [];

        const deptQuery = { role: 'student', 'studentProfile.isPlaced': true };
        if (departments.length > 0) {
            deptQuery['studentProfile.branch'] = { $in: departments };
        }

        const placedStudents = await User.find(deptQuery)
            .select('email studentProfile')
            .sort({ 'studentProfile.placedPackage': -1 });

        // Company-wise breakdown
        const companyMap = {};
        placedStudents.forEach((s) => {
            const company = s.studentProfile?.placedCompany || 'Unknown';
            if (!companyMap[company]) {
                companyMap[company] = { count: 0, totalPackage: 0, maxPackage: 0 };
            }
            companyMap[company].count++;
            const pkg = s.studentProfile?.placedPackage || 0;
            companyMap[company].totalPackage += pkg;
            if (pkg > companyMap[company].maxPackage) companyMap[company].maxPackage = pkg;
        });

        const companyBreakdown = Object.entries(companyMap)
            .map(([name, data]) => ({
                company: name,
                offers: data.count,
                avgPackage: data.count > 0 ? Math.round((data.totalPackage / data.count) * 100) / 100 : 0,
                maxPackage: data.maxPackage,
            }))
            .sort((a, b) => b.offers - a.offers);

        // Branch-wise breakdown
        const branchMap = {};
        placedStudents.forEach((s) => {
            const branch = s.studentProfile?.branch || 'Unknown';
            if (!branchMap[branch]) {
                branchMap[branch] = { count: 0, totalPackage: 0, maxPackage: 0 };
            }
            branchMap[branch].count++;
            const pkg = s.studentProfile?.placedPackage || 0;
            branchMap[branch].totalPackage += pkg;
            if (pkg > branchMap[branch].maxPackage) branchMap[branch].maxPackage = pkg;
        });

        const branchBreakdown = Object.entries(branchMap)
            .map(([name, data]) => ({
                branch: name,
                placed: data.count,
                avgPackage: data.count > 0 ? Math.round((data.totalPackage / data.count) * 100) / 100 : 0,
                maxPackage: data.maxPackage,
            }))
            .sort((a, b) => b.placed - a.placed);

        // Overall stats
        const totalPlaced = placedStudents.length;
        const packages = placedStudents.map(s => s.studentProfile?.placedPackage || 0).filter(p => p > 0);
        const avgPackage = packages.length > 0 ? Math.round((packages.reduce((a, b) => a + b, 0) / packages.length) * 100) / 100 : 0;
        const maxPackage = packages.length > 0 ? Math.max(...packages) : 0;
        const minPackage = packages.length > 0 ? Math.min(...packages) : 0;
        const medianPackage = packages.length > 0
            ? packages.sort((a, b) => a - b)[Math.floor(packages.length / 2)]
            : 0;

        res.json({
            stats: {
                totalPlaced,
                avgPackage,
                maxPackage,
                minPackage,
                medianPackage,
                totalCompanies: Object.keys(companyMap).length,
            },
            companyBreakdown,
            branchBreakdown,
            students: placedStudents.map((s) => ({
                name: `${s.studentProfile?.firstName || ''} ${s.studentProfile?.lastName || ''}`.trim(),
                rollNumber: s.studentProfile?.rollNumber || '',
                email: s.email,
                branch: s.studentProfile?.branch || '',
                degree: s.studentProfile?.degree || '',
                cgpa: s.studentProfile?.cgpa || 0,
                company: s.studentProfile?.placedCompany || '',
                package: s.studentProfile?.placedPackage || 0,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Export placement report to Excel
// @route   GET /api/faculty/placements/export
exports.exportDepartmentPlacements = async (req, res) => {
    try {
        const faculty = await User.findById(req.user._id);
        const departments = faculty?.facultyProfile?.departments || [];

        const deptQuery = { role: 'student', 'studentProfile.isPlaced': true };
        if (departments.length > 0) {
            deptQuery['studentProfile.branch'] = { $in: departments };
        }

        const placedStudents = await User.find(deptQuery)
            .select('email studentProfile')
            .sort({ 'studentProfile.branch': 1, 'studentProfile.placedPackage': -1 });

        const data = placedStudents.map((s, i) => ({
            'S.No': i + 1,
            'Name': `${s.studentProfile?.firstName || ''} ${s.studentProfile?.lastName || ''}`.trim(),
            'Roll Number': s.studentProfile?.rollNumber || '',
            'Email': s.email,
            'Branch': s.studentProfile?.branch || '',
            'Degree': s.studentProfile?.degree || '',
            'CGPA': s.studentProfile?.cgpa || 0,
            'Company': s.studentProfile?.placedCompany || '',
            'Package (LPA)': s.studentProfile?.placedPackage || 0,
        }));

        const packages = placedStudents.map(s => s.studentProfile?.placedPackage || 0).filter(p => p > 0);

        const summary = [
            { label: 'Faculty', value: `${faculty?.facultyProfile?.firstName || ''} ${faculty?.facultyProfile?.lastName || ''}`.trim() },
            { label: 'Departments', value: departments.join(', ') || 'All' },
            { label: '---', value: '---' },
            { label: 'Total Placed', value: placedStudents.length },
            { label: 'Average Package (LPA)', value: packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0 },
            { label: 'Highest Package (LPA)', value: packages.length > 0 ? Math.max(...packages) : 0 },
            { label: 'Export Date', value: new Date().toLocaleDateString('en-IN') },
        ];

        const buffer = createStyledWorkbook({
            sheets: [{ name: 'Placement Report', data }],
            summary,
        });

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=Faculty_Placement_Report_${departments.join('_') || 'All'}.xlsx`,
        });
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
