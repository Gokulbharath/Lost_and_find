import express from 'express';
import { body, param } from 'express-validator';
import {
  getLostItems,
  getFoundItems,
  getLostItem,
  getFoundItem,
  createLostItem,
  createFoundItem,
  updateLostItem,
  updateFoundItem,
  deleteLostItem,
  deleteFoundItem,
  getMyLostItems,
  getMyFoundItems,
  searchItems,
  getStats,
  getRecentItems
} from '../controllers/itemController.js';
import { authenticateToken, optionalAuth } from '../middlewares/authMiddleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

const itemValidation = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['Electronics', 'Books', 'ID Cards', 'Clothing', 'Others']).withMessage('Invalid category'),
  body('location').trim().isLength({ min: 3, max: 200 }).withMessage('Location must be between 3 and 200 characters'),
  body('contact_info').trim().isLength({ min: 5, max: 500 }).withMessage('Contact information must be between 5 and 500 characters'),
  body('image_url')
    .optional()
    .custom((value) => {
      if (!value) return true;
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(value)) throw new Error('Please provide a valid image URL');
      return true;
    })
];

const lostItemValidation = [
  ...itemValidation,
  body('lost_date')
    .isISO8601()
    .withMessage('Lost date must be valid')
    .custom((value) => {
      if (new Date(value) > new Date()) throw new Error('Lost date cannot be in the future');
      return true;
    })
];

const foundItemValidation = [
  ...itemValidation,
  body('found_date')
    .isISO8601()
    .withMessage('Found date must be valid')
    .custom((value) => {
      if (new Date(value) > new Date()) throw new Error('Found date cannot be in the future');
      return true;
    })
];

const idValidation = [param('id').isMongoId().withMessage('Invalid item ID')];

router.get('/lost', optionalAuth, asyncHandler(getLostItems));
router.get('/found', optionalAuth, asyncHandler(getFoundItems));
router.get('/lost/:id', idValidation, optionalAuth, asyncHandler(getLostItem));
router.get('/found/:id', idValidation, optionalAuth, asyncHandler(getFoundItem));
router.post('/lost', authenticateToken, upload.single('image'), lostItemValidation, handleValidationErrors, asyncHandler(createLostItem));
router.post('/found', authenticateToken, upload.single('image'), foundItemValidation, handleValidationErrors, asyncHandler(createFoundItem));
router.put('/lost/:id', authenticateToken, idValidation, handleValidationErrors, asyncHandler(updateLostItem));
router.put('/found/:id', authenticateToken, idValidation, handleValidationErrors, asyncHandler(updateFoundItem));
router.delete('/lost/:id', authenticateToken, idValidation, asyncHandler(deleteLostItem));
router.delete('/found/:id', authenticateToken, idValidation, asyncHandler(deleteFoundItem));
router.get('/my/lost', authenticateToken, asyncHandler(getMyLostItems));
router.get('/my/found', authenticateToken, asyncHandler(getMyFoundItems));
router.get('/search', optionalAuth, asyncHandler(searchItems));
router.get('/stats', asyncHandler(getStats));
router.get('/recent', optionalAuth, asyncHandler(getRecentItems));

export default router;
