import express from "express";
import CartItem from "../models/CartItem.js";
import mongoose from "mongoose";
const router = express.Router();

// Add to cart
router.post("/add", async (req, res) => {
  const { userId, product } = req.body;

  try {
    const existing = await CartItem.findOne({
      userId,
      "product._id": product._id,
    });

    if (existing) {
      existing.quantity += product.quantity || 1;
      await existing.save();
      return res.json({ success: true, message: "Quantity updated" });
    }

    const newItem = new CartItem({
      userId,
      product,
      quantity: product.quantity || 1,
    });

    await newItem.save();
    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
});

// Get cart items
router.get("/:userId", async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.params.userId });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update cart item quantity
// PATCH /cart/item/:id
router.patch("/item/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    const updated = await CartItem.findByIdAndUpdate(
      req.params.id,
      { $set: { quantity } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Remove item
router.delete("/item/:id", async (req, res) => {
  try {
    const result = await CartItem.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Removed from cart" });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// routes/cart.js
router.delete("/clear/:userId", async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.params.userId });
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
