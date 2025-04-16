// const mongoose = require('mongoose');
import mongoose from 'mongoose';

export const connectDB = async () => {
console.log(process.env.MONGODB_URI,"database")
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// module.exports = connectDB;