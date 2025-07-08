import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
        trim: true,
      },
    },
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: String,
      image: String,
      quantity: Number,
      price: Number,
      color: String,
      status: {
        type: String,
        enum: ["Shipped", "Cancelled","Delivered","Processing"],
        default: "Active",
      },
    },
  ],

  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Cash on Delivery"],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
