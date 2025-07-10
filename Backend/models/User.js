import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  locality: { type: String },
  city: { type: String }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  addresses: [addressSchema] // 👈 add this line
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
