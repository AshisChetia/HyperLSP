import Service from '../Models/Service.js';
import SERVICE_CATEGORIES from '../constants/categories.js';

// @desc    Get all categories
// @route   GET /api/services/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: SERVICE_CATEGORIES
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all services by provider
// @route   GET /api/services/provider/:providerId
// @access  Public
export const getServicesByProvider = async (req, res) => {
    try {
        const { providerId } = req.params;
        const services = await Service.find({ providerId, isActive: true });

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get my services (for logged in provider)
// @route   GET /api/services/my-services
// @access  Private (Provider)
export const getMyServices = async (req, res) => {
    try {
        const providerId = req.user.id;
        const services = await Service.find({ providerId });

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Add a new service
// @route   POST /api/services
// @access  Private (Provider)
export const addService = async (req, res) => {
    try {
        const { name, description, category, basePrice, duration } = req.body;
        const providerId = req.user.id;

        const service = await Service.create({
            providerId,
            name,
            description,
            category,
            basePrice,
            duration
        });

        res.status(201).json({
            success: true,
            message: 'Service added successfully',
            data: service
        });
    } catch (error) {
        console.error('Add Service Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Provider)
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;
        const { name, description, category, basePrice, duration, isActive } = req.body;

        // Find service and check ownership
        let service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        if (service.providerId.toString() !== providerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this service'
            });
        }

        // Update service
        service = await Service.findByIdAndUpdate(
            id,
            { name, description, category, basePrice, duration, isActive, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: service
        });
    } catch (error) {
        console.error('Update Service Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Provider)
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;

        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        if (service.providerId.toString() !== providerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this service'
            });
        }

        await Service.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        console.error('Delete Service Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Search services by category and pincode
// @route   GET /api/services/search
// @access  Public
export const searchServices = async (req, res) => {
    try {
        const { category, pincode, keyword } = req.query;

        let query = { isActive: true };

        if (category) {
            query.category = category;
        }

        const services = await Service.find(query)
            .populate('providerId', 'name email phone pincode rating isVerified')
            .sort({ createdAt: -1 });

        // Filter by pincode if provided
        let filteredServices = services;
        if (pincode) {
            filteredServices = services.filter(service =>
                service.providerId && service.providerId.pincode === pincode
            );
        }

        // Filter by keyword if provided
        if (keyword) {
            const keywordLower = keyword.toLowerCase();
            filteredServices = filteredServices.filter(service =>
                service.name.toLowerCase().includes(keywordLower) ||
                service.description.toLowerCase().includes(keywordLower)
            );
        }

        res.status(200).json({
            success: true,
            count: filteredServices.length,
            data: filteredServices
        });
    } catch (error) {
        console.error('Search Services Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
