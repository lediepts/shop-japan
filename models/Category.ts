import mongoose from "mongoose";
import { ICategory } from "../types/interface";

export interface Category extends mongoose.Document, Omit<ICategory, "_id"> {}

const CategorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide a name for this Category."],
    maxlength: [100, "Name cannot be more than 60 characters"],
  },
});

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
