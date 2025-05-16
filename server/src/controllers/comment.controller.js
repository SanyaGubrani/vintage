import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { postId } = req.params;
  const userId = req.user?._id;
  const { comment } = req.body;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  const post = await Post.exists({ _id: postId });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (!comment || comment.trim() === "") {
    throw new ApiError(400, "No comment to post");
  }

  const newComment = await Comment.create({
    post: postId,
    user: userId,
    comment: comment.trim(),
  });

  await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

  await newComment.populate("user", "username profile_picture");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        newComment,
      },
      "Comment posted successfully"
    )
  );
});

const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  // Check post existence
  const post = await Post.exists({ _id: postId });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const [comments, totalCount] = await Promise.all([
    Comment.find({
      post: postId,
      parent_comment: null,
    })
      .sort({ createdAt: -1 })
      .populate("user", "username name profile_picture"),

    Comment.countDocuments({ post: postId }), 
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments, totalCount },
        "Comments retrieved successfully"
      )
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { commentId } = req.params;

  // Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own comments");
  }

  const postId = comment.post;

  await Comment.deleteOne({ _id: commentId });

  await Post.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { addComment, getPostComments, deleteComment };
