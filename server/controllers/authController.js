const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail } = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '2h' });
};

// @desc    Register Student
// @route   POST /api/auth/register/student
exports.registerStudent = async (req, res) => {
    try {
        const { email, password, firstName, lastName, rollNumber, branch, degree, cgpa } = req.body;

        // Strict NITW email check
        if (!/@(student\.)?nitw\.ac\.in$/i.test(email)) {
            return res.status(400).json({ message: 'Only official NIT Warangal email IDs (@nitw.ac.in) are allowed.' });
        }

        // CGPA validation
        if (cgpa !== undefined && (cgpa < 0 || cgpa > 10)) {
            return res.status(400).json({ message: 'CGPA must be between 0 and 10.' });
        }

        // Check existing
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered.' });

        // Generate OTP
        const otp = generateOTP();

        const user = await User.create({
            email,
            password,
            role: 'student',
            otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
            studentProfile: { firstName, lastName, rollNumber, branch, degree, cgpa },
        });

        user.calculateProfileCompletion();
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, otp);

        // Audit
        await AuditLog.create({
            action: 'USER_REGISTERED',
            actor: user._id,
            target: user._id,
            targetModel: 'User',
            details: { role: 'student', email },
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Registration successful. Please verify your email with the OTP sent.',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                isEmailVerified: user.isEmailVerified,
                studentProfile: user.studentProfile,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already registered.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Register Company
// @route   POST /api/auth/register/company
exports.registerCompany = async (req, res) => {
    try {
        const { email, password, companyName, website, linkedIn, industry, hrName, hrPhone } = req.body;

        if (!website) return res.status(400).json({ message: 'Company website is required.' });
        if (!linkedIn) return res.status(400).json({ message: 'Company LinkedIn profile is required.' });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered.' });

        const otp = generateOTP();

        const user = await User.create({
            email,
            password,
            role: 'company',
            otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
            companyProfile: { companyName, website, linkedIn, industry, hrName, hrPhone },
        });

        await sendOTPEmail(email, otp);

        await AuditLog.create({
            action: 'USER_REGISTERED',
            actor: user._id,
            target: user._id,
            targetModel: 'User',
            details: { role: 'company', email, companyName },
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Registration successful. Please verify your email and await admin approval.',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                companyProfile: user.companyProfile,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already registered.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found.' });
        if (!user.otp || !user.otp.code) return res.status(400).json({ message: 'No OTP pending.' });
        if (new Date() > user.otp.expiresAt) return res.status(400).json({ message: 'OTP has expired.' });
        if (user.otp.code !== otp) return res.status(400).json({ message: 'Invalid OTP.' });

        user.isEmailVerified = true;
        user.otp = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const otp = generateOTP();
        user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
        await user.save();
        await sendOTPEmail(email, otp);

        res.json({ message: 'OTP resent successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Login
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // If logging in as student, enforce NITW email
        if (role === 'student' && !/@(student\.)?nitw\.ac\.in$/i.test(email)) {
            return res.status(400).json({ message: 'Only official NIT Warangal email IDs (@nitw.ac.in) are allowed.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

        if (role && user.role !== role) {
            return res.status(401).json({ message: 'Invalid credentials for this role.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        await AuditLog.create({
            action: 'USER_LOGIN',
            actor: user._id,
            target: user._id,
            targetModel: 'User',
            details: { role: user.role },
            ipAddress: req.ip,
        });

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                isEmailVerified: user.isEmailVerified,
                studentProfile: user.studentProfile,
                companyProfile: user.companyProfile,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account found with this email.' });

        const otp = generateOTP();
        user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
        await user.save();
        await sendOTPEmail(email, otp);

        res.json({ message: 'Password reset OTP sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found.' });
        if (!user.otp || !user.otp.code) return res.status(400).json({ message: 'No OTP pending.' });
        if (new Date() > user.otp.expiresAt) return res.status(400).json({ message: 'OTP has expired.' });
        if (user.otp.code !== otp) return res.status(400).json({ message: 'Invalid OTP.' });

        user.password = newPassword;
        user.otp = undefined;
        await user.save();

        await AuditLog.create({
            action: 'PASSWORD_RESET',
            actor: user._id,
            target: user._id,
            targetModel: 'User',
        });

        res.json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otp');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
