const express = require('express');
const router = express.Router();
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');
const {
    registerStudent, registerCompany, registerCoordinator, registerFaculty,
    verifyOTP, resendOTP,
    login, verifyLoginOTP, resendLoginOTP,
    forgotPassword, resetPassword, getMe,
} = require('../controllers/authController');

router.post('/register/student', authLimiter, registerStudent);
router.post('/register/company', authLimiter, registerCompany);
router.post('/register/coordinator', authLimiter, registerCoordinator);
router.post('/register/faculty', authLimiter, registerFaculty);
router.post('/verify-otp', otpLimiter, verifyOTP);
router.post('/resend-otp', otpLimiter, resendOTP);
router.post('/login', authLimiter, login);
router.post('/login/verify-otp', otpLimiter, verifyLoginOTP);
router.post('/login/resend-otp', otpLimiter, resendLoginOTP);
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/reset-password', otpLimiter, resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
