import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";
import path from "path";

const router = express.Router();
// Post a new products
router.post("/", upload.single("image"), async (req, res) => {
  console.log(req, "manish");
  try {
    const newProduct = new Product({
      title: req.body.title,
      subtitle: req.body.subtitle,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      originalPrice: req.body?.originalPrice,
      rating: req.body.rating,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      data: savedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
// Get all products
// /routes/product.js

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "default"; // default | price_asc | price_desc | recent

    let sortQuery = {};

    if (sort === "price_asc") {
      sortQuery.price = 1;
    } else if (sort === "price_desc") {
      sortQuery.price = -1;
    } else if (sort === "recent") {
      sortQuery.createdAt = -1;
    }

    const [products, total] = await Promise.all([
      Product.find().sort(sortQuery).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// get single product by id

// GET a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT (update) a product by ID
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    // 1. Build update object from request body
    const updateData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      category: req.body.category,
      description: req.body.description,
      rating: req.body.rating,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
    };

    // 2. Only update imageUrl if a new image was uploaded
    if (req.file) {
      updateData.imageUrl = "/" + req.file.path.replace(/\\/g, "/");
    }

    // 3. Perform the update
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, updated: updatedProduct });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
