// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  subtitle: String,

  description: String,
  price: Number,
  originalPrice: Number,
  price: Number,
  rating: Number,
  imageUrl: String,
  category: String,
  
});

export default mongoose.model("Product", productSchema);
