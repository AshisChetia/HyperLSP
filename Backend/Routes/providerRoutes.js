import express from 'express';
import {
    getProviders,
    getProviderById,
    getNearbyProviders
} from '../Controllers/providerController.js';

const router = express.Router();

// Public routes
router.get('/', getProviders);
router.get('/nearby/:pincode', getNearbyProviders);
router.get('/:id', getProviderById);

export default router;
