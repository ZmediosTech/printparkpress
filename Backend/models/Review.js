import mongoose from 'mongoose';


const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  address: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);

