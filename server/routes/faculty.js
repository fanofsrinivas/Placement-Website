const express = require('express');
const router = express.Router();
const { protect, requireRole, requireVerified } = require('../middleware/auth');
const {
    getDashboard,
    getDepartmentStudents, exportDepartmentStudents,
    getDepartmentPlacements, exportDepartmentPlacements,
} = require('../controllers/facultyController');

// Faculty routes accessible by faculty and admin
router.use(protect, requireRole('faculty', 'admin'));

router.get('/dashboard', getDashboard);

// Department students
router.get('/students', getDepartmentStudents);
router.get('/students/export', exportDepartmentStudents);

// Placement reports
router.get('/placements', getDepartmentPlacements);
router.get('/placements/export', exportDepartmentPlacements);

module.exports = router;
