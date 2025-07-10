import express from "express";

const router = express.Router();
// const User = require("../models/User");
import User from "../models/User.js";


// ✅ Get all addresses
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Add new address
router.post("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.addresses.push(req.body);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.log(err,"error")
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Update specific address
router.put("/:userId/:addressId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });

    Object.assign(address, req.body); // update fields
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Delete address
router.delete("/:userId/:addressId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

