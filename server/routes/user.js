import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';

const router = Router();

// GET /api/user/me — returns the authenticated user's profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const { id, role } = req.user;

        let user;
        if (role === 'student') {
            user = await Student.findById(id);
        } else if (role === 'company') {
            user = await Company.findById(id);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ role, user });
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

export default router;
