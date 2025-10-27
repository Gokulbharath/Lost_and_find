import express from 'express';
import {
  getUsers,
  getItems,
  deleteUser,
  suspendUser,
  deleteItem,
  updateItemStatus
} from '../controllers/adminController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(isAdmin);

router.get('/users', asyncHandler(getUsers));
router.get('/items', asyncHandler(getItems));
router.delete('/users/:userId', asyncHandler(deleteUser));
router.post('/users/:userId/suspend', asyncHandler(suspendUser));
router.delete('/items/:itemId', asyncHandler(deleteItem));
router.patch('/items/:itemId', asyncHandler(updateItemStatus));

export default router;