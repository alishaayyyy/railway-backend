import mongoose from "mongoose";

const hijabStyleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String
}, { timestamps: true });

export default mongoose.models.HijabStyle || mongoose.model("HijabStyle", hijabStyleSchema);