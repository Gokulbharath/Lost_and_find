import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import Image from '../models/Image.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const getMyCounts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Get counts for both lost and found items for the user
  const [lostCount, foundCount] = await Promise.all([
    LostItem.countDocuments({ user_id: userId }),
    FoundItem.countDocuments({ user_id: userId })
  ]);
  
  res.json({
    status: 'success',
    data: {
      lost: lostCount,
      found: foundCount
    }
  });
});

// Helper function to add image data to items
const addImageToItems = async (items, itemType) => {
  const itemsWithImages = await Promise.all(
    items.map(async (item) => {
      const image = await Image.findOne({ 
        itemId: item._id, 
        itemType: itemType 
      });
      
      if (image) {
        const base64Image = `data:${image.contentType};base64,${image.data.toString('base64')}`;
        return { ...item.toObject(), image: base64Image };
      }
      
      return { ...item.toObject(), image: null };
    })
  );
  
  return itemsWithImages;
};

const getLostItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const category = req.query.category;
  const search = req.query.search;
  const status = req.query.status;

  const filter = { is_active: true };
  if (category) filter.category = category;
  if (status) filter.status = status;

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
  
  // Add images to items
  const itemsWithImages = await addImageToItems(items, 'LostItem');

  res.json({
    success: true,
    data: {
      items: itemsWithImages,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit
      }
    }
  });
});

const getFoundItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const category = req.query.category;
  const search = req.query.search;
  const status = req.query.status;

  const filter = { is_active: true };
  if (category) filter.category = category;
  if (status) filter.status = status;

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
  
  // Add images to items
  const itemsWithImages = await addImageToItems(items, 'FoundItem');

  res.json({
    success: true,
    data: {
      items: itemsWithImages,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit
      }
    }
  });
});

const getLostItem = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id)
    .populate('user_id', 'full_name email phone');

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Lost item not found'
    });
  }

  // Add image to item
  const itemsWithImages = await addImageToItems([item], 'LostItem');
  const itemWithImage = itemsWithImages[0];

  res.json({
    success: true,
    data: { item: itemWithImage }
  });
});

const getFoundItem = asyncHandler(async (req, res) => {
  const item = await FoundItem.findById(req.params.id)
    .populate('user_id', 'full_name email phone');

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Found item not found'
    });
  }

  // Add image to item
  const itemsWithImages = await addImageToItems([item], 'FoundItem');
  const itemWithImage = itemsWithImages[0];

  res.json({
    success: true,
    data: { item: itemWithImage }
  });
});

const createLostItem = asyncHandler(async (req, res) => {
  const itemData = {
    ...req.body,
    user_id: req.user._id
  };

  const item = await LostItem.create(itemData);
  await item.populate('user_id', 'full_name email');

  // Handle image upload if present
  if (req.file) {
    const imageDoc = new Image({
      itemId: item._id,
      itemType: 'LostItem',
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await imageDoc.save();
  }

  // Add image to response
  const itemsWithImages = await addImageToItems([item], 'LostItem');
  const itemWithImage = itemsWithImages[0];

  res.status(201).json({
    success: true,
    message: 'Lost item created successfully',
    data: { item: itemWithImage }
  });
});

const createFoundItem = asyncHandler(async (req, res) => {
  const itemData = {
    ...req.body,
    user_id: req.user._id
  };

  const item = await FoundItem.create(itemData);
  await item.populate('user_id', 'full_name email');

  // Handle image upload if present
  if (req.file) {
    const imageDoc = new Image({
      itemId: item._id,
      itemType: 'FoundItem',
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await imageDoc.save();
  }

  // Add image to response
  const itemsWithImages = await addImageToItems([item], 'FoundItem');
  const itemWithImage = itemsWithImages[0];

  res.status(201).json({
    success: true,
    message: 'Found item created successfully',
    data: { item: itemWithImage }
  });
});

const updateLostItem = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id);

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Lost item not found'
    });
  }

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

const updateFoundItem = asyncHandler(async (req, res) => {
  const item = await FoundItem.findById(req.params.id);

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Found item not found'
    });
  }

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

const deleteLostItem = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id);

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Lost item not found'
    });
  }

  if (!item.isOwner(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this item'
    });
  }

  item.is_active = false;
  await item.save();

  res.json({
    success: true,
    message: 'Lost item deleted successfully'
  });
});

const deleteFoundItem = asyncHandler(async (req, res) => {
  const item = await FoundItem.findById(req.params.id);

  if (!item || !item.is_active) {
    return res.status(404).json({
      success: false,
      message: 'Found item not found'
    });
  }

  if (!item.isOwner(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this item'
    });
  }

  item.is_active = false;
  await item.save();

  res.json({
    success: true,
    message: 'Found item deleted successfully'
  });
});


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

const getRecentItems = asyncHandler(async (req, res) => {
  // Get 3 most recent lost items
  const recentLostItems = await LostItem.find({ is_active: true })
    .populate('user_id', 'full_name email')
    .sort({ created_at: -1 })
    .limit(3);

  // Get 3 most recent found items
  const recentFoundItems = await FoundItem.find({ is_active: true })
    .populate('user_id', 'full_name email')
    .sort({ created_at: -1 })
    .limit(3);

  // Combine and sort by creation date
  const allRecentItems = [
    ...recentLostItems.map(item => ({ ...item.toObject(), type: 'lost' })),
    ...recentFoundItems.map(item => ({ ...item.toObject(), type: 'found' }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

  // Add images to items
  const itemsWithImages = await Promise.all(
    allRecentItems.map(async (item) => {
      const image = await Image.findOne({ 
        itemId: item._id, 
        itemType: item.type === 'lost' ? 'LostItem' : 'FoundItem'
      });
      
      if (image) {
        const base64Image = `data:${image.contentType};base64,${image.data.toString('base64')}`;
        return { ...item, image: base64Image };
      }
      
      return { ...item, image: null };
    })
  );

  res.json({
    success: true,
    data: { items: itemsWithImages }
  });
});

export {
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
  getRecentItems,
  getMyCounts
};

