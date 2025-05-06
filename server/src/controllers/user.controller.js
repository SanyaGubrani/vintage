import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getUserProfile = asyncHandler(async (req, res) => {
  // check if user exists from passport local/google auth
  if (!req.user) {
    throw new ApiError(400, "User not authenticated");
  }

  //get the user
  const user = await User.findById(req.user._id).select("-refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // determine the auth type
  const authType = user.googleId ? "google" : "local";

  const userProfile = {
    id: user._id,
    username: user.username,
    email: user.email,
    profile_picture: user.profile_picture,
    bio: user.bio,
    name: user.name,
    password: user.password,
    cover_image: user.cover_image,
    authType: authType,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  //return the authenticated user
  return res
    .status(200)
    .json(new ApiResponse(200, userProfile, "User fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(400, "User not authenticated");
  }

  const { name, bio, username } = req.body;

  if (!(name || username || bio)) {
    throw new ApiError(400, "Nothing to update");
  }

  if (username) {
    const existingUsername = await User.findOne({
      username,
      _id: { $ne: req.user._id },
    });

    if (existingUsername) {
      throw new ApiError(409, "Username is already taken");
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name: name,
        username: username,
        bio: bio,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const profilePicLocalPath = req.file?.path;

  if (!profilePicLocalPath) {
    throw new ApiError(404, "Profile Picture is missing");
  }

  const profilePicture = await uploadOnCloudinary(profilePicLocalPath);

  if (!profilePicture.url) {
    throw new ApiError(400, "Error while uploading profile picture");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profile_picture: profilePicture.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar uploaded successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(404, "Cover image is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        cover_image: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image uploader successfully"));
});

const getOtherUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(userId).select("-password -refreshToken -email");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userProfile = {
    _id: user._id,
    username: user.username,
    name: user.name,
    profile_picture: user.profile_picture,
    cover_image: user.cover_image,
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  return res
    .status(200)
    .json(new ApiResponse(200, userProfile, "User profile fetched successfully"));
});

export {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  updateCoverImage,
  getOtherUserProfile
};
