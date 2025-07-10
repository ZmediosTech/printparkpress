import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    _id: String,
    title: String,
    price: Number,
    originalPrice:Number,
    imageUrl: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const CartItem =  mongoose.model("CartItem", cartItemSchema);
export default CartItem;