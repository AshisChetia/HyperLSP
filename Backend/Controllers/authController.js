import User from '../Models/User.js';
import Provider from '../Models/Provider.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/signup/user
// @access  Public
export const signupUser = async (req, res) => {
    try {
        const { name, email, phone, address, pincode, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            phone,
            address,
            pincode,
            password
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    pincode: user.pincode,
                    role: user.role,
                    token: generateToken(user._id, user.role)
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Register a new provider
// @route   POST /api/auth/signup/provider
// @access  Public
export const signupProvider = async (req, res) => {
    try {
        const { name, email, phone, address, pincode, password } = req.body;

        // Check if provider already exists
        const providerExists = await Provider.findOne({ email });
        if (providerExists) {
            return res.status(400).json({
                success: false,
                message: 'Provider with this email already exists'
            });
        }

        // Create new provider
        const provider = await Provider.create({
            name,
            email,
            phone,
            address,
            pincode,
            password
        });

        if (provider) {
            res.status(201).json({
                success: true,
                message: 'Provider registered successfully',
                data: {
                    _id: provider._id,
                    name: provider.name,
                    email: provider.email,
                    phone: provider.phone,
                    address: provider.address,
                    pincode: provider.pincode,
                    role: provider.role,
                    token: generateToken(provider._id, provider.role)
                }
            });
        }
    } catch (error) {
        console.error('Signup Provider Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login/user
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                pincode: user.pincode,
                role: user.role,
                token: generateToken(user._id, user.role)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Login provider
// @route   POST /api/auth/login/provider
// @access  Public
export const loginProvider = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if provider exists
        const provider = await Provider.findOne({ email });
        if (!provider) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await provider.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: provider._id,
                name: provider.name,
                email: provider.email,
                phone: provider.phone,
                address: provider.address,
                pincode: provider.pincode,
                role: provider.role,
                isVerified: provider.isVerified,
                token: generateToken(provider._id, provider.role)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
