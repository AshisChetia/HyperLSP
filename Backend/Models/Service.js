import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: [true, 'Provider ID is required']
    },
    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Plumbing',
            'Electrical',
            'Cleaning',
            'Carpentry',
            'Painting',
            'AC & Appliance',
            'Pest Control',
            'Beauty & Spa',
            'Home Repair',
            'Moving & Packing',
            'Other'
        ]
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: 0
    },
    duration: {
        type: String,
        default: '1-2 hours'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
serviceSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
