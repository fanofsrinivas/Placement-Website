const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const {
    getDashboard, getPendingUsers, verifyUser,
    getPendingJobs, approveJob, getAuditLogs,
} = require('../controllers/adminController');

router.use(protect, requireRole('admin'));

router.get('/dashboard', getDashboard);
router.get('/verify', getPendingUsers);
router.put('/verify/:id', verifyUser);
router.get('/job-approvals', getPendingJobs);
router.put('/job-approvals/:id', approveJob);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
