import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
    },
    media: {
      type: String,
    },
    is_read: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
