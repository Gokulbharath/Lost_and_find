import express from 'express';
import {
  getUsers,
  getItems,
  deleteUser,
  suspendUser,
  deleteItem,
  updateItemStatus,
  acceptItem,
  rejectItem,
  updateUser
} from '../controllers/adminController.js';
import {
  addExchangeRequest,
  acceptExchangeRequest,
  deleteExchangeRequest,
  getExchangeRequests
} from '../controllers/adminController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

// Protect all admin routes
// router.use(authenticateToken);
// router.use(isAdmin);

router.get('/users', asyncHandler(getUsers));
router.get('/items', asyncHandler(getItems));
router.delete('/users/:userId', asyncHandler(deleteUser));
router.post('/users/:userId/suspend', asyncHandler(suspendUser));
router.patch('/users/:userId', asyncHandler(updateUser));
router.delete('/items/:itemId', asyncHandler(deleteItem));
router.patch('/items/:itemId', asyncHandler(updateItemStatus));
router.post('/items/:itemId/accept', asyncHandler(acceptItem));
router.post('/items/:itemId/reject', asyncHandler(rejectItem));

router.get('/exchange-requests', asyncHandler(getExchangeRequests));
router.post('/exchange-requests', asyncHandler(addExchangeRequest));
router.post('/exchange-requests/:id/accept', asyncHandler(acceptExchangeRequest));
router.delete('/exchange-requests/:id', asyncHandler(deleteExchangeRequest));

export default router;