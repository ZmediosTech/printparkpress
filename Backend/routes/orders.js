import express from "express";
import Order from "../models/Order.js";
import Wishlist from "../models/Wishlist.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const generateUserEmail = (order) => `
  <h2>Thank you for your order, ${order.user.fullName}!</h2>
  <p>We have received your order and are currently processing it.</p>
  <h3>Order Summary:</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="text-align: left;">Product</th>
        <th>Qty</th>
        <th>Image</th>
      </tr>
    </thead>
    <tbody>
      ${order.products
        .map(
          (item) => `
        <tr>
          <td>${item.name}</td>
          <td style="text-align: center;">${item.quantity}</td>
                <td><img src="${process.env.BACKEND_URL}${item.image}" alt="${item.name}" style="width: 60px; height: auto;" /></td>

        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
  <p><strong>Total:</strong> ₹${order.totalAmount}</p>
  <p> <strong>Shipping to </strong>: ${order.user.address.street}, ${order.user.address.city} - ${
  order.user.address.pincode
}</p>
`;

const generateAdminEmail = (order) => `
  <h2>New Order Received</h2>
  <p><strong>Customer:</strong> ${order.user.fullName} (${order.user.email})</p>
  <p><strong>Mobile:</strong> ${order.user.mobile}</p>
  <p><strong>Address:</strong> ${order.user.address.street}, ${
  order.user.address.city
} - ${order.user.address.pincode}</p>
  <h3>Order Details:</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="text-align: left;">Product</th>
        <th>Qty</th>
        <th>Image</th>
      </tr>
    </thead>
    <tbody>
      ${order.products
        .map(
          (item) => `
        <tr>
          <td>${item.name}</td>
          <td style="text-align: center;">${item.quantity}</td>
        <td><img src="${process.env.BACKEND_URL}${item.image}" alt="${item.name}" style="width: 60px; height: auto;" /></td>

        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
  <p><strong>Total:</strong> ₹${order.totalAmount}</p>
  <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
`;

// Create new order

router.post("/", async (req, res) => {
  try {
    const newOrder = new Order({
      user: {
        email: req.body.user.email,
        fullName: req.body.user.fullName,
        mobile: req.body.user.mobile,
        address: {
          street: req.body.user.address.street,
          city: req.body.user.address.city,
          pincode: req.body.user.address.pincode,
        },
      },
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      orderDate: new Date(),
    });

    const savedOrder = await newOrder.save();

    // Send confirmation email to user
    await transporter.sendMail({
      from: "arihant@yopmail.com",
      to: savedOrder.user.email,
      subject: "Order Confirmation",
      html: generateUserEmail(savedOrder),
    });

    // Send notification email to admin
    await transporter.sendMail({
      from: "arihant@yopmail.com",
      to: "manish@yopmail.com",
      subject: "New Order Placed",
      html: generateAdminEmail(savedOrder),
    });
    res.status(201).json({
      success: true,
      data: savedOrder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const orders = await Order.find({ "user.email": req.params.email }).sort({
      orderDate: -1,
    });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No orders found for this user",
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 }); // or use 'orderDate' if that's your field
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      userEmail: req.params.email,
    }).populate("items.productId");

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: "No wishlist found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
