const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * @desc    Get all lost items with pagination and filtering
 * @route   GET /api/items/lost
 * @access  Public
 */
const getLostItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const category = req.query.category;
  const search = req.query.search;
  const status = req.query.status;

  // Build filter
  const filter = { is_active: true };
  if (category) filter.category = category;
  if (status) filter.status = status;

  // Build search query
  let query = LostItem.find(filter).populate('user_id', 'full_name email');
  
  if (search) {
    query = query.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    });
  }

  const items = await query
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);

  const total = await LostItem.countDocuments(filter);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit
      }
    }
  });
});

/**
 * @desc    Get all found items with pagination and filtering
 * @route   GET /api/items/found
 * @access  Public
 */
const getFoundItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const category = req.query.category;
  const search = req.query.search;
  const status = req.query.status;

  // Build filter
  const filter = { is_active: true };
  if (category) filter.category = category;
  if (status) filter.status = status;

  // Build search query
  let query = FoundItem.find(filter).populate('user_id', 'full_name email');
  
  if (search) {
    query = query.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    });
  }

  const items = await query
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);

  const total = await FoundItem.countDocuments(filter);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit
      }
    }
  });
});

/**
 * @desc    Get single lost item
 * @route   GET /api/items/lost/:id
 * @access  Public
 */
const getLostItem = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id)
    .populate('user_id', 'full_name email phone');

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Lost item not found'
    });
  }

  res.json({
    success: true,
    data: { item }
  });
});

/**
 * @desc    Get single found item
 * @route   GET /api/items/found/:id
 * @access  Public
 */
const getFoundItem = asyncHandler(async (req, res) => {
  const item = await FoundItem.findById(req.params.id)
    .populate('user_id', 'full_name email phone');

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Found item not found'
    });
  }

  res.json({
    success: true,
    data: { item }
  });
});

/**
 * @desc    Create new lost item
 * @route   POST /api/items/lost
 * @access  Private
 */
const createLostItem = asyncHandler(async (req, res) => {
  const itemData = {
    ...req.body,
    user_id: req.user._id
  };

  const item = await LostItem.create(itemData);
  await item.populate('user_id', 'full_name email');

  res.status(201).json({
    success: true,
    message: 'Lost item created successfully',
    data: { item }
  });
});

/**
 * @desc    Create new found item
 * @route   POST /api/items/found
 * @access  Private
 */
const createFoundItem = asyncHandler(async (req, res) => {
  const itemData = {
    ...req.body,
    user_id: req.user._id
  };

  const item = await FoundItem.create(itemData);
  await item.populate('user_id', 'full_name email');

  res.status(201).json({
    success: true,
    message: 'Found item created successfully',
    data: { item }
  });
});

/**
 * @desc    Update lost item
 * @route   PUT /api/items/lost/:id
 * @access  Private
 */
const updateLostItem = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id);

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Lost item not found'
    });
  }

  // Check ownership
  if (!item.isOwner(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this item'
    });
  }

  const updatedItem = await LostItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('user_id', 'full_name email');

  res.json({
    success: true,
    message: 'Lost item updated successfully',
    data: { item: updatedItem }
  });
});

/**
 * @desc    Update found item
 * @route   PUT /api/items/found/:id
 * @access  Private
 */
const updateFoundItem = asyncHandler(async (req, res) => {
  const item = await FoundItem.findById(req.params.id);

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Found item not found'
    });
  }

  // Check ownership
  if (!item.isOwner(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this item'
    });
  }

  const updatedItem = await FoundItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('user_id', 'full_name email');

  res.json({
    success: true,
    message: 'Found item updated successfully',
    data: { item: updatedItem }
  });
});

/**
 * @desc    Delete lost item
 * @route   DELETE /api/items/lost/:id
 * @access  Private
 */
const deleteLostItem = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id);

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Lost item not found'
    });
  }

  // Check ownership
  if (!item.isOwner(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this item'
    });
  }

  // Soft delete
  item.is_active = false;
  await item.save();

  res.json({
    success: true,
    message: 'Lost item deleted successfully'
  });
});

/**
 * @desc    Delete found item
 * @route   DELETE /api/items/found/:id
 * @access  Private
 */
const deleteFoundItem = asyncHandler(async (req, res) => {
  const item = await FoundItem.findById(req.params.id);

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Found item not found'
    });
  }

  // Check ownership
  if (!item.isOwner(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this item'
    });
  }

  // Soft delete
  item.is_active = false;
  await item.save();

  res.json({
    success: true,
    message: 'Found item deleted successfully'
  });
});

/**
 * @desc    Get user's lost items
 * @route   GET /api/items/my/lost
 * @access  Private
 */
const getMyLostItems = asyncHandler(async (req, res) => {
  const items = await LostItem.find({ 
    user_id: req.user._id, 
    is_active: true 
  }).sort({ created_at: -1 });

  res.json({
    success: true,
    data: { items }
  });
});

/**
 * @desc    Get user's found items
 * @route   GET /api/items/my/found
 * @access  Private
 */
const getMyFoundItems = asyncHandler(async (req, res) => {
  const items = await FoundItem.find({ 
    user_id: req.user._id, 
    is_active: true 
  }).sort({ created_at: -1 });

  res.json({
    success: true,
    data: { items }
  });
});

/**
 * @desc    Search items
 * @route   GET /api/items/search
 * @access  Public
 */
const searchItems = asyncHandler(async (req, res) => {
  const { q: query, type } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const searchFilter = {
    is_active: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } }
    ]
  };

  let lostItems = [];
  let foundItems = [];

  if (!type || type === 'lost') {
    lostItems = await LostItem.find(searchFilter)
      .populate('user_id', 'full_name email')
      .sort({ created_at: -1 })
      .limit(20);
  }

  if (!type || type === 'found') {
    foundItems = await FoundItem.find(searchFilter)
      .populate('user_id', 'full_name email')
      .sort({ created_at: -1 })
      .limit(20);
  }

  res.json({
    success: true,
    data: {
      lost: lostItems,
      found: foundItems
    }
  });
});

/**
 * @desc    Get statistics
 * @route   GET /api/items/stats
 * @access  Public
 */
const getStats = asyncHandler(async (req, res) => {
  const [totalLost, totalFound, totalReturned] = await Promise.all([
    LostItem.countDocuments({ is_active: true }),
    FoundItem.countDocuments({ is_active: true }),
    FoundItem.countDocuments({ is_active: true, status: 'returned' })
  ]);

  res.json({
    success: true,
    data: {
      totalLost,
      totalFound,
      totalReturned
    }
  });
});

module.exports = {
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
};

