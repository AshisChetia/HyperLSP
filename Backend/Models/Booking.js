import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    // User who is booking
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    // Provider being booked
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: [true, 'Provider ID is required']
    },
    // Service being booked
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, 'Service ID is required']
    },
    // User's proposed price
    proposedPrice: {
        type: Number,
        required: [true, 'Proposed price is required'],
        min: 0
    },
    // Provider's base price (for reference)
    basePrice: {
        type: Number,
        required: true
    },
    // Final agreed price (set when provider accepts)
    finalPrice: {
        type: Number,
        default: null
    },
    // Booking status workflow
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    // User's address for service
    serviceAddress: {
        type: String,
        required: [true, 'Service address is required']
    },
    // Preferred date and time
    preferredDate: {
        type: Date,
        required: [true, 'Preferred date is required']
    },
    preferredTime: {
        type: String,
        required: [true, 'Preferred time is required']
    },
    // Notes from user
    userNotes: {
        type: String,
        default: ''
    },
    // Notes from provider (reason for rejection, etc.)
    providerNotes: {
        type: String,
        default: ''
    },
    // Payment status
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    // Rating given by user after completion
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    review: {
        type: String,
        default: ''
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    }
});

// Update timestamp on save
bookingSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
