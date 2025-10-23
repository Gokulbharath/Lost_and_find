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
  getStats
} = require('../controllers/itemController');
const { authenticateToken, optionalAuth } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../middlewares/errorHandler');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Validation rules
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
    .isURL()
    .withMessage('Please provide a valid image URL')
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
    .isURL()
    .withMessage('Please provide a valid image URL'),
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
    .isURL()
    .withMessage('Please provide a valid image URL'),
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

/**
 * @route   GET /api/items/lost
 * @desc    Get all lost items with pagination and filtering
 * @access  Public
 */
router.get('/lost', optionalAuth, asyncHandler(getLostItems));

/**
 * @route   GET /api/items/found
 * @desc    Get all found items with pagination and filtering
 * @access  Public
 */
router.get('/found', optionalAuth, asyncHandler(getFoundItems));

/**
 * @route   GET /api/items/lost/:id
 * @desc    Get single lost item
 * @access  Public
 */
router.get('/lost/:id', idValidation, optionalAuth, asyncHandler(getLostItem));

/**
 * @route   GET /api/items/found/:id
 * @desc    Get single found item
 * @access  Public
 */
router.get('/found/:id', idValidation, optionalAuth, asyncHandler(getFoundItem));

/**
 * @route   POST /api/items/lost
 * @desc    Create new lost item
 * @access  Private
 */
router.post('/lost', authenticateToken, lostItemValidation, handleValidationErrors, asyncHandler(createLostItem));

/**
 * @route   POST /api/items/found
 * @desc    Create new found item
 * @access  Private
 */
router.post('/found', authenticateToken, foundItemValidation, handleValidationErrors, asyncHandler(createFoundItem));

/**
 * @route   PUT /api/items/lost/:id
 * @desc    Update lost item
 * @access  Private
 */
router.put('/lost/:id', authenticateToken, idValidation, updateItemValidation, handleValidationErrors, asyncHandler(updateLostItem));

/**
 * @route   PUT /api/items/found/:id
 * @desc    Update found item
 * @access  Private
 */
router.put('/found/:id', authenticateToken, idValidation, foundItemUpdateValidation, handleValidationErrors, asyncHandler(updateFoundItem));

/**
 * @route   DELETE /api/items/lost/:id
 * @desc    Delete lost item
 * @access  Private
 */
router.delete('/lost/:id', authenticateToken, idValidation, asyncHandler(deleteLostItem));

/**
 * @route   DELETE /api/items/found/:id
 * @desc    Delete found item
 * @access  Private
 */
router.delete('/found/:id', authenticateToken, idValidation, asyncHandler(deleteFoundItem));

/**
 * @route   GET /api/items/my/lost
 * @desc    Get user's lost items
 * @access  Private
 */
router.get('/my/lost', authenticateToken, asyncHandler(getMyLostItems));

/**
 * @route   GET /api/items/my/found
 * @desc    Get user's found items
 * @access  Private
 */
router.get('/my/found', authenticateToken, asyncHandler(getMyFoundItems));

/**
 * @route   GET /api/items/search
 * @desc    Search items
 * @access  Public
 */
router.get('/search', optionalAuth, asyncHandler(searchItems));

/**
 * @route   GET /api/items/stats
 * @desc    Get statistics
 * @access  Public
 */
router.get('/stats', asyncHandler(getStats));

module.exports = router;
