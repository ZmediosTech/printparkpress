// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
//   category: String,
  rating: Number,
  imageUrl: String // Only the path to the image
});

export default mongoose.model('Product', productSchema);
