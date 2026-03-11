const express = require('express');
const router = express.Router();
const { protect, requireRole, requireVerified } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');
const {
    getProfile, updateProfile, uploadResume: uploadResumeHandler,
    browseJobs, applyToJob, getMyApplications, getDashboard,
} = require('../controllers/studentController');

router.use(protect, requireRole('student'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume', uploadResume.single('resume'), uploadResumeHandler);
router.get('/jobs', requireVerified, browseJobs);
router.post('/apply/:jobId', requireVerified, applyToJob);
router.get('/applications', getMyApplications);

module.exports = router;
