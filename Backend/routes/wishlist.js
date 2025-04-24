import express from 'express';
import Wishlist from '../models/Wishlist.js';

const router = express.Router();

// GET wishlist items by user email
router.get('/user/:email', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userEmail: req.params.email }).populate('items._id');

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'No wishlist found for this user'
      });
    }

    // Flatten the items so each item merges addedAt with populated product details
    const formattedItems = wishlist.items.map(item => ({
      ...item._id.toObject(), // the populated product details
      addedAt: item.addedAt   // merge addedAt at top level
    }));

    res.status(200).json({
      success: true,
      data: formattedItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// Add item to wishlist
router.post('/user/:email/items', async (req, res) => {
  try {
    const { _id } = req.body; // Ensure you're sending a productId in the request body

    if (!_id) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    // Find the wishlist by user email
    let wishlist = await Wishlist.findOne({ userEmail: req.params.email });

    // If wishlist does not exist, create a new one
    if (!wishlist) {
      wishlist = new Wishlist({
        userEmail: req.params.email,
        items: []
      });
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(item => item._id.toString() === _id);

    if (existingItem) {
      return res.status(400).json({
        success: false,
        error: 'This item is already in your wishlist'
      });
    }

    // Add new item to wishlist
    wishlist.items.push({ _id });

    // Save the updated wishlist
    await wishlist.save();

    res.status(201).json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlist.items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Remove item from wishlist
router.delete('/user/:email/remove/:productId', async (req, res) => {
  try {
    const { email, productId } = req.params;

    // Find the wishlist by user email
    const wishlist = await Wishlist.findOne({ userEmail: email });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'No wishlist found for this user'
      });
    }

    // Find the item in the wishlist and remove it
    const itemIndex = wishlist.items.findIndex(item => item._id.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in wishlist'
      });
    }

    // Remove the item from the array
    wishlist.items.splice(itemIndex, 1);

    // Save the updated wishlist
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist',
      data: wishlist.items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
