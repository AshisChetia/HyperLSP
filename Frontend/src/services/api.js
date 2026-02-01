import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API calls
export const authAPI = {
    // Signup User
    signupUser: async (userData) => {
        const response = await api.post('/auth/signup/user', userData);
        return response.data;
    },

    // Signup Provider
    signupProvider: async (providerData) => {
        const response = await api.post('/auth/signup/provider', providerData);
        return response.data;
    },

    // Login User
    loginUser: async (credentials) => {
        const response = await api.post('/auth/login/user', credentials);
        return response.data;
    },

    // Login Provider
    loginProvider: async (credentials) => {
        const response = await api.post('/auth/login/provider', credentials);
        return response.data;
    }
};

// Service API calls
export const serviceAPI = {
    // Get all categories
    getCategories: async () => {
        const response = await api.get('/services/categories');
        return response.data;
    },

    // Get my services (for provider)
    getMyServices: async () => {
        const response = await api.get('/services/my-services');
        return response.data;
    },

    // Add a new service
    addService: async (serviceData) => {
        const response = await api.post('/services', serviceData);
        return response.data;
    },

    // Update a service
    updateService: async (serviceId, serviceData) => {
        const response = await api.put(`/services/${serviceId}`, serviceData);
        return response.data;
    },

    // Delete a service
    deleteService: async (serviceId) => {
        const response = await api.delete(`/services/${serviceId}`);
        return response.data;
    },

    // Search services
    searchServices: async (params) => {
        const response = await api.get('/services/search', { params });
        return response.data;
    },

    // Get services by provider
    getServicesByProvider: async (providerId) => {
        const response = await api.get(`/services/provider/${providerId}`);
        return response.data;
    }
};

// Provider API calls
export const providerAPI = {
    // Get all providers (with optional filters)
    getProviders: async (params = {}) => {
        const response = await api.get('/providers', { params });
        return response.data;
    },

    // Get provider by ID with services
    getProviderById: async (providerId) => {
        const response = await api.get(`/providers/${providerId}`);
        return response.data;
    },

    // Get nearby providers by pincode
    getNearbyProviders: async (pincode) => {
        const response = await api.get(`/providers/nearby/${pincode}`);
        return response.data;
    }
};

// Booking API calls
export const bookingAPI = {
    // Create a new booking (User)
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    // Get user's bookings
    getUserBookings: async () => {
        const response = await api.get('/bookings/my-bookings');
        return response.data;
    },

    // Get provider's booking requests
    getProviderBookings: async () => {
        const response = await api.get('/bookings/requests');
        return response.data;
    },

    // Accept booking (Provider)
    acceptBooking: async (bookingId, data = {}) => {
        const response = await api.put(`/bookings/${bookingId}/accept`, data);
        return response.data;
    },

    // Reject booking (Provider)
    rejectBooking: async (bookingId, data = {}) => {
        const response = await api.put(`/bookings/${bookingId}/reject`, data);
        return response.data;
    },

    // Complete booking (Provider)
    completeBooking: async (bookingId) => {
        const response = await api.put(`/bookings/${bookingId}/complete`);
        return response.data;
    },

    // Rate booking (User)
    rateBooking: async (bookingId, ratingData) => {
        const response = await api.put(`/bookings/${bookingId}/rate`, ratingData);
        return response.data;
    },

    // Cancel booking (User)
    cancelBooking: async (bookingId) => {
        const response = await api.put(`/bookings/${bookingId}/cancel`);
        return response.data;
    },

    // Get provider reviews
    getProviderReviews: async (providerId) => {
        const response = await api.get(`/bookings/reviews/${providerId}`);
        return response.data;
    },

    // Get provider stats
    getProviderStats: async () => {
        const response = await api.get('/bookings/stats');
        return response.data;
    }
};

export default api;



