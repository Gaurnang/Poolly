import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Requires a valid auth token — rejects unauthenticated requests
export const protect = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Attaches req.user if a valid token is present, but never blocks the request
export const optionalAuth = async (req, res, next) => {
    const token = req.cookies?.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch {
            // Invalid token — treat as guest, don't block
            req.user = null;
        }
    }
    next();
};
