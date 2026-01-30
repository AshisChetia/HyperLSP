import Booking from '../Models/Booking.js';
import Service from '../Models/Service.js';
import Provider from '../Models/Provider.js';
import mongoose from 'mongoose';

// @desc    Create a new booking (User)
// @route   POST /api/bookings
// @access  Private (User)
export const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            providerId,
            serviceId,
            proposedPrice,
            serviceAddress,
            preferredDate,
            preferredTime,
            userNotes
        } = req.body;

        // Get service to verify it exists and get base price
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Verify provider owns this service
        if (service.providerId.toString() !== providerId) {
            return res.status(400).json({
                success: false,
                message: 'Service does not belong to this provider'
            });
        }

        // Create booking
        const booking = await Booking.create({
            userId,
            providerId,
            serviceId,
            proposedPrice,
            basePrice: service.basePrice,
            serviceAddress,
            preferredDate,
            preferredTime,
            userNotes
        });

        res.status(201).json({
            success: true,
            message: 'Booking request sent successfully',
            data: booking
        });
    } catch (error) {
        console.error('Create Booking Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (User)
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.find({ userId })
            .populate('providerId', 'name email phone pincode')
            .populate('serviceId', 'name category basePrice duration')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Get User Bookings Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get provider's booking requests
// @route   GET /api/bookings/requests
// @access  Private (Provider)
export const getProviderBookings = async (req, res) => {
    try {
        const providerId = req.user.id;

        const bookings = await Booking.find({ providerId })
            .populate('userId', 'name email phone pincode')
            .populate('serviceId', 'name category basePrice duration')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Get Provider Bookings Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Accept a booking (Provider)
// @route   PUT /api/bookings/:id/accept
// @access  Private (Provider)
export const acceptBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;
        const { finalPrice, providerNotes } = req.body;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.providerId.toString() !== providerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Booking is not pending'
            });
        }

        booking.status = 'accepted';
        booking.finalPrice = finalPrice || booking.proposedPrice;
        booking.providerNotes = providerNotes || '';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking accepted',
            data: booking
        });
    } catch (error) {
        console.error('Accept Booking Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Reject a booking (Provider)
// @route   PUT /api/bookings/:id/reject
// @access  Private (Provider)
export const rejectBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;
        const { providerNotes } = req.body;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.providerId.toString() !== providerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Booking is not pending'
            });
        }

        booking.status = 'rejected';
        booking.providerNotes = providerNotes || 'Request rejected';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking rejected',
            data: booking
        });
    } catch (error) {
        console.error('Reject Booking Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Mark booking as completed (Provider)
// @route   PUT /api/bookings/:id/complete
// @access  Private (Provider)
export const completeBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.providerId.toString() !== providerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (booking.status !== 'accepted') {
            return res.status(400).json({
                success: false,
                message: 'Booking must be accepted before completion'
            });
        }

        booking.status = 'completed';
        booking.completedAt = Date.now();
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking marked as completed',
            data: booking
        });
    } catch (error) {
        console.error('Complete Booking Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Rate and review a completed booking (User)
// @route   PUT /api/bookings/:id/rate
// @access  Private (User)
export const rateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { rating, review } = req.body;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (booking.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Can only rate completed bookings'
            });
        }

        if (booking.rating) {
            return res.status(400).json({
                success: false,
                message: 'Booking already rated'
            });
        }

        booking.rating = rating;
        booking.review = review || '';
        booking.paymentStatus = 'paid';
        await booking.save();

        // Update provider's average rating
        const providerBookings = await Booking.find({
            providerId: booking.providerId,
            rating: { $ne: null }
        });

        const avgRating = providerBookings.reduce((acc, b) => acc + b.rating, 0) / providerBookings.length;

        await Provider.findByIdAndUpdate(booking.providerId, {
            rating: avgRating.toFixed(1),
            totalReviews: providerBookings.length
        });

        res.status(200).json({
            success: true,
            message: 'Thank you for your rating!',
            data: booking
        });
    } catch (error) {
        console.error('Rate Booking Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Cancel a booking (User)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User)
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (!['pending', 'accepted'].includes(booking.status)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel this booking'
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled',
            data: booking
        });
    } catch (error) {
        console.error('Cancel Booking Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get reviews for a provider (Public)
// @route   GET /api/bookings/reviews/:providerId
// @access  Public
export const getProviderReviews = async (req, res) => {
    try {
        const { providerId } = req.params;

        const reviews = await Booking.find({
            providerId,
            status: 'completed',
            rating: { $ne: null }
        })
            .populate('userId', 'name')
            .select('rating review createdAt userId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Get Reviews Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get provider analytics (Earnings, Stats)
// @route   GET /api/bookings/stats
// @access  Private (Provider)
export const getProviderStats = async (req, res) => {
    try {
        const providerId = req.user.id;

        // aggregate earnings
        const stats = await Booking.aggregate([
            {
                $match: {
                    providerId: new mongoose.Types.ObjectId(providerId),
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$finalPrice" },
                    completedJobs: { $sum: 1 },
                    avgRating: { $avg: "$rating" }
                }
            }
        ]);

        // Get today's bookings count
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayBookings = await Booking.countDocuments({
            providerId,
            createdAt: { $gte: today }
        });

        // Get pending requests count
        const pendingRequests = await Booking.countDocuments({
            providerId,
            status: 'pending'
        });

        const data = stats.length > 0 ? stats[0] : { totalEarnings: 0, completedJobs: 0, avgRating: 0 };

        res.status(200).json({
            success: true,
            data: {
                ...data,
                todayBookings,
                pendingRequests
            }
        });
    } catch (error) {
        console.error('Get Stats Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
