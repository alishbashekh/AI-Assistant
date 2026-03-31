import express from 'express';
import {body} from 'express-validator';
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
} from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

//validation middleware
const registerValidation = [
    body('username')
    .trim()
    .isLength({min:3})
    .withMessage('username must be atleast 3 characters long'),

    body('email')
    .isEmail()
    .withMessage('please provide valide email')
    .normalizeEmail(),
    
    body('password')
    .isLength({min: 6})
    .withMessage('password must be 6 character long')
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('please enter valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('password is required')
];

// public routes 
router.post('/register',registerValidation, register);
router.post('/login', loginValidation, login);

//protected routes
router.get('/profile', protect, getProfile);
router.get('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;


