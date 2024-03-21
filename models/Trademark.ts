import mongoose from "mongoose";
import { ITrademark } from "../types/interface";

export interface Trademark extends mongoose.Document, Omit<ITrademark, "_id"> {}

const TrademarkSchema = new mongoose.Schema<ITrademark>({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide a name for this Trademark."],
  },
  logo: {
    type: String,
  },
});

export default mongoose.models.Trademark ||
  mongoose.model<ITrademark>("Trademark", TrademarkSchema);
