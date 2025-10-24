const express = require('express');
const { body, param } = require('express-validator');
const {
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
} = require('../controllers/itemController');
const { authenticateToken, optionalAuth } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../middlewares/errorHandler');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

const itemValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['Electronics', 'Books', 'ID Cards', 'Clothing', 'Others'])
    .withMessage('Category must be one of: Electronics, Books, ID Cards, Clothing, Others'),
  body('location')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Location must be between 3 and 200 characters'),
  body('contact_info')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Contact information must be between 5 and 500 characters'),
  body('image_url')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null, undefined, or empty string
      }
      // If value exists, validate it as URL
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(value)) {
        throw new Error('Please provide a valid image URL');
      }
      return true;
    })
];

const lostItemValidation = [
  ...itemValidation,
  body('lost_date')
    .isISO8601()
    .withMessage('Lost date must be a valid date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Lost date cannot be in the future');
      }
      return true;
    })
];

const foundItemValidation = [
  ...itemValidation,
  body('found_date')
    .isISO8601()
    .withMessage('Found date must be a valid date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Found date cannot be in the future');
      }
      return true;
    })
];

const updateItemValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['Electronics', 'Books', 'ID Cards', 'Clothing', 'Others'])
    .withMessage('Category must be one of: Electronics, Books, ID Cards, Clothing, Others'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Location must be between 3 and 200 characters'),
  body('contact_info')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Contact information must be between 5 and 500 characters'),
  body('image_url')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null, undefined, or empty string
      }
      // If value exists, validate it as URL
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(value)) {
        throw new Error('Please provide a valid image URL');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['lost', 'found', 'closed'])
    .withMessage('Status must be one of: lost, found, closed')
];

const foundItemUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['Electronics', 'Books', 'ID Cards', 'Clothing', 'Others'])
    .withMessage('Category must be one of: Electronics, Books, ID Cards, Clothing, Others'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Location must be between 3 and 200 characters'),
  body('contact_info')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Contact information must be between 5 and 500 characters'),
  body('image_url')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null, undefined, or empty string
      }
      // If value exists, validate it as URL
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(value)) {
        throw new Error('Please provide a valid image URL');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['available', 'returned', 'closed'])
    .withMessage('Status must be one of: available, returned, closed')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid item ID')
];


router.get('/lost', optionalAuth, asyncHandler(getLostItems));

router.get('/found', optionalAuth, asyncHandler(getFoundItems));

router.get('/lost/:id', idValidation, optionalAuth, asyncHandler(getLostItem));

router.get('/found/:id', idValidation, optionalAuth, asyncHandler(getFoundItem));

router.post('/lost', authenticateToken, upload.single('image'), lostItemValidation, handleValidationErrors, asyncHandler(createLostItem));

router.post('/found', authenticateToken, upload.single('image'), foundItemValidation, handleValidationErrors, asyncHandler(createFoundItem));

router.put('/lost/:id', authenticateToken, idValidation, updateItemValidation, handleValidationErrors, asyncHandler(updateLostItem));

router.put('/found/:id', authenticateToken, idValidation, foundItemUpdateValidation, handleValidationErrors, asyncHandler(updateFoundItem));

router.delete('/lost/:id', authenticateToken, idValidation, asyncHandler(deleteLostItem));

router.delete('/found/:id', authenticateToken, idValidation, asyncHandler(deleteFoundItem));

router.get('/my/lost', authenticateToken, asyncHandler(getMyLostItems));

router.get('/my/found', authenticateToken, asyncHandler(getMyFoundItems));

router.get('/search', optionalAuth, asyncHandler(searchItems));

router.get('/stats', asyncHandler(getStats));

router.get('/recent', optionalAuth, asyncHandler(getRecentItems));

module.exports = router;
