import { Post } from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";

const withLikedByCurrentUser = async (posts, userId) => {
  const postIds = posts.map((post) => post._id);

  const likes = await Like.find({ user: userId, post: { $in: postIds } })
    .select("post")
    .lean();

  const likedPostIds = new Set(likes.map((like) => like.post.toString()));

  return posts.map((post) => ({
    ...post,
    isLiked: likedPostIds.has(post._id.toString()),
  }));
};

const createPost = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { caption } = req.body;

  const mediaLocalPath = req.file?.path;

  if (!(caption || mediaLocalPath)) {
    throw new ApiError(400, "Nothing to post");
  }

  let mediaUrl = null;

  if (mediaLocalPath) {
    const media = await uploadOnCloudinary(mediaLocalPath);

    if (!media?.url) {
      throw new ApiError(400, "Error while uploading media content");
    }

    mediaUrl = media.url;
  }

  const post = await Post.create({
    user: req.user?._id,
    caption: caption || "",
    media: mediaUrl,
  });

  const populatedPost = await Post.findById(post._id)
    .populate("user", "name username profile_picture")
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, populatedPost, "Post created successfully"));
});

const editCaption = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  const { caption } = req.body;

  if (!caption) {
    throw new ApiError(400, "New caption is required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // verify that the user owns the post
  if (post.user.toString() != req.user?._id.toString()) {
    throw new ApiError(403, "You can edit only your posts");
  }

  //update the post
  await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        caption: caption,
      },
    },
    { new: true }
  );

  // populate with user details
  const updatedPost = await Post.findById(postId)
    .populate("user", "name username profile_picture")
    .lean();

  if (!updatedPost) {
    throw new ApiError(404, "Updated post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Caption edited successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(404, "Post not found");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check ownership
  if (post.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can delete only your own posts");
  }

  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

//Get all posts with cursor-based pagination
const getAllPosts = asyncHandler(async (req, res) => {
  const { cursor, limit = 10 } = req.query;
  const queryLimit = parseInt(limit) || 10;

  let query = {};

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(queryLimit + 1)
    .populate("user", "name username profile_picture")
    .lean();

  // Check if there are more posts
  const hasNextPage = posts.length > queryLimit;

  if (hasNextPage) {
    posts.pop();
  }

  const nextCursor = hasNextPage ? posts[posts.length - 1]._id : null;

  const postsWithLikes = await withLikedByCurrentUser(posts, req.user?._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts: postsWithLikes,
        pagination: {
          nextCursor,
          hasNextPage,
        },
      },
      "Posts fetched successfully"
    )
  );
});

const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  const { cursor, limit = 10 } = req.query;
  const queryLimit = parseInt(limit) || 10;

  let query = { user: userId };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(queryLimit + 1)
    .populate("user", "username name profile_picture")
    .lean();

  const hasNextPage = posts.length > queryLimit;

  if (hasNextPage) {
    posts.pop();
  }

  const nextCursor = hasNextPage ? posts[posts.length - 1]._id : null;

  const postsWithLikes = await withLikedByCurrentUser(posts, req.user?._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts: postsWithLikes,
        pagination: {
          nextCursor,
          hasNextPage,
        },
      },
      "User posts fetched successfully"
    )
  );
});

const getMyPosts = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const userId = req.user._id;

  const { cursor, limit = 10 } = req.query;
  const queryLimit = parseInt(limit) || 10;

  let query = { user: userId };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(queryLimit + 1)
    .populate("user", "username name profile_picture")
    .lean();

  const hasNextPage = posts.length > queryLimit;

  if (hasNextPage) {
    posts.pop();
  }

  const nextCursor =
    hasNextPage && posts.length > 0 ? posts[posts.length - 1]._id : null;

  const postsWithLikes = await withLikedByCurrentUser(posts, req.user?._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts: postsWithLikes,
        pagination: {
          nextCursor,
          hasNextPage,
        },
      },
      "Your posts fetched successfully"
    )
  );
});

export {
  createPost,
  editCaption,
  deletePost,
  getAllPosts,
  getUserPosts,
  getMyPosts,
};
