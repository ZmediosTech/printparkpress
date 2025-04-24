import express from 'express';
import Order from '../models/Order.js';
import Wishlist from '../models/Wishlist.js';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order({
      user: {
        email: req.body.user.email,
        fullName: req.body.user.fullName,
        mobile: req.body.user.mobile,
        address: {
          street: req.body.user.address.street,
          city: req.body.user.address.city,
          pincode: req.body.user.address.pincode
        }
      },
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      orderDate: new Date()
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      success: true,
      data: savedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const orders = await Order.find({ 'user.email': req.params.email });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No orders found for this user'
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userEmail: req.params.email }).populate('items.productId');

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'No wishlist found for this user'
      });
    }

    res.status(200).json({
      success: true,
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