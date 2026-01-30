import express from 'express';
import {
    signupUser,
    signupProvider,
    loginUser,
    loginProvider
} from '../Controllers/authController.js';

const router = express.Router();

// Signup routes
router.post('/signup/user', signupUser);
router.post('/signup/provider', signupProvider);

// Login routes
router.post('/login/user', loginUser);
router.post('/login/provider', loginProvider);

export default router;
