import express from 'express';
import {
    createBooking,
    getUserBookings,
    getProviderBookings,
    acceptBooking,
    rejectBooking,
    completeBooking,
    rateBooking,
    cancelBooking,
    getProviderReviews,
    getProviderStats
} from '../Controllers/bookingController.js';
import { protect, providerOnly, userOnly } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, userOnly, createBooking);
router.get('/my-bookings', protect, userOnly, getUserBookings);
router.put('/:id/rate', protect, userOnly, rateBooking);
router.put('/:id/cancel', protect, userOnly, cancelBooking);

// Provider routes
router.get('/stats', protect, providerOnly, getProviderStats); // Create stats endpoint
router.get('/requests', protect, providerOnly, getProviderBookings);
router.put('/:id/accept', protect, providerOnly, acceptBooking);
router.put('/:id/reject', protect, providerOnly, rejectBooking);
router.put('/:id/complete', protect, providerOnly, completeBooking);

// Public/Common routes (Reviews)
router.get('/reviews/:providerId', protect, getProviderReviews);

export default router;
