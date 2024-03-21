import mongoose from "mongoose";
import { IUser } from "../types/interface";

export interface User extends mongoose.Document,Omit<IUser, "_id"> {
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema<IUser>({
  name: {
    /* The name of this user */

    type: String,
    required: [true, "Please provide a name for this user."],
    maxlength: [100, "Name cannot be more than 60 characters"],
  },
  email: {
    /* The email of this user */

    type: String,
    required: [true, "Please provide a name for this user."],
    maxlength: [150, "Name cannot be more than 60 characters"],
  },
  password: {
    /* The password of this user */

    type: String,
    required: [true, "Please provide a name for this user."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  role: {
    /* The password of this user */

    type: String,
    default:"editor"
  },
});

export default mongoose.models.user || mongoose.model<IUser>("user", UserSchema)
