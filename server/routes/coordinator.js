const express = require('express');
const router = express.Router();
const { protect, requireRole, requireVerified } = require('../middleware/auth');
const {
    getDashboard, getDrives, createDrive, updateDrive,
    addCompanyToDrive, createJobPosting,
    getApplications, updateApplicationData, exportApplicationsExcel,
    getCompanies,
    getDepartmentStudents, exportDepartmentStudents,
} = require('../controllers/coordinatorController');

// Coordinator routes accessible by coordinator, tpo, and admin
router.use(protect, requireRole('coordinator', 'tpo', 'admin'));

router.get('/dashboard', getDashboard);
router.route('/drives').get(getDrives).post(requireVerified, createDrive);
router.put('/drives/:id', requireVerified, updateDrive);
router.post('/drives/:driveId/companies', requireVerified, addCompanyToDrive);
router.post('/jobs', requireVerified, createJobPosting);
router.get('/applications', getApplications);
router.get('/applications/export', exportApplicationsExcel);
router.put('/applications/:id', requireVerified, updateApplicationData);
router.get('/companies', getCompanies);

// Department students
router.get('/students', getDepartmentStudents);
router.get('/students/export', exportDepartmentStudents);

module.exports = router;
