import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    const token = header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'placement-portal-dev-secret');
        req.user = decoded;          // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}
