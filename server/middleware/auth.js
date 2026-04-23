const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Role hierarchy levels (higher number = more privileges)
const ROLE_HIERARCHY = {
    student: 1,
    coordinator: 2,
    faculty: 2,
    tpo: 3,
    admin: 4,
    company: 0, // separate track, not in main hierarchy
};

// Verify JWT token
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token expired or invalid' });
    }
};

// Role-based access
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

// Require verified account
const requireVerified = (req, res, next) => {
    if (!req.user.isVerified) {
        return res.status(403).json({ message: 'Account not verified yet. Please wait for admin approval.' });
    }
    next();
};

// Hierarchical role check — requires at minimum the given role level
const requireMinRole = (minRole) => {
    return (req, res, next) => {
        const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
        const requiredLevel = ROLE_HIERARCHY[minRole] || 0;
        if (userLevel < requiredLevel) {
            return res.status(403).json({
                message: 'Access denied. Insufficient role privileges.',
            });
        }
        next();
    };
};

module.exports = { protect, requireRole, requireVerified, requireMinRole, ROLE_HIERARCHY };
