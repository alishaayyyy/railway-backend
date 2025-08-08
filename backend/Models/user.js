import mongoose from 'mongoose';

const { Schema } = mongoose;

// **************************User Schema*************************************************
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user" // only "user" is assigned by default
  }
});

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
