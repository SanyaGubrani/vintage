import mongoose from "mongoose";
import { User } from "./user.model.js";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    caption: {
      type: String,
    },
    media: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
