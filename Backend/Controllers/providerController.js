import Provider from '../Models/Provider.js';
import Service from '../Models/Service.js';

// @desc    Get all providers with their services (for search/browse)
// @route   GET /api/providers
// @access  Public
export const getProviders = async (req, res) => {
    try {
        const { pincode, category } = req.query;

        // Build provider query
        let providerQuery = { isAvailable: true };
        if (pincode) {
            providerQuery.pincode = pincode;
        }

        // Get providers
        let providers = await Provider.find(providerQuery)
            .select('-password')
            .sort({ rating: -1 });

        // If category filter is provided, filter providers who have services in that category
        if (category) {
            const providersWithCategory = await Service.distinct('providerId', {
                category,
                isActive: true
            });
            providers = providers.filter(p =>
                providersWithCategory.some(id => id.toString() === p._id.toString())
            );
        }

        // Get services count for each provider
        const providersWithServices = await Promise.all(
            providers.map(async (provider) => {
                const services = await Service.find({
                    providerId: provider._id,
                    isActive: true
                });
                return {
                    ...provider.toObject(),
                    servicesCount: services.length,
                    services: services.slice(0, 3) // Show first 3 services
                };
            })
        );

        res.status(200).json({
            success: true,
            count: providersWithServices.length,
            data: providersWithServices
        });
    } catch (error) {
        console.error('Get Providers Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single provider with all services
// @route   GET /api/providers/:id
// @access  Public
export const getProviderById = async (req, res) => {
    try {
        const { id } = req.params;

        const provider = await Provider.findById(id).select('-password');

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found'
            });
        }

        const services = await Service.find({
            providerId: id,
            isActive: true
        });

        res.status(200).json({
            success: true,
            data: {
                ...provider.toObject(),
                services
            }
        });
    } catch (error) {
        console.error('Get Provider By ID Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get providers by pincode (nearby)
// @route   GET /api/providers/nearby/:pincode
// @access  Public
export const getNearbyProviders = async (req, res) => {
    try {
        const { pincode } = req.params;

        // Get providers with exact pincode match
        const providers = await Provider.find({
            pincode,
            isAvailable: true
        }).select('-password').sort({ rating: -1 });

        // Get services for each provider
        const providersWithServices = await Promise.all(
            providers.map(async (provider) => {
                const services = await Service.find({
                    providerId: provider._id,
                    isActive: true
                });
                return {
                    ...provider.toObject(),
                    servicesCount: services.length,
                    services: services.slice(0, 3)
                };
            })
        );

        res.status(200).json({
            success: true,
            count: providersWithServices.length,
            data: providersWithServices
        });
    } catch (error) {
        console.error('Get Nearby Providers Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
