import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with caching for serverless
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not set');
        }
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`MongoDB Error: ${error.message}`);
        throw error;
    }
};

// ============ MODELS ============

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: 'user', enum: ['user'] },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Provider Schema
const providerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: 'provider', enum: ['provider'] },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

providerSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

providerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Provider = mongoose.models.Provider || mongoose.model('Provider', providerSchema);

// Service Schema
const serviceSchema = new mongoose.Schema({
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'] },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid'] },
    paymentMethod: { type: String, default: 'COD' },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// ============ HELPERS ============

const generateToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Auth middleware
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (decoded.role === 'user') {
            req.user = await User.findById(decoded.id).select('-password');
        } else if (decoded.role === 'provider') {
            req.user = await Provider.findById(decoded.id).select('-password');
        }

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Categories
const CATEGORIES = [
    'Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting',
    'AC Repair', 'Appliance Repair', 'Pest Control', 'Gardening', 'Moving'
];

// ============ ROUTES ============

// Connect to DB on each request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
    }
});

// Health check
app.get('/api', (req, res) => {
    res.json({ message: "HyperLSP API is running", connected: isConnected });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), dbConnected: isConnected });
});

// ============ AUTH ROUTES ============

app.post('/api/auth/signup/user', async (req, res) => {
    try {
        const { name, email, phone, address, pincode, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const user = await User.create({ name, email, phone, address, pincode, password });

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
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/signup/provider', async (req, res) => {
    try {
        const { name, email, phone, address, pincode, password } = req.body;

        const providerExists = await Provider.findOne({ email });
        if (providerExists) {
            return res.status(400).json({ success: false, message: 'Provider with this email already exists' });
        }

        const provider = await Provider.create({ name, email, phone, address, pincode, password });

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
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/login/user', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        res.json({
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
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/login/provider', async (req, res) => {
    try {
        const { email, password } = req.body;

        const provider = await Provider.findOne({ email });
        if (!provider) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await provider.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        res.json({
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
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// ============ SERVICE ROUTES ============

app.get('/api/services/categories', (req, res) => {
    res.json({ success: true, data: CATEGORIES });
});

app.get('/api/services/my-services', protect, async (req, res) => {
    try {
        const services = await Service.find({ provider: req.user._id });
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/services', protect, async (req, res) => {
    try {
        const { name, category, description, price, basePrice, duration } = req.body;
        const service = await Service.create({
            provider: req.user._id,
            name, category, description,
            price: price || basePrice,  // Accept both field names
            duration
        });
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/services/:id', protect, async (req, res) => {
    try {
        // Map basePrice to price if present
        const updateData = { ...req.body };
        if (updateData.basePrice && !updateData.price) {
            updateData.price = updateData.basePrice;
            delete updateData.basePrice;
        }

        const service = await Service.findOneAndUpdate(
            { _id: req.params.id, provider: req.user._id },
            updateData,
            { new: true }
        );
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/services/:id', protect, async (req, res) => {
    try {
        const service = await Service.findOneAndDelete({ _id: req.params.id, provider: req.user._id });
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/services/search', async (req, res) => {
    try {
        const { category, pincode, query } = req.query;
        let filter = { isActive: true };

        if (category) filter.category = category;
        if (query) filter.name = { $regex: query, $options: 'i' };

        let services = await Service.find(filter).populate('provider', 'name rating pincode');

        if (pincode) {
            services = services.filter(s => s.provider && s.provider.pincode === pincode);
        }

        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/services/provider/:providerId', async (req, res) => {
    try {
        const services = await Service.find({ provider: req.params.providerId, isActive: true });
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ PROVIDER ROUTES ============

app.get('/api/providers', async (req, res) => {
    try {
        const { pincode, category } = req.query;
        let filter = {};
        if (pincode) filter.pincode = pincode;

        let providers = await Provider.find(filter).select('-password').lean();

        if (category) {
            const servicesWithCategory = await Service.find({ category }).distinct('provider');
            providers = providers.filter(p => servicesWithCategory.some(s => s.equals(p._id)));
        }

        // Add service count for each provider
        const providersWithServices = await Promise.all(providers.map(async (provider) => {
            const servicesCount = await Service.countDocuments({ provider: provider._id, isActive: true });
            const services = await Service.find({ provider: provider._id, isActive: true }).limit(3);
            return {
                ...provider,
                servicesCount,
                services,
                totalReviews: provider.totalRatings || 0
            };
        }));

        res.json({ success: true, data: providersWithServices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/providers/nearby/:pincode', async (req, res) => {
    try {
        const providers = await Provider.find({ pincode: req.params.pincode }).select('-password');
        res.json({ success: true, data: providers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/providers/:id', async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id).select('-password');
        if (!provider) {
            return res.status(404).json({ success: false, message: 'Provider not found' });
        }
        const services = await Service.find({ provider: req.params.id, isActive: true });
        res.json({ success: true, data: { provider, services } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ BOOKING ROUTES ============

app.post('/api/bookings', protect, async (req, res) => {
    try {
        const { providerId, serviceId, scheduledDate, scheduledTime, address, pincode, totalAmount } = req.body;

        const booking = await Booking.create({
            user: req.user._id,
            provider: providerId,
            service: serviceId,
            scheduledDate, scheduledTime, address, pincode, totalAmount
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/bookings/my-bookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('provider', 'name phone')
            .populate('service', 'name price')
            .sort('-createdAt');
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/bookings/requests', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ provider: req.user._id })
            .populate('user', 'name phone')
            .populate('service', 'name price')
            .sort('-createdAt');
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/bookings/:id/accept', protect, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, provider: req.user._id },
            { status: 'accepted' },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/bookings/:id/reject', protect, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, provider: req.user._id },
            { status: 'rejected' },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/bookings/:id/complete', protect, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, provider: req.user._id },
            { status: 'completed', paymentStatus: 'paid' },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/bookings/:id/cancel', protect, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { status: 'cancelled' },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/bookings/:id/rate', protect, async (req, res) => {
    try {
        const { rating, review } = req.body;

        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id, status: 'completed' },
            { rating, review },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Update provider rating
        const reviews = await Booking.find({ provider: booking.provider, rating: { $exists: true } });
        const avgRating = reviews.reduce((sum, b) => sum + b.rating, 0) / reviews.length;

        await Provider.findByIdAndUpdate(booking.provider, {
            rating: avgRating,
            totalRatings: reviews.length
        });

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/bookings/reviews/:providerId', async (req, res) => {
    try {
        const reviews = await Booking.find({
            provider: req.params.providerId,
            rating: { $exists: true }
        })
            .populate('user', 'name')
            .populate('service', 'name')
            .sort('-createdAt');

        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/bookings/stats', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ provider: req.user._id });

        const stats = {
            totalBookings: bookings.length,
            completed: bookings.filter(b => b.status === 'completed').length,
            pending: bookings.filter(b => b.status === 'pending').length,
            earnings: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.totalAmount, 0)
        };

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
});

export default app;
