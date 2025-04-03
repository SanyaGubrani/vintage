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

const replyToComment = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { commentId } = req.params;
  const { comment } = req.body;
  const userId = req.user._id;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  // Find the parent comment
  const parentComment = await Comment.findById(commentId);
  if (!parentComment) {
    throw new ApiError(404, "Comment not found");
  }

  if (!comment || comment.trim() === "") {
    throw new ApiError(400, "Reply text is required");
  }

  // Create the reply
  const newReply = await Comment.create({
    post: parentComment.post,
    user: userId,
    comment: comment.trim(),
    parent_comment: commentId,
  });

  await newReply.populate("user", "username profile_picture");

  return res
    .status(201)
    .json(new ApiResponse(201, newReply, "Reply added successfully"));
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

    Comment.countDocuments({ post: postId }), // Count ALL comments for this post
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

const getCommentReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  // Check comment existence
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Get replies and count
  const [replies, repliesCount] = await Promise.all([
    Comment.find({ parent_comment: commentId })
      .sort({ createdAt: -1 })
      .populate("user", "username profile_picture"),

    Comment.countDocuments({ parent_comment: commentId }),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { replies, repliesCount },
        "Replies retrieved successfully"
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

  // Check ownership
  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own comments");
  }

  // Delete the comment and its replies
  await Comment.deleteMany({
    $or: [{ _id: commentId }, { parent_comment: commentId }],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

const deleteReply = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { replyId } = req.params;

  if (!replyId) {
    throw new ApiError(400, "Reply ID is required");
  }

  // Find the reply
  const reply = await Comment.findById(replyId);
  if (!reply) {
    throw new ApiError(404, "Reply not found");
  }

  // Check if it's actually a reply (has parent_comment)
  if (!reply.parent_comment) {
    throw new ApiError(400, "The specified comment is not a reply");
  }

  // Check ownership
  if (reply.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own replies");
  }

  await Comment.deleteOne({ _id: replyId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Reply deleted successfully"));
});

export {
  addComment,
  replyToComment,
  getPostComments,
  getCommentReplies,
  deleteComment,
  deleteReply,
};
