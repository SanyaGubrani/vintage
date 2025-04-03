import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

const likePost = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { postId } = req.params;
  const userId = req.user?._id;

  if (!postId) throw new ApiError(404, "Post ID is required");

  // check if post exists
  const post = await Post.exists({ _id: postId });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // unlike action
  const existingLike = await Like.findOneAndDelete({
    post: postId,
    user: userId,
    comment: { $exists: false },
  });

  let action = "unliked";

  // like action
  if (!existingLike) {
    await Like.create({ post: postId, user: userId });
    action = "liked";
  }

  // likes count and users who liked
  const [likesCount, likedBy] = await Promise.all([
    // count likes
    Like.countDocuments({
      post: postId,
      comment: { $exists: false },
    }),

    // get user who liked the post (limit 10)
    Like.find({ post: postId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("user")
      .populate("user", "username profile_picture"),
  ]);

  // check if curretn user liked the post
  const isLiked = action === "liked";

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        post: postId,
        likesCount,
        isLiked,
        likedBy: likedBy.map((like) => like.user),
        action,
      },
      `Post ${action} successfully`
    )
  );
});

const likeComment = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const commentExists = await Comment.exists({ _id: commentId });
  if (!commentExists) {
    throw new ApiError(404, "Comment not found");
  }

  const existingLike = await Like.findOneAndDelete({
    comment: commentId,
    user: userId,
    post: { $exists: false },
  });

  let action = "unliked";

  if (!existingLike) {
    await Like.create({
      comment: commentId,
      user: userId,
    });
    action = "liked";
  }

  const likesCount = await Like.countDocuments({
    comment: commentId,
    post: { $exists: false },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comment: commentId,
        likesCount,
        isLiked: action === "liked",
        action,
      },
      `Comment ${action} successfully`
    )
  );
});

export { likePost, likeComment };
