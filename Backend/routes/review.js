import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// @route GET /api/reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const { name, message, rating, address } = req.body;
    const newReview = new Review({ name, message, rating, address });
    await newReview.save();
    res.status(201).json({ success: true, data: newReview });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route PUT /api/reviews/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, message, rating, address } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { name, message, rating, address },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.json({ success: true, data: updatedReview });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid request" });
  }
});

// @route DELETE /api/reviews/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

