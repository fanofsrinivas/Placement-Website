const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const { uploadExcel } = require('../middleware/upload');
const {
    getDashboard, createDrive, getDrives, updateDrive, deleteDrive,
    downloadTemplate, parseExcel, validateData, importData,
    getAnalytics, notifyEligibleStudents,
} = require('../controllers/tpoController');

router.use(protect, requireRole('tpo', 'admin'));

router.get('/dashboard', getDashboard);
router.route('/drives').get(getDrives).post(createDrive);
router.route('/drives/:id').put(updateDrive).delete(deleteDrive);

// Legacy data import
router.get('/legacy/template', downloadTemplate);
router.post('/legacy/parse', uploadExcel.single('file'), parseExcel);
router.post('/legacy/validate', validateData);
router.post('/legacy/import', importData);

// Analytics
router.get('/analytics', getAnalytics);

// Notify eligible students for a job
router.post('/jobs/:id/notify', notifyEligibleStudents);

module.exports = router;
