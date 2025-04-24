import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
