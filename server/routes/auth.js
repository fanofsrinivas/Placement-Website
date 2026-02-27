import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Company from '../models/Company.js';

const router = Router();
const secret = () => process.env.JWT_SECRET || 'placement-portal-dev-secret';

function signToken(id, role) {
    return jwt.sign({ id, role }, secret(), { expiresIn: '7d' });
}

// ─── Student Registration ──────────────────────────────────────
router.post('/register/student', async (req, res) => {
    try {
        const { name, rollNumber, email, mobile, dob, degree, branch, password } = req.body;

        // Check duplicates
        const existingEmail = await Student.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email already registered.' });

        const existingRoll = await Student.findOne({ rollNumber });
        if (existingRoll) return res.status(400).json({ message: 'Roll number already registered.' });

        const student = await Student.create({ name, rollNumber, email, mobile, dob, degree, branch, password });
        const token = signToken(student._id, 'student');

        res.status(201).json({
            token,
            user: {
                id: student._id, role: 'student',
                name: student.name, rollNumber: student.rollNumber, email: student.email,
                mobile: student.mobile, dob: student.dob, degree: student.degree, branch: student.branch,
            },
        });
    } catch (err) {
        console.error('Student registration error:', err);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// ─── Company Registration ──────────────────────────────────────
router.post('/register/company', async (req, res) => {
    try {
        const {
            companyName, website, linkedin,
            hrName, hrEmail, hrPhone,
            street, city, state, country,
            email, password,
        } = req.body;

        const existing = await Company.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered.' });

        const company = await Company.create({
            companyName, website, linkedin,
            hrName, hrEmail, hrPhone,
            street, city, state, country,
            email, password,
        });
        const token = signToken(company._id, 'company');

        res.status(201).json({
            token,
            user: {
                id: company._id, role: 'company',
                companyName: company.companyName, website: company.website, linkedin: company.linkedin,
                hrName: company.hrName, hrEmail: company.hrEmail, hrPhone: company.hrPhone,
                street: company.street, city: company.city, state: company.state, country: company.country,
                email: company.email,
            },
        });
    } catch (err) {
        console.error('Company registration error:', err);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// ─── Login (both roles) ────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Try student first
        let user = await Student.findOne({ email }).select('+password');
        let role = 'student';

        if (!user) {
            user = await Company.findOne({ email }).select('+password');
            role = 'company';
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = signToken(user._id, role);

        // Build user payload
        let userData;
        if (role === 'student') {
            userData = {
                id: user._id, role,
                name: user.name, rollNumber: user.rollNumber, email: user.email,
                mobile: user.mobile, dob: user.dob, degree: user.degree, branch: user.branch,
            };
        } else {
            userData = {
                id: user._id, role,
                companyName: user.companyName, website: user.website, linkedin: user.linkedin,
                hrName: user.hrName, hrEmail: user.hrEmail, hrPhone: user.hrPhone,
                street: user.street, city: user.city, state: user.state, country: user.country,
                email: user.email,
            };
        }

        res.json({ token, user: userData });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

export default router;
