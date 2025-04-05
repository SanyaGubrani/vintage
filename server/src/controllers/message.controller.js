import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../utils/soket.js";

const getUsersForSidebar = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const userId = req.user?._id;

  // find all users except the currently logged in user
  const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
    "-password"
  );

  res
    .status(200)
    .json(new ApiResponse(200, filteredUsers, "Users fetched successfully"));
});

const getMessages = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { receiverId } = req.params;
  const senderId = req.user?._id;

  if (!receiverId) {
    throw new ApiError(400, "Receiver ID is required");
  }

  // find all messages between sender & reciever (both cases)
  const messages = await Message.find({
    $or: [
      { sender: senderId, receiver: receiverId }, // current user is sender
      { sender: receiverId, receiver: senderId }, // current user is reciever
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

const sendMessages = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { receiverId } = req.params;
  const senderId = req.user?._id;

  if (!receiverId) {
    throw new ApiError(400, "Receiver ID is required");
  }

  // user can send both text & media as a message
  const { message, media } = req.body;

  let mediaUrl;
  if (media) {
    // upload media to cloudinary
    const uploadMedia = await uploadOnCloudinary(media);
    mediaUrl = uploadMedia.secure_url;
  }

  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    message: message,
    media: mediaUrl,
  });

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }
  
  res
    .status(200)
    .json(new ApiResponse(200, newMessage, "Message sent successfully"));
});

export { getUsersForSidebar, getMessages, sendMessages };
