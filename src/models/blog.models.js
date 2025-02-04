import mongoose, { Schema } from "mongoose";
import { User } from "./user.models.js";

const blogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, //helper / author
      ref: User,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    desc:{
      type:String,
      required:true
    },
    thumbnail: {
      type: String, //temporary
    },
  },
  { 
    timestamps: true 
  }
);

export const Blog = mongoose.model("Blog",blogSchema);