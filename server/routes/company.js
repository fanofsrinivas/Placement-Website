const express = require('express');
const router = express.Router();
const { protect, requireRole, requireVerified } = require('../middleware/auth');
const {
    getDashboard, createJob, getJobs, updateJob, deleteJob,
    getCandidates, updateCandidateStage, scheduleInterview,
    generateJAFPdf, exportCandidates,
    getStudentRegistrations, exportStudentRegistrations,
} = require('../controllers/companyController');

router.use(protect, requireRole('company'));

router.get('/dashboard', getDashboard);
router.route('/jobs').get(getJobs).post(requireVerified, createJob);
router.route('/jobs/:id').put(requireVerified, updateJob).delete(requireVerified, deleteJob);
router.get('/jobs/:jobId/candidates', getCandidates);
router.put('/applications/:id/stage', requireVerified, updateCandidateStage);
router.put('/applications/:id/interview', requireVerified, scheduleInterview);
router.get('/jobs/:id/jaf', generateJAFPdf);
router.get('/jobs/:jobId/export', exportCandidates);

// Student registrations
router.get('/registrations', getStudentRegistrations);
router.get('/registrations/export', exportStudentRegistrations);

module.exports = router;
