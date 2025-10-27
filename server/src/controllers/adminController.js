import User from '../models/User.js';
import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// Get all users (admin only)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: users
  });
});

// Get all items (admin only)
export const getItems = asyncHandler(async (req, res) => {
  const [lostItems, foundItems] = await Promise.all([
    LostItem.find().populate('user_id', 'full_name email'),
    FoundItem.find().populate('user_id', 'full_name email')
  ]);

  const allItems = [
    ...lostItems.map(item => ({ ...item.toObject(), type: 'lost' })),
    ...foundItems.map(item => ({ ...item.toObject(), type: 'found' }))
  ].sort((a, b) => b.createdAt - a.createdAt);

  res.json({
    success: true,
    data: allItems
  });
});

// Delete user (admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.is_active = false;
  await user.save();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Suspend user (admin only)
export const suspendUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.is_active = false;
  await user.save();

  res.json({
    success: true,
    message: 'User suspended successfully'
  });
});

// Delete item (admin only)
export const deleteItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { type } = req.query;

  const Model = type === 'found' ? FoundItem : LostItem;
  const item = await Model.findById(itemId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  item.is_active = false;
  await item.save();

  res.json({
    success: true,
    message: 'Item deleted successfully'
  });
});

// Update item status (admin only)
export const updateItemStatus = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { type, status } = req.body;

  const Model = type === 'found' ? FoundItem : LostItem;
  const item = await Model.findById(itemId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  item.status = status;
  await item.save();

  res.json({
    success: true,
    message: 'Item status updated successfully',
    data: item
  });
});