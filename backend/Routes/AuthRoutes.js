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
    .normalizeEmail()
    .withMessage('please provide valide email'),
    body('password')
    .isLength({min: 6})
    .withMessage('password must be 6 character long')
];

const loginValidation = [
    body('email')
    .normalizeEmail()
    .withMessage('please enter valide email'),
    body('password')
    .notEmpty()
    .withMessage('password is required')
];


