const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { message: 'Too many attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: { message: 'Too many OTP requests. Please try again after 10 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, otpLimiter, generalLimiter };
