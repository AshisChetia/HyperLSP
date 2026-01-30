import express from 'express';
import {
    getCategories,
    getServicesByProvider,
    getMyServices,
    addService,
    updateService,
    deleteService,
    searchServices
} from '../Controllers/serviceController.js';
import { protect, providerOnly } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/categories', getCategories);
router.get('/search', searchServices);
router.get('/provider/:providerId', getServicesByProvider);

// Protected routes (Provider only)
router.get('/my-services', protect, providerOnly, getMyServices);
router.post('/', protect, providerOnly, addService);
router.put('/:id', protect, providerOnly, updateService);
router.delete('/:id', protect, providerOnly, deleteService);

export default router;
