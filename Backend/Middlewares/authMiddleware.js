import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import Provider from '../Models/Provider.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user based on role
            if (decoded.role === 'user') {
                req.user = await User.findById(decoded.id).select('-password');
            } else if (decoded.role === 'provider') {
                req.user = await Provider.findById(decoded.id).select('-password');
            }

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            req.user.role = decoded.role;
            next();
        } catch (error) {
            console.error('Auth Error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

// Provider only middleware
export const providerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'provider') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Providers only.'
        });
    }
};

// User only middleware
export const userOnly = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Users only.'
        });
    }
};
