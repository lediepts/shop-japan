import mongoose from "mongoose";
import { IProduct } from "../types/interface";

export interface Product extends mongoose.Document, Omit<IProduct, "_id"> {}

const ProductSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide a name for this Product."],
    maxlength: [100, "Name cannot be more than 60 characters"],
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  trademarkId: {
    type: String,
    required: true,
  },
  other: {
    type: String,
    default: "",
  },
  image: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
