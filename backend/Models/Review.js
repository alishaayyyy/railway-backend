// models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  hijabStyle: { type: mongoose.Schema.Types.ObjectId, ref: "HijabStyle", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: String,
  text: String,
  rating: { type: Number, min:1, max:5, required: true }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
