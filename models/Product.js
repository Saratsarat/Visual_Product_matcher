import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  id: { type: Number, index: true, unique: true },
  productDisplayName: String,
  masterCategory: String,
  subCategory: String,
  articleType: String,
  gender: String,
  baseColour: String,
  season: String,
  year: Number,
  usage: String,
  image_url: String,
  image_hash: String,   // perceptual hash (hex or binary string)
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
