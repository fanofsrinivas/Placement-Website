const XLSX = require('xlsx');

/**
 * Apply professional styling to an Excel worksheet
 */
const styleWorksheet = (ws, data, options = {}) => {
    if (!data || data.length === 0) return ws;

    const headers = Object.keys(data[0]);
    const colCount = headers.length;

    // Auto-size columns based on content
    const colWidths = headers.map((header, idx) => {
        let maxLen = header.length;
        data.forEach((row) => {
            const val = String(row[header] || '');
            maxLen = Math.max(maxLen, val.length);
        });
        return { wch: Math.min(Math.max(maxLen + 4, 12), 45) };
    });
    ws['!cols'] = colWidths;

    // Freeze header row
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    // Alternative: Views for freeze panes
    if (!ws['!views']) ws['!views'] = [];
    ws['!views'].push({ state: 'frozen', ySplit: 1 });

    // Set auto-filter on the data range
    const range = XLSX.utils.decode_range(ws['!ref']);
    ws['!autofilter'] = { ref: ws['!ref'] };

    return ws;
};

/**
 * Create a professional Excel workbook with formatted data
 * @param {Object} config
 * @param {Array<{name: string, data: Array<Object>, summaryData?: Array<Object>}>} config.sheets
 * @param {string} config.filename
 * @returns {Buffer}
 */
const createStyledWorkbook = (config) => {
    const wb = XLSX.utils.book_new();

    for (const sheet of config.sheets) {
        if (!sheet.data || sheet.data.length === 0) {
            // Create empty sheet with message
            const ws = XLSX.utils.aoa_to_sheet([['No data available']]);
            ws['!cols'] = [{ wch: 25 }];
            XLSX.utils.book_append_sheet(wb, ws, sheet.name);
            continue;
        }

        const ws = XLSX.utils.json_to_sheet(sheet.data);
        styleWorksheet(ws, sheet.data);
        XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31)); // Excel sheet name limit
    }

    // Add summary sheet if provided
    if (config.summary) {
        const summaryData = config.summary.map((item) => ({
            Metric: item.label,
            Value: item.value,
        }));
        const ws = XLSX.utils.json_to_sheet(summaryData);
        ws['!cols'] = [{ wch: 30 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    }

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

/**
 * Format data for student export with consistent fields
 */
const formatStudentData = (students) => {
    return students.map((student, idx) => {
        const sp = student.studentProfile || {};
        return {
            'S.No': idx + 1,
            'Student Name': `${sp.firstName || ''} ${sp.lastName || ''}`.trim() || 'N/A',
            'Roll Number': sp.rollNumber || 'N/A',
            'Email': student.email || 'N/A',
            'Branch': sp.branch || 'N/A',
            'Degree': sp.degree || 'N/A',
            'CGPA': sp.cgpa || 'N/A',
            'Active Backlogs': sp.activeBacklogs || 0,
            '10th %': sp.tenthPercentage || 'N/A',
            '12th %': sp.twelfthPercentage || 'N/A',
            'Phone': sp.phone || 'N/A',
            'Gender': sp.gender || 'N/A',
            'Passing Year': sp.passingYear || 'N/A',
            'Placed': sp.isPlaced ? 'Yes' : 'No',
            'Placed Company': sp.placedCompany || '-',
            'Package (LPA)': sp.placedPackage || '-',
            'Profile Completion': `${sp.profileCompleted || 0}%`,
        };
    });
};

/**
 * Format data for application export with consistent fields
 */
const formatApplicationData = (applications) => {
    return applications.map((app, idx) => {
        const sp = app.student?.studentProfile || {};
        return {
            'S.No': idx + 1,
            'Student Name': `${sp.firstName || ''} ${sp.lastName || ''}`.trim() || 'N/A',
            'Roll Number': sp.rollNumber || 'N/A',
            'Email': app.student?.email || 'N/A',
            'Phone': sp.phone || 'N/A',
            'Branch': sp.branch || 'N/A',
            'Degree': sp.degree || 'N/A',
            'CGPA': sp.cgpa || 'N/A',
            'Active Backlogs': sp.activeBacklogs || 0,
            '10th %': sp.tenthPercentage || 'N/A',
            '12th %': sp.twelfthPercentage || 'N/A',
            'Gender': sp.gender || 'N/A',
            'Job Title': app.job?.title || 'N/A',
            'Company': app.job?.company?.companyProfile?.companyName || 'N/A',
            'Job Type': app.job?.jobType || 'N/A',
            'Package (LPA)': app.job?.packageLPA?.min
                ? `${app.job.packageLPA.min}${app.job.packageLPA.max ? ' - ' + app.job.packageLPA.max : ''}`
                : 'N/A',
            'Stage': app.stage,
            'Applied Date': app.createdAt ? new Date(app.createdAt).toISOString().split('T')[0] : 'N/A',
            'Last Updated': app.updatedAt ? new Date(app.updatedAt).toISOString().split('T')[0] : 'N/A',
            'Resume': sp.resumeUrl || 'Not uploaded',
        };
    });
};

/**
 * Format candidate/applicant data specifically for company exports
 */
const formatCandidateData = (applications) => {
    return applications.map((app, idx) => {
        const sp = app.student?.studentProfile || {};
        return {
            'S.No': idx + 1,
            'Name': `${sp.firstName || ''} ${sp.lastName || ''}`.trim() || 'N/A',
            'Roll Number': sp.rollNumber || 'N/A',
            'Email': app.student?.email || 'N/A',
            'Phone': sp.phone || 'N/A',
            'Branch': sp.branch || 'N/A',
            'Degree': sp.degree || 'N/A',
            'CGPA': sp.cgpa || 'N/A',
            'Active Backlogs': sp.activeBacklogs || 0,
            '10th %': sp.tenthPercentage || 'N/A',
            '12th %': sp.twelfthPercentage || 'N/A',
            'Gender': sp.gender || 'N/A',
            'Stage': app.stage,
            'Applied Date': app.createdAt ? new Date(app.createdAt).toISOString().split('T')[0] : 'N/A',
            'Resume': sp.resumeUrl || 'Not uploaded',
        };
    });
};

module.exports = {
    styleWorksheet,
    createStyledWorkbook,
    formatStudentData,
    formatApplicationData,
    formatCandidateData,
};
