import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

const router = express.Router();

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('full_name').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
  body('full_name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('avatar_url').optional().isURL().withMessage('Please provide a valid avatar URL')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

router.post('/register', registerValidation, handleValidationErrors, asyncHandler(register));
router.post('/login', loginValidation, handleValidationErrors, asyncHandler(login));
router.get('/profile', authenticateToken, asyncHandler(getProfile));
router.put('/profile', authenticateToken, updateProfileValidation, handleValidationErrors, asyncHandler(updateProfile));
router.put('/change-password', authenticateToken, changePasswordValidation, handleValidationErrors, asyncHandler(changePassword));
router.post('/logout', authenticateToken, asyncHandler(logout));

export default router;
