import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleLike = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { postId } = req.params;
  const userId = req.user?._id;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  //check if the like already exists
  const existingLike = await Like.findOne({ user: userId, post: postId });

  let isLiked = false;

  if (existingLike) {
    // unlike
    await existingLike.deleteOne();
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });

    isLiked = false;
  } else {
    // like
    await Like.create({ user: userId, post: postId });
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });
    isLiked = true;
  }

  const likes = await Like.find({ post: postId })
    .populate("user", "username profile_picture")
    .lean();

  const updatedPost = await Post.findById(postId).lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isLiked,
        likeCount: updatedPost.likeCount,
        postId,
        likedUsers: likes.map((like) => like.user),
      },
      `Post ${isLiked ? "Liked" : "Unliked"} successfully`
    )
  );
});

export { toggleLike };
