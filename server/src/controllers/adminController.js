import User from '../models/User.js';
import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import ExchangeRequest from '../models/ExchangeRequest.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: users
  });
});

export const getItems = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status === 'inactive' ? { is_active: false } : status === 'active' ? { is_active: true } : {};

  const [lostItems, foundItems] = await Promise.all([
    LostItem.find(query).populate('user_id', 'full_name email'),
    FoundItem.find(query).populate('user_id', 'full_name email')
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

export const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.userId);
  
  if (!deletedUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    message: 'User permanently deleted from the database'
  });
});

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

// Accept item (set is_active to true)
export const acceptItem = asyncHandler(async (req, res) => {
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

  item.is_active = true;
  await item.save();

  res.json({
    success: true,
    message: 'Item approved successfully',
    data: item
  });
});

// Reject item (delete from database)
export const rejectItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { type } = req.query;

  const Model = type === 'found' ? FoundItem : LostItem;
  const item = await Model.findByIdAndDelete(itemId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  res.json({
    success: true,
    message: 'Item rejected and deleted successfully'
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { full_name, email, role } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (full_name) user.full_name = full_name;
  if (email) user.email = email;
  if (role) user.role = role;

  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;

  res.json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser
  });
});

export const getExchangeRequests = asyncHandler(async (req, res) => {
  const { isApproved } = req.query;
  const filter = {};
  if (isApproved === 'true') filter.isApproved = true;
  if (isApproved === 'false') filter.isApproved = false;

  const requests = await ExchangeRequest.find(filter)
    .sort({ createdAt: -1 })
    .populate('userId', 'full_name email');

  res.json({ 
    success: true, 
    data: requests
  });
});

export const addExchangeRequest = asyncHandler(async (req, res) => {
  const { userId, itemId, type, title, category, status } = req.body;

  console.log('Adding exchange request with data:', req.body);

  if (!userId || !itemId || !type || !title || !category || !status) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  if (!['lost', 'found'].includes(type)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid type' 
    });
  }

  const existing = await ExchangeRequest.findOne({ userId, itemId, type });
  if (existing) {
    return res.status(409).json({ 
      success: false, 
      message: 'Exchange request already exists' 
    });
  }

  const exReq = await ExchangeRequest.create({
    userId,
    itemId,
    type,
    title,
    category,
    status,
    isApproved: false
  });

  res.status(201).json({ 
    success: true, 
    message: 'Exchange request created', 
    data: exReq 
  });
});

export const acceptExchangeRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const exReq = await ExchangeRequest.findById(id);
  if (!exReq) {
    return res.status(404).json({ 
      success: false, 
      message: 'Exchange request not found' 
    });
  }

  // Mark the request as approved
  exReq.isApproved = true;
  await exReq.save();

  // Find and update the item's status to 'returned'
  const Model = exReq.type === 'found' ? FoundItem : LostItem;
  await Model.findByIdAndUpdate(exReq.itemId, { status: 'returned' });

  res.json({ 
    success: true, 
    message: 'Exchange request accepted and item marked as returned', 
    data: exReq 
  });
});

export const deleteExchangeRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await ExchangeRequest.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ 
      success: false, 
      message: 'Exchange request not found' 
    });
  }

  res.json({ success: true, message: 'Exchange request deleted' });
});
